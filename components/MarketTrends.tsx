import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TrendData, TrendPoint } from '../types';

interface MarketTrendsProps {
  data: TrendData;
}

const TrendChart: React.FC<{ title: string; data: TrendPoint[], currency: 'ZAR' | 'USD' }> = ({ title, data, currency }) => {
    const isZAR = currency === 'ZAR';
    const primaryColor = isZAR ? '#8884d8' : '#82ca9d';
    const secondaryColor = isZAR ? '#cccccc' : '#d4edda';
    const dataKey2025 = isZAR ? '2025_zar' : '2025_usd';
    const dataKey2024 = isZAR ? '2024_zar' : '2024_usd';
    const name2025 = `2025 ${currency}`;
    const name2024 = `2024 ${currency}`;

    return (
        <div className="w-full lg:w-1/2 px-2">
            <h3 className="text-lg font-bold text-brand-primary mb-4 text-center">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart 
                    data={data}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                    <YAxis 
                        stroke={primaryColor} 
                        tick={{ fontSize: 10 }} 
                        label={{ value: currency, angle: -90, position: 'insideLeft', offset: -10, fontSize: 12 }}
                    />
                    <Tooltip />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Line 
                        type="monotone" 
                        dataKey={dataKey2025} 
                        name={name2025} 
                        stroke={primaryColor} 
                        dot={false} 
                        strokeWidth={2} 
                    />
                    <Line 
                        type="monotone" 
                        dataKey={dataKey2024} 
                        name={name2024} 
                        stroke={secondaryColor} 
                        dot={false} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}


const MarketTrends: React.FC<MarketTrendsProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
            <h2 className="text-xl font-bold text-brand-primary mb-4">2 Year Market Trends (ZAR)</h2>
            <div className="flex flex-wrap -mx-2">
                <TrendChart title="RWS 2 YEAR TREND" data={data.rws} currency="ZAR" />
                <TrendChart title="NON-RWS 2 YEAR TREND" data={data.non_rws} currency="ZAR" />
            </div>
        </div>
        <div className="mt-8">
            <h2 className="text-xl font-bold text-brand-primary mb-4">2 Year Market Trends (USD)</h2>
            <div className="flex flex-wrap -mx-2">
                <TrendChart title="RWS 2 YEAR TREND" data={data.rws} currency="USD" />
                <TrendChart title="NON-RWS 2 YEAR TREND" data={data.non_rws} currency="USD" />
            </div>
        </div>
    </div>
  );
};

export default MarketTrends;