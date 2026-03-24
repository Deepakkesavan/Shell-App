import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Variable mappings - complete list from Shell app
const variableReplacements = {
  '--font-primary': '--shell-font-primary',
  '--font-heading': '--shell-font-heading',
  '--color-bg-primary': '--shell-color-bg-primary',
  '--color-bg-secondary': '--shell-color-bg-secondary',
  '--color-text-primary': '--shell-color-text-primary',
  '--color-text-secondary': '--shell-color-text-secondary',
  '--color-text-muted': '--shell-color-text-muted',
  '--color-border': '--shell-color-border',
  '--color-border-hover': '--shell-color-border-hover',
  '--color-primary': '--shell-color-primary',
  '--color-success': '--shell-color-success',
  '--color-card-bg': '--shell-color-card-bg',
  '--color-card-bg-hover': '--shell-color-card-bg-hover',
  '--color-card-border': '--shell-color-card-border',
  '--spacing-xs': '--shell-spacing-xs',
  '--spacing-sm': '--shell-spacing-sm',
  '--spacing-md': '--shell-spacing-md',
  '--spacing-lg': '--shell-spacing-lg',
  '--spacing-xl': '--shell-spacing-xl',
  '--spacing-2xl': '--shell-spacing-2xl',
  '--spacing-3xl': '--shell-spacing-3xl',
  '--spacing-4xl': '--shell-spacing-4xl',
  '--radius-sm': '--shell-radius-sm',
  '--radius-md': '--shell-radius-md',
  '--radius-lg': '--shell-radius-lg',
  '--radius-xl': '--shell-radius-xl',
  '--radius-full': '--shell-radius-full',
  '--transition-fast': '--shell-transition-fast',
  '--transition-normal': '--shell-transition-normal',
  '--transition-slow': '--shell-transition-slow',
  '--shadow-glow': '--shell-shadow-glow',
  '--z-header': '--shell-z-header',
  '--z-modal': '--shell-z-modal',
};

let filesProcessed = 0;
let filesModified = 0;
let totalReplacements = 0;

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fixVariables(content) {
  let modified = content;
  let replacements = 0;
  
  Object.entries(variableReplacements).forEach(([oldVar, newVar]) => {
    // Match variable definitions (--var:)
    const defineRegex = new RegExp(escapeRegExp(oldVar) + ':', 'g');
    
    // Match variable usages (var(--var))
    const usageRegex = new RegExp('var\\(' + escapeRegExp(oldVar) + '\\)', 'g');
    
    const defineMatches = (modified.match(defineRegex) || []).length;
    const usageMatches = (modified.match(usageRegex) || []).length;
    replacements += defineMatches + usageMatches;
    
    // Replace definitions
    modified = modified.replace(defineRegex, `${newVar}:`);
    
    // Replace usages
    modified = modified.replace(usageRegex, `var(${newVar})`);
  });
  
  totalReplacements += replacements;
  return { modified, replacements };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { modified, replacements } = fixVariables(content);
    
    filesProcessed++;
    
    if (replacements > 0) {
      fs.writeFileSync(filePath, modified, 'utf8');
      filesModified++;
      console.log(`✅ Fixed ${replacements} variables in: ${filePath}`);
      
      // Show sample of what was changed
      if (replacements <= 5) {
        const lines = content.split('\n');
        const modifiedLines = modified.split('\n');
        lines.forEach((line, index) => {
          if (line !== modifiedLines[index] && line.includes('--')) {
            console.log(`   Line ${index + 1}: Found CSS variable → Fixed`);
          }
        });
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const basename = path.basename(dir);
  if (basename === 'node_modules' || basename.startsWith('.')) {
    return;
  }
  
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      
      try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          walkDirectory(filePath);
        } else if (file.match(/\.(css|jsx?|tsx?)$/)) {
          processFile(filePath);
        }
      } catch (error) {
        console.error(`❌ Error accessing ${filePath}:`, error.message);
      }
    });
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error.message);
  }
}

console.log('🔧 Starting Shell app CSS variable namespace fix...\n');
console.log('This will add "shell-" prefix to all CSS variables to prevent conflicts.\n');

const srcPath = path.join(__dirname, 'src');

if (!fs.existsSync(srcPath)) {
  console.error('❌ Error: src directory not found!');
  console.error('💡 Make sure you run this script from the shell-app root directory.');
  process.exit(1);
}

walkDirectory(srcPath);

console.log('\n' + '='.repeat(80));
console.log('📊 Summary:');
console.log('='.repeat(80));
console.log(`Files processed: ${filesProcessed}`);
console.log(`Files modified: ${filesModified}`);
console.log(`Total replacements: ${totalReplacements}`);
console.log('='.repeat(80));

if (filesModified > 0) {
  console.log('\n✅ Fix completed successfully!');
  console.log('\n💡 Next steps:');
  console.log('   1. Review the changes with: git diff');
  console.log('   2. Test your shell app: npm run dev');
  console.log('   3. Test remote app integration');
  console.log('   4. Check browser console for any issues');
  console.log('\n⚠️  Important: All CSS variables now use --shell- prefix');
  console.log('   Make sure all your shell components work correctly.\n');
} else {
  console.log('\n✅ No changes needed - all variables already namespaced!');
}
