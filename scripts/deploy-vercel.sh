#!/bin/bash

# 🚀 QUICK DEPLOY TO VERCEL
# Быстрый деплой на Vercel

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 === VERCEL DEPLOYMENT SCRIPT ===${NC}"
echo -e "${BLUE}📦 Preparing 999-Web for production deployment...${NC}"

# 🔍 Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# 📋 Pre-deployment checks
echo -e "\n${YELLOW}📋 Pre-deployment checks...${NC}"

# Check TypeScript
echo -e "${BLUE}🔍 Checking TypeScript...${NC}"
if pnpm exec tsc --noEmit; then
    echo -e "${GREEN}✅ TypeScript OK${NC}"
else
    echo -e "${RED}❌ TypeScript errors found. Please fix before deploying.${NC}"
    exit 1
fi

# Check for required files
echo -e "${BLUE}🔍 Checking required files...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

if [ ! -f "next.config.mjs" ]; then
    echo -e "${RED}❌ next.config.mjs not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Required files OK${NC}"

# 🏗️ Build test (optional)
read -p "$(echo -e ${YELLOW}🏗️ Run build test before deploy? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🏗️ Running build test...${NC}"
    if pnpm build; then
        echo -e "${GREEN}✅ Build test passed${NC}"
    else
        echo -e "${RED}❌ Build test failed${NC}"
        exit 1
    fi
fi

# 🌐 Deploy to Vercel
echo -e "\n${BLUE}🌐 Deploying to Vercel...${NC}"

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Please login to Vercel...${NC}"
    vercel login
fi

# Deploy
echo -e "${GREEN}🚀 Starting deployment...${NC}"
vercel --prod

# 🎉 Success message
echo -e "\n${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
echo -e "${BLUE}🌐 Your 999-Web app is now live!${NC}"

# 🔗 Show deployment info
echo -e "\n${YELLOW}📊 Deployment Info:${NC}"
vercel ls

echo -e "\n${BLUE}🎛️ Next Steps:${NC}"
echo -e "1. ✅ Visit your deployed app"
echo -e "2. 🗄️ Set up production database (Supabase)"
echo -e "3. ⚡ Configure Inngest for production"
echo -e "4. 🎬 Test video rendering"
echo -e "5. 📊 Set up monitoring"

echo -e "\n${GREEN}🕉️ सफलता तेरे साथ हो! - Success be with you!${NC}"