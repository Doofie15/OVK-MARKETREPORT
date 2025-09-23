import React from 'react';
import type { MicronPrice } from '../../types';
import MobileCard from './MobileCard';

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
    if (change === 0) return <span style={{ color: 'var(--text-muted)' }}>-</span>;
    
    return (
      <span className={`inline-flex items-center gap-0.5 font-medium ${
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
    <MobileCard
      title="Auction Comparison"
      subtitle={previousData && previousData.length > 0 
        ? 'Price changes vs previous auction' 
        : 'Current auction micron price data'}
      icon={
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      }
      compact={true}
    >
      
      <div className="overflow-x-auto">
        <table className="w-full adaptive-text-xs border-collapse" style={{ fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <th className="px-2 py-2 text-left font-semibold" style={{ color: 'var(--text-primary)', borderRight: '1px solid var(--border-primary)' }}>Micron</th>
              <th className="px-2 py-2 text-left font-semibold" style={{ color: 'var(--text-primary)', borderRight: '1px solid var(--border-primary)' }}>Cat</th>
              <th className="px-2 py-2 text-center font-semibold" style={{ 
                color: 'var(--text-primary)', 
                borderLeft: '2px solid var(--ovk-primary)', 
                backgroundColor: 'rgba(59, 130, 246, 0.1)' 
              }} colSpan={previousData && previousData.length > 0 ? 3 : 1}>
                Certified
              </th>
              <th className="px-2 py-2 text-center font-semibold" style={{ 
                color: 'var(--text-primary)', 
                borderLeft: '2px solid var(--ovk-green)', 
                backgroundColor: 'rgba(16, 185, 129, 0.1)' 
              }} colSpan={previousData && previousData.length > 0 ? 3 : 1}>
                All Merino
              </th>
            </tr>
            <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <th style={{ borderRight: '1px solid var(--border-primary)' }}></th>
              <th style={{ borderRight: '1px solid var(--border-primary)' }}></th>
              {previousData && previousData.length > 0 ? (
                <>
                  <th className="px-1 py-1 text-right font-medium" style={{ 
                    color: 'var(--text-secondary)', 
                    borderLeft: '2px solid var(--ovk-primary)', 
                    backgroundColor: 'rgba(59, 130, 246, 0.05)' 
                  }}>Prev</th>
                  <th className="px-1 py-1 text-right font-medium" style={{ 
                    color: 'var(--text-secondary)', 
                    backgroundColor: 'rgba(59, 130, 246, 0.05)' 
                  }}>Curr</th>
                  <th className="px-1 py-1 text-right font-medium" style={{ 
                    color: 'var(--text-secondary)', 
                    backgroundColor: 'rgba(59, 130, 246, 0.05)' 
                  }}>Chg</th>
                  <th className="px-1 py-1 text-right font-medium" style={{ 
                    color: 'var(--text-secondary)', 
                    borderLeft: '2px solid var(--ovk-green)', 
                    backgroundColor: 'rgba(16, 185, 129, 0.05)' 
                  }}>Prev</th>
                  <th className="px-1 py-1 text-right font-medium" style={{ 
                    color: 'var(--text-secondary)', 
                    backgroundColor: 'rgba(16, 185, 129, 0.05)' 
                  }}>Curr</th>
                  <th className="px-1 py-1 text-right font-medium" style={{ 
                    color: 'var(--text-secondary)', 
                    backgroundColor: 'rgba(16, 185, 129, 0.05)' 
                  }}>Chg</th>
                </>
              ) : (
                <>
                  <th className="px-1 py-1 text-right font-medium" style={{ 
                    color: 'var(--text-secondary)', 
                    borderLeft: '2px solid var(--ovk-primary)', 
                    backgroundColor: 'rgba(59, 130, 246, 0.05)' 
                  }}>Price</th>
                  <th className="px-1 py-1 text-right font-medium" style={{ 
                    color: 'var(--text-secondary)', 
                    borderLeft: '2px solid var(--ovk-green)', 
                    backgroundColor: 'rgba(16, 185, 129, 0.05)' 
                  }}>Price</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <tr key={item.micron} style={{ 
                backgroundColor: index % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' 
              }}>
                <td className="px-2 py-2" style={{ borderRight: '1px solid var(--border-primary)' }}>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {item.micron}µ
                  </span>
                </td>
                <td className="px-2 py-2" style={{ borderRight: '1px solid var(--border-primary)' }}>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
                    item.category === 'Fine' ? 'text-blue-700' :
                    item.category === 'Medium' ? 'text-yellow-700' :
                    'text-orange-700'
                  }`} style={{
                    backgroundColor: item.category === 'Fine' ? 'rgba(59, 130, 246, 0.1)' :
                                    item.category === 'Medium' ? 'rgba(245, 158, 11, 0.1)' :
                                    'rgba(249, 115, 22, 0.1)'
                  }}>
                    {item.categoryAbbr}
                  </span>
                </td>
                {/* Certified columns */}
                {previousData && previousData.length > 0 ? (
                  <>
                    <td className="px-1 py-2 text-right font-medium" style={{ 
                      color: 'var(--text-secondary)', 
                      borderLeft: '2px solid var(--ovk-primary)', 
                      backgroundColor: 'rgba(59, 130, 246, 0.03)' 
                    }}>
                      R{item.certified.previous.toFixed(2)}
                    </td>
                    <td className="px-1 py-2 text-right font-semibold" style={{ 
                      color: 'var(--text-primary)', 
                      backgroundColor: 'rgba(59, 130, 246, 0.03)' 
                    }}>
                      R{item.certified.current.toFixed(2)}
                    </td>
                    <td className="px-1 py-2 text-right font-semibold" style={{ backgroundColor: 'rgba(59, 130, 246, 0.03)' }}>
                      {renderChangeIndicator(item.certified.change)}
                    </td>
                    {/* All Merino columns */}
                    <td className="px-1 py-2 text-right font-medium" style={{ 
                      color: 'var(--text-secondary)', 
                      borderLeft: '2px solid var(--ovk-green)', 
                      backgroundColor: 'rgba(16, 185, 129, 0.03)' 
                    }}>
                      R{item.allMerino.previous.toFixed(2)}
                    </td>
                    <td className="px-1 py-2 text-right font-semibold" style={{ 
                      color: 'var(--text-primary)', 
                      backgroundColor: 'rgba(16, 185, 129, 0.03)' 
                    }}>
                      R{item.allMerino.current.toFixed(2)}
                    </td>
                    <td className="px-1 py-2 text-right font-semibold" style={{ backgroundColor: 'rgba(16, 185, 129, 0.03)' }}>
                      {renderChangeIndicator(item.allMerino.change)}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-1 py-2 text-right font-semibold" style={{ 
                      color: 'var(--text-primary)', 
                      borderLeft: '2px solid var(--ovk-primary)', 
                      backgroundColor: 'rgba(59, 130, 246, 0.03)' 
                    }}>
                      R{item.certified.current.toFixed(2)}
                    </td>
                    <td className="px-1 py-2 text-right font-semibold" style={{ 
                      color: 'var(--text-primary)', 
                      borderLeft: '2px solid var(--ovk-green)', 
                      backgroundColor: 'rgba(16, 185, 129, 0.03)' 
                    }}>
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
      <div className="mt-3 pt-2" style={{ borderTop: '1px solid var(--border-primary)' }}>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-1.5">
            <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium text-blue-700" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>F</span>
            <span>Fine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium text-yellow-700" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>M</span>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium text-orange-700" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>S</span>
            <span>Strong</span>
          </div>
        </div>
      </div>
    </MobileCard>
  );
};

export default MobileAuctionComparison;
