---
name: join-discord
description: Join the GSD Discord community
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Join Discord Skill

## Objective

Display the Discord invite link for the GSD community server.

## When to Use

📖 **Usage Guidelines**:
- When you need to join discord with full context and validation
- For integrating join-discord into automated workflows
- When manual intervention is required for complex scenarios

**Do NOT use when**:
- For simple join-discord operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

1. Validate join-discord parameters and context
2. Execute join-discord workflow from ~/.vibe/get-shit-done/workflows/join-discord.md
3. Handle errors and edge cases gracefully
4. Generate comprehensive output and logs
5. Notify user of completion status

## Output

- # Join the GSD Discord
- Connect with other GSD users, get help, share what you're building, and stay updated.
- **Invite link:** https://discord.gg/5JJgD5svVS
- Click the link or paste it into your browser to join.

## Success Criteria

- [ ] join-discord parameters validated successfully
- [ ] Workflow executed without critical errors
- [ ] All output files generated with correct permissions
- [ ] User notified of completion with clear status
- [ ] Audit logs contain complete execution details

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/join-discord.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/join-discord.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/join-discord.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance