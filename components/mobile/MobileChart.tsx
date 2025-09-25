import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface MobileChartProps {
  title: string;
  subtitle?: string;
  data: any[];
  type: 'line' | 'bar' | 'area';
  colors?: string[];
  height?: number;
  currency?: string;
  showLegend?: boolean;
  compact?: boolean;
  syncedTooltipContext?: {
    hoveredDataPoint: number | null;
    setHoveredDataPoint: (index: number | null) => void;
  };
}

const MobileChart: React.FC<MobileChartProps> = ({
  title,
  subtitle,
  data,
  type,
  colors = ['#1e40af', '#10b981'],
  height = 320,
  currency,
  showLegend = true,
  compact = false,
  syncedTooltipContext
}) => {
  const options: ApexOptions = {
    theme: { mode: 'light' },
    chart: {
      type,
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
      zoom: { enabled: false },
      selection: { enabled: false },
      events: syncedTooltipContext ? {
        mouseMove: (event, chartContext, config) => {
          if (config.dataPointIndex !== undefined && config.dataPointIndex !== -1) {
            syncedTooltipContext.setHoveredDataPoint(config.dataPointIndex);
          }
        },
        mouseLeave: () => {
          syncedTooltipContext.setHoveredDataPoint(null);
        }
      } : undefined
    },
    colors,
    stroke: type === 'line' ? {
      curve: 'smooth',
      width: 2
    } : {
      width: 0
    },
    markers: type === 'line' ? {
      size: 4,
      hover: { size: 6 }
    } : {
      size: 0
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 2,
      xaxis: { lines: { show: true }},
      yaxis: { lines: { show: true }},
      padding: { top: -5, right: 5, bottom: 0, left: 5 }
    },
    xaxis: {
      labels: {
        style: { 
          colors: '#64748b', 
          fontSize: '10px', 
          fontWeight: 400 
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      title: currency ? {
        text: currency,
        style: { color: '#475569', fontSize: '14px', fontWeight: 500 }
      } : undefined,
      labels: {
        style: { 
          colors: '#64748b', 
          fontSize: '10px', 
          fontWeight: 400 
        },
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
        const syncedIndex = syncedTooltipContext?.hoveredDataPoint !== null && syncedTooltipContext?.hoveredDataPoint !== undefined 
          ? syncedTooltipContext.hoveredDataPoint 
          : dataPointIndex;
        
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
          
          if (seriesName.includes('2025/2026')) {
            currentValue = value;
            currentLabel = seriesName;
          } else if (seriesName.includes('2024/2025')) {
            previousValue = value;
            previousLabel = seriesName;
          }
        });
        
        // Calculate difference and percentage
        const difference = currentValue && previousValue ? currentValue - previousValue : 0;
        const percentage = previousValue && previousValue !== 0 ? ((difference / previousValue) * 100) : 0;
        const isPositive = difference >= 0;
        
        return `
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); min-width: 180px;">
            <div style="color: #1e293b; font-weight: 600; margin-bottom: 6px; font-size: 12px;">
              Period ${period}
            </div>
            ${currentValue !== null ? `
              <div style="display: flex; align-items: center; margin-bottom: 3px;">
                <div style="width: 6px; height: 6px; background: ${colors[0]}; border-radius: 50%; margin-right: 6px;"></div>
                <span style="color: #64748b; font-size: 10px; margin-right: 6px;">${currentLabel}:</span>
                <span style="color: ${colors[0]}; font-weight: 600; font-size: 11px;">${currentValue.toFixed(2)} ${currency || ''}</span>
              </div>
            ` : ''}
            ${previousValue !== null ? `
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <div style="width: 6px; height: 6px; background: ${colors[1] || colors[0]}; border-radius: 50%; margin-right: 6px;"></div>
                <span style="color: #64748b; font-size: 10px; margin-right: 6px;">${previousLabel}:</span>
                <span style="color: ${colors[1] || colors[0]}; font-weight: 600; font-size: 11px;">${previousValue.toFixed(2)} ${currency || ''}</span>
              </div>
            ` : ''}
            ${currentValue !== null && previousValue !== null ? `
              <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 9px;">Change:</span>
                <span style="color: ${isPositive ? '#10b981' : '#ef4444'}; font-weight: 600; font-size: 10px; margin-left: 4px;">
                  ${isPositive ? '+' : ''}${difference.toFixed(2)} ${currency || ''} (${isPositive ? '+' : ''}${percentage.toFixed(1)}%)
                </span>
              </div>
            ` : ''}
          </div>
        `;
      }
    },
    legend: showLegend ? {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '10px',
      fontWeight: 500,
      labels: { colors: '#475569' },
      markers: { size: 3 },
      itemMargin: {
        horizontal: 8,
        vertical: 0
      }
    } : { show: false },
    dataLabels: { enabled: false }
  };

  return (
    <div className="chart-container">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      <Chart
        options={options}
        series={data}
        type={type}
        height={height}
      />
    </div>
  );
};

export default MobileChart;