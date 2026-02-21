---
name: pause-work
description: Create context handoff when pausing work mid-phase
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Pause Work Skill

## Objective

Create `.continue-here.md` handoff file to preserve complete work state across sessions.

Routes to the pause-work workflow which handles:
- Current phase detection from recent files
- Complete state gathering (position, completed work, remaining work, decisions, blockers)
- Handoff file creation with all context sections
- Git commit as WIP
- Resume instructions

## When to Use

📖 **Usage Guidelines**:
- When you need to pause work with full context and validation
- For integrating pause-work into automated workflows
- When manual intervention is required for complex scenarios

**Do NOT use when**:
- For simple pause-work operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. **Follow the pause-work workflow** from `@~/.vibe/get-shit-done/workflows/pause-work.md`.
3. The workflow handles all logic including:
4. 1. Phase directory detection
5. 2. State gathering with user clarifications
6. 3. Handoff file writing with timestamp
7. 4. Git commit
8. 5. Confirmation with resume instructions

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/pause-work/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] pause-work parameters validated successfully
- [ ] Workflow executed without critical errors
- [ ] All output files generated with correct permissions
- [ ] User notified of completion with clear status
- [ ] Audit logs contain complete execution details

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/pause-work.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/pause-work.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/pause-work.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance