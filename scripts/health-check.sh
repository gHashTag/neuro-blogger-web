#!/bin/bash

# 🏥 HEALTH CHECK SCRIPT
# Проверяет доступность всех сервисов

set -e

# 🎨 Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 📊 Health check results
NEXTJS_STATUS="❌"
INNGEST_STATUS="❌"
REMOTION_STATUS="❌"
ALL_HEALTHY=true

echo -e "${BLUE}🏥 Running Health Check for 999-Web Development Environment...${NC}"
echo -e "${YELLOW}================================================================${NC}"

# 🔍 Function to check HTTP endpoint
check_http() {
    local url=$1
    local service_name=$2
    local timeout=${3:-10}
    
    echo -e "${BLUE}🔍 Checking $service_name: $url${NC}"
    
    if curl -s --max-time $timeout "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service_name is healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is not responding${NC}"
        return 1
    fi
}

# 🔍 Function to check if process is running
check_process() {
    local process_name=$1
    local service_name=$2
    
    if pgrep -f "$process_name" > /dev/null; then
        echo -e "${GREEN}✅ $service_name process is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name process is not running${NC}"
        return 1
    fi
}

# 🌐 Check Next.js Server
echo -e "\n${YELLOW}🌐 Checking Next.js Server...${NC}"
if check_http "http://localhost:80" "Next.js Server" 15; then
    NEXTJS_STATUS="✅"
    
    # Additional check for specific pages
    if check_http "http://localhost:80/video-editor" "Video Editor Page" 10; then
        echo -e "${GREEN}   📺 Video Editor page is accessible${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Video Editor page might have issues${NC}"
    fi
else
    NEXTJS_STATUS="❌"
    ALL_HEALTHY=false
    
    # Check if process is at least running
    if check_process "next dev" "Next.js"; then
        echo -e "${YELLOW}   💡 Process is running but not responding to HTTP requests${NC}"
        echo -e "${YELLOW}   💡 This might be normal if the server is still starting up${NC}"
    fi
fi

# ⚡ Check Shared Inngest Server
echo -e "\n${YELLOW}⚡ Checking Shared Inngest Dev Server...${NC}"
if check_http "http://localhost:8288" "Inngest Dashboard" 10; then
    INNGEST_STATUS="✅"
    echo -e "${BLUE}   🤖 Shared server is healthy (used by multiple agents)${NC}"
    
    # Check for specific Inngest endpoints
    if check_http "http://localhost:80/api/inngest" "Inngest API Integration" 5; then
        echo -e "${GREEN}   🔗 Our API integration with shared server is working${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Our API integration might have issues${NC}"
    fi
else
    INNGEST_STATUS="❌"
    ALL_HEALTHY=false
    echo -e "${RED}   ❌ Shared Inngest server is not accessible${NC}"
    echo -e "${YELLOW}   💡 Contact DevOps team or other agents admin${NC}"
    echo -e "${YELLOW}   💡 This server is shared between multiple agents${NC}"
fi

# 🎛️ Check Remotion Studio
echo -e "\n${YELLOW}🎛️ Checking Remotion Studio...${NC}"
if check_http "http://localhost:3001" "Remotion Studio" 10; then
    REMOTION_STATUS="✅"
else
    REMOTION_STATUS="❌"
    # Note: Remotion Studio is optional for basic functionality
    echo -e "${YELLOW}   💡 Remotion Studio is optional - main app can work without it${NC}"
    
    if check_process "remotion" "Remotion Studio"; then
        echo -e "${YELLOW}   💡 Remotion process is running but not responding${NC}"
    fi
fi

# 📊 Check database connectivity (Supabase)
echo -e "\n${YELLOW}🗄️ Checking Database Connectivity...${NC}"
DB_CHECK=$(curl -s --max-time 5 "http://localhost:80/api/video/render-status?video_id=health-check" \
    -H "x-user-id: health-check-user" 2>/dev/null || echo "FAILED")

if [[ "$DB_CHECK" == *"success"* ]] || [[ "$DB_CHECK" == *"video_id"* ]]; then
    echo -e "${GREEN}✅ Database connectivity is working${NC}"
    DB_STATUS="✅"
else
    echo -e "${RED}❌ Database connectivity issues detected${NC}"
    echo -e "${YELLOW}   💡 Check Supabase configuration and network${NC}"
    DB_STATUS="❌"
    ALL_HEALTHY=false
fi

# 📁 Check test assets
echo -e "\n${YELLOW}📁 Checking Test Assets...${NC}"
ASSETS_DIR="./public/test-assets"
REQUIRED_ASSETS=("lip-sync.mp4" "cover01.png" "news.mp3" "bg-video01.mp4" "bg-video02.mp4" "bg-video03.mp4" "bg-video04.mp4")
MISSING_ASSETS=()

for asset in "${REQUIRED_ASSETS[@]}"; do
    if [ -f "$ASSETS_DIR/$asset" ]; then
        echo -e "${GREEN}✅ $asset found${NC}"
    else
        echo -e "${RED}❌ $asset missing${NC}"
        MISSING_ASSETS+=("$asset")
        ALL_HEALTHY=false
    fi
done

if [ ${#MISSING_ASSETS[@]} -eq 0 ]; then
    ASSETS_STATUS="✅"
else
    ASSETS_STATUS="❌"
    echo -e "${RED}   Missing assets: ${MISSING_ASSETS[*]}${NC}"
fi

# 📊 Final Results Summary
echo -e "\n${YELLOW}================================================================${NC}"
echo -e "${BLUE}📊 HEALTH CHECK SUMMARY${NC}"
echo -e "${YELLOW}================================================================${NC}"
echo -e "🌐 Next.js Server:       $NEXTJS_STATUS  http://localhost:80"
echo -e "⚡ Inngest (Shared):     $INNGEST_STATUS  http://localhost:8288"
echo -e "🎛️ Remotion Studio:      $REMOTION_STATUS  http://localhost:3001"
echo -e "🗄️ Database:             $DB_STATUS  Supabase Connectivity"
echo -e "📁 Test Assets:          $ASSETS_STATUS  Required video/audio files"
echo -e "${YELLOW}================================================================${NC}"

# 🎯 Overall Status
if [ "$ALL_HEALTHY" = true ]; then
    echo -e "${GREEN}🎉 ALL SYSTEMS HEALTHY! Ready for development.${NC}"
    echo -e "\n${BLUE}🚀 Quick Start:${NC}"
    echo -e "   1. Open Video Editor: ${BLUE}http://localhost:80/video-editor${NC}"
    echo -e "   2. Monitor Inngest: ${BLUE}http://localhost:8288${NC}"
    echo -e "   3. Edit Compositions: ${BLUE}http://localhost:3001${NC}"
    exit 0
else
    echo -e "${RED}⚠️ SOME ISSUES DETECTED! Check failed services above.${NC}"
    echo -e "\n${YELLOW}🔧 Troubleshooting:${NC}"
    
    if [ "$NEXTJS_STATUS" = "❌" ]; then
        echo -e "   • Next.js: Check logs in ./scripts/logs/nextjs.log"
        echo -e "   • Try: pnpm run dev:stop && pnpm run dev:full"
    fi
    
    if [ "$INNGEST_STATUS" = "❌" ]; then
        echo -e "   • Inngest: Shared server is not accessible"
        echo -e "   • Contact DevOps team or check with other agents"
        echo -e "   • Manual start: npx inngest-cli@latest dev --port 8288"
    fi
    
    if [ "$DB_STATUS" = "❌" ]; then
        echo -e "   • Database: Check Supabase configuration in .env.local"
        echo -e "   • Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    fi
    
    if [ "$ASSETS_STATUS" = "❌" ]; then
        echo -e "   • Assets: Copy required files to ./public/test-assets/"
        echo -e "   • Missing: ${MISSING_ASSETS[*]}"
    fi
    
    echo -e "\n${BLUE}📚 Documentation: TESTING_PLAN.md${NC}"
    exit 1
fi