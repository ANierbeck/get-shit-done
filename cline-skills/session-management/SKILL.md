---
name: session-management
description: Manage work sessions with pause, resume, and continuation capabilities. Use this skill when you need to pause work, resume later, or handle session interruptions.
---

# Session Management Skill

Work session management with pause, resume, and continuation support.

## Steps

1. **Session Pausing**
   - Capture current work context
   - Create continuation files
   - Preserve session state

2. **Session Resumption**
   - Restore previous context
   - Load continuation files
   - Resume work seamlessly

3. **Session Handoff**
   - Create context handoff files
   - Document current position
   - Enable team collaboration

## Session Commands

### Pause Work
- `/gsd:pause-work` - Pause current session
- Context capture
- State preservation
- Continuation file creation

### Resume Work
- `/gsd:resume-work` - Resume paused session
- Context restoration
- Position recovery
- State reload

### Session Handoff
- Context handoff creation
- Team collaboration support
- Work continuity

## Integration with GSD

This skill integrates with GSD's session management:

- **State Preservation**: Maintains session state
- **Context Capture**: Preserves work context
- **Continuation**: Enables seamless resumption
- **Collaboration**: Supports team handoffs

## Advanced Usage

### Custom Continuation

Create custom continuation templates:

```json
{
  "position": "Current position",
  "context": "Relevant context",
  "next_steps": "Recommended next actions",
  "blockers": "Known blockers"
}
```

### Session Recovery

Recover from interrupted sessions:

```bash
# Recover interrupted session
/gsd:resume-work --recover
```

## Requirements

- Get Shit Done initialized
- Active work session
- Context to preserve

## Output

- `.continue-here` - Continuation files
- Session state preservation
- Context handoff documents
- Recovery capabilities