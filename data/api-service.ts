// API service for connecting to the JSON database server
// This replaces the local storage service with HTTP API calls

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }

  const data: ApiResponse<T> = await response.json();
  
  if (!data.success) {
    throw new ApiError(data.error || 'API request failed');
  }

  return data.data as T;
}

// Sales API
export const salesApi = {
  // Get all sales
  getAll: async () => {
    return apiRequest<any[]>('/sales');
  },

  // Get sale by ID
  getById: async (id: string) => {
    return apiRequest<any>(`/sales/${id}`);
  },

  // Create new sale
  create: async (saleData: any) => {
    return apiRequest<any>('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  },

  // Update sale
  update: async (id: string, updates: any) => {
    return apiRequest<any>(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete sale
  delete: async (id: string) => {
    return apiRequest<void>(`/sales/${id}`, {
      method: 'DELETE',
    });
  },

  // Get sale by season and catalogue
  getBySeasonAndCatalogue: async (season: string, catalogueNo: number) => {
    const sales = await salesApi.getAll();
    return sales.find(sale => 
      sale.season === season && sale.catalogue_no === catalogueNo
    );
  },
};

// Complete auction data API
export const auctionsApi = {
  // Get complete auction data
  getById: async (id: string) => {
    return apiRequest<any>(`/auctions/${id}`);
  },

  // Save complete auction data
  save: async (auctionData: any) => {
    return apiRequest<any>('/auctions', {
      method: 'POST',
      body: JSON.stringify(auctionData),
    });
  },

  // Update complete auction data
  update: async (id: string, auctionData: any) => {
    return apiRequest<any>(`/auctions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(auctionData),
    });
  },
};

// Generic table API
export const tableApi = {
  // Get all records from a table
  getAll: async (table: string) => {
    return apiRequest<any[]>(`/tables/${table}`);
  },

  // Get record by ID
  getById: async (table: string, id: string) => {
    return apiRequest<any>(`/tables/${table}/${id}`);
  },

  // Create new record
  create: async (table: string, recordData: any) => {
    return apiRequest<any>(`/tables/${table}`, {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  },

  // Update record
  update: async (table: string, id: string, updates: any) => {
    return apiRequest<any>(`/tables/${table}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete record
  delete: async (table: string, id: string) => {
    return apiRequest<void>(`/tables/${table}/${id}`, {
      method: 'DELETE',
    });
  },

  // Query records by field value
  query: async (table: string, field: string, value: string) => {
    return apiRequest<any[]>(`/tables/${table}/query/${field}/${value}`);
  },

  // Get records by sale ID
  getBySaleId: async (table: string, saleId: string) => {
    return apiRequest<any[]>(`/tables/${table}/sale/${saleId}`);
  },
};

// Statistics API
export const statisticsApi = {
  // Get database statistics
  get: async () => {
    return apiRequest<any>('/statistics');
  },
};

// Health check API
export const healthApi = {
  // Check server health
  check: async () => {
    return apiRequest<any>('/health');
  },
};

// Backup API
export const backupApi = {
  // Create backup
  create: async () => {
    return apiRequest<{ backupPath: string }>('/backup', {
      method: 'POST',
    });
  },

  // Restore from backup
  restore: async (backupPath: string) => {
    return apiRequest<void>('/restore', {
      method: 'POST',
      body: JSON.stringify({ backupPath }),
    });
  },
};

// Enhanced AuctionDataService that uses the API
export class ApiAuctionDataService {
  // Save auction report from form data
  static async saveAuctionReport(formData: any): Promise<any> {
    try {
      // Transform form data to database structure
      const dbData = this.transformFormToDatabase(formData);
      
      // Save to API
      const result = await auctionsApi.save(dbData);
      
      console.log('Auction report saved successfully:', result);
      return result.sale;
    } catch (error) {
      console.error('Error saving auction report:', error);
      throw new Error('Failed to save auction report');
    }
  }

  // Save auction report as draft
  static async saveAuctionReportDraft(formData: any): Promise<any> {
    try {
      // Transform form data to database structure
      const dbData = this.transformFormToDatabase(formData);
      
      // Mark as draft
      dbData.sale.is_draft = true;
      
      // Save to API
      const result = await auctionsApi.save(dbData);
      
      console.log('Auction report draft saved successfully:', result);
      return result.sale;
    } catch (error) {
      console.error('Error saving auction report draft:', error);
      throw new Error('Failed to save auction report draft');
    }
  }

  // Get auction report by ID
  static async getAuctionReport(saleId: string): Promise<any | null> {
    try {
      const dbData = await auctionsApi.getById(saleId);
      if (!dbData) return null;
      
      // Transform database structure back to form data
      const formData = this.transformDatabaseToForm(dbData);
      return formData;
    } catch (error) {
      console.error('Error getting auction report:', error);
      throw new Error('Failed to get auction report');
    }
  }

  // Get all auction reports
  static async getAllAuctionReports(): Promise<any[]> {
    try {
      return await salesApi.getAll();
    } catch (error) {
      console.error('Error getting all auction reports:', error);
      throw new Error('Failed to get auction reports');
    }
  }

  // Update auction report
  static async updateAuctionReport(saleId: string, formData: any): Promise<any> {
    try {
      // Transform form data to database structure
      const dbData = this.transformFormToDatabase(formData);
      
      // Update the sale ID in the data
      dbData.sale.id = saleId;
      dbData.indicators.forEach((ind: any) => ind.sale_id = saleId);
      dbData.exchange_rates.forEach((rate: any) => rate.sale_id = saleId);
      dbData.buyer_purchases.forEach((purchase: any) => purchase.sale_id = saleId);
      dbData.offering_analysis.forEach((analysis: any) => analysis.sale_id = saleId);
      dbData.average_prices_clean.forEach((price: any) => price.sale_id = saleId);
      
      // Save to API (this will replace existing data)
      const result = await auctionsApi.update(saleId, dbData);
      
      console.log('Auction report updated successfully:', result);
      return result.sale;
    } catch (error) {
      console.error('Error updating auction report:', error);
      throw new Error('Failed to update auction report');
    }
  }

  // Delete auction report
  static async deleteAuctionReport(saleId: string): Promise<boolean> {
    try {
      await salesApi.delete(saleId);
      console.log('Auction report deleted successfully:', saleId);
      return true;
    } catch (error) {
      console.error('Error deleting auction report:', error);
      throw new Error('Failed to delete auction report');
    }
  }

  // Get auction report by season and catalogue number
  static async getAuctionReportBySeasonAndCatalogue(season: string, catalogueNo: number): Promise<any | null> {
    try {
      const sale = await salesApi.getBySeasonAndCatalogue(season, catalogueNo);
      if (!sale) return null;
      
      return this.getAuctionReport(sale.id);
    } catch (error) {
      console.error('Error getting auction report by season and catalogue:', error);
      throw new Error('Failed to get auction report');
    }
  }

  // Get latest auction report
  static async getLatestAuctionReport(): Promise<any | null> {
    try {
      const sales = await salesApi.getAll();
      if (sales.length === 0) return null;
      
      // Sort by sale date descending and get the latest
      const latestSale = sales.sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())[0];
      
      return this.getAuctionReport(latestSale.id);
    } catch (error) {
      console.error('Error getting latest auction report:', error);
      throw new Error('Failed to get latest auction report');
    }
  }

  // Get auction statistics
  static async getAuctionStatistics(): Promise<any> {
    try {
      return await statisticsApi.get();
    } catch (error) {
      console.error('Error getting auction statistics:', error);
      throw new Error('Failed to get auction statistics');
    }
  }

  // Add test data
  static async addTestData(): Promise<void> {
    try {
      // This would trigger the server to seed data
      // For now, we'll just log that test data should be added via the server
      console.log('To add test data, run: node server/seed.js');
      throw new Error('Test data should be added via server seeding');
    } catch (error) {
      console.error('Error adding test data:', error);
      throw new Error('Failed to add test data');
    }
  }

  // Transform form data to database structure (simplified version)
  private static transformFormToDatabase(formData: any): any {
    // This is a simplified transformation
    // In a real implementation, you'd want to use the full transformer
    return {
      sale: {
        season: formData.auction?.season_label || '2025/26',
        catalogue_no: parseInt(formData.auction?.catalogue_name?.replace(/\D/g, '') || '1'),
        sale_date: formData.auction?.auction_date || new Date().toISOString().split('T')[0],
        location: 'Port Elizabeth',
        total_bales_offered: formData.indicators?.find((i: any) => i.type === 'total_lots')?.value || 0,
        total_bales_sold: formData.indicators?.find((i: any) => i.type === 'total_lots')?.value || 0,
        clearance_pct: 100,
        highest_price_c_per_kg_clean: Math.max(...(formData.micron_prices?.map((p: any) => p.price_clean_zar_per_kg) || [0])),
        highest_price_micron: 17.0,
        is_draft: false
      },
      indicators: formData.indicators?.map((indicator: any) => ({
        indicator: this.mapIndicatorType(indicator.type),
        unit: 'sa_c_per_kg_clean',
        value_this_sale: indicator.value,
        value_prior_sale: indicator.value_ytd,
        pct_change: indicator.pct_change
      })) || [],
      exchange_rates: formData.currencies?.map((currency: any) => ({
        pair: `ZAR/${currency.code}`,
        value_this_sale: currency.value,
        value_prior_sale: currency.value + currency.change,
        pct_change: currency.change,
        note: 'Average rate during sale'
      })) || [],
      buyer_purchases: formData.buyers?.map((buyer: any) => ({
        company: buyer.buyer,
        bales_this_sale: buyer.cat,
        pct_share: buyer.share_pct,
        bales_ytd: buyer.bales_ytd
      })) || [],
      offering_analysis: formData.brokers?.map((broker: any) => ({
        broker: broker.name,
        catalogue_offering: broker.catalogue_offering,
        sold: broker.catalogue_offering,
        pct_sold: 100
      })) || [],
      average_prices_clean: formData.micron_prices?.map((price: any) => ({
        micron: parseFloat(price.bucket_micron),
        style_code: 'MF5',
        length_mm: 60,
        cert: 'certified',
        avg_price_r_ckg: price.price_clean_zar_per_kg
      })) || [],
      certified_vs_noncert: [],
      certified_share: [],
      sale_statistics: [],
      receivals: [],
      sale_analysis_totals: [],
      bales_sold_by_length: [],
      bales_sold_by_style: [],
      report_ingest_audit: []
    };
  }

  // Transform database structure back to form data (simplified version)
  private static transformDatabaseToForm(dbData: any): any {
    // This is a simplified transformation
    // In a real implementation, you'd want to use the full transformer
    return {
      auction: {
        commodity: 'wool',
        season_label: dbData.sale.season,
        week_id: `week_${new Date(dbData.sale.sale_date).getFullYear()}_${String(dbData.sale.catalogue_no).padStart(2, '0')}`,
        week_start: this.getWeekStart(dbData.sale.sale_date),
        week_end: this.getWeekEnd(dbData.sale.sale_date),
        auction_date: dbData.sale.sale_date,
        catalogue_name: `CAT${String(dbData.sale.catalogue_no).padStart(2, '0')}`
      },
      indicators: dbData.indicators?.map((indicator: any) => ({
        type: this.mapIndicatorTypeToForm(indicator.indicator),
        unit: 'ZAR/kg',
        value: indicator.value_this_sale || 0,
        value_ytd: indicator.value_prior_sale,
        pct_change: indicator.pct_change || 0
      })) || [],
      benchmarks: [],
      micron_prices: dbData.average_prices_clean?.map((price: any) => ({
        bucket_micron: price.micron.toString(),
        category: this.getMicronCategory(price.micron),
        price_clean_zar_per_kg: price.avg_price_r_ckg || 0
      })) || [],
      buyers: dbData.buyer_purchases?.map((purchase: any) => ({
        buyer: purchase.company,
        share_pct: purchase.pct_share || 0,
        cat: purchase.bales_this_sale || 0,
        bales_ytd: purchase.bales_ytd || 0
      })) || [],
      brokers: dbData.offering_analysis?.map((analysis: any) => ({
        name: analysis.broker,
        catalogue_offering: analysis.catalogue_offering || 0,
        sold_ytd: analysis.sold || 0
      })) || [],
      currencies: dbData.exchange_rates?.map((rate: any) => ({
        code: rate.pair.split('/')[1],
        value: rate.value_this_sale || 0,
        change: rate.pct_change || 0
      })) || [],
      insights: '',
      trends: { rws: [], non_rws: [] },
      yearly_average_prices: [],
      provincial_producers: [],
      province_avg_prices: []
    };
  }

  // Helper functions
  private static mapIndicatorType(formType: string): string {
    switch (formType) {
      case 'total_lots':
      case 'total_volume':
      case 'total_value':
        return 'all_merino';
      case 'avg_price':
        return 'certified_merino';
      default:
        return 'all_merino';
    }
  }

  private static mapIndicatorTypeToForm(dbType: string): string {
    switch (dbType) {
      case 'all_merino':
        return 'total_lots';
      case 'certified_merino':
        return 'avg_price';
      case 'awex_emi':
        return 'total_value';
      default:
        return 'total_lots';
    }
  }

  private static getMicronCategory(micron: number): 'Fine' | 'Medium' | 'Strong' {
    if (micron <= 19) return 'Fine';
    if (micron <= 21) return 'Medium';
    return 'Strong';
  }

  private static getWeekStart(dateString: string): string {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    return weekStart.toISOString().split('T')[0];
  }

  private static getWeekEnd(dateString: string): string {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd.toISOString().split('T')[0];
  }
}

// Export the service as default
export default ApiAuctionDataService;
