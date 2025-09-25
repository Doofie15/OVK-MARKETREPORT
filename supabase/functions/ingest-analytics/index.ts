import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";

// Allowed origins for CORS - update with your domain
const ALLOW_ORIGINS = [
  "https://woolmarketreport.netlify.app", // Your production domain
  "https://www.woolmarketreport.netlify.app",
  "http://localhost:5173", // Development
  "http://localhost:4173", // Preview
  "http://127.0.0.1:5173",
  "http://192.168.1.100:5173", // Network testing
  "*" // Allow all origins during development - remove in production
];

// Bot detection regex
const isBot = (ua: string) => 
  /bot|crawler|spider|crawling|headless|lighthouse|render|phantom|puppeteer|chrome-lighthouse|gtmetrix|pingdom|pagespeed/i.test(ua || "");

// Generate daily rotating IP hash for privacy
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

// Extract first IP from forwarded headers
function extractClientIp(req: Request): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }
  
  return "";
}

// Extract geo data from CDN headers
function extractGeoData(req: Request) {
  // Cloudflare geo headers
  const country = req.headers.get("cf-ipcountry");
  const city = req.headers.get("cf-ipcity");
  const region = req.headers.get("cf-region");
  
  // Vercel geo headers
  const vercelCountry = req.headers.get("x-vercel-ip-country");
  const vercelRegion = req.headers.get("x-vercel-ip-country-region");
  const vercelCity = req.headers.get("x-vercel-ip-city");
  
  // Netlify geo headers
  const netlifyCountry = req.headers.get("x-nf-geo");
  let netlifyData = null;
  try {
    if (netlifyCountry) {
      netlifyData = JSON.parse(netlifyCountry);
    }
  } catch (e) {
    // Ignore parsing errors
  }
  
  return {
    country: country || vercelCountry || netlifyData?.country?.code || null,
    region: region || vercelRegion || netlifyData?.subdivision?.code || null,
    city: city || vercelCity || netlifyData?.city || null,
  };
}

// Derive traffic channel from referrer and UTM params
function deriveChannel(referrer?: string | null, utm?: any): string {
  const medium = utm?.medium?.toLowerCase?.();
  const source = utm?.source?.toLowerCase?.();
  const ref = (referrer || "").toLowerCase();
  
  // Paid traffic
  if (["cpc", "ppc", "ads", "paid"].includes(medium)) return "Paid";
  
  // Email campaigns
  if (source === "email" || medium === "email") return "Email";
  
  // Direct traffic (no referrer)
  if (!ref || ref === "") return "Direct";
  
  // Social media
  if (ref.includes("facebook") || ref.includes("fb.com") || 
      ref.includes("instagram") || ref.includes("twitter") || 
      ref.includes("t.co") || ref.includes("linkedin") ||
      ref.includes("youtube") || ref.includes("tiktok")) {
    return "Social";
  }
  
  // Search engines
  if (ref.includes("google.") || ref.includes("bing.") || 
      ref.includes("yahoo.") || ref.includes("duckduckgo.") ||
      ref.includes("baidu.")) {
    return "Organic";
  }
  
  // Everything else is referral
  return "Referral";
}

// Rate limiting helper (simple in-memory store)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(identifier: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const key = identifier;
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (current.count >= maxRequests) {
    return true;
  }
  
  current.count++;
  return false;
}

serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "content-type, authorization",
          "access-control-max-age": "86400",
        },
      });
    }

    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // Check origin
    const origin = req.headers.get("origin") ?? "";
    if (!ALLOW_ORIGINS.includes(origin)) {
      console.log(`Blocked origin: ${origin}`);
      return new Response("Forbidden", { status: 403 });
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response("Invalid JSON", { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return new Response("Invalid request body", { status: 400 });
    }

    // Extract user agent and check for bots
    const userAgent = (body.ua ?? "").slice(0, 500);
    if (isBot(userAgent)) {
      return new Response("ok", { 
        status: 204,
        headers: { 
          "cache-control": "no-store",
          "access-control-allow-origin": origin 
        }
      });
    }

    // Rate limiting
    const clientIp = extractClientIp(req);
    if (isRateLimited(clientIp, 200, 60000)) { // 200 requests per minute per IP
      return new Response("Rate Limited", { status: 429 });
    }

    // Validate required fields
    const sessionId = body.session_id;
    if (!sessionId || typeof sessionId !== "string") {
      return new Response("Missing session_id", { status: 400 });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response("Server configuration error", { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Extract geo and IP data
    const geoData = extractGeoData(req);
    const ipSalt = Deno.env.get("IP_SALT") || "default-salt-change-me";
    const ipHash = await dailyIpHash(clientIp, ipSalt);

    // Check for internal traffic (you can customize this logic)
    const isInternal = body.path?.includes("/admin") || 
                      clientIp.startsWith("192.168.") || 
                      clientIp.startsWith("10.") ||
                      body.utm?.source === "internal";

    // Upsert session
    try {
      await supabase.from("analytics_session").upsert({
        session_id: sessionId,
        ua: userAgent,
        lang: body.lang ?? null,
        tz: body.tz ?? null,
        ip_hash: ipHash,
        country: geoData.country,
        region: geoData.region,
        city: geoData.city,
        is_internal: isInternal,
        last_seen: new Date().toISOString()
      }, { 
        onConflict: "session_id",
        ignoreDuplicates: false 
      });
    } catch (error) {
      console.error("Error upserting session:", error);
      return new Response("Database error", { status: 500 });
    }

    // Derive channel from referrer and UTM
    const channel = deriveChannel(body.referrer, body.utm);

    // Prepare event data
    const eventData = {
      session_id: sessionId,
      type: body.type ?? "pageview",
      path: body.path ?? "/",
      page_title: body.page_title ?? null,
      referrer: body.referrer ?? null,
      utm: body.utm ?? null,
      channel,
      screen_w: body.screen_w ?? null,
      screen_h: body.screen_h ?? null,
      duration_ms: body.duration_ms ?? null,
      meta: body.meta ?? {}
    };

    // Insert event
    try {
      await supabase.from("analytics_event").insert(eventData);
    } catch (error) {
      console.error("Error inserting event:", error);
      return new Response("Database error", { status: 500 });
    }

    // Success response
    return new Response("ok", { 
      status: 200, 
      headers: { 
        "cache-control": "no-store",
        "access-control-allow-origin": origin
      } 
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
