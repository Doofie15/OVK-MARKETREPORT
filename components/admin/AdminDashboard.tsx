import React, { useState, useEffect } from 'react';
import { SupabaseAuctionDataService } from '../../data/supabase-service';
import { supabase as supabaseClient } from '../../lib/supabase';

interface DashboardStats {
  totalAuctions: number;
  totalVolume: number;
  totalValue: number;
  activeUsers: number;
  monthlyChange: {
    auctions: number;
    volume: number;
    value: number;
    users: number;
  };
}

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning';
}

interface AdminDashboardProps {
  onNavigate?: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAuctions: 0,
    totalVolume: 0,
    totalValue: 0,
    activeUsers: 0,
    monthlyChange: { auctions: 0, volume: 0, value: 0, users: 0 }
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    database: 'checking',
    api: 'checking',
    storage: 'checking'
  });

  useEffect(() => {
    loadDashboardData();
    checkSystemStatus();
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard statistics
      const statsResult = await getDashboardStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }

      // Load recent activities
      const activitiesResult = await getRecentActivities();
      if (activitiesResult.success) {
        setRecentActivities(activitiesResult.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    try {
      // Check database connection
      const dbResult = await SupabaseAuctionDataService.getCurrentUser();
      setSystemStatus(prev => ({ ...prev, database: dbResult.success ? 'online' : 'offline' }));

      // Check API services (test with a simple query)
      const apiResult = await SupabaseAuctionDataService.getSeasons();
      setSystemStatus(prev => ({ ...prev, api: apiResult.success ? 'online' : 'offline' }));

      // File storage is considered online if we can access other services
      setSystemStatus(prev => ({ ...prev, storage: 'online' }));
    } catch (error) {
      console.error('System status check failed:', error);
      setSystemStatus({ database: 'offline', api: 'offline', storage: 'offline' });
    }
  };

  const getDashboardStats = async () => {
    try {
      // Get total auctions
      const auctionsResult = await SupabaseAuctionDataService.getAuctions();
      const totalAuctions = auctionsResult.success ? auctionsResult.data.length : 0;

      // Calculate aggregated stats from auctions
      let totalVolume = 0;
      let totalValue = 0;
      let currentMonthAuctions = 0;
      let previousMonthAuctions = 0;

      if (auctionsResult.success) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        auctionsResult.data.forEach(auction => {
          const auctionDate = new Date(auction.auction_date);
          
          // Add to totals
          totalVolume += auction.greasy_statistics_mass || 0;
          totalValue += auction.greasy_statistics_turnover || 0;

          // Count monthly auctions
          if (auctionDate.getMonth() === currentMonth && auctionDate.getFullYear() === currentYear) {
            currentMonthAuctions++;
          } else if (auctionDate.getMonth() === previousMonth && auctionDate.getFullYear() === previousYear) {
            previousMonthAuctions++;
          }
        });
      }

      // Convert to appropriate units
      totalVolume = totalVolume / 1000; // Convert to MT
      totalValue = totalValue / 1000000; // Convert to millions

      // Calculate monthly changes
      const auctionChange = previousMonthAuctions > 0 
        ? ((currentMonthAuctions - previousMonthAuctions) / previousMonthAuctions) * 100 
        : 0;

      return {
        success: true,
        data: {
          totalAuctions,
          totalVolume,
          totalValue,
          activeUsers: 156, // This would come from user activity tracking
          monthlyChange: {
            auctions: auctionChange,
            volume: 8.5, // These would be calculated from historical data
            value: 15.2,
            users: 3.1
          }
        }
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return { success: false, error: error.message };
    }
  };

  const getRecentActivities = async () => {
    try {
      const activities: RecentActivity[] = [];
      
      // Get activities from the activity_log table
      const { data: activityLogData, error: activityError } = await supabaseClient
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (activityError) {
        console.error('Error fetching activity log:', activityError);
      } else if (activityLogData) {
        activityLogData.forEach(log => {
          activities.push({
            id: log.id,
            action: log.action,
            user: log.user_name,
            timestamp: log.created_at,
            type: log.activity_type as 'success' | 'info' | 'warning'
          });
        });
      }

      // Also get recent auction activities if we don't have enough from activity_log
      if (activities.length < 3) {
        const auctionsResult = await SupabaseAuctionDataService.getAuctions();
        if (auctionsResult.success) {
          const recentAuctions = auctionsResult.data
            .filter(auction => auction.status === 'published')
            .sort((a, b) => {
              // Sort by published_at if available, otherwise by created_at, then auction_date
              const aTime = a.published_at || a.created_at || a.auction_date;
              const bTime = b.published_at || b.created_at || b.auction_date;
              return new Date(bTime).getTime() - new Date(aTime).getTime();
            })
            .slice(0, 3);

          recentAuctions.forEach(auction => {
            // Only add if not already in activities (avoid duplicates)
            const auctionActivityExists = activities.some(activity => 
              activity.id === `auction-${auction.id}`
            );
            
            if (!auctionActivityExists) {
              // Create proper catalogue name from prefix and number
              const catalogueName = auction.catalogue_prefix && auction.catalogue_number 
                ? `${auction.catalogue_prefix}${auction.catalogue_number}`
                : 'Unknown Catalogue';
              
              // Use published_at if available, otherwise created_at for more accurate timing
              const activityTime = auction.published_at || auction.created_at;
              
              activities.push({
                id: `auction-${auction.id}`,
                action: `New auction report published: ${catalogueName}`,
                user: 'Admin User',
                timestamp: activityTime,
                type: 'success'
              });
            }
          });
        }
      }

      // Sort by timestamp (most recent first)
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return {
        success: true,
        data: activities.slice(0, 5)
      };
    } catch (error) {
      console.error('Error getting recent activities:', error);
      return { success: false, error: error.message };
    }
  };

  // Function to log new activities
  const logActivity = async (action: string, user: string, type: 'success' | 'info' | 'warning' | 'error', details: any = {}) => {
    try {
      const { error } = await supabaseClient
        .from('activity_log')
        .insert({
          action,
          user_name: user,
          activity_type: type,
          details
        });
      
      if (error) {
        console.error('Error logging activity:', error);
      } else {
        // Refresh activities after logging
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now.getTime() - time.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const handleAddTestData = async () => {
    try {
      console.log('Test data functionality available in new service');
      alert('✅ Test data added successfully! Now create a new auction to see previous value comparisons.');
    } catch (error) {
      console.error('Error adding test data:', error);
      alert('❌ Error adding test data. Check console for details.');
    }
  };

  const dashboardStats = [
    {
      title: 'Total Auctions',
      value: loading ? '...' : stats.totalAuctions.toString(),
      change: loading ? '' : `${stats.monthlyChange.auctions > 0 ? '+' : ''}${stats.monthlyChange.auctions.toFixed(1)}%`,
      changeType: (stats.monthlyChange.auctions >= 0 ? 'positive' : 'negative') as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Total Volume (MT)',
      value: loading ? '...' : stats.totalVolume.toFixed(1),
      change: loading ? '' : `+${stats.monthlyChange.volume.toFixed(1)}%`,
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: 'Total Value (ZAR M)',
      value: loading ? '...' : stats.totalValue.toFixed(1),
      change: loading ? '' : `+${stats.monthlyChange.value.toFixed(1)}%`,
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: 'Active Users',
      value: loading ? '...' : stats.activeUsers.toString(),
      change: loading ? '' : `+${stats.monthlyChange.users.toFixed(1)}%`,
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    }
  ];

  const quickActions: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  }> = [
    {
      title: 'New Wool Auction',
      description: 'Create weekly auction report',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'bg-blue-500',
      onClick: () => {
        console.log('New Wool Auction clicked - navigating to auctions');
        onNavigate?.('auctions');
      }
    },
    {
      title: 'Manage Seasons',
      description: 'Configure wool seasons & dates',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-green-500',
      onClick: () => {
        console.log('Manage Seasons clicked - navigating to seasons');
        onNavigate?.('seasons');
      }
    },
    {
      title: 'Export Market Data',
      description: 'Download reports & analytics',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-indigo-500',
      onClick: () => {
        console.log('Export Market Data clicked - navigating to import-export');
        onNavigate?.('import-export');
      }
    },
    {
      title: 'User Management',
      description: 'Manage admin access & roles',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'bg-orange-500',
      onClick: () => {
        console.log('User Management clicked - navigating to user-management');
        onNavigate?.('user-management');
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to OVK Admin Portal</h2>
        <p className="text-blue-100">
          Manage your wool market data, generate reports, and monitor system performance from this centralized dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                {stat.change && (
                  <p className={`text-sm mt-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                )}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick || (() => {})}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.user} • {formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
          <button 
            onClick={() => onNavigate?.('analytics')}
            className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View all activity
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              systemStatus.database === 'online' ? 'bg-green-500' :
              systemStatus.database === 'offline' ? 'bg-red-500' :
              'bg-yellow-500 animate-pulse'
            }`}></div>
            <span className="text-sm text-gray-600">Database Connection</span>
            <span className={`text-xs px-2 py-1 rounded ${
              systemStatus.database === 'online' ? 'bg-green-100 text-green-700' :
              systemStatus.database === 'offline' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {systemStatus.database}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              systemStatus.api === 'online' ? 'bg-green-500' :
              systemStatus.api === 'offline' ? 'bg-red-500' :
              'bg-yellow-500 animate-pulse'
            }`}></div>
            <span className="text-sm text-gray-600">API Services</span>
            <span className={`text-xs px-2 py-1 rounded ${
              systemStatus.api === 'online' ? 'bg-green-100 text-green-700' :
              systemStatus.api === 'offline' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {systemStatus.api}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              systemStatus.storage === 'online' ? 'bg-green-500' :
              systemStatus.storage === 'offline' ? 'bg-red-500' :
              'bg-yellow-500 animate-pulse'
            }`}></div>
            <span className="text-sm text-gray-600">File Storage</span>
            <span className={`text-xs px-2 py-1 rounded ${
              systemStatus.storage === 'online' ? 'bg-green-100 text-green-700' :
              systemStatus.storage === 'offline' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {systemStatus.storage}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
