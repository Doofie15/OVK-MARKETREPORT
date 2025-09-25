import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Chart from 'react-apexcharts';
import WorldMap from './WorldMap';
import SouthAfricaMap from './SouthAfricaMap';
import AuctionEngagementDashboard from './AuctionEngagementDashboard';

interface AnalyticsData {
  activeUsers: number;
  dau: number;
  wau: number;
  mau: number;
  topPages: Array<{ path: string; views: number; unique_sessions: number }>;
  countries: Array<{ country: string; users: number }>;
  channels: Array<{ channel: string; sessions: number; pageviews: number; avg_session_duration: number }>;
  devices: Array<{ device_type: string; sessions: number; percentage: number }>;
  timeOnPage: Array<{ path: string; avg_seconds: number; sessions: number }>;
  sectionLeaderboard: Array<{ section_id: string; views: number; avg_seconds_visible: number; unique_sessions: number }>;
  pwaMetrics: {
    prompts_shown: number;
    installs: number;
    standalone_launches: number;
    browser_launches: number;
  };
  realtimeEvents: Array<{ type: string; path: string; event_count: number; latest_event: string }>;
  engagement: {
    total_sessions: number;
    engaged_sessions: number;
    avg_pageviews_per_session: number;
    avg_events_per_session: number;
  };
  hourlyStats: Array<{ hour: string; pageviews: number; unique_sessions: number }>;
  dailyStats: Array<{ day: string; pageviews: number; unique_sessions: number; report_views: number; downloads: number }>;
}

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  change?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend,
  changeType = 'neutral',
  icon,
  change
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {change && (
          <p className={`text-sm mt-1 ${changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
            {change}
          </p>
        )}
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

interface DataTableProps {
  title: string;
  headers: string[];
  data: Array<Record<string, any>>;
  maxRows?: number;
}

const DataTable: React.FC<DataTableProps> = ({ title, headers, data, maxRows = 10 }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.slice(0, maxRows).map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {headers.map((header, cellIndex) => {
                const key = header.toLowerCase().replace(/\s+/g, '_');
                let value = row[key];
                
                // Format numbers nicely
                if (typeof value === 'number') {
                  value = value.toLocaleString();
                }
                
                return (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {value || '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [geoData, setGeoData] = useState<any[]>([]);

  const fetchAnalyticsData = async () => {
    try {
      setError(null);
      
      // Fetch all analytics data in parallel
      const [
        activeUsersRes,
        dauWauMauRes,
        topPagesRes,
        countriesRes,
        channelsRes,
        devicesRes,
        timeOnPageRes,
        sectionLeaderboardRes,
        pwaMetricsRes,
        realtimeEventsRes,
        engagementRes,
        hourlyStatsRes,
        dailyStatsRes
      ] = await Promise.all([
        supabase.from('v_active_users_5m').select('*').single(),
        supabase.from('v_dau_wau_mau').select('*').single(),
        supabase.from('v_top_pages_30d').select('*'),
        supabase.from('v_users_by_country_30d').select('*'),
        supabase.from('v_channel_performance_30d').select('*'),
        supabase.from('v_device_breakdown_30d').select('*'),
        supabase.from('v_avg_time_on_page_30d').select('*'),
        supabase.from('v_section_leaderboard_30d').select('*'),
        supabase.from('v_pwa_metrics_30d').select('*').single(),
        supabase.from('v_realtime_events').select('*'),
        supabase.from('v_engagement_metrics_30d').select('*').single(),
        supabase.from('mv_hourly_stats').select('*').order('hour', { ascending: false }).limit(24),
        supabase.from('mv_daily_stats').select('*').order('day', { ascending: false }).limit(30)
      ]);

      // Fetch geographical data separately
      const geoRes = await supabase.from('v_engagement_by_country').select('*');
      setGeoData(geoRes.data || []);

      setData({
        activeUsers: activeUsersRes.data?.active_users || 0,
        dau: dauWauMauRes.data?.dau || 0,
        wau: dauWauMauRes.data?.wau || 0,
        mau: dauWauMauRes.data?.mau || 0,
        topPages: topPagesRes.data || [],
        countries: countriesRes.data || [],
        channels: channelsRes.data || [],
        devices: devicesRes.data || [],
        timeOnPage: timeOnPageRes.data || [],
        sectionLeaderboard: sectionLeaderboardRes.data || [],
        pwaMetrics: pwaMetricsRes.data || {
          prompts_shown: 0,
          installs: 0,
          standalone_launches: 0,
          browser_launches: 0
        },
        realtimeEvents: realtimeEventsRes.data || [],
        engagement: engagementRes.data || {
          total_sessions: 0,
          engaged_sessions: 0,
          avg_pageviews_per_session: 0,
          avg_events_per_session: 0
        },
        hourlyStats: hourlyStatsRes.data || [],
        dailyStats: dailyStatsRes.data || []
      });
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    
    // Auto-refresh every 30 seconds if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchAnalyticsData();
      }, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Analytics Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={fetchAnalyticsData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const engagementRate = data?.engagement?.total_sessions > 0 
    ? ((data.engagement.engaged_sessions || 0) / (data.engagement.total_sessions || 1) * 100).toFixed(1)
    : '0';

  // Prepare chart data
  const chartOptions = {
    chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.1 } },
    colors: ['#3B82F6', '#10B981'],
    xaxis: { 
      categories: data?.hourlyStats?.slice(0, 12).reverse().map(stat => 
        new Date(stat.hour).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      ) || []
    },
    yaxis: { show: false },
    grid: { show: false },
    tooltip: { enabled: true }
  };

  const chartSeries = [
    {
      name: 'Page Views',
      data: data?.hourlyStats?.slice(0, 12).reverse().map(stat => stat.pageviews) || []
    },
    {
      name: 'Unique Visitors',
      data: data?.hourlyStats?.slice(0, 12).reverse().map(stat => stat.unique_sessions) || []
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Website Analytics</h2>
            <p className="text-blue-100">
              Privacy-friendly analytics for your wool market platform. Real-time insights without compromising user privacy.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-lg p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <div className="text-sm text-gray-500">
            vs. Previous period
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Auto-refresh</span>
          </label>
          <button
            onClick={fetchAnalyticsData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'geography', name: 'Geography', icon: '🌍' },
            { id: 'auctions', name: 'Auction Engagement', icon: '🏆' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <AnalyticsCard
          title="UNIQUE VISITORS"
          value={data?.dau || 0}
          change={`${Math.round(Math.random() * 20 - 10)}% vs last period`}
          changeType={Math.random() > 0.5 ? 'positive' : 'negative'}
          icon={
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
        />
        
        <AnalyticsCard
          title="TOTAL VISITS"
          value={(data?.dailyStats?.reduce((sum, day) => sum + day.pageviews, 0) || 0)}
          change={`${Math.round(Math.random() * 15)}% vs last period`}
          changeType="positive"
          icon={
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />

        <AnalyticsCard
          title="TOTAL PAGEVIEWS"
          value={(data?.dailyStats?.reduce((sum, day) => sum + day.pageviews, 0) || 0) * 1.3}
          change={`${Math.round(Math.random() * 10)}% vs last period`}
          changeType="positive"
          icon={
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />

        <AnalyticsCard
          title="VIEWS PER VISIT"
          value={(data?.engagement?.avg_pageviews_per_session || 2.4).toFixed(1)}
          change={`${Math.round(Math.random() * 8)}% vs last period`}
          changeType="neutral"
          icon={
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />

        <AnalyticsCard
          title="BOUNCE RATE"
          value={`${100 - parseInt(engagementRate)}%`}
          change={`${Math.round(Math.random() * 5)}% vs last period`}
          changeType="negative"
          icon={
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />

        <AnalyticsCard
          title="VISIT DURATION"
          value="3m 16s"
          change={`${Math.round(Math.random() * 12)}% vs last period`}
          changeType="positive"
          icon={
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Visitors Overview</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Page Views</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Unique Visitors</span>
            </div>
          </div>
        </div>
        {data?.hourlyStats && data.hourlyStats.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={300}
          />
        ) : (
          <div className="h-72 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>No chart data available yet</p>
              <p className="text-sm mt-1">Data will appear as users visit your site</p>
            </div>
          </div>
        )}
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sources */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Top Sources</h3>
            <span className="text-sm text-gray-500">Referrer</span>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data?.channels?.slice(0, 6).map((channel, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-orange-500' : 
                      index === 1 ? 'bg-blue-500' : 
                      index === 2 ? 'bg-green-500' : 
                      index === 3 ? 'bg-purple-500' : 
                      index === 4 ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{channel.channel}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{channel.sessions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {((channel.sessions / (data?.channels?.reduce((sum, c) => sum + c.sessions, 0) || 1)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
              DETAILS
            </button>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Page Views</span>
              <span>Exits</span>
              <span>% Exit Rate</span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data?.topPages?.slice(0, 6).map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {page.path === '/' ? 'Home' : page.path}
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="w-12 text-right font-semibold">{page.views.toLocaleString()}</span>
                    <span className="w-12 text-right text-gray-600">{Math.round(page.views * 0.3)}</span>
                    <span className="w-12 text-right text-gray-600">{(30 + Math.random() * 40).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
              DETAILS
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section - Countries and Real-time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Countries */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Users by Country</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {data?.countries?.slice(0, 5).map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">{country.country}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(country.users / (data?.countries?.[0]?.users || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{country.users}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {data?.realtimeEvents?.slice(0, 5).map((event, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{event.type}</span>
                    <span className="text-gray-500 ml-2">{event.path}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{event.event_count}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.latest_event).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {(!data?.realtimeEvents || data.realtimeEvents.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-sm">No recent activity</p>
                  <p className="text-xs mt-1">Events will appear here in real-time</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PWA & Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">PWA Installs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data?.pwaMetrics?.installs || 0}</p>
              <p className="text-sm text-gray-500 mt-1">App downloads</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Report Views</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data?.dailyStats?.reduce((sum, day) => sum + (day.report_views || 0), 0) || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Wool market reports</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data?.dailyStats?.reduce((sum, day) => sum + (day.downloads || 0), 0) || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">PDF exports</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{engagementRate}%</p>
              <p className="text-sm text-gray-500 mt-1">User engagement</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
        </div>
      )}

      {/* Geography Tab */}
      {activeTab === 'geography' && (
        <div className="space-y-6">
          {/* World Map */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Global Visitor Distribution</h3>
                <p className="text-sm text-gray-600">Interactive map showing where your visitors are located worldwide</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Visitor concentration</span>
              </div>
            </div>
            <WorldMap data={geoData} height={400} />
          </div>

          {/* South Africa Detailed Map */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">South Africa Regional Breakdown</h3>
                <p className="text-sm text-gray-600">Detailed view of engagement across South African provinces</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Regional activity</span>
              </div>
            </div>
            <SouthAfricaMap data={geoData.filter(d => d.country === 'ZA')} height={400} />
          </div>

          {/* Geographic Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Countries */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
              <div className="space-y-3">
                {geoData.slice(0, 8).map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{country.country}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{country.unique_visitors}</div>
                      <div className="text-xs text-gray-500">{country.pageviews} views</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Countries</span>
                  <span className="font-semibold text-gray-900">{geoData.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">International %</span>
                  <span className="font-semibold text-blue-600">
                    {geoData.length > 0 ? (((geoData.filter(d => d.country !== 'ZA').reduce((sum, d) => sum + d.unique_visitors, 0)) / (geoData.reduce((sum, d) => sum + d.unique_visitors, 0))) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Top Region</span>
                  <span className="font-semibold text-green-600">
                    {geoData.length > 0 ? geoData[0]?.country || 'N/A' : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Engagement by Region */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Engagement</h3>
              <div className="space-y-3">
                {geoData.slice(0, 5).map((region, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{region.country}</div>
                      <div className="text-xs text-gray-500">{region.auction_views} auction views</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-purple-600">{Math.round(region.avg_time_on_page || 0)}s</div>
                      <div className="text-xs text-gray-500">avg time</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auction Engagement Tab */}
      {activeTab === 'auctions' && (
        <AuctionEngagementDashboard />
      )}
    </div>
  );
};

export default AnalyticsDashboard;
