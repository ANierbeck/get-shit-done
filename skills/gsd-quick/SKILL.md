---
name: gsd-quick
description: "Execute a quick task with GSD guarantees (atomic commits, state tracking) but skip optional agents"
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
Execute small ad-hoc tasks with GSD guarantees but skip optional agents. Prompt user for task description. Spawn planner + executor agents only (skip researcher, checker, verifier). Create .planning/quick/NNN-slug/PLAN.md and .planning/quick/NNN-slug/SUMMARY.md. Updates STATE.md tracking but not ROADMAP.md.
</process>
'<<'
# Quick

Execute small, ad-hoc tasks with GSD guarantees (atomic commits, STATE.md tracking).

Quick mode is the same system with a shorter path:
- Spawns gsd-planner (quick mode) + gsd-executor(s)
- Quick tasks live in `.planning/quick/` separate from planned phases
- Updates STATE.md "Quick Tasks Completed" table (NOT ROADMAP.md)

**Default:** Skips research, plan-checker, verifier. Use when you know exactly what to do.

**`--full` flag:** Enables plan-checking (max 2 iterations) and post-execution verification. Use when you want quality guarantees without full milestone ceremony.

## Process

Execute the quick workflow from  end-to-end.
Preserve all workflow gates (validation, task description, planning, execution, state updates, commits).
