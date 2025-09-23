import React from 'react';
import type { MicronPrice } from '../../types';

interface MobileAuctionComparisonProps {
  currentData: MicronPrice[];
  previousData?: MicronPrice[];
}

const MobileAuctionComparison: React.FC<MobileAuctionComparisonProps> = ({ currentData, previousData }) => {
  // Show current data even if no previous data is available
  if (!currentData || currentData.length === 0) {
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
    
    // Get abbreviated category
    const categoryAbbr = getCategoryAbbreviation(current.category);
    
    return {
      micron: current.bucket_micron,
      category: current.category,
      categoryAbbr,
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

  // Function to get category abbreviation
  function getCategoryAbbreviation(category: string): string {
    switch (category) {
      case 'Fine': return 'F';
      case 'Medium': return 'M';
      case 'Strong': return 'S';
      default: return category;
    }
  }

  const renderChangeIndicator = (change: number) => {
    if (change === 0) return <span className="text-gray-400">-</span>;
    
    return (
      <span className={`inline-flex items-center gap-0.5 ${
        change > 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        {change > 0 && (
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {change < 0 && (
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ margin: '0 0.5rem' }}>
      {/* Header */}
      <div className="px-0 py-2 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200 w-full">
        <div className="px-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                Auction Comparison
              </h2>
              <p className="text-2xs" style={{ color: 'var(--text-muted)' }}>
                {previousData && previousData.length > 0 
                  ? 'Price changes vs previous auction' 
                  : 'Current auction micron price data'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto p-1">
        <table className="w-full text-2xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-1 py-1 text-left font-semibold border-r border-gray-200" style={{ color: 'var(--text-primary)' }}>Micron</th>
              <th className="px-1 py-1 text-left font-semibold border-r border-gray-200" style={{ color: 'var(--text-primary)' }}>Cat</th>
              <th className="px-1 py-1 text-center font-semibold border-l-2 border-blue-200 bg-blue-100" style={{ color: 'var(--text-primary)' }} colSpan={previousData && previousData.length > 0 ? 3 : 1}>
                Certified
              </th>
              <th className="px-1 py-1 text-center font-semibold border-l-2 border-green-200 bg-green-100" style={{ color: 'var(--text-primary)' }} colSpan={previousData && previousData.length > 0 ? 3 : 1}>
                All Merino
              </th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border-r border-gray-200"></th>
              <th className="border-r border-gray-200"></th>
              {previousData && previousData.length > 0 ? (
                <>
                  <th className="px-1 py-0.5 text-right font-medium text-2xs border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-secondary)' }}>Prev</th>
                  <th className="px-1 py-0.5 text-right font-medium text-2xs border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-secondary)' }}>Curr</th>
                  <th className="px-1 py-0.5 text-right font-medium text-2xs border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-secondary)' }}>Chg</th>
                  <th className="px-1 py-0.5 text-right font-medium text-2xs border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-secondary)' }}>Prev</th>
                  <th className="px-1 py-0.5 text-right font-medium text-2xs border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-secondary)' }}>Curr</th>
                  <th className="px-1 py-0.5 text-right font-medium text-2xs border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-secondary)' }}>Chg</th>
                </>
              ) : (
                <>
                  <th className="px-1 py-0.5 text-right font-medium text-2xs border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-secondary)' }}>Price</th>
                  <th className="px-1 py-0.5 text-right font-medium text-2xs border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-secondary)' }}>Price</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <tr key={item.micron} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                <td className="px-1 py-0.5 border-r border-gray-200">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {item.micron}µ
                  </span>
                </td>
                <td className="px-1 py-0.5 border-r border-gray-200">
                  <span className={`inline-block px-1 py-0 rounded-sm text-2xs font-medium ${
                    item.category === 'Fine' ? 'bg-blue-100 text-blue-700' :
                    item.category === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {item.categoryAbbr}
                  </span>
                </td>
                {/* Certified columns */}
                {previousData && previousData.length > 0 ? (
                  <>
                    <td className="px-1 py-0.5 text-right font-medium border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-secondary)' }}>
                      R{item.certified.previous.toFixed(2)}
                    </td>
                    <td className="px-1 py-0.5 text-right font-semibold border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-primary)' }}>
                      R{item.certified.current.toFixed(2)}
                    </td>
                    <td className="px-1 py-0.5 text-right font-semibold border-l-2 border-blue-200 bg-blue-25">
                      {renderChangeIndicator(item.certified.change)}
                    </td>
                    {/* All Merino columns */}
                    <td className="px-1 py-0.5 text-right font-medium border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-secondary)' }}>
                      R{item.allMerino.previous.toFixed(2)}
                    </td>
                    <td className="px-1 py-0.5 text-right font-semibold border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-primary)' }}>
                      R{item.allMerino.current.toFixed(2)}
                    </td>
                    <td className="px-1 py-0.5 text-right font-semibold border-l-2 border-green-200 bg-green-25">
                      {renderChangeIndicator(item.allMerino.change)}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-1 py-0.5 text-right font-semibold border-l-2 border-blue-200 bg-blue-25" style={{ color: 'var(--text-primary)' }}>
                      R{item.certified.current.toFixed(2)}
                    </td>
                    <td className="px-1 py-0.5 text-right font-semibold border-l-2 border-green-200 bg-green-25" style={{ color: 'var(--text-primary)' }}>
                      R{item.allMerino.current.toFixed(2)}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="px-2 pb-2 pt-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-2xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="inline-block px-1 py-0 rounded-sm bg-blue-100 text-blue-700 font-medium">F</span>
            <span>Fine</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block px-1 py-0 rounded-sm bg-yellow-100 text-yellow-700 font-medium">M</span>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block px-1 py-0 rounded-sm bg-orange-100 text-orange-700 font-medium">S</span>
            <span>Strong</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAuctionComparison;
