import React, { useState, useEffect } from 'react';
import type { 
  AuctionReport, 
  MarketIndices, 
  CurrencyFX, 
  SupplyStats, 
  HighestPrice, 
  CertifiedShare, 
  GreasyStats, 
  MicronPriceComparison,
  CompanyData,
  TopClientPrice,
  ClientPerformance,
  AgencyMetrics
} from '../../types';
import { AuctionDataService } from '../../data';

// Add New Modal Component
const AddNewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  title: string;
  placeholder: string;
}> = ({ isOpen, onClose, onSave, title, placeholder }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), description.trim());
      setName('');
      setDescription('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholder}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

interface AuctionDataCaptureFormProps {
  onSave: (report: Omit<AuctionReport, 'top_sales'>) => void;
  onCancel: () => void;
  editingReport?: AuctionReport;
}

const AuctionDataCaptureForm: React.FC<AuctionDataCaptureFormProps> = ({ 
  onSave, 
  onCancel, 
  editingReport 
}) => {
  const [activeTab, setActiveTab] = useState('auction-details');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [formData, setFormData] = useState<Omit<AuctionReport, 'top_sales'>>(
    editingReport || {
      auction: {
        commodity: 'wool' as const,
        season_label: '2025/26',
        week_id: '',
        week_start: '',
        week_end: '',
        auction_date: new Date().toISOString().split('T')[0],
        catalogue_name: '',
        sale_number: '',
        auction_center: 'Port Elizabeth',
        report_pdf_filename: ''
      },
      indicators: [],
      benchmarks: [],
      micron_prices: [
        { bucket_micron: '15.0', category: 'Fine', price_clean_zar_per_kg: 0 },
        { bucket_micron: '16.0', category: 'Fine', price_clean_zar_per_kg: 0 },
        { bucket_micron: '17.0', category: 'Fine', price_clean_zar_per_kg: 0 },
        { bucket_micron: '17.5', category: 'Fine', price_clean_zar_per_kg: 0 },
        { bucket_micron: '18.0', category: 'Fine', price_clean_zar_per_kg: 0 },
        { bucket_micron: '18.5', category: 'Medium', price_clean_zar_per_kg: 0 },
        { bucket_micron: '19.0', category: 'Medium', price_clean_zar_per_kg: 0 },
        { bucket_micron: '19.5', category: 'Medium', price_clean_zar_per_kg: 0 },
        { bucket_micron: '20.0', category: 'Medium', price_clean_zar_per_kg: 0 },
        { bucket_micron: '20.5', category: 'Strong', price_clean_zar_per_kg: 0 },
        { bucket_micron: '21.0', category: 'Strong', price_clean_zar_per_kg: 0 },
        { bucket_micron: '21.5', category: 'Strong', price_clean_zar_per_kg: 0 },
        { bucket_micron: '22.0', category: 'Strong', price_clean_zar_per_kg: 0 }
      ],
      buyers: [],
      brokers: [],
      currencies: [],
      insights: '',
      trends: { rws: [], non_rws: [] },
      yearly_average_prices: [],
      provincial_producers: [],
      province_avg_prices: [],
      // Cape Wools fields
      market_indices: {
        merino_indicator_cents_clean: 0,
        certified_indicator_cents_clean: 0,
        change_merino_pct: 0,
        change_certified_pct: 0,
        awex_emi_cents_clean: 0
      },
      currency_fx: {
        ZAR_USD: 0,
        ZAR_EUR: 0,
        ZAR_JPY: 0,
        ZAR_GBP: 0,
        USD_AUD: 0
      },
      supply_stats: {
        offered_bales: 0,
        sold_bales: 0,
        clearance_rate_pct: 0
      },
      highest_price: {
        price_cents_clean: 0,
        micron: 0,
        bales: 0
      },
      certified_share: {
        merino_pct_offered: 0,
        merino_pct_sold: 0
      },
      greasy_stats: {
        turnover_rand: 0,
        bales: 0,
        mass_kg: 0
      },
      micron_price_comparison: {
        rows: [],
        notes: ''
      },
      // Company-specific data
      company_data: {
        top_client_price: {
          price_per_kg: 0,
          clean_price: 0,
          lot_size: 0,
          lot_type: '',
          micron: 0,
          producer: '',
          buyer: ''
        },
        client_performance: [],
        agency_metrics: {
          total_clients_served: 0,
          total_volume_handled: 0,
          average_client_price: 0,
          premium_achieved: 0
        },
        notes: ''
      }
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set());
  
  // Modal and custom entries state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'buyer' | 'broker' | null;
    title: string;
    placeholder: string;
  }>({
    isOpen: false,
    type: null,
    title: '',
    placeholder: ''
  });
  
  // Custom entries storage (in a real app, this would be in a database)
  const [customEntries, setCustomEntries] = useState<{
    buyers: Array<{ name: string; description: string }>;
    brokers: Array<{ name: string; description: string }>;
  }>({
    buyers: [],
    brokers: []
  });

  const tabs = [
    { id: 'auction-details', label: 'Auction Details', icon: '📅' },
    { id: 'market-indices', label: 'Market Indices', icon: '📈' },
    { id: 'currency-exchange', label: 'Currency Exchange', icon: '💱' },
    { id: 'supply-stats', label: 'Supply & Statistics', icon: '📊' },
    { id: 'micron-prices', label: 'Micron Prices', icon: '💰' },
    { id: 'buyers-brokers', label: 'Buyers & Brokers', icon: '👥' },
    { id: 'provincial-data', label: 'Provincial Data', icon: '🗺️' },
    { id: 'company-data', label: 'Company Data', icon: '🏢' },
    { id: 'market-insights', label: 'Market Insights', icon: '💡' },
    { id: 'review-save', label: 'Review & Save', icon: '✅' }
  ];

  // Auto-calculate week details when auction date changes
  useEffect(() => {
    if (formData.auction.auction_date) {
      const auctionDate = new Date(formData.auction.auction_date);
      const dayOfWeek = auctionDate.getUTCDay();
      const weekStart = new Date(auctionDate);
      weekStart.setUTCDate(auctionDate.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
      const weekEnd = new Date(weekStart);
      weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

      const year = auctionDate.getFullYear();
      const startOfYear = new Date(year, 0, 1);
      const weekNumber = Math.ceil((((auctionDate.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);

      setFormData(prev => ({
        ...prev,
        auction: {
          ...prev.auction,
          week_start: weekStart.toISOString().split('T')[0],
          week_end: weekEnd.toISOString().split('T')[0],
          week_id: `week_${year}_${String(weekNumber).padStart(2, '0')}`
        }
      }));
    }
  }, [formData.auction.auction_date]);

  const validateTab = (tabId: string): boolean => {
    const newErrors: Record<string, string> = {};

    switch (tabId) {
      case 'auction-details':
        if (!formData.auction.auction_date) newErrors.auction_date = 'Auction date is required';
        if (!formData.auction.catalogue_name) newErrors.catalogue_name = 'Catalogue name is required';
        break;
      case 'market-stats':
        const totalLots = formData.indicators.find(i => i.type === 'total_lots')?.value;
        const totalVolume = formData.indicators.find(i => i.type === 'total_volume')?.value;
        if (!totalLots || totalLots <= 0) newErrors.total_lots = 'Total lots must be greater than 0';
        if (!totalVolume || totalVolume <= 0) newErrors.total_volume = 'Total volume must be greater than 0';
        break;
      case 'buyers-brokers':
        if (formData.buyers.length === 0) newErrors.buyers = 'At least one buyer is required';
        if (formData.brokers.length === 0) newErrors.brokers = 'At least one broker is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Validate all required tabs
    const requiredTabs = ['auction-details', 'market-stats', 'buyers-brokers'];
    let allValid = true;
    
    for (const tabId of requiredTabs) {
      if (!validateTab(tabId)) {
        allValid = false;
      }
    }
    
    if (allValid) {
      setIsSaving(true);
      try {
        await AuctionDataService.saveAuctionReport(formData);
        onSave(formData);
      } catch (error) {
        console.error('Error saving auction report:', error);
        setErrors({ save: 'Failed to save auction report. Please try again.' });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await AuctionDataService.saveAuctionReportDraft(formData);
      setErrors({ save: 'Draft saved successfully!' });
      // Clear success message after 3 seconds
      setTimeout(() => setErrors({}), 3000);
    } catch (error) {
      console.error('Error saving auction report draft:', error);
      setErrors({ save: 'Failed to save draft. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Modal handlers
  const openModal = (type: 'buyer' | 'broker') => {
    setModalState({
      isOpen: true,
      type,
      title: `Add New ${type === 'buyer' ? 'Buyer' : 'Broker'}`,
      placeholder: `Enter ${type === 'buyer' ? 'buyer' : 'broker'} name...`
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      title: '',
      placeholder: ''
    });
  };

  const handleAddNewEntry = (name: string, description: string) => {
    if (modalState.type) {
      setCustomEntries(prev => ({
        ...prev,
        [modalState.type + 's']: [...prev[modalState.type + 's' as keyof typeof prev], { name, description }]
      }));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'auction-details':
        return <AuctionDetailsTab formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 'market-indices':
        return <MarketIndicesTab formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 'currency-exchange':
        return <CurrencyExchangeTab formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 'supply-stats':
        return <SupplyStatsTab formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 'micron-prices':
        return <MicronPricesTab formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 'buyers-brokers':
        return <BuyersBrokersTab 
          formData={formData} 
          updateFormData={updateFormData} 
          errors={errors}
          customEntries={customEntries}
          onOpenModal={openModal}
        />;
      case 'provincial-data':
        return <ProvincialDataTab formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 'company-data':
        return <CompanyDataTab formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 'market-insights':
        return <MarketInsightsTab formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 'review-save':
        return <ReviewSaveTab formData={formData} onSave={handleSave} onSaveDraft={handleSaveDraft} onCancel={onCancel} isSaving={isSaving} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">
          {editingReport ? 'Edit Auction Report' : 'Add New Auction Report'}
        </h1>
          <p className="text-gray-600 mt-1">
            Capture comprehensive auction and market data for report generation
        </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-6">
          <nav 
            className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2 cursor-grab select-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            onWheel={(e) => {
              e.preventDefault();
              const container = e.currentTarget;
              container.scrollLeft += e.deltaY;
            }}
            onMouseDown={(e) => {
              setIsDragging(true);
              setStartX(e.pageX - e.currentTarget.offsetLeft);
              setScrollLeft(e.currentTarget.scrollLeft);
              e.currentTarget.style.cursor = 'grabbing';
            }}
            onMouseLeave={(e) => {
              setIsDragging(false);
              e.currentTarget.style.cursor = 'grab';
            }}
            onMouseUp={(e) => {
              setIsDragging(false);
              e.currentTarget.style.cursor = 'grab';
            }}
            onMouseMove={(e) => {
              if (!isDragging) return;
              e.preventDefault();
              const x = e.pageX - e.currentTarget.offsetLeft;
              const walk = (x - startX) * 2;
              e.currentTarget.scrollLeft = scrollLeft - walk;
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              setStartX(e.touches[0].pageX - e.currentTarget.offsetLeft);
              setScrollLeft(e.currentTarget.scrollLeft);
            }}
            onTouchMove={(e) => {
              if (!isDragging) return;
              e.preventDefault();
              const x = e.touches[0].pageX - e.currentTarget.offsetLeft;
              const walk = (x - startX) * 2;
              e.currentTarget.scrollLeft = scrollLeft - walk;
            }}
            onTouchEnd={() => {
              setIsDragging(false);
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 py-3 px-3 border-b-2 font-medium text-xs whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
                {completedTabs.has(tab.id) && (
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <div className="h-full bg-blue-500 opacity-30" style={{ width: '20%' }}></div>
        </div>
        
        {/* Scroll hint */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 text-xs opacity-60">
          <div className="flex items-center space-x-1">
            <span>←</span>
            <span>scroll</span>
            <span>→</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
            {renderTabContent()}
      </div>
        </div>
      </div>

      {/* Add New Modal */}
      <AddNewModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSave={handleAddNewEntry}
        title={modalState.title}
        placeholder={modalState.placeholder}
      />
    </div>
  );
};


// Tab Components
const AuctionDetailsTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Auction Details</h2>
        <p className="text-gray-600 text-sm">Enter the basic auction information including date, catalogue name, and commodity type.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Auction Date *
          </label>
          <input
            type="date"
            value={formData.auction.auction_date}
            onChange={(e) => updateFormData({
              auction: { ...formData.auction, auction_date: e.target.value }
            })}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.auction_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.auction_date && (
            <p className="mt-1 text-sm text-red-600">{errors.auction_date}</p>
          )}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catalogue Name *
          </label>
          <input
            type="text"
              value={formData.auction.catalogue_name}
            onChange={(e) => updateFormData({
                auction: { ...formData.auction, catalogue_name: e.target.value }
              })}
              placeholder="e.g., CAT01"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.catalogue_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
            {errors.catalogue_name && (
              <p className="mt-1 text-sm text-red-600">{errors.catalogue_name}</p>
          )}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Number
          </label>
          <input
            type="text"
              value={formData.auction.sale_number || ''}
            onChange={(e) => updateFormData({
                auction: { ...formData.auction, sale_number: e.target.value }
              })}
              placeholder="e.g., 01"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commodity Type
            </label>
            <select
              value={formData.auction.commodity}
              onChange={(e) => updateFormData({
                auction: { ...formData.auction, commodity: e.target.value as 'wool' | 'mohair' }
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="wool">Wool</option>
              <option value="mohair">Mohair</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Season Label
          </label>
          <input
            type="text"
              value={formData.auction.season_label}
            onChange={(e) => updateFormData({
                auction: { ...formData.auction, season_label: e.target.value }
              })}
              placeholder="e.g., 2025/26"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Week Start
          </label>
          <input
              type="date"
              value={formData.auction.week_start}
            readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          />
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Week End
            </label>
            <input
              type="date"
              value={formData.auction.week_end}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
      </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Week ID
          </label>
          <input
            type="text"
            value={formData.auction.week_id}
            readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 font-mono text-sm"
          />
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auction Center
            </label>
            <input
              type="text"
              value={formData.auction.auction_center || ''}
              onChange={(e) => updateFormData({
                auction: { ...formData.auction, auction_center: e.target.value }
              })}
              placeholder="e.g., Port Elizabeth"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
      </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report PDF Filename
            </label>
            <input
              type="text"
              value={formData.auction.report_pdf_filename || ''}
              onChange={(e) => updateFormData({
                auction: { ...formData.auction, report_pdf_filename: e.target.value }
              })}
              placeholder="e.g., marketreport202501.pdf"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketIndicesTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {
  const [merinoInput, setMerinoInput] = useState('');
  const [certifiedInput, setCertifiedInput] = useState('');
  const [previousData, setPreviousData] = useState<Omit<AuctionReport, 'top_sales'> | null>(null);

  // Load previous auction data for comparison
  useEffect(() => {
    const loadPreviousData = async () => {
      try {
        const latestReport = await AuctionDataService.getLatestAuctionReport();
        setPreviousData(latestReport);
      } catch (error) {
        console.error('Error loading previous auction data:', error);
      }
    };
    loadPreviousData();
  }, []);


  // Initialize input values when formData changes
  useEffect(() => {
    if (formData.market_indices?.change_merino_pct !== undefined && formData.market_indices.change_merino_pct !== 0) {
      setMerinoInput(formData.market_indices.change_merino_pct.toString());
    }
    if (formData.market_indices?.change_certified_pct !== undefined && formData.market_indices.change_certified_pct !== 0) {
      setCertifiedInput(formData.market_indices.change_certified_pct.toString());
    }
  }, [formData.market_indices]);

  const handleMarketIndicesChange = (field: keyof MarketIndices, value: string) => {
    const market_indices = { ...formData.market_indices };
    (market_indices as any)[field] = parseFloat(value) || 0;
    
    // Auto-calculate percentage changes when main indicators change
    if (previousData && field === 'merino_indicator_cents_clean' && previousData.market_indices?.merino_indicator_cents_clean) {
      const currentValue = parseFloat(value) || 0;
      const previousValue = previousData.market_indices.merino_indicator_cents_clean;
      if (currentValue > 0) {
        const calculatedChange = ((currentValue - previousValue) / previousValue) * 100;
        const roundedChange = parseFloat(calculatedChange.toFixed(2)); // Round to 2 decimals
        market_indices.change_merino_pct = roundedChange;
        setMerinoInput(roundedChange.toString());
      }
    }
    
    if (previousData && field === 'certified_indicator_cents_clean' && previousData.market_indices?.certified_indicator_cents_clean) {
      const currentValue = parseFloat(value) || 0;
      const previousValue = previousData.market_indices.certified_indicator_cents_clean;
      if (currentValue > 0) {
        const calculatedChange = ((currentValue - previousValue) / previousValue) * 100;
        const roundedChange = parseFloat(calculatedChange.toFixed(2)); // Round to 2 decimals
        market_indices.change_certified_pct = roundedChange;
        setCertifiedInput(roundedChange.toString());
      }
    }
    
    updateFormData({ market_indices });
  };

  const handlePercentageInput = (field: 'change_merino_pct' | 'change_certified_pct', value: string) => {
    // Simple validation - only allow valid decimal number format
    const isValidInput = /^-?\d*\.?\d*$/.test(value);
    
    if (isValidInput) {
      // Update local state for immediate UI feedback
      if (field === 'change_merino_pct') {
        setMerinoInput(value);
      } else {
        setCertifiedInput(value);
      }
      
      // Parse and update form data only if we have a complete valid number
      if (value !== '' && value !== '-' && value !== '.' && !value.endsWith('.')) {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          const market_indices = { ...formData.market_indices };
          (market_indices as any)[field] = numericValue;
          updateFormData({ market_indices });
        }
      }
    }
  };

  const handlePercentageBlur = (field: 'change_merino_pct' | 'change_certified_pct') => {
    // Just clean up the input, no % symbol needed
    const value = field === 'change_merino_pct' ? merinoInput : certifiedInput;
    const numericValue = parseFloat(value) || 0;
    
    if (field === 'change_merino_pct') {
      setMerinoInput(numericValue ? numericValue.toString() : '');
    } else {
      setCertifiedInput(numericValue ? numericValue.toString() : '');
    }
  };

  return (
    <div className="space-y-6">
          <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Market Indices</h2>
        <p className="text-gray-600 text-sm">Enter the key market indices and indicators from the Cape Wools report.</p>
          </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <div className="flex items-center">
                Merino Indicator (cents clean)
                <PreviousValueTag previousValue={previousData?.market_indices?.merino_indicator_cents_clean} />
              </div>
              <PercentageChangeTag 
                currentValue={formData.market_indices?.merino_indicator_cents_clean}
                previousValue={previousData?.market_indices?.merino_indicator_cents_clean}
              />
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.market_indices?.merino_indicator_cents_clean || ''}
              onChange={(e) => handleMarketIndicesChange('merino_indicator_cents_clean', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 17504"
            />
        </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <div className="flex items-center">
                Certified Indicator (cents clean)
                <PreviousValueTag previousValue={previousData?.market_indices?.certified_indicator_cents_clean} />
              </div>
              <PercentageChangeTag 
                currentValue={formData.market_indices?.certified_indicator_cents_clean}
                previousValue={previousData?.market_indices?.certified_indicator_cents_clean}
              />
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.market_indices?.certified_indicator_cents_clean || ''}
              onChange={(e) => handleMarketIndicesChange('certified_indicator_cents_clean', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 18000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <div className="flex items-center">
                AWEX EMI (cents clean)
                <PreviousValueTag previousValue={previousData?.market_indices?.awex_emi_cents_clean} />
              </div>
              <PercentageChangeTag 
                currentValue={formData.market_indices?.awex_emi_cents_clean}
                previousValue={previousData?.market_indices?.awex_emi_cents_clean}
              />
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.market_indices?.awex_emi_cents_clean || ''}
              onChange={(e) => handleMarketIndicesChange('awex_emi_cents_clean', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1247"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Change Merino (%)
              {previousData && formData.market_indices?.merino_indicator_cents_clean && 
               previousData.market_indices?.merino_indicator_cents_clean && (
                <span className="text-xs text-blue-600 ml-2">
                  (Auto-calculated, editable)
                </span>
              )}
            </label>
            <input
              type="text"
              value={merinoInput}
              onChange={(e) => handlePercentageInput('change_merino_pct', e.target.value)}
              onBlur={() => handlePercentageBlur('change_merino_pct')}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                previousData && formData.market_indices?.merino_indicator_cents_clean && 
                previousData.market_indices?.merino_indicator_cents_clean 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-300'
              }`}
              placeholder="e.g., -7.5 or 1.4"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Change Certified (%)
              {previousData && formData.market_indices?.certified_indicator_cents_clean && 
               previousData.market_indices?.certified_indicator_cents_clean && (
                <span className="text-xs text-blue-600 ml-2">
                  (Auto-calculated, editable)
                </span>
              )}
            </label>
            <input
              type="text"
              value={certifiedInput}
              onChange={(e) => handlePercentageInput('change_certified_pct', e.target.value)}
              onBlur={() => handlePercentageBlur('change_certified_pct')}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                previousData && formData.market_indices?.certified_indicator_cents_clean && 
                previousData.market_indices?.certified_indicator_cents_clean 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-300'
              }`}
              placeholder="e.g., -2.3 or 1.4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Previous Value Tag Component (goes next to label)
const PreviousValueTag: React.FC<{
  previousValue: number | undefined;
}> = ({ previousValue }) => {
  if (!previousValue || previousValue === 0) return null;

  return (
    <span className="text-xs text-gray-600 px-2 py-1 bg-amber-50 border border-amber-200 rounded ml-2">
      Prev Auction - {previousValue.toFixed(previousValue >= 1 ? 2 : 4)}
    </span>
  );
};

// Percentage Change Tag Component (goes at end of label line)
const PercentageChangeTag: React.FC<{
  currentValue: number | undefined;
  previousValue: number | undefined;
  isCurrency?: boolean; // For currency exchange rates (inverted logic)
}> = ({ currentValue, previousValue, isCurrency = false }) => {
  if (!previousValue || previousValue === 0 || !currentValue || currentValue === 0) return null;

  const change = ((currentValue - previousValue) / previousValue) * 100;
  const isIncrease = change > 0;
  const isDecrease = change < 0;

  if (change === 0) return null;

  // For currencies: increase = bad (red), decrease = good (green)
  // For normal values: increase = good (green), decrease = bad (red)
  const isGoodChange = isCurrency ? isDecrease : isIncrease;
  const isBadChange = isCurrency ? isIncrease : isDecrease;

  // For currencies: arrow should be inverted too (increase = down arrow, decrease = up arrow)
  const arrowDirection = isCurrency 
    ? (isIncrease ? '▼' : isDecrease ? '▲' : '→')
    : (isIncrease ? '▲' : isDecrease ? '▼' : '→');

  return (
    <span className={`text-xs px-2 py-1 rounded font-medium ${
      isGoodChange 
        ? 'text-green-700 bg-green-50 border border-green-200' 
        : isBadChange 
        ? 'text-red-700 bg-red-50 border border-red-200'
        : 'text-gray-700 bg-gray-50 border border-gray-200'
    }`}>
      {arrowDirection} {Math.abs(change).toFixed(2)}%
    </span>
  );
};

const CurrencyExchangeTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {
  const [previousData, setPreviousData] = useState<Omit<AuctionReport, 'top_sales'> | null>(null);

  // Load previous auction data for comparison
  useEffect(() => {
    const loadPreviousData = async () => {
      try {
        const latestReport = await AuctionDataService.getLatestAuctionReport();
        setPreviousData(latestReport);
      } catch (error) {
        console.error('Error loading previous auction data:', error);
      }
    };
    loadPreviousData();
  }, []);

  const handleCurrencyChange = (field: keyof CurrencyFX, value: string) => {
    const currency_fx = { ...formData.currency_fx };
    (currency_fx as any)[field] = parseFloat(value) || 0;
    updateFormData({ currency_fx });
  };

  const handleAddTestData = async () => {
    try {
      const testReport = await AuctionDataService.addSimpleTestData();
      setPreviousData(testReport || null);
      alert('✅ Test data added! Previous values should now appear below inputs.');
    } catch (error) {
      console.error('Error adding test data:', error);
      alert('❌ Error adding test data. Check console.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Currency Exchange Rates</h2>
        <p className="text-gray-600 text-sm">Enter the currency exchange rates from the Cape Wools report.</p>
        
        {/* Temporary Test Data Button */}
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 font-medium">Testing Previous Values</p>
              <p className="text-xs text-yellow-700">Add dummy previous auction data to test comparison feature</p>
            </div>
            <button 
              onClick={handleAddTestData}
              className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
            >
              Add Test Data
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <div className="flex items-center">
                ZAR/USD
                <PreviousValueTag previousValue={previousData?.currency_fx?.ZAR_USD} />
              </div>
              <PercentageChangeTag 
                currentValue={formData.currency_fx?.ZAR_USD}
                previousValue={previousData?.currency_fx?.ZAR_USD}
                isCurrency={true}
              />
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.currency_fx?.ZAR_USD || ''}
              onChange={(e) => handleCurrencyChange('ZAR_USD', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 17.67"
            />
              </div>
              
                <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <div className="flex items-center">
                ZAR/EUR
                <PreviousValueTag previousValue={previousData?.currency_fx?.ZAR_EUR} />
              </div>
              <PercentageChangeTag 
                currentValue={formData.currency_fx?.ZAR_EUR}
                previousValue={previousData?.currency_fx?.ZAR_EUR}
                isCurrency={true}
              />
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.currency_fx?.ZAR_EUR || ''}
              onChange={(e) => handleCurrencyChange('ZAR_EUR', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 20.54"
            />
                </div>

                <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <div className="flex items-center">
                ZAR/JPY
                <PreviousValueTag previousValue={previousData?.currency_fx?.ZAR_JPY} />
              </div>
              <PercentageChangeTag 
                currentValue={formData.currency_fx?.ZAR_JPY}
                previousValue={previousData?.currency_fx?.ZAR_JPY}
                isCurrency={true}
              />
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.currency_fx?.ZAR_JPY || ''}
              onChange={(e) => handleCurrencyChange('ZAR_JPY', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 8.38"
            />
          </div>
                </div>

        <div className="space-y-4">
                <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <div className="flex items-center">
                ZAR/GBP
                <PreviousValueTag previousValue={previousData?.currency_fx?.ZAR_GBP} />
              </div>
              <PercentageChangeTag 
                currentValue={formData.currency_fx?.ZAR_GBP}
                previousValue={previousData?.currency_fx?.ZAR_GBP}
                isCurrency={true}
              />
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.currency_fx?.ZAR_GBP || ''}
              onChange={(e) => handleCurrencyChange('ZAR_GBP', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 23.79"
            />
                </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <div className="flex items-center">
                USD/AUD
                <PreviousValueTag previousValue={previousData?.currency_fx?.USD_AUD} />
              </div>
              <PercentageChangeTag 
                currentValue={formData.currency_fx?.USD_AUD}
                previousValue={previousData?.currency_fx?.USD_AUD}
                isCurrency={true}
              />
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.currency_fx?.USD_AUD || ''}
              onChange={(e) => handleCurrencyChange('USD_AUD', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 0.6442"
            />
              </div>
            </div>
        </div>
    </div>
  );
};

const SupplyStatsTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {
  const [previousData, setPreviousData] = useState<Omit<AuctionReport, 'top_sales'> | null>(null);

  // Load previous auction data for comparison
  useEffect(() => {
    const loadPreviousData = async () => {
      try {
        const latestReport = await AuctionDataService.getLatestAuctionReport();
        setPreviousData(latestReport);
      } catch (error) {
        console.error('Error loading previous auction data:', error);
      }
    };
    loadPreviousData();
  }, []);

  const handleSupplyStatsChange = (field: keyof SupplyStats, value: string) => {
    const supply_stats = { ...formData.supply_stats };
    (supply_stats as any)[field] = parseFloat(value) || 0;
    updateFormData({ supply_stats });
  };

  const handleHighestPriceChange = (field: keyof HighestPrice, value: string) => {
    const highest_price = { ...formData.highest_price };
    (highest_price as any)[field] = parseFloat(value) || 0;
    updateFormData({ highest_price });
  };

  const handleCertifiedShareChange = (field: keyof CertifiedShare, value: string) => {
    const certified_share = { ...formData.certified_share };
    (certified_share as any)[field] = parseFloat(value) || 0;
    updateFormData({ certified_share });
  };

  const handleGreasyStatsChange = (field: keyof GreasyStats, value: string) => {
    const greasy_stats = { ...formData.greasy_stats };
    (greasy_stats as any)[field] = parseFloat(value) || 0;
    updateFormData({ greasy_stats });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Supply & Statistics</h2>
        <p className="text-gray-600 text-sm">Enter supply statistics, highest prices, certified share data, and greasy statistics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Supply Statistics</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <div className="flex items-center">
                    Offered Bales
                    <PreviousValueTag previousValue={previousData?.supply_stats?.offered_bales} />
                  </div>
                  <PercentageChangeTag 
                    currentValue={formData.supply_stats?.offered_bales}
                    previousValue={previousData?.supply_stats?.offered_bales}
                  />
                </label>
                <input
                  type="number"
                  value={formData.supply_stats?.offered_bales || ''}
                  onChange={(e) => handleSupplyStatsChange('offered_bales', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 9196"
                />
        </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <div className="flex items-center">
                    Sold Bales
                    <PreviousValueTag previousValue={previousData?.supply_stats?.sold_bales} />
                  </div>
                  <PercentageChangeTag 
                    currentValue={formData.supply_stats?.sold_bales}
                    previousValue={previousData?.supply_stats?.sold_bales}
                  />
                </label>
                <input
                  type="number"
                  value={formData.supply_stats?.sold_bales || ''}
                  onChange={(e) => handleSupplyStatsChange('sold_bales', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 8568"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <div className="flex items-center">
                    Clearance Rate (%)
                    <PreviousValueTag previousValue={previousData?.supply_stats?.clearance_rate_pct} />
                  </div>
                  <PercentageChangeTag 
                    currentValue={formData.supply_stats?.clearance_rate_pct}
                    previousValue={previousData?.supply_stats?.clearance_rate_pct}
                  />
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.supply_stats?.clearance_rate_pct || ''}
                  onChange={(e) => handleSupplyStatsChange('clearance_rate_pct', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 93.17"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Highest Price</h3>
        <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <div className="flex items-center">
                    Price (cents clean)
                    <PreviousValueTag previousValue={previousData?.highest_price?.price_cents_clean} />
                  </div>
                  <PercentageChangeTag 
                    currentValue={formData.highest_price?.price_cents_clean}
                    previousValue={previousData?.highest_price?.price_cents_clean}
                  />
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.highest_price?.price_cents_clean || ''}
                  onChange={(e) => handleHighestPriceChange('price_cents_clean', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 22798"
                />
              </div>
              
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <div className="flex items-center">
                    Micron
                    <PreviousValueTag previousValue={previousData?.highest_price?.micron} />
                  </div>
                  <PercentageChangeTag 
                    currentValue={formData.highest_price?.micron}
                    previousValue={previousData?.highest_price?.micron}
                  />
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.highest_price?.micron || ''}
                  onChange={(e) => handleHighestPriceChange('micron', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 16.5"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <div className="flex items-center">
                    Bales
                    <PreviousValueTag previousValue={previousData?.highest_price?.bales} />
                  </div>
                  <PercentageChangeTag 
                    currentValue={formData.highest_price?.bales}
                    previousValue={previousData?.highest_price?.bales}
                  />
                </label>
                  <input
                    type="number"
                  value={formData.highest_price?.bales || ''}
                  onChange={(e) => handleHighestPriceChange('bales', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 2"
                />
              </div>
            </div>
          </div>
                </div>

        <div className="space-y-6">
                <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Certified Share</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <div className="flex items-center">
                    Merino % Offered
                    <PreviousValueTag previousValue={previousData?.certified_share?.merino_pct_offered} />
                  </div>
                  <PercentageChangeTag 
                    currentValue={formData.certified_share?.merino_pct_offered}
                    previousValue={previousData?.certified_share?.merino_pct_offered}
                  />
                </label>
                  <input
                    type="number"
                  step="0.01"
                  value={formData.certified_share?.merino_pct_offered || ''}
                  onChange={(e) => handleCertifiedShareChange('merino_pct_offered', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 63.3"
                  />
                </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <div className="flex items-center">
                    Merino % Sold
                    <PreviousValueTag previousValue={previousData?.certified_share?.merino_pct_sold} />
                  </div>
                  <PercentageChangeTag 
                    currentValue={formData.certified_share?.merino_pct_sold}
                    previousValue={previousData?.certified_share?.merino_pct_sold}
                  />
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.certified_share?.merino_pct_sold || ''}
                  onChange={(e) => handleCertifiedShareChange('merino_pct_sold', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 61.6"
                />
              </div>
            </div>
        </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Greasy Statistics</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <div className="flex items-center">
                    Turnover (ZAR)
                    <PreviousValueTag previousValue={previousData?.greasy_stats?.turnover_rand} />
                  </div>
                  <PercentageChangeTag 
                    currentValue={formData.greasy_stats?.turnover_rand}
                    previousValue={previousData?.greasy_stats?.turnover_rand}
                  />
                </label>
                <input
                  type="number"
                  value={formData.greasy_stats?.turnover_rand || ''}
                  onChange={(e) => handleGreasyStatsChange('turnover_rand', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 136144702"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <div className="flex items-center">
                    Bales
                    <PreviousValueTag previousValue={previousData?.greasy_stats?.bales} />
                  </div>
                  <PercentageChangeTag 
                    currentValue={formData.greasy_stats?.bales}
                    previousValue={previousData?.greasy_stats?.bales}
                  />
                </label>
                <input
                  type="number"
                  value={formData.greasy_stats?.bales || ''}
                  onChange={(e) => handleGreasyStatsChange('bales', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 8568"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <div className="flex items-center">
                    Mass (kg)
                    <PreviousValueTag previousValue={previousData?.greasy_stats?.mass_kg} />
                  </div>
                  <PercentageChangeTag 
                    currentValue={formData.greasy_stats?.mass_kg}
                    previousValue={previousData?.greasy_stats?.mass_kg}
                  />
                </label>
                <input
                  type="number"
                  value={formData.greasy_stats?.mass_kg || ''}
                  onChange={(e) => handleGreasyStatsChange('mass_kg', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 1311248"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketStatsTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {
  const handleStatsChange = (field: string, value: string) => {
    let indicators = [...formData.indicators];
    let yearlyPrices = [...(formData.yearly_average_prices || [])];

    const numericValue = parseFloat(value) || 0;

    if (field === 'total_lots') {
      let item = indicators.find(i => i.type === 'total_lots');
      if(item) item.value = numericValue; 
      else indicators.push({ type: 'total_lots', value: numericValue, unit: 'bales', pct_change: 0 });
    } else if (field === 'total_volume') {
      let item = indicators.find(i => i.type === 'total_volume');
      if(item) item.value = numericValue; 
      else indicators.push({ type: 'total_volume', value: numericValue, unit: 'MT', pct_change: 0 });
    } else if (field === 'total_value') {
      let item = indicators.find(i => i.type === 'total_value');
      if(item) item.value = numericValue; 
      else indicators.push({ type: 'total_value', value: numericValue, unit: 'ZAR M', pct_change: 0 });
    } else if (field === 'avg_rws') {
      let item = yearlyPrices.find(p => p.label.includes('Certified Wool'));
      if(item) item.value = numericValue; 
      else yearlyPrices.push({ label: 'Certified Wool Avg Price (YTD)', value: numericValue, unit: 'ZAR/kg' });
    } else if (field === 'avg_non_rws') {
      let item = yearlyPrices.find(p => p.label.includes('All - Merino Wool'));
      if(item) item.value = numericValue; 
      else yearlyPrices.push({ label: 'All - Merino Wool Avg Price (YTD)', value: numericValue, unit: 'ZAR/kg' });
    }

    updateFormData({ indicators, yearly_average_prices: yearlyPrices });
  };

  const getStat = (type: string) => {
    if (type.includes('avg')) {
      return formData.yearly_average_prices?.find(p => p.label.toLowerCase().includes(type.split('_')[1]))?.value || '';
    }
    return formData.indicators.find(i => i.type === type)?.value || '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Market Statistics</h2>
        <p className="text-gray-600 text-sm">Enter the key market statistics including total lots, volume, value, and average prices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Lots *
            </label>
            <input
              type="number"
              value={getStat('total_lots')}
              onChange={e => handleStatsChange('total_lots', e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.total_lots ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 10250"
            />
            {errors.total_lots && (
              <p className="mt-1 text-sm text-red-600">{errors.total_lots}</p>
            )}
              </div>
              
                <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Volume (MT) *
                  </label>
              <input
                type="number"
              step="0.1"
              value={getStat('total_volume')}
              onChange={e => handleStatsChange('total_volume', e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.total_volume ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 1550.8"
            />
            {errors.total_volume && (
              <p className="mt-1 text-sm text-red-600">{errors.total_volume}</p>
            )}
                </div>

                <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auction Turnover (ZAR M)
                  </label>
                  <input
                    type="number"
              step="0.1"
              value={getStat('total_value')}
              onChange={e => handleStatsChange('total_value', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 281.4"
            />
          </div>
                </div>

        <div className="space-y-4">
                <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avg Price Certified Wool (YTD)
                  </label>
                  <input
                    type="number"
              step="0.01"
              value={getStat('avg_rws')}
              onChange={e => handleStatsChange('avg_rws', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 188.50"
                  />
                </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avg Price All - Merino Wool (YTD)
            </label>
            <input
              type="number"
              step="0.01"
              value={getStat('avg_non_rws')}
              onChange={e => handleStatsChange('avg_non_rws', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 175.20"
            />
              </div>
            </div>
        </div>
    </div>
  );
};

const MicronPricesTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {
  const [previousData, setPreviousData] = useState<Omit<AuctionReport, 'top_sales'> | null>(null);

  // Load previous auction data for comparison
  useEffect(() => {
    const loadPreviousData = async () => {
      try {
        const latestReport = await AuctionDataService.getLatestAuctionReport();
        setPreviousData(latestReport);
      } catch (error) {
        console.error('Error loading previous auction data:', error);
      }
    };
    loadPreviousData();
  }, []);

  const handleMicronPriceChange = (index: number, value: string) => {
    const micron_prices = [...formData.micron_prices];
    micron_prices[index].price_clean_zar_per_kg = parseFloat(value) || 0;
    updateFormData({ micron_prices });
  };

  const handleMicronComparisonChange = (index: number, field: keyof MicronPriceComparison, value: string) => {
    const micron_price_comparison = { ...formData.micron_price_comparison };
    if (!micron_price_comparison.rows) micron_price_comparison.rows = [];
    
    if (!micron_price_comparison.rows[index]) {
      micron_price_comparison.rows[index] = {
        micron: 0,
        non_cert_clean_zar_per_kg: null,
        cert_clean_zar_per_kg: null,
        pct_difference: null
      };
    }
    
    // Handle null/blank values
    if (value === '' || value === null) {
      (micron_price_comparison.rows[index] as any)[field] = null;
    } else {
      (micron_price_comparison.rows[index] as any)[field] = parseFloat(value) || 0;
    }
    
    // Auto-calculate percentage difference only if both values exist
    if (field === 'non_cert_clean_zar_per_kg' || field === 'cert_clean_zar_per_kg') {
      const nonCert = micron_price_comparison.rows[index].non_cert_clean_zar_per_kg;
      const cert = micron_price_comparison.rows[index].cert_clean_zar_per_kg;
      if (nonCert !== null && cert !== null && nonCert > 0 && cert > 0) {
        micron_price_comparison.rows[index].pct_difference = Math.round(((cert - nonCert) / nonCert) * 100 * 100) / 100;
      } else {
        micron_price_comparison.rows[index].pct_difference = null;
      }
    }
    
    updateFormData({ micron_price_comparison });
  };

  const addMicronComparison = () => {
    const micron_price_comparison = { ...formData.micron_price_comparison };
    if (!micron_price_comparison.rows) micron_price_comparison.rows = [];
    
    micron_price_comparison.rows.push({
      micron: 17.0,
      non_cert_clean_zar_per_kg: null,
      cert_clean_zar_per_kg: null,
      pct_difference: null
    });
    
    updateFormData({ micron_price_comparison });
  };

  const addAllMicronComparisons = () => {
    const micron_price_comparison = { ...formData.micron_price_comparison };
    if (!micron_price_comparison.rows) micron_price_comparison.rows = [];
    
    // Common micron values from Cape Wools reports
    const commonMicrons = [17.0, 17.5, 18.0, 18.5, 19.0, 19.5, 20.0, 20.5, 21.0, 21.5, 22.0];
    
    commonMicrons.forEach(micron => {
      // Only add if not already present
      if (!micron_price_comparison.rows.some(row => row.micron === micron)) {
        micron_price_comparison.rows.push({
          micron,
          non_cert_clean_zar_per_kg: null,
          cert_clean_zar_per_kg: null,
          pct_difference: null
        });
      }
    });
    
    // Sort by micron value
    micron_price_comparison.rows.sort((a, b) => a.micron - b.micron);
    
    updateFormData({ micron_price_comparison });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Micron Prices & Comparison</h2>
        <p className="text-gray-600 text-sm">Enter clean wool prices and certified vs non-certified price comparisons.</p>
      </div>
      
      {/* Basic Micron Prices */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Micron Prices (ZAR/kg clean)</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {formData.micron_prices.map((price, index) => (
            <div key={price.bucket_micron} className="text-center">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {price.bucket_micron}μ
              </label>
              <input
                type="number"
                step="0.01"
                value={price.price_clean_zar_per_kg || ''}
                onChange={e => handleMicronPriceChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-sm"
                placeholder="0.00"
              />
              <span className="text-xs text-gray-500">{price.category}</span>
              </div>
          ))}
        </div>
      </div>

      {/* Cape Wools Micron Price Comparison */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Certified vs Non-Certified Price Comparison</h3>
            <p className="text-xs text-gray-600 mt-1">Leave price fields blank if no data is available for that micron category</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addAllMicronComparisons}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            >
              Add All Microns
            </button>
            <button
              onClick={addMicronComparison}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Add Single
            </button>
          </div>
        </div>
        
        {formData.micron_price_comparison?.rows && formData.micron_price_comparison.rows.length > 0 ? (
          <div className="space-y-3">
            {formData.micron_price_comparison.rows.map((row, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Micron
                    </label>
              <input
                type="number"
                      step="0.1"
                      value={row.micron || ''}
                      onChange={(e) => handleMicronComparisonChange(index, 'micron', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="17.0"
              />
            </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Non-Cert (ZAR/kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={row.non_cert_clean_zar_per_kg === null ? '' : (row.non_cert_clean_zar_per_kg || '')}
                      onChange={(e) => handleMicronComparisonChange(index, 'non_cert_clean_zar_per_kg', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Leave blank if no data"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Certified (ZAR/kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={row.cert_clean_zar_per_kg === null ? '' : (row.cert_clean_zar_per_kg || '')}
                      onChange={(e) => handleMicronComparisonChange(index, 'cert_clean_zar_per_kg', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Leave blank if no data"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      % Difference
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={row.pct_difference === null ? '' : (row.pct_difference || '')}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-sm"
                      placeholder={row.pct_difference === null ? 'N/A' : '0.00'}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        const micron_price_comparison = { ...formData.micron_price_comparison };
                        if (micron_price_comparison.rows) {
                          micron_price_comparison.rows.splice(index, 1);
                          updateFormData({ micron_price_comparison });
                        }
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-xs font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">No micron comparisons added yet. Click "Add Micron Comparison" to get started.</p>
          </div>
        )}
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.micron_price_comparison?.notes || ''}
            onChange={(e) => {
              const micron_price_comparison = { ...formData.micron_price_comparison };
              micron_price_comparison.notes = e.target.value;
              updateFormData({ micron_price_comparison });
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            rows={3}
            placeholder="Enter any notes about the micron price comparison data..."
          />
        </div>
      </div>

      {errors.micron_prices && (
        <p className="text-sm text-red-600">{errors.micron_prices}</p>
      )}
    </div>
  );
};

const BuyersBrokersTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
  customEntries: {
    buyers: Array<{ name: string; description: string }>;
    brokers: Array<{ name: string; description: string }>;
  };
  onOpenModal: (type: 'buyer' | 'broker') => void;
}> = ({ formData, updateFormData, errors, customEntries, onOpenModal }) => {
  const BUYERS = ["BKB Pinnacle Fibres", "G Modiano SA", "Lempriere (Pty) Ltd", "Modiano SA", "Ovk Wool", "Standard Wool", "Tianyu Wool", "Viterra Wool"];
  const BROKERS = ["BKB", "OVK", "JLW", "MAS", "QWB", "VLB"];
  
  // Combine default and custom entries
  const allBuyers = ["[+Add New]", ...BUYERS, ...customEntries.buyers.map(b => b.name)];
  const allBrokers = ["[+Add New]", ...BROKERS, ...customEntries.brokers.map(b => b.name)];

  const addBuyer = () => {
    const newBuyer = {
      buyer: BUYERS[0],
      share_pct: 0,
      cat: 0,
      bales_ytd: 0
    };
    updateFormData({ buyers: [...formData.buyers, newBuyer] });
  };

  const addBroker = () => {
    const newBroker = {
      name: BROKERS[0],
      catalogue_offering: 0,
      withdrawn_before_sale: 0,
      wool_offered: 0,
      withdrawn_during_sale: 0,
      passed: 0,
      not_sold: 0,
      sold: 0,
      sold_pct: 0,
      sold_ytd: 0
    };
    updateFormData({ brokers: [...formData.brokers, newBroker] });
  };

  const handleBuyerChange = (index: number, field: keyof typeof formData.buyers[0], value: any) => {
    // Handle [+Add New] selection
    if (field === 'buyer' && value === '[+Add New]') {
      onOpenModal('buyer');
      return;
    }
    
    const buyers = [...formData.buyers];
    (buyers[index] as any)[field] = value;
    
    const totalBales = buyers.reduce((sum, b) => sum + (b.cat || 0), 0);
    if (totalBales > 0) {
      buyers.forEach(b => {
        b.share_pct = ((b.cat || 0) / totalBales) * 100;
      });
    }
    updateFormData({ buyers });
  };

  const handleBrokerChange = (index: number, field: keyof typeof formData.brokers[0], value: any) => {
    // Handle [+Add New] selection
    if (field === 'name' && value === '[+Add New]') {
      onOpenModal('broker');
      return;
    }
    
    const brokers = [...formData.brokers];
    (brokers[index] as any)[field] = value;
    
    // Auto-calculate derived fields
    const broker = brokers[index];
    
    // Always recalculate derived fields when any field changes
    // Calculate wool_offered = catalogue_offering - withdrawn_before_sale
    broker.wool_offered = (broker.catalogue_offering || 0) - (broker.withdrawn_before_sale || 0);
    
    // Calculate sold = wool_offered - not_sold (unless sold was manually edited)
    // Only auto-calculate sold if it wasn't the field that was just changed
    if (field !== 'sold') {
      broker.sold = (broker.wool_offered || 0) - (broker.not_sold || 0);
    }
    
    // Calculate sold_pct = (sold / wool_offered) * 100
    broker.sold_pct = (broker.wool_offered || 0) > 0 ? ((broker.sold || 0) / (broker.wool_offered || 0)) * 100 : 0;
    
    // Calculate sold_ytd = current sold + previous week sold_ytd (if available)
    // In a real application, this would be calculated from historical auction data
    if (broker.previous_week && broker.previous_week.sold_ytd) {
      // Add current week's sold to the previous YTD total
      broker.sold_ytd = (broker.sold || 0) + (broker.previous_week.sold_ytd || 0);
    } else {
      // If no previous week data, start with current sold as YTD
      // In a real app, this would be the sum of all previous weeks' sold amounts
      broker.sold_ytd = broker.sold || 0;
    }
    
    updateFormData({ brokers });
  };

  // Function to load previous week data for comparison
  const loadPreviousWeekData = async () => {
    try {
      // This would typically fetch from your data service
      // For now, we'll add sample data to demonstrate the comparison feature
      console.log('Loading previous week data...');
      
      // Add sample previous week data to existing brokers
      const updatedBrokers = formData.brokers.map(broker => {
        const prevCatalogueOffering = Math.floor((broker.catalogue_offering || 0) * 0.8);
        const prevWithdrawnBefore = Math.floor((broker.withdrawn_before_sale || 0) * 0.9);
        const prevWoolOffered = prevCatalogueOffering - prevWithdrawnBefore;
        const prevWithdrawnDuring = Math.floor((broker.withdrawn_during_sale || 0) * 1.1);
        const prevPassed = Math.floor((broker.passed || 0) * 1.2);
        // For sample data, we'll use a reasonable estimate for not_sold
        const prevNotSold = Math.floor((broker.not_sold || 0) * 1.1);
        const prevSold = prevWoolOffered - prevNotSold;
        
        return {
          ...broker,
          previous_week: {
            catalogue_offering: prevCatalogueOffering,
            withdrawn_before_sale: prevWithdrawnBefore,
            wool_offered: prevWoolOffered,
            withdrawn_during_sale: prevWithdrawnDuring,
            passed: prevPassed,
            not_sold: prevNotSold,
            sold: prevSold,
            sold_pct: prevWoolOffered > 0 ? (prevSold / prevWoolOffered) * 100 : 0,
            sold_ytd: Math.floor((broker.sold_ytd || 0) * 0.9)
          }
        };
      });
      
      updateFormData({ brokers: updatedBrokers });
    } catch (error) {
      console.error('Error loading previous week data:', error);
    }
  };

  // Helper function to get comparison indicator
  const getComparisonIndicator = (current: number, previous: number) => {
    if (previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    if (change > 0) {
      return <span className="text-green-600 text-xs">↗ +{change.toFixed(1)}%</span>;
    } else if (change < 0) {
      return <span className="text-red-600 text-xs">↘ {change.toFixed(1)}%</span>;
    } else {
      return <span className="text-gray-500 text-xs">→ 0%</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Buyers & Brokers</h2>
        <p className="text-gray-600 text-sm">Manage buyer participation and broker catalogue offerings for this auction.</p>
      </div>
      
      {/* Buyers Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Buyers List</h3>
          <button
            onClick={addBuyer}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Add Buyer
          </button>
        </div>

        {formData.buyers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">No buyers added yet. Click "Add Buyer" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.buyers.map((buyer, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Buyer
                    </label>
                    <select
                      value={buyer.buyer}
                      onChange={(e) => handleBuyerChange(index, 'buyer', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      {allBuyers.map(b => (
                        <option key={b} value={b} className={b === '[+Add New]' ? 'text-blue-600 font-medium' : ''}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Qty Bales
                    </label>
                    <input
                      type="number"
                      value={buyer.cat || ''}
                      onChange={(e) => handleBuyerChange(index, 'cat', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      % Share
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={buyer.share_pct.toFixed(2)}
                      onChange={(e) => handleBuyerChange(index, 'share_pct', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        const updated = formData.buyers.filter((_, i) => i !== index);
                        updateFormData({ buyers: updated });
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-xs font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brokers Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Brokers</h3>
          <div className="flex gap-2">
            <button
              onClick={loadPreviousWeekData}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
            >
              Load Previous Week
            </button>
            <button
              onClick={addBroker}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Add Broker
            </button>
          </div>
        </div>

        {formData.brokers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">No brokers added yet. Click "Add Broker" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table Header */}
            <div className="bg-gray-100 rounded-lg p-2">
              <div className="grid grid-cols-11 gap-1 text-xs font-semibold text-gray-700">
                <div>Broker</div>
                <div>Cat. Offer</div>
                <div>W/d Before</div>
                <div>Wool Offer</div>
                <div>W/d During</div>
                <div>Passed</div>
                <div>Not Sold</div>
                <div>Sold*</div>
                <div>% Sold</div>
                <div>YTD**</div>
                <div>Action</div>
              </div>
            </div>
            
            {formData.brokers.map((broker, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-2 bg-white">
                <div className="grid grid-cols-11 gap-1 items-center">
                  {/* Description (Broker Name) */}
                  <div>
                    <select
                      value={broker.name}
                      onChange={(e) => handleBrokerChange(index, 'name', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    >
                      {allBrokers.map(b => (
                        <option key={b} value={b} className={b === '[+Add New]' ? 'text-blue-600 font-medium' : ''}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Catalogue Offering */}
                  <div>
                    <input
                      type="number"
                      value={broker.catalogue_offering || ''}
                      onChange={(e) => handleBrokerChange(index, 'catalogue_offering', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="0"
                    />
                  </div>
                  
                  {/* Withdrawn before Sale */}
                  <div>
                    <input
                      type="number"
                      value={broker.withdrawn_before_sale || ''}
                      onChange={(e) => handleBrokerChange(index, 'withdrawn_before_sale', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="0"
                    />
                  </div>
                  
                  {/* Wool Offered (calculated) */}
                  <div>
                    <div className="w-full p-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600 text-center">
                      {broker.wool_offered || 0}
                      {broker.previous_week && (
                        <div className="text-xs">
                          {getComparisonIndicator(broker.wool_offered || 0, broker.previous_week.wool_offered)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Withdrawn during Sale */}
                  <div>
                    <input
                      type="number"
                      value={broker.withdrawn_during_sale || ''}
                      onChange={(e) => handleBrokerChange(index, 'withdrawn_during_sale', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="0"
                    />
                  </div>
                  
                  {/* Passed */}
                  <div>
                    <input
                      type="number"
                      value={broker.passed || ''}
                      onChange={(e) => handleBrokerChange(index, 'passed', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="0"
                    />
                  </div>
                  
                  {/* Not Sold */}
                  <div>
                    <input
                      type="number"
                      value={broker.not_sold || ''}
                      onChange={(e) => handleBrokerChange(index, 'not_sold', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="0"
                    />
                    {broker.previous_week && (
                      <div className="text-xs text-center">
                        {getComparisonIndicator(broker.not_sold || 0, broker.previous_week.not_sold)}
                      </div>
                    )}
                  </div>
                  
                  {/* Sold (auto-calculated but editable) */}
                  <div>
                    <input
                      type="number"
                      value={broker.sold || ''}
                      onChange={(e) => handleBrokerChange(index, 'sold', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs bg-blue-50"
                      placeholder="0"
                      title="Auto-calculated: Wool Offered - Not Sold (editable)"
                    />
                    {broker.previous_week && (
                      <div className="text-xs text-center">
                        {getComparisonIndicator(broker.sold || 0, broker.previous_week.sold)}
                      </div>
                    )}
                  </div>
                  
                  {/* % Sold (calculated) */}
                  <div>
                    <div className="w-full p-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600 text-center">
                      {(broker.sold_pct || 0).toFixed(2)}%
                      {broker.previous_week && (
                        <div className="text-xs">
                          {getComparisonIndicator(broker.sold_pct || 0, broker.previous_week.sold_pct)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Sold YTD (auto-calculated, read-only) */}
                  <div>
                    <div className="w-full p-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600 text-center">
                      {broker.sold_ytd || 0}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div>
                    <button
                      onClick={() => {
                        const updated = formData.brokers.filter((_, i) => i !== index);
                        updateFormData({ brokers: updated });
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white p-1 rounded text-xs font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Summary Rows */}
            <div className="border-2 border-gray-300 rounded-lg p-2 bg-blue-50">
              <div className="grid grid-cols-11 gap-1 items-center">
                <div className="text-xs font-semibold text-gray-700">This Week</div>
                <div className="text-xs font-semibold text-gray-700 text-center">
                  {formData.brokers.reduce((sum, b) => sum + (b.catalogue_offering || 0), 0)}
                </div>
                <div className="text-xs font-semibold text-gray-700 text-center">
                  {formData.brokers.reduce((sum, b) => sum + (b.withdrawn_before_sale || 0), 0)}
                </div>
                <div className="text-xs font-semibold text-gray-700 text-center">
                  {formData.brokers.reduce((sum, b) => sum + (b.wool_offered || 0), 0)}
                </div>
                <div className="text-xs font-semibold text-gray-700 text-center">
                  {formData.brokers.reduce((sum, b) => sum + (b.withdrawn_during_sale || 0), 0)}
                </div>
                <div className="text-xs font-semibold text-gray-700 text-center">
                  {formData.brokers.reduce((sum, b) => sum + (b.passed || 0), 0)}
                </div>
                <div className="text-xs font-semibold text-gray-700 text-center">
                  {formData.brokers.reduce((sum, b) => sum + (b.not_sold || 0), 0)}
                </div>
                <div className="text-xs font-semibold text-gray-700 text-center">
                  {formData.brokers.reduce((sum, b) => sum + (b.sold || 0), 0)}
                </div>
                <div className="text-xs font-semibold text-gray-700 text-center">
                  {(() => {
                    const totalWoolOffered = formData.brokers.reduce((sum, b) => sum + (b.wool_offered || 0), 0);
                    const totalSold = formData.brokers.reduce((sum, b) => sum + (b.sold || 0), 0);
                    return totalWoolOffered > 0 ? ((totalSold / totalWoolOffered) * 100).toFixed(2) + '%' : '0.00%';
                  })()}
                </div>
                <div className="text-xs font-semibold text-gray-700 text-center">
                  {formData.brokers.reduce((sum, b) => sum + (b.sold_ytd || 0), 0)}
                </div>
                <div></div>
              </div>
            </div>
            
            {/* Previous Week Summary Row (if data exists) */}
            {formData.brokers.some(b => b.previous_week) && (
              <div className="border-2 border-gray-300 rounded-lg p-2 bg-gray-50">
                <div className="grid grid-cols-11 gap-1 items-center">
                  <div className="text-xs font-semibold text-gray-600">Previous Week</div>
                  <div className="text-xs font-semibold text-gray-600 text-center">
                    {formData.brokers.reduce((sum, b) => sum + (b.previous_week?.catalogue_offering || 0), 0)}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 text-center">
                    {formData.brokers.reduce((sum, b) => sum + (b.previous_week?.withdrawn_before_sale || 0), 0)}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 text-center">
                    {formData.brokers.reduce((sum, b) => sum + (b.previous_week?.wool_offered || 0), 0)}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 text-center">
                    {formData.brokers.reduce((sum, b) => sum + (b.previous_week?.withdrawn_during_sale || 0), 0)}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 text-center">
                    {formData.brokers.reduce((sum, b) => sum + (b.previous_week?.passed || 0), 0)}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 text-center">
                    {formData.brokers.reduce((sum, b) => sum + (b.previous_week?.not_sold || 0), 0)}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 text-center">
                    {formData.brokers.reduce((sum, b) => sum + (b.previous_week?.sold || 0), 0)}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 text-center">
                    {(() => {
                      const totalWoolOffered = formData.brokers.reduce((sum, b) => sum + (b.previous_week?.wool_offered || 0), 0);
                      const totalSold = formData.brokers.reduce((sum, b) => sum + (b.previous_week?.sold || 0), 0);
                      return totalWoolOffered > 0 ? ((totalSold / totalWoolOffered) * 100).toFixed(2) + '%' : '0.00%';
                    })()}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 text-center">
                    {formData.brokers.reduce((sum, b) => sum + ((b.previous_week as any)?.sold_ytd || 0), 0)}
                  </div>
                  <div></div>
                </div>
              </div>
            )}
            
            {/* Legend */}
            <div className="text-xs text-gray-500 mt-1">
              * Auto-calculated but editable | ** Auto-calculated, read-only
            </div>
          </div>
        )}
      </div>

      {errors.buyers && <p className="text-sm text-red-600">{errors.buyers}</p>}
      {errors.brokers && <p className="text-sm text-red-600">{errors.brokers}</p>}
    </div>
  );
};

const ProvincialDataTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {
  const [isImporting, setIsImporting] = useState(false);

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const lines = csvText.split('\n').filter(line => line.trim());
        
        // Parse CSV properly handling quoted fields
        const parseCSVLine = (line: string): string[] => {
          const result = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };
        
        const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, ''));
        
        console.log('CSV Headers:', JSON.stringify(headers)); // Debug log
        console.log('First few CSV rows:', JSON.stringify(lines.slice(0, 3))); // Debug log
        
        // Debug: Show header mapping
        console.log('Header mapping:', headers.map(h => `${h} -> ${h.toLowerCase().trim()}`)); // Debug log
        
        // Parse CSV data
        const topPerformers = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = parseCSVLine(lines[i]).map(v => v.replace(/"/g, ''));
            console.log(`Row ${i} raw values:`, values); // Debug log
            if (values.length >= headers.length) {
              const row: any = {};
              headers.forEach((header, index) => {
                // Map headers to expected field names - be explicit about exact matches
                const cleanHeader = header.toLowerCase().trim();
                
                // Exact header mapping to avoid confusion
                if (cleanHeader === 'province') {
                  row['province'] = values[index];
                } else if (cleanHeader === 'producer') {
                  row['producer'] = values[index];
                } else if (cleanHeader === 'lotno') {
                  row['lotno'] = values[index];
                } else if (cleanHeader === 'nobales') {
                  row['nobales'] = values[index];
                } else if (cleanHeader === 'description') {
                  row['description'] = values[index];
                } else if (cleanHeader === 'micron') {
                  row['micron'] = values[index];
                } else if (cleanHeader === 'lotprice') {
                  row['lotprice'] = values[index];
                } else if (cleanHeader === 'accountno') {
                  row['accountno'] = values[index];
                } else if (cleanHeader === 'capemerino') {
                  row['capemerino'] = values[index];
                }
              });
              
              // Debug: Show parsed row data
              console.log(`Row ${i} parsed data:`, {
                province: row.province,
                producer: row.producer,
                lotno: row.lotno,
                nobales: row.nobales,
                description: row.description,
                micron: row.micron,
                lotprice: row.lotprice,
                accountno: row.accountno,
                capemerino: row.capemerino
              }); // Debug log
              
              topPerformers.push(row);
            }
          }
        }
        
        console.log('Parsed performers count:', topPerformers.length); // Debug log
        if (topPerformers.length > 0) {
          console.log('First performer parsed data:', JSON.stringify(topPerformers[0])); // Debug log
          console.log('Field mapping check:', {
            micron: topPerformers[0].micron,
            lotprice: topPerformers[0].lotprice,
            producer: topPerformers[0].producer,
            province: topPerformers[0].province
          }); // Debug log
        }

        // Group performers by province with proper name mapping
        const provincialGroups: { [key: string]: any[] } = {};
        topPerformers.forEach(performer => {
          // Normalize province name using mapping
          const rawProvince = performer.province || 'Unknown';
          const normalizedProvince = PROVINCE_MAPPING[rawProvince.toLowerCase()] || rawProvince;
          
          if (!provincialGroups[normalizedProvince]) {
            provincialGroups[normalizedProvince] = [];
          }
          provincialGroups[normalizedProvince].push(performer);
        });

        console.log('Provincial groups:', provincialGroups); // Debug log

        // Transform to provincial data format
        const provincialData = Object.entries(provincialGroups).map(([province, performers]) => ({
          province,
          producers: performers.map((performer, index) => {
            // Simple RWS detection - check if ANY field contains "(RWS)"
            let isRWS = false;
            for (const [key, value] of Object.entries(performer)) {
              if (typeof value === 'string' && value.includes('(RWS)')) {
                isRWS = true;
                break;
              }
            }
            
            // Extract producer name and district from combined producer field
            // Format: "PRODUCER NAME, DISTRICT" or "PRODUCER NAME, DISTRICT"
            let producerName = '';
            let district = '';
            if (performer.producer) {
              const producerParts = performer.producer.split(',').map(part => part.trim());
              if (producerParts.length >= 2) {
                producerName = producerParts[0];
                district = producerParts[1];
              } else {
                producerName = performer.producer;
                district = '';
              }
            }
            
            console.log(`Performer ${index + 1} parsed:`, {
              originalProducer: performer.producer,
              extractedName: producerName,
              extractedDistrict: district,
              producerNumber: performer.accountno,
              description: performer.description,
              isRWS: isRWS,
              micron: performer.micron,
              lotprice: performer.lotprice,
              nobales: performer.nobales
            }); // Debug log
            
            return {
              position: index + 1,
              name: producerName,
              district: district,
              producer_number: performer.accountno ? performer.accountno.replace(' (RWS)', '') : '', // Remove (RWS) from producer number
              no_bales: parseInt(performer.nobales) || 0,
              price: parseFloat(performer.lotprice) || 0,
              description: performer.description || '',
              micron: parseFloat(performer.micron) || 0,
              certified: isRWS ? 'RWS' as const : '' as const,
              buyer_name: '' // Not in CSV, will need to be filled manually
            };
          })
        }));

        console.log('Transformed provincial data:', provincialData); // Debug log

        // Update form data
        updateFormData({ provincial_producers: provincialData });
        
        // Also update company data with top performers
        const companyData = { ...formData.company_data };
        if (companyData) {
          // Set top client price from first performer
          if (topPerformers.length > 0) {
            const topPerformer = topPerformers[0];
            companyData.top_client_price = {
              price_per_kg: parseFloat(topPerformer.lotprice) || 0,
              clean_price: parseFloat(topPerformer.lotprice) || 0,
              lot_size: parseInt(topPerformer.nobales) || 0,
              lot_type: topPerformer.description || '',
              micron: parseFloat(topPerformer.micron) || 0,
              producer: topPerformer.producer || '',
              buyer: '' // Not in CSV, will need to be filled manually
            };
          }

          // Add all performers to client performance
          companyData.client_performance = topPerformers.map((performer, index) => {
            // Simple RWS detection - check if ANY field contains "(RWS)"
            let isRWS = false;
            for (const [key, value] of Object.entries(performer)) {
              if (typeof value === 'string' && value.includes('(RWS)')) {
                isRWS = true;
                break;
              }
            }
            
            return {
              producer_name: performer.producer || '',
              farm_name: performer.producer || '', // Using producer as farm name
              region: performer.province || '',
              total_bales: parseInt(performer.nobales) || 0,
              average_price: parseFloat(performer.lotprice) || 0,
              highest_price: parseFloat(performer.lotprice) || 0,
              micron_range: performer.micron || '',
              certified_percentage: isRWS ? 100 : 0, // Set to 100% if RWS certified
              lot_types: performer.description || '',
              top_lot_details: `${performer.nobales} ${performer.description}, ${performer.micron} micron, ${performer.lotprice} ZAR/kg${isRWS ? ' (RWS)' : ''}`
            };
          });

          updateFormData({ company_data: companyData });
        }

        alert(`Successfully imported ${topPerformers.length} top performers!`);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please check the format.');
      } finally {
        setIsImporting(false);
        // Reset file input
        event.target.value = '';
      }
    };

    reader.readAsText(file);
  };
  const PROVINCES = ['Eastern Cape', 'Free State', 'Western Cape', 'Northern Cape', 'KwaZulu-Natal', 'Mpumalanga', 'Gauteng', 'Limpopo', 'North West', 'Lesotho'];
  
  // Province name mapping to handle variations in CSV data
  const PROVINCE_MAPPING: { [key: string]: string } = {
    'freestate': 'Free State',
    'free state': 'Free State',
    'eastern cape': 'Eastern Cape',
    'western cape': 'Western Cape',
    'northern cape': 'Northern Cape',
    'kwaZulu-natal': 'KwaZulu-Natal',
    'kwaZulu natal': 'KwaZulu-Natal',
    'mpumalanga': 'Mpumalanga',
    'gauteng': 'Gauteng',
    'limpopo': 'Limpopo',
    'north west': 'North West',
    'north-west province': 'North West',
    'north west province': 'North West',
    'lesotho': 'Lesotho'
  };
  const [selectedProvince, setSelectedProvince] = useState(PROVINCES[0]);

  const addProvincialProducer = (provinceName: string) => {
    const provincial_producers = [...formData.provincial_producers];
    let provinceData = provincial_producers.find(p => p.province === provinceName);
    const newProducer = {
        position: 1,
        name: '',
        district: '',
        producer_number: '',
        no_bales: 0,
        description: '',
        price: 0,
      certified: '' as const, 
        buyer_name: '',
      micron: 0
    };
    if (provinceData) {
      newProducer.position = provinceData.producers.length + 1;
      provinceData.producers.push(newProducer);
    } else {
      provincial_producers.push({ province: provinceName, producers: [newProducer] });
    }
    updateFormData({ provincial_producers });
  };

  const handleProvincialProducerChange = (provinceName: string, producerIndex: number, field: string, value: any) => {
    const provincial_producers = [...formData.provincial_producers];
    let provinceData = provincial_producers.find(p => p.province === provinceName);
    if (provinceData) {
      (provinceData.producers[producerIndex] as any)[field] = value;
      updateFormData({ provincial_producers });
    }
  };

  const removeProvincialProducer = (provinceName: string, producerIndex: number) => {
    const provincial_producers = [...formData.provincial_producers];
    let provinceData = provincial_producers.find(p => p.province === provinceName);
    if(provinceData) {
      provinceData.producers.splice(producerIndex, 1);
      provinceData.producers.forEach((p, i) => p.position = i + 1);
      updateFormData({ provincial_producers });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Top 10 Performers per Province</h2>
        <p className="text-gray-600 text-sm">Enter top performing producers by province with their details and prices.</p>
      </div>

      {/* CSV Import Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Import Top Performers CSV</h3>
            <p className="text-blue-700 text-xs">Import structured CSV with top 10 performers to auto-populate data.</p>
            <p className="text-blue-600 text-xs">Columns: Province, Producer, LotNo, NoBales, Description, Micron, LotPrice, AccountNo, CapeMerino</p>
            <p className="text-blue-500 text-xs">Field Mapping: Producer → Name+District, AccountNo → Producer Number, LotPrice → Price, NoBales → No of Bales</p>
            <p className="text-blue-500 text-xs">Note: Producer field should contain "Producer Name, District" format. AccountNo becomes Producer Number. Province names will be auto-corrected (e.g., Freestate → Free State)</p>
            <p className="text-blue-500 text-xs">Note: RWS certification detected from "(RWS)" in AccountNo column</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="hidden"
              id="csv-import"
              disabled={isImporting}
            />
            <label
              htmlFor="csv-import"
              className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                isImporting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isImporting ? 'Importing...' : 'Import CSV'}
            </label>
            {isImporting && (
              <div className="text-xs text-blue-600">Processing...</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <label className="text-xs font-medium text-gray-700">Province:</label>
        <select 
          value={selectedProvince} 
          onChange={e => setSelectedProvince(e.target.value)} 
          className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button
          onClick={() => addProvincialProducer(selectedProvince)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
        >
          Add Performer
        </button>
      </div>

    <div className="space-y-3">
      <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-800">Top Performers - {selectedProvince}</h3>
      </div>

        {(formData.provincial_producers.find(p => p.province === selectedProvince)?.producers || []).length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">No performers added for {selectedProvince} yet. Click "Add Performer" to get started.</p>
        </div>
      ) : (
          <div className="space-y-2">
            {(formData.provincial_producers.find(p => p.province === selectedProvince)?.producers || []).map((producer, index) => (
              <div key={index} className="border border-gray-200 rounded p-2 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-10 gap-2">
                      <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Rank
                    </label>
                    <input 
                      type="number" 
                      value={producer.position} 
                      onChange={e => handleProvincialProducerChange(selectedProvince, index, 'position', parseInt(e.target.value))} 
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                          Producer Name
                        </label>
                        <input
                          value={producer.name}
                      onChange={e => handleProvincialProducerChange(selectedProvince, index, 'name', e.target.value)} 
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      placeholder="Farm name"
                        />
                      </div>
                      <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      District
                        </label>
                        <input
                          value={producer.district}
                      onChange={e => handleProvincialProducerChange(selectedProvince, index, 'district', e.target.value)} 
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      placeholder="District"
                        />
                      </div>
                      <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Producer Number
                        </label>
                        <input
                          value={producer.producer_number || ''}
                      onChange={e => handleProvincialProducerChange(selectedProvince, index, 'producer_number', e.target.value)} 
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      placeholder="Lot No"
                        />
                      </div>
                      <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      No of Bales
                        </label>
                        <input
                          type="number"
                          value={producer.no_bales || ''} 
                      onChange={e => handleProvincialProducerChange(selectedProvince, index, 'no_bales', parseInt(e.target.value))} 
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      placeholder="0"
                        />
                      </div>
                      <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description
                        </label>
                        <input
                          value={producer.description || ''}
                      onChange={e => handleProvincialProducerChange(selectedProvince, index, 'description', e.target.value)} 
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      placeholder="Lot type"
                        />
                      </div>
                      <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                          Micron
                        </label>
                        <input
                          type="number"
                          step="0.1"
                      value={producer.micron || ''} 
                      onChange={e => handleProvincialProducerChange(selectedProvince, index, 'micron', parseFloat(e.target.value))} 
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      placeholder="0.0"
                        />
                      </div>
                      <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Price
                        </label>
                        <input
                          type="number"
                      step="0.01"
                      value={producer.price || ''} 
                      onChange={e => handleProvincialProducerChange(selectedProvince, index, 'price', parseFloat(e.target.value))} 
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      placeholder="0.00"
                        />
                      </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Certified
                    </label>
                    <select 
                      value={producer.certified} 
                      onChange={e => handleProvincialProducerChange(selectedProvince, index, 'certified', e.target.value)} 
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    >
                      <option value="">Blank</option>
                      <option value="RWS">RWS</option>
                    </select>
                    </div>
                  <div className="flex items-end">
                    <button 
                      onClick={() => removeProvincialProducer(selectedProvince, index)} 
                      className="w-full bg-red-500 hover:bg-red-600 text-white p-1 rounded text-xs font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {errors.provincial_producers && (
        <p className="text-sm text-red-600">{errors.provincial_producers}</p>
      )}
    </div>
  );
};

const CompanyDataTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Company Data</h2>
        <p className="text-gray-600 text-sm">Capture your agency's producer performance data, top client achievements, and proprietary metrics separate from Cape Wools industry data.</p>
      </div>
      
      
      {/* Top 10 Producers Summary */}
          <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 10 Producers - National Summary</h3>
        
        {(() => {
          // Collect ALL producers from all provinces (not just top 10)
          const allProducers = formData.provincial_producers.flatMap(province => 
            province.producers.map(producer => ({
              ...producer,
              province: province.province
            }))
          );

          // Get top 10 for the table
          const top10Producers = allProducers.sort((a, b) => b.price - a.price).slice(0, 10);

          // Calculate overall stats (ALL data) with validation
          const totalProducers = allProducers.length;
          const validPrices = allProducers.filter(p => p.price && p.price > 0);
          const highestPrice = validPrices.length > 0 ? Math.max(...validPrices.map(p => p.price)) : 0;
          const averagePrice = validPrices.length > 0 ? 
            validPrices.reduce((sum, p) => sum + p.price, 0) / validPrices.length : 0;
          const totalBales = allProducers.reduce((sum, p) => sum + (p.no_bales || 0), 0);
          const rwsCount = allProducers.filter(p => p.certified === 'RWS').length;
          const rwsPercentage = totalProducers > 0 ? (rwsCount / totalProducers) * 100 : 0;
          
          // Calculate RWS vs Non-RWS average prices (ALL data) with validation
          const rwsProducers = allProducers.filter(p => p.certified === 'RWS' && p.price && p.price > 0);
          const nonRwsProducers = allProducers.filter(p => p.certified !== 'RWS' && p.price && p.price > 0);
          const rwsAveragePrice = rwsProducers.length > 0 ? 
            rwsProducers.reduce((sum, p) => sum + p.price, 0) / rwsProducers.length : 0;
          const nonRwsAveragePrice = nonRwsProducers.length > 0 ? 
            nonRwsProducers.reduce((sum, p) => sum + p.price, 0) / nonRwsProducers.length : 0;
          const rwsPremium = nonRwsAveragePrice > 0 ? ((rwsAveragePrice - nonRwsAveragePrice) / nonRwsAveragePrice) * 100 : 0;

          // Debug logging to verify calculations
          console.log('Summary Stats Calculation:', {
            totalProducers,
            highestPrice,
            averagePrice,
            totalBales,
            rwsCount,
            rwsPercentage,
            rwsProducers: rwsProducers.length,
            nonRwsProducers: nonRwsProducers.length,
            rwsAveragePrice,
            nonRwsAveragePrice,
            rwsPremium
          });

          // Calculate provincial stats with validation
          const provincialStats = formData.provincial_producers.map(province => {
            const producers = province.producers;
            const validPriceProducers = producers.filter(p => p.price && p.price > 0);
            const avgPrice = validPriceProducers.length > 0 ? 
              validPriceProducers.reduce((sum, p) => sum + p.price, 0) / validPriceProducers.length : 0;
            const totalBales = producers.reduce((sum, p) => sum + (p.no_bales || 0), 0);
            const rwsCount = producers.filter(p => p.certified === 'RWS').length;
            const rwsPercentage = producers.length > 0 ? (rwsCount / producers.length) * 100 : 0;
            const highestPrice = validPriceProducers.length > 0 ? Math.max(...validPriceProducers.map(p => p.price)) : 0;
            
            return {
              province: province.province,
              count: producers.length,
              avgPrice,
              totalBales,
              rwsPercentage,
              highestPrice
            };
          }).sort((a, b) => b.avgPrice - a.avgPrice);

          return (
            <div className="space-y-4">
              {/* Overall Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalProducers}</div>
                  <div className="text-sm text-gray-600">Total Producers</div>
          </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{highestPrice.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Highest Price</div>
          </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{averagePrice.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Avg Price</div>
        </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalBales}</div>
                  <div className="text-sm text-gray-600">Total Bales</div>
          </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{rwsPercentage.toFixed(0)}%</div>
                  <div className="text-sm text-gray-600">RWS Certified</div>
            </div>
            </div>
            
              {/* Certified Wool vs All - Merino Wool Price Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{rwsAveragePrice.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Certified Wool Avg Price</div>
                  <div className="text-xs text-gray-500">({rwsProducers.length} producers)</div>
            </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{nonRwsAveragePrice.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">All - Merino Wool Avg Price</div>
                  <div className="text-xs text-gray-500">({nonRwsProducers.length} producers)</div>
          </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">+{rwsPremium.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Certified Wool Premium</div>
                  <div className="text-xs text-gray-500">vs All - Merino Wool</div>
        </div>
      </div>
      
              {/* Provincial Breakdown */}
      <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Provincial Performance</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {provincialStats.map((stat, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded p-2">
                      <div className="font-medium text-gray-900 text-xs mb-1">{stat.province}</div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>
                          <div className="text-gray-500 text-xs">Prod</div>
                          <div className="font-medium text-xs">{stat.count}</div>
                  </div>
                  <div>
                          <div className="text-gray-500 text-xs">Price</div>
                          <div className="font-medium text-green-600 text-xs">{stat.avgPrice.toFixed(1)}</div>
                  </div>
                  <div>
                          <div className="text-gray-500 text-xs">Bales</div>
                          <div className="font-medium text-xs">{stat.totalBales}</div>
                  </div>
                  <div>
                          <div className="text-gray-500 text-xs">RWS</div>
                          <div className="font-medium text-orange-600 text-xs">{stat.rwsPercentage.toFixed(0)}%</div>
                  </div>
                  </div>
                  </div>
                  ))}
                  </div>
                </div>

              {/* Compact Top 10 Producers Table */}
              {top10Producers.length > 0 ? (
                  <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">Top 10 Producers</h4>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-left font-medium text-gray-700">#</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-700">Producer</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-700">Province</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-700">Price</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-700">μ</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-700">Bales</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-700">RWS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {top10Producers.map((producer, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-2 py-1 font-medium text-gray-900">{index + 1}</td>
                              <td className="px-2 py-1 text-gray-900 truncate max-w-32" title={producer.name}>
                                {producer.name}
                              </td>
                              <td className="px-2 py-1 text-gray-600 text-xs">{producer.province}</td>
                              <td className="px-2 py-1 font-medium text-green-600">{producer.price.toFixed(1)}</td>
                              <td className="px-2 py-1 text-gray-600">{producer.micron?.toFixed(1) || '-'}</td>
                              <td className="px-2 py-1 text-gray-600">{producer.no_bales || 0}</td>
                              <td className="px-2 py-1">
                                {producer.certified === 'RWS' ? (
                                  <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    RWS
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                  </div>
                  </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="text-sm">No producer data available. Import CSV data in the Provincial Data section to see the summary.</p>
          </div>
        )}
            </div>
          );
        })()}
      </div>
      
      {/* Company Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Notes
        </label>
        <textarea
          value={formData.company_data?.notes || ''}
          onChange={(e) => {
            const company_data = { ...formData.company_data };
            if (company_data) {
              company_data.notes = e.target.value;
              updateFormData({ company_data });
            }
          }}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="Enter any additional notes about your company's performance, achievements, or insights..."
        />
      </div>
    </div>
  );
};

const MarketInsightsTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Market Insights / Comments</h2>
        <p className="text-gray-600 text-sm">Provide market commentary, insights, and analysis for this auction period.</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Market Insights / Comments
        </label>
        <textarea 
          value={formData.insights} 
          onChange={e => updateFormData({ insights: e.target.value })} 
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          rows={8}
          placeholder="Enter market commentary, trends, and insights for this auction period..."
        />
      </div>
    </div>
  );
};

const ReviewSaveTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  onSave: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
  isSaving: boolean;
  errors: Record<string, string>;
}> = ({ formData, onSave, onSaveDraft, onCancel, isSaving, errors }) => {
  // Calculate completion percentage
  const calculateCompletion = () => {
    const sections = [
      formData.auction.auction_date ? 1 : 0,
      formData.auction.catalogue_name ? 1 : 0,
      formData.indicators.length > 0 ? 1 : 0,
      formData.buyers.length > 0 ? 1 : 0,
      formData.brokers.length > 0 ? 1 : 0,
      formData.provincial_producers.length > 0 ? 1 : 0,
      formData.micron_prices.filter(p => p.price_clean_zar_per_kg > 0).length > 0 ? 1 : 0,
      formData.market_indices ? 1 : 0,
      formData.currency_fx ? 1 : 0,
      formData.supply_stats ? 1 : 0,
      formData.insights.length > 0 ? 1 : 0
    ];
    return Math.round((sections.reduce((a, b) => a + b, 0) / sections.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Auction Report Review</h2>
        <p className="text-gray-600">Review your comprehensive auction data before finalizing the report</p>
        <div className="mt-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${completionPercentage >= 80 ? 'bg-green-500' : completionPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">{completionPercentage}% Complete</span>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(formData.auction.auction_date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Report Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Key Metrics */}
        <div className="xl:col-span-2 space-y-6">
          {/* Auction Overview Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                📊
              </span>
              Auction Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formData.indicators.find(i => i.type === 'total_lots')?.value.toLocaleString() || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Total Lots</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formData.indicators.find(i => i.type === 'total_volume')?.value.toFixed(1) || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Volume (MT)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  ZAR {formData.indicators.find(i => i.type === 'total_value')?.value.toFixed(1) || 'N/A'}M
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {formData.supply_stats?.clearance_rate_pct ? `${formData.supply_stats.clearance_rate_pct}%` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Clearance Rate</div>
              </div>
            </div>
          </div>

          {/* Market Performance */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                📈
              </span>
              Market Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Market Indices</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Merino Indicator</span>
                    <span className="font-semibold">
                      {formData.market_indices?.merino_indicator_cents_clean ? 
                        `${formData.market_indices.merino_indicator_cents_clean} cents` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">AWEX EMI</span>
                    <span className="font-semibold">
                      {formData.market_indices?.awex_emi_cents_clean ? 
                        `${formData.market_indices.awex_emi_cents_clean} cents` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Currency Exchange</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">ZAR/USD</span>
                    <span className="font-semibold">
                      {formData.currency_fx?.ZAR_USD ? formData.currency_fx.ZAR_USD.toFixed(2) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">ZAR/Euro</span>
                    <span className="font-semibold">
                      {formData.currency_fx?.ZAR_EUR ? formData.currency_fx.ZAR_EUR.toFixed(2) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supply Statistics */}
          {formData.supply_stats && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                  📊
                </span>
                Supply Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-teal-50 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600">
                    {formData.supply_stats.offered_bales?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Bales Offered</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formData.supply_stats.sold_bales?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Bales Sold</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formData.supply_stats.clearance_rate_pct ? `${formData.supply_stats.clearance_rate_pct}%` : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Clearance Rate</div>
                </div>
              </div>
            </div>
          )}

          {/* Highest Price */}
          {formData.highest_price && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  🏆
                </span>
                Highest Price Achievement
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {formData.highest_price.price_cents_clean}¢
                    </div>
                    <div className="text-sm text-gray-600">per kg clean</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">
                      {formData.highest_price.micron}μ
                    </div>
                    <div className="text-sm text-gray-600">micron</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">
                      {formData.highest_price.bales}
                    </div>
                    <div className="text-sm text-gray-600">bales</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                🏆
              </span>
              Top Performers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Top Buyers</h4>
                <div className="space-y-2">
                  {formData.buyers.slice(0, 3).map((buyer, index) => (
                    <div key={buyer.buyer} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium">{buyer.buyer}</span>
                      </div>
                      <span className="text-sm text-gray-600">{buyer.cat} bales</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Top Brokers</h4>
                <div className="space-y-2">
                  {formData.brokers.slice(0, 3).map((broker, index) => (
                    <div key={broker.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium">{broker.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{broker.catalogue_offering} bales</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Micron Prices */}
          {formData.micron_prices.filter(p => p.price_clean_zar_per_kg > 0).length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  💰
                </span>
                Micron Price Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.micron_prices.filter(p => p.price_clean_zar_per_kg > 0).slice(0, 6).map((price, index) => (
                  <div key={price.bucket_micron} className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900 mb-2">{price.bucket_micron}</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{price.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-green-600">R{price.price_clean_zar_per_kg.toFixed(2)}/kg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Provincial Data */}
          {formData.provincial_producers.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  🗺️
                </span>
                Provincial Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.provincial_producers.slice(0, 6).map((province, index) => (
                  <div key={province.province} className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900 mb-2">{province.province}</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Producers:</span>
                        <span className="font-medium">{province.producers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Bales:</span>
                        <span className="font-medium">{province.producers.reduce((sum, p) => sum + (p.no_bales || 0), 0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Market Insights */}
          {formData.insights && formData.insights.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  💡
                </span>
                Market Insights
              </h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{formData.insights}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Report Summary */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Report Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Season</span>
                <span className="font-semibold">{formData.auction.season_label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Catalogue</span>
                <span className="font-semibold">{formData.auction.catalogue_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Week ID</span>
                <span className="font-mono text-sm">{formData.auction.week_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sale Number</span>
                <span className="font-semibold">{formData.auction.sale_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Auction Center</span>
                <span className="font-semibold">{formData.auction.auction_center || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Data Completeness */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Data Completeness</h3>
            <div className="space-y-3">
              {[
                { label: 'Buyers', value: formData.buyers.length, icon: '👥' },
                { label: 'Brokers', value: formData.brokers.length, icon: '🤝' },
                { label: 'Provinces', value: formData.provincial_producers.length, icon: '🗺️' },
                { label: 'Micron Prices', value: `${formData.micron_prices.filter(p => p.price_clean_zar_per_kg > 0).length}/${formData.micron_prices.length}`, icon: '💰' },
                { label: 'Market Insights', value: formData.insights.length > 0 ? 'Yes' : 'No', icon: '💡' },
                { label: 'Market Indices', value: formData.market_indices ? 'Complete' : 'Missing', icon: '📊' },
                { label: 'Currency Exchange', value: formData.currency_fx ? 'Complete' : 'Missing', icon: '💱' },
                { label: 'Supply Statistics', value: formData.supply_stats ? 'Complete' : 'Missing', icon: '📈' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{item.icon}</span>
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className={`text-sm font-medium ${item.value === 'Missing' || item.value === 'No' ? 'text-red-600' : 'text-green-600'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
            
            {errors.save && (
              <div className={`mb-4 p-3 rounded-lg ${errors.save.includes('successfully') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={`text-sm ${errors.save.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {errors.save}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={onSaveDraft}
                disabled={isSaving}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                {isSaving ? 'Saving...' : '💾 Save as Draft'}
              </button>
              
              <button
                onClick={onSave}
                disabled={isSaving || completionPercentage < 80}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                {isSaving ? 'Saving...' : '✅ Finalize Report'}
              </button>
              
              <button
                onClick={onCancel}
                className="w-full px-4 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
            
            {completionPercentage < 80 && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700">
                  Complete at least 80% of the data to finalize the report.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDataCaptureForm;


