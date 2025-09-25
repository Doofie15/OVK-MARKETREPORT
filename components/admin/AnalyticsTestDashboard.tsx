import React from 'react';

const AnalyticsTestDashboard: React.FC = () => {
  console.log('📊 AnalyticsTestDashboard rendering...');
  console.log('🔍 Current location:', window.location.href);
  console.log('🔍 Current pathname:', window.location.pathname);
  
  // Add a useEffect to track any route changes
  React.useEffect(() => {
    console.log('🔄 AnalyticsTestDashboard mounted');
    return () => {
      console.log('🔄 AnalyticsTestDashboard unmounting');
    };
  }, []);
  
  return (
    <div className="p-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-green-800 mb-4">
          ✅ Analytics Test Dashboard
        </h1>
        <p className="text-green-700 mb-4">
          If you can see this page, the routing is working correctly!
        </p>
        <div className="bg-white rounded-lg p-4 border border-green-300">
          <h3 className="font-semibold text-green-800 mb-2">Debug Info:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✅ Route: /admin/analytics</li>
            <li>✅ Component: AnalyticsTestDashboard</li>
            <li>✅ Authentication: Working</li>
            <li>✅ Render time: {new Date().toLocaleTimeString()}</li>
          </ul>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
          <p className="text-blue-700 text-sm">
            Once this test page loads successfully, we can switch back to the full AnalyticsDashboard component.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTestDashboard;
