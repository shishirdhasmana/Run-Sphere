const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const isTsx = fullPath.endsWith('.tsx');
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const out = babel.transformSync(content, {
        filename: fullPath,
        presets: [
          ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
        ],
        // Required for JSX compatibility after TS compilation
        plugins: [
          '@babel/plugin-syntax-jsx'
        ],
        retainLines: true
      });
      
      if (out && out.code) {
        fs.unlinkSync(fullPath);
        const ext = isTsx ? '.jsx' : '.js';
        const newPath = fullPath.replace(/\.tsx?$/, ext);
        fs.writeFileSync(newPath, out.code);
        console.log(`Transpiled: ${newPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
