# OVK Wool Market Report Platform - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- Git installed
- Terminal/Command Prompt access

### Step 1: Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd wool-market-report

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Start the Application
```bash
# Terminal 1: Start backend server
cd server
npm start

# Terminal 2: Start frontend (in new terminal)
npm run dev
```

### Step 3: Access the Platform
- **Frontend**: Open http://localhost:5173 in your browser
- **Backend API**: Available at http://localhost:3001

### Step 4: Test URL Routing
Try these URLs to test the new routing system:
- **Home**: http://localhost:5173/ (latest auction)
- **CAT01**: http://localhost:5173/202501 (2025 season, CAT01)
- **CAT52**: http://localhost:5173/202552 (2025 season, CAT52)

## 🎯 Key Features to Explore

### 1. Market Dashboard
- View current auction data and KPIs
- Navigate between different auction weeks
- **URL Navigation**: Direct access to specific auctions via URLs (e.g., /202501, /202552)
- **Shareable Links**: Bookmark and share specific auction reports
- **Browser Navigation**: Use browser back/forward buttons to navigate between auctions
- Analyze market trends and insights
- **Mobile**: Touch-optimized interface with swipe navigation

### 2. Buyer Analysis
- Review top buyers and market share
- Track buyer performance over time
- Compare auction vs YTD data
- **Mobile**: Mobile-optimized buyer share charts and tables

### 3. Administrative Functions
- Click "Admin Panel" to access data entry
- Create new auction reports with enhanced 95% width form layout
- Import/export data
- **Mobile**: Responsive admin forms with mobile-friendly inputs
- **Enhanced Layout**: Wider form provides better data entry experience

### 4. Data Visualization
- Interactive charts and graphs
- Provincial price mapping
- Market trend analysis
- **Mobile**: Touch-friendly charts with mobile-specific interactions

### 5. Mobile Experience
- **Responsive Design**: Automatic layout switching based on screen size
- **Touch Optimization**: Gesture support and touch-friendly controls
- **Mobile Components**: Dedicated mobile versions of all major features
- **Breakpoint Detection**: Smart switching at 768px breakpoint

## 📊 Sample Data

The platform comes with sample data to help you explore features:
- Multiple auction weeks with realistic data
- Buyer and broker information
- Provincial producer data
- Market trends and insights

## 🔧 Quick Configuration

### Environment Variables
Create `.env.local` in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend Configuration
Create `server/.env`:
```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

## 📱 Mobile Access

The platform is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🆘 Need Help?

- **User Guide**: See `docs/USER_GUIDE.md` for detailed instructions
- **API Documentation**: See `docs/API.md` for backend API details
- **Deployment Guide**: See `docs/DEPLOYMENT.md` for production setup
- **Technical Support**: Contact the development team

## 🎉 You're Ready!

The OVK Wool Market Report Platform is now running locally. Start exploring the features and data to understand the platform's capabilities.

**Next Steps:**
1. Explore the market dashboard
2. **Test URL Routing**: Try navigating to different auctions using URLs like `/202501` and `/202552`
3. **Bookmark Auctions**: Bookmark specific auction reports for quick access
4. Try the administrative functions with the enhanced 95% width form
5. Review the sample data
6. Check out the analytics features
7. Test the improved form layout for data entry

**Recent Enhancements**: 
- **URL-Based Navigation**: Direct access to specific auctions via season+catalogue URLs
- **Shareable Links**: Bookmark and share specific auction reports
- **Enhanced Form Layout**: The auction data capture form now uses 95% of the page width for improved usability

Happy exploring! 🐑📊
