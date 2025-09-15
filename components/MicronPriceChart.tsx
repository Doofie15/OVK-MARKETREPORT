
import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import type { MicronPrice, Auction } from '../types';

interface MicronPriceChartProps {
  data: MicronPrice[];
  previousData?: MicronPrice[];
  catalogueName?: string;
  currentAuction?: Auction;
  previousAuction?: Auction;
}

const MicronPriceChart: React.FC<MicronPriceChartProps> = ({ data, previousData, catalogueName, currentAuction, previousAuction }) => {
  
  // Ensure data is available and is an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }
  
  const sortedData = [...data].sort((a, b) => parseFloat(a.bucket_micron) - parseFloat(b.bucket_micron));
  const sortedPreviousData = previousData && Array.isArray(previousData) 
    ? [...previousData].sort((a, b) => parseFloat(a.bucket_micron) - parseFloat(b.bucket_micron)) 
    : [];

  const currentYearData = sortedData.map(item => item.price_clean_zar_per_kg);
  const previousYearData = sortedPreviousData.map(item => item.price_clean_zar_per_kg);
  
  const categories = sortedData.map(item => `${item.bucket_micron}µm`);
  
  // Debug logging
  console.log('Chart Data Debug:', {
    sortedData,
    currentYearData,
    previousYearData,
    categories
  });

  const options: ApexOptions = {
    chart: {
      type: 'line',
      background: 'transparent',
      toolbar: {
        show: false
      },
      zoom: { enabled: false },
      selection: { enabled: false }
    },
    colors: ['#1e40af', '#10b981'],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    markers: {
      size: 4,
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
      categories: categories,
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
        const category = w.globals.labels && w.globals.labels[dataPointIndex] 
          ? w.globals.labels[dataPointIndex] 
          : `Micron ${dataPointIndex + 17}µm`;
        
        // Get current year price (first series)
        const currentPrice = series[0] && series[0][dataPointIndex] ? series[0][dataPointIndex] : 0;
        
        // Get previous year price (second series if it exists)
        const previousPrice = series[1] && series[1][dataPointIndex] ? series[1][dataPointIndex] : null;
        
        // Calculate year-over-year change if both prices exist
        const priceChange = previousPrice && previousPrice > 0 
          ? ((currentPrice - previousPrice) / previousPrice * 100) 
          : null;
        
        return `
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); min-width: 180px;">
            <div style="color: #1e293b; font-weight: 600; margin-bottom: 8px; font-size: 13px;">
              ${category}
            </div>
            <div style="margin-bottom: 6px;">
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <div style="width: 8px; height: 8px; background: #1e40af; border-radius: 50%; margin-right: 8px;"></div>
                <span style="color: #64748b; font-size: 11px; margin-right: 8px;">${getCurrentAuctionName()}:</span>
                <span style="color: #1e40af; font-weight: 600; font-size: 12px;">R${currentPrice.toFixed(2)}/kg</span>
              </div>
              ${previousPrice ? `
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 8px;"></div>
                  <span style="color: #64748b; font-size: 11px; margin-right: 8px;">${getPreviousAuctionName()}:</span>
                  <span style="color: #10b981; font-weight: 600; font-size: 12px;">R${previousPrice.toFixed(2)}/kg</span>
                </div>
                ${priceChange !== null ? `
                  <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 10px;">Year-over-year change:</span>
                    <span style="color: ${priceChange >= 0 ? '#10b981' : '#ef4444'}; font-weight: 600; font-size: 11px; margin-left: 4px;">
                      ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)}%
                    </span>
                  </div>
                ` : ''}
              ` : ''}
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
    },
    plotOptions: {},
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '12px',
      fontWeight: 500,
      labels: { colors: '#475569' },
      markers: { size: 4 }
    }
  };

  // Generate legend names with auction name and year
  const getCurrentAuctionName = () => {
    if (currentAuction) {
      const year = new Date(currentAuction.auction_date).getFullYear();
      return `${currentAuction.catalogue_name} ${year}`;
    }
    return 'Current Auction';
  };

  const getPreviousAuctionName = () => {
    if (currentAuction) {
      const currentYear = new Date(currentAuction.auction_date).getFullYear();
      const previousYear = currentYear - 1;
      return `${currentAuction.catalogue_name} ${previousYear}`;
    }
    return 'Same Auction Last Year';
  };

  const series = [
    {
      name: getCurrentAuctionName(),
      data: currentYearData
    },
    ...(previousData && previousData.length > 0 ? [{
      name: getPreviousAuctionName(),
      data: previousYearData
    }] : [])
  ];

  return (
    <div className="chart-container h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {catalogueName || 'Global Price Index'}
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Price performance across micron grades
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              This auction vs same auction last year comparison
            </p>
          </div>
        </div>
        
      </div>
      
      <div className="flex-1">
        <Chart
          options={options}
          series={series}
          type="line"
          height="100%"
        />
      </div>


    </div>
  );
};

export default MicronPriceChart;
