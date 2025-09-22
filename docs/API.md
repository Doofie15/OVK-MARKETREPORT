# OVK Wool Market Report API Documentation

## Overview

The OVK Wool Market Report Platform features a comprehensive Supabase-based backend with PostgreSQL database integration. The platform provides both RESTful API endpoints and direct database access through Supabase services. The system includes enhanced data management, real-time synchronization, and advanced analytics capabilities.

## Database Integration

### Supabase Configuration
- **Database**: PostgreSQL with real-time capabilities
- **Authentication**: Supabase Auth with role-based access control
- **Storage**: Row Level Security (RLS) for data protection
- **Real-time**: Live data synchronization across all clients

### Base URLs
```
# Supabase API (Primary)
https://your-project.supabase.co

# Legacy Node.js API (Optional)
http://localhost:3001/api
```

## Authentication

### Supabase Authentication
The platform uses Supabase Auth with JWT tokens:

```
Authorization: Bearer <jwt-token>
```

### User Roles & Permissions
- **super_admin**: Full system access including user management
- **admin**: Administrative access including auction management
- **editor**: Can create and edit auction reports
- **viewer**: Read-only access to view reports

## Supabase Service Methods

### Auction Management

#### `getCompleteAuctionReport(auctionId: string)`
Retrieve a complete auction report with all related data including season-to-date totals.

**Parameters:**
- `auctionId` (string): Auction UUID

**Returns:**
```typescript
{
  success: boolean;
  data?: AuctionReport;
  error?: string;
}
```

**Features:**
- Loads all related data (buyers, brokers, provincial producers, micron prices)
- Calculates season-to-date totals for indicators
- Includes market insights and currency data
- Handles data transformation from database to UI format

#### `getSeasonIndicatorTotals(seasonId: string)`
Calculate season-to-date totals for market indicators.

**Parameters:**
- `seasonId` (string): Season UUID

**Returns:**
```typescript
{
  success: boolean;
  data?: {
    totalBales: number;
    totalVolume: number;
    totalValue: number;
  };
  error?: string;
}
```

#### `getBuyerSeasonTotals(seasonId: string)`
Calculate season-to-date totals for buyer performance.

**Parameters:**
- `seasonId` (string): Season UUID

**Returns:**
```typescript
{
  success: boolean;
  data?: Array<{
    buyer: string;
    total_bales_season: number;
  }>;
  error?: string;
}
```

### User Management

#### `getUsers()`
Retrieve all users with their roles and approval status.

**Returns:**
```typescript
{
  success: boolean;
  data?: Array<{
    id: string;
    email: string;
    user_type: string;
    is_approved: boolean;
    created_at: string;
  }>;
  error?: string;
}
```

#### `approveUser(userId: string)`
Approve a pending user for system access.

**Parameters:**
- `userId` (string): User UUID

**Returns:**
```typescript
{
  success: boolean;
  data?: User;
  error?: string;
}
```

### Season Management

#### `getSeasons()`
Retrieve all seasons with their statistics.

**Returns:**
```typescript
{
  success: boolean;
  data?: Array<{
    id: string;
    season_year: string;
    start_date: string;
    end_date: string;
    created_at: string;
  }>;
  error?: string;
}
```

### Published Reports

#### `getPublishedReports()`
Retrieve all published auction reports for public display.

**Returns:**
```typescript
{
  success: boolean;
  data?: Array<{
    id: string;
    catalogue_name: string;
    auction_date: string;
    published_at: string;
    report: AuctionReport;
  }>;
  error?: string;
}
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
  indicators: Indicator[];
  benchmarks: Benchmark[];
  yearly_average_prices: YearlyAveragePrice[];
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

### Indicator (Enhanced with Season-to-Date)
```typescript
interface Indicator {
  type: 'total_lots' | 'total_volume' | 'avg_price' | 'total_value';
  unit: string;
  value: number;
  value_ytd: number; // Season-to-date total
  pct_change: number;
}
```

### Benchmark
```typescript
interface Benchmark {
  label: string;
  price: number;
  currency: string;
  day_change_pct: number;
}
```

### YearlyAveragePrice
```typescript
interface YearlyAveragePrice {
  label: string;
  value: number;
  unit: string;
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

### Supabase Integration
- **Database Migration**: Complete migration from JSON storage to PostgreSQL with Supabase
- **Real-time Synchronization**: Live data updates across all clients using Supabase real-time
- **Row Level Security**: Database-level security policies for data access control
- **Enhanced Authentication**: JWT-based authentication with role-based access control
- **User Management**: Complete user administration system with approval workflow

### Season-to-Date Analytics
- **Enhanced Market Overview**: Market overview cards now display both current auction and season-to-date totals
- **Season Indicator Totals**: New service method to calculate cumulative season totals
- **Buyer Season Totals**: Season-to-date buyer performance tracking
- **Real-time Calculations**: Dynamic calculation of season totals from all published auctions
- **Public Data Integration**: Public page now displays live data from published reports

### Enhanced Data Models
- **Indicator Enhancement**: Added `value_ytd` field for season-to-date totals
- **Benchmark Integration**: Enhanced benchmark data with currency and change tracking
- **Yearly Average Prices**: New data structure for year-to-date average pricing
- **Provincial Data**: Enhanced provincial producer data with proper sorting and filtering
- **Complete Data Pipeline**: End-to-end data flow from admin capture to public display

### Public Page Integration
- **Live Data Display**: Public page now shows data from published auction reports
- **Interactive Price Map**: Responsive SVG map showing provincial price averages
- **Enhanced Charts**: Improved data visualization with proper currency formatting
- **Mobile Optimization**: Complete mobile responsiveness for all public components
- **Data Validation**: Robust error handling and fallback mechanisms

### Form Interface Enhancements
- **95% Width Utilization**: The auction data capture form uses 95% of available page width
- **Enhanced Validation**: Improved form validation with real-time feedback
- **Currency Formatting**: Support for thousands separators in numeric inputs
- **Catalogue Number Formatting**: 2-digit formatting with natural typing support
- **Mobile Responsiveness**: Full mobile compatibility with enhanced form interface

## Support

For API support or questions, please contact the development team or refer to the project documentation.
