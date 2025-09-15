const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const JSONDatabase = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
const db = new JSONDatabase();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: {
      totalRecords: db.getTotalRecords(),
      statistics: db.getStatistics()
    }
  });
});

// API Routes

// Sales endpoints
app.get('/api/sales', (req, res) => {
  try {
    const sales = db.getSales();
    res.json({
      success: true,
      data: sales,
      count: sales.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/sales/:id', (req, res) => {
  try {
    const sale = db.getSaleById(req.params.id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }
    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/sales', (req, res) => {
  try {
    const sale = db.createSale(req.body);
    res.status(201).json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.put('/api/sales/:id', (req, res) => {
  try {
    const sale = db.updateSale(req.params.id, req.body);
    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }
    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.delete('/api/sales/:id', (req, res) => {
  try {
    const deleted = db.deleteSale(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }
    res.json({
      success: true,
      message: 'Sale deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Complete auction data endpoints
app.get('/api/auctions/:id', (req, res) => {
  try {
    const auctionData = db.getCompleteAuction(req.params.id);
    if (!auctionData) {
      return res.status(404).json({
        success: false,
        error: 'Auction not found'
      });
    }
    res.json({
      success: true,
      data: auctionData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/auctions', (req, res) => {
  try {
    const auctionData = db.saveCompleteAuction(req.body);
    res.status(201).json({
      success: true,
      data: auctionData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.put('/api/auctions/:id', (req, res) => {
  try {
    // Update the sale ID in the request body
    req.body.sale.id = req.params.id;
    const auctionData = db.saveCompleteAuction(req.body);
    res.json({
      success: true,
      data: auctionData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generic table endpoints
app.get('/api/tables/:table', (req, res) => {
  try {
    const records = db.read(req.params.table);
    res.json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/tables/:table/:id', (req, res) => {
  try {
    const record = db.read(req.params.table, req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/tables/:table', (req, res) => {
  try {
    const record = db.create(req.params.table, req.body);
    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.put('/api/tables/:table/:id', (req, res) => {
  try {
    const record = db.update(req.params.table, req.params.id, req.body);
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.delete('/api/tables/:table/:id', (req, res) => {
  try {
    const deleted = db.delete(req.params.table, req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    res.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Query endpoints
app.get('/api/tables/:table/query/:field/:value', (req, res) => {
  try {
    const records = db.findBy(req.params.table, req.params.field, req.params.value);
    res.json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/tables/:table/sale/:saleId', (req, res) => {
  try {
    const records = db.findBySaleId(req.params.table, req.params.saleId);
    res.json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Statistics endpoint
app.get('/api/statistics', (req, res) => {
  try {
    const stats = db.getStatistics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Backup endpoint
app.post('/api/backup', (req, res) => {
  try {
    const backupPath = db.backup();
    res.json({
      success: true,
      message: 'Backup created successfully',
      backupPath: backupPath
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Restore endpoint
app.post('/api/restore', (req, res) => {
  try {
    const { backupPath } = req.body;
    if (!backupPath) {
      return res.status(400).json({
        success: false,
        error: 'Backup path is required'
      });
    }
    
    db.restore(backupPath);
    res.json({
      success: true,
      message: 'Database restored successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Wool Market API Server running on port ${PORT}`);
  console.log(`📊 Database loaded with ${db.getTotalRecords()} records`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Statistics: http://localhost:${PORT}/api/statistics`);
});

module.exports = app;
