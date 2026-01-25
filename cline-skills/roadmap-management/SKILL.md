---
name: roadmap-management
description: Create and manage project roadmaps with phases, milestones, and progress tracking. Use this skill when you need to create roadmaps, add phases, or manage project structure.
---

# Roadmap Management Skill

Project roadmap creation and phase management.

## Steps

1. **Roadmap Creation**
   - Define project structure
   - Create phases and milestones
   - Establish dependencies

2. **Phase Management**
   - Add, remove, and reorder phases
   - Manage phase dependencies
   - Track phase completion

3. **Milestone Management**
   - Create and complete milestones
   - Archive completed work
   - Prepare for next cycles

## Roadmap Commands

### Roadmap Creation
- `/gsd:create-roadmap` - Create project roadmap
- Phase definition
- Dependency mapping
- Progress visualization

### Phase Management
- `/gsd:add-phase` - Add new phase
- `/gsd:insert-phase` - Insert urgent phase
- `/gsd:remove-phase` - Remove future phase
- Phase reordering

### Milestone Management
- `/gsd:new-milestone` - Create milestone
- `/gsd:complete-milestone` - Archive milestone
- `/gsd:discuss-milestone` - Plan next milestone

## Integration with GSD

This skill integrates with GSD's roadmap system:

- **Roadmap Management**: Maintains `.planning/ROADMAP.md`
- **Phase Tracking**: Updates phase status
- **Progress Visualization**: Generates progress indicators
- **History**: Maintains roadmap history

## Advanced Usage

### Custom Roadmaps

Create custom roadmap templates:

```markdown
# Custom Roadmap Template

## [[PROJECT_NAME]] Roadmap

### Milestone [[VERSION]]
- [[PHASE_1]] - [[STATUS]]
- [[PHASE_2]] - [[STATUS]]
- [[PHASE_3]] - [[STATUS]]

### Progress
[[PROGRESS_BAR]]
```

### Roadmap Validation

Validate roadmap structure:

```bash
# Validate roadmap
/gsd:create-roadmap --validate
```

## Requirements

- Get Shit Done initialized
- Project context available
- Roadmap structure defined

## Output

- `.planning/ROADMAP.md` - Project roadmap
- Phase directories
- Progress tracking
- Milestone archives