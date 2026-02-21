---
name: add-todo
description: Capture idea or task as todo from current conversation context
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Add Todo Skill

## Objective

Capture an idea, task, or issue that surfaces during a GSD session as a structured todo for later work.

Routes to the add-todo workflow which handles:
- Directory structure creation
- Content extraction from arguments or conversation
- Area inference from file paths
- Duplicate detection and resolution
- Todo file creation with frontmatter
- STATE.md updates
- Git commits

## When to Use

📖 **Usage Guidelines**:
- When you need to add todo with full context and validation
- For integrating add-todo into automated workflows
- When manual intervention is required for complex scenarios

**Do NOT use when**:
- For simple add-todo operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. **Follow the add-todo workflow** from `@~/.vibe/get-shit-done/workflows/add-todo.md`.
3. The workflow handles all logic including:
4. 1. Directory ensuring
5. 2. Existing area checking
6. 3. Content extraction (arguments or conversation)
7. 4. Area inference
8. 5. Duplicate checking
9. 6. File creation with slug generation
10. 7. STATE.md updates
11. 8. Git commits

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/add-todo/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] add-todo parameters validated successfully
- [ ] Workflow executed without critical errors
- [ ] All output files generated with correct permissions
- [ ] User notified of completion with clear status
- [ ] Audit logs contain complete execution details

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/add-todo.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/add-todo.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/add-todo.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance