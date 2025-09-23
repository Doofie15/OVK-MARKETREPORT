import React, { useState, useCallback } from 'react';
import type { ProvincialProducerData } from '../../types';
import zaGeoJSON from '../../za.json';

interface MobileProvincePriceMapProps {
  data: ProvincialProducerData[];
}

const MobileSouthAfricaMap = ({
  data,
  onTouch,
  selectedId,
  getColor,
  onMouseEnter,
  onMouseLeave,
  hoveredId,
}: {
  data: { id: string; name: string; certified_avg: number; non_certified_avg: number; has_non_certified: boolean }[];
  onTouch: (id: string) => void;
  selectedId: string | null;
  getColor: (price: number) => string;
  onMouseEnter: (e: React.MouseEvent, id: string) => void;
  onMouseLeave: () => void;
  hoveredId: string | null;
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

  // Coordinate conversion for mobile (smaller viewBox)
  const coordinatesToPath = useCallback(
    (coordinates: number[][][] | number[][][][]) => {
      try {
        const coords = Array.isArray(coordinates[0][0][0])
          ? (coordinates as number[][][][])
          : [coordinates as number[][][]];

        // South Africa bounds for mobile viewBox (300x250)
        const minLon = 16.5, maxLon = 32.9;
        const minLat = -34.8, maxLat = -22.1;

        return coords
          .map((polygon) => {
            return polygon
              .map((ring, ringIndex) => {
                const pathData = ring
                  .map((coord, coordIndex) => {
                    const x = ((coord[0] - minLon) / (maxLon - minLon)) * 250 + 25;
                    const y = ((maxLat - coord[1]) / (maxLat - minLat)) * 200 + 25;
                    return `${coordIndex === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
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

  // Calculate center points for labels
  const getLabelPosition = (coordinates: number[][][] | number[][][][], geoId: string) => {
    const coords = Array.isArray(coordinates[0][0][0])
      ? (coordinates as number[][][][])
      : [coordinates as number[][][]];

    const minLon = 16.5, maxLon = 32.9;
    const minLat = -34.8, maxLat = -22.1;

    const firstRing = coords[0][0];
    const bounds = firstRing.reduce(
      (acc, coord) => {
        const x = ((coord[0] - minLon) / (maxLon - minLon)) * 250 + 25;
        const y = ((maxLat - coord[1]) / (maxLat - minLat)) * 200 + 25;
        return {
          minX: Math.min(acc.minX, x),
          maxX: Math.max(acc.maxX, x),
          minY: Math.min(acc.minY, y),
          maxY: Math.max(acc.maxY, y),
        };
      },
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );

    // Calculate center point
    let centerX = (bounds.minX + bounds.maxX) / 2;
    let centerY = (bounds.minY + bounds.maxY) / 2;

    // Adjust positioning for specific provinces on mobile
    const provinceWidth = bounds.maxX - bounds.minX;
    const provinceHeight = bounds.maxY - bounds.minY;

    if (geoId === 'ZAKZN') {
      centerY = bounds.minY + (provinceHeight * 0.4);
    } else if (geoId === 'ZAEC') {
      centerX = bounds.minX + (provinceWidth * 0.4);
      centerY = bounds.minY + (provinceHeight * 0.7);
    } else if (geoId === 'ZAWC') {
      centerY = bounds.minY + (provinceHeight * 0.7);
    } else if (geoId === 'ZANC') {
      centerY = bounds.minY + (provinceHeight * 0.6);
    } else if (geoId === 'ZAGP') {
      centerY = bounds.minY + (provinceHeight * 0.6);
    } else if (geoId === 'ZAMP') {
      centerY = bounds.minY + (provinceHeight * 0.6);
    } else if (geoId === 'ZAFS') {
      centerX = bounds.minX + (provinceWidth * 0.3);
      centerY = bounds.minY + (provinceHeight * 0.6);
    }

    return { centerX, centerY };
  };

  return (
    <div className="w-full" style={{ aspectRatio: '6/5', maxHeight: '300px' }}>
      <svg
        viewBox="0 0 300 250"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Map of South Africa"
      >
      {/* Background */}
      <rect width="300" height="250" fill="transparent" />

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
          const isSelected = selectedId === componentId;
          const isHovered = hoveredId === componentId;
          const { centerX, centerY } = getLabelPosition(coordinates, geoId);

          return (
            <g key={geoId}>
              <path
                d={pathData}
                fill={provinceData ? getColor(isHovered ? (provinceData.certified_avg > 0 ? provinceData.certified_avg : provinceData.non_certified_avg) + 5 : (provinceData.certified_avg > 0 ? provinceData.certified_avg : provinceData.non_certified_avg)) : '#1e40af'}
                stroke="#ffffff"
                strokeWidth={isSelected ? '3' : '1.5'}
                onTouchStart={() => onTouch(componentId)}
                onMouseEnter={(e) => onMouseEnter(e, componentId)}
                onMouseLeave={onMouseLeave}
                className={`transition-all duration-300 cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-90'}`}
                style={{
                  filter: isSelected
                    ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                    : isHovered
                    ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    : 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                }}
              />
              
              {/* Province Label */}
              <text
                x={centerX}
                y={centerY}
                className="pointer-events-none"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isSelected || isHovered ? '#ffffff' : '#374151'}
                style={{
                  textShadow: isSelected || isHovered
                    ? '0 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.3)'
                    : '0 1px 2px rgba(255,255,255,0.8)',
                  fontSize: '8px',
                  fontWeight: '600',
                  letterSpacing: '0.025em',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {provinceData.name.split(' ')[0]}
              </text>
              
              {/* Price Label - Show certified average, or non-certified if no certified */}
              <text
                x={centerX}
                y={centerY + 8}
                className="pointer-events-none"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isSelected || isHovered ? '#ffffff' : '#6b7280'}
                style={{
                  textShadow: isSelected || isHovered
                    ? '0 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.3)'
                    : '0 1px 2px rgba(255,255,255,0.8)',
                  fontSize: '6px',
                  fontWeight: '500',
                  letterSpacing: '0.025em',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                R{provinceData ? (provinceData.certified_avg > 0 ? provinceData.certified_avg.toFixed(1) : provinceData.non_certified_avg.toFixed(1)) : '0.0'}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
    </div>
  );
};

const MobileTooltip: React.FC<{ province: { id: string; name: string; certified_avg: number; non_certified_avg: number; has_non_certified: boolean }; x: number; y: number; containerRect: DOMRect }> = ({ province, x, y, containerRect }) => {
  // Calculate tooltip position relative to the container
  const tooltipWidth = 140;
  const tooltipHeight = 60;
  
  // Position relative to the map container
  const relativeX = x - containerRect.left;
  const relativeY = y - containerRect.top;
  
  // Calculate final position, keeping tooltip within container bounds
  let finalX = relativeX - (tooltipWidth / 2);
  let finalY = relativeY - tooltipHeight - 10;
  
  // Adjust if tooltip would go outside container bounds
  if (finalX < 10) finalX = 10;
  if (finalX + tooltipWidth > containerRect.width - 10) finalX = containerRect.width - tooltipWidth - 10;
  if (finalY < 10) finalY = relativeY + 10; // Show below cursor if no space above
  
  return (
    <div
      className="p-2 rounded-lg shadow-lg z-10 text-center border border-white/20 backdrop-blur-sm"
      style={{
        position: 'absolute',
        top: finalY,
        left: finalX,
        width: tooltipWidth,
        background: 'rgba(255,255,255,0.95)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <div className="flex items-center justify-center mb-1">
        <div
          className="w-2 h-2 rounded-full mr-1"
          style={{ backgroundColor: '#1e40af' }}
        ></div>
        <p className="font-bold text-sm text-gray-800">{province.name}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
          <p className="text-xs font-semibold" style={{ color: '#10b981' }}>
            Certified: R{province.certified_avg.toFixed(1)}/kg
          </p>
        </div>
        {province.has_non_certified && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
            <p className="text-xs font-semibold" style={{ color: '#3b82f6' }}>
              Merino: R{province.non_certified_avg.toFixed(1)}/kg
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const MobileProvincePriceMap: React.FC<MobileProvincePriceMapProps> = ({ data }) => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    province: { id: string; name: string; certified_avg: number; non_certified_avg: number; has_non_certified: boolean };
    containerRect: DOMRect;
  } | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

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

  // Use real data only - no fallback to sample data
  const mapData = data && data.length > 0 ? calculateProvincialAverages(data) : [];

  const getColor = useCallback((price: number) => {
    if (!mapData || mapData.length === 0) return '#e5e7eb';
    
    // Get all prices (certified and non-certified) for color scaling
    const allPrices = mapData.flatMap(p => [
      p.certified_avg > 0 ? p.certified_avg : 0,
      p.non_certified_avg > 0 ? p.non_certified_avg : 0
    ]).filter(p => p > 0);
    
    if (allPrices.length === 0) return '#e5e7eb';
    
    const maxPrice = Math.max(...allPrices);
    const minPrice = Math.min(...allPrices);
    const range = maxPrice - minPrice;
    
    if (range === 0) return '#e5e7eb';
    
    const ratio = (price - minPrice) / range;
    
    // Color scale from light blue (low) to dark blue (high)
    if (ratio < 0.2) return '#dbeafe'; // Light blue
    if (ratio < 0.4) return '#bfdbfe'; // Blue
    if (ratio < 0.6) return '#93c5fd'; // Medium blue
    if (ratio < 0.8) return '#60a5fa'; // Dark blue
    return '#3b82f6'; // Darker blue
  }, [mapData]);

  const handleTouch = (provinceId: string) => {
    setSelectedProvince(selectedProvince === provinceId ? null : provinceId);
  };

  const handleMouseEnter = (e: React.MouseEvent, provinceId: string) => {
    const provinceData = mapData.find((p) => p.id === provinceId);
    if (provinceData && containerRef) {
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        province: provinceData,
        containerRect: containerRef.getBoundingClientRect(),
      });
    }
  };

  const handleMouseLeave = () => setTooltip(null);

  const selectedProvinceData = selectedProvince 
    ? mapData.find(p => p.id === selectedProvince) 
    : null;

  return (
    <div className="w-full">
      {/* Map */}
      <div 
        ref={setContainerRef}
        className="w-full relative" 
        onMouseLeave={handleMouseLeave}
      >
        <MobileSouthAfricaMap
          data={mapData}
          onTouch={handleTouch}
          selectedId={selectedProvince}
          getColor={getColor}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          hoveredId={tooltip ? tooltip.province.id : null}
        />
        
        {/* Tooltip */}
        {tooltip && (
          <MobileTooltip
            province={tooltip.province}
            x={tooltip.x}
            y={tooltip.y}
            containerRect={tooltip.containerRect}
          />
        )}
      </div>

      {/* Selected Province Info */}
      {selectedProvinceData && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center mb-2">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: '#1e40af' }}
            ></div>
            <h4 className="font-bold text-sm text-gray-800">{selectedProvinceData.name}</h4>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                <p className="text-xs font-semibold" style={{ color: '#10b981' }}>
                  Certified:
                </p>
              </div>
              <p className="text-xs font-semibold" style={{ color: '#10b981' }}>
                R{selectedProvinceData.certified_avg.toFixed(1)}/kg
              </p>
            </div>
            {selectedProvinceData.has_non_certified && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
                  <p className="text-xs font-semibold" style={{ color: '#3b82f6' }}>
                    Merino:
                  </p>
                </div>
                <p className="text-xs font-semibold" style={{ color: '#3b82f6' }}>
                  R{selectedProvinceData.non_certified_avg.toFixed(1)}/kg
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default MobileProvincePriceMap;