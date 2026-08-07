const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf-8');

// Replace standard glass border with none
css = css.replace(/border: 1px solid var\(--glass-border\);/g, 'border: none;');

// Replace button border colors with transparent
css = css.replace(/border: 1px solid rgba\(255, 255, 255, 0.05\);/g, 'border: none;');
css = css.replace(/border-top-color: rgba\(255, 255, 255, 0.35\);/g, '');
css = css.replace(/border-right-color: rgba\(255, 255, 255, 0.15\);/g, '');

// Replace specific borders on .btn-secondary, .btn-action-glass, .input, etc
css = css.replace(/border-left-color: rgba\(255, 255, 255, 0.3\);/g, '');
css = css.replace(/border-bottom-color: rgba\(255, 255, 255, 0.15\);/g, '');
css = css.replace(/border-left-color: rgba\(212, 168, 67, 0.6\);/g, '');
css = css.replace(/border-bottom-color: rgba\(212, 168, 67, 0.3\);/g, '');
css = css.replace(/border-left-color: rgba\(59, 91, 219, 0.6\);/g, '');
css = css.replace(/border-bottom-color: rgba\(59, 91, 219, 0.3\);/g, '');
css = css.replace(/border-left-color: rgba\(224, 49, 49, 0.6\);/g, '');
css = css.replace(/border-bottom-color: rgba\(224, 49, 49, 0.3\);/g, '');
css = css.replace(/border-top-color: rgba\(255, 255, 255, 0.4\);/g, '');

css = css.replace(/border: 1px solid var\(--border-medium\);/g, 'border: none;');
css = css.replace(/border: 1px solid rgba\(212, 168, 67, 0.25\);/g, 'border: none;');
css = css.replace(/border: 2px solid var\(--bg-primary\);/g, 'border: none;');

fs.writeFileSync('src/app/globals.css', css);
console.log("Borders removed.");
