import React from 'react';
import type { BrokerData } from '../types';

interface BrokersGridProps {
  data: BrokerData[];
}

const BrokersGrid: React.FC<BrokersGridProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
        <h2 className="text-xl font-bold text-brand-primary mb-4">Brokers</h2>
        <div className="flex justify-between items-center mb-2 text-xs text-gray-500 px-3">
            <span>Catalogue Offering</span>
            <span>Sold YTD</span>
        </div>
        <div className="space-y-2">
            {data.map((broker) => (
                <div key={broker.name} className="p-3 rounded-md flex justify-between items-center" style={{backgroundColor: '#E9E3D9'}}>
                    <span className="w-1/3 text-left text-sm font-semibold text-gray-700">{broker.catalogue_offering.toLocaleString()}</span>
                    <h3 className="w-1/3 text-center text-md font-bold text-brand-primary">{broker.name}</h3>
                    <span className="w-1/3 text-right text-sm font-semibold text-gray-700">{broker.sold_ytd.toLocaleString()}</span>
                </div>
            ))}
        </div>
    </div>
  );
};

export default BrokersGrid;