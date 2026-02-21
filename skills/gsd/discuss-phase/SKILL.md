---
name: discuss-phase
description: Gather phase context through adaptive questioning before planning
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Discuss Phase Skill

## Objective

Extract implementation decisions that downstream agents need — researcher and planner will use CONTEXT.md to know what to investigate and what choices are locked.

**How it works:**
1. Analyze the phase to identify gray areas (UI, UX, behavior, etc.)
2. Present gray areas — user selects which to discuss
3. Deep-dive each selected area until satisfied
4. Create CONTEXT.md with decisions that guide research and planning

**Output:** `{phase_num}-CONTEXT.md` — decisions clear enough that downstream agents can act without asking the user again

## When to Use

📖 **Usage Guidelines**:
- When you need to discuss phase with full context and validation
- For integrating discuss-phase into automated workflows
- When manual intervention is required for complex scenarios

**Do NOT use when**:
- For simple discuss-phase operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. 1. Validate phase number (error if missing or not in roadmap)
2. 2. Check if CONTEXT.md exists (offer update/view/skip if yes)
3. 3. **Analyze phase** — Identify domain and generate phase-specific gray areas
4. 4. **Present gray areas** — Multi-select: which to discuss? (NO skip option)
5. 5. **Deep-dive each area** — 4 questions per area, then offer more/next
6. 6. **Write CONTEXT.md** — Sections match areas discussed
7. 7. Offer next steps (research or plan)
9. **CRITICAL: Scope guardrail**
10. - Phase boundary from ROADMAP.md is FIXED
11. - Discussion clarifies HOW to implement, not WHETHER to add more
12. - If user suggests new capabilities: "That's its own phase. I'll note it for later."
13. - Capture deferred ideas — don't lose them, don't act on them
15. **Domain-aware gray areas:**
16. Gray areas depend on what's being built. Analyze the phase goal:
17. - Something users SEE → layout, density, interactions, states
18. - Something users CALL → responses, errors, auth, versioning
19. - Something users RUN → output format, flags, modes, error handling
20. - Something users READ → structure, tone, depth, flow
21. - Something being ORGANIZED → criteria, grouping, naming, exceptions
23. Generate 3-4 **phase-specific** gray areas, not generic categories.
25. **Probing depth:**
26. - Ask 4 questions per area before checking
27. - "More questions about [area], or move to next?"
28. - If more → ask 4 more, check again
29. - After all areas → "Ready to create context?"
31. **Do NOT ask about (Agent handles these):**
32. - Technical implementation
33. - Architecture choices
34. - Performance concerns
35. - Scope expansion

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/discuss-phase/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] discuss-phase parameters validated successfully
- [ ] Workflow executed without critical errors
- [ ] All output files generated with correct permissions
- [ ] User notified of completion with clear status
- [ ] Audit logs contain complete execution details

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/discuss-phase.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/discuss-phase.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/discuss-phase.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance