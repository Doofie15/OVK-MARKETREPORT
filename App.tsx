import React, { useState, useMemo } from 'react';
import { MOCK_REPORTS } from './constants';
import type { AuctionReport, TopSale, Indicator, Buyer, BrokerData } from './types';
import Header from './components/Header';
import AuctionSelector from './components/AuctionSelector';
import IndicatorsGrid from './components/IndicatorsGrid';
import MicronPriceChart from './components/MicronPriceChart';
import AuctionComparison from './components/AuctionComparison';
import MarketOverview from './components/MarketOverview';
import TopSalesTable from './components/TopSalesTable';
import InsightsCard from './components/InsightsCard';
import MarketTrends from './components/MarketTrends';
import BuyerListTable from './components/BuyerListTable';
import BuyerShareChart from './components/BuyerShareChart';
import BrokersGrid from './components/BrokersGrid';
import TopPerformers from './components/TopPerformers';

// Admin components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AuctionsList from './components/admin/AuctionsList';
import AdminForm from './components/admin/AdminForm';
import AuctionDataCaptureForm from './components/admin/AuctionDataCaptureForm';
import type { AdminSection } from './components/admin/AdminSidebar';

type ViewMode = 'report' | 'admin';

const App: React.FC = () => {
  const [reports, setReports] = useState<AuctionReport[]>(MOCK_REPORTS);
  const [selectedWeekId, setSelectedWeekId] = useState<string>(reports[0].auction.week_id);
  const [viewMode, setViewMode] = useState<ViewMode>('report');
  
  // Admin state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');
  const [editingReport, setEditingReport] = useState<AuctionReport | undefined>(undefined);

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
    setViewMode('report');
  };

  const handleEditReport = (report: AuctionReport) => {
    setEditingReport(report);
    setAdminSection('auctions');
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
    setViewMode('report');
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
    setViewMode('report');
  };

  const handleAdminSectionChange = (section: AdminSection) => {
    setAdminSection(section);
    if (section === 'auctions') {
      setEditingReport(undefined);
    }
  };

  const activeReport: AuctionReport | undefined = useMemo(() => 
    reports.find(report => report.auction.week_id === selectedWeekId), 
    [reports, selectedWeekId]
  );

  const previousReport: AuctionReport | undefined = useMemo(() => {
    const currentIndex = reports.findIndex(r => r.auction.week_id === selectedWeekId);
    return currentIndex > 0 ? reports[currentIndex - 1] : 
           currentIndex === 0 && reports.length > 1 ? reports[1] : undefined;
  }, [selectedWeekId, reports]);

  const rwsPremium = useMemo(() => {
    if (!activeReport?.yearly_average_prices) return 0;
    
    const rwsPrice = activeReport.yearly_average_prices.find(p => p.label.includes('RWS'))?.value || 0;
    const nonRwsPrice = activeReport.yearly_average_prices.find(p => p.label.includes('Non-RWS'))?.value || 0;
    
    if (nonRwsPrice > 0) {
      return ((rwsPrice - nonRwsPrice) / nonRwsPrice) * 100;
    }
    return 0;
  }, [activeReport]);
  
  const topSalesForActiveReport = useMemo((): TopSale[] => {
      if (!activeReport) return [];
      return activeReport.provincial_producers
          .flatMap(p => p.producers)
          .sort((a, b) => b.price - a.price)
          .slice(0, 10)
          .map((p, index) => ({
              position: index + 1,
              farm: p.name,
              region: p.district,
              price_zar_per_kg_greasy: p.price,
              micron_um: p.micron || 0,
              certified: p.certified === 'RWS',
              buyer_name: p.buyer_name,
              lots_count: 1, // This data is not in the new form, so defaulting
              type_code: p.description || 'N/A', // This data is not in the new form, so defaulting
          }));
  }, [activeReport]);


  const availableWeeks = useMemo(() => reports.map(report => ({
    id: report.auction.week_id,
    label: `${report.auction.catalogue_name || `Week ${report.auction.week_id.split('_')[2]}`} (${new Date(report.auction.auction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`
  })).sort((a,b) => b.id.localeCompare(a.id)), [reports]);

  const renderAdminContent = () => {
    console.log('renderAdminContent called with adminSection:', adminSection, 'editingReport:', editingReport);
    switch (adminSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'auctions':
        if (editingReport) {
          console.log('Rendering AuctionDataCaptureForm with editingReport:', editingReport);
          return (
            <AuctionDataCaptureForm 
              onSave={handleSaveReport} 
              onCancel={() => setEditingReport(undefined)} 
              editingReport={editingReport}
            />
          );
        }
        return (
          <AuctionsList 
            reports={reports} 
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
                trends: { rws: [], non_rws: [] },
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
        );
      case 'cape-mohair':
        return <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">Cape Mohair Reports - Coming Soon</h2></div>;
      case 'ovk-reports':
        return <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">OVK Market Reports - Coming Soon</h2></div>;
      case 'analytics':
        return <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">Analytics - Coming Soon</h2></div>;
      case 'insights':
        return <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">Insights - Coming Soon</h2></div>;
      case 'import-export':
        return <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">Import/Export - Coming Soon</h2></div>;
      case 'users':
        return <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">User Management - Coming Soon</h2></div>;
      case 'settings':
        return <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-600">Settings - Coming Soon</h2></div>;
      default:
        return <AdminDashboard />;
    }
  };

  const renderContent = () => {
    return (
      <>
        <AuctionSelector
          weeks={availableWeeks}
          selectedWeekId={selectedWeekId}
          onWeekChange={setSelectedWeekId}
        />
        {activeReport ? (
          <div className="space-y-4">
            <IndicatorsGrid 
              indicators={activeReport.indicators} 
              benchmarks={activeReport.benchmarks}
              yearly_average_prices={activeReport.yearly_average_prices}
            />
            
            <div className="grid lg:grid-cols-3 gap-4">
              <div>
                <InsightsCard insights={activeReport.insights} />
              </div>
              <div className="lg:col-span-2">
                <MarketOverview 
                  currencies={activeReport.currencies}
                  rwsPremium={rwsPremium}
                />
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-4">
              <MicronPriceChart data={activeReport.micron_prices} />
              <BuyerShareChart data={activeReport.buyers.slice(0, 6)} />
            </div>

            <AuctionComparison 
              currentData={activeReport.micron_prices}
              previousData={previousReport?.micron_prices}
            />

            <MarketTrends data={activeReport.trends} />
            
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <BuyerListTable data={activeReport.buyers} />
              </div>
              <div>
                <BrokersGrid data={activeReport.brokers} />
              </div>
            </div>
            
            <TopSalesTable data={topSalesForActiveReport.slice(0, 5)} />
            
            <TopPerformers 
              topSales={topSalesForActiveReport}
              provincialProducers={activeReport.provincial_producers}
              provinceAvgPrices={activeReport.province_avg_prices}
            />
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="card p-12 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-title mb-4" style={{ color: 'var(--text-primary)' }}>
                Select Auction Week
              </h3>
              <p className="text-body" style={{ color: 'var(--text-muted)' }}>
                Choose an auction week from the dropdown above to view detailed market intelligence and trading data.
              </p>
            </div>
          </div>
        )}
      </>
    );
  };

  // If admin mode, render admin layout directly without public layout
  if (viewMode === 'admin') {
    return (
      <AdminLayout
        activeSection={adminSection}
        onSectionChange={handleAdminSectionChange}
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      >
        {renderAdminContent()}
      </AdminLayout>
    );
  }

  // Public page layout
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <Header 
        onToggleAdminView={() => setViewMode(viewMode === 'report' ? 'admin' : 'report')} 
        viewMode={viewMode} 
      />
      <main className="container mx-auto px-4 py-4">
        <div className="space-y-4">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-3 text-sm border-t" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-primary)' }}>
        <p>&copy; {new Date().getFullYear()} OVK Wool & Mohair Market Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
