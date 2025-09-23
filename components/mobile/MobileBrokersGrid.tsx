import React from 'react';
import type { BrokerData } from '../../types';
import MobileCard from './MobileCard';
import MobileDataTable from './MobileDataTable';

interface MobileBrokersGridProps {
  data: BrokerData[];
}

const MobileBrokersGrid: React.FC<MobileBrokersGridProps> = ({ data }) => {
  const colors = ['#0ea5e9', '#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
  
  // Sort data by bales offered from high to low
  const sortedData = [...data].sort((a, b) => b.catalogue_offering - a.catalogue_offering);
  
  // Calculate totals
  const totalOffered = sortedData.reduce((sum, broker) => sum + broker.wool_offered, 0);
  const totalSold = sortedData.reduce((sum, broker) => sum + broker.sold, 0);
  
  const icon = (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const columns = [
    {
      key: 'broker',
      label: 'Broker',
      align: 'left' as const,
      render: (value: string, row: BrokerData, index: number) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors[index % colors.length] }}
          />
          <span className="font-semibold text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'offered',
      label: 'Offered',
      align: 'right' as const,
      render: (value: number) => (
        <span className="text-sm font-medium">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'sold',
      label: 'Sold',
      align: 'right' as const,
      render: (value: number) => (
        <span className="text-sm font-medium">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'rate',
      label: 'Rate',
      align: 'center' as const,
      render: (value: any, row: any) => {
        // Use the pre-calculated sold_pct from the original data
        const brokerData = sortedData.find(b => b.name === row.broker);
        const rate = brokerData ? brokerData.sold_pct : 0;
        return (
          <span className="text-xs font-semibold" style={{ 
            color: rate >= 90 ? '#10b981' : rate >= 70 ? '#f59e0b' : '#ef4444' 
          }}>
            {rate.toFixed(2)}%
          </span>
        );
      }
    }
  ];

  const tableData = sortedData.map(broker => ({
    broker: broker.name,
    offered: broker.wool_offered,
    sold: broker.sold,
    rate: broker.sold_pct // Pass the actual rate for the render function
  }));

  return (
    <div style={{ margin: '0 0.5rem' }}>
      <MobileCard
        title="BROKERS"
        subtitle="Offered vs sold"
        icon={icon}
        compact
      >
      <MobileDataTable
        columns={columns}
        data={tableData}
        compact
        striped
      />
      
      {/* Summary */}
      <div className="mt-3 pt-2 border-t" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
              {totalOffered.toLocaleString()}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Offered</div>
          </div>
          <div className="text-center">
            <div className="font-bold" style={{ color: 'var(--accent-primary)' }}>
              {sortedData.length}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Brokers</div>
          </div>
          <div className="text-center">
            <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
              {totalSold.toLocaleString()}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Sold</div>
          </div>
        </div>
        {totalOffered > 0 && (
          <div className="text-center mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            {((totalSold / totalOffered) * 100).toFixed(2)}% clearance
          </div>
        )}
      </div>
      </MobileCard>
    </div>
  );
};

export default MobileBrokersGrid;