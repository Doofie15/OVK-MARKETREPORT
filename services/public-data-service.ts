// Public Data Service for fetching published auction data
import { SupabaseAuctionDataService } from '../data/supabase-service';
import type { AuctionReport } from '../types';

// Simple in-memory cache for performance optimization
class DataCache {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  static set(key: string, data: any, ttlMinutes: number = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    });
  }
  
  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }
  
  static clear(): void {
    this.cache.clear();
  }
}

export class PublicDataService {
  /**
   * Get all published auction reports for the public site - OPTIMIZED VERSION
   */
  static async getPublishedReports(): Promise<{ success: boolean; data?: AuctionReport[]; error?: string }> {
    try {
      // OPTIMIZATION 1: Check cache first
      const cacheKey = 'published_reports';
      const cachedReports = DataCache.get<AuctionReport[]>(cacheKey);
      if (cachedReports) {
        console.log('🚀 Returning cached published reports');
        return { success: true, data: cachedReports };
      }

      console.log('🚀 Fetching published auction reports (optimized)...');
      
      // Get all published auctions from the database
      const auctionsResult = await SupabaseAuctionDataService.getAuctions();
      
      if (!auctionsResult.success) {
        return { success: false, error: auctionsResult.error };
      }

      // Filter only published auctions
      const publishedAuctions = (auctionsResult.data as any[]).filter((auction: any) => auction.status === 'published');
      
      if (publishedAuctions.length === 0) {
        console.log('📭 No published auctions found');
        return { success: true, data: [] };
      }

      console.log(`📊 Found ${publishedAuctions.length} published auctions`);

      // OPTIMIZATION 2: Load all reports in parallel instead of sequentially
      console.log('⚡ Loading reports in parallel...');
      const reportPromises = publishedAuctions.map(async (auction: any) => {
        try {
          const reportResult = await SupabaseAuctionDataService.getCompleteAuctionReport(auction.id);
          
          if (reportResult.success && reportResult.data) {
            return {
              ...reportResult.data,
              status: 'published' as const,
              published_at: auction.published_at || auction.updated_at
            };
          } else {
            console.warn(`⚠️ Failed to load complete data for auction ${auction.id}:`, reportResult.error);
            return null;
          }
        } catch (error) {
          console.error(`❌ Error loading report for auction ${auction.id}:`, error);
          return null;
        }
      });

      // Wait for all reports to load in parallel
      const reportResults = await Promise.allSettled(reportPromises);
      
      // Filter out failed loads and extract successful reports
      const reports: AuctionReport[] = reportResults
        .filter((result: any): result is PromiseFulfilledResult<AuctionReport> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map((result: any) => result.value);

      // Sort reports by published date (newest first)
      reports.sort((a, b) => {
        const dateA = new Date(a.published_at || a.auction.auction_date);
        const dateB = new Date(b.published_at || b.auction.auction_date);
        return dateB.getTime() - dateA.getTime();
      });

      // OPTIMIZATION 3: Cache the results for 5 minutes
      DataCache.set(cacheKey, reports, 5);

      console.log(`✅ Successfully loaded ${reports.length} published reports (parallel + cached)`);
      return { success: true, data: reports };

    } catch (error) {
      console.error('❌ Error fetching published reports:', error);
      return { success: false, error: (error as any).message };
    }
  }

  /**
   * Get a specific published auction report by week ID
   */
  static async getPublishedReportByWeekId(weekId: string): Promise<{ success: boolean; data?: AuctionReport; error?: string }> {
    try {
      console.log(`🔍 Fetching published report for week ID: ${weekId}`);
      
      const reportsResult = await this.getPublishedReports();
      
      if (!reportsResult.success) {
        return { success: false, error: reportsResult.error };
      }

      const report = reportsResult.data?.find(r => r.auction.week_id === weekId);
      
      if (!report) {
        return { success: false, error: `No published report found for week ID: ${weekId}` };
      }

      return { success: true, data: report };

    } catch (error) {
      console.error('❌ Error fetching report by week ID:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get the latest published auction report
   */
  static async getLatestPublishedReport(): Promise<{ success: boolean; data?: AuctionReport; error?: string }> {
    try {
      console.log('🔍 Fetching latest published report...');
      
      const reportsResult = await this.getPublishedReports();
      
      if (!reportsResult.success) {
        return { success: false, error: reportsResult.error };
      }

      if (!reportsResult.data || reportsResult.data.length === 0) {
        return { success: false, error: 'No published reports available' };
      }

      // The reports are already sorted by published date (newest first)
      const latestReport = reportsResult.data[0];
      
      return { success: true, data: latestReport };

    } catch (error) {
      console.error('❌ Error fetching latest published report:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get published reports for a specific season
   */
  static async getPublishedReportsBySeason(seasonLabel: string): Promise<{ success: boolean; data?: AuctionReport[]; error?: string }> {
    try {
      console.log(`🔍 Fetching published reports for season: ${seasonLabel}`);
      
      const reportsResult = await this.getPublishedReports();
      
      if (!reportsResult.success) {
        return { success: false, error: reportsResult.error };
      }

      const seasonReports = reportsResult.data?.filter(r => r.auction.season_label === seasonLabel) || [];
      
      return { success: true, data: seasonReports };

    } catch (error) {
      console.error('❌ Error fetching reports by season:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get available auction weeks for the dropdown selector
   */
  static async getAvailableAuctionWeeks(): Promise<{ success: boolean; data?: Array<{ id: string; label: string; date: string }>; error?: string }> {
    try {
      console.log('🔍 Fetching available auction weeks...');
      
      const reportsResult = await this.getPublishedReports();
      
      if (!reportsResult.success) {
        return { success: false, error: reportsResult.error };
      }

      const weeks = reportsResult.data?.map(report => ({
        id: report.auction.week_id,
        label: `${report.auction.catalogue_name} (${new Date(report.auction.auction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`,
        date: report.auction.auction_date
      })) || [];

      return { success: true, data: weeks };

    } catch (error) {
      console.error('❌ Error fetching available weeks:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if there are any published reports available
   */
  static async hasPublishedReports(): Promise<boolean> {
    try {
      const result = await this.getPublishedReports();
      return result.success && (result.data?.length || 0) > 0;
    } catch (error) {
      console.error('❌ Error checking for published reports:', error);
      return false;
    }
  }

  /**
   * PROGRESSIVE LOADING: Get latest report first, then load others in background
   */
  static async getPublishedReportsProgressive(): Promise<{
    success: boolean;
    latestReport?: AuctionReport;
    allReportsPromise?: Promise<{ success: boolean; data?: AuctionReport[]; error?: string }>;
    error?: string;
  }> {
    try {
      console.log('🚀 Starting progressive loading - latest report first...');

      // Check cache first for complete data
      const cacheKey = 'published_reports';
      const cachedReports = DataCache.get<AuctionReport[]>(cacheKey);
      if (cachedReports && cachedReports.length > 0) {
        console.log('⚡ Returning cached reports (all data available)');
        return {
          success: true,
          latestReport: cachedReports[0], // Already sorted newest first
          allReportsPromise: Promise.resolve({ success: true, data: cachedReports })
        };
      }

      // Get all published auctions
      const auctionsResult = await SupabaseAuctionDataService.getAuctions();
      
      if (!auctionsResult.success) {
        return { success: false, error: auctionsResult.error };
      }

      const publishedAuctions = (auctionsResult.data as any[])
        .filter((auction: any) => auction.status === 'published')
        .sort((a: any, b: any) => {
          // Sort by auction date (newest first)
          const dateA = new Date(a.auction_date || a.updated_at);
          const dateB = new Date(b.auction_date || b.updated_at);
          return dateB.getTime() - dateA.getTime();
        });

      if (publishedAuctions.length === 0) {
        console.log('📭 No published auctions found');
        return { success: true, latestReport: undefined };
      }

      console.log(`📊 Found ${publishedAuctions.length} published auctions`);

      // STEP 1: Load ONLY the latest report immediately
      const latestAuction = publishedAuctions[0];
      console.log('⚡ Loading latest report first:', latestAuction.id);
      
      const latestReportResult = await SupabaseAuctionDataService.getCompleteAuctionReport(latestAuction.id);
      
      if (!latestReportResult.success || !latestReportResult.data) {
        return { success: false, error: `Failed to load latest report: ${latestReportResult.error}` };
      }

      const latestReport: AuctionReport = {
        ...latestReportResult.data,
        status: 'published' as const,
        published_at: latestAuction.published_at || latestAuction.updated_at
      };

      // STEP 2: Start loading remaining reports in background (don't await)
      const allReportsPromise = this.loadRemainingReportsInBackground(publishedAuctions, latestReport);

      console.log('✅ Latest report loaded, background loading started');
      
      return {
        success: true,
        latestReport,
        allReportsPromise
      };

    } catch (error) {
      console.error('❌ Error in progressive loading:', error);
      return { success: false, error: (error as any).message };
    }
  }

  /**
   * Load remaining reports in background after latest is shown
   */
  private static async loadRemainingReportsInBackground(
    publishedAuctions: any[],
    latestReport: AuctionReport
  ): Promise<{ success: boolean; data?: AuctionReport[]; error?: string }> {
    try {
      console.log('🔄 Loading remaining reports in background...');

      // Skip the first auction (already loaded)
      const remainingAuctions = publishedAuctions.slice(1);
      
      if (remainingAuctions.length === 0) {
        console.log('✅ Only one report available, caching single report');
        const allReports = [latestReport];
        DataCache.set('published_reports', allReports, 5);
        return { success: true, data: allReports };
      }

      // Load remaining reports in parallel
      const reportPromises = remainingAuctions.map(async (auction: any) => {
        try {
          const reportResult = await SupabaseAuctionDataService.getCompleteAuctionReport(auction.id);
          
          if (reportResult.success && reportResult.data) {
            return {
              ...reportResult.data,
              status: 'published' as const,
              published_at: auction.published_at || auction.updated_at
            };
          }
          return null;
        } catch (error) {
          console.warn(`⚠️ Failed to load background report ${auction.id}:`, error);
          return null;
        }
      });

      const reportResults = await Promise.allSettled(reportPromises);
      
      const additionalReports: AuctionReport[] = reportResults
        .filter((result: any) => result.status === 'fulfilled' && result.value !== null)
        .map((result: any) => result.value);

      // Combine latest + additional reports
      const allReports = [latestReport, ...additionalReports];

      // Sort by published date (newest first)
      allReports.sort((a, b) => {
        const dateA = new Date(a.published_at || a.auction.auction_date);
        const dateB = new Date(b.published_at || b.auction.auction_date);
        return dateB.getTime() - dateA.getTime();
      });

      // Cache complete results
      DataCache.set('published_reports', allReports, 5);

      console.log(`✅ Background loading complete: ${allReports.length} total reports cached`);
      return { success: true, data: allReports };

    } catch (error) {
      console.error('❌ Error in background loading:', error);
      return { success: false, error: (error as any).message };
    }
  }
}

export default PublicDataService;
