// Cape Wools specific interfaces
export interface SaleInfo {
  sale_number: string;
  sale_date: string;
  season: string;
  auction_center: string;
  report_pdf_filename: string;
}

export interface MarketIndices {
  // SA Merino Indicator (cents clean)
  merino_indicator_sa_cents_clean: number;
  // US Merino Indicator (cents clean)
  merino_indicator_us_cents_clean: number;
  // Euro Merino Indicator (cents clean)
  merino_indicator_euro_cents_clean: number;
  
  // SA Certified Indicator (cents clean)
  certified_indicator_sa_cents_clean: number;
  // US Certified Indicator (cents clean)
  certified_indicator_us_cents_clean: number;
  // Euro Certified Indicator (cents clean)
  certified_indicator_euro_cents_clean: number;
  
  // AWEX EMI (cents clean)
  awex_emi_sa_cents_clean: number;
}

export interface CurrencyFX {
  ZAR_USD: number;
  ZAR_EUR: number;
  ZAR_JPY: number;
  ZAR_GBP: number;
  USD_AUD: number;
}

export interface SupplyStats {
  offered_bales: number;
  sold_bales: number;
  clearance_rate_pct: number;
}

export interface HighestPrice {
  price_cents_clean: number;
  micron: number;
  bales: number;
}

export interface CapeWoolsBuyer {
  buyer: string;
  bales: number;
  share_pct: number;
}

export interface CertifiedShare {
  // Bales data
  offered_bales: number;
  sold_bales: number;
  
  // Percentage shares for All Wool
  all_wool_pct_offered: number;
  all_wool_pct_sold: number;
  
  // Percentage shares for Merino Wool
  merino_pct_offered: number;
  merino_pct_sold: number;
}

export interface GreasyStats {
  turnover_rand: number;
  bales: number;
  mass_kg: number;
}

export interface MicronPriceComparison {
  micron: number;
  non_cert_clean_zar_per_kg: number | null;
  cert_clean_zar_per_kg: number | null;
  pct_difference: number | null;
}

export interface MicronPriceComparisonData {
  rows: MicronPriceComparison[];
  notes: string;
}

// Company-specific data interfaces
export interface TopClientPrice {
  price_per_kg: number;
  clean_price: number;
  lot_size: number;
  lot_type: string;
  micron: number;
  producer: string;
  buyer: string;
}

export interface ClientPerformance {
  producer_name: string;
  farm_name: string;
  region: string;
  total_bales: number;
  average_price: number;
  highest_price: number;
  micron_range: string;
  certified_percentage: number;
  lot_types: string;
  top_lot_details: string;
}

export interface AgencyMetrics {
  total_clients_served: number;
  total_volume_handled: number;
  average_client_price: number;
  premium_achieved: number;
}

export interface CompanyData {
  top_client_price: TopClientPrice;
  client_performance: ClientPerformance[];
  agency_metrics: AgencyMetrics;
  notes: string;
}

// Enhanced Auction interface to include Cape Wools fields
// Updated to make week_id optional
export interface Auction {
  id?: string; // UUID for existing auctions (used in edit mode)
  commodity: 'wool' | 'mohair';
  season_label: string;
  season_id?: string; // UUID reference to seasons table
  commodity_type_id?: string; // UUID reference to commodity_types table
  week_id?: string;
  week_start: string;
  week_end: string;
  auction_date: string;
  catalogue_name: string;
  catalogue_prefix?: string;
  catalogue_number?: string;
  // Cape Wools fields
  sale_number?: string;
  auction_center?: string;
  report_pdf_filename?: string;
}

export interface Indicator {
  type: 'total_lots' | 'total_volume' | 'avg_price' | 'total_value';
  unit: string;
  value: number;
  value_ytd?: number;
  pct_change: number;
}

export interface Benchmark {
  label: 'Certified' | 'All-Merino' | 'AWEX';
  price: number;
  currency: string;
  day_change_pct: number;
}

export interface MicronPrice {
  bucket_micron: string;
  category: 'Fine' | 'Medium' | 'Strong';
  price_clean_zar_per_kg: number;
  certified_price_clean_zar_per_kg?: number;
  all_merino_price_clean_zar_per_kg?: number;
}

export interface Buyer {
  buyer: string;
  share_pct: number;
  cat: number; // Represents Qty Bales for the week
  bales_ytd: number;
}

export interface TopSale {
  farm: string;
  region: string;
  lots_count: number;
  type_code: string;
  micron_um: number;
  price_zar_per_kg_greasy: number;
  certified: boolean;
  buyer_name: string;
  position?: number;
}

export interface BrokerData {
  name: string;
  catalogue_offering: number;
  withdrawn_before_sale: number;
  wool_offered: number;
  withdrawn_during_sale: number;
  passed: number;
  not_sold: number;
  sold: number;
  sold_pct: number;
  sold_ytd: number;
  // Previous week data for comparison
  previous_week?: {
    catalogue_offering: number;
    withdrawn_before_sale: number;
    wool_offered: number;
    withdrawn_during_sale: number;
    passed: number;
    not_sold: number;
    sold: number;
    sold_pct: number;
    sold_ytd: number;
  };
}

export interface Currency {
  code: 'USD' | 'AUD' | 'EUR';
  value: number;
  change: number;
}

export interface TrendPoint {
  period: string;
  auction_catalogue?: string; // Auction catalogue name (e.g., "CG01")
  '2025_zar'?: number;
  '2024_zar'?: number;
  '2025_usd'?: number;
  '2024_usd'?: number;
}

export interface TrendData {
  rws: TrendPoint[];
  non_rws: TrendPoint[];
  awex: TrendPoint[];
}

export interface YearlyAveragePrice {
    label: string;
    value: number;
    unit: string;
}

export interface ProvincialProducer {
  position: number;
  name: string;
  district: string;
  producer_number?: string;
  no_bales?: number;
  price: number;
  description?: string;
  micron?: number;
  certified: 'RWS' | '';
  buyer_name: string;
}

export interface ProvincialProducerData {
  province: string;
  producers: ProvincialProducer[];
}

export interface ProvinceAveragePrice {
  id: string; // e.g., 'ZA-EC'
  name: string;
  avg_price: number;
}

// Season management interfaces
export interface Season {
  id: string;
  season_year: string; // e.g., '2025/2026'
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'completed';
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CreateSeasonData {
  season_year: string;
  start_date: string;
  end_date: string;
  status?: 'draft' | 'active' | 'completed';
  created_by: string;
}

export interface AuctionReport {
  id?: string; // Unique identifier for the report
  auction: Auction;
  indicators: Indicator[];
  benchmarks: Benchmark[];
  micron_prices: MicronPrice[];
  buyers: Buyer[];
  top_sales: TopSale[];
  brokers: BrokerData[];
  currencies: Currency[];
  insights: string;
  trends: TrendData;
  yearly_average_prices?: YearlyAveragePrice[];
  provincial_producers: ProvincialProducerData[];
  province_avg_prices: ProvinceAveragePrice[];
  
  // Cape Wools specific fields
  market_indices?: MarketIndices;
  currency_fx?: CurrencyFX;
  supply_stats?: SupplyStats;
  highest_price?: HighestPrice;
  certified_share?: CertifiedShare;
  greasy_stats?: GreasyStats;
  micron_price_comparison?: MicronPriceComparisonData;
  cape_wools_commentary?: string;
  
  // Company-specific data
  company_data?: CompanyData;
  
  // Report status and metadata
  status?: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  created_by?: string;
  approved_by?: string;
  version?: number;
}

// User management interfaces
export interface UserType {
  id: string;
  name: string;
  description: string | null;
  permissions: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  mobile_number: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  user_type_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  // Extended properties for UI
  is_empty?: boolean;
  user_types?: UserType;
}
