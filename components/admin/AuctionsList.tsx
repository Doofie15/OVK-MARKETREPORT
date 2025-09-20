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
  refreshTrigger?: number; // Add refresh trigger prop
}

const AuctionsList: React.FC<AuctionsListProps> = ({ reports, onAddNew, onEdit, onDelete, onView, refreshTrigger }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSales, setSelectedSales] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Load sales data on component mount and when refreshTrigger changes
  useEffect(() => {
    loadSales();
  }, [refreshTrigger]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null);
    };
    
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  // Filter sales based on search term and ensure minimum 10 rows
  useEffect(() => {
    let filtered: Sale[] = [];
    
    if (!searchTerm.trim()) {
      filtered = sales;
    } else {
      filtered = sales.filter(sale =>
        sale.sale_date.includes(searchTerm) ||
        `CAT${String(sale.catalogue_no).padStart(2, '0')}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `week_${new Date(sale.sale_date).getFullYear()}_${String(sale.catalogue_no).padStart(2, '0')}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.season.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Ensure minimum 10 rows by padding with empty rows if needed
    const minRows = 10;
    if (filtered.length < minRows) {
      const emptyRows: Sale[] = Array.from({ length: minRows - filtered.length }, (_, index) => ({
        id: `empty-${index}`,
        season: '',
        catalogue_no: 0,
        sale_date: '',
        created_at: new Date().toISOString(),
        is_empty: true // Custom property to identify empty rows
      })) as Sale[];
      filtered = [...filtered, ...emptyRows];
    }
    
    setFilteredSales(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [sales, searchTerm]);

  const loadSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const salesData = await AuctionDataService.getAllAuctionReports();
      setSales(salesData);
    } catch (err) {
      setError('Failed to load auction data');
      console.error('Error loading sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSale = (saleId: string, saleInfo: string) => {
    setDeleteConfirm(saleId);
    setDeletePassword('');
    setDeletePasswordError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    // Validate password
    if (!deletePassword.trim()) {
      setDeletePasswordError('Password is required');
      return;
    }

    // Check password (you can change this to match your admin password)
    if (deletePassword !== 'admin123') {
      setDeletePasswordError('Incorrect password');
      return;
    }

    try {
      await AuctionDataService.deleteAuctionReport(deleteConfirm);
      await loadSales(); // Reload the list
      setSelectedSales(selectedSales.filter(id => id !== deleteConfirm));
      setDeleteConfirm(null);
      setDeletePassword('');
      setDeletePasswordError(null);
    } catch (err) {
      setError('Failed to delete auction');
      console.error('Error deleting auction report:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
    setDeletePassword('');
    setDeletePasswordError(null);
  };

  const handleSelectAll = () => {
    if (selectedSales.length === filteredSales.length) {
      setSelectedSales([]);
    } else {
      setSelectedSales(filteredSales.map(sale => sale.id));
    }
  };

  const handleSelectSale = (saleId: string) => {
    setSelectedSales(prev =>
      prev.includes(saleId)
        ? prev.filter(id => id !== saleId)
        : [...prev, saleId]
    );
  };

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      // Export selected sales if any are selected, otherwise export all sales
      const salesToExport = selectedSales.length > 0 
        ? sales.filter(sale => selectedSales.includes(sale.id))
        : filteredSales;
      
      if (salesToExport.length === 0) {
        alert('No auctions to export.');
        return;
      }
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `auctions_${timestamp}`;
      
      if (format === 'csv') {
        const csvContent = await exportSalesToCSV(salesToExport);
        downloadFile(csvContent, `${filename}.csv`, 'text/csv');
      } else if (format === 'xlsx') {
        // For XLSX, we'll export as CSV for now (can be enhanced with a proper XLSX library)
        const csvContent = await exportSalesToCSV(salesToExport);
        downloadFile(csvContent, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      } else if (format === 'pdf') {
        // For PDF, we'll create a simple text-based export (can be enhanced with a PDF library)
        const jsonContent = JSON.stringify(salesToExport, null, 2);
        downloadFile(jsonContent, `${filename}.pdf`, 'application/pdf');
      }
    } catch (err) {
      setError('Failed to export auctions');
      console.error('Error exporting auctions:', err);
    }
  };

  const exportSalesToCSV = async (sales: Sale[]): Promise<string> => {
    const headers = ['Auction Date', 'Catalogue Name', 'Week ID', 'Season', 'Total Bales Offered', 'Total Bales Sold', 'Clearance %'];
    const csvContent = [
      headers.join(','),
      ...sales.map(sale => [
        sale.sale_date,
        `"CAT${String(sale.catalogue_no).padStart(2, '0')}"`,
        `"week_${new Date(sale.sale_date).getFullYear()}_${String(sale.catalogue_no).padStart(2, '0')}"`,
        `"${sale.season}"`,
        sale.total_bales_offered || 0,
        sale.total_bales_sold || 0,
        sale.clearance_pct || 0
      ].join(','))
    ].join('\n');

    return csvContent;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pagination logic
  const getPaginatedSales = () => {
    const realSales = filteredSales.filter(sale => !sale.is_empty);
    
    // If "All" is selected (rowsPerPage === -1), return all sales with minimum 10 rows
    if (rowsPerPage === -1) {
      const minRows = 10;
      if (realSales.length < minRows) {
        const emptyRows: Sale[] = Array.from({ length: minRows - realSales.length }, (_, index) => ({
          id: `empty-${realSales.length + index}`,
          season: '',
          catalogue_no: 0,
          sale_date: '',
          created_at: new Date().toISOString(),
          is_empty: true
        })) as Sale[];
        return [...realSales, ...emptyRows];
      }
      return realSales;
    }
    
    // Regular pagination
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedSales = realSales.slice(startIndex, endIndex);
    
    // Ensure minimum 10 rows per page
    const minRows = 10;
    if (paginatedSales.length < minRows) {
      const emptyRows: Sale[] = Array.from({ length: minRows - paginatedSales.length }, (_, index) => ({
        id: `empty-${startIndex + paginatedSales.length + index}`,
        season: '',
        catalogue_no: 0,
        sale_date: '',
        created_at: new Date().toISOString(),
        is_empty: true
      })) as Sale[];
      return [...paginatedSales, ...emptyRows];
    }
    
    return paginatedSales;
  };

  const totalPages = rowsPerPage === -1 ? 1 : Math.ceil(filteredSales.filter(sale => !sale.is_empty).length / rowsPerPage);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading auctions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auctions Management</h1>
          <p className="text-gray-600">Manage auction reports and trading data</p>
        </div>
        <button
          onClick={onAddNew}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          + Add New Auction
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{sales.length}</div>
          <div className="text-sm text-blue-800">Total Auctions</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {sales.reduce((sum, s) => sum + (s.total_bales_sold || 0), 0).toLocaleString()}
          </div>
          <div className="text-sm text-green-800">Total Bales Sold</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {sales.reduce((sum, s) => sum + (s.total_volume_kg || 0), 0).toLocaleString()} kg
          </div>
          <div className="text-sm text-purple-800">Total Volume</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            ZAR {(sales.reduce((sum, s) => sum + (s.total_turnover || 0), 0) / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-yellow-800">Turnover</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {sales.length > 0 ? formatDate(sales.sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())[0].sale_date) : 'N/A'}
          </div>
          <div className="text-sm text-orange-800">Last Auction</div>
        </div>
      </div>

      {/* Search and Export Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search auctions by date, catalogue, week ID, or season..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Export Controls */}
          <div className="flex items-center gap-2">
            {selectedSales.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedSales.length} selected
              </span>
            )}
            <div className="relative group">
              <button 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={sales.length === 0}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Data
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport('xlsx')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export as XLSX
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auctions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredSales.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No auctions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating a new auction.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={onAddNew}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Auction
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSales.length === filteredSales.length && filteredSales.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auction Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catalogue Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Week ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Season
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bales Offered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bales Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clearance %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turnover
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getPaginatedSales().map((sale) => (
                  <tr key={sale.id} className={`${sale.is_empty ? 'opacity-0' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!sale.is_empty && (
                        <input
                          type="checkbox"
                          checked={selectedSales.includes(sale.id)}
                          onChange={() => handleSelectSale(sale.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sale.sale_date ? formatDate(sale.sale_date) : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.catalogue_no ? `CAT${String(sale.catalogue_no).padStart(2, '0')}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {sale.sale_date && sale.catalogue_no ? 
                        `week_${new Date(sale.sale_date).getFullYear()}_${String(sale.catalogue_no).padStart(2, '0')}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.season}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.status && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          sale.status === 'published' ? 'bg-green-100 text-green-800' :
                          sale.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {sale.status === 'published' ? 'Published' :
                           sale.status === 'draft' ? 'Draft' : 'New'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.total_bales_offered !== undefined && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {sale.total_bales_offered?.toLocaleString() || 0}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.total_bales_sold !== undefined && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {sale.total_bales_sold?.toLocaleString() || 0}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.clearance_pct !== undefined && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {sale.clearance_pct?.toFixed(1) || 0}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ZAR {((sale.total_turnover || 0) / 1000000).toFixed(1)}M
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!sale.is_empty && (
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(dropdownOpen === sale.id ? null : sale.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            title="Actions"
                          >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>
                        
                        {dropdownOpen === sale.id && (
                          <div 
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              {sale.status === 'draft' && (
                                <button
                                  onClick={() => {
                                    setDropdownOpen(null);
                                    // Handle publish action
                                    console.log('Publish auction:', sale.id);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                  </svg>
                                  Publish
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setDropdownOpen(null);
                                  handleViewSale(sale);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View
                              </button>
                              <button
                                onClick={() => {
                                  setDropdownOpen(null);
                                  handleEditSale(sale);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setDropdownOpen(null);
                                  handleDeleteSale(sale.id, `CAT${String(sale.catalogue_no).padStart(2, '0')} - ${formatDate(sale.sale_date)}`);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Rows per page selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={-1}>All</option>
            </select>
            <span className="text-sm text-gray-700">rows</span>
          </div>

          {/* Pagination info and controls */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {rowsPerPage === -1 ? (
                `Showing all ${filteredSales.filter(sale => !sale.is_empty).length} auctions`
              ) : (
                <>
                  Showing {((currentPage - 1) * rowsPerPage) + 1} to{' '}
                  {Math.min(currentPage * rowsPerPage, filteredSales.filter(sale => !sale.is_empty).length)} of{' '}
                  {filteredSales.filter(sale => !sale.is_empty).length} auctions
                </>
              )}
            </span>
            
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm border rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password-Protected Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Confirm Delete</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this auction? This action cannot be undone.
            </p>
            
            <div className="mb-4">
              <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 mb-2">
                Enter admin password to confirm:
              </label>
              <input
                type="password"
                id="deletePassword"
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value);
                  setDeletePasswordError(null);
                }}
                placeholder="Enter password..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  deletePasswordError ? 'border-red-300' : 'border-gray-300'
                }`}
                autoFocus
              />
              {deletePasswordError && (
                <p className="mt-1 text-sm text-red-600">{deletePasswordError}</p>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!deletePassword.trim()}
              >
                Delete Auction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionsList;