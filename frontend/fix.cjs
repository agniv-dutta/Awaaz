const { readdirSync, statSync, readFileSync, writeFileSync } = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = readFileSync(file, 'utf8');

  // Fix types import
  const regex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)types['"]/g;
  content = content.replace(regex, (match, p1, p2) => {
    return `import type {${p1}} from '${p2}types'`;
  });

  // Fix react imports
  const reactRegex = /import\s+\{([^}]+)\}\s+from\s+['"]react['"]/g;
  content = content.replace(reactRegex, (match, p1) => {
    const parts = p1.split(',').map(s => s.trim()).filter(s => s);
    const valImports = parts.filter(p => !p.includes('HTML') && !p.includes('ReactNode') && !p.includes('Event'));
    const typeImports = parts.filter(p => p.includes('HTML') || p.includes('ReactNode') || p.includes('Event'));
    
    let res = "";
    if (valImports.length > 0) res += `import { ${valImports.join(', ')} } from 'react';\n`;
    if (typeImports.length > 0) res += `import type { ${typeImports.join(', ')} } from 'react';\n`;
    return res.trim() || match;
  });

  if (file.endsWith('Dispatch.tsx')) {
      content = content.replace(/AnimatePresence(,\s*|\s*,)?/g, '');
  }
  if (file.endsWith('Reports.tsx')) {
      content = content.replace(/import { Input } from "..\/components\/ui\/Input";?\r?\n?/g, "");
  }
  if (file.endsWith('LiveFeed.tsx')) {
      content = content.replace(/useEffect(,\s*|\s*,)?/g, '');
  }
  if (file.endsWith('Modal.tsx')) {
      content = content.replace(/\{\.\.\.props\}/, '');
  }
  
  writeFileSync(file, content);
});
