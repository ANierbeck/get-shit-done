# Get Shit Done - Unified Installation Guide

## 🌐 Multi-Platform Installation

Get Shit Done now supports multiple AI platforms through a **unified installer**.

### Select Your Platform

```bash
# For Claude Code
npx get-shit-done-cc --claude --global

# For Mistral Vibe
npx get-shit-done-cc --vibe --global
```

### Installation Options

| Option | Description | Example |
|--------|-------------|---------|
| `--claude` | Install for Claude Code | `npx get-shit-done-cc --claude --global` |
| `--vibe` | Install for Mistral Vibe | `npx get-shit-done-cc --vibe --global` |
| `--global` | Global installation | Available in all projects |
| `--local` | Local installation | Project-specific |
| `--claude-dir` | Custom Claude directory | `npx get-shit-done-cc --claude --global --claude-dir ~/.custom` |
| `--vibe-dir` | Custom Vibe directory | `npx get-shit-done-cc --vibe --global --vibe-dir ~/.custom` |

### Complete Examples

```bash
# Install Claude Code globally (default)
npx get-shit-done-cc --global

# Install Mistral Vibe globally
npx get-shit-done-cc --vibe --global

# Install Claude locally
npx get-shit-done-cc --claude --local

# Install Vibe with custom directory
npx get-shit-done-cc --vibe --global --vibe-dir ~/.custom-vibe

# Using environment variables
VIBE_CONFIG_DIR=~/.custom-vibe npx get-shit-done-cc --vibe --global
```

### Backward Compatibility

The old installation methods continue to work:

```bash
# Old Claude installation (still works)
npx get-shit-done-cc --global

# Old Vibe installation (still works)
npx get-shit-done-cc --vibe --global
```

## Installation Locations

### Global Installation
- **Default**: `~/.vibe/`
- **Custom**: Specified via `--vibe-dir` or `VIBE_CONFIG_DIR`
- **Contents**:
  - `commands/gsd/` - TOML command files
  - `get-shit-done/` - GSD skills and references
  - `commands/gsd-md/` - Original MD commands (reference)

### Local Installation
- **Location**: `./.vibe/` in current project
- **Contents**: Same as global, but project-specific

## Directory Structure After Installation

```
.vibe/
├── commands/
│   ├── gsd/                  # TOML command files
│   │   ├── help.toml
│   │   ├── progress.toml
│   │   ├── new-project.toml
│   │   └── ... (all commands)
│   └── gsd-md/              # Original MD commands (reference)
│       ├── help.md
│       └── ... (all original commands)
└── get-shit-done/            # GSD skills and templates
    ├── references/
    ├── templates/
    └── workflows/
```

## Post-Installation Setup

### 1. Verify Installation

```bash
# Check installed files
ls ~/.vibe/commands/gsd/

# Should show all TOML files:
# help.toml, progress.toml, new-project.toml, etc.
```

### 2. Configure Mistral Vibe

Ensure your Mistral Vibe configuration points to the correct commands directory:

```yaml
# In your Mistral Vibe config
commands:
  paths:
    - ~/.vibe/commands
    - ./.vibe/commands
```

### 3. Test Commands

Launch Mistral Vibe and test the commands:

```
/gsd:help          # Show all available commands
/gsd:progress       # Check project status
```

## Uninstallation

### Global Uninstall

```bash
# Remove the .vibe directory
rm -rf ~/.vibe

# Or for custom location
rm -rf ~/.custom-vibe
```

### Local Uninstall

```bash
# Remove the local .vibe directory
rm -rf ./.vibe
```

## Troubleshooting

### Commands not found after installation?

1. **Verify installation location**:
   ```bash
   ls ~/.vibe/commands/gsd/help.toml
   ```

2. **Check Mistral Vibe config**:
   - Ensure commands path is correctly set
   - Restart Mistral Vibe to reload commands

3. **Reinstall**:
   ```bash
   rm -rf ~/.vibe
   npx get-shit-done-cc --vibe --global
   ```

### Path reference issues?

The installer automatically handles path replacements, but if you see path errors:

1. **Check path prefixes** in installed TOML files
2. **Verify environment variables** are set correctly
3. **Reinstall with explicit path**:
   ```bash
   npx get-shit-done-cc --vibe --global --vibe-dir ~/.vibe
   ```

## Updating

To update to the latest version:

```bash
# Remove old installation
rm -rf ~/.vibe

# Install latest version
npx get-shit-done-cc@latest --vibe --global
```

## Multiple Configurations

For multiple Mistral Vibe configurations (e.g., different projects):

```bash
# Install to project-specific location
VIBE_CONFIG_DIR=~/projects/myproject/.vibe npx get-shit-done-cc --vibe --global
```

## Command Reference

After installation, use `/gsd:help` in Mistral Vibe to see all available commands and usage.