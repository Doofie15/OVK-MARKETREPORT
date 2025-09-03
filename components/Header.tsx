import React from 'react';

interface HeaderProps {
  onToggleAdminView: () => void;
  viewMode: 'report' | 'admin_list' | 'admin_form';
}

const Header: React.FC<HeaderProps> = ({ onToggleAdminView, viewMode }) => {
  const isAdminView = viewMode !== 'report';
  
  return (
    <header className="app-header glass-effect sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
            <span className="text-xl font-bold text-white">OVK</span>
          </div>
          <div>
            <h1 className="text-hero gradient-text">GLOBAL WOOL INTELLIGENCE</h1>
            <p className="text-small" style={{ color: 'var(--text-muted)' }}>
              Innovate. Sustain. Connect. - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-2">
              <a href="#overview" className={`nav-link ${viewMode === 'report' ? 'active' : ''}`}>
                Market Overview
              </a>
              <a href="#analytics" className="nav-link">Analytics</a>
              <a href="#insights" className="nav-link">Insights</a>
            </nav>
          </div>
          
          <button
            onClick={onToggleAdminView}
            className={isAdminView ? 'btn-secondary' : 'btn-primary'}
          >
            {isAdminView ? '← Back to Reports' : '⚙️ Admin Panel'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
