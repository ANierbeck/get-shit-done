---
name: debug
description: Systematic debugging with persistent state across context resets
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Debug Skill

## Objective

Debug issues using scientific method with subagent isolation.

**Orchestrator role:** Gather symptoms, spawn gsd-debugger agent, handle checkpoints, spawn continuations.

**Why subagent:** Investigation burns context fast (reading files, forming hypotheses, testing). Fresh 200k context per investigation. Main context stays lean for user interaction.

## When to Use

📖 **Usage Guidelines**:
- When you need to debug with full context and validation
- For integrating debug into automated workflows
- When manual intervention is required for complex scenarios

**Do NOT use when**:
- For simple debug operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. ## 0. Initialize Context
3. ```bash
4. INIT=$(node ~/.Agent/get-shit-done/bin/gsd-tools.cjs state load)
5. ```
7. Extract `commit_docs` from init JSON. Resolve debugger model:
8. ```bash
9. DEBUGGER_MODEL=$(node ~/.Agent/get-shit-done/bin/gsd-tools.cjs resolve-model gsd-debugger --raw)
10. ```
12. ## 1. Check Active Sessions
14. If active sessions exist AND no $ARGUMENTS:
15. - List sessions with status, hypothesis, next action
16. - User picks number to resume OR describes new issue
18. If $ARGUMENTS provided OR user describes new issue:
19. - Continue to symptom gathering
21. ## 2. Gather Symptoms (if new issue)
23. Use AskUserQuestion for each:
25. 1. **Expected behavior** - What should happen?
26. 2. **Actual behavior** - What happens instead?
27. 3. **Error messages** - Any errors? (paste or describe)
28. 4. **Timeline** - When did this start? Ever worked?
29. 5. **Reproduction** - How do you trigger it?
31. After all gathered, confirm ready to investigate.
33. ## 3. Spawn gsd-debugger Agent
35. Fill prompt and spawn:
37. ```markdown
38. <objective>
39. Investigate issue: {slug}
41. **Summary:** {trigger}
42. </objective>
44. <symptoms>
45. expected: {expected}
46. actual: {actual}
47. errors: {errors}
48. reproduction: {reproduction}
49. timeline: {timeline}
50. </symptoms>
52. <mode>
53. symptoms_prefilled: true
54. goal: find_and_fix
55. </mode>
57. <debug_file>
58. Create: .planning/debug/{slug}.md
59. </debug_file>
60. ```
62. ```
63. Task(
64. prompt=filled_prompt,
65. subagent_type="gsd-debugger",
66. model="{debugger_model}",
67. description="Debug {slug}"
68. )
69. ```
71. ## 4. Handle Agent Return
73. **If `## ROOT CAUSE FOUND`:**
74. - Display root cause and evidence summary
75. - Offer options:
76. - "Fix now" - spawn fix subagent
77. - "Plan fix" - suggest /gsd:plan-phase --gaps
78. - "Manual fix" - done
80. **If `## CHECKPOINT REACHED`:**
81. - Present checkpoint details to user
82. - Get user response
83. - Spawn continuation agent (see step 5)
85. **If `## INVESTIGATION INCONCLUSIVE`:**
86. - Show what was checked and eliminated
87. - Offer options:
88. - "Continue investigating" - spawn new agent with additional context
89. - "Manual investigation" - done
90. - "Add more context" - gather more symptoms, spawn again
92. ## 5. Spawn Continuation Agent (After Checkpoint)
94. When user responds to checkpoint, spawn fresh agent:
96. ```markdown
97. <objective>
98. Continue debugging {slug}. Evidence is in the debug file.
99. </objective>
101. <prior_state>
102. <files_to_read>
103. - .planning/debug/{slug}.md (Debug session state)
104. </files_to_read>
105. </prior_state>
107. <checkpoint_response>
108. **Type:** {checkpoint_type}
109. **Response:** {user_response}
110. </checkpoint_response>
112. <mode>
113. goal: find_and_fix
114. </mode>
115. ```
117. ```
118. Task(
119. prompt=continuation_prompt,
120. subagent_type="gsd-debugger",
121. model="{debugger_model}",
122. description="Continue debug {slug}"
123. )
124. ```

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/debug/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] Active sessions checked
- [ ] Symptoms gathered (if new)
- [ ] gsd-debugger spawned with context
- [ ] Checkpoints handled correctly
- [ ] Root cause confirmed before fixing

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/debug.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/debug.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/debug.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance