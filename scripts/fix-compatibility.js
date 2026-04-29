#!/usr/bin/env node
/**
 * Passt das Compatibility-Feld in allen SKILL.md von "Python 3.12+" 
 * zu "Mistral Vibe" an
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');

function fixCompatibility(skillPath) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    return false;
  }

  let content = fs.readFileSync(skillMdPath, 'utf-8');
  const original = content;

  // Ersetze compatibility: Python 3.12+ mit compatibility: Mistral Vibe
  // Match auch "Python 3.12+" mit + am Ende
  content = content.replace(
    /^compatibility:\s*Python\s*\d+\.\d+\+?\s*$/gm,
    'compatibility: Mistral Vibe'
  );

  // auch andere Python-Versionen wie "Python 3.11" etc.
  content = content.replace(
    /^compatibility:\s*Python\s*\w+\s*$/gm,
    'compatibility: Mistral Vibe'
  );

  if (content !== original) {
    fs.writeFileSync(skillMdPath, content, 'utf-8');
    return true;
  }
  return false;
}

// Haupt
console.log('🔧 Fixing compatibility field...\n');

const skillDirs = fs.readdirSync(SKILLS_DIR)
  .filter(d => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory())
  .sort();

let fixed = 0;
let skipped = 0;

for (const dir of skillDirs) {
  const skillPath = path.join(SKILLS_DIR, dir);
  if (fixCompatibility(skillPath)) {
    console.log(`  ✅ ${dir}`);
    fixed++;
  } else {
    skipped++;
  }
}

console.log(`\n✨ Done! Fixed ${fixed} skills, ${skipped} already correct`);
