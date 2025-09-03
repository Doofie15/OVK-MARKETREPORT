import React, { useState } from 'react';
import type { ProvinceAveragePrice } from '../types';

interface ProvincePriceMapProps {
  data: ProvinceAveragePrice[];
}

const SouthAfricaMap = ({ data, onMouseMove, hoveredId, getColor }: { 
  data: ProvinceAveragePrice[], 
  onMouseMove: (e: React.MouseEvent, id: string) => void, 
  hoveredId: string | null, 
  getColor: (price: number) => string 
}) => {
    // Improved South Africa province paths with better positioning
    const provincePaths: Record<string, { path: string, labelX: number, labelY: number }> = {
        'ZA-EC': { 
            path: "M403 268l-8-2-12 5-11 1-13-10-2-11 5-7-7-10-18-2-2-6-10-3-15 1-10 1-7 7-6 1 1-8 6-7 4-10-2-2-4-15 8-12-3-8 1-3 1-5-6-1-5 4-8 1-11-1-11 3-9 2-10 10-5 13 1 10-6 13 4 14 1 8-3 15-3 16 11 11 6h11l15 14 11 9 5 12z",
            labelX: 380, labelY: 250
        },
        'ZA-FS': { 
            path: "M328 203l-1 8-4 10-6 7-1-7-10-1-15-1-10 3 2 6 18 2 7 10-5 7 2 11 13 10 11-1 12-5 8 2 10 5 12 7 13 5 5 1-13 7-2 4-9-1-11-3-11 1-8-1-5-4 3-5 5-6 1-1 3-8-1 12 3 15-8 2 4 4 10z",
            labelX: 320, labelY: 200
        },
        'ZA-GP': { 
            path: "M299 157l-1 11-3 9 1 5-13 7-5-1-12-7-2-4 3-5 8-1-1-3-5 6-1 5-1-1-1-3 1-3 8-12 10-2 15-2 3-5z",
            labelX: 290, labelY: 150
        },
        'ZA-KZN': { 
            path: "M427 197l-11-6-16-11-15 3-8 3-14-1-13-4-10 6-13-1-10 5-2 10 9-2 11 1 11-3 8 1 9 1 2-4 13-7-5-5-12-7-10-5-8-2-12 5-11 1-12-1-8 2-7 1-1-11-3-14 4-21 12-7 13 1 15 11 12 17 8 10 2 12 18 10 24 10 5 12-11 9-15 14-11-9-4 1-7-1z",
            labelX: 410, labelY: 190
        },
        'ZA-LP': { 
            path: "M259 55l14 11 12 2 11 14 8 2 13 18 10 3 12 18 4 15-10 7-10 3-15-2-10 2-8 12-1-3-1-5 1-5-3-9-1-11 2-11 1-7 6-12-5-13 1-14 3-12-1-10 3-15-2-13 4-22-1z",
            labelX: 250, labelY: 80
        },
        'ZA-MP': { 
            path: "M341 122l-4-15-12-18-10-3-13-18-8-2-11-14-12-2-1 3-1 3-3 5-15 2-10 2-8 12 1 3 1 5-1 5-3 9 1 11-2 11-1-7-6-12-5-13 1-14 3-12-1-10 3-15-2-13 4-22-1 29 1 2 10 7 6 12 5 13 1-14 3-21 12-7 13-1 15 11 12 17 8 10 2 12 18z",
            labelX: 330, labelY: 120
        },
        'ZA-NC': { 
            path: "M239 299l-11-21-12-12-12-2-12 11-14 3-10-7-14 1-11-2-10-8-13 1-9-4-5-8-13-3-15 12-20-1-5-18-2-14 3-23-2-22 5-11 9-9 11-4 17 4 11 5 10-1 10-2 12-2 11 1 7-6-12-5-13 1-14 3-12-1-10 3-15-2-13 4-22-1-29-1-1-11 3-9 2-10 10-5 13 1 10-6 13 4 14 1 8-3 15-3 16 11 11 6h11l15 14 11 9 4 1-7 1 8 2 12 1 11-1 12-5 10 5 7-1 1-11z",
            labelX: 220, labelY: 280
        },
        'ZA-NW': { 
            path: "M189 123l-3-14-12-14-11-5-18-2-20 0-14 10-12 3-11 11-3 11 2 7 5 5 11 2 15-1 14 3 12-1 10-3 15 2 13-4 22 1 29 1 1 11-3-9-2-10 10 5-13-1-10 6-13-4-14-1-8 3-15 3-16-11-11-6h-11z",
            labelX: 180, labelY: 130
        },
        'ZA-WC': { 
            path: "M204 330l-1-11-7-1-10-5-12 5-11 1-12-1-8-2-7-1-4-1-11-9-15-14h-11l-11-6-16-11-15 3-8 3-14-1-13-4-10 6-13-1-10 5-2 10 9-2 11 1 11-3-8-1-9-1-2 4-13 7-5 5-12 7-10 5-8 2-12-5-11-1-12 1-8 2 7-1 1 11 3 14-4 21-12-7-13-1-15-11-12-17-8-10-2-12-18-10-24-10-5-12 11-9 15-14 11 9z",
            labelX: 200, labelY: 320
        }
    };

    return (
        <svg viewBox="50 50 450 350" className="w-full h-auto" aria-label="Map of South Africa">
            <g>
                {data.map(({ id, avg_price, name }) => {
                    const province = provincePaths[id];
                    if (!province) return null;
                    
                    return (
                        <g key={id}>
                            <path
                                d={province.path}
                                fill={getColor(avg_price)}
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                onMouseMove={(e) => onMouseMove(e, id)}
                                className={`transition-all duration-200 cursor-pointer ${hoveredId && hoveredId !== id ? 'opacity-50' : 'opacity-100'}`}
                            />
                            {/* Province Label with Price */}
                            <text
                                x={province.labelX}
                                y={province.labelY}
                                className="text-xs font-bold fill-gray-800 pointer-events-none"
                                textAnchor="middle"
                            >
                                {name}
                            </text>
                            <text
                                x={province.labelX}
                                y={province.labelY + 12}
                                className="text-xs font-semibold fill-accent pointer-events-none"
                                textAnchor="middle"
                            >
                                {avg_price.toFixed(0)} ZAR/kg
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
    )
}

const Tooltip: React.FC<{ province: ProvinceAveragePrice }> = ({ province }) => (
    <div className="p-3 rounded-lg shadow-lg z-10 text-center" 
         style={{ 
           background: 'var(--bg-tertiary)', 
           border: '1px solid var(--border-primary)',
           boxShadow: 'var(--shadow-lg)'
         }}>
        <p className="font-bold text-md mb-1" style={{ color: 'var(--text-primary)' }}>
          {province.name}
        </p>
        <p className="text-xl font-semibold" style={{ color: 'var(--accent-primary)' }}>
          R{province.avg_price.toFixed(2)}
          <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-muted)' }}>/kg</span>
        </p>
    </div>
);

const ProvincePriceMap: React.FC<ProvincePriceMapProps> = ({ data }) => {
    const [tooltip, setTooltip] = useState<{ x: number, y: number, province: ProvinceAveragePrice } | null>(null);

    const handleMouseMove = (e: React.MouseEvent, provinceId: string) => {
        const provinceData = data.find(p => p.id === provinceId);
        if (provinceData) {
            setTooltip({
                x: e.clientX,
                y: e.clientY,
                province: provinceData,
            });
        }
    };
    
    const handleMouseLeave = () => {
        setTooltip(null);
    };

    const hoveredId = tooltip ? tooltip.province.id : null;

    // Better color scheme for South Africa provinces
    const colors = ['#e6f3ff', '#b3d9ff', '#80bfff', '#4da6ff', '#1a8cff', '#0073e6', '#0059b3'];
    const prices = data.map(d => d.avg_price).sort((a, b) => a - b);
    const minPrice = prices[0] || 150;
    const maxPrice = prices[prices.length - 1] || 190;
    
    const getColor = (price: number) => {
        const range = maxPrice - minPrice;
        if (range === 0) return colors[3];
        const step = range / colors.length;
        const index = Math.floor((price - minPrice) / step);
        return colors[Math.min(index, colors.length - 1)];
    }

    return (
        <div>
            <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Average Price by Province
            </h3>
            
            <div className="relative flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-3/4" onMouseLeave={handleMouseLeave}>
                    <div className="p-4 rounded-lg" style={{ background: 'var(--bg-hover)' }}>
                      <SouthAfricaMap 
                          data={data} 
                          onMouseMove={handleMouseMove} 
                          hoveredId={hoveredId}
                          getColor={getColor}
                      />
                    </div>
                </div>
                
                <div className="w-full md:w-1/4">
                    <div className="p-4 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Price Legend
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                                  R{minPrice.toFixed(0)}
                                </span>
                                <div 
                                    className="flex-1 h-3 rounded-full" 
                                    style={{background: `linear-gradient(to right, ${colors.join(',')})`}}
                                ></div>
                                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                                  R{maxPrice.toFixed(0)}
                                </span>
                            </div>
                            
                            <div className="text-xs text-center p-3 rounded-lg" style={{ 
                              background: 'var(--bg-hover)',
                              color: 'var(--text-muted)' 
                            }}>
                                <div>💧 Lower prices = Lighter blue</div>
                                <div>🔵 Higher prices = Darker blue</div>
                            </div>
                            
                            <div className="pt-3" style={{ borderTop: '1px solid var(--border-primary)' }}>
                              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                Range: R{(maxPrice - minPrice).toFixed(0)}/kg
                              </div>
                              <div className="text-xs" style={{ color: 'var(--accent-primary)' }}>
                                Avg: R{(data.reduce((sum, p) => sum + p.avg_price, 0) / data.length).toFixed(2)}/kg
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {tooltip && (
                <div 
                    style={{ 
                        position: 'fixed', 
                        top: tooltip.y + 20, 
                        left: tooltip.x,
                        transform: 'translateX(-50%)',
                        pointerEvents: 'none',
                        zIndex: 1000
                    }}
                >
                    <Tooltip province={tooltip.province} />
                </div>
            )}
        </div>
    );
};

export default ProvincePriceMap;