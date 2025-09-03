import React from 'react';
import type { Indicator, Benchmark, YearlyAveragePrice } from '../types';

const TrendingUpIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.94" />
    </svg>
);

const TrendingDownIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.511l-5.511-3.182" />
    </svg>
);

const BanknotesIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CubeIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

const ChartBarIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);


const formatValue = (type: Indicator['type'], value: number) => {
    if (type === 'total_value') {
        return `${value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
    }
    return value.toLocaleString('en-US');
}

const getIndicatorTitle = (type: Indicator['type']) => {
    switch (type) {
        case 'total_lots': return 'Total Lots';
        case 'total_volume': return 'Total Volume';
        case 'avg_price': return 'Average Price';
        case 'total_value': return 'Total Value';
        default: return 'Indicator';
    }
}


const getIndicatorIcon = (type: string) => {
    switch (type) {
        case 'Total Lots':
            return <CubeIcon className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />;
        case 'Total Volume':
            return <ChartBarIcon className="w-6 h-6" style={{ color: 'var(--accent-secondary)' }} />;
        case 'Total Value':
            return <BanknotesIcon className="w-6 h-6" style={{ color: 'var(--accent-success)' }} />;
        default:
            return <ChartBarIcon className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />;
    }
};

const IndicatorCard: React.FC<{
    title: string;
    value: string;
    unit: string;
    change?: number;
    ytdValue?: string;
}> = ({ title, value, unit, change, ytdValue }) => {
    const isPositive = change !== undefined && change >= 0;

    return (
        <div className="metric-card">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {getIndicatorIcon(title)}
                    <div>
                        <p className="metric-label">{title}</p>
                        {ytdValue && (
                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                YTD: {ytdValue}
                            </p>
                        )}
                    </div>
                </div>
                {change !== undefined && (
                    <div className={`status-indicator ${isPositive ? 'success' : 'error'}`}>
                        {isPositive ? <TrendingUpIcon className="w-3 h-3" /> : <TrendingDownIcon className="w-3 h-3" />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            
            <div className="metric-value">
                {value}
                <span className="text-lg font-normal ml-2" style={{ color: 'var(--text-muted)' }}>
                    {unit}
                </span>
            </div>
        </div>
    );
};


interface IndicatorsGridProps {
    indicators: Indicator[];
    benchmarks: Benchmark[];
    yearly_average_prices?: YearlyAveragePrice[];
}

const IndicatorsGrid: React.FC<IndicatorsGridProps> = ({ indicators, benchmarks, yearly_average_prices }) => {
    const filteredIndicators = indicators.filter(ind => ind.type !== 'avg_price');
    
    return (
        <section className="section">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-title gradient-text">MARKET OVERVIEW</h2>
                    <p className="text-small" style={{ color: 'var(--text-muted)' }}>
                        Current trading period performance metrics
                    </p>
                </div>
            </div>
            
            <div className="grid-responsive cols-2 lg-cols-4">
                {filteredIndicators.map(indicator => (
                    <IndicatorCard
                        key={indicator.type}
                        title={getIndicatorTitle(indicator.type)}
                        value={formatValue(indicator.type, indicator.value)}
                        unit={indicator.unit}
                        change={indicator.pct_change}
                        ytdValue={
                            indicator.value_ytd 
                                ? `${indicator.value_ytd.toLocaleString('en-US')} ${indicator.unit}` 
                                : undefined
                        }
                    />
                ))}
                {yearly_average_prices?.map(price => (
                    <IndicatorCard
                        key={price.label}
                        title={price.label}
                        value={price.value.toFixed(2)}
                        unit={price.unit}
                    />
                ))}
                {benchmarks.map(benchmark => (
                    <IndicatorCard
                        key={benchmark.label}
                        title={benchmark.label}
                        value={benchmark.price.toFixed(2)}
                        unit={benchmark.currency.split(' ')[0]}
                        change={benchmark.day_change_pct}
                    />
                ))}
            </div>
        </section>
    );
};

export default IndicatorsGrid;