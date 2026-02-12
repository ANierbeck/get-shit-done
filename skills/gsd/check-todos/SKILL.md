---
name: check-todos
description: List pending todos and select one to work on. Use when you need to review captured ideas, decide what to work on next, or manage your todo backlog.
license: MIT
metadata:
  author: get-shit-done
  version: "1.0"
  category: project-management
allowed-tools: Read Write Bash Glob AskUserQuestion
---

# Check-Todos Skill

## Objective

List all pending todos, allow selection, load full context for the selected todo, and route to appropriate action. Enables reviewing captured ideas and deciding what to work on next.

**Files Accessed:**
- `.planning/todos/pending/*.md` — Pending todo files
- `.planning/todos/done/*.md` — Completed todo archive
- `.planning/STATE.md` — Project state tracking
- `.planning/ROADMAP.md` — Roadmap context (optional)

## When to Use

- When you need to review your backlog of captured ideas and tasks
- When deciding what to work on next in your project
- When you want to organize or prioritize pending work
- When checking if existing todos relate to current work

**Best Practices:**
- Run this command when starting a new work session
- Use area filtering to focus on specific project areas
- Review todos before planning new phases
- Clean up todos that are no longer relevant

## Process

### 1. Check Todo Existence
```bash
TODO_COUNT=$(ls .planning/todos/pending/*.md 2>/dev/null | wc -l | tr -d ' ')
echo "Pending todos: $TODO_COUNT"
```

**If count is 0:**
```
No pending todos.

Todos are captured during work sessions with /gsd:add-todo.

---

Would you like to:

1. Continue with current phase (/gsd:progress)
2. Add a todo now (/gsd:add-todo)
```
Exit the command.

### 2. Parse Area Filter
Check for area filter in arguments:
- `/gsd:check-todos` → show all todos
- `/gsd:check-todos api` → filter to area:api only
- `/gsd:check-todos ui database` → filter to multiple areas

### 3. List Todos
```bash
for file in .planning/todos/pending/*.md; do
  created=$(grep "^created:" "$file" | cut -d' ' -f2)
  title=$(grep "^title:" "$file" | cut -d':' -f2- | xargs)
  area=$(grep "^area:" "$file" | cut -d' ' -f2)
  echo "$created|$title|$area|$file"
done | sort
```

Apply area filter if specified. Format age as relative time (e.g., "2d ago", "5h ago").

Display as numbered list:
```
Pending Todos:

1. Add auth token refresh (api, 2d ago)
2. Fix modal z-index issue (ui, 1d ago)
3. Refactor database connection pool (database, 5h ago)

---

Reply with a number to view details, or:
- `/gsd:check-todos [area]` to filter by area
- `q` to exit
```

### 4. Handle Selection
Wait for user to reply with a number.

**If valid:** Load selected todo, proceed to context loading.
**If invalid:** "Invalid selection. Reply with a number (1-[N]) or `q` to exit."

### 5. Load Todo Context
Read the todo file completely. Display:
```markdown
## [title]

**Area:** [area]
**Created:** [date] ([relative time] ago)
**Files:** [list or "None"]

### Problem
[problem section content]

### Solution
[solution section content]
```

If `files` field has entries, read and briefly summarize each referenced file.

### 6. Check Roadmap Context
```bash
ls .planning/ROADMAP.md 2>/dev/null && echo "Roadmap exists"
```

**If roadmap exists:**
1. Check if todo's area matches an upcoming phase
2. Check if todo's files overlap with a phase's scope
3. Note any matches for action recommendations

### 7. Offer Actions

**If todo maps to a roadmap phase:**

Use AskUserQuestion:
- **header:** "Action"
- **question:** "This todo relates to Phase [N]: [name]. What would you like to do?"
- **options:**
  - "Work on it now" — move to done, start working
  - "Add to phase plan" — include when planning Phase [N]
  - "Brainstorm approach" — think through before deciding
  - "Put it back" — return to list

**If no roadmap match:**

Use AskUserQuestion:
- **header:** "Action"
- **question:** "What would you like to do with this todo?"
- **options:**
  - "Work on it now" — move to done, start working
  - "Create a phase" — /gsd:add-phase with this scope
  - "Brainstorm approach" — think through before deciding
  - "Put it back" — return to list

### 8. Execute Selected Action

**Work on it now:**
```bash
mv ".planning/todos/pending/[filename]" ".planning/todos/done/"
```
- Update STATE.md todo count
- Present problem/solution context
- Begin work or ask how to proceed

**Add to phase plan:**
- Note todo reference in phase planning notes
- Keep in pending
- Return to list or exit

**Create a phase:**
- Display: `/gsd:add-phase [description from todo]`
- Keep in pending
- User runs command in fresh context

**Brainstorm approach:**
- Keep in pending
- Start discussion about problem and approaches
- Return to list when done

**Put it back:**
- Return to list_todos step

### 9. Update Project State
After any action that changes todo count:
```bash
ls .planning/todos/pending/*.md 2>/dev/null | wc -l
```
Update STATE.md "### Pending Todos" section if it exists.

### 10. Git Commit
If todo was moved to done/, commit the change:

**Check planning config:**
```bash
COMMIT_PLANNING_DOCS=$(cat .planning/config.json 2>/dev/null | grep -o '"commit_docs"[[:space:]]*:[[:space:]]*[^,}]*' | grep -o 'true\|false' || echo "true")
git check-ignore -q .planning 2>/dev/null && COMMIT_PLANNING_DOCS=false
```

**If `COMMIT_PLANNING_DOCS=false`:** Skip git operations, log "Todo moved (not committed - commit_docs: false)"

**If `COMMIT_PLANNING_DOCS=true` (default):**
```bash
git add .planning/todos/done/[filename]
git rm --cached .planning/todos/pending/[filename] 2>/dev/null || true
[ -f .planning/STATE.md ] && git add .planning/STATE.md
git commit -m "$(cat <<'EOF'
docs: start work on todo - [title]

Moved to done/, beginning implementation.
EOF
)"
```

Confirm: "Committed: docs: start work on todo - [title]"

## Output

- **Todo moved to done/:** `.planning/todos/done/[filename]` (if "Work on it now" selected)
- **Updated state:** `.planning/STATE.md` (if todo count changed)
- **Git commit:** Changes committed if `commit_docs` enabled
- **User guidance:** Next steps and action confirmation

## Success Criteria

- [ ] All pending todos listed with title, area, and relative age
- [ ] Area filter applied correctly if specified
- [ ] Selected todo's full context loaded and displayed
- [ ] Roadmap context checked for phase matches
- [ ] Appropriate actions offered based on context
- [ ] Selected action executed properly
- [ ] STATE.md updated if todo count changed
- [ ] Changes committed to git if todo moved to done/
- [ ] User provided clear next steps

## Anti-Patterns

- **Don't delete todos** — Always move to done/ when work begins (preserves history)
- **Don't start work without moving to done/ first** — Maintains accurate todo tracking
- **Don't create plans from this command** — Route to /gsd:plan-phase or /gsd:add-phase instead
- **Don't leave todos unreviewed** — Regularly check and process pending todos
- **Don't use this for active work** — This is for backlog management, not execution

## Examples

### Example 1: Reviewing and Starting a Todo
```
Input: /gsd:check-todos
User selects: 2 (Fix modal z-index issue)
Action: Work on it now
Output:
- Todo moved to .planning/todos/done/fix-modal-z-index-issue.md
- STATE.md updated (pending count decreased)
- Git commit created
- User presented with problem/solution context
```

### Example 2: Filtering by Area
```
Input: /gsd:check-todos api
Output:
Pending Todos (api area):
1. Add auth token refresh (api, 2d ago)
2. Implement rate limiting (api, 1d ago)
```

### Example 3: No Todos Available
```
Input: /gsd:check-todos
Output:
No pending todos.

Would you like to:
1. Continue with current phase (/gsd:progress)
2. Add a todo now (/gsd:add-todo)
```

### Example 4: Adding to Phase Plan
```
Input: /gsd:check-todos
User selects: 3 (Refactor database connection)
Action: Add to phase plan
Output:
- Todo kept in pending
- Reference added to Phase 4 planning notes
- User returns to todo list
```

## Error Handling

- **No pending todos:** Display helpful message with action options
- **Invalid selection:** Prompt user to try again with valid range
- **Missing todo files:** Handle gracefully, inform user
- **Roadmap not found:** Continue without roadmap context
- **Git commit failures:** Log error but continue operation
- **File read errors:** Provide clear error messages with troubleshooting
