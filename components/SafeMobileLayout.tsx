import React, { useState, useEffect } from 'react';

interface SafeMobileLayoutProps {
  children: React.ReactNode;
  mobileComponent?: React.ReactNode;
  breakpoint?: number;
  fallbackToDesktop?: boolean;
}

interface DeviceInfo {
  isMobile: boolean;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  hasError: boolean;
}

const SafeMobileLayout: React.FC<SafeMobileLayoutProps> = ({ 
  children, 
  mobileComponent, 
  breakpoint = 768,
  fallbackToDesktop = true
}) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    screenWidth: 0,
    screenHeight: 0,
    userAgent: '',
    hasError: false
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkDeviceInfo = () => {
      try {
        const width = window.innerWidth || document.documentElement.clientWidth || 0;
        const height = window.innerHeight || document.documentElement.clientHeight || 0;
        const userAgent = navigator.userAgent || '';
        
        // Simple mobile detection - more reliable than complex logic
        const isMobile = width < breakpoint;
        
        setDeviceInfo({
          isMobile,
          screenWidth: width,
          screenHeight: height,
          userAgent,
          hasError: false
        });
      } catch (error) {
        console.error('Error in device detection:', error);
        setDeviceInfo(prev => ({
          ...prev,
          hasError: true,
          isMobile: false // Fallback to desktop on error
        }));
      }
    };

    // Initial check
    checkDeviceInfo();
    setMounted(true);

    // Add resize listener with debouncing
    let timeoutId: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDeviceInfo, 100);
    };

    window.addEventListener('resize', debouncedCheck);
    window.addEventListener('orientationchange', debouncedCheck);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedCheck);
      window.removeEventListener('orientationchange', debouncedCheck);
    };
  }, [breakpoint]);

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  // If there's an error in device detection, always show desktop version
  if (deviceInfo.hasError && fallbackToDesktop) {
    console.warn('SafeMobileLayout: Error detected, falling back to desktop layout');
    return <>{children}</>;
  }

  // If mobile component is provided and we're on mobile, try to use it
  if (deviceInfo.isMobile && mobileComponent) {
    try {
      return (
        <div className="mobile-layout safe-mobile-wrapper">
          {mobileComponent}
        </div>
      );
    } catch (error) {
      console.error('Error rendering mobile component:', error);
      // Fallback to desktop layout if mobile component fails
      if (fallbackToDesktop) {
        return <>{children}</>;
      }
      
      // Show error message if no fallback
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Mobile Layout Error</h2>
            <p className="text-gray-600 mb-4">There was an issue loading the mobile version.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
  }

  // Default to desktop layout
  return <>{children}</>;
};

export default SafeMobileLayout;
