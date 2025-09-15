import React, { useState } from 'react';
import type { TopSale, ProvincialProducerData, ProvinceAveragePrice } from '../../types';
import MobileProvincialTopProducers from './MobileProvincialTopProducers';
import MobileProvincePriceMap from './MobileProvincePriceMap';

interface MobileTopPerformersProps {
  topSales: TopSale[];
  provincialProducers: ProvincialProducerData[];
  provinceAvgPrices: ProvinceAveragePrice[];
}

type View = 'province' | 'map';

const MobileTopPerformers: React.FC<MobileTopPerformersProps> = ({ 
  topSales, 
  provincialProducers, 
  provinceAvgPrices 
}) => {
  const [activeView, setActiveView] = useState<View>('province');

  const renderView = () => {
    switch (activeView) {
      case 'province':
        return <MobileProvincialTopProducers data={provincialProducers} />;
      case 'map':
        return <MobileProvincePriceMap data={provinceAvgPrices} />;
      default:
        return null;
    }
  };
  
   const NavButton: React.FC<{view: View, label: string, icon: React.ReactNode}> = ({ view, label, icon }) => {
     const isActive = activeView === view;
     return (
       <button
         onClick={() => setActiveView(view)}
         className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
           isActive 
             ? 'text-white' 
             : 'hover:bg-gray-100'
         }`}
         style={{
           background: isActive 
             ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' 
             : 'white',
           color: isActive ? '#ffffff' : 'var(--text-primary)',
           border: isActive ? 'none' : '1px solid var(--border-primary)'
         }}
       >
         <div className={`w-3 h-3 flex items-center justify-center ${
           isActive ? 'text-white' : ''
         }`}>
           {icon}
         </div>
         <span className="text-xs">{label.split(' ')[0]}</span>
       </button>
     )
   }

   return (
     <div className="card">
       <div className="flex items-center gap-2 mb-2">
         <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
           <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
           </svg>
         </div>
         <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
           TOP PERFORMERS
         </h2>
       </div>
       
       {/* Compact Navigation */}
       <div className="flex gap-1 mb-3">
         <NavButton 
           view="province" 
           label="Top 10 Provincial Producers" 
           icon={
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
             </svg>
           }
         />
         <NavButton 
           view="map" 
           label="Map" 
           icon={
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
             </svg>
           }
         />
       </div>
       
       {/* Content */}
       <div className="bg-gray-50 rounded-lg p-2">
         {renderView()}
       </div>
     </div>
   );
};

export default MobileTopPerformers;