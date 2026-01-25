---
name: progress-tracking
description: Monitor and track project progress with visual indicators and status reporting. Use this skill when you need to check project status, monitor progress, or generate status reports.
---

# Progress Tracking Skill

Comprehensive project progress monitoring and reporting.

## Steps

1. **Progress Calculation**
   - Calculate phase and plan completion
   - Determine overall project progress
   - Generate progress metrics

2. **Status Reporting**
   - Create visual progress indicators
   - Generate status summaries
   - Identify completed and pending work

3. **Visualization**
   - Create progress bars and charts
   - Generate timeline visualizations
   - Produce completion reports

4. **Status Updates**
   - Check background operation status
   - Monitor parallel execution
   - Track agent completion

## Progress Metrics

### Completion Tracking
- Phases completed vs total
- Plans completed vs total
- Tasks completed vs total

### Time Tracking
- Time spent per phase
- Estimated time remaining
- Actual vs planned progress

### Quality Metrics
- Issues resolved
- Todos completed
- Verification success rate

## Integration with GSD

This skill integrates with GSD's progress tracking:

- **State Reading**: Reads `.planning/STATE.md` for current status
- **Roadmap Analysis**: Analyzes `.planning/ROADMAP.md` for progress
- **Visualization**: Generates GSD-style progress indicators
- **Status Updates**: Updates state with current progress

## Advanced Usage

### Custom Progress Reports

Create custom progress visualizations:

```bash
# Generate custom progress report
node generate-progress.js > PROGRESS.md

# Update GSD state
/gsd:progress --custom=PROGRESS.md
```

### Automated Status Updates

Schedule regular progress updates:

```bash
# Daily progress update
/gsd:progress --daily

# Weekly comprehensive report
/gsd:progress --weekly
```

## Requirements

- Get Shit Done initialized
- Project with defined roadmap
- Completed work to track

## Output

- Progress visualizations
- Status reports
- Completion metrics
- Time tracking data
- Quality indicators