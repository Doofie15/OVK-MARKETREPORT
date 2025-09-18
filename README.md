# OVK Wool Market Report Platform

<div align="center">
<img width="1200" height="475" alt="OVK Wool Market Report Dashboard" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A comprehensive React-based web application for tracking and analyzing wool market data from weekly auctions in South Africa. This platform provides detailed market insights, performance analytics, and administrative tools for managing auction reports with a professional, structured interface.

## 🎯 Latest Updates

- ✅ **Enhanced Form Layout**: Auction data capture form now uses 95% of page width for improved usability and better space utilization
- ✅ **Comprehensive Changelog**: Full project history and updates documented in CHANGELOG.md
- ✅ **Updated Documentation**: All project documentation reflects latest enhancements and improvements
- ✅ **Mobile-First Design**: Complete mobile component library with responsive layouts and touch-optimized interfaces
- ✅ **Enhanced Mobile Experience**: Dedicated mobile components for all major features including charts, tables, and data visualization
- ✅ **Responsive Component System**: Smart layout switching between desktop and mobile views with automatic breakpoint detection
- ✅ **Mobile-Optimized Charts**: Touch-friendly chart components with mobile-specific interactions and sizing
- ✅ **Consistent Card Heights**: BUYERS DIRECTORY and BROKERS cards now have perfectly aligned heights for a professional appearance
- ✅ **Streamlined Buyer Data**: Removed YTD bales column from TOP BUYERS & MARKET SHARE table for cleaner focus on current auction performance
- ✅ **Enhanced Layout**: Improved grid system with equal height cards using CSS Grid and Flexbox
- ✅ **Professional Styling**: Refined visual design with consistent spacing and alignment

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
- **Key Performance Indicators**: Track total lots, volume, average prices, and total value with YTD comparisons
- **Market Benchmarks**: Monitor certified, all-Merino, and AWEX pricing benchmarks
- **Enhanced Market Overview**: Professional information board displaying live exchange rates, next auction countdown, and RWS premium data
- **Micron Price Analysis**: Visualize price trends across different wool micron categories (Fine, Medium, Strong)

### 📈 Analytics & Insights
- **Buyer Performance**: Track buyer market share, weekly purchases, and year-to-date bale counts
- **Broker Analytics**: Monitor broker catalogue offerings and sales performance
- **Top Producers**: Identify top-performing farms by province with detailed pricing and certification data
- **Market Trends**: Historical price comparisons between RWS and non-RWS wool across different periods
- **Provincial Analysis**: Geographic breakdown of average prices and top producers by South African provinces

### 🛠️ Administrative Tools
- **Cape Wools Data Capture**: Comprehensive form system for capturing all Cape Wools weekly report data
- **Tabbed Data Entry**: Organized sections for auction details, market indices, currency exchange, supply statistics, and micron price comparisons
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
- **Node.js** with Express.js for API server
- **JSON-based storage** for data persistence
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
│   ├── service.ts         # Auction data service for CRUD operations
│   ├── api-service.ts     # API service for backend communication
│   ├── storage.ts         # Local storage management
│   ├── transformers.ts    # Data transformation utilities
│   ├── models.ts          # Data model definitions
│   └── index.ts           # Data layer exports
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
└── public/
    └── assets/
        └── logos/
            └── ovk-logo-embedded.svg # OVK company logo
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 18 or higher recommended)
- **npm** or **yarn** package manager

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
   GEMINI_API_KEY=your_gemini_api_key_here
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

The application features a comprehensive mobile-first design with dedicated mobile components:

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
- ✅ **Market Dashboard**: Interactive auction selection and data visualization
- ✅ **Admin Interface**: Complete data capture system for Cape Wools reports
- ✅ **Data Management**: Local storage with structured data models
- ✅ **Mobile-First Design**: Complete mobile component library with responsive layouts
- ✅ **Mobile Components**: Dedicated mobile components for all major features
- ✅ **Responsive Layout System**: Smart breakpoint detection and component switching
- ✅ **Touch Optimization**: Mobile-friendly interactions and gesture support
- ✅ **Chart Integration**: ApexCharts and Recharts for data visualization
- ✅ **Mobile Charts**: Touch-optimized chart components with mobile-specific features
- ✅ **Authentication**: Basic admin authentication system
- ✅ **Data Validation**: Form validation and data integrity checks

### In Development
- 🔄 **Enhanced Analytics**: Advanced market trend analysis
- 🔄 **Report Generation**: PDF export functionality
- 🔄 **Data Import/Export**: CSV and JSON data handling
- 🔄 **User Management**: Multi-user support and role-based access

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
