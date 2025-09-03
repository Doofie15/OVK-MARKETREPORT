
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: Changed BuyerShare to Buyer, as BuyerShare is not an exported member of ../types. The Buyer type has the required properties.
import type { Buyer } from '../types';

interface BuyerShareChartProps {
  data: Buyer[];
}

const COLORS = ['#003366', '#00a8e8', '#88ddf5', '#6c757d', '#adb5bd'];

const BuyerShareChart: React.FC<BuyerShareChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-[450px]">
        <h2 className="text-xl font-bold text-brand-primary mb-4">Buyer Participation</h2>
        <ResponsiveContainer width="100%" height="90%">
            <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="share_pct"
                nameKey="buyer"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                            {`${(percent * 100).toFixed(0)}%`}
                        </text>
                    );
                }}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right" 
                iconSize={10}
                wrapperStyle={{ right: -10, top: '25%' }}
            />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default BuyerShareChart;
