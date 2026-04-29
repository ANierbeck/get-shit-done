---
name: gsd-pause-work
description: "Create context handoff when pausing work mid-phase"
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
Create context handoff when pausing work mid-phase. Create .continue-here file in project root with current state. Update STATE.md session continuity section. Capture in-progress work, current file, last commit, open questions.
</process>
'<<'
# Pause Work

Create `.continue-here.md` handoff file to preserve complete work state across sessions.

Routes to the pause-work workflow which handles:
- Current phase detection from recent files
- Complete state gathering (position, completed work, remaining work, decisions, blockers)
- Handoff file creation with all context sections
- Git commit as WIP
- Resume instructions

## Process

**Follow the pause-work workflow** from `
The workflow handles all logic including:
1. Phase directory detection
2. State gathering with user clarifications
3. Handoff file writing with timestamp
4. Git commit
5. Confirmation with resume instructions
