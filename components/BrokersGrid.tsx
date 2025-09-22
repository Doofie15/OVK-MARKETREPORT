import React from 'react';
import type { BrokerData } from '../types';

interface BrokersGridProps {
  data: BrokerData[];
}

const BrokersGrid: React.FC<BrokersGridProps> = ({ data }) => {
  const colors = ['#0ea5e9', '#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
  
  // Sort data by bales offered from high to low
  const sortedData = [...data].sort((a, b) => b.catalogue_offering - a.catalogue_offering);
  
  // Calculate totals
  const totalOffered = sortedData.reduce((sum, broker) => sum + broker.catalogue_offering, 0);
  const totalSold = sortedData.reduce((sum, broker) => sum + broker.sold_ytd, 0);
  
  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            BROKERS
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Offered vs sold
          </p>
        </div>
      </div>
      
      {/* Header */}
      <div className="grid grid-cols-3 gap-1 mb-1 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
        <div className="text-center">OFFERED</div>
        <div className="text-center">BROKER</div>
        <div className="text-center">SOLD</div>
      </div>
      
      <div className="space-y-1 flex-1">
        {sortedData.map((broker, index) => {
          const clearanceRate = broker.catalogue_offering > 0 
            ? (broker.sold_ytd / broker.catalogue_offering * 100) 
            : 0;
          
          return (
            <div key={broker.name} className="grid grid-cols-3 gap-1 items-center py-1 px-1 rounded bg-gray-50">
              {/* Offered */}
              <div className="flex items-center justify-center gap-1">
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: colors[index % colors.length] }}
                ></div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {broker.catalogue_offering.toLocaleString()}
                </span>
              </div>
              
              {/* Broker Name */}
              <div className="text-center">
                <div className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>
                  {broker.name}
                </div>
                {broker.catalogue_offering > 0 && (
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {clearanceRate.toFixed(0)}%
                  </div>
                )}
              </div>
              
              {/* Sold */}
              <div className="text-center">
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {broker.sold_ytd.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-2 pt-2 border-t text-xs" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="grid grid-cols-3 gap-1">
          <div className="text-center">
            <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
              {totalOffered.toLocaleString()}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Offered</div>
          </div>
          <div className="text-center">
            <div className="font-bold" style={{ color: 'var(--accent-primary)' }}>
              {sortedData.length}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Brokers</div>
          </div>
          <div className="text-center">
            <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
              {totalSold.toLocaleString()}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Sold</div>
          </div>
        </div>
        {totalOffered > 0 && (
          <div className="text-center mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            {((totalSold / totalOffered) * 100).toFixed(1)}% clearance
          </div>
        )}
      </div>
    </div>
  );
};

export default BrokersGrid;