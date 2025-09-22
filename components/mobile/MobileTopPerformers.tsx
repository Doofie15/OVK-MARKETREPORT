import React from 'react';
import type { TopSale, ProvincialProducerData } from '../../types';
import MobileProvincialTopProducers from './MobileProvincialTopProducers';

interface MobileTopPerformersProps {
  topSales: TopSale[];
  provincialProducers: ProvincialProducerData[];
}

const MobileTopPerformers: React.FC<MobileTopPerformersProps> = ({ 
  topSales, 
  provincialProducers
}) => {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          TOP PERFORMERS
        </h2>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-2">
        <MobileProvincialTopProducers data={provincialProducers} />
      </div>
    </div>
  );
};

export default MobileTopPerformers;