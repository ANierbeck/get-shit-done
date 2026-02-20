# Command to Skill Migration Guide

This guide explains how to use the migration script to convert GSD commands to the new skill format.

## Overview

The migration script automates the conversion of command files from `commands/gsd/` to skill format in `skills/gsd/<command-name>/`. This helps maintain consistency and reduces manual effort when creating new skills.

## Migration Script

The script is located at: `scripts/migrate_command_to_skill.py`

## Usage

### Migrate a Single Command

```bash
python3 scripts/migrate_command_to_skill.py commands/gsd/command-name.md
```

Example:
```bash
python3 scripts/migrate_command_to_skill.py commands/gsd/cleanup.md
```

### Migrate All Commands

```bash
python3 scripts/migrate_command_to_skill.py
```

This will process all commands in `commands/gsd/` and create corresponding skills in `skills/gsd/` for any commands that don't already have skills.

### Custom Paths

You can specify custom source and destination directories:

```bash
python3 scripts/migrate_command_to_skill.py /path/to/commands /path/to/skills
```

## What the Script Does

1. **Parses Command Files**: Extracts YAML frontmatter and XML sections from command files
2. **Creates Skill Structure**: Creates a directory structure in `skills/gsd/<command-name>/`
3. **Generates SKILL.md**: Creates a comprehensive skill file with:
   - Proper YAML frontmatter (name, description, license, metadata)
   - Objective section (from command objective)
   - Files Modified section (from execution context)
   - When to Use / Anti-Patterns sections (placeholders)
   - Process section (from command process)
   - Output, Success Criteria, Examples, and Error Handling sections (placeholders)
4. **Handles Tool Mapping**: Automatically maps commands to appropriate gsd-tools categories

## Migration Process Details

### Command to Skill Conversion

The script converts the command format:

```yaml
---
name: gsd:command-name
description: Command description
allowed-tools:
  - Tool1
  - Tool2
---

<objective>
Command objective
</objective>

<execution_context>
@~/path/to/workflow.md
</execution_context>

<context>
Command context
</context>

<process>
Command process steps
</process>
```

To the skill format:

```yaml
---
name: command-name
description: 'Command description'
license: MIT
metadata:
  author: get-shit-done
  version: "1.0"
  category: project-management
  gsd-tools: appropriate-tools-for-command
allowed-tools: Tool1 Tool2
---

# Command Name Skill

## Objective

Command objective (cleaned up)

## Files Modified

- `.planning/workflows/workflow.md` — [TODO: Add description]

## When to Use

- [TODO: Add when to use this skill]

**Do NOT use when:**
- [TODO: Add anti-patterns]

## Process

Command process steps (cleaned up and formatted)

## Output

- [TODO: Describe outputs of this skill]

... (additional sections with placeholders)
```

## Post-Migration Steps

After running the migration script, you should:

1. **Review Generated Skills**: Check the created skills in `skills/gsd/`
2. **Complete TODO Items**: Fill in the placeholder sections:
   - When to Use / Anti-Patterns
   - Output descriptions
   - Success Criteria
   - Examples
   - Error Handling details
3. **Test Skills**: Verify the skills work as expected
4. **Run Validation**: Use the existing validation scripts to check for issues
5. **Update Documentation**: Add any missing documentation

## Existing Helper Scripts

The repository includes additional scripts that can help with skill management:

- `skills/fix_skills.py`: Automatically fixes common validation issues
- `skills/update_skills_for_gsd_tools.py`: Updates skills for gsd-tools integration
- `skills/validate_skills.py`: Validates skill structure and content

## Example Workflow

1. **Migrate new commands**:
   ```bash
   python3 scripts/migrate_command_to_skill.py
   ```

2. **Fix any issues**:
   ```bash
   python3 skills/fix_skills.py skills/gsd/
   ```

3. **Update for gsd-tools**:
   ```bash
   python3 skills/update_skills_for_gsd_tools.py
   ```

4. **Validate all skills**:
   ```bash
   python3 skills/validate_skills.py
   ```

## Troubleshooting

### Common Issues

- **Skill already exists**: The script skips commands that already have corresponding skills
- **YAML parsing errors**: Check the command file has valid YAML frontmatter
- **Missing sections**: Some commands may not have all XML sections (objective, process, etc.)

### Debugging

Run the script with verbose output to see detailed processing:
```bash
python3 -v scripts/migrate_command_to_skill.py commands/gsd/specific-command.md
```

## Limitations

The current migration script:
- Creates placeholder sections that need manual completion
- Doesn't handle all possible command variations
- May need adjustments for complex commands
- Doesn't migrate workflow files (only command definitions)

## Future Enhancements

Potential improvements to the migration script:
- Better handling of complex process steps
- Automatic generation of examples based on command usage
- Integration with workflow migration
- More sophisticated tool mapping
- Validation of generated skills

## Support

For issues with the migration script:
1. Check the script's error messages
2. Review the generated skill files manually
3. Consult existing skills for reference
4. Update the script as needed for your specific use case