---
name: execution
description: Execute GSD plans and phases with parallel agents and subagent orchestration. Use this skill when you need to run plans, execute phases, or manage background execution status.
---

# Execution Skill

Plan and phase execution with GSD's subagent orchestration.

## Steps

1. **Plan Execution**
   - Execute individual PLAN.md files
   - Manage task execution and checkpoints
   - Handle deviations and authentication gates

2. **Phase Execution**
   - Execute all plans in a phase
   - Manage parallel agent execution
   - Monitor background operations

3. **Status Monitoring**
   - Check background agent status
   - Monitor parallel execution
   - Track completion progress

## Execution Modes

### Single Plan Execution
- `/gsd:execute-plan` - Run individual plan
- Sequential task execution
- Checkpoint handling
- Subagent routing

### Parallel Phase Execution
- `/gsd:execute-phase` - Run all phase plans
- Parallel agent spawning
- Dependency management
- Wave-based execution

### Status Checking
- `/gsd:status` - Check agent status
- Background operation monitoring
- Completion tracking

## Integration with GSD

This skill integrates with GSD's execution engine:

- **Subagent Management**: Spawns and monitors subagents
- **Parallel Execution**: Manages concurrent operations
- **State Tracking**: Updates execution state
- **History**: Maintains agent history

## Advanced Usage

### Custom Execution

Configure execution parameters:

```json
{
  "max_concurrent_agents": 3,
  "skip_checkpoints": false,
  "min_plans_for_parallel": 2
}
```

### Execution Monitoring

Monitor execution in real-time:

```bash
# Watch execution status
watch -n 5 /gsd:status
```

## Requirements

- Get Shit Done initialized
- Plans created and ready
- Agent execution environment

## Output

- Executed plans and tasks
- Agent status reports
- Completion summaries
- Execution history