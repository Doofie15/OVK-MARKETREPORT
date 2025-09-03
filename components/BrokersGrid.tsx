import React from 'react';
import type { BrokerData } from '../types';

interface BrokersGridProps {
  data: BrokerData[];
}

const BrokersGrid: React.FC<BrokersGridProps> = ({ data }) => {
  const colors = ['#0ea5e9', '#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
  
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            BROKERS
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Catalogue vs sales
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        {data.map((broker, index) => (
          <div key={broker.name} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ background: colors[index % colors.length] }}
              ></div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {broker.catalogue_offering.toLocaleString()}
              </span>
            </div>
            
            <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>
              {broker.name}
            </span>
            
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {broker.sold_ytd.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t text-xs" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }}>
            {data.length} brokers
          </span>
          <span style={{ color: 'var(--accent-primary)' }}>
            {data.reduce((sum, broker) => sum + broker.catalogue_offering, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BrokersGrid;