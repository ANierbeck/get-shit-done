---
name: gsd-remove-phase
description: "Remove a future phase from roadmap and renumber subsequent phases"
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
Remove a future (unstarted) phase and renumber subsequent phases. Prompt user for phase number. Delete phase directory. Remove from ROADMAP.md. Update all phase references. Git commit preserves historical record. Only works on future phases.
</process>
'<<'
# Remove Phase

Remove an unstarted future phase from the roadmap and renumber all subsequent phases to maintain a clean, linear sequence.

Purpose: Clean removal of work you've decided not to do, without polluting context with cancelled/deferred markers.
Output: Phase deleted, all subsequent phases renumbered, git commit as historical record.

## Process

Execute the remove-phase workflow from  end-to-end.
Preserve all validation gates (future phase check, work check), renumbering logic, and commit.
