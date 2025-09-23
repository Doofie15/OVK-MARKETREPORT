import React from 'react';
import type { TopSale, ProvincialProducerData } from '../types';
import ProvincialTopProducers from './ProvincialTopProducers';

interface TopPerformersProps {
  topSales: TopSale[];
  provincialProducers: ProvincialProducerData[];
  publishedDate?: Date;
}

const TopPerformers: React.FC<TopPerformersProps> = ({ topSales, provincialProducers, publishedDate }) => {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          TOP PERFORMERS
        </h2>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3">
        <ProvincialTopProducers data={provincialProducers} publishedDate={publishedDate} />
      </div>
    </div>
  );
};

export default TopPerformers;