const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && f !== 'node_modules' && f !== '.git' && f !== 'dist') {
      walkDir(dirPath, callback);
    } else if (!isDirectory && (f.endsWith('.tsx') || f.endsWith('.ts'))) {
      callback(dirPath);
    }
  });
}

walkDir(path.join(process.cwd(), 'src'), (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('class=')) {
    console.log(`Fixing class in: ${filePath}`);
    // Replace class=" with className="
    // Also handle templates and curly brace structures like class={...} or class=
    let updated = content.replace(/\bclass=(['"{])/g, 'className=$1');
    fs.writeFileSync(filePath, updated, 'utf8');
  }
});

console.log('Conversion complete!');
