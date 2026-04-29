---
name: gsd-complete-milestone
description: "Archive completed milestone and prepare for next version"
license: MIT
compatibility: Mistral Vibe
user-invocable: true
allowed-tools:
  - read_file
  - grep
  - ask_user_question
---


'>>'
<process>
Archive completed milestone and prepare for next version. Create MILESTONES.md entry with stats. Archive full details to milestones/vX.Y/ directory. Create git tag for release. Prepare workspace for next version. Update STATE.md.
</process>
'<<'
# Complete Milestone

Mark milestone {{version}} complete, archive to milestones/, and update ROADMAP.md and REQUIREMENTS.md.

Purpose: Create historical record of shipped version, archive milestone artifacts (roadmap + requirements), and prepare for next milestone.
Output: Milestone archived (roadmap + requirements), PROJECT.md evolved, git tagged.

## Process

**Follow complete-milestone.md workflow:**
0. **Check for audit:**
- Look for `.planning/v{{version}}-MILESTONE-AUDIT.md`
- If missing or stale: recommend `vibe -p "gsd-audit-milestone"` first
- If audit status is `gaps_found`: recommend `vibe -p "gsd-plan-milestone-gaps"` first
- If audit status is `passed`: proceed to step 1
```markdown
## Pre-flight Check
{If no v{{version}}-MILESTONE-AUDIT.md:}
⚠ No milestone audit found. Run `vibe -p "gsd-audit-milestone"` first to verify
requirements coverage, cross-phase integration, and E2E flows.
{If audit has gaps:}
⚠ Milestone audit found gaps. Run `vibe -p "gsd-plan-milestone-gaps"` to create
phases that close the gaps, or proceed anyway to accept as tech debt.
{If audit passed:}
✓ Milestone audit passed. Proceeding with completion.
```
1. **Verify readiness:**
- Check all phases in milestone have completed plans (SUMMARY.md exists)
- Present milestone scope and stats
- Wait for confirmation
2. **Gather stats:**
- Count phases, plans, tasks
- Calculate git range, file changes, LOC
- Extract timeline from git log
- Present summary, confirm
3. **Extract accomplishments:**
- Read all phase SUMMARY.md files in milestone range
- Extract 4-6 key accomplishments
- Present for approval
4. **Archive milestone:**
- Create `.planning/milestones/v{{version}}-ROADMAP.md`
- Extract full phase details from ROADMAP.md
- Fill milestone-archive.md template
- Update ROADMAP.md to one-line summary with link
5. **Archive requirements:**
- Create `.planning/milestones/v{{version}}-REQUIREMENTS.md`
- Mark all v1 requirements as complete (checkboxes checked)
- Note requirement outcomes (validated, adjusted, dropped)
- Delete `.planning/REQUIREMENTS.md` (fresh one created for next milestone)
6. **Update PROJECT.md:**
- Add "Current State" section with shipped version
- Add "Next Milestone Goals" section
- Archive previous content in `` (if v1.1+)
7. **Commit and tag:**
- Stage: MILESTONES.md, PROJECT.md, ROADMAP.md, STATE.md, archive files
- Commit: `chore: archive v{{version}} milestone`
- Tag: `git tag -a v{{version}} -m "[milestone summary]"`
- Ask about pushing tag
8. **Offer next steps:**
- `vibe -p "gsd-new-milestone"` — start next milestone (questioning → research → requirements → roadmap)
