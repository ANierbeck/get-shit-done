---
name: gsd-insert-phase
description: "Insert urgent work as decimal phase (e.g., 72.1) between existing phases"
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
Insert urgent work as decimal phase between existing phases. Prompt user for base phase number and description. Calculate next decimal (e.g., 7.1 between 7 and 8). Update ROADMAP.md, create phase directory, renumber subsequent phases if needed. Maintain phase ordering.
</process>
'<<'
# Insert Phase

Insert a decimal phase for urgent work discovered mid-milestone that must be completed between existing integer phases.

Uses decimal numbering (72.1, 72.2, etc.) to preserve the logical sequence of planned phases while accommodating urgent insertions.

Purpose: Handle urgent work discovered during execution without renumbering entire roadmap.

## Process

Execute the insert-phase workflow from  end-to-end.
Preserve all validation gates (argument parsing, phase verification, decimal calculation, roadmap updates).
