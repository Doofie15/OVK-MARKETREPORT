import React, { useState, useEffect, useRef } from 'react';
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
  AgencyMetrics,
  Season
} from '../../types';
import SupabaseService from '../../data/supabase-service';
import AIMarketInsightsComposer from './AIMarketInsightsComposer';

// Modern Date Picker Component
interface ModernDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

const ModernDatePicker: React.FC<ModernDatePickerProps> = ({
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  error,
  placeholder = "Select date",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Update display value when value changes
  useEffect(() => {
    setDisplayValue(formatDateForDisplay(value));
    // Update current month/year when value changes
    if (value) {
      const date = new Date(value);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  }, [value]);

  // Update current month/year when calendar opens
  useEffect(() => {
    if (isOpen) {
      if (value) {
        const date = new Date(value);
        setCurrentMonth(date.getMonth());
        setCurrentYear(date.getFullYear());
      } else {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
      }
    }
  }, [isOpen, value]);

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleDateSelect = (dateString: string) => {
    // Use the date string directly to avoid timezone issues
    // The dateString is already in YYYY-MM-DD format from the calendar
    const selectedDate = new Date(dateString);
    
    // Update the current month/year to match the selected date
    setCurrentMonth(selectedDate.getMonth());
    setCurrentYear(selectedDate.getFullYear());
    
    onChange(dateString);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow manual input in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleInputClick();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getCalendarDays = () => {
    const year = currentYear;
    const month = currentMonth;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculate start date (Monday as first day of week)
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday-based
    startDate.setDate(startDate.getDate() - daysToSubtract);
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 42 days (6 weeks) to ensure we always have complete weeks
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return dateString === todayString;
  };

  const isSelected = (date: Date) => {
    if (!value) return false;
    // Create date strings using local date components to avoid timezone issues
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return dateString === value;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue || value}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-10 border rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all duration-200 ease-in-out
            ${disabled 
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200' 
              : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'
            }
            ${error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : ''
            }
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          `}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className={`w-5 h-5 ${disabled ? 'text-gray-400' : 'text-gray-500'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      </div>

      {isOpen && !disabled && (
        <div 
          ref={calendarRef}
          className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4"
        >
          {/* Month/Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleDateString('en-US', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - 5 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  const today = new Date();
                  setCurrentMonth(today.getMonth());
                  setCurrentYear(today.getFullYear());
                }}
                className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                title="Go to current month"
              >
                Today
              </button>
              <button
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                title="Previous month"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                title="Next month"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Day headers - Monday first */}
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
              <div key={day} className="p-2">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {getCalendarDays().map((date, index) => (
              <button
                key={index}
                onClick={() => {
                  const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  handleDateSelect(dateString);
                }}
                className={`
                  p-2 text-sm rounded-md transition-all duration-150 font-medium
                  ${isSelected(date)
                    ? 'bg-blue-600 text-white font-bold shadow-md transform scale-105'
                    : isToday(date)
                    ? 'bg-blue-100 text-blue-700 font-semibold border border-blue-300'
                    : isCurrentMonth(date)
                    ? 'text-gray-900 hover:bg-gray-100 hover:shadow-sm'
                    : 'text-gray-400 hover:bg-gray-50'
                  }
                  ${isSelected(date) ? 'ring-2 ring-blue-300' : ''}
                `}
              >
                {date.getDate()}
              </button>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() => handleDateSelect(new Date().toISOString().split('T')[0])}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Today
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

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

// Success Modal Component
const SuccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  const isPublished = title.includes('Published');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${
          isPublished ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          {isPublished ? (
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        
        <h3 className={`text-lg font-semibold text-center mb-2 ${
          isPublished ? 'text-green-900' : 'text-gray-900'
        }`}>{title}</h3>
        <p className="text-sm text-gray-600 text-center mb-6">{message}</p>
        
        {isPublished && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-green-800 text-center">
              🎉 Your report is now live and visible to all users!
            </p>
            <p className="text-xs text-green-700 text-center mt-1">
              Published on {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              isPublished 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isPublished ? '🎉 Awesome!' : 'OK'}
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
  seasons?: Season[];
}

// Utility functions for number formatting (shared across all tabs)
const formatNumberWithSpaces = (num: number | string): string => {
  if (!num || num === '') return '';
  const numStr = num.toString().replace(/\D/g, ''); // Remove all non-digits
  if (!numStr) return '';
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const formatNumberAsUserTypes = (inputValue: string): string => {
  // Remove all non-digits
  const cleanValue = inputValue.replace(/\D/g, '');
  if (!cleanValue) return '';
  
  // Add spaces every 3 digits from the right
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const parseFormattedNumber = (formattedStr: string): number => {
  if (!formattedStr) return 0;
  const cleanStr = formattedStr.replace(/\s/g, ''); // Remove spaces
  return parseFloat(cleanStr) || 0;
};

// Helper function to safely convert currency values to numbers
const getNumericValue = (value: any): number => {
  if (typeof value === 'string') {
    return parseFloat(value) || 0;
  }
  return value || 0;
};

const AuctionDataCaptureForm: React.FC<AuctionDataCaptureFormProps> = ({ 
  onSave, 
  onCancel, 
  editingReport,
  seasons: propSeasons = []
}) => {
  const [activeTab, setActiveTab] = useState('auction-details');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [formData, setFormData] = useState<Omit<AuctionReport, 'top_sales'>>(
    editingReport || {
      auction: {
        season_label: '',
        week_start: '',
        week_end: '',
        auction_date: '',
        catalogue_name: '',
        sale_number: '',
        auction_center: 'Port Elizabeth'
      },
      indicators: [],
      benchmarks: [],
      micron_prices: [
        { bucket_micron: '15.0', category: 'Fine', price_clean_zar_per_kg: 0 },
        { bucket_micron: '16.0', category: 'Fine', price_clean_zar_per_kg: 0 },
        { bucket_micron: '17.0', category: 'Fine', price_clean_zar_per_kg: 0 },
        { bucket_micron: '17.5', category: 'Fine', price_clean_zar_per_kg: 0 },
        { bucket_micron: '18.0', category: 'Fine', price_clean_zar_per_kg: 0 },
        { bucket_micron: '18.5', category: 'Fine', price_clean_zar_per_kg: 0 },
        { bucket_micron: '19.0', category: 'Medium', price_clean_zar_per_kg: 0 },
        { bucket_micron: '19.5', category: 'Medium', price_clean_zar_per_kg: 0 },
        { bucket_micron: '20.0', category: 'Medium', price_clean_zar_per_kg: 0 },
        { bucket_micron: '20.5', category: 'Medium', price_clean_zar_per_kg: 0 },
        { bucket_micron: '21.0', category: 'Medium', price_clean_zar_per_kg: 0 },
        { bucket_micron: '21.5', category: 'Medium', price_clean_zar_per_kg: 0 },
        { bucket_micron: '22.0', category: 'Medium', price_clean_zar_per_kg: 0 }
      ],
      buyers: [],
      brokers: [],
      currencies: [],
      insights: '',
      trends: { rws: [], non_rws: [], awex: [] },
      yearly_average_prices: [],
      provincial_producers: [],
      province_avg_prices: [],
      // Cape Wools fields
      market_indices: {
        // SA Merino Indicator (cents clean)
        merino_indicator_sa_cents_clean: 0,
        // US Merino Indicator (cents clean)
        merino_indicator_us_cents_clean: 0,
        // Euro Merino Indicator (cents clean)
        merino_indicator_euro_cents_clean: 0,
        
        // SA Certified Indicator (cents clean)
        certified_indicator_sa_cents_clean: 0,
        // US Certified Indicator (cents clean)
        certified_indicator_us_cents_clean: 0,
        // Euro Certified Indicator (cents clean)
        certified_indicator_euro_cents_clean: 0,
        
        // AWEX EMI (cents clean) - using SA value as base
        awex_emi_sa_cents_clean: 0
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
        offered_bales: 0,
        sold_bales: 0,
        all_wool_pct_offered: 0,
        all_wool_pct_sold: 0,
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

  // Update form data when editingReport changes
  useEffect(() => {
    if (editingReport) {
      console.log('🔄 Loading editing report data:', {
        catalogue: `${editingReport.auction.catalogue_prefix}${editingReport.auction.catalogue_number}`,
        micron_price_comparison_rows: editingReport.micron_price_comparison?.rows?.length || 0,
        buyers_count: editingReport.buyers?.length || 0,
        brokers_count: editingReport.brokers?.length || 0,
        provincial_producers_count: editingReport.provincial_producers?.length || 0,
        first_micron_row: editingReport.micron_price_comparison?.rows?.[0],
        first_buyer: editingReport.buyers?.[0],
        first_broker: editingReport.brokers?.[0],
        first_provincial: editingReport.provincial_producers?.[0]
      });
      setFormData(editingReport);
    }
  }, [editingReport]);

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

  // Success modal state
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });
  
  // Custom entries storage (in a real app, this would be in a database)
  const [customEntries, setCustomEntries] = useState<{
    buyers: Array<{ name: string; description: string }>;
    brokers: Array<{ name: string; description: string }>;
  }>({
    buyers: [],
    brokers: []
  });
  
  // State to trigger buyers list refresh
  const [buyersRefreshTrigger, setBuyersRefreshTrigger] = useState(0);
  // State to trigger brokers list refresh
  const [brokersRefreshTrigger, setBrokersRefreshTrigger] = useState(0);

  const tabs = [
    { id: 'auction-details', label: 'Auction Details', icon: '📅' },
    { id: 'market-summary', label: 'Market Summary', icon: '📊' },
    { id: 'key-indicators', label: 'Key Indicators', icon: '📈' },
    { id: 'exchange-rates', label: 'Exchange Rates', icon: '💱' },
    { id: 'micron-prices', label: 'Micron Prices', icon: '💰' },
    { id: 'buyers-brokers', label: 'Buyers & Brokers', icon: '👥' },
    { id: 'provincial-data', label: 'Provincial Data', icon: '🗺️' },
    { id: 'company-data', label: 'Company Data', icon: '🏢' },
    { id: 'market-insights', label: 'Market Insights', icon: '💡' },
    { id: 'review-save', label: 'Review & Save', icon: '✅' }
  ];

  // Auto-calculate week details when auction date changes (only for new reports, not when editing)
  useEffect(() => {
    if (!editingReport && formData.auction.auction_date) {
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
            week_end: weekEnd.toISOString().split('T')[0]
          }
        }));
    }
  }, [formData.auction.auction_date, editingReport]);

  const validateTab = (tabId: string): boolean => {
    const newErrors: Record<string, string> = {};

    switch (tabId) {
      case 'auction-details':
        // Enhanced date validation
        if (!formData.auction.auction_date) {
          newErrors.auction_date = 'Auction date is required';
        } else {
          const auctionDate = new Date(formData.auction.auction_date);
          const today = new Date();
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(today.getFullYear() - 1);
          const oneYearFromNow = new Date();
          oneYearFromNow.setFullYear(today.getFullYear() + 1);
          
          if (isNaN(auctionDate.getTime())) {
            newErrors.auction_date = 'Please enter a valid date';
          } else if (auctionDate < oneYearAgo) {
            newErrors.auction_date = 'Auction date cannot be more than one year in the past';
          } else if (auctionDate > oneYearFromNow) {
            newErrors.auction_date = 'Auction date cannot be more than one year in the future';
          }
        }

        // Validate commodity type
        if (!formData.auction.commodity_type_id) {
          newErrors.commodity_type_id = 'Commodity type is required';
        }
        
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
        const result = await SupabaseService.saveAuctionReport(formData);
        if (result.success) {
          showSuccessModal('Report Published!', 'Your auction report has been successfully saved and published to the database.');
          onSave(formData);
        } else {
          alert(`Failed to save report: ${result.error}`);
        }
      } catch (error) {
        console.error('Error saving auction report:', error);
        alert('Failed to save report. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // Ensure season_id is set correctly before saving
      let dataToSave = { ...formData };
      
      // Always try to set season_id if it's missing, using the latest season
      if (!dataToSave.auction.season_id && propSeasons.length > 0) {
        // First try to find by season_label if it exists
        let matchingSeason = null;
        if (dataToSave.auction.season_label) {
          matchingSeason = propSeasons.find(s => s.season_year === dataToSave.auction.season_label);
        }
        
        // If no match by label, use the first (latest) season
        if (!matchingSeason) {
          matchingSeason = propSeasons[0];
        }
        
        if (matchingSeason && matchingSeason.id) {
          dataToSave.auction.season_id = matchingSeason.id;
          dataToSave.auction.season_label = matchingSeason.season_year;
        }
      }
      
      const result = await SupabaseService.saveAuctionReportDraft(dataToSave);
      if (result.success) {
        showSuccessModal('Draft Saved!', 'Your auction report has been saved as a draft and stored in the database.');
      } else {
        alert(`Failed to save draft: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving auction report draft:', error);
      alert('Failed to save draft. Please try again.');
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



  const showSuccessModal = (title: string, message: string) => {
    setSuccessModal({
      isOpen: true,
      title,
      message
    });
  };

  const closeSuccessModal = () => {
    setSuccessModal({
      isOpen: false,
      title: '',
      message: ''
    });
  };

  const handleAddNewEntry = async (name: string, description: string) => {
    if (modalState.type === 'buyer') {
      try {
        const { SupabaseAuctionDataService } = await import('../../data/supabase-service');
        const { supabase } = await import('../../lib/supabase');
        
        // Get the current authenticated user
        const userResult = await SupabaseAuctionDataService.getCurrentUser();
        if (!userResult.success || !userResult.data) {
          alert('You must be logged in to add new buyers. Please refresh the page and log in again.');
          return;
        }
        
        const result = await SupabaseAuctionDataService.createBuyer({
          buyer_name: name,
          created_by: userResult.data.id
        });
        
        if (result.success) {
          // Refresh the buyers list by triggering a state update
          setBuyersRefreshTrigger(prev => prev + 1);
          
          // Find the buyer row that has [+Add New] selected and update it with the new buyer name
          const updatedBuyers = formData.buyers.map(buyer => {
            if (buyer.buyer === '[+Add New]') {
              return { ...buyer, buyer: name };
            }
            return buyer;
          });
          
          // Update the form data with the newly selected buyer
          updateFormData({ buyers: updatedBuyers });
          
          closeModal();
          showSuccessModal('Success!', `Buyer "${name}" has been added successfully and selected in the dropdown.`);
        } else {
          alert(`Failed to add buyer: ${result.error}`);
        }
      } catch (error) {
        console.error('Error adding buyer:', error);
        alert('Failed to add buyer. Please try again.');
      }
    } else if (modalState.type === 'broker') {
      try {
        const { SupabaseAuctionDataService } = await import('../../data/supabase-service');
        const { supabase } = await import('../../lib/supabase');
        
        // Get the current authenticated user
        const userResult = await SupabaseAuctionDataService.getCurrentUser();
        if (!userResult.success || !userResult.data) {
          alert('You must be logged in to add new brokers. Please refresh the page and log in again.');
          return;
        }
        
        const result = await SupabaseAuctionDataService.createBroker({
          name: name,
          created_by: userResult.data.id
        });
        
        if (result.success) {
          // Refresh the brokers list by triggering a state update
          setBrokersRefreshTrigger(prev => prev + 1);
          
          // Find the broker row that has [+Add New] selected and update it with the new broker name
          const updatedBrokers = formData.brokers.map(broker => {
            if (broker.name === '[+Add New]') {
              return { ...broker, name: name };
            }
            return broker;
          });
          
          // Update the form data with the newly selected broker
          updateFormData({ brokers: updatedBrokers });
          
          closeModal();
          showSuccessModal('Success!', `Broker "${name}" has been added successfully and selected in the dropdown.`);
        } else {
          alert(`Failed to add broker: ${result.error}`);
        }
      } catch (error) {
        console.error('Error adding broker:', error);
        alert('Failed to add broker. Please try again.');
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'auction-details':
        return <AuctionDetailsTab formData={formData} updateFormData={updateFormData} errors={errors} seasons={propSeasons} editingReport={editingReport} />;
      case 'market-summary':
        return <MarketSummaryTab formData={formData} updateFormData={updateFormData} errors={errors} editingReport={editingReport} />;
      case 'key-indicators':
        return <KeyIndicatorsTab formData={formData} updateFormData={updateFormData} errors={errors} editingReport={editingReport} />;
      case 'exchange-rates':
        return <ExchangeRatesTab formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 'micron-prices':
        return <MicronPricesTab formData={formData} updateFormData={updateFormData} errors={errors} editingReport={editingReport} />;
      case 'buyers-brokers':
        return <BuyersBrokersTab 
          formData={formData} 
          updateFormData={updateFormData} 
          errors={errors}
          customEntries={customEntries}
          onOpenModal={openModal}
          buyersRefreshTrigger={buyersRefreshTrigger}
          brokersRefreshTrigger={brokersRefreshTrigger}
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

  // Add safety check to ensure component renders
  if (!formData) {
    console.error('FormData is not initialized properly');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="w-[95%] mx-auto">
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
        <div className="w-[95%] mx-auto px-6">
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
      <div className="w-[95%] mx-auto px-6 py-6">
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

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        title={successModal.title}
        message={successModal.message}
      />
    </div>
  );
};


// Tab Components
const AuctionDetailsTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
  seasons?: Season[];
  editingReport?: AuctionReport;
}> = ({ formData, updateFormData, errors, seasons: propSeasons = [], editingReport }) => {
  const [loadingSeasons, setLoadingSeasons] = useState(false);
  const [commodityTypes, setCommodityTypes] = useState<any[]>([]);
  const [loadingCommodityTypes, setLoadingCommodityTypes] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [suggestions, setSuggestions] = useState<{
    auctionDate: string;
    cataloguePrefix: string;
    catalogueNumber: string;
    catalogueName: string;
  } | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsApplied, setSuggestionsApplied] = useState(false);

  // Load suggestions based on previous auction
  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const result = await SupabaseService.getAuctionReport('latest');
      if (result.success && result.data) {
        const lastAuctionDate = new Date(result.data.auction.auction_date);
        const nextAuctionDate = new Date(lastAuctionDate);
        nextAuctionDate.setDate(lastAuctionDate.getDate() + 7); // Add 7 days
        
        // Parse catalogue name to get prefix and number
        const catalogueName = result.data.auction.catalogue_name || '';
        const parts = catalogueName.split(/(\d+)/);
        const prefix = parts[0] || 'CG';
        const lastNumber = parseInt(parts[1]) || 0;
        const nextNumber = String(lastNumber + 1).padStart(2, '0');
        
        setSuggestions({
          auctionDate: nextAuctionDate.toISOString().split('T')[0],
          cataloguePrefix: prefix,
          catalogueNumber: nextNumber,
          catalogueName: prefix + nextNumber
        });
      }
    } catch (error) {
      console.log('No previous auction found or error loading suggestions:', error);
      // Set default suggestions if no previous auction
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      setSuggestions({
        auctionDate: nextWeek.toISOString().split('T')[0],
        cataloguePrefix: 'CG',
        catalogueNumber: '01',
        catalogueName: 'CG01'
      });
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Load suggestions when component mounts
  useEffect(() => {
    loadSuggestions();
  }, []);

  // Apply suggestions to form
  const applySuggestions = () => {
    if (suggestions) {
      updateFormData({
        auction: {
          ...formData.auction,
          auction_date: suggestions.auctionDate,
          catalogue_name: suggestions.catalogueName
        }
      });
      // Hide the banner after applying suggestions
      setSuggestionsApplied(true);
    }
  };

  // Load commodity types from database
  useEffect(() => {
    const loadCommodityTypes = async () => {
      try {
        const result = await SupabaseService.getAllCommodityTypes();
        if (result.success) {
          const types = result.data || [];
          setCommodityTypes(types);
          
          // Auto-select "Wool" if no commodity type is selected and wool is available
          if (!formData.auction.commodity_type_id) {
            const woolType = types.find(type => 
              type.name.toLowerCase() === 'wool' || 
              type.name.toLowerCase().includes('wool')
            );
            if (woolType) {
              console.log('Auto-selecting default commodity type: Wool');
              updateFormData({
                auction: { ...formData.auction, commodity_type_id: woolType.id }
              });
            }
          }
        } else {
          console.error('Error loading commodity types:', result.error);
          // Fallback to hardcoded types if database fails
          const fallbackTypes = [
            { id: '1', name: 'Wool', description: 'Sheep wool' },
            { id: '2', name: 'Mohair', description: 'Angora goat fiber' }
          ];
          setCommodityTypes(fallbackTypes);
          
          // Auto-select wool from fallback types
          if (!formData.auction.commodity_type_id) {
            updateFormData({
              auction: { ...formData.auction, commodity_type_id: '1' } // Wool ID
            });
          }
        }
      } catch (error) {
        console.error('Error loading commodity types:', error);
        // Fallback to hardcoded types
        const fallbackTypes = [
          { id: '1', name: 'Wool', description: 'Sheep wool' },
          { id: '2', name: 'Mohair', description: 'Angora goat fiber' }
        ];
        setCommodityTypes(fallbackTypes);
        
        // Auto-select wool from fallback types
        if (!formData.auction.commodity_type_id) {
          updateFormData({
            auction: { ...formData.auction, commodity_type_id: '1' } // Wool ID
          });
        }
      } finally {
        setLoadingCommodityTypes(false);
      }
    };

    loadCommodityTypes();
  }, []);

  // Use seasons from props - moved to main component
  useEffect(() => {
    console.log('Seasons useEffect triggered:', { propSeasonsLength: propSeasons.length, editingReport: !!editingReport });
    
    if (propSeasons && propSeasons.length > 0) {
      // Sort seasons by year descending (latest first)
      const sortedSeasons = [...propSeasons].sort((a, b) => b.season_year.localeCompare(a.season_year));
      
      // If no season is selected and we have seasons, select the latest one (only for new reports, not when editing)
      if (!editingReport && !formData.auction.season_label && sortedSeasons.length > 0) {
        console.log('Auto-selecting latest season:', sortedSeasons[0].season_year);
        console.log('Full season object:', sortedSeasons[0]);
        console.log('Season ID being set:', sortedSeasons[0].id);
        updateFormData({
          auction: { 
            ...formData.auction, 
            season_label: sortedSeasons[0].season_year,
            season_id: sortedSeasons[0].id
          }
        });
      } else {
        // Check if we have a season_label but no season_id, and try to fix it (always check this)
        if (formData.auction.season_label && !formData.auction.season_id && sortedSeasons.length > 0) {
          const matchingSeason = sortedSeasons.find(s => s.season_year === formData.auction.season_label);
          if (matchingSeason) {
            console.log('Found missing season_id for existing season_label:', {
              season_label: formData.auction.season_label,
              found_season_id: matchingSeason.id
            });
            updateFormData({
              auction: { 
                ...formData.auction, 
                season_id: matchingSeason.id
              }
            });
          }
        }
        
        console.log('Season already selected or no seasons available:', {
          season_label: formData.auction.season_label,
          season_id: formData.auction.season_id,
          seasonsCount: sortedSeasons.length
        });
      }
    }
  }, [propSeasons, editingReport, formData.auction.season_label, formData.auction.season_id]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  // Handle drag and drop
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Auction Details</h2>
        <p className="text-gray-600 text-sm">Enter the basic auction information including date, catalogue details, and commodity type.</p>
      </div>

      {/* Smart Suggestions */}
      {!suggestionsApplied && loadingSuggestions ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-gray-600">Loading smart suggestions...</span>
          </div>
        </div>
      ) : !suggestionsApplied && suggestions && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-blue-900">Smart Suggestions</h3>
                <p className="text-xs text-blue-700">
                  Based on previous auction: {suggestions.auctionDate} • {suggestions.catalogueName}
                </p>
              </div>
            </div>
            <button
              onClick={applySuggestions}
              disabled={loadingSuggestions}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingSuggestions ? 'Loading...' : 'Apply Suggestions'}
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Season *
            </label>
            <select
              value={formData.auction.season_label}
              onChange={(e) => {
                const selectedSeason = propSeasons.find(s => s.season_year === e.target.value);
                console.log('Manual season selection:', {
                  selectedValue: e.target.value,
                  foundSeason: selectedSeason,
                  seasonId: selectedSeason?.id
                });
                updateFormData({
                  auction: { 
                    ...formData.auction, 
                    season_label: e.target.value,
                    season_id: selectedSeason?.id || null
                  }
                });
              }}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.season_label ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loadingSeasons}
            >
              {loadingSeasons ? (
                <option value="">Loading seasons...</option>
              ) : propSeasons.length === 0 ? (
                <option value="">No seasons available - Create a season first</option>
              ) : (
                propSeasons.map((season) => (
                  <option key={season.id} value={season.season_year}>
                    {season.season_year}
                  </option>
                ))
              )}
            </select>
            {errors.season_label && (
              <p className="mt-1 text-sm text-red-600">{errors.season_label}</p>
            )}
            {!loadingSeasons && propSeasons.length === 0 && (
              <p className="mt-1 text-sm text-amber-600">
                💡 No seasons found. Please create a season in the Seasons section first.
              </p>
            )}
          </div>

          <ModernDatePicker
            value={formData.auction.auction_date}
            onChange={(value) => updateFormData({
              auction: { ...formData.auction, auction_date: value }
            })}
            label="Auction Date"
            required
            error={errors.auction_date}
            placeholder="Select auction date"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catalogue Prefix *
            </label>
            <input
              type="text"
              value={formData.auction.catalogue_name?.split(/(\d+)/)[0] || ''}
              onChange={(e) => {
                const currentNumber = formData.auction.catalogue_name?.split(/(\d+)/)[1] || '';
                const newCatalogueName = e.target.value + currentNumber;
                updateFormData({
                  auction: { ...formData.auction, catalogue_name: newCatalogueName }
                });
              }}
              placeholder="e.g., CG"
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
              Catalogue Number *
            </label>
            <input
              type="text"
              value={(() => {
                // Extract just the number part for display
                const catalogueName = formData.auction.catalogue_name || '';
                const numberMatch = catalogueName.match(/(\d+)$/);
                return numberMatch ? numberMatch[1] : '';
              })()}
              onChange={(e) => {
                const currentPrefix = formData.auction.catalogue_name?.replace(/\d+$/, '') || '';
                let inputValue = e.target.value;
                
                // Only allow digits
                inputValue = inputValue.replace(/\D/g, '');
                
                // Allow empty input (for backspace)
                if (inputValue === '') {
                  const newCatalogueName = currentPrefix;
                  updateFormData({
                    auction: { ...formData.auction, catalogue_name: newCatalogueName }
                  });
                  return;
                }
                
                // Limit to 2 digits maximum
                if (inputValue.length <= 2) {
                  // Don't auto-format while typing - let user type naturally
                  // Format will be applied on blur or when saving
                  const newCatalogueName = currentPrefix + inputValue;
                  updateFormData({
                    auction: { ...formData.auction, catalogue_name: newCatalogueName }
                  });
                }
              }}
              onBlur={(e) => {
                // Apply 2-digit formatting when user leaves the field
                const currentPrefix = formData.auction.catalogue_name?.replace(/\d+$/, '') || '';
                const currentNumber = e.target.value;
                
                if (currentNumber && currentNumber.length > 0) {
                  // Format as two digits with leading zero
                  const formattedNumber = currentNumber.padStart(2, '0');
                  const newCatalogueName = currentPrefix + formattedNumber;
                  updateFormData({
                    auction: { ...formData.auction, catalogue_name: newCatalogueName }
                  });
                }
              }}
              placeholder="e.g., 01"
              maxLength={2}
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
              Commodity Type *
            </label>
            <select
              value={formData.auction.commodity_type_id || ''}
              onChange={(e) => updateFormData({
                auction: { ...formData.auction, commodity_type_id: e.target.value }
              })}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.commodity_type_id ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loadingCommodityTypes}
            >
              {loadingCommodityTypes ? (
                <option value="">Loading commodity types...</option>
              ) : commodityTypes.length === 0 ? (
                <option value="">No commodity types available</option>
              ) : (
                <>
                  <option value="">Select commodity type</option>
                  {commodityTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} {type.description ? `- ${type.description}` : ''}
                    </option>
                  ))}
                </>
              )}
            </select>
            {errors.commodity_type_id && (
              <p className="mt-1 text-sm text-red-600">{errors.commodity_type_id}</p>
            )}
            {!loadingCommodityTypes && commodityTypes.length === 0 && (
              <p className="mt-1 text-sm text-amber-600">
                💡 No commodity types found. Please ensure the commodity_types table has data.
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <ModernDatePicker
            value={formData.auction.week_start}
            onChange={() => {}} // Read-only, no onChange needed
            label="Week Start"
            disabled
            placeholder="Auto-calculated"
          />

          <ModernDatePicker
            value={formData.auction.week_end}
            onChange={() => {}} // Read-only, no onChange needed
            label="Week End"
            disabled
            placeholder="Auto-calculated"
          />

          {/* Week Range Info */}
          {formData.auction.week_start && formData.auction.week_end && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-blue-800 font-medium">
                  Week Range: {new Date(formData.auction.week_start).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })} - {new Date(formData.auction.week_end).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}




          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Documents
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload files</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      multiple 
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" 
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, XLS, XLSX, TXT up to 10MB
                </p>
              </div>
            </div>
            
            {/* Show uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KeyIndicatorsTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
  editingReport?: AuctionReport;
}> = ({ formData, updateFormData, errors, editingReport }) => {
  const [previousData, setPreviousData] = useState<Omit<AuctionReport, 'top_sales'> | null>(null);

  // Load previous auction data for comparison
  useEffect(() => {
    const loadPreviousData = async () => {
      try {
        const result = await SupabaseService.getAuctionReport('latest');
        if (result.success && result.data) {
          setPreviousData(result.data);
        }
      } catch (error) {
        console.error('Error loading previous auction data:', error);
        // No previous data available - set to null so placeholders show
        setPreviousData(null);
      }
    };
    loadPreviousData();
  }, []);



  // Recalculate US and Euro values when exchange rates change (only for new reports, not when editing)
  useEffect(() => {
    if (!editingReport) {
      const zarUsd = typeof formData.currency_fx?.ZAR_USD === 'string' ? parseFloat(formData.currency_fx.ZAR_USD) || 0 : (formData.currency_fx?.ZAR_USD || 0);
      const zarEur = typeof formData.currency_fx?.ZAR_EUR === 'string' ? parseFloat(formData.currency_fx.ZAR_EUR) || 0 : (formData.currency_fx?.ZAR_EUR || 0);
      
      if (zarUsd > 0 && zarEur > 0) {
        const market_indices = { ...formData.market_indices };
        let needsUpdate = false;
        
        // Recalculate Merino indicators
        if (market_indices.merino_indicator_sa_cents_clean > 0) {
          const newUsValue = parseFloat((market_indices.merino_indicator_sa_cents_clean / zarUsd).toFixed(2));
          const newEurValue = parseFloat((market_indices.merino_indicator_sa_cents_clean / zarEur).toFixed(2));
          
          if (market_indices.merino_indicator_us_cents_clean !== newUsValue || 
              market_indices.merino_indicator_euro_cents_clean !== newEurValue) {
            market_indices.merino_indicator_us_cents_clean = newUsValue;
            market_indices.merino_indicator_euro_cents_clean = newEurValue;
            needsUpdate = true;
          }
        }
        
        // Recalculate Certified indicators
        if (market_indices.certified_indicator_sa_cents_clean > 0) {
          const newUsValue = parseFloat((market_indices.certified_indicator_sa_cents_clean / zarUsd).toFixed(2));
          const newEurValue = parseFloat((market_indices.certified_indicator_sa_cents_clean / zarEur).toFixed(2));
          
          if (market_indices.certified_indicator_us_cents_clean !== newUsValue || 
              market_indices.certified_indicator_euro_cents_clean !== newEurValue) {
            market_indices.certified_indicator_us_cents_clean = newUsValue;
            market_indices.certified_indicator_euro_cents_clean = newEurValue;
            needsUpdate = true;
          }
        }
        
        // AWEX EMI calculations removed - will be handled in backend
        
        if (needsUpdate) {
          updateFormData({ market_indices });
        }
      }
    }
  }, [formData.currency_fx?.ZAR_USD, formData.currency_fx?.ZAR_EUR, editingReport]);

  const handleMarketIndicesChange = (field: keyof MarketIndices, value: string) => {
    const market_indices = { ...formData.market_indices };
    // Allow empty string, and preserve the string value for display
    // Only convert to number when we have a valid numeric value
    if (value === '' || value === '.') {
      (market_indices as any)[field] = 0;
    } else {
      const numericValue = parseFloat(value);
      (market_indices as any)[field] = isNaN(numericValue) ? 0 : numericValue;
    }
    
    // REMOVED AUTO-CALCULATION: Let users enter values manually
    // Auto-calculation was causing unwanted field changes when typing
    // Users can manually enter US and Euro values if needed
    
    updateFormData({ market_indices });
  };


  return (
    <div className="space-y-6">
          <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Key Indicators</h2>
        <p className="text-gray-600 text-sm">Enter the key market indicators from the Cape Wools report - All Merino and Certified indicators in SA, US, and Euro currencies.</p>
          </div>
      
      {/* All Merino Indicators */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Merino Indicators</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                <div className="flex items-center">
                  SA c/kg Clean All Merino
                  <PreviousValueTag 
                    previousValue={previousData?.market_indices?.merino_indicator_sa_cents_clean}
                    previousData={previousData}
                    fieldName="merino_indicator_sa_cents_clean"
                  />
                </div>
                <PercentageChangeTag 
                  currentValue={formData.market_indices?.merino_indicator_sa_cents_clean}
                  previousValue={previousData?.market_indices?.merino_indicator_sa_cents_clean}
                  previousData={previousData}
                  fieldName="merino_indicator_sa_cents_clean"
                />
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.market_indices?.merino_indicator_sa_cents_clean || ''}
                onChange={(e) => handleMarketIndicesChange('merino_indicator_sa_cents_clean', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 19755"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                <div className="flex items-center">
                  US c/kg Clean All Merino
                  <PreviousValueTag 
                    previousValue={previousData?.market_indices?.merino_indicator_us_cents_clean}
                    previousData={previousData}
                    fieldName="merino_indicator_us_cents_clean"
                  />
                </div>
                <PercentageChangeTag 
                  currentValue={formData.market_indices?.merino_indicator_us_cents_clean}
                  previousValue={previousData?.market_indices?.merino_indicator_us_cents_clean}
                  previousData={previousData}
                  fieldName="merino_indicator_us_cents_clean"
                />
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.market_indices?.merino_indicator_us_cents_clean || ''}
                onChange={(e) => handleMarketIndicesChange('merino_indicator_us_cents_clean', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1139"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                <div className="flex items-center">
                  Euro c/kg Clean All Merino
                  <PreviousValueTag 
                    previousValue={previousData?.market_indices?.merino_indicator_euro_cents_clean}
                    previousData={previousData}
                    fieldName="merino_indicator_euro_cents_clean"
                  />
                </div>
                <PercentageChangeTag 
                  currentValue={formData.market_indices?.merino_indicator_euro_cents_clean}
                  previousValue={previousData?.market_indices?.merino_indicator_euro_cents_clean}
                  previousData={previousData}
                  fieldName="merino_indicator_euro_cents_clean"
                />
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.market_indices?.merino_indicator_euro_cents_clean || ''}
                onChange={(e) => handleMarketIndicesChange('merino_indicator_euro_cents_clean', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 963"
              />
            </div>
          </div>
          </div>
        </div>
        
      {/* Certified Indicators */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Certified Indicators **</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                <div className="flex items-center">
                  SA c/kg Clean Certified **
                  <PreviousValueTag 
                    previousValue={previousData?.market_indices?.certified_indicator_sa_cents_clean}
                    previousData={previousData}
                    fieldName="certified_indicator_sa_cents_clean"
                  />
                </div>
                <PercentageChangeTag 
                  currentValue={formData.market_indices?.certified_indicator_sa_cents_clean}
                  previousValue={previousData?.market_indices?.certified_indicator_sa_cents_clean}
                  previousData={previousData}
                  fieldName="certified_indicator_sa_cents_clean"
                />
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.market_indices?.certified_indicator_sa_cents_clean || ''}
                onChange={(e) => handleMarketIndicesChange('certified_indicator_sa_cents_clean', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 20261"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                <div className="flex items-center">
                  US c/kg Clean Certified **
                  <PreviousValueTag 
                    previousValue={previousData?.market_indices?.certified_indicator_us_cents_clean}
                    previousData={previousData}
                    fieldName="certified_indicator_us_cents_clean"
                  />
                </div>
                <PercentageChangeTag 
                  currentValue={formData.market_indices?.certified_indicator_us_cents_clean}
                  previousValue={previousData?.market_indices?.certified_indicator_us_cents_clean}
                  previousData={previousData}
                  fieldName="certified_indicator_us_cents_clean"
                />
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.market_indices?.certified_indicator_us_cents_clean || ''}
                onChange={(e) => handleMarketIndicesChange('certified_indicator_us_cents_clean', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1168"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                <div className="flex items-center">
                  Euro c/kg Clean Certified **
                  <PreviousValueTag 
                    previousValue={previousData?.market_indices?.certified_indicator_euro_cents_clean}
                    previousData={previousData}
                    fieldName="certified_indicator_euro_cents_clean"
                  />
                </div>
                <PercentageChangeTag 
                  currentValue={formData.market_indices?.certified_indicator_euro_cents_clean}
                  previousValue={previousData?.market_indices?.certified_indicator_euro_cents_clean}
                  previousData={previousData}
                  fieldName="certified_indicator_euro_cents_clean"
                />
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.market_indices?.certified_indicator_euro_cents_clean || ''}
                onChange={(e) => handleMarketIndicesChange('certified_indicator_euro_cents_clean', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 987"
              />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

// Previous Value Tag Component (goes next to label)
const PreviousValueTag: React.FC<{
  previousValue: number | undefined;
  previousData?: any; // Add previousData to help with migration
  fieldName?: string; // Add fieldName to help with migration
  formatType?: 'currency' | 'mass' | 'number' | 'percentage' | 'whole'; // Add format type
}> = ({ previousValue, previousData, fieldName, formatType = 'number' }) => {
  // If no previousValue but we have previousData and fieldName, try to get the old field name
  let actualPreviousValue = previousValue;
  
  if (!actualPreviousValue && previousData?.market_indices && fieldName) {
    // Handle migration from old field names to new ones
    const oldFieldMap: Record<string, string> = {
      'merino_indicator_sa_cents_clean': 'merino_indicator_cents_clean',
      'certified_indicator_sa_cents_clean': 'certified_indicator_cents_clean',
      'awex_emi_sa_cents_clean': 'awex_emi_cents_clean'
    };
    
    const oldFieldName = oldFieldMap[fieldName];
    if (oldFieldName && previousData.market_indices[oldFieldName]) {
      actualPreviousValue = previousData.market_indices[oldFieldName];
    }
  }
  
  if (!actualPreviousValue || actualPreviousValue === undefined || actualPreviousValue === null) return null;

  // Format the value based on type
  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'currency':
        return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'mass':
        return `${value.toLocaleString('en-ZA')} kg`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'whole':
        return value.toLocaleString('en-ZA');
      case 'number':
      default:
        return value.toFixed(value >= 1 ? 2 : 4);
    }
  };

  return (
    <span className="text-xs text-gray-600 px-2 py-1 bg-amber-50 border border-amber-200 rounded ml-2">
      Prev Auction - {formatValue(actualPreviousValue, formatType)}
    </span>
  );
};

// Percentage Change Tag Component (goes at end of label line)
const PercentageChangeTag: React.FC<{
  currentValue: number | undefined;
  previousValue: number | undefined;
  isCurrency?: boolean; // For currency exchange rates (inverted logic)
  previousData?: any; // Add previousData to help with migration
  fieldName?: string; // Add fieldName to help with migration
  className?: string; // Add className prop for custom styling
  formatType?: 'currency' | 'mass' | 'number' | 'percentage' | 'whole'; // Add format type
}> = ({ currentValue, previousValue, isCurrency = false, previousData, fieldName, className = '', formatType = 'number' }) => {
  // If no previousValue but we have previousData and fieldName, try to get the old field name
  let actualPreviousValue = previousValue;
  
  if (!actualPreviousValue && previousData?.market_indices && fieldName) {
    // Handle migration from old field names to new ones
    const oldFieldMap: Record<string, string> = {
      'merino_indicator_sa_cents_clean': 'merino_indicator_cents_clean',
      'certified_indicator_sa_cents_clean': 'certified_indicator_cents_clean',
      'awex_emi_sa_cents_clean': 'awex_emi_cents_clean'
    };
    
    const oldFieldName = oldFieldMap[fieldName];
    if (oldFieldName && previousData.market_indices[oldFieldName]) {
      actualPreviousValue = previousData.market_indices[oldFieldName];
    }
  }
  
  if (!actualPreviousValue || actualPreviousValue === undefined || actualPreviousValue === null || currentValue === undefined || currentValue === null) return null;

  const change = ((currentValue - actualPreviousValue) / actualPreviousValue) * 100;
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
    } ${className}`}>
      {arrowDirection} {Math.abs(change).toFixed(2)}%
    </span>
  );
};

const ExchangeRatesTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {
  const [previousData, setPreviousData] = useState<Omit<AuctionReport, 'top_sales'> | null>(null);

  // Load previous auction data for comparison
  useEffect(() => {
    const loadPreviousData = async () => {
      try {
        const result = await SupabaseService.getAuctionReport('latest');
        if (result.success && result.data) {
          setPreviousData(result.data);
        } else {
          // No previous data available - set to null so placeholders show
          setPreviousData(null);
        }
      } catch (error) {
        console.error('Error loading previous auction data:', error);
        // No previous data available - set to null so placeholders show
        setPreviousData(null);
      }
    };
    loadPreviousData();
  }, []);

  const handleCurrencyChange = (field: keyof CurrencyFX, value: string) => {
    const currency_fx = { ...formData.currency_fx };
    // Store the raw string value to allow typing decimal points
    // Only convert to number when we have a complete valid numeric value
    if (value === '') {
      (currency_fx as any)[field] = 0;
    } else {
      // Store as string to preserve decimal point during typing
      (currency_fx as any)[field] = value;
    }
    updateFormData({ currency_fx });
  };

  const handleMarketIndicesChange = (field: keyof MarketIndices, value: string) => {
    const market_indices = { ...formData.market_indices };
    (market_indices as any)[field] = parseFloat(value) || 0;
    updateFormData({ market_indices });
  };


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Exchange Rates</h2>
        <p className="text-gray-600 text-sm">Enter the currency exchange rates and AWEX EMI from the Cape Wools report.</p>
        
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
              type="text"
              value={String(formData.currency_fx?.ZAR_USD || '')}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                handleCurrencyChange('ZAR_USD', value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(parseFloat(value))) {
                  const numericValue = parseFloat(value);
                  const currency_fx = { ...formData.currency_fx };
                  currency_fx.ZAR_USD = numericValue;
                  updateFormData({ currency_fx });
                }
              }}
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
              type="text"
              value={String(formData.currency_fx?.ZAR_EUR || '')}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                handleCurrencyChange('ZAR_EUR', value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(parseFloat(value))) {
                  const numericValue = parseFloat(value);
                  const currency_fx = { ...formData.currency_fx };
                  currency_fx.ZAR_EUR = numericValue;
                  updateFormData({ currency_fx });
                }
              }}
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
              type="text"
              value={String(formData.currency_fx?.ZAR_JPY || '')}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                handleCurrencyChange('ZAR_JPY', value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(parseFloat(value))) {
                  const numericValue = parseFloat(value);
                  const currency_fx = { ...formData.currency_fx };
                  currency_fx.ZAR_JPY = numericValue;
                  updateFormData({ currency_fx });
                }
              }}
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
              type="text"
              value={String(formData.currency_fx?.ZAR_GBP || '')}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                handleCurrencyChange('ZAR_GBP', value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(parseFloat(value))) {
                  const numericValue = parseFloat(value);
                  const currency_fx = { ...formData.currency_fx };
                  currency_fx.ZAR_GBP = numericValue;
                  updateFormData({ currency_fx });
                }
              }}
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
              type="text"
              value={String(formData.currency_fx?.USD_AUD || '')}
              onChange={(e) => {
                // Allow only numbers, decimal point, and leading/trailing spaces
                const value = e.target.value.replace(/[^0-9.]/g, '');
                handleCurrencyChange('USD_AUD', value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(parseFloat(value))) {
                  const numericValue = parseFloat(value);
                  const currency_fx = { ...formData.currency_fx };
                  currency_fx.USD_AUD = numericValue;
                  updateFormData({ currency_fx });
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 0.6442"
            />
              </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <div className="flex items-center">
                SA c/kg Clean AWEX EMI
                <PreviousValueTag 
                  previousValue={previousData?.market_indices?.awex_emi_sa_cents_clean}
                  previousData={previousData}
                  fieldName="awex_emi_sa_cents_clean"
                />
              </div>
              <PercentageChangeTag 
                currentValue={formData.market_indices?.awex_emi_sa_cents_clean}
                previousValue={previousData?.market_indices?.awex_emi_sa_cents_clean}
                previousData={previousData}
                fieldName="awex_emi_sa_cents_clean"
              />
            </label>
            <input
              type="text"
              value={formData.market_indices?.awex_emi_sa_cents_clean || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                handleMarketIndicesChange('awex_emi_sa_cents_clean', value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(parseFloat(value))) {
                  const formatted = parseFloat(value).toString();
                  handleMarketIndicesChange('awex_emi_sa_cents_clean', formatted);
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1344"
            />
          </div>
            </div>
        </div>

    </div>
  );
};

const MarketSummaryTab: React.FC<{
  formData: Omit<AuctionReport, 'top_sales'>;
  updateFormData: (updates: Partial<Omit<AuctionReport, 'top_sales'>>) => void;
  errors: Record<string, string>;
  editingReport?: AuctionReport;
}> = ({ formData, updateFormData, errors, editingReport }) => {
  const [previousData, setPreviousData] = useState<Omit<AuctionReport, 'top_sales'> | null>(null);

  // Load previous auction data for comparison
  useEffect(() => {
    const loadPreviousData = async () => {
      try {
        const result = await SupabaseService.getAuctionReport('latest');
        if (result.success && result.data) {
          setPreviousData(result.data);
        } else {
          // No previous data available - set to null so placeholders show
          setPreviousData(null);
        }
      } catch (error) {
        console.error('Error loading previous auction data:', error);
        // No previous data available - set to null so placeholders show
        setPreviousData(null);
      }
    };
    loadPreviousData();
  }, []);

  const handleSupplyStatsChange = (field: keyof SupplyStats, value: string) => {
    const supply_stats = { ...formData.supply_stats };
    (supply_stats as any)[field] = parseFloat(value) || 0;
    
    // Auto-calculate clearance rate when sold_bales or offered_bales change
    if (field === 'sold_bales' || field === 'offered_bales') {
      const soldBales = field === 'sold_bales' ? (supply_stats as any)[field] : (supply_stats as any).sold_bales;
      const offeredBales = field === 'offered_bales' ? (supply_stats as any)[field] : (supply_stats as any).offered_bales;
      
      if (offeredBales > 0) {
        (supply_stats as any).clearance_rate_pct = Number(((soldBales / offeredBales) * 100).toFixed(2));
      } else {
        (supply_stats as any).clearance_rate_pct = 0;
      }
    }
    
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
    (greasy_stats as any)[field] = parseFormattedNumber(value);
    updateFormData({ greasy_stats });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Market Summary</h2>
        <p className="text-gray-600 text-sm">Enter the key market summary data from the Cape Wools report - bales offered, clearance rate, and highest price achieved.</p>
      </div>

      {/* Cape Wools Market Commentary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-blue-900 mb-2">
          Cape Wools Market Commentary
        </label>
        <p className="text-xs text-blue-700 mb-3">Copy and paste the market commentary paragraph from the Cape Wools report (the descriptive text at the top of their report).</p>
        <textarea
          value={formData.cape_wools_commentary || ''}
          onChange={(e) => updateFormData({ cape_wools_commentary: e.target.value })}
          className="w-full p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="Paste the Cape Wools market commentary here... e.g., 'The 2025/2026 wool selling season continued today with 6 507 bales on offer on the 5th sale of the season. The offering mainly consisted of fine micron wools, with 65% testing 20 micron and finer...'"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Supply Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Supply Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <span>Offered Bales</span>
                  <PreviousValueTag previousValue={previousData?.supply_stats?.offered_bales} formatType="whole" />
                </label>
                <input
                  type="number"
                  value={formData.supply_stats?.offered_bales || ''}
                  onChange={(e) => handleSupplyStatsChange('offered_bales', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 6507"
                />
                <PercentageChangeTag 
                  currentValue={formData.supply_stats?.offered_bales}
                  previousValue={previousData?.supply_stats?.offered_bales}
                  formatType="whole"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <span>Sold Bales</span>
                  <PreviousValueTag previousValue={previousData?.supply_stats?.sold_bales} formatType="whole" />
                </label>
                <input
                  type="number"
                  value={formData.supply_stats?.sold_bales || ''}
                  onChange={(e) => handleSupplyStatsChange('sold_bales', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 6084"
                />
                <PercentageChangeTag 
                  currentValue={formData.supply_stats?.sold_bales}
                  previousValue={previousData?.supply_stats?.sold_bales}
                  formatType="whole"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <span>Clearance Rate (%)</span>
                  <PreviousValueTag previousValue={previousData?.supply_stats?.clearance_rate_pct} />
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.supply_stats?.clearance_rate_pct || ''}
                  onChange={(e) => handleSupplyStatsChange('clearance_rate_pct', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Auto-calculated from sold/offered bales"
                />
                <div className="text-xs text-blue-600 mt-1">
                  Auto-calculated: (sold bales ÷ offered bales) × 100
                </div>
                <PercentageChangeTag 
                  currentValue={formData.supply_stats?.clearance_rate_pct}
                  previousValue={previousData?.supply_stats?.clearance_rate_pct}
                />
              </div>
            </div>
          </div>

          {/* Highest Price */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Highest Price</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <span>Price (cents clean)</span>
                  <PreviousValueTag previousValue={previousData?.highest_price?.price_cents_clean} />
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.highest_price?.price_cents_clean || ''}
                  onChange={(e) => handleHighestPriceChange('price_cents_clean', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 26563"
                />
                <PercentageChangeTag 
                  currentValue={formData.highest_price?.price_cents_clean}
                  previousValue={previousData?.highest_price?.price_cents_clean}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <span>Micron</span>
                  <PreviousValueTag previousValue={previousData?.highest_price?.micron} />
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.highest_price?.micron || ''}
                  onChange={(e) => handleHighestPriceChange('micron', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 15.5"
                />
                <PercentageChangeTag 
                  currentValue={formData.highest_price?.micron}
                  previousValue={previousData?.highest_price?.micron}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <span>Bales</span>
                  <PreviousValueTag previousValue={previousData?.highest_price?.bales} formatType="whole" />
                </label>
                <input
                  type="number"
                  value={formData.highest_price?.bales || ''}
                  onChange={(e) => handleHighestPriceChange('bales', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 1"
                />
                <PercentageChangeTag 
                  currentValue={formData.highest_price?.bales}
                  previousValue={previousData?.highest_price?.bales}
                  formatType="whole"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Certified Share */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Certified Sustainable Wool (Bales)</h3>
            <div className="space-y-4">
              {/* Table-style layout matching the report */}
              <div className="grid grid-cols-3 gap-4">
                {/* Column Headers */}
                <div className="text-center font-medium text-gray-700 py-2">Total</div>
                <div className="text-center font-medium text-gray-700 py-2">% Share (All Wool)</div>
                <div className="text-center font-medium text-gray-700 py-2">% Share (Merino Wool)</div>
                
                {/* Offered Row */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    <span>Offered</span>
                    <PreviousValueTag previousValue={previousData?.certified_share?.offered_bales} formatType="whole" />
                  </label>
                  <input
                    type="number"
                    value={formData.certified_share?.offered_bales || ''}
                    onChange={(e) => handleCertifiedShareChange('offered_bales', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 6021"
                  />
                  <PercentageChangeTag 
                    currentValue={formData.certified_share?.offered_bales}
                    previousValue={previousData?.certified_share?.offered_bales}
                    formatType="whole"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    <span>All Wool % Offered</span>
                    <PreviousValueTag previousValue={previousData?.certified_share?.all_wool_pct_offered} />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.certified_share?.all_wool_pct_offered || ''}
                    onChange={(e) => handleCertifiedShareChange('all_wool_pct_offered', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 56.3"
                  />
                  <PercentageChangeTag 
                    currentValue={formData.certified_share?.all_wool_pct_offered}
                    previousValue={previousData?.certified_share?.all_wool_pct_offered}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    <span>Merino % Offered</span>
                    <PreviousValueTag previousValue={previousData?.certified_share?.merino_pct_offered} />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.certified_share?.merino_pct_offered || ''}
                    onChange={(e) => handleCertifiedShareChange('merino_pct_offered', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 63.3"
                  />
                  <PercentageChangeTag 
                    currentValue={formData.certified_share?.merino_pct_offered}
                    previousValue={previousData?.certified_share?.merino_pct_offered}
                  />
                </div>
                
                {/* Sold Row */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    <span>Sold</span>
                    <PreviousValueTag previousValue={previousData?.certified_share?.sold_bales} formatType="whole" />
                  </label>
                  <input
                    type="number"
                    value={formData.certified_share?.sold_bales || ''}
                    onChange={(e) => handleCertifiedShareChange('sold_bales', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 5806"
                  />
                  <PercentageChangeTag 
                    currentValue={formData.certified_share?.sold_bales}
                    previousValue={previousData?.certified_share?.sold_bales}
                    formatType="whole"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    <span>All Wool % Sold</span>
                    <PreviousValueTag previousValue={previousData?.certified_share?.all_wool_pct_sold} />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.certified_share?.all_wool_pct_sold || ''}
                    onChange={(e) => handleCertifiedShareChange('all_wool_pct_sold', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 58.7"
                  />
                  <PercentageChangeTag 
                    currentValue={formData.certified_share?.all_wool_pct_sold}
                    previousValue={previousData?.certified_share?.all_wool_pct_sold}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    <span>Merino % Sold</span>
                    <PreviousValueTag previousValue={previousData?.certified_share?.merino_pct_sold} />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.certified_share?.merino_pct_sold || ''}
                    onChange={(e) => handleCertifiedShareChange('merino_pct_sold', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 61.6"
                  />
                  <PercentageChangeTag 
                    currentValue={formData.certified_share?.merino_pct_sold}
                    previousValue={previousData?.certified_share?.merino_pct_sold}
                  />
                </div>
              </div>

              {/* Footnotes */}
              <div className="border-t pt-3 mt-4">
                <p className="text-xs text-gray-500">
                  * Certified Sustainable Wool: Includes Responsible Wool Standard & Sustainable Cape Wool Standard.
                </p>
                <p className="text-xs text-gray-500">
                  ** Calculated on unique sustainable standard identifiers
                </p>
              </div>
            </div>
          </div>

          {/* Greasy Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Greasy Statistics</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <span>Turnover (ZAR)</span>
                  <PreviousValueTag previousValue={previousData?.greasy_stats?.turnover_rand} formatType="currency" />
                </label>
                <input
                  type="text"
                  value={formatNumberWithSpaces(formData.greasy_stats?.turnover_rand || '')}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const formattedValue = formatNumberAsUserTypes(inputValue);
                    const cleanValue = formattedValue.replace(/\s/g, '');
                    
                    if (cleanValue.length <= 12) { // Reasonable limit for currency
                      handleGreasyStatsChange('turnover_rand', formattedValue);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 125 000 000"
                />
                <PercentageChangeTag 
                  currentValue={formData.greasy_stats?.turnover_rand}
                  previousValue={previousData?.greasy_stats?.turnover_rand}
                  formatType="currency"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    <span>Bales</span>
                    <PreviousValueTag previousValue={previousData?.greasy_stats?.bales} formatType="whole" />
                  </label>
                  <input
                    type="text"
                    value={formatNumberWithSpaces(formData.greasy_stats?.bales || '')}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const formattedValue = formatNumberAsUserTypes(inputValue);
                      const cleanValue = formattedValue.replace(/\s/g, '');
                      
                      if (cleanValue.length <= 8) { // Reasonable limit for bales count
                        handleGreasyStatsChange('bales', formattedValue);
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 6 084"
                  />
                  <PercentageChangeTag 
                    currentValue={formData.greasy_stats?.bales}
                    previousValue={previousData?.greasy_stats?.bales}
                    formatType="whole"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    <span>Mass (kg)</span>
                    <PreviousValueTag previousValue={previousData?.greasy_stats?.mass_kg} formatType="mass" />
                  </label>
                  <input
                    type="text"
                    value={formatNumberWithSpaces(formData.greasy_stats?.mass_kg || '')}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const formattedValue = formatNumberAsUserTypes(inputValue);
                      const cleanValue = formattedValue.replace(/\s/g, '');
                      
                      if (cleanValue.length <= 10) { // Reasonable limit for mass in kg
                        handleGreasyStatsChange('mass_kg', formattedValue);
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1 500 000"
                  />
                  <PercentageChangeTag 
                    currentValue={formData.greasy_stats?.mass_kg}
                    previousValue={previousData?.greasy_stats?.mass_kg}
                    formatType="mass"
                  />
                </div>
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

    // Parse formatted number (remove spaces for numeric fields)
    const numericValue = field === 'total_lots' ? parseFormattedNumber(value) : (parseFloat(value) || 0);

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
              type="text"
              value={formatNumberWithSpaces(getStat('total_lots'))}
              onChange={e => {
                const inputValue = e.target.value;
                const formattedValue = formatNumberAsUserTypes(inputValue);
                const cleanValue = formattedValue.replace(/\s/g, '');
                
                if (cleanValue.length <= 8) { // Reasonable limit for total lots
                  handleStatsChange('total_lots', formattedValue);
                }
              }}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.total_lots ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 10 250"
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
  editingReport?: AuctionReport;
}> = ({ formData, updateFormData, errors, editingReport }) => {
  
  // Debug logging for micron prices data
  useEffect(() => {
    console.log('🔬 MicronPricesTab data:', {
      hasFormData: !!formData,
      micron_price_comparison: formData.micron_price_comparison,
      rowsCount: formData.micron_price_comparison?.rows?.length || 0,
      isEditing: !!editingReport,
      firstRow: formData.micron_price_comparison?.rows?.[0],
      allRows: formData.micron_price_comparison?.rows
    });
  }, [formData.micron_price_comparison, editingReport]);
  const [previousData, setPreviousData] = useState<Omit<AuctionReport, 'top_sales'> | null>(null);

  // Load previous auction data for comparison
  useEffect(() => {
    const loadPreviousData = async () => {
      try {
        const result = await SupabaseService.getAuctionReport('latest');
        if (result.success && result.data) {
          setPreviousData(result.data);
        } else {
          // No previous data available - set to null so placeholders show
          setPreviousData(null);
        }
      } catch (error) {
        console.error('Error loading previous auction data:', error);
        // No previous data available - set to null so placeholders show
        setPreviousData(null);
      }
    };
    loadPreviousData();
  }, []);

  // Initialize common microns on component mount (only for new reports, not when editing)
  useEffect(() => {
    if (!editingReport && (!formData.micron_price_comparison?.rows || formData.micron_price_comparison.rows.length === 0)) {
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
      
      updateFormData({ micron_price_comparison });
    }
  }, [editingReport]);


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
    
    // Find the next available micron value (start from 15.0 and go up)
    let nextMicron = 15.0;
    while (micron_price_comparison.rows.some(row => row.micron === nextMicron)) {
      nextMicron += 0.5;
    }
    
    micron_price_comparison.rows.push({
      micron: nextMicron,
      non_cert_clean_zar_per_kg: null,
      cert_clean_zar_per_kg: null,
      pct_difference: null
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
      

      {/* Cape Wools Micron Price Comparison */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Certified vs Non-Certified Price Comparison</h3>
            <p className="text-xs text-gray-600 mt-1">Leave price fields blank if no data is available for that micron category</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addMicronComparison}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Add Extra Micron
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
  buyersRefreshTrigger: number;
  brokersRefreshTrigger: number;
}> = ({ formData, updateFormData, errors, customEntries, onOpenModal, buyersRefreshTrigger, brokersRefreshTrigger }) => {
  
  
  const [databaseBuyers, setDatabaseBuyers] = useState<Array<{ id: string; buyer_name: string }>>([]);
  const [loadingBuyers, setLoadingBuyers] = useState(true);
  const [databaseBrokers, setDatabaseBrokers] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingBrokers, setLoadingBrokers] = useState(true);
  
  // Load buyers from database
  useEffect(() => {
    const loadBuyers = async () => {
      try {
        setLoadingBuyers(true);
        const { SupabaseAuctionDataService } = await import('../../data/supabase-service');
        const result = await SupabaseAuctionDataService.getAllBuyers();
        
        if (result.success && result.data) {
          setDatabaseBuyers(result.data);
        } else {
          console.error('Failed to load buyers:', result.error);
          // Fallback to hardcoded buyers if database fails
          setDatabaseBuyers([
            { id: '1', buyer_name: 'BKB Pinnacle Fibres' },
            { id: '2', buyer_name: 'G Modiano SA' },
            { id: '3', buyer_name: 'Lempriere (Pty) Ltd' },
            { id: '4', buyer_name: 'Modiano SA' },
            { id: '5', buyer_name: 'Ovk Wool' },
            { id: '6', buyer_name: 'Standard Wool' },
            { id: '7', buyer_name: 'Tianyu Wool' },
            { id: '8', buyer_name: 'Viterra Wool' }
          ]);
        }
      } catch (error) {
        console.error('Error loading buyers:', error);
      } finally {
        setLoadingBuyers(false);
      }
    };
    
    loadBuyers();
  }, [buyersRefreshTrigger]);
  
  // Load brokers from database
  useEffect(() => {
    const loadBrokers = async () => {
      try {
        setLoadingBrokers(true);
        const { SupabaseAuctionDataService } = await import('../../data/supabase-service');
        const result = await SupabaseAuctionDataService.getAllBrokers();
        
        if (result.success && result.data) {
          setDatabaseBrokers(result.data);
        } else {
          console.error('Failed to load brokers:', result.error);
          // Fallback to hardcoded brokers if database fails
          setDatabaseBrokers([
            { id: '1', name: 'BKB' },
            { id: '2', name: 'OVK' },
            { id: '3', name: 'JLW' },
            { id: '4', name: 'MAS' },
            { id: '5', name: 'QWB' },
            { id: '6', name: 'VLB' }
          ]);
        }
      } catch (error) {
        console.error('Error loading brokers:', error);
      } finally {
        setLoadingBrokers(false);
      }
    };
    
    loadBrokers();
  }, [brokersRefreshTrigger]);
  
  // Get selected buyer names to filter them out (exclude '[+Add New]' as it's not a real selection)
  const selectedBuyerNames = formData.buyers.map(b => b.buyer).filter(buyer => buyer && buyer !== '[+Add New]');
  
  // Get selected broker names to filter them out (exclude '[+Add New]' as it's not a real selection)
  const selectedBrokerNames = formData.brokers.map(b => b.name).filter(name => name && name !== '[+Add New]');
  
  // Combine database buyers with custom entries, excluding already selected ones
  const availableBuyers = databaseBuyers
    .filter(b => !selectedBuyerNames.includes(b.buyer_name))
    .map(b => b.buyer_name);
    
  // Combine database brokers with custom entries, excluding already selected ones
  const availableBrokers = databaseBrokers
    .filter(b => !selectedBrokerNames.includes(b.name))
    .map(b => b.name);
    
  // Create buyers list with currently selected values included
  const createBuyersList = (currentBuyerValue?: string) => {
    const baseBuyers = ["[+Add New]", ...availableBuyers, ...customEntries.buyers.map(b => b.name).filter(name => !selectedBuyerNames.includes(name))];
    
    // If there's a current buyer value and it's not in the list, add it
    if (currentBuyerValue && currentBuyerValue !== '[+Add New]' && !baseBuyers.includes(currentBuyerValue)) {
      baseBuyers.push(currentBuyerValue);
    }
    
    return baseBuyers;
  };
  
  // Create brokers list with currently selected values included
  const createBrokersList = (currentBrokerValue?: string) => {
    const baseBrokers = ["[+Add New]", ...availableBrokers, ...customEntries.brokers.map(b => b.name).filter(name => !selectedBrokerNames.includes(name))];
    
    // If there's a current broker value and it's not in the list, add it
    if (currentBrokerValue && currentBrokerValue !== '[+Add New]' && !baseBrokers.includes(currentBrokerValue)) {
      baseBrokers.push(currentBrokerValue);
    }
    
    return baseBrokers;
  };

  const addBuyer = () => {
    const newBuyer = {
      buyer: '[+Add New]', // Always start with [+Add New] option
      share_pct: 0,
      cat: 0,
      bales_ytd: 0
    };
    updateFormData({ buyers: [...formData.buyers, newBuyer] });
  };

  const addBroker = () => {
    const newBroker = {
      name: '[+Add New]', // Always start with [+Add New] option
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
                      {createBuyersList(buyer.buyer).map(b => (
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
                      {createBrokersList(broker.name).map(b => (
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
  
  // Debug logging for provincial data
  useEffect(() => {
    console.log('🏛️ ProvincialDataTab data:', {
      provincial_producers: formData.provincial_producers,
      producersCount: formData.provincial_producers?.length || 0,
      firstProducer: formData.provincial_producers?.[0]
    });
  }, [formData.provincial_producers]);
  
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
                  <div className="text-sm text-gray-600">Certified Price Difference</div>
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
        <p className="text-gray-600 text-sm">Use AI-powered tools to create comprehensive market commentary, insights, and analysis for this auction period.</p>
      </div>
      
      <AIMarketInsightsComposer 
        value={formData.insights || ''} 
        onChange={(value) => updateFormData({ insights: value })}
        auctionData={formData}
      />
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
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
  const [showDraftConfirmation, setShowDraftConfirmation] = useState(false);
  const [hasBeenSavedAsDraft, setHasBeenSavedAsDraft] = useState(false);

  // Comprehensive data completeness checker for all form tabs
  const calculateCompletion = () => {
    const tabCompleteness = {
      'Auction Details': {
        icon: '📅',
        completed: 0,
        total: 4,
        fields: [
          { name: 'Auction Date', completed: !!formData.auction.auction_date },
          { name: 'Catalogue Name', completed: !!formData.auction.catalogue_name },
          { name: 'Season', completed: !!formData.auction.season_id },
          { name: 'Commodity', completed: !!formData.auction.commodity_type_id }
        ]
      },
      'Market Summary': {
        icon: '📊',
        completed: 0,
        total: 6,
        fields: [
          { name: 'Offered Bales', completed: !!(formData.supply_stats?.offered_bales > 0) },
          { name: 'Sold Bales', completed: !!(formData.supply_stats?.sold_bales > 0) },
          { name: 'Clearance Rate', completed: !!(formData.supply_stats?.clearance_rate_pct > 0) },
          { name: 'Highest Price', completed: !!(formData.highest_price?.price_cents_clean > 0) },
          { name: 'Certified Share', completed: !!(formData.certified_share?.all_wool_pct_sold > 0) },
          { name: 'Greasy Stats', completed: !!(formData.greasy_stats?.turnover_rand > 0) }
        ]
      },
      'Key Indicators': {
        icon: '📈',
        completed: 0,
        total: 4,
        fields: [
          { name: 'SA Merino Indicator', completed: !!(formData.market_indices?.merino_indicator_sa_cents_clean > 0) },
          { name: 'SA Certified Indicator', completed: !!(formData.market_indices?.certified_indicator_sa_cents_clean > 0) },
          { name: 'US Merino Indicator', completed: !!(formData.market_indices?.merino_indicator_us_cents_clean > 0) },
          { name: 'Euro Merino Indicator', completed: !!(formData.market_indices?.merino_indicator_euro_cents_clean > 0) }
        ]
      },
      'Exchange Rates': {
        icon: '💱',
        completed: 0,
        total: 5,
        fields: [
          { name: 'ZAR/USD', completed: !!(formData.currency_fx?.ZAR_USD > 0) },
          { name: 'ZAR/EUR', completed: !!(formData.currency_fx?.ZAR_EUR > 0) },
          { name: 'ZAR/JPY', completed: !!(formData.currency_fx?.ZAR_JPY > 0) },
          { name: 'ZAR/GBP', completed: !!(formData.currency_fx?.ZAR_GBP > 0) },
          { name: 'USD/AUD', completed: !!(formData.currency_fx?.USD_AUD > 0) }
        ]
      },
      'Micron Prices': {
        icon: '💰',
        completed: 0,
        total: 1,
        fields: [
          { name: 'Price Data', completed: !!(formData.micron_price_comparison?.rows && formData.micron_price_comparison.rows.length > 0) }
        ]
      },
      'Buyers & Brokers': {
        icon: '👥',
        completed: 0,
        total: 2,
        fields: [
          { name: 'Buyers', completed: formData.buyers.length > 0 },
          { name: 'Brokers', completed: formData.brokers.length > 0 }
        ]
      },
      'Provincial Data': {
        icon: '🗺️',
        completed: 0,
        total: 1,
        fields: [
          { name: 'Producer Data', completed: formData.provincial_producers.length > 0 }
        ]
      },
      'Company Data': {
        icon: '🏢',
        completed: 0,
        total: 1,
        fields: [
          { name: 'Producer Data', completed: formData.provincial_producers.length > 0 }
        ]
      },
      'Market Insights': {
        icon: '💡',
        completed: 0,
        total: 1,
        fields: [
          { name: 'Insights Text', completed: !!(formData.insights && formData.insights.length > 50) }
        ]
      }
    };

    // Calculate completion for each tab
    Object.keys(tabCompleteness).forEach(tabName => {
      const tab = tabCompleteness[tabName as keyof typeof tabCompleteness];
      tab.completed = tab.fields.filter(field => field.completed).length;
    });

    // Calculate overall completion
    const totalCompleted = Object.values(tabCompleteness).reduce((sum, tab) => sum + tab.completed, 0);
    const totalFields = Object.values(tabCompleteness).reduce((sum, tab) => sum + tab.total, 0);

    return {
      completed: totalCompleted,
      total: totalFields,
      percentage: Math.round((totalCompleted / totalFields) * 100),
      tabCompleteness
    };
  };

  const completionData = calculateCompletion();
  
  // Get missing required fields
  const getMissingFields = () => {
    const missing = [];
    const tabCompleteness = completionData.tabCompleteness;
    
    // Check each tab for missing required fields
    Object.entries(tabCompleteness).forEach(([tabName, tab]) => {
      tab.fields.forEach(field => {
        if (!field.completed) {
          missing.push(`${tabName}: ${field.name}`);
        }
      });
    });
    
    return missing;
  };

  const missingFields = getMissingFields();
  const canPublish = missingFields.length === 0 && hasBeenSavedAsDraft;
  
  // Debug logging to see what's being checked
  console.log('🔍 Data Completeness Debug:', {
    tabCompleteness: completionData.tabCompleteness,
    totalCompleted: completionData.completed,
    totalFields: completionData.total,
    percentage: completionData.percentage,
    hasBeenSavedAsDraft,
    canPublish: missingFields.length === 0 && hasBeenSavedAsDraft
  });

  const handlePublishClick = () => {
    if (canPublish) {
      setShowPublishConfirmation(true);
    }
  };

  const handleDraftClick = () => {
    setShowDraftConfirmation(true);
  };

  const confirmPublish = async () => {
    setShowPublishConfirmation(false);
    setIsSaving(true);
    
    try {
      // Set status to published and add published timestamp
      const publishedData = {
        ...formData,
        status: 'published' as const,
        published_at: new Date().toISOString()
      };
      
      const result = await SupabaseService.saveAuctionReport(publishedData);
      
      if (result.success) {
        // Show success modal for published report
        showSuccessModal('Report Published Successfully!', 'Your auction report has been finalized and published. It is now live and visible to users.');
        
        // Update the form data to reflect published status
        updateFormData({ 
          status: 'published',
          published_at: new Date().toISOString()
        });
        
        // Call the parent save handler
        onSave(publishedData);
      } else {
        alert(`Failed to publish report: ${result.error}`);
      }
    } catch (error) {
      console.error('Error publishing auction report:', error);
      alert('Failed to publish report. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDraft = () => {
    setShowDraftConfirmation(false);
    setHasBeenSavedAsDraft(true);
    onSaveDraft(); // This will save as draft
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Auction Report Review</h2>
        <p className="text-gray-600">Review your comprehensive auction data before finalizing the report</p>
        
        {/* Status and Progress */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${
                  completionData.percentage >= 90 ? 'bg-green-500' : 
                  completionData.percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-lg font-semibold text-gray-700">
                  {completionData.percentage}% Complete
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {formData.auction.auction_date ? 
                  new Date(formData.auction.auction_date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'No date set'
                }
              </div>
            </div>
            
            {/* Report Status Badge */}
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                formData.status === 'published' ? 'bg-green-100 text-green-800' :
                formData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {formData.status === 'published' ? 'Published' :
                 formData.status === 'draft' ? 'Draft' : 'New'}
              </span>
              {formData.status === 'published' && formData.published_at && (
                <span className="text-xs text-gray-500">
                  Published {new Date(formData.published_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                completionData.percentage >= 90 ? 'bg-green-500' :
                completionData.percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${completionData.percentage}%` }}
            ></div>
          </div>
          
          {/* Missing Fields Alert */}
          {missingFields.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Missing Required Fields:</p>
                  <p className="text-sm text-red-600">{missingFields.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Enhanced Data Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Data Completeness Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              📊
            </span>
            Data Completeness
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Buyers</span>
              <span className="text-sm font-semibold">{formData.buyers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Brokers</span>
              <span className="text-sm font-semibold">{formData.brokers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Provinces</span>
              <span className="text-sm font-semibold">{formData.provincial_producers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Micron Prices</span>
              <span className="text-sm font-semibold">
                {formData.micron_prices.filter(p => p.price_clean_zar_per_kg > 0).length}/{formData.micron_prices.length}
              </span>
            </div>
          </div>
        </div>

        {/* Report Summary Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              📋
            </span>
            Report Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Season</span>
              <span className="text-sm font-semibold">{formData.auction.season_label || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Catalogue</span>
              <span className="text-sm font-semibold">{formData.auction.catalogue_name || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sale Number</span>
              <span className="text-sm font-semibold">{formData.auction.sale_number || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Auction Center</span>
              <span className="text-sm font-semibold">{formData.auction.auction_center || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Market Performance Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              📈
            </span>
            Market Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Merino Indicator</span>
              <span className="text-sm font-semibold">
                {formData.market_indices?.merino_indicator_sa_cents_clean ? `${formData.market_indices.merino_indicator_sa_cents_clean} cents` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Certified Indicator</span>
              <span className="text-sm font-semibold">
                {formData.market_indices?.certified_indicator_sa_cents_clean ? `${formData.market_indices.certified_indicator_sa_cents_clean} cents` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">AWEX EMI</span>
              <span className="text-sm font-semibold">
                {formData.market_indices?.awex_emi_sa_cents_clean ? `${formData.market_indices.awex_emi_sa_cents_clean} cents` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Currency Exchange Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              💱
            </span>
            Currency Exchange
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ZAR/USD</span>
              <span className="text-sm font-semibold">
                {formData.currency_fx?.ZAR_USD ? getNumericValue(formData.currency_fx.ZAR_USD).toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ZAR/EUR</span>
              <span className="text-sm font-semibold">
                {formData.currency_fx?.ZAR_EUR ? getNumericValue(formData.currency_fx.ZAR_EUR).toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ZAR/JPY</span>
              <span className="text-sm font-semibold">
                {formData.currency_fx?.ZAR_JPY ? getNumericValue(formData.currency_fx.ZAR_JPY).toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ZAR/GBP</span>
              <span className="text-sm font-semibold">
                {formData.currency_fx?.ZAR_GBP ? getNumericValue(formData.currency_fx.ZAR_GBP).toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">USD/AUD</span>
              <span className="text-sm font-semibold">
                {formData.currency_fx?.USD_AUD ? getNumericValue(formData.currency_fx.USD_AUD).toFixed(4) : 'N/A'}
              </span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {(formData.indicators.find(i => i.type === 'total_lots')?.value || formData.greasy_stats?.bales || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Lots</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {(formData.indicators.find(i => i.type === 'total_volume')?.value || (formData.greasy_stats?.mass_kg || 0) / 1000 || 0).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Volume (MT)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  ZAR {(formData.indicators.find(i => i.type === 'total_value')?.value || (formData.greasy_stats?.turnover_rand || 0) / 1000000 || 0).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
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
                    <span className="text-sm text-gray-600">Merino Indicator (SA)</span>
                    <span className="font-semibold">
                      {formData.market_indices?.merino_indicator_sa_cents_clean ? 
                        `${formData.market_indices.merino_indicator_sa_cents_clean} cents` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Certified Indicator (SA)</span>
                    <span className="font-semibold">
                      {formData.market_indices?.certified_indicator_sa_cents_clean ? 
                        `${formData.market_indices.certified_indicator_sa_cents_clean} cents` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">AWEX EMI (SA)</span>
                    <span className="font-semibold">
                      {formData.market_indices?.awex_emi_sa_cents_clean ? 
                        `${formData.market_indices.awex_emi_sa_cents_clean} cents` : 'N/A'}
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
                      {formData.currency_fx?.ZAR_USD ? getNumericValue(formData.currency_fx.ZAR_USD).toFixed(2) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">ZAR/Euro</span>
                    <span className="font-semibold">
                      {formData.currency_fx?.ZAR_EUR ? getNumericValue(formData.currency_fx.ZAR_EUR).toFixed(2) : 'N/A'}
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
              
              {/* Overall Auction Highest Price */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="text-center mb-2">
                  <div className="text-sm font-medium text-gray-700">Overall Auction</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      R{(formData.highest_price.price_cents_clean / 100).toFixed(2)}
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

              {/* Top 10 Producer Performance Highest Price */}
              {formData.provincial_producers && formData.provincial_producers.length > 0 && (() => {
                // Get all producers from all provinces
                const allProducers = formData.provincial_producers.flatMap(province => province.producers);
                
                if (allProducers.length === 0) return null;
                
                // Find the highest price producer
                const highestPriceProducer = allProducers.reduce((highest, current) => 
                  current.price > highest.price ? current : highest
                );
                
                return (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-center mb-2">
                      <div className="text-sm font-medium text-gray-700">OVK Top Performer</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          R{highestPriceProducer.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">per kg greasy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-700">
                          {highestPriceProducer.micron}μ
                        </div>
                        <div className="text-sm text-gray-600">micron</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-700">
                          {highestPriceProducer.no_bales}
                        </div>
                        <div className="text-sm text-gray-600">bales</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                {formData.micron_prices
                  .filter(p => p.price_clean_zar_per_kg > 0)
                  .filter(p => ['17', '17.5', '18', '18.5', '19', '19.5', '20', '20.5', '21', '21.5', '22'].includes(p.bucket_micron))
                  .sort((a, b) => parseFloat(a.bucket_micron) - parseFloat(b.bucket_micron))
                  .map((price, index) => (
                  <div key={price.bucket_micron} className="p-2 bg-gray-50 rounded border">
                    <div className="font-semibold text-gray-900 mb-1 text-center text-xs">{price.bucket_micron}</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category:</span>
                        <span className="font-medium text-xs">{price.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Non-Certified:</span>
                        <span className="font-medium text-blue-600 text-xs">R{price.price_clean_zar_per_kg.toFixed(2)}</span>
                      </div>
                      {price.certified_price_clean_zar_per_kg && price.certified_price_clean_zar_per_kg > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Certified:</span>
                          <span className="font-medium text-green-600 text-xs">R{price.certified_price_clean_zar_per_kg.toFixed(2)}</span>
                        </div>
                      )}
                      {price.all_merino_price_clean_zar_per_kg && price.all_merino_price_clean_zar_per_kg > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">All Merino:</span>
                          <span className="font-medium text-purple-600 text-xs">R{price.all_merino_price_clean_zar_per_kg.toFixed(2)}</span>
                        </div>
                      )}
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
                {formData.provincial_producers.slice(0, 6).map((province, index) => {
                  // Calculate averages for this province
                  const certifiedProducers = province.producers.filter(p => p.certified === 'RWS' && p.price > 0);
                  const nonCertifiedProducers = province.producers.filter(p => p.certified !== 'RWS' && p.price > 0);
                  
                  const avgCertifiedPrice = certifiedProducers.length > 0 
                    ? certifiedProducers.reduce((sum, p) => sum + p.price, 0) / certifiedProducers.length 
                    : 0;
                  
                  const avgNonCertifiedPrice = nonCertifiedProducers.length > 0 
                    ? nonCertifiedProducers.reduce((sum, p) => sum + p.price, 0) / nonCertifiedProducers.length 
                    : 0;

                  return (
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
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Certified:</span>
                          <span className="font-medium text-green-600">
                            {avgCertifiedPrice > 0 ? `R${avgCertifiedPrice.toFixed(2)}` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Non-Certified:</span>
                          <span className="font-medium text-blue-600">
                            {avgNonCertifiedPrice > 0 ? `R${avgNonCertifiedPrice.toFixed(2)}` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
            </div>
          </div>

          {/* Data Completeness */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Data Completeness</h3>
            <div className="space-y-3">
              {Object.entries(completionData.tabCompleteness).map(([tabName, tab]) => (
                <div key={tabName} className="p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{tab.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{tabName}</span>
                    </div>
                    <span className={`text-sm font-medium ${tab.completed === tab.total ? 'text-green-600' : 'text-orange-600'}`}>
                      {tab.completed}/{tab.total}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {tab.fields.map((field, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{field.name}</span>
                        <span className={field.completed ? 'text-green-600' : 'text-red-600'}>
                          {field.completed ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
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
              {/* Save as Draft Button */}
              <button
                onClick={handleDraftClick}
                disabled={isSaving}
                className="w-full px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors border border-yellow-300"
              >
                {isSaving ? 'Saving...' : '💾 Save as Draft'}
              </button>
              
              {/* Finalize/Publish Button */}
              <button
                onClick={handlePublishClick}
                disabled={isSaving || (!canPublish && formData.status !== 'published')}
                className={`w-full px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors ${
                  (canPublish || formData.status === 'published')
                    ? 'bg-green-600 text-white hover:bg-green-700 border border-green-600' 
                    : 'bg-gray-300 text-gray-500 border border-gray-300'
                }`}
              >
                {isSaving ? 'Publishing...' : 
                 formData.status === 'published' ? '✅ Update Published Report' : 
                 '🚀 Finalize & Publish Report'}
              </button>
              
              {/* Cancel Button */}
              <button
                onClick={onCancel}
                className="w-full px-4 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
            
            {/* Enhanced Status Messages */}
            {!canPublish && missingFields.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 font-medium mb-1">
                  Cannot publish: {missingFields.length} required field(s) missing
                </p>
                <p className="text-xs text-red-600">
                  Complete all required fields and save as draft to publish the report.
                </p>
              </div>
            )}
            
            {!canPublish && missingFields.length === 0 && !hasBeenSavedAsDraft && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700">
                  ⚠️ All data is complete, but you must save as draft first before publishing.
                </p>
              </div>
            )}
            
            {canPublish && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700">
                  ✅ Report is ready for publication! All required fields are complete and draft has been saved.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {/* Publish Confirmation Modal */}
      {showPublishConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Publish Report</h3>
                  <p className="text-sm text-gray-600">This will make the report visible to the public</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Report Summary:</strong><br/>
                  Auction: {formData.auction.auction_date ? new Date(formData.auction.auction_date).toLocaleDateString() : 'No date'}<br/>
                  Catalogue: {formData.auction.catalogue_name || 'N/A'}<br/>
                  Status: {completionData.percentage}% complete
                </p>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to publish this auction report? Once published, it will be visible to all users on the public dashboard.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPublishConfirmation(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPublish}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                >
                  Yes, Publish Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Draft Confirmation Modal */}
      {showDraftConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Save as Draft</h3>
                  <p className="text-sm text-gray-600">Save your progress and continue later</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Draft Details:</strong><br/>
                  Auction: {formData.auction.auction_date ? new Date(formData.auction.auction_date).toLocaleDateString() : 'No date'}<br/>
                  Catalogue: {formData.auction.catalogue_name || 'N/A'}<br/>
                  Progress: {completionData.percentage}% complete
                </p>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Save this report as a draft? You can continue editing it later and publish when ready.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDraftConfirmation(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDraft}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium transition-colors"
                >
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDataCaptureForm;


