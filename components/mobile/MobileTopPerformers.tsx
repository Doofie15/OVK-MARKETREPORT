import React from 'react';
import type { TopSale, ProvincialProducerData } from '../../types';
import MobileProvincialTopProducers from './MobileProvincialTopProducers';

interface MobileTopPerformersProps {
  topSales: TopSale[];
  provincialProducers: ProvincialProducerData[];
  publishedDate?: Date;
}

const MobileTopPerformers: React.FC<MobileTopPerformersProps> = ({ 
  topSales, 
  provincialProducers,
  publishedDate
}) => {
  return (
    <div style={{ margin: '0 0.5rem' }}>
      <MobileProvincialTopProducers data={provincialProducers} publishedDate={publishedDate} />
    </div>
  );
};

export default MobileTopPerformers;