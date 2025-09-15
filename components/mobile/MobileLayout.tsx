import React, { useState, useEffect } from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
  mobileComponent?: React.ReactNode;
  breakpoint?: number;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  mobileComponent, 
  breakpoint = 768 
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  // If mobile component is provided and we're on mobile, use it
  if (isMobile && mobileComponent) {
    return <>{mobileComponent}</>;
  }

  // Otherwise, use the default children
  return <>{children}</>;
};

export default MobileLayout;
