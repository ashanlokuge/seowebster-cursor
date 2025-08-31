#!/bin/bash

# 🚀 SEOWebster Trailing Slash Fix - Automated Deployment Script
# This script automates the deployment process for the trailing slash fix

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 SEOWebster Trailing Slash Fix Deployment${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "astro.config.mjs" ]; then
    echo -e "${RED}❌ ERROR: Please run this script from the frontend directory${NC}"
    exit 1
fi

# Pre-deployment checks
echo -e "${YELLOW}🔍 Pre-deployment checks...${NC}"

# Check git status
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ ERROR: You have uncommitted changes. Please commit or stash them first.${NC}"
    git status --short
    exit 1
fi

# Check if trailing slash fix is in place
if ! grep -q "trailingSlash: 'never'" astro.config.mjs; then
    echo -e "${RED}❌ ERROR: trailingSlash: 'never' not found in astro.config.mjs${NC}"
    exit 1
fi

if [ ! -f "src/middleware/redirects.ts" ]; then
    echo -e "${RED}❌ ERROR: Middleware file not found. Please ensure the trailing slash fix is implemented.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"
echo ""

# Step 1: Clear build cache
echo -e "${YELLOW}🧹 Step 1: Clearing build cache...${NC}"
rm -rf dist/ .astro/ node_modules/.cache/
echo -e "${GREEN}✅ Build cache cleared${NC}"
echo ""

# Step 2: Clean install dependencies
echo -e "${YELLOW}📦 Step 2: Installing dependencies...${NC}"
npm ci
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 3: Build project
echo -e "${YELLOW}🔨 Step 3: Building project...${NC}"
npm run build
echo -e "${GREEN}✅ Project built successfully${NC}"
echo ""

# Step 4: Verify build output
echo -e "${YELLOW}🔍 Step 4: Verifying build output...${NC}"
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ ERROR: Build failed - dist directory not created${NC}"
    exit 1
fi

# Check for any trailing slashes in generated files
trailing_slash_files=$(find dist -name "*.html" -exec grep -l 'href="/[^"]*/"' {} \; 2>/dev/null || true)

if [ -n "$trailing_slash_files" ]; then
    echo -e "${YELLOW}⚠️  WARNING: Some generated files contain trailing slashes in internal links${NC}"
    echo "Files with issues:"
    echo "$trailing_slash_files"
    echo ""
    echo -e "${YELLOW}This may indicate internal link issues that need fixing${NC}"
else
    echo -e "${GREEN}✅ Build output verified - no trailing slash issues found${NC}"
fi
echo ""

# Step 5: Deployment instructions
echo -e "${BLUE}📤 Step 5: Deployment Instructions${NC}"
echo "======================================"
echo ""
echo -e "${YELLOW}Your build is ready for deployment!${NC}"
echo ""
echo -e "${BLUE}Choose your deployment method:${NC}"
echo ""
echo "1. Git deployment:"
echo "   git push origin main"
echo ""
echo "2. Manual file upload:"
echo "   Upload the 'dist/' folder contents to your web server"
echo ""
echo "3. Automated deployment:"
echo "   npm run deploy  # (if configured)"
echo ""
echo "4. rsync to server:"
echo "   rsync -avz dist/ user@server:/path/to/webroot/"
echo ""

# Step 6: Post-deployment verification
echo -e "${BLUE}✅ Step 6: Post-deployment verification${NC}"
echo "============================================="
echo ""
echo -e "${YELLOW}After deployment, run the verification script:${NC}"
echo ""
echo "   ./deployment-verification.sh"
echo ""
echo -e "${BLUE}This will test all URLs and confirm the fix is working.${NC}"
echo ""

# Final status
echo -e "${GREEN}🎉 Deployment preparation completed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Deploy your build using one of the methods above"
echo "2. Run the verification script to confirm success"
echo "3. Monitor for any issues"
echo ""
echo -e "${GREEN}Your trailing slash fix is ready to go live! 🚀${NC}"
