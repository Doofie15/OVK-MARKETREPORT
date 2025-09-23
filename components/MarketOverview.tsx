import React from 'react';
import type { Currency } from '../types';

interface MarketOverviewProps {
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

const MarketOverview: React.FC<MarketOverviewProps> = ({ currencies, nextAuctionDate, rwsPremium = 0, currentAuctionDate, currentCatalogue }) => {
  // Debug currencies data
  console.log('🔍 MarketOverview currencies:', currencies);
  
  // Temporary test with hardcoded data
  const testCurrencies = [
    { code: 'USD', value: 17.67, change: 0 },
    { code: 'EUR', value: 20.54, change: 0 },
    { code: 'JPY', value: 8.38, change: 0 },
    { code: 'GBP', value: 23.79, change: 0 }
  ];
  
  // Use test data if currencies is empty
  const displayCurrencies = currencies && currencies.length > 0 ? currencies : testCurrencies;
  
  // Calculate next auction date based on current auction + 7 days
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
    
    // Fallback to next Wednesday if no current auction date
    const today = new Date();
    const daysUntilWednesday = (3 - today.getDay() + 7) % 7;
    const nextWednesday = new Date(today);
    nextWednesday.setDate(today.getDate() + (daysUntilWednesday === 0 ? 7 : daysUntilWednesday));
    
    return nextWednesday.toLocaleDateString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilAuction = () => {
    if (currentAuctionDate) {
      const currentDate = new Date(currentAuctionDate);
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 7);
      
      const today = new Date();
      // Reset time to start of day for accurate day calculation
      today.setHours(0, 0, 0, 0);
      nextDate.setHours(0, 0, 0, 0);
      
      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // If negative (past date), return 0
      return Math.max(0, diffDays);
    }
    
    // Fallback calculation
    const today = new Date();
    const daysUntilWednesday = (3 - today.getDay() + 7) % 7;
    return daysUntilWednesday === 0 ? 7 : daysUntilWednesday;
  };

  // Calculate payout date (next auction date + 7 days)
  const getPayoutDate = () => {
    if (currentAuctionDate) {
      const currentDate = new Date(currentAuctionDate);
      const nextAuctionDate = new Date(currentDate);
      nextAuctionDate.setDate(currentDate.getDate() + 7);
      
      // Payout is 7 days after next auction date
      const payoutDate = new Date(nextAuctionDate);
      payoutDate.setDate(nextAuctionDate.getDate() + 7);
      
      return payoutDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      });
    }
    
    return '17 Sept'; // Fallback
  };

  // Calculate next catalogue number by incrementing current catalogue
  const getNextCatalogueNumber = (currentCatalogue?: string) => {
    if (currentCatalogue) {
      // Extract prefix and number (e.g., "CG03" → "CG" + "03")
      const match = currentCatalogue.match(/^([A-Z]+)(\d+)$/);
      if (match) {
        const prefix = match[1]; // "CG"
        const currentNumber = parseInt(match[2], 10); // 3
        const nextNumber = currentNumber + 1;
        
        // Format with leading zero if needed (e.g., 04)
        const formattedNumber = nextNumber.toString().padStart(match[2].length, '0');
        return `${prefix}${formattedNumber}`;
      }
    }
    
    return 'CG04'; // Fallback
  };

  const nextAuction = getNextAuctionDate();
  const daysUntil = getDaysUntilAuction();
  const payoutDate = getPayoutDate();
  const catalogueNumber = getNextCatalogueNumber(currentCatalogue);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 shadow-lg border border-slate-200 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 15px 15px, var(--ovk-primary) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      {/* Compact Header */}
      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className="font-bold text-base tracking-wide" style={{ color: 'var(--text-primary)' }}>
            MARKET OVERVIEW
          </h2>
        </div>
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Currency Exchange - Compact */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200 shadow-md">
          <div className="flex items-center gap-1 mb-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="font-bold text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>RATES</h3>
          </div>
          <div className="space-y-1">
            {displayCurrencies.map((currency) => {
              const FlagIcon = flagIcons[currency.code];
              return (
                <div key={currency.code} className="flex items-center justify-between bg-slate-50 rounded p-1.5 border border-slate-150">
                  <div className="flex items-center gap-1.5">
                    {FlagIcon && <FlagIcon />}
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{currency.code}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                      R{currency.value.toFixed(2)}
                    </div>
                    <div className={`text-sm font-semibold flex items-center gap-0.5 justify-end ${
                      currency.change > 0 ? 'text-green-600' : 
                      currency.change < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {currency.change > 0 && (
                        <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {currency.change < 0 && (
                        <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {Math.abs(currency.change).toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Auction - Compact */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200 shadow-md relative sm:col-span-2 lg:col-span-1">
          <div className="absolute top-2 right-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="font-bold text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>NEXT AUCTION</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded p-2 border border-blue-200 text-center">
              <div className="text-blue-600 text-sm font-medium">Date</div>
              <div className="font-bold text-sm" style={{ color: 'var(--ovk-primary)' }}>{nextAuction}</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded p-2 border border-orange-200 text-center">
              <div className="text-orange-600 text-sm font-medium">Days</div>
              <div className="font-bold text-base" style={{ color: 'var(--accent-warning)' }}>{daysUntil}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="flex justify-between items-center bg-slate-50 rounded p-1.5">
              <span className="text-slate-600 text-sm font-medium">Cat.</span>
              <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{catalogueNumber}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 rounded p-1.5">
              <span className="text-slate-600 text-sm font-medium">Payout</span>
              <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{payoutDate}</span>
            </div>
          </div>
        </div>

        {/* Certified Price Difference - Compact */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200 shadow-md">
          <div className="flex items-center gap-1 mb-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="font-bold text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>CERTIFIED PRICE DIFFERENCE</h3>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-3 mb-2 border border-emerald-200 text-center">
            <div className="text-emerald-600 text-sm font-medium mb-1">PRICE DIFFERENCE</div>
            <div className="font-bold text-2xl mb-1" style={{ color: 'var(--ovk-green)' }}>
              +{rwsPremium.toFixed(1)}%
            </div>
            <div className="text-emerald-600 text-sm font-medium">over conventional</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-emerald-50 rounded p-2 text-center border border-emerald-200">
              <div className="text-emerald-600 text-sm font-medium">CERTIFIED</div>
              <div className="font-bold text-sm" style={{ color: 'var(--ovk-green)' }}>Wool</div>
            </div>
            <div className="bg-slate-50 rounded p-2 text-center border border-slate-200">
              <div className="text-slate-600 text-sm font-medium">Standard</div>
              <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Base</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
