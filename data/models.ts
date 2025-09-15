// Data models that mirror the Supabase schema
// These will be used for JSON storage during development

export type IndicatorType = 'all_merino' | 'certified_merino' | 'awex_emi';
export type ValueUnit = 'sa_c_per_kg_clean' | 'us_c_per_kg_clean' | 'euro_c_per_kg_clean' | 'ratio';
export type CertStatus = 'certified' | 'non_certified';
export type SaleStatPeriod = 'this_week' | 'previous_week' | 'this_season' | 'previous_season';
export type SaleAnalysisDimension = 'length' | 'micron' | 'class';
export type LengthCategory = 'Long' | 'Medium' | 'Short' | 'Mixed';
export type StyleCategory = 'Style 4 & Better' | 'Style 5' | 'Style 6' | 'Style 7 & Poorer';
export type StyleCode = 'MF4' | 'MF5' | 'MF6';
export type CertShareScope = 'total_all_wool' | 'merino_wool';

// Core Sales table
export interface Sale {
  id: string;
  season: string; // e.g. '2025/26'
  catalogue_no: number; // e.g. 03
  sale_date: string; // e.g. '2025-08-27'
  location?: string; // Port Elizabeth
  
  total_bales_offered?: number; // e.g. 6,577
  total_bales_sold?: number; // e.g. 6,252
  clearance_pct?: number; // e.g. 95.06
  
  highest_price_c_per_kg_clean?: number; // e.g. 246.36
  highest_price_micron?: number; // e.g. 16.4
  
  next_sale_date?: string; // e.g. '2025-09-10'
  next_sale_bales?: number; // e.g. 5,165
  
  is_draft?: boolean; // Whether this is a draft or final report
  
  created_at: string;
}

// Report ingest audit
export interface ReportIngestAudit {
  id: string;
  sale_id: string;
  source_pdf?: string;
  parsed_json?: any;
  created_at: string;
}

// Indicators & FX
export interface Indicator {
  id: string;
  sale_id: string;
  indicator: IndicatorType;
  unit: ValueUnit;
  value_this_sale?: number;
  value_prior_sale?: number;
  pct_change?: number;
}

export interface ExchangeRate {
  id: string;
  sale_id: string;
  pair: string; // e.g. 'ZAR/USD', 'ZAR/Euro', 'USD/AUD'
  value_this_sale?: number;
  value_prior_sale?: number;
  pct_change?: number;
  note?: string; // "average of rate points during sale"
}

// Certified vs Non-Certified by micron
export interface CertifiedVsNonCert {
  id: string;
  sale_id: string;
  micron: number; // 17.0 .. 22.0
  non_cert_price_r?: number; // R/clean
  cert_price_r?: number; // R/clean
  pct_difference?: number; // weighted % diff
}

// Certified Sustainable Wool share
export interface CertifiedShare {
  id: string;
  sale_id: string;
  scope: CertShareScope; // total_all_wool / merino_wool
  offered_bales?: number;
  offered_pct?: number;
  sold_bales?: number;
  sold_pct?: number;
}

// Sale statistics (greasy)
export interface SaleStatistics {
  id: string;
  sale_id: string;
  period: SaleStatPeriod; // this_week / previous_week / this_season / previous_season
  turnover_r?: number;
  bales?: number;
  mass_kg?: number;
}

// Wool receivals (declared, greasy)
export interface Receivals {
  id: string;
  sale_id: string;
  current_season: string; // e.g. '2025/26'
  current_mass_kg: number; // e.g. 4,444,631 kg
  previous_season: string; // e.g. '2024/25'
  previous_mass_kg: number; // e.g. 5,792,102 kg
  pct_change_yoy?: number; // e.g. -23.3%
}

// Offering analysis by broker
export interface OfferingAnalysis {
  id: string;
  sale_id: string;
  broker: string; // e.g. BKB, CMW, JLW, MAS, QWB
  catalogue_offering?: number;
  withdrawn_before?: number;
  wool_offered?: number;
  withdrawn_during?: number;
  passed?: number;
  not_sold?: number;
  sold?: number;
  pct_sold?: number;
}

// Buyer purchases
export interface BuyerPurchase {
  id: string;
  sale_id: string;
  company: string; // e.g. BKB Pinnacle Fibres, G Modiano SA, etc.
  bales_this_sale?: number;
  pct_share?: number;
  bales_ytd?: number;
}

// Sale analysis totals (Length / Micron / Class)
export interface SaleAnalysisTotals {
  id: string;
  sale_id: string;
  dimension: SaleAnalysisDimension; // 'length' | 'micron' | 'class'
  sub_category: string; // e.g. Long / Fine Wool / Fleeces
  offered?: number;
  sold?: number;
  pct_sold?: number;
}

// Bales sold breakdowns (by Length & by Style)
export interface BalesSoldByLength {
  id: string;
  sale_id: string;
  micron: number; // columns like <=18.0, 18.5 ... ≥22.5 are captured as values
  length: LengthCategory; // Long / Medium / Short / Mixed
  bales: number;
}

export interface BalesSoldByStyle {
  id: string;
  sale_id: string;
  micron: number;
  style: StyleCategory; // Style 4 & Better / Style 5 / Style 6 / Style 7 & Poorer
  bales: number;
}

// Average clean price by micron, style code (MF4/5/6), length (mm), and cert status
export interface AveragePricesClean {
  id: string;
  sale_id: string;
  micron: number; // 17.0 .. 22.0
  style_code: StyleCode; // MF4 / MF5 / MF6
  length_mm: number; // 40, 50, 60, 70, 80
  cert: CertStatus; // certified / non_certified
  avg_price_r_ckg?: number; // R per kg (clean)
}

// Complete auction data structure
export interface CompleteAuctionData {
  sale: Sale;
  indicators: Indicator[];
  exchange_rates: ExchangeRate[];
  certified_vs_noncert: CertifiedVsNonCert[];
  certified_share: CertifiedShare[];
  sale_statistics: SaleStatistics[];
  receivals: Receivals[];
  offering_analysis: OfferingAnalysis[];
  buyer_purchases: BuyerPurchase[];
  sale_analysis_totals: SaleAnalysisTotals[];
  bales_sold_by_length: BalesSoldByLength[];
  bales_sold_by_style: BalesSoldByStyle[];
  average_prices_clean: AveragePricesClean[];
  report_ingest_audit?: ReportIngestAudit[];
}

// Database storage structure
export interface DatabaseStorage {
  sales: Sale[];
  indicators: Indicator[];
  exchange_rates: ExchangeRate[];
  certified_vs_noncert: CertifiedVsNonCert[];
  certified_share: CertifiedShare[];
  sale_statistics: SaleStatistics[];
  receivals: Receivals[];
  offering_analysis: OfferingAnalysis[];
  buyer_purchases: BuyerPurchase[];
  sale_analysis_totals: SaleAnalysisTotals[];
  bales_sold_by_length: BalesSoldByLength[];
  bales_sold_by_style: BalesSoldByStyle[];
  average_prices_clean: AveragePricesClean[];
  report_ingest_audit: ReportIngestAudit[];
}

// Utility types for form data mapping
export interface FormToDatabaseMapping {
  // Maps from our form structure to database structure
  auction: Sale;
  indicators: Indicator[];
  benchmarks: Indicator[]; // These map to indicators table
  micron_prices: AveragePricesClean[];
  buyers: BuyerPurchase[];
  brokers: OfferingAnalysis[];
  currencies: ExchangeRate[];
  insights: string; // This will be stored in a separate table or as metadata
  trends: any; // This will be calculated from historical data
  yearly_average_prices: Indicator[]; // These map to indicators table
  provincial_producers: any; // This will be stored in a separate table
  province_avg_prices: any; // This will be calculated from provincial data
}
