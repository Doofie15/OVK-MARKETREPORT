import React, { useState, useEffect } from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
  mobileComponent?: React.ReactNode;
  breakpoint?: number;
}

interface DeviceInfo {
  isMobile: boolean;
  isSamsungS25: boolean;
  screenWidth: number;
  screenHeight: number;
  aspectRatio: number;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  mobileComponent, 
  breakpoint = 768 
}) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isSamsungS25: false,
    screenWidth: 0,
    screenHeight: 0,
    aspectRatio: 0
  });

  useEffect(() => {
    const checkDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      
      // Samsung S25 detection: 6.2" 2340x1080 19.5:9 aspect ratio
      // Approximate viewport dimensions for S25
      const isSamsungS25 = (
        (width >= 360 && width <= 430 && height >= 780 && height <= 950) ||
        (aspectRatio >= 1.9 && aspectRatio <= 2.1 && width <= 430)
      );
      
      const isMobile = width < breakpoint;
      
      setDeviceInfo({
        isMobile,
        isSamsungS25,
        screenWidth: width,
        screenHeight: height,
        aspectRatio
      });
    };

    // Check on mount
    checkDeviceInfo();

    // Add event listener
    window.addEventListener('resize', checkDeviceInfo);

    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceInfo);
  }, [breakpoint]);

  // Add device-specific classes to body for CSS targeting
  useEffect(() => {
    const body = document.body;
    
    // Remove existing device classes
    body.classList.remove('samsung-s25', 'mobile-device');
    
    // Add appropriate classes
    if (deviceInfo.isSamsungS25) {
      body.classList.add('samsung-s25');
    }
    if (deviceInfo.isMobile) {
      body.classList.add('mobile-device');
    }
    
    return () => {
      body.classList.remove('samsung-s25', 'mobile-device');
    };
  }, [deviceInfo]);

  // If mobile component is provided and we're on mobile, use it
  if (deviceInfo.isMobile && mobileComponent) {
    return <div className={`mobile-layout ${deviceInfo.isSamsungS25 ? 'samsung-s25-layout' : ''}`}>
      {mobileComponent}
    </div>;
  }

  // Otherwise, use the default children
  return <>{children}</>;
};

export default MobileLayout;
