import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // ALWAYS force light mode for all devices (web and mobile)
    const html = document.documentElement;
    html.classList.remove('dark');
    setIsDarkMode(false);
    
    // Debug: uncomment next line to debug
    // console.log('Light mode enforced for all devices');
    
    // Optional: Listen for window resize to ensure light mode is maintained
    const handleResize = () => {
      // Always ensure light mode regardless of device type
      html.classList.remove('dark');
      setIsDarkMode(false);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isDarkMode;
};
