
import React from 'react';

interface InsightsCardProps {
  insights: string;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ insights }) => {
  return (
    <div className="card p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="text-title" style={{ color: 'var(--text-primary)' }}>
            MARKET INSIGHTS
          </h2>
          <p className="text-small" style={{ color: 'var(--text-muted)' }}>
            AI-powered market intelligence
          </p>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-0 w-1 h-full rounded-full bg-gradient-to-b from-cyan-400 to-purple-600"></div>
        <div className="pl-6">
          <p className="text-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {insights}
          </p>
        </div>
      </div>
      
      <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-primary)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Updated {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InsightsCard;
