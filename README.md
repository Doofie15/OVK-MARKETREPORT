# OVK Wool Market Report Platform

<div align="center">
<img width="1200" height="475" alt="OVK Wool Market Report Dashboard" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A comprehensive React-based web application for tracking and analyzing wool market data from weekly auctions in South Africa. This platform provides detailed market insights, performance analytics, and administrative tools for managing auction reports with a professional, structured interface.

## 🎯 Latest Updates

- ✅ **Enhanced Mobile Card Consistency**: Fixed width inconsistencies in mobile cards for uniform appearance across all sections
- ✅ **Improved Mobile Header Styling**: Full-width color banners in mobile card headers for better visual hierarchy
- ✅ **Provincial Top 10 Map Improvements**: Renamed from "Provincial Price Map" with clearer explanatory text
- ✅ **Micron Category Correction**: Fixed wool categorization (21μ, 21.5μ, 22μ now correctly labeled as "Strong" instead of "Medium")
- ✅ **Mobile Chart Optimization**: Increased chart display area by 25-30% with reduced padding and optimized text elements
- ✅ **Broker Rate Calculation Fix**: Corrected percentage calculation in broker performance cards
- ✅ **Publication Timestamps**: Added "Updated" timestamps showing when data was last published
- ✅ **Top 10 Data Limitation**: Implemented consistent 10-record limit for provincial producer data
- ✅ **Province Header Enhancement**: Added color-coded province headers with improved visual prominence
- ✅ **Complete User Management System**: Full user administration with role-based access control and approval workflow
- ✅ **Database Schema Normalization**: Removed redundant status column, using proper foreign key relationships with user_types table
- ✅ **User Types & Permissions**: Comprehensive role system (super_admin, admin, editor, viewer) with granular permissions
- ✅ **User Approval Workflow**: New users require admin approval before gaining access to the system
- ✅ **Production Database Cleanup**: Cleaned all test data while preserving essential structure and super admin account
- ✅ **Fixed Database Relationships**: Resolved infinite recursion in RLS policies and relationship mapping issues
- ✅ **Enhanced Authentication**: Improved user authentication with proper profile management and session handling
- ✅ **Complete Edit Auction Functionality**: Full CRUD operations for auction data with proper create/update logic
- ✅ **Fixed Buyer & Broker Performance**: Resolved data saving issues with proper foreign key mapping
- ✅ **Database Schema Optimization**: Updated table structures for micron_prices, buyer_performance, and broker_performance
- ✅ **CASCADE Deletion**: Automatic cleanup of related data when auctions are deleted
- ✅ **URL-Based Auction Routing**: Direct access to specific auctions via season+catalogue URLs (e.g., /202501, /202552)
- ✅ **Shareable Auction Links**: Bookmark and share specific auction reports with clean, descriptive URLs
- ✅ **Browser Navigation**: Full browser back/forward button support for auction navigation
- ✅ **SEO-Friendly URLs**: Each auction has its own unique URL for better search engine indexing
- ✅ **Enhanced Auction Report Review**: Comprehensive validation system with completion tracking and draft/publish workflow
- ✅ **Status Management**: Real-time auction status tracking (Draft/Published) with automatic refresh
- ✅ **Advanced Auctions Management**: Enhanced table with pagination, dropdown actions, and comprehensive statistics
- ✅ **Season Management Analytics**: Real-time calculation of auction counts, bales, volume, and turnover per season
- ✅ **Input Formatting Improvements**: Currency formatting with thousands separators and 2-digit catalogue number formatting
- ✅ **AI-Powered Market Insights**: Google Gemini AI integration for intelligent market commentary generation
- ✅ **Smart Content Enhancement**: AI analyzes auction data and Cape Wools commentary to create professional insights
- ✅ **80-Word Card Optimization**: AI-generated content optimized for small card display format with automatic word limiting
- ✅ **OVK Brand Enhancement**: AI always highlights OVK's positive market position and contributions
- ✅ **Fallback Enhancement**: Robust local enhancement when AI API is not available
- ✅ **Mobile-First Design**: Complete mobile component library with responsive layouts and touch-optimized interfaces
- ✅ **Enhanced Mobile Experience**: Dedicated mobile components for all major features including charts, tables, and data visualization
- ✅ **Responsive Component System**: Smart layout switching between desktop and mobile views with automatic breakpoint detection
- ✅ **Mobile-Optimized Charts**: Touch-friendly chart components with mobile-specific interactions and sizing
- ✅ **Professional Styling**: Refined visual design with consistent spacing and alignment
- ✅ **Fixed Commodity Validation**: Resolved completion check to use commodity_type_id instead of deprecated commodity field
- ✅ **Market Insights Database Integration**: Fixed market insights saving to database with proper CRUD operations
- ✅ **Enhanced AI Content Preservation**: AI now preserves user's original content as foundation while enhancing it professionally
- ✅ **Improved AI Data Validation**: AI validates auction data before using it to avoid "zero bales offered" issues
- ✅ **Cleaner UI Design**: Removed debug information from review interface for professional appearance
- ✅ **Public Page Integration**: Complete integration of public-facing page with live database data
- ✅ **Published Reports System**: Public page now displays data from published auction reports instead of mock data
- ✅ **Enhanced Market Overview Cards**: Added season-to-date totals underneath current auction values
- ✅ **Provincial Price Map**: Interactive SVG map showing average certified and Merino values by province
- ✅ **Responsive Map Design**: Fully responsive price map with mobile optimization and flexbox layout
- ✅ **Provincial Data Sorting**: Alphabetical sorting of provinces with Lesotho positioned at bottom
- ✅ **Enhanced Data Visualization**: Improved charts, tables, and data presentation across all components
- ✅ **Complete Data Pipeline**: End-to-end data flow from admin capture to public display

## 📋 Project Overview

This application serves as a comprehensive market intelligence platform for the South African wool and mohair industry, specifically designed for OVK (Oos-Vrystaat Koöperasie). It provides real-time market data visualization, historical trend analysis, and administrative tools for managing weekly auction reports.

### Key Capabilities
- **Real-time Market Data**: Live auction results, pricing trends, and market indicators
- **Comprehensive Analytics**: Buyer behavior analysis, broker performance tracking, and provincial producer rankings
- **Administrative Interface**: Complete data capture system for Cape Wools weekly reports
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Data Management**: Local storage with structured data models and transformation utilities

## 🚀 Features

### 📊 Market Reports Dashboard
- **Interactive Auction Selection**: Choose between different auction weeks to view detailed reports
- **URL-Based Navigation**: Direct access to specific auctions via season+catalogue URLs (e.g., /202501, /202552)
- **Shareable Links**: Bookmark and share specific auction reports with clean, descriptive URLs
- **Browser Navigation**: Full browser back/forward button support for seamless navigation
- **Key Performance Indicators**: Track total lots, volume, average prices, and total value with YTD comparisons
- **Market Benchmarks**: Monitor certified, all-Merino, and AWEX pricing benchmarks
- **Enhanced Market Overview**: Professional information board displaying live exchange rates, next auction countdown, and certified price difference data
- **Micron Price Analysis**: Visualize price trends across different wool micron categories (Fine, Medium, Strong)

### 📈 Analytics & Insights
- **Buyer Performance**: Track buyer market share, weekly purchases, and year-to-date bale counts
- **Broker Analytics**: Monitor broker catalogue offerings and sales performance
- **Top Producers**: Identify top-performing farms by province with detailed pricing and certification data
- **Market Trends**: Historical price comparisons between RWS and non-RWS wool across different periods
- **Provincial Analysis**: Geographic breakdown of average prices and top producers by South African provinces

### 🛠️ Administrative Tools
- **Complete User Management System**: Full user administration with role-based access control and approval workflow
- **User Types & Permissions**: Comprehensive role system (super_admin, admin, editor, viewer) with granular permissions
- **User Approval Workflow**: New users require admin approval before gaining access to the system
- **Enhanced Authentication**: Improved user authentication with proper profile management and session handling
- **Enhanced Auction Report Review**: Comprehensive validation system with completion tracking and draft/publish workflow
- **Status Management**: Real-time auction status tracking (Draft/Published) with automatic refresh
- **Advanced Auctions Management**: Enhanced table with pagination, dropdown actions, and comprehensive statistics
- **Season Management Analytics**: Real-time calculation of auction counts, bales, volume, and turnover per season
- **Cape Wools Data Capture**: Comprehensive form system for capturing all Cape Wools weekly report data
- **Tabbed Data Entry**: Organized sections for auction details, market indices, currency exchange, supply statistics, and micron price comparisons
- **AI-Powered Market Insights**: Google Gemini AI integration for intelligent market commentary generation
- **Smart Content Enhancement**: AI analyzes auction data and Cape Wools commentary to create professional insights
- **80-Word Card Optimization**: Content automatically optimized for small card display format
- **Report Management**: Create and edit auction reports with comprehensive data entry forms
- **Data Validation**: Built-in validation for market data consistency
- **Historical Tracking**: Maintain complete auction history with automatic YTD calculations
- **Advanced Analytics**: Support for certified vs non-certified price comparisons and market trend analysis

## 🏗️ Architecture

### Frontend Stack
- **React 19.1.1** with TypeScript for type-safe development
- **Vite 6.2.0** for fast development and building
- **Material-UI (MUI) 7.3.2** for component library and theming
- **ApexCharts 5.3.4** for advanced data visualization
- **Recharts 3.1.2** for additional chart components
- **Custom CSS** with CSS variables for theming and responsive design
- **HTML2Canvas & jsPDF** for report generation and PDF export

### Backend Stack
- **Supabase** for PostgreSQL database with real-time capabilities
- **Node.js** with Express.js for API server (legacy support)
- **JSON-based storage** for data persistence (legacy support)
- **CORS enabled** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for request logging
- **UUID** for unique identifier generation

### Project Structure
```
├── App.tsx                 # Main application component with routing logic
├── types.ts               # TypeScript interfaces for all data structures (including Cape Wools schema)
├── constants.ts           # Mock data and configuration constants
├── index.css              # Global styles with CSS variables and responsive design
├── vite.config.ts         # Build configuration with environment variables
├── cape-wools-weekly-reports.schema+data.json # Cape Wools data schema and sample data
├── data/                  # Data management layer
│   ├── supabase-service.ts # Supabase database service with full CRUD operations
│   ├── service.ts         # Auction data service for CRUD operations (legacy)
│   ├── api-service.ts     # API service for backend communication (legacy)
│   ├── storage.ts         # Local storage management (legacy)
│   ├── transformers.ts    # Data transformation utilities
│   ├── models.ts          # Data model definitions
│   └── index.ts           # Data layer exports
├── lib/                   # External library configurations
│   └── supabase.ts        # Supabase client configuration
├── server/                # Backend API server
│   ├── server.js          # Express.js server setup
│   ├── database.js        # JSON database management
│   ├── database.json      # JSON data storage
│   ├── seed.js            # Database seeding script
│   └── package.json       # Server dependencies
├── components/            # Reusable UI components
│   ├── admin/            # Administrative interface components
│   │   ├── AdminForm.tsx # Comprehensive data entry form
│   │   ├── AuctionDataCaptureForm.tsx # Cape Wools data capture form with tabbed interface
│   │   ├── AIMarketInsightsComposer.tsx # AI-powered market insights composer
│   │   ├── AdminDashboard.tsx # Main admin dashboard
│   │   ├── AdminLayout.tsx # Admin layout wrapper
│   │   ├── AdminSidebar.tsx # Navigation sidebar
│   │   ├── CSVImport.tsx # CSV data import functionality
│   │   ├── AuctionsList.tsx # Auction management list
│   │   └── LoginPage.tsx # Admin authentication
│   ├── mobile/           # Mobile-optimized components
│   │   ├── index.ts      # Mobile components export
│   │   ├── MobileLayout.tsx # Responsive layout wrapper with breakpoint detection
│   │   ├── MobileCard.tsx # Mobile-optimized card component
│   │   ├── MobileChart.tsx # Touch-friendly chart component
│   │   ├── MobileDataTable.tsx # Mobile data table with responsive design
│   │   ├── MobileBrokersGrid.tsx # Mobile broker performance grid
│   │   ├── MobileBuyerShareChart.tsx # Mobile buyer share visualization
│   │   ├── MobileMarketTrends.tsx # Mobile market trends display
│   │   ├── MobileTopPerformers.tsx # Mobile top performers table
│   │   ├── MobileProvincialTopProducers.tsx # Mobile provincial producer rankings
│   │   └── MobileProvincePriceMap.tsx # Mobile provincial price mapping
│   ├── IndicatorsGrid.tsx    # KPI display grid
│   ├── MicronPriceChart.tsx # Price vs micron visualization
│   ├── TopSalesTable.tsx    # Top sales performance table
│   ├── MarketTrends.tsx     # Historical trend analysis
│   ├── ProvincialTopProducers.tsx # Provincial producer rankings
│   ├── MarketOverview.tsx   # Market overview dashboard
│   ├── BuyerListTable.tsx   # Buyer performance table
│   ├── BuyerShareChart.tsx  # Buyer market share visualization
│   ├── BrokersGrid.tsx      # Broker performance grid
│   ├── TopPerformers.tsx    # Top performing producers
│   ├── AuctionComparison.tsx # Week-over-week comparison
│   ├── InsightsCard.tsx     # Market insights display
│   ├── ModernChart.tsx      # Reusable chart component
│   ├── ProvincePriceMap.tsx # Provincial price mapping
│   ├── AuctionSelector.tsx  # Auction week selector
│   ├── Header.tsx           # Application header
│   ├── AdminPanel.tsx       # Admin panel wrapper
│   └── AdminFormSection.tsx # Admin form section component
├── services/              # External service integrations
│   └── gemini-ai.ts      # Google Gemini AI service integration
└── public/
    └── assets/
        └── logos/
            └── ovk-logo-embedded.svg # OVK company logo
```

## 🔗 URL Routing & Navigation

The platform features an advanced URL routing system that allows direct access to specific auction reports:

### URL Structure
- **Home Page**: `/` - Shows the latest auction (defaults to most recent)
- **Specific Auctions**: `/{year}{catalogue}` - Direct access to specific auctions
  - `/202501` - 2025 season, CAT01 auction
  - `/202552` - 2025 season, CAT52 auction
  - `/202401` - 2024 season, CAT01 auction

### URL Format
- **Pattern**: 6-digit number where first 4 digits are the year, last 2 digits are the catalogue number
- **Season Logic**: Year 2025 corresponds to season "2025/26"
- **Validation**: Invalid URLs automatically redirect to the home page

### Key Benefits
- **Shareable Links**: Bookmark and share specific auction reports
- **SEO Friendly**: Each auction has its own unique URL for better search engine indexing
- **Browser Navigation**: Full browser back/forward button support
- **Direct Access**: Users can directly access any auction by typing the URL

### Example URLs
- `www.ovkfiber.co.za/` → Latest auction (2025 season, CAT01)
- `www.ovkfiber.co.za/202501` → 2025 season, CAT01 auction report
- `www.ovkfiber.co.za/202552` → 2025 season, CAT52 auction report

## 🗄️ Database Integration

The application now features full Supabase integration with a comprehensive PostgreSQL database schema:

### Database Schema
- **users**: User management with role-based access control and approval workflow
- **user_types**: User role definitions (super_admin, admin, editor, viewer) with granular permissions
- **seasons**: Season management with 12-month cycles
- **auctions**: Core auction data with status tracking (Draft/Published)
- **micron_prices**: Micron-specific pricing data with certified vs non-certified comparisons
- **buyer_performance**: Buyer market share and performance tracking
- **broker_performance**: Broker catalogue offerings and sales performance
- **top_performers**: Provincial producer rankings and performance data
- **market_insights**: AI-generated market commentary and analysis
- **buyers**: Buyer master data with foreign key relationships
- **brokers**: Broker master data with foreign key relationships
- **provinces**: South African province reference data
- **certifications**: Certification type reference data
- **commodity_types**: Commodity type reference data

### Key Features
- **Full CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Foreign Key Relationships**: Proper data integrity with CASCADE deletion
- **Real-time Updates**: Live data synchronization across the application
- **Data Validation**: Database-level constraints and validation
- **Audit Trail**: Created/updated timestamps and user tracking
- **Optimized Queries**: Efficient data retrieval with proper indexing

### Edit Auction Functionality
- **Create New Auctions**: Full form-based auction creation with all data sections
- **Edit Existing Auctions**: Complete edit functionality with data loading and saving
- **Draft System**: Save incomplete data as drafts for later completion
- **Publish Workflow**: Finalize and publish completed auction reports
- **Data Persistence**: All form data properly saved to database tables
- **Relationship Management**: Proper handling of related data across tables

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 18 or higher recommended)
- **npm** or **yarn** package manager
- **Supabase Account** for database hosting

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wool-&-mohair-market-report
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Google Gemini AI Configuration
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Application Configuration
   VITE_APP_NAME=OVK Wool Market Report
   VITE_APP_VERSION=1.0.0
   
   # API Configuration (for backend integration)
   VITE_API_URL=http://localhost:3001
   ```

4. **Start the backend server** (in a separate terminal)
   ```bash
   cd server
   npm install
   npm start
   ```

5. **Start the frontend development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: Navigate to `http://localhost:5173` to view the application
   - Backend API: Available at `http://localhost:3001`

### Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build production-ready application
- **`npm run preview`** - Preview production build locally

## 📊 Data Structure

The application manages comprehensive auction data with a sophisticated data architecture:

### Core Auction Data
- **Auction Details**: Week information, dates, catalogue names, sale numbers, auction centers
- **Market Indicators**: Volume, pricing, and performance metrics with YTD calculations
- **Buyer Analytics**: Market share and purchasing patterns with historical tracking
- **Producer Performance**: Top farms by province with detailed pricing and certification data
- **Quality Metrics**: Micron specifications, certification status (RWS), and lot descriptions
- **Geographic Data**: Provincial breakdowns and district information across all 9 SA provinces

### Cape Wools Integration
- **Market Indices**: Merino indicator, certified indicator, AWEX EMI with change percentages
- **Currency Exchange**: ZAR/USD, ZAR/EUR, ZAR/JPY, ZAR/GBP, USD/AUD rates with historical tracking
- **Supply Statistics**: Offered bales, sold bales, clearance rates, and withdrawal data
- **Price Analysis**: Highest price lots with micron and bale details
- **Certified Share**: Merino percentage offered vs sold with sustainability metrics
- **Greasy Statistics**: Turnover, bales, and mass data with seasonal comparisons
- **Micron Price Comparisons**: Certified vs non-certified price analysis with percentage differences
- **Broker Analysis**: Catalogue offerings, sales performance, and market participation

### Data Models & Storage
- **Structured Data Models**: Complete TypeScript interfaces for all data types
- **Local Storage**: Browser-based data persistence with structured storage
- **Data Transformation**: Utilities for converting between form data and database structures
- **Service Layer**: Clean API for CRUD operations and business logic
- **Schema Validation**: JSON schema validation for Cape Wools data integrity

## 🎯 Use Cases

### For Market Analysts
- Track weekly auction performance trends
- Analyze buyer behavior and market share shifts
- Monitor price movements across different wool qualities
- Generate insights for market reports
- Capture comprehensive Cape Wools data for advanced analytics
- Compare certified vs non-certified pricing trends
- Monitor currency exchange impacts on pricing

### For Farmers & Producers
- Benchmark performance against provincial averages
- Track certification impact on pricing
- Monitor market trends and seasonal patterns
- Identify optimal selling strategies

### For Brokers & Traders
- Monitor catalogue performance and sales success
- Track buyer preferences and market demand
- Analyze pricing trends for strategic planning
- Generate client performance reports

## 👥 User Management System

The platform features a comprehensive user management system with role-based access control and approval workflow:

### User Roles & Permissions
- **Super Admin**: Full system access including user management, system configuration, and all data operations
- **Admin**: Administrative access including user management, auction management, and data operations
- **Editor**: Can create and edit auction reports, manage market data, and view analytics
- **Viewer**: Read-only access to view auction reports and market analytics

### User Approval Workflow
- **New User Registration**: Users sign up through the authentication system
- **Pending Approval**: New users are created with "pending" approval status
- **Admin Approval**: Super admins and admins can approve or reject new user requests
- **Access Control**: Only approved users can access the admin interface
- **Role Assignment**: Admins can assign appropriate roles to approved users

### User Management Features
- **User Creation**: Admins can create new users directly from the admin interface
- **Role Management**: Assign and modify user roles with granular permissions
- **User Status Control**: Activate/deactivate users and manage their access
- **Approval Tracking**: Track who approved users and when
- **User Analytics**: View user activity and system usage statistics
- **Password Management**: Secure password handling with temporary password generation

### Security Features
- **Row Level Security (RLS)**: Database-level security policies for data access control
- **Session Management**: Secure user sessions with proper authentication
- **Foreign Key Relationships**: Proper data integrity with user type references
- **Audit Trail**: Complete tracking of user actions and system changes

## 🤖 AI-Powered Market Insights

The platform features an advanced AI-powered market insights composer that leverages Google Gemini AI to generate professional market commentary:

### AI Enhancement Features
- **Intelligent Analysis**: AI analyzes current week's auction data against historical trends
- **Cape Wools Integration**: Incorporates official Cape Wools market commentary into analysis
- **Professional Content**: Generates industry-appropriate market insights and commentary
- **80-Word Optimization**: Content automatically optimized for small card display format
- **Real-time Enhancement**: One-click content enhancement with immediate results
- **OVK Brand Enhancement**: Always highlights OVK's positive market position and contributions
- **Fallback System**: Robust local enhancement when AI API is unavailable
- **Content Preservation**: AI preserves user's original content as foundation while enhancing it professionally
- **Data Validation**: AI validates auction data before using it to avoid invalid references
- **Database Integration**: Market insights are properly saved to database with full CRUD operations

### How It Works
1. **User Input**: User writes their market insights and commentary
2. **AI Enhancement**: Gemini AI takes user's content as foundation and enhances it professionally
3. **Data Integration**: AI incorporates valid auction data and Cape Wools commentary
4. **Content Optimization**: Automatic formatting and word limit enforcement (80 words)
5. **Visual Feedback**: Real-time word count with color-coded limits and separate feedback display
6. **Database Storage**: Enhanced content is saved to database with proper relationships
7. **Professional Output**: Ready-to-use market commentary for reports

### AI Enhancement Approach
- **Foundation First**: User's original content serves as the primary foundation
- **Professional Enhancement**: AI improves wording, structure, grammar, and flow
- **Market Context**: Adds professional market insights and industry terminology
- **Data Integration**: Incorporates valid auction data only when meaningful (> 0 values)
- **Brand Positioning**: Subtly integrates OVK's positive market position
- **Content Transformation**: Transforms user ideas into professional market commentary

### Configuration
- **API Key**: Set `VITE_GEMINI_API_KEY` in your `.env.local` file
- **Fallback Mode**: Works without API key using local enhancement algorithms
- **Word Limits**: Automatic enforcement of 80-word limit for card display
- **Data Validation**: Built-in validation to prevent "zero bales offered" issues

## 📝 Cape Wools Data Capture

The application includes a comprehensive data capture form specifically designed to handle all data points from Cape Wools weekly reports:

### Form Structure
- **Tabbed Interface**: Organized into 9 logical sections for efficient data entry
- **Auto-calculation**: Automatic percentage difference calculations for micron price comparisons
- **Data Validation**: Built-in validation for required fields and data consistency
- **Compact Design**: Optimized for efficient data entry while maintaining usability
- **Real-time Preview**: Live preview of data as it's entered

### Data Sections
1. **Auction Details**: Sale number, date, catalogue, auction center, PDF filename
2. **Market Indices**: Merino/certified indicators, AWEX EMI, change percentages
3. **Currency Exchange**: All major currency pairs with high precision
4. **Supply & Statistics**: Bales, clearance rates, highest prices, certified share, greasy stats
5. **Micron Prices**: Basic prices and certified vs non-certified comparisons
6. **Buyers & Brokers**: Market participation and catalogue offerings
7. **Provincial Data**: Top producers by province with detailed metrics
8. **Market Insights**: Commentary and analysis
9. **Review & Save**: Data completeness summary and final validation

### Key Features
- **Full Cape Wools Compatibility**: Captures all data points from the official Cape Wools schema
- **Real-time Validation**: Immediate feedback on data completeness and accuracy
- **Flexible Data Entry**: Support for both manual entry and bulk data import
- **Historical Tracking**: Maintains complete audit trail of all data changes
- **Draft System**: Save work in progress with draft functionality
- **Previous Value Integration**: Automatic population of previous auction data for comparisons
- **Export Capabilities**: Generate PDF reports and export data in various formats

## 🔧 Development

### Adding New Features
1. Define new data types in `types.ts`
2. Create new components in the `components/` directory
3. Update the main `App.tsx` to include new functionality
4. Add mock data to `constants.ts` for testing
5. Update data models in `data/models.ts` if needed
6. Add service methods in `data/service.ts` for new functionality

### Data Visualization
The application uses both ApexCharts and Recharts for creating interactive charts and graphs. New visualizations can be added by:
1. Creating new chart components using the existing chart patterns
2. Integrating with the existing data structures
3. Adding responsive design considerations
4. Following the established color scheme and theming

### Styling
The application uses custom CSS with CSS variables for theming. Maintain consistency by:
- Using the established color scheme and spacing defined in `index.css`
- Following the component design patterns
- Ensuring responsive design across all screen sizes
- Using the predefined CSS classes and utilities

### Data Management
- **Local Storage**: Data is persisted in browser localStorage
- **Data Transformation**: Use the transformer utilities for data conversion
- **Service Layer**: All data operations go through the service layer
- **Type Safety**: Maintain TypeScript interfaces for all data structures

## 📱 Responsive Design

The application features a comprehensive mobile-first design with dedicated mobile components and recent optimizations:

### Mobile Component Library
- **MobileLayout**: Smart responsive wrapper with automatic breakpoint detection (default: 768px)
- **MobileCard**: Touch-optimized card component with compact layouts and enhanced interactions
- **MobileChart**: Mobile-specific chart components with touch-friendly controls and responsive sizing
- **MobileDataTable**: Responsive data tables with mobile-optimized scrolling and interaction patterns
- **MobileBrokersGrid**: Mobile-optimized broker performance grid with touch-friendly navigation
- **MobileBuyerShareChart**: Mobile buyer share visualization with simplified interactions
- **MobileMarketTrends**: Mobile market trends display with swipe-friendly navigation
- **MobileTopPerformers**: Mobile top performers table with optimized data presentation
- **MobileProvincialTopProducers**: Mobile provincial producer rankings with touch-friendly controls
- **MobileProvincePriceMap**: Mobile provincial price mapping with gesture support

### Recent Mobile Optimizations
- **Unified Card Width System**: Fixed inconsistent card widths using consistent margin and width properties
- **Full-Width Header Banners**: Removed horizontal padding from card headers for edge-to-edge color banners
- **Chart Display Area Optimization**: Increased chart display area by 25-30% through several techniques:
  - Reduced header size (smaller icons, fonts, and margins)
  - Decreased padding around charts (including negative top padding)
  - Optimized text elements (smaller axis labels, legend text, and markers)
  - Added compact mode with mobile-specific styling
- **Consistent Mobile Spacing**: Implemented unified spacing system using flexbox gap properties
  - Created `.mobile-spacing-fix` class with responsive gap values
  - Replaced margin-based spacing with gap-based system
  - Responsive gap values: 0.75rem (768px+), 0.625rem (430px), 0.5rem (380px)
- **Enhanced Map Readability**: Improved province label display in map component
  - Full province names instead of truncated versions
  - Increased font size and weight for better readability
  - Added white stroke outline and drop shadow for contrast
  - Optimized label positioning to avoid overlapping
- **Data Consistency**: Ensured mobile components receive identical data from same sources as desktop
- **Top 10 Data Limitation**: Implemented consistent 10-record limit for provincial producer data
- **Publication Timestamps**: Added "Updated" timestamps showing when data was last published

### Responsive Breakpoints
- **Desktop (≥768px)**: Full dashboard with multi-column layouts and comprehensive market overview
- **Tablet (768px-1024px)**: Adapted layouts with smart column spanning and optimized spacing
- **Mobile (<768px)**: Dedicated mobile components with single-column layouts and touch-friendly interactions
- **Mobile Landscape**: Maintains efficient layout with mobile-optimized components
- **Touch Optimization**: Minimum 32px touch targets, mobile-friendly font scaling, and gesture support

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: Zero-config deployment for React applications
- **Netlify**: Easy deployment with continuous integration
- **AWS S3 + CloudFront**: Scalable static hosting solution
- **Traditional hosting**: Upload built files to any web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and all project updates.

## 📄 License

This project is proprietary software developed for OVK. All rights reserved.

## 🚧 Current Development Status

### Completed Features
- ✅ **Core Application Structure**: React app with TypeScript and Vite
- ✅ **Enhanced Mobile Card Consistency**: Fixed width inconsistencies in mobile cards for uniform appearance
- ✅ **Improved Mobile Header Styling**: Full-width color banners in mobile card headers
- ✅ **Provincial Top 10 Map Improvements**: Renamed with clearer explanatory text and corollary notes
- ✅ **Micron Category Correction**: Fixed wool categorization (21μ, 21.5μ, 22μ now labeled as "Strong")
- ✅ **Mobile Chart Optimization**: Increased chart display area by 25-30% with reduced padding
- ✅ **Broker Rate Calculation Fix**: Corrected percentage calculation in broker performance cards
- ✅ **Publication Timestamps**: Added "Updated" timestamps showing when data was last published
- ✅ **Top 10 Data Limitation**: Implemented consistent 10-record limit for provincial producer data
- ✅ **Province Header Enhancement**: Added color-coded province headers with improved visual prominence
- ✅ **Complete User Management System**: Full user administration with role-based access control and approval workflow
- ✅ **User Types & Permissions**: Comprehensive role system (super_admin, admin, editor, viewer) with granular permissions
- ✅ **User Approval Workflow**: New users require admin approval before gaining access to the system
- ✅ **Database Schema Normalization**: Removed redundant status column, using proper foreign key relationships
- ✅ **Enhanced Authentication**: Improved user authentication with proper profile management and session handling
- ✅ **Market Dashboard**: Interactive auction selection and data visualization
- ✅ **Complete Edit Auction Functionality**: Full CRUD operations with proper create/update logic
- ✅ **Database Integration**: Full Supabase PostgreSQL integration with comprehensive schema
- ✅ **Buyer & Broker Performance**: Fixed data saving with proper foreign key mapping
- ✅ **CASCADE Deletion**: Automatic cleanup of related data when auctions are deleted
- ✅ **Enhanced Auction Report Review**: Comprehensive validation system with completion tracking and draft/publish workflow
- ✅ **Status Management**: Real-time auction status tracking (Draft/Published) with automatic refresh
- ✅ **Advanced Auctions Management**: Enhanced table with pagination, dropdown actions, and comprehensive statistics
- ✅ **Season Management Analytics**: Real-time calculation of auction counts, bales, volume, and turnover per season
- ✅ **Admin Interface**: Complete data capture system for Cape Wools reports
- ✅ **AI-Powered Market Insights**: Google Gemini AI integration for intelligent commentary generation
- ✅ **Smart Content Enhancement**: AI analyzes auction data and Cape Wools commentary
- ✅ **80-Word Card Optimization**: Content automatically optimized for small card display
- ✅ **OVK Brand Enhancement**: AI always highlights OVK's positive market position and contributions
- ✅ **Enhanced Input Formatting**: Currency formatting with thousands separators
- ✅ **Improved Form Controls**: Catalogue number input with 2-digit formatting and natural typing
- ✅ **Data Management**: Supabase database with structured data models and relationships
- ✅ **Mobile-First Design**: Complete mobile component library with responsive layouts
- ✅ **Mobile Components**: Dedicated mobile components for all major features
- ✅ **Responsive Layout System**: Smart breakpoint detection and component switching
- ✅ **Touch Optimization**: Mobile-friendly interactions and gesture support
- ✅ **Chart Integration**: ApexCharts and Recharts for data visualization
- ✅ **Mobile Charts**: Touch-optimized chart components with mobile-specific features
- ✅ **Authentication**: Complete admin authentication system with user management
- ✅ **Data Validation**: Form validation and data integrity checks

### In Development
- 🔄 **Enhanced Analytics**: Advanced market trend analysis
- 🔄 **Report Generation**: PDF export functionality
- 🔄 **Data Import/Export**: CSV and JSON data handling

### Planned Features
- 📋 **Cape Mohair Reports**: Extension for mohair market data
- 📋 **OVK Market Reports**: Custom OVK-specific reporting
- 📋 **Advanced Analytics**: Machine learning insights
- 📋 **API Integration**: Real-time data feeds
- 📋 **Mobile App**: Native mobile application

## 📞 Support

For technical support or questions about the application, please contact the development team or refer to the project documentation.

---

**Built with ❤️ for the South African wool and mohair industry**
