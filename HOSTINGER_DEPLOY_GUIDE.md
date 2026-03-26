# Alnoor Academy - Hostinger Business Hosting Deployment Guide

## Prerequisites

- Hostinger Business Hosting plan (supports Node.js)
- SSH access enabled
- Domain: alnooronlineacademy.com

## Deployment Steps

### 1. Prepare Files for Upload

Upload these files and folders to Hostinger:

**Required Files:**
- `package.json`
- `next.config.ts`
- `.htaccess`
- `.env.production` (rename to `.env` on server)
- `public/` folder
- `src/` folder

**After Upload:**
- Run `npm install` on server
- Run `npm run build` on server

### 2. Configure Node.js in Hostinger hPanel

1. Login to Hostinger hPanel
2. Go to **Hosting** → **Manage** → **Advanced** → **Node.js**
3. Click **Create Application**
4. Configure:
   - **Node.js version:** 20.x (or 18.x minimum)
   - **Application mode:** Production
   - **Application root:** `public_html` (or your domain folder)
   - **Application URL:** alnooronlineacademy.com
   - **Startup file:** Leave empty (uses package.json scripts)
   - **Environment variables:** Add all from `.env.production`

### 3. Environment Variables

Add these in Hostinger Node.js configuration:

```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. SSH Deployment (Recommended)

```bash
# SSH into your server
ssh username@alnooronlineacademy.com

# Navigate to web root
cd ~/public_html

# Clone from GitHub (recommended)
git clone https://github.com/ziakhanmkd0333-beep/Alnoor-v2.git .

# Or upload files via SFTP/FileZilla

# Install dependencies
npm install

# Build the application
npm run build

# Start the application (Hostinger will manage this via Node.js panel)
npm start
```

### 5. Configure Port

Hostinger will assign a port automatically. The application uses:
- `process.env.PORT` (set by Hostinger)
- Default fallback: 3000

### 6. Verify Deployment

1. Visit https://alnooronlineacademy.com
2. Check that pages load correctly
3. Test login/register functionality
4. Verify API routes work (check Network tab in browser)

## File Structure on Server

```
public_html/
├── .env                    # Environment variables
├── .htaccess               # Apache configuration
├── package.json            # Dependencies
├── next.config.ts          # Next.js config
├── public/                 # Static assets
│   ├── images/
│   ├── favicon.ico
│   └── ...
├── src/                    # Source code
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   └── lib/
├── .next/                  # Build output (after npm run build)
└── node_modules/           # Dependencies (after npm install)
```

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check Node.js application is running in hPanel
   - Verify port configuration
   - Check error logs

2. **API Routes Not Working**
   - Ensure Node.js is properly configured (not just static hosting)
   - Check `.htaccess` is uploaded
   - Verify environment variables are set

3. **Build Fails**
   - Check Node.js version (must be 18+)
   - Verify all dependencies installed
   - Check error logs in hPanel

### Check Logs

1. Go to hPanel → **Hosting** → **Manage**
2. Navigate to **Advanced** → **Error Logs**
3. Or use SSH: `tail -f ~/logs/error.log`

## Important Notes

- **Do NOT use static export** - This app requires server-side rendering for API routes
- **Keep `.env` secure** - Never commit to Git
- **Monitor usage** - Check bandwidth and resource usage in hPanel
- **Enable SSL** - Force HTTPS in hPanel

## Support

- Hostinger Support: https://www.hostinger.com/contact
- Check documentation: https://support.hostinger.com

## Build Information

- **Next.js Version:** 16.2.1
- **Node.js Required:** 18.x or higher
- **Total Pages:** 67
- **API Routes:** 43
- **Middleware:** Yes (auth protection)
