import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AuctionsList from './admin/AuctionsList';
import AdminForm from './admin/AdminForm';
import AuctionDataCaptureForm from './admin/AuctionDataCaptureForm';
import SeasonList from './admin/SeasonList';
import CreateSeason from './admin/CreateSeason';
import type { AdminSection } from './admin/AdminSidebar';
import type { Season, AuctionReport } from '../types';

interface AdminAppProps {
  reports: AuctionReport[];
  onSaveReport: (newReportData: Omit<AuctionReport, 'top_sales'>) => void;
  onDeleteReport: (weekId: string) => void;
  onViewReport: (report: AuctionReport) => void;
}

const AdminApp: React.FC<AdminAppProps> = ({ 
  reports, 
  onSaveReport, 
  onDeleteReport, 
  onViewReport 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingReport, setEditingReport] = useState<AuctionReport | undefined>(undefined);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [showCreateSeason, setShowCreateSeason] = useState(false);
  const [auctionsRefreshTrigger, setAuctionsRefreshTrigger] = useState(0);
  const location = useLocation();

  const handleEditReport = (report: AuctionReport) => {
    setEditingReport(report);
  };

  const handleSaveReport = (newReportData: Omit<AuctionReport, 'top_sales'>) => {
    onSaveReport(newReportData);
    setEditingReport(undefined);
    setAuctionsRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteReport = (weekId: string) => {
    onDeleteReport(weekId);
  };

  const handleViewReport = (report: AuctionReport) => {
    onViewReport(report);
  };

  // Admin authentication
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    // Simple demo authentication
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSeasonCreated = () => {
    setShowCreateSeason(false);
    setEditingSeason(null);
  };

  const handleEditSeason = (season: Season) => {
    setEditingSeason(season);
    setShowCreateSeason(true);
  };

  // Get current admin section from URL
  const getCurrentAdminSection = (): AdminSection => {
    const path = location.pathname;
    if (path.includes('/seasons')) return 'seasons';
    if (path.includes('/auctions')) return 'auctions';
    if (path.includes('/cape-mohair')) return 'cape-mohair';
    if (path.includes('/ovk-reports')) return 'ovk-reports';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/insights')) return 'insights';
    if (path.includes('/import-export')) return 'import-export';
    if (path.includes('/users')) return 'users';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  return (
    <AdminLayout
      activeSection={getCurrentAdminSection()}
      onSectionChange={() => {}} // No longer needed with routing
      isAuthenticated={isAuthenticated}
      onLogin={handleLogin}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        
        <Route path="/seasons" element={
          showCreateSeason ? (
            <CreateSeason
              onBack={() => {
                setShowCreateSeason(false);
                setEditingSeason(null);
              }}
              onSeasonCreated={handleSeasonCreated}
              editingSeason={editingSeason}
            />
          ) : (
            <SeasonList
              onCreateSeason={() => setShowCreateSeason(true)}
              onEditSeason={handleEditSeason}
            />
          )
        } />
        
        <Route path="/auctions" element={
          editingReport ? (
            <AuctionDataCaptureForm 
              onSave={handleSaveReport} 
              onCancel={() => setEditingReport(undefined)} 
              editingReport={editingReport}
            />
          ) : (
            <AuctionsList 
              reports={reports} 
              refreshTrigger={auctionsRefreshTrigger}
              onAddNew={() => {
                console.log('Add New Auction button clicked');
                setEditingReport(undefined);
                // Create a new blank report for adding
                const newReport: AuctionReport = {
                  auction: {
                    commodity: 'wool' as const,
                    season_label: '2025/26',
                    week_id: '',
                    week_start: '',
                    week_end: '',
                    auction_date: new Date().toISOString().split('T')[0],
                    catalogue_name: ''
                  },
                  indicators: [],
                  benchmarks: [],
                  micron_prices: [],
                  buyers: [],
                  brokers: [],
                  currencies: [],
                  insights: '',
                  trends: { rws: [], non_rws: [], awex: [] },
                  yearly_average_prices: [],
                  provincial_producers: [],
                  province_avg_prices: [],
                  top_sales: []
                };
                console.log('Setting editingReport to:', newReport);
                setEditingReport(newReport);
              }}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
              onView={handleViewReport}
            />
          )
        } />
        
        <Route path="/cape-mohair" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">Cape Mohair Reports - Coming Soon</h2></div>} />
        <Route path="/ovk-reports" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">OVK Market Reports - Coming Soon</h2></div>} />
        <Route path="/analytics" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">Analytics - Coming Soon</h2></div>} />
        <Route path="/insights" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">Insights - Coming Soon</h2></div>} />
        <Route path="/import-export" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">Import/Export - Coming Soon</h2></div>} />
        <Route path="/users" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">User Management - Coming Soon</h2></div>} />
        <Route path="/settings" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">Settings - Coming Soon</h2></div>} />
        
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
