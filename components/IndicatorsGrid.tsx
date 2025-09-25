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
            return <CubeIcon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />;
        case 'Total Volume':
            return <ChartBarIcon className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} />;
        case 'Total Value':
            return <BanknotesIcon className="w-4 h-4" style={{ color: 'var(--accent-success)' }} />;
        default:
            return <ChartBarIcon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />;
    }
};

const IndicatorCard: React.FC<{
    title: string;
    value: string;
    unit: string;
    change?: number;
    ytdValue?: string;
    tint?: 'blue' | 'green';
}> = ({ title, value, unit, change, ytdValue, tint }) => {
    const isPositive = change !== undefined && change >= 0;

    // Get tint classes based on the tint prop
    const getTintClasses = () => {
        if (tint === 'blue') {
            return 'bg-gradient-to-br from-blue-50 to-blue-100/30 border-blue-200/50';
        } else if (tint === 'green') {
            return 'bg-gradient-to-br from-green-50 to-green-100/30 border-green-200/50';
        }
        return '';
    };

    return (
        <div className={`metric-card h-32 flex flex-col justify-between p-4 pb-5 ${getTintClasses()}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {getIndicatorIcon(title)}
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                        isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {isPositive ? <TrendingUpIcon className="w-3 h-3" /> : <TrendingDownIcon className="w-3 h-3" />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            
            <div className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {value}
                    </span>
                    <span className="text-base" style={{ color: 'var(--text-muted)' }}>
                        {unit}
                    </span>
                </div>
                
                <div className="h-5">
                    {ytdValue && (
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            Season: {ytdValue}
                        </p>
                    )}
                </div>
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
    
    // Create ordered array of cards based on the requested order
    const orderedCards = [];
    
    // 1. Total Lots
    const totalLots = filteredIndicators.find(ind => ind.type === 'total_lots');
    if (totalLots) orderedCards.push({
        type: 'indicator',
        data: totalLots
    });
    
    // 2. Total Volume
    const totalVolume = filteredIndicators.find(ind => ind.type === 'total_volume');
    if (totalVolume) orderedCards.push({
        type: 'indicator',
        data: totalVolume
    });
    
    // 3. Total Value
    const totalValue = filteredIndicators.find(ind => ind.type === 'total_value');
    if (totalValue) orderedCards.push({
        type: 'indicator',
        data: totalValue
    });
    
    // 4. AWEX
    const awex = benchmarks.find(b => b.label === 'AWEX');
    if (awex) orderedCards.push({
        type: 'benchmark',
        data: awex
    });
    
    // 5. Certified
    const certified = benchmarks.find(b => b.label === 'Certified');
    if (certified) orderedCards.push({
        type: 'benchmark',
        data: certified
    });
    
    // 6. All Merino
    const allMerino = benchmarks.find(b => b.label === 'All-Merino');
    if (allMerino) orderedCards.push({
        type: 'benchmark',
        data: allMerino
    });
    
    // 7. Certified (YTD) - moved to position 7
    const certifiedYtd = yearly_average_prices?.find(p => p.label.includes('Certified Wool'));
    if (certifiedYtd) orderedCards.push({
        type: 'yearly_price',
        data: certifiedYtd
    });
    
    // 8. All Merino Avg (YTD) - moved to position 8
    const allMerinoYtd = yearly_average_prices?.find(p => p.label.includes('All - Merino Wool'));
    if (allMerinoYtd) orderedCards.push({
        type: 'yearly_price',
        data: allMerinoYtd
    });
    
    
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <ChartBarIcon className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold gradient-text">MARKET OVERVIEW</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                {orderedCards.map((card, index) => {
                    if (card.type === 'indicator') {
                        const indicator = card.data;
                        return (
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
                        );
                    } else if (card.type === 'benchmark') {
                        const benchmark = card.data;
                        // Apply tints: blue for Certified, green for All-Merino
                        const tint = benchmark.label === 'Certified' ? 'blue' : 
                                   benchmark.label === 'All-Merino' ? 'green' : undefined;
                        return (
                            <IndicatorCard
                                key={benchmark.label}
                                title={benchmark.label}
                                value={benchmark.price.toFixed(2)}
                                unit={benchmark.currency.split(' ')[0]}
                                change={benchmark.day_change_pct}
                                tint={tint}
                            />
                        );
                    } else if (card.type === 'yearly_price') {
                        const price = card.data;
                        // Apply tints: blue for Certified, green for All-Merino
                        const tint = price.label.includes('Certified Wool') ? 'blue' : 
                                   price.label.includes('All - Merino Wool') ? 'green' : undefined;
                        return (
                            <IndicatorCard
                                key={price.label}
                                title={price.label}
                                value={price.value.toFixed(2)}
                                unit={price.unit}
                                tint={tint}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default IndicatorsGrid;