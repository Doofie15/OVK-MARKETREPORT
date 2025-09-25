import React, { useState, useEffect } from 'react';
import { supabaseClient } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const AnalyticsAuthTest: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runAuthTests();
  }, [user]);

  const runAuthTests = async () => {
    if (!user) {
      setError('No user found');
      setLoading(false);
      return;
    }

    const results: any = {
      user_id: user.id,
      user_email: user.email,
      timestamp: new Date().toISOString()
    };

    try {
      // Test 1: Basic user info
      console.log('🔍 Testing user authentication...');
      results.user_info = {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      };

      // Test 2: Check if user exists in custom users table
      console.log('🔍 Testing custom user lookup...');
      const { data: customUser, error: customUserError } = await supabaseClient
        .from('users')
        .select('id, name, email, approval_status, user_type_id')
        .eq('id', user.id)
        .single();

      results.custom_user = {
        found: !!customUser,
        data: customUser,
        error: customUserError?.message
      };

      // Test 3: Check user type and permissions
      if (customUser && (customUser as any).user_type_id) {
        console.log('🔍 Testing user type and permissions...');
        const { data: userType, error: userTypeError } = await supabaseClient
          .from('user_types')
          .select('id, name, permissions')
          .eq('id', (customUser as any).user_type_id)
          .single();

        results.user_type = {
          found: !!userType,
          data: userType,
          error: userTypeError?.message,
          has_analytics_access: (userType && ((userType as any).name === 'super_admin' || (userType as any).name === 'admin'))
        };
      }

      // Test 4: Try to access analytics tables
      console.log('🔍 Testing analytics table access...');
      const { data: sessionCount, error: sessionError } = await supabaseClient
        .from('analytics_session')
        .select('session_id', { count: 'exact', head: true });

      results.analytics_access = {
        sessions_accessible: !sessionError,
        session_count: sessionCount,
        error: sessionError?.message
      };

      // Test 5: Try to access analytics views
      console.log('🔍 Testing analytics views access...');
      const { data: activeUsers, error: viewError } = await supabaseClient
        .from('v_active_users_5m')
        .select('*')
        .single();

      results.analytics_views = {
        views_accessible: !viewError,
        data: activeUsers,
        error: viewError?.message
      };

      // Test 6: Check current auth context
      console.log('🔍 Testing auth context...');
      const { data: authTest, error: authError } = await supabaseClient
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      results.auth_context = {
        current_user_id: (authTest && (authTest as any).id) ? (authTest as any).id : user.id,
        error: authError?.message
      };

    } catch (e: any) {
      results.general_error = e.message;
      setError(e.message);
    }

    setTestResults(results);
    setLoading(false);
    console.log('📊 Auth test results:', results);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Running authentication tests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg shadow-sm p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">🔐 Analytics Authentication Test</h1>
        <p className="text-red-100">Diagnosing authentication and permission issues</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">General Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 User Information</h3>
          <div className="space-y-2 text-sm">
            <div><strong>ID:</strong> {testResults.user_id}</div>
            <div><strong>Email:</strong> {testResults.user_email}</div>
            <div><strong>Timestamp:</strong> {testResults.timestamp}</div>
          </div>
        </div>

        {/* Custom User */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🗂️ Custom User Table</h3>
          {testResults.custom_user?.found ? (
            <div className="space-y-2 text-sm">
              <div className="text-green-600">✅ User found in custom table</div>
              <div><strong>Name:</strong> {testResults.custom_user.data?.name}</div>
              <div><strong>Status:</strong> {testResults.custom_user.data?.approval_status}</div>
            </div>
          ) : (
            <div className="text-red-600">❌ User not found: {testResults.custom_user?.error}</div>
          )}
        </div>

        {/* User Type */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔑 User Type & Permissions</h3>
          {testResults.user_type?.found ? (
            <div className="space-y-2 text-sm">
              <div className="text-green-600">✅ User type found</div>
              <div><strong>Type:</strong> {testResults.user_type.data?.name}</div>
              <div><strong>Analytics Access:</strong> 
                <span className={testResults.user_type.has_analytics_access ? 'text-green-600' : 'text-red-600'}>
                  {testResults.user_type.has_analytics_access ? '✅ Yes' : '❌ No'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-red-600">❌ User type not found: {testResults.user_type?.error}</div>
          )}
        </div>

        {/* Analytics Access */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Analytics Table Access</h3>
          {testResults.analytics_access?.sessions_accessible ? (
            <div className="space-y-2 text-sm">
              <div className="text-green-600">✅ Analytics tables accessible</div>
              <div><strong>Sessions:</strong> {testResults.analytics_access.session_count} records</div>
            </div>
          ) : (
            <div className="text-red-600">❌ Analytics tables blocked: {testResults.analytics_access?.error}</div>
          )}
        </div>

        {/* Analytics Views */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Analytics Views Access</h3>
          {testResults.analytics_views?.views_accessible ? (
            <div className="space-y-2 text-sm">
              <div className="text-green-600">✅ Analytics views accessible</div>
              <div><strong>Active Users:</strong> {testResults.analytics_views.data?.active_users || 0}</div>
            </div>
          ) : (
            <div className="text-red-600">❌ Analytics views blocked: {testResults.analytics_views?.error}</div>
          )}
        </div>

        {/* Auth Context */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔐 Auth Context</h3>
          <div className="space-y-2 text-sm">
            <div><strong>Current User ID:</strong> {testResults.auth_context?.current_user_id || 'null'}</div>
            {testResults.auth_context?.error && (
              <div className="text-red-600">Error: {testResults.auth_context.error}</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-semibold mb-2">🔍 Diagnosis</h3>
        <div className="text-blue-700 text-sm space-y-1">
          {testResults.custom_user?.found && testResults.user_type?.has_analytics_access && testResults.analytics_access?.sessions_accessible ? (
            <div>✅ All authentication checks passed - analytics should work</div>
          ) : (
            <div>❌ Authentication issue detected - check the red error messages above</div>
          )}
        </div>
      </div>

      <button
        onClick={runAuthTests}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        🔄 Run Tests Again
      </button>
    </div>
  );
};

export default AnalyticsAuthTest;
