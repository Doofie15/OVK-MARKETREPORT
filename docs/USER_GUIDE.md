# OVK Wool Market Report Platform - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Market Reports](#market-reports)
4. [Analytics & Insights](#analytics--insights)
5. [Administrative Functions](#administrative-functions)
6. [Enhanced Auction Report Review](#enhanced-auction-report-review)
7. [Auctions Management](#auctions-management)
8. [Season Management](#season-management)
9. [Data Entry](#data-entry)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### Accessing the Platform
1. Open your web browser and navigate to the platform URL
2. The main dashboard will load automatically showing the latest auction
3. Use the navigation menu to access different sections
4. **Direct Auction Access**: Navigate directly to specific auctions using URLs like `/202501` or `/202552`

### URL-Based Navigation
The platform features advanced URL routing that allows direct access to specific auction reports:

#### URL Structure
- **Home Page**: `/` - Shows the latest auction (defaults to most recent)
- **Specific Auctions**: `/{year}{catalogue}` - Direct access to specific auctions
  - `/202501` - 2025 season, CAT01 auction
  - `/202552` - 2025 season, CAT52 auction
  - `/202401` - 2024 season, CAT01 auction

#### URL Format
- **Pattern**: 6-digit number where first 4 digits are the year, last 2 digits are the catalogue number
- **Season Logic**: Year 2025 corresponds to season "2025/26"
- **Validation**: Invalid URLs automatically redirect to the home page

#### Key Benefits
- **Shareable Links**: Bookmark and share specific auction reports
- **SEO Friendly**: Each auction has its own unique URL for better search engine indexing
- **Browser Navigation**: Full browser back/forward button support
- **Direct Access**: Users can directly access any auction by typing the URL

### Navigation
- **Market Overview**: Main dashboard with key metrics
- **Analytics**: Detailed market analysis and trends
- **Insights**: Market commentary and analysis
- **Admin Panel**: Administrative functions and data entry
- **URL Navigation**: Direct access to specific auctions via URLs

## Dashboard Overview

### Main Dashboard Layout
The dashboard is organized into several key sections:

#### 1. Header Section
- **OVK Logo**: Company branding
- **Navigation Menu**: Access to different platform sections
- **Admin Panel Button**: Quick access to administrative functions

#### 2. Auction Selection
- **Week Selector**: Choose different auction weeks to view
- **Date Range**: Current and previous auction dates
- **Quick Navigation**: Jump between recent auctions

#### 3. Key Performance Indicators (KPIs)
- **Total Lots**: Number of lots in the current auction
- **Total Volume**: Total bales sold
- **Average Price**: Average price per kilogram
- **Total Value**: Total auction value in ZAR

#### 4. Market Overview Cards
- **Exchange Rates**: Current ZAR/USD, ZAR/EUR, ZAR/JPY, ZAR/GBP rates
- **Next Auction**: Countdown to next auction
- **Certified Price Difference**: Certified wool price difference data

#### 5. Data Visualization Cards
- **2-Year Price Comparison**: Historical price trends
- **Micron Price Chart**: Price analysis by wool micron
- **Buyer Share Chart**: Market share visualization
- **Auction Comparison**: Week-over-week comparisons

## Market Reports

### Viewing Auction Reports
1. **Select Auction Week**: Use the auction selector to choose a specific week
2. **View Report Data**: All data updates automatically based on selection
3. **Navigate Between Weeks**: Use arrow buttons or dropdown to switch weeks
4. **URL Navigation**: The URL automatically updates when you select different auctions
5. **Direct Access**: Bookmark or share specific auction URLs (e.g., `/202501`, `/202552`)
6. **Browser Navigation**: Use browser back/forward buttons to navigate between previously viewed auctions

### Report Sections

#### Market Indicators
- **Merino Indicator**: Current merino wool pricing
- **Certified Indicator**: RWS certified wool pricing
- **AWEX EMI**: Australian Wool Exchange EMI
- **Change Percentages**: Week-over-week changes

#### Buyer Analysis
- **Top Buyers Table**: Ranked by market share
- **Volume Data**: Bales purchased in current auction
- **Market Share**: Percentage of total market
- **Performance Metrics**: Year-to-date comparisons

#### Broker Performance
- **Catalogue Offerings**: Bales offered by each broker
- **Sales Performance**: Actual sales vs offerings
- **Market Participation**: Broker market share

#### Provincial Data
- **Top Producers**: Best performing farms by province
- **Price Mapping**: Average prices by geographic region
- **Certification Impact**: RWS vs non-RWS pricing

## Analytics & Insights

### Market Trends
- **Historical Analysis**: Long-term price and volume trends
- **Seasonal Patterns**: Year-over-year comparisons
- **Certification Impact**: Certified price difference analysis
- **Geographic Trends**: Provincial performance analysis

### Top Performers
- **Provincial Rankings**: Top 10 producers by province
- **Price Analysis**: Highest performing lots
- **Certification Benefits**: RWS impact on pricing
- **Farm Performance**: Individual farm rankings

### Market Insights
- **Commentary**: Market analysis and insights
- **Trend Analysis**: Key market movements
- **Forecasting**: Market outlook and predictions
- **Recommendations**: Strategic insights for stakeholders

## Administrative Functions

### Accessing Admin Panel
1. Click the **Admin Panel** button in the header
2. Enter your administrative credentials
3. Access the full administrative interface

### Admin Dashboard
- **Report Management**: Create, edit, and delete auction reports
- **Data Import**: Upload CSV files for bulk data entry
- **User Management**: Manage user accounts and permissions
- **System Settings**: Configure platform settings

### Data Management
- **Backup & Restore**: Create and restore data backups
- **Data Validation**: Check data integrity and consistency
- **Export Functions**: Export data in various formats
- **Audit Trail**: Track all data changes and modifications

### AI-Powered Market Insights
The platform features an advanced AI-powered market insights composer that helps create professional market commentary:

#### AI Market Insights Composer
- **Intelligent Analysis**: AI analyzes current week's auction data against historical trends
- **Cape Wools Integration**: Incorporates official Cape Wools market commentary into analysis
- **Professional Content**: Generates industry-appropriate market insights and commentary
- **80-Word Optimization**: Content automatically optimized for small card display format
- **Real-time Enhancement**: One-click content enhancement with immediate results
- **OVK Brand Enhancement**: Always highlights OVK's positive market position and contributions

#### How to Use the AI Composer
1. **Navigate to Admin Panel** → **Edit Auction Report** → **Market Insights tab**
2. **Fill in auction data** (lots, prices, buyers, etc.)
3. **Paste Cape Wools commentary** in the Cape Wools Market Commentary field
4. **Write your initial insights** in the main text area
5. **Click "Enhance with AI"** button for intelligent content enhancement
6. **Review and refine** the AI-generated content as needed

#### Word Count Management
- **Real-time Feedback**: Visual word count display with color coding
- **80-Word Limit**: Automatic enforcement for card display optimization
- **Color Indicators**: Green (0-70 words), Yellow (71-80 words), Red (81+ words)
- **Warning System**: Alerts when content exceeds the 80-word limit

#### Configuration
- **API Key Setup**: Configure `VITE_GEMINI_API_KEY` in environment variables
- **Fallback Mode**: Works without API key using local enhancement algorithms
- **Professional Output**: Ready-to-use market commentary for reports

## Enhanced Auction Report Review

### Overview
The Enhanced Auction Report Review system provides comprehensive validation, completion tracking, and a professional draft/publish workflow for auction reports.

### Key Features
- **Real-time Validation**: Automatic field validation with visual feedback
- **Completion Tracking**: Live progress indicator showing report completeness
- **Draft System**: Save work in progress for later completion
- **Publish Workflow**: Finalize reports for public viewing
- **Status Management**: Clear status indicators (Draft/Published)

### Using the Review System

#### 1. Accessing the Review Tab
1. Navigate to **Admin Panel** → **Edit Auction Report**
2. Fill in auction data across all tabs
3. Click on the **"Review & Save"** tab

#### 2. Understanding Completion Status
- **Progress Bar**: Visual indicator of report completeness
- **Completion Percentage**: Shows overall completion status
- **Missing Fields Alert**: Lists required fields that need attention
- **Status Badge**: Displays current report status (Draft/Published)

#### 3. Data Validation
The system validates essential fields for public reports:
- **Auction Date**: Required for report identification
- **Catalogue Name**: Essential for auction reference
- **Total Lots (Bales)**: Core auction data
- **Total Volume (Mass)**: Important for market analysis
- **Total Value (Turnover)**: Key financial metric
- **Clearance Rate**: Market performance indicator
- **Merino Indicator**: Market benchmark
- **Certified Indicator**: RWS market benchmark
- **ZAR/USD Exchange Rate**: Currency reference

#### 4. Draft Management
- **Save as Draft**: Preserve work in progress
- **Draft Status**: Reports saved as drafts are marked accordingly
- **Edit Drafts**: Continue editing draft reports anytime
- **Draft Confirmation**: Confirmation modal before saving draft

#### 5. Publishing Reports
- **Finalize & Publish**: Make report publicly visible
- **Publishing Threshold**: Requires 85% completion for publishing
- **Publish Confirmation**: Detailed confirmation modal
- **Status Update**: Automatic status change to "Published"

### Review Interface Components

#### Data Overview Cards
- **Data Completeness**: Shows counts for Buyers, Brokers, Provinces, Micron Prices
- **Report Summary**: Displays Season, Catalogue, Sale Number, Auction Center
- **Market Performance**: Shows key indicators (Merino, Certified, AWEX EMI)
- **Currency Exchange**: Displays all 5 major currency pairs

#### Auction Overview
- **Total Lots**: Number of bales in auction
- **Total Volume**: Total mass in kilograms
- **Total Value**: Total turnover in ZAR

#### Action Buttons
- **Save as Draft**: Preserve current progress
- **Finalize & Publish**: Complete and publish report
- **Disabled States**: Buttons disabled during saving or insufficient completion

## Auctions Management

### Enhanced Auctions Table
The Auctions Management page provides comprehensive auction tracking with advanced features.

### Overview Cards
- **Total Auctions**: Count of all auctions in the system
- **Total Bales Sold**: Sum of all bales sold across auctions
- **Total Volume**: Total volume in kilograms
- **Turnover**: Total financial turnover in ZAR
- **Last Auction**: Date of the most recent auction

### Table Features
- **Pagination**: Navigate through large datasets efficiently
- **Rows Per Page**: Select 10, 50, 100, 200, or All rows
- **Minimum 10 Rows**: Always displays at least 10 rows for consistent layout
- **Status Indicators**: Color-coded status badges (Published/Draft/New)
- **Action Dropdown**: Three-dot horizontal menu with contextual actions

### Table Columns
1. **Selector**: Checkbox for bulk operations
2. **Auction Date**: Formatted auction date
3. **Catalogue Name**: Formatted catalogue reference (CAT01, CAT02, etc.)
4. **Week ID**: Generated week identifier
5. **Season**: Season label (e.g., "2025/2026")
6. **Status**: Current report status with color coding
7. **Bales Offered**: Number of bales offered for sale
8. **Bales Sold**: Number of bales actually sold
9. **Clearance %**: Percentage of bales sold
10. **Turnover**: Total turnover in ZAR millions
11. **Actions**: Dropdown menu with available actions

### Action Menu Options
- **Publish**: Convert draft to published (only for drafts)
- **View**: View auction report details
- **Edit**: Edit auction report data
- **Delete**: Remove auction report (with confirmation)

### Using the Auctions Table
1. **Browse Auctions**: Use pagination to navigate through auctions
2. **Filter Data**: Use the search functionality to find specific auctions
3. **Bulk Operations**: Select multiple auctions for bulk actions
4. **Individual Actions**: Use the action dropdown for specific operations
5. **Status Management**: Monitor and manage report statuses

## Season Management

### Season Analytics
The Season Management page provides comprehensive analytics for each wool selling season.

### Enhanced Season Table
- **Real-time Statistics**: Dynamic calculation of season metrics
- **Auction Counts**: Actual number of auctions per season
- **Aggregated Data**: Sum of bales, volume, and turnover per season
- **Visual Indicators**: Color-coded badges for different metrics

### Table Columns
1. **Year**: Season identifier (e.g., "2025/2026")
2. **Start Date**: Season start date
3. **End Date**: Season end date
4. **Number of Auctions**: Count of auctions in season (blue badge)
5. **# Bales**: Total bales sold in season (green badge)
6. **Total Volume**: Total volume in kg (purple badge)
7. **Total Turnover**: Total turnover in ZAR millions (yellow badge)
8. **Actions**: View/Edit and Delete buttons

### Statistics Calculation
- **Dynamic Aggregation**: Real-time calculation from actual auction data
- **Season Filtering**: Auctions filtered by season year
- **Fallback Values**: Zero values for missing data
- **Proper Formatting**: Number formatting with thousands separators

### Using Season Management
1. **View Season Overview**: See comprehensive season statistics at a glance
2. **Compare Seasons**: Compare performance across different seasons
3. **Track Progress**: Monitor season progress with real-time data
4. **Manage Seasons**: Edit or delete season records as needed

## Data Entry

### Cape Wools Data Capture
The platform includes a comprehensive form for capturing Cape Wools weekly report data with an enhanced layout that utilizes 95% of the page width for improved usability:

#### Enhanced Form Layout
- **95% Width Utilization**: The form now uses 95% of the available page width for better space utilization
- **Improved Data Entry**: Wider layout provides more comfortable data entry experience
- **Better Field Organization**: Enhanced spacing and organization of form fields
- **Responsive Design**: Maintains responsiveness across different screen sizes

#### Enhanced Input Formatting
- **Currency Formatting**: Large numbers automatically formatted with thousands separators (e.g., "125 000 000")
- **Catalogue Number Formatting**: Automatic 2-digit formatting (e.g., "01", "02", "15") with natural typing support
- **Real-time Formatting**: Formatting applied as you type for immediate visual feedback
- **Backspace Support**: Natural backspace behavior with formatting preserved

#### Form Structure
The form is organized into 9 logical sections:

1. **Auction Details**
   - Sale number and date
   - Catalogue name and auction center
   - PDF filename for reference

2. **Market Indices**
   - Merino and certified indicators
   - AWEX EMI with change percentages
   - Market benchmark data

3. **Currency Exchange**
   - ZAR/USD, ZAR/EUR, ZAR/JPY, ZAR/GBP rates
   - High precision exchange rates
   - Historical rate tracking

4. **Supply & Statistics**
   - Bales offered and sold
   - Clearance rates and withdrawals
   - Highest price lots
   - Certified share percentages

5. **Micron Prices**
   - Basic micron pricing
   - Certified vs non-certified comparisons
   - Percentage difference calculations

6. **Buyers & Brokers**
   - Market participation data
   - Catalogue offerings
   - Sales performance metrics

7. **Provincial Data**
   - Top producers by province
   - Average prices by region
   - Certification impact analysis

8. **Market Insights**
   - Commentary and analysis
   - Trend observations
   - Market outlook

9. **Review & Save**
   - Data completeness summary
   - Final validation
   - Save and publish options

### Data Entry Best Practices
- **Complete All Required Fields**: Ensure all mandatory fields are filled
- **Validate Data**: Use built-in validation to check data accuracy
- **Save Regularly**: Use draft functionality to save work in progress
- **Review Before Publishing**: Always review data before final submission
- **Utilize Enhanced Layout**: Take advantage of the wider form layout for more efficient data entry
- **Mobile Compatibility**: The enhanced form maintains full mobile responsiveness

### Bulk Data Import
1. **Prepare CSV File**: Format data according to template
2. **Upload File**: Use the import function in admin panel
3. **Validate Data**: Check imported data for accuracy
4. **Process Import**: Complete the import process

## Troubleshooting

### Common Issues

#### Data Not Loading
- **Check Internet Connection**: Ensure stable internet connection
- **Refresh Browser**: Try refreshing the page
- **Clear Cache**: Clear browser cache and cookies
- **Check Server Status**: Verify backend server is running

#### Login Issues
- **Verify Credentials**: Check username and password
- **Check Account Status**: Ensure account is active
- **Contact Administrator**: Request password reset if needed

#### Performance Issues
- **Close Other Tabs**: Reduce browser memory usage
- **Update Browser**: Use latest browser version
- **Check System Resources**: Ensure adequate RAM and CPU

#### Data Entry Problems
- **Validate Input**: Check data format and requirements
- **Save Draft**: Use draft functionality to preserve work
- **Check Required Fields**: Ensure all mandatory fields are completed

### Error Messages

#### "Data Not Found"
- The requested auction report doesn't exist
- Check auction week selection
- Verify data has been entered

#### "Validation Error"
- Input data doesn't meet requirements
- Check field formats and values
- Review validation messages

#### "Server Error"
- Backend server is experiencing issues
- Try again in a few minutes
- Contact technical support if persistent

### Getting Help

#### Support Channels
- **Technical Support**: Contact development team
- **User Documentation**: Refer to this guide
- **Training Materials**: Access training resources
- **Community Forum**: Connect with other users

#### Reporting Issues
When reporting issues, please include:
- **Description**: Clear description of the problem
- **Steps to Reproduce**: How to recreate the issue
- **Expected vs Actual**: What should happen vs what happens
- **Browser Information**: Browser type and version
- **Screenshots**: Visual evidence of the issue

## Best Practices

### Data Management
- **Regular Backups**: Create regular data backups
- **Data Validation**: Always validate data before saving
- **Version Control**: Keep track of data changes
- **Access Control**: Limit access to authorized users only

### Performance Optimization
- **Efficient Navigation**: Use quick navigation features
- **Data Filtering**: Use filters to focus on relevant data
- **Regular Updates**: Keep the platform updated
- **System Maintenance**: Perform regular system maintenance

### Security
- **Strong Passwords**: Use strong, unique passwords
- **Regular Updates**: Keep credentials updated
- **Access Monitoring**: Monitor user access and activities
- **Data Protection**: Follow data protection guidelines

## Conclusion

The OVK Wool Market Report Platform provides comprehensive tools for managing and analyzing wool market data. By following this guide and best practices, users can effectively utilize all platform features to gain valuable market insights and make informed decisions.

For additional support or questions, please contact the development team or refer to the technical documentation.
