import React from 'react';

const ProfileSection: React.FC = () => {
  return (
    <section className="section">
      <div className="grid-responsive cols-1 lg-cols-4 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">OVK</span>
              </div>
              <div>
                <h3 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>
                  OVK PROFILE
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Market Intelligence Platform
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-small leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Real-time wool, mohair, and natural fiber market intelligence platform providing comprehensive auction data, price analytics, and industry insights for global textile markets.
              </p>
              
              <div className="pt-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Last Updated
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>
                    {new Date().toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-title" style={{ color: 'var(--text-primary)' }}>
                  KEY STATS
                </h3>
                <p className="text-small" style={{ color: 'var(--text-muted)' }}>
                  Current trading period metrics
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="metric-label mb-2">REV TTM</div>
                <div className="metric-value text-2xl mb-1">15.2%</div>
                <div className="metric-change positive">+2.1%</div>
              </div>
              
              <div className="text-center">
                <div className="metric-label mb-2">GROSS MARGIN</div>
                <div className="metric-value text-2xl mb-1">19.3%</div>
                <div className="metric-change positive">+0.8%</div>
              </div>
              
              <div className="text-center">
                <div className="metric-label mb-2">OPERATING MARGIN</div>
                <div className="metric-value text-2xl mb-1">8.2%</div>
                <div className="metric-change negative">-1.2%</div>
              </div>
              
              <div className="text-center">
                <div className="metric-label mb-2">NET MARGIN</div>
                <div className="metric-value text-2xl mb-1">12.4%</div>
                <div className="metric-change positive">+3.1%</div>
              </div>
              
              <div className="text-center">
                <div className="metric-label mb-2">RPS 3Y CAGR</div>
                <div className="metric-value text-2xl mb-1">16.3%</div>
                <div className="metric-change positive">+4.2%</div>
              </div>
              
              <div className="text-center">
                <div className="metric-label mb-2">RPS 5Y CAGR</div>
                <div className="metric-value text-2xl mb-1">18.7%</div>
                <div className="metric-change positive">+2.9%</div>
              </div>
              
              <div className="text-center">
                <div className="metric-label mb-2">EPS TTM</div>
                <div className="metric-value text-2xl mb-1">15.43%</div>
                <div className="metric-change positive">+8.1%</div>
              </div>
              
              <div className="text-center">
                <div className="metric-label mb-2">EPS 5Y CAGR</div>
                <div className="metric-value text-2xl mb-1">20.7%</div>
                <div className="metric-change positive">+12.3%</div>
              </div>
            </div>
            
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-primary)' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="metric-label mb-2">PROFITABILITY (TTM)</div>
                  <div className="metric-value text-xl">23.8%</div>
                </div>
                
                <div className="text-center">
                  <div className="metric-label mb-2">GROSS MARGIN</div>
                  <div className="metric-value text-xl">26.03%</div>
                </div>
                
                <div className="text-center">
                  <div className="metric-label mb-2">OP. INCL MARGIN</div>
                  <div className="metric-value text-xl">14.92%</div>
                </div>
                
                <div className="text-center">
                  <div className="metric-label mb-2">PROFIT MARGIN</div>
                  <div className="metric-value text-xl">9.57%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
