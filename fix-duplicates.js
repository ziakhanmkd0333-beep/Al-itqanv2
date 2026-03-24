const fs = require('fs');
const path = require('path');

function fixDuplicateExports(dir) {
  const files = fs.readdirSync(dir, { recursive: true });
  let fixedCount = 0;
  
  for (const file of files) {
    if (typeof file === 'string' && file.endsWith('route.ts')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Count dynamic exports
      const dynamicRegex = /export const dynamic = 'force-dynamic';\n/g;
      const matches = content.match(dynamicRegex);
      
      if (matches && matches.length > 1) {
        // Remove all occurrences
        content = content.replace(dynamicRegex, '');
        
        // Add single export after imports
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
          fs.writeFileSync(filePath, content);
          fixedCount++;
          console.log(`✅ Fixed: ${file} (removed ${matches.length - 1} duplicates)`);
        }
      }
    }
  }
  
  console.log(`\n🎉 Fixed ${fixedCount} files with duplicate exports`);
}

fixDuplicateExports('src/app/api');
