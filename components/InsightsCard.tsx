
import React from 'react';

interface InsightsCardProps {
  insights: string;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ insights }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
      <h2 className="text-xl font-bold text-brand-primary mb-2">Market Insights</h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        {insights}
      </p>
    </div>
  );
};

export default InsightsCard;
