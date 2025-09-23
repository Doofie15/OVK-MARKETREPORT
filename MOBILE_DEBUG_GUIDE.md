# Mobile White Screen Debug Guide

## Quick Debugging Steps

### 1. Enable Debug Mode
Add `?debug=true` to your URL to enable the mobile debugger:
```
https://your-netlify-site.netlify.app/?debug=true
```

This will show a 🐛 button in the top-right corner with detailed device and error information.

### 2. Check Browser Console
Open your mobile browser's developer tools:
- **Chrome Mobile**: Menu → More Tools → Developer Tools
- **Safari Mobile**: Settings → Safari → Advanced → Web Inspector
- **Firefox Mobile**: Menu → Settings → Developer Tools

Look for JavaScript errors, network failures, or Supabase connection issues.

### 3. Common Issues & Solutions

#### Issue: Supabase Environment Variables Missing
**Symptoms**: White screen, no data loading
**Solution**: Ensure environment variables are set in Netlify:
```bash
VITE_SUPABASE_URL=https://gymdertakhxjmfrmcqgp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Issue: React Import Map Failures
**Symptoms**: "Failed to resolve module" errors
**Solution**: The app uses CDN imports which might fail on some mobile networks. Check if the CDN is accessible.

#### Issue: Mobile Layout Component Crashes
**Symptoms**: White screen only on mobile, works on desktop
**Solution**: The app now uses `SafeMobileLayout` with error boundaries. Check the debug panel for specific errors.

#### Issue: CSS Loading Problems
**Symptoms**: Unstyled content, layout issues
**Solution**: Check if Tailwind CSS is loading properly. The app includes fallback styles.

#### Issue: Memory Issues on Low-End Devices
**Symptoms**: App crashes after loading, performance issues
**Solution**: The app uses progressive loading to reduce initial memory usage.

### 4. Network Issues
Check if these resources are loading:
- Supabase API calls
- Tailwind CSS from CDN
- React/ReactDOM from CDN
- Font files from Google Fonts

### 5. Device-Specific Issues

#### Samsung Devices
The app includes Samsung S25-specific optimizations. If you're on a Samsung device, check if the device detection is working correctly in the debug panel.

#### iOS Safari
Safari has stricter security policies. Check for:
- Mixed content warnings (HTTP vs HTTPS)
- Cookie/localStorage restrictions
- Service worker registration failures

#### Android Chrome
Check for:
- Memory pressure warnings
- Network connection type restrictions
- Touch event handling issues

### 6. Fallback Strategies

The app includes several fallback mechanisms:

1. **Error Boundaries**: Catch React component errors and show user-friendly messages
2. **Safe Mobile Layout**: Falls back to desktop layout if mobile components fail
3. **Mock Data**: Shows sample data if Supabase connection fails
4. **Progressive Loading**: Loads latest report first, then others in background

### 7. Manual Testing Steps

1. **Clear Browser Cache**: Force refresh (Ctrl+F5 or Cmd+Shift+R)
2. **Test in Incognito/Private Mode**: Rules out extension conflicts
3. **Test Different Networks**: Try WiFi vs mobile data
4. **Test Different Browsers**: Chrome, Safari, Firefox
5. **Check Device Storage**: Ensure sufficient storage for caching

### 8. Netlify-Specific Debugging

#### Check Build Logs
Look for build errors in Netlify dashboard:
- TypeScript compilation errors
- Missing dependencies
- Environment variable issues

#### Check Function Logs
If using Netlify Functions:
- Check function execution logs
- Verify API endpoints are working
- Test CORS configuration

#### Check Redirects/Rewrites
Ensure `_redirects` file is configured for SPA routing:
```
/*    /index.html   200
```

### 9. Performance Monitoring

The debug panel shows:
- Memory usage
- Network connection type
- Device capabilities
- Error counts

Monitor these metrics to identify performance bottlenecks.

### 10. Emergency Fixes

If the site is completely broken:

1. **Revert to Last Working Deployment**: Use Netlify's deployment history
2. **Deploy with Mock Data Only**: Temporarily disable Supabase integration
3. **Enable Maintenance Mode**: Show a maintenance page while debugging

### Contact Information

If you continue experiencing issues:
1. Enable debug mode and screenshot the debug panel
2. Check browser console for errors
3. Note your device type, browser, and network connection
4. Provide the exact steps to reproduce the issue

## Code Changes Made

### New Components Added:
- `ErrorBoundary.tsx`: Catches and displays React errors
- `MobileDebugger.tsx`: Shows detailed debug information
- `SafeMobileLayout.tsx`: Safer mobile layout with error handling

### Enhanced Components:
- `App.tsx`: Added error boundaries around all routes
- `index.html`: Added mobile optimization meta tags and loading indicators
- `PublicLayout.tsx`: Uses SafeMobileLayout for critical components

### Environment Configuration:
- `.env.example`: Template for required environment variables
- Enhanced Supabase error handling in data services
