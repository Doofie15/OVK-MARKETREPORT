import React, { ReactNode } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

interface DarkModeProviderProps {
  children: ReactNode;
}

const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  // This hook automatically handles dark mode detection and applies the 'dark' class to html
  useDarkMode();
  
  return <>{children}</>;
};

export default DarkModeProvider;
