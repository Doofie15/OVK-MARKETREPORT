import React, { useState, useMemo } from 'react';
import { MOCK_REPORTS } from './constants';
import type { AuctionReport, TopSale, Indicator, Buyer, BrokerData } from './types';
import Header from './components/Header';
import AuctionSelector from './components/AuctionSelector';
import IndicatorsGrid from './components/IndicatorsGrid';
import MicronPriceChart from './components/MicronPriceChart';
import TopSalesTable from './components/TopSalesTable';
import CurrencyDisplay from './components/CurrencyDisplay';
import InsightsCard from './components/InsightsCard';
import MarketTrends from './components/MarketTrends';
import BuyerListTable from './components/BuyerListTable';
import BuyerShareChart from './components/BuyerShareChart';
import BrokersGrid from './components/BrokersGrid';
import TopPerformers from './components/TopPerformers';
import VolumeAnalytics from './components/VolumeAnalytics';
import ProfileSection from './components/ProfileSection';
import AuctionsList from './components/admin/AuctionsList';
import AdminForm from './components/admin/AdminForm';

type ViewMode = 'report' | 'admin_list' | 'admin_form';

const App: React.FC = () => {
  const [reports, setReports] = useState<AuctionReport[]>(MOCK_REPORTS);
  const [selectedWeekId, setSelectedWeekId] = useState<string>(reports[0].auction.week_id);
  const [viewMode, setViewMode] = useState<ViewMode>('report');

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

  const activeReport: AuctionReport | undefined = useMemo(() => 
    reports.find(report => report.auction.week_id === selectedWeekId), 
    [reports, selectedWeekId]
  );
  
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

  const renderContent = () => {
    switch (viewMode) {
      case 'admin_list':
        return <AuctionsList reports={reports} onAddNew={() => setViewMode('admin_form')} />;
      case 'admin_form':
        return <AdminForm onSave={handleSaveReport} onCancel={() => setViewMode('admin_list')} latestReport={reports[0]} />;
      case 'report':
      default:
        return (
          <>
            <AuctionSelector
              weeks={availableWeeks}
              selectedWeekId={selectedWeekId}
              onWeekChange={setSelectedWeekId}
            />
            {activeReport ? (
              <div className="space-y-8 mt-8">
                <IndicatorsGrid 
                  indicators={activeReport.indicators} 
                  benchmarks={activeReport.benchmarks}
                  yearly_average_prices={activeReport.yearly_average_prices}
                />
                
                <ProfileSection />
                
                <div className="grid-responsive cols-1 lg-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <InsightsCard insights={activeReport.insights} />
                  </div>
                  <div className="lg:col-span-2">
                    <CurrencyDisplay currencies={activeReport.currencies} />
                  </div>
                </div>
                
                <MicronPriceChart data={activeReport.micron_prices} />
                
                <VolumeAnalytics />
                
                <div className="grid-responsive cols-1 lg-cols-2 gap-8">
                  <BuyerShareChart data={activeReport.buyers.slice(0, 6)} />
                  <div className="chart-container">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-title" style={{ color: 'var(--text-primary)' }}>
                          EMERGING TRENDS
                        </h2>
                        <p className="text-small" style={{ color: 'var(--text-muted)' }}>
                          Market intelligence and insights
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                        <div>
                          <p className="text-body" style={{ color: 'var(--text-primary)' }}>
                            Demand for sustainable wool products rises.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
                        <div>
                          <p className="text-body" style={{ color: 'var(--text-primary)' }}>
                            Supply chain stability and ethical sourcing.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                        <div>
                          <p className="text-body" style={{ color: 'var(--text-primary)' }}>
                            New interest in Southeast Asia client growth potential.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid-responsive cols-1 lg-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <BuyerListTable data={activeReport.buyers} />
                  </div>
                  <div className="lg:col-span-1">
                    <BrokersGrid data={activeReport.brokers} />
                  </div>
                </div>
                
                <TopSalesTable data={topSalesForActiveReport.slice(0, 5)} />
                <MarketTrends data={activeReport.trends} />
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
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)' }}>
      <Header 
        onToggleAdminView={() => setViewMode(viewMode === 'report' ? 'admin_list' : 'report')} 
        viewMode={viewMode} 
      />
      <main className="container mx-auto p-4 md:p-8">
        <div className="fade-in-up">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-6" style={{ color: 'var(--text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} OVK Wool & Mohair Market Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
