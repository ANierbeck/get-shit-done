# Get Shit Done - Agent Skills

This directory contains Agent Skills for Get Shit Done, following the [Agent Skills specification](https://agentskills.io/specification).

## Structure

```
skills/
├── gsd/                          # GSD skills namespace
│   ├── gsd-help/                 # Individual skill
│   │   └── SKILL.md             # Skill definition
│   ├── gsd-progress/             # Another skill
│   │   └── SKILL.md             # Skill definition
│   └── ...                       # More skills
├── validate_skills.py           # Skill validation script
└── README.md                     # This file
```

## Skill Format

Each skill follows the Agent Skills specification:

### SKILL.md Structure

```yaml
---
name: skill-name                # Required: 1-64 chars, lowercase alphanumeric + hyphens
description: What the skill does and when to use it  # Required: 1-1024 chars
license: MIT                    # Optional: License information
compatibility: Environment requirements  # Optional: Max 500 chars
metadata:                       # Optional: Key-value pairs
  author: Get Shit Done
  version: "1.0"
  command_type: reference
---

# Skill Documentation

## Purpose
What this skill accomplishes

## When to Use
- Situations where this skill should be activated
- User intent patterns

## How to Use
Step-by-step instructions for the agent

## Examples
Usage examples and expected outputs

## Tools Required
- List of tools this skill needs

## Context Files
- Files this skill reads or references
```

## Validation

Validate skills using the provided script:

```bash
# Validate a single skill
python3 validate_skills.py gsd/gsd-help

# Validate all skills in a directory
python3 validate_skills.py gsd/

# Validate multiple specific skills
python3 validate_skills.py gsd/gsd-help gsd/gsd-progress
```

## Skill Development

### Creating a New Skill

1. **Create skill directory**:
   ```bash
   mkdir -p skills/gsd/new-skill-name
   ```

2. **Create SKILL.md** with proper frontmatter and documentation

3. **Validate the skill**:
   ```bash
   python3 validate_skills.py skills/gsd/new-skill-name
   ```

4. **Test the skill** in your agent environment

### Skill Naming Convention

- Use lowercase alphanumeric characters and hyphens only
- Prefix with namespace (e.g., `gsd-` for Get Shit Done skills)
- Keep names descriptive but concise
- Maximum 64 characters

### Best Practices

1. **Clear descriptions**: Include both what the skill does AND when to use it
2. **Specific examples**: Provide concrete usage examples
3. **Error handling**: Document how to handle missing files or errors
4. **Tool specification**: List all required tools
5. **Context files**: Document all files the skill reads or references

## Integration with Get Shit Done

### Current Skills

- **gsd-help**: Displays command reference and usage guide
- **gsd-progress**: Checks and reports project status and progress

### Migration Plan

The existing TOML-based command system will be gradually migrated to Agent Skills:

1. **Phase 1**: Create Agent Skills alongside existing TOML commands
2. **Phase 2**: Test and validate new skills
3. **Phase 3**: Update installation process to support both systems
4. **Phase 4**: Gradually migrate all commands to skills
5. **Phase 5**: Deprecate TOML commands in favor of skills

### Compatibility

During the transition period, both systems will coexist:
- TOML commands: `vibe-commands/gsd/*.toml`
- Agent Skills: `skills/gsd/*/SKILL.md`

## Agent Skills Specification Compliance

This implementation follows the [Agent Skills specification](https://agentskills.io/specification):

✅ **Directory structure**: Each skill in its own directory with SKILL.md
✅ **YAML frontmatter**: Required fields (name, description) + optional fields
✅ **Field validation**: Name format, description length, etc.
✅ **Progressive disclosure**: Metadata loaded first, full content on demand
✅ **Validation system**: Comprehensive validation script

## Future Enhancements

- **Skill discovery**: Automatic skill registration with agents
- **Skill dependencies**: Support for skill prerequisites
- **Skill versioning**: Version management and updates
- **Skill marketplace**: Share and discover skills
- **Performance optimization**: Caching and lazy loading

## License

All skills are licensed under the MIT License unless otherwise specified.