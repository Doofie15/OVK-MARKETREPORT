import React, { useState, useEffect } from 'react';
import type { AuctionReport } from '../../types';
import { AuctionDataService } from '../../data';
import type { Sale } from '../../data';

interface AuctionsListProps {
  reports: AuctionReport[];
  onAddNew: () => void;
  onEdit: (report: AuctionReport) => void;
  onDelete: (weekId: string) => void;
  onView: (report: AuctionReport) => void;
}

const AuctionsList: React.FC<AuctionsListProps> = ({ reports, onAddNew, onEdit, onDelete, onView }) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof AuctionReport['auction']>('auction_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  // Load sales data on component mount
  useEffect(() => {
    const loadSales = async () => {
      try {
        setLoading(true);
        const salesData = await AuctionDataService.getAllAuctionReports();
        setSales(salesData);
      } catch (error) {
        console.error('Error loading sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  const handleSort = (field: keyof AuctionReport['auction']) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedSales = [...sales].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (sortField) {
      case 'auction_date':
        aValue = a.sale_date;
        bValue = b.sale_date;
        break;
      case 'catalogue_name':
        aValue = `CAT${String(a.catalogue_no).padStart(2, '0')}`;
        bValue = `CAT${String(b.catalogue_no).padStart(2, '0')}`;
        break;
      case 'week_id':
        aValue = `week_${new Date(a.sale_date).getFullYear()}_${String(a.catalogue_no).padStart(2, '0')}`;
        bValue = `week_${new Date(b.sale_date).getFullYear()}_${String(b.catalogue_no).padStart(2, '0')}`;
        break;
      default:
        aValue = a[sortField as keyof Sale];
        bValue = b[sortField as keyof Sale];
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleDeleteClick = (weekId: string) => {
    setDeleteConfirm(weekId);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm) {
      try {
        await AuctionDataService.deleteAuctionReport(deleteConfirm);
        // Reload sales data
        const salesData = await AuctionDataService.getAllAuctionReports();
        setSales(salesData);
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting auction report:', error);
      }
    }
  };

  const handleViewSale = async (sale: Sale) => {
    try {
      const report = await AuctionDataService.getAuctionReport(sale.id);
      if (report) {
        // Convert to the format expected by onView
        const auctionReport: AuctionReport = {
          ...report,
          top_sales: [] // This would need to be populated from provincial data
        };
        onView(auctionReport);
      }
    } catch (error) {
      console.error('Error loading auction report:', error);
    }
  };

  const handleEditSale = async (sale: Sale) => {
    try {
      const report = await AuctionDataService.getAuctionReport(sale.id);
      if (report) {
        // Convert to the format expected by onEdit
        const auctionReport: AuctionReport = {
          ...report,
          top_sales: [] // This would need to be populated from provincial data
        };
        onEdit(auctionReport);
      }
    } catch (error) {
      console.error('Error loading auction report:', error);
    }
  };

  const getTotalValue = (report: AuctionReport) => {
    return report.indicators.find(i => i.type === 'total_value')?.value || 0;
  };

  const getTotalVolume = (report: AuctionReport) => {
    return report.indicators.find(i => i.type === 'total_volume')?.value || 0;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Auctions Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage auction reports and data</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onAddNew}
            className="bg-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Auction
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{loading ? '...' : sales.length}</div>
          <div className="text-sm text-blue-800">Total Auctions</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {loading ? '...' : sales.reduce((sum, s) => sum + (s.total_bales_sold || 0), 0).toLocaleString()}
          </div>
          <div className="text-sm text-green-800">Total Bales Sold</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {loading ? '...' : sales.length > 0 ? sales.reduce((sum, s) => sum + (s.clearance_pct || 0), 0) / sales.length : 0}%
          </div>
          <div className="text-sm text-purple-800">Avg Clearance</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {loading ? '...' : sales.length > 0 ? new Date(sales.sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())[0].sale_date).toLocaleDateString() : 'N/A'}
          </div>
          <div className="text-sm text-orange-800">Latest Auction</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('auction_date')}
              >
                <div className="flex items-center gap-1">
                  Auction Date
                  {sortField === 'auction_date' && (
                    <svg className={`w-4 h-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('catalogue_name')}
              >
                <div className="flex items-center gap-1">
                  Catalogue Name
                  {sortField === 'catalogue_name' && (
                    <svg className={`w-4 h-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Lots</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume (MT)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value (ZAR M)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Loading auction data...
                </td>
              </tr>
            ) : sortedSales.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No auction data found. Create your first auction report.
                </td>
              </tr>
            ) : (
              sortedSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    CAT{String(sale.catalogue_no).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    week_{new Date(sale.sale_date).getFullYear()}_{String(sale.catalogue_no).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.total_bales_offered?.toLocaleString() ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.total_bales_sold?.toLocaleString() ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.clearance_pct?.toFixed(1) ?? 'N/A'}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewSale(sale)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Report"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEditSale(sale)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Edit Report"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(sale.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete Report"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this auction report? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionsList;
