---
name: gsd-plan-phase
description: "Create detailed phase plan (PLAN.md) with verification loop"
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
Execute the complete plan-phase workflow for the specified phase number: load project context from STATE.md and ROADMAP.md, analyze requirements, create detailed PLAN.md with wave-based task breakdown, verification criteria, success measures, and dependencies. Preserve all workflow gates.
</process>
'<<'
# Plan Phase

Create executable phase prompts (PLAN.md files) for a roadmap phase with integrated research and verification.

**Default flow:** Research (if needed) → Plan → Verify → Done

**Orchestrator role:** Parse arguments, validate phase, research domain (unless skipped), spawn gsd-planner, verify with gsd-plan-checker, iterate until pass or max iterations, present results.

## Process

Execute the plan-phase workflow from  end-to-end.
Preserve all workflow gates (validation, research, planning, verification loop, routing).
