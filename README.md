# OVK Wool & Mohair Market Platform

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A comprehensive React-based web application for tracking and analyzing wool and mohair market data from weekly auctions in South Africa. This platform provides detailed market insights, performance analytics, and administrative tools for managing auction reports.

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
- **Report Management**: Create and edit auction reports with comprehensive data entry forms
- **Data Validation**: Built-in validation for market data consistency
- **Historical Tracking**: Maintain complete auction history with automatic YTD calculations

## 🏗️ Architecture

### Frontend Stack
- **React 19.1.1** with TypeScript for type-safe development
- **Vite 6.2.0** for fast development and building
- **Tailwind CSS** for responsive styling (implied by class usage)
- **Recharts 3.1.2** for data visualization

### Project Structure
```
├── App.tsx                 # Main application component with routing logic
├── types.ts               # TypeScript interfaces for all data structures
├── constants.ts           # Mock data and configuration constants
├── components/            # Reusable UI components
│   ├── admin/            # Administrative interface components
│   │   ├── AdminForm.tsx # Comprehensive data entry form
│   │   └── AuctionsList.tsx # Auction management list
│   ├── IndicatorsGrid.tsx    # KPI display grid
│   ├── MicronPriceChart.tsx # Price vs micron visualization
│   ├── TopSalesTable.tsx    # Top sales performance table
│   ├── MarketTrends.tsx     # Historical trend analysis
│   ├── ProvincialTopProducers.tsx # Provincial producer rankings
│   └── ...                 # Additional specialized components
└── vite.config.ts         # Build configuration
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

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build production-ready application
- **`npm run preview`** - Preview production build locally

## 📊 Data Structure

The application manages comprehensive auction data including:

- **Auction Details**: Week information, dates, catalogue names
- **Market Indicators**: Volume, pricing, and performance metrics
- **Buyer Analytics**: Market share and purchasing patterns
- **Producer Performance**: Top farms by province with pricing data
- **Quality Metrics**: Micron specifications and certification status
- **Geographic Data**: Provincial breakdowns and district information

## 🎯 Use Cases

### For Market Analysts
- Track weekly auction performance trends
- Analyze buyer behavior and market share shifts
- Monitor price movements across different wool qualities
- Generate insights for market reports

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

## 🔧 Development

### Adding New Features
1. Define new data types in `types.ts`
2. Create new components in the `components/` directory
3. Update the main `App.tsx` to include new functionality
4. Add mock data to `constants.ts` for testing

### Data Visualization
The application uses Recharts for creating interactive charts and graphs. New visualizations can be added by:
1. Creating new chart components
2. Integrating with the existing data structures
3. Adding responsive design considerations

### Styling
The application uses Tailwind CSS for styling. Maintain consistency by:
- Using the established color scheme and spacing
- Following the component design patterns
- Ensuring responsive design across all screen sizes

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full dashboard with multi-column layouts and comprehensive market overview
- **Tablet**: Adapted layouts with smart column spanning and optimized spacing
- **Mobile**: Single-column layouts with touch-friendly interactions and compact information display
- **Mobile Landscape**: Maintains three-column layout for efficient use of horizontal space
- **Touch Optimization**: Minimum 32px touch targets and mobile-friendly font scaling

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

## 📄 License

This project is proprietary software developed for OVK. All rights reserved.

## 📞 Support

For technical support or questions about the application, please contact the development team or refer to the project documentation.

---

**Built with ❤️ for the South African wool and mohair industry**
