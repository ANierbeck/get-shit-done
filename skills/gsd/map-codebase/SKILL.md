---
name: map-codebase
description: Analyze codebase with parallel mapper agents to produce .planning/codebase/ documents
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Map Codebase Skill

## Objective

Analyze existing codebase using parallel gsd-codebase-mapper agents to produce structured codebase documents.

Each mapper agent explores a focus area and **writes documents directly** to `.planning/codebase/`. The orchestrator only receives confirmations, keeping context usage minimal.

Output: .planning/codebase/ folder with 7 structured documents about the codebase state.

## When to Use

📖 **Usage Guidelines**:
- When you need to map codebase with full context and validation
- For integrating map-codebase into automated workflows
- When manual intervention is required for complex scenarios

**Do NOT use when**:
- For simple map-codebase operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. 1. Check if .planning/codebase/ already exists (offer to refresh or skip)
2. 2. Create .planning/codebase/ directory structure
3. 3. Spawn 4 parallel gsd-codebase-mapper agents:
4. - Agent 1: tech focus → writes STACK.md, INTEGRATIONS.md
5. - Agent 2: arch focus → writes ARCHITECTURE.md, STRUCTURE.md
6. - Agent 3: quality focus → writes CONVENTIONS.md, TESTING.md
7. - Agent 4: concerns focus → writes CONCERNS.md
8. 4. Wait for agents to complete, collect confirmations (NOT document contents)
9. 5. Verify all 7 documents exist with line counts
10. 6. Commit codebase map
11. 7. Offer next steps (typically: /gsd:new-project or /gsd:plan-phase)

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/map-codebase/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] .planning/codebase/ directory created
- [ ] All 7 codebase documents written by mapper agents
- [ ] Documents follow template structure
- [ ] Parallel agents completed without errors
- [ ] User knows next steps

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/map-codebase.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/map-codebase.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/map-codebase.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance