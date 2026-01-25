---
name: codebase-analysis
description: Analyze and document existing codebases using GSD methodology. Use this skill when you need to understand legacy code, map existing systems, or prepare for brownfield development.
---

# Codebase Analysis Skill

Comprehensive codebase mapping and analysis for brownfield projects.

## Steps

1. **Codebase Mapping**
   - Analyze codebase structure and architecture
   - Identify languages, frameworks, and dependencies
   - Document directory structure and key files

2. **Architecture Analysis**
   - Discover design patterns and architectural styles
   - Map data flow and component interactions
   - Identify integration points and external services

3. **Quality Assessment**
   - Evaluate code quality and technical debt
   - Identify testing strategies and coverage
   - Document known issues and concerns

4. **Documentation Generation**
   - Create comprehensive codebase documentation
   - Generate architecture diagrams
   - Produce integration maps

## Analysis Components

### Stack Analysis
- Languages and versions
- Frameworks and libraries
- Build tools and configuration
- Dependency management

### Architecture Documentation
- System components and layers
- Data flow diagrams
- API contracts and endpoints
- Database schema and models

### Code Quality Assessment
- Code conventions and patterns
- Testing frameworks and coverage
- Technical debt identification
- Performance characteristics

### Integration Mapping
- External service dependencies
- API integrations
- Third-party service usage
- Authentication and security patterns

## Integration with GSD

This skill integrates with GSD's brownfield development workflow:

- **Context Gathering**: Provides comprehensive codebase context
- **Documentation**: Creates `.planning/codebase/` documentation
- **Planning Input**: Feeds into GSD's planning system
- **State Management**: Updates project state with codebase insights

## Advanced Usage

### Custom Analysis

Extend analysis with custom scripts in `.planning/codebase/scripts/`:

```bash
# Custom architecture analysis
node analyze-architecture.js > ARCHITECTURE.md

# Custom integration mapping
python map-integrations.py > INTEGRATIONS.md
```

### Continuous Updates

Schedule regular codebase analysis:

```bash
# Weekly codebase health check
/gsd:map-codebase --update
```

## Requirements

- Existing codebase to analyze
- Get Shit Done initialized
- Appropriate language tools installed

## Output

- `.planning/codebase/STACK.md` - Technology stack
- `.planning/codebase/ARCHITECTURE.md` - System architecture
- `.planning/codebase/STRUCTURE.md` - Directory structure
- `.planning/codebase/CONVENTIONS.md` - Code conventions
- `.planning/codebase/TESTING.md` - Testing strategy
- `.planning/codebase/INTEGRATIONS.md` - External integrations
- `.planning/codebase/CONCERNS.md` - Known issues