---
name: add-todo
description: Capture idea or task as todo from current conversation context. Use when you need to quickly capture ideas, tasks, or issues during a GSD session without losing context or derailing current work.
license: MIT
metadata:
  author: get-shit-done
  version: "1.0"
  category: project-management
  gsd-tools: core-operations, state-management
allowed-tools: Read Write Bash Glob
---

# Add-Todo Skill

## Objective

Capture an idea, task, or issue that surfaces during a GSD session as a structured todo for later work. Enables "thought → capture → continue" flow without losing context or derailing current work.

## When to Use

- When an idea or task emerges during conversation that isn't part of the current plan
- When you need to capture context for future work without interrupting current flow
- When technical details, file references, or error messages need to be preserved
- When you want to document issues for later resolution

## Process

### 1. Ensure Directory Structure
```bash
mkdir -p .planning/todos/pending .planning/todos/done
```

### 2. Check Existing Areas
```bash
ls .planning/todos/pending/*.md 2>/dev/null | xargs -I {} grep "^area:" {} 2>/dev/null | cut -d' ' -f2 | sort -u
```
Note existing areas for consistency in area inference step.

### 3. Extract Content
**With arguments:** Use as the title/focus.
- `/gsd:add-todo Add auth token refresh` → title = "Add auth token refresh"

**Without arguments:** Analyze recent conversation to extract:
- The specific problem, idea, or task discussed
- Relevant file paths mentioned
- Technical details (error messages, line numbers, constraints)

Formulate:
- `title`: 3-10 word descriptive title (action verb preferred)
- `problem`: What's wrong or why this is needed
- `solution`: Approach hints or "TBD" if just an idea
- `files`: Relevant paths with line numbers from conversation

### 4. Infer Area
Infer area from file paths:

| Path pattern | Area |
|--------------|------|
| `src/api/*`, `api/*` | `api` |
| `src/components/*`, `src/ui/*` | `ui` |
| `src/auth/*`, `auth/*` | `auth` |
| `src/db/*`, `database/*` | `database` |
| `tests/*`, `__tests__/*` | `testing` |
| `docs/*` | `docs` |
| `.planning/*` | `planning` |
| `scripts/*`, `bin/*` | `tooling` |
| No files or unclear | `general` |

Use existing area from step 2 if similar match exists.

### 5. Check for Duplicates
```bash
grep -l -i "[key words from title]" .planning/todos/pending/*.md 2>/dev/null
```

If potential duplicate found:
1. Read the existing todo
2. Compare scope

If overlapping, resolve using:
- **Skip** — keep existing todo
- **Replace** — update existing with new context
- **Add anyway** — create as separate todo

### 6. Create Todo File
```bash
timestamp=$(date "+%Y-%m-%dT%H:%M")
date_prefix=$(date "+%Y-%m-%d")
```

Generate slug from title (lowercase, hyphens, no special chars in filename).

Write to `.planning/todos/pending/${date_prefix}-${slug}.md`:

```markdown
---
created: [timestamp]
title: [title]
area: [area]
files:
  - [file:lines]
---

## Problem

[problem description - enough context for future Claude to understand weeks later]

## Solution

[approach hints or "TBD"]
```

### 7. Update Project State
If `.planning/STATE.md` exists:

1. Count todos: `ls .planning/todos/pending/*.md 2>/dev/null | wc -l`
2. Update "### Pending Todos" under "## Accumulated Context"

### 8. Git Commit
Check planning config:
```bash
COMMIT_PLANNING_DOCS=$(cat .planning/config.json 2>/dev/null | grep -o '"commit_docs"[[:space:]]*:[[:space:]]*[^,}]*' | grep -o 'true\|false' || echo "true")
git check-ignore -q .planning 2>/dev/null && COMMIT_PLANNING_DOCS=false
```

**If `COMMIT_PLANNING_DOCS=false`:** Skip git operations, log "Todo saved (not committed - commit_docs: false)"

**If `COMMIT_PLANNING_DOCS=true` (default):**
```bash
git add .planning/todos/pending/[filename]
[ -f .planning/STATE.md ] && git add .planning/STATE.md
git commit -m "$(cat <<'EOF'
docs: capture todo - [title]

Area: [area]
EOF
)"
```

### 9. Confirmation
Present completion summary:
```
Todo saved: .planning/todos/pending/[filename]

  [title]
  Area: [area]
  Files: [count] referenced

---

Would you like to:

1. Continue with current work
2. Add another todo
3. View all todos (/gsd:check-todos)
```

## Output

- `.planning/todos/pending/[date]-[slug].md` - Structured todo file
- Updated `.planning/STATE.md` (if exists) with todo count

## Success Criteria

- [ ] Directory structure exists (.planning/todos/pending/)
- [ ] Todo file created with valid frontmatter (created, title, area, files)
- [ ] Problem section has enough context for future reference
- [ ] No duplicates (checked and resolved appropriately)
- [ ] Area consistent with existing todos and path patterns
- [ ] STATE.md updated with pending todo count if it exists
- [ ] Todo and state committed to git (if commit_docs enabled)

## Anti-Patterns

- Don't create todos for work already in current plan (use deviation rules instead)
- Don't create elaborate solution sections — this captures ideas, not detailed plans
- Don't block on missing information — "TBD" is acceptable for future resolution
- Don't create todos for trivial or obvious tasks

## Examples

### Example 1: Adding Authentication Todo
```
Input: "Add auth token refresh mechanism"
Output:
- File: .planning/todos/pending/2024-02-06-add-auth-token-refresh.md
- Title: "Add auth token refresh mechanism"
- Area: "auth"
- Problem: "Current auth tokens expire after 1 hour, need automatic refresh"
- Solution: "Implement OAuth2 token refresh flow with silent authentication"
```

### Example 2: Capturing Bug from Conversation
```
Input: (from conversation about login issues)
Output:
- File: .planning/todos/pending/2024-02-06-fix-login-redirect.md
- Title: "Fix login redirect loop on mobile"
- Area: "auth"
- Problem: "Users on mobile devices get stuck in redirect loop after login"
- Solution: "Investigate cookie handling and session storage on mobile browsers"
- Files: "src/auth/login.tsx:42, src/auth/session.ts:18"
```

## Error Handling

- **Missing directories**: Create required directory structure automatically
- **Duplicate detection**: Offer clear resolution options (skip/replace/add)
- **Invalid arguments**: Provide usage examples and guidance
- **Git errors**: Continue with todo creation but log git failure
- **File write errors**: Provide clear error messages with troubleshooting steps
