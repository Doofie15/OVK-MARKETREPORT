import React, { useState, useEffect } from 'react';
import type { Season, AuctionReport } from '../../types';

interface SeasonListProps {
  seasons: Season[];
  reports: AuctionReport[];
  onCreateSeason: () => void;
  onEditSeason: (season: Season) => void;
  onDeleteSeason: (seasonId: string) => Promise<{ success: boolean; error?: string }>;
}

const SeasonList: React.FC<SeasonListProps> = ({ seasons, reports, onCreateSeason, onEditSeason, onDeleteSeason }) => {
  const [filteredSeasons, setFilteredSeasons] = useState<Season[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState<string | null>(null);

  // Debug logging
  console.log('🔍 SeasonList received props:', {
    seasonsCount: seasons.length,
    reportsCount: reports.length,
    seasons: seasons.map(s => ({ id: s.id, season_year: s.season_year })),
    reports: reports.map(r => ({ 
      auction_id: r.auction.id, 
      season_id: r.auction.season_id, 
      season_label: r.auction.season_label,
      catalogue_name: r.auction.catalogue_name
    }))
  });

  // Filter seasons based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSeasons(seasons);
    } else {
      const filtered = seasons.filter(season =>
        season.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
        season.start_date.includes(searchTerm) ||
        season.end_date.includes(searchTerm)
      );
      setFilteredSeasons(filtered);
    }
  }, [seasons, searchTerm]);


  const handleDeleteSeasonClick = (seasonId: string, seasonName: string) => {
    setDeleteConfirm(seasonId);
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
      const result = await onDeleteSeason(deleteConfirm);
      if (result.success) {
        setSelectedSeasons(selectedSeasons.filter(id => id !== deleteConfirm));
        setDeleteConfirm(null);
        setDeletePassword('');
        setDeletePasswordError(null);
      } else {
        setDeletePasswordError(result.error || 'Failed to delete season');
      }
    } catch (err) {
      setDeletePasswordError('Failed to delete season');
      console.error('Error deleting season:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
    setDeletePassword('');
    setDeletePasswordError(null);
  };

  const handleSelectAll = () => {
    if (selectedSeasons.length === filteredSeasons.length) {
      setSelectedSeasons([]);
    } else {
      setSelectedSeasons(filteredSeasons.map(season => season.id));
    }
  };

  const handleSelectSeason = (seasonId: string) => {
    setSelectedSeasons(prev =>
      prev.includes(seasonId)
        ? prev.filter(id => id !== seasonId)
        : [...prev, seasonId]
    );
  };

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    // Export functionality can be implemented later
    alert(`Export to ${format} functionality will be implemented in a future update`);
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate statistics for a season
  const getSeasonStats = (season: Season) => {
    console.log('🔍 Calculating stats for season:', season.season_year, 'ID:', season.id);
    console.log('📊 Total reports available:', reports.length);
    
    // Filter reports for this season
    const seasonReports = reports.filter(report => 
      report.auction.season_id === season.id || 
      report.auction.season_label === season.season_year
    );
    
    console.log('📋 Season reports found:', seasonReports.length);
    console.log('📋 Season reports data:', seasonReports.map(r => ({
      season_id: r.auction.season_id,
      season_label: r.auction.season_label,
      supply_stats: r.auction.supply_stats,
      greasy_stats: r.auction.greasy_stats
    })));
    
    // Calculate totals from the auction data
    const totals = seasonReports.reduce((acc, report) => {
      // Check if we're accessing the right structure
      console.log('🔍 Report structure:', {
        hasAuction: !!report.auction,
        hasSupplyStats: !!report.supply_stats,
        hasGreasyStats: !!report.greasy_stats,
        reportKeys: Object.keys(report),
        auctionKeys: report.auction ? Object.keys(report.auction) : []
      });
      
      const auction = report.auction;
      const supplyStats = report.supply_stats || auction.supply_stats;
      const greasyStats = report.greasy_stats || auction.greasy_stats;
      
      console.log('📈 Processing auction:', auction.catalogue_name, {
        auction_full: auction,
        supplyStats,
        greasyStats,
        sold_bales: supplyStats?.sold_bales,
        mass_kg: greasyStats?.mass_kg,
        turnover_rand: greasyStats?.turnover_rand
      });
      
      return {
        auctionCount: acc.auctionCount + 1,
        totalBales: acc.totalBales + (supplyStats?.sold_bales || 0),
        totalVolume: acc.totalVolume + (greasyStats?.mass_kg || 0),
        totalTurnover: acc.totalTurnover + (greasyStats?.turnover_rand || 0)
      };
    }, {
      auctionCount: 0,
      totalBales: 0,
      totalVolume: 0,
      totalTurnover: 0
    });
    
    console.log('📊 Final totals calculated:', totals);
    return totals;
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Season Management</h1>
          <p className="text-gray-600">Manage auction seasons and their configurations</p>
        </div>
        <button
          onClick={onCreateSeason}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          + Add New Season
        </button>
      </div>

      {/* Error Message */}

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
                placeholder="Search seasons by year or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Export Controls */}
          <div className="flex items-center gap-2">
            {selectedSeasons.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedSeasons.length} selected
              </span>
            )}
            <div className="relative group">
              <button 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={seasons.length === 0}
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

      {/* Seasons Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredSeasons.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No seasons found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating a new season.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={onCreateSeason}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Season
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
                      checked={selectedSeasons.length === filteredSeasons.length && filteredSeasons.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number of Auctions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    # Bales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Turnover
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSeasons.map((season) => {
                  const stats = getSeasonStats(season);
                  return (
                    <tr key={season.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedSeasons.includes(season.id)}
                          onChange={() => handleSelectSeason(season.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{season.season_year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(season.start_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(season.end_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {stats.auctionCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {stats.totalBales.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {stats.totalVolume.toLocaleString()} kg
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          R{(stats.totalTurnover / 1000000).toFixed(1)}M
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onEditSeason(season)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View/Edit Season"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteSeasonClick(season.id, season.year)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete Season"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredSeasons.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {filteredSeasons.length} of {seasons.length} seasons
        </div>
      )}

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
              Are you sure you want to delete this season? This action cannot be undone.
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
                Delete Season
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonList;
