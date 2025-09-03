import React from 'react';
import type { ProvincialProducerData } from '../types';

interface ProvincialTopProducersProps {
  data: ProvincialProducerData[];
}

const ProvincialTopProducers: React.FC<ProvincialTopProducersProps> = ({ data }) => {
  return (
    <div>
        <h3 className="text-lg font-bold text-brand-primary mb-4">Top Producers by Province</h3>
        <div className="space-y-8">
            {data.map(provinceData => (
                <div key={provinceData.province}>
                    <h4 className="text-md font-semibold text-gray-700 mb-2">{provinceData.province}</h4>
                    <div className="overflow-x-auto border rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                {['Pos', 'Producer Name', 'District', 'Desc', 'Micron', 'Price/kg', 'Certified'].map(header => (
                                    <th key={header} scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {provinceData.producers.map((producer, index) => (
                                <tr key={index} className="hover:bg-brand-secondary transition-colors duration-150">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{producer.position}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{producer.name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{producer.district}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{producer.description}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{producer.micron?.toFixed(1)}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-accent">{producer.price.toFixed(2)}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{producer.certified}</td>
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
