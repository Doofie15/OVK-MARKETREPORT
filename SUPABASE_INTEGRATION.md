# Supabase Integration Guide

This document outlines the complete Supabase integration for the OVK Wool Market Report system.

## Overview

The application has been migrated from mock data and local storage to use Supabase as the backend database with integrated authentication.

## Database Schema

### Core Tables

1. **users** - User management and authentication
2. **seasons** - Wool market seasons (e.g., 2025/26)
3. **auctions** - Individual auction data
4. **micron_prices** - Price data by micron bucket
5. **market_insights** - Market analysis and insights
6. **top_performers** - Top performing producers by province
7. **broker_performance** - Broker performance metrics
8. **buyer_performance** - Buyer performance metrics

### Lookup Tables

- **provinces** - South African provinces and regions
- **certifications** - Wool certification types (RWS, GOTS, etc.)
- **commodity_types** - Commodity types (Wool, Mohair, etc.)
- **brokers** - Wool brokers (BKB, OVK, JLW, etc.)
- **buyers** - Wool buyers
- **districts** - Districts within provinces
- **status_types** - Status types for various entities

## Authentication

### Features
- Email/password authentication
- User registration with approval workflow
- Role-based access control (super_admin, admin, editor, viewer)
- Session management with automatic refresh
- Protected routes for admin functionality

### User Roles
- **super_admin**: Full system access
- **admin**: Administrative access
- **editor**: Can create and edit reports
- **viewer**: Read-only access

## Environment Setup

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
VITE_SUPABASE_URL=https://gymdertakhxjmfrmcqgp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bWRlcnRha2h4am1mcm1jcWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NjY0MTgsImV4cCI6MjA3NDA0MjQxOH0.C-IFVMekGQCuvbgU6vIvCqy1Se9UR_UyOfRm6A4uN2A
VITE_APP_ENV=development
VITE_APP_NAME=OVK Wool Market Report
```

### 2. Quick Setup

Run the setup script to automatically create the environment file:

```bash
node setup-env.js
```

## Key Components

### 1. Supabase Client (`lib/supabase.ts`)
- Configured Supabase client with TypeScript types
- Database schema definitions
- Authentication configuration

### 2. Data Service (`data/supabase-service.ts`)
- Complete CRUD operations for all entities
- Authentication methods
- Data transformation between form and database formats
- Error handling and response formatting

### 3. Authentication Context (`contexts/AuthContext.tsx`)
- React context for authentication state
- Sign in/up/out methods
- Session management
- User state management

### 4. Protected Routes (`components/auth/ProtectedRoute.tsx`)
- Route protection based on authentication status
- Loading states
- Automatic redirect to login

### 5. Login Form (`components/auth/LoginForm.tsx`)
- Modern Material-UI login interface
- Sign in and sign up functionality
- Form validation and error handling

## API Endpoints

### Authentication
- `signUp(email, password, userData)` - Register new user
- `signIn(email, password)` - Sign in user
- `signOut()` - Sign out user
- `getCurrentUser()` - Get current authenticated user

### User Management
- `createUser(userData)` - Create new user
- `getUsers()` - Get all users
- `updateUser(id, updates)` - Update user
- `deleteUser(id)` - Delete user

### Season Management
- `createSeason(seasonData)` - Create new season
- `getSeasons()` - Get all seasons
- `getSeasonById(id)` - Get season by ID
- `updateSeason(id, updates)` - Update season
- `deleteSeason(id)` - Delete season

### Auction Management
- `createAuction(auctionData)` - Create new auction
- `getAuctions()` - Get all auctions
- `getAuctionById(id)` - Get auction by ID
- `getAuctionsBySeason(seasonId)` - Get auctions by season
- `updateAuction(id, updates)` - Update auction
- `deleteAuction(id)` - Delete auction

### Complete Report Operations
- `saveCompleteAuctionReport(formData)` - Save complete auction report
- `getCompleteAuctionReport(auctionId)` - Get complete auction report

## Data Flow

### 1. Public Routes
- No authentication required
- Display published auction reports
- Read-only access to market data

### 2. Admin Routes
- Authentication required
- Full CRUD operations
- User management
- Report creation and editing

### 3. Data Persistence
- All data stored in Supabase
- Real-time updates
- Automatic backups
- Scalable infrastructure

## Migration from Mock Data

The system has been completely migrated from mock data to Supabase:

### Removed
- Local storage dependencies
- Mock data constants
- JSON file-based storage
- Local authentication

### Added
- Supabase database
- Real authentication
- User management
- Role-based access control
- Data persistence

## Security Features

### Row Level Security (RLS)
- Database-level security policies
- User-based data access control
- Automatic data filtering

### Authentication Security
- JWT token-based authentication
- Automatic token refresh
- Secure session management
- Password hashing (handled by Supabase)

## Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Access Admin Panel
- Navigate to `/admin`
- Sign in with your credentials
- Access all administrative functions

### 3. Create Test Data
- Use the admin interface to create seasons
- Add auction reports
- Test all CRUD operations

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env.local` file exists
   - Restart development server
   - Check file permissions

2. **Authentication Errors**
   - Verify Supabase URL and key
   - Check network connectivity
   - Ensure user exists in database

3. **Database Connection Issues**
   - Verify Supabase project is active
   - Check database permissions
   - Review RLS policies

### Debug Mode

Enable debug logging by setting:
```env
VITE_APP_ENV=development
```

## Production Deployment

### Environment Variables
Update environment variables for production:
- Use production Supabase URL
- Use production API keys
- Set appropriate app environment

### Database Setup
- Ensure all migrations are applied
- Set up proper RLS policies
- Configure backup schedules
- Monitor performance

## Support

For issues or questions:
1. Check the Supabase dashboard
2. Review application logs
3. Verify database schema
4. Test authentication flow

## Next Steps

1. **User Management**: Implement user approval workflow
2. **Role-Based Access**: Add granular permissions
3. **Data Validation**: Enhance form validation
4. **Performance**: Optimize queries and caching
5. **Monitoring**: Add error tracking and analytics
