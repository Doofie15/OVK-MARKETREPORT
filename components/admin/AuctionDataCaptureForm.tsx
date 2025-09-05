import React, { useState, useEffect } from 'react';
import type { 
  AuctionReport, 
  MarketIndices, 
  CurrencyFX, 
  SupplyStats, 
  HighestPrice, 
  CertifiedShare, 
  GreasyStats, 
  MicronPriceComparison 
} from '../../types';
import { AuctionDataService } from '../../data';

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
      }
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set());

  const tabs = [
    { id: 'auction-details', label: 'Auction Details', icon: '📅' },
    { id: 'market-indices', label: 'Market Indices', icon: '📈' },
    { id: 'currency-exchange', label: 'Currency Exchange', icon: '💱' },
    { id: 'supply-stats', label: 'Supply & Statistics', icon: '📊' },
    { id: 'micron-prices', label: 'Micron Prices', icon: '💰' },
    { id: 'buyers-brokers', label: 'Buyers & Brokers', icon: '👥' },
    { id: 'provincial-data', label: 'Provincial Data', icon: '🗺️' },
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

  const updateFormData = (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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
        return <BuyersBrokersTab formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 'provincial-data':
        return <ProvincialDataTab formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 'market-insights':
        return <MarketInsightsTab formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 'review-save':
        return <ReviewSaveTab formData={formData} onSave={handleSave} onCancel={onCancel} isSaving={isSaving} errors={errors} />;
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {completedTabs.has(tab.id) && (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </nav>
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
  const handleMarketIndicesChange = (field: keyof MarketIndices, value: string) => {
    const market_indices = { ...formData.market_indices };
    (market_indices as any)[field] = parseFloat(value) || 0;
    updateFormData({ market_indices });
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Merino Indicator (cents clean)
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certified Indicator (cents clean)
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AWEX EMI (cents clean)
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
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.market_indices?.change_merino_pct || ''}
              onChange={(e) => handleMarketIndicesChange('change_merino_pct', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 0.7"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Change Certified (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.market_indices?.change_certified_pct || ''}
              onChange={(e) => handleMarketIndicesChange('change_certified_pct', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1.3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CurrencyExchangeTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {
  const handleCurrencyChange = (field: keyof CurrencyFX, value: string) => {
    const currency_fx = { ...formData.currency_fx };
    (currency_fx as any)[field] = parseFloat(value) || 0;
    updateFormData({ currency_fx });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Currency Exchange Rates</h2>
        <p className="text-gray-600 text-sm">Enter the currency exchange rates from the Cape Wools report.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZAR/USD
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZAR/EUR
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZAR/JPY
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZAR/GBP
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              USD/AUD
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offered Bales
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sold Bales
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clearance Rate (%)
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (cents clean)
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Micron
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bales
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merino % Offered
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merino % Sold
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Turnover (ZAR)
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bales
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mass (kg)
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
      let item = yearlyPrices.find(p => p.label.includes('RWS'));
      if(item) item.value = numericValue; 
      else yearlyPrices.push({ label: 'RWS Avg Price (YTD)', value: numericValue, unit: 'ZAR/kg' });
    } else if (field === 'avg_non_rws') {
      let item = yearlyPrices.find(p => p.label.includes('Non-RWS'));
      if(item) item.value = numericValue; 
      else yearlyPrices.push({ label: 'Non-RWS Avg Price (YTD)', value: numericValue, unit: 'ZAR/kg' });
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
              Avg Price RWS Certified (YTD)
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
              Avg Price Non-Certified (YTD)
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
        non_cert_clean_zar_per_kg: 0,
        cert_clean_zar_per_kg: 0,
        pct_difference: 0
      };
    }
    
    (micron_price_comparison.rows[index] as any)[field] = parseFloat(value) || 0;
    
    // Auto-calculate percentage difference
    if (field === 'non_cert_clean_zar_per_kg' || field === 'cert_clean_zar_per_kg') {
      const nonCert = micron_price_comparison.rows[index].non_cert_clean_zar_per_kg;
      const cert = micron_price_comparison.rows[index].cert_clean_zar_per_kg;
      if (nonCert > 0 && cert > 0) {
        micron_price_comparison.rows[index].pct_difference = ((cert - nonCert) / nonCert) * 100;
      }
    }
    
    updateFormData({ micron_price_comparison });
  };

  const addMicronComparison = () => {
    const micron_price_comparison = { ...formData.micron_price_comparison };
    if (!micron_price_comparison.rows) micron_price_comparison.rows = [];
    
    micron_price_comparison.rows.push({
      micron: 17.0,
      non_cert_clean_zar_per_kg: 0,
      cert_clean_zar_per_kg: 0,
      pct_difference: 0
    });
    
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
          <h3 className="text-lg font-semibold text-gray-800">Certified vs Non-Certified Price Comparison</h3>
          <button
            onClick={addMicronComparison}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Add Micron Comparison
          </button>
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
                      value={row.non_cert_clean_zar_per_kg || ''}
                      onChange={(e) => handleMicronComparisonChange(index, 'non_cert_clean_zar_per_kg', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Certified (ZAR/kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={row.cert_clean_zar_per_kg || ''}
                      onChange={(e) => handleMicronComparisonChange(index, 'cert_clean_zar_per_kg', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      % Difference
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={row.pct_difference || ''}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-sm"
                      placeholder="0.00"
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
}> = ({ formData, updateFormData, errors }) => {
  const BUYERS = ["BKB Pinnacle Fibres", "G Modiano SA", "Lempriere (Pty) Ltd", "Modiano SA", "Ovk Wool", "Standard Wool", "Tianyu Wool", "Viterra Wool"];
  const BROKERS = ["BKB", "OVK", "JLW", "MAS", "QWB", "VLB"];

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
      sold_ytd: 0
    };
    updateFormData({ brokers: [...formData.brokers, newBroker] });
  };

  const handleBuyerChange = (index: number, field: keyof typeof formData.buyers[0], value: any) => {
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
    const brokers = [...formData.brokers];
    (brokers[index] as any)[field] = value;
    updateFormData({ brokers });
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
                      {BUYERS.map(b => <option key={b} value={b}>{b}</option>)}
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
          <button
            onClick={addBroker}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Add Broker
          </button>
        </div>

        {formData.brokers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">No brokers added yet. Click "Add Broker" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.brokers.map((broker, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Broker
                    </label>
                    <select
                      value={broker.name}
                      onChange={(e) => handleBrokerChange(index, 'name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      {BROKERS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Catalogue Offering
                    </label>
                    <input
                      type="number"
                      value={broker.catalogue_offering || ''}
                      onChange={(e) => handleBrokerChange(index, 'catalogue_offering', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        const updated = formData.brokers.filter((_, i) => i !== index);
                        updateFormData({ brokers: updated });
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
  const PROVINCES = ['Eastern Cape', 'Free State', 'Western Cape', 'Northern Cape', 'KwaZulu-Natal', 'Mpumalanga', 'Gauteng', 'Limpopo', 'North West'];
  const [selectedProvince, setSelectedProvince] = useState(PROVINCES[0]);

  const addProvincialProducer = (provinceName: string) => {
    const provincial_producers = [...formData.provincial_producers];
    let provinceData = provincial_producers.find(p => p.province === provinceName);
    const newProducer = {
        position: 1,
        name: '',
        district: '',
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
      
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm font-medium text-gray-700">Select Province:</label>
        <select 
          value={selectedProvince} 
          onChange={e => setSelectedProvince(e.target.value)} 
          className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Top Performers - {selectedProvince}</h3>
        <button
            onClick={() => addProvincialProducer(selectedProvince)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
        >
            Add Performer
        </button>
      </div>

        {(formData.provincial_producers.find(p => p.province === selectedProvince)?.producers || []).length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">No performers added for {selectedProvince} yet. Click "Add Performer" to get started.</p>
        </div>
      ) : (
          <div className="space-y-3">
            {(formData.provincial_producers.find(p => p.province === selectedProvince)?.producers || []).map((producer, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                      <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Rank
                    </label>
                    <input 
                      type="number" 
                      value={producer.position} 
                      onChange={e => handleProvincialProducerChange(selectedProvince, index, 'position', parseInt(e.target.value))} 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                          Producer Name
                        </label>
                        <input
                          value={producer.name}
                      onChange={e => handleProvincialProducerChange(selectedProvince, index, 'name', e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Farm name"
                        />
                      </div>
                      <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Region
                        </label>
                        <input
                          value={producer.district}
                      onChange={e => handleProvincialProducerChange(selectedProvince, index, 'district', e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="District"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Blank</option>
                      <option value="RWS">RWS</option>
                    </select>
                    </div>
                  <div className="flex items-end">
                    <button 
                      onClick={() => removeProvincialProducer(selectedProvince, index)} 
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

      {errors.provincial_producers && (
        <p className="text-sm text-red-600">{errors.provincial_producers}</p>
      )}
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
  onCancel: () => void;
  isSaving: boolean;
  errors: Record<string, string>;
}> = ({ formData, onSave, onCancel, isSaving, errors }) => {
  return (
    <div className="space-y-6">
          <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Review & Save</h2>
        <p className="text-gray-600 text-sm">Review your auction report data and save it to the system.</p>
          </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Auction Summary</h3>
          <div className="bg-gray-50 p-4 rounded-md space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Auction Date:</span>
              <span className="font-medium">{new Date(formData.auction.auction_date).toLocaleDateString()}</span>
          </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Catalogue:</span>
              <span className="font-medium">{formData.auction.catalogue_name}</span>
          </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Season:</span>
              <span className="font-medium">{formData.auction.season_label}</span>
          </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Week ID:</span>
              <span className="font-medium font-mono text-xs">{formData.auction.week_id}</span>
          </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Lots:</span>
              <span className="font-medium">{formData.indicators.find(i => i.type === 'total_lots')?.value.toLocaleString() || 'N/A'}</span>
          </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Volume:</span>
              <span className="font-medium">{formData.indicators.find(i => i.type === 'total_volume')?.value.toFixed(1) || 'N/A'} MT</span>
          </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Value:</span>
              <span className="font-medium">ZAR {formData.indicators.find(i => i.type === 'total_value')?.value.toFixed(1) || 'N/A'}M</span>
          </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sale Number:</span>
              <span className="font-medium">{formData.auction.sale_number || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Auction Center:</span>
              <span className="font-medium">{formData.auction.auction_center || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Merino Indicator:</span>
              <span className="font-medium">{formData.market_indices?.merino_indicator_cents_clean ? `${formData.market_indices.merino_indicator_cents_clean} cents` : 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Clearance Rate:</span>
              <span className="font-medium">{formData.supply_stats?.clearance_rate_pct ? `${formData.supply_stats.clearance_rate_pct}%` : 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Data Completeness</h3>
          <div className="bg-gray-50 p-4 rounded-md space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Buyers:</span>
              <span className="font-medium">{formData.buyers.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Brokers:</span>
              <span className="font-medium">{formData.brokers.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Provinces with Data:</span>
              <span className="font-medium">{formData.provincial_producers.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Micron Prices:</span>
              <span className="font-medium">{formData.micron_prices.filter(p => p.price_clean_zar_per_kg > 0).length}/{formData.micron_prices.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Market Insights:</span>
              <span className="font-medium">{formData.insights.length > 0 ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Market Indices:</span>
              <span className="font-medium">{formData.market_indices ? 'Complete' : 'Missing'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Currency Exchange:</span>
              <span className="font-medium">{formData.currency_fx ? 'Complete' : 'Missing'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Supply Statistics:</span>
              <span className="font-medium">{formData.supply_stats ? 'Complete' : 'Missing'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Micron Comparisons:</span>
              <span className="font-medium">{formData.micron_price_comparison?.rows?.length || 0} entries</span>
            </div>
          </div>
        </div>
      </div>

      {errors.save && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{errors.save}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isSaving ? 'Saving...' : 'Save Auction Report'}
        </button>
      </div>
    </div>
  );
};

export default AuctionDataCaptureForm;

