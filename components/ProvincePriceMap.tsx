import React, { useState, useCallback } from 'react';
import type { ProvincialProducerData } from '../types';
import zaGeoJSON from '../za.json';

interface ProvincePriceMapProps {
  data: ProvincialProducerData[];
}

const SouthAfricaMap = ({
  data,
  onMouseMove,
  hoveredId,
  getColor,
}: {
  data: { id: string; name: string; certified_avg: number; non_certified_avg: number; has_non_certified: boolean }[];
  onMouseMove: (e: React.MouseEvent, id: string) => void;
  hoveredId: string | null;
  getColor: (price: number) => string;
}) => {
  // Map GeoJSON province IDs to component IDs
  const provinceIdMap: Record<string, string> = {
    ZANC: 'ZA-NC', // Northern Cape
    ZAKZN: 'ZA-KZN', // KwaZulu-Natal
    ZAFS: 'ZA-FS', // Free State
    ZAEC: 'ZA-EC', // Eastern Cape
    ZALP: 'ZA-LP', // Limpopo
    ZANW: 'ZA-NW', // North West
    ZAMP: 'ZA-MP', // Mpumalanga
    ZAWC: 'ZA-WC', // Western Cape
    ZAGP: 'ZA-GP', // Gauteng
  };

  // Corrected coordinate conversion (upright map)
  const coordinatesToPath = useCallback(
    (coordinates: number[][][] | number[][][][]) => {
      try {
        // Handle Polygon vs MultiPolygon
        const coords = Array.isArray(coordinates[0][0][0])
          ? (coordinates as number[][][][])
          : [coordinates as number[][][]];

         // South Africa bounds for proper centering and scaling
         const minLon = 16.5,
           maxLon = 32.9;
         const minLat = -34.8,
           maxLat = -22.1;

         return coords
           .map((polygon) => {
             return polygon
               .map((ring, ringIndex) => {
                 const pathData = ring
                   .map((coord, coordIndex) => {
                     // Center and scale the map properly within 600x500 viewBox
                     const x =
                       ((coord[0] - minLon) / (maxLon - minLon)) * 500 + 50;
                     const y =
                       ((maxLat - coord[1]) / (maxLat - minLat)) * 400 + 50;
                     return `${coordIndex === 0 ? 'M' : 'L'} ${x.toFixed(
                       2
                     )} ${y.toFixed(2)}`;
                   })
                   .join(' ');
                 return ringIndex === 0 ? pathData : `M ${pathData}`;
               })
               .join(' ');
           })
           .join(' ');
      } catch (error) {
        console.error('Error in coordinatesToPath:', error, coordinates);
        return '';
      }
    },
    []
  );

  return (
    <div className="w-full" style={{ aspectRatio: '6/5', maxHeight: '625px' }}>
      <svg
        viewBox="0 0 600 500"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Map of South Africa"
      >
      {/* Background */}
      <rect width="600" height="500" fill="transparent" />

      <g>
        {zaGeoJSON.features
          .filter((feature) => feature.properties.name !== 'Lesotho') // Exclude Lesotho
          .map((feature) => {
          const geoId = feature.properties.id;
          const componentId = provinceIdMap[geoId];
          const provinceData = data.find((p) => p.id === componentId);
          
          // Always use the GeoJSON province name, never use data-provided names
          const provinceName = feature.properties.name;

          const coordinates = feature.geometry.coordinates;
          const pathData = coordinatesToPath(coordinates);

           // Bounds for label positioning (matching coordinate transformation)
           const minLon = 16.5,
             maxLon = 32.9;
           const minLat = -34.8,
             maxLat = -22.1;

           const firstRing = Array.isArray(coordinates[0][0][0])
             ? (coordinates as number[][][][])[0][0]
             : (coordinates as number[][][])[0];

           const bounds = firstRing.reduce(
             (acc, coord) => {
               const x =
                 ((coord[0] - minLon) / (maxLon - minLon)) * 500 + 50;
               const y =
                 ((maxLat - coord[1]) / (maxLat - minLat)) * 400 + 50;
               return {
                 minX: Math.min(acc.minX, x),
                 maxX: Math.max(acc.maxX, x),
                 minY: Math.min(acc.minY, y),
                 maxY: Math.max(acc.maxY, y),
               };
             },
             {
               minX: Infinity,
               maxX: -Infinity,
               minY: Infinity,
               maxY: -Infinity,
             }
           );

          // Calculate better center point for label positioning
          const provinceWidth = bounds.maxX - bounds.minX;
          const provinceHeight = bounds.maxY - bounds.minY;
          const isSmallProvince = provinceWidth < 80 || provinceHeight < 60;
          
          // Adjust center point for better label positioning
          let centerX = (bounds.minX + bounds.maxX) / 2;
          let centerY = (bounds.minY + bounds.maxY) / 2;
          
          // Special positioning adjustments for specific provinces
          if (geoId === 'ZAKZN') {
            // KwaZulu-Natal - shift slightly north for better fit
            centerY = bounds.minY + (provinceHeight * 0.4);
          } else if (geoId === 'ZAEC') {
            // Eastern Cape - shift west and down for better fit
            centerX = bounds.minX + (provinceWidth * 0.4);
            centerY = bounds.minY + (provinceHeight * 0.7);
          } else if (geoId === 'ZAWC') {
            // Western Cape - shift down for better fit
            centerY = bounds.minY + (provinceHeight * 0.7);
          } else if (geoId === 'ZANC') {
            // Northern Cape - shift down for better fit
            centerY = bounds.minY + (provinceHeight * 0.6);
          } else if (geoId === 'ZAGP') {
            // Gauteng - shift slightly south for better fit
            centerY = bounds.minY + (provinceHeight * 0.6);
          } else if (geoId === 'ZAMP') {
            // Mpumalanga - shift down for better fit
            centerY = bounds.minY + (provinceHeight * 0.6);
          } else if (geoId === 'ZAFS') {
            // Free State - shift left and down for better fit
            centerX = bounds.minX + (provinceWidth * 0.3);
            centerY = bounds.minY + (provinceHeight * 0.6);
          }
          const isHovered = hoveredId === componentId;
          // Use certified average for color if available, otherwise use non-certified
          const colorPrice = provinceData ? (provinceData.certified_avg > 0 ? provinceData.certified_avg : provinceData.non_certified_avg) : 0;

          return (
            <g key={geoId}>
              <path
                d={pathData}
                fill={provinceData ? getColor(isHovered ? colorPrice + 5 : colorPrice) : '#1e40af'}
                stroke="#ffffff"
                strokeWidth={isHovered ? '3' : '1.5'}
                onMouseMove={(e) => onMouseMove(e, componentId)}
                className={`transition-all duration-300 cursor-pointer ${
                  hoveredId && hoveredId !== componentId
                    ? 'opacity-30'
                    : isHovered
                    ? 'opacity-100 drop-shadow-lg'
                    : 'opacity-95'
                }`}
                style={{
                  filter: isHovered
                    ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))'
                    : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />
               {/* Province name with improved visibility */}
               <text
                 x={centerX}
                 y={centerY - 6}
                 className="pointer-events-none"
                 textAnchor="middle"
                 dominantBaseline="middle"
                 fill={isHovered ? '#ffffff' : '#ffffff'}
                 style={{
                   textShadow: isHovered
                     ? '0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.3)'
                     : '0 1px 3px rgba(0,0,0,0.7), 0 0 6px rgba(0,0,0,0.2)',
                   fontSize: isSmallProvince ? '9px' : '10px',
                   fontWeight: '700',
                   letterSpacing: '0.05em',
                   fontFamily: 'system-ui, -apple-system, sans-serif',
                 }}
               >
                 {provinceName}
               </text>
               
               {/* Certified Wool price label - Green (always show, even if 0) */}
               <text
                 x={centerX}
                 y={centerY + 6}
                 className="pointer-events-none"
                 textAnchor="middle"
                 dominantBaseline="middle"
                 fill={isHovered ? '#ffffff' : '#ffffff'}
                 style={{
                   textShadow: isHovered
                     ? '0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.3)'
                     : '0 1px 3px rgba(0,0,0,0.7), 0 0 6px rgba(0,0,0,0.2)',
                   fontSize: isSmallProvince ? '6px' : '7px',
                   fontWeight: '600',
                   letterSpacing: '0.025em',
                   fontFamily: 'system-ui, -apple-system, sans-serif',
                 }}
               >
                 <tspan fill="#10b981">Certified:</tspan> R{provinceData ? provinceData.certified_avg.toFixed(1) : '0.0'}/kg
               </text>
               
               {/* Non-Certified Merino Wool price label - Blue (only show if there are non-certified producers) */}
               {provinceData && provinceData.has_non_certified && (
                 <text
                   x={centerX}
                   y={centerY + 14}
                   className="pointer-events-none"
                   textAnchor="middle"
                   dominantBaseline="middle"
                   fill={isHovered ? '#ffffff' : '#ffffff'}
                   style={{
                     textShadow: isHovered
                       ? '0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.3)'
                       : '0 1px 3px rgba(0,0,0,0.7), 0 0 6px rgba(0,0,0,0.2)',
                     fontSize: isSmallProvince ? '6px' : '7px',
                     fontWeight: '600',
                     letterSpacing: '0.025em',
                     fontFamily: 'system-ui, -apple-system, sans-serif',
                   }}
                 >
                   <tspan fill="#3b82f6">Merino:</tspan> R{provinceData.non_certified_avg.toFixed(1)}/kg
                 </text>
               )}
            </g>
          );
        })}
      </g>
    </svg>
    </div>
  );
};

const Tooltip: React.FC<{ province: { id: string; name: string; certified_avg: number; non_certified_avg: number; has_non_certified: boolean } }> = ({ province }) => (
  <div
    className="p-3 rounded-lg shadow-lg z-10 text-center border border-white/20 backdrop-blur-sm max-w-xs"
    style={{
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
    }}
  >
    <div className="flex items-center justify-center mb-2">
      <div
        className="w-3 h-3 rounded-full mr-2"
        style={{ backgroundColor: '#1e40af' }}
      ></div>
      <p className="font-bold text-lg text-gray-800">{province.name}</p>
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
        <p className="text-xs font-semibold" style={{ color: '#10b981' }}>
          Certified: R{province.certified_avg.toFixed(1)}/kg
        </p>
      </div>
      {province.has_non_certified && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
          <p className="text-xs font-semibold" style={{ color: '#3b82f6' }}>
            Merino: R{province.non_certified_avg.toFixed(1)}/kg
          </p>
        </div>
      )}
    </div>
  </div>
);

const ProvincePriceMap: React.FC<ProvincePriceMapProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    province: { id: string; name: string; certified_avg: number; non_certified_avg: number; has_non_certified: boolean };
  } | null>(null);

  // Calculate averages from provincial producer data
  const calculateProvincialAverages = (provincialData: ProvincialProducerData[]) => {
    const provinceMap: Record<string, { certified: number[]; nonCertified: number[] }> = {};
    
    // Initialize all South African provinces with empty arrays
    const southAfricanProvinces = [
      'Eastern Cape', 'Free State', 'Western Cape', 'Northern Cape', 
      'KwaZulu-Natal', 'Mpumalanga', 'Gauteng', 'Limpopo', 'North West'
    ];
    
    southAfricanProvinces.forEach(province => {
      provinceMap[province] = { certified: [], nonCertified: [] };
    });
    
    provincialData.forEach(province => {
      // Skip Lesotho for map display (it's not a South African province)
      if (province.province === 'Lesotho') {
        return;
      }
      
      // Take top 10 performers (already sorted by position)
      const topPerformers = province.producers.slice(0, 10);
      
      topPerformers.forEach(producer => {
        // Certified: Only producers with RWS certification
        if (producer.certified === 'RWS') {
          provinceMap[province.province].certified.push(producer.price);
        } else {
          // Non-certified: Only producers without RWS certification
          provinceMap[province.province].nonCertified.push(producer.price);
        }
      });
    });
    
    // Convert to map data format - always show all provinces, even with 0 values
    const mapData = Object.entries(provinceMap).map(([provinceName, prices]) => {
      const certifiedAvg = prices.certified.length > 0 
        ? prices.certified.reduce((sum, price) => sum + price, 0) / prices.certified.length 
        : 0;
      const nonCertifiedAvg = prices.nonCertified.length > 0 
        ? prices.nonCertified.reduce((sum, price) => sum + price, 0) / prices.nonCertified.length 
        : 0;
      
      return {
        id: getProvinceId(provinceName),
        name: provinceName,
        certified_avg: certifiedAvg,
        non_certified_avg: nonCertifiedAvg,
        has_non_certified: prices.nonCertified.length > 0
      };
    });
    
    return mapData;
  };

  const getProvinceId = (provinceName: string): string => {
    const provinceMap: Record<string, string> = {
      'Eastern Cape': 'ZA-EC',
      'Western Cape': 'ZA-WC',
      'Northern Cape': 'ZA-NC',
      'KwaZulu-Natal': 'ZA-KZN',
      'Free State': 'ZA-FS',
      'North West': 'ZA-NW',
      'Gauteng': 'ZA-GP',
      'Mpumalanga': 'ZA-MP',
      'Limpopo': 'ZA-LP'
    };
    return provinceMap[provinceName] || 'ZA-EC';
  };

  const sampleData = [
    { id: 'ZA-EC', name: 'Eastern Cape', certified_avg: 183.0, non_certified_avg: 0, has_non_certified: false },
    { id: 'ZA-WC', name: 'Western Cape', certified_avg: 179.0, non_certified_avg: 197.0, has_non_certified: true },
    { id: 'ZA-NC', name: 'Northern Cape', certified_avg: 175.0, non_certified_avg: 193.0, has_non_certified: true },
    { id: 'ZA-KZN', name: 'KwaZulu-Natal', certified_avg: 168.0, non_certified_avg: 185.0, has_non_certified: true },
    { id: 'ZA-FS', name: 'Free State', certified_avg: 166.0, non_certified_avg: 183.0, has_non_certified: true },
    { id: 'ZA-NW', name: 'North West', certified_avg: 162.0, non_certified_avg: 178.0, has_non_certified: true },
    { id: 'ZA-GP', name: 'Gauteng', certified_avg: 160.0, non_certified_avg: 176.0, has_non_certified: true },
    { id: 'ZA-MP', name: 'Mpumalanga', certified_avg: 159.0, non_certified_avg: 175.0, has_non_certified: true },
    { id: 'ZA-LP', name: 'Limpopo', certified_avg: 155.0, non_certified_avg: 171.0, has_non_certified: true },
  ];

  const mapData = data && data.length > 0 ? calculateProvincialAverages(data) : sampleData;

  const handleMouseMove = (e: React.MouseEvent, provinceId: string) => {
    const provinceData = mapData.find((p) => p.id === provinceId);
    if (provinceData) {
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        province: provinceData,
      });
    }
  };

  const handleMouseLeave = () => setTooltip(null);
  const hoveredId = tooltip ? tooltip.province.id : null;

   // Modern color scheme for wool production
   const mapColor = '#1e40af'; // Modern blue for wool
   const hoverColor = '#3b82f6'; // Lighter blue for hover

   const getColor = useCallback((price: number) => {
     if (!mapData || mapData.length === 0) return mapColor;
     
     // Get all prices (certified and non-certified) for color scaling
     const allPrices = mapData.flatMap(p => [
       p.certified_avg > 0 ? p.certified_avg : 0,
       p.non_certified_avg > 0 ? p.non_certified_avg : 0
     ]).filter(p => p > 0);
     
     if (allPrices.length === 0) return mapColor;
     
     const maxPrice = Math.max(...allPrices);
     const minPrice = Math.min(...allPrices);
     const range = maxPrice - minPrice;
     
     if (range === 0) return mapColor;
     
     const ratio = (price - minPrice) / range;
     
     // Color scale from light blue (low) to dark blue (high)
     if (ratio < 0.2) return '#dbeafe'; // Light blue
     if (ratio < 0.4) return '#bfdbfe'; // Blue
     if (ratio < 0.6) return '#93c5fd'; // Medium blue
     if (ratio < 0.8) return '#60a5fa'; // Dark blue
     return '#3b82f6'; // Darker blue
   }, [mapData]);

  return (
    <div className="w-full">
       <div className="mb-6">
         <h3 className="text-2xl font-bold text-gray-800 mb-2">
           Provincial Top 10 Prices
         </h3>
         <p className="text-gray-600 text-sm">
           Interactive map showing average prices from top 10 wool lots across South African provinces
         </p>
       </div>

      <div className="relative" onMouseLeave={handleMouseLeave}>
        <div className="p-6 rounded-2xl bg-white shadow-lg border border-gray-100">
          <SouthAfricaMap
            data={mapData}
            onMouseMove={handleMouseMove}
            hoveredId={hoveredId}
            getColor={getColor}
          />
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-600 flex items-start">
            <span className="text-blue-500 mr-2">*</span>
            <span>
              This is the average prices per province in the top 10 for this auction. Certified and non-certified respectively.
            </span>
          </p>
        </div>
      </div>

      {tooltip && (
        <div
          style={{
            position: 'fixed',
            top: Math.min(tooltip.y + 15, window.innerHeight - 150),
            left: Math.min(
              Math.max(tooltip.x - 80, 10),
              window.innerWidth - 180
            ),
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          <Tooltip province={tooltip.province} />
        </div>
      )}
    </div>
  );
};

export default ProvincePriceMap;
