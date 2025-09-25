# 🔐 Authentication & Routing Structure

## Overview

The OVK Wool Market Report platform uses a comprehensive authentication system that protects all administrative functionality while keeping public auction reports accessible to everyone.

## 🌐 Route Structure

### **Public Routes (No Authentication Required)**
```
/                    - Home page with latest auction report
/:auctionId         - Individual auction reports (e.g., /202501, /202552)
```

### **Protected Routes (Authentication Required)**
All routes under `/admin/*` require user authentication:

```
/admin/             - Admin dashboard (redirects to /admin/dashboard)
/admin/dashboard    - Main admin overview with metrics
/admin/analytics    - 📊 Analytics dashboard with geographic maps
/admin/settings     - ⚙️ API configuration and company settings
/admin/seasons/*    - Season management (list, create, edit)
/admin/auctions/*   - Auction management (list, create, edit)
/admin/users        - User management and role assignments
```

### **Protected Routes (Under Development)**
These routes are implemented with placeholder pages:

```
/admin/cape-mohair   - Cape Mohair specialized reporting
/admin/ovk-reports   - Enhanced OVK market reports  
/admin/insights      - AI-powered market insights
/admin/import-export - Bulk data import/export tools
/admin/form          - Legacy form routes
/admin/capture       - Data capture interfaces
```

## 🔒 Authentication System

### **Authentication Provider**
- **Location**: `contexts/AuthContext.tsx`
- **Backend**: Supabase Auth
- **Session Management**: Automatic token refresh and persistence
- **Storage**: Secure session storage in browser

### **Protected Route Component**
- **Location**: `components/auth/ProtectedRoute.tsx`
- **Function**: Wraps admin routes to enforce authentication
- **Behavior**: 
  - Shows loading spinner while checking auth
  - Redirects to login form if not authenticated
  - Renders protected content if authenticated

### **Login Form**
- **Location**: `components/auth/LoginForm.tsx`
- **Features**: 
  - Email/password authentication
  - User registration with approval workflow
  - Password visibility toggle
  - Form validation and error handling

## 👥 User Roles & Permissions

### **Role Hierarchy**
1. **super_admin** - Full system access, user management
2. **admin** - Administrative access, report management  
3. **editor** - Can create and edit reports
4. **viewer** - Read-only access

### **Role Implementation**
- **Database**: `user_types` table with role definitions
- **Checking**: `ProtectedRoute` component supports `requiredRole` prop
- **Current State**: Basic authentication (role checking to be enhanced)

## 🔐 Security Features

### **Route Protection**
```typescript
// In App.tsx
<Route 
  path="/admin/*" 
  element={
    <ProtectedRoute>
      <AdminAppSupabase />
    </ProtectedRoute>
  } 
/>
```

### **Authentication Flow**
1. User accesses `/admin/*` route
2. `ProtectedRoute` checks authentication status
3. If not authenticated → Shows `LoginForm`
4. If authenticated → Renders admin content
5. Session persists across browser refreshes

### **Session Management**
- Automatic token refresh
- Secure logout functionality  
- Session state synchronized across tabs
- Proper cleanup on logout

## 📊 Analytics Route Details

### **Analytics Dashboard** (`/admin/analytics`)
**Authentication**: ✅ Required  
**Features**:
- Three-tab interface (Overview, Geography, Auction Engagement)
- Interactive Google Maps integration
- Real-time visitor tracking
- Privacy-compliant data collection (POPIA)
- Geographic visitor distribution
- Auction engagement metrics

### **Settings Page** (`/admin/settings`)  
**Authentication**: ✅ Required  
**Features**:
- API key configuration (Google Maps, etc.)
- Company-specific settings
- Privacy and security controls
- System configuration options

## 🛠️ Development Notes

### **Adding New Protected Routes**
1. Add route definition in `components/admin/AdminAppSupabase.tsx`
2. Update route detection in `getCurrentSection()` function
3. Add navigation item in `components/admin/AdminSidebar.tsx`
4. Update Netlify redirects in `public/_redirects`

### **Authentication Testing**
- **Local Development**: Use signup form to create test account
- **Supabase Console**: Create users via Supabase dashboard
- **Database**: Add user records to `users` table with proper `user_type_id`

### **Netlify Deployment**
- All `/admin/*` routes are properly configured in `_redirects`
- SPA routing ensures deep links work correctly
- Authentication state persists across page refreshes

## 🚀 Access Instructions

### **For Developers**
1. Start development server: `npm run dev`
2. Navigate to `http://localhost:5173/admin`
3. Create account or sign in
4. Access all protected admin functionality

### **For Production**
1. Deploy to Netlify with proper environment variables
2. Users must create accounts and be approved by admins
3. All admin routes require authentication
4. API keys configured through admin settings

## 🔍 Route Debugging

### **Common Issues**
- **404 on refresh**: Check `_redirects` file configuration
- **Login loop**: Verify Supabase environment variables
- **Missing routes**: Ensure route is added to `AdminAppSupabase.tsx`

### **Authentication Debug**
- Check browser dev tools for auth errors
- Verify Supabase project configuration
- Test with fresh browser session

---

## Summary

✅ **Public routes** - Accessible to everyone (auction reports)  
🔐 **Admin routes** - Require authentication (all `/admin/*`)  
🚧 **Development routes** - Protected but with placeholder content  
📊 **Analytics** - Fully functional with geographic insights  
⚙️ **Settings** - Complete API and company configuration  

The system ensures proper security while maintaining a great user experience for both public viewers and authenticated administrators.
