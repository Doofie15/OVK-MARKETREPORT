# Wool Market API Server

A JSON-based API server for the OVK Wool Market Report Platform, providing CRUD operations for auction data management.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Verify server is running**
   ```bash
   curl http://localhost:3001/health
   ```

## 📊 API Endpoints

### Health & Statistics
- `GET /health` - Server health check
- `GET /api/statistics` - Database statistics

### Sales Management
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get sale by ID
- `POST /api/sales` - Create new sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale

### Complete Auction Data
- `GET /api/auctions/:id` - Get complete auction data
- `POST /api/auctions` - Save complete auction data
- `PUT /api/auctions/:id` - Update complete auction data

### Generic Table Operations
- `GET /api/tables/:table` - Get all records from table
- `GET /api/tables/:table/:id` - Get record by ID
- `POST /api/tables/:table` - Create new record
- `PUT /api/tables/:table/:id` - Update record
- `DELETE /api/tables/:table/:id` - Delete record

### Query Operations
- `GET /api/tables/:table/query/:field/:value` - Find records by field value
- `GET /api/tables/:table/sale/:saleId` - Get records by sale ID

### Backup & Restore
- `POST /api/backup` - Create database backup
- `POST /api/restore` - Restore from backup

## 🗄️ Database Structure

The server uses a JSON file-based database with the following tables:

- `sales` - Main auction sales data
- `indicators` - Market indicators and metrics
- `exchange_rates` - Currency exchange rates
- `buyer_purchases` - Buyer purchase data
- `offering_analysis` - Broker offering analysis
- `average_prices_clean` - Average clean prices by micron/style
- `certified_vs_noncert` - Certified vs non-certified comparisons
- `certified_share` - Certified wool share data
- `sale_statistics` - Sale statistics
- `receivals` - Wool receivals data
- `sale_analysis_totals` - Sale analysis totals
- `bales_sold_by_length` - Bales sold by length
- `bales_sold_by_style` - Bales sold by style
- `report_ingest_audit` - Report ingestion audit trail

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3001)

### CORS Configuration
The server is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)
- `http://127.0.0.1:5173` (Alternative localhost)

## 📝 Example Usage

### Create a new sale
```bash
curl -X POST http://localhost:3001/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "season": "2025/26",
    "catalogue_no": 1,
    "sale_date": "2025-01-27",
    "location": "Port Elizabeth",
    "total_bales_offered": 1000,
    "total_bales_sold": 950,
    "clearance_pct": 95.0
  }'
```

### Get all sales
```bash
curl http://localhost:3001/api/sales
```

### Get database statistics
```bash
curl http://localhost:3001/api/statistics
```

## 🛡️ Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Input validation** - Request body parsing limits
- **Error handling** - Comprehensive error responses

## 📁 File Structure

```
server/
├── package.json          # Dependencies and scripts
├── server.js             # Main server file
├── database.js           # Database class and operations
├── database.json         # JSON database file
└── README.md            # This file
```

## 🔄 Development

### Adding New Endpoints
1. Add route handlers in `server.js`
2. Add corresponding database methods in `database.js`
3. Test with curl or Postman

### Database Schema Changes
1. Update the database structure in `database.js`
2. Update the initial data structure
3. Consider migration strategy for existing data

## 🚨 Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

Success responses include:

```json
{
  "success": true,
  "data": { ... },
  "count": 10
}
```

## 📊 Monitoring

The server includes:
- **Morgan logging** - HTTP request logging
- **Health checks** - Server status monitoring
- **Statistics endpoint** - Database metrics
- **Backup/restore** - Data protection

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port 3001
   lsof -ti:3001 | xargs kill -9
   ```

2. **Database file corruption**
   ```bash
   # Restore from backup
   curl -X POST http://localhost:3001/api/restore \
     -H "Content-Type: application/json" \
     -d '{"backupPath": "/path/to/backup.json"}'
   ```

3. **CORS issues**
   - Check that your frontend URL is in the CORS configuration
   - Verify the frontend is making requests to the correct port

## 📈 Performance

- **JSON file storage** - Fast read/write operations
- **In-memory caching** - Database loaded into memory
- **Batch operations** - Efficient bulk data handling
- **Automatic backups** - Data protection

## 🔮 Future Enhancements

- [ ] Database migration system
- [ ] API rate limiting
- [ ] Authentication/authorization
- [ ] Real-time updates with WebSockets
- [ ] Database indexing for better performance
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
