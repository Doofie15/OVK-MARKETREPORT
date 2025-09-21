import React, { useState, useEffect, useCallback } from 'react';
import type { AuctionReport, Buyer, BrokerData, ProvincialProducerData, ProvincialProducer, Indicator, Benchmark, Currency, YearlyAveragePrice } from '../../types';
import { BLANK_REPORT, BUYERS, BROKERS } from '../../constants';
import SupabaseService from '../../data/supabase-service';

interface AdminFormProps {
    onSave: (report: Omit<AuctionReport, 'top_sales'>) => void;
    onCancel: () => void;
    latestReport?: AuctionReport;
    editingReport?: AuctionReport;
}

const inputClass = "w-full p-1 border rounded bg-white text-gray-900 text-sm focus:ring-accent focus:border-accent";
const inputErrorClass = "w-full p-1 border border-red-300 rounded bg-white text-gray-900 text-sm focus:ring-red-500 focus:border-red-500";
const thClass = "p-2 text-left text-sm font-semibold text-gray-600 bg-gray-100";
const tdClass = "p-1";

// Section Components
const AuctionDetailsSection: React.FC<{
    report: Omit<AuctionReport, 'top_sales'>;
    setReport: React.Dispatch<React.SetStateAction<Omit<AuctionReport, 'top_sales'>>>;
    markDirty: () => void;
    errors: Record<string, string>;
}> = ({ report, setReport, markDirty, errors }) => {
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const auctionDate = new Date(e.target.value);
        const dayOfWeek = auctionDate.getUTCDay();
        const weekStart = new Date(auctionDate);
        weekStart.setUTCDate(auctionDate.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday
        const weekEnd = new Date(weekStart);
        weekEnd.setUTCDate(weekStart.getUTCDate() + 6); // Sunday

        const year = auctionDate.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const weekNumber = Math.ceil((((auctionDate.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);

        setReport(prev => ({
            ...prev,
            auction: {
                ...prev.auction,
                auction_date: e.target.value,
                week_start: weekStart.toISOString().split('T')[0],
                week_end: weekEnd.toISOString().split('T')[0],
                week_id: `week_${year}_${String(weekNumber).padStart(2, '0')}`
            }
        }));
        markDirty();
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">📅 Auction Details</h2>
                <p className="text-sm text-blue-700">Enter the basic auction information including date, catalogue name, and commodity type.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Auction Date *</label>
                        <input 
                            type="date" 
                            value={report.auction.auction_date} 
                            onChange={handleDateChange} 
                            className={errors.auction_date ? inputErrorClass : inputClass} 
                        />
                        {errors.auction_date && <div className="text-red-500 text-xs mt-1">{errors.auction_date}</div>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catalogue Name *</label>
                        <input 
                            value={report.auction.catalogue_name} 
                            onChange={e => {
                                setReport(p => ({...p, auction: {...p.auction, catalogue_name: e.target.value}}));
                                markDirty();
                            }} 
                            className={errors.catalogue_name ? inputErrorClass : inputClass} 
                            placeholder="e.g., CAT01, CAT02"
                        />
                        {errors.catalogue_name && <div className="text-red-500 text-xs mt-1">{errors.catalogue_name}</div>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Commodity Type</label>
                        <select 
                            value={report.auction.commodity} 
                            onChange={e => {
                                setReport(p => ({...p, auction: {...p.auction, commodity: e.target.value as 'wool' | 'mohair'}}));
                                markDirty();
                            }} 
                            className={inputClass}
                        >
                            <option value="wool">Wool</option>
                            <option value="mohair">Mohair</option>
                        </select>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Season Label</label>
                        <input 
                            value={report.auction.season_label} 
                            onChange={e => {
                                setReport(p => ({...p, auction: {...p.auction, season_label: e.target.value}}));
                                markDirty();
                            }} 
                            className={inputClass}
                            placeholder="e.g., 2025/26"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Week Start</label>
                        <input 
                            type="date" 
                            value={report.auction.week_start} 
                            readOnly 
                            className={`${inputClass} bg-gray-100`} 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Week End</label>
                        <input 
                            type="date" 
                            value={report.auction.week_end} 
                            readOnly 
                            className={`${inputClass} bg-gray-100`} 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Week ID</label>
                        <input 
                            value={report.auction.week_id} 
                            readOnly 
                            className={`${inputClass} bg-gray-100`} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const MarketIndicatorsSection: React.FC<{
    report: Omit<AuctionReport, 'top_sales'>;
    setReport: React.Dispatch<React.SetStateAction<Omit<AuctionReport, 'top_sales'>>>;
    markDirty: () => void;
    errors: Record<string, string>;
}> = ({ report, setReport, markDirty, errors }) => {
    const handleStatsChange = (field: string, value: string) => {
        let indicators = [...report.indicators];
        let yearlyPrices = [...(report.yearly_average_prices || [])];

        const numericValue = parseFloat(value) || 0;

        if (field === 'total_lots') {
            let item = indicators.find(i => i.type === 'total_lots');
            if(item) item.value = numericValue; else indicators.push({ type: 'total_lots', value: numericValue, unit: 'bales', pct_change: 0 });
        } else if (field === 'total_volume') {
             let item = indicators.find(i => i.type === 'total_volume');
            if(item) item.value = numericValue; else indicators.push({ type: 'total_volume', value: numericValue, unit: 'MT', pct_change: 0 });
        } else if (field === 'total_value') {
             let item = indicators.find(i => i.type === 'total_value');
            if(item) item.value = numericValue; else indicators.push({ type: 'total_value', value: numericValue, unit: 'ZAR M', pct_change: 0 });
        } else if (field === 'avg_rws') {
            let item = yearlyPrices.find(p => p.label.includes('Certified Wool'));
            if(item) item.value = numericValue; else yearlyPrices.push({ label: 'Certified Wool Avg Price (YTD)', value: numericValue, unit: 'ZAR/kg' });
        } else if (field === 'avg_non_rws') {
            let item = yearlyPrices.find(p => p.label.includes('All - Merino Wool'));
            if(item) item.value = numericValue; else yearlyPrices.push({ label: 'All - Merino Wool Avg Price (YTD)', value: numericValue, unit: 'ZAR/kg' });
        }

        setReport(prev => ({ ...prev, indicators, yearly_average_prices: yearlyPrices }));
        markDirty();
    };

    const getStat = (type: string) => {
        if (type.includes('avg')) {
            return report.yearly_average_prices?.find(p => p.label.toLowerCase().includes(type.split('_')[1]))?.value || '';
        }
        return report.indicators.find(i => i.type === type)?.value || '';
    };

    return (
        <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-green-900 mb-2">📊 Market Indicators</h2>
                <p className="text-sm text-green-700">Enter the key market statistics including total lots, volume, value, and average prices.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Lots *</label>
                        <input 
                            type="number" 
                            value={getStat('total_lots')} 
                            onChange={e => handleStatsChange('total_lots', e.target.value)} 
                            className={errors.total_lots ? inputErrorClass : inputClass}
                            placeholder="e.g., 10250"
                        />
                        {errors.total_lots && <div className="text-red-500 text-xs mt-1">{errors.total_lots}</div>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Volume (MT) *</label>
                        <input 
                            type="number" 
                            step="0.1"
                            value={getStat('total_volume')} 
                            onChange={e => handleStatsChange('total_volume', e.target.value)} 
                            className={errors.total_volume ? inputErrorClass : inputClass}
                            placeholder="e.g., 1550.8"
                        />
                        {errors.total_volume && <div className="text-red-500 text-xs mt-1">{errors.total_volume}</div>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Auction Turnover (ZAR M)</label>
                        <input 
                            type="number" 
                            step="0.1"
                            value={getStat('total_value')} 
                            onChange={e => handleStatsChange('total_value', e.target.value)} 
                            className={inputClass}
                            placeholder="e.g., 281.4"
                        />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Avg Price Certified Wool (YTD)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={getStat('avg_rws')} 
                            onChange={e => handleStatsChange('avg_rws', e.target.value)} 
                            className={inputClass}
                            placeholder="e.g., 188.50"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Avg Price All - Merino Wool (YTD)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={getStat('avg_non_rws')} 
                            onChange={e => handleStatsChange('avg_non_rws', e.target.value)} 
                            className={inputClass}
                            placeholder="e.g., 175.20"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const MicronPricesSection: React.FC<{
    report: Omit<AuctionReport, 'top_sales'>;
    setReport: React.Dispatch<React.SetStateAction<Omit<AuctionReport, 'top_sales'>>>;
    markDirty: () => void;
}> = ({ report, setReport, markDirty }) => {
    const handleMicronPriceChange = (index: number, value: string) => {
        const micron_prices = [...report.micron_prices];
        micron_prices[index].price_clean_zar_per_kg = parseFloat(value) || 0;
        setReport(prev => ({...prev, micron_prices}));
        markDirty();
    };

    return (
        <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-purple-900 mb-2">💰 Micron Prices</h2>
                <p className="text-sm text-purple-700">Enter the clean wool prices for each micron category in ZAR per kg.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {report.micron_prices.map((price, index) => (
                    <div key={price.bucket_micron} className="text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {price.bucket_micron}µ ({price.category})
                        </label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={price.price_clean_zar_per_kg || ''} 
                            onChange={e => handleMicronPriceChange(index, e.target.value)} 
                            className={inputClass}
                            placeholder="0.00"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const BuyersBrokersSection: React.FC<{
    report: Omit<AuctionReport, 'top_sales'>;
    setReport: React.Dispatch<React.SetStateAction<Omit<AuctionReport, 'top_sales'>>>;
    markDirty: () => void;
}> = ({ report, setReport, markDirty }) => {
    const handleBuyerChange = (index: number, field: keyof Buyer, value: any) => {
        const buyers = [...report.buyers];
        (buyers[index] as any)[field] = value;
        
        const totalBales = buyers.reduce((sum, b) => sum + (b.cat || 0), 0);
        if (totalBales > 0) {
            buyers.forEach(b => {
                b.share_pct = ((b.cat || 0) / totalBales) * 100;
            });
        }
        setReport(prev => ({ ...prev, buyers }));
        markDirty();
    };

    const addBuyer = () => {
        setReport(prev => ({ ...prev, buyers: [...prev.buyers, { buyer: BUYERS[0], cat: 0, share_pct: 0, bales_ytd: 0 }]}));
        markDirty();
    };

    const removeBuyer = (index: number) => {
        setReport(prev => ({ ...prev, buyers: prev.buyers.filter((_, i) => i !== index)}));
        markDirty();
    };

    const handleBrokerChange = (index: number, field: keyof BrokerData, value: any) => {
        const brokers = [...report.brokers];
        (brokers[index] as any)[field] = value;
        setReport(prev => ({ ...prev, brokers }));
        markDirty();
    };

    const addBroker = () => {
        setReport(prev => ({ 
            ...prev, 
            brokers: [...prev.brokers, { 
                name: BROKERS[0], 
                catalogue_offering: 0, 
                withdrawn_before_sale: 0,
                wool_offered: 0,
                withdrawn_during_sale: 0,
                passed: 0,
                not_sold: 0,
                sold: 0,
                sold_pct: 0,
                sold_ytd: 0 
            }]
        }));
        markDirty();
    };

    const removeBroker = (index: number) => {
        setReport(prev => ({ ...prev, brokers: prev.brokers.filter((_, i) => i !== index)}));
        markDirty();
    };

    return (
        <div className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-orange-900 mb-2">👥 Buyers & Brokers</h2>
                <p className="text-sm text-orange-700">Manage buyer participation and broker catalogue offerings for this auction.</p>
            </div>
            
            {/* Buyers Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyers List</h3>
                <div className="space-y-3">
                    {report.buyers.map((buyer, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Buyer</label>
                                <select 
                                    value={buyer.buyer} 
                                    onChange={e => handleBuyerChange(index, 'buyer', e.target.value)} 
                                    className={inputClass}
                                >
                                    {BUYERS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Qty Bales</label>
                                <input 
                                    type="number" 
                                    value={buyer.cat || ''} 
                                    onChange={e => handleBuyerChange(index, 'cat', parseInt(e.target.value))} 
                                    className={inputClass}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">% Share</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={buyer.share_pct.toFixed(2)} 
                                    onChange={e => handleBuyerChange(index, 'share_pct', parseFloat(e.target.value))} 
                                    className={inputClass}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex items-end">
                                <button 
                                    onClick={() => removeBuyer(index)} 
                                    className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded text-sm transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <button 
                        onClick={addBuyer} 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded text-sm transition-colors"
                    >
                        + Add Buyer
                    </button>
                </div>
            </div>

            {/* Brokers Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Brokers</h3>
                <div className="space-y-3">
                    {report.brokers.map((broker, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border border-gray-200 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Broker</label>
                                <select 
                                    value={broker.name} 
                                    onChange={e => handleBrokerChange(index, 'name', e.target.value)} 
                                    className={inputClass}
                                >
                                    {BROKERS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catalogue Offering</label>
                                <input 
                                    type="number" 
                                    value={broker.catalogue_offering || ''} 
                                    onChange={e => handleBrokerChange(index, 'catalogue_offering', parseInt(e.target.value))} 
                                    className={inputClass}
                                    placeholder="0"
                                />
                            </div>
                            <div className="flex items-end">
                                <button 
                                    onClick={() => removeBroker(index)} 
                                    className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded text-sm transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <button 
                        onClick={addBroker} 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded text-sm transition-colors"
                    >
                        + Add Broker
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProvincialDataSection: React.FC<{
    report: Omit<AuctionReport, 'top_sales'>;
    setReport: React.Dispatch<React.SetStateAction<Omit<AuctionReport, 'top_sales'>>>;
    markDirty: () => void;
}> = ({ report, setReport, markDirty }) => {
    const PROVINCES = ['Eastern Cape', 'Free State', 'Western Cape', 'Northern Cape', 'KwaZulu-Natal', 'Mpumalanga', 'Gauteng', 'Limpopo', 'North West'];
    const [selectedProvince, setSelectedProvince] = useState(PROVINCES[0]);

    const handleProvincialProducerChange = (provinceName: string, producerIndex: number, field: keyof ProvincialProducer, value: any) => {
        const provincial_producers = [...report.provincial_producers];
        let provinceData = provincial_producers.find(p => p.province === provinceName);
        if (provinceData) {
            (provinceData.producers[producerIndex] as any)[field] = value;
            setReport(prev => ({ ...prev, provincial_producers }));
        }
    };
    
    const addProvincialProducer = (provinceName: string) => {
        const provincial_producers = [...report.provincial_producers];
        let provinceData = provincial_producers.find(p => p.province === provinceName);
        const newProducer: ProvincialProducer = { position: 1, name: '', district: '', price: 0, certified: '', buyer_name: '' };
        if (provinceData) {
            newProducer.position = provinceData.producers.length + 1;
            provinceData.producers.push(newProducer);
        } else {
            provincial_producers.push({ province: provinceName, producers: [newProducer] });
        }
        setReport(prev => ({...prev, provincial_producers}));
        markDirty();
    };
    
    const removeProvincialProducer = (provinceName: string, producerIndex: number) => {
        const provincial_producers = [...report.provincial_producers];
        let provinceData = provincial_producers.find(p => p.province === provinceName);
        if(provinceData) {
            provinceData.producers.splice(producerIndex, 1);
            provinceData.producers.forEach((p, i) => p.position = i + 1);
            setReport(prev => ({...prev, provincial_producers}));
        }
        markDirty();
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-indigo-900 mb-2">🗺️ Provincial Data</h2>
                <p className="text-sm text-indigo-700">Enter top performing producers by province with their details and prices.</p>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium text-gray-700">Select Province:</label>
                <select 
                    value={selectedProvince} 
                    onChange={e => setSelectedProvince(e.target.value)} 
                    className="p-2 border rounded text-sm"
                >
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Top Performers - {selectedProvince}</h3>
                {(report.provincial_producers.find(p => p.province === selectedProvince)?.producers || []).map((producer, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-3 p-3 border border-gray-200 rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
                            <input 
                                type="number" 
                                value={producer.position} 
                                onChange={e => handleProvincialProducerChange(selectedProvince, index, 'position', parseInt(e.target.value))} 
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Producer Name</label>
                            <input 
                                value={producer.name} 
                                onChange={e => handleProvincialProducerChange(selectedProvince, index, 'name', e.target.value)} 
                                className={inputClass}
                                placeholder="Farm name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <input 
                                value={producer.district} 
                                onChange={e => handleProvincialProducerChange(selectedProvince, index, 'district', e.target.value)} 
                                className={inputClass}
                                placeholder="District"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Micron</label>
                            <input 
                                type="number" 
                                step="0.1"
                                value={producer.micron || ''} 
                                onChange={e => handleProvincialProducerChange(selectedProvince, index, 'micron', parseFloat(e.target.value))} 
                                className={inputClass}
                                placeholder="0.0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={producer.price || ''} 
                                onChange={e => handleProvincialProducerChange(selectedProvince, index, 'price', parseFloat(e.target.value))} 
                                className={inputClass}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Certified</label>
                            <select 
                                value={producer.certified} 
                                onChange={e => handleProvincialProducerChange(selectedProvince, index, 'certified', e.target.value)} 
                                className={inputClass}
                            >
                                <option value="">Blank</option>
                                <option value="RWS">RWS</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Buyer</label>
                            <input 
                                value={producer.buyer_name} 
                                onChange={e => handleProvincialProducerChange(selectedProvince, index, 'buyer_name', e.target.value)} 
                                className={inputClass}
                                placeholder="Buyer name"
                            />
                        </div>
                        <div className="flex items-end">
                            <button 
                                onClick={() => removeProvincialProducer(selectedProvince, index)} 
                                className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded text-sm transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
                <button 
                    onClick={() => addProvincialProducer(selectedProvince)} 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded text-sm transition-colors"
                >
                    + Add Performer for {selectedProvince}
                </button>
            </div>
        </div>
    );
};

const MarketInsightsSection: React.FC<{
    report: Omit<AuctionReport, 'top_sales'>;
    setReport: React.Dispatch<React.SetStateAction<Omit<AuctionReport, 'top_sales'>>>;
    markDirty: () => void;
}> = ({ report, setReport, markDirty }) => {
    return (
        <div className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-yellow-900 mb-2">💡 Market Insights</h2>
                <p className="text-sm text-yellow-700">Provide market commentary, insights, and analysis for this auction period.</p>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Market Insights / Comments</label>
                <textarea 
                    value={report.insights} 
                    onChange={e => setReport(prev => ({...prev, insights: e.target.value}))} 
                    className={`${inputClass} mt-1`} 
                    rows={8}
                    placeholder="Enter market commentary, trends, and insights for this auction period..."
                />
            </div>
        </div>
    );
};

const ReviewSaveSection: React.FC<{
    report: Omit<AuctionReport, 'top_sales'>;
    onSave: () => void;
    onCancel: () => void;
    errors: Record<string, string>;
}> = ({ report, onSave, onCancel, errors }) => {
    return (
        <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-green-900 mb-2">✅ Review & Save</h2>
                <p className="text-sm text-green-700">Review your auction report data and save it to the system.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Auction Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Auction Date:</span>
                            <span className="text-sm font-medium">{new Date(report.auction.auction_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Catalogue:</span>
                            <span className="text-sm font-medium">{report.auction.catalogue_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Lots:</span>
                            <span className="text-sm font-medium">{report.indicators.find(i => i.type === 'total_lots')?.value.toLocaleString() || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Volume:</span>
                            <span className="text-sm font-medium">{report.indicators.find(i => i.type === 'total_volume')?.value.toFixed(1) || 'N/A'} MT</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Value:</span>
                            <span className="text-sm font-medium">ZAR {report.indicators.find(i => i.type === 'total_value')?.value.toFixed(1) || 'N/A'}M</span>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Data Completeness</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Buyers:</span>
                            <span className="text-sm font-medium">{report.buyers.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Brokers:</span>
                            <span className="text-sm font-medium">{report.brokers.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Provinces with Data:</span>
                            <span className="text-sm font-medium">{report.provincial_producers.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Micron Prices:</span>
                            <span className="text-sm font-medium">{report.micron_prices.filter(p => p.price_clean_zar_per_kg > 0).length}/{report.micron_prices.length}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button 
                    onClick={onCancel} 
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={onSave} 
                    className="bg-brand-primary hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={Object.keys(errors).length > 0}
                >
                    Save Auction Report
                </button>
            </div>
        </div>
    );
};

const AdminForm: React.FC<AdminFormProps> = ({ onSave, onCancel, latestReport, editingReport }) => {
    const [report, setReport] = useState<Omit<AuctionReport, 'top_sales'>>(editingReport || BLANK_REPORT);
    
    // Debug logging
    useEffect(() => {
        console.log('AdminForm mounted with editingReport:', editingReport);
        console.log('AdminForm report state:', report);
    }, [editingReport, report]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isDirty, setIsDirty] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [activeSection, setActiveSection] = useState<string>('auction-details');

    // Validation functions
    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};
        
        if (!report.auction.auction_date) {
            newErrors.auction_date = 'Auction date is required';
        }
        
        if (!report.auction.catalogue_name.trim()) {
            newErrors.catalogue_name = 'Catalogue name is required';
        }
        
        const totalLots = report.indicators.find(i => i.type === 'total_lots')?.value;
        if (!totalLots || totalLots <= 0) {
            newErrors.total_lots = 'Total lots must be greater than 0';
        }
        
        const totalVolume = report.indicators.find(i => i.type === 'total_volume')?.value;
        if (!totalVolume || totalVolume <= 0) {
            newErrors.total_volume = 'Total volume must be greater than 0';
        }
        
        if (report.buyers.length === 0) {
            newErrors.buyers = 'At least one buyer is required';
        }
        
        if (report.brokers.length === 0) {
            newErrors.brokers = 'At least one broker is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [report]);

    // Auto-save functionality
    const autoSave = useCallback(async () => {
        if (!isDirty || !validateForm()) return;
        
        setAutoSaveStatus('saving');
        try {
            // Simulate auto-save delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setAutoSaveStatus('saved');
            setLastSaved(new Date());
            setIsDirty(false);
        } catch (error) {
            setAutoSaveStatus('error');
        }
    }, [isDirty, validateForm]);

    // Auto-save effect
    useEffect(() => {
        if (isDirty) {
            const timer = setTimeout(autoSave, 2000); // Auto-save after 2 seconds of inactivity
            return () => clearTimeout(timer);
        }
    }, [isDirty, autoSave]);

    // Mark form as dirty when data changes
    const markDirty = useCallback(() => {
        setIsDirty(true);
        setAutoSaveStatus(null);
    }, []);


    const handleSave = async () => {
        if (validateForm()) {
            try {
                setAutoSaveStatus('saving');
                
                // Save to data service
                const savedSale = await SupabaseService.saveAuctionReport(report);
                
                setAutoSaveStatus('saved');
                setLastSaved(new Date());
                setIsDirty(false);
                
                // Call the parent onSave callback
                onSave(report);
                
                console.log('Auction report saved successfully:', savedSale);
            } catch (error) {
                console.error('Error saving auction report:', error);
                setAutoSaveStatus('error');
            }
        }
    };

    const getAutoSaveStatusIcon = () => {
        switch (autoSaveStatus) {
            case 'saving':
                return (
                    <svg className="w-4 h-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                );
            case 'saved':
                return (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const formSections = [
        { id: 'auction-details', label: 'Auction Details', icon: '📅' },
        { id: 'market-indicators', label: 'Market Indicators', icon: '📊' },
        { id: 'micron-prices', label: 'Micron Prices', icon: '💰' },
        { id: 'buyers-brokers', label: 'Buyers & Brokers', icon: '👥' },
        { id: 'provincial-data', label: 'Provincial Data', icon: '🗺️' },
        { id: 'market-insights', label: 'Market Insights', icon: '💡' },
        { id: 'review-save', label: 'Review & Save', icon: '✅' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary">
                            {editingReport ? 'Edit Auction Report' : 'Add New Auction Report'}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {editingReport ? `Editing ${editingReport.auction.catalogue_name}` : 'Create a comprehensive auction report'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {autoSaveStatus && (
                            <div className="flex items-center gap-2 text-sm">
                                {getAutoSaveStatusIcon()}
                                <span className="text-gray-600">
                                    {autoSaveStatus === 'saving' && 'Saving...'}
                                    {autoSaveStatus === 'saved' && 'Auto-saved'}
                                    {autoSaveStatus === 'error' && 'Save failed'}
                                </span>
                            </div>
                        )}
                        {lastSaved && (
                            <div className="text-xs text-gray-500">
                                Last saved: {lastSaved.toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Form Navigation */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                    {formSections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeSection === section.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <span>{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Error Display */}
            {Object.keys(errors).length > 0 && (
                <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                                {Object.entries(errors).map(([field, error]) => (
                                    <li key={field}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Content */}
            <div className="p-6">
                {activeSection === 'auction-details' && (
                    <AuctionDetailsSection 
                        report={report} 
                        setReport={setReport} 
                        markDirty={markDirty}
                        errors={errors}
                    />
                )}
                {activeSection === 'market-indicators' && (
                    <MarketIndicatorsSection 
                        report={report} 
                        setReport={setReport} 
                        markDirty={markDirty}
                        errors={errors}
                    />
                )}
                {activeSection === 'micron-prices' && (
                    <MicronPricesSection 
                        report={report} 
                        setReport={setReport} 
                        markDirty={markDirty}
                    />
                )}
                {activeSection === 'buyers-brokers' && (
                    <BuyersBrokersSection 
                        report={report} 
                        setReport={setReport} 
                        markDirty={markDirty}
                    />
                )}
                {activeSection === 'provincial-data' && (
                    <ProvincialDataSection 
                        report={report} 
                        setReport={setReport} 
                        markDirty={markDirty}
                    />
                )}
                {activeSection === 'market-insights' && (
                    <MarketInsightsSection 
                        report={report} 
                        setReport={setReport} 
                        markDirty={markDirty}
                    />
                )}
                {activeSection === 'review-save' && (
                    <ReviewSaveSection 
                        report={report}
                        onSave={handleSave}
                        onCancel={onCancel}
                        errors={errors}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminForm;