# Hydrogen Store Template

This repository serves as a **complete and reusable base** for creating custom stores using [Shopify Hydrogen](https://shopify.dev/custom-storefronts/hydrogen) with React Router 7. It includes all the configurations, pages, sections, and components needed to quickly start developing your store.

> 🚀 **New here?** Start with the [Getting Started Guide](./GETTING-STARTED.md) for step-by-step setup instructions.

## 🎯 What's Included

### Components

- **Header** - Header with navigation menu and search
- **Footer** - Footer with links and information
- **Cart** - Complete shopping cart system
  - `CartMain` - Main cart view
  - `CartLineItem` - Individual cart item
  - `CartSummary` - Cart summary and total
  - `CartSubscriptionPromo` - Subscription promotions
- **Product** - Product components
  - `ProductItem` - Product card
  - `ProductImage` - Product image
  - `ProductPrice` - Product price
  - `ProductForm` - Variant selection form
  - `AddToCartButton` - Add to cart button
- **Search** - Complete search system
  - `SearchForm` - Search form
  - `SearchFormPredictive` - Predictive search
  - `SearchPopup` - Search popup
  - `SearchResults` - Search results
  - `SearchResultsPredictive` - Predictive results
- **Aside** - Side panel for search, cart, and mobile menu
- **PageLayout** - Base page layout
- **PaginatedResourceSection** - Section with pagination

### Sections (Homepage Sections)

- **HeroSection** - Hero/banner main section
- **FeaturesSection** - Features/highlights section
- **FeaturedProductsSection** - Featured products section
- **CTASection** - Call-to-action section
- **TestimonialsSection** - Testimonials section
- **FAQSection** - Frequently asked questions section
- **SectionHeader** - Reusable header for sections

### Complete Routes

- **Products**: Individual product view (`/products/$handle`)
- **Collections**: Collection listing and view (`/collections`)
- **Cart**: Complete cart management (`/cart`)
- **Customer Account**: Complete customer area (`/account`)
  - Profile, addresses, orders, authorization
- **Blogs**: Complete blog system (`/blogs`)
  - Blog listing, individual articles
- **Pages**: Static pages (`/pages/$handle`)
- **Policies**: Policy pages (`/policies`)
- **Search**: Search results page (`/search`)
- **Discounts**: Discount code application (`/discount/$code`)
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Robots configuration

### Technologies and Configuration

- **React Router 7.9.2** - Routing framework
- **Shopify Hydrogen 2025.7.0** - Headless commerce stack
- **Tailwind CSS 4.1.6** - Utility-first CSS framework
- **TypeScript 5.9.2** - Static typing
- **GraphQL Codegen** - Automatic GraphQL type generation
- **Vite 6.2.4** - Modern build tool
- **ESLint + Prettier** - Code linting and formatting
- **Shopify CLI** - Development tools

## 📋 Prerequisites

- **Node.js** version 20.0.0 or higher (see `engines` in `package.json`)
- **npm** or another package manager
- **Shopify account** (only for Option B - Connect to Your Store)

💡 **Windows Users:**

- If you are using NVM on Windows, make sure to use `nvm-windows`.
- Use PowerShell or Git Bash for the best experience with the Shopify CLI.
- Ensure your Node version matches the engine requirement in `package.json` (>=20.0.0).

## 🚀 Quick Start

> **New to this project?** Start with [GETTING-STARTED.md](./GETTING-STARTED.md) for a complete step-by-step guide.

### ⚡ One-Command Setup (Recommended)

Run the complete setup script to automate everything except store linking:

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
- ✅ Install all dependencies
- ✅ Create `.env` file
- ✅ Generate secure SESSION_SECRET
- ✅ Install MCP dependencies (optional)
- ✅ Clean npm cache
- ✅ Verify setup

Then just link your store:
```bash
npx shopify hydrogen link
npm run dev
```

### Manual Setup

Choose one of the following setup paths based on your needs:

### Option A: Demo Mode (Mock Shop)

Get up and running immediately with demo data from Shopify's Mock Shop. Perfect for exploring the template and testing functionality without connecting to a real store.

1. **Clone the repository**

```bash
git clone https://github.com/seu-usuario/hydrogen-store-v1.git
cd hydrogen-store-v1
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

The `.env.example` file contains pre-configured credentials for the Shopify Mock Shop, allowing you to start the development server immediately.

4. **Start the development server**

```bash
npm run dev
```

The development server will be available at `http://localhost:3000` (or another port if 3000 is occupied).

### Option B: Connect to Your Store (Real Data)

Connect to your own Shopify store to work with real products, collections, and customer data.

1. **Clone the repository**

```bash
git clone https://github.com/seu-usuario/hydrogen-store-v1.git
cd hydrogen-store-v1
```

2. **Install dependencies**

```bash
npm install
```

3. **Connect to your Shopify store**

```bash
npx shopify hydrogen link
```

This command will:

- Prompt you to log in to your Shopify account
- Allow you to select your store
- Automatically create and configure the `.env` file with all required environment variables from your store

4. **Generate TypeScript types**

```bash
npm run codegen
```

This updates the GraphQL types based on your store's actual schema, ensuring type safety when working with your store's data.

5. **Start the development server**

```bash
npm run dev
```

The development server will be available at `http://localhost:3000` (or another port if 3000 is occupied).

## 🏗️ Reusing This Template for Multiple Stores

> **Quick setup?** Use the setup script: `.\setup-new-project.ps1 -ProjectName "client-store-name"` (Windows) or `./setup-new-project.sh client-store-name` (Mac/Linux)

This template is designed to be **completely reusable** across multiple client projects. See [REUSING-THIS-TEMPLATE.md](./REUSING-THIS-TEMPLATE.md) for a complete guide.

### Quick Setup for New Client

1. **Clone the repository:**

   ```bash
   git clone <repository-url> client-store-name
   cd client-store-name
   ```

2. **Run the setup script:**

   ```powershell
   # Windows (PowerShell)
   .\setup-new-project.ps1 -ProjectName "client-store-name"
   
   # Mac/Linux (Bash)
   chmod +x setup-new-project.sh  # Make executable (first time only)
   ./setup-new-project.sh client-store-name
   ```

3. **Configure for new store:**

   ```bash
   npx shopify hydrogen link
   ```

4. **Start development:**

   ```bash
   npm run dev
   ```

The setup script will:

- ✅ Rename the project in `package.json`
- ✅ Optionally remove Git history
- ✅ Initialize a new Git repository
- ✅ Create `.env` from `.env.example`
- ✅ Guide you through the next steps

### Manual Setup (Alternative)

If you prefer to set up manually, follow these steps:

1. **Clone to a new folder name:**

   (Replace `my-client-store` with your project name)

   ```bash
   git clone https://github.com/fernandopicardi/hydrogen-store-v1.git my-client-store
   cd my-client-store
   ```

2. **Remove the Git History (Critical Step):** This disconnects your project from the boilerplate history entirely.

   **Windows (PowerShell):**

   ```powershell
   Remove-Item -Recurse -Force .git
   ```

   **Mac / Linux (Bash):**

   ```bash
   rm -rf .git
   ```

3. **Initialize a Clean Git:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Project setup from Hydrogen Professional Boilerplate"
   ```

4. **Connect to your Professional Repo:** Create a new empty repository on your professional GitHub account, then run:

   ```bash
   git remote add origin https://github.com/YOUR-PROFESSIONAL-ORG/new-repo.git
   git branch -M main
   git push -u origin main
   ```

5. **Setup Environment:**

   ```bash
   cp .env.example .env
   npm install
   npm run dev
   ```

## 🔧 How Integration Works

The Shopify CLI automatically manages all environment variables needed to connect your application with your Shopify store:

- **Variables automatically configured by Shopify CLI**:
  - `PUBLIC_STORE_DOMAIN` - Your store domain
  - `PUBLIC_STOREFRONT_API_TOKEN` - Public Storefront API token
  - `PRIVATE_STOREFRONT_API_TOKEN` - Private Storefront API token
  - `PUBLIC_STOREFRONT_ID` - Storefront ID
  - `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` - Client ID for Customer Account API
  - `PUBLIC_CUSTOMER_ACCOUNT_API_URL` - Customer Account API URL
  - `PUBLIC_CHECKOUT_DOMAIN` - Checkout domain

**Important about SESSION_SECRET**:

- `SESSION_SECRET` is required **before** connecting to Shopify and must be in the `.env` file
- You should copy `.env.example` to `.env` after `npm install` (step 3)
- The default value `"foobar"` works for local development
- For production, generate a secure string: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Shopify CLI **does not** overwrite `SESSION_SECRET` when you run `shopify hydrogen link` or `shopify hydrogen env pull`

The `.env` file is automatically generated/updated by the CLI and is in `.gitignore` to prevent versioning.

## 📁 Project Structure

```text
hydrogen-store-v1/
├── app/
│   ├── assets/           # Images and static assets
│   ├── components/       # Reusable React components
│   │   └── sections/     # Homepage sections
│   ├── graphql/         # GraphQL queries and fragments
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and helpers
│   ├── routes/          # Application routes (file-based routing)
│   ├── styles/          # CSS and Tailwind styles
│   ├── entry.client.tsx # Client entry point
│   ├── entry.server.tsx # Server entry point
│   └── root.tsx         # Root application component
├── public/              # Public static files
├── server.ts            # Server handler (Oxygen)
├── react-router.config.ts # React Router configuration
├── vite.config.ts       # Vite configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts the development server with hot-reload. Shopify CLI automatically manages environment variables and store connection.

### Production Build

```bash
npm run build
```

Creates an optimized production build and runs GraphQL codegen to generate TypeScript types.

### Build Preview

```bash
npm run preview
```

Runs a preview of the production build locally.

### Code Verification

```bash
npm run lint
```

Runs ESLint to check for code issues.

### Type Checking

```bash
npm run typecheck
```

Verifies TypeScript types and generates React Router types.

### Codegen

```bash
npm run codegen
```

Generates TypeScript types from Shopify GraphQL schemas (Storefront API and Customer Account API).

## 🎨 Next Steps

Now that you have the project configured, you can:

1. **Customize Components and Sections**
   - Edit components in `app/components/`
   - Customize homepage sections in `app/components/sections/`
   - Adjust styles using Tailwind CSS

2. **Add Content to Shopify Store**
   - Access Shopify Admin
   - Add products, collections, and content
   - Configure navigation menus (header and footer)

3. **Customize Styles and Themes**
   - Modify `app/styles/app.css` for global styles
   - Use Tailwind CSS classes in components
   - Configure theme in `tailwind.config` if needed

4. **Add New Routes**
   - Create new files in `app/routes/` following the file-based routing pattern
   - React Router automatically detects new routes

5. **Configure Menus in Shopify Admin**
   - Create menus with handles `main-menu` (header) and `footer` (footer)
   - Header and Footer components are already configured to use these menus

6. **Customize i18n**
   - Adjust localization logic in `app/lib/i18n.ts`
   - Configure support for multiple languages and countries

## 📚 Recursos e Documentação

### Documentação Oficial

- [Shopify Hydrogen Documentation](https://shopify.dev/custom-storefronts/hydrogen)
- [React Router Documentation](https://reactrouter.com)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Shopify Customer Account API](https://shopify.dev/docs/api/customer-account)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Project Guides

- [GETTING-STARTED.md](./GETTING-STARTED.md) - Complete setup guide for new users
- [REUSING-THIS-TEMPLATE.md](./REUSING-THIS-TEMPLATE.md) - Guide for reusing this template for multiple stores
- [MCP-SETUP.md](./MCP-SETUP.md) - MCP (Shopify & Figma) configuration guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Troubleshooting guide
- [SETUP-STOREFRONT-API.md](./SETUP-STOREFRONT-API.md) - Storefront API setup
- [MCP-TROUBLESHOOTING.md](./MCP-TROUBLESHOOTING.md) - MCP troubleshooting
- `guides/predictiveSearch/` - Predictive search guide
- `guides/search/` - Search implementation guide

### Support

For questions about Shopify Hydrogen, consult:

- [Shopify Community](https://community.shopify.com/)
- [Hydrogen GitHub](https://github.com/Shopify/hydrogen)

## 🔒 Security

- The `.env` file contains sensitive credentials and is in `.gitignore`
- Never commit the `.env` file to the repository
- The `.shopify` directory is also ignored and contains CLI configurations

## 📝 Important Notes

- This template uses **React Router 7**, not Remix. All imports should come from `react-router`, not `@remix-run/react`
- The project is configured for deployment on **Shopify Oxygen**
- Environment variables are automatically managed by Shopify CLI
- GraphQL Codegen automatically generates TypeScript types from Shopify schemas

---

**Built with ❤️ using Shopify Hydrogen and React Router**

This template was created to facilitate the development of custom headless stores on Shopify, providing a solid and complete foundation for your projects.
