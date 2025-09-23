import React from 'react';
import type { TopSale } from '../../types';

interface MobileTopSalesTableProps {
  data: TopSale[];
}

const MobileTopSalesTable: React.FC<MobileTopSalesTableProps> = ({ data }) => {
  // Calculate average price and RWS count
  const avgPrice = data.length > 0 ? data.reduce((sum, sale) => sum + sale.price_zar_per_kg_greasy, 0) / data.length : 0;
  const rwsCount = data.filter(sale => sale.certified).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ margin: '0 0.5rem' }}>
      {/* Header */}
      <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="adaptive-text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            TOP GREASY PRICES
          </h2>
          <p className="adaptive-text-xs text-gray-500">
            Highest performing lots
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-gray-50 border-b border-gray-200">
        <div className="text-center">
          <p className="adaptive-text-sm font-bold text-gray-900">{data.length}</p>
          <p className="adaptive-text-xs text-gray-500">Top Lots</p>
        </div>
        <div className="text-center">
          <p className="adaptive-text-sm font-bold text-emerald-600">
            R{avgPrice.toFixed(2)}
          </p>
          <p className="adaptive-text-xs text-gray-500">Avg Price</p>
        </div>
        <div className="text-center">
          <p className="adaptive-text-sm font-bold text-green-600">
            {rwsCount}/{data.length}
          </p>
          <p className="adaptive-text-xs text-gray-500">RWS Certified</p>
        </div>
      </div>
      
      {/* Sales List */}
      <div className="p-2">
        <div className="space-y-1">
          {data.map((sale, index) => (
            <div key={index} className="flex items-center justify-between py-1 px-1.5 bg-gray-50 rounded">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white" style={{ fontSize: '9px' }}>{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs leading-tight" style={{ color: 'var(--text-primary)', fontSize: '11px' }}>
                    {sale.farm}
                  </p>
                  <div className="flex items-center gap-0.5 text-gray-500" style={{ fontSize: '9px' }}>
                    <span className="truncate max-w-16">{sale.region}</span>
                    <span>•</span>
                    <span>{sale.micron_um.toFixed(1)}μ</span>
                    <span>•</span>
                    <span className="px-0.5 py-0 rounded bg-gray-200 text-gray-600">
                      {sale.type_code}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right ml-1 flex-shrink-0">
                <p className="text-xs font-bold" style={{ color: 'var(--accent-primary)', fontSize: '11px' }}>
                  R{sale.price_zar_per_kg_greasy.toFixed(2)}
                </p>
                {sale.certified ? (
                  <span className="inline-block px-1 py-0 rounded-full bg-green-100 text-green-600 font-medium" style={{ fontSize: '9px' }}>
                    RWS
                  </span>
                ) : (
                  <span className="inline-block px-1 py-0 rounded-full bg-gray-100 text-gray-500" style={{ fontSize: '9px' }}>
                    Standard
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileTopSalesTable;
