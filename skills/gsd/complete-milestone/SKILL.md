---
name: complete-milestone
description: Archive completed milestone and prepare for next version
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Complete Milestone Skill

## Objective

Mark milestone {{version}} complete, archive to milestones/, and update ROADMAP.md and REQUIREMENTS.md.

Purpose: Create historical record of shipped version, archive milestone artifacts (roadmap + requirements), and prepare for next milestone.
Output: Milestone archived (roadmap + requirements), PROJECT.md evolved, git tagged.

## When to Use

📖 **Usage Guidelines**:
- Create historical record of shipped version, archive milestone artifacts (roadmap + requirements), and prepare for next milestone.
- Output: Milestone archived (roadmap + requirements), PROJECT.md evolved, git tagged.

**Do NOT use when**:
- For simple complete-milestone operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. **Follow complete-milestone.md workflow:**
3. 0. **Check for audit:**
5. - Look for `.planning/v{{version}}-MILESTONE-AUDIT.md`
6. - If missing or stale: recommend `/gsd:audit-milestone` first
7. - If audit status is `gaps_found`: recommend `/gsd:plan-milestone-gaps` first
8. - If audit status is `passed`: proceed to step 1
10. ```markdown
11. ## Pre-flight Check
13. {If no v{{version}}-MILESTONE-AUDIT.md:}
14. ⚠ No milestone audit found. Run `/gsd:audit-milestone` first to verify
15. requirements coverage, cross-phase integration, and E2E flows.
17. {If audit has gaps:}
18. ⚠ Milestone audit found gaps. Run `/gsd:plan-milestone-gaps` to create
19. phases that close the gaps, or proceed anyway to accept as tech debt.
21. {If audit passed:}
22. ✓ Milestone audit passed. Proceeding with completion.
23. ```
25. 1. **Verify readiness:**
27. - Check all phases in milestone have completed plans (SUMMARY.md exists)
28. - Present milestone scope and stats
29. - Wait for confirmation
31. 2. **Gather stats:**
33. - Count phases, plans, tasks
34. - Calculate git range, file changes, LOC
35. - Extract timeline from git log
36. - Present summary, confirm
38. 3. **Extract accomplishments:**
40. - Read all phase SUMMARY.md files in milestone range
41. - Extract 4-6 key accomplishments
42. - Present for approval
44. 4. **Archive milestone:**
46. - Create `.planning/milestones/v{{version}}-ROADMAP.md`
47. - Extract full phase details from ROADMAP.md
48. - Fill milestone-archive.md template
49. - Update ROADMAP.md to one-line summary with link
51. 5. **Archive requirements:**
53. - Create `.planning/milestones/v{{version}}-REQUIREMENTS.md`
54. - Mark all v1 requirements as complete (checkboxes checked)
55. - Note requirement outcomes (validated, adjusted, dropped)
56. - Delete `.planning/REQUIREMENTS.md` (fresh one created for next milestone)
58. 6. **Update PROJECT.md:**
60. - Add "Current State" section with shipped version
61. - Add "Next Milestone Goals" section
62. - Archive previous content in `<details>` (if v1.1+)
64. 7. **Commit and tag:**
66. - Stage: MILESTONES.md, PROJECT.md, ROADMAP.md, STATE.md, archive files
67. - Commit: `chore: archive v{{version}} milestone`
68. - Tag: `git tag -a v{{version}} -m "[milestone summary]"`
69. - Ask about pushing tag
71. 8. **Offer next steps:**
72. - `/gsd:new-milestone` — start next milestone (questioning → research → requirements → roadmap)

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/complete-milestone/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] complete-milestone parameters validated successfully
- [ ] Workflow executed without critical errors
- [ ] All output files generated with correct permissions
- [ ] User notified of completion with clear status
- [ ] Audit logs contain complete execution details

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/complete-milestone.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/complete-milestone.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/complete-milestone.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance