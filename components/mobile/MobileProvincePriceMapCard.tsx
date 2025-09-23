import React from 'react';
import MobileProvincePriceMap from './MobileProvincePriceMap';
import type { ProvinceAveragePrice } from '../../types';

interface MobileProvincePriceMapCardProps {
  data: ProvinceAveragePrice[];
}

const MobileProvincePriceMapCard: React.FC<MobileProvincePriceMapCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ margin: '0 0.5rem' }}>
      {/* Header */}
      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          PROVINCIAL PRICE MAP
        </h2>
      </div>
      
      {/* Map Content */}
      <div className="p-2" style={{ minHeight: '250px', height: 'auto' }}>
        <MobileProvincePriceMap data={data} />
      </div>
    </div>
  );
};

export default MobileProvincePriceMapCard;
