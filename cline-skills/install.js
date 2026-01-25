#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const reset = '\x1b[0m';

const banner = `
${cyan}   ██████╗ ███████╗██████╗
  ██╔════╝ ██╔════╝██╔══██╗
  ██║  ███╗███████╗██║  ██║
  ██║   ██║╚════██║██║  ██║
  ╚██████╔╝███████║██████╔╝
   ╚═════╝ ╚══════╝╚═════╝${reset}

  Cline Skills Installer
  Installs GSD-compatible skills for Cline
`;

console.log(banner);

// Parse args
const args = process.argv.slice(2);
const hasHelp = args.includes('--help') || args.includes('-h');

if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} node install.js [options]

  ${yellow}Options:${reset}
    ${cyan}-h, --help${reset}                Show this help message

  ${yellow}Installation:${reset}
    This script copies Cline skills to the appropriate directory.
    Skills will be available to Cline after installation.

  ${yellow}Skills Included:${reset}
    ${cyan}code-review${reset} - Comprehensive code analysis
    ${cyan}performance-audit${reset} - Performance optimization
    ${cyan}project-management${reset} - GSD project management
    ${cyan}codebase-analysis${reset} - Brownfield codebase mapping
    ${cyan}quality-assurance${reset} - Testing and verification
    ${cyan}debugging${reset} - Systematic issue resolution
    ${cyan}progress-tracking${reset} - Progress monitoring
    ${cyan}execution${reset} - Plan and phase execution
    ${cyan}planning${reset} - Detailed phase planning
    ${cyan}session-management${reset} - Pause and resume sessions
    ${cyan}roadmap-management${reset} - Roadmap creation and management
    ${cyan}phase-management${reset} - Individual phase management
`);
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
 * Recursively copy directory
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Install Cline skills
 */
function installSkills() {
  const src = path.join(__dirname);
  const destDir = expandTilde(process.env.CLINE_SKILLS_DIR) ||
                 path.join(os.homedir(), '.cline', 'skills');

  console.log(`  Installing Cline Skills to ${cyan}${destDir}${reset}\n`);

  try {
    // Copy each skill directory
    const skills = fs.readdirSync(src, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && fs.existsSync(path.join(src, entry.name, 'SKILL.md')))
      .map(entry => entry.name);

    for (const skill of skills) {
      const srcPath = path.join(src, skill);
      const destPath = path.join(destDir, skill);
      copyDir(srcPath, destPath);
      console.log(`  ${green}✓${reset} Installed ${skill}`);
    }

    console.log(`
  ${green}Installation complete!${reset}

  ${skills.length} Cline skills installed:
    ${skills.map(s => `${cyan}${s}${reset}`).join('\n    ')}

  Skills are ready for Cline to use.
`);
  } catch (error) {
    console.error(`  ${yellow}Installation failed: ${error.message}${reset}`);
    process.exit(1);
  }
}

// Main
installSkills();