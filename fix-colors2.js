const fs = require('fs');
const path = require('path');

const filesToFix = [
  'components/home/Reviews.tsx',
  'components/tutor/RecentTranslations.tsx'
];

filesToFix.forEach(relPath => {
  const fullPath = path.join('/Users/apple/Clients/Knootix/Website/konita-ai', relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace text-(blue|purple|amber|rose|red)-(50|100|200) with dark:... and text-900
    content = content.replace(/text-(blue|purple|amber|rose|red)-(50|100|200)(?:\/(\d+))?/g, (match, color, shade, opacity) => {
      if (match.includes('dark:')) return match;
      const op = opacity ? `/${opacity}` : '';
      return `dark:text-${color}-${shade}${op} text-${color}-900${op}`;
    });

    // Replace text-(blue|purple|amber|rose|red)-(300|400) with dark:... and text-800
    content = content.replace(/text-(blue|purple|amber|rose|red)-(300|400)(?:\/(\d+))?/g, (match, color, shade, opacity) => {
      if (match.includes('dark:')) return match;
      const op = opacity ? `/${opacity}` : '';
      return `dark:text-${color}-${shade}${op} text-${color}-800${op}`;
    });

    fs.writeFileSync(fullPath, content);
    console.log(`Fixed ${relPath}`);
  }
});
