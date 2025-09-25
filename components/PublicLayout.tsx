import React from 'react';
import PublicHeader from './PublicHeader';
import AuctionSelector from './AuctionSelector';
import IndicatorsGrid from './IndicatorsGrid';
import MarketGlossary from './MarketGlossary';
import MicronPriceChart from './MicronPriceChart';
import AuctionComparison from './AuctionComparison';
import MarketOverview from './MarketOverview';
import TopSalesTable from './TopSalesTable';
import InsightsCard from './InsightsCard';
import MarketTrends from './MarketTrends';
import BuyerListTable from './BuyerListTable';
import BuyerShareChart from './BuyerShareChart';
import BrokersGrid from './BrokersGrid';
import TopPerformers from './TopPerformers';
import ProvincePriceMapCard from './ProvincePriceMapCard';
import { 
  MobileLayout, 
  MobileBrokersGrid, 
  MobileMarketTrends, 
  MobileBuyerShareChart,
  MobileTopPerformers,
  MobileProvincePriceMapCard,
  EnhancedMobileLayout,
  MobileTopSalesTable,
  MobileMarketOverview,
  MobileAuctionComparison
} from './mobile';
import SafeMobileLayout from './SafeMobileLayout';
import { getVersionString } from '../config/version';
import type { AuctionReport, TopSale } from '../types';

interface PublicLayoutProps {
  reports: AuctionReport[];
  selectedWeekId: string;
  onWeekChange: (weekId: string) => void;
  error?: string | null;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  reports, 
  selectedWeekId, 
  onWeekChange,
  error 
}) => {
  const activeReport = reports.find(report => report.auction.week_id === selectedWeekId);
  
  const previousReport = (() => {
    const currentIndex = reports.findIndex(r => r.auction.week_id === selectedWeekId);
    return currentIndex > 0 ? reports[currentIndex - 1] : 
           currentIndex === 0 && reports.length > 1 ? reports[1] : undefined;
  })();

  const rwsPremium = (() => {
    if (!activeReport?.yearly_average_prices) return 0;
    
    const certifiedPrice = activeReport.yearly_average_prices.find(p => p.label.includes('Certified Wool'))?.value || 0;
    const allMerinoPrice = activeReport.yearly_average_prices.find(p => p.label.includes('All - Merino Wool'))?.value || 0;
    
    if (allMerinoPrice > 0) {
      return ((certifiedPrice - allMerinoPrice) / allMerinoPrice) * 100;
    }
    return 0;
  })();
  
  const topSalesForActiveReport = ((): TopSale[] => {
    if (!activeReport) return [];
    return activeReport.provincial_producers
        .flatMap(p => p.producers)
        .sort((a, b) => b.price - a.price)
        .map((p, index) => ({
            position: index + 1,
            farm: p.name,
            region: p.district,
            price_zar_per_kg_greasy: p.price,
            micron_um: p.micron || 0,
            certified: p.certified === 'RWS',
            buyer_name: p.buyer_name,
            lots_count: 1,
            type_code: p.description || 'N/A',
        }));
  })();

  const availableWeeks = reports.map(report => ({
    id: report.auction.week_id,
    label: `${report.auction.catalogue_name || `Week ${report.auction.week_id.split('_')[2]}`} (${new Date(report.auction.auction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`
  })).sort((a,b) => b.id.localeCompare(a.id));

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <PublicHeader />
      <main className="w-full max-w-none mx-auto px-0 sm:px-4 py-2 sm:py-4" data-testid="main-content">
        <div className="space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-yellow-800 text-sm">
                  <strong>Notice:</strong> {error}
                </p>
              </div>
            </div>
          )}
          <AuctionSelector
            weeks={availableWeeks}
            selectedWeekId={selectedWeekId}
            onWeekChange={onWeekChange}
          />
          {activeReport ? (
            <div className="space-y-0 sm:space-y-4 mobile-spacing-fix">
              {/* Prominent Auction Title */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-4 sm:p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                      {activeReport.auction.catalogue_name || `Auction ${activeReport.auction.week_id}`}
                    </h1>
                    <div className="flex items-center gap-2 text-blue-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-lg font-semibold">
                        {new Date(activeReport.auction.auction_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-100 text-sm mb-1">Season</div>
                    <div className="text-2xl font-bold">{activeReport.auction.season_label}</div>
                  </div>
                </div>
              </div>

              <IndicatorsGrid 
                indicators={activeReport.indicators} 
                benchmarks={activeReport.benchmarks}
                yearly_average_prices={activeReport.yearly_average_prices}
              />

              <MarketGlossary />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <InsightsCard insights={activeReport.insights} />
                </div>
                <div className="xl:col-span-2">
                  <EnhancedMobileLayout
                    mobileComponent={
                      <MobileMarketOverview
                        currencies={activeReport.currencies}
                        rwsPremium={rwsPremium}
                        currentAuctionDate={activeReport.auction.auction_date}
                        currentCatalogue={activeReport.auction.catalogue_name}
                      />
                    }
                  >
                    <MarketOverview 
                      currencies={activeReport.currencies}
                      rwsPremium={rwsPremium}
                      currentAuctionDate={activeReport.auction.auction_date}
                      currentCatalogue={activeReport.auction.catalogue_name}
                    />
                  </EnhancedMobileLayout>
                </div>
              </div>
              
              <SafeMobileLayout
                mobileComponent={
                  <>
                    <MicronPriceChart 
                      data={activeReport.micron_prices} 
                      previousData={previousReport?.micron_prices}
                      catalogueName={activeReport.auction.catalogue_name}
                      currentAuction={activeReport.auction}
                      previousAuction={previousReport?.auction}
                    />
                    <MobileBuyerShareChart data={activeReport.buyers.slice(0, 6)} />
                  </>
                }
              >
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 items-stretch">
                  <div className="xl:col-span-2">
                    <MicronPriceChart 
                      data={activeReport.micron_prices} 
                      previousData={previousReport?.micron_prices}
                      catalogueName={activeReport.auction.catalogue_name}
                      currentAuction={activeReport.auction}
                      previousAuction={previousReport?.auction}
                    />
                  </div>
                  <div className="flex flex-col">
                    <BuyerShareChart data={activeReport.buyers.slice(0, 6)} />
                  </div>
                </div>
              </SafeMobileLayout>

              <MobileLayout
                mobileComponent={
                  <MobileAuctionComparison 
                    currentData={activeReport.micron_prices}
                    previousData={previousReport?.micron_prices}
                  />
                }
              >
                <AuctionComparison 
                  currentData={activeReport.micron_prices}
                  previousData={previousReport?.micron_prices}
                />
              </MobileLayout>

              <MobileLayout
                mobileComponent={<MobileMarketTrends data={activeReport.trends} />}
              >
                <MarketTrends data={activeReport.trends} />
              </MobileLayout>
              
              <div className="equal-height-cards">
                <BuyerListTable data={activeReport.buyers} />
                <MobileLayout
                  mobileComponent={<MobileBrokersGrid data={activeReport.brokers} />}
                >
                  <BrokersGrid data={activeReport.brokers} />
                </MobileLayout>
              </div>
              
              <EnhancedMobileLayout
                mobileComponent={
                  <MobileTopSalesTable data={topSalesForActiveReport.slice(0, 10)} />
                }
              >
                <TopSalesTable data={topSalesForActiveReport.slice(0, 10)} />
              </EnhancedMobileLayout>
              
              <EnhancedMobileLayout
                mobileComponent={
                  <MobileTopPerformers 
                    topSales={topSalesForActiveReport}
                    provincialProducers={activeReport.provincial_producers}
                  />
                }
                enableDebug={window.location.search.includes('debug=true')}
              >
                <TopPerformers 
                  topSales={topSalesForActiveReport}
                  provincialProducers={activeReport.provincial_producers}
                />
              </EnhancedMobileLayout>
              
              <EnhancedMobileLayout
                mobileComponent={
                  <MobileProvincePriceMapCard 
                    data={activeReport.provincial_producers}
                  />
                }
              >
                <ProvincePriceMapCard 
                  data={activeReport.provincial_producers}
                />
              </EnhancedMobileLayout>
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
        </div>
      </main>
      <footer className="text-center py-3 text-sm border-t" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-primary)' }}>
        <p>&copy; {new Date().getFullYear()} OVK Wool & Mohair Market Platform. All rights reserved. • {getVersionString()}</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
