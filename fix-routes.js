const fs = require('fs');
const path = require('path');

function fixApiRoutes(dir) {
  const files = fs.readdirSync(dir, { recursive: true });
  
  for (const file of files) {
    if (file.endsWith('route.ts')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Count occurrences of export const dynamic
      const dynamicRegex = /export const dynamic = 'force-dynamic';\n/g;
      const matches = content.match(dynamicRegex);
      
      if (matches && matches.length > 1) {
        // Remove all occurrences
        content = content.replace(dynamicRegex, '');
        
        // Add single export after the last import statement
        const lines = content.split('\n');
        let lastImportIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ')) {
            lastImportIndex = i;
          }
        }
        
        if (lastImportIndex >= 0) {
          lines.splice(lastImportIndex + 1, 0, '', "export const dynamic = 'force-dynamic';", '');
          content = lines.join('\n');
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`Fixed: ${filePath} (removed ${matches.length - 1} duplicates)`);
      }
    }
  }
}

fixApiRoutes('src/app/api');
console.log('Done!');
