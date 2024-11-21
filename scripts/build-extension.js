const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

// Build the project
console.log('Building project...');
execSync('npm run build', { stdio: 'inherit' });

// Create dist directory if it doesn't exist
const distDir = path.resolve(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Create a zip file
const output = fs.createWriteStream(path.resolve(distDir, 'extension.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  console.log('Extension package created successfully!');
  console.log('Total bytes:', archive.pointer());
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add the built files to the zip
const buildDir = path.resolve(__dirname, '../dist');
archive.directory(buildDir, false);

// Add manifest and icons
archive.file(path.resolve(__dirname, '../public/manifest.json'), { name: 'manifest.json' });
archive.file(path.resolve(__dirname, '../public/icon16.png'), { name: 'icon16.png' });
archive.file(path.resolve(__dirname, '../public/icon48.png'), { name: 'icon48.png' });
archive.file(path.resolve(__dirname, '../public/icon128.png'), { name: 'icon128.png' });

// Finalize the archive
archive.finalize();