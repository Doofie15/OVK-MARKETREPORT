import React from 'react';

const MinimalAnalytics: React.FC = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f9ff', minHeight: '100vh' }}>
      <h1 style={{ color: '#1e40af', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
        🎯 MINIMAL ANALYTICS TEST
      </h1>
      <p style={{ color: '#1e40af', fontSize: '16px', marginBottom: '16px' }}>
        If you can see this page without redirects, the routing infrastructure works.
      </p>
      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #93c5fd' }}>
        <h2 style={{ color: '#1e40af', fontSize: '18px', marginBottom: '8px' }}>Success Indicators:</h2>
        <ul style={{ color: '#1e40af', fontSize: '14px' }}>
          <li>✅ Page loads without redirect</li>
          <li>✅ URL stays on /admin/analytics</li>
          <li>✅ No console errors related to routing</li>
          <li>✅ Component renders completely</li>
        </ul>
      </div>
      <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
        <p style={{ color: '#1e40af', fontSize: '14px' }}>
          Current URL: {window.location.href}<br/>
          Pathname: {window.location.pathname}<br/>
          Time: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default MinimalAnalytics;
