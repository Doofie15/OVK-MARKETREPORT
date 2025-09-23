import React, { useState, useEffect, useRef } from 'react';
import SamsungS25Optimizer from './SamsungS25Optimizer';

interface EnhancedMobileLayoutProps {
  children: React.ReactNode;
  mobileComponent?: React.ReactNode;
  breakpoint?: number;
  fallbackToDesktop?: boolean;
  enableDebug?: boolean;
}

interface DeviceDetection {
  isMobile: boolean;
  isTablet: boolean;
  isSamsungS25: boolean;
  isChrome: boolean;
  isSamsungBrowser: boolean;
  screenWidth: number;
  screenHeight: number;
  aspectRatio: number;
  pixelRatio: number;
  orientation: 'portrait' | 'landscape';
  userAgent: string;
  hasError: boolean;
  supportsTouch: boolean;
}

const EnhancedMobileLayout: React.FC<EnhancedMobileLayoutProps> = ({ 
  children, 
  mobileComponent, 
  breakpoint = 768,
  fallbackToDesktop = true,
  enableDebug = false
}) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceDetection>({
    isMobile: false,
    isTablet: false,
    isSamsungS25: false,
    isChrome: false,
    isSamsungBrowser: false,
    screenWidth: 0,
    screenHeight: 0,
    aspectRatio: 0,
    pixelRatio: 1,
    orientation: 'portrait',
    userAgent: '',
    hasError: false,
    supportsTouch: false
  });

  const [mounted, setMounted] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const detectionAttempts = useRef(0);

  const detectDevice = (): DeviceDetection => {
    try {
      const width = window.innerWidth || document.documentElement.clientWidth || screen.width || 0;
      const height = window.innerHeight || document.documentElement.clientHeight || screen.height || 0;
      const aspectRatio = width / height;
      const pixelRatio = window.devicePixelRatio || 1;
      const orientation = width > height ? 'landscape' : 'portrait';
      const userAgent = navigator.userAgent || '';
      const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Enhanced browser detection
      const isChrome = /Chrome/.test(userAgent) && !/Edge|Edg/.test(userAgent);
      const isSamsungBrowser = /SamsungBrowser/.test(userAgent);

      // Enhanced Samsung S25 detection
      // S25: 6.2" AMOLED 2340×1080 pixels, 416 PPI, 19.5:9 aspect ratio
      const isSamsungS25 = (
        // Viewport-based detection (common S25 viewport sizes)
        (orientation === 'portrait' && 
         width >= 360 && width <= 430 && 
         height >= 740 && height <= 950 &&
         aspectRatio >= 1.8 && aspectRatio <= 2.2) ||
        
        // Landscape detection
        (orientation === 'landscape' && 
         width >= 740 && width <= 950 && 
         height >= 360 && height <= 430 &&
         aspectRatio >= 1.8 && aspectRatio <= 2.8) ||
        
        // High DPI detection for S25 (416 PPI ≈ 3.0+ device pixel ratio)
        (pixelRatio >= 2.75 && pixelRatio <= 4.0 && width <= 430) ||
        
        // User agent hints for Samsung devices
        (/Samsung/.test(userAgent) && width <= 430 && aspectRatio >= 1.8)
      );

      // Mobile/Tablet detection
      const isMobile = width < breakpoint;
      const isTablet = width >= 768 && width < 1024 && supportsTouch;

      return {
        isMobile,
        isTablet,
        isSamsungS25,
        isChrome,
        isSamsungBrowser,
        screenWidth: width,
        screenHeight: height,
        aspectRatio,
        pixelRatio,
        orientation,
        userAgent,
        hasError: false,
        supportsTouch
      };

    } catch (error) {
      console.error('Enhanced device detection error:', error);
      detectionAttempts.current++;
      
      return {
        isMobile: false,
        isTablet: false,
        isSamsungS25: false,
        isChrome: false,
        isSamsungBrowser: false,
        screenWidth: 0,
        screenHeight: 0,
        aspectRatio: 0,
        pixelRatio: 1,
        orientation: 'portrait',
        userAgent: '',
        hasError: true,
        supportsTouch: false
      };
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateDeviceInfo = () => {
      const newDeviceInfo = detectDevice();
      setDeviceInfo(newDeviceInfo);
      
      if (enableDebug) {
        console.log('Enhanced Device Detection:', newDeviceInfo);
      }
    };

    // Initial detection with small delay to ensure DOM is ready
    timeoutId = setTimeout(() => {
      updateDeviceInfo();
      setMounted(true);
    }, 50);

    // Debounced resize handler
    let resizeTimeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeoutId);
      resizeTimeoutId = setTimeout(updateDeviceInfo, 150);
    };

    // Event listeners
    window.addEventListener('resize', debouncedResize, { passive: true });
    window.addEventListener('orientationchange', debouncedResize, { passive: true });
    
    // Retry mechanism for failed detections
    if (detectionAttempts.current > 0 && detectionAttempts.current < 3) {
      const retryTimeout = setTimeout(updateDeviceInfo, 1000);
      return () => clearTimeout(retryTimeout);
    }

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(resizeTimeoutId);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', debouncedResize);
    };
  }, [breakpoint, enableDebug]);

  // Add CSS classes for device targeting
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    // Remove existing classes
    body.classList.remove(
      'enhanced-mobile', 'enhanced-tablet', 'enhanced-samsung-s25',
      'enhanced-chrome', 'enhanced-samsung-browser', 'enhanced-touch',
      'enhanced-portrait', 'enhanced-landscape', 'enhanced-high-dpi'
    );

    if (mounted && !deviceInfo.hasError) {
      // Add device-specific classes
      if (deviceInfo.isMobile) body.classList.add('enhanced-mobile');
      if (deviceInfo.isTablet) body.classList.add('enhanced-tablet');
      if (deviceInfo.isSamsungS25) body.classList.add('enhanced-samsung-s25');
      if (deviceInfo.isChrome) body.classList.add('enhanced-chrome');
      if (deviceInfo.isSamsungBrowser) body.classList.add('enhanced-samsung-browser');
      if (deviceInfo.supportsTouch) body.classList.add('enhanced-touch');
      if (deviceInfo.orientation === 'portrait') body.classList.add('enhanced-portrait');
      if (deviceInfo.orientation === 'landscape') body.classList.add('enhanced-landscape');
      if (deviceInfo.pixelRatio >= 2.5) body.classList.add('enhanced-high-dpi');

      // Set CSS custom properties
      html.style.setProperty('--device-width', `${deviceInfo.screenWidth}px`);
      html.style.setProperty('--device-height', `${deviceInfo.screenHeight}px`);
      html.style.setProperty('--device-aspect-ratio', deviceInfo.aspectRatio.toFixed(2));
      html.style.setProperty('--device-pixel-ratio', deviceInfo.pixelRatio.toString());
    }

    return () => {
      body.classList.remove(
        'enhanced-mobile', 'enhanced-tablet', 'enhanced-samsung-s25',
        'enhanced-chrome', 'enhanced-samsung-browser', 'enhanced-touch',
        'enhanced-portrait', 'enhanced-landscape', 'enhanced-high-dpi'
      );
    };
  }, [deviceInfo, mounted]);

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Optimizing for your device...</p>
        </div>
      </div>
    );
  }

  // Error fallback
  if (deviceInfo.hasError && detectionAttempts.current >= 3) {
    if (fallbackToDesktop) {
      console.warn('Enhanced Mobile Layout: Multiple detection failures, falling back to desktop');
      return <>{children}</>;
    }
    
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Device Detection Error</h2>
          <p className="text-gray-600 mb-4">
            Unable to optimize for your device. Please refresh the page.
          </p>
          <button
            onClick={() => {
              detectionAttempts.current = 0;
              setRenderKey(prev => prev + 1);
              window.location.reload();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Render mobile-optimized content
  if ((deviceInfo.isMobile || deviceInfo.isTablet) && mobileComponent) {
    const MobileContent = (
      <div 
        key={renderKey}
        className={`
          enhanced-mobile-layout
          ${deviceInfo.isSamsungS25 ? 'samsung-s25-optimized' : ''}
          ${deviceInfo.isChrome ? 'chrome-optimized' : ''}
          ${deviceInfo.orientation === 'landscape' ? 'landscape-mode' : 'portrait-mode'}
        `}
        data-device-info={JSON.stringify({
          isSamsungS25: deviceInfo.isSamsungS25,
          orientation: deviceInfo.orientation,
          screenWidth: deviceInfo.screenWidth,
          aspectRatio: deviceInfo.aspectRatio.toFixed(2)
        })}
      >
        {mobileComponent}
      </div>
    );

    // Wrap with Samsung S25 optimizer if detected
    if (deviceInfo.isSamsungS25) {
      return (
        <SamsungS25Optimizer>
          {MobileContent}
        </SamsungS25Optimizer>
      );
    }

    return MobileContent;
  }

  // Default desktop layout
  return <>{children}</>;
};

export default EnhancedMobileLayout;
