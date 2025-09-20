import React, { useState, useEffect } from 'react';
import type { Season, CatalogueEntry } from '../../types';

// South African Wool Auction Season Constants
const SA_WOOL_SEASON_INFO = {
  START_MONTH: 6, // July (0-indexed)
  END_MONTH: 5,   // June (0-indexed)
  AUCTION_DAY: 3, // Wednesday (0-indexed, Sunday = 0)
  EXPECTED_AUCTIONS: { min: 31, max: 35 },
  SEASON_DURATION_MONTHS: 12
};

interface CatalogueListManagerProps {
  onCreateAuctionFromCatalogue: (entry: CatalogueEntry) => void;
}

// Utility functions for South African Wool Season management
const generateSAWoolSeasonDates = (startYear: number) => {
  const startDate = new Date(startYear, SA_WOOL_SEASON_INFO.START_MONTH, 1);
  const endDate = new Date(startYear + 1, SA_WOOL_SEASON_INFO.END_MONTH, 30);
  
  // Find first Wednesday in July
  while (startDate.getDay() !== SA_WOOL_SEASON_INFO.AUCTION_DAY) {
    startDate.setDate(startDate.getDate() + 1);
  }
  
  return { startDate, endDate };
};

const generateWeeklyAuctionDates = (startDate: Date, endDate: Date) => {
  const auctionDates: string[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    auctionDates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 7); // Next Wednesday
  }
  
  return auctionDates;
};

const validateSAWoolSeason = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const isJulyStart = start.getMonth() === SA_WOOL_SEASON_INFO.START_MONTH;
  const isJuneEnd = end.getMonth() === SA_WOOL_SEASON_INFO.END_MONTH;
  const isTwelveMonths = (end.getFullYear() - start.getFullYear()) === 1;
  
  return {
    isValid: isJulyStart && isJuneEnd && isTwelveMonths,
    issues: [
      !isJulyStart && 'Season should start in July',
      !isJuneEnd && 'Season should end in June',
      !isTwelveMonths && 'Season should span 12 months (July to June)'
    ].filter(Boolean)
  };
};

const CatalogueListManager: React.FC<CatalogueListManagerProps> = ({ onCreateAuctionFromCatalogue }) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [catalogueEntries, setCatalogueEntries] = useState<CatalogueEntry[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [showCreateSeasonForm, setShowCreateSeasonForm] = useState(false);
  const [showQuickAddForm, setShowQuickAddForm] = useState(false);

  useEffect(() => {
    // Load seasons and catalogue entries from localStorage
    const savedSeasons = localStorage.getItem('seasons');
    const savedEntries = localStorage.getItem('catalogue_entries');
    
    if (savedSeasons) {
      setSeasons(JSON.parse(savedSeasons));
    }
    if (savedEntries) {
      setCatalogueEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveSeasons = (seasonsList: Season[]) => {
    localStorage.setItem('seasons', JSON.stringify(seasonsList));
    setSeasons(seasonsList);
  };

  const saveCatalogueEntries = (entries: CatalogueEntry[]) => {
    localStorage.setItem('catalogue_entries', JSON.stringify(entries));
    setCatalogueEntries(entries);
  };

  const getEntriesBySeason = (seasonId: string) => {
    return catalogueEntries.filter(entry => entry.season_id === seasonId);
  };

  const getSeasonInsights = (season: Season) => {
    const entries = getEntriesBySeason(season.id);
    const startDate = new Date(season.startDate);
    const endDate = new Date(season.endDate);
    const expectedAuctions = generateWeeklyAuctionDates(startDate, endDate).length;
    
    const validation = validateSAWoolSeason(season.startDate, season.endDate);
    
    return {
      totalEntries: entries.length,
      expectedAuctions,
      isSAWoolFormat: validation.isValid,
      validationIssues: validation.issues,
      scheduledEntries: entries.filter(e => e.status === 'scheduled').length,
      completedEntries: entries.filter(e => e.status === 'completed').length,
      inProgressEntries: entries.filter(e => e.status === 'in_progress').length
    };
  };

  const handleSeasonSelect = (season: Season) => {
    setSelectedSeason(season);
  };

  const handleCreateSeason = (seasonData: { name: string; startDate: string; endDate: string }) => {
    // Check for duplicate season name
    const isDuplicate = seasons.some(season => 
      season.name.toLowerCase() === seasonData.name.toLowerCase()
    );
    
    if (isDuplicate) {
      alert('A season with this name already exists. Please choose a different name.');
      return;
    }

    // Validate SA Wool Season format
    const validation = validateSAWoolSeason(seasonData.startDate, seasonData.endDate);
    if (!validation.isValid) {
      alert(`Invalid season format:\n${validation.issues.join('\n')}`);
      return;
    }

    // Create new season
    const newSeason: Season = {
      id: `season_${Date.now()}`,
      name: seasonData.name,
      startDate: seasonData.startDate,
      endDate: seasonData.endDate,
      created_at: new Date().toISOString(),
      created_by: 'Admin User'
    };

    const updatedSeasons = [...seasons, newSeason];
    saveSeasons(updatedSeasons);
    setSelectedSeason(newSeason);
    setShowCreateSeasonForm(false);
  };


  const handleAutoScheduleAuctions = () => {
    if (!selectedSeason) return;
    
    const startDate = new Date(selectedSeason.startDate);
    const endDate = new Date(selectedSeason.endDate);
    const auctionDates = generateWeeklyAuctionDates(startDate, endDate);
    
    const newEntries: CatalogueEntry[] = auctionDates.map((date, index) => {
      const saleDate = new Date(date);
      const chequeDate = new Date(saleDate);
      chequeDate.setDate(saleDate.getDate() + 7);
      
      const scaleDate = new Date(saleDate);
      scaleDate.setDate(saleDate.getDate() - 2);
      
      const omCutoffDate = new Date(saleDate);
      omCutoffDate.setDate(saleDate.getDate() - 5);
      
      return {
        id: `cat_entry_${Date.now()}_${index}`,
        catalogue_name: `Sale ${index + 1}`,
        season_id: selectedSeason.id,
        sale_date: date,
        cheque_date: chequeDate.toISOString().split('T')[0],
        cat_no: `CG${String(index + 1).padStart(2, '0')}`,
        scale_date: scaleDate.toISOString().split('T')[0],
        om_cutoff_date: omCutoffDate.toISOString().split('T')[0],
        status: 'scheduled' as const,
        created_at: new Date().toISOString(),
        created_by: 'Admin User',
        notes: `Auto-generated weekly auction #${index + 1}`
      };
    });
    
    const updatedEntries = [...catalogueEntries, ...newEntries];
    saveCatalogueEntries(updatedEntries);
    
    alert(`Successfully created ${newEntries.length} auction entries for ${selectedSeason.name}`);
  };


  const handleCreateAuction = (entry: CatalogueEntry) => {
    onCreateAuctionFromCatalogue(entry);
    
    // Update entry status to in_progress
    const updatedEntry = { ...entry, status: 'in_progress' as const };
    const updatedEntries = catalogueEntries.map(e => 
      e.id === entry.id ? updatedEntry : e
    );
    
    saveCatalogueEntries(updatedEntries);
  };

  const handleBulkAddEntries = (entries: Omit<CatalogueEntry, 'id' | 'created_at' | 'created_by'>[]) => {
    if (!selectedSeason) return;

    const newEntries: CatalogueEntry[] = entries.map(entry => ({
      ...entry,
      season_id: selectedSeason.id,
      id: `cat_entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      created_by: 'Admin User'
    }));

    const updatedEntries = [...catalogueEntries, ...newEntries];
    saveCatalogueEntries(updatedEntries);
    setShowQuickAddForm(false);
    
    alert(`Successfully added ${newEntries.length} catalogue entries`);
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📅 Catalogue List Management</h2>
        <p className="text-green-100">
          Create and manage predetermined auction dates and catalogue schedules
        </p>
      </div>

      {/* Navigation Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Seasons</span>
        {selectedSeason && (
          <>
            <span>›</span>
            <span className="text-gray-900 font-medium">{selectedSeason.name}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seasons Sidebar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Seasons</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateSeasonForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                title="Create New Season"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {seasons.map(season => {
              const insights = getSeasonInsights(season);
              return (
                <button
                  key={season.id}
                  onClick={() => handleSeasonSelect(season)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedSeason?.id === season.id
                      ? 'bg-blue-100 border-blue-300 border'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{season.name}</div>
                    {insights.isSAWoolFormat && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        🐑 SA Format
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {insights.totalEntries} entries ({insights.expectedAuctions} expected)
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(season.startDate).toLocaleDateString()} - {new Date(season.endDate).toLocaleDateString()}
                  </div>
                  {insights.validationIssues.length > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      ⚠️ {insights.validationIssues[0]}
                    </div>
                  )}
                </button>
              );
            })}
            {seasons.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No seasons yet</p>
                <p className="text-xs">Create a new season to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Catalogue Entries */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          {selectedSeason ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900">
                  Catalogue Entries ({getEntriesBySeason(selectedSeason.id).length})
                </h4>
                <div className="flex gap-2">
                  {(() => {
                    const insights = getSeasonInsights(selectedSeason);
                    const hasEntries = insights.totalEntries > 0;
                    return (
                      <>
                        {insights.isSAWoolFormat && !hasEntries && (
                          <button
                            onClick={handleAutoScheduleAuctions}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                            title="Auto-generate weekly Wednesday auctions for SA Wool season"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Auto-Schedule
                          </button>
                        )}
                        <button
                          onClick={() => setShowQuickAddForm(true)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Quick Add
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              {getEntriesBySeason(selectedSeason.id).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALE DATE</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHEQUE DATE</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CAT NO</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SCALE DATE</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OM CUT-OFF DATE</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getEntriesBySeason(selectedSeason.id)
                        .sort((a, b) => new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime())
                        .map(entry => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3 text-sm text-gray-900">
                            {new Date(entry.sale_date).toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: '2-digit' 
                            })}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-600">
                            {new Date(entry.cheque_date).toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: '2-digit' 
                            })}
                          </td>
                          <td className="px-3 py-3 text-sm font-medium text-gray-900">
                            {entry.cat_no}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-600">
                            {new Date(entry.scale_date).toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: '2-digit' 
                            })}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-600">
                            {new Date(entry.om_cutoff_date).toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: '2-digit' 
                            })}
                          </td>
                          <td className="px-3 py-3 text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              entry.status === 'completed' ? 'bg-green-100 text-green-800' :
                              entry.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              entry.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {entry.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm">
                            {entry.status === 'scheduled' && (
                              <button
                                onClick={() => handleCreateAuction(entry)}
                                className="text-blue-600 hover:text-blue-900 font-medium"
                              >
                                Create Auction
                              </button>
                            )}
                            {entry.status === 'in_progress' && (
                              <span className="text-orange-600 font-medium">In Progress</span>
                            )}
                            {entry.status === 'completed' && (
                              <span className="text-green-600 font-medium">Completed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No catalogue entries for {selectedSeason.name}</h3>
                  <p className="text-gray-600 mb-4">Use the Quick Add button to add catalogue entries for this season</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a season</h3>
              <p className="text-gray-600">Choose a season from the sidebar to view and manage catalogue entries</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Season Modal */}
      {showCreateSeasonForm && (
        <CreateSeasonModal
          onClose={() => setShowCreateSeasonForm(false)}
          onSave={handleCreateSeason}
        />
      )}


      {/* Quick Add Modal */}
      {showQuickAddForm && selectedSeason && (
        <QuickAddModal
          onClose={() => setShowQuickAddForm(false)}
          onSave={handleBulkAddEntries}
          season={selectedSeason}
          existingEntries={getEntriesBySeason(selectedSeason.id)}
        />
      )}

    </div>
  );
};

// Modal Components
const CreateSeasonModal: React.FC<{
  onClose: () => void;
  onSave: (data: { name: string; startDate: string; endDate: string }) => void;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Season</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Season Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Wool Sale Dates 2025-2026"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Season Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Season End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Season
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


const QuickAddModal: React.FC<{
  onClose: () => void;
  onSave: (entries: Omit<CatalogueEntry, 'id' | 'created_at' | 'created_by'>[]) => void;
  season: Season;
  existingEntries: CatalogueEntry[];
}> = ({ onClose, onSave, season, existingEntries }) => {
  const [entries, setEntries] = useState<Array<{
    action_date: string;
    prefix: string;
    cat_no: string;
    payment_date: string;
    scale_date: string;
    om_cutoff_date: string;
    catalogue_name: string;
    notes: string;
  }>>([{
    action_date: '',
    prefix: 'CG',
    cat_no: '',
    payment_date: '',
    scale_date: '',
    om_cutoff_date: '',
    catalogue_name: 'CG',
    notes: ''
  }]);

  const getNextCatNumber = (prefix: string, lastCatNo: string) => {
    // Extract number from last catalogue number (e.g., "01" -> "02")
    const match = lastCatNo.match(/(\d+)$/);
    if (match) {
      const lastNum = parseInt(match[1], 10);
      const nextNum = lastNum + 1;
      return String(nextNum).padStart(2, '0');
    }
    // Fallback to 01 if no number found
    return '01';
  };

  const addRow = () => {
    const lastEntry = entries[entries.length - 1];
    
    // Auto-increment auction date by 7 days
    let nextActionDate = '';
    if (lastEntry.action_date) {
      const lastDate = new Date(lastEntry.action_date);
      lastDate.setDate(lastDate.getDate() + 7);
      nextActionDate = lastDate.toISOString().split('T')[0];
    }
    
    // Auto-increment catalogue number by +1
    const nextCatNo = getNextCatNumber(lastEntry.prefix, lastEntry.cat_no);
    
    const newEntry = {
      action_date: nextActionDate,
      prefix: lastEntry.prefix, // Inherit prefix from previous row
      cat_no: nextCatNo,
      payment_date: '',
      scale_date: '',
      om_cutoff_date: '',
      catalogue_name: `${lastEntry.prefix}${nextCatNo}`,
      notes: ''
    };
    
    // Auto-calculate dates if action date is set
    if (nextActionDate) {
      const actionDate = new Date(nextActionDate);
      
      // Payment date (7 days after action date)
      const paymentDate = new Date(actionDate);
      paymentDate.setDate(actionDate.getDate() + 7);
      newEntry.payment_date = paymentDate.toISOString().split('T')[0];
      
      // Scale date (28 days before action date)
      const scaleDate = new Date(actionDate);
      scaleDate.setDate(actionDate.getDate() - 28);
      newEntry.scale_date = scaleDate.toISOString().split('T')[0];
      
      // OM cutoff date (2 days after scale date)
      const omCutoffDate = new Date(scaleDate);
      omCutoffDate.setDate(scaleDate.getDate() + 2);
      newEntry.om_cutoff_date = omCutoffDate.toISOString().split('T')[0];
    }
    
    setEntries([...entries, newEntry]);
  };

  const removeRow = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const updateEntry = (index: number, field: string, value: string) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    
    // Auto-calculate payment date (7 days after action date)
    if (field === 'action_date' && value) {
      const actionDate = new Date(value);
      const paymentDate = new Date(actionDate);
      paymentDate.setDate(actionDate.getDate() + 7);
      updatedEntries[index].payment_date = paymentDate.toISOString().split('T')[0];
    }
    
    // Auto-calculate scale date (28 days before action date)
    if (field === 'action_date' && value) {
      const actionDate = new Date(value);
      const scaleDate = new Date(actionDate);
      scaleDate.setDate(actionDate.getDate() - 28);
      updatedEntries[index].scale_date = scaleDate.toISOString().split('T')[0];
    }
    
    // Auto-calculate OM cutoff date (2 days after scale date)
    if (field === 'action_date' && value) {
      const actionDate = new Date(value);
      const scaleDate = new Date(actionDate);
      scaleDate.setDate(actionDate.getDate() - 28);
      const omCutoffDate = new Date(scaleDate);
      omCutoffDate.setDate(scaleDate.getDate() + 2);
      updatedEntries[index].om_cutoff_date = omCutoffDate.toISOString().split('T')[0];
    }
    
    // Auto-calculate OM cutoff date when scale date is manually changed
    if (field === 'scale_date' && value) {
      const scaleDate = new Date(value);
      const omCutoffDate = new Date(scaleDate);
      omCutoffDate.setDate(scaleDate.getDate() + 2);
      updatedEntries[index].om_cutoff_date = omCutoffDate.toISOString().split('T')[0];
    }
    
    // Auto-generate catalogue name from prefix and cat number
    if ((field === 'prefix' || field === 'cat_no') && (updatedEntries[index].prefix || updatedEntries[index].cat_no)) {
      const prefix = updatedEntries[index].prefix || '';
      const catNo = updatedEntries[index].cat_no || '';
      updatedEntries[index].catalogue_name = `${prefix}${catNo}`;
    }
    
    setEntries(updatedEntries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validEntries = entries.filter(entry => 
      entry.action_date && entry.cat_no && entry.payment_date && 
      entry.scale_date && entry.om_cutoff_date
    );
    
    if (validEntries.length === 0) {
      alert('Please fill in at least one complete entry');
      return;
    }
    
    const catalogueEntries = validEntries.map(entry => ({
      catalogue_name: entry.catalogue_name,
      season_id: season.id,
      sale_date: entry.action_date,
      cheque_date: entry.payment_date,
      cat_no: entry.cat_no,
      scale_date: entry.scale_date,
      om_cutoff_date: entry.om_cutoff_date,
      status: 'scheduled' as const,
      notes: entry.notes
    }));
    
    onSave(catalogueEntries);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Auction Schedule</h3>
          <p className="text-sm text-gray-600 mb-6">Bulk add multiple auction entries with auto-calculated dates</p>
          
          <form onSubmit={handleSubmit}>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b w-12">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Action Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Prefix</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Cat No</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Payment Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Scale Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">OM Cutoff</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Catalogue Name</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Notes</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-3 py-2 text-center text-sm font-medium text-gray-500 w-12">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          value={entry.action_date}
                          onChange={e => updateEntry(index, 'action_date', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          required
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={entry.prefix}
                          onChange={e => updateEntry(index, 'prefix', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          placeholder="CG"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={entry.cat_no}
                          onChange={e => {
                            let inputValue = e.target.value;
                            // Only allow digits
                            inputValue = inputValue.replace(/\D/g, '');
                            // Limit to 2 digits maximum
                            if (inputValue.length <= 2) {
                              updateEntry(index, 'cat_no', inputValue);
                            }
                          }}
                          onBlur={e => {
                            // Apply 2-digit formatting when user leaves the field
                            const currentNumber = e.target.value;
                            if (currentNumber && currentNumber.length > 0) {
                              const formattedNumber = currentNumber.padStart(2, '0');
                              updateEntry(index, 'cat_no', formattedNumber);
                            }
                          }}
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          placeholder="01"
                          maxLength={2}
                          required
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          value={entry.payment_date}
                          onChange={e => updateEntry(index, 'payment_date', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          required
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          value={entry.scale_date}
                          onChange={e => updateEntry(index, 'scale_date', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          required
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          value={entry.om_cutoff_date}
                          onChange={e => updateEntry(index, 'om_cutoff_date', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          required
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={entry.catalogue_name}
                          className="w-full p-1 border border-gray-300 rounded text-sm bg-gray-100"
                          readOnly
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={entry.notes}
                          onChange={e => updateEntry(index, 'notes', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          placeholder="Optional notes"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          disabled={entries.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>

            <div className="mt-4 flex justify-between items-center">
                  <button
                type="button"
                onClick={addRow}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Add Row
                  </button>
          
              <div className="flex gap-3">
            <button
                  type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save All Entries
            </button>
          </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CatalogueListManager;
