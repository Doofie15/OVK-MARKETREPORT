import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

const DarkModeDebugger: React.FC = () => {
  const isDarkMode = useDarkMode();
  
  // Don't show debugger unless explicitly enabled
  if (!window.location.search.includes('darkdebug=true')) {
    return null;
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const htmlHasDarkClass = document.documentElement.classList.contains('dark');

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      padding: '10px',
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '250px'
    }}>
      <div><strong>☀️ Light Mode Only</strong></div>
      <div>Mobile Device: {isMobile ? '📱 YES' : '💻 NO'}</div>
      <div>System Dark: {systemPrefersDark ? '🌙 YES' : '☀️ NO'}</div>
      <div>HTML Dark Class: {htmlHasDarkClass ? '⚠️ YES (ERROR)' : '✅ NO (CORRECT)'}</div>
      <div>App Mode: {isDarkMode ? '⚠️ DARK (ERROR)' : '✅ LIGHT (CORRECT)'}</div>
      <div>Screen Width: {window.innerWidth}px</div>
      <div style={{ marginTop: '5px', fontSize: '10px', opacity: 0.7, color: '#059669' }}>
        ✅ App always uses light mode regardless of system preference
      </div>
    </div>
  );
};

export default DarkModeDebugger;
