const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment...');

try {
  // Build first
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  
  // Deploy using npx netlify
  console.log('🌐 Deploying to Netlify...');
  const siteId = '9e0c65cc-8a45-446e-a63e-6d6951eea6be';
  
  execSync(
    `npx netlify deploy --prod --dir=.next --site=${siteId}`,
    { 
      stdio: 'inherit', 
      cwd: __dirname,
      env: {
        ...process.env,
        NETLIFY_BLOB_STORAGE: 'false'
      }
    }
  );
  
  console.log('✅ Deployment completed!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
