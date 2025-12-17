# PowerShell script to set up a new project from this template
# Usage: .\setup-new-project.ps1 -ProjectName "client-store-name"

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,
    
    [switch]$RemoveGit,
    [switch]$SkipInstall
)

Write-Host ""
Write-Host "🚀 Setting up new project: $ProjectName" -ForegroundColor Cyan
Write-Host ""

# Validate project name (no spaces, lowercase recommended)
if ($ProjectName -match '\s') {
    Write-Host "⚠️  Warning: Project name contains spaces. Consider using hyphens instead." -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Step 1: Rename in package.json
Write-Host "📝 Step 1: Updating package.json..." -ForegroundColor Yellow
try {
    $packageJson = Get-Content package.json -Raw | ConvertFrom-Json
    $oldName = $packageJson.name
    $packageJson.name = $ProjectName
    $packageJson.version = "1.0.0"
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content package.json -NoNewline
    Write-Host "   ✅ Renamed from '$oldName' to '$ProjectName'" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error updating package.json: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Remove Git history (if requested or prompted)
if ($RemoveGit) {
    $shouldRemoveGit = $true
} else {
    Write-Host ""
    $removeGitResponse = Read-Host "🗑️  Remove existing Git history? (y/n)"
    $shouldRemoveGit = ($removeGitResponse -eq "y" -or $removeGitResponse -eq "Y")
}

if ($shouldRemoveGit) {
    Write-Host "🗑️  Step 2: Removing Git history..." -ForegroundColor Yellow
    if (Test-Path .git) {
        Remove-Item -Recurse -Force .git
        Write-Host "   ✅ Removed .git directory" -ForegroundColor Green
        
        Write-Host "   📦 Initializing new Git repository..." -ForegroundColor Yellow
        git init | Out-Null
        git add . | Out-Null
        git commit -m "Initial commit: $ProjectName" | Out-Null
        Write-Host "   ✅ Initialized new Git repository" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  No .git directory found, skipping" -ForegroundColor Gray
    }
} else {
    Write-Host "   ℹ️  Keeping existing Git history" -ForegroundColor Gray
}

# Step 3: Check if .env exists
Write-Host ""
Write-Host "🔐 Step 3: Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "   ⚠️  .env file already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "   Overwrite with .env.example? (y/n)"
    if ($overwrite -eq "y" -or $overwrite -eq "Y") {
        Copy-Item .env.example .env -Force
        Write-Host "   ✅ Created new .env from .env.example" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  Keeping existing .env file" -ForegroundColor Gray
    }
} else {
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
        Write-Host "   ✅ Created .env from .env.example" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  .env.example not found, you'll need to create .env manually" -ForegroundColor Yellow
    }
}

# Step 4: Install dependencies (optional)
if (-not $SkipInstall) {
    Write-Host ""
    $installDeps = Read-Host "📦 Install dependencies? (y/n)"
    if ($installDeps -eq "y" -or $installDeps -eq "Y") {
        Write-Host "   Installing dependencies (this may take a minute)..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Error installing dependencies" -ForegroundColor Red
        }
    }
}

# Summary
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Project setup complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Configure your store:" -ForegroundColor White
Write-Host "      npx shopify hydrogen link" -ForegroundColor Gray
Write-Host ""
Write-Host "      OR manually edit .env with your store credentials" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Generate TypeScript types:" -ForegroundColor White
Write-Host "      npm run codegen" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Start development server:" -ForegroundColor White
Write-Host "      npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - [GETTING-STARTED.md](./GETTING-STARTED.md) - Complete setup guide" -ForegroundColor Gray
Write-Host "   - [REUSING-THIS-TEMPLATE.md](./REUSING-THIS-TEMPLATE.md) - This guide" -ForegroundColor Gray
Write-Host "   - [MCP-SETUP.md](./MCP-SETUP.md) - MCP configuration guide" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Recommended: Set up MCP servers for enhanced development:" -ForegroundColor Yellow
Write-Host "   See MCP-SETUP.md for instructions" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Cyan
Write-Host ""

