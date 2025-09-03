import React from 'react';
import type { MicronPrice } from '../types';

interface AuctionComparisonProps {
  currentData: MicronPrice[];
  previousData?: MicronPrice[];
}

const AuctionComparison: React.FC<AuctionComparisonProps> = ({ currentData, previousData }) => {
  if (!previousData || previousData.length === 0) {
    return null;
  }

  const sortedCurrentData = [...currentData].sort((a, b) => parseFloat(a.bucket_micron) - parseFloat(b.bucket_micron));
  const sortedPreviousData = [...previousData].sort((a, b) => parseFloat(a.bucket_micron) - parseFloat(b.bucket_micron));

  // Create comparison data for the table
  const comparisonData = sortedCurrentData.map(current => {
    const previous = sortedPreviousData.find(p => p.bucket_micron === current.bucket_micron);
    const previousPrice = previous?.price_clean_zar_per_kg || 0;
    const currentPrice = current.price_clean_zar_per_kg;
    const percentChange = previousPrice > 0 ? ((currentPrice - previousPrice) / previousPrice) * 100 : 0;
    
    return {
      micron: current.bucket_micron,
      category: current.category,
      previousPrice,
      currentPrice,
      percentChange
    };
  });

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Auction Comparison
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Price changes vs previous auction
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-2 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Micron</th>
              <th className="px-2 py-2 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Category</th>
              <th className="px-2 py-2 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>Previous</th>
              <th className="px-2 py-2 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>Current</th>
              <th className="px-2 py-2 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>Change</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <tr key={item.micron} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                <td className="px-2 py-1">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {item.micron}µm
                  </span>
                </td>
                <td className="px-2 py-1">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.category === 'Fine' ? 'bg-blue-100 text-blue-700' :
                    item.category === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {item.category}
                  </span>
                </td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {item.previousPrice > 0 ? `R${item.previousPrice.toFixed(2)}` : 'N/A'}
                </td>
                <td className="px-2 py-1 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>
                  R{item.currentPrice.toFixed(2)}
                </td>
                <td className="px-2 py-1 text-right font-semibold">
                  {item.previousPrice > 0 ? (
                    <span className={`inline-flex items-center gap-1 ${
                      item.percentChange > 0 ? 'text-green-600' : 
                      item.percentChange < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {item.percentChange > 0 && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {item.percentChange < 0 && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {Math.abs(item.percentChange).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuctionComparison;
