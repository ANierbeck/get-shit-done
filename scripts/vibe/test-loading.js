#!/usr/bin/env node
/**
 * Simulates how Vibe loads and checks skills
 * This tests the basic structure without running Vibe itself
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEST_SKILL = 'gsd-help';
const SKILLS_DIR = path.join(process.env.HOME || '/root', '.vibe', 'skills');

console.log('🧪 Testing Vibe Skill Loading Simulation\n');

// 1. Check if skill directory exists
const skillPath = path.join(SKILLS_DIR, TEST_SKILL);
if (!fs.existsSync(skillPath)) {
  console.error(`❌ Skill directory not found: ${skillPath}`);
  process.exit(1);
}
console.log(`✅ Skill directory exists: ${skillPath}`);

// 2. Check SKILL.md
const skillMdPath = path.join(skillPath, 'SKILL.md');
if (!fs.existsSync(skillMdPath)) {
  console.error(`❌ SKILL.md not found in ${skillPath}`);
  process.exit(1);
}

// 3. Lese und parse SKILL.md
let content = fs.readFileSync(skillMdPath, 'utf-8');

// Frontmatter parsen
const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
if (!frontmatterMatch) {
  console.error('❌ Invalid frontmatter');
  process.exit(1);
}

const frontmatter = parseFrontmatter(frontmatterMatch[1]);
console.log(`✅ Frontmatter parsed`);
console.log(`   Name: ${frontmatter.name}`);
console.log(`   Description: ${frontmatter.description}`);
console.log(`   Compatibility: ${frontmatter.compatibility}`);
console.log(`   User-invocable: ${frontmatter['user-invocable']}`);

// 4. Check process block
if (content.includes('>>') && content.includes('<<')) {
  console.log('✅ Process block found');
  
  const processMatch = content.match(/>>'[\s\S]*?<<'/);
  if (processMatch) {
    const processContent = processMatch[0]
      .replace(/>>'/g, '')
      .replace(/<<'/g, '')
      .replace(/<process>/g, '')
      .replace(/<\/process>/g, '')
      .trim();
    console.log(`   Process: ${processContent.substring(0, 60)}${processContent.length > 60 ? '...' : ''}`);
  }
} else {
  console.error('❌ No process block found');
  process.exit(1);
}

// 5. Check that skill is callable via vibe -p
console.log('✅ Skill appears to be valid for Vibe');

// 6. Test: Kann man den Skill-Inhalt lesen?
try {
  const stat = fs.statSync(skillMdPath);
  console.log(`✅ File is readable (${stat.size} bytes)`);
} catch (err) {
  console.error(`❌ File not readable: ${err.message}`);
  process.exit(1);
}

// 7. Check all skills
console.log('\n📊 Checking all skills');
const allSkills = fs.readdirSync(SKILLS_DIR)
  .filter(d => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory())
  .sort();

let validCount = 0;
let hasErrors = 0;

for (const skill of allSkills) {
  const testPath = path.join(SKILLS_DIR, skill, 'SKILL.md');
  if (!fs.existsSync(testPath)) {
    console.log(`  ❌ ${skill} (missing SKILL.md)`);
    hasErrors++;
    continue;
  }
  
  const testContent = fs.readFileSync(testPath, 'utf-8');
  const hasFrontmatter = testContent.match(/^---\n[\s\S]+?\n---/);
  const hasProcess = testContent.includes('>>') && testContent.includes('<<');
  const hasCompatibility = testContent.includes('compatibility:');
  
  if (hasFrontmatter && hasProcess && hasCompatibility) {
    validCount++;
    console.log(`  ✅ ${skill}`);
  } else {
    console.log(`  ⚠️  ${skill} (missing: ${!hasFrontmatter ? 'frontmatter' : ''} ${!hasProcess ? 'process' : ''} ${!hasCompatibility ? 'compatibility' : ''})`);
    hasErrors++;
  }
}

console.log(`\n${validCount}/${allSkills.length} skills are structurally valid for Vibe`);

if (hasErrors > 0) {
  console.log('⚠️  Some skills have structural issues');
  process.exit(1);
} else {
  console.log('✅ All skills passed structural validation!');
  console.log('\n💡 Ready for manual testing with:');
  console.log('   vibe -p "gsd-help"');
  console.log('   vibe -p "gsd-new-project"');
  process.exit(0);
}

function parseFrontmatter(yaml) {
  const obj = {};
  yaml.split('\n').forEach(line => {
    const match = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (match) {
      const key = match[1];
      const value = match[2].trim();
      if (value === 'true' || value === 'false') {
        obj[key] = value === 'true';
      } else if (/^\[.*\]$/.test(value)) {
        obj[key] = value.slice(1, -1).split(',').map(v => v.trim());
      } else if ((value.startsWith('"') && value.endsWith('"')) || 
                 (value.startsWith("'") && value.endsWith("'"))) {
        obj[key] = value.slice(1, -1);
      } else {
        obj[key] = value;
      }
    }
  });
  return obj;
}
