import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../lib/analytics';

/**
 * Component to track route changes in the SPA
 * Place this inside Router but outside Routes
 */
const AnalyticsRouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Track pageview on route change
    analytics.trackPageView();
    
    // Track specific business events based on routes
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    
    // Track report views
    if (path.match(/^\/\d{6}$/)) {
      const reportId = path.substring(1); // Remove leading slash
      analytics.trackReportView(reportId);
    }
    
    // Track admin section visits (for internal analytics)
    if (path.startsWith('/admin/')) {
      const section = path.split('/')[2] || 'dashboard';
      analytics.track('custom', {
        event_name: 'admin_section_visit',
        section: section,
        is_admin: true
      });
    }
    
  }, [location.pathname, location.search]);

  return null; // This component doesn't render anything
};

export default AnalyticsRouteTracker;
