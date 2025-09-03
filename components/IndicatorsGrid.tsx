import React from 'react';
import type { Indicator, Benchmark, YearlyAveragePrice } from '../types';

const ArrowUpIcon: React.FC<{className: string}> = ({className}) => (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);

const ArrowDownIcon: React.FC<{className: string}> = ({className}) => (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
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


const IndicatorCard: React.FC<{
    title: string;
    value: string;
    unit: string;
    change?: number;
    ytdValue?: string;
}> = ({ title, value, unit, change, ytdValue }) => {
    const isPositive = change !== undefined && change >= 0;
    const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
    const bgColor = isPositive ? 'bg-green-100' : 'bg-red-100';

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between h-full">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-brand-primary mt-1">
                    {value} <span className="text-lg font-normal text-gray-600">{unit}</span>
                </p>
                {ytdValue && (
                  <p className="text-xs text-gray-500 mt-1">
                      YTD: {ytdValue}
                  </p>
                )}
            </div>
            {change !== undefined ? (
                <div className={`mt-2 inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-sm font-medium ${bgColor} ${changeColor}`}>
                    {isPositive ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
                    {Math.abs(change)}%
                </div>
            ) : <div className="mt-2 h-[22px]" /> /* Placeholder for alignment */}
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
        <div>
            <h2 className="text-xl font-bold text-brand-primary mb-4">Market Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
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
        </div>
    );
};

export default IndicatorsGrid;