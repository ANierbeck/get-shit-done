#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

// Get version from package.json
const pkg = require('../package.json');

// Parse args
const args = process.argv.slice(2);
const hasGlobal = args.includes('--global') || args.includes('-g');
const hasLocal = args.includes('--local') || args.includes('-l');
const hasUninstall = args.includes('--uninstall') || args.includes('-u');
const hasHelp = args.includes('--help') || args.includes('-h');
const forceStatusline = args.includes('--force-statusline');

const banner = '\n' +
  cyan + '   ██████╗ ███████╗██████╗\n' +
  '  ██╔════╝ ██╔════╝██╔══██╗\n' +
  '  ██║  ███╗███████╗██║  ██║\n' +
  '  ██║   ██║╚════██║██║  ██║\n' +
  '  ╚██████╔╝███████║██████╔╝\n' +
  '   ╚═════╝ ╚══════╝╚═════╝' + reset + '\n' +
  '\n' +
  '  Get Shit Done ' + dim + 'v' + pkg.version + reset + '\n' +
  '  Mistral Vibe Edition - Skill-based installation\n' +
  '  A meta-prompting, context engineering and spec-driven\n' +
  '  development system for Mistral Vibe.\n';

console.log(banner);

// Show help if requested
if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} npx get-shit-done-vibe [options]\n\n  ${yellow}Options:${reset}\n    ${cyan}-g, --global${reset}              Install globally (to ~/.vibe/)\n    ${cyan}-l, --local${reset}               Install locally (to current directory)\n    ${cyan}-u, --uninstall${reset}           Uninstall GSD from Mistral Vibe\n    ${cyan}-h, --help${reset}                Show this help message\n    ${cyan}--force-statusline${reset}        Replace existing statusline config\n\n  ${yellow}Examples:${reset}\n    ${dim}# Interactive install (prompts for location)${reset}\n    npx get-shit-done-vibe\n\n    ${dim}# Install globally for Mistral Vibe${reset}\n    npx get-shit-done-vibe --global\n\n    ${dim}# Install to current project only${reset}\n    npx get-shit-done-vibe --local\n\n    ${dim}# Uninstall GSD from Mistral Vibe${reset}\n    npx get-shit-done-vibe --global --uninstall\n`);
  process.exit(0);
}

/**
 * Expand ~ to home directory
 */
function expandTilde(filePath) {
  if (filePath && filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

/**
 * Get the global Vibe directory
 */
function getGlobalVibeDir() {
  return path.join(os.homedir(), '.vibe');
}

/**
 * Get the local Vibe directory
 */
function getLocalVibeDir() {
  return path.join(process.cwd(), '.vibe');
}

/**
 * Copy directory recursively with path replacements for Vibe
 */
function copyForVibe(srcDir, destDir, isGlobal) {
  // Clean install: remove existing destination to prevent orphaned files
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true });
  }
  fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyForVibe(srcPath, destPath, isGlobal);
    } else if (entry.name.endsWith('.md')) {
      // Replace all Claude references with Vibe references
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replace(/\.claude/g, '.vibe');
      content = content.replace(/~\/\.claude\//g, '~/.vibe/');
      content = content.replace(/\.\/\.claude\//g, './.vibe/');
      fs.writeFileSync(destPath, content);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Install skills to Vibe directory
 */
function installSkills(vibeDir, isGlobal) {
  const src = path.join(__dirname, '..');
  const skillsSrc = path.join(src, 'skills', 'gsd');
  const skillsDest = path.join(vibeDir, 'skills', 'gsd');
  
  console.log(`  Installing skills to ${cyan}${skillsDest}${reset}`);
  
  // Copy all skills
  copyForVibe(skillsSrc, skillsDest, isGlobal);
  
  // Remove old Claude commands if they exist
  removeClaudeCommands(skillsDest);
  
  // Also create flat command structure for backward compatibility
  createFlatCommands(skillsSrc, vibeDir, isGlobal);
  
  // Count installed skills
  const skillDirs = fs.readdirSync(skillsDest, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(path.join(skillsDest, entry.name, 'SKILL.md')))
    .map(entry => entry.name);
  
  console.log(`  ${green}✓${reset} Installed ${skillDirs.length} skills`);
  
  return skillDirs.length;
}

/**
 * Install workflows to Vibe directory
 */
function installWorkflows(vibeDir, isGlobal) {
  const src = path.join(__dirname, '..');
  const workflowsSrc = path.join(src, 'get-shit-done', 'workflows');
  const workflowsDest = path.join(vibeDir, 'workflows');
  
  console.log(`  Installing workflows to ${cyan}${workflowsDest}${reset}`);
  
  // Copy all workflows
  copyForVibe(workflowsSrc, workflowsDest, isGlobal);
  
  // Remove old Claude workflows if they exist
  removeClaudeWorkflows(workflowsDest);
  
  // Count installed workflows
  const workflowFiles = fs.readdirSync(workflowsDest)
    .filter(file => file.endsWith('.md'));
  
  console.log(`  ${green}✓${reset} Installed ${workflowFiles.length} workflows`);
  
  return workflowFiles.length;
}

/**
 * Install hooks to Vibe directory
 */
function installHooks(vibeDir, isGlobal) {
  const src = path.join(__dirname, '..');
  const hooksSrc = path.join(src, 'hooks', 'dist');
  const hooksDest = path.join(vibeDir, 'hooks');
  
  if (fs.existsSync(hooksSrc)) {
    console.log(`  Installing hooks to ${cyan}${hooksDest}${reset}`);
    
    // Copy hooks with Vibe path replacements
    fs.mkdirSync(hooksDest, { recursive: true });
    const hookEntries = fs.readdirSync(hooksSrc);
    
    for (const entry of hookEntries) {
      const srcFile = path.join(hooksSrc, entry);
      if (fs.statSync(srcFile).isFile()) {
        const destFile = path.join(hooksDest, entry);
        // Replace Claude paths with Vibe paths
        if (entry.endsWith('.js')) {
          let content = fs.readFileSync(srcFile, 'utf8');
          content = content.replace(/'\.claude'/g, '\'.vibe\'');
          content = content.replace(/\.claude/g, '.vibe');
          fs.writeFileSync(destFile, content);
        } else {
          fs.copyFileSync(srcFile, destFile);
        }
      }
    }
    
    const hookFiles = fs.readdirSync(hooksDest).filter(f => f.endsWith('.js') || f.endsWith('.sh'));
    console.log(`  ${green}✓${reset} Installed ${hookFiles.length} hooks`);
    
    return hookFiles.length;
  }
  return 0;
}

/**
 * Remove old Claude workflows to prevent conflicts
 */
function removeClaudeWorkflows(workflowsDir) {
  if (fs.existsSync(workflowsDir)) {
    // Remove old gsd-*.md files that reference Claude
    const files = fs.readdirSync(workflowsDir);
    let removedCount = 0;
    
    for (const file of files) {
      if (file.startsWith('gsd-') && file.endsWith('.md')) {
        const content = fs.readFileSync(path.join(workflowsDir, file), 'utf8');
        if (content.includes('.claude') || content.includes('Claude')) {
          fs.unlinkSync(path.join(workflowsDir, file));
          removedCount++;
        }
      }
    }
    
    if (removedCount > 0) {
      console.log(`  ${green}✓${reset} Removed ${removedCount} old Claude workflows`);
    }
  }
}

/**
 * Remove old Claude commands to prevent conflicts
 */
function removeClaudeCommands(vibeDir) {
  const commandsDir = path.join(vibeDir, 'commands');
  
  if (fs.existsSync(commandsDir)) {
    // Remove old gsd-*.toml files (Claude format)
    const files = fs.readdirSync(commandsDir);
    let removedCount = 0;
    
    for (const file of files) {
      if (file.startsWith('gsd-') && file.endsWith('.toml')) {
        fs.unlinkSync(path.join(commandsDir, file));
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      console.log(`  ${green}✓${reset} Removed ${removedCount} old Claude commands`);
    }
  }
}

/**
 * Create flat command structure for backward compatibility
 * Creates commands/gsd-*.md files that point to skills
 */
function createFlatCommands(skillsSrc, vibeDir, isGlobal) {
  const commandsDest = path.join(vibeDir, 'commands');
  fs.mkdirSync(commandsDest, { recursive: true });
  
  // Get all skill directories
  const skillDirs = fs.readdirSync(skillsSrc, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && 
                   fs.existsSync(path.join(skillsSrc, entry.name, 'SKILL.md')));
  
  let createdCount = 0;
  
  for (const skillDir of skillDirs) {
    const skillName = skillDir.name;
    const commandName = `gsd-${skillName}`;
    const commandPath = path.join(commandsDest, `${commandName}.md`);
    
    // Create a markdown command that executes the skill
    const commandContent = `---
name: gsd:${skillName}
description: Execute GSD ${skillName} skill
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
allowed-tools: 'Read Write'
---

# GSD ${skillName.replace('-', ' ').replace(//g, ' ')} Command

## Objective
Execute the ${skillName} skill from the Get-Shit-Done framework.

## Process
1. Load skill from ~/.vibe/skills/gsd/${skillName}/SKILL.md
2. Execute skill with provided parameters
3. Return skill output

## Output
- Skill execution results
- Any generated files or data
- Status and completion information

## Success Criteria
- [ ] Skill loaded successfully
- [ ] Skill executed without errors
- [ ] Output returned to user
- [ ] All success criteria from skill met

## Examples
### Example 1: Basic execution
\`\`\`
vibe execute ~/.vibe/skills/gsd/${skillName}/SKILL.md
\`\`\`

### Example 2: With parameters
\`\`\`
vibe execute ~/.vibe/skills/gsd/${skillName}/SKILL.md --param value
\`\`\`
`;
    
    fs.writeFileSync(commandPath, commandContent);
    createdCount++;
  }
  
  if (createdCount > 0) {
    console.log(`  ${green}✓${reset} Created ${createdCount} flat commands for backward compatibility`);
  }
}

/**
 * Create skill index for faster discovery
 */
function createSkillIndex(vibeDir) {
  const skillsDir = path.join(vibeDir, 'skills', 'gsd');
  const indexFile = path.join(vibeDir, 'skills', 'index.json');
  
  if (!fs.existsSync(skillsDir)) {
    console.log(`  ${yellow}⚠${reset} Skills directory not found, skipping index creation`);
    return;
  }
  
  const skillIndex = {
    version: '1.0',
    updated_at: new Date().toISOString(),
    skills: []
  };
  
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
        // Skip errors silently
      }
    }
  }
  
  fs.writeFileSync(indexFile, JSON.stringify(skillIndex, null, 2));
  console.log(`  ${green}✓${reset} Created skill index with ${skillIndex.skills.length} skills`);
}

/**
 * Configure Vibe settings to enable GSD skills
 */
function configureVibeSettings(vibeDir) {
  const configPath = path.join(vibeDir, 'config.toml');
  
  if (!fs.existsSync(configPath)) {
    console.log(`  ${yellow}⚠${reset} No config.toml found, creating one with GSD settings`);
    // Create a basic config with GSD settings
    const basicConfig = `active_model = "devstral-2"
textual_theme = "tokyo-night"

skill_paths = [
    "~/.vibe/skills/gsd/*/SKILL.md"
]

enabled_tools = [
    "read_file",
    "write_file", 
    "run_shell_command",
    "ask_user_question"
]
`;
    fs.writeFileSync(configPath, basicConfig);
    console.log(`  ${green}✓${reset} Created config.toml with GSD settings`);
    return;
  }
  
  try {
    // Read existing config
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Check if skill_paths is already configured
    const hasSkillPaths = content.includes('skill_paths') && content.includes('~/.vibe/skills/gsd');
    
    // Check if enabled_tools is already configured
    const hasEnabledTools = content.includes('enabled_tools') && 
                           content.includes('read_file') && 
                           content.includes('run_shell_command');
    
    // Check if skill indexing is already configured
    const hasSkillIndexing = content.includes('[skill_indexing]');
    
    if (hasSkillPaths && hasEnabledTools && hasSkillIndexing) {
      console.log(`  ${green}✓${reset} Vibe configuration already fully set up`);
      return;
    }
    
    // Add skill_paths if not present
    if (!hasSkillPaths) {
      if (content.includes('[tools.search_replace]') || content.includes('[session_logging]')) {
        // Insert before a known section
        content = content.replace(
          /(\[tools\.search_replace\]|\[session_logging\]|\[project_context\])/,
          `skill_paths = [
    "~/.vibe/skills/"
]

# Enable GSD skills using pattern matching
enabled_skills = ["gsd-*"]

[skill_indexing]
enabled = true
index_on_startup = true
auto_update = true

$1`
        );
      } else {
        // Add at the end
        content += `\nskill_paths = [
    "~/.vibe/skills/"
]

# Enable GSD skills using pattern matching
enabled_skills = ["gsd-*"]

[skill_indexing]
enabled = true
index_on_startup = true
auto_update = true`;
      }
      console.log(`  ${green}✓${reset} Added skill configuration to config.toml`);
    }
    
    // Add enabled_tools if not present
    if (!hasEnabledTools) {
      if (content.includes('disabled_tools')) {
        // Insert before disabled_tools
        content = content.replace(
          /disabled_tools = \[/,
          `enabled_tools = [
    "read_file",
    "write_file", 
    "run_shell_command",
    "ask_user_question"
]

disabled_tools = [`
        );
      } else {
        // Add at the end
        content += `\nenabled_tools = [
    "read_file",
    "write_file", 
    "run_shell_command",
    "ask_user_question"
]`;
      }
      console.log(`  ${green}✓${reset} Added enabled_tools to config.toml`);
    }
    
    // Add skill indexing if not present
    if (!hasSkillIndexing) {
      if (content.includes('[project_context]')) {
        // Insert before project_context
        content = content.replace(
          '/\[project_context\]/',
          `[skill_indexing]
enabled = true
index_on_startup = true
auto_update = true

[project_context]`
        );
      } else {
        // Add at the end
        content += `\n[skill_indexing]
enabled = true
index_on_startup = true
auto_update = true`;
      }
      console.log(`  ${green}✓${reset} Added skill indexing to config.toml`);
    }
    
    // Write updated config
    fs.writeFileSync(configPath, content);
    console.log(`  ${green}✓${reset} Updated config.toml with GSD settings`);
    
  } catch (error) {
    console.log(`  ${yellow}⚠${reset} Could not update config.toml: ${error.message}`);
    console.log(`  ${dim}Please manually add these settings to your config.toml:${reset}`);
    console.log(`  ${dim}skill_paths = ["~/.vibe/skills/gsd/*/SKILL.md"]${reset}`);
    console.log(`  ${dim}enabled_tools = ["read_file", "write_file", "run_shell_command", "ask_user_question"]${reset}`);
  }
}

/**
 * Install configuration files
 */
function installConfig(vibeDir, isGlobal) {
  console.log(`  Installing configuration to ${cyan}${vibeDir}${reset}`);
  
  // Create main config directory structure
  fs.mkdirSync(path.join(vibeDir, 'get-shit-done'), { recursive: true });
  
  // Write VERSION file
  const versionDest = path.join(vibeDir, 'get-shit-done', 'VERSION');
  fs.writeFileSync(versionDest, pkg.version);
  console.log(`  ${green}✓${reset} Wrote VERSION (${pkg.version})`);
  
  // Write package.json to force CommonJS mode
  const pkgJsonDest = path.join(vibeDir, 'package.json');
  fs.writeFileSync(pkgJsonDest, '{"type":"commonjs"}\n');
  console.log(`  ${green}✓${reset} Wrote package.json (CommonJS mode)`);
  
  return true;
}

/**
 * Uninstall GSD from Vibe directory
 */
function uninstallVibe(isGlobal) {
  const vibeDir = isGlobal ? getGlobalVibeDir() : getLocalVibeDir();
  const locationLabel = isGlobal 
    ? vibeDir.replace(os.homedir(), '~')
    : vibeDir.replace(process.cwd(), '.');

  console.log(`  Uninstalling GSD from Mistral Vibe at ${cyan}${locationLabel}${reset}\n`);

  // Check if Vibe directory exists
  if (!fs.existsSync(vibeDir)) {
    console.log(`  ${yellow}⚠${reset} Vibe directory does not exist: ${locationLabel}`);
    console.log(`  Nothing to uninstall.\n`);
    return;
  }

  let removedCount = 0;

  // 1. Remove GSD skills directory
  const gsdSkillsDir = path.join(vibeDir, 'skills', 'gsd');
  if (fs.existsSync(gsdSkillsDir)) {
    fs.rmSync(gsdSkillsDir, { recursive: true });
    removedCount++;
    console.log(`  ${green}✓${reset} Removed skills/gsd/`);
  }

  // 2. Remove get-shit-done directory
  const gsdDir = path.join(vibeDir, 'get-shit-done');
  if (fs.existsSync(gsdDir)) {
    fs.rmSync(gsdDir, { recursive: true });
    removedCount++;
    console.log(`  ${green}✓${reset} Removed get-shit-done/`);
  }

  // 3. Remove GSD workflows
  const workflowsDir = path.join(vibeDir, 'workflows');
  if (fs.existsSync(workflowsDir)) {
    // Remove only GSD workflows, not all workflows
    const files = fs.readdirSync(workflowsDir);
    let workflowCount = 0;
    for (const file of files) {
      if (file.startsWith('gsd-') || file === 'CHANGELOG.md') {
        fs.unlinkSync(path.join(workflowsDir, file));
        workflowCount++;
      }
    }
    if (workflowCount > 0) {
      removedCount++;
      console.log(`  ${green}✓${reset} Removed ${workflowCount} GSD workflows`);
    }
  }

  // 4. Remove GSD hooks
  const hooksDir = path.join(vibeDir, 'hooks');
  if (fs.existsSync(hooksDir)) {
    const gsdHooks = ['gsd-statusline.js', 'gsd-check-update.js', 'gsd-check-update.sh'];
    let hookCount = 0;
    for (const hook of gsdHooks) {
      const hookPath = path.join(hooksDir, hook);
      if (fs.existsSync(hookPath)) {
        fs.unlinkSync(hookPath);
        hookCount++;
      }
    }
    if (hookCount > 0) {
      removedCount++;
      console.log(`  ${green}✓${reset} Removed ${hookCount} GSD hooks`);
    }
  }

  // 5. Remove GSD package.json
  const pkgJsonPath = path.join(vibeDir, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const content = fs.readFileSync(pkgJsonPath, 'utf8').trim();
      if (content === '{"type":"commonjs"}') {
        fs.unlinkSync(pkgJsonPath);
        removedCount++;
        console.log(`  ${green}✓${reset} Removed GSD package.json`);
      }
    } catch (e) {
      // Ignore read errors
    }
  }

  if (removedCount === 0) {
    console.log(`  ${yellow}⚠${reset} No GSD files found to remove.`);
  }

  console.log(`\n  ${green}Done!${reset} GSD has been uninstalled from Mistral Vibe.`);
  console.log(`  Your other files and settings have been preserved.`);
}

/**
 * Main installation function
 */
function installVibe(isGlobal, isInteractive) {
  const vibeDir = isGlobal ? getGlobalVibeDir() : getLocalVibeDir();
  const locationLabel = isGlobal 
    ? vibeDir.replace(os.homedir(), '~')
    : vibeDir.replace(process.cwd(), '.');

  console.log(`  Installing for ${cyan}Mistral Vibe${reset} to ${cyan}${locationLabel}${reset}\n`);

  // Create Vibe directory if it doesn't exist
  fs.mkdirSync(vibeDir, { recursive: true });

  // Install components
  const skillsCount = installSkills(vibeDir, isGlobal);
  const workflowsCount = installWorkflows(vibeDir, isGlobal);
  const hooksCount = installHooks(vibeDir, isGlobal);
  installConfig(vibeDir, isGlobal);

  // Configure Vibe settings automatically
  configureVibeSettings(vibeDir);
  
  // Create skill index for faster discovery
  createSkillIndex(vibeDir);

  console.log(`\n  ${green}Done!${reset} Launch Mistral Vibe and use GSD skills.`);
  console.log(`\n  ${cyan}Available skills:${reset}`);
  console.log(`    Use skills with: ${cyan}vibe execute ~/.vibe/skills/gsd/*/SKILL.md${reset}`);
  console.log(`\n  ${cyan}Configuration:${reset}`);
  console.log(`    Skills path: ${cyan}~/.vibe/skills/gsd/*/SKILL.md${reset}`);
  console.log(`    Enabled tools: ${cyan}read_file, write_file, run_shell_command, ask_user_question${reset}`);
  console.log(`\n  ${cyan}Join the community:${reset} https://discord.gg/5JJgD5svVS`);
}

/**
 * Prompt for install location
 */
function promptLocation() {
  if (!process.stdin.isTTY) {
    console.log(`  ${yellow}Non-interactive terminal detected, defaulting to global install${reset}\n`);
    installVibe(true, false);
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let answered = false;

  rl.on('close', () => {
    if (!answered) {
      answered = true;
      console.log(`\n  ${yellow}Installation cancelled${reset}\n`);
      process.exit(0);
    }
  });

  const globalPath = getGlobalVibeDir().replace(os.homedir(), '~');
  const localPath = '.vibe';

  console.log(`  ${yellow}Where would you like to install?${reset}\n\n  ${cyan}1${reset}) Global ${dim}(${globalPath})${reset} - available in all projects\n  ${cyan}2${reset}) Local  ${dim}(${localPath})${reset} - this project only\n`);

  rl.question(`  Choice ${dim}[1]${reset}: `, (answer) => {
    answered = true;
    rl.close();
    const choice = answer.trim() || '1';
    const isGlobal = choice !== '2';
    installVibe(isGlobal, true);
  });
}

// Main logic
if (hasGlobal && hasLocal) {
  console.error(`  ${yellow}Cannot specify both --global and --local${reset}`);
  process.exit(1);
} else if (hasUninstall) {
  if (!hasGlobal && !hasLocal) {
    console.error(`  ${yellow}--uninstall requires --global or --local${reset}`);
    process.exit(1);
  }
  uninstallVibe(hasGlobal);
} else if (hasGlobal || hasLocal) {
  installVibe(hasGlobal, false);
} else {
  // Interactive
  if (!process.stdin.isTTY) {
    console.log(`  ${yellow}Non-interactive terminal detected, defaulting to global install${reset}\n`);
    installVibe(true, false);
  } else {
    promptLocation();
  }
}
