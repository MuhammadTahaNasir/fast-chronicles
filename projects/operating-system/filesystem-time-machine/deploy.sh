#!/bin/bash

echo "🚀 Starting Filesystem Time Machine Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Step 1: Installing Frontend Dependencies${NC}"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend dependencies installation failed${NC}"
    exit 1
fi

echo -e "${GREEN}Step 2: Building Frontend${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo -e "${GREEN}Step 3: Installing Backend Dependencies${NC}"
cd ../backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend dependencies installation failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All dependencies installed and frontend built successfully!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "1. Push your code to GitHub"
echo -e "2. Deploy backend to Railway/Render"
echo -e "3. Deploy frontend to Vercel/Netlify"
echo -e "4. Configure environment variables" 