
import React from 'react';
import type { TopSale } from '../types';

interface TopSalesTableProps {
  data: TopSale[];
}

const CheckIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


const TopSalesTable: React.FC<TopSalesTableProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-brand-primary mb-4">Top Greasy Prices</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {['Farm', 'Region', 'Lots', 'Type', 'Micron (µm)', 'Price (ZAR/kg)', 'Certified', 'Buyer'].map(header => (
                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {data.map((sale, index) => (
                    <tr key={index} className="hover:bg-brand-secondary transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.farm}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.region}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.lots_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.type_code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.micron_um.toFixed(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-accent">{sale.price_zar_per_kg_greasy.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {sale.certified && <CheckIcon className="w-5 h-5 text-green-500" />}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.buyer_name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default TopSalesTable;
