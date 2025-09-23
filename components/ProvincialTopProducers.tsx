import React from 'react';
import type { ProvincialProducerData } from '../types';

interface ProvincialTopProducersProps {
  data: ProvincialProducerData[];
  publishedDate?: Date;
}

const ProvincialTopProducers: React.FC<ProvincialTopProducersProps> = ({ data, publishedDate }) => {
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
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-bold" style={{ color: 'var(--text-primary)' }}>
          Top 10 Performances
        </h3>
        {publishedDate && (
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Updated {publishedDate.toLocaleDateString()} {publishedDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        )}
      </div>
      <div className="mb-4 p-2 rounded-md bg-gray-50 text-xs" style={{ color: 'var(--text-muted)' }}>
        <p className="mb-1">This table shows the top 10 highest-priced wool lots per province from the current auction.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Position</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs px-1 py-0 rounded-full bg-green-100 text-green-600">RWS</span>
            <span>Certified Wool</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedData.map((provinceData, provinceIndex) => (
          <div key={provinceData.province}>
            <div 
              className="flex items-center gap-2 mb-3 px-3 py-2 rounded-md shadow-sm"
              style={{ 
                background: `linear-gradient(to right, ${provinceColors[provinceData.province as keyof typeof provinceColors] || '#64ffda'}22, ${provinceColors[provinceData.province as keyof typeof provinceColors] || '#64ffda'}11)`,
                borderLeft: `4px solid ${provinceColors[provinceData.province as keyof typeof provinceColors] || '#64ffda'}`
              }}
            >
              <div 
                className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{ 
                  background: provinceColors[provinceData.province as keyof typeof provinceColors] || '#64ffda'
                }}
              >
                <span className="text-xs font-bold text-white">{provinceIndex + 1}</span>
              </div>
              <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {provinceData.province}
              </h4>
              <span className="text-xs px-2 py-0.5 rounded-full" 
                    style={{ 
                      background: 'white', 
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-primary)'
                    }}>
                {provinceData.producers.length > 10 ? 10 : provinceData.producers.length}
              </span>
            </div>
            
            <div className="overflow-x-auto rounded-md" style={{ background: 'var(--bg-hover)' }}>
              <table className="w-full text-xs table-fixed">
                <colgroup>
                  <col className="w-12" /> {/* POS */}
                  <col className="w-48 sm:w-64" /> {/* PRODUCER NAME */}
                  <col className="w-24 sm:w-32 hidden sm:table-column" /> {/* DISTRICT */}
                  <col className="w-12 hidden md:table-column" /> {/* DESC */}
                  <col className="w-16" /> {/* MICRON */}
                  <col className="w-20" /> {/* PRICE/KG */}
                  <col className="w-20 hidden md:table-column" /> {/* CERTIFIED */}
                </colgroup>
                <thead>
                  <tr>
                    <th className="text-center font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                      POS
                    </th>
                    <th className="text-left font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                      <span className="hidden sm:inline">PRODUCER NAME</span>
                      <span className="sm:hidden">PRODUCER</span>
                    </th>
                    <th className="text-left font-semibold px-2 py-1 hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>
                      DISTRICT
                    </th>
                    <th className="text-center font-semibold px-2 py-1 hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>
                      DESC
                    </th>
                    <th className="text-center font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                      MICRON
                    </th>
                    <th className="text-right font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                      <span className="hidden sm:inline">PRICE/KG</span>
                      <span className="sm:hidden">PRICE</span>
                    </th>
                    <th className="text-center font-semibold px-2 py-1 hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>
                      CERTIFIED
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {provinceData.producers.slice(0, 10).map((producer, index) => (
                    <tr key={index} className="border-t" style={{ borderColor: 'var(--border-primary)' }}>
                      <td className="px-2 py-1 text-center">
                        <span className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white mx-auto">
                          {producer.position}
                        </span>
                      </td>
                      <td className="px-2 py-1">
                        <div className="truncate">
                          <span className="font-medium text-xs block truncate" style={{ color: 'var(--text-primary)' }} title={producer.name}>
                            {producer.name}
                          </span>
                          <div className="sm:hidden text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                            {producer.district} • {producer.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-1 hidden sm:table-cell">
                        <span className="text-xs truncate block" style={{ color: 'var(--text-secondary)' }} title={producer.district}>
                          {producer.district}
                        </span>
                      </td>
                      <td className="px-2 py-1 text-center hidden md:table-cell">
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {producer.description}
                        </span>
                      </td>
                      <td className="px-2 py-1 text-center">
                        <span className="font-mono text-xs" style={{ color: 'var(--accent-secondary)' }}>
                          {producer.micron?.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-2 py-1 text-right">
                        <div>
                          <span className="font-bold text-sm" style={{ color: 'var(--accent-primary)' }}>
                            {producer.price.toFixed(2)}
                          </span>
                          {producer.certified === 'RWS' && (
                            <div className="md:hidden text-xs px-1 py-0.5 rounded mt-1" style={{ 
                              background: 'rgba(16, 185, 129, 0.1)',
                              color: 'var(--accent-success)'
                            }}>
                              RWS
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-1 text-center hidden md:table-cell">
                        {producer.certified === 'RWS' ? (
                          <span className="text-xs px-1 py-0.5 rounded" style={{ 
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: 'var(--accent-success)'
                          }}>
                            RWS
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProvincialTopProducers;
