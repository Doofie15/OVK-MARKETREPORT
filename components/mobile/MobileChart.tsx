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
}

const MobileChart: React.FC<MobileChartProps> = ({
  title,
  subtitle,
  data,
  type,
  colors = ['#1e40af', '#10b981'],
  height = 280,
  currency,
  showLegend = true,
  compact = false
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
      selection: { enabled: false }
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
      padding: { top: 0, right: 10, bottom: 0, left: 10 }
    },
    xaxis: {
      labels: {
        style: { 
          colors: '#64748b', 
          fontSize: '12px', 
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
          fontSize: '12px', 
          fontWeight: 400 
        },
        formatter: (value) => value.toFixed(0)
      }
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '14px', fontFamily: 'Inter, sans-serif' },
      x: { formatter: (val) => `Period ${val}` }
    },
    legend: showLegend ? {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '12px',
      fontWeight: 500,
      labels: { colors: '#475569' },
      markers: { size: 4 }
    } : { show: false },
    dataLabels: { enabled: false }
  };

  return (
    <div className="chart-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {subtitle || '2-year comparison'}
            </p>
          </div>
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