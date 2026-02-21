#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

console.log(cyan + '\n  🎯 Ensuring GSD Skills Are Recognized by Vibe' + reset);
console.log('  Configuring skills for proper discovery and completion\n');

const vibeDir = path.join(os.homedir(), '.vibe');
const configPath = path.join(vibeDir, 'config.toml');

// Read current configuration
let configContent = fs.readFileSync(configPath, 'utf8');

// Check if skill_paths is properly configured
const hasSkillPaths = configContent.includes('skill_paths');

if (!hasSkillPaths) {
  console.log(`  ${yellow}⚠${reset} Adding skill_paths configuration`);
  
  // Add skill_paths section
  if (configContent.includes('[project_context]')) {
    configContent = configContent.replace(
      '/\[project_context\]/',
      `skill_paths = [
    "/Users/anierbeck/.vibe/skills/gsd/*/SKILL.md"
]

[project_context]`
    );
  } else {
    configContent += `\nskill_paths = [
    "/Users/anierbeck/.vibe/skills/gsd/*/SKILL.md"
]`;
  }
  
  fs.writeFileSync(configPath, configContent);
  console.log(`  ${green}✓${reset} Added skill_paths configuration`);
} else {
  console.log(`  ${green}✓${reset} skill_paths already configured`);
}

// Check if skill indexing is enabled
const hasSkillIndexing = configContent.includes('enable_skill_indexing') || 
                        configContent.includes('skill_index');

if (!hasSkillIndexing) {
  console.log(`  ${yellow}⚠${reset} Adding skill indexing configuration`);
  
  // Add skill indexing settings
  if (configContent.includes('[session_logging]')) {
    configContent = configContent.replace(
      '/\[session_logging\]/',
      `[skill_indexing]
enabled = true
index_on_startup = true
auto_update = true

[session_logging]`
    );
  } else {
    configContent += `\n[skill_indexing]
enabled = true
index_on_startup = true
auto_update = true`;
  }
  
  fs.writeFileSync(configPath, configContent);
  console.log(`  ${green}✓${reset} Added skill indexing configuration`);
} else {
  console.log(`  ${green}✓${reset} Skill indexing already configured`);
}

// Verify skill directory structure
const skillsDir = path.join(vibeDir, 'skills', 'gsd');
if (fs.existsSync(skillsDir)) {
  const skillCount = fs.readdirSync(skillsDir)
    .filter(dir => fs.existsSync(path.join(skillsDir, dir, 'SKILL.md')))
    .length;
  console.log(`  ${green}✓${reset} Found ${skillCount} skills in ${skillsDir}`);
} else {
  console.log(`  ${yellow}⚠${reset} Skills directory not found: ${skillsDir}`);
}

// Create skill index file for faster discovery
const indexFile = path.join(vibeDir, 'skills', 'index.json');
const skillIndex = {
  version: '1.0',
  updated_at: new Date().toISOString(),
  skills: []
};

if (fs.existsSync(skillsDir)) {
  const skillDirs = fs.readdirSync(skillsDir)
    .filter(dir => fs.existsSync(path.join(skillsDir, dir, 'SKILL.md')));
  
  for (const dir of skillDirs) {
    const skillPath = path.join(skillsDir, dir, 'SKILL.md');
    const content = fs.readFileSync(skillPath, 'utf8');
    const yamlMatch = content.match(/^---\s*$(.*?)^---$/ms);
    
    if (yamlMatch) {
      try {
        const frontmatter = yamlMatch[1];
        const nameMatch = frontmatter.match(/name:\s*([^\n]+)/);
        const descMatch = frontmatter.match(/description:\s*([^\n]+)/);
        
        if (nameMatch && descMatch) {
          skillIndex.skills.push({
            name: nameMatch[1].trim(),
            description: descMatch[1].trim(),
            path: `/Users/anierbeck/.vibe/skills/gsd/${dir}/SKILL.md`,
            command: `gsd:${nameMatch[1].trim()}`
          });
        }
      } catch (e) {
        console.log(`  ${yellow}⚠${reset} Error parsing ${dir}/SKILL.md: ${e.message}`);
      }
    }
  }
  
  fs.writeFileSync(indexFile, JSON.stringify(skillIndex, null, 2));
  console.log(`  ${green}✓${reset} Created skill index with ${skillIndex.skills.length} skills`);
}

console.log(`\n  ${green}✅ Configuration Complete!${reset}`);
console.log(`  Skills should now be recognized by Mistral Vibe`);
console.log(`  Restart Vibe for changes to take effect\n`);