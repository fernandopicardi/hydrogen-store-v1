# How to Get Storefront API Token

> **For first-time setup, see [GETTING-STARTED.md](./GETTING-STARTED.md) first.**

## ⚠️ Important

The credentials you may have are for the **Admin API** (`shpat_`), but Hydrogen primarily needs a **Storefront API** token to work correctly.

## Steps to Get Storefront API Token

### Option 1: Via Shopify Admin (Recommended)

1. **Access Shopify Admin:**
   - Go to: https://admin.shopify.com/store/YOUR-STORE-NAME

2. **Navigate to Apps:**
   - Go to **Settings** → **Apps and sales channels**
   - Click **Develop apps**

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
   - Copy this token (it may start with `shpat_` or be a long string)

8. **Update .env:**
   - Replace `PUBLIC_STOREFRONT_API_TOKEN` in your `.env` file with the copied token

### Option 2: Use Admin API Token (Temporary)

An Admin API token can work temporarily, but it's not ideal. Hydrogen is designed to use the Storefront API.

## Verification

After configuring the correct token, test with:

```bash
npm run dev
```

If everything is correct, the server should start without errors.

## Security

⚠️ **NEVER share or commit these credentials:**
- The `.env` file is already in `.gitignore`
- Don't share tokens in messages, emails, or public repositories
- If a token is compromised, revoke it immediately in Shopify Admin

## Next Steps

1. Get the Storefront API token (following the steps above)
2. Update `PUBLIC_STOREFRONT_API_TOKEN` in `.env`
3. Run `npm run codegen` to generate TypeScript types
4. Run `npm run dev` to start the development server

