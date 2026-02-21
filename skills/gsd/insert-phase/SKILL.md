---
name: insert-phase
description: Insert urgent work as decimal phase (e.g., 72.1) between existing phases
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Insert Phase Skill

## Objective

Insert a decimal phase for urgent work discovered mid-milestone that must be completed between existing integer phases.

Uses decimal numbering (72.1, 72.2, etc.) to preserve the logical sequence of planned phases while accommodating urgent insertions.

Purpose: Handle urgent work discovered during execution without renumbering entire roadmap.

## When to Use

📖 **Usage Guidelines**:
- Handle urgent work discovered during execution without renumbering entire roadmap.

**Do NOT use when**:
- For simple insert-phase operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. Execute the insert-phase workflow from @~/.vibe/get-shit-done/workflows/insert-phase.md end-to-end.
2. Preserve all validation gates (argument parsing, phase verification, decimal calculation, roadmap updates).

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/insert-phase/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] insert-phase parameters validated successfully
- [ ] Workflow executed without critical errors
- [ ] All output files generated with correct permissions
- [ ] User notified of completion with clear status
- [ ] Audit logs contain complete execution details

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/insert-phase.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/insert-phase.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/insert-phase.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance