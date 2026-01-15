# Get Shit Done for Mistral Vibe

This directory contains TOML command definitions for Get Shit Done that are compatible with Mistral Vibe.

## Structure

- `*.toml` files: Individual command definitions
- `config.toml`: Command configuration and metadata
- `reference-map.yaml`: Mapping between MD sources and TOML targets

## How It Works

1. **Reference System**: Each TOML command references the original GSD MD files
2. **Type Classification**: Commands are categorized for easier maintenance
3. **Context Mapping**: Proper context files are referenced for each command
4. **Tool Specification**: Exact tools required for execution are specified

## Command Types

- **reference**: Simple information display (e.g., help)
- **workflow**: Follow GSD workflows (e.g., progress)
- **interactive_workflow**: User interaction required (e.g., new-project)
- **complex_workflow**: Multi-step processes (e.g., plan-phase)
- **execution_workflow**: Task execution (e.g., execute-plan)
- **utility**: Helper functions (e.g., add-todo)
- **interactive_utility**: Interactive helpers (e.g., debug)

## Maintenance

To update commands when GSD MD files change:
1. Update the referenced MD files in `commands/gsd/` or `get-shit-done/`
2. The TOML commands will automatically use the updated content
3. For major changes, update the TOML prompt sections as needed

## Installation

Copy or symlink this directory to your Mistral Vibe commands directory.