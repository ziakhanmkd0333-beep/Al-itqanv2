#!/usr/bin/env pwsh
# Deployment Script for Al-NOOR Academy
# This script builds the Next.js project and prepares it for deployment

param(
    [string]$ServerHost = "",
    [string]$ServerUser = "",
    [string]$RemotePath = "/public_html",
    [switch]$SkipBuild,
    [switch]$Help
)

function Show-Help {
    Write-Host @"
Al-NOOR Academy Deployment Script
=================================

This script builds the Next.js project and prepares files for deployment.

USAGE:
    .\deploy.ps1 [OPTIONS]

OPTIONS:
    -ServerHost     Server hostname or IP (e.g., alnooronlineacademy.com)
    -ServerUser     SSH username for server
    -RemotePath     Remote path on server (default: /public_html)
    -SkipBuild      Skip the build step (use existing dist)
    -Help           Show this help message

EXAMPLES:
    # Build only (no upload)
    .\deploy.ps1

    # Build and upload via SCP (requires sshpass or manual password entry)
    .\deploy.ps1 -ServerHost "alnooronlineacademy.com" -ServerUser "username"

REQUIREMENTS:
    - Node.js 18+ and npm installed
    - PowerShell 5.1 or higher
    - (Optional) SSH access to server for automatic upload

MANUAL DEPLOYMENT:
    If automatic upload doesn't work:
    1. Run this script to build: .\deploy.ps1
    2. Upload the 'dist' folder contents to your web server root
    3. Ensure .htaccess is in the root directory

"@
}

if ($Help) {
    Show-Help
    exit 0
}

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Al-NOOR Academy Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Error "Error: package.json not found. Please run this script from the project root directory."
    exit 1
}

# Step 1: Build the project
if (-not $SkipBuild) {
    Write-Host "Step 1: Building Next.js project..." -ForegroundColor Yellow
    Write-Host "This may take a few minutes..." -ForegroundColor Gray

    # Clean previous build
    if (Test-Path "dist") {
        Write-Host "  Cleaning previous build..." -ForegroundColor Gray
        Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
    }

    # Run the build
    npm run build

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed! Please check the errors above."
        exit 1
    }

    Write-Host "  Build successful!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Step 1: Skipping build (using existing dist folder)" -ForegroundColor Yellow
    Write-Host ""
}

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Error "Error: dist folder not found. Build may have failed or was skipped."
    exit 1
}

# Step 2: Verify critical files
Write-Host "Step 2: Verifying build output..." -ForegroundColor Yellow

$criticalFiles = @(
    "dist/index.html",
    "dist/.htaccess",
    "dist/_next"
)

$missingFiles = @()
foreach ($file in $criticalFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
        Write-Host "  MISSING: $file" -ForegroundColor Red
    } else {
        Write-Host "  OK: $file" -ForegroundColor Green
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Warning "Some critical files are missing!"
    Write-Host "If dist/_next is missing, your deployment will have 404 errors for JS/CSS."
    Write-Host ""
}

Write-Host ""

# Step 3: Copy .htaccess if not in dist
if (-not (Test-Path "dist/.htaccess")) {
    Write-Host "Step 3: Copying .htaccess to dist..." -ForegroundColor Yellow
    if (Test-Path ".htaccess") {
        Copy-Item ".htaccess" "dist/.htaccess"
        Write-Host "  .htaccess copied successfully" -ForegroundColor Green
    } else {
        Write-Warning "  .htaccess not found in project root!"
    }
    Write-Host ""
}

# Step 4: Show deployment info
Write-Host "Step 4: Deployment Summary" -ForegroundColor Yellow
Write-Host "--------------------------" -ForegroundColor Yellow

# Count files
$nextFiles = Get-ChildItem -Recurse "dist/_next" -ErrorAction SilentlyContinue | Measure-Object
$totalSize = (Get-ChildItem -Recurse "dist" | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "Files in _next/static: $($nextFiles.Count)" -ForegroundColor White
Write-Host "Total deployment size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor White
Write-Host ""

# Step 5: Upload (if server details provided)
if ($ServerHost -and $ServerUser) {
    Write-Host "Step 5: Uploading to server..." -ForegroundColor Yellow

    # Check for scp
    $scp = Get-Command "scp" -ErrorAction SilentlyContinue
    if (-not $scp) {
        Write-Warning "scp not found. Please install OpenSSH or use manual upload."
        Write-Host ""
    } else {
        Write-Host "  Uploading files to $ServerUser@$ServerHost`:$RemotePath" -ForegroundColor Gray
        Write-Host "  You may be prompted for your password..." -ForegroundColor Gray
        Write-Host ""

        # Use scp to upload
        scp -r "dist/*" "$ServerUser@${ServerHost}:$RemotePath"

        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Upload successful!" -ForegroundColor Green
        } else {
            Write-Error "Upload failed!"
            exit 1
        }
    }
} else {
    Write-Host "Step 5: Manual Upload Required" -ForegroundColor Yellow
    Write-Host "------------------------------" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To deploy manually:" -ForegroundColor White
    Write-Host ""
    Write-Host "1. Locate the 'dist' folder in your project:" -ForegroundColor Cyan
    Write-Host "   $(Resolve-Path dist)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Upload ALL contents of the 'dist' folder to your web server root" -ForegroundColor Cyan
    Write-Host "   (usually /public_html or /var/www/html)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. IMPORTANT: Ensure the '_next' folder is uploaded!" -ForegroundColor Cyan
    Write-Host "   This contains all JS/CSS chunks. Missing this = 404 errors." -ForegroundColor Red
    Write-Host ""
    Write-Host "4. Verify .htaccess is in the root directory" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "5. Set proper permissions:" -ForegroundColor Cyan
    Write-Host "   - Files: 644 (rw-r--r--)" -ForegroundColor Gray
    Write-Host "   - Directories: 755 (rwxr-xr-x)" -ForegroundColor Gray
    Write-Host "   - .htaccess: 644" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Preparation Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for large video files
$videoFiles = Get-ChildItem -Recurse "dist" -Include "*.mp4","*.webm","*.mov" -ErrorAction SilentlyContinue
if ($videoFiles) {
    Write-Warning "Large video files detected in dist:"
    foreach ($video in $videoFiles) {
        $size = $video.Length / 1MB
        Write-Host "  - $($video.Name): $([math]::Round($size, 2)) MB" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "These may cause slow loading or connection issues." -ForegroundColor Yellow
    Write-Host "Consider:" -ForegroundColor White
    Write-Host "  - Compressing videos" -ForegroundColor Gray
    Write-Host "  - Using a CDN for video hosting" -ForegroundColor Gray
    Write-Host "  - Converting to WebM format" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Next steps:" -ForegroundColor Green
Write-Host "  1. Upload the 'dist' folder contents to your server" -ForegroundColor White
Write-Host "  2. Test the website at https://alnooronlineacademy.com" -ForegroundColor White
Write-Host "  3. Check browser console for any 404 errors" -ForegroundColor White
Write-Host ""

if (-not ($ServerHost -and $ServerUser)) {
    Write-Host "Tip: For automatic upload, provide server details:" -ForegroundColor Cyan
    Write-Host "  .\deploy.ps1 -ServerHost 'yourdomain.com' -ServerUser 'username'" -ForegroundColor Gray
    Write-Host ""
}
