import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import type { TrendData, TrendPoint } from '../types';

interface MarketTrendsProps {
  data: TrendData;
}

const ModernTrendChart: React.FC<{ 
  title: string; 
  data: TrendPoint[]; 
  currency: 'ZAR' | 'USD';
  type: 'CERTIFIED' | 'ALL-MERINO';
}> = ({ title, data, currency, type }) => {
  const isZAR = currency === 'ZAR';
  const isCertified = type === 'CERTIFIED';
  
  const dataKey2025 = isZAR ? '2025_zar' : '2025_usd';
  const dataKey2024 = isZAR ? '2024_zar' : '2024_usd';
  
  const primaryColor = isCertified ? '#1e40af' : '#10b981';
  const secondaryColor = isCertified ? '#3b82f6' : '#34d399';

  const chartSeries = [
    {
      name: `2025 ${currency}`,
      data: data.map(point => ({
        x: point.period,
        y: point[dataKey2025]
      }))
    },
    {
      name: `2024 ${currency}`,
      data: data.map(point => ({
        x: point.period,
        y: point[dataKey2024]
      }))
    }
  ];

  const options: ApexOptions = {
    theme: { mode: 'light' },
    chart: {
      type: 'line',
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 },
      zoom: { enabled: false },
      selection: { enabled: false }
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
      x: { formatter: (val) => `Period ${val}` }
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
  const current2025 = data.length > 0 ? data[data.length - 1][dataKey2025] : 0;
  const current2024 = data.length > 0 ? data[data.length - 1][dataKey2024] : 0;

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
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Current 2025</div>
          <div className="text-sm font-bold" style={{ color: primaryColor }}>
            {current2025.toFixed(2)} {currency}
          </div>
        </div>
      </div>
      
      <Chart
        options={options}
        series={chartSeries}
        type="line"
        height={window.innerWidth < 768 ? 180 : 220}
      />
    </div>
  );
};

const MarketTrends: React.FC<MarketTrendsProps> = ({ data }) => {
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

      {/* ZAR Trends */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">R</span>
          </div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            South African Rand (ZAR)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModernTrendChart title="CERTIFIED WOOL 2 YEAR TREND" data={data.rws} currency="ZAR" type="CERTIFIED" />
          <ModernTrendChart title="AWEX 2 YEAR TREND" data={data.awex} currency="ZAR" type="ALL-MERINO" />
        </div>
      </div>

      {/* USD Trends */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">$</span>
          </div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            US Dollar (USD)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModernTrendChart title="CERTIFIED WOOL 2 YEAR TREND" data={data.rws} currency="USD" type="CERTIFIED" />
          <ModernTrendChart title="AWEX 2 YEAR TREND" data={data.awex} currency="USD" type="ALL-MERINO" />
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;