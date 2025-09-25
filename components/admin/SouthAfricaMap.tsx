import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '../../lib/googleMapsLoader';

interface ProvinceData {
  country: string;
  region?: string;
  unique_visitors: number;
  pageviews: number;
  auction_views: number;
  avg_time_on_page: number;
  coordinates?: {
    lat: number;
    lng: number;
    name: string;
  };
}

interface SouthAfricaMapProps {
  data: ProvinceData[];
  height?: number;
}

declare global {
  interface Window {
    google: any;
  }
}

const SouthAfricaMap: React.FC<SouthAfricaMapProps> = ({ data, height = 400 }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadGoogleMaps();
        setIsLoaded(true);
      } catch (err) {
        setError('Failed to load Google Maps');
      }
    };

    initializeMap();
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isLoaded || !window.google) return;

    // Initialize the map centered on South Africa
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      zoom: 6,
      center: { lat: -28.5, lng: 24.5 },
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'administrative.province',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#3B82F6', weight: 2 }]
        },
        {
          featureType: 'administrative.province',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // South African provinces with coordinates
    const provinceData: Record<string, { lat: number; lng: number; name: string }> = {
      'WC': { lat: -33.9249, lng: 18.4241, name: 'Western Cape' },
      'GP': { lat: -26.2041, lng: 28.0473, name: 'Gauteng' },
      'NC': { lat: -28.7282, lng: 24.7499, name: 'Northern Cape' },
      'EC': { lat: -32.2968, lng: 26.4194, name: 'Eastern Cape' },
      'FS': { lat: -29.1175, lng: 26.2309, name: 'Free State' },
      'KN': { lat: -29.6082, lng: 30.3794, name: 'KwaZulu-Natal' },
      'LP': { lat: -23.9045, lng: 29.4689, name: 'Limpopo' },
      'MP': { lat: -25.5653, lng: 30.5279, name: 'Mpumalanga' },
      'NW': { lat: -26.6638, lng: 25.2837, name: 'North West' }
    };

    // Filter South African data
    const saData = data.filter(d => d.country === 'ZA');
    
    if (saData.length === 0) return;

    // Calculate max visitors for scaling
    const maxVisitors = Math.max(...saData.map(d => d.unique_visitors));

    // Add markers for each province
    saData.forEach(provinceInfo => {
      const provinceCode = provinceInfo.region;
      let coords;
      
      if (provinceCode && provinceData[provinceCode]) {
        coords = provinceData[provinceCode];
      } else if (provinceInfo.coordinates) {
        coords = provinceInfo.coordinates;
      } else {
        // Default to center of SA if no province specified
        coords = { lat: -28.5, lng: 24.5, name: 'South Africa' };
      }

      // Calculate marker size based on visitor count
      const markerSize = Math.max(15, Math.min(60, (provinceInfo.unique_visitors / maxVisitors) * 50));

      // Create custom marker with wool/farming themed icon
      const marker = new window.google.maps.Marker({
        position: coords,
        map: mapInstance.current,
        title: coords.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#10B981', // Green for agricultural theme
          fillOpacity: 0.8,
          strokeColor: '#059669',
          strokeWeight: 3,
          scale: markerSize / 3
        }
      });

      // Create detailed info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; font-family: system-ui; max-width: 280px;">
            <h3 style="margin: 0 0 10px 0; color: #1F2937; display: flex; items-center;">
              <span style="width: 12px; height: 12px; background: #10B981; border-radius: 50%; margin-right: 8px;"></span>
              ${coords.name}
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; color: #4B5563;">
              <div>
                <div style="font-weight: 600; color: #374151;">Visitors</div>
                <div style="font-size: 16px; font-weight: 700; color: #10B981;">${provinceInfo.unique_visitors.toLocaleString()}</div>
              </div>
              <div>
                <div style="font-weight: 600; color: #374151;">Page Views</div>
                <div style="font-size: 16px; font-weight: 700; color: #3B82F6;">${provinceInfo.pageviews.toLocaleString()}</div>
              </div>
              <div>
                <div style="font-weight: 600; color: #374151;">Auction Views</div>
                <div style="font-size: 16px; font-weight: 700; color: #F59E0B;">${provinceInfo.auction_views.toLocaleString()}</div>
              </div>
              <div>
                <div style="font-weight: 600; color: #374151;">Avg. Time</div>
                <div style="font-size: 16px; font-weight: 700; color: #8B5CF6;">${Math.round(provinceInfo.avg_time_on_page || 0)}s</div>
              </div>
            </div>
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #6B7280;">
              Click to explore more regional insights
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance.current, marker);
      });

      // Add hover effect
      marker.addListener('mouseover', () => {
        marker.setIcon({
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#059669',
          fillOpacity: 1,
          strokeColor: '#047857',
          strokeWeight: 4,
          scale: (markerSize / 3) + 2
        });
      });

      marker.addListener('mouseout', () => {
        marker.setIcon({
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#10B981',
          fillOpacity: 0.8,
          strokeColor: '#059669',
          strokeWeight: 3,
          scale: markerSize / 3
        });
      });
    });

  }, [data, isLoaded]);

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5C3.312 18.333 4.772 20 6.314 20z" />
          </svg>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading South Africa map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        ref={mapRef} 
        style={{ height: `${height}px`, width: '100%' }}
        className="rounded-lg border border-gray-200 shadow-sm"
      />
    </div>
  );
};

export default SouthAfricaMap;
