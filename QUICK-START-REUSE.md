# Quick Start: Reusing for New Store

The fastest way to set up this template for a new client/store.

## 🚀 2-Step Setup

### Step 1: Clone and Run Complete Setup

```bash
git clone <repo-url> client-store-name
cd client-store-name
```

**Windows:**
```powershell
.\setup-complete.ps1
```

**Mac/Linux:**
```bash
chmod +x setup-complete.sh
./setup-complete.sh
```

This will:
- ✅ Rename project (if using setup-new-project script first)
- ✅ Install all dependencies
- ✅ Configure environment
- ✅ Generate secure keys
- ✅ Set up MCP (optional)

### Step 2: Connect Store and Start

```bash
npx shopify hydrogen link
npm run dev
```

## ✅ Done!

Your project is now configured and running. See [REUSING-THIS-TEMPLATE.md](./REUSING-THIS-TEMPLATE.md) for detailed information.

## Alternative: Project Setup First

If you want to rename the project first:

```bash
# Step 1: Rename project
.\setup-new-project.ps1 -ProjectName "client-store-name"

# Step 2: Complete setup
.\setup-complete.ps1

# Step 3: Link store
npx shopify hydrogen link
npm run dev
```

