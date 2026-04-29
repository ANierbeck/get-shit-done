---
name: gsd-add-todo
description: "Capture idea or task as todo from current conversation context"
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
Capture idea or task from current conversation context. Extract title, area (from file paths), and description. Create structured todo file in .planning/todos/pending/ with YAML frontmatter. Check for duplicates before creating. Update STATE.md todo count. Confirm creation with user.
</process>
'<<'
# Add Todo

Capture an idea, task, or issue that surfaces during a GSD session as a structured todo for later work.

Routes to the add-todo workflow which handles:
- Directory structure creation
- Content extraction from arguments or conversation
- Area inference from file paths
- Duplicate detection and resolution
- Todo file creation with frontmatter
- STATE.md updates
- Git commits

## Process

**Follow the add-todo workflow** from `
The workflow handles all logic including:
1. Directory ensuring
2. Existing area checking
3. Content extraction (arguments or conversation)
4. Area inference
5. Duplicate checking
6. File creation with slug generation
7. STATE.md updates
8. Git commits
