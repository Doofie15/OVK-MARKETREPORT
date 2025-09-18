import React, { useState, useEffect } from 'react';
import { SeasonService } from '../../data/service';
import type { CreateSeasonData } from '../../types';

interface CreateSeasonProps {
  onBack: () => void;
  onSeasonCreated: () => void;
  editingSeason?: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    year: string;
  } | null;
}

const CreateSeason: React.FC<CreateSeasonProps> = ({ 
  onBack, 
  onSeasonCreated, 
  editingSeason 
}) => {
  // Helper function to generate default dates (July 1st to June 30th next year)
  const getDefaultDates = () => {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-07-01`;
    const endDate = `${currentYear + 1}-06-30`;
    return { startDate, endDate };
  };

  // Helper function to generate year from dates
  const generateYearFromDates = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    
    return `${startYear}/${endYear}`;
  };

  const defaultDates = getDefaultDates();
  
  const [formData, setFormData] = useState<CreateSeasonData>(() => {
    const startDate = editingSeason?.start_date || defaultDates.startDate;
    const endDate = editingSeason?.end_date || defaultDates.endDate;
    const year = editingSeason?.year || generateYearFromDates(startDate, endDate);
    
    return {
      name: editingSeason?.name || year, // Use year as name if no existing name
      start_date: startDate,
      end_date: endDate,
      year: year
    };
  });
  
  const [errors, setErrors] = useState<Partial<CreateSeasonData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-update year and name when dates change
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const generatedYear = generateYearFromDates(formData.start_date, formData.end_date);
      if (generatedYear && generatedYear !== formData.year) {
        setFormData(prev => ({ 
          ...prev, 
          year: generatedYear,
          name: generatedYear // Use year as the season name
        }));
      }
    }
  }, [formData.start_date, formData.end_date]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateSeasonData> = {};

    // Season name is auto-generated from year, so no validation needed

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (startDate >= endDate) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    // Year is auto-generated from dates, so no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateSeasonData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-generate year and name when dates change
      if (field === 'start_date' || field === 'end_date') {
        if (newData.start_date && newData.end_date) {
          const generatedYear = generateYearFromDates(newData.start_date, newData.end_date);
          newData.year = generatedYear;
          newData.name = generatedYear; // Use year as the season name
        }
      }
      
      return newData;
    });
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingSeason) {
        await SeasonService.updateSeason(editingSeason.id, formData);
      } else {
        await SeasonService.createSeason(formData);
      }
      
      onSeasonCreated();
    } catch (err) {
      setError(editingSeason ? 'Failed to update season' : 'Failed to create season');
      console.error('Error saving season:', err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {editingSeason ? 'Edit Season' : 'Create New Season'}
          </h1>
          <p className="text-gray-600">
            {editingSeason ? 'Update season information' : 'Set up a new auction season with its time period and details'}
          </p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Seasons
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

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Auto-generated Year Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Season Year (Auto-generated)
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
              {formData.year || 'Will be generated from dates'}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              The season year is automatically generated from the start and end dates
            </p>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="start_date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.start_date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                id="end_date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.end_date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Quick Date Setup */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Setup</h4>
            <p className="text-sm text-blue-700 mb-3">Set typical season dates (July 1st to June 30th next year):</p>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const currentYear = new Date().getFullYear();
                const suggestions = [];
                for (let i = -1; i <= 2; i++) {
                  const year = currentYear + i;
                  suggestions.push({
                    label: `${year}/${year + 1}`,
                    startDate: `${year}-07-01`,
                    endDate: `${year + 1}-06-30`
                  });
                }
                return suggestions;
              })().map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      start_date: suggestion.startDate,
                      end_date: suggestion.endDate,
                      year: suggestion.label,
                      name: suggestion.label // Use year as season name
                    }));
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>

          {/* Season Duration Info */}
          {formData.start_date && formData.end_date && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800">Season Duration</p>
                  <p className="text-sm text-blue-600">
                    {(() => {
                      const start = new Date(formData.start_date);
                      const end = new Date(formData.end_date);
                      const diffTime = Math.abs(end.getTime() - start.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return `${diffDays} days (${Math.round(diffDays / 30.44)} months)`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {editingSeason ? 'Update Season' : 'Create Season'}
            </button>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Season Guidelines</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Season name is automatically generated from the season year (YYYY/YYYY format)</li>
          <li>• Season year is automatically generated from start and end dates</li>
          <li>• Start date is typically July 1st, end date is typically June 30th of the next year</li>
          <li>• Start and end dates define the auction period for this season</li>
          <li>• The number of auctions will be automatically calculated based on auction dates within this period</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateSeason;
