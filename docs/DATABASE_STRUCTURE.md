# Database Structure Documentation

## Overview
This document describes the database structure for the Cape Wools Market Report application, including all collections, fields, and relationships. The application features an enhanced form layout that utilizes 95% of the page width for improved data entry efficiency and better user experience.

## Database Collections

### 1. Sales Collection (`sales`)
Stores basic auction information and metadata.

**Fields:**
- `id` (string): Unique identifier
- `created_at` (string): ISO timestamp of creation
- `updated_at` (string): ISO timestamp of last update
- `season` (string): Season label (e.g., "2025/26")
- `catalogue_no` (number): Catalogue number
- `sale_date` (string): Date of the auction (YYYY-MM-DD)
- `location` (string): Auction center location
- `total_bales_offered` (number): Total bales offered for sale
- `total_bales_sold` (number): Total bales sold
- `clearance_pct` (number): Clearance percentage
- `total_volume_kg` (number): Total volume in kilograms
- `total_turnover` (number): Total turnover in ZAR
- `highest_price_c_per_kg_clean` (number): Highest price in cents per kg clean
- `highest_price_micron` (number): Micron of highest price wool
- `next_sale_date` (string): Date of next scheduled sale
- `next_sale_bales` (number): Expected bales for next sale
- `is_draft` (boolean): Whether this is a draft record
- `status` (string): Report status ('draft', 'published', 'archived')
- `is_empty` (boolean): For pagination empty rows

### 2. Cape Wools Reports Collection (`cape_wools_reports`)
Stores complete Cape Wools market report data from the form.

**Fields:**
- `id` (string): Unique identifier
- `created_at` (string): ISO timestamp of creation
- `updated_at` (string): ISO timestamp of last update
- `auction` (object): Auction information
  - `season_label` (string): Season label
  - `catalogue_name` (string): Catalogue name
  - `auction_date` (string): Auction date
  - `auction_center` (string): Auction center location
  - `commodity` (string): Commodity type (usually "wool")
  - `week_start` (string): Week start date
  - `week_end` (string): Week end date
- `market_indices` (object): Market indicator data
  - `merino_indicator_sa_cents_clean` (number): SA Merino indicator in cents
  - `merino_indicator_us_cents_clean` (number): US Merino indicator in cents
  - `merino_indicator_euro_cents_clean` (number): Euro Merino indicator in cents
  - `certified_indicator_sa_cents_clean` (number): SA Certified indicator in cents
  - `certified_indicator_us_cents_clean` (number): US Certified indicator in cents
  - `certified_indicator_euro_cents_clean` (number): Euro Certified indicator in cents
  - `awex_emi_sa_cents_clean` (number): SA AWEX EMI in cents
- `currency_fx` (object): Currency exchange rates
  - `ZAR_USD` (number): ZAR to USD exchange rate
  - `ZAR_EUR` (number): ZAR to EUR exchange rate
  - `ZAR_JPY` (number): ZAR to JPY exchange rate
  - `ZAR_GBP` (number): ZAR to GBP exchange rate
  - `USD_AUD` (number): USD to AUD exchange rate
- `supply_stats` (object): Supply statistics
  - `offered_bales` (number): Total bales offered
  - `sold_bales` (number): Total bales sold
  - `clearance_rate_pct` (number): Clearance rate percentage
- `highest_price` (object): Highest price information
  - `price_cents_clean` (number): Highest price in cents per kg clean
  - `micron` (number): Micron of highest price wool
  - `bales` (number): Number of bales at highest price
- `certified_share` (object): Certified sustainable wool data
  - `offered_bales` (number): Certified bales offered
  - `sold_bales` (number): Certified bales sold
  - `all_wool_pct_offered` (number): % of all wool offered that is certified
  - `all_wool_pct_sold` (number): % of all wool sold that is certified
  - `merino_pct_offered` (number): % of merino wool offered that is certified
  - `merino_pct_sold` (number): % of merino wool sold that is certified
- `greasy_stats` (object): Greasy wool statistics
  - `turnover_rand` (number): Total turnover in ZAR
  - `bales` (number): Number of bales
  - `mass_kg` (number): Total mass in kilograms
- `cape_wools_commentary` (string): Cape Wools market commentary text
- `status` (string): Report status ('draft', 'published', 'archived')
- `published_at` (string): ISO timestamp when report was published
- `created_by` (string): User who created the report
- `approved_by` (string): User who approved the report
- `version` (number): Report version number

### 3. Indicators Collection (`indicators`)
Stores market indicator data linked to sales.

**Fields:**
- `id` (string): Unique identifier
- `sale_id` (string): Reference to sale record
- `indicator_name` (string): Name of the indicator
- `value` (number): Indicator value
- `unit` (string): Unit of measurement
- `currency` (string): Currency if applicable

### 4. Exchange Rates Collection (`exchange_rates`)
Stores currency exchange rate data linked to sales.

**Fields:**
- `id` (string): Unique identifier
- `sale_id` (string): Reference to sale record
- `currency_pair` (string): Currency pair (e.g., "ZAR/USD")
- `rate` (number): Exchange rate
- `date` (string): Date of the rate

### 5. Certified vs Non-Certified Collection (`certified_vs_noncert`)
Stores comparison data between certified and non-certified wool.

**Fields:**
- `id` (string): Unique identifier
- `sale_id` (string): Reference to sale record
- `category` (string): Category (certified/non-certified)
- `bales_offered` (number): Bales offered
- `bales_sold` (number): Bales sold
- `average_price` (number): Average price
- `clearance_rate` (number): Clearance rate

### 6. Certified Share Collection (`certified_share`)
Stores certified wool share data.

**Fields:**
- `id` (string): Unique identifier
- `sale_id` (string): Reference to sale record
- `total_bales_offered` (number): Total bales offered
- `certified_bales_offered` (number): Certified bales offered
- `certified_share_pct` (number): Certified share percentage
- `total_bales_sold` (number): Total bales sold
- `certified_bales_sold` (number): Certified bales sold
- `certified_sold_share_pct` (number): Certified sold share percentage

### 7. Sale Statistics Collection (`sale_statistics`)
Stores general sale statistics.

**Fields:**
- `id` (string): Unique identifier
- `sale_id` (string): Reference to sale record
- `total_turnover` (number): Total turnover amount
- `average_price` (number): Average price
- `price_range_min` (number): Minimum price
- `price_range_max` (number): Maximum price
- `total_mass_kg` (number): Total mass in kilograms

### 8. Receivals Collection (`receivals`)
Stores wool receival data.

**Fields:**
- `id` (string): Unique identifier
- `sale_id` (string): Reference to sale record
- `producer_name` (string): Producer name
- `bales_received` (number): Number of bales received
- `total_mass_kg` (number): Total mass received
- `average_micron` (number): Average micron
- `average_length` (number): Average length

### 9. Offering Analysis Collection (`offering_analysis`)
Stores detailed offering analysis data.

**Fields:**
- `id` (string): Unique identifier
- `sale_id` (string): Reference to sale record
- `style` (string): Wool style
- `length_range` (string): Length range
- `micron_range` (string): Micron range
- `bales_offered` (number): Bales offered
- `bales_sold` (number): Bales sold
- `average_price` (number): Average price
- `clearance_rate` (number): Clearance rate

### 10. Buyer Purchases Collection (`buyer_purchases`)
Stores buyer purchase data.

**Fields:**
- `id` (string): Unique identifier
- `sale_id` (string): Reference to sale record
- `buyer_name` (string): Buyer name
- `bales_purchased` (number): Number of bales purchased
- `total_value` (number): Total purchase value
- `average_price` (number): Average price paid
- `share_percentage` (number): Share of total purchases

### 11. Sale Analysis Totals Collection (`sale_analysis_totals`)
Stores aggregated sale analysis data.

**Fields:**
- `id` (string): Unique identifier
- `sale_id` (string): Reference to sale record
- `category` (string): Analysis category
- `total_bales` (number): Total bales
- `total_value` (number): Total value
- `average_price` (number): Average price
- `percentage_share` (number): Percentage share

### 12. Bales Sold by Length Collection (`bales_sold_by_length`)
Stores bales sold data grouped by length.

**Fields:**
- `id` (string): Unique identifier
- `sale_id` (string): Reference to sale record
- `length_range` (string): Length range (e.g., "40-50mm")
- `bales_sold` (number): Number of bales sold
- `average_price` (number): Average price
- `total_value` (number): Total value

### 13. Bales Sold by Style Collection (`bales_sold_by_style`)
Stores bales sold data grouped by style.

**Fields:**
- `id` (string): Unique identifier
- `sale_id` (string): Reference to sale record
- `style` (string): Wool style (e.g., "MF4", "MF5", "MF6")
- `bales_sold` (number): Number of bales sold
- `average_price` (number): Average price
- `total_value` (number): Total value

### 14. Average Prices Clean Collection (`average_prices_clean`)
Stores average clean prices by various criteria.

**Fields:**
- `id` (string): Unique identifier
- `sale_id` (string): Reference to sale record
- `style` (string): Wool style
- `length_mm` (number): Length in millimeters
- `micron` (number): Micron value
- `cert` (string): Certification status ("certified" or "non-certified")
- `avg_price_r_ckg` (number): Average price in R per clean kg

### 15. Report Ingest Audit Collection (`report_ingest_audit`)
Stores audit information for report ingestion processes.

**Fields:**
- `id` (string): Unique identifier
- `ingest_date` (string): Date of ingestion
- `source` (string): Data source
- `status` (string): Ingest status
- `records_processed` (number): Number of records processed
- `errors` (array): List of errors encountered
- `processing_time_ms` (number): Processing time in milliseconds

### 16. Seasons Collection (`seasons`)
Stores season information for wool selling seasons.

**Fields:**
- `id` (string): Unique identifier
- `year` (string): Season year (e.g., "2025/2026")
- `start_date` (string): Season start date (YYYY-MM-DD)
- `end_date` (string): Season end date (YYYY-MM-DD)
- `number_of_auctions` (number): Expected number of auctions in season
- `created_at` (string): ISO timestamp of creation
- `updated_at` (string): ISO timestamp of last update

## Database Methods

### Cape Wools Reports Methods

#### `createCapeWoolsReport(reportData)`
Creates a new Cape Wools report record.

**Parameters:**
- `reportData` (object): Report data object

**Returns:**
- Created report object with generated ID and timestamps

#### `getCapeWoolsReport(id)`
Retrieves a Cape Wools report by ID.

**Parameters:**
- `id` (string): Report ID

**Returns:**
- Report object or null if not found

#### `getAllCapeWoolsReports()`
Retrieves all Cape Wools reports, sorted by creation date (newest first).

**Returns:**
- Array of report objects

#### `getLatestCapeWoolsReport()`
Retrieves the most recent Cape Wools report.

**Returns:**
- Latest report object or null if no reports exist

#### `updateCapeWoolsReport(id, updateData)`
Updates an existing Cape Wools report.

**Parameters:**
- `id` (string): Report ID
- `updateData` (object): Data to update

**Returns:**
- Updated report object

#### `deleteCapeWoolsReport(id)`
Deletes a Cape Wools report.

**Parameters:**
- `id` (string): Report ID

**Returns:**
- Deleted report object

### Enhanced Sales Methods

#### `saveAuctionReportDraft(reportData)`
Saves an auction report as draft.

**Parameters:**
- `reportData` (object): Report data object

**Returns:**
- Saved report object with status set to 'draft'

#### `publishAuctionReport(id)`
Publishes a draft auction report.

**Parameters:**
- `id` (string): Report ID

**Returns:**
- Updated report object with status set to 'published' and published_at timestamp

#### `getReportsByStatus(status)`
Retrieves reports filtered by status.

**Parameters:**
- `status` (string): Report status ('draft', 'published', 'archived')

**Returns:**
- Array of reports with the specified status

### Seasons Methods

#### `createSeason(seasonData)`
Creates a new season record.

**Parameters:**
- `seasonData` (object): Season data object

**Returns:**
- Created season object with generated ID and timestamps

#### `getAllSeasons()`
Retrieves all seasons, sorted by year.

**Returns:**
- Array of season objects

#### `getSeasonStats(seasonId)`
Retrieves calculated statistics for a season.

**Parameters:**
- `seasonId` (string): Season ID

**Returns:**
- Object containing auction count, total bales, total volume, and total turnover

#### `updateSeason(id, updateData)`
Updates an existing season.

**Parameters:**
- `id` (string): Season ID
- `updateData` (object): Data to update

**Returns:**
- Updated season object

#### `deleteSeason(id)`
Deletes a season.

**Parameters:**
- `id` (string): Season ID

**Returns:**
- Deleted season object

## Data Relationships

### Primary Relationships
- **Sales** → **Indicators**: One-to-many (sale_id)
- **Sales** → **Exchange Rates**: One-to-many (sale_id)
- **Sales** → **Buyer Purchases**: One-to-many (sale_id)
- **Sales** → **Offering Analysis**: One-to-many (sale_id)
- **Sales** → **Average Prices Clean**: One-to-many (sale_id)
- **Seasons** → **Sales**: One-to-many (season field)

### Cape Wools Reports
- **Cape Wools Reports** are standalone records that contain all form data
- They are not directly linked to the traditional sales records
- They represent the complete market report data from the Cape Wools form
- **Status Management**: Reports have status ('draft', 'published', 'archived') for workflow management
- **Cape Wools Commentary**: Integration of official Cape Wools market commentary

### Enhanced Relationships
- **Sales Status**: Sales records now include status for draft/publish workflow
- **Season Analytics**: Seasons link to sales for calculating aggregated statistics
- **Pagination Support**: Sales records include is_empty field for pagination empty rows

## Storage Implementation

### Local Storage (Development)
- Uses browser localStorage for development
- Data is stored as JSON strings
- Keys are prefixed with `wool_market_`

### Database Storage (Production)
- Uses JSON file-based storage in `server/database.json`
- Includes backup and restore functionality
- Supports concurrent access with file locking

## Sample Data

The database includes sample Cape Wools report data based on the Cape Wools market report from September 17, 2025:

```json
{
  "id": "sample-cape-wools-report-001",
  "auction": {
    "season_label": "2025/26",
    "catalogue_name": "CG05",
    "auction_date": "2025-09-17",
    "auction_center": "Port Elizabeth"
  },
  "market_indices": {
    "merino_indicator_sa_cents_clean": 19755,
    "certified_indicator_sa_cents_clean": 20261
  },
  "supply_stats": {
    "offered_bales": 6507,
    "sold_bales": 6084,
    "clearance_rate_pct": 93.5
  }
}
```

## Usage Examples

### Creating a Cape Wools Report
```javascript
const reportData = {
  auction: { /* auction data */ },
  market_indices: { /* market indices */ },
  currency_fx: { /* exchange rates */ },
  supply_stats: { /* supply statistics */ },
  highest_price: { /* highest price data */ },
  certified_share: { /* certified share data */ },
  greasy_stats: { /* greasy statistics */ }
};

const report = await AuctionDataService.saveCapeWoolsReport(reportData);
```

### Retrieving Latest Report
```javascript
const latestReport = await AuctionDataService.getLatestCapeWoolsReport();
```

### Updating a Report
```javascript
const updatedReport = await AuctionDataService.updateCapeWoolsReport(
  reportId, 
  { market_indices: { /* updated data */ } }
);
```

## Migration Notes

When migrating from the old structure to the new Cape Wools structure:

1. **Field Name Changes**: Some field names have been updated to be more descriptive
2. **New Collections**: The `cape_wools_reports` collection is new and separate from existing sales data
3. **Data Structure**: Cape Wools reports use a flatter structure that matches the form data exactly
4. **Backward Compatibility**: Existing sales data remains unchanged and functional

## Enhanced Features

### Report Status Management
- **Draft/Publish Workflow**: Reports can be saved as drafts and published when ready
- **Status Tracking**: Reports have status field ('draft', 'published', 'archived')
- **Publishing Metadata**: Published reports include published_at timestamp and approval tracking
- **Version Control**: Reports support versioning for change tracking

### Season Analytics
- **Dynamic Statistics**: Real-time calculation of season metrics from actual auction data
- **Aggregated Data**: Seasons display total bales, volume, and turnover across all auctions
- **Auction Counts**: Actual number of auctions per season (not just expected)
- **Performance Tracking**: Monitor season progress with live data

### Input Formatting Enhancements
- **Currency Formatting**: Large numbers formatted with thousands separators (e.g., "125 000 000")
- **Catalogue Number Formatting**: Automatic 2-digit formatting with natural typing support
- **Real-time Validation**: Immediate feedback on data entry with enhanced validation
- **User Experience**: Improved input handling with backspace support and natural typing

### Pagination and Display
- **Minimum Rows**: Tables always display minimum 10 rows for consistent layout
- **Empty Row Padding**: Pagination uses is_empty field for consistent table height
- **Flexible Pagination**: Support for 10, 50, 100, 200, or All rows per page
- **Status Indicators**: Color-coded status badges for visual status identification

## Form Interface Enhancements

### Enhanced Layout (Latest Update)
- **95% Width Utilization**: The auction data capture form now uses 95% of the available page width instead of the previous `max-w-7xl` constraint
- **Improved Usability**: Wider form layout provides better space utilization and improved data entry experience
- **Responsive Design**: Form maintains responsiveness across different screen sizes while maximizing usable space
- **Better Data Entry**: Enhanced layout allows for more comfortable data entry with better field spacing and organization

### Technical Implementation
- **Container Updates**: Changed from `max-w-7xl mx-auto` to `w-[95%] mx-auto` for all form containers
- **Consistent Application**: Applied width changes to header, tab navigation, and form content containers
- **Maintained Centering**: Preserved centered layout with `mx-auto` while expanding width constraint
- **Preserved Functionality**: All existing form functionality and styling remains intact

## Future Enhancements

1. **Supabase Integration**: Migration to Supabase for production use
2. **Data Validation**: Enhanced validation rules for all fields
3. **Indexing**: Database indexes for improved query performance
4. **Audit Trail**: Enhanced audit logging for all data changes
5. **Data Export**: Export functionality for reports and analytics
6. **Form Analytics**: Track form usage patterns and optimize based on user behavior
