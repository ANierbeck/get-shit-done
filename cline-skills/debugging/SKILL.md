---
name: debugging
description: Systematic debugging with persistent state and scientific method. Use this skill when you need to diagnose issues, test hypotheses, or resolve complex bugs in your application.
---

# Debugging Skill

Systematic debugging following scientific method with persistent state.

## Steps

1. **Issue Diagnosis**
   - Gather symptoms and error information
   - Reproduce the issue consistently
   - Document environmental factors

2. **Hypothesis Formation**
   - Analyze symptoms and patterns
   - Formulate testable hypotheses
   - Prioritize likely causes

3. **Evidence Collection**
   - Run diagnostic tests
   - Collect logs and metrics
   - Capture relevant state information

4. **Hypothesis Testing**
   - Test each hypothesis systematically
   - Record test results
   - Eliminate invalid hypotheses

5. **Root Cause Identification**
   - Identify the actual cause
   - Document the root cause
   - Verify the diagnosis

6. **Solution Implementation**
   - Develop and test fixes
   - Verify the solution works
   - Document the resolution

## Debugging Methodology

### Scientific Method
1. **Observe**: Gather symptoms and data
2. **Hypothesize**: Formulate testable explanations
3. **Predict**: What should happen if hypothesis is correct
4. **Experiment**: Test the hypothesis
5. **Analyze**: Evaluate results
6. **Conclude**: Determine root cause

### Persistent State
- Maintains debugging session across context resets
- Survives `/clear` commands
- Preserves hypothesis testing history

### Evidence-Based
- Collects objective evidence
- Tests hypotheses systematically
- Documents all findings

## Integration with GSD

This skill integrates with GSD's debugging workflow:

- **State Management**: Maintains `.planning/debug/` sessions
- **Context Preservation**: Uses GSD's state management
- **Hypothesis Tracking**: Documents testing in debug files
- **Resolution Archiving**: Archives resolved issues

## Advanced Usage

### Complex Issue Debugging

For multi-layered issues:

```bash
# Start debugging session
/gsd:debug "Intermittent API timeout"

# After context reset, resume
/gsd:debug

# Archive when resolved
/gsd:debug --archive
```

### Automated Diagnostics

Create custom diagnostic scripts:

```bash
# Custom diagnostic script
node diagnostics.js > DIAGNOSTICS.md
/gsd:debug --diagnostics=DIAGNOSTICS.md
```

## Requirements

- Get Shit Done initialized
- Reproducible issue to debug
- Diagnostic tools available

## Output

- `.planning/debug/[issue]/` - Debug session files
- `.planning/debug/resolved/` - Archived resolutions
- Hypothesis testing documentation
- Root cause analysis