const fs = require('fs');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  const updated = content.replace(/https:\/\/media\.githubusercontent\.com\/media\/subho364549\/creative-portfolio\/main\/(uploads\/(?:video|3d)\/[^'"]+\.(?:mp4|webm))/g, (match, path) => {
    count++;
    return `/api/video?path=${path}`;
  });
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`Updated ${filePath}: converted ${count} links to /api/video stream`);
}

processFile('data/projects.json');
processFile('src/lib/sample-data.ts');
