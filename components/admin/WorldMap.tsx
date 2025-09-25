import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '../../lib/googleMapsLoader';

interface CountryData {
  country: string;
  unique_visitors: number;
  pageviews: number;
  auction_views: number;
  avg_time_on_page: number;
}

interface WorldMapProps {
  data: CountryData[];
  height?: number;
}

declare global {
  interface Window {
    google: any;
  }
}

const WorldMap: React.FC<WorldMapProps> = ({ data, height = 400 }) => {
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

    // Initialize the map
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      zoom: 2,
      center: { lat: 20, lng: 0 },
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'administrative',
          elementType: 'geometry',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'road',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Country code mapping
    const countryCoordinates: Record<string, { lat: number; lng: number; name: string }> = {
      'ZA': { lat: -30.5595, lng: 22.9375, name: 'South Africa' },
      'US': { lat: 39.8283, lng: -98.5795, name: 'United States' },
      'GB': { lat: 55.3781, lng: -3.4360, name: 'United Kingdom' },
      'AU': { lat: -25.2744, lng: 133.7751, name: 'Australia' },
      'DE': { lat: 51.1657, lng: 10.4515, name: 'Germany' },
      'FR': { lat: 46.2276, lng: 2.2137, name: 'France' },
      'IT': { lat: 41.8719, lng: 12.5674, name: 'Italy' },
      'ES': { lat: 40.4637, lng: -3.7492, name: 'Spain' },
      'CN': { lat: 35.8617, lng: 104.1954, name: 'China' },
      'JP': { lat: 36.2048, lng: 138.2529, name: 'Japan' },
      'BR': { lat: -14.2350, lng: -51.9253, name: 'Brazil' },
      'IN': { lat: 20.5937, lng: 78.9629, name: 'India' },
      'CA': { lat: 56.1304, lng: -106.3468, name: 'Canada' },
    };

    // Add markers for each country
    data.forEach(countryData => {
      const coords = countryCoordinates[countryData.country];
      if (coords) {
        // Calculate marker size based on visitor count
        const maxVisitors = Math.max(...data.map(d => d.unique_visitors));
        const markerSize = Math.max(10, Math.min(50, (countryData.unique_visitors / maxVisitors) * 40));

        // Create custom marker
        const marker = new window.google.maps.Marker({
          position: coords,
          map: mapInstance.current,
          title: coords.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#3B82F6',
            fillOpacity: 0.7,
            strokeColor: '#1E40AF',
            strokeWeight: 2,
            scale: markerSize / 2
          }
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: system-ui;">
              <h3 style="margin: 0 0 8px 0; color: #1F2937;">${coords.name}</h3>
              <div style="font-size: 14px; color: #4B5563;">
                <div><strong>Visitors:</strong> ${countryData.unique_visitors.toLocaleString()}</div>
                <div><strong>Page Views:</strong> ${countryData.pageviews.toLocaleString()}</div>
                <div><strong>Auction Views:</strong> ${countryData.auction_views.toLocaleString()}</div>
                <div><strong>Avg. Time:</strong> ${Math.round(countryData.avg_time_on_page || 0)}s</div>
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance.current, marker);
        });
      }
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
          <p className="text-gray-600">Loading world map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        ref={mapRef} 
        style={{ height: `${height}px`, width: '100%' }}
        className="rounded-lg border border-gray-200"
      />
    </div>
  );
};

export default WorldMap;
