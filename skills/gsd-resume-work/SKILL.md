---
name: gsd-resume-work
description: "Resume work from previous session with full context restoration"
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
Resume work from previous session with full context restoration. Load STATE.md for project context. Show current position, last activity, and recent progress from SUMMARY files. Offer next actions: continue current plan, resume paused session, start new work.
</process>
'<<'
# Resume Work

Restore complete project context and resume work seamlessly from previous session.

Routes to the resume-project workflow which handles:

- STATE.md loading (or reconstruction if missing)
- Checkpoint detection (.continue-here files)
- Incomplete work detection (PLAN without SUMMARY)
- Status presentation
- Context-aware next action routing

## Process

**Follow the resume-project workflow** from `
The workflow handles all resumption logic including:
1. Project existence verification
2. STATE.md loading or reconstruction
3. Checkpoint and incomplete work detection
4. Visual status presentation
5. Context-aware option offering (checks CONTEXT.md before suggesting plan vs discuss)
6. Routing to appropriate next command
7. Session continuity updates
