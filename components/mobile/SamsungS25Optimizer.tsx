import React, { useEffect, useState } from 'react';

interface SamsungS25OptimizerProps {
  children: React.ReactNode;
}

interface S25DeviceInfo {
  isS25: boolean;
  screenWidth: number;
  screenHeight: number;
  aspectRatio: number;
  pixelRatio: number;
  orientation: 'portrait' | 'landscape';
}

const SamsungS25Optimizer: React.FC<SamsungS25OptimizerProps> = ({ children }) => {
  const [deviceInfo, setDeviceInfo] = useState<S25DeviceInfo>({
    isS25: false,
    screenWidth: 0,
    screenHeight: 0,
    aspectRatio: 0,
    pixelRatio: 1,
    orientation: 'portrait'
  });

  useEffect(() => {
    const detectS25 = (): S25DeviceInfo => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      const pixelRatio = window.devicePixelRatio || 1;
      const orientation = width > height ? 'landscape' : 'portrait';

      // Samsung S25 detection criteria:
      // - 6.2" screen with 2340x1080 resolution
      // - 19.5:9 aspect ratio
      // - High pixel density (416 PPI)
      const isS25 = (
        // Portrait mode detection
        (orientation === 'portrait' && 
         width >= 360 && width <= 430 && 
         height >= 780 && height <= 950 &&
         aspectRatio >= 1.9 && aspectRatio <= 2.1) ||
        // Landscape mode detection
        (orientation === 'landscape' && 
         width >= 780 && width <= 950 && 
         height >= 360 && height <= 430 &&
         aspectRatio >= 2.0 && aspectRatio <= 2.7) ||
        // High pixel ratio detection (S25 has 416 PPI)
        (pixelRatio >= 3.0 && width <= 430)
      );

      return {
        isS25,
        screenWidth: width,
        screenHeight: height,
        aspectRatio,
        pixelRatio,
        orientation
      };
    };

    const updateDeviceInfo = () => {
      setDeviceInfo(detectS25());
    };

    // Initial detection
    updateDeviceInfo();

    // Listen for orientation and resize changes
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  // Apply S25-specific optimizations
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (deviceInfo.isS25) {
      // Add S25-specific classes
      body.classList.add('samsung-s25-detected');
      html.classList.add('s25-optimized');

      // Optimize for S25's 120Hz refresh rate
      body.style.setProperty('--refresh-rate', '120Hz');
      
      // Optimize for S25's high PPI
      if (deviceInfo.pixelRatio >= 3.0) {
        body.classList.add('high-ppi-display');
      }

      // Orientation-specific optimizations
      if (deviceInfo.orientation === 'landscape') {
        body.classList.add('s25-landscape');
      } else {
        body.classList.add('s25-portrait');
      }

      // Set CSS custom properties for S25 dimensions
      html.style.setProperty('--s25-width', `${deviceInfo.screenWidth}px`);
      html.style.setProperty('--s25-height', `${deviceInfo.screenHeight}px`);
      html.style.setProperty('--s25-aspect-ratio', deviceInfo.aspectRatio.toString());
    } else {
      // Remove S25-specific classes
      body.classList.remove('samsung-s25-detected', 'high-ppi-display', 's25-landscape', 's25-portrait');
      html.classList.remove('s25-optimized');
      
      // Reset CSS custom properties
      body.style.removeProperty('--refresh-rate');
      html.style.removeProperty('--s25-width');
      html.style.removeProperty('--s25-height');
      html.style.removeProperty('--s25-aspect-ratio');
    }

    return () => {
      body.classList.remove('samsung-s25-detected', 'high-ppi-display', 's25-landscape', 's25-portrait');
      html.classList.remove('s25-optimized');
      body.style.removeProperty('--refresh-rate');
      html.style.removeProperty('--s25-width');
      html.style.removeProperty('--s25-height');
      html.style.removeProperty('--s25-aspect-ratio');
    };
  }, [deviceInfo]);

  return (
    <div 
      className={`
        s25-optimizer 
        ${deviceInfo.isS25 ? 's25-active' : ''}
        ${deviceInfo.orientation === 'landscape' ? 's25-landscape-mode' : 's25-portrait-mode'}
      `}
      data-s25-detected={deviceInfo.isS25}
      data-orientation={deviceInfo.orientation}
      data-aspect-ratio={deviceInfo.aspectRatio.toFixed(2)}
      data-pixel-ratio={deviceInfo.pixelRatio}
    >
      {children}
    </div>
  );
};

export default SamsungS25Optimizer;
