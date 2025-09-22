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
    <div>
      <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
        Top Producers by Province
      </h3>
      
      <div className="space-y-2">
        {sortedData.map((provinceData, provinceIndex) => (
          <div key={provinceData.province} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-200">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: provinceColors[provinceData.province as keyof typeof provinceColors] || '#64ffda'
                }}
              >
                <span className="text-xs font-bold text-white">{provinceIndex + 1}</span>
              </div>
              <h4 className="text-xs font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
                {provinceData.province}
              </h4>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600">
                {provinceData.producers.length}
              </span>
            </div>
            
            <div className="p-2">
              <div className="grid grid-cols-1 gap-1">
                {provinceData.producers.map((producer, index) => (
                  <div key={index} className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{producer.position}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {producer.name}
                        </p>
                        <p className="text-gray-500 truncate text-xs">
                          {producer.district} • {producer.description} • {producer.micron?.toFixed(1)}μ
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <div className="text-right">
                        <p className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>
                          R{producer.price.toFixed(2)}
                        </p>
                        {producer.certified === 'RWS' && (
                          <span className="text-xs px-1 py-0.5 rounded text-green-600 bg-green-100">
                            RWS
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileProvincialTopProducers;