import React from 'react';

interface HeaderProps {
  onToggleAdminView: () => void;
  viewMode: 'report' | 'admin_list' | 'admin_form';
}

const Header: React.FC<HeaderProps> = ({ onToggleAdminView, viewMode }) => {
  const isAdminView = viewMode !== 'report';
  return (
    <header className="bg-brand-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 md:px-8 flex justify-between items-center">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">OVK Wool & Mohair Market Platform</h1>
            <p className="text-md text-blue-200 mt-1">Weekly Auction Interactive Report</p>
        </div>
        <button
            onClick={onToggleAdminView}
            className="bg-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
            {isAdminView ? 'Back to Reports' : 'Admin Panel'}
        </button>
      </div>
    </header>
  );
};

export default Header;
