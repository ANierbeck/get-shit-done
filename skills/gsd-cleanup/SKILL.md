---
name: gsd-cleanup
description: "Archive accumulated phase directories from completed milestones"
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
Archive accumulated phase directories from completed milestones. Identify phases from completed milestones still in .planning/phases/. Show dry-run summary before moving. Move phase dirs to .planning/milestones/vX.Y-phases/. Reduce clutter.
</process>
'<<'
# Cleanup

Archive phase directories from completed milestones into `.planning/milestones/v{X.Y}-phases/`.

Use when `.planning/phases/` has accumulated directories from past milestones.

## Process

Follow the cleanup workflow at 
Identify completed milestones, show a dry-run summary, and archive on confirmation.
