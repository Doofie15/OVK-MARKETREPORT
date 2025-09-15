const JSONDatabase = require('./database');
const path = require('path');

// Initialize database
const db = new JSONDatabase();

// Sample data for testing
const sampleSales = [
  {
    season: "2025/26",
    catalogue_no: 1,
    sale_date: "2025-01-08",
    location: "Port Elizabeth",
    total_bales_offered: 10250,
    total_bales_sold: 9750,
    clearance_pct: 95.12,
    highest_price_c_per_kg_clean: 246.36,
    highest_price_micron: 16.4,
    next_sale_date: "2025-01-15",
    next_sale_bales: 8500,
    is_draft: false
  },
  {
    season: "2025/26",
    catalogue_no: 2,
    sale_date: "2025-01-15",
    location: "Port Elizabeth",
    total_bales_offered: 8500,
    total_bales_sold: 8200,
    clearance_pct: 96.47,
    highest_price_c_per_kg_clean: 251.20,
    highest_price_micron: 16.2,
    next_sale_date: "2025-01-22",
    next_sale_bales: 9200,
    is_draft: false
  },
  {
    season: "2025/26",
    catalogue_no: 3,
    sale_date: "2025-01-22",
    location: "Port Elizabeth",
    total_bales_offered: 9200,
    total_bales_sold: 8900,
    clearance_pct: 96.74,
    highest_price_c_per_kg_clean: 248.90,
    highest_price_micron: 16.5,
    next_sale_date: "2025-01-29",
    next_sale_bales: 8800,
    is_draft: false
  }
];

const sampleIndicators = [
  {
    sale_id: "", // Will be set after sale creation
    indicator: "all_merino",
    unit: "sa_c_per_kg_clean",
    value_this_sale: 175.50,
    value_prior_sale: 172.30,
    pct_change: 1.86
  },
  {
    sale_id: "",
    indicator: "certified_merino",
    unit: "sa_c_per_kg_clean",
    value_this_sale: 182.75,
    value_prior_sale: 179.20,
    pct_change: 1.98
  },
  {
    sale_id: "",
    indicator: "awex_emi",
    unit: "us_c_per_kg_clean",
    value_this_sale: 12.45,
    value_prior_sale: 12.20,
    pct_change: 2.05
  }
];

const sampleExchangeRates = [
  {
    sale_id: "",
    pair: "ZAR/USD",
    value_this_sale: 17.65,
    value_prior_sale: 17.80,
    pct_change: -0.84,
    note: "Average of rate points during sale"
  },
  {
    sale_id: "",
    pair: "ZAR/EUR",
    value_this_sale: 19.24,
    value_prior_sale: 19.10,
    pct_change: 0.73,
    note: "Average of rate points during sale"
  },
  {
    sale_id: "",
    pair: "ZAR/JPY",
    value_this_sale: 0.118,
    value_prior_sale: 0.120,
    pct_change: -1.67,
    note: "Average of rate points during sale"
  }
];

const sampleBuyerPurchases = [
  {
    sale_id: "",
    company: "BKB PINNACLE FIBRES",
    bales_this_sale: 1556,
    pct_share: 24.89,
    bales_ytd: 4419
  },
  {
    sale_id: "",
    company: "MODIANO SA",
    bales_this_sale: 1410,
    pct_share: 22.55,
    bales_ytd: 3441
  },
  {
    sale_id: "",
    company: "STUCKEN & CO",
    bales_this_sale: 893,
    pct_share: 14.28,
    bales_ytd: 2650
  },
  {
    sale_id: "",
    company: "STANDARD WOOL",
    bales_this_sale: 852,
    pct_share: 13.63,
    bales_ytd: 2514
  },
  {
    sale_id: "",
    company: "TIANYU SA",
    bales_this_sale: 722,
    pct_share: 11.55,
    bales_ytd: 3244
  }
];

const sampleOfferingAnalysis = [
  {
    sale_id: "",
    broker: "BKB",
    catalogue_offering: 3339,
    withdrawn_before: 0,
    wool_offered: 3339,
    withdrawn_during: 0,
    passed: 0,
    not_sold: 0,
    sold: 3339,
    pct_sold: 100.0
  },
  {
    sale_id: "",
    broker: "OVK",
    catalogue_offering: 1391,
    withdrawn_before: 0,
    wool_offered: 1391,
    withdrawn_during: 0,
    passed: 0,
    not_sold: 0,
    sold: 1391,
    pct_sold: 100.0
  },
  {
    sale_id: "",
    broker: "JLW",
    catalogue_offering: 525,
    withdrawn_before: 0,
    wool_offered: 525,
    withdrawn_during: 0,
    passed: 0,
    not_sold: 0,
    sold: 525,
    pct_sold: 100.0
  }
];

const sampleAveragePricesClean = [
  {
    sale_id: "",
    micron: 17.0,
    style_code: "MF5",
    length_mm: 60,
    cert: "certified",
    avg_price_r_ckg: 225.50
  },
  {
    sale_id: "",
    micron: 18.0,
    style_code: "MF5",
    length_mm: 60,
    cert: "certified",
    avg_price_r_ckg: 210.00
  },
  {
    sale_id: "",
    micron: 19.0,
    style_code: "MF5",
    length_mm: 60,
    cert: "certified",
    avg_price_r_ckg: 195.70
  },
  {
    sale_id: "",
    micron: 20.0,
    style_code: "MF5",
    length_mm: 60,
    cert: "certified",
    avg_price_r_ckg: 182.40
  },
  {
    sale_id: "",
    micron: 21.0,
    style_code: "MF5",
    length_mm: 60,
    cert: "certified",
    avg_price_r_ckg: 175.00
  },
  {
    sale_id: "",
    micron: 22.0,
    style_code: "MF5",
    length_mm: 60,
    cert: "certified",
    avg_price_r_ckg: 168.20
  }
];

// Seed the database
function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    const existingSales = db.getSales();
    existingSales.forEach(sale => {
      db.deleteSale(sale.id);
    });

    // Create sample sales with related data
    sampleSales.forEach((saleData, index) => {
      console.log(`📊 Creating sale ${index + 1}/${sampleSales.length}...`);
      
      // Create the sale
      const sale = db.createSale(saleData);
      
      // Create indicators for this sale
      sampleIndicators.forEach(indicatorData => {
        db.create('indicators', {
          ...indicatorData,
          sale_id: sale.id
        });
      });
      
      // Create exchange rates for this sale
      sampleExchangeRates.forEach(rateData => {
        db.create('exchange_rates', {
          ...rateData,
          sale_id: sale.id
        });
      });
      
      // Create buyer purchases for this sale
      sampleBuyerPurchases.forEach(purchaseData => {
        db.create('buyer_purchases', {
          ...purchaseData,
          sale_id: sale.id
        });
      });
      
      // Create offering analysis for this sale
      sampleOfferingAnalysis.forEach(analysisData => {
        db.create('offering_analysis', {
          ...analysisData,
          sale_id: sale.id
        });
      });
      
      // Create average prices clean for this sale
      sampleAveragePricesClean.forEach(priceData => {
        db.create('average_prices_clean', {
          ...priceData,
          sale_id: sale.id
        });
      });
    });

    console.log('✅ Database seeding completed successfully!');
    console.log(`📈 Created ${sampleSales.length} sales with related data`);
    console.log(`📊 Total records in database: ${db.getTotalRecords()}`);
    
    // Display statistics
    const stats = db.getStatistics();
    console.log('\n📊 Database Statistics:');
    console.log(`   Total Auctions: ${stats.totalAuctions}`);
    console.log(`   Total Bales: ${stats.totalBales.toLocaleString()}`);
    console.log(`   Average Clearance: ${stats.averageClearance.toFixed(2)}%`);
    console.log(`   Latest Auction: ${stats.latestAuctionDate}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleSales, sampleIndicators, sampleExchangeRates, sampleBuyerPurchases, sampleOfferingAnalysis, sampleAveragePricesClean };
