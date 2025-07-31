#!/bin/bash

# 🛑 DEV STOP SCRIPT
# Останавливает все сервисы разработки

set -e

# 🎨 Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 📁 PID files directory
PIDS_DIR="./scripts/pids"

echo -e "${YELLOW}🛑 Stopping 999-Web Development Environment...${NC}"

# 🔍 Function to stop process by PID file
stop_service() {
    local service_name=$1
    local pid_file="$PIDS_DIR/$2.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${BLUE}🛑 Stopping $service_name (PID: $pid)...${NC}"
            kill "$pid" 2>/dev/null || true
            
            # Wait a bit for graceful shutdown
            sleep 2
            
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                echo -e "${YELLOW}   Force killing $service_name...${NC}"
                kill -9 "$pid" 2>/dev/null || true
            fi
            
            echo -e "${GREEN}✅ $service_name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️ $service_name was not running${NC}"
        fi
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}⚠️ No PID file found for $service_name${NC}"
    fi
}

# 🛑 Stop services (but NOT shared Inngest server!)
stop_service "Next.js Server" "nextjs"
echo -e "${BLUE}⚡ Keeping shared Inngest Dev Server running (used by other agents)${NC}"
stop_service "Remotion Studio" "remotion"

# 🧹 Kill any remaining processes by name (fallback)
echo -e "${BLUE}🧹 Cleaning up our processes (NOT touching shared Inngest)...${NC}"

# Kill remaining next dev processes
pkill -f "next dev" 2>/dev/null || true

# DON'T kill shared Inngest processes - they're used by other agents!
echo -e "${YELLOW}⚠️  NOT killing Inngest processes (shared with other agents)${NC}"

# Kill remaining remotion processes
pkill -f "remotion studio" 2>/dev/null || true
pkill -f "remotion preview" 2>/dev/null || true

# 🧹 Clean up PID directory
rm -rf "$PIDS_DIR"

# 🧹 Kill processes using our ports (if any)
echo -e "${BLUE}🔍 Checking for processes on our ports...${NC}"

# Check and kill port 80
PORT_80_PID=$(lsof -ti:80 2>/dev/null || true)
if [ ! -z "$PORT_80_PID" ]; then
    echo -e "${YELLOW}🔫 Killing process on port 80 (PID: $PORT_80_PID)${NC}"
    kill -9 $PORT_80_PID 2>/dev/null || true
fi

# DON'T kill port 8288 - it's the shared Inngest server!
PORT_8288_PID=$(lsof -ti:8288 2>/dev/null || true)
if [ ! -z "$PORT_8288_PID" ]; then
    echo -e "${BLUE}🤖 Process on port 8288 (PID: $PORT_8288_PID) - KEEPING (shared Inngest)${NC}"
fi

# Check and kill port 3001
PORT_3001_PID=$(lsof -ti:3001 2>/dev/null || true)
if [ ! -z "$PORT_3001_PID" ]; then
    echo -e "${YELLOW}🔫 Killing process on port 3001 (PID: $PORT_3001_PID)${NC}"
    kill -9 $PORT_3001_PID 2>/dev/null || true
fi

echo -e "\n${GREEN}✅ All development services stopped successfully!${NC}"
echo -e "${BLUE}🧹 Cleanup completed.${NC}"

# 📊 Show final status
echo -e "\n${YELLOW}📊 Final Port Status:${NC}"
echo -e "Port 80 (Next.js):    $(lsof -ti:80 >/dev/null 2>&1 && echo "🔴 OCCUPIED" || echo "✅ FREE")"
echo -e "Port 8288 (Inngest):  $(lsof -ti:8288 >/dev/null 2>&1 && echo "🤖 SHARED (other agents)" || echo "❌ OFFLINE")"
echo -e "Port 3001 (Remotion): $(lsof -ti:3001 >/dev/null 2>&1 && echo "🔴 OCCUPIED" || echo "✅ FREE")"

echo -e "\n${GREEN}🎯 Ready to restart with: pnpm run dev:full${NC}"