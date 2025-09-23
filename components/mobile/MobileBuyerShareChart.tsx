import React from 'react';
import type { Buyer } from '../../types';
import MobileCard from './MobileCard';
import MobileDataTable from './MobileDataTable';

interface MobileBuyerShareChartProps {
  data: Buyer[];
}

const MobileBuyerShareChart: React.FC<MobileBuyerShareChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.share_pct - a.share_pct);
  const colors = ['#64ffda', '#7c3aed', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

  const icon = (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const columns = [
    {
      key: 'rank',
      label: '#',
      align: 'center' as const,
      width: '40px',
      render: (value: any, row: any, index: number) => (
        <div className="flex items-center justify-center gap-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors[index % colors.length] }}
          />
          <span className="text-xs font-bold">#{index + 1}</span>
        </div>
      )
    },
    {
      key: 'buyer',
      label: 'Buyer',
      align: 'left' as const,
      render: (value: string) => (
        <span className="text-sm font-medium truncate">{value}</span>
      )
    },
    {
      key: 'share',
      label: 'Share',
      align: 'right' as const,
      render: (value: number) => (
        <span className="text-sm font-bold">{value.toFixed(1)}%</span>
      )
    },
    {
      key: 'bales',
      label: 'Bales',
      align: 'right' as const,
      render: (value: number) => (
        <span className="text-sm font-medium">{value.toLocaleString()}</span>
      )
    }
  ];

  const tableData = sortedData.map(buyer => ({
    rank: 0, // Will be calculated in render
    buyer: buyer.buyer,
    share: buyer.share_pct,
    bales: buyer.cat
  }));

  return (
    <div style={{ margin: '0 0.5rem' }}>
      <MobileCard
        title="TOP BUYERS & MARKET SHARE"
        subtitle="Current auction performance by volume share"
        icon={icon}
        compact
      >
      <MobileDataTable
        columns={columns}
        data={tableData}
        compact
        striped
      />
      </MobileCard>
    </div>
  );
};

export default MobileBuyerShareChart;