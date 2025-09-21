import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gymdertakhxjmfrmcqgp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bWRlcnRha2h4am1mcm1jcWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NjY0MTgsImV4cCI6MjA3NDA0MjQxOH0.C-IFVMekGQCuvbgU6vIvCqy1Se9UR_UyOfRm6A4uN2A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          surname: string
          email: string
          mobile_number: string
          status: 'super_admin' | 'admin' | 'editor' | 'viewer'
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          surname: string
          email: string
          mobile_number: string
          status: 'super_admin' | 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          surname?: string
          email?: string
          mobile_number?: string
          status?: 'super_admin' | 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      seasons: {
        Row: {
          id: string
          season_year: string
          start_date: string
          end_date: string
          status: 'active' | 'completed' | 'draft'
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          season_year: string
          start_date: string
          end_date: string
          status?: 'active' | 'completed' | 'draft'
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          season_year?: string
          start_date?: string
          end_date?: string
          status?: 'active' | 'completed' | 'draft'
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      auctions: {
        Row: {
          id: string
          season_id: string
          auction_date: string
          catalogue_prefix: string
          catalogue_number: string
          commodity_type_id: string
          week_start: string
          week_end: string
          status: 'draft' | 'published' | 'archived'
          supply_statistics_bales_offered?: number
          supply_statistics_sold_bales?: number
          supply_statistics_clearance_rate?: number
          highest_price_price_cents_clean?: number
          highest_price_micron?: number
          highest_price_bales?: number
          certified_offered_bales?: number
          certified_sold_bales?: number
          certified_all_wool_pct_offered?: number
          certified_all_wool_pct_sold?: number
          certified_merino_pct_offered?: number
          certified_merino_pct_sold?: number
          greasy_statistics_turnover?: number
          greasy_statistics_bales?: number
          greasy_statistics_mass?: number
          all_merino_sa_c_kg_clean?: number
          all_merino_euro_c_kg_clean?: number
          all_merino_us_c_kg_clean?: number
          certified_sa_c_kg_clean?: number
          certified_us_c_kg_clean?: number
          certified_euro_c_kg_clean?: number
          exchange_rates_zar_usd?: number
          exchange_rates_zar_eur?: number
          exchange_rates_zar_jpy?: number
          exchange_rates_zar_gbp?: number
          exchange_rates_usd_aud?: number
          exchange_rates_sa_c_kg_clean_awex_emi?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          season_id: string
          auction_date: string
          catalogue_prefix: string
          catalogue_number: string
          commodity_type_id: string
          week_start: string
          week_end: string
          status?: 'draft' | 'published' | 'archived'
          supply_statistics_bales_offered?: number
          supply_statistics_sold_bales?: number
          supply_statistics_clearance_rate?: number
          highest_price_price_cents_clean?: number
          highest_price_micron?: number
          highest_price_bales?: number
          certified_offered_bales?: number
          certified_sold_bales?: number
          certified_all_wool_pct_offered?: number
          certified_all_wool_pct_sold?: number
          certified_merino_pct_offered?: number
          certified_merino_pct_sold?: number
          greasy_statistics_turnover?: number
          greasy_statistics_bales?: number
          greasy_statistics_mass?: number
          all_merino_sa_c_kg_clean?: number
          all_merino_euro_c_kg_clean?: number
          all_merino_us_c_kg_clean?: number
          certified_sa_c_kg_clean?: number
          certified_us_c_kg_clean?: number
          certified_euro_c_kg_clean?: number
          exchange_rates_zar_usd?: number
          exchange_rates_zar_eur?: number
          exchange_rates_zar_jpy?: number
          exchange_rates_zar_gbp?: number
          exchange_rates_usd_aud?: number
          exchange_rates_sa_c_kg_clean_awex_emi?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          season_id?: string
          auction_date?: string
          catalogue_prefix?: string
          catalogue_number?: string
          commodity_type_id?: string
          week_start?: string
          week_end?: string
          status?: 'draft' | 'published' | 'archived'
          supply_statistics_bales_offered?: number
          supply_statistics_sold_bales?: number
          supply_statistics_clearance_rate?: number
          highest_price_price_cents_clean?: number
          highest_price_micron?: number
          highest_price_bales?: number
          certified_offered_bales?: number
          certified_sold_bales?: number
          certified_all_wool_pct_offered?: number
          certified_all_wool_pct_sold?: number
          certified_merino_pct_offered?: number
          certified_merino_pct_sold?: number
          greasy_statistics_turnover?: number
          greasy_statistics_bales?: number
          greasy_statistics_mass?: number
          all_merino_sa_c_kg_clean?: number
          all_merino_euro_c_kg_clean?: number
          all_merino_us_c_kg_clean?: number
          certified_sa_c_kg_clean?: number
          certified_us_c_kg_clean?: number
          certified_euro_c_kg_clean?: number
          exchange_rates_zar_usd?: number
          exchange_rates_zar_eur?: number
          exchange_rates_zar_jpy?: number
          exchange_rates_zar_gbp?: number
          exchange_rates_usd_aud?: number
          exchange_rates_sa_c_kg_clean_awex_emi?: number
          created_at?: string
          updated_at?: string
        }
      }
      micron_prices: {
        Row: {
          id: string
          auction_id: string
          bucket_micron: string
          category: 'Fine' | 'Medium' | 'Strong'
          price_clean_zar_per_kg: number
          certified_price_clean_zar_per_kg?: number
          all_merino_price_clean_zar_per_kg?: number
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          auction_id: string
          bucket_micron: string
          category: 'Fine' | 'Medium' | 'Strong'
          price_clean_zar_per_kg: number
          certified_price_clean_zar_per_kg?: number
          all_merino_price_clean_zar_per_kg?: number
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          auction_id?: string
          bucket_micron?: string
          category?: 'Fine' | 'Medium' | 'Strong'
          price_clean_zar_per_kg?: number
          certified_price_clean_zar_per_kg?: number
          all_merino_price_clean_zar_per_kg?: number
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      market_insights: {
        Row: {
          id: string
          auction_id: string
          market_insights_text: string
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          auction_id: string
          market_insights_text: string
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          auction_id?: string
          market_insights_text?: string
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      top_performers: {
        Row: {
          id: string
          auction_id: string
          province_id: string
          rank: number
          producer_name: string
          district: string
          producer_number: string
          no_bales: number
          description: string
          micron: number
          price: number
          certification_id: string
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          auction_id: string
          province_id: string
          rank: number
          producer_name: string
          district: string
          producer_number: string
          no_bales: number
          description: string
          micron: number
          price: number
          certification_id: string
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          auction_id?: string
          province_id?: string
          rank?: number
          producer_name?: string
          district?: string
          producer_number?: string
          no_bales?: number
          description?: string
          micron?: number
          price?: number
          certification_id?: string
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      broker_performance: {
        Row: {
          id: string
          auction_id: string
          broker_name: string
          catalogue_offering: number
          withdrawn_before_sale: number
          wool_offered: number
          withdrawn_during_sale: number
          passed: number
          not_sold: number
          sold: number
          sold_pct: number
          sold_ytd: number
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          auction_id: string
          broker_name: string
          catalogue_offering: number
          withdrawn_before_sale: number
          wool_offered: number
          withdrawn_during_sale: number
          passed: number
          not_sold: number
          sold: number
          sold_pct: number
          sold_ytd: number
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          auction_id?: string
          broker_name?: string
          catalogue_offering?: number
          withdrawn_before_sale?: number
          wool_offered?: number
          withdrawn_during_sale?: number
          passed?: number
          not_sold?: number
          sold?: number
          sold_pct?: number
          sold_ytd?: number
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      buyer_performance: {
        Row: {
          id: string
          auction_id: string
          buyer_name: string
          share_pct: number
          bales_this_sale: number
          bales_ytd: number
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          auction_id: string
          buyer_name: string
          share_pct: number
          bales_this_sale: number
          bales_ytd: number
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          auction_id?: string
          buyer_name?: string
          share_pct?: number
          bales_this_sale?: number
          bales_ytd?: number
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      provinces: {
        Row: {
          id: string
          name: string
          abbreviation: string
          country: string
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          abbreviation: string
          country: string
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          abbreviation?: string
          country?: string
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      certifications: {
        Row: {
          id: string
          name: string
          code: string
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      commodity_types: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type-safe Supabase client
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
