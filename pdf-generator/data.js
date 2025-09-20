// PDF Generator Data Integration
// This file contains the data structure and functions to populate the PDF template

// Sample data structure matching the React app
const SAMPLE_AUCTION_DATA = {
    auction: {
        commodity: "wool",
        season_label: "2025/26",
        week_id: "week_2025_01",
        week_start: "2025-01-06",
        week_end: "2025-01-12",
        auction_date: "2025-01-08",
        catalogue_name: "CAT01"
    },
    indicators: [
        { type: "total_lots", unit: "bales", value: 10250, value_ytd: 50123, pct_change: 5.2 },
        { type: "total_volume", unit: "MT", value: 1550.8, value_ytd: 7580.4, pct_change: 3.1 },
        { type: "avg_price", unit: "ZAR/kg", value: 181.45, pct_change: -2.3 },
        { type: "total_value", unit: "ZAR M", value: 281.4, value_ytd: 1250.8, pct_change: 0.7 }
    ],
    benchmarks: [
        { label: "Certified", price: 184.35, currency: "ZAR/kg clean", day_change_pct: 1.4 },
        { label: "All-Merino", price: 179.53, currency: "ZAR/kg clean", day_change_pct: 1.0 },
        { label: "AWEX", price: 12.61, currency: "USD/kg clean", day_change_pct: 0.6 }
    ],
    yearly_average_prices: [
        { label: "Certified Wool Avg Price (YTD)", value: 188.50, unit: "ZAR/kg" },
        { label: "All - Merino Wool Avg Price (YTD)", value: 175.20, unit: "ZAR/kg" }
    ],
    micron_prices: [
        { bucket_micron: "17", category: "Fine", price_clean_zar_per_kg: 225.50, certified_price_clean_zar_per_kg: 228.20, all_merino_price_clean_zar_per_kg: 222.80 },
        { bucket_micron: "18", category: "Fine", price_clean_zar_per_kg: 210.00, certified_price_clean_zar_per_kg: 212.50, all_merino_price_clean_zar_per_kg: 207.50 },
        { bucket_micron: "19", category: "Fine", price_clean_zar_per_kg: 195.70, certified_price_clean_zar_per_kg: 198.20, all_merino_price_clean_zar_per_kg: 193.20 },
        { bucket_micron: "20", category: "Medium", price_clean_zar_per_kg: 182.40, certified_price_clean_zar_per_kg: 184.80, all_merino_price_clean_zar_per_kg: 180.00 },
        { bucket_micron: "21", category: "Medium", price_clean_zar_per_kg: 175.00, certified_price_clean_zar_per_kg: 177.30, all_merino_price_clean_zar_per_kg: 172.70 },
        { bucket_micron: "22", category: "Strong", price_clean_zar_per_kg: 168.20, certified_price_clean_zar_per_kg: 170.40, all_merino_price_clean_zar_per_kg: 166.00 },
        { bucket_micron: "23", category: "Strong", price_clean_zar_per_kg: 160.10, certified_price_clean_zar_per_kg: 162.20, all_merino_price_clean_zar_per_kg: 158.00 }
    ],
    buyers: [
        { buyer: "BKB PINNACLE FIBRES", share_pct: 24.89, cat: 1556, bales_ytd: 4419 },
        { buyer: "MODIANO SA", share_pct: 22.55, cat: 1410, bales_ytd: 3441 },
        { buyer: "STUCKEN & CO", share_pct: 18.72, cat: 1170, bales_ytd: 2980 },
        { buyer: "STANDARD WOOL", share_pct: 12.45, cat: 778, bales_ytd: 1950 },
        { buyer: "TIANYU SA", share_pct: 8.92, cat: 558, bales_ytd: 1420 },
        { buyer: "LEMPRIERE SA", share_pct: 6.78, cat: 424, bales_ytd: 1080 },
        { buyer: "SEGARD MASUREL SA", share_pct: 3.21, cat: 201, bales_ytd: 510 },
        { buyer: "VBC WOOL SA", share_pct: 2.48, cat: 155, bales_ytd: 395 }
    ],
    brokers: [
        { name: "BKB", catalogue_offering: 2850, sold: 2720, sold_ytd: 6850, clearance_rate: 95.4 },
        { name: "OVK", catalogue_offering: 2100, sold: 1980, sold_ytd: 5200, clearance_rate: 94.3 },
        { name: "JLW", catalogue_offering: 1800, sold: 1720, sold_ytd: 4500, clearance_rate: 95.6 },
        { name: "MAS", catalogue_offering: 1650, sold: 1580, sold_ytd: 4100, clearance_rate: 95.8 },
        { name: "QWB", catalogue_offering: 1200, sold: 1150, sold_ytd: 3000, clearance_rate: 95.8 },
        { name: "VLB", catalogue_offering: 1650, sold: 1580, sold_ytd: 4100, clearance_rate: 95.8 }
    ],
    currencies: [
        { code: "USD", value: 18.45, change: 0.2 },
        { code: "AUD", value: 12.20, change: -0.5 },
        { code: "EUR", value: 20.15, change: 0.8 }
    ],
    insights: "Market conditions remain stable with strong demand for fine micron wool. Certified wool continues to command premium prices with RWS certification showing positive trends. The market shows resilience despite global economic uncertainties.",
    trends: {
        rws: [],
        non_rws: [],
        awex: []
    },
    provincial_producers: [
        {
            province: "Western Cape",
            producers: [
                { name: "Riverside Farm", district: "Ceres", price: 245.50, micron: 17.5, certified: "RWS", buyer_name: "BKB PINNACLE FIBRES", description: "Fine Merino" },
                { name: "Mountain View", district: "Paarl", price: 238.20, micron: 18.0, certified: "RWS", buyer_name: "MODIANO SA", description: "Fine Merino" },
                { name: "Valley Estate", district: "Stellenbosch", price: 232.80, micron: 18.5, certified: "Standard", buyer_name: "STUCKEN & CO", description: "Medium Merino" }
            ]
        },
        {
            province: "Eastern Cape",
            producers: [
                { name: "Highland Farm", district: "Graaff-Reinet", price: 228.90, micron: 19.0, certified: "RWS", buyer_name: "STANDARD WOOL", description: "Medium Merino" },
                { name: "Spring Valley", district: "Cradock", price: 225.40, micron: 19.5, certified: "Standard", buyer_name: "TIANYU SA", description: "Medium Merino" }
            ]
        }
    ],
    province_avg_prices: [
        { province: "Western Cape", avg_price: 238.83 },
        { province: "Eastern Cape", avg_price: 227.15 },
        { province: "Free State", avg_price: 220.45 },
        { province: "Northern Cape", avg_price: 215.20 }
    ]
};

// Utility functions
function formatNumber(num, decimals = 0) {
    return num.toLocaleString('en-US', { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
    });
}

function formatPercentage(num) {
    return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateRwsPremium(certifiedPrice, allMerinoPrice) {
    if (allMerinoPrice > 0) {
        return ((certifiedPrice - allMerinoPrice) / allMerinoPrice) * 100;
    }
    return 0;
}

// Data population functions
function populateAuctionData(data) {
    // Update auction title section
    document.getElementById('catalogue-name').textContent = data.auction.catalogue_name;
    document.getElementById('auction-date').textContent = formatDate(data.auction.auction_date);
    document.getElementById('season-label').textContent = data.auction.season_label;
    
    // Update indicators
    data.indicators.forEach(indicator => {
        const elementId = indicator.type.replace('_', '-');
        const valueElement = document.getElementById(elementId);
        const changeElement = document.getElementById(elementId + '-change');
        
        if (valueElement) {
            valueElement.textContent = formatNumber(indicator.value, indicator.type === 'avg_price' ? 2 : 0);
        }
        
        if (changeElement) {
            changeElement.textContent = formatPercentage(indicator.pct_change);
            changeElement.className = `indicator-change ${indicator.pct_change >= 0 ? 'positive' : 'negative'}`;
        }
    });
    
    // Update market overview
    const usdRate = data.currencies.find(c => c.code === 'USD');
    if (usdRate) {
        document.getElementById('usd-rate').textContent = formatNumber(usdRate.value, 2);
        document.getElementById('usd-change').textContent = formatPercentage(usdRate.change);
    }
    
    // Calculate and update RWS premium
    const certifiedPrice = data.yearly_average_prices.find(p => p.label.includes('Certified'))?.value || 0;
    const allMerinoPrice = data.yearly_average_prices.find(p => p.label.includes('All - Merino'))?.value || 0;
    const rwsPremium = calculateRwsPremium(certifiedPrice, allMerinoPrice);
    
    document.getElementById('rws-premium').textContent = formatNumber(rwsPremium, 1) + '%';
    
    // Update AWEX price
    const awexBenchmark = data.benchmarks.find(b => b.label === 'AWEX');
    if (awexBenchmark) {
        document.getElementById('awex-price').textContent = formatNumber(awexBenchmark.price, 2);
        document.getElementById('awex-change').textContent = formatPercentage(awexBenchmark.day_change_pct);
    }
    
    // Update market insights
    document.getElementById('market-insights').innerHTML = `<p>${data.insights}</p>`;
    
    // Update top sales table
    populateTopSalesTable(data);
    
    // Update buyers table
    populateBuyersTable(data);
    
    // Update brokers table
    populateBrokersTable(data);
}

function populateTopSalesTable(data) {
    const tbody = document.getElementById('top-sales-table');
    tbody.innerHTML = '';
    
    // Generate top sales from provincial producers
    const topSales = data.provincial_producers
        .flatMap(p => p.producers)
        .sort((a, b) => b.price - a.price)
        .slice(0, 10);
    
    topSales.forEach((sale, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${sale.name}</td>
            <td>${sale.district}</td>
            <td>${formatNumber(sale.price, 2)}</td>
            <td>${sale.micron}</td>
            <td>${sale.certified}</td>
            <td>${sale.buyer_name}</td>
        `;
        tbody.appendChild(row);
    });
}

function populateBuyersTable(data) {
    const tbody = document.getElementById('buyers-table');
    tbody.innerHTML = '';
    
    data.buyers.slice(0, 8).forEach(buyer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${buyer.buyer}</td>
            <td>${formatNumber(buyer.share_pct, 2)}%</td>
            <td>${formatNumber(buyer.cat)}</td>
        `;
        tbody.appendChild(row);
    });
}

function populateBrokersTable(data) {
    const tbody = document.getElementById('brokers-table');
    tbody.innerHTML = '';
    
    data.brokers.forEach(broker => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${broker.name}</td>
            <td>${formatNumber(broker.catalogue_offering)}</td>
            <td>${formatNumber(broker.sold)}</td>
            <td>${formatNumber(broker.clearance_rate, 1)}%</td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize with sample data
document.addEventListener('DOMContentLoaded', function() {
    // Set current month and year
    const now = new Date();
    document.getElementById('current-month').textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    document.getElementById('current-year').textContent = now.getFullYear();
    
    // Populate with sample data
    populateAuctionData(SAMPLE_AUCTION_DATA);
});

// Export functions for external use
window.PDFGenerator = {
    populateAuctionData,
    SAMPLE_AUCTION_DATA,
    formatNumber,
    formatPercentage,
    formatDate,
    calculateRwsPremium
};
