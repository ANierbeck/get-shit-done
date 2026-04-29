---
name: gsd-new-milestone
description: "Start a new milestone cycle — update PROJECT.md and route to requirements"
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
Start a new milestone through unified flow for existing projects. Conduct questioning to understand what's next. Optional domain research. Define requirements. Create ROADMAP.md with phase breakdown. Works on projects with existing PROJECT.md.
</process>
'<<'
# New Milestone

Start a new milestone: questioning → research (optional) → requirements → roadmap.

Brownfield equivalent of new-project. Project exists, PROJECT.md has history. Gathers "what's next", updates PROJECT.md, then runs requirements → roadmap cycle.

**Creates/Updates:**
- `.planning/PROJECT.md` — updated with new milestone goals
- `.planning/research/` — domain research (optional, NEW features only)
- `.planning/REQUIREMENTS.md` — scoped requirements for this milestone
- `.planning/ROADMAP.md` — phase structure (continues numbering)
- `.planning/STATE.md` — reset for new milestone

**After:** `vibe -p "gsd-plan-phase" [N]` to start execution.

## Process

Execute the new-milestone workflow from  end-to-end.
Preserve all workflow gates (validation, questioning, research, requirements, roadmap approval, commits).
