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
  
  const NavButton: React.FC<{view: View, label: string, icon: React.ReactNode}> = ({ view, label, icon }) => {
      const isActive = activeView === view;
      return (
        <button
            onClick={() => setActiveView(view)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                isActive 
                  ? 'text-white' 
                  : 'hover:bg-gray-100'
            }`}
            style={{
              background: isActive 
                ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' 
                : 'white',
              color: isActive ? '#ffffff' : 'var(--text-primary)',
              border: isActive ? 'none' : '1px solid var(--border-primary)'
            }}
        >
            <div className={`w-4 h-4 flex items-center justify-center ${
              isActive ? 'text-white' : ''
            }`}>
              {icon}
            </div>
            {label}
        </button>
      )
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          TOP PERFORMERS
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <aside className="lg:col-span-1">
          <nav className="space-y-1">
            <NavButton 
              view="auction" 
              label="Top 10 Producers" 
              icon={
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
            />
            <NavButton 
              view="province" 
              label="Provincial Producers" 
              icon={
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
            <NavButton 
              view="map" 
              label="Price Map" 
              icon={
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              }
            />
          </nav>
        </aside>
        
        <main className="lg:col-span-3">
          <div className="bg-gray-50 rounded-lg p-3">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TopPerformers;
