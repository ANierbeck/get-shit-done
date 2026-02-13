---
name: add-phase
description: Add a new phase to the end of the current milestone in a project roadmap. Use when you need to append planned work discovered during execution that belongs at the end of the current milestone.
license: MIT
metadata:
  author: get-shit-done
  version: "1.0"
  category: project-management
  gsd-tools: core-operations, state-management
allowed-tools: Read Write Bash
---

# Add-Phase Skill

## Objective

Add a new integer phase to the end of the current milestone in the roadmap. This command appends sequential phases to the current milestone's phase list, automatically calculating the next phase number based on existing phases.

**Purpose:** Add planned work discovered during execution that belongs at the end of current milestone.

**Files Modified:**
- `.planning/ROADMAP.md` — Updated with new phase entry
- `.planning/STATE.md` — Updated with roadmap evolution note
- `.planning/phases/{NN}-{slug}/` — New phase directory created

## When to Use

- When new work is discovered during project execution that needs to be added to the current milestone
- When breaking down large phases into smaller, more manageable units
- When extending the current milestone with additional phases
- When work emerges that logically belongs at the end of the current milestone

**Do NOT use when:**
- The work belongs in a different milestone (use milestone planning instead)
- You need to insert a phase in the middle of the milestone (use insert-phase)
- The work is already planned in an existing phase

## Process

### 1. Parse Arguments
Parse the command arguments:
- All arguments become the phase description
- Example: `/gsd:add-phase Add authentication` → description = "Add authentication"
- Example: `/gsd:add-phase Fix critical performance issues` → description = "Fix critical performance issues"

**Error Handling:** If no arguments provided:
```
ERROR: Phase description required
Usage: /gsd:add-phase <description>
Example: /gsd:add-phase Add authentication system
```
Exit the command.

### 2. Load Roadmap
Load the roadmap file:
```bash
if [ -f .planning/ROADMAP.md ]; then
  ROADMAP=".planning/ROADMAP.md"
else
  echo "ERROR: No roadmap found (.planning/ROADMAP.md)"
  exit 1
fi
```
Read roadmap content for parsing.

### 3. Find Current Milestone
Parse the roadmap to find the current milestone section:

1. Locate the "## Current Milestone:" heading
2. Extract milestone name and version
3. Identify all phases under this milestone (before next "---" separator or next milestone heading)
4. Parse existing phase numbers (including decimals if present)

**Example structure:**
```markdown
## Current Milestone: v1.0 Foundation

### Phase 4: Focused Command System
### Phase 5: Path Routing & Validation  
### Phase 6: Documentation & Distribution
```

### 4. Calculate Next Phase Number
Find the highest integer phase number in the current milestone:

1. Extract all phase numbers from phase headings (### Phase N:)
2. Filter to integer phases only (ignore decimals like 4.1, 4.2)
3. Find the maximum integer value
4. Add 1 to get the next phase number

**Example:** If phases are 4, 5, 5.1, 6 → next is 7

Format as two-digit:
```bash
printf "%02d" $next_phase
```

### 5. Generate Slug
Convert the phase description to a kebab-case slug:
```bash
# Example transformation:
# "Add authentication" → "add-authentication"
# "Fix critical performance issues" → "fix-critical-performance-issues"

slug=$(echo "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')
```

**Phase directory name:** `{two-digit-phase}-{slug}`
**Example:** `07-add-authentication`

### 6. Create Phase Directory
Create the phase directory structure:
```bash
phase_dir=".planning/phases/${phase_num}-${slug}"
mkdir -p "$phase_dir"
```

Confirm: "Created directory: $phase_dir"

### 7. Update Roadmap
Add the new phase entry to the roadmap:

1. Find the insertion point (after last phase in current milestone, before "---" separator)
2. Insert new phase heading:

```markdown
### Phase {N}: {Description}

**Goal:** [To be planned]
**Depends on:** Phase {N-1}
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase {N} to break down)

**Details:**
[To be added during planning]
```

3. Write updated roadmap back to file
4. Preserve all other content exactly (formatting, spacing, other phases)

### 8. Update Project State
Update STATE.md to reflect the new phase:

1. Read `.planning/STATE.md`
2. Under "## Current Position" → "**Next Phase:**" add reference to new phase
3. Under "## Accumulated Context" → "### Roadmap Evolution" add entry:
```markdown
- Phase {N} added: {description}
```

If "Roadmap Evolution" section doesn't exist, create it.

### 9. Completion
Present completion summary:
```
Phase {N} added to current milestone:
- Description: {description}
- Directory: .planning/phases/{phase-num}-{slug}/
- Status: Not planned yet

Roadmap updated: {roadmap-path}
Project state updated: .planning/STATE.md

---

## ▶ Next Up

**Phase {N}: {description}**

`/gsd:plan-phase {N}`

<sub>`/clear` first → fresh context window</sub>

---

**Also available:**
- `/gsd:add-phase <description>` — add another phase
- Review roadmap

---
```

## Output

- **New phase directory:** `.planning/phases/{NN}-{slug}/`
- **Updated roadmap:** `.planning/ROADMAP.md` with new phase entry
- **Updated state:** `.planning/STATE.md` with roadmap evolution note
- **Completion message:** Summary with next steps

## Success Criteria

- [ ] Phase directory created: `.planning/phases/{NN}-{slug}/`
- [ ] Roadmap updated with new phase entry in the correct position
- [ ] STATE.md updated with roadmap evolution note
- [ ] New phase appears at end of current milestone
- [ ] Next phase number calculated correctly (ignoring decimal phases)
- [ ] User informed of completion and next steps
- [ ] All existing content preserved (formatting, other phases)

## Anti-Patterns

- **Don't modify phases outside current milestone** — This command only affects the current milestone
- **Don't renumber existing phases** — New phase gets the next sequential number
- **Don't use decimal numbering** — That's what `/gsd:insert-phase` is for
- **Don't create plans yet** — Planning happens with `/gsd:plan-phase`
- **Don't commit changes automatically** — Let user decide when to commit
- **Don't add phases to completed milestones** — Create new milestone instead

## Examples

### Example 1: Adding Authentication Phase
```
Input: /gsd:add-phase "Add authentication system"
Output:
- Phase 07 added: "Add authentication system"
- Directory: .planning/phases/07-add-authentication/
- Roadmap updated with phase entry
- STATE.md updated with evolution note
```

### Example 2: Adding Performance Fix
```
Input: /gsd:add-phase "Fix critical performance issues"
Output:
- Phase 08 added: "Fix critical performance issues"
- Directory: .planning/phases/08-fix-critical-performance-issues/
- Roadmap and state files updated
- User presented with next steps
```

### Example 3: Error Handling (Missing Arguments)
```
Input: /gsd:add-phase
Output:
ERROR: Phase description required
Usage: /gsd:add-phase <description>
Example: /gsd:add-phase Add authentication system
```

## Error Handling

- **No roadmap found:** Display clear error with setup instructions
- **No arguments provided:** Show usage examples and exit gracefully
- **Phase directory creation fails:** Provide detailed error information
- **Roadmap write fails:** Preserve original file and inform user
- **State file missing:** Create STATE.md if it doesn't exist
- **Duplicate phase detection:** Inform user and suggest alternatives
