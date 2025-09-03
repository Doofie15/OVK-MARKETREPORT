
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
      mode: 'dark',
    },
    chart: {
      type: 'line',
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    colors: ['#64ffda'],
    stroke: {
      curve: 'smooth',
      width: 3,
      lineCap: 'round'
    },
    markers: {
      size: 6,
      colors: ['#64ffda'],
      strokeColors: '#1e2441',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    grid: {
      borderColor: '#2a3152',
      strokeDashArray: 3,
      xaxis: { lines: { show: true }},
      yaxis: { lines: { show: true }},
      padding: { top: 0, right: 30, bottom: 0, left: 20 }
    },
    xaxis: {
      title: {
        text: 'Micron Grade (µm)',
        style: {
          color: '#b8c5d6',
          fontSize: '14px',
          fontWeight: 600
        }
      },
      labels: {
        style: {
          colors: '#8892b0',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      title: {
        text: 'Price (ZAR/kg clean)',
        style: {
          color: '#b8c5d6',
          fontSize: '14px',
          fontWeight: 600
        }
      },
      labels: {
        style: {
          colors: '#8892b0',
          fontSize: '12px',
          fontWeight: 500
        },
        formatter: (value) => `R${value.toFixed(0)}`
      }
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif'
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const value = series[seriesIndex][dataPointIndex];
        const category = w.globals.labels[dataPointIndex];
        return `
          <div style="background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 12px; box-shadow: var(--shadow-lg);">
            <div style="color: var(--text-primary); font-weight: 600; margin-bottom: 4px;">
              ${category}
            </div>
            <div style="color: var(--accent-primary); font-weight: 600;">
              R${value.toFixed(2)}/kg
            </div>
          </div>
        `;
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: ['#7c3aed'],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.1,
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
    <section className="section">
      <div className="chart-container">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-title" style={{ color: 'var(--text-primary)' }}>
              Global Price Index (Last 12 Months)
            </h2>
            <p className="text-small" style={{ color: 'var(--text-muted)' }}>
              Price performance across micron grades • ZAR/kg clean basis
            </p>
          </div>
        </div>
        
        <Chart
          options={options}
          series={series}
          type="line"
          height={380}
        />
      </div>
    </section>
  );
};

export default MicronPriceChart;
