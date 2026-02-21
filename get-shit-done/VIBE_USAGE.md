# Get-Shit-Done Framework for Mistral Vibe

## 🎉 Installation Complete!

Your Get-Shit-Done framework is now fully installed and configured for Mistral Vibe.

## 🚀 Using GSD Skills

### Basic Usage

```bash
# Execute a specific skill
vibe execute ~/.vibe/skills/gsd/research-phase/SKILL.md

# List all available skills
ls ~/.vibe/skills/gsd/

# Get help with a skill
vibe execute ~/.vibe/skills/gsd/help/SKILL.md
```

### Available Skills (30 Total)

#### Phase Management
- `add-phase` - Add a new phase to your roadmap
- `remove-phase` - Remove a phase from your roadmap
- `insert-phase` - Insert a phase at a specific position
- `list-phase-assumptions` - List assumptions for a phase
- `research-phase` - Research how to implement a phase
- `plan-phase` - Create a detailed phase plan
- `execute-phase` - Execute a planned phase
- `discuss-phase` - Discuss phase details interactively

#### Todo Management
- `add-todo` - Add a todo item
- `check-todos` - Check todo list status
- `complete-milestone` - Complete a milestone

#### Project Management
- `new-project` - Create a new project
- `new-milestone` - Create a new milestone
- `plan-milestone-gaps` - Plan milestone gaps
- `audit-milestone` - Audit milestone completion
- `verify-work` - Verify work quality

#### Codebase Operations
- `map-codebase` - Map your codebase structure
- `cleanup` - Clean up project files
- `health` - Check project health

#### System Operations
- `debug` - Debug issues
- `pause-work` - Pause current work
- `resume-work` - Resume paused work
- `progress` - Check progress status
- `settings` - Manage settings
- `update` - Update GSD framework
- `reapply-patches` - Reapply local patches

#### Utility
- `help` - Get help with GSD
- `quick` - Quick operations
- `join-discord` - Join GSD community

## 📋 Skill Structure

Each skill follows this structure:

```markdown
---
name: skill-name
description: What the skill does
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---

# Skill Name

## Objective
What the skill accomplishes

## When to Use
- Usage guidelines
- Anti-patterns

## Process
Step-by-step execution

## Output
What the skill produces

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Examples
### Example 1: Basic usage
```bash
vibe execute ~/.vibe/skills/gsd/skill-name/SKILL.md
```
```

## 🎯 Common Workflows

### Research → Plan → Execute
```bash
# 1. Research phase implementation
vibe execute ~/.vibe/skills/gsd/research-phase/SKILL.md --phase "auth-system"

# 2. Plan the phase
vibe execute ~/.vibe/skills/gsd/plan-phase/SKILL.md --phase "auth-system"

# 3. Execute the plan
vibe execute ~/.vibe/skills/gsd/execute-phase/SKILL.md --phase "auth-system"
```

### Todo Management
```bash
# Add a todo
vibe execute ~/.vibe/skills/gsd/add-todo/SKILL.md --todo "Implement JWT authentication"

# Check todos
vibe execute ~/.vibe/skills/gsd/check-todos/SKILL.md
```

## 🔧 Configuration

Your configuration is set up in `~/.vibe/config.toml`:

```toml
# Skills are enabled from this path
skill_paths = [
    "~/.vibe/skills/gsd/*/SKILL.md"
]

# Required tools are enabled
enabled_tools = [
    "read_file",
    "write_file", 
    "run_shell_command",
    "ask_user_question"
]
```

## 📁 File Structure

```
~/.vibe/
├── skills/gsd/
│   ├── add-phase/
│   │   └── SKILL.md
│   ├── add-todo/
│   │   └── SKILL.md
│   ├── ... (30 skills)
│   └── verify-work/
│       └── SKILL.md
├── workflows/
│   ├── add-phase.md
│   ├── add-todo.md
│   └── ... (32 workflows)
├── get-shit-done/
│   ├── VERSION
│   ├── CHANGELOG.md
│   └── VIBE_USAGE.md
├── hooks/
│   ├── gsd-statusline.js
│   └── gsd-check-update.js
└── config.toml
```

## 🎓 Learning Resources

### Skill Quality Standards
- **A+ Quality**: All 30 skills meet A+ standards
- **Comprehensive Examples**: 3 examples per skill
- **Usage Guidelines**: Clear when to use each skill
- **Anti-Patterns**: When NOT to use each skill
- **Success Criteria**: Measurable outcomes

### Best Practices
1. **Start with research**: Use `research-phase` before planning
2. **Use workflows**: Follow the Research → Plan → Execute pattern
3. **Check progress**: Use `progress` and `check-todos` regularly
4. **Verify work**: Use `verify-work` before completing milestones

## 🆘 Troubleshooting

### Skills not found
```bash
# Verify skills are in the correct location
ls ~/.vibe/skills/gsd/

# Check config.toml has the right path
grep skill_paths ~/.vibe/config.toml
```

### Permission issues
```bash
# Ensure required tools are enabled
grep enabled_tools ~/.vibe/config.toml

# Check tool permissions
vibe tool list
```

### Skill execution errors
```bash
# Check the skill's YAML frontmatter
head -15 ~/.vibe/skills/gsd/skill-name/SKILL.md

# Validate YAML syntax
vibe validate ~/.vibe/skills/gsd/skill-name/SKILL.md
```

## 🤝 Community

Join the GSD community:
- **Discord**: https://discord.gg/5JJgD5svVS
- **GitHub**: https://github.com/get-shit-done/get-shit-done
- **Documentation**: https://get-shit-done.github.io/

## 📈 Performance Tips

1. **Use specific skills**: Choose the most specific skill for your task
2. **Follow workflows**: Use the recommended workflow patterns
3. **Check examples**: Review skill examples before execution
4. **Monitor progress**: Use progress tracking skills regularly

## 🎉 Success!

You're now ready to use the full Get-Shit-Done framework with Mistral Vibe!

**Happy coding!** 🚀