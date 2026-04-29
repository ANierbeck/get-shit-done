---
name: gsd-check-todos
description: "List pending todos and select one to work on"
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
List all pending todos from .planning/todos/pending/ with title, area, age. Optional area filter. For selected todo: load full context, offer actions (work now, add to phase, brainstorm, later). Move todo to done/ when work begins. Track which area has most todos.
</process>
'<<'
# Check Todos

List all pending todos, allow selection, load full context for the selected todo, and route to appropriate action.

Routes to the check-todos workflow which handles:
- Todo counting and listing with area filtering
- Interactive selection with full context loading
- Roadmap correlation checking
- Action routing (work now, add to phase, brainstorm, create phase)
- STATE.md updates and git commits

## Process

**Follow the check-todos workflow** from `
The workflow handles all logic including:
1. Todo existence checking
2. Area filtering
3. Interactive listing and selection
4. Full context loading with file summaries
5. Roadmap correlation checking
6. Action offering and execution
7. STATE.md updates
8. Git commits
