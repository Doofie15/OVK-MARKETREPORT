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
import BrokersGrid from './components/BrokersGrid';
import TopPerformers from './components/TopPerformers';
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                   <div className="lg:col-span-1">
                     <InsightsCard insights={activeReport.insights} />
                   </div>
                   <div className="lg:col-span-2">
                     <CurrencyDisplay currencies={activeReport.currencies} />
                   </div>
                </div>
                <MicronPriceChart data={activeReport.micron_prices} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
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
                <p className="text-xl text-gray-500">Please select an auction week to view the report.</p>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Header 
        onToggleAdminView={() => setViewMode(viewMode === 'report' ? 'admin_list' : 'report')} 
        viewMode={viewMode} 
      />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} OVK Wool & Mohair Market Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
