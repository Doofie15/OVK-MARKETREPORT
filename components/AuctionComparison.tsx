import React from 'react';
import type { MicronPrice } from '../types';

interface AuctionComparisonProps {
  currentData: MicronPrice[];
  previousData?: MicronPrice[];
}

const AuctionComparison: React.FC<AuctionComparisonProps> = ({ currentData, previousData }) => {
  // Debug logging
  console.log('🔍 AuctionComparison currentData:', currentData);
  console.log('🔍 AuctionComparison previousData:', previousData);
  
  // Show current data even if no previous data is available
  if (!currentData || currentData.length === 0) {
    console.log('🔍 AuctionComparison: No current data available');
    return null;
  }

  const sortedCurrentData = [...currentData].sort((a, b) => parseFloat(a.bucket_micron) - parseFloat(b.bucket_micron));
  const sortedPreviousData = previousData && previousData.length > 0 
    ? [...previousData].sort((a, b) => parseFloat(a.bucket_micron) - parseFloat(b.bucket_micron))
    : [];

  // Create comparison data for the table
  const comparisonData = sortedCurrentData.map(current => {
    const previous = sortedPreviousData.find(p => p.bucket_micron === current.bucket_micron);
    
    // Certified pricing
    const prevCertified = previous?.certified_price_clean_zar_per_kg || previous?.price_clean_zar_per_kg || 0;
    const currCertified = current.certified_price_clean_zar_per_kg || current.price_clean_zar_per_kg;
    const certifiedChange = prevCertified > 0 ? ((currCertified - prevCertified) / prevCertified) * 100 : 0;
    
    // All Merino pricing
    const prevAllMerino = previous?.all_merino_price_clean_zar_per_kg || previous?.price_clean_zar_per_kg || 0;
    const currAllMerino = current.all_merino_price_clean_zar_per_kg || current.price_clean_zar_per_kg;
    const allMerinoChange = prevAllMerino > 0 ? ((currAllMerino - prevAllMerino) / prevAllMerino) * 100 : 0;
    
    return {
      micron: current.bucket_micron,
      category: current.category,
      certified: {
        previous: prevCertified,
        current: currCertified,
        change: certifiedChange
      },
      allMerino: {
        previous: prevAllMerino,
        current: currAllMerino,
        change: allMerinoChange
      }
    };
  });

  const renderChangeIndicator = (change: number) => {
    if (change === 0) return <span className="text-gray-400">-</span>;
    
    return (
      <span className={`inline-flex items-center gap-1 ${
        change > 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        {change > 0 && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {change < 0 && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

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
            {previousData && previousData.length > 0 
              ? 'Price changes vs previous auction' 
              : 'Current auction micron price data'}
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-2 text-left font-semibold border-r border-gray-200" style={{ color: 'var(--text-primary)' }}>Micron</th>
              <th className="px-2 py-2 text-left font-semibold border-r border-gray-200" style={{ color: 'var(--text-primary)' }}>Category</th>
              <th className="px-2 py-2 text-center font-semibold border-l-2 border-blue-200 bg-blue-100" style={{ color: 'var(--text-primary)' }} colSpan={previousData && previousData.length > 0 ? 3 : 1}>
                Certified {previousData && previousData.length > 0 ? '(Previous & Current) Change' : 'Current Prices'}
              </th>
              <th className="px-2 py-2 text-center font-semibold border-l-2 border-green-200 bg-green-100" style={{ color: 'var(--text-primary)' }} colSpan={previousData && previousData.length > 0 ? 3 : 1}>
                All Merino {previousData && previousData.length > 0 ? '(Previous & Current) Change' : 'Current Prices'}
              </th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border-r border-gray-200"></th>
              <th className="border-r border-gray-200"></th>
              {previousData && previousData.length > 0 ? (
                <>
                  <th className="px-1 py-1 text-right font-medium text-xs border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-secondary)' }}>Prev</th>
                  <th className="px-1 py-1 text-right font-medium text-xs border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-secondary)' }}>Curr</th>
                  <th className="px-1 py-1 text-right font-medium text-xs border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-secondary)' }}>Change</th>
                  <th className="px-1 py-1 text-right font-medium text-xs border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-secondary)' }}>Prev</th>
                  <th className="px-1 py-1 text-right font-medium text-xs border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-secondary)' }}>Curr</th>
                  <th className="px-1 py-1 text-right font-medium text-xs border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-secondary)' }}>Change</th>
                </>
              ) : (
                <>
                  <th className="px-1 py-1 text-right font-medium text-xs border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-secondary)' }}>Certified</th>
                  <th className="px-1 py-1 text-right font-medium text-xs border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-secondary)' }}>All Merino</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <tr key={item.micron} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                <td className="px-2 py-1 border-r border-gray-200">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {item.micron}µm
                  </span>
                </td>
                <td className="px-2 py-1 border-r border-gray-200">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.category === 'Fine' ? 'bg-blue-100 text-blue-700' :
                    item.category === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {item.category}
                  </span>
                </td>
                {/* Certified columns */}
                {previousData && previousData.length > 0 ? (
                  <>
                    <td className="px-1 py-1 text-right font-medium border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-secondary)' }}>
                      R{item.certified.previous.toFixed(2)}
                    </td>
                    <td className="px-1 py-1 text-right font-semibold border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-primary)' }}>
                      R{item.certified.current.toFixed(2)}
                    </td>
                    <td className="px-1 py-1 text-right font-semibold border-l-2 border-blue-200 bg-blue-25">
                      {renderChangeIndicator(item.certified.change)}
                    </td>
                    {/* All Merino columns */}
                    <td className="px-1 py-1 text-right font-medium border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-secondary)' }}>
                      R{item.allMerino.previous.toFixed(2)}
                    </td>
                    <td className="px-1 py-1 text-right font-semibold border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-primary)' }}>
                      R{item.allMerino.current.toFixed(2)}
                    </td>
                    <td className="px-1 py-1 text-right font-semibold border-l-2 border-green-200 bg-green-25">
                      {renderChangeIndicator(item.allMerino.change)}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-1 py-1 text-right font-semibold border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-primary)' }}>
                      R{item.certified.current.toFixed(2)}
                    </td>
                    <td className="px-1 py-1 text-right font-semibold border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-primary)' }}>
                      R{item.allMerino.current.toFixed(2)}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuctionComparison;
