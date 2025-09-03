import React from 'react';
import type { TopSale } from '../types';

interface AuctionTopProducersProps {
  data: TopSale[];
}

const AuctionTopProducers: React.FC<AuctionTopProducersProps> = ({ data }) => {
  return (
    <div>
        <h3 className="text-lg font-bold text-brand-primary mb-4">Top 10 Producers in Auction</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {['Rank', 'Producer Name', 'Region', 'Micron (µm)', 'Price (ZAR/kg)'].map(header => (
                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {data.map((sale, index) => (
                    <tr key={index} className="hover:bg-brand-secondary transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.farm}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.region}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.micron_um.toFixed(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-accent">{sale.price_zar_per_kg_greasy.toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default AuctionTopProducers;