import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface SimpleAnalyticsData {
  totalSessions: number;
  totalEvents: number;
  topPages: Array<{ path: string; count: number }>;
  recentEvents: Array<{ type: string; path: string; created_at: string }>;
  setupComplete: boolean;
}

const SimpleAnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<SimpleAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<'checking' | 'ready' | 'needs_setup'>('checking');

  const checkDatabaseStatus = async () => {
    try {
      // Check if analytics tables exist
      const { data: tables, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .like('table_name', 'analytics_%');

      if (tableError) {
        console.log('Database check error:', tableError);
        setDatabaseStatus('needs_setup');
        return false;
      }

      const hasAnalyticsTables = tables && tables.length >= 2; // Should have at least session and event tables
      
      if (hasAnalyticsTables) {
        setDatabaseStatus('ready');
        return true;
      } else {
        setDatabaseStatus('needs_setup');
        return false;
      }
    } catch (e) {
      console.log('Database status check failed:', e);
      setDatabaseStatus('needs_setup');
      return false;
    }
  };

  const fetchBasicAnalytics = async () => {
    try {
      setError(null);

      // Try basic queries first
      const [sessionsResult, eventsResult, recentEventsResult] = await Promise.all([
        supabase.from('analytics_session').select('session_id', { count: 'exact', head: true }),
        supabase.from('analytics_event').select('id', { count: 'exact', head: true }),
        supabase.from('analytics_event')
          .select('type, path, created_at')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      // Get top pages
      const { data: topPagesData } = await supabase
        .from('analytics_event')
        .select('path')
        .eq('type', 'pageview')
        .order('created_at', { ascending: false })
        .limit(100);

      // Count page views
      const topPages = topPagesData?.reduce((acc: any[], event) => {
        const existing = acc.find(p => p.path === event.path);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ path: event.path, count: 1 });
        }
        return acc;
      }, []).sort((a, b) => b.count - a.count).slice(0, 10) || [];

      setData({
        totalSessions: sessionsResult.count || 0,
        totalEvents: eventsResult.count || 0,
        topPages,
        recentEvents: recentEventsResult.data || [],
        setupComplete: true
      });

    } catch (e: any) {
      console.error('Analytics fetch error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeAnalytics = async () => {
    const dbReady = await checkDatabaseStatus();
    
    if (dbReady) {
      await fetchBasicAnalytics();
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">
              {databaseStatus === 'checking' ? 'Checking analytics setup...' : 'Loading analytics data...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (databaseStatus === 'needs_setup') {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5C3.312 18.333 4.772 20 6.314 20z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Database Setup Required</h3>
            <p className="text-gray-600 mb-6">
              The analytics system needs to be set up in your Supabase database. 
              The migration files have been created and need to be applied.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-blue-800 mb-2">Setup Instructions:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Go to your Supabase project dashboard</li>
                <li>2. Navigate to the SQL Editor</li>
                <li>3. Run the migration files in order:</li>
                <li className="ml-4">• <code className="bg-blue-100 px-1 rounded">20250925000001_create_analytics_tables.sql</code></li>
                <li className="ml-4">• <code className="bg-blue-100 px-1 rounded">20250925000002_create_analytics_views.sql</code></li>
                <li className="ml-4">• <code className="bg-blue-100 px-1 rounded">20250925000003_create_auction_analytics_views.sql</code></li>
              </ol>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-gray-800 mb-2">Migration Files Location:</h4>
              <p className="text-sm text-gray-600 font-mono">
                supabase/migrations/
              </p>
            </div>

            <button
              onClick={initializeAnalytics}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Check Setup Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5C3.312 18.333 4.772 20 6.314 20z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Analytics Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={initializeAnalytics}
                className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">📊 Analytics Dashboard</h1>
        <p className="text-blue-100">Track visitor engagement and auction performance</p>
      </div>

      {/* Basic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{data?.totalSessions.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{data?.totalEvents.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Pages</p>
              <p className="text-2xl font-semibold text-gray-900">{data?.topPages.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className="text-2xl font-semibold text-green-600">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {data?.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{page.path}</p>
                </div>
                <div className="ml-4 text-sm text-gray-500">
                  {page.count} views
                </div>
              </div>
            ))}
            {(!data?.topPages || data.topPages.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No page data available yet</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {data?.recentEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{event.type}</p>
                  <p className="text-gray-500 truncate">{event.path}</p>
                </div>
                <div className="ml-4 text-xs text-gray-400">
                  {new Date(event.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {(!data?.recentEvents || data.recentEvents.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Setup Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Analytics System Online</h3>
            <p className="text-sm text-green-700 mt-1">
              Basic analytics tracking is working. More advanced features will be available once all migration views are applied.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAnalyticsDashboard;
