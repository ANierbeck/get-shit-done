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

console.log(cyan + '\n  🎯 GSD Command to Skill Migration' + reset);
console.log('  Migrating old TOML commands to use new A+ skills\n');

const vibeDir = path.join(os.homedir(), '.vibe');
const commandsDir = path.join(vibeDir, 'commands');
const backupDir = path.join(vibeDir, 'commands-backup-' + Date.now());

// Create backup of old commands
if (fs.existsSync(commandsDir)) {
  console.log(`  📁 Backing up old commands to: ${dim}${backupDir}${reset}`);
  fs.renameSync(commandsDir, backupDir);
  console.log(`  ${green}✓${reset} Backup created`);
}

// Create new commands directory
fs.mkdirSync(path.join(vibeDir, 'commands'), { recursive: true });
console.log(`  ${green}✓${reset} Created new commands directory`);

// Map old TOML commands to new skills
const commandMappings = {
  'gsd-help': 'help',
  'gsd-add-phase': 'add-phase',
  'gsd-add-todo': 'add-todo',
  'gsd-complete-milestone': 'complete-milestone',
  'gsd-debug': 'debug',
  'gsd-execute-plan': 'execute-phase',
  'gsd-map-codebase': 'map-codebase',
  'gsd-new-project': 'new-project',
  'gsd-plan-phase': 'plan-phase',
  'gsd-progress': 'progress',
  'gsd-create-roadmap': 'new-milestone',
  'gsd-research-phase': 'research-phase',
  'gsd-verify-work': 'verify-work'
};

// Create new TOML commands that point to skills
for (const [oldCommand, skillName] of Object.entries(commandMappings)) {
  const tomlContent = `[command]
name = "gsd:${skillName}"
aliases = ["/gsd:${skillName}"]
description = "Execute GSD ${skillName} skill"
type = "skill"
skill_path = "~/.vibe/skills/gsd/${skillName}/SKILL.md"
`;
  
  const commandPath = path.join(commandsDir, `${oldCommand}.toml`);
  fs.writeFileSync(commandPath, tomlContent);
  console.log(`  ${green}✓${reset} Created ${oldCommand}.toml → ${skillName} skill`);
}

console.log(`\n  ${green}✅ Migration Complete!${reset}`);
console.log(`  Old commands backed up to: ${dim}${backupDir}${reset}`);
console.log(`  New skill-based commands created in: ${dim}${commandsDir}${reset}`);
console.log(`\n  ${cyan}Restart Mistral Vibe to use the new skill-based commands!${reset}\n`);