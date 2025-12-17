# Troubleshooting: Shopify Hydrogen Link Access Denied

> **For first-time setup, see [GETTING-STARTED.md](./GETTING-STARTED.md) first.**

## Error Message
```
Access denied for hydrogenStorefronts field. 
Required access: Request must be initiated from the Shopify CLI and 
user must have full access to apps or access to the Hydrogen channel.
```

This error occurs when trying to run `npx shopify hydrogen link` but your Shopify account doesn't have the required permissions.

## Solution Steps

### Option 1: Check Your Shopify Account Permissions (Recommended)

1. **Log in to your Shopify Admin Panel**
   - Go to: https://admin.shopify.com/store/0qr014-bg
   - Or navigate to your store admin

2. **Verify Your Staff Account Permissions**
   - Go to **Settings** → **Users and permissions**
   - Find your account in the staff list
   - Ensure you have one of the following:
     - **Store owner** (full access)
     - **Staff member with "Full access to apps"** permission
     - **Staff member with "Hydrogen channel"** access

3. **If You Don't Have the Required Permissions:**
   - Contact the store owner to grant you the necessary permissions
   - Or ask them to run the `npx shopify hydrogen link` command themselves

### Option 2: Enable Hydrogen Channel (If Available)

1. **In Shopify Admin:**
   - Go to **Settings** → **Sales channels**
   - Look for **Hydrogen** in the available channels
   - If it's not enabled, enable it
   - If it's not available, you may need to use a different approach

### Option 3: Use Store Owner Account

If you're not the store owner:
- Ask the store owner to run the linking command
- Or have them grant you full access to apps

### Option 4: Manual Configuration (Alternative)

If you cannot get the required permissions, you can manually configure the `.env` file:

1. **Create a Hydrogen Storefront in Shopify Admin:**
   - Go to **Settings** → **Apps and sales channels**
   - Click **Develop apps**
   - Create a new app or use an existing one
   - Enable **Storefront API** access
   - Copy the Storefront API access token

2. **Get Storefront ID:**
   - In Shopify Admin, go to **Settings** → **Apps and sales channels**
   - Find your Hydrogen storefront
   - Copy the Storefront ID

3. **Configure `.env` file manually:**
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

   Then edit `.env` with your values:
   ```
   SESSION_SECRET="your-secure-random-string"
   PUBLIC_STORE_DOMAIN="0qr014-bg.myshopify.com"
   PUBLIC_STOREFRONT_API_TOKEN="your-storefront-api-token"
   PUBLIC_STOREFRONT_API_VERSION="2024-01"
   PUBLIC_STOREFRONT_ID="your-storefront-id"
   ```

4. **Generate a secure SESSION_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Option 5: Use Demo Mode (For Development)

If you just want to develop and test the application:
1. Use the mock shop credentials already in `.env.example`
2. Copy `.env.example` to `.env`
3. Run `npm run dev`

## Verification

After resolving the permissions issue, try again:
```bash
npx shopify hydrogen link
```

If successful, the command will:
- ✅ Create/update your `.env` file
- ✅ Configure all required environment variables
- ✅ Link your local project to your Shopify storefront

## Additional Resources

- [Shopify CLI Documentation](https://shopify.dev/docs/api/shopify-cli)
- [Hydrogen Channel Setup](https://shopify.dev/docs/custom-storefronts/hydrogen)
- [Storefront API Access](https://shopify.dev/docs/api/storefront)

