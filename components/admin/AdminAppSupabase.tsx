import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminLayoutSupabase from './AdminLayoutSupabase';
import AdminDashboard from './AdminDashboard';
import AuctionsList from './AuctionsList';
import AdminForm from './AdminForm';
import AuctionDataCaptureForm from './AuctionDataCaptureForm';
import SeasonList from './SeasonList';
import CreateSeason from './CreateSeason';
import UserManagement from './UserManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import SimpleAnalyticsDashboard from './SimpleAnalyticsDashboard';
import AnalyticsTestDashboard from './AnalyticsTestDashboard';
import AdminSettings from './AdminSettings';
import type { AdminSection } from './AdminSidebar';
import type { Season, AuctionReport } from '../../types';
import SupabaseService from '../../data/supabase-service';
import { useAuth } from '../../contexts/AuthContext';

interface AdminAppSupabaseProps {
  // Remove the old props since we'll be using Supabase directly
}

const AdminAppSupabase: React.FC<AdminAppSupabaseProps> = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { auctionName } = useParams<{ auctionName: string }>();
  const [reports, setReports] = useState<AuctionReport[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState<AuctionReport | undefined>(undefined);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [auctionsRefreshTrigger, setAuctionsRefreshTrigger] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Handle route parameter changes for editing auctions
  useEffect(() => {
    if (auctionName && reports.length > 0) {
      // Find the auction by catalogue name
      const foundReport = reports.find(report => {
        const reportCatalogueName = `${report.auction.catalogue_prefix || 'CW'}${report.auction.catalogue_number || '001'}`;
        return reportCatalogueName === auctionName;
      });

      if (foundReport) {
        console.log('🔍 Found auction for editing from route parameter:', auctionName);
        handleEditReport(foundReport);
      } else {
        console.warn('❌ Auction not found for catalogue name:', auctionName);
      }
    }
  }, [auctionName, reports]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      console.log('Loading initial data...');
      
      // Load seasons, auctions, and current user in parallel
      const [seasonsResult, auctionsResult, usersResult] = await Promise.all([
        SupabaseService.getSeasons(),
        SupabaseService.getAuctions(),
        SupabaseService.getUsers()
      ]);

      console.log('Seasons result:', seasonsResult);
      console.log('Auctions result:', auctionsResult);
      console.log('Users result:', usersResult);

      if (seasonsResult.success) {
        setSeasons(seasonsResult.data);
        console.log('Seasons loaded:', seasonsResult.data.length);
      } else {
        console.error('Failed to load seasons:', seasonsResult.error);
        setSeasons([]); // Set empty array as fallback
      }

      if (auctionsResult.success) {
        // Convert auction data to report format
        const reportData = await Promise.all(
          auctionsResult.data.map(async (auction: any) => {
            const reportResult = await SupabaseService.getCompleteAuctionReport(auction.id);
            return reportResult.success ? reportResult.data : null;
          })
        );
        
        setReports(reportData.filter(Boolean) as AuctionReport[]);
        console.log('Reports loaded:', reportData.filter(Boolean).length);
      } else {
        console.error('Failed to load auctions:', auctionsResult.error);
        setReports([]); // Set empty array as fallback
      }

      // Find current user in users table
      if (usersResult.success && user) {
        console.log('🔍 Looking for user with ID:', user.id);
        console.log('📋 Available users:', usersResult.data.map((u: any) => ({ id: u.id, email: u.email, status: u.status })));
        
        const foundUser = usersResult.data.find((u: any) => u.id === user.id);
        if (foundUser) {
          setCurrentUser(foundUser);
          console.log('✅ Current user loaded:', foundUser);
        } else {
          console.warn('❌ Current user not found in users table');
          console.warn('Auth user ID:', user.id);
          console.warn('Available user IDs:', usersResult.data.map((u: any) => u.id));
        }
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Set fallback empty arrays
      setSeasons([]);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReport = async (report: AuctionReport) => {
    try {
      console.log('🔄 Loading complete auction data for editing:', report.auction.id);
      
      // Load the complete auction report with all related data
      const completeReportResult = await SupabaseService.getCompleteAuctionReport(report.auction.id);
      
      if (completeReportResult.success && completeReportResult.data) {
        console.log('✅ Complete auction data loaded:', {
          catalogue: `${completeReportResult.data.auction.catalogue_prefix}${completeReportResult.data.auction.catalogue_number}`,
          buyers_count: completeReportResult.data.buyers?.length || 0,
          brokers_count: completeReportResult.data.brokers?.length || 0,
          micron_prices_count: completeReportResult.data.micron_price_comparison?.rows?.length || 0,
          provincial_count: completeReportResult.data.provincial_producers?.length || 0
        });
        
        setEditingReport(completeReportResult.data);
        
        // Create a URL-friendly auction name from catalogue prefix and number
        const auctionName = `${completeReportResult.data.auction.catalogue_prefix || 'CW'}${completeReportResult.data.auction.catalogue_number || '001'}`;
        navigate(`/admin/Auctions/edit/${auctionName}`);
      } else {
        console.error('❌ Failed to load complete auction data:', completeReportResult.error);
        // Fallback to basic report data
        setEditingReport(report);
        const auctionName = `${report.auction.catalogue_prefix || 'CW'}${report.auction.catalogue_number || '001'}`;
        navigate(`/admin/Auctions/edit/${auctionName}`);
      }
    } catch (error) {
      console.error('❌ Error loading complete auction data:', error);
      // Fallback to basic report data
      setEditingReport(report);
      const auctionName = `${report.auction.catalogue_prefix || 'CW'}${report.auction.catalogue_number || '001'}`;
      navigate(`/admin/Auctions/edit/${auctionName}`);
    }
  };

  const handleSaveReport = async (newReportData: Omit<AuctionReport, 'top_sales'>) => {
    try {
      // Check if we're editing an existing report or creating a new one
      const isEditing = editingReport && editingReport.auction.id;
      
      let result;
      if (isEditing) {
        console.log('🔄 Updating existing auction:', editingReport.auction.id);
        // For editing, use the appropriate save method based on status
        if (newReportData.status === 'published') {
          result = await SupabaseService.saveAuctionReport(newReportData);
        } else {
          result = await SupabaseService.saveAuctionReportDraft(newReportData);
        }
      } else {
        console.log('🆕 Creating new auction');
        // For new auctions, use the regular save method
        result = await SupabaseService.saveAuctionReport(newReportData);
      }
      
      if (result.success) {
        // Reload data to get the updated reports
        await loadInitialData();
        setEditingReport(undefined);
        setAuctionsRefreshTrigger(prev => prev + 1);
      } else {
        console.error('Error saving report:', result.error);
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error('Error saving report:', error);
      // TODO: Show error message to user
    }
  };

  const handleDeleteReport = async (auctionId: string) => {
    try {
      const result = await SupabaseService.deleteAuctionReport(auctionId);
      if (result.success) {
        // Reload data to get the updated reports
        await loadInitialData();
        setAuctionsRefreshTrigger(prev => prev + 1);
      } else {
        console.error('Error deleting report:', result.error);
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      // TODO: Show error message to user
    }
  };

  const handleViewReport = (report: AuctionReport) => {
    // Navigate to the public view of the report
    const seasonLabel = report.auction.season_label;
    const catalogueName = report.auction.catalogue_name;
    if (seasonLabel && catalogueName) {
      // Convert to URL format
      const year = seasonLabel.split('/')[0];
      const catalogueNum = catalogueName.replace(/CAT/i, '').padStart(2, '0');
      const urlPath = `${year}${catalogueNum}`;
      window.open(`/${urlPath}`, '_blank');
    }
  };

  const handleCreateSeason = async (seasonData: Omit<Season, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Get the current user ID or fallback to admin user
      let createdByUserId = 'd5b02abc-4695-499d-bf04-0f553fdcf7c8'; // Default admin user ID
      
      if (user?.id) {
        // Check if the current user exists in the users table
        const userResult = await SupabaseService.getUsers();
        if (userResult.success) {
          const userExists = userResult.data.find((u: any) => u.id === user.id);
          if (userExists) {
            createdByUserId = user.id;
          }
        }
      }
      
      const result = await SupabaseService.createSeason({
        ...seasonData,
        created_by: createdByUserId
      });
      
      if (result.success) {
        setSeasons(prev => [result.data, ...prev]);
        navigate('/admin/seasons');
        return { success: true };
      } else {
        console.error('Error creating season:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error creating season:', error);
      return { success: false, error: error.message };
    }
  };

  const handleEditSeason = (season: Season) => {
    setEditingSeason(season);
    navigate(`/admin/seasons/edit/${season.id}`);
  };

  const handleUpdateSeason = async (seasonId: string, updates: Partial<Season>) => {
    try {
      const result = await SupabaseService.updateSeason(seasonId, updates);
      if (result.success) {
        setSeasons(prev => prev.map(s => s.id === seasonId ? result.data : s));
        navigate('/admin/seasons');
        return { success: true };
      } else {
        console.error('Error updating season:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error updating season:', error);
      return { success: false, error: error.message };
    }
  };

  const handleDeleteSeason = async (seasonId: string) => {
    try {
      const result = await SupabaseService.deleteSeason(seasonId);
      if (result.success) {
        setSeasons(prev => prev.filter(s => s.id !== seasonId));
        return { success: true };
      } else {
        console.error('Error deleting season:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error deleting season:', error);
      return { success: false, error: error.message };
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Determine current section based on location
  const getCurrentSection = (): AdminSection => {
    const path = location.pathname;
    console.log('🔍 AdminAppSupabase getCurrentSection - current path:', path);
    
    if (path.includes('/admin/seasons')) return 'seasons';
    if (path.includes('/admin/auctions')) return 'auctions';
    if (path.includes('/admin/analytics')) {
      console.log('✅ Analytics section detected!');
      return 'analytics';
    }
    if (path.includes('/admin/insights')) return 'insights';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/form')) return 'form';
    if (path.includes('/admin/capture')) return 'capture';
    if (path.includes('/admin/import-export')) return 'import-export';
    
    console.log('🔄 Defaulting to dashboard section');
    return 'dashboard';
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <AdminLayoutSupabase 
      currentSection={getCurrentSection()}
      onSignOut={handleSignOut}
      user={user}
    >
      <Routes>
        {/* Dashboard */}
        <Route 
          path="/" 
          element={<AdminDashboard />} 
        />
        
        {/* Seasons Management */}
        <Route 
          path="/seasons" 
          element={
            <SeasonList 
              seasons={seasons}
              reports={reports}
              onEditSeason={handleEditSeason}
              onDeleteSeason={handleDeleteSeason}
              onCreateSeason={() => navigate('/admin/seasons/create')}
            />
          } 
        />
        
        {/* Create Season */}
        <Route 
          path="/seasons/create" 
          element={
            <CreateSeason 
              onSave={handleCreateSeason}
              onCancel={() => navigate('/admin/seasons')}
            />
          } 
        />
        
        {/* Edit Season */}
        <Route 
          path="/seasons/edit/:id" 
          element={
            editingSeason ? (
              <CreateSeason 
                season={editingSeason}
                onSave={(seasonData) => handleUpdateSeason(editingSeason.id, seasonData)}
                onCancel={() => navigate('/admin/seasons')}
              />
            ) : (
              <div>Loading...</div>
            )
          } 
        />
        
        {/* Auctions Management */}
        <Route 
          path="/auctions" 
          element={
            <AuctionsList 
              reports={reports}
              onAddNew={() => navigate('/admin/create')}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
              onView={handleViewReport}
              refreshTrigger={auctionsRefreshTrigger}
            />
          } 
        />
        
        {/* Form-based Report Creation */}
        <Route 
          path="/form" 
          element={
            <AdminForm 
              editingReport={editingReport}
              onSave={handleSaveReport}
              onCancel={() => setEditingReport(undefined)}
            />
          } 
        />
        
        {/* Create Auction Form */}
        <Route 
          path="/create" 
          element={
            <AuctionDataCaptureForm 
              seasons={seasons}
              editingReport={editingReport}
              onSave={handleSaveReport}
              onCancel={() => setEditingReport(undefined)}
            />
          } 
        />
        
        {/* Edit Auction Form */}
        <Route 
          path="/Auctions/edit/:auctionName" 
          element={
            <AuctionDataCaptureForm 
              seasons={seasons}
              editingReport={editingReport}
              onSave={handleSaveReport}
              onCancel={() => setEditingReport(undefined)}
            />
          } 
        />
        
        {/* Analytics Dashboard */}
        <Route 
          path="/analytics" 
          element={<AnalyticsTestDashboard />} 
        />

        {/* User Management */}
        <Route 
          path="/users" 
          element={
            <UserManagement 
              currentUser={currentUser}
            />
          } 
        />

        {/* Settings */}
        <Route 
          path="/settings" 
          element={<AdminSettings />} 
        />

        {/* Cape Mohair Reports */}
        <Route 
          path="/cape-mohair" 
          element={
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cape Mohair Reports</h2>
                <p className="text-gray-600 mb-4">Specialized reporting for Cape Mohair auction data.</p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800">This section is under development. Cape Mohair specific features will be available soon.</p>
                </div>
              </div>
            </div>
          } 
        />

        {/* OVK Market Reports */}
        <Route 
          path="/ovk-reports" 
          element={
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">OVK Market Reports</h2>
                <p className="text-gray-600 mb-4">Advanced market reporting and analysis tools.</p>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-800">Enhanced reporting features coming soon with advanced analytics integration.</p>
                </div>
              </div>
            </div>
          } 
        />

        {/* Insights */}
        <Route 
          path="/insights" 
          element={
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Insights</h2>
                <p className="text-gray-600 mb-4">AI-powered market analysis and trend predictions.</p>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-purple-800">Advanced AI insights and predictive analytics are being developed using the analytics data.</p>
                </div>
              </div>
            </div>
          } 
        />

        {/* Import/Export */}
        <Route 
          path="/import-export" 
          element={
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Import/Export</h2>
                <p className="text-gray-600 mb-4">Data import and export tools for auction information.</p>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-yellow-800">Bulk import/export functionality is being developed to complement the existing auction management.</p>
                </div>
              </div>
            </div>
          } 
        />
        
        {/* Redirect to dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>

    </AdminLayoutSupabase>
  );
};

export default AdminAppSupabase;
