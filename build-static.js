const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, 'src', 'app', 'api');
const backupDir = path.join(__dirname, 'src', 'app', 'api-backup');

// Check if we're building or restoring
const action = process.argv[2];

if (action === 'backup') {
  // Move API routes to backup
  if (fs.existsSync(apiDir)) {
    if (fs.existsSync(backupDir)) {
      fs.rmSync(backupDir, { recursive: true });
    }
    fs.renameSync(apiDir, backupDir);
    console.log('API routes backed up for static build');
  }
} else if (action === 'restore') {
  // Restore API routes
  if (fs.existsSync(backupDir)) {
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true });
    }
    fs.renameSync(backupDir, apiDir);
    console.log('API routes restored');
  }
}
