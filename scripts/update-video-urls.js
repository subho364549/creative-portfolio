const fs = require('fs');
const prefix = 'https://media.githubusercontent.com/media/subho364549/creative-portfolio/main';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  const updated = content.replace(/(['"])\/(uploads\/(?:video|3d)\/[^'"]+\.(?:mp4|webm))(['"])/g, (match, p1, p2, p3) => {
    count++;
    return `${p1}${prefix}/${p2}${p3}`;
  });
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`Updated ${filePath}: replaced ${count} video links`);
}

processFile('data/projects.json');
processFile('src/lib/sample-data.ts');
