---
name: list-phase-assumptions
description: Surface Agent's assumptions about a phase approach before planning
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# List Phase Assumptions Skill

## Objective

Analyze a phase and present Agent's assumptions about technical approach, implementation order, scope boundaries, risk areas, and dependencies.

Purpose: Help users see what Agent thinks BEFORE planning begins - enabling course correction early when assumptions are wrong.
Output: Conversational output only (no file creation) - ends with "What do you think?" prompt

## When to Use

📖 **Usage Guidelines**:
- Help users see what Claude thinks BEFORE planning begins - enabling course correction early when assumptions are wrong.
- Output: Conversational output only (no file creation) - ends with "What do you think?" prompt
- enabling course correction early when assumptions are wrong.
- ends with "What do you think?" prompt

**Do NOT use when**:
- For simple list-phase-assumptions operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. 1. Validate phase number argument (error if missing or invalid)
2. 2. Check if phase exists in roadmap
3. 3. Follow list-phase-assumptions.md workflow:
4. - Analyze roadmap description
5. - Surface assumptions about: technical approach, implementation order, scope, risks, dependencies
6. - Present assumptions clearly
7. - Prompt "What do you think?"
8. 4. Gather feedback and offer next steps

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/list-phase-assumptions/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] list-phase-assumptions parameters validated successfully
- [ ] Workflow executed without critical errors
- [ ] All output files generated with correct permissions
- [ ] User notified of completion with clear status
- [ ] Audit logs contain complete execution details

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/list-phase-assumptions.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/list-phase-assumptions.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/list-phase-assumptions.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance