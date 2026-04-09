// fix-imports.js - run with: node fix-imports.js
const fs = require('fs');
const path = require('path');
const glob = require('glob'); // npm install -D glob if needed

const files = glob.sync('src/**/*.ts');

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const fileDir = path.dirname(filePath);

  const fixed = content.replace(/from '(src\/[^']+)'/g, (match, importPath) => {
    const absoluteImport = path.resolve(importPath); // resolves src/... from root
    let relative = path.relative(fileDir, absoluteImport);
    if (!relative.startsWith('.')) relative = './' + relative;
    return `from '${relative}'`;
  });

  if (content !== fixed) {
    fs.writeFileSync(filePath, fixed);
    console.log('Fixed:', filePath);
  }
});