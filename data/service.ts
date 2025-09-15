// Data service layer - provides clean API for the application
// This abstracts the storage implementation and provides business logic

import { storage } from './storage';
import { transformFormToDatabase, transformDatabaseToForm } from './transformers';
import type { AuctionReport } from '../types';
import type { CompleteAuctionData, Sale } from './models';

export class AuctionDataService {
  // Save auction report from form data
  static async saveAuctionReport(formData: Omit<AuctionReport, 'top_sales'>): Promise<Sale> {
    try {
      // Transform form data to database structure
      const dbData = transformFormToDatabase(formData);
      
      // Save to storage
      const sale = storage.completeAuction.save(dbData);
      
      console.log('Auction report saved successfully:', sale);
      return sale;
    } catch (error) {
      console.error('Error saving auction report:', error);
      throw new Error('Failed to save auction report');
    }
  }

  // Save auction report as draft
  static async saveAuctionReportDraft(formData: Omit<AuctionReport, 'top_sales'>): Promise<Sale> {
    try {
      // Transform form data to database structure
      const dbData = transformFormToDatabase(formData);
      
      // Mark as draft
      dbData.sale.is_draft = true;
      
      // Save to storage
      const sale = storage.completeAuction.save(dbData);
      
      console.log('Auction report draft saved successfully:', sale);
      return sale;
    } catch (error) {
      console.error('Error saving auction report draft:', error);
      throw new Error('Failed to save auction report draft');
    }
  }

  // Get auction report by ID
  static async getAuctionReport(saleId: string): Promise<Omit<AuctionReport, 'top_sales'> | null> {
    try {
      const dbData = storage.completeAuction.getBySaleId(saleId);
      if (!dbData) return null;
      
      // Transform database structure back to form data
      const formData = transformDatabaseToForm(dbData);
      return formData;
    } catch (error) {
      console.error('Error getting auction report:', error);
      throw new Error('Failed to get auction report');
    }
  }

  // Get all auction reports
  static async getAllAuctionReports(): Promise<Sale[]> {
    try {
      return storage.completeAuction.getAllSales();
    } catch (error) {
      console.error('Error getting all auction reports:', error);
      throw new Error('Failed to get auction reports');
    }
  }

  // Update auction report
  static async updateAuctionReport(saleId: string, formData: Omit<AuctionReport, 'top_sales'>): Promise<Sale> {
    try {
      // Transform form data to database structure
      const dbData = transformFormToDatabase(formData);
      
      // Update the sale ID in the data
      dbData.sale.id = saleId;
      dbData.indicators.forEach(ind => ind.sale_id = saleId);
      dbData.exchange_rates.forEach(rate => rate.sale_id = saleId);
      dbData.buyer_purchases.forEach(purchase => purchase.sale_id = saleId);
      dbData.offering_analysis.forEach(analysis => analysis.sale_id = saleId);
      dbData.average_prices_clean.forEach(price => price.sale_id = saleId);
      
      // Save to storage (this will replace existing data)
      const sale = storage.completeAuction.save(dbData);
      
      console.log('Auction report updated successfully:', sale);
      return sale;
    } catch (error) {
      console.error('Error updating auction report:', error);
      throw new Error('Failed to update auction report');
    }
  }

  // Delete auction report
  static async deleteAuctionReport(saleId: string): Promise<boolean> {
    try {
      const success = storage.completeAuction.deleteBySaleId(saleId);
      console.log('Auction report deleted successfully:', saleId);
      return success;
    } catch (error) {
      console.error('Error deleting auction report:', error);
      throw new Error('Failed to delete auction report');
    }
  }

  // Get auction report by season and catalogue number
  static async getAuctionReportBySeasonAndCatalogue(season: string, catalogueNo: number): Promise<Omit<AuctionReport, 'top_sales'> | null> {
    try {
      const sale = storage.sales.getBySeasonAndCatalogue(season, catalogueNo);
      if (!sale) return null;
      
      return this.getAuctionReport(sale.id);
    } catch (error) {
      console.error('Error getting auction report by season and catalogue:', error);
      throw new Error('Failed to get auction report');
    }
  }

  // Get latest auction report
  static async getLatestAuctionReport(): Promise<Omit<AuctionReport, 'top_sales'> | null> {
    try {
      // First check for test data
      const testData = localStorage.getItem('test_previous_auction');
      if (testData) {
        return JSON.parse(testData);
      }
      
      const sales = storage.completeAuction.getAllSales();
      if (sales.length === 0) return null;
      
      // Sort by sale date descending and get the latest
      const latestSale = sales.sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())[0];
      
      return this.getAuctionReport(latestSale.id);
    } catch (error) {
      console.error('Error getting latest auction report:', error);
      throw new Error('Failed to get latest auction report');
    }
  }

  // Add simple test data directly to localStorage for quick testing
  static async addSimpleTestData(): Promise<Omit<AuctionReport, 'top_sales'>> {
    try {
      const previousDate = new Date();
      previousDate.setDate(previousDate.getDate() - 7);
      
      // Create a mock previous auction report directly
      const mockPreviousReport: Omit<AuctionReport, 'top_sales'> = {
        auction: {
          commodity: 'wool',
          season_label: "2024-25",
          week_id: "202425-01",
          week_start: previousDate.toISOString().split('T')[0],
          week_end: previousDate.toISOString().split('T')[0],
          auction_date: previousDate.toISOString().split('T')[0],
          catalogue_name: "Cape Wools SA Catalogue 37",
          sale_number: "37",
          auction_center: "Port Elizabeth"
        },
        market_indices: {
          merino_indicator_cents_clean: 17504,
          certified_indicator_cents_clean: 18250,
          change_merino_pct: -2.3,
          change_certified_pct: 1.8,
          awex_emi_cents_clean: 1247
        },
        currency_fx: {
          ZAR_USD: 17.6500,
          ZAR_EUR: 19.2400,
          ZAR_JPY: 0.1180,
          ZAR_GBP: 22.1500,
          USD_AUD: 1.5420
        },
        supply_stats: {
          offered_bales: 9196,
          sold_bales: 8568,
          clearance_rate_pct: 93.17
        },
        highest_price: {
          price_cents_clean: 22798,
          micron: 16.5,
          bales: 2
        },
        certified_share: {
          merino_pct_offered: 15.2,
          merino_pct_sold: 16.8
        },
        greasy_stats: {
          turnover_rand: 45680000,
          bales: 8568,
          mass_kg: 1892340
        },
        micron_prices: [
          { bucket_micron: '15.0', category: 'Fine', price_clean_zar_per_kg: 284.50 },
          { bucket_micron: '16.0', category: 'Fine', price_clean_zar_per_kg: 268.75 },
          { bucket_micron: '17.0', category: 'Fine', price_clean_zar_per_kg: 245.80 },
          { bucket_micron: '17.5', category: 'Fine', price_clean_zar_per_kg: 235.20 },
          { bucket_micron: '18.0', category: 'Fine', price_clean_zar_per_kg: 224.90 },
          { bucket_micron: '18.5', category: 'Medium', price_clean_zar_per_kg: 218.45 },
          { bucket_micron: '19.0', category: 'Medium', price_clean_zar_per_kg: 205.30 },
          { bucket_micron: '19.5', category: 'Medium', price_clean_zar_per_kg: 192.75 },
          { bucket_micron: '20.0', category: 'Medium', price_clean_zar_per_kg: 185.60 },
          { bucket_micron: '20.5', category: 'Strong', price_clean_zar_per_kg: 175.40 },
          { bucket_micron: '21.0', category: 'Strong', price_clean_zar_per_kg: 168.20 },
          { bucket_micron: '21.5', category: 'Strong', price_clean_zar_per_kg: 162.85 },
          { bucket_micron: '22.0', category: 'Strong', price_clean_zar_per_kg: 158.30 }
        ],
        micron_price_comparison: { rows: [] },
        buyers: [
          { buyer: "Standard Wool Co", cat: 1250, share_pct: 14.6 },
          { buyer: "Premium Textiles", cat: 980, share_pct: 11.4 }
        ],
        brokers: [
          { name: "Cape Wools SA", catalogue_offering: 4500 }
        ],
        currencies: [],
        provincial_producers: [],
        indicators: [],
        benchmarks: [],
        trends: { rws: [], non_rws: [] },
        yearly_average_prices: [],
        province_avg_prices: [],
        insights: "Previous auction with strong fine wool demand."
      };

      // Store it directly in localStorage with a simple key for quick retrieval
      localStorage.setItem('test_previous_auction', JSON.stringify(mockPreviousReport));
      
      console.log('✅ Simple test data added successfully!');
      console.log('📊 Previous values will now appear when you create a new auction');
      
      return mockPreviousReport;
    } catch (error) {
      console.error('Error adding simple test data:', error);
      throw new Error('Failed to add simple test data');
    }
  }

  // Add dummy test data for testing previous value comparisons
  static async addTestData(): Promise<void> {
    try {
      const previousDate = new Date();
      previousDate.setDate(previousDate.getDate() - 7);
      
      const testData: Omit<AuctionReport, 'top_sales'> = {
        auction: {
          commodity: 'wool',
          season_label: "2024-25",
          week_id: "202425-01",
          week_start: previousDate.toISOString().split('T')[0],
          week_end: previousDate.toISOString().split('T')[0],
          auction_date: previousDate.toISOString().split('T')[0],
          catalogue_name: "Cape Wools SA Catalogue 37",
          sale_number: "37",
          auction_center: "Port Elizabeth"
        },
        market_indices: {
          merino_indicator_cents_clean: 17504,
          certified_indicator_cents_clean: 18250,
          change_merino_pct: -2.3,
          change_certified_pct: 1.8,
          awex_emi_cents_clean: 1247
        },
        currency_fx: {
          ZAR_USD: 17.6500,
          ZAR_EUR: 19.2400,
          ZAR_JPY: 0.1180,
          ZAR_GBP: 22.1500,
          USD_AUD: 1.5420
        },
        supply_stats: {
          offered_bales: 9196,
          sold_bales: 8568,
          clearance_rate_pct: 93.17
        },
        highest_price: {
          price_cents_clean: 22798,
          micron: 16.5,
          bales: 2
        },
        certified_share: {
          merino_pct_offered: 15.2,
          merino_pct_sold: 16.8
        },
        greasy_stats: {
          turnover_rand: 45680000,
          bales: 8568,
          mass_kg: 1892340
        },
        micron_prices: [
          { bucket_micron: '15.0', category: 'Fine', price_clean_zar_per_kg: 284.50 },
          { bucket_micron: '16.0', category: 'Fine', price_clean_zar_per_kg: 268.75 },
          { bucket_micron: '17.0', category: 'Fine', price_clean_zar_per_kg: 245.80 },
          { bucket_micron: '17.5', category: 'Fine', price_clean_zar_per_kg: 235.20 },
          { bucket_micron: '18.0', category: 'Fine', price_clean_zar_per_kg: 224.90 },
          { bucket_micron: '18.5', category: 'Medium', price_clean_zar_per_kg: 218.45 },
          { bucket_micron: '19.0', category: 'Medium', price_clean_zar_per_kg: 205.30 },
          { bucket_micron: '19.5', category: 'Medium', price_clean_zar_per_kg: 192.75 },
          { bucket_micron: '20.0', category: 'Medium', price_clean_zar_per_kg: 185.60 },
          { bucket_micron: '20.5', category: 'Strong', price_clean_zar_per_kg: 175.40 },
          { bucket_micron: '21.0', category: 'Strong', price_clean_zar_per_kg: 168.20 },
          { bucket_micron: '21.5', category: 'Strong', price_clean_zar_per_kg: 162.85 },
          { bucket_micron: '22.0', category: 'Strong', price_clean_zar_per_kg: 158.30 }
        ],
        micron_price_comparison: {
          rows: []
        },
        buyers: [
          { buyer: "Standard Wool Co", cat: 1250, share_pct: 14.6 },
          { buyer: "Premium Textiles", cat: 980, share_pct: 11.4 },
          { buyer: "Global Fibers Ltd", cat: 876, share_pct: 10.2 },
          { buyer: "Elite Wool Trading", cat: 745, share_pct: 8.7 },
          { buyer: "African Wool Exchange", cat: 623, share_pct: 7.3 }
        ],
        brokers: [
          { name: "Cape Wools SA", catalogue_offering: 4500 },
          { name: "Wool Brokers Union", catalogue_offering: 2800 },
          { name: "Premier Wool Marketing", catalogue_offering: 1896 }
        ],
        currencies: [
          { code: 'USD', value: 17.65, change: -0.15 },
          { code: 'EUR', value: 19.24, change: 0.32 },
          { code: 'AUD', value: 11.45, change: -0.08 }
        ],
        provincial_producers: [
          {
            province: "Western Cape",
            producers: [
              { 
                name: "Karoo Farms", 
                producer_no: "WC001", 
                lot_no: "K245", 
                no_bales: 45, 
                description: "AAA Merino", 
                micron: 18.5, 
                price: 22798, 
                certified: "RWS",
                district: "Beaufort West"
              },
              {
                name: "Mountain View Ranch",
                producer_no: "WC002", 
                lot_no: "M156",
                no_bales: 38,
                description: "Fine Merino",
                micron: 17.0,
                price: 24500,
                certified: "Standard",
                district: "Caledon"
              }
            ]
          },
          {
            province: "Eastern Cape",
            producers: [
              {
                name: "Valley Wool Farm",
                producer_no: "EC001",
                lot_no: "V789",
                no_bales: 52,
                description: "Premium Merino",
                micron: 16.5,
                price: 26800,
                certified: "RWS", 
                district: "Graaff-Reinet"
              }
            ]
          }
        ],
        indicators: [],
        benchmarks: [],
        trends: { rws: [], non_rws: [] },
        yearly_average_prices: [],
        province_avg_prices: [],
        insights: "Market showed strong demand for fine micron wool. RWS certified wool commanded premium prices across all provinces."
      };

      await this.saveAuctionReport(testData);
      console.log('✅ Test auction data added successfully!');
      console.log('📊 Previous values will now appear when you create a new auction');
    } catch (error) {
      console.error('Error adding test data:', error);
      throw new Error('Failed to add test data');
    }
  }

  // Get auction reports by date range
  static async getAuctionReportsByDateRange(startDate: string, endDate: string): Promise<Sale[]> {
    try {
      const sales = storage.completeAuction.getAllSales();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return sales.filter(sale => {
        const saleDate = new Date(sale.sale_date);
        return saleDate >= start && saleDate <= end;
      });
    } catch (error) {
      console.error('Error getting auction reports by date range:', error);
      throw new Error('Failed to get auction reports by date range');
    }
  }

  // Get auction statistics
  static async getAuctionStatistics(): Promise<{
    totalAuctions: number;
    totalBales: number;
    totalValue: number;
    averageClearance: number;
    latestAuctionDate: string | null;
  }> {
    try {
      const sales = storage.completeAuction.getAllSales();
      
      const totalAuctions = sales.length;
      const totalBales = sales.reduce((sum, sale) => sum + (sale.total_bales_sold || 0), 0);
      const totalValue = sales.reduce((sum, sale) => {
        // This would need to be calculated from indicators or other data
        return sum;
      }, 0);
      const averageClearance = sales.length > 0 
        ? sales.reduce((sum, sale) => sum + (sale.clearance_pct || 0), 0) / sales.length 
        : 0;
      const latestAuctionDate = sales.length > 0 
        ? sales.sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())[0].sale_date
        : null;
      
      return {
        totalAuctions,
        totalBales,
        totalValue,
        averageClearance,
        latestAuctionDate
      };
    } catch (error) {
      console.error('Error getting auction statistics:', error);
      throw new Error('Failed to get auction statistics');
    }
  }

  // Export all data (for backup or migration)
  static async exportAllData(): Promise<CompleteAuctionData[]> {
    try {
      const sales = storage.completeAuction.getAllSales();
      const allData: CompleteAuctionData[] = [];
      
      for (const sale of sales) {
        const data = storage.completeAuction.getBySaleId(sale.id);
        if (data) {
          allData.push(data);
        }
      }
      
      return allData;
    } catch (error) {
      console.error('Error exporting all data:', error);
      throw new Error('Failed to export data');
    }
  }

  // Import data (for migration or restore)
  static async importData(data: CompleteAuctionData[]): Promise<void> {
    try {
      for (const auctionData of data) {
        storage.completeAuction.save(auctionData);
      }
      
      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }

  // Clear all data (for testing or reset)
  static async clearAllData(): Promise<void> {
    try {
      // Clear all storage
      const sales = storage.completeAuction.getAllSales();
      for (const sale of sales) {
        storage.completeAuction.deleteBySaleId(sale.id);
      }
      
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear data');
    }
  }
}

// Export the service as default
export default AuctionDataService;
