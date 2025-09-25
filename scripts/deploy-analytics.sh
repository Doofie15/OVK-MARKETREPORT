#!/bin/bash

# OVK Analytics Deployment Script
# This script deploys the analytics system to Supabase

set -e

echo "🚀 Deploying OVK Analytics System..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're logged in to Supabase
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please login first:"
    echo "   supabase login"
    exit 1
fi

echo "✅ Supabase CLI detected"

# Deploy the Edge Function
echo "📦 Deploying ingest-analytics Edge Function..."
supabase functions deploy ingest-analytics

if [ $? -eq 0 ]; then
    echo "✅ Edge Function deployed successfully"
else
    echo "❌ Failed to deploy Edge Function"
    exit 1
fi

# Set environment variables
echo "🔧 Setting up environment variables..."

# Generate a random salt if IP_SALT is not set
if [ -z "$IP_SALT" ]; then
    IP_SALT=$(openssl rand -hex 32)
    echo "📝 Generated IP_SALT: $IP_SALT"
    echo "⚠️  Please save this IP_SALT value in your .env.local file"
fi

# Set the IP salt
supabase secrets set IP_SALT="$IP_SALT"

if [ $? -eq 0 ]; then
    echo "✅ Environment variables configured"
else
    echo "❌ Failed to set environment variables"
    exit 1
fi

# Check if database migrations are applied
echo "🗄️  Checking database migrations..."
supabase migration list

echo ""
echo "🎉 Analytics deployment completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Add your domain to ALLOW_ORIGINS in supabase/functions/ingest-analytics/index.ts"
echo "   2. Set SUPABASE_SERVICE_ROLE_KEY in your production environment"
echo "   3. Update .env.local with IP_SALT=$IP_SALT"
echo "   4. Visit /admin/analytics to view your dashboard"
echo ""
echo "📖 For detailed setup instructions, see docs/ANALYTICS_SETUP.md"
echo ""

# Test the function
echo "🧪 Testing Edge Function..."
FUNCTION_URL=$(supabase status | grep "Functions URL" | awk '{print $3}')
if [ ! -z "$FUNCTION_URL" ]; then
    echo "   Function URL: $FUNCTION_URL/ingest-analytics"
    echo "   Test with: curl -X POST $FUNCTION_URL/ingest-analytics -H 'Content-Type: application/json' -d '{\"session_id\":\"test\"}'"
fi

echo "✨ Deployment complete!"
