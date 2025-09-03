
import React from 'react';
import type { TopSale } from '../types';

interface TopSalesTableProps {
  data: TopSale[];
}

const CheckIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const TopSalesTable: React.FC<TopSalesTableProps> = ({ data }) => {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            TOP GREASY PRICES
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Highest performing lots
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
              {['FARM', 'REGION', 'LOTS', 'TYPE', 'MICRON', 'PRICE (ZAR/KG)', 'CERTIFIED', 'BUYER'].map(header => (
                <th key={header} className="text-left py-2 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((sale, index) => (
              <tr key={index} className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <td className="py-1 px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="font-medium text-xs">{sale.farm}</span>
                  </div>
                </td>
                <td className="py-1 px-2">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sale.region}</span>
                </td>
                <td className="py-1 px-2">
                  <span className="font-mono text-xs">{sale.lots_count}</span>
                </td>
                <td className="py-1 px-2">
                  <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {sale.type_code}
                  </span>
                </td>
                <td className="py-1 px-2">
                  <span className="font-mono text-xs" style={{ color: 'var(--accent-secondary)' }}>
                    {sale.micron_um.toFixed(1)}
                  </span>
                </td>
                <td className="py-1 px-2">
                  <span className="font-bold text-xs" style={{ color: 'var(--accent-primary)' }}>
                    R{sale.price_zar_per_kg_greasy.toFixed(2)}
                  </span>
                </td>
                <td className="py-1 px-2 text-center">
                  {sale.certified ? (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                      RWS
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
                <td className="py-1 px-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {sale.buyer_name}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 pt-2 border-t text-xs" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }}>
            Top {data.length} lots
          </span>
          <div className="flex items-center gap-3">
            <span style={{ color: 'var(--text-muted)' }}>
              Avg: 
              <span className="ml-1 font-bold" style={{ color: 'var(--accent-primary)' }}>
                R{(data.reduce((sum, sale) => sum + sale.price_zar_per_kg_greasy, 0) / data.length).toFixed(2)}
              </span>
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              RWS: 
              <span className="ml-1 font-bold" style={{ color: 'var(--accent-success)' }}>
                {data.filter(sale => sale.certified).length}/{data.length}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSalesTable;
