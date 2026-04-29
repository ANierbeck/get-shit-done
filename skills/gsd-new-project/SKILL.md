---
name: gsd-new-project
description: "Initialize a new project with deep context gathering and PROJECT.md"
license: MIT
compatibility: Mistral Vibe
user-invocable: true
allowed-tools:
  - read_file
  - grep
  - ask_user_question
  - write_file
  - append_file
---


'>>'
<process>
Execute the complete new-project workflow: conduct deep questioning to understand what the user wants to build, optionally spawn parallel researcher agents for domain research, define v1/v2/out-of-scope requirements, create PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md, and config.json. Preserve all workflow gates (validation, approvals, commits).
</process>
'<<'
# New Project

Initialize a new project through unified flow: questioning → research (optional) → requirements → roadmap.

**Creates:**
- `.planning/PROJECT.md` — project context
- `.planning/config.json` — workflow preferences
- `.planning/research/` — domain research (optional)
- `.planning/REQUIREMENTS.md` — scoped requirements
- `.planning/ROADMAP.md` — phase structure
- `.planning/STATE.md` — project memory

**After this command:** Run `vibe -p "gsd-plan-phase" 1` to start execution.

## Process

Execute the new-project workflow from  end-to-end.
Preserve all workflow gates (validation, approvals, commits, routing).
