
import React from 'react';
import type { Buyer } from '../types';

interface BuyerListTableProps {
  data: Buyer[];
}

const BuyerListTable: React.FC<BuyerListTableProps> = ({ data }) => {
  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            BUYERS DIRECTORY
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Complete buyer metrics
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
              {['Company', 'Volume (Bales)', '% Share', 'YTD Bales'].map(header => (
                <th key={header} className="text-left py-2 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((buyer, index) => (
              <tr key={index} className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <td className="py-1 px-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        background: `linear-gradient(135deg, ${['#0ea5e9', '#6366f1', '#06b6d4', '#8b5cf6', '#10b981'][index % 5]}, ${['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'][index % 5]})` 
                      }}
                    ></div>
                    <span className="font-medium text-xs">{buyer.buyer}</span>
                  </div>
                </td>
                <td className="py-1 px-2">
                  <span className="font-mono text-xs">{buyer.cat.toLocaleString()}</span>
                </td>
                <td className="py-1 px-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs">{buyer.share_pct.toFixed(1)}%</span>
                    <div className="w-12 h-1.5 rounded-full bg-gray-200">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${buyer.share_pct}%`, 
                          background: `linear-gradient(90deg, #0ea5e9, #6366f1)`
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-1 px-2">
                  <span className="font-mono text-xs" style={{ color: 'var(--accent-primary)' }}>
                    {buyer.bales_ytd.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuyerListTable;
