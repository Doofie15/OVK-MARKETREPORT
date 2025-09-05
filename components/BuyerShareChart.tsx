
import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import type { Buyer } from '../types';

interface BuyerShareChartProps {
  data: Buyer[];
}

const BuyerShareChart: React.FC<BuyerShareChartProps> = ({ data }) => {
  const chartData = data.map(buyer => buyer.share_pct);
  const labels = data.map(buyer => buyer.buyer);

  const options: ApexOptions = {
    theme: {
      mode: 'dark',
    },
    chart: {
      type: 'donut',
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    colors: ['#64ffda', '#7c3aed', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
    labels: labels,
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              color: '#ffffff',
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '28px',
              fontWeight: 700,
              color: '#64ffda',
              offsetY: 10,
              formatter: (val) => `${val}%`
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total Share',
              fontSize: '14px',
              fontWeight: 500,
              color: '#b8c5d6',
              formatter: () => '100%'
            }
          }
        }
      }
    },
    legend: {
      position: 'right',
      fontSize: '14px',
      fontWeight: 500,
      labels: {
        colors: '#b8c5d6'
      },
      markers: {
        radius: 6,
      },
      offsetX: -10
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif'
      },
      y: {
        formatter: (val) => `${val}%`
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#ffffff']
      },
      formatter: (val) => `${val.toFixed(1)}%`,
      dropShadow: {
        enabled: false
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 350
        },
        legend: {
          position: 'bottom',
          offsetX: 0
        }
      }
    }]
  };

  return (
    <section className="section">
      <div className="chart-container">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-title" style={{ color: 'var(--text-primary)' }}>
              TOP BUYERS & MARKET SHARE
            </h2>
            <p className="text-small" style={{ color: 'var(--text-muted)' }}>
              Market participation by volume share
            </p>
          </div>
        </div>
        
        <Chart
          options={options}
          series={chartData}
          type="donut"
          height={400}
        />
      </div>
    </section>
  );
};

export default BuyerShareChart;
