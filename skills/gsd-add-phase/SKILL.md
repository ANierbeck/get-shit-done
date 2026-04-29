---
name: gsd-add-phase
description: "Add phase to end of current milestone in roadmap"
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
Add new phase to end of current milestone. Use next sequential phase number. Prompt user for phase name and description. Append to ROADMAP.md with goal and success criteria. Create .planning/phases/XX-name/ directory. Update STATE.md with new phase. Commit planning docs if configured.
</process>
'<<'
# Add Phase

Add a new integer phase to the end of the current milestone in the roadmap.

Routes to the add-phase workflow which handles:
- Phase number calculation (next sequential integer)
- Directory creation with slug generation
- Roadmap structure updates
- STATE.md roadmap evolution tracking

## Process

**Follow the add-phase workflow** from `
The workflow handles all logic including:
1. Argument parsing and validation
2. Roadmap existence checking
3. Current milestone identification
4. Next phase number calculation (ignoring decimals)
5. Slug generation from description
6. Phase directory creation
7. Roadmap entry insertion
8. STATE.md updates
