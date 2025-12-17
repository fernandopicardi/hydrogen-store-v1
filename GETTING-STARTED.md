# Getting Started Guide

Welcome! This guide will help you set up your Hydrogen store from scratch. Follow these steps in order.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** version 20.0.0 or higher (check with `node --version`)
- **npm** or another package manager
- **A Shopify account** (optional for demo mode, required for connecting to your store)
- **Git** (for cloning the repository)

💡 **Windows Users:**
- If using NVM on Windows, use `nvm-windows`
- Use PowerShell or Git Bash for the best experience with Shopify CLI
- Ensure your Node version matches the requirement in `package.json` (>=20.0.0)

## 🚀 Step 1: Clone and Setup

### Option A: Automated Setup (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hydrogen-store-v1
   ```

2. **Run the complete setup script:**
   
   **Windows (PowerShell):**
   ```powershell
   .\setup-complete.ps1
   ```
   
   **Mac/Linux (Bash):**
   ```bash
   chmod +x setup-complete.sh
   ./setup-complete.sh
   ```
   
   This script will:
   - ✅ Install all npm dependencies
   - ✅ Create `.env` from `.env.example`
   - ✅ Generate a secure SESSION_SECRET
   - ✅ Install MCP dependencies (optional)
   - ✅ Clean npm cache
   - ✅ Verify everything is set up correctly

3. **Skip to Step 2** - The script handles everything!

### Option B: Manual Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hydrogen-store-v1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🔧 Step 2: Choose Your Setup Path

You have two options:

### Option A: Demo Mode (Quick Start - No Shopify Account Needed)

Perfect for exploring the template and testing functionality without connecting to a real store.

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

   The `.env.example` file contains pre-configured credentials for Shopify's Mock Shop, so you can start immediately.

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will be available at `http://localhost:3000` (or another port if 3000 is occupied).

### Option B: Connect to Your Shopify Store (Real Data)

Connect to your own Shopify store to work with real products, collections, and customer data.

1. **Set up environment file:**
   ```bash
   cp .env.example .env
   ```

   This ensures you have a `SESSION_SECRET` configured (required before linking).

2. **Connect to your Shopify store:**
   ```bash
   npx shopify hydrogen link
   ```

   This command will:
   - Prompt you to log in to your Shopify account
   - Allow you to select your store
   - Automatically create and configure the `.env` file with all required environment variables

   ⚠️ **If you get an "Access Denied" error**, see [Troubleshooting: Access Denied](#troubleshooting-access-denied) below.

3. **Generate TypeScript types:**
   ```bash
   npm run codegen
   ```

   This updates the GraphQL types based on your store's actual schema.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔑 Step 3: Manual Configuration (Alternative)

If you cannot use `npx shopify hydrogen link` (due to permissions or other issues), you can configure manually:

### Get Your Storefront API Token

1. **Access Shopify Admin:**
   - Go to: https://admin.shopify.com/store/YOUR-STORE-NAME

2. **Navigate to Apps:**
   - Go to **Settings** → **Apps and sales channels**
   - Click **Develop apps** (or "Desenvolver apps")

3. **Create or Edit an App:**
   - If you already have an app, click on it
   - If not, click **Create an app**
   - Give it a name (e.g., "Hydrogen Storefront")

4. **Configure Storefront API:**
   - In the app, go to the **API credentials** tab
   - Scroll to **Storefront API**
   - Click **Configure** or **Enable**

5. **Set Permissions:**
   - Select the necessary permissions:
     - `unauthenticated_read_product_listings`
     - `unauthenticated_read_product_inventory`
     - `unauthenticated_read_checkouts`
     - `unauthenticated_write_checkouts`
     - `unauthenticated_read_customers`
     - `unauthenticated_write_customers`
     - And others as needed

6. **Install the App:**
   - Click **Install app**
   - Confirm the installation

7. **Copy the Token:**
   - After installing, you'll see the **Storefront API access token**
   - Copy this token

### Update Your .env File

Edit your `.env` file with the following values:

```env
# Session Secret (required)
SESSION_SECRET="your-secure-random-string"

# Generate a secure SESSION_SECRET:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Shopify Store Configuration
PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
PUBLIC_STOREFRONT_API_TOKEN="your-storefront-api-token"
PUBLIC_STOREFRONT_API_VERSION="2024-01"

# Optional: Storefront ID (if you have it)
# PUBLIC_STOREFRONT_ID="your-storefront-id"

# Optional: Customer Account API (if needed)
# PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID="your-client-id"
# PUBLIC_CUSTOMER_ACCOUNT_API_URL="your-customer-account-url"

# Optional: Custom menu handles
# PUBLIC_HEADER_MENU_HANDLE=main-menu
# PUBLIC_FOOTER_MENU_HANDLE=footer
```

## 🛠️ Troubleshooting

### Troubleshooting: Access Denied

If you get this error when running `npx shopify hydrogen link`:

```
Access denied for hydrogenStorefronts field.
Required access: Request must be initiated from the Shopify CLI and 
user must have full access to apps or access to the Hydrogen channel.
```

**Solution:**

1. **Check Your Permissions:**
   - Go to Shopify Admin → **Settings** → **Users and permissions**
   - Find your account in the staff list
   - Ensure you have:
     - **Store owner** (full access), OR
     - **Staff member with "Full access to apps"** permission, OR
     - **Staff member with "Hydrogen channel"** access

2. **If You Don't Have Permissions:**
   - Contact the store owner to grant you the necessary permissions
   - Or ask them to run `npx shopify hydrogen link` and share the `.env` file
   - Or use [Manual Configuration](#step-3-manual-configuration-alternative) instead

3. **Enable Hydrogen Channel (if available):**
   - Go to **Settings** → **Sales channels**
   - Look for **Hydrogen** in available channels
   - Enable it if it's not already enabled

### Troubleshooting: MCP Errors

If you're using Shopify MCP (Model Context Protocol) and encounter errors:

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Install MCP dependencies globally:**
   ```bash
   npm install -g @shopify/dev-mcp @shopify/theme-check-node
   ```

3. **Clear npx cache (Windows):**
   ```powershell
   Remove-Item -Recurse -Force "$env:LOCALAPPDATA\npm-cache\_npx" -ErrorAction SilentlyContinue
   ```

4. **Restart Cursor/IDE** completely

For more details, see [MCP-TROUBLESHOOTING.md](./MCP-TROUBLESHOOTING.md)

### Common Issues

**Port already in use:**
- The dev server will automatically use the next available port
- Check the terminal output for the actual port number

**TypeScript errors:**
- Run `npm run codegen` to generate types
- Run `npm run typecheck` to verify types

**Environment variables not loading:**
- Make sure you have a `.env` file (not just `.env.example`)
- Restart the dev server after changing `.env`

## ✅ Verification

After setup, verify everything works:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - Navigate to the URL shown in the terminal (usually `http://localhost:3000`)

3. **Check the homepage:**
   - You should see the Hydrogen store template
   - Try navigating to different pages
   - Test the search functionality

## 📚 Next Steps

Once your store is running:

1. **Customize Components:**
   - Edit components in `app/components/`
   - Customize homepage sections in `app/components/sections/`

2. **Add Content:**
   - Access Shopify Admin
   - Add products, collections, and content
   - Configure navigation menus (header and footer)

3. **Generate Types:**
   ```bash
   npm run codegen
   ```
   Run this whenever your store schema changes

4. **Read the Documentation:**
   - [README.md](./README.md) - Full project documentation
   - [Shopify Hydrogen Docs](https://shopify.dev/custom-storefronts/hydrogen)
   - [React Router Docs](https://reactrouter.com)

## 🔒 Security Notes

- **Never commit `.env` file** - It's already in `.gitignore`
- **Never share tokens** in messages, emails, or public repositories
- **Revoke tokens immediately** if compromised
- **Use secure SESSION_SECRET** in production (generate with crypto.randomBytes)

## 📖 Additional Resources

- [MCP-SETUP.md](./MCP-SETUP.md) - Set up MCP servers (Shopify & Figma) for enhanced development
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Detailed troubleshooting guide
- [SETUP-STOREFRONT-API.md](./SETUP-STOREFRONT-API.md) - Storefront API setup guide
- [MCP-TROUBLESHOOTING.md](./MCP-TROUBLESHOOTING.md) - MCP-specific troubleshooting

---

**Need Help?** Check the [Shopify Community](https://community.shopify.com/) or the [Hydrogen GitHub](https://github.com/Shopify/hydrogen) repository.

