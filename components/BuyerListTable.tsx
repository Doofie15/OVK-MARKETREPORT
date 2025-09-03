
import React from 'react';
import type { Buyer } from '../types';

interface BuyerListTableProps {
  data: Buyer[];
}

const BuyerListTable: React.FC<BuyerListTableProps> = ({ data }) => {
  return (
    <section className="section">
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-title" style={{ color: 'var(--text-primary)' }}>
              BUYERS DIRECTORY
            </h2>
            <p className="text-small" style={{ color: 'var(--text-muted)' }}>
              Complete buyer participation metrics
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="modern-table">
            <thead>
              <tr>
                {['Company', 'Volume (Bales)', '% Share', 'YTD Bales'].map(header => (
                  <th key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((buyer, index) => (
                <tr key={index}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          background: `linear-gradient(135deg, ${['#64ffda', '#7c3aed', '#06b6d4', '#8b5cf6', '#10b981'][index % 5]}, ${['#7c3aed', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'][index % 5]})` 
                        }}
                      ></div>
                      <span className="font-medium">{buyer.buyer}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono">{buyer.cat.toLocaleString()}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{buyer.share_pct.toFixed(1)}%</span>
                      <div className="w-16 h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${buyer.share_pct}%`, 
                            background: `linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))`
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono" style={{ color: 'var(--accent-primary)' }}>
                      {buyer.bales_ytd.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default BuyerListTable;
