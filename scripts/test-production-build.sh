#!/bin/bash

# Script to test production build locally
echo "🚀 Testing production build locally..."

# Export required environment variables
export NODE_ENV=production
export NEXT_PUBLIC_LOCAL_URL=https://999-web-production.up.railway.app
export NEXT_PUBLIC_SITE_URL=https://dao999nft.com
export NEXT_PUBLIC_DEV=false
export NEXT_PUBLIC_SENTRY_DSN=https://dummy@sentry.io/0
export NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out

# Run the build
echo "🔨 Building production bundle..."
pnpm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "✅ Build succeeded!"
    echo "You can now run 'pnpm run start' to test the production server locally"
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi
