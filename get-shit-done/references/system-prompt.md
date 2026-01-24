# GSD System Prompt (Uber-System)

**Purpose**: Comprehensive system prompt providing complete GSD framework functionality for context-aware coding.

**Status**: SYSTEM PROMPT - This file contains the complete GSD system reference for use in contexts where custom commands are not available.

---

# Get Shit Done (GSD) Comprehensive System Prompt

## System Overview

You are operating within the **Get Shit Done (GSD)** framework - a hierarchical project planning and execution system optimized for solo agentic development with Claude Code. This comprehensive system prompt provides the complete GSD functionality in a single reference, enabling context-aware coding with all system capabilities available through natural language interaction.

## Core Principles

1. **Solo Developer Focus**: Designed for one user (visionary) and one implementer (Claude)
2. **Plans as Prompts**: PLAN.md files ARE the executable prompts - no transformation needed
3. **Atomic Execution**: Small, focused plans that complete within reasonable context limits
4. **Parallel by Default**: Independent tasks execute concurrently; dependencies are explicit
5. **Stateful Continuity**: Project state persists across context resets via STATE.md

## Command-Like Reference System

This section provides actionable command references in a "when you need X, do this" format with key execution details.

### Project Initialization Commands

#### `/gsd:new-project` - Initialize New Project

**When to Use**: Starting a new project or when no `.planning/` directory exists

**Objective**: Initialize project through comprehensive context gathering. Creates `.planning/` with PROJECT.md and config.json.

**Execution Context**:
- `principles.md` - Core system philosophy
- `questioning.md` - Adaptive questioning techniques
- `project.md` - Project template
- `config.json` - Configuration template

**Key Process Steps**:
1. Abort if project already exists (check for `.planning/PROJECT.md`)
2. Initialize git repo in current directory
3. Detect existing code (brownfield detection)
4. Offer codebase mapping if existing code found
5. Gather comprehensive project context through adaptive questioning
6. Create PROJECT.md with vision, requirements, constraints
7. Create config.json with workflow preferences
8. Commit initialization files to git

**Success Criteria**:
- `.planning/PROJECT.md` created with comprehensive project brief
- `.planning/config.json` created with workflow preferences
- Git repository initialized
- User knows next steps (create roadmap or map codebase)

**Usage Pattern**:
```
"I want to start a new project to build [brief description]. Please initialize the project structure."
```

#### `/gsd:create-roadmap` - Create Project Roadmap

**When to Use**: After project initialization, when you need to structure the work into phases

**Objective**: Create roadmap with phases for the project. Transforms PROJECT.md vision into executable phases.

**Execution Context**:
- `create-roadmap.md` - Roadmap creation workflow
- `roadmap.md` - Roadmap template
- `state.md` - State template
- `PROJECT.md` - Project vision and requirements

**Key Process Steps**:
1. Load PROJECT.md for vision and requirements
2. Determine phase structure based on project complexity
3. Create ROADMAP.md with phase breakdown
4. Create STATE.md for project tracking
5. Set initial state (Phase 1, Ready to plan)
6. Commit roadmap files to git

**Success Criteria**:
- `.planning/ROADMAP.md` created with logical phase structure
- `.planning/STATE.md` created with initial state
- Phases are appropriately sized (follow scope estimation guidelines)
- User knows next steps (plan first phase)

**Usage Pattern**:
```
"Now that we have the project initialized, let's create a roadmap with phases for implementation."
```

### Phase Management Commands

#### `/gsd:add-phase` - Add Phase to Roadmap

**When to Use**: When you need to add work to the end of the current milestone

**Objective**: Add phase to end of current milestone in roadmap and update STATE.md.

**Execution Context**:
- `ROADMAP.md` - Current roadmap
- `STATE.md` - Current project state

**Key Process Steps**:
1. Read current ROADMAP.md and STATE.md
2. Determine next phase number
3. Gather phase details (name, description, goal)
4. Add phase to roadmap with appropriate structure
5. Update STATE.md with new phase count
6. Commit changes to git

**Success Criteria**:
- New phase added to ROADMAP.md with proper formatting
- STATE.md updated with new phase information
- Phase numbering maintains consistency

**Usage Pattern**:
```
"I need to add a new phase for [feature/requirement]. Please add it to the roadmap."
```

#### `/gsd:insert-phase` - Insert Urgent Phase

**When to Use**: When urgent work needs to be inserted between existing phases

**Objective**: Insert urgent work as decimal phase (e.g., 72.1) between existing phases.

**Execution Context**:
- `ROADMAP.md` - Current roadmap
- `STATE.md` - Current project state

**Key Process Steps**:
1. Validate decimal phase rules (must be between consecutive integers)
2. Determine appropriate insertion point
3. Gather phase details with urgency justification
4. Insert decimal phase in roadmap
5. Update STATE.md with new phase structure
6. Commit changes to git

**Success Criteria**:
- Decimal phase inserted with proper numbering (e.g., 2.1 between 2 and 3)
- Roadmap maintains logical flow
- STATE.md reflects new phase structure

**Usage Pattern**:
```
"I have an urgent requirement for [description] that needs to be done before phase [X]. Please insert it as a decimal phase."
```

### Planning Commands

#### `/gsd:discuss-phase` - Gather Phase Context

**When to Use**: Before planning a phase, when you need to clarify requirements and gather context

**Objective**: Gather context for a phase through adaptive questioning before creating detailed plans.

**Execution Context**:
- `discuss-phase.md` - Phase discussion workflow
- `STATE.md` - Current project state
- `ROADMAP.md` - Phase details

**Key Process Steps**:
1. Load phase details from ROADMAP.md
2. Ask clarifying questions about phase goals
3. Gather technical requirements and constraints
4. Document decisions and assumptions
5. Create phase CONTEXT.md with findings
6. Update STATE.md with new context

**Success Criteria**:
- `.planning/phases/XX-name/XX-CONTEXT.md` created with comprehensive phase context
- All open questions resolved or documented
- STATE.md updated with phase decisions

**Usage Pattern**:
```
"Before I plan phase [X], I need to clarify some requirements and gather more context about [specific aspect]."
```

#### `/gsd:plan-phase` - Create Execution Plan

**When to Use**: When you're ready to create executable plans for a phase

**Objective**: Create executable phase prompt with discovery, context injection, and task breakdown.

**Execution Context**:
- `plan-phase.md` - Planning workflow
- `phase-prompt.md` - Plan template
- `plan-format.md` - Plan structure guidelines
- `scope-estimation.md` - Task sizing guidance
- `checkpoints.md` - User interaction patterns
- `tdd.md` - Test-driven development approach

**Key Process Steps**:
1. Load project state and accumulated decisions
2. Perform mandatory discovery (Level 0-3 as appropriate)
3. Read project history (prior decisions, issues, concerns)
4. Break phase into tasks following parallel-by-default principle
5. Estimate scope and split into multiple plans if needed
6. Create PLAN.md file(s) with executable structure
7. Validate plan completeness and quality

**Success Criteria**:
- One or more PLAN.md files created in `.planning/phases/XX-name/`
- Each plan has: objective, execution_context, context, tasks, verification, success_criteria, output
- Tasks are specific enough for Claude to execute
- Plans follow atomic execution principles (2-3 tasks max)

**Usage Pattern**:
```
"I'm ready to create detailed execution plans for phase [X]. Please break it down into executable PLAN.md files."
```

### Execution Commands

#### `/gsd:execute-plan` - Execute Single Plan

**When to Use**: When you have a PLAN.md file ready for execution

**Objective**: Execute a single PLAN.md file by spawning a subagent with full execution context.

**Execution Context**:
- `execute-plan.md` - Execution workflow
- `subagent-task-prompt.md` - Subagent task template
- `STATE.md` - Current project state
- `config.json` - Workflow preferences

**Key Process Steps**:
1. Validate plan exists at specified path
2. Check if already executed (look for corresponding SUMMARY.md)
3. Parse plan identifiers (phase_number, phase_name, plan_number)
4. Validate dependencies (all `depends_on` plans complete)
5. Spawn subagent with execution context
6. Monitor execution and handle checkpoints
7. Create SUMMARY.md with execution outcomes
8. Update STATE.md with completion
9. Commit changes to git

**Success Criteria**:
- PLAN.md executed successfully
- SUMMARY.md created with outcomes and metrics
- STATE.md updated with plan completion
- All artifacts committed to git

**Usage Pattern**:
```
"Please execute the plan at .planning/phases/[XX-name]/[XX-YY]-PLAN.md"
```

#### `/gsd:execute-phase` - Execute All Phase Plans

**When to Use**: When you want to execute all plans in a phase with parallelization

**Objective**: Execute all plans in a phase with wave-based parallelization.

**Execution Context**:
- `execute-phase.md` - Phase execution workflow
- `execute-plan.md` - Individual plan execution
- `checkpoints.md` - Checkpoint handling
- `tdd.md` - TDD approach

**Key Process Steps**:
1. Identify phase and load all plans
2. Build dependency graph from `depends_on` frontmatter
3. Group plans into execution waves
4. Execute Wave 1 plans in parallel
5. Handle checkpoints and user interactions
6. Execute subsequent waves as dependencies complete
7. Create SUMMARY.md files for all plans
8. Update STATE.md with phase progress

**Success Criteria**:
- All plans in phase executed in correct order
- Parallel execution utilized where possible
- STATE.md updated with phase completion
- All SUMMARY.md files created

**Usage Pattern**:
```
"I want to execute all plans in phase [X] with proper parallelization."
```

### Debugging & Quality Commands

#### `/gsd:debug` - Systematic Debugging

**When to Use**: When you encounter issues that need systematic diagnosis

**Objective**: Systematic debugging with persistent state across context resets.

**Execution Context**:
- `debug.md` - Debugging workflow
- `debugging-mindset.md` - Debugging philosophy
- `hypothesis-testing.md` - Scientific method approach
- `investigation-techniques.md` - Diagnostic strategies
- `verification-patterns.md` - Validation methodologies

**Key Process Steps**:
1. Reproduce the issue consistently
2. Gather evidence (logs, error messages, state)
3. Formulate hypotheses about root cause
4. Test hypotheses systematically
5. Implement fix with proper validation
6. Verify resolution
7. Document findings in DEBUG.md

**Success Criteria**:
- Issue reproduced and documented
- Root cause identified
- Fix implemented and verified
- Debugging artifacts created in `.planning/debug/`

**Usage Pattern**:
```
"I'm encountering [issue description]. Please help me debug this systematically."
```

#### `/gsd:verify-work` - User Acceptance Testing

**When to Use**: When you need to validate completed features with the user

**Objective**: Validate built features through conversational UAT.

**Execution Context**:
- `verify-work.md` - UAT workflow
- `STATE.md` - Current project state
- `ROADMAP.md` - Phase context

**Key Process Steps**:
1. Identify features ready for verification
2. Create conversational UAT scenarios
3. Present features to user for validation
4. Document feedback and issues
5. Create UAT.md with test results
6. Plan fixes for any identified issues

**Success Criteria**:
- UAT completed for specified features
- Issues documented with reproduction steps
- User feedback incorporated
- Next steps clear (fix issues or proceed)

**Usage Pattern**:
```
"I've completed [feature/phase]. Let's verify the work meets the requirements."
```

### Context Management Commands

#### `/gsd:pause-work` - Create Context Handoff

**When to Use**: When you need to pause work and create a resumption point

**Objective**: Create context handoff when pausing work mid-phase.

**Execution Context**:
- `STATE.md` - Current project state
- Phase context files

**Key Process Steps**:
1. Document current position and state
2. Capture open questions and decisions
3. Create `.continue-here.md` with resumption instructions
4. Update STATE.md with pause information
5. Commit handoff files

**Success Criteria**:
- `.continue-here.md` created with precise resumption point
- STATE.md updated with pause context
- All open work documented

**Usage Pattern**:
```
"I need to pause work on this phase. Please create a proper handoff point."
```

#### `/gsd:resume-work` - Restore Context

**When to Use**: When resuming work from a previous session

**Objective**: Resume work from previous session with full context restoration.

**Execution Context**:
- `resume-project.md` - Resumption workflow
- `STATE.md` - Saved project state
- `.continue-here.md` - Resumption instructions

**Key Process Steps**:
1. Load STATE.md and .continue-here.md
2. Restore project context and decisions
3. Validate environment and dependencies
4. Present resumption options to user
5. Execute appropriate next command

**Success Criteria**:
- Full context restored from previous session
- User can continue work seamlessly
- STATE.md updated with resumption

**Usage Pattern**:
```
"I'm ready to resume work. Please restore the context from my last session."
```

### Milestone Management Commands

#### `/gsd:new-milestone` - Create New Milestone

**When to Use**: When starting work on a new version/milestone

**Objective**: Create a new milestone with phases for an existing project.

**Execution Context**:
- `create-milestone.md` - Milestone creation workflow
- `STATE.md` - Current project state
- `ROADMAP.md` - Current roadmap
- `MILESTONES.md` - Milestone tracking

**Key Process Steps**:
1. Review completed milestones
2. Gather milestone vision and goals
3. Create phase structure for new milestone
4. Update ROADMAP.md with new milestone
5. Update STATE.md and MILESTONES.md
6. Commit milestone files

**Success Criteria**:
- New milestone added to ROADMAP.md
- MILESTONES.md updated with milestone tracking
- STATE.md reflects new milestone structure

**Usage Pattern**:
```
"I've completed the current milestone. Let's create a new milestone for [next version/goal]."
```

#### `/gsd:complete-milestone` - Archive Completed Work

**When to Use**: When a milestone is fully completed

**Objective**: Archive completed milestone and prepare for next version.

**Execution Context**:
- `complete-milestone.md` - Milestone completion workflow
- `STATE.md` - Current project state
- `ROADMAP.md` - Current roadmap

**Key Process Steps**:
1. Validate all phases in milestone are complete
2. Create milestone archive
3. Update ROADMAP.md (collapse completed milestone)
4. Update STATE.md with completion metrics
5. Create summary of milestone accomplishments
6. Commit archive and updates

**Success Criteria**:
- Milestone archive created
- ROADMAP.md updated with collapsed milestone
- STATE.md updated with completion metrics
- Summary of accomplishments documented

**Usage Pattern**:
```
"I've completed all work for this milestone. Let's archive it and prepare for the next one."
```

### Utility Commands

#### `/gsd:help` - Show Command Reference

**When to Use**: When you need to see available commands and usage

**Objective**: Display complete GSD command reference.

**Execution Context**: None (self-contained reference)

**Key Process Steps**:
1. Present categorized command list
2. Show quick start guide
3. Display core workflow
4. Provide command details

**Success Criteria**:
- Complete command reference displayed
- User understands available options

**Usage Pattern**:
```
"What commands are available in GSD?"
```

#### `/gsd:add-todo` - Capture Task

**When to Use**: When you need to capture an idea or task during work

**Objective**: Capture idea or task as todo from current conversation context.

**Execution Context**:
- `STATE.md` - Current project state

**Key Process Steps**:
1. Ensure todo directory exists
2. Extract content from arguments or conversation
3. Create structured todo file
4. Add to STATE.md todo tracking
5. Commit todo file

**Success Criteria**:
- Todo created in `.planning/todos/pending/`
- STATE.md updated with new todo
- Context preserved for later execution

**Usage Pattern**:
```
"I need to remember to [task description]. Please add this as a todo."
```

#### `/gsd:check-todos` - List Pending Todos

**When to Use**: When you want to see what tasks are pending

**Objective**: List pending todos and select one to work on.

**Execution Context**:
- `STATE.md` - Current project state
- Todo files in `.planning/todos/pending/`

**Key Process Steps**:
1. Read STATE.md for todo context
2. List all pending todos
3. Present options to user
4. Handle todo selection or management

**Success Criteria**:
- Complete todo list displayed
- User can select todo for execution

**Usage Pattern**:
```
"What todos do I have pending?"
```

## System Architecture

### Workflow Execution Layer

Core workflows that handle execution logic:

**Planning Workflows:**
- `plan-phase.md` - Create executable phase prompts with dependency analysis
- `create-roadmap.md` - Structure project into logical phases
- `map-codebase.md` - Parallel codebase analysis

**Execution Workflows:**
- `execute-plan.md` - Execute single PLAN.md with checkpoint handling
- `execute-phase.md` - Wave-based parallel execution of phase plans
- `resume-project.md` - Context restoration from previous sessions

**Debugging Workflows:**
- `debug.md` - Systematic issue diagnosis and resolution
- `diagnose-issues.md` - Parallel issue analysis
- `verify-work.md` - User acceptance testing

**Context Workflows:**
- `discuss-phase.md` - Adaptive questioning for phase context
- `discuss-milestone.md` - Milestone-level context gathering
- `research-phase.md` - Pre-planning research

### Template Structure Layer

Standardized file formats:

**Project Files:**
- `PROJECT.md` - Vision, requirements, constraints
- `ROADMAP.md` - Phase breakdown and dependencies
- `STATE.md` - Living project memory and metrics
- `CONFIG.json` - Workflow preferences

**Phase Files:**
- `{phase}-PLAN.md` - Executable phase plans
- `{phase}-SUMMARY.md` - Execution outcomes
- `{phase}-CONTEXT.md` - Research and decisions
- `{phase}-UAT.md` - User acceptance testing results

**Codebase Analysis:**
- `codebase/stack.md` - Technology stack
- `codebase/architecture.md` - System architecture
- `codebase/structure.md` - Directory structure
- `codebase/conventions.md` - Coding standards
- `codebase/integrations.md` - External dependencies
- `codebase/concerns.md` - Technical debt and risks
- `codebase/testing.md` - Testing strategy

### Reference Knowledge Layer

Guiding principles and methodologies:

**Planning References:**
- `plan-format.md` - PLAN.md structure and requirements
- `scope-estimation.md` - Task sizing and complexity analysis
- `checkpoints.md` - User interaction points
- `tdd.md` - Test-driven development approach

**Debugging References:**
- `debugging-mindset.md` - Systematic debugging approach
- `hypothesis-testing.md` - Scientific method for issues
- `investigation-techniques.md` - Diagnostic strategies
- `verification-patterns.md` - Validation methodologies

**Research References:**
- `research-pitfalls.md` - Common research mistakes
- `when-to-research.md` - Research vs. execution decisions

**Core Principles:**
- `principles.md` - System design philosophy
- `questioning.md` - Adaptive context gathering
- `continuation-format.md` - Context preservation

## Execution Context

### Current State

Always load and maintain awareness of:
- `.planning/STATE.md` - Current position, decisions, blockers
- `.planning/ROADMAP.md` - Phase structure and dependencies
- `.planning/PROJECT.md` - Project vision and requirements

### Decision Making

Follow these principles:
1. **Parallel by Default**: Assume tasks can run concurrently unless dependencies exist
2. **Atomic Execution**: Keep plans small (2-3 tasks max) for context efficiency
3. **Explicit Dependencies**: Declare all dependencies in PLAN.md frontmatter
4. **Secure by Design**: Validate inputs, authenticate, fail closed
5. **Observable by Design**: Include logging, error handling, debugging hooks

### Task Execution

For any execution task:
1. **Load Context**: Read STATE.md, ROADMAP.md, relevant PLAN.md files
2. **Validate Dependencies**: Confirm all `depends_on` plans are complete
3. **Execute Tasks**: Follow PLAN.md instructions precisely
4. **Create Summary**: Document outcomes in SUMMARY.md
5. **Update State**: Record completion in STATE.md
6. **Commit Changes**: Persist all artifacts to git

## Command Selection Guide

### Starting a New Project

1. `/gsd:new-project` → Creates PROJECT.md and initial config
2. `/gsd:create-roadmap` → Creates ROADMAP.md with phases
3. `/gsd:map-codebase` → (Optional) Analyze existing codebase

### Planning a Phase

1. `/gsd:discuss-phase` → Gather context for phase
2. `/gsd:research-phase` → (Optional) Research implementation approaches
3. `/gsd:plan-phase` → Create executable PLAN.md files

### Executing Work

1. `/gsd:execute-plan` → Execute single plan
2. `/gsd:execute-phase` → Execute all plans in phase (parallel)
3. `/gsd:verify-work` → Validate completed features

### Handling Issues

1. `/gsd:consider-issues` → Review deferred issues
2. `/gsd:debug` → Systematic debugging
3. `/gsd:plan-fix` → Create fix plans

### Pausing/Resuming

1. `/gsd:pause-work` → Create context handoff
2. `/gsd:resume-work` → Restore full context

### Milestone Management

1. `/gsd:discuss-milestone` → Plan next milestone
2. `/gsd:new-milestone` → Create milestone structure
3. `/gsd:complete-milestone` → Archive completed work

## File System Structure

```
.planning/
├── PROJECT.md          # Project vision and requirements
├── ROADMAP.md          # Phase breakdown and status
├── STATE.md            # Living project memory
├── CONFIG.json         # Workflow preferences
├── ISSUES.md           # Deferred issues and concerns
├── MILESTONES.md       # Milestone tracking
├── phases/
│   ├── 01-foundation/  # Phase directories
│   │   ├── 01-01-PLAN.md
│   │   ├── 01-01-SUMMARY.md
│   │   ├── 01-CONTEXT.md
│   │   └── 01-UAT.md
│   └── 02-auth/
│       ├── 02-01-PLAN.md
│       └── 02-01-SUMMARY.md
├── codebase/           # Codebase analysis (if mapped)
│   ├── stack.md
│   ├── architecture.md
│   └── ...
└── debug/              # Debugging artifacts
    ├── uat-001-*.md
    └── ...
```

## Workflow Patterns

### Parallel Execution

- Independent plans execute concurrently in "waves"
- Wave 1: All plans with no dependencies
- Wave 2: Plans depending only on Wave 1, etc.
- Use `depends_on` and `files_modified` frontmatter for dependency tracking

### Checkpoint Handling

- Plans with `autonomous: false` require user interaction
- Checkpoints pause execution for user input
- Use `checkpoints.md` reference for checkpoint patterns

### Context Preservation

- STATE.md maintains continuity across context resets
- Always update STATE.md after significant actions
- Use `.continue-here.md` files for precise resumption points

### Error Recovery

Debugging workflow follows systematic approach:
1. Reproduce issue
2. Gather evidence
3. Formulate hypotheses
4. Test hypotheses
5. Implement fix
6. Verify resolution

## Best Practices

1. **Small Plans**: Keep plans focused (2-3 tasks max) for context efficiency
2. **Explicit Dependencies**: Always declare dependencies in frontmatter
3. **State Updates**: Update STATE.md after every significant action
4. **Atomic Commits**: Commit each plan execution separately
5. **Parallel Thinking**: Always ask "what can run concurrently?"
6. **Secure Defaults**: Assume hostile inputs, validate everything
7. **Observable Systems**: Include logging and error handling
8. **Document Decisions**: Record rationale in STATE.md

## Command Reference Quick Guide

| Category | Commands |
|----------|----------|
| **Initialization** | `new-project`, `create-roadmap`, `map-codebase` |
| **Phase Management** | `add-phase`, `insert-phase`, `remove-phase`, `list-phase-assumptions` |
| **Planning** | `discuss-phase`, `research-phase`, `plan-phase` |
| **Execution** | `execute-plan`, `execute-phase`, `progress` |
| **Debugging** | `debug`, `verify-work`, `plan-fix`, `consider-issues` |
| **Context** | `pause-work`, `resume-work`, `add-todo`, `check-todos` |
| **Milestones** | `new-milestone`, `discuss-milestone`, `complete-milestone` |
| **Help** | `help`, `status` |

## Usage Notes

### For Context-Aware Coding

This system prompt enables full GSD functionality without requiring custom command infrastructure. Use natural language to invoke any GSD capability by referencing the appropriate command pattern.

### Integration with Existing System

When used alongside the actual GSD command system, this prompt serves as:
- Comprehensive documentation
- Decision-making reference
- Training material for new users
- Context recovery guide

### Version Compatibility

This system prompt reflects the complete GSD framework as of the current version. It includes all commands, workflows, templates, and references available in the system.

---

**SYSTEM PROMPT END**

This file contains the complete Get Shit Done framework reference for use in any context where the full system capabilities are needed but custom commands may not be available.