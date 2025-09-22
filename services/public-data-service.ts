// Public Data Service for fetching published auction data
import { SupabaseAuctionDataService } from '../data/supabase-service';
import type { AuctionReport } from '../types';

export class PublicDataService {
  /**
   * Get all published auction reports for the public site
   */
  static async getPublishedReports(): Promise<{ success: boolean; data?: AuctionReport[]; error?: string }> {
    try {
      console.log('🔍 Fetching published auction reports...');
      
      // Get all published auctions from the database
      const auctionsResult = await SupabaseAuctionDataService.getAuctions();
      
      if (!auctionsResult.success) {
        return { success: false, error: auctionsResult.error };
      }

      // Filter only published auctions
      const publishedAuctions = auctionsResult.data.filter(auction => auction.status === 'published');
      
      if (publishedAuctions.length === 0) {
        console.log('📭 No published auctions found');
        return { success: true, data: [] };
      }

      console.log(`📊 Found ${publishedAuctions.length} published auctions`);

      // Convert each published auction to a complete report
      const reports: AuctionReport[] = [];
      
      for (const auction of publishedAuctions) {
        try {
          const reportResult = await SupabaseAuctionDataService.getCompleteAuctionReport(auction.id);
          
          if (reportResult.success && reportResult.data) {
            // Ensure the report has the correct status and published timestamp
            const report = {
              ...reportResult.data,
              status: 'published' as const,
              published_at: auction.published_at || auction.updated_at
            };
            reports.push(report);
          } else {
            console.warn(`⚠️ Failed to load complete data for auction ${auction.id}:`, reportResult.error);
          }
        } catch (error) {
          console.error(`❌ Error loading report for auction ${auction.id}:`, error);
        }
      }

      // Sort reports by published date (newest first)
      reports.sort((a, b) => {
        const dateA = new Date(a.published_at || a.auction.auction_date);
        const dateB = new Date(b.published_at || b.auction.auction_date);
        return dateB.getTime() - dateA.getTime();
      });

      console.log(`✅ Successfully loaded ${reports.length} published reports`);
      return { success: true, data: reports };

    } catch (error) {
      console.error('❌ Error fetching published reports:', error);
      return { success: false, error: error.message };
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
}

export default PublicDataService;
