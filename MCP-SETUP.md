# MCP (Model Context Protocol) Setup Guide

This project is pre-configured to work with MCP servers for enhanced development experience.

## 🎯 Configured MCP Servers

### 1. Shopify Dev MCP

**Purpose:** Access Shopify documentation, validate GraphQL queries, and get Shopify-specific code assistance.

**Configuration:**
The Shopify MCP is configured to use `@shopify/dev-mcp` which provides:
- GraphQL schema introspection
- Documentation search
- Code validation
- Component validation

**Setup:**
1. Install globally (if not already installed):
   ```bash
   npm install -g @shopify/dev-mcp @shopify/theme-check-node
   ```

2. The MCP should auto-configure in Cursor. If not:
   - Open Cursor Settings
   - Search for "MCP" or "Model Context Protocol"
   - Add server configuration:
     ```json
     {
       "mcpServers": {
         "shopify-dev-mcp": {
           "command": "npx",
           "args": ["-y", "@shopify/dev-mcp@latest"]
         }
       }
     }
     ```

**Usage:**
- Ask questions about Shopify APIs
- Validate GraphQL queries
- Get code examples for Shopify components
- Search Shopify documentation

**Troubleshooting:**
See [MCP-TROUBLESHOOTING.md](./MCP-TROUBLESHOOTING.md) for common issues.

### 2. Figma Desktop MCP

**Purpose:** Extract design tokens, generate UI code from Figma designs, and sync design system.

**Configuration:**
The Figma MCP connects to the Figma Desktop app for design-to-code workflows.

**Setup:**
1. Install Figma Desktop app (if not already installed)
2. Open your Figma file in Figma Desktop
3. The MCP should auto-detect Figma Desktop

**Usage:**
- Extract design tokens from Figma
- Generate React components from Figma designs
- Get design system variables
- Convert Figma designs to code

**Example Prompts:**
- "Generate a React component from the selected Figma frame"
- "Extract color tokens from this Figma file"
- "Create a component matching this Figma design"

## 🔧 Manual MCP Configuration

If MCP servers don't auto-configure, you can set them up manually:

### Cursor Settings Location

**Windows:**
```
%APPDATA%\Cursor\User\globalStorage\mcp.json
```

**Mac:**
```
~/Library/Application Support/Cursor/User/globalStorage/mcp.json
```

**Linux:**
```
~/.config/Cursor/User/globalStorage/mcp.json
```

### Example Configuration

```json
{
  "mcpServers": {
    "shopify-dev-mcp": {
      "command": "npx",
      "args": ["-y", "@shopify/dev-mcp@latest"],
      "env": {}
    },
    "figma-desktop": {
      "command": "node",
      "args": ["path/to/figma-mcp-server"],
      "env": {}
    }
  }
}
```

## ✅ Verification

To verify MCP servers are working:

1. **Check MCP Status:**
   - Open Cursor
   - Look for MCP indicators in the status bar
   - Check Output panel → Select "MCP" from dropdown

2. **Test Shopify MCP:**
   - Ask: "What's the Shopify Storefront API schema for products?"
   - The AI should use MCP tools to fetch real-time information

3. **Test Figma MCP:**
   - Open Figma Desktop with a design file
   - Ask: "Generate code for the selected component"
   - The AI should extract design information

## 🚀 Quick Setup Script

Run this to ensure MCP dependencies are installed:

```bash
# Install Shopify MCP dependencies
npm install -g @shopify/dev-mcp @shopify/theme-check-node

# Clear npm cache (if having issues)
npm cache clean --force
```

**Windows PowerShell:**
```powershell
npm install -g @shopify/dev-mcp @shopify/theme-check-node
npm cache clean --force
```

## 📚 Additional Resources

- [Shopify MCP Documentation](https://shopify.dev/docs)
- [Figma MCP Documentation](https://figma.com)
- [MCP Protocol Specification](https://modelcontextprotocol.io)

## 🛠️ Troubleshooting

### MCP Not Connecting

1. **Check if servers are installed:**
   ```bash
   npm list -g @shopify/dev-mcp
   ```

2. **Restart Cursor completely**

3. **Check MCP logs:**
   - View → Output → Select "MCP"

4. **Clear cache:**
   ```bash
   npm cache clean --force
   # Windows: Remove-Item -Recurse -Force "$env:LOCALAPPDATA\npm-cache\_npx"
   ```

### Shopify MCP Errors

See [MCP-TROUBLESHOOTING.md](./MCP-TROUBLESHOOTING.md) for detailed solutions.

### Figma MCP Not Working

1. Ensure Figma Desktop app is installed and running
2. Open a Figma file in Figma Desktop
3. Restart Cursor
4. Check that Figma Desktop API is enabled

---

**Note:** MCP configurations are user-specific and not stored in the project. Each developer needs to configure MCP on their machine. This guide helps ensure consistent setup across the team.

