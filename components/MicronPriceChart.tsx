
import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import type { MicronPrice } from '../types';

interface MicronPriceChartProps {
  data: MicronPrice[];
}

const MicronPriceChart: React.FC<MicronPriceChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => parseFloat(a.bucket_micron) - parseFloat(b.bucket_micron));

  const chartData = sortedData.map(item => ({
    x: `${item.bucket_micron}µm`,
    y: item.price_clean_zar_per_kg
  }));

  const options: ApexOptions = {
    theme: {
      mode: 'light',
    },
    chart: {
      type: 'line',
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    colors: ['#1e40af'],
    stroke: {
      curve: 'smooth',
      width: 2,
      lineCap: 'round'
    },
    markers: {
      size: 4,
      colors: ['#1e40af'],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 2,
      xaxis: { lines: { show: true }},
      yaxis: { lines: { show: true }},
      padding: { top: 0, right: 20, bottom: 0, left: 10 }
    },
    xaxis: {
      title: {
        text: 'Micron Grade (µm)',
        style: {
          color: '#475569',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '11px',
          fontWeight: 400
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      title: {
        text: 'Price (ZAR/kg clean)',
        style: {
          color: '#475569',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '11px',
          fontWeight: 400
        },
        formatter: (value) => `R${value.toFixed(0)}`
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const value = series[seriesIndex][dataPointIndex];
        const category = w.globals.labels[dataPointIndex];
        return `
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="color: #1e293b; font-weight: 600; margin-bottom: 2px;">
              ${category}
            </div>
            <div style="color: #1e40af; font-weight: 600;">
              R${value.toFixed(2)}/kg
            </div>
          </div>
        `;
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: ['#6366f1'],
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  const series = [{
    name: 'Price (ZAR/kg)',
    data: chartData
  }];

  return (
    <div className="chart-container">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Global Price Index
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Price performance across micron grades
          </p>
        </div>
      </div>
      
      <Chart
        options={options}
        series={series}
        type="line"
        height={280}
      />


    </div>
  );
};

export default MicronPriceChart;
