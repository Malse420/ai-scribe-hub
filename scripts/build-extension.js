import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create dist directory if it doesn't exist
const distDir = path.resolve(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy manifest.json and icons to dist directory
const publicDir = path.resolve(__dirname, '../public');
const filesToCopy = [
  'manifest.json',
  'icon16.png',
  'icon48.png',
  'icon128.png',
  'background.js',
  'content.js'
];

filesToCopy.forEach(file => {
  const sourcePath = path.join(publicDir, file);
  const destPath = path.join(distDir, file);
  
  // For JS files, check both public and src directories
  if (!fs.existsSync(sourcePath) && file.endsWith('.js')) {
    const srcPath = path.join(__dirname, '../src', file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} from src directory to dist`);
      return;
    }
  }
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to dist directory`);
  } else {
    console.warn(`Warning: ${file} not found in public directory`);
  }
});

console.log('Extension build completed successfully!');