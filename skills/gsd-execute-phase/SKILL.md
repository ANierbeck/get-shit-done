---
name: gsd-execute-phase
description: "Execute all plans in a phase with wave-based parallelization"
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
Execute the complete execute-phase workflow for the specified phase number: discover all PLAN.md files in the phase directory, group into waves based on frontmatter wave field, spawn parallel Task agents for each wave, collect results, verify phase goal was achieved, update STATE.md and REQUIREMENTS.md. Preserve all workflow gates.
</process>
'<<'
# Execute Phase

Execute all plans in a phase using wave-based parallel execution.

Orchestrator stays lean: discover plans, analyze dependencies, group into waves, spawn subagents, collect results. Each subagent loads the full execute-plan context and handles its own plan.

Context budget: ~15% orchestrator, 100% fresh per subagent.

## Process

Execute the execute-phase workflow from  end-to-end.
Preserve all workflow gates (wave execution, checkpoint handling, verification, state updates, routing).
