---
name: resume-work
description: Resume work from previous session with full context restoration
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Resume Work Skill

## Objective

Restore complete project context and resume work seamlessly from previous session.

Routes to the resume-project workflow which handles:

- STATE.md loading (or reconstruction if missing)
- Checkpoint detection (.continue-here files)
- Incomplete work detection (PLAN without SUMMARY)
- Status presentation
- Context-aware next action routing

## When to Use

📖 **Usage Guidelines**:
- When you need to resume work with full context and validation
- For integrating resume-work into automated workflows
- When manual intervention is required for complex scenarios

**Do NOT use when**:
- For simple resume-work operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. **Follow the resume-project workflow** from `@~/.vibe/get-shit-done/workflows/resume-project.md`.
3. The workflow handles all resumption logic including:
5. 1. Project existence verification
6. 2. STATE.md loading or reconstruction
7. 3. Checkpoint and incomplete work detection
8. 4. Visual status presentation
9. 5. Context-aware option offering (checks CONTEXT.md before suggesting plan vs discuss)
10. 6. Routing to appropriate next command
11. 7. Session continuity updates

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/resume-work/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] resume-work parameters validated successfully
- [ ] Workflow executed without critical errors
- [ ] All output files generated with correct permissions
- [ ] User notified of completion with clear status
- [ ] Audit logs contain complete execution details

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/resume-work.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/resume-work.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/resume-work.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance