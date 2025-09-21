import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { MOCK_REPORTS } from './constants';
import type { AuctionReport, Indicator } from './types';
import PublicLayout from './components/PublicLayout';
import AdminAppSupabase from './components/admin/AdminAppSupabase';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Helper function to convert season and catalogue to URL format (e.g., "202501")
const seasonCatalogueToUrl = (seasonLabel: string, catalogueName: string): string => {
  // Extract year from season (e.g., "2025/26" -> "2025")
  const year = seasonLabel.split('/')[0];
  // Extract number from catalogue (e.g., "CAT01" -> "01")
  const catalogueNum = catalogueName.replace(/CAT/i, '').padStart(2, '0');
  return `${year}${catalogueNum}`;
};

// Helper function to convert URL to season and catalogue
const urlToSeasonCatalogue = (urlParam: string): { season: string; catalogue: string } | null => {
  // URL format: "202501" -> season: "2025/26", catalogue: "CAT01"
  if (urlParam.length === 6 && /^\d{6}$/.test(urlParam)) {
    const year = urlParam.substring(0, 4);
    const catalogueNum = urlParam.substring(4, 6);
    const nextYear = (parseInt(year) + 1).toString().substring(2); // Get last 2 digits
    const season = `${year}/${nextYear}`;
    const catalogue = `CAT${parseInt(catalogueNum).toString().padStart(2, '0')}`;
    return { season, catalogue };
  }
  return null;
};

// Helper function to find week ID by season and catalogue
const findWeekIdBySeasonCatalogue = (reports: AuctionReport[], season: string, catalogue: string): string | null => {
  const report = reports.find(r => 
    r.auction.season_label === season && r.auction.catalogue_name === catalogue
  );
  return report ? report.auction.week_id : null;
};

// Helper function to get season and catalogue by week ID
const getSeasonCatalogueByWeekId = (reports: AuctionReport[], weekId: string): { season: string; catalogue: string } | null => {
  const report = reports.find(r => r.auction.week_id === weekId);
  return report ? { season: report.auction.season_label, catalogue: report.auction.catalogue_name } : null;
};

const App: React.FC = () => {
  const [reports, setReports] = useState<AuctionReport[]>(MOCK_REPORTS);
  const [selectedWeekId, setSelectedWeekId] = useState<string>(MOCK_REPORTS[0]?.auction.week_id || '');


  const handleSaveReport = (newReportData: Omit<AuctionReport, 'top_sales'>) => {
    // Find the latest report to base YTD calculations on
    const latestReport = reports.length > 0 
        ? reports.reduce((latest, current) => 
            new Date(latest.auction.auction_date) > new Date(current.auction.auction_date) ? latest : current
          )
        : null;

    // --- Calculate YTD values ---
    const getIndicatorValue = (report: AuctionReport | null, type: Indicator['type']) => report?.indicators.find(i => i.type === type)?.value || 0;
    const getIndicatorYtdValue = (report: AuctionReport | null, type: Indicator['type']) => report?.indicators.find(i => i.type === type)?.value_ytd || 0;

    newReportData.indicators.forEach(indicator => {
      if (indicator.type === 'total_lots' || indicator.type === 'total_volume') {
        indicator.value_ytd = getIndicatorYtdValue(latestReport, indicator.type) + indicator.value;
      }
    });

    const latestBuyersMap = new Map(latestReport?.buyers.map(b => [b.buyer, b]));
    newReportData.buyers.forEach(buyer => {
      const latestBuyer = latestBuyersMap.get(buyer.buyer);
      buyer.bales_ytd = (latestBuyer?.bales_ytd || 0) + buyer.cat;
    });

    const latestBrokersMap = new Map(latestReport?.brokers.map(b => [b.name, b]));
    newReportData.brokers.forEach(broker => {
      const latestBroker = latestBrokersMap.get(broker.name);
      broker.sold_ytd = (latestBroker?.sold_ytd || 0) + broker.catalogue_offering;
    });

    // --- Create final report object ---
    const finalNewReport: AuctionReport = {
        ...newReportData,
        top_sales: [], // top_sales will be derived from provincial_producers
    };
    
    const updatedReports = [finalNewReport, ...reports];
    setReports(updatedReports);
    setSelectedWeekId(finalNewReport.auction.week_id);
  };

  const handleDeleteReport = (weekId: string) => {
    const updatedReports = reports.filter(report => report.auction.week_id !== weekId);
    setReports(updatedReports);
    
    // If we deleted the currently selected report, select the first available one
    if (selectedWeekId === weekId && updatedReports.length > 0) {
      setSelectedWeekId(updatedReports[0].auction.week_id);
    }
  };

  const handleViewReport = (report: AuctionReport) => {
    setSelectedWeekId(report.auction.week_id);
    // Navigate to the specific auction URL
    const seasonLabel = report.auction.season_label;
    const catalogueName = report.auction.catalogue_name;
    if (seasonLabel && catalogueName) {
      const urlPath = seasonCatalogueToUrl(seasonLabel, catalogueName);
      window.location.href = `/${urlPath}`;
    } else {
      window.location.href = '/';
    }
  };

  // Component to handle auction-specific routes
  const AuctionRoute: React.FC = () => {
    const { auctionId } = useParams<{ auctionId: string }>();
    const navigate = useNavigate();
    
    useEffect(() => {
      if (auctionId) {
        const seasonCatalogue = urlToSeasonCatalogue(auctionId);
        
        if (seasonCatalogue) {
          const weekId = findWeekIdBySeasonCatalogue(reports, seasonCatalogue.season, seasonCatalogue.catalogue);
          
          if (weekId) {
            setSelectedWeekId(weekId);
          } else {
            // If auction not found, redirect to home
            navigate('/', { replace: true });
          }
        } else {
          // If URL format is invalid, redirect to home
          navigate('/', { replace: true });
        }
      }
    }, [auctionId, reports, navigate]);

    const handleWeekChange = (weekId: string) => {
      setSelectedWeekId(weekId);
      const seasonCatalogue = getSeasonCatalogueByWeekId(reports, weekId);
      if (seasonCatalogue) {
        const urlPath = seasonCatalogueToUrl(seasonCatalogue.season, seasonCatalogue.catalogue);
        navigate(`/${urlPath}`, { replace: true });
      }
    };

    return (
      <PublicLayout 
        reports={reports}
        selectedWeekId={selectedWeekId}
        onWeekChange={handleWeekChange}
      />
    );
  };

  // Component for home route (latest auction)
  const HomeRoute: React.FC = () => {
    const navigate = useNavigate();
    
    const handleWeekChange = (weekId: string) => {
      setSelectedWeekId(weekId);
      const seasonCatalogue = getSeasonCatalogueByWeekId(reports, weekId);
      if (seasonCatalogue) {
        const urlPath = seasonCatalogueToUrl(seasonCatalogue.season, seasonCatalogue.catalogue);
        navigate(`/${urlPath}`, { replace: true });
      }
    };

    return (
      <PublicLayout 
        reports={reports}
        selectedWeekId={selectedWeekId}
        onWeekChange={handleWeekChange}
      />
    );
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={<HomeRoute />}
          />
          
          {/* Auction-specific routes */}
          <Route 
            path="/:auctionId" 
            element={<AuctionRoute />}
          />
          
          {/* Admin routes - Protected */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminAppSupabase />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect any other routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
