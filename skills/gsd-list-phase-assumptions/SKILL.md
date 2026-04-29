---
name: gsd-list-phase-assumptions
description: "Surface Claudes assumptions about a phase approach before planning"
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
Show Claude's intended approach for a phase before it starts. Prompt for phase number. Let user course-correct if Claude misunderstood vision. No files created - conversational output only. Load context from STATE.md and ROADMAP.md.
</process>
'<<'
# List Phase Assumptions

Analyze a phase and present Claude's assumptions about technical approach, implementation order, scope boundaries, risk areas, and dependencies.

Purpose: Help users see what Claude thinks BEFORE planning begins - enabling course correction early when assumptions are wrong.
Output: Conversational output only (no file creation) - ends with "What do you think?" prompt

## Process

1. Validate phase number argument (error if missing or invalid)
2. Check if phase exists in roadmap
3. Follow list-phase-assumptions.md workflow:
- Analyze roadmap description
- Surface assumptions about: technical approach, implementation order, scope, risks, dependencies
- Present assumptions clearly
- Prompt "What do you think?"
4. Gather feedback and offer next steps
