# Command to Skill Migration for Mistral Vibe

## Purpose

This script converts Get Shit Done (GSD) command files from the Claude format to Mistral Vibe skill format. The migration is necessary because Mistral Vibe only supports skills, not commands.

## Key Differences

### Path Structure
- **Claude commands**: Use `@~/.claude/get-shit-done/workflows/` paths
- **Mistral Vibe skills**: Use `~/.vibe/get-shit-done/workflows/` paths

### File Structure
- **Commands**: Located in `commands/gsd/` directory
- **Skills**: Located in `skills/gsd/<skill-name>/SKILL.md`

## Migration Process

The script performs the following transformations:

1. **Path Conversion**: Converts all workflow references from Claude format to Mistral Vibe format
2. **Content Cleanup**: Removes Claude-specific references and replaces them with agent-agnostic terms
3. **Structure Conversion**: Converts YAML frontmatter + XML format to pure YAML frontmatter + Markdown
4. **Tool Mapping**: Maps Claude tools to Mistral Vibe compatible tools

## Usage

### Migrate all commands
```bash
python3 scripts/migrate_command_to_skill.py
```

### Migrate a specific command
```bash
python3 scripts/migrate_command_to_skill.py commands/gsd/help.md
```

### Migrate commands from custom directories
```bash
python3 scripts/migrate_command_to_skill.py /path/to/commands /path/to/output/skills
```

## Important Notes

1. **Always use Mistral Vibe paths**: The script always generates skills with `~/.vibe/get-shit-done/workflows/` paths, regardless of environment variables.

2. **Workflow files required**: The generated skills reference workflow files that must be available at runtime in the `~/.vibe/get-shit-done/workflows/` directory.

3. **Dynamic loading**: Workflows are loaded dynamically when skills are executed by Mistral Vibe.

4. **Regular updates**: Run this script whenever command files are updated to keep skills in sync.

## File Structure After Migration

```
skills/
└── gsd/
    ├── help/
    │   └── SKILL.md          # References ~/.vibe/get-shit-done/workflows/help.md
    ├── execute-phase/
    │   └── SKILL.md          # References ~/.vibe/get-shit-done/workflows/execute-phase.md
    ├── new-project/
    │   └── SKILL.md          # References ~/.vibe/get-shit-done/workflows/new-project.md
    └── ... (other skills)
```

## Verification

After migration, verify that:
1. All skills reference `~/.vibe/get-shit-done/workflows/` paths
2. No skills reference the old `.planning/workflows/` or `.claude/` paths
3. All 30 commands have been successfully converted to skills

## Maintenance

This script should be run whenever:
- New commands are added to the GSD project
- Existing commands are updated
- The GSD project releases a new version

The migration ensures that Mistral Vibe users have access to the latest GSD functionality through the skill interface.