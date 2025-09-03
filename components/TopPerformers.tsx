import React, { useState } from 'react';
import type { TopSale, ProvincialProducerData, ProvinceAveragePrice } from '../types';
import AuctionTopProducers from './AuctionTopProducers';
import ProvincialTopProducers from './ProvincialTopProducers';
import ProvincePriceMap from './ProvincePriceMap';

interface TopPerformersProps {
  topSales: TopSale[];
  provincialProducers: ProvincialProducerData[];
  provinceAvgPrices: ProvinceAveragePrice[];
}

type View = 'auction' | 'province' | 'map';

const TopPerformers: React.FC<TopPerformersProps> = ({ topSales, provincialProducers, provinceAvgPrices }) => {
  const [activeView, setActiveView] = useState<View>('auction');

  const renderView = () => {
    switch (activeView) {
      case 'auction':
        return <AuctionTopProducers data={topSales} />;
      case 'province':
        return <ProvincialTopProducers data={provincialProducers} />;
      case 'map':
        return <ProvincePriceMap data={provinceAvgPrices} />;
      default:
        return null;
    }
  };
  
  const NavButton: React.FC<{view: View, label: string}> = ({ view, label }) => {
      const isActive = activeView === view;
      return (
        <button
            onClick={() => setActiveView(view)}
            className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                isActive ? 'bg-brand-primary text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
        >
            {label}
        </button>
      )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-brand-primary mb-4">Top Performers</h2>
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4 lg:w-1/5">
                <nav className="space-y-2">
                    <NavButton view="auction" label="Top 10 Producers (Auction)" />
                    <NavButton view="province" label="Top Producers (Province)" />
                    <NavButton view="map" label="Provincial Price Map" />
                </nav>
            </aside>
            <main className="flex-1">
                {renderView()}
            </main>
        </div>
    </div>
  );
};

export default TopPerformers;
