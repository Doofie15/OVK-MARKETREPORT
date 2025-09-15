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

## 🎯 Key Features to Explore

### 1. Market Dashboard
- View current auction data and KPIs
- Navigate between different auction weeks
- Analyze market trends and insights

### 2. Buyer Analysis
- Review top buyers and market share
- Track buyer performance over time
- Compare auction vs YTD data

### 3. Administrative Functions
- Click "Admin Panel" to access data entry
- Create new auction reports
- Import/export data

### 4. Data Visualization
- Interactive charts and graphs
- Provincial price mapping
- Market trend analysis

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
2. Try the administrative functions
3. Review the sample data
4. Check out the analytics features

Happy exploring! 🐑📊
