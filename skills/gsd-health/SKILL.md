---
name: gsd-health
description: "Diagnose planning directory health and optionally repair issues"
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
Check project health and integrity. Validate phase numbering consistency. Check disk vs ROADMAP.md sync. Validate .planning/ directory structure. Check for common issues. Report problems with fixes.
</process>
'<<'
# Health

Validate `.planning/` directory integrity and report actionable issues. Checks for missing files, invalid configurations, inconsistent state, and orphaned plans.

## Process

Execute the health workflow from  end-to-end.
Parse --repair flag from arguments and pass to workflow.
