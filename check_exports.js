const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let issues = [];
    
    // Check for default export
    const hasDefaultExport = lines.some(line => line.includes('export default'));
    if (!hasDefaultExport) {
      issues.push('Missing default export');
    }
    
    // Check for React import in .tsx files
    if (filePath.endsWith('.tsx') && !content.includes('import React')) {
      issues.push('Missing React import');
    }
    
    // Check for unused imports (simple check)
    const importLines = lines.filter(line => line.trim().startsWith('import'));
    importLines.forEach(importLine => {
      const imports = importLine.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/);
      if (imports) {
        const importPath = imports[1];
        // Skip React and common imports
        if (!importPath.includes('react') && !importPath.includes('expo') && !importPath.includes('@')) {
          // Check if import is used
          const importNameMatch = importLine.match(/import\s+\{([^}]+)\}|import\s+([^{]+)\s+from/);
          if (importNameMatch) {
            const importedItems = importNameMatch[1] || importNameMatch[2];
            const items = importedItems.split(',').map(item => item.trim().split(' ')[0]);
            items.forEach(item => {
              if (item && !content.includes(item) && item !== 'type' && item !== 'React') {
                issues.push(`Possibly unused import: ${item}`);
              }
            });
          }
        }
      }
    });
    
    return issues;
  } catch (error) {
    return [`Error reading file: ${error.message}`];
  }
}

// Check current directory for .tsx files
const files = fs.readdirSync('.').filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
files.forEach(file => {
  const issues = checkFile(file);
  if (issues.length > 0) {
    console.log(`\n${file}:`);
    issues.forEach(issue => console.log(`  ❌ ${issue}`));
  }
});
