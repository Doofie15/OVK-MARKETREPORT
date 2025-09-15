import React from 'react';
import type { TrendData } from '../../types';
import MobileCard from './MobileCard';
import MobileChart from './MobileChart';

interface MobileMarketTrendsProps {
  data: TrendData;
}

const MobileMarketTrends: React.FC<MobileMarketTrendsProps> = ({ data }) => {
  const icon = (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  // Prepare chart data
  const prepareChartData = (trendData: any[], currency: string, title: string) => {
    const isZAR = currency === 'ZAR';
    const dataKey2025 = isZAR ? '2025_zar' : '2025_usd';
    const dataKey2024 = isZAR ? '2024_zar' : '2024_usd';
    
    return [
      {
        name: `2025 ${currency}`,
        data: trendData.map(point => ({
          x: point.period,
          y: point[dataKey2025]
        }))
      },
      {
        name: `2024 ${currency}`,
        data: trendData.map(point => ({
          x: point.period,
          y: point[dataKey2024]
        }))
      }
    ];
  };

  // Get colors based on chart type
  const getColors = (title: string) => {
    if (title.includes('AWEX')) {
      return ['#00843D', '#FFD700']; // Australian colors
    } else if (title.includes('EXCHANGE RATE')) {
      return ['#007A4D', '#002868']; // SA green, USA blue
    } else if (title.includes('CERTIFIED')) {
      return ['#1e40af', '#3b82f6']; // Blue colors
    } else {
      return ['#10b981', '#34d399']; // Green colors
    }
  };

  const charts = [
    {
      title: 'CERTIFIED WOOL',
      data: prepareChartData(data.rws, 'ZAR', 'CERTIFIED'),
      colors: getColors('CERTIFIED'),
      currency: 'ZAR'
    },
    {
      title: 'ALL MERINO',
      data: prepareChartData(data.non_rws, 'ZAR', 'ALL-MERINO'),
      colors: getColors('ALL-MERINO'),
      currency: 'ZAR'
    },
    {
      title: 'EXCHANGE RATE',
      data: prepareChartData(data.rws, 'USD', 'EXCHANGE RATE'),
      colors: getColors('EXCHANGE RATE'),
      currency: 'USD'
    },
    {
      title: 'AWEX',
      data: prepareChartData(data.awex, 'USD', 'AWEX'),
      colors: getColors('AWEX'),
      currency: 'USD'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-sm font-bold gradient-text">2 YEAR MARKET TRENDS</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {charts.map((chart, index) => (
          <MobileChart
            key={index}
            title={chart.title}
            subtitle={`2-year comparison (${chart.currency})`}
            data={chart.data}
            type="line"
            colors={chart.colors}
            height={200}
            currency={chart.currency}
            compact={true}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileMarketTrends;
