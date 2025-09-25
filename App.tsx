import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { MOCK_REPORTS } from './constants';
import type { AuctionReport, Indicator } from './types';
import PublicLayout from './components/PublicLayout';
import AdminAppSupabase from './components/admin/AdminAppSupabase';
import SimplePWAManager from './components/SimplePWAManager';
import OVKLoadingSpinner from './components/OVKLoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import MobileDebugger from './components/MobileDebugger';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicDataService from './services/public-data-service';
import DarkModeProvider from './components/DarkModeProvider';
import DarkModeDebugger from './components/DarkModeDebugger';

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
  const [reports, setReports] = useState<AuctionReport[]>([]);
  const [selectedWeekId, setSelectedWeekId] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PROGRESSIVE LOADING: Load latest report first, then others in background
  const loadPublishedReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Starting progressive loading...');
      const result = await PublicDataService.getPublishedReportsProgressive();
      
      if (result.success && result.latestReport) {
        // STEP 1: Show latest report immediately (fast first render)
        console.log('⚡ Latest report loaded:', result.latestReport.auction.week_id, 'dated:', result.latestReport.auction.auction_date);
        setReports([result.latestReport]);
        setSelectedWeekId(result.latestReport.auction.week_id);
        setSelectedSeason(result.latestReport.auction.season_label);
        setLoading(false); // Stop loading spinner - user can see content!
        
        // STEP 2: Load remaining reports in background
        if (result.allReportsPromise) {
          console.log('🔄 Loading remaining reports in background...');
          
          result.allReportsPromise.then((allReportsResult) => {
            if (allReportsResult.success && allReportsResult.data) {
              console.log(`✅ Background loading complete: ${allReportsResult.data.length} total reports`);
              
              // SMOOTH UPDATE: Only update reports if current selection is still valid
              const currentSelection = allReportsResult.data.find(r => r.auction.week_id === selectedWeekId);
              if (currentSelection) {
                // Current selection is valid, just update the reports list smoothly
                setReports(allReportsResult.data);
                console.log('📊 Background loading: Current selection still valid, smooth update');
              } else {
                // Current selection invalid, need to update both reports and selection
                console.log('📊 Background loading: Current selection invalid, updating...');
                const sortedReports = [...allReportsResult.data].sort((a, b) => {
                  const dateA = new Date(a.auction.auction_date);
                  const dateB = new Date(b.auction.auction_date);
                  return dateB.getTime() - dateA.getTime();
                });
                const latestReport = sortedReports[0];
                
                // Batch state updates to prevent multiple re-renders
                setReports(allReportsResult.data);
                setSelectedWeekId(latestReport.auction.week_id);
                setSelectedSeason(latestReport.auction.season_label);
              }
            } else {
              console.warn('⚠️ Background loading failed, keeping latest report only');
            }
          }).catch((error) => {
            console.error('❌ Background loading error:', error);
            // Keep showing the latest report even if background loading fails
          });
        }
        
      } else {
        console.warn('⚠️ No published reports found, falling back to mock data');
        setReports(MOCK_REPORTS);
        setSelectedWeekId(MOCK_REPORTS[0]?.auction.week_id || '');
        setError('No published reports available. Showing sample data.');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error loading published reports:', error);
      setError('Failed to load auction data. Showing sample data.');
      setReports(MOCK_REPORTS);
      setSelectedWeekId(MOCK_REPORTS[0]?.auction.week_id || '');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublishedReports();
  }, []); // Empty dependency array to run only once

  // Refresh data when reports are updated (for admin users)
  const handleReportUpdate = () => {
    loadPublishedReports();
  };


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
      if (auctionId && !loading) {
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
    }, [auctionId, reports, navigate, loading]);

    const handleWeekChange = (weekId: string) => {
      setSelectedWeekId(weekId);
      const seasonCatalogue = getSeasonCatalogueByWeekId(reports, weekId);
      if (seasonCatalogue) {
        const urlPath = seasonCatalogueToUrl(seasonCatalogue.season, seasonCatalogue.catalogue);
        navigate(`/${urlPath}`, { replace: true });
      }
    };

    if (loading) {
      return <OVKLoadingSpinner message="Loading auction data..." />;
    }

    return (
      <PublicLayout 
        reports={reports}
        selectedWeekId={selectedWeekId}
        onWeekChange={handleWeekChange}
        selectedSeason={selectedSeason}
        onSeasonChange={(season) => setSelectedSeason(season)}
        error={error}
      />
    );
  };

  // Component for home route (latest auction)
  const HomeRoute: React.FC = () => {
    const navigate = useNavigate();
    
    // Only ensure latest auction if we don't have a selection (rare edge case)
    useEffect(() => {
      if (!loading && reports.length > 0 && !selectedWeekId) {
        // Sort reports by auction date to get the absolute latest
        const sortedReports = [...reports].sort((a, b) => {
          const dateA = new Date(a.auction.auction_date);
          const dateB = new Date(b.auction.auction_date);
          return dateB.getTime() - dateA.getTime();
        });
        
        if (sortedReports.length > 0) {
          const latestReport = sortedReports[0];
          setSelectedWeekId(latestReport.auction.week_id);
          setSelectedSeason(latestReport.auction.season_label);
          console.log('🏠 Home route: Fallback to latest auction:', latestReport.auction.week_id);
        }
      }
    }, [loading, reports.length]); // Removed selectedWeekId from deps to prevent extra triggers
    
    const handleWeekChange = (weekId: string) => {
      setSelectedWeekId(weekId);
      const seasonCatalogue = getSeasonCatalogueByWeekId(reports, weekId);
      if (seasonCatalogue) {
        const urlPath = seasonCatalogueToUrl(seasonCatalogue.season, seasonCatalogue.catalogue);
        navigate(`/${urlPath}`, { replace: true });
      }
    };

    const handleSeasonChange = (season: string) => {
      setSelectedSeason(season);
      // When season changes, reset to latest available week in that season
      const filteredReports = reports.filter(r => r.auction.season_label === season);
      if (filteredReports.length > 0) {
        const latestInSeason = filteredReports.sort((a, b) => {
          const dateA = new Date(a.auction.auction_date);
          const dateB = new Date(b.auction.auction_date);
          return dateB.getTime() - dateA.getTime();
        })[0];
        handleWeekChange(latestInSeason.auction.week_id);
      }
    };

    if (loading) {
      return <OVKLoadingSpinner message="Loading latest auction data..." />;
    }

    return (
      <PublicLayout 
        reports={reports}
        selectedWeekId={selectedWeekId}
        onWeekChange={handleWeekChange}
        selectedSeason={selectedSeason}
        onSeasonChange={handleSeasonChange}
        error={error}
      />
    );
  };

  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <AuthProvider>
            <SimplePWAManager />
            <DarkModeDebugger />
            <MobileDebugger enabled={window.location.search.includes('debug=true')} />
            <Router>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/" 
              element={
                <ErrorBoundary fallback={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Error</h2>
                      <p className="text-gray-600 mb-4">Unable to load the home page.</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Reload
                      </button>
                    </div>
                  </div>
                }>
                  <HomeRoute />
                </ErrorBoundary>
              }
            />
            
            {/* Auction-specific routes */}
            <Route 
              path="/:auctionId" 
              element={
                <ErrorBoundary fallback={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Error</h2>
                      <p className="text-gray-600 mb-4">Unable to load this auction report.</p>
                      <button 
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Go Home
                      </button>
                    </div>
                  </div>
                }>
                  <AuctionRoute />
                </ErrorBoundary>
              }
            />
            
            {/* Admin routes - Protected */}
            <Route 
              path="/admin/*" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <AdminAppSupabase />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            
            {/* Redirect any other routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Router>
        </AuthProvider>
      </DarkModeProvider>
    </ErrorBoundary>
  );
};

export default App;
