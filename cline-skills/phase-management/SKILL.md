---
name: phase-management
description: Manage individual project phases with discussion, research, and assumption listing. Use this skill when you need to discuss phases, research requirements, or list phase assumptions before planning.
---

# Phase Management Skill

Individual phase management with discussion and research capabilities.

## Steps

1. **Phase Discussion**
   - Articulate phase vision
   - Capture essential requirements
   - Define phase boundaries

2. **Phase Research**
   - Conduct ecosystem research
   - Discover best practices
   - Identify pitfalls and patterns

3. **Assumption Management**
   - List phase assumptions
   - Validate assumptions
   - Correct misunderstandings

## Phase Commands

### Phase Discussion
- `/gsd:discuss-phase` - Articulate phase vision
- Context gathering
- Vision capture
- Boundary definition

### Phase Research
- `/gsd:research-phase` - Ecosystem research
- Best practice discovery
- Pattern identification
- Pitfall avoidance

### Assumption Listing
- `/gsd:list-phase-assumptions` - List assumptions
- Assumption validation
- Misunderstanding correction
- Context alignment

## Integration with GSD

This skill integrates with GSD's phase management:

- **Context Gathering**: Captures phase context
- **Research**: Conducts ecosystem analysis
- **Assumption Tracking**: Documents assumptions
- **Planning Input**: Feeds into planning process

## Advanced Usage

### Custom Research

Extend research with custom sources:

```json
{
  "sources": [
    "Official documentation",
    "Community best practices",
    "Case studies",
    "Performance benchmarks"
  ],
  "focus_areas": [
    "Architecture patterns",
    "Performance optimization",
    "Security considerations",
    "Scalability approaches"
  ]
}
```

### Assumption Validation

Validate assumptions systematically:

```bash
# Validate phase assumptions
/gsd:list-phase-assumptions --validate
```

## Requirements

- Get Shit Done initialized
- Roadmap created
- Phase defined

## Output

- Phase context documentation
- Research findings
- Assumption lists
- Validation results