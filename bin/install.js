#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const magenta = '\x1b[35m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

// Get version from package.json
const pkg = require('../package.json');

const banner = `
${cyan}   ██████╗ ███████╗██████╗
  ██╔════╝ ██╔════╝██╔══██╗
  ██║  ███╗███████╗██║  ██║
  ██║   ██║╚════██║██║  ██║
  ╚██████╔╝███████║██████╔╝
   ╚═════╝ ╚══════╝╚═════╝${reset}

  Get Shit Done ${dim}v${pkg.version}${reset}
  Unified Installer - Meta-prompting for AI platforms by TÂCHES.
`;

// Supported platforms
const PLATFORMS = {
  CLAUDE: {
    name: 'Claude Code',
    code: 'claude',
    defaultDir: '~/.claude',
    envVar: 'CLAUDE_CONFIG_DIR',
    dirFlag: '--claude-dir',
    dirFlagShort: '-c',
    commandPrefix: '/gsd:',
    fileExtension: '.md',
    skillsDir: 'get-shit-done'
  },
  VIBE: {
    name: 'Mistral Vibe',
    code: 'vibe',
    defaultDir: '~/.vibe',
    envVar: 'VIBE_CONFIG_DIR',
    dirFlag: '--vibe-dir',
    dirFlagShort: '-v',
    commandPrefix: '/gsd:',
    fileExtension: '.toml',
    skillsDir: 'get-shit-done'
  }
};

// Parse args
const args = process.argv.slice(2);
const hasHelp = args.includes('--help') || args.includes('-h');
const hasGlobal = args.includes('--global') || args.includes('-g');
const hasLocal = args.includes('--local') || args.includes('-l');

// Detect platform from args
let selectedPlatform = null;

if (args.includes('--claude') || args.includes('-c') || args.includes('--claude-dir')) {
  selectedPlatform = PLATFORMS.CLAUDE;
} else if (args.includes('--vibe') || args.includes('-v') || args.includes('--vibe-dir')) {
  selectedPlatform = PLATFORMS.VIBE;
}

// Parse custom directory argument
function parseCustomDirArg() {
  if (!selectedPlatform) return null;

  const dirFlag = selectedPlatform.dirFlag;
  const dirFlagShort = selectedPlatform.dirFlagShort;

  // Check for --platform-dir format
  const dirFlagIndex = args.findIndex(arg => arg === dirFlag || arg === dirFlagShort);
  if (dirFlagIndex !== -1) {
    const nextArg = args[dirFlagIndex + 1];
    if (!nextArg || nextArg.startsWith('-')) {
      console.error(`  ${yellow}${dirFlag} requires a path argument${reset}`);
      process.exit(1);
    }
    return nextArg;
  }

  // Check for --platform-dir=value format
  const dirFlagArg = args.find(arg => arg.startsWith(`${dirFlag}=`) || arg.startsWith(`${dirFlagShort}=`));
  if (dirFlagArg) {
    return dirFlagArg.split('=')[1];
  }

  return null;
}

const explicitDir = parseCustomDirArg();

console.log(banner);

// Show help if requested
if (hasHelp) {
  showHelp();
  process.exit(0);
}

/**
 * Show comprehensive help
 */
function showHelp() {
  console.log(`  ${yellow}Usage:${reset} npx get-shit-done-cc [platform] [options]

  ${yellow}Platform Selection (required):${reset}
    ${cyan}--claude, -c${reset}          Install for Claude Code
    ${cyan}--vibe, -v${reset}            Install for Mistral Vibe

  ${yellow}Installation Options:${reset}
    ${cyan}--global, -g${reset}           Install globally (to platform config directory)
    ${cyan}--local, -l${reset}            Install locally (to ./${platform} in current directory)

  ${yellow}Platform-Specific Options:${reset}
    ${cyan}--claude-dir <path>${reset}    Custom Claude Code config directory
    ${cyan}--vibe-dir <path>${reset}      Custom Mistral Vibe config directory

  ${yellow}Examples:${reset}
    ${dim}# Install for Claude Code (default behavior)${reset}
    npx get-shit-done-cc --claude --global

    ${dim}# Install for Mistral Vibe${reset}
    npx get-shit-done-cc --vibe --global

    ${dim}# Install for Claude with custom directory${reset}
    npx get-shit-done-cc --claude --global --claude-dir ~/.custom-claude

    ${dim}# Install for Vibe locally${reset}
    npx get-shit-done-cc --vibe --local

    ${dim}# Using environment variables${reset}
    CLAUDE_CONFIG_DIR=~/.custom-claude npx get-shit-done-cc --claude --global
    VIBE_CONFIG_DIR=~/.custom-vibe npx get-shit-done-cc --vibe --global

  ${yellow}Backward Compatibility:${reset}
    ${dim}# Old Claude installation still works${reset}
    npx get-shit-done-cc --global

    ${dim}# Old Vibe installation still works${reset}
    npx get-shit-done-cc --vibe --global
`);
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
 * Copy directory structure with path replacement
 */
function copyWithPathReplacement(srcDir, destDir, pathPrefix, platform) {
  fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyWithPathReplacement(srcPath, destPath, pathPrefix, platform);
    } else if (entry.name.endsWith(platform.fileExtension) ||
               entry.name.endsWith('.yaml') ||
               entry.name.endsWith('.json')) {
      // Replace path references based on platform
      let content = fs.readFileSync(srcPath, 'utf8');

      // Replace old platform paths
      Object.values(PLATFORMS).forEach(otherPlatform => {
        if (otherPlatform.code !== platform.code) {
          const oldPrefix = otherPlatform.defaultDir.replace('~', '');
          content = content.replace(
            new RegExp(`~${oldPrefix}`, 'g'),
            pathPrefix.replace(/\/$/, '')
          );
        }
      });

      // Replace relative paths
      content = content.replace(
        /\.\.\/commands\/gsd\//g,
        pathPrefix + 'commands/gsd/'
      );
      content = content.replace(
        /\.\.\/get-shit-done\//g,
        pathPrefix + 'get-shit-done/'
      );

      fs.writeFileSync(destPath, content);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Install for selected platform
 */
function install(platform, isGlobal) {
  const src = path.join(__dirname, '..');

  // Priority: explicit dir arg > env var > default platform dir
  const configDir = expandTilde(explicitDir) || expandTilde(process.env[platform.envVar]);
  const defaultGlobalDir = configDir || path.join(os.homedir(), platform.defaultDir.replace('~', ''));
  const platformDir = isGlobal
    ? defaultGlobalDir
    : path.join(process.cwd(), `.${platform.code}`);

  const locationLabel = isGlobal
    ? platformDir.replace(os.homedir(), '~')
    : platformDir.replace(process.cwd(), '.');

  // Path prefix for file references
  const pathPrefix = isGlobal
    ? (configDir ? `${platformDir}/` : `${platform.defaultDir}/`)
    : `./.${platform.code}/`;

  console.log(`  Installing ${platform.name} to ${cyan}${locationLabel}${reset}\n`);

  // Create commands directory
  const commandsDir = path.join(platformDir, 'commands');
  fs.mkdirSync(commandsDir, { recursive: true });

  // Determine source directory based on platform
  let commandSrc, commandDestName;

  if (platform.code === 'claude') {
    commandSrc = path.join(src, 'commands', 'gsd');
    commandDestName = 'gsd';
  } else if (platform.code === 'vibe') {
    commandSrc = path.join(src, 'vibe-commands', 'gsd');
    commandDestName = 'gsd';
  }

  // Copy commands
  const commandDest = path.join(commandsDir, commandDestName);
  copyWithPathReplacement(commandSrc, commandDest, pathPrefix, platform);
  console.log(`  ${green}✓${reset} Installed commands/${commandDestName} for ${platform.name}`);

  // Copy skills/reference files (same for both platforms)
  const skillSrc = path.join(src, platform.skillsDir);
  const skillDest = path.join(platformDir, platform.skillsDir);
  copyWithPathReplacement(skillSrc, skillDest, pathPrefix, platform);
  console.log(`  ${green}✓${reset} Installed ${platform.skillsDir} skills`);

  // For Vibe, also copy original MD commands for reference
  if (platform.code === 'vibe') {
    const commandsSrc = path.join(src, 'commands', 'gsd');
    const commandsDest = path.join(commandsDir, 'gsd-md');
    copyWithPathReplacement(commandsSrc, commandsDest, pathPrefix, platform);
    console.log(`  ${green}✓${reset} Installed original GSD commands (for reference)`);
  }

  console.log(`\n  ${green}Done!${reset} Launch ${platform.name} and run ${cyan}${platform.commandPrefix}help${reset}.`);
}

/**
 * Prompt for platform and location
 */
function promptInstallation() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`  ${yellow}Select AI Platform:${reset}`);

  Object.values(PLATFORMS).forEach((platform, index) => {
    console.log(`  ${cyan}${index + 1}${reset}) ${platform.name} ${dim}(${platform.code})${reset}`);
  });

  rl.question(`  Platform ${dim}[1]${reset}: `, (platformAnswer) => {
    const platformIndex = parseInt(platformAnswer.trim()) - 1 || 0;
    const selectedPlatform = Object.values(PLATFORMS)[platformIndex];

    const configDir = expandTilde(explicitDir) || expandTilde(process.env[selectedPlatform.envVar]);
    const globalPath = configDir || path.join(os.homedir(), selectedPlatform.defaultDir.replace('~', ''));
    const globalLabel = globalPath.replace(os.homedir(), '~');

    console.log(`\n  ${yellow}Installation Location:${reset}
    ${cyan}1${reset}) Global ${dim}(${globalLabel})${reset} - available in all projects
    ${cyan}2${reset}) Local  ${dim}(.${selectedPlatform.code})${reset} - this project only`);

    rl.question(`  Location ${dim}[1]${reset}: `, (locationAnswer) => {
      rl.close();
      const choice = locationAnswer.trim() || '1';
      const isGlobal = choice !== '2';
      install(selectedPlatform, isGlobal);
    });
  });
}

// Main logic
if (!selectedPlatform) {
  // Check for backward compatibility (old claude installation)
  if (args.length === 0 || (hasGlobal && !hasLocal && !explicitDir)) {
    // Default to Claude for backward compatibility
    selectedPlatform = PLATFORMS.CLAUDE;
    console.log(`  ${magenta}📝 Note:${reset} Using Claude Code (default). For Mistral Vibe, use --vibe flag.`);
    console.log();
  } else {
    // No platform specified and not backward compatible, prompt user
    promptInstallation();
    return;
  }
}

// Validate arguments
if (hasGlobal && hasLocal) {
  console.error(`  ${yellow}Cannot specify both --global and --local${reset}`);
  process.exit(1);
} else if (explicitDir && hasLocal) {
  console.error(`  ${yellow}Cannot use ${selectedPlatform.dirFlag} with --local${reset}`);
  process.exit(1);
}

// Check if this is the old vibe installation method
const isOldVibeInstall = args.includes('--vibe') && !args.includes('--claude');
if (isOldVibeInstall) {
  console.log(`  ${magenta}📝 Note:${reset} Using new unified installer for Mistral Vibe.`);
  console.log();
}

// Install
if (hasGlobal) {
  install(selectedPlatform, true);
} else if (hasLocal) {
  install(selectedPlatform, false);
} else {
  // Default to global if no location specified
  install(selectedPlatform, true);
}