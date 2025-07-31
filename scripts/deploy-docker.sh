#!/bin/bash

# 🐳 DOCKER DEPLOYMENT SCRIPT
# Деплой через Docker

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐳 === DOCKER DEPLOYMENT SCRIPT ===${NC}"
echo -e "${BLUE}📦 Building and deploying 999-Web with Docker...${NC}"

# 🔍 Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Please install Docker first.${NC}"
    exit 1
fi

# 🔍 Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running. Please start Docker.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is ready${NC}"

# 📋 Environment variables check
echo -e "\n${YELLOW}📋 Checking environment variables...${NC}"

if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  .env.production not found. Creating template...${NC}"
    cat > .env.production << EOF
NODE_ENV=production
NEXT_PUBLIC_DEV_AUTH_BYPASS=false

# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Inngest (REQUIRED)
INNGEST_EVENT_KEY=your_production_inngest_key

# Optional
NEXT_PUBLIC_SITE_URL=https://your-domain.com
EOF
    echo -e "${RED}❌ Please edit .env.production with your production values${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment file found${NC}"

# 🏗️ Build Docker image
echo -e "\n${BLUE}🏗️ Building Docker image...${NC}"
docker build -t 999-web:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

# 🛑 Stop existing container if running
echo -e "\n${YELLOW}🛑 Stopping existing container...${NC}"
docker stop 999-web 2>/dev/null || true
docker rm 999-web 2>/dev/null || true

# 🚀 Run new container
echo -e "\n${BLUE}🚀 Starting new container...${NC}"

# Get port from user or use default
read -p "$(echo -e ${YELLOW}📝 Enter port for the app [80]: ${NC})" APP_PORT
APP_PORT=${APP_PORT:-80}

# Run container with environment variables
docker run -d \
  --name 999-web \
  -p $APP_PORT:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  999-web:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Container started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start container${NC}"
    exit 1
fi

# 🔍 Wait for app to start
echo -e "\n${YELLOW}⏳ Waiting for app to start...${NC}"
sleep 10

# 🏥 Health check
echo -e "${BLUE}🏥 Running health check...${NC}"
if curl -f http://localhost:$APP_PORT > /dev/null 2>&1; then
    echo -e "${GREEN}✅ App is responding${NC}"
else
    echo -e "${RED}❌ App is not responding${NC}"
    echo -e "${YELLOW}📋 Container logs:${NC}"
    docker logs 999-web --tail 20
    exit 1
fi

# 📊 Show container info
echo -e "\n${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
echo -e "${BLUE}🌐 Your 999-Web app is running at: http://localhost:$APP_PORT${NC}"

echo -e "\n${YELLOW}📊 Container Info:${NC}"
docker ps --filter name=999-web

echo -e "\n${BLUE}🎛️ Useful Commands:${NC}"
echo -e "📋 View logs:        docker logs 999-web -f"
echo -e "🛑 Stop container:   docker stop 999-web"
echo -e "🔄 Restart:          docker restart 999-web"
echo -e "🗑️  Remove:           docker rm -f 999-web"

echo -e "\n${BLUE}🎯 Next Steps:${NC}"
echo -e "1. ✅ Visit http://localhost:$APP_PORT"
echo -e "2. 🗄️ Verify database connection"
echo -e "3. ⚡ Test Inngest integration"
echo -e "4. 🎬 Test video rendering"
echo -e "5. 🔧 Configure reverse proxy (Nginx/Traefik)"

echo -e "\n${GREEN}🕉️ सफलता का द्वार खुल गया! - The door to success is open!${NC}"