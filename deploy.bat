@echo off
chcp 65001 >nul
REM Deployment Script for Al-NOOR Academy (Batch Version)
REM This script builds the Next.js project

echo ========================================
echo   Al-NOOR Academy Deployment Script
echo ========================================
echo.

REM Check if we're in the right directory
if not exist package.json (
    echo Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

echo Step 1: Building Next.js project...
echo This may take a few minutes...

REM Clean previous build
if exist dist (
    echo   Cleaning previous build...
    rmdir /s /q dist
)

REM Run the build
call npm run build
if errorlevel 1 (
    echo Build failed! Please check the errors above.
    exit /b 1
)

echo   Build successful!
echo.

REM Check if dist folder exists
if not exist dist (
    echo Error: dist folder not found. Build may have failed.
    exit /b 1
)

echo Step 2: Verifying build output...
if exist dist\index.html (
    echo   OK: dist\index.html
) else (
    echo   MISSING: dist\index.html
)

if exist dist\_next (
    echo   OK: dist\_next folder
) else (
    echo   MISSING: dist\_next folder - CRITICAL!
)

if exist dist\.htaccess (
    echo   OK: dist\.htaccess
) else (
    if exist .htaccess (
        copy .htaccess dist\.htaccess
        echo   COPIED: .htaccess to dist
    ) else (
        echo   WARNING: .htaccess not found!
    )
)

echo.
echo Step 3: Deployment Summary
echo --------------------------
echo.

REM Count _next files
set filecount=0
for /f %%a in ('dir /s /b "dist\_next" 2^>nul ^| find /c /v ""') do set filecount=%%a
echo Files in _next/static: %filecount%

echo.
echo ========================================
echo   Deployment Preparation Complete!
echo ========================================
echo.
echo NEXT STEPS - MANUAL UPLOAD REQUIRED:
echo.
echo 1. The 'dist' folder is ready at:
echo    %CD%\dist
echo.
echo 2. Upload ALL contents of 'dist' to your web server:
echo    - Host: alnooronlineacademy.com
echo    - Path: /public_html (or /var/www/html)
echo.
echo 3. CRITICAL: Include the '_next' folder!
echo    It contains all JS/CSS chunks.
echo    Missing it = 404 errors on your site.
echo.
echo 4. Verify .htaccess is in the root directory.
echo.
echo 5. Set file permissions:
echo    - Files: 644 (rw-r--r--)
echo    - Directories: 755 (rwxr-xr-x)
echo    - .htaccess: 644
echo.
echo For help, run: deploy.ps1 -Help
echo (requires PowerShell for full features)
echo.
pause
