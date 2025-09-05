// Cape Wools specific interfaces
export interface SaleInfo {
  sale_number: string;
  sale_date: string;
  season: string;
  auction_center: string;
  report_pdf_filename: string;
}

export interface MarketIndices {
  merino_indicator_cents_clean: number;
  certified_indicator_cents_clean: number;
  change_merino_pct: number;
  change_certified_pct: number;
  awex_emi_cents_clean: number;
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
  non_cert_clean_zar_per_kg: number;
  cert_clean_zar_per_kg: number;
  pct_difference: number;
}

export interface MicronPriceComparisonData {
  rows: MicronPriceComparison[];
  notes: string;
}

// Enhanced Auction interface to include Cape Wools fields
export interface Auction {
  commodity: 'wool' | 'mohair';
  season_label: string;
  week_id: string;
  week_start: string;
  week_end: string;
  auction_date: string;
  catalogue_name: string;
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
  sold_ytd: number;
}

export interface Currency {
  code: 'USD' | 'AUD' | 'EUR';
  value: number;
  change: number;
}

export interface TrendPoint {
  period: string;
  '2025_zar'?: number;
  '2024_zar'?: number;
  '2025_usd'?: number;
  '2024_usd'?: number;
}

export interface TrendData {
  rws: TrendPoint[];
  non_rws: TrendPoint[];
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

export interface AuctionReport {
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
}
