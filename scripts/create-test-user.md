# Create Test User for Analytics Testing

Since the analytics page is behind authentication, you need a user account to access `/admin/analytics`.

## Method 1: Quick Development Testing
Access the analytics page with auth bypass:
```
http://localhost:5173/admin/analytics?bypass=true
```

## Method 2: Create Test User via Supabase Console

1. **Go to Supabase Dashboard**:
   - Visit: https://gymdertakhxjmfrmcqgp.supabase.co
   - Go to Authentication > Users

2. **Create User**:
   - Click "Add User"
   - Email: `test@ovk.co.za`
   - Password: `TestPassword123!`
   - Set email confirmed: ✅

3. **Add User Profile**:
   - Go to Table Editor > users table
   - Add record:
     ```sql
     INSERT INTO users (id, email, name, surname, user_type_id)
     VALUES (
       '<user-id-from-auth>', 
       'test@ovk.co.za', 
       'Test', 
       'Admin',
       (SELECT id FROM user_types WHERE name = 'admin' LIMIT 1)
     );
     ```

## Method 3: Sign Up via the App

1. **Access Admin Panel**: Go to `http://localhost:5173/admin`
2. **Click "Sign Up"** on the login form
3. **Fill in details**:
   - Email: `test@ovk.co.za`
   - Password: `TestPassword123!`
   - Name: `Test`
   - Surname: `Admin`
4. **Sign In** with these credentials
5. **Access Analytics**: Navigate to `/admin/analytics`

## Method 4: SQL Quick Setup

Run this in Supabase SQL Editor:

```sql
-- Create auth user (replace with actual Supabase auth UUID)
-- Then run this to create the profile:

INSERT INTO public.users (
  id,
  email, 
  name, 
  surname, 
  user_type_id,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual auth user ID
  'test@ovk.co.za',
  'Test',
  'Admin', 
  (SELECT id FROM user_types WHERE name = 'admin' LIMIT 1),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
```

## Access Analytics

Once authenticated, you can access:
- `/admin/analytics` - Main analytics dashboard
- `/admin/settings` - Configure API keys (Google Maps, etc.)
- `/admin/dashboard` - Main admin dashboard

## API Configuration

1. **Go to** `/admin/settings` after logging in
2. **Add your Google Maps API key**: `AIzaSyD3wWF2a8TwWnXG7W_8ALtydF1si4JCpOY`
3. **Configure other settings** as needed
4. **Save settings**
5. **Navigate to Analytics** to see the maps working!

The analytics system will start collecting data immediately once accessed.
