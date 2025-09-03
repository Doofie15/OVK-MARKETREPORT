import React from 'react';
import type { AuctionReport } from '../../types';

interface AuctionsListProps {
  reports: AuctionReport[];
  onAddNew: () => void;
}

const AuctionsList: React.FC<AuctionsListProps> = ({ reports, onAddNew }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-primary">Auctions List</h1>
        <button
          onClick={onAddNew}
          className="bg-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Add New Auction Results
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auction Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catalogue Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Lots</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.auction.week_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {new Date(report.auction.auction_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.auction.catalogue_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.auction.week_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.indicators.find(i => i.type === 'total_lots')?.value.toLocaleString() ?? 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuctionsList;
