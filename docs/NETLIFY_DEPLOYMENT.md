# 🚀 Netlify Deployment Guide for OVK Analytics

This guide covers deploying your wool market analytics platform to Netlify with optimal performance and geo-analytics features.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables in Netlify Dashboard
Set these in your Netlify site settings under **Environment Variables**:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://gymdertakhxjmfrmcqgp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD3wWF2a8TwWnXG7W_8ALtydF1si4JCpOY

# Analytics Configuration
VITE_ANALYTICS_ENDPOINT=/api/analytics
IP_SALT=your-unique-salt-for-ip-hashing-change-this

# App Configuration
VITE_APP_ENV=production
VITE_APP_NAME=OVK Wool Market Report
VITE_NETLIFY_OPTIMIZED=true
```

### 2. Build Settings in Netlify
- **Build command**: `npm run build:netlify`
- **Publish directory**: `dist`
- **Node version**: `18` (set in Environment Variables as `NODE_VERSION=18`)

## 🎯 Netlify-Specific Optimizations Implemented

### 📍 **Enhanced Geo-Location**
- **Netlify Edge Function** (`/netlify/edge-functions/analytics.ts`) uses Netlify's rich geo headers
- **Superior geo data** compared to Supabase Edge Functions:
  - Country, region, city from `context.geo`
  - Timezone detection
  - ISP and connection type (if available)

### 🚀 **Performance Optimizations**
- **CDN Edge Analytics**: Analytics requests processed at edge locations
- **Offline Queuing**: Service worker queues analytics when offline
- **Smart Caching**: Static assets cached for 1 year, analytics for 1 day
- **Compression**: Automatic Brotli/Gzip compression

### 🛡️ **Security & Privacy**
- **CSP Headers**: Content Security Policy for Google Maps and Supabase
- **CORS Protection**: Strict origin validation
- **IP Privacy**: Daily rotating SHA-256 hashes (POPIA compliant)
- **Bot Filtering**: Advanced user agent detection

### 📊 **Analytics Features**
- **Real-time Processing**: Sub-100ms analytics ingestion
- **Geo Intelligence**: Provincial tracking for South Africa
- **Auction Engagement**: Deep tracking of user interactions
- **PWA Analytics**: Installation and usage patterns

## 🔧 Deployment Process

### 1. **Initial Setup**
```bash
# Clone your repository to Netlify
# Connect your GitHub/GitLab repository in Netlify dashboard

# Or deploy directly
npm run build:netlify
netlify deploy --prod --dir=dist
```

### 2. **Enable Edge Functions**
In your Netlify dashboard:
1. Go to **Functions** tab
2. Enable **Edge Functions**
3. The `analytics.ts` edge function will auto-deploy

### 3. **Configure Domains**
```bash
# Add your custom domain in Netlify dashboard
# Update ALLOWED_ORIGINS in netlify/edge-functions/analytics.ts
const ALLOWED_ORIGINS = [
  "https://woolmarketreport.netlify.app",
  "https://your-custom-domain.com",
  "https://www.your-custom-domain.com"
];
```

### 4. **SSL & HTTPS**
- Netlify provides automatic SSL certificates
- Force HTTPS redirects are enabled in `netlify.toml`

## 📈 Performance Benefits

### **Before (Supabase Only)**
- ❌ Limited geo data (basic country/region)
- ❌ Cold starts on serverless functions
- ❌ Single-region processing
- ❌ Basic caching

### **After (Netlify Optimized)**
- ✅ Rich geo data (country, region, city, timezone)
- ✅ Edge processing (sub-100ms response times)
- ✅ Global edge network (275+ locations)
- ✅ Advanced caching strategies
- ✅ Offline analytics queuing
- ✅ Background sync

## 🗺️ Geographic Analytics Features

### **World Map Integration**
```typescript
// Automatic geo-enrichment from Netlify Edge
const geoData = {
  country: context.geo?.country?.code,
  region: context.geo?.subdivision?.code,
  city: context.geo?.city,
  timezone: context.geo?.timezone
};
```

### **South Africa Provincial Tracking**
- Western Cape, Gauteng, KwaZulu-Natal regional breakdown
- Wool farming region insights
- Producer location analytics

## 🚦 Monitoring & Analytics

### **Real-time Dashboard**
Access your analytics at: `https://your-site.netlify.app/admin/analytics`

**Three Main Tabs:**
1. **Overview**: General website analytics
2. **Geography**: Interactive world and SA maps
3. **Auction Engagement**: Deep auction interaction analytics

### **Key Metrics Tracked**
- **Geographic Distribution**: Where your users are located
- **Auction Performance**: Which reports engage users most
- **Section Analytics**: What content sections get attention
- **Export Behavior**: PDF downloads, data exports
- **User Flow**: How users navigate through auctions

## 🛠️ Advanced Configuration

### **Custom Analytics Events**
```typescript
import { trackAuctionSectionView, trackAuctionDataClick } from './lib/analytics-helpers';

// Track section engagement
trackAuctionSectionView('auction-123', 'top-performers', 15000);

// Track data interactions
trackAuctionDataClick('auction-123', 'producer', 'Farm ABC');
```

### **Branch Deployments**
- **Staging**: `https://staging--woolmarketreport.netlify.app`
- **Feature branches**: `https://feature-branch--woolmarketreport.netlify.app`
- Each branch gets separate analytics tracking

## 📱 PWA & Mobile Optimization

### **Progressive Web App**
- Service worker caching for offline analytics
- Add to home screen tracking
- Mobile-optimized dashboard

### **Mobile Analytics**
- Device type detection (mobile/tablet/desktop)
- Screen size analytics
- Touch interaction tracking

## 🔍 Debugging & Testing

### **Local Testing**
```bash
# Test with Netlify CLI
npm install -g netlify-cli
netlify dev

# Test edge functions locally
netlify functions:serve
```

### **Analytics Testing**
- Open browser dev tools
- Navigate to `/admin/analytics`
- Check Network tab for analytics calls to `/api/analytics`
- Verify geo data in map displays

## 🚨 Troubleshooting

### **Common Issues**

**1. Maps not loading**
- Check `VITE_GOOGLE_MAPS_API_KEY` is set in Netlify environment
- Verify API key has Maps JavaScript API enabled
- Check browser console for API errors

**2. Analytics not tracking**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Netlify environment
- Check Supabase database permissions
- Monitor edge function logs in Netlify dashboard

**3. Build failures**
- Ensure Node version is 18+ in Netlify settings
- Check for TypeScript errors in build logs
- Verify all dependencies are in package.json

### **Support**
- **Netlify Logs**: Check function logs in Netlify dashboard
- **Supabase Logs**: Monitor in Supabase dashboard
- **Browser Console**: Check for client-side errors

---

## 🎉 You're All Set!

Your wool market analytics platform is now optimized for Netlify with:
- ⚡ Lightning-fast edge analytics
- 🌍 Rich geographical insights
- 📊 Deep auction engagement tracking
- 🛡️ Privacy-compliant data collection
- 📱 Mobile-optimized experience

Visit your analytics dashboard to start getting insights into your wool market audience! 🚀
