#!/usr/bin/env node
/**
 * Ersetzt /gsd: Kommandos durch vibe -p "gsd-..." format
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');

function fixSlashCommands(skillPath) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    return false;
  }

  let content = fs.readFileSync(skillMdPath, 'utf-8');
  const original = content;

  // Ersetze /gsd:command durch vibe -p "gsd-command"
  // Matcht: /gsd:new-project, /gsd-help, etc. (inkl. Bindestriche)
  content = content.replace(
    /\/gsd:([a-z0-9-]+)/g,
    'vibe -p "gsd-$1"'
  );

  // Auch mit Backticks: `/gsd-command`
  content = content.replace(
    /`\/gsd:([a-z0-9-]+)`/g,
    '`vibe -p "gsd-$1"`'
  );

  if (content !== original) {
    fs.writeFileSync(skillMdPath, content, 'utf-8');
    return true;
  }
  return false;
}

// Haupt
console.log('🔧 Fixing /gsd: slash commands...\n');

const skillDirs = fs.readdirSync(SKILLS_DIR)
  .filter(d => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory())
  .sort();

let fixed = 0;
let skipped = 0;

for (const dir of skillDirs) {
  const skillPath = path.join(SKILLS_DIR, dir);
  if (fixSlashCommands(skillPath)) {
    console.log(`  ✅ ${dir}`);
    fixed++;
  } else {
    skipped++;
  }
}

console.log(`\n✨ Done! Fixed ${fixed} skills, ${skipped} already correct`);
