#!/bin/bash

# 🚀 DEV FULL STACK LAUNCHER
# Запускает все сервисы для разработки одной командой

set -e

# 🎨 Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 📁 PID files directory
PIDS_DIR="./scripts/pids"
mkdir -p "$PIDS_DIR"

echo -e "${BLUE}🚀 Starting 999-Web Full Development Environment...${NC}"
echo -e "${YELLOW}===============================================${NC}"

# 🧹 Cleanup function
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping our services (keeping shared Inngest server)...${NC}"
    ./scripts/dev-stop.sh
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

# 🔍 Check if ports are available
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        echo -e "${RED}❌ Port $port is already in use (needed for $service)${NC}"
        echo -e "${YELLOW}   Please stop the service using this port and try again${NC}"
        exit 1
    fi
}

# 🔍 Check Inngest server availability (don't start new one!)
check_inngest_server() {
    if curl -s --max-time 3 "http://localhost:8288" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Shared Inngest Dev Server found on port 8288${NC}"
        echo -e "${BLUE}🤖 Using existing server (shared with other agents)${NC}"
        return 0
    else
        echo -e "${RED}❌ Shared Inngest Dev Server not found on port 8288${NC}"
        echo -e "${YELLOW}   Please ensure the shared Inngest server is running${NC}"
        echo -e "${YELLOW}   Contact DevOps team or start manually: npx inngest-cli@latest dev --port 8288${NC}"
        return 1
    fi
}

echo -e "${BLUE}🔍 Checking port availability...${NC}"
check_port 80 "Next.js"
check_port 3001 "Remotion Studio"

echo -e "${BLUE}🤖 Checking shared Inngest Dev Server...${NC}"
if ! check_inngest_server; then
    exit 1
fi

# 📊 Create logs directory
echo -e "${BLUE}📊 Creating logs directory...${NC}"
mkdir -p ./scripts/logs

# 🌐 Start Next.js server
echo -e "${GREEN}🌐 Starting Next.js server (port 80)...${NC}"
NEXT_PUBLIC_DEV_AUTH_BYPASS=true pnpm next dev -p 80 > ./scripts/logs/nextjs.log 2>&1 &
NEXTJS_PID=$!
echo $NEXTJS_PID > "$PIDS_DIR/nextjs.pid"
echo -e "   Next.js PID: $NEXTJS_PID"

# ⚡ Connect to existing Inngest Dev Server (shared)
echo -e "${GREEN}⚡ Using shared Inngest Dev Server (port 8288)...${NC}"
echo -e "${BLUE}🤖 No need to start - using existing server shared with other agents${NC}"
# Set environment variable for our app to connect
export INNGEST_DEV_SERVER_URL="http://localhost:8288"

# 🎛️ Start Remotion Studio
echo -e "${GREEN}🎛️ Starting Remotion Studio (port 3001)...${NC}"
pnpm video:preview > ./scripts/logs/remotion.log 2>&1 &
REMOTION_PID=$!
echo $REMOTION_PID > "$PIDS_DIR/remotion.pid"
echo -e "   Remotion PID: $REMOTION_PID"

echo -e "\n${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 8

# 🔍 Health check
echo -e "${BLUE}🏥 Running health check...${NC}"
./scripts/health-check.sh

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ ALL SERVICES STARTED SUCCESSFULLY!${NC}"
    echo -e "${YELLOW}===============================================${NC}"
    echo -e "${GREEN}🌐 Next.js App:       ${BLUE}http://localhost:80${NC}"
    echo -e "${GREEN}🎬 Video Editor:      ${BLUE}http://localhost:80/video-editor${NC}"
    echo -e "${GREEN}⚡ Inngest Dashboard: ${BLUE}http://localhost:8288${NC}"
    echo -e "${GREEN}🎛️ Remotion Studio:   ${BLUE}http://localhost:3001${NC}"
    echo -e "${YELLOW}===============================================${NC}"
    echo -e "${BLUE}📊 Logs:${NC}"
    echo -e "   Next.js: ./scripts/logs/nextjs.log"
    echo -e "   Inngest: ./scripts/logs/inngest.log"
    echo -e "   Remotion: ./scripts/logs/remotion.log"
    echo -e "${YELLOW}===============================================${NC}"
    echo -e "${GREEN}🎯 Ready for development! Press Ctrl+C to stop all services.${NC}"
    echo -e "\n${BLUE}🧪 Quick Test Commands:${NC}"
    echo -e "   pnpm run test:health-check  # Check all services"
    echo -e "   pnpm run dev:stop          # Stop all services"
    echo -e "\n${YELLOW}💡 Tip: Open multiple terminals to monitor logs:${NC}"
    echo -e "   tail -f ./scripts/logs/nextjs.log"
    echo -e "   tail -f ./scripts/logs/inngest.log"
    echo -e "   tail -f ./scripts/logs/remotion.log"
else
    echo -e "\n${RED}❌ Some services failed to start. Check logs for details.${NC}"
    cleanup
    exit 1
fi

# 🔄 Keep script running and monitor processes
while true; do
    # Check if all processes are still running
    if ! kill -0 $NEXTJS_PID 2>/dev/null; then
        echo -e "${RED}❌ Next.js server stopped unexpectedly${NC}"
        cleanup
        exit 1
    fi
    
    # Check shared Inngest server is still accessible (not our responsibility to manage)
    if ! check_inngest_server > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Shared Inngest server became inaccessible${NC}"
        echo -e "${YELLOW}   Contact DevOps team or other agents admin${NC}"
        # Don't exit - continue working without Inngest temporarily
    fi
    
    if ! kill -0 $REMOTION_PID 2>/dev/null; then
        echo -e "${RED}❌ Remotion Studio stopped unexpectedly${NC}"
        cleanup
        exit 1
    fi
    
    sleep 5
done