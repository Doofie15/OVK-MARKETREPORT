# OVK Analytics System Setup Guide

## Overview

The OVK Wool Market Report platform now includes a **privacy-friendly, cookieless analytics system** built specifically for this application. It provides GA-style insights while respecting user privacy and complying with POPIA (Protection of Personal Information Act).

## Features

✅ **Cookieless tracking** with localStorage session management  
✅ **Privacy-first** with daily rotating IP hashes  
✅ **SPA-aware** pageview and route tracking  
✅ **Business-specific events** (report views, downloads, bid clicks)  
✅ **Real-time dashboard** with live metrics  
✅ **PWA tracking** (install prompts, usage modes)  
✅ **Section visibility** and engagement metrics  
✅ **POPIA-compliant** with no personal data storage  
✅ **Bot filtering** and rate limiting  
✅ **Admin-only access** with role-based permissions  

## Setup Instructions

### 1. Deploy the Supabase Edge Function

```bash
# Navigate to your project
cd your-project-directory

# Deploy the analytics ingestion function
supabase functions deploy ingest-analytics

# Set environment variables
supabase secrets set IP_SALT="your-random-salt-string-change-this"
```

### 2. Configure Environment Variables

Update your `.env.local` file with:

```env
# Your existing Supabase config
VITE_SUPABASE_URL=https://gymdertakhxjmfrmcqgp.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Required for Edge Function
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
IP_SALT=your-random-salt-string-change-this
```

### 3. Update Allowed Origins

Edit `supabase/functions/ingest-analytics/index.ts` and update the `ALLOW_ORIGINS` array:

```typescript
const ALLOW_ORIGINS = [
  "https://woolmarketreport.netlify.app", // Your production domain
  "https://www.woolmarketreport.netlify.app",
  "http://localhost:5173", // Development
  "http://localhost:4173", // Preview
  // Add your domains here
];
```

### 4. Test the Setup

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Check browser console** for analytics initialization:
   ```
   OVK Analytics initialized { sessionId: "..." }
   ```

3. **Visit admin dashboard** at `/admin/analytics` to see live data

4. **Verify Edge Function** in Supabase dashboard under Functions

## Analytics Dashboard

### Access

The analytics dashboard is available at `/admin/analytics` and requires admin authentication.

### Key Metrics

- **Real-time Active Users** (last 5 minutes)
- **Daily/Weekly/Monthly Active Users**
- **Top Pages** and **User Countries**
- **Traffic Channels** (Direct, Organic, Social, Referral, Paid)
- **Device Breakdown** (Mobile, Tablet, Desktop)
- **PWA Metrics** (installs, usage modes)
- **Section Visibility** and **Time on Page**
- **Business Events** (report views, downloads, bid clicks)

### Real-time Features

- Auto-refresh every 30 seconds (configurable)
- Live event stream
- Current active users
- Recent page views and interactions

## Developer Integration

### Basic Tracking

The analytics system automatically tracks:
- ✅ Page views (including SPA route changes)
- ✅ Time on page (heartbeat every 15s)
- ✅ Scroll depth (25%, 50%, 75%, 100%)
- ✅ PWA install prompts and installations
- ✅ JavaScript errors
- ✅ App launch mode (standalone vs browser)

### Custom Event Tracking

Use the analytics helpers for business-specific tracking:

```typescript
import { useOVKAnalytics } from '../lib/analytics-helpers';

function ReportComponent({ auctionId }) {
  const analytics = useOVKAnalytics();
  
  // Track report view
  useEffect(() => {
    analytics.trackReportView(auctionId);
  }, [auctionId]);
  
  // Track download
  const handleDownload = () => {
    analytics.trackReportDownload(auctionId, 'pdf');
    // ... download logic
  };
  
  // Track producer click
  const handleProducerClick = (producerName) => {
    analytics.trackProducerClick(producerName, auctionId);
  };
}
```

### Section Visibility Tracking

Track how long users spend viewing specific sections:

```typescript
import { useOVKAnalytics } from '../lib/analytics-helpers';

function TopPerformersSection() {
  const analytics = useOVKAnalytics();
  const sectionRef = useRef(null);
  
  useEffect(() => {
    if (sectionRef.current) {
      const cleanup = analytics.trackSectionVisibility(
        'top_performers', 
        sectionRef.current
      );
      return cleanup;
    }
  }, []);
  
  return (
    <div ref={sectionRef} data-section="top_performers">
      {/* Section content */}
    </div>
  );
}
```

### Available Events

**Business Events:**
- `view_report` - Auction report viewed
- `download_report` - Report downloaded
- `bid_click` - Producer/bid clicked
- `broker_click` - Broker performance clicked
- `buyer_click` - Buyer performance clicked
- `chart_interaction` - Chart/graph interacted with
- `filter_change` - Filter applied
- `season_change` - Season navigation
- `auction_change` - Auction navigation
- `province_click` - Provincial data clicked

**Standard Events:**
- `pageview` - Page/route view
- `heartbeat` - Time on page tracking
- `section_view` - Section visibility
- `scroll_depth` - Scroll milestones
- `click` - General clicks
- `pwa_install` - PWA installed
- `pwa_prompt_shown` - Install prompt shown
- `app_launch` - App opened
- `js_error` - JavaScript errors

## Privacy & Security

### POPIA Compliance

✅ **No personal data stored** - Only aggregated metrics  
✅ **Daily rotating IP hashes** - IP addresses never stored raw  
✅ **Cookieless** - Uses localStorage for session management  
✅ **Do Not Track respect** - Honors browser DNT settings  
✅ **Transparent** - Users can see what's tracked  
✅ **Retention limits** - Data automatically ages out  

### Security Features

- **Origin allowlist** - Only your domains can send data
- **Bot filtering** - Automated traffic excluded
- **Rate limiting** - Prevents abuse (200 requests/minute/IP)
- **Admin-only access** - Dashboard requires authentication
- **Service role protection** - Database writes restricted

### Data Retention

- **Events**: 90 days (configurable)
- **Sessions**: 30 days (configurable)
- **Aggregated views**: 1 year
- **Real-time data**: 24 hours

## Production Deployment

### 1. Environment Variables

Set these in your production environment:

```env
VITE_SUPABASE_URL=https://gymdertakhxjmfrmcqgp.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
IP_SALT=your-strong-random-salt
```

### 2. CDN Configuration

**Cloudflare:**
- Geo headers are automatically included
- Enable "IP Geolocation" in network settings

**Netlify:**
- Geo headers enabled by default
- No additional configuration needed

**Vercel:**
- Geo headers included automatically
- Works out of the box

### 3. Performance Optimization

- Analytics requests use `sendBeacon()` for reliability
- Events are batched and sent asynchronously
- Minimal performance impact (<1ms per page)
- Uses existing Supabase infrastructure

## Monitoring & Maintenance

### Health Checks

1. **Edge Function Status**: Check Supabase Functions dashboard
2. **Error Rates**: Monitor function logs for issues
3. **Data Flow**: Verify events appearing in analytics tables
4. **Dashboard Access**: Test admin analytics page regularly

### Common Issues

**No events appearing:**
- Check allowed origins in Edge Function
- Verify environment variables
- Test Edge Function directly
- Check browser console for errors

**Dashboard errors:**
- Verify RLS policies allow admin access
- Check user permissions in user_types table
- Confirm views are properly created

**High error rates:**
- Review bot filtering rules
- Check rate limiting settings
- Monitor function logs in Supabase

### Scaling Considerations

- **10K+ daily users**: Consider materialized view refreshes
- **100K+ daily users**: Implement data archiving
- **Real-time needs**: Add WebSocket notifications
- **Advanced analytics**: Consider data warehouse integration

## Future Enhancements

Planned features for future releases:

🔄 **Cohort Analysis** - User retention tracking  
🔄 **Funnel Analysis** - Multi-step conversion tracking  
🔄 **A/B Testing** - Experiment framework  
🔄 **Custom Dashboards** - User-configurable views  
🔄 **Data Export** - CSV/PDF report generation  
🔄 **Alerting** - Automated threshold notifications  
🔄 **Segmentation** - Advanced user grouping  

## Support

For issues or questions:

1. Check Supabase Functions logs
2. Review browser console errors
3. Verify environment configuration
4. Test with `debug=true` in URL

## API Reference

### Analytics Client

```typescript
import analytics from './lib/analytics';

// Basic tracking
analytics.trackPageView();
analytics.track('custom', { event_name: 'button_click' });

// Business events
analytics.trackReportView('202501');
analytics.trackReportDownload('202501', 'pdf');
analytics.trackBidClick('Producer Name');

// Section visibility
const cleanup = analytics.trackSectionVisibility('section_id', element);

// PWA
await analytics.promptPWAInstall();

// Web Vitals
analytics.trackWebVital('CLS', 0.1, 'good');
```

### Edge Function Endpoint

```http
POST /functions/v1/ingest-analytics
Content-Type: application/json

{
  "session_id": "uuid",
  "type": "pageview",
  "path": "/202501",
  "page_title": "OVK Market Report",
  "referrer": "https://google.com",
  "utm": {
    "source": "email",
    "medium": "newsletter"
  },
  "screen_w": 1920,
  "screen_h": 1080,
  "meta": {
    "auction_id": "202501"
  }
}
```

---

**Congratulations! 🎉**

Your privacy-friendly analytics system is now ready to provide valuable insights while respecting user privacy and complying with data protection regulations.
