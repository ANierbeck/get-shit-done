---
name: check-todos
description: List pending todos and select one to work on
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Check Todos Skill

## Objective

List all pending todos, allow selection, load full context for the selected todo, and route to appropriate action.

Routes to the check-todos workflow which handles:
- Todo counting and listing with area filtering
- Interactive selection with full context loading
- Roadmap correlation checking
- Action routing (work now, add to phase, brainstorm, create phase)
- STATE.md updates and git commits

## When to Use

📖 **Usage Guidelines**:
- When you need to check todos with full context and validation
- For integrating check-todos into automated workflows
- When manual intervention is required for complex scenarios

**Do NOT use when**:
- For simple check-todos operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. **Follow the check-todos workflow** from `@~/.vibe/get-shit-done/workflows/check-todos.md`.
3. The workflow handles all logic including:
4. 1. Todo existence checking
5. 2. Area filtering
6. 3. Interactive listing and selection
7. 4. Full context loading with file summaries
8. 5. Roadmap correlation checking
9. 6. Action offering and execution
10. 7. STATE.md updates
11. 8. Git commits

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/check-todos/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] check-todos parameters validated successfully
- [ ] Workflow executed without critical errors
- [ ] All output files generated with correct permissions
- [ ] User notified of completion with clear status
- [ ] Audit logs contain complete execution details

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/check-todos.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/check-todos.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/check-todos.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance