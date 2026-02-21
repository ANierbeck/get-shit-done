---
name: research-phase
description: Research how to implement a phase (standalone - usually use /gsd:plan-phase instead)
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Research Phase Skill

## Objective

Research how to implement a phase. Spawns gsd-phase-researcher agent with phase context.

**Note:** This is a standalone research command. For most workflows, use `/gsd:plan-phase` which integrates research automatically.

**Use this command when:**
- You want to research without planning yet
- You want to re-research after planning is complete
- You need to investigate before deciding if a phase is feasible

**Orchestrator role:** Parse phase, validate against roadmap, check existing research, gather context, spawn researcher agent, present results.

**Why subagent:** Research burns context fast (WebSearch, Context7 queries, source verification). Fresh 200k context for investigation. Main context stays lean for user interaction.

## When to Use

📖 **Usage Guidelines**:
- You want to research without planning yet
- You want to re-research after planning is complete
- You need to investigate before deciding if a phase is feasible

**Do NOT use when**:
- This is a standalone research command. For most workflows, use `/gsd:plan-phase` which integrates research automatically.

## Process

### Enhanced Workflow:

1. ## 0. Initialize Context
3. ```bash
4. INIT=$(node ~/.Agent/get-shit-done/bin/gsd-tools.cjs init phase-op "$ARGUMENTS")
5. ```
7. Extract from init JSON: `phase_dir`, `phase_number`, `phase_name`, `phase_found`, `commit_docs`, `has_research`, `state_path`, `requirements_path`, `context_path`, `research_path`.
9. Resolve researcher model:
10. ```bash
11. RESEARCHER_MODEL=$(node ~/.Agent/get-shit-done/bin/gsd-tools.cjs resolve-model gsd-phase-researcher --raw)
12. ```
14. ## 1. Validate Phase
16. ```bash
17. PHASE_INFO=$(node ~/.Agent/get-shit-done/bin/gsd-tools.cjs roadmap get-phase "${phase_number}")
18. ```
20. **If `found` is false:** Error and exit. **If `found` is true:** Extract `phase_number`, `phase_name`, `goal` from JSON.
22. ## 2. Check Existing Research
24. ```bash
25. ls .planning/phases/${PHASE}-*/RESEARCH.md 2>/dev/null
26. ```
28. **If exists:** Offer: 1) Update research, 2) View existing, 3) Skip. Wait for response.
30. **If doesn't exist:** Continue.
32. ## 3. Gather Phase Context
34. Use paths from INIT (do not inline file contents in orchestrator context):
35. - `requirements_path`
36. - `context_path`
37. - `state_path`
39. Present summary with phase description and what files the researcher will load.
41. ## 4. Spawn gsd-phase-researcher Agent
43. Research modes: ecosystem (default), feasibility, implementation, comparison.
45. ```markdown
46. <research_type>
47. Phase Research — investigating HOW to implement a specific phase well.
48. </research_type>
50. <key_insight>
51. The question is NOT "which library should I use?"
53. The question is: "What do I not know that I don't know?"
55. For this phase, discover:
56. - What's the established architecture pattern?
57. - What libraries form the standard stack?
58. - What problems do people commonly hit?
59. - What's SOTA vs what Agent's training thinks is SOTA?
60. - What should NOT be hand-rolled?
61. </key_insight>
63. <objective>
64. Research implementation approach for Phase {phase_number}: {phase_name}
65. Mode: ecosystem
66. </objective>
68. <files_to_read>
69. - {requirements_path} (Requirements)
70. - {context_path} (Phase context from discuss-phase, if exists)
71. - {state_path} (Prior project decisions and blockers)
72. </files_to_read>
74. <additional_context>
75. **Phase description:** {phase_description}
76. </additional_context>
78. <downstream_consumer>
79. Your RESEARCH.md will be loaded by `/gsd:plan-phase` which uses specific sections:
80. - `## Standard Stack` → Plans use these libraries
81. - `## Architecture Patterns` → Task structure follows these
82. - `## Don't Hand-Roll` → Tasks NEVER build custom solutions for listed problems
83. - `## Common Pitfalls` → Verification steps check for these
84. - `## Code Examples` → Task actions reference these patterns
86. Be prescriptive, not exploratory. "Use X" not "Consider X or Y."
87. </downstream_consumer>
89. <quality_gate>
90. Before declaring complete, verify:
91. - [ ] All domains investigated (not just some)
92. - [ ] Negative claims verified with official docs
93. - [ ] Multiple sources for critical claims
94. - [ ] Confidence levels assigned honestly
95. - [ ] Section names match what plan-phase expects
96. </quality_gate>
98. <output>
99. Write to: .planning/phases/${PHASE}-{slug}/${PHASE}-RESEARCH.md
100. </output>
101. ```
103. ```
104. Task(
105. prompt="First, read ~/.Agent/agents/gsd-phase-researcher.md for your role and instructions.\n\n" + filled_prompt,
106. subagent_type="general-purpose",
107. model="{researcher_model}",
108. description="Research Phase {phase}"
109. )
110. ```
112. ## 5. Handle Agent Return
114. **`## RESEARCH COMPLETE`:** Display summary, offer: Plan phase, Dig deeper, Review full, Done.
116. **`## CHECKPOINT REACHED`:** Present to user, get response, spawn continuation.
118. **`## RESEARCH INCONCLUSIVE`:** Show what was attempted, offer: Add context, Try different mode, Manual.
120. ## 6. Spawn Continuation Agent
122. ```markdown
123. <objective>
124. Continue research for Phase {phase_number}: {phase_name}
125. </objective>
127. <prior_state>
128. <files_to_read>
129. - .planning/phases/${PHASE}-{slug}/${PHASE}-RESEARCH.md (Existing research)
130. </files_to_read>
131. </prior_state>
133. <checkpoint_response>
134. **Type:** {checkpoint_type}
135. **Response:** {user_response}
136. </checkpoint_response>
137. ```
139. ```
140. Task(
141. prompt="First, read ~/.Agent/agents/gsd-phase-researcher.md for your role and instructions.\n\n" + continuation_prompt,
142. subagent_type="general-purpose",
143. model="{researcher_model}",
144. description="Continue research Phase {phase}"
145. )
146. ```

## Output

- Write to: .planning/phases/${PHASE}-{slug}/${PHASE}-RESEARCH.md

## Success Criteria

- [ ] Phase validated against roadmap
- [ ] Existing research checked
- [ ] gsd-phase-researcher spawned with context
- [ ] Checkpoints handled correctly
- [ ] User knows next steps

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/research-phase.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/research-phase.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/research-phase.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance