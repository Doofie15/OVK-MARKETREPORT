import React from 'react';
import type { ProvincialProducerData } from '../types';

interface ProvincialTopProducersProps {
  data: ProvincialProducerData[];
}

const ProvincialTopProducers: React.FC<ProvincialTopProducersProps> = ({ data }) => {
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
  
  return (
    <div>
      <h3 className="text-md font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Top Producers by Province
      </h3>
      
      <div className="space-y-4">
        {data.map((provinceData, provinceIndex) => (
          <div key={provinceData.province}>
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-4 h-4 rounded-md flex items-center justify-center"
                style={{ 
                  background: provinceColors[provinceData.province as keyof typeof provinceColors] || '#64ffda'
                }}
              >
                <span className="text-xs font-bold text-white">{provinceIndex + 1}</span>
              </div>
              <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {provinceData.province}
              </h4>
              <span className="text-xs px-1 py-0.5 rounded text-xs" 
                    style={{ 
                      background: 'var(--bg-hover)', 
                      color: 'var(--text-muted)' 
                    }}>
                {provinceData.producers.length}
              </span>
            </div>
            
            <div className="overflow-x-auto rounded-md" style={{ background: 'var(--bg-hover)' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                      POS
                    </th>
                    <th className="text-left font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                      PRODUCER NAME
                    </th>
                    <th className="text-left font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                      DISTRICT
                    </th>
                    <th className="text-center font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                      DESC
                    </th>
                    <th className="text-center font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                      MICRON
                    </th>
                    <th className="text-right font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                      PRICE/KG
                    </th>
                    <th className="text-center font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                      CERTIFIED
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {provinceData.producers.map((producer, index) => (
                    <tr key={index} className="border-t" style={{ borderColor: 'var(--border-primary)' }}>
                      <td className="px-2 py-1">
                        <span className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                          {producer.position}
                        </span>
                      </td>
                      <td className="px-2 py-1">
                        <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                          {producer.name}
                        </span>
                      </td>
                      <td className="px-2 py-1">
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {producer.district}
                        </span>
                      </td>
                      <td className="px-2 py-1 text-center">
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
                        <span className="font-bold text-sm" style={{ color: 'var(--accent-primary)' }}>
                          {producer.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-2 py-1 text-center">
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
