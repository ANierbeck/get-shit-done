#!/usr/bin/env node
/**
 * Korrigiert die falsch formatierten vibe -p "gsd-xx"-yy" Aufrufe
 * in den SOURCE Dateien (skills/ Verzeichnis)
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');

function fixBrokenCommands(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Pattern: vibe -p "gsd-XXXX"-YYYY  →  vibe -p "gsd-XXXX-YYYY"
  content = content.replace(
    /vibe -p "gsd-([a-z0-9-]+)"-([a-z0-9-]+)/g,
    'vibe -p "gsd-$1-$2"'
  );

  // Auch in Backticks
  content = content.replace(
    /`vibe -p "gsd-([a-z0-9-]+)"-([a-z0-9-]+)`/g,
    '`vibe -p "gsd-$1-$2"`'
  );

  // Auch: vibe -p "gsd-XX" -phase
  content = content.replace(
    /vibe -p "gsd-([a-z0-9-]+)"\s*-\s*(\w+)/g,
    'vibe -p "gsd-$1-$2"'
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

// Haupt
console.log('🔧 Fixing broken slash commands in SOURCE files...\n');

const skillDirs = fs.existsSync(SKILLS_DIR) 
  ? fs.readdirSync(SKILLS_DIR)
      .filter(d => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory())
      .sort()
  : [];

let fixed = 0;
let skipped = 0;

for (const dir of skillDirs) {
  const skillMdPath = path.join(SKILLS_DIR, dir, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    if (fixBrokenCommands(skillMdPath)) {
      console.log(`  ✅ ${dir}`);
      fixed++;
    } else {
      skipped++;
    }
  }
}

console.log(`\n✨ Done! Fixed ${fixed} skills in source`);

// Auch in ~/.vibe/skills/ fixen
const VIBE_SKILLS_DIR = path.join(__dirname, '..', '.vibe', 'skills');
if (fs.existsSync(VIBE_SKILLS_DIR)) {
  console.log('\n🔧 Also fixing in ~/.vibe/skills/...\n');
  
  const vibeSkillDirs = fs.readdirSync(VIBE_SKILLS_DIR)
    .filter(d => fs.statSync(path.join(VIBE_SKILLS_DIR, d)).isDirectory())
    .sort();

  let vibeFixed = 0;
  for (const dir of vibeSkillDirs) {
    const skillMdPath = path.join(VIBE_SKILLS_DIR, dir, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      if (fixBrokenCommands(skillMdPath)) {
        console.log(`  ✅ ${dir}`);
        vibeFixed++;
      }
    }
  }
  console.log(`\n✨ Fixed ${vibeFixed} skills in ~/.vibe/skills/`);
}
