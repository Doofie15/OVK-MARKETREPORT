import React from 'react';
import type { TopSale, ProvincialProducerData } from '../../types';
import MobileProvincialTopProducers from './MobileProvincialTopProducers';

interface MobileTopPerformersProps {
  topSales: TopSale[];
  provincialProducers: ProvincialProducerData[];
}

const MobileTopPerformers: React.FC<MobileTopPerformersProps> = ({ 
  topSales, 
  provincialProducers
}) => {
  return (
    <div style={{ margin: '0 -0.5rem' }}>
      <MobileProvincialTopProducers data={provincialProducers} />
    </div>
  );
};

export default MobileTopPerformers;