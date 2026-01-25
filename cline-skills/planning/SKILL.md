---
name: planning
description: Create detailed execution plans for GSD phases using atomic task breakdown. Use this skill when you need to plan phases, create roadmaps, or generate detailed task plans.
---

# Planning Skill

Detailed phase planning with atomic task breakdown following GSD principles.

## Steps

1. **Phase Planning**
   - Break phases into executable plans
   - Create atomic tasks (2-3 per plan)
   - Define verification criteria

2. **Roadmap Creation**
   - Define project phases and milestones
   - Establish dependencies and sequencing
   - Create visual progress tracking

3. **Plan Generation**
   - Generate detailed PLAN.md files
   - Include context references
   - Define success criteria

## Planning Components

### Phase Planning
- `/gsd:plan-phase` - Plan specific phase
- Atomic task creation
- Context gathering
- Verification definition

### Roadmap Management
- `/gsd:create-roadmap` - Create roadmap
- Phase sequencing
- Dependency mapping
- Progress visualization

### Plan Structure
- Objective and context
- Task definitions
- Verification criteria
- Success measures

## Integration with GSD

This skill integrates with GSD's planning system:

- **Context Engineering**: Uses GSD's context gathering
- **Atomic Planning**: Creates focused 2-3 task plans
- **State Management**: Updates planning state
- **History**: Maintains planning history

## Advanced Usage

### Custom Planning

Extend planning with custom templates:

```markdown
# Custom Plan Template

## Objective
[[OBJECTIVE]]

## Context
@[[CONTEXT_FILES]]

## Tasks
<task type="auto">
  <name>[[TASK_NAME]]</name>
  <files>[[FILES]]</files>
  <action>[[ACTIONS]]</action>
  <verify>[[VERIFICATION]]</verify>
  <done>[[COMPLETION]]</done>
</task>
```

### Planning Validation

Validate plans before execution:

```bash
# Validate plan structure
/gsd:plan-phase --validate
```

## Requirements

- Get Shit Done initialized
- Roadmap created
- Project context available

## Output

- `.planning/phases/[PHASE]/[PLAN]-PLAN.md` - Execution plans
- `.planning/ROADMAP.md` - Project roadmap
- Planning state updates
- Task definitions