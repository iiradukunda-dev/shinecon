const fs = require('fs');

const css = fs.readFileSync('src/app/globals.css', 'utf8');
const lines = css.split('\n');

let currentSection = 'base';
let sections = { base: [] };

for (const line of lines) {
  const match = line.match(/^\/\* ── (.*) ─+ \*\//);
  if (match) {
    currentSection = match[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!sections[currentSection]) {
      sections[currentSection] = [];
    }
  }
  sections[currentSection].push(line);
}

// Ensure css/ directory exists
if (!fs.existsSync('src/app/css')) {
  fs.mkdirSync('src/app/css');
}

let imports = '';

for (const [name, content] of Object.entries(sections)) {
  const filename = `src/app/css/${name}.css`;
  fs.writeFileSync(filename, content.join('\n'));
  imports += `@import './css/${name}.css';\n`;
}

fs.writeFileSync('src/app/globals.css', imports);
console.log('CSS split successfully into:', Object.keys(sections));
