# Reusing This Template for Multiple Stores

This guide will help you quickly set up this Hydrogen template for a new client or store. The template is designed to be completely reusable - just clone, configure, and customize!

## 🎯 Overview

This template is **store-agnostic** - it doesn't contain any hardcoded store references. All store-specific configuration is stored in the `.env` file (which is in `.gitignore`), making it perfect for reusing across multiple projects.

## 🚀 Quick Start (2 Steps)

### Method 1: Complete Automated Setup (Recommended - Easiest)

**Windows:**
```powershell
.\setup-complete.ps1
```

**Mac/Linux:**
```bash
chmod +x setup-complete.sh
./setup-complete.sh
```

This will handle everything automatically. Then just:
```bash
npx shopify hydrogen link
npm run dev
```

### Method 2: Using the Project Setup Script

**Windows (PowerShell):**
```powershell
.\setup-new-project.ps1 -ProjectName "client-store-name"
```

**Mac/Linux (Bash):**
```bash
chmod +x setup-new-project.sh
./setup-new-project.sh client-store-name
```

The script will:
- ✅ Rename the project in `package.json`
- ✅ Optionally remove Git history
- ✅ Initialize a new Git repository
- ✅ Show you the next steps

### Method 2: Manual Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url> client-store-name
   cd client-store-name
   ```

2. **Rename the project:**
   - Edit `package.json` and change the `name` field to your project name

3. **Configure for new store:**
   ```bash
   cp .env.example .env
   npx shopify hydrogen link
   ```

## 📋 Complete Setup Process

### Step 1: Clone and Navigate

```bash
git clone <your-repo-url> my-client-store
cd my-client-store
```

### Step 2: Remove Git History (Optional but Recommended)

If you want a completely fresh repository for the new client:

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force .git
git init
git add .
git commit -m "Initial commit: My Client Store"
```

**Mac/Linux:**
```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit: My Client Store"
```

### Step 3: Rename the Project

Edit `package.json` and change:
```json
{
  "name": "my-client-store",  // Change this
  "version": "1.0.0",          // Optionally reset to 1.0.0
  ...
}
```

Or use the setup script which does this automatically.

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Configure for New Store

**Option A: Using Shopify CLI (Recommended)**
```bash
cp .env.example .env
npx shopify hydrogen link
```

This will:
- Prompt you to log in to Shopify
- Let you select the store
- Automatically configure all environment variables

**Option B: Manual Configuration**

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Get your Storefront API token from Shopify Admin:
   - Go to **Settings** → **Apps and sales channels**
   - Click **Develop apps** → Create or select an app
   - Enable **Storefront API** and install the app
   - Copy the Storefront API access token

3. Edit `.env` with your values:
   ```env
   SESSION_SECRET="your-secure-random-string"
   PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
   PUBLIC_STOREFRONT_API_TOKEN="your-storefront-api-token"
   PUBLIC_STOREFRONT_API_VERSION="2024-01"
   ```

   Generate a secure SESSION_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Step 6: Generate TypeScript Types

```bash
npm run codegen
```

This generates TypeScript types based on your store's GraphQL schema.

### Step 7: Start Development

```bash
npm run dev
```

Your store should now be running at `http://localhost:3000` (or another port).

## 🔄 Workflow for Multiple Projects

### Typical Workflow

1. **New Client Project:**
   ```bash
   git clone <template-repo> client-name-store
   cd client-name-store
   .\setup-new-project.ps1 -ProjectName "client-name-store"
   cp .env.example .env
   npx shopify hydrogen link
   npm run dev
   ```

2. **Customize:**
   - Edit components in `app/components/`
   - Modify styles in `app/styles/`
   - Update sections in `app/components/sections/`

3. **Deploy:**
   ```bash
   npm run build
   # Deploy to Shopify Oxygen or your preferred platform
   ```

## 📁 What Gets Reused vs. What's Store-Specific

### ✅ Reused (Versioned in Git)
- All code files (`app/`, `server.ts`, etc.)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Components and routes
- Styles and assets (unless customized per client)

### 🔒 Store-Specific (NOT Versioned)
- `.env` file - Contains store credentials
- `.shopify/` directory - CLI configuration
- `node_modules/` - Dependencies (reinstalled per project)

## 🎨 Customization Checklist

After setting up for a new store, consider customizing:

- [ ] **Branding**: Update logos, colors, fonts
- [ ] **Components**: Customize header, footer, product cards
- [ ] **Sections**: Modify homepage sections
- [ ] **Styles**: Update Tailwind config or CSS
- [ ] **Menus**: Configure navigation menus in Shopify Admin
- [ ] **Content**: Add products, collections, pages in Shopify Admin

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use different SESSION_SECRET per project** - Generate a new one for each
3. **Rotate tokens regularly** - Especially if shared with team members
4. **Use environment-specific configs** - Different `.env` for dev/staging/prod

## 🛠️ Troubleshooting

### "Access Denied" when linking

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for solutions. Usually a permissions issue in Shopify Admin.

### Project name conflicts

If you get npm errors about package name conflicts, make sure each project has a unique name in `package.json`.

### Environment variables not loading

- Make sure you have a `.env` file (not just `.env.example`)
- Restart the dev server after changing `.env`
- Check that variable names match exactly (case-sensitive)

## 📚 Additional Resources

- [GETTING-STARTED.md](./GETTING-STARTED.md) - Initial setup guide
- [README.md](./README.md) - Full project documentation
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions

## 💡 Tips

1. **Keep the template updated**: Periodically pull updates from the main template repository
2. **Use branches**: Create a branch for each client project if working from the same repo
3. **Document customizations**: Keep notes on what was customized per client
4. **Version control**: Each client project should have its own Git repository

---

**Ready to start?** Run the setup script and follow the prompts!

```powershell
# Windows
.\setup-new-project.ps1 -ProjectName "my-new-store"

# Mac/Linux
./setup-new-project.sh my-new-store
```

