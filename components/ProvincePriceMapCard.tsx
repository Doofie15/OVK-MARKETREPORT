import React from 'react';
import ProvincePriceMap from './ProvincePriceMap';
import type { ProvincialProducerData } from '../types';

interface ProvincePriceMapCardProps {
  data: ProvincialProducerData[];
}

const ProvincePriceMapCard: React.FC<ProvincePriceMapCardProps> = ({ data }) => {
  console.log('🔍 ProvincePriceMapCard received data:', data);
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          PROVINCIAL TOP 10 PRICES
        </h2>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3" style={{ minHeight: '500px', height: 'auto' }}>
        <ProvincePriceMap data={data} />
      </div>
    </div>
  );
};

export default ProvincePriceMapCard;
