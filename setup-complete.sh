#!/bin/bash
# Complete Setup Script for Shopify Hydrogen Project
# This script automates all initial setup, leaving only store linking to the user
# Usage: ./setup-complete.sh

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}🚀 Complete Setup - Shopify Hydrogen Project${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""

# Step 1: Check Prerequisites
echo -e "${YELLOW}📋 Step 1: Checking prerequisites...${NC}"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "   ${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo -e "   ${RED}❌ Node.js not found. Please install Node.js 20.0.0 or higher.${NC}"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "   ${GREEN}✅ npm: $NPM_VERSION${NC}"
else
    echo -e "   ${RED}❌ npm not found. Please install npm.${NC}"
    exit 1
fi

# Step 2: Install Dependencies
echo ""
echo -e "${YELLOW}📦 Step 2: Installing project dependencies...${NC}"
echo -e "   ${GRAY}This may take a few minutes...${NC}"

if npm install; then
    echo -e "   ${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "   ${YELLOW}⚠️  npm install completed with warnings${NC}"
fi

# Step 3: Setup Environment File
echo ""
echo -e "${YELLOW}🔐 Step 3: Setting up environment file...${NC}"

if [ -f ".env" ]; then
    echo -e "   ${GRAY}ℹ️  .env file already exists${NC}"
    read -p "   Overwrite with .env.example? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env
        echo -e "   ${GREEN}✅ Created .env from .env.example${NC}"
    fi
else
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "   ${GREEN}✅ Created .env from .env.example${NC}"
    else
        echo -e "   ${YELLOW}⚠️  .env.example not found${NC}"
    fi
fi

# Step 4: Generate Secure SESSION_SECRET
echo ""
echo -e "${YELLOW}🔑 Step 4: Generating secure SESSION_SECRET...${NC}"

if command -v node &> /dev/null; then
    SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Replace SESSION_SECRET if it's still "foobar"
    if grep -q 'SESSION_SECRET="foobar"' .env 2>/dev/null; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/SESSION_SECRET=\"foobar\"/SESSION_SECRET=\"$SESSION_SECRET\"/" .env
        else
            # Linux
            sed -i "s/SESSION_SECRET=\"foobar\"/SESSION_SECRET=\"$SESSION_SECRET\"/" .env
        fi
        echo -e "   ${GREEN}✅ Generated and set secure SESSION_SECRET${NC}"
    else
        echo -e "   ${GRAY}ℹ️  SESSION_SECRET already configured${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  Could not generate SESSION_SECRET automatically${NC}"
    echo -e "   ${GRAY}You can generate it manually: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"${NC}"
fi

# Step 5: Install MCP Dependencies (Optional)
echo ""
echo -e "${YELLOW}🔌 Step 5: Installing MCP dependencies...${NC}"
echo -e "   ${GRAY}Installing Shopify MCP tools globally...${NC}"

read -p "   Install MCP dependencies? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "   ${GRAY}Installing @shopify/dev-mcp...${NC}"
    if npm install -g @shopify/dev-mcp @shopify/theme-check-node 2>&1; then
        echo -e "   ${GREEN}✅ MCP dependencies installed${NC}"
    else
        echo -e "   ${YELLOW}⚠️  MCP installation had issues, but continuing...${NC}"
        echo -e "   ${GRAY}You can install manually: npm install -g @shopify/dev-mcp @shopify/theme-check-node${NC}"
    fi
else
    echo -e "   ${GRAY}ℹ️  Skipped MCP installation${NC}"
    echo -e "   ${GRAY}Install later: npm install -g @shopify/dev-mcp @shopify/theme-check-node${NC}"
fi

# Step 6: Clear npm cache (prevent MCP issues)
echo ""
echo -e "${YELLOW}🧹 Step 6: Cleaning npm cache...${NC}"
if npm cache clean --force 2>&1; then
    echo -e "   ${GREEN}✅ npm cache cleaned${NC}"
else
    echo -e "   ${YELLOW}⚠️  Cache clean had issues, but continuing...${NC}"
fi

# Step 7: Generate TypeScript Types (if store is already linked)
echo ""
echo -e "${YELLOW}📝 Step 7: Checking for store configuration...${NC}"

if grep -q 'PUBLIC_STORE_DOMAIN="mock\.shop"' .env 2>/dev/null; then
    echo -e "   ${GRAY}ℹ️  Using mock shop - skipping codegen${NC}"
    echo -e "   ${GRAY}Run 'npm run codegen' after linking to your store${NC}"
else
    echo -e "   ${GRAY}Attempting to generate TypeScript types...${NC}"
    if npm run codegen 2>&1; then
        echo -e "   ${GREEN}✅ TypeScript types generated${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Codegen had issues (store may not be linked yet)${NC}"
        echo -e "   ${GRAY}Codegen will run after store linking${NC}"
    fi
fi

# Step 8: Verify Setup
echo ""
echo -e "${YELLOW}✅ Step 8: Verifying setup...${NC}"

ALL_GOOD=true

if [ -d "node_modules" ]; then
    echo -e "   ${GREEN}✅ node_modules${NC}"
else
    echo -e "   ${RED}❌ node_modules - MISSING${NC}"
    ALL_GOOD=false
fi

if [ -f ".env" ]; then
    echo -e "   ${GREEN}✅ .env file${NC}"
else
    echo -e "   ${RED}❌ .env file - MISSING${NC}"
    ALL_GOOD=false
fi

if [ -f "package.json" ]; then
    echo -e "   ${GREEN}✅ package.json${NC}"
else
    echo -e "   ${RED}❌ package.json - MISSING${NC}"
    ALL_GOOD=false
fi

# Summary
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✅ Setup Complete!${NC}"
else
    echo -e "${YELLOW}⚠️  Setup completed with issues${NC}"
fi
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""
echo -e "   ${NC}1. 🔗 Link your Shopify store:${NC}"
echo -e "      ${CYAN}npx shopify hydrogen link${NC}"
echo ""
echo -e "      ${GRAY}This will:${NC}"
echo -e "      ${GRAY}- Prompt you to log in to Shopify${NC}"
echo -e "      ${GRAY}- Let you select your store${NC}"
echo -e "      ${GRAY}- Automatically configure .env with store credentials${NC}"
echo ""
echo -e "   ${NC}2. 📝 Generate TypeScript types:${NC}"
echo -e "      ${CYAN}npm run codegen${NC}"
echo ""
echo -e "   ${NC}3. 🚀 Start development server:${NC}"
echo -e "      ${CYAN}npm run dev${NC}"
echo ""
echo -e "   ${NC}4. 📚 (Optional) Install recommended VS Code extensions:${NC}"
echo -e "      ${GRAY}VS Code will prompt you, or check .vscode/extensions.json${NC}"
echo ""
echo -e "   ${NC}5. 🔌 (Optional) Configure MCP servers:${NC}"
echo -e "      ${GRAY}See MCP-SETUP.md for instructions${NC}"
echo ""

echo -e "${YELLOW}📖 Documentation:${NC}"
echo -e "   ${GRAY}- [GETTING-STARTED.md](./GETTING-STARTED.md) - Complete setup guide${NC}"
echo -e "   ${GRAY}- [MCP-SETUP.md](./MCP-SETUP.md) - MCP configuration${NC}"
echo -e "   ${GRAY}- [SETUP-COMPLETE.md](./SETUP-COMPLETE.md) - Setup checklist${NC}"
echo ""

echo -e "${GREEN}🎉 You're all set! Just link your store and start coding!${NC}"
echo ""

