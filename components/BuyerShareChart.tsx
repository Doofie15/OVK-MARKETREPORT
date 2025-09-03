
import React from 'react';
import type { Buyer } from '../types';

interface BuyerShareChartProps {
  data: Buyer[];
}

const BuyerShareChart: React.FC<BuyerShareChartProps> = ({ data }) => {
  const colors = ['#0ea5e9', '#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
  
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            TOP BUYERS & MARKET SHARE
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Market participation by volume
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
              <th className="text-left py-2 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Rank</th>
              <th className="text-left py-2 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Company</th>
              <th className="text-right py-2 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Volume</th>
              <th className="text-right py-2 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Share</th>
            </tr>
          </thead>
          <tbody>
            {data.map((buyer, index) => (
              <tr key={index} className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <td className="py-2 px-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" 
                        style={{ 
                          background: `linear-gradient(135deg, ${colors[index % colors.length]}, ${colors[(index + 1) % colors.length]})`
                        }}>
                    {index + 1}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        background: `linear-gradient(135deg, ${colors[index % colors.length]}, ${colors[(index + 1) % colors.length]})` 
                      }}
                    ></div>
                    <span className="font-medium text-xs">{buyer.buyer}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-right">
                  <span className="font-mono text-xs">{buyer.cat.toLocaleString()}</span>
                </td>
                <td className="py-2 px-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-bold text-xs" style={{ color: 'var(--accent-primary)' }}>
                      {buyer.share_pct.toFixed(1)}%
                    </span>
                    <div className="w-12 h-1.5 rounded-full bg-gray-200">
                      <div 
                        className="h-full rounded-full transition-all duration-700"
                        style={{ 
                          width: `${buyer.share_pct}%`, 
                          background: `linear-gradient(90deg, ${colors[index % colors.length]}, ${colors[(index + 1) % colors.length]})`
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 pt-2 text-xs border-t" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }}>
            {data.length} companies
          </span>
          <span style={{ color: 'var(--accent-primary)' }}>
            {data.reduce((sum, buyer) => sum + buyer.cat, 0).toLocaleString()} bales
          </span>
        </div>
      </div>
    </div>
  );
};

export default BuyerShareChart;
