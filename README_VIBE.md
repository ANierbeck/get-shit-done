# Get Shit Done for Mistral Vibe

## 🚀 Quick Start

```bash
# Install GSD skills for Mistral Vibe
npx get-shit-done-vibe --global

# Launch Vibe and use skills
vibe
```

## 📋 Features

- **30 A+ Quality Skills**: Enhanced skills for Mistral Vibe
- **Native Integration**: Uses Vibe's skill system
- **Pattern Matching**: `gsd-*` enables all skills
- **Automatic Indexing**: Fast skill discovery

## 🎯 Skills Available

### Phase Management
- `add-phase`, `remove-phase`, `research-phase`
- `plan-phase`, `execute-phase`, `discuss-phase`

### Todo Management
- `add-todo`, `check-todos`, `complete-milestone`

### Project Management
- `new-project`, `new-milestone`, `plan-milestone-gaps`
- `audit-milestone`, `verify-work`

### Codebase Operations
- `map-codebase`, `cleanup`, `health`

### System Operations
- `debug`, `pause-work`, `resume-work`, `progress`
- `settings`, `update`, `reapply-patches`

### Utility
- `help`, `quick`, `join-discord`

## 🔧 Configuration

```toml
# ~/.vibe/config.toml
skill_paths = [
    "~/.vibe/skills/"
]

# Enable GSD skills using pattern matching
enabled_skills = ["gsd-*"]

[skill_indexing]
enabled = true
index_on_startup = true
auto_update = true
```

## 🎓 Usage Examples

### Basic Execution
```bash
vibe execute ~/.vibe/skills/gsd/help/SKILL.md
```

### With Agent
```bash
vibe -p "Show me the help documentation" --agent help
```

### Shortcut
```bash
/gsd:help
```

## 🎯 Migration from Claude

GSD was originally designed for Claude but has been fully migrated to Mistral Vibe:

**Changes Made:**
- Skills replace commands (more structured)
- Native Vibe integration (no Claude dependencies)
- Pattern matching for skill enabling

**Benefits:**
- Better performance with Vibe
- Native skill system integration
- Future-proof architecture

## 🤝 Community

Join the GSD community:
- **Discord**: https://discord.gg/5JJgD5svVS
- **GitHub**: https://github.com/get-shit-done/get-shit-done

## 📈 Performance

- **30 Skills**: All at A+ quality
- **Fast Indexing**: Auto-updated on startup
- **Pattern Matching**: Flexible skill enabling

## 🎉 Success!

The Get-Shit-Done framework is now fully operational with Mistral Vibe! 🚀