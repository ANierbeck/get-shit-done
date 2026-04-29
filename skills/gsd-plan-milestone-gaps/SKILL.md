---
name: gsd-plan-milestone-gaps
description: "Create phases to close all gaps identified by milestone audit"
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
Create phases to close gaps identified by milestone audit. Read MILESTONE-AUDIT.md. Group gaps into coherent phases. Prioritize by requirement priority (must/should/nice). Add gap closure phases to ROADMAP.md. Ready for /plan-phase on new phases.
</process>
'<<'
# Plan Milestone Gaps

Create all phases necessary to close gaps identified by `vibe -p "gsd-audit-milestone"`.

Reads MILESTONE-AUDIT.md, groups gaps into logical phases, creates phase entries in ROADMAP.md, and offers to plan each phase.

One command creates all fix phases — no manual `vibe -p "gsd-add-phase"` per gap.

## Process

Execute the plan-milestone-gaps workflow from  end-to-end.
Preserve all workflow gates (audit loading, prioritization, phase grouping, user confirmation, roadmap updates).
