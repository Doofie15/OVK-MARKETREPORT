const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class JSONDatabase {
  constructor(dbPath = path.join(__dirname, 'database.json')) {
    this.dbPath = dbPath;
    this.data = null;
    this.loadDatabase();
  }

  // Load database from JSON file
  loadDatabase() {
    try {
      if (fs.existsSync(this.dbPath)) {
        this.data = fs.readJsonSync(this.dbPath);
      } else {
        this.data = {
          sales: [],
          indicators: [],
          exchange_rates: [],
          certified_vs_noncert: [],
          certified_share: [],
          sale_statistics: [],
          receivals: [],
          offering_analysis: [],
          buyer_purchases: [],
          sale_analysis_totals: [],
          bales_sold_by_length: [],
          bales_sold_by_style: [],
          average_prices_clean: [],
          report_ingest_audit: [],
          cape_wools_reports: [],
          metadata: {
            version: "1.0.0",
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            total_records: 0
          }
        };
        this.saveDatabase();
      }
    } catch (error) {
      console.error('Error loading database:', error);
      throw new Error('Failed to load database');
    }
  }

  // Save database to JSON file
  saveDatabase() {
    try {
      this.data.metadata.last_updated = new Date().toISOString();
      this.data.metadata.total_records = this.getTotalRecords();
      fs.writeJsonSync(this.dbPath, this.data, { spaces: 2 });
    } catch (error) {
      console.error('Error saving database:', error);
      throw new Error('Failed to save database');
    }
  }

  // Get total number of records across all tables
  getTotalRecords() {
    return Object.keys(this.data)
      .filter(key => key !== 'metadata')
      .reduce((total, key) => total + this.data[key].length, 0);
  }

  // Generic CRUD operations
  create(table, record) {
    if (!this.data[table]) {
      throw new Error(`Table ${table} does not exist`);
    }

    const newRecord = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...record
    };

    this.data[table].push(newRecord);
    this.saveDatabase();
    return newRecord;
  }

  read(table, id = null) {
    if (!this.data[table]) {
      throw new Error(`Table ${table} does not exist`);
    }

    if (id) {
      return this.data[table].find(record => record.id === id);
    }
    return this.data[table];
  }

  update(table, id, updates) {
    if (!this.data[table]) {
      throw new Error(`Table ${table} does not exist`);
    }

    const index = this.data[table].findIndex(record => record.id === id);
    if (index === -1) {
      return null;
    }

    this.data[table][index] = {
      ...this.data[table][index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.saveDatabase();
    return this.data[table][index];
  }

  delete(table, id) {
    if (!this.data[table]) {
      throw new Error(`Table ${table} does not exist`);
    }

    const index = this.data[table].findIndex(record => record.id === id);
    if (index === -1) {
      return false;
    }

    this.data[table].splice(index, 1);
    this.saveDatabase();
    return true;
  }

  // Query operations
  findBy(table, field, value) {
    if (!this.data[table]) {
      throw new Error(`Table ${table} does not exist`);
    }

    return this.data[table].filter(record => record[field] === value);
  }

  findBySaleId(table, saleId) {
    return this.findBy(table, 'sale_id', saleId);
  }

  // Sales-specific operations
  getSales() {
    return this.read('sales');
  }

  getSaleById(id) {
    return this.read('sales', id);
  }

  getSaleBySeasonAndCatalogue(season, catalogueNo) {
    return this.data.sales.find(sale => 
      sale.season === season && sale.catalogue_no === catalogueNo
    );
  }

  createSale(saleData) {
    return this.create('sales', saleData);
  }

  updateSale(id, updates) {
    return this.update('sales', id, updates);
  }

  deleteSale(id) {
    // Delete all related records first
    this.deleteBySaleId('indicators', id);
    this.deleteBySaleId('exchange_rates', id);
    this.deleteBySaleId('buyer_purchases', id);
    this.deleteBySaleId('offering_analysis', id);
    this.deleteBySaleId('average_prices_clean', id);
    this.deleteBySaleId('certified_vs_noncert', id);
    this.deleteBySaleId('certified_share', id);
    this.deleteBySaleId('sale_statistics', id);
    this.deleteBySaleId('receivals', id);
    this.deleteBySaleId('sale_analysis_totals', id);
    this.deleteBySaleId('bales_sold_by_length', id);
    this.deleteBySaleId('bales_sold_by_style', id);
    this.deleteBySaleId('report_ingest_audit', id);

    return this.delete('sales', id);
  }

  // Complete auction data operations
  saveCompleteAuction(auctionData) {
    try {
      // Delete existing data for this sale if it exists
      if (auctionData.sale.id) {
        this.deleteSale(auctionData.sale.id);
      }

      // Create the sale
      const sale = this.createSale(auctionData.sale);

      // Create all related records
      const createdRecords = {
        sale,
        indicators: [],
        exchange_rates: [],
        buyer_purchases: [],
        offering_analysis: [],
        average_prices_clean: [],
        certified_vs_noncert: [],
        certified_share: [],
        sale_statistics: [],
        receivals: [],
        sale_analysis_totals: [],
        bales_sold_by_length: [],
        bales_sold_by_style: [],
        report_ingest_audit: []
      };

      // Create indicators
      if (auctionData.indicators && auctionData.indicators.length > 0) {
        createdRecords.indicators = auctionData.indicators.map(indicator => 
          this.create('indicators', { ...indicator, sale_id: sale.id })
        );
      }

      // Create exchange rates
      if (auctionData.exchange_rates && auctionData.exchange_rates.length > 0) {
        createdRecords.exchange_rates = auctionData.exchange_rates.map(rate => 
          this.create('exchange_rates', { ...rate, sale_id: sale.id })
        );
      }

      // Create buyer purchases
      if (auctionData.buyer_purchases && auctionData.buyer_purchases.length > 0) {
        createdRecords.buyer_purchases = auctionData.buyer_purchases.map(purchase => 
          this.create('buyer_purchases', { ...purchase, sale_id: sale.id })
        );
      }

      // Create offering analysis
      if (auctionData.offering_analysis && auctionData.offering_analysis.length > 0) {
        createdRecords.offering_analysis = auctionData.offering_analysis.map(analysis => 
          this.create('offering_analysis', { ...analysis, sale_id: sale.id })
        );
      }

      // Create average prices clean
      if (auctionData.average_prices_clean && auctionData.average_prices_clean.length > 0) {
        createdRecords.average_prices_clean = auctionData.average_prices_clean.map(price => 
          this.create('average_prices_clean', { ...price, sale_id: sale.id })
        );
      }

      // Create other related records
      if (auctionData.certified_vs_noncert && auctionData.certified_vs_noncert.length > 0) {
        createdRecords.certified_vs_noncert = auctionData.certified_vs_noncert.map(record => 
          this.create('certified_vs_noncert', { ...record, sale_id: sale.id })
        );
      }

      if (auctionData.certified_share && auctionData.certified_share.length > 0) {
        createdRecords.certified_share = auctionData.certified_share.map(record => 
          this.create('certified_share', { ...record, sale_id: sale.id })
        );
      }

      if (auctionData.sale_statistics && auctionData.sale_statistics.length > 0) {
        createdRecords.sale_statistics = auctionData.sale_statistics.map(record => 
          this.create('sale_statistics', { ...record, sale_id: sale.id })
        );
      }

      if (auctionData.receivals && auctionData.receivals.length > 0) {
        createdRecords.receivals = auctionData.receivals.map(record => 
          this.create('receivals', { ...record, sale_id: sale.id })
        );
      }

      if (auctionData.sale_analysis_totals && auctionData.sale_analysis_totals.length > 0) {
        createdRecords.sale_analysis_totals = auctionData.sale_analysis_totals.map(record => 
          this.create('sale_analysis_totals', { ...record, sale_id: sale.id })
        );
      }

      if (auctionData.bales_sold_by_length && auctionData.bales_sold_by_length.length > 0) {
        createdRecords.bales_sold_by_length = auctionData.bales_sold_by_length.map(record => 
          this.create('bales_sold_by_length', { ...record, sale_id: sale.id })
        );
      }

      if (auctionData.bales_sold_by_style && auctionData.bales_sold_by_style.length > 0) {
        createdRecords.bales_sold_by_style = auctionData.bales_sold_by_style.map(record => 
          this.create('bales_sold_by_style', { ...record, sale_id: sale.id })
        );
      }

      if (auctionData.report_ingest_audit && auctionData.report_ingest_audit.length > 0) {
        createdRecords.report_ingest_audit = auctionData.report_ingest_audit.map(record => 
          this.create('report_ingest_audit', { ...record, sale_id: sale.id })
        );
      }

      return createdRecords;
    } catch (error) {
      console.error('Error saving complete auction:', error);
      throw new Error('Failed to save complete auction data');
    }
  }

  getCompleteAuction(saleId) {
    const sale = this.getSaleById(saleId);
    if (!sale) {
      return null;
    }

    return {
      sale,
      indicators: this.findBySaleId('indicators', saleId),
      exchange_rates: this.findBySaleId('exchange_rates', saleId),
      buyer_purchases: this.findBySaleId('buyer_purchases', saleId),
      offering_analysis: this.findBySaleId('offering_analysis', saleId),
      average_prices_clean: this.findBySaleId('average_prices_clean', saleId),
      certified_vs_noncert: this.findBySaleId('certified_vs_noncert', saleId),
      certified_share: this.findBySaleId('certified_share', saleId),
      sale_statistics: this.findBySaleId('sale_statistics', saleId),
      receivals: this.findBySaleId('receivals', saleId),
      sale_analysis_totals: this.findBySaleId('sale_analysis_totals', saleId),
      bales_sold_by_length: this.findBySaleId('bales_sold_by_length', saleId),
      bales_sold_by_style: this.findBySaleId('bales_sold_by_style', saleId),
      report_ingest_audit: this.findBySaleId('report_ingest_audit', saleId)
    };
  }

  // Utility methods
  deleteBySaleId(table, saleId) {
    if (!this.data[table]) {
      return;
    }

    this.data[table] = this.data[table].filter(record => record.sale_id !== saleId);
    this.saveDatabase();
  }

  // Statistics
  getStatistics() {
    const sales = this.getSales();
    const totalAuctions = sales.length;
    const totalBales = sales.reduce((sum, sale) => sum + (sale.total_bales_sold || 0), 0);
    const averageClearance = sales.length > 0 
      ? sales.reduce((sum, sale) => sum + (sale.clearance_pct || 0), 0) / sales.length 
      : 0;
    const latestAuctionDate = sales.length > 0 
      ? sales.sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())[0].sale_date
      : null;

    return {
      totalAuctions,
      totalBales,
      averageClearance,
      latestAuctionDate,
      totalRecords: this.getTotalRecords()
    };
  }

  // Cape Wools Reports methods
  createCapeWoolsReport(reportData) {
    const report = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...reportData
    };

    this.data.cape_wools_reports.push(report);
    this.saveDatabase();
    return report;
  }

  getCapeWoolsReport(id) {
    return this.data.cape_wools_reports.find(report => report.id === id);
  }

  getAllCapeWoolsReports() {
    return this.data.cape_wools_reports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getLatestCapeWoolsReport() {
    const reports = this.getAllCapeWoolsReports();
    return reports.length > 0 ? reports[0] : null;
  }

  updateCapeWoolsReport(id, updateData) {
    const reportIndex = this.data.cape_wools_reports.findIndex(report => report.id === id);
    if (reportIndex === -1) {
      throw new Error('Cape Wools report not found');
    }

    this.data.cape_wools_reports[reportIndex] = {
      ...this.data.cape_wools_reports[reportIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };

    this.saveDatabase();
    return this.data.cape_wools_reports[reportIndex];
  }

  deleteCapeWoolsReport(id) {
    const reportIndex = this.data.cape_wools_reports.findIndex(report => report.id === id);
    if (reportIndex === -1) {
      throw new Error('Cape Wools report not found');
    }

    const deletedReport = this.data.cape_wools_reports.splice(reportIndex, 1)[0];
    this.saveDatabase();
    return deletedReport;
  }

  // Backup and restore
  backup() {
    const backupPath = path.join(__dirname, `backup_${Date.now()}.json`);
    fs.writeJsonSync(backupPath, this.data, { spaces: 2 });
    return backupPath;
  }

  restore(backupPath) {
    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup file does not exist');
    }

    this.data = fs.readJsonSync(backupPath);
    this.saveDatabase();
    return true;
  }
}

module.exports = JSONDatabase;
