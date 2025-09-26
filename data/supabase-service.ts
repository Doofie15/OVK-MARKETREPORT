// Supabase-based data service for Wool Market Report System
import { supabaseClient } from '../lib/supabase'
import type { Database } from '../lib/supabase'
import type { AuctionReport, Season, CreateSeasonData } from '../types'

type Tables = Database['public']['Tables']

// Type aliases for easier use
type User = Tables['users']['Row']
type SeasonRow = Tables['seasons']['Row']
type SeasonInsert = Tables['seasons']['Insert']
type SeasonUpdate = Tables['seasons']['Update']
type AuctionRow = Tables['auctions']['Row']
type AuctionInsert = Tables['auctions']['Insert']
type AuctionUpdate = Tables['auctions']['Update']
type MicronPriceRow = Tables['micron_prices']['Row']
type MicronPriceInsert = Tables['micron_prices']['Insert']
type MarketInsightRow = Tables['market_insights']['Row']
type MarketInsightInsert = Tables['market_insights']['Insert']
type TopPerformerRow = Tables['top_performers']['Row']
type TopPerformerInsert = Tables['top_performers']['Insert']
type BrokerPerformanceRow = Tables['broker_performance']['Row']
type BrokerPerformanceInsert = Tables['broker_performance']['Insert']
type BuyerPerformanceRow = Tables['buyer_performance']['Row']
type BuyerPerformanceInsert = Tables['buyer_performance']['Insert']
type BuyerRow = Tables['buyers']['Row']
type BuyerInsert = Tables['buyers']['Insert']
type BrokerRow = Tables['brokers']['Row']
type BrokerInsert = Tables['brokers']['Insert']
type ProvinceRow = Tables['provinces']['Row']
type CertificationRow = Tables['certifications']['Row']
type CommodityTypeRow = Tables['commodity_types']['Row']

export class SupabaseAuctionDataService {
  
  // Helper function to log activities
  static async logActivity(action: string, userId?: string, details: any = {}) {
    try {
      const { error } = await supabaseClient
        .from('activity_log')
        .insert({
          action,
          user_name: userId ? 'Admin User' : 'System',
          user_id: userId || null,
          activity_type: 'info',
          details
        });
      
      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }
  // Authentication methods
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser()
      if (error) throw error
      return { success: true, data: user }
    } catch (error) {
      console.error('Get current user error:', error)
      return { success: false, error: error.message }
    }
  }

  static async signUp(email: string, password: string, userData: { name: string; surname: string; mobile_number?: string }) {
    try {
      console.log('🔐 Starting signup process for:', email)
      
      // Sign up the user with Supabase Auth
      // The database trigger will automatically create the user profile
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (authError) {
        console.error('❌ Auth signup error:', authError)
        throw authError
      }
      
      console.log('✅ Auth signup successful, user ID:', authData.user?.id)
      console.log('📝 User profile will be created automatically by database trigger')
      
      return { success: true, data: authData }
    } catch (error) {
      console.error('❌ Sign up error:', error)
      return { success: false, error: error.message }
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  static async signOut() {
    try {
      const { error } = await supabaseClient.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  }

  // User management
  static async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .insert(userData)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create user error:', error)
      return { success: false, error: error.message }
    }
  }


  static async getUsers() {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select(`
          *,
          user_types!user_type_id(*)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get users error:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateUser(id: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Update user error:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteUser(id: string) {
    try {
      const { error } = await supabaseClient
        .from('users')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Delete user error:', error)
      return { success: false, error: error.message }
    }
  }

  // User approval methods
  static async approveUser(userId: string, approvedBy: string) {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .update({
          approval_status: 'approved',
          approved_by: approvedBy,
          approved_at: new Date().toISOString(),
          rejection_reason: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Approve user error:', error)
      return { success: false, error: error.message }
    }
  }

  // User Types methods
  static async getUserTypes() {
    try {
      const { data, error } = await supabaseClient
        .from('user_types')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get user types error:', error)
      return { success: false, error: error.message }
    }
  }

  static async createUserType(userTypeData: any) {
    try {
      const { data, error } = await supabaseClient
        .from('user_types')
        .insert(userTypeData)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create user type error:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateUserType(id: string, userTypeData: any) {
    try {
      const { data, error } = await supabaseClient
        .from('user_types')
        .update({
          ...userTypeData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Update user type error:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteUserType(id: string) {
    try {
      const { data, error } = await supabaseClient
        .from('user_types')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Delete user type error:', error)
      return { success: false, error: error.message }
    }
  }

  static async rejectUser(userId: string, approvedBy: string, rejectionReason?: string) {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .update({
          approval_status: 'rejected',
          approved_by: approvedBy,
          approved_at: new Date().toISOString(),
          rejection_reason: rejectionReason || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Reject user error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getPendingUsers() {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get pending users error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getApprovedUsers() {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get approved users error:', error)
      return { success: false, error: error.message }
    }
  }

  // Season management
  static async createSeason(seasonData: SeasonInsert) {
    try {
      const { data, error } = await supabaseClient
        .from('seasons')
        .insert(seasonData)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create season error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getSeasons() {
    try {
      const { data, error } = await supabaseClient
        .from('seasons')
        .select('*')
        .order('season_year', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get seasons error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getSeasonById(id: string) {
    try {
      const { data, error } = await supabaseClient
        .from('seasons')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get season by ID error:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateSeason(id: string, updates: SeasonUpdate) {
    try {
      const { data, error } = await supabaseClient
        .from('seasons')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Update season error:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteSeason(id: string) {
    try {
      const { error } = await supabaseClient
        .from('seasons')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Delete season error:', error)
      return { success: false, error: error.message }
    }
  }

  // Auction management
  static async createAuction(auctionData: AuctionInsert) {
    try {
      const { data, error } = await supabaseClient
        .from('auctions')
        .insert(auctionData)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create auction error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getAuctions() {
    try {
      const { data, error } = await supabaseClient
        .from('auctions')
        .select(`
          *,
          seasons(season_year, start_date, end_date),
          commodity_types(name)
        `)
        .order('auction_date', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get auctions error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getAuctionById(id: string) {
    try {
      const { data, error } = await supabaseClient
        .from('auctions')
        .select(`
          *,
          seasons(season_year, start_date, end_date),
          commodity_types(name)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get auction by ID error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getAuctionsBySeason(seasonId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('auctions')
        .select(`
          *,
          seasons(season_year, start_date, end_date),
          commodity_types(name)
        `)
        .eq('season_id', seasonId)
        .order('auction_date', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get auctions by season error:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateAuction(id: string, updates: AuctionUpdate) {
    try {
      const { data, error } = await supabaseClient
        .from('auctions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Update auction error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getAuctionDeletionStats(auctionId: string) {
    try {
      const stats = {
        auction: null as any,
        micron_prices_count: 0,
        buyer_performance_count: 0,
        broker_performance_count: 0,
        top_performers_count: 0,
        market_insights_count: 0,
        total_related_records: 0
      };

      // Get auction details
      const auctionResult = await this.getAuctionById(auctionId);
      if (auctionResult.success) {
        stats.auction = auctionResult.data;
      }

      // Count related records
      const [micronResult, buyerResult, brokerResult, topResult, insightsResult] = await Promise.all([
        supabaseClient.from('micron_prices').select('id', { count: 'exact' }).eq('auction_id', auctionId),
        supabaseClient.from('buyer_performance').select('id', { count: 'exact' }).eq('auction_id', auctionId),
        supabaseClient.from('broker_performance').select('id', { count: 'exact' }).eq('auction_id', auctionId),
        supabaseClient.from('top_performers').select('id', { count: 'exact' }).eq('auction_id', auctionId),
        supabaseClient.from('market_insights').select('id', { count: 'exact' }).eq('auction_id', auctionId)
      ]);

      stats.micron_prices_count = micronResult.count || 0;
      stats.buyer_performance_count = buyerResult.count || 0;
      stats.broker_performance_count = brokerResult.count || 0;
      stats.top_performers_count = topResult.count || 0;
      stats.market_insights_count = insightsResult.count || 0;
      stats.total_related_records = stats.micron_prices_count + stats.buyer_performance_count + 
                                   stats.broker_performance_count + stats.top_performers_count + 
                                   stats.market_insights_count;

      return { success: true, data: stats };
    } catch (error) {
      console.error('Get auction deletion stats error:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteAuction(id: string) {
    try {
      console.log('🗑️ Starting CASCADE deletion for auction:', id);
      
      // Get deletion statistics first
      const statsResult = await this.getAuctionDeletionStats(id);
      if (statsResult.success) {
        const stats = statsResult.data;
        console.log('📊 Deletion statistics:', {
          auction: `${stats.auction?.catalogue_prefix}${stats.auction?.catalogue_number}`,
          micron_prices: stats.micron_prices_count,
          buyer_performance: stats.buyer_performance_count,
          broker_performance: stats.broker_performance_count,
          top_performers: stats.top_performers_count,
          market_insights: stats.market_insights_count,
          total_related: stats.total_related_records
        });
      }
      
      // First, clear the market_insights_id reference in the auction table
      // This is necessary because auctions table has a foreign key to market_insights
      console.log('🔓 Clearing market insights reference in auction record...');
      const { error: clearRefError } = await supabaseClient
        .from('auctions')
        .update({ 
          market_insights_id: null,
          has_market_insights: false 
        })
        .eq('id', id);
      
      if (clearRefError) {
        console.error('Error clearing market insights reference:', clearRefError);
        throw new Error(`Failed to clear market insights reference: ${clearRefError.message}`);
      }

      // Delete all related data (CASCADE deletion)
      const deletionSteps = [
        { table: 'market_insights', description: 'Market insights' },
        { table: 'top_performers', description: 'Top performers' },
        { table: 'broker_performance', description: 'Broker performance' },
        { table: 'buyer_performance', description: 'Buyer performance' },
        { table: 'micron_prices', description: 'Micron prices' }
      ];

      // Delete related data from all tables
      for (const step of deletionSteps) {
        console.log(`🗑️ Deleting ${step.description}...`);
        const { error } = await supabaseClient
          .from(step.table)
          .delete()
          .eq('auction_id', id);
        
        if (error) {
          console.error(`Error deleting ${step.description}:`, error);
          throw new Error(`Failed to delete ${step.description}: ${error.message}`);
        }
      }

      // Finally, delete the auction itself
      console.log('🗑️ Deleting auction record...');
      const { error } = await supabaseClient
        .from('auctions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      console.log('✅ CASCADE deletion completed successfully');
      return { success: true };
    } catch (error) {
      console.error('Delete auction error:', error);
      return { success: false, error: error.message };
    }
  }

  // Micron prices
  static async createMicronPrices(micronPrices: MicronPriceInsert[]) {
    try {
      const { data, error } = await supabaseClient
        .from('micron_prices')
        .insert(micronPrices)
        .select()
      
      if (error) throw error
      
      // Update auction record to set has_micron_prices flag
      if (data && data.length > 0) {
        await supabaseClient
          .from('auctions')
          .update({ has_micron_prices: true })
          .eq('id', data[0].auction_id)
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('Create micron prices error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getMicronPricesByAuction(auctionId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('micron_prices')
        .select('*')
        .eq('auction_id', auctionId)
        .order('micron')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get micron prices error:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateMicronPrices(auctionId: string, micronPrices: MicronPriceInsert[]) {
    try {
      // First, delete existing micron prices for this auction
      const { error: deleteError } = await supabaseClient
        .from('micron_prices')
        .delete()
        .eq('auction_id', auctionId)
      
      if (deleteError) throw deleteError

      // Then insert the new micron prices
      if (micronPrices.length > 0) {
        const { data, error } = await supabaseClient
          .from('micron_prices')
          .insert(micronPrices)
          .select()
        
        if (error) throw error
        return { success: true, data }
      }
      
      return { success: true, data: [] }
    } catch (error) {
      console.error('Update micron prices error:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteMicronPricesByAuction(auctionId: string) {
    try {
      const { error } = await supabaseClient
        .from('micron_prices')
        .delete()
        .eq('auction_id', auctionId)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Delete micron prices error:', error)
      return { success: false, error: error.message }
    }
  }

  // Market insights
  static async createMarketInsight(insight: MarketInsightInsert) {
    try {
      const { data, error } = await supabaseClient
        .from('market_insights')
        .insert(insight)
        .select()
        .single()
      
      if (error) throw error
      
      // Update auction record to set has_market_insights flag and market_insights_id
      await supabaseClient
        .from('auctions')
        .update({
          has_market_insights: true,
          market_insights_id: data.id
        })
        .eq('id', insight.auction_id)
      
      return { success: true, data }
    } catch (error) {
      console.error('Create market insight error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getMarketInsightByAuction(auctionId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('market_insights')
        .select('*')
        .eq('auction_id', auctionId)
      
      if (error) throw error
      
      // Return the first result if any, or null if none
      return { success: true, data: data && data.length > 0 ? data[0] : null }
    } catch (error) {
      console.error('Get market insight error:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateMarketInsight(auctionId: string, insight: MarketInsightInsert) {
    try {
      const { data, error } = await supabaseClient
        .from('market_insights')
        .update({
          market_insights_text: insight.market_insights_text,
          updated_at: new Date().toISOString()
        })
        .eq('auction_id', auctionId)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Update market insight error:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteMarketInsightByAuction(auctionId: string) {
    try {
      const { error } = await supabaseClient
        .from('market_insights')
        .delete()
        .eq('auction_id', auctionId)

      if (error) throw error
      
      // Update auction record to clear has_market_insights flag and market_insights_id
      await supabaseClient
        .from('auctions')
        .update({
          has_market_insights: false,
          market_insights_id: null
        })
        .eq('id', auctionId)
      
      return { success: true }
    } catch (error) {
      console.error('Delete market insight error:', error)
      return { success: false, error: error.message }
    }
  }

  // Top performers
  static async createTopPerformers(performers: TopPerformerInsert[]) {
    try {
      const { data, error } = await supabaseClient
        .from('top_performers')
        .insert(performers)
        .select()
      
      if (error) throw error
      
      // Update auction record to set has_provincial_data flag
      if (data && data.length > 0) {
        await supabaseClient
          .from('auctions')
          .update({ has_provincial_data: true })
          .eq('id', data[0].auction_id)
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('Create top performers error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getTopPerformersByAuction(auctionId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('top_performers')
        .select(`
          *,
          provinces(name, abbreviation),
          certifications(name, code)
        `)
        .eq('auction_id', auctionId)
        .order('position')
      
      if (error) throw error
      
      
      return { success: true, data }
    } catch (error) {
      console.error('Get top performers error:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateTopPerformers(auctionId: string, performers: TopPerformerInsert[]) {
    try {
      // First, delete existing top performers for this auction
      const { error: deleteError } = await supabaseClient
        .from('top_performers')
        .delete()
        .eq('auction_id', auctionId)
      
      if (deleteError) throw deleteError

      // Then insert the new top performers
      if (performers.length > 0) {
        const { data, error } = await supabaseClient
          .from('top_performers')
          .insert(performers)
          .select()
        
        if (error) throw error
        return { success: true, data }
      }
      
      return { success: true, data: [] }
    } catch (error) {
      console.error('Update top performers error:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteTopPerformersByAuction(auctionId: string) {
    try {
      const { error } = await supabaseClient
        .from('top_performers')
        .delete()
        .eq('auction_id', auctionId)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Delete top performers error:', error)
      return { success: false, error: error.message }
    }
  }

  // Broker performance
  static async createBrokerPerformance(performance: BrokerPerformanceInsert[]) {
    try {
      console.log('🏢 Creating broker performance with data:', performance);
      
      // First, get all brokers to map names to IDs
      const brokersResult = await this.getBrokers();
      if (!brokersResult.success) throw new Error('Failed to load brokers');
      
      console.log('📋 Available brokers:', brokersResult.data.map(b => b.name));
      
      const brokersMap = new Map(brokersResult.data.map(b => [b.name, b.id]));
      
      // Transform broker performance data to include broker_id
      const performanceWithIds = performance.map(broker => {
        const brokerId = brokersMap.get(broker.name);
        console.log(`🔍 Mapping broker "${broker.name}" to ID:`, brokerId);
        if (!brokerId) {
          console.warn(`❌ Broker "${broker.name}" not found in brokers table`);
        }
        return {
          auction_id: broker.auction_id,
          broker_id: brokerId,
          catalogue_offering: broker.catalogue_offering,
          withdrawn_before_sale: broker.withdrawn_before_sale,
          wool_offered: broker.wool_offered,
          withdrawn_during_sale: broker.withdrawn_during_sale,
          passed: broker.passed,
          not_sold: broker.not_sold,
          sold: broker.sold,
          sold_pct: broker.sold_pct,
          sold_ytd: broker.sold_ytd,
          created_by: broker.created_by
        };
      });
      
      console.log('💾 Final broker performance data to insert:', performanceWithIds);
      
      const { data, error } = await supabaseClient
        .from('broker_performance')
        .insert(performanceWithIds)
        .select()
      
      if (error) throw error
      
      // Update auction record to set has_broker_data flag
      if (data && data.length > 0) {
        await supabaseClient
          .from('auctions')
          .update({ has_broker_data: true })
          .eq('id', data[0].auction_id)
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('Create broker performance error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getBrokerPerformanceByAuction(auctionId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('broker_performance')
        .select(`
          *,
          brokers!broker_id (
            id,
            name
          )
        `)
        .eq('auction_id', auctionId)
        .order('sold_pct', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get broker performance error:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateBrokerPerformance(auctionId: string, brokers: BrokerPerformanceInsert[]) {
    try {
      console.log('🔄 Updating broker performance for auction:', auctionId, 'with data:', brokers);
      
      // First, delete existing broker performance for this auction
      const { error: deleteError } = await supabaseClient
        .from('broker_performance')
        .delete()
        .eq('auction_id', auctionId)
      
      if (deleteError) throw deleteError

      // Then insert the new broker performance using the same mapping logic as createBrokerPerformance
      if (brokers.length > 0) {
        // Use the same logic as createBrokerPerformance to map names to IDs
        const brokersResult = await this.getBrokers();
        if (!brokersResult.success) throw new Error('Failed to load brokers');
        
        console.log('📋 Available brokers for update:', brokersResult.data.map(b => b.name));
        
        const brokersMap = new Map(brokersResult.data.map(b => [b.name, b.id]));
        
        // Transform broker performance data to include broker_id
        const performanceWithIds = brokers.map(broker => {
          const brokerId = brokersMap.get(broker.name);
          console.log(`🔍 Mapping broker "${broker.name}" to ID:`, brokerId);
          if (!brokerId) {
            console.warn(`❌ Broker "${broker.name}" not found in brokers table`);
          }
          return {
            auction_id: broker.auction_id,
            broker_id: brokerId,
            catalogue_offering: broker.catalogue_offering,
            withdrawn_before_sale: broker.withdrawn_before_sale,
            wool_offered: broker.wool_offered,
            withdrawn_during_sale: broker.withdrawn_during_sale,
            passed: broker.passed,
            not_sold: broker.not_sold,
            sold: broker.sold,
            sold_pct: broker.sold_pct,
            sold_ytd: broker.sold_ytd,
            created_by: broker.created_by
          };
        });
        
        console.log('💾 Final broker performance data to insert (update):', performanceWithIds);
        
        const { data, error } = await supabaseClient
          .from('broker_performance')
          .insert(performanceWithIds)
          .select()
        
        if (error) throw error
        return { success: true, data }
      }
      
      return { success: true, data: [] }
    } catch (error) {
      console.error('Update broker performance error:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteBrokerPerformanceByAuction(auctionId: string) {
    try {
      const { error } = await supabaseClient
        .from('broker_performance')
        .delete()
        .eq('auction_id', auctionId)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Delete broker performance error:', error)
      return { success: false, error: error.message }
    }
  }

  // Buyers
  static async getBuyers() {
    try {
      const { data, error } = await supabaseClient
        .from('buyers')
        .select('*')
        .order('buyer_name')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get buyers error:', error)
      return { success: false, error: error.message }
    }
  }

  // Brokers
  static async getBrokers() {
    try {
      const { data, error } = await supabaseClient
        .from('brokers')
        .select('*')
        .order('name')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get brokers error:', error)
      return { success: false, error: error.message }
    }
  }

  // Buyer performance
  static async createBuyerPerformance(performance: BuyerPerformanceInsert[]) {
    try {
      console.log('🛒 Creating buyer performance with data:', performance);
      
      // First, get all buyers to map names to IDs
      const buyersResult = await this.getBuyers();
      if (!buyersResult.success) throw new Error('Failed to load buyers');
      
      console.log('📋 Available buyers:', buyersResult.data.map(b => b.buyer_name));
      
      const buyersMap = new Map(buyersResult.data.map(b => [b.buyer_name, b.id]));
      
      // Transform buyer performance data to include buyer_id
      const performanceWithIds = performance.map(buyer => {
        const buyerId = buyersMap.get(buyer.buyer);
        console.log(`🔍 Mapping buyer "${buyer.buyer}" to ID:`, buyerId);
        if (!buyerId) {
          console.warn(`❌ Buyer "${buyer.buyer}" not found in buyers table`);
        }
        return {
          auction_id: buyer.auction_id,
          buyer_id: buyerId,
          share_pct: buyer.share_pct,
          cat: buyer.cat,
          bales_ytd: buyer.bales_ytd,
          created_by: buyer.created_by
        };
      });
      
      console.log('💾 Final buyer performance data to insert:', performanceWithIds);
      
      const { data, error } = await supabaseClient
        .from('buyer_performance')
        .insert(performanceWithIds)
        .select()
      
      if (error) throw error
      
      // Update auction record to set has_buyer_data flag
      if (data && data.length > 0) {
        await supabaseClient
          .from('auctions')
          .update({ has_buyer_data: true })
          .eq('id', data[0].auction_id)
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('Create buyer performance error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getBuyerPerformanceByAuction(auctionId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('buyer_performance')
        .select(`
          *,
          buyers!buyer_id (
            id,
            buyer_name
          )
        `)
        .eq('auction_id', auctionId)
        .order('share_pct', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get buyer performance error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getBuyerSeasonTotals(seasonId: string) {
    try {
      console.log('🔍 Getting buyer season totals for season:', seasonId);
      
      // Get all published auctions for this season
      const auctionsResult = await supabaseClient
        .from('auctions')
        .select('id')
        .eq('season_id', seasonId)
        .eq('status', 'published');
      
      if (auctionsResult.error) throw auctionsResult.error;
      
      const auctionIds = auctionsResult.data.map(a => a.id);
      console.log('📊 Found published auctions for season:', auctionIds);
      
      if (auctionIds.length === 0) {
        return { success: true, data: [] };
      }
      
      // Get buyer performance for all auctions in this season
      const { data, error } = await supabaseClient
        .from('buyer_performance')
        .select(`
          buyer_id,
          cat,
          buyers!buyer_id (
            id,
            buyer_name
          )
        `)
        .in('auction_id', auctionIds);
      
      if (error) throw error;
      
      // Sum up bales by buyer
      const buyerTotals = new Map();
      
      data.forEach(performance => {
        const buyerName = (performance as any).buyers?.buyer_name;
        const bales = performance.cat || 0;
        
        if (buyerName) {
          if (buyerTotals.has(buyerName)) {
            buyerTotals.set(buyerName, buyerTotals.get(buyerName) + bales);
          } else {
            buyerTotals.set(buyerName, bales);
          }
        }
      });
      
      const seasonTotals = Array.from(buyerTotals.entries()).map(([buyerName, totalBales]) => ({
        buyer: buyerName,
        total_bales_season: totalBales
      }));
      
      console.log('📈 Buyer season totals:', seasonTotals);
      return { success: true, data: seasonTotals };
      
    } catch (error) {
      console.error('Get buyer season totals error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getSeasonIndicatorTotals(seasonId: string) {
    try {
      console.log('🔍 Getting season indicator totals for season:', seasonId);
      
      // Get all published auctions for this season
      const auctionsResult = await supabaseClient
        .from('auctions')
        .select('id, supply_statistics_bales_offered, greasy_statistics_mass, greasy_statistics_turnover')
        .eq('season_id', seasonId)
        .eq('status', 'published')
        .order('auction_date', { ascending: true });
      
      if (auctionsResult.error) throw auctionsResult.error;
      
      console.log('📊 Found', auctionsResult.data.length, 'published auctions for season indicator totals');
      
      // Sum up the totals
      const seasonTotals = auctionsResult.data.reduce((totals, auction) => {
        totals.totalBales += auction.supply_statistics_bales_offered || 0;
        totals.totalVolume += auction.greasy_statistics_mass || 0;
        totals.totalValue += auction.greasy_statistics_turnover || 0;
        return totals;
      }, {
        totalBales: 0,
        totalVolume: 0,
        totalValue: 0
      });
      
      console.log('📈 Season indicator totals calculated:', seasonTotals);
      return { success: true, data: seasonTotals };
      
    } catch (error) {
      console.error('Get season indicator totals error:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateBuyerPerformance(auctionId: string, buyers: BuyerPerformanceInsert[]) {
    try {
      console.log('🔄 Updating buyer performance for auction:', auctionId, 'with data:', buyers);
      
      // First, delete existing buyer performance for this auction
      const { error: deleteError } = await supabaseClient
        .from('buyer_performance')
        .delete()
        .eq('auction_id', auctionId)
      
      if (deleteError) throw deleteError

      // Then insert the new buyer performance using the same mapping logic as createBuyerPerformance
      if (buyers.length > 0) {
        // Use the same logic as createBuyerPerformance to map names to IDs
        const buyersResult = await this.getBuyers();
        if (!buyersResult.success) throw new Error('Failed to load buyers');
        
        console.log('📋 Available buyers for update:', buyersResult.data.map(b => b.buyer_name));
        
        const buyersMap = new Map(buyersResult.data.map(b => [b.buyer_name, b.id]));
        
        // Transform buyer performance data to include buyer_id
        const performanceWithIds = buyers.map(buyer => {
          const buyerId = buyersMap.get(buyer.buyer);
          console.log(`🔍 Mapping buyer "${buyer.buyer}" to ID:`, buyerId);
          if (!buyerId) {
            console.warn(`❌ Buyer "${buyer.buyer}" not found in buyers table`);
          }
          return {
            auction_id: buyer.auction_id,
            buyer_id: buyerId,
            share_pct: buyer.share_pct,
            cat: buyer.cat,
            bales_ytd: buyer.bales_ytd,
            created_by: buyer.created_by
          };
        });
        
        console.log('💾 Final buyer performance data to insert (update):', performanceWithIds);
        
        const { data, error } = await supabaseClient
          .from('buyer_performance')
          .insert(performanceWithIds)
          .select()
        
        if (error) throw error
        return { success: true, data }
      }
      
      return { success: true, data: [] }
    } catch (error) {
      console.error('Update buyer performance error:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteBuyerPerformanceByAuction(auctionId: string) {
    try {
      const { error } = await supabaseClient
        .from('buyer_performance')
        .delete()
        .eq('auction_id', auctionId)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Delete buyer performance error:', error)
      return { success: false, error: error.message }
    }
  }

  // Lookup data
  static async getLookupData() {
    try {
      const [provincesResult, certificationsResult, commodityTypesResult, brokersResult] = await Promise.all([
        supabaseClient.from('provinces').select('*').order('name'),
        supabaseClient.from('certifications').select('*').order('name'),
        supabaseClient.from('commodity_types').select('*').order('name'),
        supabaseClient.from('brokers').select('*').order('name')
      ])

      if (provincesResult.error) throw provincesResult.error
      if (certificationsResult.error) throw certificationsResult.error
      if (commodityTypesResult.error) throw commodityTypesResult.error
      if (brokersResult.error) throw brokersResult.error

      return {
        success: true,
        data: {
          provinces: provincesResult.data,
          certifications: certificationsResult.data,
          commodity_types: commodityTypesResult.data,
          brokers: brokersResult.data
        }
      }
    } catch (error) {
      console.error('Get lookup data error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getProvinces() {
    try {
      const { data, error } = await supabaseClient
        .from('provinces')
        .select('*')
        .order('name')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get provinces error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getCertifications() {
    try {
      const { data, error } = await supabaseClient
        .from('certifications')
        .select('*')
        .order('name')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get certifications error:', error)
      return { success: false, error: error.message }
    }
  }

  // Helper function to extract catalogue prefix and number from combined field
  private static extractCatalogueParts(catalogueName: string | undefined): { prefix: string; number: string } {
    if (!catalogueName) return { prefix: 'CW', number: '001' };
    
    // Split the catalogue name into prefix and number
    const match = catalogueName.match(/^([A-Za-z]+)(\d+)$/);
    if (match) {
      return { prefix: match[1], number: match[2] };
    }
    
    // Fallback: try to split at first digit
    const digitMatch = catalogueName.match(/^([A-Za-z]+)(\d+.*)$/);
    if (digitMatch) {
      return { prefix: digitMatch[1], number: digitMatch[2] };
    }
    
    // If no pattern matches, treat as prefix only
    return { prefix: catalogueName, number: '001' };
  }

  // Complete auction data operations
  static async saveCompleteAuctionReportWithStatus(formData: Omit<AuctionReport, 'top_sales'>, status: 'draft' | 'published') {
    try {
      // Get current user from Supabase auth
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ No authenticated user found:', authError);
        return { success: false, error: 'User not authenticated' };
      }
      
      // Verify the user exists in our users table
      const { data: dbUser, error: userError } = await supabaseClient
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (userError || !dbUser) {
        console.error('❌ User not found in users table:', userError);
        return { success: false, error: 'User not found in database' };
      }
      
      const userId = dbUser.id;
      console.log('✅ Using authenticated user ID:', userId);

      // Load provinces and certifications data for lookups
      const [provincesResult, certificationsResult] = await Promise.all([
        this.getProvinces(),
        this.getCertifications()
      ]);

      const provinces = provincesResult.success ? provincesResult.data : [];
      const certifications = certificationsResult.success ? certificationsResult.data : [];

      // Extract catalogue prefix and number from combined field
      const catalogueParts = this.extractCatalogueParts(formData.auction.catalogue_name);

      // Check if we're editing an existing auction or creating a new one
      const isEditing = formData.auction.id && formData.auction.id !== '';
      let auctionId: string;

      if (isEditing) {
        // Update existing auction
        console.log('🔄 Updating existing auction:', formData.auction.id);
        const auctionUpdateData: AuctionUpdate = {
          season_id: formData.auction.season_id && formData.auction.season_id !== '' ? formData.auction.season_id : null,
          auction_date: formData.auction.auction_date,
          catalogue_prefix: catalogueParts.prefix,
          catalogue_number: catalogueParts.number,
          commodity_type_id: formData.auction.commodity_type_id && formData.auction.commodity_type_id !== '' ? formData.auction.commodity_type_id : null,
          week_start: formData.auction.week_start,
          week_end: formData.auction.week_end,
          status: status,
          supply_statistics_bales_offered: formData.supply_stats?.offered_bales,
          supply_statistics_sold_bales: formData.supply_stats?.sold_bales,
          supply_statistics_clearance_rate: formData.supply_stats?.clearance_rate_pct,
          highest_price_price_cents_clean: formData.highest_price?.price_cents_clean,
          highest_price_micron: formData.highest_price?.micron,
          highest_price_bales: formData.highest_price?.bales,
          certified_offered_bales: formData.certified_share?.offered_bales,
          certified_sold_bales: formData.certified_share?.sold_bales,
          certified_all_wool_pct_offered: formData.certified_share?.all_wool_pct_offered,
          certified_all_wool_pct_sold: formData.certified_share?.all_wool_pct_sold,
          certified_merino_pct_offered: formData.certified_share?.merino_pct_offered,
          certified_merino_pct_sold: formData.certified_share?.merino_pct_sold,
          greasy_statistics_turnover: formData.greasy_stats?.turnover_rand,
          greasy_statistics_bales: formData.greasy_stats?.bales,
          greasy_statistics_mass: formData.greasy_stats?.mass_kg,
          all_merino_sa_c_kg_clean: formData.market_indices?.merino_indicator_sa_cents_clean,
          all_merino_euro_c_kg_clean: formData.market_indices?.merino_indicator_euro_cents_clean,
          all_merino_us_c_kg_clean: formData.market_indices?.merino_indicator_us_cents_clean,
          certified_sa_c_kg_clean: formData.market_indices?.certified_indicator_sa_cents_clean,
          certified_us_c_kg_clean: formData.market_indices?.certified_indicator_us_cents_clean,
          certified_euro_c_kg_clean: formData.market_indices?.certified_indicator_euro_cents_clean,
          exchange_rates_zar_usd: formData.currency_fx?.ZAR_USD,
          exchange_rates_zar_eur: formData.currency_fx?.ZAR_EUR,
          exchange_rates_zar_jpy: formData.currency_fx?.ZAR_JPY,
          exchange_rates_zar_gbp: formData.currency_fx?.ZAR_GBP,
          exchange_rates_usd_aud: formData.currency_fx?.USD_AUD,
          exchange_rates_sa_c_kg_clean_awex_emi: formData.market_indices?.awex_emi_sa_cents_clean
        };

        const auctionResult = await this.updateAuction(formData.auction.id!, auctionUpdateData);
        if (!auctionResult.success) throw new Error(auctionResult.error);
        auctionId = formData.auction.id!;
      } else {
        // Create new auction
        console.log('🆕 Creating new auction');
        const auctionData: AuctionInsert = {
          season_id: formData.auction.season_id && formData.auction.season_id !== '' ? formData.auction.season_id : null,
          auction_date: formData.auction.auction_date,
          catalogue_prefix: catalogueParts.prefix,
          catalogue_number: catalogueParts.number,
          commodity_type_id: formData.auction.commodity_type_id && formData.auction.commodity_type_id !== '' ? formData.auction.commodity_type_id : null,
          week_start: formData.auction.week_start,
          week_end: formData.auction.week_end,
          status: status,
          supply_statistics_bales_offered: formData.supply_stats?.offered_bales,
          supply_statistics_sold_bales: formData.supply_stats?.sold_bales,
          supply_statistics_clearance_rate: formData.supply_stats?.clearance_rate_pct,
          highest_price_price_cents_clean: formData.highest_price?.price_cents_clean,
          highest_price_micron: formData.highest_price?.micron,
          highest_price_bales: formData.highest_price?.bales,
          certified_offered_bales: formData.certified_share?.offered_bales,
          certified_sold_bales: formData.certified_share?.sold_bales,
          certified_all_wool_pct_offered: formData.certified_share?.all_wool_pct_offered,
          certified_all_wool_pct_sold: formData.certified_share?.all_wool_pct_sold,
          certified_merino_pct_offered: formData.certified_share?.merino_pct_offered,
          certified_merino_pct_sold: formData.certified_share?.merino_pct_sold,
          greasy_statistics_turnover: formData.greasy_stats?.turnover_rand,
          greasy_statistics_bales: formData.greasy_stats?.bales,
          greasy_statistics_mass: formData.greasy_stats?.mass_kg,
          all_merino_sa_c_kg_clean: formData.market_indices?.merino_indicator_sa_cents_clean,
          all_merino_euro_c_kg_clean: formData.market_indices?.merino_indicator_euro_cents_clean,
          all_merino_us_c_kg_clean: formData.market_indices?.merino_indicator_us_cents_clean,
          certified_sa_c_kg_clean: formData.market_indices?.certified_indicator_sa_cents_clean,
          certified_us_c_kg_clean: formData.market_indices?.certified_indicator_us_cents_clean,
          certified_euro_c_kg_clean: formData.market_indices?.certified_indicator_euro_cents_clean,
          exchange_rates_zar_usd: formData.currency_fx?.ZAR_USD,
          exchange_rates_zar_eur: formData.currency_fx?.ZAR_EUR,
          exchange_rates_zar_jpy: formData.currency_fx?.ZAR_JPY,
          exchange_rates_zar_gbp: formData.currency_fx?.ZAR_GBP,
          exchange_rates_usd_aud: formData.currency_fx?.USD_AUD,
          exchange_rates_sa_c_kg_clean_awex_emi: formData.market_indices?.awex_emi_sa_cents_clean
        };

        const auctionResult = await this.createAuction(auctionData);
        if (!auctionResult.success) throw new Error(auctionResult.error);
        auctionId = auctionResult.data.id;
      }

      // Handle related data - use updateAuctionReport for both create and update
      // This ensures proper handling of all related data with update/create logic
      console.log(`📊 Handling related data for ${isEditing ? 'existing' : 'new'} auction`);
      
      // For editing, we use the updateAuctionReport method which handles all related data properly
      if (isEditing) {
        console.log('🔄 Updating related data for existing auction');
        const updateResult = await this.updateAuctionReport(auctionId, formData);
        if (!updateResult.success) throw new Error(updateResult.error);
      } else {
        // For new auctions, we also use updateAuctionReport which will create the data
        // since it properly handles both create and update scenarios
        console.log('🆕 Creating related data for new auction using update logic');
        const createResult = await this.updateAuctionReport(auctionId, formData);
        if (!createResult.success) throw new Error(createResult.error);
      }

      return { success: true, data: { id: auctionId } }
    } catch (error) {
      console.error('Save complete auction report error:', error)
      return { success: false, error: error.message }
    }
  }

  // Backward compatibility method
  static async saveCompleteAuctionReport(formData: Omit<AuctionReport, 'top_sales'>) {
    return this.saveCompleteAuctionReportWithStatus(formData, 'published')
  }

  static async getCompleteAuctionReport(auctionId: string): Promise<{ success: boolean; data?: AuctionReport; error?: string }> {
    try {
      console.log('🔍 Loading complete auction report for ID:', auctionId);
      
      // Get auction with related data and reference counts
      const auctionResult = await this.getAuctionById(auctionId)
      if (!auctionResult.success) throw new Error(auctionResult.error)

      const auction = auctionResult.data
      if (!auction) {
        throw new Error('Auction data not found');
      }
      
      console.log('📊 Auction data loaded:', {
        id: auction.id,
        catalogue_prefix: auction.catalogue_prefix,
        catalogue_number: auction.catalogue_number,
        catalogue: `${auction.catalogue_prefix}${auction.catalogue_number}`,
        has_micron_prices: auction.has_micron_prices,
        has_buyer_data: auction.has_buyer_data,
        has_broker_data: auction.has_broker_data,
        has_provincial_data: auction.has_provincial_data
      });

      // Use the new reference columns to determine what data to load
      const promises: Promise<any>[] = []
      
      // Always load seasons data
      promises.push(this.getSeasons())
      
      // Only load data if the auction has the respective data
      if (auction.has_micron_prices) {
        promises.push(this.getMicronPricesByAuction(auctionId))
      } else {
        promises.push(Promise.resolve({ success: true, data: [] }))
      }
      
      if (auction.has_market_insights) {
        promises.push(this.getMarketInsightByAuction(auctionId))
      } else {
        promises.push(Promise.resolve({ success: true, data: null }))
      }
      
      if (auction.has_provincial_data) {
        promises.push(this.getTopPerformersByAuction(auctionId))
      } else {
        promises.push(Promise.resolve({ success: true, data: [] }))
      }
      
      if (auction.has_broker_data) {
        promises.push(this.getBrokerPerformanceByAuction(auctionId))
      } else {
        promises.push(Promise.resolve({ success: true, data: [] }))
      }
      
      if (auction.has_buyer_data) {
        promises.push(this.getBuyerPerformanceByAuction(auctionId))
        promises.push(this.getBuyerSeasonTotals(auction.season_id))
      } else {
        promises.push(Promise.resolve({ success: true, data: [] }))
        promises.push(Promise.resolve({ success: true, data: [] }))
      }

      // Always load season indicator totals for the overview cards
      promises.push(this.getSeasonIndicatorTotals(auction.season_id))

      const [seasonsResult, micronPricesResult, marketInsightResult, topPerformersResult, brokerPerformanceResult, buyerPerformanceResult, buyerSeasonTotalsResult, seasonIndicatorTotalsResult] = await Promise.all(promises)
      
      console.log('📈 Data loading results:', {
        seasons: seasonsResult.success ? seasonsResult.data.length : 0,
        micronPrices: micronPricesResult.success ? micronPricesResult.data.length : 0,
        marketInsight: marketInsightResult.success ? (marketInsightResult.data ? 1 : 0) : 0,
        topPerformers: topPerformersResult.success ? topPerformersResult.data.length : 0,
        brokerPerformance: brokerPerformanceResult.success ? brokerPerformanceResult.data.length : 0,
        buyerPerformance: buyerPerformanceResult.success ? buyerPerformanceResult.data.length : 0,
        buyerSeasonTotals: buyerSeasonTotalsResult.success ? buyerSeasonTotalsResult.data.length : 0,
        seasonIndicatorTotals: seasonIndicatorTotalsResult.success ? 1 : 0
      });

      // Transform data back to form format
      const formData: AuctionReport = {
        auction: {
          id: auction.id, // Include auction ID for edit mode
          commodity: 'wool', // Default commodity type
          season_id: auction.season_id,
          auction_date: auction.auction_date,
          catalogue_prefix: auction.catalogue_prefix,
          catalogue_number: auction.catalogue_number,
          catalogue_name: `${auction.catalogue_prefix}${auction.catalogue_number}`, // Combined field for form compatibility
          commodity_type_id: auction.commodity_type_id,
          week_start: auction.week_start,
          week_end: auction.week_end,
          season_label: seasonsResult.success && seasonsResult.data ? 
            seasonsResult.data.find(s => s.id === auction.season_id)?.season_year || '2025/26' : '2025/26',
          week_id: `week_${auction.auction_date?.replace(/-/g, '_') || 'unknown'}`
        },
        market_indices: {
          merino_indicator_sa_cents_clean: auction.all_merino_sa_c_kg_clean,
          merino_indicator_euro_cents_clean: auction.all_merino_euro_c_kg_clean,
          merino_indicator_us_cents_clean: auction.all_merino_us_c_kg_clean,
          certified_indicator_sa_cents_clean: auction.certified_sa_c_kg_clean,
          certified_indicator_euro_cents_clean: auction.certified_euro_c_kg_clean,
          certified_indicator_us_cents_clean: auction.certified_us_c_kg_clean,
          awex_emi_sa_cents_clean: auction.exchange_rates_sa_c_kg_clean_awex_emi
        },
        currency_fx: {
          ZAR_USD: auction.exchange_rates_zar_usd,
          ZAR_EUR: auction.exchange_rates_zar_eur,
          ZAR_JPY: auction.exchange_rates_zar_jpy,
          ZAR_GBP: auction.exchange_rates_zar_gbp,
          USD_AUD: auction.exchange_rates_usd_aud
        },
        supply_stats: {
          offered_bales: auction.supply_statistics_bales_offered,
          sold_bales: auction.supply_statistics_sold_bales,
          clearance_rate_pct: auction.supply_statistics_clearance_rate
        },
        highest_price: {
          price_cents_clean: auction.highest_price_price_cents_clean,
          micron: auction.highest_price_micron,
          bales: auction.highest_price_bales
        },
        certified_share: {
          offered_bales: auction.certified_offered_bales,
          sold_bales: auction.certified_sold_bales,
          all_wool_pct_offered: auction.certified_all_wool_pct_offered,
          all_wool_pct_sold: auction.certified_all_wool_pct_sold,
          merino_pct_offered: auction.certified_merino_pct_offered,
          merino_pct_sold: auction.certified_merino_pct_sold
        },
        greasy_stats: {
          turnover_rand: auction.greasy_statistics_turnover,
          bales: auction.greasy_statistics_bales,
          mass_kg: auction.greasy_statistics_mass
        },
        micron_prices: (() => {
          console.log('🔍 Micron prices result:', micronPricesResult);
          if (micronPricesResult.success && micronPricesResult.data) {
            const transformedPrices = micronPricesResult.data.map(price => {
              const micron = parseFloat(price.micron.toString());
              let category: 'Fine' | 'Medium' | 'Strong';
              
              // Industry standard wool categories based on micron values
              if (micron <= 18.5) {
                category = 'Fine';
              } else if (micron <= 20.5) {
                category = 'Medium';
              } else {
                category = 'Strong';
              }
              
              return {
                bucket_micron: price.micron.toString(),
                category: category,
                price_clean_zar_per_kg: parseFloat(price.non_cert_clean_zar_per_kg) || 0,
                certified_price_clean_zar_per_kg: parseFloat(price.cert_clean_zar_per_kg) || 0,
                all_merino_price_clean_zar_per_kg: null
              };
            });
            console.log('🔍 Transformed micron prices:', transformedPrices);
            return transformedPrices;
          }
          console.log('🔍 No micron prices data available');
          return [];
        })(),
        micron_price_comparison: {
          rows: micronPricesResult.success ? micronPricesResult.data.map(price => ({
            micron: parseFloat(price.micron.toString()),
            non_cert_clean_zar_per_kg: price.non_cert_clean_zar_per_kg ? parseFloat(price.non_cert_clean_zar_per_kg.toString()) : null,
            cert_clean_zar_per_kg: price.cert_clean_zar_per_kg ? parseFloat(price.cert_clean_zar_per_kg.toString()) : null,
            pct_difference: price.pct_difference ? parseFloat(price.pct_difference.toString()) : null
          })) : [],
          notes: ''
        },
        buyers: buyerPerformanceResult.success ? buyerPerformanceResult.data.map(buyer => {
          const buyerName = (buyer as any).buyers?.buyer_name || buyer.buyer;
          // Find season total for this buyer
          const seasonTotal = buyerSeasonTotalsResult.success 
            ? buyerSeasonTotalsResult.data.find(st => st.buyer === buyerName)?.total_bales_season || 0
            : 0;
          
          return {
            buyer: buyerName,
            cat: buyer.cat ? parseInt(buyer.cat.toString()) : 0,
            share_pct: buyer.share_pct ? parseFloat(buyer.share_pct.toString()) : 0,
            bales_ytd: seasonTotal // Use season total instead of YTD
          };
        }) : [],
        brokers: brokerPerformanceResult.success ? brokerPerformanceResult.data.map(broker => ({
          name: (broker as any).brokers?.name || broker.name, // Use joined broker name or fallback to legacy field
          catalogue_offering: broker.catalogue_offering ? parseInt(broker.catalogue_offering.toString()) : 0,
          withdrawn_before_sale: broker.withdrawn_before_sale ? parseInt(broker.withdrawn_before_sale.toString()) : 0,
          wool_offered: broker.wool_offered ? parseInt(broker.wool_offered.toString()) : 0,
          withdrawn_during_sale: broker.withdrawn_during_sale ? parseInt(broker.withdrawn_during_sale.toString()) : 0,
          passed: broker.passed ? parseInt(broker.passed.toString()) : 0,
          not_sold: broker.not_sold ? parseInt(broker.not_sold.toString()) : 0,
          sold: broker.sold ? parseInt(broker.sold.toString()) : 0,
          sold_pct: broker.sold_pct ? parseFloat(broker.sold_pct.toString()) : 0,
          sold_ytd: broker.sold_ytd ? parseInt(broker.sold_ytd.toString()) : 0
        })) : [],
        currencies: await (async () => {
          console.log('🔍 Raw auction exchange rates:', {
            zar_usd: auction.exchange_rates_zar_usd,
            zar_eur: auction.exchange_rates_zar_eur,
            zar_jpy: auction.exchange_rates_zar_jpy,
            zar_gbp: auction.exchange_rates_zar_gbp,
            usd_aud: auction.exchange_rates_usd_aud
          });
          
          // Get previous auction for comparison
          const previousAuctionQuery = await supabaseClient
            .from('auctions')
            .select('exchange_rates_zar_usd, exchange_rates_zar_eur, exchange_rates_zar_jpy, exchange_rates_zar_gbp, exchange_rates_usd_aud')
            .lt('auction_date', auction.auction_date)
            .order('auction_date', { ascending: false })
            .limit(1);
          
          const previousAuction = previousAuctionQuery.data?.[0];
          
          // Calculate percentage change
          const calculateChange = (current: number, previous: number | null | undefined) => {
            if (!previous || previous === 0) return 0;
            return ((current - previous) / previous) * 100;
          };
          
          const currentUSD = parseFloat(auction.exchange_rates_zar_usd) || 0;
          const currentAUD = auction.exchange_rates_usd_aud ? (parseFloat(auction.exchange_rates_zar_usd) / parseFloat(auction.exchange_rates_usd_aud)) : 0;
          const currentEUR = parseFloat(auction.exchange_rates_zar_eur) || 0;
          const currentJPY = parseFloat(auction.exchange_rates_zar_jpy) || 0;
          const currentGBP = parseFloat(auction.exchange_rates_zar_gbp) || 0;
          
          const previousUSD = previousAuction ? parseFloat(previousAuction.exchange_rates_zar_usd) || 0 : 0;
          const previousAUD = previousAuction && previousAuction.exchange_rates_usd_aud ? 
            (parseFloat(previousAuction.exchange_rates_zar_usd) / parseFloat(previousAuction.exchange_rates_usd_aud)) : 0;
          const previousEUR = previousAuction ? parseFloat(previousAuction.exchange_rates_zar_eur) || 0 : 0;
          const previousJPY = previousAuction ? parseFloat(previousAuction.exchange_rates_zar_jpy) || 0 : 0;
          const previousGBP = previousAuction ? parseFloat(previousAuction.exchange_rates_zar_gbp) || 0 : 0;
          
          const currencies = [
            {
              code: 'USD',
              value: currentUSD,
              change: calculateChange(currentUSD, previousUSD)
            },
            {
              code: 'AUD',
              value: currentAUD,
              change: calculateChange(currentAUD, previousAUD)
            },
            {
              code: 'EUR',
              value: currentEUR,
              change: calculateChange(currentEUR, previousEUR)
            },
            {
              code: 'JPY',
              value: currentJPY,
              change: calculateChange(currentJPY, previousJPY)
            },
            {
              code: 'GBP',
              value: currentGBP,
              change: calculateChange(currentGBP, previousGBP)
            }
          ];
          
          console.log('🔍 Processed currencies with changes:', currencies);
          return currencies;
        })(),
        provincial_producers: topPerformersResult.success ? this.groupTopPerformersByProvince(topPerformersResult.data) : [],
        indicators: await this.calculateIndicatorsWithChanges(auction, seasonIndicatorTotalsResult),
        benchmarks: await this.calculateBenchmarksWithChanges(auction),
        trends: await this.generateSeasonTrendData(auction.season_id),
        yearly_average_prices: await this.calculateSeasonAveragePrices(auction.season_id),
        province_avg_prices: [],
        insights: marketInsightResult.success ? marketInsightResult.data?.market_insights_text : '',
        top_sales: [] // Empty array for top_sales as it's derived from provincial_producers
      }

      console.log('🎯 Form data created:', {
        auction_catalogue_name: formData.auction.catalogue_name,
        auction_catalogue_prefix: formData.auction.catalogue_prefix,
        auction_catalogue_number: formData.auction.catalogue_number,
        micron_price_comparison_rows: formData.micron_price_comparison.rows.length,
        micron_prices_count: formData.micron_prices.length,
        buyers_count: formData.buyers.length,
        brokers_count: formData.brokers.length,
        provincial_producers_count: formData.provincial_producers.length,
        currencies_count: formData.currencies.length,
        currencies_data: formData.currencies,
        first_micron_row: formData.micron_price_comparison.rows[0],
        first_buyer: formData.buyers[0],
        first_broker: formData.brokers[0],
        first_provincial: formData.provincial_producers[0]
      });

      return { success: true, data: formData }
    } catch (error) {
      console.error('Get complete auction report error:', error)
      return { success: false, error: error.message }
    }
  }

  // Calculate percentage change between two values
  private static calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return Number(((current - previous) / previous * 100).toFixed(1));
  }

  // Get previous auction in the same season
  static async getPreviousAuction(currentAuction: any) {
    try {
      const { data: previousAuctions, error } = await supabaseClient
        .from('auctions')
        .select(`
          id,
          auction_date,
          supply_statistics_bales_offered,
          greasy_statistics_mass,
          greasy_statistics_turnover,
          all_merino_sa_c_kg_clean,
          certified_sa_c_kg_clean,
          exchange_rates_sa_c_kg_clean_awex_emi,
          status
        `)
        .eq('season_id', currentAuction.season_id)
        .eq('status', 'published')
        .lt('auction_date', currentAuction.auction_date)
        .order('auction_date', { ascending: false })
        .limit(1);

      if (error) throw error;
      return { success: true, data: previousAuctions?.[0] || null };
    } catch (error) {
      console.error('Get previous auction error:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate season-wide average prices for certified and merino wool
  static async calculateSeasonAveragePrices(seasonId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('auctions')
        .select('certified_sa_c_kg_clean, all_merino_sa_c_kg_clean')
        .eq('season_id', seasonId)
        .eq('status', 'published')
        .not('certified_sa_c_kg_clean', 'is', null)
        .not('all_merino_sa_c_kg_clean', 'is', null);

      if (error) {
        console.error('Error fetching season average prices:', error);
        return [
          {
            label: 'Certified Wool Avg Price (YTD)',
            value: 0,
            unit: 'ZAR/kg'
          },
          {
            label: 'All - Merino Wool Avg Price (YTD)',
            value: 0,
            unit: 'ZAR/kg'
          }
        ];
      }

      if (!data || data.length === 0) {
        return [
          {
            label: 'Certified Wool Avg Price (YTD)',
            value: 0,
            unit: 'ZAR/kg'
          },
          {
            label: 'All - Merino Wool Avg Price (YTD)',
            value: 0,
            unit: 'ZAR/kg'
          }
        ];
      }

      // Calculate averages (convert from cents to Rands)
      const certifiedSum = data.reduce((sum, auction) => sum + parseFloat(auction.certified_sa_c_kg_clean || '0'), 0);
      const merinoSum = data.reduce((sum, auction) => sum + parseFloat(auction.all_merino_sa_c_kg_clean || '0'), 0);
      
      const certifiedAvg = certifiedSum / data.length / 100; // Convert cents to Rands
      const merinoAvg = merinoSum / data.length / 100; // Convert cents to Rands

      console.log('📊 Season Average Prices Calculated:', {
        seasonId,
        auctionCount: data.length,
        certifiedAvg: certifiedAvg.toFixed(2),
        merinoAvg: merinoAvg.toFixed(2)
      });

      return [
        {
          label: 'Certified Wool Avg Price (YTD)',
          value: Math.round(certifiedAvg * 100) / 100, // Round to 2 decimal places
          unit: 'ZAR/kg'
        },
        {
          label: 'All - Merino Wool Avg Price (YTD)',
          value: Math.round(merinoAvg * 100) / 100, // Round to 2 decimal places
          unit: 'ZAR/kg'
        }
      ];
    } catch (error) {
      console.error('Error calculating season average prices:', error);
      return [
        {
          label: 'Certified Wool Avg Price (YTD)',
          value: 0,
          unit: 'ZAR/kg'
        },
        {
          label: 'All - Merino Wool Avg Price (YTD)',
          value: 0,
          unit: 'ZAR/kg'
        }
      ];
    }
  }

  // Calculate indicators with percentage changes
  static async calculateIndicatorsWithChanges(auction: any, seasonIndicatorTotalsResult: any) {
    console.log('🔍 calculateIndicatorsWithChanges Debug:', {
      auction_id: auction.id,
      season_id: auction.season_id,
      seasonIndicatorTotalsResult: seasonIndicatorTotalsResult
    });
    const previousAuctionResult = await this.getPreviousAuction(auction);
    const previousAuction = previousAuctionResult.success ? previousAuctionResult.data : null;

    console.log('📊 Calculating indicators with changes:', {
      currentAuction: `${auction.catalogue_prefix}${auction.catalogue_number}`,
      previousAuction: previousAuction ? `${previousAuction.catalogue_prefix}${previousAuction.catalogue_number}` : 'None',
      hasPrevious: !!previousAuction
    });

    // Current values
    const currentLots = auction.supply_statistics_bales_offered || 0;
    const currentVolume = auction.greasy_statistics_mass ? (auction.greasy_statistics_mass / 1000) : 0;
    const currentValue = auction.greasy_statistics_turnover ? (auction.greasy_statistics_turnover / 1000000) : 0;
    const currentAvgPrice = auction.all_merino_sa_c_kg_clean ? (parseFloat(auction.all_merino_sa_c_kg_clean) / 100) : 0;

    // Previous values (if available)
    const previousLots = previousAuction?.supply_statistics_bales_offered || 0;
    const previousVolume = previousAuction?.greasy_statistics_mass ? (previousAuction.greasy_statistics_mass / 1000) : 0;
    const previousValue = previousAuction?.greasy_statistics_turnover ? (previousAuction.greasy_statistics_turnover / 1000000) : 0;
    const previousAvgPrice = previousAuction?.all_merino_sa_c_kg_clean ? (parseFloat(previousAuction.all_merino_sa_c_kg_clean) / 100) : 0;

    // Calculate percentage changes
    const lotsChange = previousAuction ? this.calculatePercentageChange(currentLots, previousLots) : 0;
    const volumeChange = previousAuction ? this.calculatePercentageChange(currentVolume, previousVolume) : 0;
    const valueChange = previousAuction ? this.calculatePercentageChange(currentValue, previousValue) : 0;
    const avgPriceChange = previousAuction ? this.calculatePercentageChange(currentAvgPrice, previousAvgPrice) : 0;

    console.log('📈 Calculated changes:', {
      lots: `${currentLots} vs ${previousLots} = ${lotsChange}%`,
      volume: `${currentVolume} vs ${previousVolume} = ${volumeChange}%`,
      value: `${currentValue} vs ${previousValue} = ${valueChange}%`,
      avgPrice: `${currentAvgPrice} vs ${previousAvgPrice} = ${avgPriceChange}%`
    });

    // Calculate YTD values with fallback
    const ytdLots = seasonIndicatorTotalsResult.success ? seasonIndicatorTotalsResult.data.totalBales : currentLots;
    const ytdVolume = seasonIndicatorTotalsResult.success ? (seasonIndicatorTotalsResult.data.totalVolume / 1000) : currentVolume;
    const ytdValue = seasonIndicatorTotalsResult.success ? (seasonIndicatorTotalsResult.data.totalValue / 1000000) : currentValue;

    console.log('🔍 YTD Values Debug:', {
      seasonIndicatorTotalsSuccess: seasonIndicatorTotalsResult.success,
      seasonData: seasonIndicatorTotalsResult.data,
      calculated: {
        ytdLots,
        ytdVolume,
        ytdValue,
        currentLots,
        currentVolume,
        currentValue
      }
    });

    return [
      {
        type: 'total_lots',
        unit: 'bales',
        value: currentLots,
        value_ytd: ytdLots,
        pct_change: lotsChange
      },
      {
        type: 'total_volume',
        unit: 'MT',
        value: currentVolume,
        value_ytd: ytdVolume,
        pct_change: volumeChange
      },
      {
        type: 'avg_price',
        unit: 'ZAR/kg',
        value: currentAvgPrice,
        pct_change: avgPriceChange
      },
      {
        type: 'total_value',
        unit: 'ZAR M',
        value: currentValue,
        value_ytd: ytdValue,
        pct_change: valueChange
      }
    ];
  }

  // Calculate benchmarks with percentage changes
  static async calculateBenchmarksWithChanges(auction: any) {
    const previousAuctionResult = await this.getPreviousAuction(auction);
    const previousAuction = previousAuctionResult.success ? previousAuctionResult.data : null;

    // Current prices
    const currentCertified = auction.certified_sa_c_kg_clean ? (parseFloat(auction.certified_sa_c_kg_clean) / 100) : 0;
    const currentAllMerino = auction.all_merino_sa_c_kg_clean ? (parseFloat(auction.all_merino_sa_c_kg_clean) / 100) : 0;
    const currentAwex = auction.exchange_rates_sa_c_kg_clean_awex_emi ? (parseFloat(auction.exchange_rates_sa_c_kg_clean_awex_emi) / 100) : 0;

    // Previous prices (if available)
    const previousCertified = previousAuction?.certified_sa_c_kg_clean ? (parseFloat(previousAuction.certified_sa_c_kg_clean) / 100) : 0;
    const previousAllMerino = previousAuction?.all_merino_sa_c_kg_clean ? (parseFloat(previousAuction.all_merino_sa_c_kg_clean) / 100) : 0;
    const previousAwex = previousAuction?.exchange_rates_sa_c_kg_clean_awex_emi ? (parseFloat(previousAuction.exchange_rates_sa_c_kg_clean_awex_emi) / 100) : 0;

    // Calculate percentage changes
    const certifiedChange = previousAuction ? this.calculatePercentageChange(currentCertified, previousCertified) : 0;
    const allMerinoChange = previousAuction ? this.calculatePercentageChange(currentAllMerino, previousAllMerino) : 0;
    const awexChange = previousAuction ? this.calculatePercentageChange(currentAwex, previousAwex) : 0;

    console.log('📈 Calculated benchmark changes:', {
      certified: `${currentCertified} vs ${previousCertified} = ${certifiedChange}%`,
      allMerino: `${currentAllMerino} vs ${previousAllMerino} = ${allMerinoChange}%`,
      awex: `${currentAwex} vs ${previousAwex} = ${awexChange}%`
    });

    return [
      {
        label: 'Certified',
        price: currentCertified,
        currency: 'ZAR/kg clean',
        day_change_pct: certifiedChange
      },
      {
        label: 'All-Merino',
        price: currentAllMerino,
        currency: 'ZAR/kg clean',
        day_change_pct: allMerinoChange
      },
      {
        label: 'AWEX',
        price: currentAwex,
        currency: 'USD/kg clean',
        day_change_pct: awexChange
      }
    ];
  }

  // Generate comprehensive trend data for the season and previous year
  static async generateSeasonTrendData(seasonId: string) {
    try {
      console.log('📈 Generating season trend data for season:', seasonId);
      
      // Get current season info
      const currentSeasonResult = await this.getSeasonById(seasonId);
      if (!currentSeasonResult.success) {
        console.error('Failed to get current season:', currentSeasonResult.error);
        return { rws: [], non_rws: [], awex: [], exchange_rates: [] };
      }
      
      const currentSeason = currentSeasonResult.data;
      const currentYear = new Date(currentSeason.start_date).getFullYear();
      const previousYear = currentYear - 1;
      
      console.log('📅 Season years:', { currentYear, previousYear });
      
      // Get all auctions for current season (published only)
      const { data: currentSeasonAuctions, error: currentError } = await supabaseClient
        .from('auctions')
        .select(`
          id,
          auction_date,
          catalogue_prefix,
          catalogue_number,
          certified_sa_c_kg_clean,
          all_merino_sa_c_kg_clean,
          exchange_rates_sa_c_kg_clean_awex_emi,
          exchange_rates_zar_usd,
          status
        `)
        .eq('season_id', seasonId)
        .eq('status', 'published')
        .order('auction_date', { ascending: true });
      
      if (currentError) {
        console.error('Error fetching current season auctions:', currentError);
        return { rws: [], non_rws: [], awex: [], exchange_rates: [] };
      }
      
      // Get previous year season (if exists)
      const { data: previousSeasons, error: prevSeasonsError } = await supabaseClient
        .from('seasons')
        .select('id, season_year, start_date')
        .like('season_year', `${previousYear}%`)
        .limit(1);
      
      let previousSeasonAuctions = [];
      if (!prevSeasonsError && previousSeasons && previousSeasons.length > 0) {
        const previousSeasonId = previousSeasons[0].id;
        console.log('📊 Found previous season:', previousSeasons[0].season_year, 'ID:', previousSeasonId);
        
        const { data: prevAuctions, error: prevError } = await supabaseClient
          .from('auctions')
          .select(`
            id,
            auction_date,
            catalogue_prefix,
            catalogue_number,
            certified_sa_c_kg_clean,
            all_merino_sa_c_kg_clean,
            exchange_rates_sa_c_kg_clean_awex_emi,
            exchange_rates_zar_usd,
            status
          `)
          .eq('season_id', previousSeasonId)
          .eq('status', 'published')
          .order('auction_date', { ascending: true });
        
        if (!prevError && prevAuctions) {
          previousSeasonAuctions = prevAuctions;
        }
      }
      
      console.log('📊 Auctions found:', {
        current: currentSeasonAuctions?.length || 0,
        previous: previousSeasonAuctions.length
      });
      
      // Create trend data points
      const createTrendPoints = (currentAuctions, previousAuctions) => {
        const maxLength = Math.max(currentAuctions.length, previousAuctions.length);
        const points = [];
        
        for (let i = 0; i < maxLength; i++) {
          const currentAuction = currentAuctions[i];
          const previousAuction = previousAuctions[i];
          
          // Use auction number as period (just the number, e.g., "1", "2", etc.)
          const period = currentAuction ? 
            String(parseInt(currentAuction.catalogue_number) || i + 1) :
            String(i + 1);
          
          points.push({
            period,
            auction_catalogue: period,
            currentAuction,
            previousAuction
          });
        }
        
        return points;
      };
      
      const trendPoints = createTrendPoints(currentSeasonAuctions || [], previousSeasonAuctions);
      
      // Generate RWS (Certified) trend data
      const rws = trendPoints.map(point => {
        const currentPrice = point.currentAuction?.certified_sa_c_kg_clean ? 
          (parseFloat(point.currentAuction.certified_sa_c_kg_clean) / 100) : null;
        const previousPrice = point.previousAuction?.certified_sa_c_kg_clean ? 
          (parseFloat(point.previousAuction.certified_sa_c_kg_clean) / 100) : null;
        
        // Calculate USD prices
        const currentExchangeRate = point.currentAuction?.exchange_rates_zar_usd ? 
          parseFloat(point.currentAuction.exchange_rates_zar_usd) : 1;
        const previousExchangeRate = point.previousAuction?.exchange_rates_zar_usd ? 
          parseFloat(point.previousAuction.exchange_rates_zar_usd) : 1;
        
        return {
          period: point.period,
          auction_catalogue: point.auction_catalogue,
          [`${currentYear}_zar`]: currentPrice,
          [`${previousYear}_zar`]: previousPrice,
          [`${currentYear}_usd`]: currentPrice ? currentPrice / currentExchangeRate : null,
          [`${previousYear}_usd`]: previousPrice ? previousPrice / previousExchangeRate : null
        };
      });
      
      // Generate Non-RWS (All Merino) trend data
      const non_rws = trendPoints.map(point => {
        const currentPrice = point.currentAuction?.all_merino_sa_c_kg_clean ? 
          (parseFloat(point.currentAuction.all_merino_sa_c_kg_clean) / 100) : null;
        const previousPrice = point.previousAuction?.all_merino_sa_c_kg_clean ? 
          (parseFloat(point.previousAuction.all_merino_sa_c_kg_clean) / 100) : null;
        
        // Calculate USD prices
        const currentExchangeRate = point.currentAuction?.exchange_rates_zar_usd ? 
          parseFloat(point.currentAuction.exchange_rates_zar_usd) : 1;
        const previousExchangeRate = point.previousAuction?.exchange_rates_zar_usd ? 
          parseFloat(point.previousAuction.exchange_rates_zar_usd) : 1;
        
        return {
          period: point.period,
          auction_catalogue: point.auction_catalogue,
          [`${currentYear}_zar`]: currentPrice,
          [`${previousYear}_zar`]: previousPrice,
          [`${currentYear}_usd`]: currentPrice ? currentPrice / currentExchangeRate : null,
          [`${previousYear}_usd`]: previousPrice ? previousPrice / previousExchangeRate : null
        };
      });
      
      // Generate AWEX trend data
      const awex = trendPoints.map(point => {
        const currentPrice = point.currentAuction?.exchange_rates_sa_c_kg_clean_awex_emi ? 
          (parseFloat(point.currentAuction.exchange_rates_sa_c_kg_clean_awex_emi) / 100) : null;
        const previousPrice = point.previousAuction?.exchange_rates_sa_c_kg_clean_awex_emi ? 
          (parseFloat(point.previousAuction.exchange_rates_sa_c_kg_clean_awex_emi) / 100) : null;
        
        return {
          period: point.period,
          auction_catalogue: point.auction_catalogue,
          [`${currentYear}_zar`]: null, // AWEX is typically in USD
          [`${previousYear}_zar`]: null,
          [`${currentYear}_usd`]: currentPrice,
          [`${previousYear}_usd`]: previousPrice
        };
      });
      
      console.log('📈 Generated trend data:', {
        rws_points: rws.length,
        non_rws_points: non_rws.length,
        awex_points: awex.length,
        sample_rws: rws[0],
        sample_non_rws: non_rws[0],
        sample_awex: awex[0]
      });
      
      // Generate Exchange Rate trend data (ZAR/USD)
      const exchange_rates = trendPoints.map(point => {
        const currentRate = point.currentAuction?.exchange_rates_zar_usd ? 
          parseFloat(point.currentAuction.exchange_rates_zar_usd) : null;
        const previousRate = point.previousAuction?.exchange_rates_zar_usd ? 
          parseFloat(point.previousAuction.exchange_rates_zar_usd) : null;
        
        return {
          period: point.period,
          auction_catalogue: point.auction_catalogue,
          [`${currentYear}_zar`]: currentRate, // For ZAR/USD, we store the rate as "ZAR"
          [`${previousYear}_zar`]: previousRate,
          [`${currentYear}_usd`]: currentRate, // Same value, different display context
          [`${previousYear}_usd`]: previousRate
        };
      });

      return { rws, non_rws, awex, exchange_rates };
    } catch (error) {
      console.error('Error generating season trend data:', error);
      return { rws: [], non_rws: [], awex: [] };
    }
  }

  private static groupTopPerformersByProvince(performers: TopPerformerRow[]) {
    const grouped = performers.reduce((acc, performer) => {
      const provinceName = (performer as any).provinces?.name || 'Unknown'
      
      // Include all provinces including Lesotho in the data
      
      if (!acc[provinceName]) {
        acc[provinceName] = {
          province: provinceName,
          province_id: performer.province_id,
          producers: []
        }
      }
      
      acc[provinceName].producers.push({
        position: performer.position ? parseInt(performer.position.toString()) : 0,
        name: performer.name,
        district: performer.district,
        producer_number: performer.producer_number,
        no_bales: performer.no_bales ? parseInt(performer.no_bales.toString()) : 0,
        price: performer.price ? parseFloat(performer.price.toString()) : 0,
        description: performer.description,
        micron: performer.micron ? parseFloat(performer.micron.toString()) : 0,
        certified: (performer as any).certifications?.code === 'RWS' ? 'RWS' : '',
        buyer_name: performer.buyer_name || 'Unknown'
      })
      
      return acc
    }, {} as Record<string, ProvincialProducerData>)

    return Object.values(grouped)
  }

  // Auction Report methods (for compatibility with existing components)
  static async saveAuctionReport(reportData: Omit<AuctionReport, 'top_sales'>) {
    try {
      // Set status to published for final save
      const reportWithStatus = {
        ...reportData,
        status: 'published' as const,
        published_at: new Date().toISOString()
      }
      
      // Use the complete save implementation
      const result = await this.saveCompleteAuctionReportWithStatus(reportWithStatus, 'published')
      return result
    } catch (error) {
      console.error('Save auction report error:', error)
      return { success: false, error: error.message }
    }
  }

  static async saveAuctionReportDraft(reportData: Omit<AuctionReport, 'top_sales'>) {
    try {
      // Set status to draft for draft save
      const reportWithStatus = {
        ...reportData,
        status: 'draft' as const
      }
      
      // Use the complete save implementation
      const result = await this.saveCompleteAuctionReportWithStatus(reportWithStatus, 'draft')
      return result
    } catch (error) {
      console.error('Save auction report draft error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getAuctionReport(id: string) {
    try {
      if (id === 'latest') {
        // Get the latest auction report
        const auctionsResult = await this.getAuctions()
        if (auctionsResult.success && auctionsResult.data.length > 0) {
          const latestAuction = auctionsResult.data[0]
          return await this.getCompleteAuctionReport(latestAuction.id)
        }
        return { success: false, error: 'No auctions found' }
      } else {
        return await this.getCompleteAuctionReport(id)
      }
    } catch (error) {
      console.error('Get auction report error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getAllAuctionReports() {
    try {
      const auctionsResult = await this.getAuctions()
      if (!auctionsResult.success) {
        return { success: false, error: auctionsResult.error }
      }

      // Convert auctions to a simplified format for the list with data availability
      const reports = auctionsResult.data.map(auction => ({
        id: auction.id,
        auction_date: auction.auction_date,
        catalogue_name: `${auction.catalogue_prefix}${auction.catalogue_number}`,
        week_id: `week_${auction.week_start}_${auction.week_end}`,
        season: (auction as any).seasons?.season_year || '',
        status: auction.status || 'draft', // Include status field
        total_bales_offered: auction.supply_statistics_bales_offered || 0,
        total_bales_sold: auction.supply_statistics_sold_bales || 0,
        clearance_pct: auction.supply_statistics_clearance_rate || 0,
        total_turnover: auction.greasy_statistics_turnover || 0,
        total_volume_kg: auction.greasy_statistics_mass || 0,
        created_at: auction.created_at || new Date().toISOString(),
        is_empty: false,
        // Include data availability flags
        has_micron_prices: auction.has_micron_prices || false,
        has_buyer_data: auction.has_buyer_data || false,
        has_broker_data: auction.has_broker_data || false,
        has_provincial_data: auction.has_provincial_data || false,
        has_market_insights: auction.has_market_insights || false,
        // Include data counts
        micron_prices_count: auction.micron_prices_count || 0,
        buyer_performance_count: auction.buyer_performance_count || 0,
        broker_performance_count: auction.broker_performance_count || 0,
        top_performers_count: auction.top_performers_count || 0
      }))

      return { success: true, data: reports }
    } catch (error) {
      console.error('Get all auction reports error:', error)
      return { success: false, error: error.message }
    }
  }

  // New method to get auction summary with data availability
  static async getAuctionSummary(auctionId: string) {
    try {
      const auctionResult = await this.getAuctionById(auctionId)
      if (!auctionResult.success) {
        return { success: false, error: auctionResult.error }
      }

      const auction = auctionResult.data
      
      return {
        success: true,
        data: {
          id: auction.id,
          catalogue_name: `${auction.catalogue_prefix}${auction.catalogue_number}`,
          auction_date: auction.auction_date,
          status: auction.status,
          // Data availability flags
          has_micron_prices: auction.has_micron_prices || false,
          has_buyer_data: auction.has_buyer_data || false,
          has_broker_data: auction.has_broker_data || false,
          has_provincial_data: auction.has_provincial_data || false,
          has_market_insights: auction.has_market_insights || false,
          // Data counts
          micron_prices_count: auction.micron_prices_count || 0,
          buyer_performance_count: auction.buyer_performance_count || 0,
          broker_performance_count: auction.broker_performance_count || 0,
          top_performers_count: auction.top_performers_count || 0
        }
      }
    } catch (error) {
      console.error('Get auction summary error:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteAuctionReport(id: string) {
    // Use the same CASCADE deletion logic as deleteAuction
    return this.deleteAuction(id);
  }

  // Buyers CRUD methods
  static async getAllBuyers() {
    try {
      const { data, error } = await supabaseClient
        .from('buyers')
        .select('*')
        .order('buyer_name', { ascending: true })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error fetching buyers:', error)
      return { success: false, error: error.message, data: [] }
    }
  }

  static async createBuyer(data: BuyerInsert) {
    try {
      const { data: result, error } = await supabaseClient
        .from('buyers')
        .insert(data)
        .select()
        .single()

      if (error) throw error

      return { success: true, data: result }
    } catch (error) {
      console.error('Error creating buyer:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateBuyer(id: string, data: Partial<BuyerInsert>) {
    try {
      const { data: result, error } = await supabaseClient
        .from('buyers')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { success: true, data: result }
    } catch (error) {
      console.error('Error updating buyer:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteBuyer(id: string) {
    try {
      const { error } = await supabaseClient
        .from('buyers')
        .delete()
        .eq('id', id)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error deleting buyer:', error)
      return { success: false, error: error.message }
    }
  }

  // Brokers CRUD methods
  static async getAllBrokers() {
    try {
      const { data, error } = await supabaseClient
        .from('brokers')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error fetching brokers:', error)
      return { success: false, error: error.message, data: [] }
    }
  }

  static async getAllCommodityTypes() {
    try {
      const { data, error } = await supabaseClient
        .from('commodity_types')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error fetching commodity types:', error)
      return { success: false, error: error.message, data: [] }
    }
  }

  static async createBroker(data: BrokerInsert) {
    try {
      const { data: result, error } = await supabaseClient
        .from('brokers')
        .insert(data)
        .select()
        .single()

      if (error) throw error

      return { success: true, data: result }
    } catch (error) {
      console.error('Error creating broker:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateBroker(id: string, data: Partial<BrokerInsert>) {
    try {
      const { data: result, error } = await supabaseClient
        .from('brokers')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { success: true, data: result }
    } catch (error) {
      console.error('Error updating broker:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteBroker(id: string) {
    try {
      const { error } = await supabaseClient
        .from('brokers')
        .delete()
        .eq('id', id)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error deleting broker:', error)
      return { success: false, error: error.message }
    }
  }

  // Alias methods for compatibility
  static async getAllSeasons() {
    return this.getSeasons()
  }

  static async updateAuctionReport(auctionId: string, formData: Omit<AuctionReport, 'top_sales'>) {
    try {
      // Get current user from Supabase auth
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      
      let userId = 'd5b02abc-4695-499d-bf04-0f553fdcf7c8'; // Default fallback admin user ID
      
      if (!authError && user) {
        // Verify the user exists in our users table
        const { data: dbUser, error: userError } = await supabaseClient
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (!userError && dbUser) {
          userId = dbUser.id;
          console.log('✅ Using authenticated user ID:', userId);
        } else {
          console.log('⚠️ User not found in users table, using fallback admin ID');
        }
      } else {
        console.log('⚠️ No authenticated user, using fallback admin ID');
      }

      // Load provinces and certifications data for lookups
      const [provincesResult, certificationsResult] = await Promise.all([
        this.getProvinces(),
        this.getCertifications()
      ]);

      const provinces = provincesResult.success ? provincesResult.data : [];
      const certifications = certificationsResult.success ? certificationsResult.data : [];

      // Extract catalogue prefix and number from combined field
      const catalogueParts = this.extractCatalogueParts(formData.auction.catalogue_name);

      // Update auction data - handle null/undefined values properly
      const auctionData: AuctionUpdate = {
        season_id: formData.auction.season_id && formData.auction.season_id !== '' ? formData.auction.season_id : null,
        auction_date: formData.auction.auction_date,
        catalogue_prefix: catalogueParts.prefix,
        catalogue_number: catalogueParts.number,
        commodity_type_id: formData.auction.commodity_type_id && formData.auction.commodity_type_id !== '' ? formData.auction.commodity_type_id : null,
        week_start: formData.auction.week_start,
        week_end: formData.auction.week_end,
        status: formData.status || 'draft',
        supply_statistics_bales_offered: formData.supply_stats?.offered_bales,
        supply_statistics_sold_bales: formData.supply_stats?.sold_bales,
        supply_statistics_clearance_rate: formData.supply_stats?.clearance_rate_pct,
        highest_price_price_cents_clean: formData.highest_price?.price_cents_clean,
        highest_price_micron: formData.highest_price?.micron,
        highest_price_bales: formData.highest_price?.bales,
        certified_offered_bales: formData.certified_share?.offered_bales,
        certified_sold_bales: formData.certified_share?.sold_bales,
        certified_all_wool_pct_offered: formData.certified_share?.all_wool_pct_offered,
        certified_all_wool_pct_sold: formData.certified_share?.all_wool_pct_sold,
        certified_merino_pct_offered: formData.certified_share?.merino_pct_offered,
        certified_merino_pct_sold: formData.certified_share?.merino_pct_sold,
        greasy_statistics_turnover: formData.greasy_stats?.turnover_rand,
        greasy_statistics_bales: formData.greasy_stats?.bales,
        greasy_statistics_mass: formData.greasy_stats?.mass_kg,
        all_merino_sa_c_kg_clean: formData.market_indices?.merino_indicator_sa_cents_clean,
        all_merino_euro_c_kg_clean: formData.market_indices?.merino_indicator_euro_cents_clean,
        all_merino_us_c_kg_clean: formData.market_indices?.merino_indicator_us_cents_clean,
        certified_sa_c_kg_clean: formData.market_indices?.certified_indicator_sa_cents_clean,
        certified_us_c_kg_clean: formData.market_indices?.certified_indicator_us_cents_clean,
        certified_euro_c_kg_clean: formData.market_indices?.certified_indicator_euro_cents_clean,
        exchange_rates_zar_usd: formData.currency_fx?.ZAR_USD,
        exchange_rates_zar_eur: formData.currency_fx?.ZAR_EUR,
        exchange_rates_zar_jpy: formData.currency_fx?.ZAR_JPY,
        exchange_rates_zar_gbp: formData.currency_fx?.ZAR_GBP,
        exchange_rates_usd_aud: formData.currency_fx?.USD_AUD,
        exchange_rates_sa_c_kg_clean_awex_emi: formData.market_indices?.awex_emi_sa_cents_clean
      }

      const auctionResult = await this.updateAuction(auctionId, auctionData)
      if (!auctionResult.success) throw new Error(auctionResult.error)

      // Update micron prices from micron_price_comparison
      if (formData.micron_price_comparison?.rows && formData.micron_price_comparison.rows.length > 0) {
        const micronPricesData: MicronPriceInsert[] = formData.micron_price_comparison.rows
          .filter(row => row.non_cert_clean_zar_per_kg !== null || row.cert_clean_zar_per_kg !== null)
          .map(row => ({
            auction_id: auctionId,
            micron: row.micron,
            non_cert_clean_zar_per_kg: row.non_cert_clean_zar_per_kg,
            cert_clean_zar_per_kg: row.cert_clean_zar_per_kg,
            pct_difference: row.pct_difference,
            created_by: userId
          }));

        await this.updateMicronPrices(auctionId, micronPricesData);
      } else {
        // If no micron prices, delete existing ones
        await this.deleteMicronPricesByAuction(auctionId);
      }

      // Update market insights
      if (formData.insights && formData.insights.trim().length > 0) {
        const insightData: MarketInsightInsert = {
          auction_id: auctionId,
          market_insights_text: formData.insights,
          created_by: userId
        };

        // Check if market insight already exists
        const existingInsight = await this.getMarketInsightByAuction(auctionId);
        if (existingInsight.success && existingInsight.data) {
          // Update existing insight
          await this.updateMarketInsight(auctionId, insightData);
        } else {
          // Create new insight
          await this.createMarketInsight(insightData);
        }
      } else {
        // If no insights, delete existing ones
        await this.deleteMarketInsightByAuction(auctionId);
      }

      // Update buyer performance
      if (formData.buyers && formData.buyers.length > 0) {
        const buyerPerformanceData: BuyerPerformanceInsert[] = formData.buyers.map(buyer => ({
          auction_id: auctionId,
          buyer: buyer.buyer, // This will be mapped to buyer_id in createBuyerPerformance
          share_pct: buyer.share_pct,
          cat: buyer.cat,
          bales_ytd: buyer.bales_ytd || 0,
          created_by: userId
        }));

        await this.updateBuyerPerformance(auctionId, buyerPerformanceData);
      } else {
        // If no buyers, delete existing ones
        await this.deleteBuyerPerformanceByAuction(auctionId);
      }

      // Update broker performance
      if (formData.brokers && formData.brokers.length > 0) {
        const brokerPerformanceData: BrokerPerformanceInsert[] = formData.brokers.map(broker => ({
          auction_id: auctionId,
          name: broker.name, // This will be mapped to broker_id in createBrokerPerformance
          catalogue_offering: broker.catalogue_offering,
          withdrawn_before_sale: broker.withdrawn_before_sale || 0,
          wool_offered: broker.wool_offered || broker.catalogue_offering,
          withdrawn_during_sale: broker.withdrawn_during_sale || 0,
          passed: broker.passed || 0,
          not_sold: broker.not_sold || 0,
          sold: broker.sold || broker.catalogue_offering,
          sold_pct: broker.sold_pct || 100,
          sold_ytd: broker.sold_ytd || 0,
          created_by: userId
        }));

        await this.updateBrokerPerformance(auctionId, brokerPerformanceData);
      } else {
        // If no brokers, delete existing ones
        await this.deleteBrokerPerformanceByAuction(auctionId);
      }

      // Update top performers (provincial data)
      if (formData.provincial_producers && formData.provincial_producers.length > 0) {
        const performersData: TopPerformerInsert[] = []

        for (const province of formData.provincial_producers) {
          for (const producer of province.producers) {
            // Find province ID by name if not provided
            let provinceId = province.province_id
            if (!provinceId || provinceId === '') {
              const provinceRecord = provinces.find(p => p.name === province.province)
              provinceId = provinceRecord?.id || null
            }

            // Find certification ID by code
            let certificationId = null
            if (producer.certified === 'RWS') {
              const rwsCert = certifications.find(c => c.code === 'RWS')
              certificationId = rwsCert?.id || null
            }

            performersData.push({
              auction_id: auctionId,
              province_id: provinceId,
              position: producer.position,
              name: producer.name,
              district: producer.district || '',
              producer_number: producer.producer_number || '',
              no_bales: producer.no_bales || 0,
              description: producer.description || '',
              micron: producer.micron || 0,
              price: producer.price,
              certification_id: certificationId,
              buyer_name: producer.buyer_name,
              created_by: userId
            })
          }
        }

        await this.updateTopPerformers(auctionId, performersData);
      } else {
        // If no provincial producers, delete existing ones
        await this.deleteTopPerformersByAuction(auctionId);
      }

      return { success: true, data: { id: auctionId } }
    } catch (error) {
      console.error('Update auction report error:', error)
      return { success: false, error: error.message }
    }
  }
}

export default SupabaseAuctionDataService
