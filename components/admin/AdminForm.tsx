import React, { useState, useEffect, useCallback } from 'react';
import type { AuctionReport, Buyer, BrokerData, ProvincialProducerData, ProvincialProducer } from '../../types';
import { BLANK_REPORT, BUYERS, BROKERS } from '../../constants';

interface AdminFormProps {
    onSave: (report: Omit<AuctionReport, 'top_sales'>) => void;
    onCancel: () => void;
    latestReport?: AuctionReport;
}

const inputClass = "w-full p-1 border rounded bg-white text-gray-900 text-sm focus:ring-accent focus:border-accent";
const thClass = "p-2 text-left text-sm font-semibold text-gray-600 bg-gray-100";
const tdClass = "p-1";

const AdminForm: React.FC<AdminFormProps> = ({ onSave, onCancel }) => {
    const [report, setReport] = useState<Omit<AuctionReport, 'top_sales'>>(BLANK_REPORT);

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
    };
    
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
            let item = yearlyPrices.find(p => p.label.includes('RWS'));
            if(item) item.value = numericValue; else yearlyPrices.push({ label: 'RWS Avg Price (YTD)', value: numericValue, unit: 'ZAR/kg' });
        } else if (field === 'avg_non_rws') {
            let item = yearlyPrices.find(p => p.label.includes('Non-RWS'));
            if(item) item.value = numericValue; else yearlyPrices.push({ label: 'Non-RWS Avg Price (YTD)', value: numericValue, unit: 'ZAR/kg' });
        }

        setReport(prev => ({ ...prev, indicators, yearly_average_prices: yearlyPrices }));
    };

    const handleMicronPriceChange = (index: number, value: string) => {
        const micron_prices = [...report.micron_prices];
        micron_prices[index].price_clean_zar_per_kg = parseFloat(value) || 0;
        setReport(prev => ({...prev, micron_prices}));
    };

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
    };

    const addBuyer = () => setReport(prev => ({ ...prev, buyers: [...prev.buyers, { buyer: BUYERS[0], cat: 0, share_pct: 0, bales_ytd: 0 }]}));
    const removeBuyer = (index: number) => setReport(prev => ({ ...prev, buyers: prev.buyers.filter((_, i) => i !== index)}));

    const handleBrokerChange = (index: number, field: keyof BrokerData, value: any) => {
        const brokers = [...report.brokers];
        (brokers[index] as any)[field] = value;
        setReport(prev => ({ ...prev, brokers }));
    };

    const addBroker = () => setReport(prev => ({ ...prev, brokers: [...prev.brokers, { name: BROKERS[0], catalogue_offering: 0, sold_ytd: 0 }]}));
    const removeBroker = (index: number) => setReport(prev => ({ ...prev, brokers: prev.brokers.filter((_, i) => i !== index)}));
    
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
    };
    
    const removeProvincialProducer = (provinceName: string, producerIndex: number) => {
        const provincial_producers = [...report.provincial_producers];
        let provinceData = provincial_producers.find(p => p.province === provinceName);
        if(provinceData) {
            provinceData.producers.splice(producerIndex, 1);
            provinceData.producers.forEach((p, i) => p.position = i + 1);
            setReport(prev => ({...prev, provincial_producers}));
        }
    };

    const getStat = (type: string) => {
      if (type.includes('avg')) {
        return report.yearly_average_prices?.find(p => p.label.toLowerCase().includes(type.split('_')[1]))?.value || '';
      }
      return report.indicators.find(i => i.type === type)?.value || '';
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6">
             <h1 className="text-2xl font-bold text-brand-primary">Add New Auction Report</h1>
             <div className="space-y-4">
                {/* Auction Details & Stats */}
                <table className="w-full border-collapse">
                    <thead>
                        <tr><th className={thClass} colSpan={4}>Auction Details</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={`${tdClass} w-1/4`}><label>Auction Date</label></td>
                            <td className={`${tdClass} w-1/4`}><input type="date" value={report.auction.auction_date} onChange={handleDateChange} className={inputClass} /></td>
                            <td className={`${tdClass} w-1/4`}><label>Week Start</label></td>
                            <td className={`${tdClass} w-1/4`}><input type="date" value={report.auction.week_start} readOnly className={`${inputClass} bg-gray-200`} /></td>
                        </tr>
                        <tr>
                            <td className={tdClass}><label>Catalogue Name</label></td>
                            <td className={tdClass}><input value={report.auction.catalogue_name} onChange={e => setReport(p => ({...p, auction: {...p.auction, catalogue_name: e.target.value}}))} className={inputClass} /></td>
                            <td className={tdClass}><label>Week End</label></td>
                            <td className={tdClass}><input type="date" value={report.auction.week_end} readOnly className={`${inputClass} bg-gray-200`} /></td>
                        </tr>
                    </tbody>
                     <thead>
                        <tr><th className={thClass} colSpan={4}>Auction Stats</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={tdClass}><label>Total Lots</label></td>
                            <td className={tdClass}><input type="number" value={getStat('total_lots')} onChange={e => handleStatsChange('total_lots', e.target.value)} className={inputClass} /></td>
                            <td className={tdClass}><label>Avg Price RWS Certified</label></td>
                            <td className={tdClass}><input type="number" value={getStat('avg_rws')} onChange={e => handleStatsChange('avg_rws', e.target.value)} className={inputClass} /></td>
                        </tr>
                        <tr>
                            <td className={tdClass}><label>Total Volume (MT)</label></td>
                            <td className={tdClass}><input type="number" value={getStat('total_volume')} onChange={e => handleStatsChange('total_volume', e.target.value)} className={inputClass} /></td>
                            <td className={tdClass}><label>Avg Price Non-Certified</label></td>
                            <td className={tdClass}><input type="number" value={getStat('avg_non_rws')} onChange={e => handleStatsChange('avg_non_rws', e.target.value)} className={inputClass} /></td>
                        </tr>
                         <tr>
                            <td className={tdClass}><label>Auction Turnover (ZAR M)</label></td>
                            <td className={tdClass}><input type="number" value={getStat('total_value')} onChange={e => handleStatsChange('total_value', e.target.value)} className={inputClass} /></td>
                            <td className={tdClass}></td>
                            <td className={tdClass}></td>
                        </tr>
                    </tbody>
                </table>
                {/* Micron Prices */}
                <table className="w-full border-collapse">
                    <thead><tr><th className={thClass} colSpan={8}>Micron Prices (ZAR/kg clean)</th></tr></thead>
                    <tbody>
                        <tr>
                            {report.micron_prices.map(p => <td key={p.bucket_micron} className={`${tdClass} text-center font-semibold text-sm`}>{p.bucket_micron}µ</td>)}
                        </tr>
                        <tr>
                            {report.micron_prices.map((p, i) => <td key={i} className={tdClass}><input type="number" value={p.price_clean_zar_per_kg || ''} onChange={e => handleMicronPriceChange(i, e.target.value)} className={inputClass}/></td>)}
                        </tr>
                    </tbody>
                </table>
                {/* Buyers List */}
                <table className="w-full border-collapse">
                     <thead><tr><th className={thClass} colSpan={4}>Buyers List</th></tr></thead>
                     <tbody>
                        {report.buyers.map((buyer, index) => (
                             <tr key={index}>
                                <td className={tdClass} style={{width: '40%'}}>
                                    <select value={buyer.buyer} onChange={e => handleBuyerChange(index, 'buyer', e.target.value)} className={inputClass}>
                                        {BUYERS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </td>
                                <td className={tdClass} style={{width: '20%'}}><input type="number" placeholder="Qty Bales" value={buyer.cat || ''} onChange={e => handleBuyerChange(index, 'cat', parseInt(e.target.value))} className={inputClass} /></td>
                                <td className={tdClass} style={{width: '20%'}}><input type="number" placeholder="% Share" value={buyer.share_pct.toFixed(2)} onChange={e => handleBuyerChange(index, 'share_pct', parseFloat(e.target.value))} className={inputClass} /></td>
                                <td className={tdClass} style={{width: '20%'}}><button onClick={() => removeBuyer(index)} className="w-full bg-red-500 text-white p-1 rounded text-sm">Remove</button></td>
                             </tr>
                        ))}
                        <tr><td colSpan={4} className={tdClass}><button onClick={addBuyer} className="w-full bg-blue-500 text-white p-1 rounded text-sm">Add Buyer</button></td></tr>
                     </tbody>
                </table>
                 {/* Brokers */}
                <table className="w-full border-collapse">
                     <thead><tr><th className={thClass} colSpan={3}>Brokers</th></tr></thead>
                     <tbody>
                        {report.brokers.map((broker, index) => (
                             <tr key={index}>
                                <td className={tdClass} style={{width: '50%'}}>
                                    <select value={broker.name} onChange={e => handleBrokerChange(index, 'name', e.target.value)} className={inputClass}>
                                        {BROKERS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </td>
                                <td className={tdClass} style={{width: '30%'}}><input type="number" placeholder="Catalogue Offering" value={broker.catalogue_offering || ''} onChange={e => handleBrokerChange(index, 'catalogue_offering', parseInt(e.target.value))} className={inputClass} /></td>
                                <td className={tdClass} style={{width: '20%'}}><button onClick={() => removeBroker(index)} className="w-full bg-red-500 text-white p-1 rounded text-sm">Remove</button></td>
                             </tr>
                        ))}
                        <tr><td colSpan={3} className={tdClass}><button onClick={addBroker} className="w-full bg-blue-500 text-white p-1 rounded text-sm">Add Broker</button></td></tr>
                     </tbody>
                </table>
                 {/* Top Performers */}
                <div>
                    <div className="flex items-center gap-4 p-2 bg-gray-100 rounded-t-md">
                        <h3 className="text-sm font-semibold text-gray-600">Top 10 Performers per Province</h3>
                        <select value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)} className="p-1 border rounded text-sm">
                            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-1 text-left text-xs text-gray-500">Rank</th>
                                <th className="p-1 text-left text-xs text-gray-500">Producer Name</th>
                                <th className="p-1 text-left text-xs text-gray-500">Region</th>
                                <th className="p-1 text-left text-xs text-gray-500">Micron</th>
                                <th className="p-1 text-left text-xs text-gray-500">Price</th>
                                <th className="p-1 text-left text-xs text-gray-500">Certified</th>
                                <th className="p-1 text-left text-xs text-gray-500">Buyer</th>
                                <th className="p-1 text-left text-xs text-gray-500"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {(report.provincial_producers.find(p => p.province === selectedProvince)?.producers || []).map((producer, index) => (
                                <tr key={index}>
                                    <td className={tdClass}><input type="number" value={producer.position} onChange={e => handleProvincialProducerChange(selectedProvince, index, 'position', parseInt(e.target.value))} className={inputClass} /></td>
                                    <td className={tdClass}><input value={producer.name} onChange={e => handleProvincialProducerChange(selectedProvince, index, 'name', e.target.value)} className={inputClass} /></td>
                                    <td className={tdClass}><input value={producer.district} onChange={e => handleProvincialProducerChange(selectedProvince, index, 'district', e.target.value)} className={inputClass} /></td>
                                    <td className={tdClass}><input type="number" value={producer.micron || ''} onChange={e => handleProvincialProducerChange(selectedProvince, index, 'micron', parseFloat(e.target.value))} className={inputClass} /></td>
                                    <td className={tdClass}><input type="number" value={producer.price || ''} onChange={e => handleProvincialProducerChange(selectedProvince, index, 'price', parseFloat(e.target.value))} className={inputClass} /></td>
                                    <td className={tdClass}>
                                        <select value={producer.certified} onChange={e => handleProvincialProducerChange(selectedProvince, index, 'certified', e.target.value)} className={inputClass}>
                                            <option value="">Blank</option>
                                            <option value="RWS">RWS</option>
                                        </select>
                                    </td>
                                    <td className={tdClass}><input value={producer.buyer_name} onChange={e => handleProvincialProducerChange(selectedProvince, index, 'buyer_name', e.target.value)} className={inputClass} /></td>
                                    <td className={tdClass}><button onClick={() => removeProvincialProducer(selectedProvince, index)} className="w-full bg-red-500 text-white p-1 rounded text-sm">X</button></td>
                                </tr>
                            ))}
                             <tr><td colSpan={8} className={tdClass}><button onClick={() => addProvincialProducer(selectedProvince)} className="w-full bg-blue-500 text-white p-1 rounded text-sm">Add Performer for {selectedProvince}</button></td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Market Insights */}
                 <div>
                    <h3 className={thClass}>Market Insights / Comments</h3>
                    <textarea value={report.insights} onChange={e => setReport(prev => ({...prev, insights: e.target.value}))} className={`${inputClass} mt-1`} rows={4}></textarea>
                 </div>
            </div>
             <div className="flex justify-end gap-4 mt-8">
                <button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                <button onClick={() => onSave(report)} className="bg-brand-primary hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition-colors">Save Report</button>
            </div>
        </div>
    );
};

export default AdminForm;