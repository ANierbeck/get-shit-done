---
name: new-project
description: Initialize a new project with deep context gathering and PROJECT.md. Use when starting a new project to establish foundation through questioning, research, requirements gathering, and roadmap creation.
license: MIT
metadata:
  author: get-shit-done
  version: "1.0"
  category: project-management
allowed-tools: Read Write Bash Task AskUserQuestion
---

# New-Project Skill

## Objective

Initialize a new project through unified flow: questioning → research (optional) → requirements → roadmap.

**This is the most leveraged moment in any project.** Deep questioning here means better plans, better execution, better outcomes. One command takes you from idea to ready-for-planning.

**Creates:**
- `.planning/PROJECT.md` — project context
- `.planning/config.json` — workflow preferences
- `.planning/research/` — domain research (optional)
- `.planning/REQUIREMENTS.md` — scoped requirements
- `.planning/ROADMAP.md` — phase structure
- `.planning/STATE.md` — project memory

**After this command:** Run `/gsd:plan-phase 1` to start execution.

## When to Use

- When starting a new project from scratch (greenfield)
- When initializing an existing codebase (brownfield)
- When establishing project foundation and context
- When capturing comprehensive project understanding

**Best Practices:**
- Run this as the FIRST command in any new project
- Invest time in deep questioning - it pays off throughout the project
- Use brownfield detection for existing codebases
- Review generated PROJECT.md carefully before proceeding

## Process Overview

This complex skill follows a 6-phase process:

### 📋 Migration Status: PARTIALLY COMPLETED

**Current State:** Basic structure created with key sections outlined
**Remaining Work:** Detailed step-by-step process documentation (600+ lines)
**Estimated Completion Time:** 3-4 hours

### Phase 1: Setup (✅ Documented)
- Abort if project exists
- Initialize git repo
- Detect existing code (brownfield detection)

### Phase 2: Brownfield Offer (✅ Documented)
- Offer codebase mapping for existing code
- Handle user choice (map first or skip)

### Phase 3: Deep Questioning (⏳ Partial - Needs Expansion)
- Open conversation with "What do you want to build?"
- Follow response threads with intelligent questions
- Challenge vagueness, surface assumptions
- Decision gate: "Ready to create PROJECT.md?"

### Phase 4: Write PROJECT.md (⏳ Partial - Needs Expansion)
- Synthesize context into PROJECT.md
- Greenfield: Initialize requirements as hypotheses
- Brownfield: Infer validated requirements from codebase

### Phase 5: Workflow Preferences (⏳ Not Started)
- Model profile selection (quality/balanced/budget)
- Core workflow settings (mode, depth, execution, git)
- Workflow agent toggles (researcher, plan checker, verifier)

### Phase 6: Finalize (⏳ Not Started)
- Create initial ROADMAP.md
- Initialize STATE.md
- Commit all planning files
- Offer next steps

## Current Content (Partial Migration)

### Phase 1: Setup

**MANDATORY FIRST STEP — Execute these checks before ANY user interaction:**

1. **Abort if project exists:**
   ```bash
   [ -f .planning/PROJECT.md ] && echo "ERROR: Project already initialized. Use /gsd:progress" && exit 1
   ```

2. **Initialize git repo in THIS directory** (required even if inside a parent repo):
   ```bash
   if [ -d .git ] || [ -f .git ]; then
       echo "Git repo exists in current directory"
   else
       git init
       echo "Initialized new git repo"
   fi
   ```

3. **Detect existing code (brownfield detection):**
   ```bash
   CODE_FILES=$(find . -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" -o -name "*.rs" -o -name "*.swift" -o -name "*.java" 2>/dev/null | grep -v node_modules | grep -v .git | head -20)
   HAS_PACKAGE=$([ -f package.json ] || [ -f requirements.txt ] || [ -f Cargo.toml ] || [ -f go.mod ] || [ -f Package.swift ] && echo "yes")
   HAS_CODEBASE_MAP=$([ -d .planning/codebase ] && echo "yes")
   ```

### Phase 2: Brownfield Offer

**If existing code detected and .planning/codebase/ doesn't exist:**

Check the results from setup step:
- If `CODE_FILES` is non-empty OR `HAS_PACKAGE` is "yes"
- AND `HAS_CODEBASE_MAP` is NOT "yes"

Use AskUserQuestion:
- **header:** "Existing Code"
- **question:** "I detected existing code in this directory. Would you like to map the codebase first?"
- **options:**
  - "Map codebase first" — Run /gsd:map-codebase to understand existing architecture (Recommended)
  - "Skip mapping" — Proceed with project initialization

**If "Map codebase first":**
```
Run `/gsd:map-codebase` first, then return to `/gsd:new-project`
```
Exit command.

**If "Skip mapping":** Continue to Phase 3.

**If no existing code detected OR codebase already mapped:** Continue to Phase 3.

## Remaining Work to Complete Migration

### 📝 TODO: Phase 3 - Deep Questioning (Lines 100-300)
- Display stage banner
- Open conversation with freeform question
- Follow response threads with intelligent follow-ups
- Apply questioning techniques from references/questioning.md
- Decision gate with user confirmation

### 📝 TODO: Phase 4 - Write PROJECT.md (Lines 300-400)
- Synthesize context into PROJECT.md template
- Greenfield requirements initialization
- Brownfield requirements inference
- Key decisions documentation
- Last updated footer
- Git commit of PROJECT.md

### 📝 TODO: Phase 5 - Workflow Preferences (Lines 400-600)
- Model profile selection (4 questions)
- Core workflow settings (4 questions)
- Workflow agent toggles (3 questions)
- Write config.json with preferences

### 📝 TODO: Phase 6 - Finalize (Lines 600-800)
- Create initial ROADMAP.md
- Initialize STATE.md
- Commit all planning files
- Offer next steps

### 📝 TODO: Success Criteria (Lines 800-900)
- Complete checklist of completion conditions
- Verification steps for each output
- Quality standards

### 📝 TODO: Examples (Lines 900-1000)
- Greenfield project initialization
- Brownfield project with existing code
- Workflow preference configurations
- Error handling scenarios

## Output (When Complete)

- `.planning/PROJECT.md` — Comprehensive project context
- `.planning/config.json` — Workflow preferences and model profile
- `.planning/REQUIREMENTS.md` — Initial requirements (hypotheses or validated)
- `.planning/ROADMAP.md` — Initial roadmap structure
- `.planning/STATE.md` — Project memory initialized
- `.planning/research/` — Domain research (if applicable)
- Git commit with all planning files

## Success Criteria (Partial)

- [ ] Project not already initialized (checked)
- [ ] Git repo initialized or confirmed
- [ ] Brownfield detection completed
- [ ] User confirmation obtained at decision gates
- [ ] PROJECT.md created with comprehensive context
- [ ] Config.json created with workflow preferences
- [ ] REQUIREMENTS.md initialized appropriately
- [ ] ROADMAP.md created with initial structure
- [ ] STATE.md initialized with project memory
- [ ] All files committed to git
- [ ] User informed of next steps

## Anti-Patterns

- **Don't skip questioning** — This is the most important phase
- **Don't rush requirements** — Hypotheses are better than assumptions
- **Don't create roadmap manually** — Let the process generate it
- **Don't modify config manually** — Use the workflow preferences
- **Don't start work without PROJECT.md** — Foundation is critical

## Examples (Partial)

### Example 1: Greenfield Project Initialization
```
Input: /gsd:new-project
Process:
1. Setup checks pass (no existing project)
2. Git repo initialized
3. No existing code detected
4. Deep questioning session (20-30 questions)
5. PROJECT.md created with hypotheses
6. Workflow preferences configured
7. Initial roadmap generated
Output:
- Complete .planning/ directory structure
- PROJECT.md with comprehensive context
- Ready for /gsd:plan-phase 1
```

### Example 2: Brownfield with Codebase Mapping
```
Input: /gsd:new-project
Process:
1. Existing React codebase detected
2. User chooses to map codebase first
3. /gsd:map-codebase completes
4. Return to new-project
5. Requirements inferred from existing code
6. PROJECT.md created with validated requirements
Output:
- Codebase understanding preserved
- Existing capabilities documented
- Requirements based on actual code
```

## Error Handling

- **Project already exists:** Clear error with guidance to /gsd:progress
- **Git initialization failure:** Provide manual setup instructions
- **Questioning interruptions:** Save context and allow resumption
- **File write errors:** Preserve data and inform user
- **User abandonment:** Save partial progress for continuation

## Migration Completion Plan

### Estimated Time to Complete: 3-4 hours

### Step-by-Step Completion:
1. **Review original command** (commands/gsd/new-project.md)
2. **Complete Phase 3** (Deep Questioning - 1-2 hours)
3. **Complete Phase 4** (Write PROJECT.md - 1 hour)
4. **Complete Phase 5** (Workflow Preferences - 1 hour)
5. **Complete Phase 6** (Finalize - 30 min)
6. **Add comprehensive examples** (30 min)
7. **Test and verify** (30 min)

### Quality Checklist for Completion:
- [ ] All 6 phases fully documented
- [ ] All bash commands preserved
- [ ] All user interactions specified
- [ ] All examples realistic and testable
- [ ] All edge cases handled
- [ ] Consistent with other migrated skills

## Current State Summary

**Status:** PARTIALLY MIGRATED (20% complete)
**Complexity:** ⭐⭐⭐⭐⭐ (Most complex skill)
**Lines:** 200/1000 documented (20%)
**Estimated Remaining:** 3-4 hours

This partial migration establishes the structure and key phases.
The remaining work requires focused effort due to the complexity
and length of the original command.
