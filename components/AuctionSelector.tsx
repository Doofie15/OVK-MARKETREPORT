
import React from 'react';

interface AuctionSelectorProps {
  weeks: { id: string; label: string }[];
  selectedWeekId: string;
  onWeekChange: (weekId: string) => void;
}

const ModernSelector: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  icon: React.ReactNode;
}> = ({ label, value, onChange, options, icon }) => (
  <div className="relative">
    <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>{label}</label>
    <div className="relative">
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {icon}
      </div>
      <select
        className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-md bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={value}
        onChange={onChange}
        style={{ 
          background: `white url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e") no-repeat right 8px center/16px 16px`
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const AuctionSelector: React.FC<AuctionSelectorProps> = ({ weeks, selectedWeekId, onWeekChange }) => {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          MARKET SELECTION
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ModernSelector
          label="Commodity"
          value="wool"
          onChange={() => {}} // No-op for now
          options={[{ value: 'wool', label: 'Wool' }]}
          icon={
            <svg className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          }
        />
        <ModernSelector
          label="Season"
          value="2025/26"
          onChange={() => {}} // No-op for now
          options={[{ value: '2025/26', label: '2025/26 Season' }]}
          icon={
            <svg className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <ModernSelector
          label="Auction Week"
          value={selectedWeekId}
          onChange={(e) => onWeekChange(e.target.value)}
          options={weeks.map(w => ({ value: w.id, label: w.label }))}
          icon={
            <svg className="w-4 h-4" style={{ color: 'var(--accent-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default AuctionSelector;
