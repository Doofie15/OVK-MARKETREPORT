import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AdminLayoutSupabase from './AdminLayoutSupabase';
import AdminDashboard from './AdminDashboard';
import AuctionsList from './AuctionsList';
import AdminForm from './AdminForm';
import AuctionDataCaptureForm from './AuctionDataCaptureForm';
import SeasonList from './SeasonList';
import CreateSeason from './CreateSeason';
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
  const [reports, setReports] = useState<AuctionReport[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState<AuctionReport | undefined>(undefined);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [auctionsRefreshTrigger, setAuctionsRefreshTrigger] = useState(0);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load seasons and auctions in parallel
      const [seasonsResult, auctionsResult] = await Promise.all([
        SupabaseService.getSeasons(),
        SupabaseService.getAuctions()
      ]);

      if (seasonsResult.success) {
        setSeasons(seasonsResult.data);
      }

      if (auctionsResult.success) {
        // Convert auction data to report format
        const reportData = await Promise.all(
          auctionsResult.data.map(async (auction) => {
            const reportResult = await SupabaseService.getCompleteAuctionReport(auction.id);
            return reportResult.success ? reportResult.data : null;
          })
        );
        
        setReports(reportData.filter(Boolean) as AuctionReport[]);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReport = (report: AuctionReport) => {
    setEditingReport(report);
    navigate('/admin/create');
  };

  const handleSaveReport = async (newReportData: Omit<AuctionReport, 'top_sales'>) => {
    try {
      const result = await SupabaseService.saveAuctionReport(newReportData);
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
          const userExists = userResult.data.find(u => u.id === user.id);
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
    if (path.includes('/admin/seasons')) return 'seasons';
    if (path.includes('/admin/auctions')) return 'auctions';
    if (path.includes('/admin/form')) return 'form';
    if (path.includes('/admin/capture')) return 'capture';
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
          element={
            <AdminDashboard 
              reports={reports}
              seasons={seasons}
              onViewReport={handleViewReport}
              onEditReport={handleEditReport}
              onDeleteReport={handleDeleteReport}
            />
          } 
        />
        
        {/* Seasons Management */}
        <Route 
          path="/seasons" 
          element={
            <SeasonList 
              seasons={seasons}
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
              seasons={seasons}
              editingReport={editingReport}
              onSaveReport={handleSaveReport}
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
        
        {/* Redirect to dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>

    </AdminLayoutSupabase>
  );
};

export default AdminAppSupabase;
