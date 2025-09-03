
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MicronPrice } from '../types';

interface MicronPriceChartProps {
  data: MicronPrice[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
          <p className="font-bold">{`Micron: ${label}µm`}</p>
          <p className="text-accent">{`Price: ${payload[0].value.toFixed(2)} ZAR/kg`}</p>
        </div>
      );
    }
    return null;
};


const MicronPriceChart: React.FC<MicronPriceChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => parseFloat(a.bucket_micron) - parseFloat(b.bucket_micron));

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-[450px]">
        <h2 className="text-xl font-bold text-brand-primary mb-4">Micron Price Curve</h2>
        <ResponsiveContainer width="100%" height="90%">
            <LineChart
            data={sortedData}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 20,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
                dataKey="bucket_micron" 
                label={{ value: 'Micron (µm)', position: 'insideBottom', offset: -15 }}
                tick={{ fontSize: 12 }}
            />
            <YAxis 
                label={{ value: 'Price (ZAR/kg clean)', angle: -90, position: 'insideLeft', offset: -5 }}
                tickFormatter={(value) => `${value}`}
                tick={{ fontSize: 12 }}
                domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '20px'}} />
            <Line 
                name="Price"
                type="monotone" 
                dataKey="price_clean_zar_per_kg" 
                stroke="#00a8e8" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
            />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default MicronPriceChart;
