
import React from 'react';
import type { Buyer } from '../types';

interface BuyerListTableProps {
  data: Buyer[];
}

const BuyerListTable: React.FC<BuyerListTableProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
        <h2 className="text-xl font-bold text-brand-primary mb-4">Buyers List</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead style={{backgroundColor: '#E9E3D9'}}>
                <tr>
                    {['Buyer', 'CAT', '% Share', 'Bales (YTD)'].map(header => (
                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-primary uppercase tracking-wider">
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {data.map((buyer, index) => (
                    <tr key={index} className="hover:bg-brand-secondary transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{buyer.buyer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{buyer.cat.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{buyer.share_pct.toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{buyer.bales_ytd.toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default BuyerListTable;
