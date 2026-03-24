# Alnoor Academy - Windows Deployment Script
# Run with: .\deploy-windows.ps1

param(
    [string]$SiteId = "9e0c65cc-8a45-446e-a63e-6d6951eea6be",
    [switch]$Clean,
    [switch]$Build,
    [switch]$Deploy,
    [switch]$Full
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "Continue"

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Cyan = "Cyan"

function Write-Status($Message, $Color = $Green) {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor $Color
}

function Test-Command($Command) {
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Step 1: Environment Setup
Write-Status "Setting up Windows environment..." $Cyan

# Enable long paths in registry (requires admin)
$regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem"
try {
    $currentValue = Get-ItemProperty -Path $regPath -Name "LongPathsEnabled" -ErrorAction SilentlyContinue
    if ($currentValue.LongPathsEnabled -ne 1) {
        Write-Status "Enabling Windows long path support..." $Yellow
        Set-ItemProperty -Path $regPath -Name "LongPathsEnabled" -Value 1 -ErrorAction SilentlyContinue
    }
} catch {
    Write-Status "Note: Run as Administrator to enable long paths permanently" $Yellow
}

# Environment variables for Windows
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:NETLIFY_BLOB_STORAGE = "false"

# Step 2: Check Prerequisites
Write-Status "Checking prerequisites..." $Cyan

if (-not (Test-Command "node")) {
    Write-Status "ERROR: Node.js not found. Install from https://nodejs.org" $Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Status "ERROR: npm not found" $Red
    exit 1
}

$nodeVersion = node --version
Write-Status "Node.js version: $nodeVersion" $Green

# Step 3: Clean (if requested)
if ($Clean -or $Full) {
    Write-Status "Cleaning previous builds..." $Yellow
    
    $foldersToRemove = @(
        ".next",
        "dist", 
        ".netlify\deploy",
        ".netlify\edge-functions",
        "node_modules\.cache"
    )
    
    foreach ($folder in $foldersToRemove) {
        if (Test-Path $folder) {
            try {
                Remove-Item -Path $folder -Recurse -Force -ErrorAction SilentlyContinue
                Write-Status "Removed: $folder" $Green
            } catch {
                Write-Status "Warning: Could not remove $folder" $Yellow
            }
        }
    }
}

# Step 4: Install dependencies
Write-Status "Installing dependencies..." $Cyan
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Status "ERROR: npm install failed" $Red
    exit 1
}
Write-Status "Dependencies installed successfully" $Green

# Step 5: Build (if requested)
if ($Build -or $Full) {
    Write-Status "Building project..." $Yellow
    
    # Set build environment
    $env:CI = "false"
    $env:NEXT_TELEMETRY_DISABLED = "1"
    
    npm run build 2>&1 | Tee-Object -FilePath "build-output.log"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Status "ERROR: Build failed. Check build-output.log" $Red
        exit 1
    }
    
    # Verify build output
    if (-not (Test-Path ".next\server")) {
        Write-Status "ERROR: Build output not found" $Red
        exit 1
    }
    
    Write-Status "Build completed successfully!" $Green
}

# Step 6: Deploy (if requested)
if ($Deploy -or $Full) {
    Write-Status "Deploying to Netlify..." $Cyan
    
    if (-not (Test-Command "netlify")) {
        Write-Status "Installing Netlify CLI..." $Yellow
        npm install -g netlify-cli
    }
    
    # Clear Netlify cache
    if (Test-Path ".netlify\deploy") {
        Remove-Item -Path ".netlify\deploy" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    # Windows-specific deploy settings
    $env:NETLIFY_BLOB_STORAGE = "false"
    
    Write-Status "Starting deployment to site: $SiteId" $Cyan
    
    # Deploy with error handling
    try {
        netlify deploy --prod --dir=.next --site=$SiteId 2>&1 | Tee-Object -FilePath "deploy-output.log"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Deployment successful!" $Green
            Write-Status "Site URL: https://alnooronlineacademy.com" $Cyan
        } else {
            Write-Status "WARNING: Deployment may have issues. Check deploy-output.log" $Yellow
        }
    } catch {
        Write-Status "ERROR: Deployment failed: $_" $Red
        Write-Status "Check deploy-output.log for details" $Yellow
        exit 1
    }
}

Write-Status "Script completed!" $Green

# Usage instructions
Write-Host "`nUsage Examples:" -ForegroundColor $Cyan
Write-Host "  .\deploy-windows.ps1 -Full          # Clean, build, and deploy" -ForegroundColor $Green
Write-Host "  .\deploy-windows.ps1 -Clean         # Only clean" -ForegroundColor $Green
Write-Host "  .\deploy-windows.ps1 -Build         # Only build" -ForegroundColor $Green
Write-Host "  .\deploy-windows.ps1 -Deploy        # Only deploy" -ForegroundColor $Green
