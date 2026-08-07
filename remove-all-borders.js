const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// 1. Clean globals.css
const globalsPath = 'src/app/globals.css';
let css = fs.readFileSync(globalsPath, 'utf-8');
css = css.replace(/border-bottom: 1px solid rgba\(212, 168, 67, 0\.3\);/g, 'border-bottom: none;');
css = css.replace(/border-bottom: 1px solid rgba\(255, 255, 255, 0\.06\);/g, 'border-bottom: none;');
// Clean other border-bottom instances in css to make it clean
css = css.replace(/border-bottom-color: rgba\(212, 168, 67, 0\.25\);/g, 'border-bottom-color: transparent;');
css = css.replace(/border-bottom-color: rgba\(212, 168, 67, 0\.4\);/g, 'border-bottom-color: transparent;');
css = css.replace(/border-bottom: 1px solid var\(--border-light\);/g, 'border-bottom: none;');
css = css.replace(/border-bottom: 1px solid rgba\(212, 168, 67, 0\.2\);/g, 'border-bottom: none;');
fs.writeFileSync(globalsPath, css);

// 2. Clean JS files inline borders
walkDir('src', (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Remove inline borders like: borderBottom: '1px solid var(--border-medium)',
    content = content.replace(/borderBottom:\s*['"`][^'"`]+['"`],?/g, '');
    content = content.replace(/borderTop:\s*['"`][^'"`]+['"`],?/g, '');
    content = content.replace(/borderLeft:\s*['"`][^'"`]+['"`],?/g, '');
    content = content.replace(/borderRight:\s*['"`][^'"`]+['"`],?/g, '');
    // Replace border: '...' with border: 'none' to maintain structure if it was used for sizing
    content = content.replace(/border:\s*['"`]1px solid[^'"`]+['"`]/g, "border: 'none'");
    content = content.replace(/border:\s*['"`]2px solid[^'"`]+['"`]/g, "border: 'none'");
    content = content.replace(/border:\s*['"`]1px solid var\(--border[^'"`]+['"`]/g, "border: 'none'");

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Cleaned inline borders in:', filePath);
    }
  }
});
console.log('Finished removing borders across the app!');
