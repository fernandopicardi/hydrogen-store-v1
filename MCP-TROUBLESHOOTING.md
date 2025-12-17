# Troubleshooting: Shopify MCP Error

> **For first-time setup, see [GETTING-STARTED.md](./GETTING-STARTED.md) first.**

## Error
```
Error: Cannot find package '@shopify/theme-check-node/dist/index.js'
```

This error occurs when the Shopify MCP (`@shopify/dev-mcp`) tries to run but cannot find a required dependency.

## Solutions

### Solution 1: Clear npx Cache (Recommended)

The problem may be caused by corrupted npx cache. Clear the cache:

**Windows (PowerShell):**
```powershell
# Clear npx cache
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\npm-cache\_npx" -ErrorAction SilentlyContinue

# Or clear entire npm cache
npm cache clean --force
```

**Mac/Linux:**
```bash
# Clear npx cache
rm -rf ~/.npm/_npx

# Or clear entire npm cache
npm cache clean --force
```

After clearing, try again. Cursor should restart the MCP automatically.

### Solution 2: Install Package Globally

Install `@shopify/dev-mcp` globally to ensure all dependencies are available:

```bash
npm install -g @shopify/dev-mcp
```

### Solution 3: Install Missing Dependency

Install the missing dependency:

```bash
npm install -g @shopify/theme-check-node
```

### Solution 4: Check MCP Configuration in Cursor

1. Open Cursor settings
2. Search for "MCP" or "Model Context Protocol"
3. Check the `user-shopify-dev-mcp` server configuration
4. Try restarting the MCP server

### Solution 5: Reinstall MCP

If nothing works, you can try forcing a fresh installation:

```bash
# Clear cache
npm cache clean --force

# Remove global installation (if exists)
npm uninstall -g @shopify/dev-mcp

# Reinstall
npm install -g @shopify/dev-mcp@latest
```

### Solution 6: Use Specific Version

If the latest version has issues, try a specific version:

```bash
npm install -g @shopify/dev-mcp@1.0.0
```

(Replace `1.0.0` with a version you know works)

## Verification

After applying a solution:

1. **Restart Cursor** completely
2. Check MCP logs (usually in `View` → `Output` → select "MCP")
3. MCP should start without errors

## Additional Information

- Shopify MCP is used for integration with Shopify development tools
- The error usually indicates a problem with dependencies or cache
- The most common solution is to clear the npx/npm cache

## Resources

- [Shopify MCP Documentation](https://shopify.dev/docs)
- [npx Cache Issues](https://docs.npmjs.com/cli/v10/commands/npm-cache)

