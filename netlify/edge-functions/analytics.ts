import { Context } from "https://edge.netlify.com/";

// Netlify Edge Function for analytics ingestion
// This provides better performance and uses Netlify's geo headers directly

interface AnalyticsPayload {
  session_id: string;
  type: string;
  path: string;
  page_title?: string;
  referrer?: string;
  ua: string;
  lang?: string;
  tz?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  screen_w?: number;
  screen_h?: number;
  duration_ms?: number;
  meta?: Record<string, any>;
}

const SUPABASE_URL = "https://gymdertakhxjmfrmcqgp.supabase.co";
const ALLOWED_ORIGINS = [
  "https://woolmarketreport.netlify.app",
  "https://www.woolmarketreport.netlify.app", 
  "https://main--woolmarketreport.netlify.app", // Branch deploys
  "http://localhost:5173",
  "http://localhost:4173"
];

// Bot detection
const isBot = (ua: string): boolean => 
  /bot|crawler|spider|crawling|headless|lighthouse|render|phantom|puppeteer|chrome-lighthouse|gtmetrix|pingdom|pagespeed/i.test(ua || "");

// Generate daily rotating IP hash for privacy (POPIA compliance)
async function dailyIpHash(ip: string, salt: string): Promise<string | null> {
  if (!ip) return null;
  const dateKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const combined = ip + salt + dateKey;
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Derive traffic channel from referrer and UTM
function deriveChannel(referrer?: string | null, utm?: any): string {
  const medium = utm?.medium?.toLowerCase?.();
  const source = utm?.source?.toLowerCase?.();
  const ref = (referrer || "").toLowerCase();

  if (["cpc", "ppc", "ads"].includes(medium)) return "Paid";
  if (!ref || ref === "") return "Direct";
  if (ref.includes("facebook") || ref.includes("instagram") || ref.includes("twitter") || ref.includes("t.co") || ref.includes("linkedin")) return "Social";
  if (ref.includes("google.")) return "Organic";
  if (source === "email" || medium === "email") return "Email";
  return "Referral";
}

export default async (request: Request, context: Context) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // CORS check
  const origin = request.headers.get("origin") ?? "";
  const isDevelopment = context.site?.url?.includes("localhost") || origin.includes("localhost");
  
  if (!ALLOWED_ORIGINS.includes(origin) && !isDevelopment) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    // Parse request body
    const body: AnalyticsPayload = await request.json();
    
    if (!body || typeof body !== "object" || !body.session_id) {
      return new Response("Bad Request", { status: 400 });
    }

    const ua: string = (body.ua ?? "").slice(0, 200);
    
    // Bot filtering
    if (isBot(ua)) {
      return new Response("OK", { status: 204 }); // No content for bots
    }

    // Extract geo data from Netlify headers (much richer than Supabase)
    const country = context.geo?.country?.code ?? null;
    const region = context.geo?.subdivision?.code ?? null;
    const city = context.geo?.city ?? null;
    const timezone = context.geo?.timezone ?? null;
    
    // Get client IP for hashing (POPIA compliant)
    const clientIp = context.ip ?? "";
    const ipSalt = Deno.env.get("IP_SALT") || "default-salt-change-me";
    const ipHash = await dailyIpHash(clientIp, ipSalt);

    // Check for internal traffic
    const isInternal = body.path?.includes("/admin") || 
                      clientIp.startsWith("192.168.") || 
                      clientIp.startsWith("10.") ||
                      clientIp.startsWith("172.16.");

    // Derive channel
    const channel = deriveChannel(body.referrer, body.utm);

    // Prepare data for Supabase
    const sessionData = {
      session_id: body.session_id,
      ua,
      lang: body.lang ?? null,
      tz: body.tz ?? timezone,
      ip_hash: ipHash,
      country,
      region,
      city,
      is_internal: isInternal,
      last_seen: new Date().toISOString()
    };

    const eventData = {
      session_id: body.session_id,
      type: body.type ?? "pageview",
      path: body.path ?? "/",
      page_title: body.page_title ?? null,
      referrer: body.referrer ?? null,
      utm: body.utm ?? null,
      channel,
      screen_w: body.screen_w ?? null,
      screen_h: body.screen_h ?? null,
      duration_ms: body.duration_ms ?? null,
      meta: {
        ...body.meta,
        netlify_deploy_context: context.deploy?.context,
        netlify_deploy_id: context.deploy?.id,
        user_agent_data: {
          mobile: /mobile/i.test(ua),
          platform: /windows/i.test(ua) ? 'Windows' : 
                   /macintosh/i.test(ua) ? 'macOS' : 
                   /linux/i.test(ua) ? 'Linux' : 'Unknown'
        }
      }
    };

    // Send to Supabase using service role key
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseServiceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
      return new Response("Configuration Error", { status: 500 });
    }

    // Upsert session
    const sessionResponse = await fetch(`${SUPABASE_URL}/rest/v1/analytics_session`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify(sessionData)
    });

    if (!sessionResponse.ok) {
      console.error("Session upsert failed:", await sessionResponse.text());
    }

    // Insert event
    const eventResponse = await fetch(`${SUPABASE_URL}/rest/v1/analytics_event`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(eventData)
    });

    if (!eventResponse.ok) {
      console.error("Event insert failed:", await eventResponse.text());
      return new Response("Database Error", { status: 500 });
    }

    return new Response("OK", { 
      status: 200, 
      headers: { 
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type"
      } 
    });

  } catch (error) {
    console.error("Analytics Edge Function error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
