import React from 'react';
import type { TopSale } from '../types';

interface AuctionTopProducersProps {
  data: TopSale[];
}

const AuctionTopProducers: React.FC<AuctionTopProducersProps> = ({ data }) => {
  return (
    <div>
      <h3 className="text-md font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Top 10 Producers in Auction
      </h3>
      
      <div className="overflow-x-auto rounded-lg" style={{ background: 'var(--bg-hover)' }}>
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left font-semibold px-2 py-2" style={{ color: 'var(--text-muted)' }}>
                RANK
              </th>
              <th className="text-left font-semibold px-2 py-2" style={{ color: 'var(--text-muted)' }}>
                PRODUCER NAME
              </th>
              <th className="text-left font-semibold px-2 py-2" style={{ color: 'var(--text-muted)' }}>
                REGION
              </th>
              <th className="text-center font-semibold px-2 py-2" style={{ color: 'var(--text-muted)' }}>
                MICRON
              </th>
              <th className="text-right font-semibold px-2 py-2" style={{ color: 'var(--text-muted)' }}>
                PRICE (ZAR/KG)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((sale, index) => (
              <tr key={index} className="border-t" style={{ borderColor: 'var(--border-primary)' }}>
                <td className="px-2 py-1">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </span>
                </td>
                <td className="px-2 py-1">
                  <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                    {sale.farm}
                  </span>
                </td>
                <td className="px-2 py-1">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {sale.region}
                  </span>
                </td>
                <td className="px-2 py-1 text-center">
                  <span className="font-mono text-xs" style={{ color: 'var(--accent-secondary)' }}>
                    {sale.micron_um.toFixed(1)}
                  </span>
                </td>
                <td className="px-2 py-1 text-right">
                  <span className="font-bold text-sm" style={{ color: 'var(--accent-primary)' }}>
                    {sale.price_zar_per_kg_greasy.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 pt-2 text-xs" style={{ borderTop: '1px solid var(--border-primary)' }}>
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }}>
            Top {data.length} performers
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            Avg: 
            <span className="ml-1 font-bold" style={{ color: 'var(--accent-primary)' }}>
              R{(data.reduce((sum, sale) => sum + sale.price_zar_per_kg_greasy, 0) / data.length).toFixed(2)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuctionTopProducers;