import React from 'react';

interface HeaderProps {
  onToggleAdminView: () => void;
  viewMode: 'report' | 'admin';
}

const Header: React.FC<HeaderProps> = ({ onToggleAdminView, viewMode }) => {
  const isAdminView = viewMode !== 'report';
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
            src="/assets/logos/ovk-logo-embedded.svg" 
            alt="OVK Logo" 
            className="w-20 h-20 drop-shadow-lg"
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-600">OVK WOOL MARKET REPORT</h1>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex gap-1">
              <a href="#overview" className={`nav-link text-sm ${viewMode === 'report' ? 'active' : ''}`}>
                Market Overview
              </a>
              <a href="#analytics" className="nav-link text-sm">Analytics</a>
              <a href="#insights" className="nav-link text-sm">Insights</a>
            </nav>
          </div>
          
          <button
            onClick={onToggleAdminView}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
              isAdminView 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
            }`}
          >
            {isAdminView ? '← Back to Reports' : '⚙️ Admin Panel'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
