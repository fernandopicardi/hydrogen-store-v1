#!/bin/bash
# Bash script to set up a new project from this template
# Usage: ./setup-new-project.sh client-store-name

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Check if project name is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Project name is required${NC}"
    echo "Usage: ./setup-new-project.sh <project-name>"
    exit 1
fi

PROJECT_NAME=$1

echo ""
echo -e "${CYAN}🚀 Setting up new project: $PROJECT_NAME${NC}"
echo ""

# Validate project name (warn about spaces)
if [[ "$PROJECT_NAME" =~ [[:space:]] ]]; then
    echo -e "${YELLOW}⚠️  Warning: Project name contains spaces. Consider using hyphens instead.${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Rename in package.json
echo -e "${YELLOW}📝 Step 1: Updating package.json...${NC}"
if [ -f "package.json" ]; then
    # Use different methods based on available tools
    if command -v jq &> /dev/null; then
        # Use jq if available (most reliable)
        OLD_NAME=$(jq -r '.name' package.json)
        jq --arg name "$PROJECT_NAME" '.name = $name | .version = "1.0.0"' package.json > package.json.tmp
        mv package.json.tmp package.json
        echo -e "   ${GREEN}✅ Renamed from '$OLD_NAME' to '$PROJECT_NAME'${NC}"
    elif command -v node &> /dev/null; then
        # Use Node.js as fallback
        node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const oldName = pkg.name;
        pkg.name = '$PROJECT_NAME';
        pkg.version = '1.0.0';
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
        console.log('   ✅ Renamed from', oldName, 'to', '$PROJECT_NAME');
        "
    else
        # Manual sed replacement (less reliable but works)
        OLD_NAME=$(grep -o '"name": "[^"]*"' package.json | head -1 | cut -d'"' -f4)
        sed -i.bak "s/\"name\": \"[^\"]*\"/\"name\": \"$PROJECT_NAME\"/" package.json
        sed -i.bak 's/"version": "[^"]*"/"version": "1.0.0"/' package.json
        rm -f package.json.bak
        echo -e "   ${GREEN}✅ Renamed to '$PROJECT_NAME'${NC}"
    fi
else
    echo -e "   ${RED}❌ package.json not found${NC}"
    exit 1
fi

# Step 2: Remove Git history (prompt user)
echo ""
read -p "🗑️  Remove existing Git history? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🗑️  Step 2: Removing Git history...${NC}"
    if [ -d ".git" ]; then
        rm -rf .git
        echo -e "   ${GREEN}✅ Removed .git directory${NC}"
        
        echo -e "   ${YELLOW}📦 Initializing new Git repository...${NC}"
        git init > /dev/null
        git add . > /dev/null
        git commit -m "Initial commit: $PROJECT_NAME" > /dev/null
        echo -e "   ${GREEN}✅ Initialized new Git repository${NC}"
    else
        echo -e "   ${GRAY}ℹ️  No .git directory found, skipping${NC}"
    fi
else
    echo -e "   ${GRAY}ℹ️  Keeping existing Git history${NC}"
fi

# Step 3: Check if .env exists
echo ""
echo -e "${YELLOW}🔐 Step 3: Checking environment configuration...${NC}"
if [ -f ".env" ]; then
    echo -e "   ${YELLOW}⚠️  .env file already exists${NC}"
    read -p "   Overwrite with .env.example? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env
        echo -e "   ${GREEN}✅ Created new .env from .env.example${NC}"
    else
        echo -e "   ${GRAY}ℹ️  Keeping existing .env file${NC}"
    fi
else
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "   ${GREEN}✅ Created .env from .env.example${NC}"
    else
        echo -e "   ${YELLOW}⚠️  .env.example not found, you'll need to create .env manually${NC}"
    fi
fi

# Step 4: Install dependencies (optional)
echo ""
read -p "📦 Install dependencies? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "   ${YELLOW}Installing dependencies (this may take a minute)...${NC}"
    if npm install; then
        echo -e "   ${GREEN}✅ Dependencies installed${NC}"
    else
        echo -e "   ${RED}❌ Error installing dependencies${NC}"
    fi
fi

# Summary
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Project setup complete!${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo ""
echo -e "   ${NC}1. Configure your store:${NC}"
echo -e "      ${GRAY}npx shopify hydrogen link${NC}"
echo ""
echo -e "      ${GRAY}OR manually edit .env with your store credentials${NC}"
echo ""
echo -e "   ${NC}2. Generate TypeScript types:${NC}"
echo -e "      ${GRAY}npm run codegen${NC}"
echo ""
echo -e "   ${NC}3. Start development server:${NC}"
echo -e "      ${GRAY}npm run dev${NC}"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo -e "   ${GRAY}- [GETTING-STARTED.md](./GETTING-STARTED.md) - Complete setup guide${NC}"
echo -e "   ${GRAY}- [REUSING-THIS-TEMPLATE.md](./REUSING-THIS-TEMPLATE.md) - This guide${NC}"
echo -e "   ${GRAY}- [MCP-SETUP.md](./MCP-SETUP.md) - MCP configuration guide${NC}"
echo ""
echo -e "${YELLOW}🔧 Recommended: Set up MCP servers for enhanced development:${NC}"
echo -e "   ${GRAY}See MCP-SETUP.md for instructions${NC}"
echo ""
echo -e "${CYAN}Happy coding! 🎉${NC}"
echo ""

