// JSON-based data storage service for development
// This will be replaced with Supabase integration later

import { 
  DatabaseStorage, 
  Sale, 
  Indicator, 
  ExchangeRate, 
  CertifiedVsNonCert, 
  CertifiedShare, 
  SaleStatistics, 
  Receivals, 
  OfferingAnalysis, 
  BuyerPurchase, 
  SaleAnalysisTotals, 
  BalesSoldByLength, 
  BalesSoldByStyle, 
  AveragePricesClean, 
  ReportIngestAudit,
  CompleteAuctionData,
  FormToDatabaseMapping
} from './models';

// Utility functions
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Storage keys for localStorage
const STORAGE_KEYS = {
  SALES: 'wool_market_sales',
  INDICATORS: 'wool_market_indicators',
  EXCHANGE_RATES: 'wool_market_exchange_rates',
  CERTIFIED_VS_NONCERT: 'wool_market_certified_vs_noncert',
  CERTIFIED_SHARE: 'wool_market_certified_share',
  SALE_STATISTICS: 'wool_market_sale_statistics',
  RECEIVALS: 'wool_market_receivals',
  OFFERING_ANALYSIS: 'wool_market_offering_analysis',
  BUYER_PURCHASES: 'wool_market_buyer_purchases',
  SALE_ANALYSIS_TOTALS: 'wool_market_sale_analysis_totals',
  BALES_SOLD_BY_LENGTH: 'wool_market_bales_sold_by_length',
  BALES_SOLD_BY_STYLE: 'wool_market_bales_sold_by_style',
  AVERAGE_PRICES_CLEAN: 'wool_market_average_prices_clean',
  REPORT_INGEST_AUDIT: 'wool_market_report_ingest_audit'
};

// Generic storage functions
const getFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error reading from storage for key ${key}:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to storage for key ${key}:`, error);
  }
};

// Sale operations
export const saleStorage = {
  getAll: (): Sale[] => {
    return getFromStorage<Sale>(STORAGE_KEYS.SALES, []);
  },

  getById: (id: string): Sale | undefined => {
    const sales = saleStorage.getAll();
    return sales.find(sale => sale.id === id);
  },

  getBySeasonAndCatalogue: (season: string, catalogueNo: number): Sale | undefined => {
    const sales = saleStorage.getAll();
    return sales.find(sale => sale.season === season && sale.catalogue_no === catalogueNo);
  },

  create: (saleData: Omit<Sale, 'id' | 'created_at'>): Sale => {
    const sales = saleStorage.getAll();
    const newSale: Sale = {
      ...saleData,
      id: generateId(),
      created_at: getCurrentTimestamp()
    };
    sales.push(newSale);
    saveToStorage(STORAGE_KEYS.SALES, sales);
    return newSale;
  },

  update: (id: string, updates: Partial<Sale>): Sale | null => {
    const sales = saleStorage.getAll();
    const index = sales.findIndex(sale => sale.id === id);
    if (index === -1) return null;
    
    sales[index] = { ...sales[index], ...updates };
    saveToStorage(STORAGE_KEYS.SALES, sales);
    return sales[index];
  },

  delete: (id: string): boolean => {
    const sales = saleStorage.getAll();
    const filteredSales = sales.filter(sale => sale.id !== id);
    if (filteredSales.length === sales.length) return false;
    
    saveToStorage(STORAGE_KEYS.SALES, filteredSales);
    return true;
  }
};

// Indicator operations
export const indicatorStorage = {
  getAll: (): Indicator[] => {
    return getFromStorage<Indicator>(STORAGE_KEYS.INDICATORS, []);
  },

  getBySaleId: (saleId: string): Indicator[] => {
    const indicators = indicatorStorage.getAll();
    return indicators.filter(indicator => indicator.sale_id === saleId);
  },

  create: (indicatorData: Omit<Indicator, 'id'>): Indicator => {
    const indicators = indicatorStorage.getAll();
    const newIndicator: Indicator = {
      ...indicatorData,
      id: generateId()
    };
    indicators.push(newIndicator);
    saveToStorage(STORAGE_KEYS.INDICATORS, indicators);
    return newIndicator;
  },

  createMany: (indicatorsData: Omit<Indicator, 'id'>[]): Indicator[] => {
    const indicators = indicatorStorage.getAll();
    const newIndicators: Indicator[] = indicatorsData.map(data => ({
      ...data,
      id: generateId()
    }));
    indicators.push(...newIndicators);
    saveToStorage(STORAGE_KEYS.INDICATORS, indicators);
    return newIndicators;
  },

  deleteBySaleId: (saleId: string): void => {
    const indicators = indicatorStorage.getAll();
    const filteredIndicators = indicators.filter(indicator => indicator.sale_id !== saleId);
    saveToStorage(STORAGE_KEYS.INDICATORS, filteredIndicators);
  }
};

// Exchange rate operations
export const exchangeRateStorage = {
  getAll: (): ExchangeRate[] => {
    return getFromStorage<ExchangeRate>(STORAGE_KEYS.EXCHANGE_RATES, []);
  },

  getBySaleId: (saleId: string): ExchangeRate[] => {
    const rates = exchangeRateStorage.getAll();
    return rates.filter(rate => rate.sale_id === saleId);
  },

  createMany: (ratesData: Omit<ExchangeRate, 'id'>[]): ExchangeRate[] => {
    const rates = exchangeRateStorage.getAll();
    const newRates: ExchangeRate[] = ratesData.map(data => ({
      ...data,
      id: generateId()
    }));
    rates.push(...newRates);
    saveToStorage(STORAGE_KEYS.EXCHANGE_RATES, rates);
    return newRates;
  },

  deleteBySaleId: (saleId: string): void => {
    const rates = exchangeRateStorage.getAll();
    const filteredRates = rates.filter(rate => rate.sale_id !== saleId);
    saveToStorage(STORAGE_KEYS.EXCHANGE_RATES, filteredRates);
  }
};

// Buyer purchase operations
export const buyerPurchaseStorage = {
  getAll: (): BuyerPurchase[] => {
    return getFromStorage<BuyerPurchase>(STORAGE_KEYS.BUYER_PURCHASES, []);
  },

  getBySaleId: (saleId: string): BuyerPurchase[] => {
    const purchases = buyerPurchaseStorage.getAll();
    return purchases.filter(purchase => purchase.sale_id === saleId);
  },

  createMany: (purchasesData: Omit<BuyerPurchase, 'id'>[]): BuyerPurchase[] => {
    const purchases = buyerPurchaseStorage.getAll();
    const newPurchases: BuyerPurchase[] = purchasesData.map(data => ({
      ...data,
      id: generateId()
    }));
    purchases.push(...newPurchases);
    saveToStorage(STORAGE_KEYS.BUYER_PURCHASES, purchases);
    return newPurchases;
  },

  deleteBySaleId: (saleId: string): void => {
    const purchases = buyerPurchaseStorage.getAll();
    const filteredPurchases = purchases.filter(purchase => purchase.sale_id !== saleId);
    saveToStorage(STORAGE_KEYS.BUYER_PURCHASES, filteredPurchases);
  }
};

// Offering analysis operations
export const offeringAnalysisStorage = {
  getAll: (): OfferingAnalysis[] => {
    return getFromStorage<OfferingAnalysis>(STORAGE_KEYS.OFFERING_ANALYSIS, []);
  },

  getBySaleId: (saleId: string): OfferingAnalysis[] => {
    const analyses = offeringAnalysisStorage.getAll();
    return analyses.filter(analysis => analysis.sale_id === saleId);
  },

  createMany: (analysesData: Omit<OfferingAnalysis, 'id'>[]): OfferingAnalysis[] => {
    const analyses = offeringAnalysisStorage.getAll();
    const newAnalyses: OfferingAnalysis[] = analysesData.map(data => ({
      ...data,
      id: generateId()
    }));
    analyses.push(...newAnalyses);
    saveToStorage(STORAGE_KEYS.OFFERING_ANALYSIS, analyses);
    return newAnalyses;
  },

  deleteBySaleId: (saleId: string): void => {
    const analyses = offeringAnalysisStorage.getAll();
    const filteredAnalyses = analyses.filter(analysis => analysis.sale_id !== saleId);
    saveToStorage(STORAGE_KEYS.OFFERING_ANALYSIS, filteredAnalyses);
  }
};

// Average prices clean operations
export const averagePricesCleanStorage = {
  getAll: (): AveragePricesClean[] => {
    return getFromStorage<AveragePricesClean>(STORAGE_KEYS.AVERAGE_PRICES_CLEAN, []);
  },

  getBySaleId: (saleId: string): AveragePricesClean[] => {
    const prices = averagePricesCleanStorage.getAll();
    return prices.filter(price => price.sale_id === saleId);
  },

  createMany: (pricesData: Omit<AveragePricesClean, 'id'>[]): AveragePricesClean[] => {
    const prices = averagePricesCleanStorage.getAll();
    const newPrices: AveragePricesClean[] = pricesData.map(data => ({
      ...data,
      id: generateId()
    }));
    prices.push(...newPrices);
    saveToStorage(STORAGE_KEYS.AVERAGE_PRICES_CLEAN, prices);
    return newPrices;
  },

  deleteBySaleId: (saleId: string): void => {
    const prices = averagePricesCleanStorage.getAll();
    const filteredPrices = prices.filter(price => price.sale_id !== saleId);
    saveToStorage(STORAGE_KEYS.AVERAGE_PRICES_CLEAN, filteredPrices);
  }
};

// Complete auction data operations
export const completeAuctionStorage = {
  // Save complete auction data
  save: (auctionData: CompleteAuctionData): Sale => {
    // First, delete any existing data for this sale
    completeAuctionStorage.deleteBySaleId(auctionData.sale.id);
    
    // Save the sale
    const sale = saleStorage.create(auctionData.sale);
    
    // Save all related data
    if (auctionData.indicators.length > 0) {
      indicatorStorage.createMany(auctionData.indicators.map(ind => ({ ...ind, sale_id: sale.id })));
    }
    
    if (auctionData.exchange_rates.length > 0) {
      exchangeRateStorage.createMany(auctionData.exchange_rates.map(rate => ({ ...rate, sale_id: sale.id })));
    }
    
    if (auctionData.buyer_purchases.length > 0) {
      buyerPurchaseStorage.createMany(auctionData.buyer_purchases.map(purchase => ({ ...purchase, sale_id: sale.id })));
    }
    
    if (auctionData.offering_analysis.length > 0) {
      offeringAnalysisStorage.createMany(auctionData.offering_analysis.map(analysis => ({ ...analysis, sale_id: sale.id })));
    }
    
    if (auctionData.average_prices_clean.length > 0) {
      averagePricesCleanStorage.createMany(auctionData.average_prices_clean.map(price => ({ ...price, sale_id: sale.id })));
    }
    
    return sale;
  },

  // Get complete auction data
  getBySaleId: (saleId: string): CompleteAuctionData | null => {
    const sale = saleStorage.getById(saleId);
    if (!sale) return null;
    
    return {
      sale,
      indicators: indicatorStorage.getBySaleId(saleId),
      exchange_rates: exchangeRateStorage.getBySaleId(saleId),
      certified_vs_noncert: [], // TODO: Implement these
      certified_share: [],
      sale_statistics: [],
      receivals: [],
      offering_analysis: offeringAnalysisStorage.getBySaleId(saleId),
      buyer_purchases: buyerPurchaseStorage.getBySaleId(saleId),
      sale_analysis_totals: [],
      bales_sold_by_length: [],
      bales_sold_by_style: [],
      average_prices_clean: averagePricesCleanStorage.getBySaleId(saleId),
      report_ingest_audit: []
    };
  },

  // Delete complete auction data
  deleteBySaleId: (saleId: string): void => {
    saleStorage.delete(saleId);
    indicatorStorage.deleteBySaleId(saleId);
    exchangeRateStorage.deleteBySaleId(saleId);
    buyerPurchaseStorage.deleteBySaleId(saleId);
    offeringAnalysisStorage.deleteBySaleId(saleId);
    averagePricesCleanStorage.deleteBySaleId(saleId);
  },

  // Get all sales with basic info
  getAllSales: (): Sale[] => {
    return saleStorage.getAll();
  }
};

// Export all storage operations
export const storage = {
  sales: saleStorage,
  indicators: indicatorStorage,
  exchangeRates: exchangeRateStorage,
  buyerPurchases: buyerPurchaseStorage,
  offeringAnalysis: offeringAnalysisStorage,
  averagePricesClean: averagePricesCleanStorage,
  completeAuction: completeAuctionStorage
};
