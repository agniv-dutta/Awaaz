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
  const regex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)types['"]/g;
  let replaced = false;
  content = content.replace(regex, (match, p1, p2) => {
    replaced = true;
    return `import type {${p1}} from '${p2}types'`;
  });
  // Also fix unused inputs
  if (file.endsWith('Dispatch.tsx')) {
      content = content.replace(/AnimatePresence(,\s*|\s*,)?/g, '');
  }
  if (file.endsWith('Reports.tsx')) {
      content = content.replace(/import { Input } from "..\/components\/ui\/Input"(|r)?\n/, "");
  }
  
  if (replaced || file.endsWith('Dispatch.tsx') || file.endsWith('Reports.tsx')) {
    writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
