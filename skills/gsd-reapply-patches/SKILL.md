---
name: gsd-reapply-patches
description: "Reapply local modifications after a GSD update"
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
Reapply previously created patches. Load patch files from .planning/patches/. Prompt user for patch selection. Handle conflicts interactively. Verify application. Update STATE.md. Commit changes.
</process>
'<<'
# Reapply Patches

Reapply local modifications after a GSD update

## Process

1. Initialize Unknown Skill workflow
2. Gather required inputs and context
3. Execute main workflow logic
4. Generate outputs and updates
5. Complete workflow and provide summary
