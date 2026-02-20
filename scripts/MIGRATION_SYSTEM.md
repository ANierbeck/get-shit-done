# Get Shit Done Command to Skill Migration System

This directory contains tools for migrating GSD commands to the new skill format and testing their functionality.

## 🚀 Migration System Overview

The migration system provides a complete workflow for converting existing GSD commands to the new skill format while ensuring they remain functional and compatible with the Mistral-Vibe environment.

## 📁 Files

### `migrate_command_to_skill.py`
The main migration script that converts command files to skill format.

**Features:**
- Parses command YAML frontmatter and XML sections
- Generates comprehensive skill structure with proper metadata
- Handles tool mapping and Claude-to-Agent compatibility
- Creates placeholder sections for manual completion
- Supports both single command and batch migration

### `test_skill_functionality.py`
Functionality testing framework for migrated skills.

**Tests:**
- YAML frontmatter validation
- Skill structure and required sections
- Allowed tools validation
- Mistral-Vibe environment compatibility
- Claude-specific reference detection

### `MIGRATION_SYSTEM.md`
This documentation file.

## 🎯 Migration Workflow

### 1. Single Command Migration

```bash
# Migrate a single command
python3 scripts/migrate_command_to_skill.py commands/gsd/command-name.md

# Migrate to custom destination
python3 scripts/migrate_command_to_skill.py commands/gsd/command-name.md skills/gsd/custom-destination/
```

### 2. Batch Migration

```bash
# Migrate all commands
python3 scripts/migrate_command_to_skill.py

# Migrate with custom paths
python3 scripts/migrate_command_to_skill.py commands/gsd/ skills/gsd/
```

### 3. Functionality Testing

```bash
# Test all skills
python3 scripts/test_skill_functionality.py

# Test specific skills directory
python3 scripts/test_skill_functionality.py skills/gsd/test-migration/
```

### 4. Complete Workflow Example

```bash
# 1. Create test directory
mkdir -p skills/gsd/test-migration

# 2. Migrate specific commands
python3 -c "
from scripts.migrate_command_to_skill import migrate_command_to_skill
from pathlib import Path
commands = ['add-todo', 'check-todos', 'add-phase']
for cmd in commands:
    migrate_command_to_skill(Path(f'commands/gsd/{cmd}.md'), Path('skills/gsd/test-migration'))
"

# 3. Test migrated skills
python3 scripts/test_skill_functionality.py skills/gsd/test-migration/

# 4. Review and manually complete TODO sections
# 5. Move to production when ready
mv skills/gsd/test-migration/* skills/gsd/
```

## 🔧 Migration Process Details

### What Gets Migrated

| Command Element | Skill Equivalent |
|----------------|------------------|
| YAML frontmatter | Enhanced YAML with metadata |
| `<objective>` | Objective section |
| `<execution_context>` | Files Modified section |
| `<context>` | Context information |
| `<process>` | Process section with steps |
| Command name | Skill name (without gsd: prefix) |
| Description | Preserved description |
| Allowed tools | Converted to space-separated format |

### What Gets Added

| Skill Section | Purpose |
|---------------|---------|
| **When to Use** | Usage guidelines and anti-patterns |
| **Output** | Description of skill outputs |
| **Success Criteria** | Checklist for successful execution |
| **Examples** | Usage examples with input/output |
| **Error Handling** | Common error conditions |
| **Metadata** | Author, version, category, gsd-tools |

### Tool Mapping

The system automatically maps commands to appropriate gsd-tools categories:

| Command Type | gsd-tools Mapping |
|--------------|-------------------|
| Phase management | phase-management, roadmap-updates |
| Todo management | todo-management, state-tracking |
| Project setup | project-initialization, configuration |
| Execution | plan-execution, task-management |
| Debugging | error-analysis, state-diagnosis |
| Default | core-operations, state-management |

## 🧪 Testing Framework

### Test Categories

1. **YAML Frontmatter Validation**
   - Checks for required fields: name, description, license, metadata, allowed-tools
   - Validates metadata structure
   - Ensures proper YAML syntax

2. **Skill Structure Validation**
   - Verifies required sections exist
   - Checks section formatting
   - Validates markdown structure
   - Handles TODO placeholders appropriately

3. **Allowed Tools Validation**
   - Validates tool names against known tools
   - Checks tool format (space-separated string)
   - Ensures non-empty tool lists

4. **Compatibility Testing**
   - Detects Claude-specific references
   - Checks for Mistral-Vibe compatibility
   - Validates tool usage patterns
   - Ensures agent-neutral terminology

### Test Results Interpretation

- **✅ PASS**: Skill is structurally sound and compatible
- **⚠️ WARNING**: Skill has issues but may still be functional
- **❌ FAIL**: Skill has critical issues requiring attention

## 🛠️ Post-Migration Steps

### 1. Review Generated Skills
```bash
# List migrated skills
ls -la skills/gsd/test-migration/

# Examine specific skill
cat skills/gsd/test-migration/skill-name/SKILL.md
```

### 2. Complete TODO Sections
Each migrated skill contains placeholder sections that need manual completion:

- **When to Use**: Add specific usage scenarios
- **Do NOT use when**: Add anti-patterns
- **Output**: Describe expected outputs
- **Success Criteria**: Add completion checklist
- **Examples**: Provide 2-3 usage examples
- **Error Handling**: Document common issues

### 3. Test Skill Functionality
```bash
# Run functionality tests
python3 scripts/test_skill_functionality.py skills/gsd/test-migration/

# Fix any reported issues
```

### 4. Validate with Existing Tools
```bash
# Use existing validation scripts
python3 skills/fix_skills.py skills/gsd/test-migration/
python3 skills/validate_skills.py
```

### 5. Manual Testing
- Test skill execution in target environment
- Verify tool calling works correctly
- Check state management and file operations
- Validate error handling

## 🔄 Migration Best Practices

### Do's
- ✅ Test migration on a small subset first
- ✅ Review generated skills before production use
- ✅ Complete TODO sections thoroughly
- ✅ Test in target environment (Mistral-Vibe)
- ✅ Validate tool functionality
- ✅ Update documentation

### Don'ts
- ❌ Migrate all commands without testing
- ❌ Use migrated skills without completing TODOs
- ❌ Assume all commands migrate perfectly
- ❌ Skip functionality testing
- ❌ Ignore compatibility warnings

## 🚫 Known Limitations

1. **TODO Placeholders**: Migrated skills require manual completion
2. **Complex Commands**: Some complex logic may need adjustment
3. **Workflow References**: Workflow-based commands need manual review
4. **Tool Variations**: Some tool formats may need manual fixing
5. **Environment Differences**: Claude-specific features may need adaptation

## 🔮 Future Enhancements

Potential improvements to the migration system:

1. **Automatic Example Generation**: Create examples from command usage
2. **Workflow Migration**: Migrate workflow files alongside commands
3. **Interactive Migration**: CLI interface for guided migration
4. **Validation Integration**: Built-in validation during migration
5. **Diff Preview**: Show changes before applying migration
6. **Batch Processing**: Better progress tracking for large migrations
7. **Error Recovery**: Handle migration failures gracefully

## 📚 Examples

### Example 1: Simple Migration
```bash
# Migrate a single command
python3 scripts/migrate_command_to_skill.py commands/gsd/cleanup.md

# Test the result
python3 scripts/test_skill_functionality.py skills/gsd/cleanup/
```

### Example 2: Batch Migration with Testing
```bash
# Migrate multiple commands
mkdir -p skills/gsd/new-skills
python3 -c "
from scripts.migrate_command_to_skill import migrate_command_to_skill
from pathlib import Path
commands = ['add-phase', 'add-todo', 'check-todos']
for cmd in commands:
    migrate_command_to_skill(Path(f'commands/gsd/{cmd}.md'), Path('skills/gsd/new-skills'))
"

# Test all migrated skills
python3 scripts/test_skill_functionality.py skills/gsd/new-skills/
```

### Example 3: Migration with Custom Tools
```bash
# Migrate with specific tool handling
python3 -c "
from scripts.migrate_command_to_skill import migrate_command_to_skill
from pathlib import Path

# Custom migration with tool adjustments
command_path = Path('commands/gsd/special-command.md')
skill_dir = Path('skills/gsd/custom/')

# Migrate
if migrate_command_to_skill(command_path, skill_dir):
    # Post-process: adjust tools if needed
    skill_file = skill_dir / 'special-command' / 'SKILL.md'
    # ... manual adjustments ...
"
```

## 🎓 Migration Tips

### Handling Complex Commands
For commands with complex workflow references:
1. Review the original workflow file
2. Extract key logic to the skill
3. Update process steps accordingly
4. Test thoroughly

### Tool Compatibility
If tools don't work as expected:
1. Check tool names in allowed-tools
2. Verify tool usage patterns
3. Test individual tool calls
4. Adjust as needed for target environment

### Environment Adaptation
For Claude-to-Mistral-Vibe adaptation:
1. Replace Claude-specific terminology
2. Adjust tool usage patterns
3. Update examples and documentation
4. Test in target environment

## 📋 Migration Checklist

- [ ] Set up clean migration environment
- [ ] Test migration on sample commands
- [ ] Review generated skill structure
- [ ] Complete TODO sections
- [ ] Run functionality tests
- [ ] Fix any reported issues
- [ ] Test in target environment
- [ ] Validate tool functionality
- [ ] Update documentation
- [ ] Move to production

## 🔗 Integration with Existing Tools

The migration system integrates with existing GSD tools:

- **fix_skills.py**: Automatically fixes common issues
- **validate_skills.py**: Validates skill structure
- **update_skills_for_gsd_tools.py**: Updates for gsd-tools integration

Recommended workflow:
```bash
# 1. Migrate
python3 scripts/migrate_command_to_skill.py

# 2. Fix issues
python3 skills/fix_skills.py skills/gsd/

# 3. Update for gsd-tools
python3 skills/update_skills_for_gsd_tools.py

# 4. Validate
python3 skills/validate_skills.py

# 5. Test functionality
python3 scripts/test_skill_functionality.py
```

## 📈 Performance Considerations

- **Batch Processing**: For large migrations, process in batches
- **Memory Usage**: Migration is memory-efficient for typical command sizes
- **Error Handling**: Scripts handle errors gracefully
- **Progress Tracking**: Clear output shows migration progress

## 🛡️ Safety Features

- **Non-destructive**: Original commands are never modified
- **Duplicate Detection**: Skips existing skills
- **Error Recovery**: Continues on errors, reports issues
- **Validation**: Built-in checks for common problems

## 📖 Glossary

- **Command**: Original GSD command format with YAML + XML
- **Skill**: New GSD skill format with enhanced structure
- **Migration**: Process of converting commands to skills
- **TODO Placeholder**: Section needing manual completion
- **gsd-tools**: Tool categories for skill classification
- **Mistral-Vibe**: Target execution environment

## 🤝 Support

For issues with the migration system:
1. Check error messages and logs
2. Review generated skills manually
3. Consult this documentation
4. Test in isolation
5. Update scripts as needed for your environment