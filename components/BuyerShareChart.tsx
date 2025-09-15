
import React from 'react';
import type { Buyer } from '../types';

interface BuyerShareChartProps {
  data: Buyer[];
}

const BuyerShareChart: React.FC<BuyerShareChartProps> = ({ data }) => {
  // Sort buyers by market share percentage (descending)
  const sortedData = [...data].sort((a, b) => b.share_pct - a.share_pct);
  
  // Color palette for visual indicators
  const colors = ['#64ffda', '#7c3aed', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="card h-full flex flex-col">
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
            Current auction performance by volume share
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-2 text-left font-semibold border-r border-gray-200" style={{ color: 'var(--text-primary)' }}>Rank</th>
              <th className="px-2 py-2 text-left font-semibold border-r border-gray-200" style={{ color: 'var(--text-primary)' }}>Buyer</th>
              <th className="px-2 py-2 text-right font-semibold border-r border-gray-200" style={{ color: 'var(--text-primary)' }}>Market Share</th>
              <th className="px-2 py-2 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>Bales (Auction)</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((buyer, index) => (
              <tr key={buyer.buyer} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                <td className="px-2 py-1 border-r border-gray-200">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      #{index + 1}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1 border-r border-gray-200">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {buyer.buyer}
                  </span>
                </td>
                <td className="px-2 py-1 text-right border-r border-gray-200">
                  <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                    {buyer.share_pct.toFixed(1)}%
                  </span>
                </td>
                <td className="px-2 py-1 text-right">
                  <span className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                    {buyer.cat.toLocaleString()}
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

export default BuyerShareChart;
