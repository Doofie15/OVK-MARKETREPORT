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
