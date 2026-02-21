---
name: set-profile
description: Switch model profile for GSD agents (quality/balanced/budget)
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Set Profile Skill

## Objective

Switch the model profile used by GSD agents. Controls which Agent model each agent uses, balancing quality vs token spend.

Routes to the set-profile workflow which handles:
- Argument validation (quality/balanced/budget)
- Config file creation if missing
- Profile update in config.json
- Confirmation with model table display

## When to Use

📖 **Usage Guidelines**:
- When you need to set profile with full context and validation
- For integrating set-profile into automated workflows
- When manual intervention is required for complex scenarios

**Do NOT use when**:
- For simple set-profile operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. **Follow the set-profile workflow** from `@~/.vibe/get-shit-done/workflows/set-profile.md`.
3. The workflow handles all logic including:
4. 1. Profile argument validation
5. 2. Config file ensuring
6. 3. Config reading and updating
7. 4. Model table generation from MODEL_PROFILES
8. 5. Confirmation display

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/set-profile/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] set-profile parameters validated successfully
- [ ] Workflow executed without critical errors
- [ ] All output files generated with correct permissions
- [ ] User notified of completion with clear status
- [ ] Audit logs contain complete execution details

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/set-profile.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/set-profile.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/set-profile.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance