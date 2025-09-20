# OVK Wool Market Report - Routing Structure

## Overview

The application has been restructured to separate public and admin functionality using React Router.

## URL Structure

### Public Routes
- **`/`** - Main public dashboard showing the latest auction (defaults to most recent)
- **`/202501`** - Specific auction report (2025 season, CAT01 auction)
- **`/202552`** - Specific auction report (2025 season, CAT52 auction)
- **`/{year}{catalogue}`** - Any valid auction (e.g., /202501, /202552, /202401, etc.)
- **`/*`** - Any other route redirects to the public dashboard

### Admin Routes
- **`/admin`** - Redirects to `/admin/dashboard`
- **`/admin/dashboard`** - Admin dashboard overview
- **`/admin/seasons`** - Season management
- **`/admin/auctions`** - Auction data management
- **`/admin/cape-mohair`** - Cape Mohair reports (coming soon)
- **`/admin/ovk-reports`** - OVK Market reports (coming soon)
- **`/admin/analytics`** - Analytics (coming soon)
- **`/admin/insights`** - Insights (coming soon)
- **`/admin/import-export`** - Import/Export (coming soon)
- **`/admin/users`** - User management (coming soon)
- **`/admin/settings`** - Settings (coming soon)

## Key Changes

### 1. Public Side (`www.ovkfiber.co.za`)
- Clean interface with no admin access indicators
- Uses `PublicLayout` component with `PublicHeader`
- No admin panel button or navigation
- Focused on displaying market data and reports
- **URL-based auction selection**: Users can bookmark and share specific auction reports
- **Automatic URL updates**: When selecting different auctions, the URL changes to reflect the selection

### 2. Admin Side (`www.ovkfiber.co.za/admin`)
- Separate authentication flow
- Full admin functionality
- Uses `AdminApp` component with `AdminLayout`
- Protected routes with authentication

### 3. Component Structure
- **`App.tsx`** - Main router with public and admin routes
- **`PublicLayout.tsx`** - Public dashboard layout
- **`PublicHeader.tsx`** - Clean header without admin indicators
- **`AdminApp.tsx`** - Admin application with internal routing
- **`AdminSidebar.tsx`** - Updated to use navigation instead of state

## Authentication

- Admin routes require authentication
- Simple demo authentication: username `admin`, password `admin123`
- Authentication state is managed within the admin section

## Navigation

- Public users can only access the main dashboard
- Admin users can navigate to `/admin` to access administrative functions
- No visible links or buttons on the public side indicate admin access
- Admin sidebar uses React Router navigation for internal admin routes

## Auction URL Routing

### How It Works
1. **Default Route (`/`)**: Shows the latest auction (first in the reports array)
2. **Specific Auction Routes (`/{year}{catalogue}`)**: Shows a specific auction report
3. **URL Updates**: When users select a different auction from the dropdown, the URL automatically updates
4. **Direct Access**: Users can directly access any auction by typing the URL (e.g., `www.ovkfiber.co.za/202501`)

### URL Format
- **Pattern**: `/{year}{catalogue}` (e.g., `/202501`, `/202552`)
- **Format**: 6-digit number where first 4 digits are the year, last 2 digits are the catalogue number
- **Season Logic**: Year 2025 corresponds to season "2025/26"
- **Fallback**: Invalid auction URLs redirect to the home page

### Examples
- `www.ovkfiber.co.za/` → Shows latest auction (2025 season, CAT01)
- `www.ovkfiber.co.za/202501` → Shows 2025 season, CAT01 auction report
- `www.ovkfiber.co.za/202552` → Shows 2025 season, CAT52 auction report
- `www.ovkfiber.co.za/202401` → Shows 2024 season, CAT01 auction report
- `www.ovkfiber.co.za/invalid` → Redirects to home page

## Benefits

1. **Security**: No admin access indicators on public side
2. **Clean Separation**: Public and admin functionality are completely separate
3. **URL-based Navigation**: Proper routing for both public and admin sections
4. **Maintainability**: Clear separation of concerns between public and admin code
5. **User Experience**: Clean public interface focused on market data
6. **Shareable URLs**: Users can bookmark and share specific auction reports
7. **SEO Friendly**: Each auction has its own URL for better search engine indexing
8. **Browser Navigation**: Users can use browser back/forward buttons to navigate between auctions
