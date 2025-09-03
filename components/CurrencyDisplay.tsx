import React from 'react';
import type { Currency } from '../types';

interface CurrencyDisplayProps {
  currencies: Currency[];
}

const UsaFlagIcon: React.FC = () => (
  <svg className="w-8 h-8 rounded-full" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fill="#C1272D" d="M0 0h20v2.5H0zM0 5h20v2.5H0zM0 10h20v2.5H0zM0 15h20v2.5H0z"/>
    <path fill="#002868" d="M0 0h10v10H0z"/>
    <g fill="#FFFFFF">
      <path d="M1.5 1.5l.5 1.5h1.6l-1.3 1 .5 1.6-1.3-1-1.3 1 .5-1.6-1.3-1h1.6z"/>
      <path d="M5.5 1.5l.5 1.5h1.6l-1.3 1 .5 1.6-1.3-1-1.3 1 .5-1.6-1.3-1h1.6z"/>
      <path d="M1.5 5.5l.5 1.5h1.6l-1.3 1 .5 1.6-1.3-1-1.3 1 .5-1.6-1.3-1h1.6z"/>
      <path d="M5.5 5.5l.5 1.5h1.6l-1.3 1 .5 1.6-1.3-1-1.3 1 .5-1.6-1.3-1h1.6z"/>
    </g>
  </svg>
);

const AustraliaFlagIcon: React.FC = () => (
  <svg className="w-8 h-8 rounded-full" viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg">
    <path fill="#00008B" d="M0 0h20v10H0z"/>
    <path stroke="#FFFFFF" strokeWidth=".5" d="M0 0l10 5m0-5L0 5"/>
    <path stroke="#C1272D" strokeWidth=".3" d="M0 0l10 5m0-5L0 5"/>
    <g fill="#FFFFFF">
      <path d="M2.5 1.25L2.9 2.5h.8l-.6.4.2.8-.7-.5-.6.5.2-.8-.6-.4h.8zM7.5 2.5L7.9 3.75h.8l-.6.4.2.8-.7-.5-.6.5.2-.8-.6-.4h.8zM4 5l.4 1.25h.8l-.6.4.2.8-.7-.5-.6.5.2-.8-.6-.4h.8zM15 2l.3.9h.6l-.5.3.2.6-.5-.4-.5.4.2-.6-.5-.3h.6zM12 7l.3.9h.6l-.5.3.2.6-.5-.4-.5.4.2-.6-.5-.3h.6z"/>
    </g>
  </svg>
);

const EuFlagIcon: React.FC = () => (
  <svg className="w-8 h-8 rounded-full" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fill="#003399" d="M0 0h20v20H0z"/>
    <g fill="#FFCC00">
      {[...Array(12)].map((_, i) => (
        <path key={i} transform={`rotate(${i * 30}, 10, 10) translate(0, -6) rotate(180, 0, 0)`} d="M0 0l.3 1h.7l-.6.5.2 1-.6-.5-.6.5.2-1-.6-.5h.7z"/>
      ))}
    </g>
  </svg>
);


const flagMap: Record<Currency['code'], React.ReactNode> = {
  USD: <UsaFlagIcon />,
  AUD: <AustraliaFlagIcon />,
  EUR: <EuFlagIcon />,
};

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ currencies }) => {
  return (
    <div className="card p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-title" style={{ color: 'var(--text-primary)' }}>
            CURRENCY EXCHANGE
          </h2>
          <p className="text-small" style={{ color: 'var(--text-muted)' }}>
            Live exchange rates vs ZAR
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currencies.map(({ code, value, change }) => {
          const isPositive = change >= 0;
          return (
            <div key={code} className="flex items-center gap-4 p-4 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="flex-shrink-0">
                {flagMap[code]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {code}/ZAR
                  </span>
                  <div className={`status-indicator ${isPositive ? 'success' : 'error'}`}>
                    {isPositive ? '+' : ''}{change.toFixed(1)}%
                  </div>
                </div>
                <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  R{value.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurrencyDisplay;