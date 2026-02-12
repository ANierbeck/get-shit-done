---
name: complete-milestone
description: Archive completed milestone and prepare for next version. Use when a milestone is ready to be finalized, creating historical records and preparing for the next development cycle.
license: MIT
metadata:
  author: get-shit-done
  version: "1.0"
  category: project-management
allowed-tools: Read Write Bash
---

# Complete-Milestone Skill

## Objective

Mark milestone {{version}} complete, archive to milestones/, and update ROADMAP.md and REQUIREMENTS.md.

**Purpose:** Create historical record of shipped version, archive milestone artifacts (roadmap + requirements), and prepare for next milestone.

**Output:**
- Milestone archived (roadmap + requirements)
- PROJECT.md evolved
- Git tagged
- Clean slate for next milestone

**Required Files:**
- `.planning/ROADMAP.md` — Current roadmap
- `.planning/REQUIREMENTS.md` — Current requirements
- `.planning/STATE.md` — Project state
- `.planning/PROJECT.md` — Project context

## When to Use

- When all phases in the current milestone are complete
- When ready to finalize and archive a shipped version
- When preparing to start the next development cycle
- When creating historical records of completed work

**Prerequisites:**
- All phases must have completed plans (SUMMARY.md exists)
- Milestone audit should be passed (or gaps accepted)
- Version number must be specified

## Process

### 0. Pre-flight Check

**Check for audit:**
- Look for `.planning/v{{version}}-MILESTONE-AUDIT.md`
- If missing or stale: recommend `/gsd:audit-milestone` first
- If audit status is `gaps_found`: recommend `/gsd:plan-milestone-gaps` first
- If audit status is `passed`: proceed to step 1

```markdown
## Pre-flight Check

{If no v{{version}}-MILESTONE-AUDIT.md:}
⚠ No milestone audit found. Run `/gsd:audit-milestone` first to verify
requirements coverage, cross-phase integration, and E2E flows.

{If audit has gaps:}
⚠ Milestone audit found gaps. Run `/gsd:plan-milestone-gaps` to create
phases that close the gaps, or proceed anyway to accept as tech debt.

{If audit passed:}
✓ Milestone audit passed. Proceeding with completion.
```

### 1. Verify Readiness

- Check all phases in milestone have completed plans (SUMMARY.md exists)
- Present milestone scope and statistics:
  - Number of phases completed
  - Number of plans executed
  - Key accomplishments summary
- Wait for user confirmation before proceeding

### 2. Gather Statistics

- **Count phases, plans, tasks** from completed work
- **Calculate metrics:**
  ```bash
  # Git range analysis
  git log --since="[start_date]" --until="[end_date]" --oneline | wc -l
  
  # File changes
  git diff --shortstat [start_commit]..[end_commit]
  
  # Lines of code
  find src/ -name "*.ts" -exec cat {} + | wc -l
  ```
- **Extract timeline** from git log and phase completion dates
- Present comprehensive summary for approval

### 3. Extract Accomplishments

- Read all phase SUMMARY.md files in milestone range
- Extract 4-6 key accomplishments:
  - Major features delivered
  - Technical improvements
  - Quality enhancements
  - Performance gains
- Present accomplishments for user approval

### 4. Archive Milestone

**Create archive files:**
```bash
# Archive roadmap
cp ".planning/ROADMAP.md" ".planning/milestones/v{{version}}-ROADMAP.md"

# Archive requirements  
cp ".planning/REQUIREMENTS.md" ".planning/milestones/v{{version}}-REQUIREMENTS.md"
```

**Extract full phase details:**
- Copy complete phase entries from ROADMAP.md
- Include all plans, summaries, and outcomes
- Preserve original formatting and structure

**Fill milestone-archive.md template:**
```markdown
# Milestone {{version}} Archive

## Overview
- **Version:** {{version}}
- **Duration:** [start_date] to [end_date]
- **Phases:** [count]
- **Plans:** [count]
- **Commits:** [count]

## Key Accomplishments
- [Accomplishment 1]
- [Accomplishment 2]
- [Accomplishment 3]

## Statistics
- Files changed: [count]
- Lines added: [count]
- Lines removed: [count]
- Tests added: [count]

## Phase Details
[Full phase entries from original roadmap]

## Requirements Outcome
[Validated requirements with outcomes]
```

**Update ROADMAP.md:**
- Collapse milestone to one-line summary with link:
  ```markdown
  ## v{{version}} [Start] — [End] ([link to archive]) ✓
  ```
- Remove detailed phase entries (archived)
- Keep roadmap focused and efficient

### 5. Archive Requirements

**Create requirements archive:**
```bash
cp ".planning/REQUIREMENTS.md" ".planning/milestones/v{{version}}-REQUIREMENTS.md"
```

**Mark requirements as complete:**
- Check all checkboxes for validated requirements
- Add outcome notes (validated, adjusted, dropped)
- Preserve requirement history

**Delete current REQUIREMENTS.md:**
```bash
rm ".planning/REQUIREMENTS.md"
```
- Fresh requirements file created for next milestone
- Prevents requirement accumulation

### 6. Update PROJECT.md

**Add "Current State" section:**
```markdown
## Current State

**Latest Version:** {{version}}
**Shipped:** [date]
**Status:** Production

### Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

### Architecture
[Current architecture overview]
```

**Add "Next Milestone Goals" section:**
```markdown
## Next Milestone Goals

### Target Version: [next_version]

### Focus Areas
- [Area 1]
- [Area 2]
- [Area 3]

### Open Questions
- [Question 1]
- [Question 2]
```

**Archive previous content (if v1.1+):**
```markdown
<details>
<summary>v{{version}} Details</summary>

[Previous milestone content]

</details>
```

### 7. Commit and Tag

**Stage files for commit:**
```bash
git add .planning/milestones/v{{version}}-ROADMAP.md
git add .planning/milestones/v{{version}}-REQUIREMENTS.md
git add .planning/ROADMAP.md
git add .planning/PROJECT.md
git add .planning/STATE.md
```

**Create commit:**
```bash
git commit -m "chore: archive v{{version}} milestone"
```

**Create annotated tag:**
```bash
git tag -a v{{version}} -m "[milestone summary]"
```

**Ask about pushing:**
```
Tag v{{version}} created locally.

Would you like to:
1. Push tag now (git push --tags)
2. Push later (manual push)
3. Skip pushing (local only)
```

### 8. Offer Next Steps

```
Milestone {{version}} archived successfully!

📊 **Summary:**
- Phases completed: [count]
- Requirements validated: [count]
- Git tag: v{{version}}

🚀 **What's next?**

1. **Start next milestone:**
   `/gsd:new-milestone` — Begin questioning → research → requirements → roadmap

2. **Plan maintenance:**
   `/gsd:plan-phase [N]` — Address tech debt or improvements

3. **Review archive:**
   Check `.planning/milestones/v{{version}}-ROADMAP.md`

4. **Done for now:**
   Milestone complete, ready for next cycle
```

## Output

- **Milestone archive:** `.planning/milestones/v{{version}}-ROADMAP.md`
- **Requirements archive:** `.planning/milestones/v{{version}}-REQUIREMENTS.md`
- **Updated roadmap:** `.planning/ROADMAP.md` (collapsed to one-line summary)
- **Updated project:** `.planning/PROJECT.md` (current state + next goals)
- **Git tag:** `v{{version}}` (annotated tag with summary)
- **Clean requirements:** `.planning/REQUIREMENTS.md` deleted (fresh for next milestone)

## Success Criteria

- [ ] Milestone archived to `.planning/milestones/v{{version}}-ROADMAP.md`
- [ ] Requirements archived to `.planning/milestones/v{{version}}-REQUIREMENTS.md`
- [ ] `.planning/REQUIREMENTS.md` deleted (fresh for next milestone)
- [ ] ROADMAP.md collapsed to one-line entry with link
- [ ] PROJECT.md updated with current state and next goals
- [ ] Git tag `v{{version}}` created with annotated message
- [ ] Commit successful with all changes staged
- [ ] User informed of next steps and options

## Critical Rules

- **Load workflow first:** Always read complete-milestone.md before executing
- **Verify completion:** All phases must have SUMMARY.md files before archiving
- **User confirmation:** Wait for approval at all verification gates
- **Archive before collapsing:** Create archive files before updating/deleting originals
- **One-line summary:** Collapsed milestone in ROADMAP.md must be single line with link
- **Context efficiency:** Archive process keeps ROADMAP.md constant size per milestone
- **Fresh requirements:** Next milestone starts with `/gsd:new-milestone` which includes requirements definition

## Anti-Patterns

- **Don't archive incomplete milestones** — All phases must be truly complete
- **Don't skip audit** — Always verify requirements coverage first
- **Don't delete without archiving** — Preserve historical records
- **Don't keep old requirements** — Start fresh for each milestone
- **Don't manually edit archives** — Let the process create consistent records
- **Don't archive without tagging** — Git tags are essential for version tracking

## Examples

### Example 1: Completing v1.0 Milestone
```
Input: /gsd:complete-milestone 1.0
Process:
1. Pre-flight check passes (audit completed)
2. 6 phases verified complete
3. Statistics gathered (42 commits, 18 files changed)
4. Archive files created
5. ROADMAP.md collapsed to one line
6. PROJECT.md updated with v1.0 state
7. Git tag v1.0 created
Output:
- .planning/milestones/v1.0-ROADMAP.md
- .planning/milestones/v1.0-REQUIREMENTS.md
- Updated ROADMAP.md and PROJECT.md
- Git tag v1.0 with commit
```

### Example 2: Missing Audit
```
Input: /gsd:complete-milestone 1.1
Output:
⚠ No milestone audit found. Run `/gsd:audit-milestone` first to verify
requirements coverage, cross-phase integration, and E2E flows.

[User runs audit first, then completes milestone]
```

### Example 3: Requirements Archive
```
Before:
.planning/REQUIREMENTS.md (current requirements)

After:
.planning/milestones/v1.0-REQUIREMENTS.md (archived)
.planning/REQUIREMENTS.md (deleted - fresh for next milestone)
```

## Error Handling

- **Missing SUMMARY.md files:** Prevent completion, inform user which phases incomplete
- **Audit failures:** Recommend audit command with specific issues
- **File write errors:** Preserve originals, inform user of failure
- **Git errors:** Continue with local changes, log git issues
- **Invalid version format:** Validate version format (semver recommended)
- **Missing files:** Clear error messages with setup instructions
