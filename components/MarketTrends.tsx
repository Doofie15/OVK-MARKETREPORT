import React, { createContext, useContext, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import type { TrendData, TrendPoint } from '../types';

// Context for synchronized tooltips across charts
interface SyncedTooltipContextType {
  hoveredDataPoint: number | null;
  setHoveredDataPoint: (index: number | null) => void;
}

const SyncedTooltipContext = createContext<SyncedTooltipContextType | null>(null);

const useSyncedTooltip = () => {
  const context = useContext(SyncedTooltipContext);
  if (!context) {
    throw new Error('useSyncedTooltip must be used within a SyncedTooltipProvider');
  }
  return context;
};

interface MarketTrendsProps {
  data: TrendData;
}

const ModernTrendChart: React.FC<{ 
  title: string; 
  data: TrendPoint[]; 
  currency: 'ZAR' | 'USD';
  type: 'CERTIFIED' | 'ALL-MERINO';
}> = ({ title, data, currency, type }) => {
  const { hoveredDataPoint, setHoveredDataPoint } = useSyncedTooltip();
  const isZAR = currency === 'ZAR';
  const isCertified = type === 'CERTIFIED';
  
  // Dynamically determine the years from the data
  const getYearsFromData = (data: TrendPoint[]) => {
    if (!data || data.length === 0) return { currentSeason: '2025/2026', previousSeason: '2024/2025' };
    
    const firstPoint = data[0];
    const keys = Object.keys(firstPoint);
    
    // Find year keys (format: YYYY_zar or YYYY_usd)
    const yearKeys = keys.filter(key => /^\d{4}_(zar|usd)$/.test(key));
    const years = yearKeys.map(key => parseInt(key.split('_')[0])).filter((year, index, arr) => arr.indexOf(year) === index);
    years.sort((a, b) => b - a); // Sort descending
    
    const currentYear = years[0] || 2025;
    const previousYear = years[1] || 2024;
    
    return {
      currentSeason: `${currentYear}/${currentYear + 1}`,
      previousSeason: `${previousYear}/${previousYear + 1}`,
      currentYear,
      previousYear
    };
  };
  
  const { currentSeason, previousSeason, currentYear, previousYear } = getYearsFromData(data);
  const dataKeyCurrent = isZAR ? `${currentYear}_zar` : `${currentYear}_usd`;
  const dataKeyPrevious = isZAR ? `${previousYear}_zar` : `${previousYear}_usd`;

  // Handle empty or undefined data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No trend data available</p>
        </div>
      </div>
    );
  }
  
  // Use specific colors for different chart types
  const isAWEX = title.includes('AWEX');
  const isExchangeRate = title.includes('EXCHANGE RATE');
  
  let primaryColor, secondaryColor;
  
  if (isAWEX) {
    // Australian colors
    primaryColor = '#00843D'; // Australian green
    secondaryColor = '#FFD700'; // Australian gold
  } else if (isExchangeRate) {
    // South Africa (green) and USA (blue) colors
    primaryColor = '#007A4D'; // South African green
    secondaryColor = '#002868'; // USA blue
  } else {
    // Default colors
    primaryColor = isCertified ? '#1e40af' : '#10b981';
    secondaryColor = isCertified ? '#3b82f6' : '#34d399';
  }

  // Create chart series only for available data
  const chartSeries = [];
  
  // Helper function to clean period labels - remove CG/CF prefixes and show just numbers
  const cleanPeriodLabel = (period: string) => {
    // Remove prefixes like CG, CF, C, P and return just the number
    const match = period.match(/[A-Z]*(\d+)/);
    return match ? match[1] : period;
  };

  // Add current year series if data exists (filter out zero values)
  const hasCurrentData = data.some(point => point[dataKeyCurrent] !== undefined && point[dataKeyCurrent] !== null && point[dataKeyCurrent] > 0);
  if (hasCurrentData) {
    chartSeries.push({
      name: `${currentSeason} ${currency}`,
      data: data
        .filter(point => point[dataKeyCurrent] && point[dataKeyCurrent] > 0)
        .map(point => ({
          x: cleanPeriodLabel(point.period),
          y: point[dataKeyCurrent]
        }))
    });
  }
  
  // Add previous year series if data exists (filter out zero values)
  const hasPreviousData = data.some(point => point[dataKeyPrevious] !== undefined && point[dataKeyPrevious] !== null && point[dataKeyPrevious] > 0);
  if (hasPreviousData) {
    chartSeries.push({
      name: `${previousSeason} ${currency}`,
      data: data
        .filter(point => point[dataKeyPrevious] && point[dataKeyPrevious] > 0)
        .map(point => ({
          x: cleanPeriodLabel(point.period),
          y: point[dataKeyPrevious]
        }))
    });
  }
  
  // If no data available, show a single point
  if (chartSeries.length === 0) {
    chartSeries.push({
      name: data[0]?.auction_catalogue || `Current ${currency}`,
      data: data.map(point => ({
        x: cleanPeriodLabel(point.period),
        y: 0
      }))
    });
  }

  const options: ApexOptions = {
    theme: { mode: 'light' },
    chart: {
      type: 'line',
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 },
      zoom: { enabled: false },
      selection: { enabled: false },
      events: {
        mouseMove: (event, chartContext, config) => {
          if (config.dataPointIndex !== undefined && config.dataPointIndex !== -1) {
            setHoveredDataPoint(config.dataPointIndex);
          }
        },
        mouseLeave: () => {
          setHoveredDataPoint(null);
        }
      }
    },
    colors: [primaryColor, secondaryColor],
    stroke: {
      curve: 'smooth',
      width: [2, 2],
      lineCap: 'round'
    },
    markers: {
      size: [4, 3],
      colors: [primaryColor, secondaryColor],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: { size: 6 }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 2,
      xaxis: { lines: { show: true }},
      yaxis: { lines: { show: true }},
      padding: { top: 0, right: 10, bottom: 0, left: 10 }
    },
    xaxis: {
      labels: {
        style: { colors: '#64748b', fontSize: '10px', fontWeight: 400 }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      title: {
        text: currency,
        style: { color: '#475569', fontSize: '12px', fontWeight: 500 }
      },
      labels: {
        style: { colors: '#64748b', fontSize: '10px', fontWeight: 400 },
        formatter: (value) => value.toFixed(0)
      }
    },
    tooltip: {
      theme: 'light',
      shared: true,
      intersect: false,
      style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        // Use synchronized data point if available, otherwise use current
        const syncedIndex = hoveredDataPoint !== null ? hoveredDataPoint : dataPointIndex;
        
        // Return empty if no valid index
        if (syncedIndex === null || syncedIndex === undefined || syncedIndex === -1) {
          return '';
        }
        
        const period = w.globals.labels[syncedIndex];
        
        // Get values for both series at this data point
        let currentValue = null;
        let previousValue = null;
        let currentLabel = '';
        let previousLabel = '';
        
        // Find current and previous year values
        series.forEach((serie, index) => {
          const seriesName = w.globals.seriesNames[index];
          const value = serie[syncedIndex];
          
          if (seriesName.includes(currentSeason)) {
            currentValue = value;
            currentLabel = seriesName;
          } else if (seriesName.includes(previousSeason)) {
            previousValue = value;
            previousLabel = seriesName;
          }
        });
        
        // Calculate difference and percentage
        const difference = currentValue && previousValue ? currentValue - previousValue : 0;
        const percentage = previousValue && previousValue !== 0 ? ((difference / previousValue) * 100) : 0;
        const isPositive = difference >= 0;
        
        return `
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); min-width: 200px;">
            <div style="color: #1e293b; font-weight: 600; margin-bottom: 8px; font-size: 13px;">
              ${title} - Period ${period}
            </div>
            ${currentValue !== null ? `
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <div style="width: 8px; height: 8px; background: ${primaryColor}; border-radius: 50%; margin-right: 8px;"></div>
                <span style="color: #64748b; font-size: 11px; margin-right: 8px;">${currentLabel}:</span>
                <span style="color: ${primaryColor}; font-weight: 600; font-size: 12px;">${currentValue.toFixed(2)} ${currency}</span>
              </div>
            ` : ''}
            ${previousValue !== null ? `
              <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <div style="width: 8px; height: 8px; background: ${secondaryColor}; border-radius: 50%; margin-right: 8px;"></div>
                <span style="color: #64748b; font-size: 11px; margin-right: 8px;">${previousLabel}:</span>
                <span style="color: ${secondaryColor}; font-weight: 600; font-size: 12px;">${previousValue.toFixed(2)} ${currency}</span>
              </div>
            ` : ''}
            ${currentValue !== null && previousValue !== null ? `
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 10px;">Change:</span>
                <span style="color: ${isPositive ? '#10b981' : '#ef4444'}; font-weight: 600; font-size: 11px; margin-left: 4px;">
                  ${isPositive ? '+' : ''}${difference.toFixed(2)} ${currency} (${isPositive ? '+' : ''}${percentage.toFixed(1)}%)
                </span>
              </div>
            ` : ''}
          </div>
        `;
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '10px',
      fontWeight: 500,
      labels: { colors: '#475569' },
      markers: { size: 3 }
    },
    dataLabels: { enabled: false }
  };

  // Calculate current values for display
  const currentValue = data.length > 0 ? data[data.length - 1][dataKeyCurrent] : 0;
  const previousValue = data.length > 0 ? data[data.length - 1][dataKeyPrevious] : 0;

  return (
    <div className="chart-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
            isCertified 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
              : 'bg-gradient-to-br from-indigo-500 to-indigo-600'
          }`}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              2-year comparison
            </p>
          </div>
        </div>
        
        <div className="text-left sm:text-right">
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Current {currentYear}</div>
          <div className="text-sm font-bold" style={{ color: primaryColor }}>
            {(currentValue || 0).toFixed(2)} {currency}
          </div>
        </div>
      </div>
      
      <Chart
        options={options}
        series={chartSeries}
        type="line"
        height={window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 240 : 280}
      />
    </div>
  );
};

const MarketTrendsWithProvider: React.FC<MarketTrendsProps> = ({ data }) => {
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);

  return (
    <SyncedTooltipContext.Provider value={{ hoveredDataPoint, setHoveredDataPoint }}>
      <MarketTrendsContent data={data} />
    </SyncedTooltipContext.Provider>
  );
};

const MarketTrendsContent: React.FC<MarketTrendsProps> = ({ data }) => {
  // Handle empty or undefined data
  if (!data || (!data.rws && !data.non_rws && !data.awex)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className="text-sm font-bold gradient-text">2 YEAR MARKET TRENDS</h2>
        </div>
        <div className="card p-6">
          <p className="text-gray-500 text-center">No trend data available for this auction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h2 className="text-sm font-bold gradient-text">2 YEAR MARKET TRENDS</h2>
      </div>

      {/* All 4 Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <ModernTrendChart title="CERTIFIED WOOL 2 YEAR TREND" data={data.rws || []} currency="ZAR" type="CERTIFIED" />
        <ModernTrendChart title="ALL MERINO 2 YEAR TREND" data={data.non_rws || []} currency="ZAR" type="ALL-MERINO" />
        <ModernTrendChart title="EXCHANGE RATE 2 YEAR TREND" data={data.exchange_rates || []} currency="USD" type="CERTIFIED" />
        <ModernTrendChart title="AWEX 2 YEAR TREND" data={data.awex || []} currency="USD" type="ALL-MERINO" />
      </div>
    </div>
  );
};

// Export the wrapped component
const MarketTrends = MarketTrendsWithProvider;

export default MarketTrends;