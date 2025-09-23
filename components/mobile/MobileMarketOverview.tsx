import React from 'react';
import type { Currency } from '../../types';

interface MobileMarketOverviewProps {
  currencies: Currency[];
  nextAuctionDate?: string;
  rwsPremium?: number;
  currentAuctionDate?: string;
  currentCatalogue?: string;
}

const UsaFlagIcon: React.FC = () => (
  <svg className="w-4 h-4 rounded-full" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fill="#C1272D" d="M0 0h20v2.5H0zM0 5h20v2.5H0zM0 10h20v2.5H0zM0 15h20v2.5H0z"/>
    <path fill="#002868" d="M0 0h10v10H0z"/>
    <g fill="#FFFFFF">
      <path d="M1.5 1.5l.5 1.5h1.6l-1.3 1 .5 1.6-1.3-1-1.3 1 .5-1.6-1.3-1h1.6z"/>
      <path d="M5.5 1.5l.5 1.5h1.6l-1.3 1 .5 1.6-1.3-1-1.3 1 .5-1.6-1.3-1h1.6z"/>
    </g>
  </svg>
);

const AustraliaFlagIcon: React.FC = () => (
  <svg className="w-4 h-4 rounded-full" viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg">
    <path fill="#00008B" d="M0 0h20v10H0z"/>
    <path stroke="#FFFFFF" strokeWidth=".5" d="M0 0l10 5m0-5L0 5"/>
    <path stroke="#C1272D" strokeWidth=".3" d="M0 0l10 5m0-5L0 5"/>
  </svg>
);

const EuFlagIcon: React.FC = () => (
  <svg className="w-4 h-4 rounded-full" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fill="#003399" d="M0 0h20v20H0z"/>
    <g fill="#FFCC00">
      <path d="M10 3l.3.9h.9l-.7.5.3.9-.8-.6-.8.6.3-.9-.7-.5h.9z"/>
      <path d="M14 6l.3.9h.9l-.7.5.3.9-.8-.6-.8.6.3-.9-.7-.5h.9z"/>
    </g>
  </svg>
);

const JapanFlagIcon: React.FC = () => (
  <svg className="w-4 h-4 rounded-full" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FFFFFF" d="M0 0h20v20H0z"/>
    <circle cx="10" cy="10" r="6" fill="#C1272D"/>
  </svg>
);

const UkFlagIcon: React.FC = () => (
  <svg className="w-4 h-4 rounded-full" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fill="#012169" d="M0 0h20v20H0z"/>
    <path stroke="#FFFFFF" strokeWidth="2" d="M0 0l20 20M20 0L0 20"/>
    <path stroke="#C8102E" strokeWidth="1.5" d="M0 0l20 20M20 0L0 20"/>
    <path stroke="#FFFFFF" strokeWidth="2" d="M10 0v20M0 10h20"/>
    <path stroke="#C8102E" strokeWidth="1.5" d="M10 0v20M0 10h20"/>
  </svg>
);

const flagIcons: Record<string, React.FC> = {
  USD: UsaFlagIcon,
  AUD: AustraliaFlagIcon,
  EUR: EuFlagIcon,
  JPY: JapanFlagIcon,
  GBP: UkFlagIcon,
};

const MobileMarketOverview: React.FC<MobileMarketOverviewProps> = ({ 
  currencies, 
  nextAuctionDate, 
  rwsPremium = 0, 
  currentAuctionDate, 
  currentCatalogue 
}) => {
  // Use real currency data only
  const displayCurrencies = currencies || [];

  // Calculate next auction date
  const getNextAuctionDate = () => {
    if (currentAuctionDate) {
      const currentDate = new Date(currentAuctionDate);
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 7);
      
      return nextDate.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    }
    return 'TBD';
  };

  const getDaysUntilAuction = () => {
    if (currentAuctionDate) {
      const currentDate = new Date(currentAuctionDate);
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 7);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      nextDate.setHours(0, 0, 0, 0);
      
      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return Math.max(0, diffDays);
    }
    return 0;
  };

  const getPayoutDate = () => {
    if (currentAuctionDate) {
      const currentDate = new Date(currentAuctionDate);
      const nextAuctionDate = new Date(currentDate);
      nextAuctionDate.setDate(currentDate.getDate() + 7);
      
      const payoutDate = new Date(nextAuctionDate);
      payoutDate.setDate(nextAuctionDate.getDate() + 7);
      
      return payoutDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      });
    }
    return 'TBD';
  };

  const getNextCatalogueNumber = (currentCatalogue?: string) => {
    if (currentCatalogue) {
      const match = currentCatalogue.match(/^([A-Z]+)(\d+)$/);
      if (match) {
        const prefix = match[1];
        const currentNumber = parseInt(match[2], 10);
        const nextNumber = currentNumber + 1;
        const formattedNumber = nextNumber.toString().padStart(match[2].length, '0');
        return `${prefix}${formattedNumber}`;
      }
    }
    return 'TBD';
  };

  const nextAuction = getNextAuctionDate();
  const daysUntil = getDaysUntilAuction();
  const payoutDate = getPayoutDate();
  const catalogueNumber = getNextCatalogueNumber(currentCatalogue);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ margin: '0 0.5rem' }}>
      {/* Header */}
      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          MARKET OVERVIEW
        </h2>
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ml-auto"></div>
      </div>

      <div className="p-1.5 space-y-1.5">
        {/* Currency Exchange Rates */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="font-bold adaptive-text-sm" style={{ color: 'var(--text-primary)' }}>RATES</h3>
          </div>
          {displayCurrencies.length > 0 ? (
            <div className="space-y-0.5">
              {displayCurrencies.slice(0, 5).map((currency) => {
                const FlagIcon = flagIcons[currency.code];
                return (
                  <div key={currency.code} className="flex items-center justify-between bg-gray-50 rounded px-1.5 py-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {FlagIcon && <div className="w-3 h-3 flex-shrink-0"><FlagIcon /></div>}
                      <span className="font-semibold adaptive-text-xs truncate" style={{ color: 'var(--text-primary)' }}>{currency.code}</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="font-bold adaptive-text-xs" style={{ color: 'var(--text-primary)' }}>
                        R{currency.value.toFixed(2)}
                      </div>
                      <div className="adaptive-text-xs text-gray-500">
                        {Math.abs(currency.change).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 rounded px-1.5 py-2 text-center">
              <span className="adaptive-text-xs text-gray-500">No exchange rate data available</span>
            </div>
          )}
        </div>

        {/* Next Auction */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="font-bold adaptive-text-sm" style={{ color: 'var(--text-primary)' }}>NEXT AUCTION</h3>
          </div>
          
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-1">
              <div className="bg-blue-50 rounded px-2 py-1.5 text-center border border-blue-200">
                <div className="text-blue-600 adaptive-text-xs font-medium">Date</div>
                <div className="font-bold adaptive-text-xs mt-0.5" style={{ color: 'var(--ovk-primary)' }}>{nextAuction}</div>
              </div>
              <div className="bg-orange-50 rounded px-2 py-1.5 text-center border border-orange-200">
                <div className="text-orange-600 adaptive-text-xs font-medium">Days</div>
                <div className="font-bold adaptive-text-sm text-orange-600 mt-0.5">{daysUntil}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              <div className="flex justify-between items-center bg-gray-50 rounded px-1.5 py-1">
                <span className="text-gray-600 adaptive-text-xs font-medium">Cat.</span>
                <span className="font-bold adaptive-text-xs" style={{ color: 'var(--text-primary)' }}>{catalogueNumber}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 rounded px-1.5 py-1">
                <span className="text-gray-600 adaptive-text-xs font-medium">Payout</span>
                <span className="font-bold adaptive-text-xs" style={{ color: 'var(--text-primary)' }}>{payoutDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certified Price Difference */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="font-bold adaptive-text-sm" style={{ color: 'var(--text-primary)' }}>CERTIFIED PRICE DIFFERENCE</h3>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded px-2 py-1.5 mb-1 border border-emerald-200 text-center">
            <div className="text-emerald-600 adaptive-text-xs font-medium">PRICE DIFFERENCE</div>
            <div className="font-bold adaptive-text-lg mt-0.5" style={{ color: 'var(--ovk-green)' }}>
              +{rwsPremium.toFixed(1)}%
            </div>
            <div className="text-emerald-600 adaptive-text-xs font-medium">over conventional</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-emerald-50 rounded px-1.5 py-1 text-center border border-emerald-200">
              <div className="text-emerald-600 adaptive-text-xs font-medium">CERTIFIED</div>
              <div className="font-bold adaptive-text-xs" style={{ color: 'var(--ovk-green)' }}>Wool</div>
            </div>
            <div className="bg-gray-50 rounded px-1.5 py-1 text-center border border-gray-200">
              <div className="text-gray-600 adaptive-text-xs font-medium">Standard</div>
              <div className="font-bold adaptive-text-xs" style={{ color: 'var(--text-primary)' }}>Base</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMarketOverview;
