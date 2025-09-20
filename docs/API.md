# OVK Wool Market Report API Documentation

## Overview

The OVK Wool Market Report Platform includes a RESTful API server built with Node.js and Express.js. The API provides endpoints for managing auction reports, market data, and administrative functions. The platform features an enhanced form interface that utilizes 95% of the page width for improved data entry efficiency.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Currently, the API uses basic authentication. Include credentials in the request headers:

```
Authorization: Basic <base64-encoded-credentials>
```

## Endpoints

### Auction Reports

#### GET /reports
Retrieve all auction reports.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "sale_number": "2025-01",
      "sale_date": "2025-01-15",
      "catalogue_name": "Cape Wools Weekly Report",
      "auction_center": "Port Elizabeth",
      "total_lots": 1500,
      "total_volume": 2500,
      "average_price": 85.50,
      "total_value": 213750,
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### GET /reports/:id
Retrieve a specific auction report by ID.

**Parameters:**
- `id` (string): Report UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sale_number": "2025-01",
    "sale_date": "2025-01-15",
    "catalogue_name": "Cape Wools Weekly Report",
    "auction_center": "Port Elizabeth",
    "total_lots": 1500,
    "total_volume": 2500,
    "average_price": 85.50,
    "total_value": 213750,
    "buyers": [...],
    "brokers": [...],
    "provincial_producers": [...],
    "micron_prices": [...],
    "trends": [...],
    "insights": {...},
    "currencies": {...},
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  }
}
```

#### POST /reports
Create a new auction report.

**Request Body:**
```json
{
  "sale_number": "2025-01",
  "sale_date": "2025-01-15",
  "catalogue_name": "Cape Wools Weekly Report",
  "auction_center": "Port Elizabeth",
  "total_lots": 1500,
  "total_volume": 2500,
  "average_price": 85.50,
  "total_value": 213750,
  "buyers": [...],
  "brokers": [...],
  "provincial_producers": [...],
  "micron_prices": [...],
  "trends": [...],
  "insights": {...},
  "currencies": {...}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "sale_number": "2025-01",
    "sale_date": "2025-01-15",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  }
}
```

#### PUT /reports/:id
Update an existing auction report.

**Parameters:**
- `id` (string): Report UUID

**Request Body:** Same as POST /reports

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "updated_at": "2025-01-15T11:00:00Z"
  }
}
```

#### DELETE /reports/:id
Delete an auction report.

**Parameters:**
- `id` (string): Report UUID

**Response:**
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

#### POST /reports/:id/draft
Save an auction report as draft.

**Parameters:**
- `id` (string): Report UUID

**Request Body:** Same as POST /reports

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "draft",
    "updated_at": "2025-01-15T11:00:00Z"
  }
}
```

#### POST /reports/:id/publish
Publish an auction report.

**Parameters:**
- `id` (string): Report UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "published",
    "published_at": "2025-01-15T11:00:00Z",
    "updated_at": "2025-01-15T11:00:00Z"
  }
}
```

#### GET /reports/status/:status
Retrieve reports by status.

**Parameters:**
- `status` (string): Report status (draft, published, archived)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "sale_number": "2025-01",
      "sale_date": "2025-01-15",
      "status": "published",
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### Market Data

#### GET /market-data
Retrieve aggregated market data across all reports.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_reports": 52,
    "total_volume": 130000,
    "average_price": 82.50,
    "top_buyers": [...],
    "top_provinces": [...],
    "price_trends": [...],
    "market_insights": {...}
  }
}
```

#### GET /market-data/trends
Retrieve market trend analysis.

**Query Parameters:**
- `period` (string, optional): Time period (week, month, quarter, year)
- `metric` (string, optional): Metric to analyze (price, volume, value)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "metric": "price",
    "trends": [
      {
        "date": "2025-01-01",
        "value": 85.50,
        "change": 2.5
      }
    ],
    "summary": {
      "average": 82.50,
      "min": 78.00,
      "max": 88.50,
      "volatility": 3.2
    }
  }
}
```

### Seasons

#### GET /seasons
Retrieve all seasons.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "year": "2025/2026",
      "start_date": "2025-07-01",
      "end_date": "2026-06-30",
      "number_of_auctions": 52,
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### GET /seasons/:id/stats
Retrieve season statistics including auction counts and aggregated data.

**Parameters:**
- `id` (string): Season UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "season_id": "uuid",
    "year": "2025/2026",
    "auction_count": 52,
    "total_bales": 125000,
    "total_volume": 250000,
    "total_turnover": 45000000,
    "created_at": "2025-01-15T10:00:00Z"
  }
}
```

#### POST /seasons
Create a new season.

**Request Body:**
```json
{
  "year": "2025/2026",
  "start_date": "2025-07-01",
  "end_date": "2026-06-30",
  "number_of_auctions": 52
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "year": "2025/2026",
    "start_date": "2025-07-01",
    "end_date": "2026-06-30",
    "number_of_auctions": 52,
    "created_at": "2025-01-15T10:00:00Z"
  }
}
```

#### PUT /seasons/:id
Update an existing season.

**Parameters:**
- `id` (string): Season UUID

**Request Body:** Same as POST /seasons

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "updated_at": "2025-01-15T11:00:00Z"
  }
}
```

#### DELETE /seasons/:id
Delete a season.

**Parameters:**
- `id` (string): Season UUID

**Response:**
```json
{
  "success": true,
  "message": "Season deleted successfully"
}
```

### Administrative

#### GET /admin/stats
Retrieve administrative statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_reports": 52,
    "total_users": 5,
    "last_updated": "2025-01-15T10:00:00Z",
    "storage_usage": "2.5MB",
    "system_health": "healthy"
  }
}
```

#### POST /admin/backup
Create a backup of all data.

**Response:**
```json
{
  "success": true,
  "data": {
    "backup_id": "backup-uuid",
    "created_at": "2025-01-15T10:00:00Z",
    "size": "2.5MB"
  }
}
```

#### POST /admin/restore
Restore data from a backup.

**Request Body:**
```json
{
  "backup_id": "backup-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data restored successfully"
}
```

## Data Models

### AuctionReport
```typescript
interface AuctionReport {
  id: string;
  sale_number: string;
  sale_date: string;
  catalogue_name: string;
  auction_center: string;
  total_lots: number;
  total_volume: number;
  average_price: number;
  total_value: number;
  buyers: Buyer[];
  brokers: BrokerData[];
  provincial_producers: ProvincialProducer[];
  micron_prices: MicronPrice[];
  trends: Trend[];
  insights: MarketInsights;
  currencies: CurrencyData;
  // New status and metadata fields
  status: 'draft' | 'published' | 'archived';
  cape_wools_commentary?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  created_by?: string;
  approved_by?: string;
  version?: number;
}
```

### Buyer
```typescript
interface Buyer {
  buyer: string;
  share_pct: number;
  cat: number;
  bales_ytd: number;
}
```

### BrokerData
```typescript
interface BrokerData {
  name: string;
  catalogue_offering: number;
  sold_ytd: number;
}
```

### ProvincialProducer
```typescript
interface ProvincialProducer {
  province: string;
  farm: string;
  lots: number;
  volume: number;
  average_price: number;
  certification: string;
}
```

### MicronPrice
```typescript
interface MicronPrice {
  micron: number;
  price: number;
  volume: number;
  certification: string;
}
```

### Season
```typescript
interface Season {
  id: string;
  year: string;
  start_date: string;
  end_date: string;
  number_of_auctions: number;
  created_at: string;
  updated_at?: string;
}
```

### SeasonStats
```typescript
interface SeasonStats {
  season_id: string;
  year: string;
  auction_count: number;
  total_bales: number;
  total_volume: number;
  total_turnover: number;
  created_at: string;
}
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "sale_date",
      "issue": "Date format is invalid"
    }
  }
}
```

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Access denied
- `INTERNAL_ERROR`: Server error
- `DUPLICATE_ENTRY`: Resource already exists

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

## CORS

Cross-Origin Resource Sharing is enabled for:
- `http://localhost:5173` (development)
- `https://yourdomain.com` (production)

## Security

- Helmet.js for security headers
- Input validation and sanitization
- CORS protection
- Rate limiting
- Request logging with Morgan

## Development

### Starting the Server
```bash
cd server
npm install
npm start
```

### Development Mode
```bash
npm run dev
```

### Testing
```bash
npm test
```

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Monitoring

The API includes built-in monitoring:
- Request logging with Morgan
- Health check endpoint: `GET /health`
- Performance metrics
- Error tracking

## Recent Updates

### Enhanced Report Management
- **Status Management**: New endpoints for draft/publish workflow with status tracking
- **Season Management**: Complete CRUD operations for season data with statistics
- **Enhanced Data Models**: Updated AuctionReport interface with status and metadata fields
- **Pagination Support**: Improved data retrieval with pagination for large datasets
- **Real-time Statistics**: Dynamic calculation of season and auction statistics

### Enhanced Form Interface
- **95% Width Utilization**: The auction data capture form now uses 95% of the available page width
- **Improved API Integration**: Enhanced form layout provides better integration with API endpoints
- **Better Data Validation**: Improved form validation with wider layout for better error handling
- **Mobile Responsiveness**: API maintains full mobile compatibility with enhanced form interface

### Input Formatting
- **Currency Formatting**: Support for thousands separators in numeric inputs
- **Catalogue Number Formatting**: 2-digit formatting with natural typing support
- **Real-time Validation**: Enhanced validation with immediate feedback

## Support

For API support or questions, please contact the development team or refer to the project documentation.
