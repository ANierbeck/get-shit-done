---
name: project-management
description: Initialize and manage projects using GSD methodology. Use this skill when you need to start a new project, create roadmaps, or manage project phases and milestones.
---

# Project Management Skill

Comprehensive project management following Get Shit Done methodology.

## Steps

1. **Project Initialization**
   - Create new projects with deep context gathering
   - Set up project structure and configuration
   - Initialize git repository and state tracking

2. **Roadmap Creation**
   - Define project phases and milestones
   - Establish timeline and dependencies
   - Create visual roadmap with progress tracking

3. **Phase Management**
   - Add, remove, or reorder project phases
   - Manage phase dependencies and sequencing
   - Track phase completion status

4. **Milestone Management**
   - Create and complete milestones
   - Archive completed work
   - Prepare for next development cycles

5. **Progress Tracking**
   - Monitor project progress
   - Generate status reports
   - Identify blockers and dependencies

## Sub-Skills

### Project Initialization
- `/gsd:new-project` - Initialize new project
- `/gsd:map-codebase` - Map existing codebase (brownfield)

### Roadmap Management
- `/gsd:create-roadmap` - Create project roadmap
- `/gsd:add-phase` - Add new phase
- `/gsd:insert-phase` - Insert urgent phase
- `/gsd:remove-phase` - Remove future phase

### Milestone Management
- `/gsd:new-milestone` - Create new milestone
- `/gsd:complete-milestone` - Archive completed milestone
- `/gsd:discuss-milestone` - Plan next milestone

### Progress Tracking
- `/gsd:progress` - Check current progress
- `/gsd:status` - Check background operations

## Integration with GSD

This skill provides a unified interface to GSD's project management commands:

- **State Management**: Maintains project state in `.planning/STATE.md`
- **Context Engineering**: Uses GSD's context gathering principles
- **Progress Tracking**: Updates roadmap and progress visualizations
- **History**: Maintains complete project history

## Advanced Usage

For advanced project management techniques, see the individual GSD command documentation.

## Requirements

- Get Shit Done initialized
- Git repository available
- Node.js for command execution

## Output

- `.planning/PROJECT.md` - Project definition
- `.planning/ROADMAP.md` - Project roadmap
- `.planning/STATE.md` - Project state tracking
- Phase directories with plans and summaries