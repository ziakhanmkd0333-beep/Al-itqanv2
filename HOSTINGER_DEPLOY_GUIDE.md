# Alnoor Academy - Hostinger Deployment Guide

## Deployment Package Ready

**Location:** `d:\completed projects\Alnoor Online Quran Academy\alnoor-academy\hostinger-deploy\`
**Zip File:** `alnoor-hostinger-deploy.zip`

## Deployment Steps

### Option 1: File Manager Upload (Recommended)

1. **Login to Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com/
   - Login with your credentials

2. **Navigate to File Manager**
   - Find your domain: alnooronlineacademy.com
   - Click "File Manager" or "Files"

3. **Upload Files**
   - Navigate to `public_html` folder
   - Delete existing files (if any)
   - Upload `alnoor-hostinger-deploy.zip`
   - Extract the zip file

4. **Configure Node.js (If Available)**
   - Go to "Advanced" → "Node.js"
   - Select Node.js version 18 or 20
   - Set application root to: `public_html`
   - Set startup file to: (leave blank for Next.js)
   - Click "Create"

### Option 2: VPS/Business Hosting (For Full Next.js Support)

If you have VPS or Business hosting with SSH access:

```bash
# SSH into your server
ssh username@alnooronlineacademy.com

# Navigate to web root
cd ~/public_html

# Remove old files
rm -rf *

# Upload and extract new files
# (Use FileZilla or SCP to upload alnoor-hostinger-deploy.zip)

# Extract
unzip alnoor-hostinger-deploy.zip

# Install dependencies
npm install --production

# Start the application
npm start
```

### Option 3: Git Deployment

If Hostinger supports Git:

1. Go to "Advanced" → "Git"
2. Connect your GitHub repository
3. Set branch: `main`
4. Set deploy path: `public_html`
5. Click "Deploy"

## Important Configuration

### Environment Variables

Add these in Hostinger's "Environment Variables" section:

```
NEXT_TELEMETRY_DISABLED=1
NODE_VERSION=20
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### .htaccess Configuration

Create `.htaccess` file in `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Post-Deployment

1. **Test the website:** Visit https://alnooronlineacademy.com
2. **Check API routes:** Test login/register functionality
3. **Verify database connections:** Ensure Supabase is connected
4. **SSL Certificate:** Make sure SSL is enabled

## Support

If you encounter issues:
1. Check Hostinger logs in "Advanced" → "Error Logs"
2. Verify all files were uploaded correctly
3. Check file permissions (should be 644 for files, 755 for folders)
4. Contact Hostinger support if needed

## Build Information

- **Build Date:** $(Get-Date)
- **Next.js Version:** 16.2.1
- **Node.js Version:** 20
- **Total Pages:** 62
- **API Routes:** 43
