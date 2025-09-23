import React, { useState } from 'react';

const MarketGlossary: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const glossaryItems = [
    {
      term: "YTD",
      definition: "Year-to-Date / Season-to-Date - Total or average values accumulated from the start of the current auction season"
    },
    {
      term: "Certified Wool",
      definition: "Wool that meets specific sustainability and animal welfare standards (e.g., RWS - Responsible Wool Standard)"
    },
    {
      term: "All-Merino",
      definition: "Standard merino wool without certification requirements - represents the conventional wool market"
    },
    {
      term: "AWEX",
      definition: "Australian Wool Exchange - International wool price benchmark used for comparison with South African prices"
    },
    {
      term: "MT",
      definition: "Metric Tons - Unit of measurement for wool volume (1 MT = 1,000 kg)"
    },
    {
      term: "ZAR M",
      definition: "South African Rand in Millions - Total market value expressed in millions of rands"
    },
    {
      term: "Bales",
      definition: "Standard wool packaging unit - typically contains compressed wool weighing approximately 180-200 kg"
    },
    {
      term: "Clean Price",
      definition: "Price per kilogram of clean wool fiber after removing vegetable matter and impurities"
    },
    {
      term: "Percentage Changes",
      definition: "Green ↗ indicates increase, Red ↘ indicates decrease compared to the previous auction"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 shadow-sm">
      {/* Header - Always Visible */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-100/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-sm tracking-wide text-gray-700">
            MARKET TERMINOLOGY
          </h3>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            Glossary
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:block">
            {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-3 pb-3">
          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {glossaryItems.map((item, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-150">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-800 bg-white px-2 py-1 rounded border">
                        {item.term}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.definition}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Additional Info */}
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>All prices are shown in South African Rand (ZAR) unless otherwise specified</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketGlossary;
