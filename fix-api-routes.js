const fs = require('fs');
const path = require('path');

function fixApiRoutes(dir) {
  const files = fs.readdirSync(dir, { recursive: true });
  let count = 0;
  
  for (const file of files) {
    if (typeof file === 'string' && file.endsWith('route.ts')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove all existing dynamic exports first
      content = content.replace(/export const dynamic = 'force-dynamic';\n*/g, '');
      
      // Add single export after imports
      const lines = content.split('\n');
      let lastImportIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          lastImportIndex = i;
        }
      }
      
      if (lastImportIndex >= 0) {
        // Find position after last import
        lines.splice(lastImportIndex + 1, 0, '', "export const dynamic = 'force-dynamic';", '');
        content = lines.join('\n');
        fs.writeFileSync(filePath, content);
        count++;
        console.log(`✅ Fixed: ${file}`);
      }
    }
  }
  
  console.log(`\n🎉 Fixed ${count} API route files`);
}

fixApiRoutes('src/app/api');
