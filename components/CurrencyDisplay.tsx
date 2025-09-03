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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full flex items-center">
      <div className="w-full flex justify-around items-center">
        {currencies.map(({ code, value, change }) => {
            const isPositive = change >= 0;
            const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
            return (
                <div key={code} className="flex items-center space-x-3">
                    {flagMap[code]}
                    <div>
                        <p className="text-lg font-bold text-brand-primary">
                            R{value.toFixed(2)}
                        </p>
                        <p className={`text-sm font-semibold ${changeColor}`}>
                            {isPositive ? '+' : ''}{change.toFixed(1)}%
                        </p>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default CurrencyDisplay;