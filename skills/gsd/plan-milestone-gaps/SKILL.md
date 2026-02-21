---
name: plan-milestone-gaps
description: Create phases to close all gaps identified by milestone audit
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Plan Milestone Gaps Skill

## Objective

Create all phases necessary to close gaps identified by `/gsd:audit-milestone`.

Reads MILESTONE-AUDIT.md, groups gaps into logical phases, creates phase entries in ROADMAP.md, and offers to plan each phase.

One command creates all fix phases — no manual `/gsd:add-phase` per gap.

## When to Use

📖 **Usage Guidelines**:
- When you need to plan milestone gaps with full context and validation
- For integrating plan-milestone-gaps into automated workflows
- When manual intervention is required for complex scenarios

**Do NOT use when**:
- For simple plan-milestone-gaps operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. Execute the plan-milestone-gaps workflow from @~/.vibe/get-shit-done/workflows/plan-milestone-gaps.md end-to-end.
2. Preserve all workflow gates (audit loading, prioritization, phase grouping, user confirmation, roadmap updates).

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/plan-milestone-gaps/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] plan-milestone-gaps parameters validated successfully
- [ ] Workflow executed without critical errors
- [ ] All output files generated with correct permissions
- [ ] User notified of completion with clear status
- [ ] Audit logs contain complete execution details

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/plan-milestone-gaps.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/plan-milestone-gaps.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/plan-milestone-gaps.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance