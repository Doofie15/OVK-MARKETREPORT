import React from 'react';

const PublicHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="w-[95%] max-w-none mx-auto px-2 sm:px-4 py-3 flex items-center">
        <div className="flex items-center gap-4">
          <img 
            src="/assets/logos/ovk-logo-embedded.svg" 
            alt="OVK Logo" 
            className="w-20 h-20 drop-shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">OVK WOOL MARKET REPORT</h1>
            <p className="text-base font-medium" style={{ color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        
      </div>
    </header>
  );
};

export default PublicHeader;
