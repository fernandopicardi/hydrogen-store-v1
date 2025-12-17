# Complete Setup Script for Shopify Hydrogen Project
# This script automates all initial setup, leaving only store linking to the user
# Usage: .\setup-complete.ps1

param(
    [string]$ProjectName = "",
    [switch]$SkipMCP,
    [switch]$SkipExtensions
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🚀 Complete Setup - Shopify Hydrogen Project" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Prerequisites
Write-Host "📋 Step 1: Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found. Please install Node.js 20.0.0 or higher." -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "   ✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ npm not found. Please install npm." -ForegroundColor Red
    exit 1
}

# Step 2: Install Dependencies
Write-Host ""
Write-Host "📦 Step 2: Installing project dependencies..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes..." -ForegroundColor Gray

try {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  npm install completed with warnings" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Error installing dependencies: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Setup Environment File
Write-Host ""
Write-Host "🔐 Step 3: Setting up environment file..." -ForegroundColor Yellow

if (Test-Path .env) {
    Write-Host "   ℹ️  .env file already exists" -ForegroundColor Gray
    $overwrite = Read-Host "   Overwrite with .env.example? (y/n)"
    if ($overwrite -eq "y" -or $overwrite -eq "Y") {
        Copy-Item .env.example .env -Force
        Write-Host "   ✅ Created .env from .env.example" -ForegroundColor Green
    }
} else {
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
        Write-Host "   ✅ Created .env from .env.example" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  .env.example not found" -ForegroundColor Yellow
    }
}

# Step 4: Generate Secure SESSION_SECRET
Write-Host ""
Write-Host "🔑 Step 4: Generating secure SESSION_SECRET..." -ForegroundColor Yellow

try {
    $sessionSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    $envContent = Get-Content .env -Raw
    
    # Replace SESSION_SECRET if it's still "foobar"
    if ($envContent -match 'SESSION_SECRET="foobar"') {
        $envContent = $envContent -replace 'SESSION_SECRET="foobar"', "SESSION_SECRET=`"$sessionSecret`""
        Set-Content .env -Value $envContent -NoNewline
        Write-Host "   ✅ Generated and set secure SESSION_SECRET" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  SESSION_SECRET already configured" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  Could not generate SESSION_SECRET automatically" -ForegroundColor Yellow
    Write-Host "   You can generate it manually: node -e `"console.log(require('crypto').randomBytes(32).toString('hex'))`"" -ForegroundColor Gray
}

# Step 5: Install MCP Dependencies (Optional)
if (-not $SkipMCP) {
    Write-Host ""
    Write-Host "🔌 Step 5: Installing MCP dependencies..." -ForegroundColor Yellow
    Write-Host "   Installing Shopify MCP tools globally..." -ForegroundColor Gray
    
    $installMCP = Read-Host "   Install MCP dependencies? (y/n)"
    if ($installMCP -eq "y" -or $installMCP -eq "Y") {
        try {
            Write-Host "   Installing @shopify/dev-mcp..." -ForegroundColor Gray
            npm install -g @shopify/dev-mcp @shopify/theme-check-node 2>&1 | Out-Null
            Write-Host "   ✅ MCP dependencies installed" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️  MCP installation had issues, but continuing..." -ForegroundColor Yellow
            Write-Host "   You can install manually: npm install -g @shopify/dev-mcp @shopify/theme-check-node" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ℹ️  Skipped MCP installation" -ForegroundColor Gray
        Write-Host "   Install later: npm install -g @shopify/dev-mcp @shopify/theme-check-node" -ForegroundColor Gray
    }
} else {
    Write-Host ""
    Write-Host "🔌 Step 5: Skipping MCP installation (--SkipMCP flag)" -ForegroundColor Gray
}

# Step 6: Clear npm cache (prevent MCP issues)
Write-Host ""
Write-Host "🧹 Step 6: Cleaning npm cache..." -ForegroundColor Yellow
try {
    npm cache clean --force 2>&1 | Out-Null
    Write-Host "   ✅ npm cache cleaned" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Cache clean had issues, but continuing..." -ForegroundColor Yellow
}

# Step 7: Generate TypeScript Types (if store is already linked)
Write-Host ""
Write-Host "📝 Step 7: Checking for store configuration..." -ForegroundColor Yellow

$envContent = Get-Content .env -Raw
if ($envContent -match 'PUBLIC_STORE_DOMAIN="mock\.shop"') {
    Write-Host "   ℹ️  Using mock shop - skipping codegen" -ForegroundColor Gray
    Write-Host "   Run 'npm run codegen' after linking to your store" -ForegroundColor Gray
} else {
    Write-Host "   Attempting to generate TypeScript types..." -ForegroundColor Gray
    try {
        npm run codegen 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ TypeScript types generated" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Codegen had issues (store may not be linked yet)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ℹ️  Codegen will run after store linking" -ForegroundColor Gray
    }
}

# Step 8: Verify Setup
Write-Host ""
Write-Host "✅ Step 8: Verifying setup..." -ForegroundColor Yellow

$checks = @(
    @{ Name = "node_modules"; Path = "node_modules"; Required = $true },
    @{ Name = ".env file"; Path = ".env"; Required = $true },
    @{ Name = "package.json"; Path = "package.json"; Required = $true }
)

$allGood = $true
foreach ($check in $checks) {
    if (Test-Path $check.Path) {
        Write-Host "   ✅ $($check.Name)" -ForegroundColor Green
    } else {
        if ($check.Required) {
            Write-Host "   ❌ $($check.Name) - MISSING" -ForegroundColor Red
            $allGood = $false
        } else {
            Write-Host "   ⚠️  $($check.Name) - Optional" -ForegroundColor Yellow
        }
    }
}

# Summary
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✅ Setup Complete!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Setup completed with issues" -ForegroundColor Yellow
}
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. 🔗 Link your Shopify store:" -ForegroundColor White
Write-Host "      npx shopify hydrogen link" -ForegroundColor Cyan
Write-Host ""
Write-Host "      This will:" -ForegroundColor Gray
Write-Host "      - Prompt you to log in to Shopify" -ForegroundColor Gray
Write-Host "      - Let you select your store" -ForegroundColor Gray
Write-Host "      - Automatically configure .env with store credentials" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. 📝 Generate TypeScript types:" -ForegroundColor White
Write-Host "      npm run codegen" -ForegroundColor Cyan
Write-Host ""
Write-Host "   3. 🚀 Start development server:" -ForegroundColor White
Write-Host "      npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "   4. 📚 (Optional) Install recommended VS Code extensions:" -ForegroundColor White
Write-Host "      VS Code will prompt you, or check .vscode/extensions.json" -ForegroundColor Gray
Write-Host ""
Write-Host "   5. 🔌 (Optional) Configure MCP servers:" -ForegroundColor White
Write-Host "      See MCP-SETUP.md for instructions" -ForegroundColor Gray
Write-Host ""

Write-Host "📖 Documentation:" -ForegroundColor Yellow
Write-Host "   - [GETTING-STARTED.md](./GETTING-STARTED.md) - Complete setup guide" -ForegroundColor Gray
Write-Host "   - [MCP-SETUP.md](./MCP-SETUP.md) - MCP configuration" -ForegroundColor Gray
Write-Host "   - [SETUP-COMPLETE.md](./SETUP-COMPLETE.md) - Setup checklist" -ForegroundColor Gray
Write-Host ""

Write-Host "🎉 You're all set! Just link your store and start coding!" -ForegroundColor Green
Write-Host ""

