import React from 'react';
import type { ProvincialProducerData } from '../../types';

interface MobileProvincialTopProducersProps {
  data: ProvincialProducerData[];
}

const MobileProvincialTopProducers: React.FC<MobileProvincialTopProducersProps> = ({ data }) => {
  const provinceColors = {
    'Eastern Cape': '#64ffda',
    'Western Cape': '#7c3aed',
    'Free State': '#06b6d4',
    'Northern Cape': '#8b5cf6',
    'KwaZulu-Natal': '#10b981',
    'Gauteng': '#f59e0b',
    'Mpumalanga': '#ef4444',
    'Limpopo': '#8b5cf6',
    'North West': '#06b6d4'
  };
  
  // Sort provinces alphabetically, but put Lesotho at the bottom
  const sortedData = [...data].sort((a, b) => {
    // If one is Lesotho, put it at the bottom
    if (a.province === 'Lesotho') return 1;
    if (b.province === 'Lesotho') return -1;
    // Otherwise sort alphabetically
    return a.province.localeCompare(b.province);
  });
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ margin: '0 0.5rem' }}>
      {/* Header */}
      <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-200">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h2 className="adaptive-text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          TOP PERFORMERS
        </h2>
      </div>
      
      {/* Province Data */}
      <div className="p-2">
        {sortedData.map((provinceData, provinceIndex) => (
          <div key={provinceData.province} className="mb-3 last:mb-0">
            {/* Province Header */}
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 mb-1">
              <div 
                className="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: provinceColors[provinceData.province as keyof typeof provinceColors] || '#64ffda'
                }}
              >
                <span className="adaptive-text-xs font-bold text-white">{provinceIndex + 1}</span>
              </div>
              <h4 className="adaptive-text-xs font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
                {provinceData.province}
              </h4>
              <span className="adaptive-text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {provinceData.producers.length}
              </span>
            </div>
            
            {/* Producers List */}
            <div className="space-y-1">
              {provinceData.producers.map((producer, index) => (
                <div key={index} className="flex items-center justify-between py-0.5 px-1.5 bg-gray-50 rounded">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="adaptive-text-xs font-bold text-white">{producer.position}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate adaptive-text-xs" style={{ color: 'var(--text-primary)' }}>
                        {producer.name}
                      </p>
                      <div className="flex items-center gap-0.5 adaptive-text-xs text-gray-500">
                        <span className="truncate max-w-12">{producer.district}</span>
                        {producer.micron && (
                          <>
                            <span>•</span>
                            <span>{producer.micron.toFixed(1)}μ</span>
                          </>
                        )}
                        {producer.description && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-8">{producer.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-1 flex-shrink-0">
                    <p className="adaptive-text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>
                      R{producer.price.toFixed(2)}
                    </p>
                    {producer.certified === 'RWS' ? (
                      <span className="inline-block adaptive-text-xs px-1 py-0 rounded-full bg-green-100 text-green-600 font-medium">
                        RWS
                      </span>
                    ) : (
                      <span className="inline-block adaptive-text-xs px-1 py-0 rounded-full bg-gray-100 text-gray-500">
                        Standard
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileProvincialTopProducers;