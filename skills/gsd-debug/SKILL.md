---
name: gsd-debug
description: "Systematic debugging with persistent state across context resets"
license: MIT
compatibility: Mistral Vibe
user-invocable: true
allowed-tools:
  - read_file
  - grep
  - ask_user_question
---


'>>'
<process>
Start or resume a debug session. If no argument: resume active session from .planning/debug/. If argument: create new session, gather symptoms through adaptive questioning, create .planning/debug/[slug].md to track investigation, investigate using scientific method (evidence → hypothesis → test), survive /clear context resets. Archive resolved issues to .planning/debug/resolved/.
</process>
'<<'
# Debug

Debug issues using scientific method with subagent isolation.

**Orchestrator role:** Gather symptoms, spawn gsd-debugger agent, handle checkpoints, spawn continuations.

**Why subagent:** Investigation burns context fast (reading files, forming hypotheses, testing). Fresh 200k context per investigation. Main context stays lean for user interaction.

## Process

## 0. Initialize Context
```bash
INIT=$(node ~/.claude/get-shit-done/bin/gsd-tools.cjs state load)
```
Extract `commit_docs` from init JSON. Resolve debugger model:
```bash
DEBUGGER_MODEL=$(node ~/.claude/get-shit-done/bin/gsd-tools.cjs resolve-model gsd-debugger --raw)
```
## 1. Check Active Sessions
If active sessions exist AND no $ARGUMENTS:
- List sessions with status, hypothesis, next action
- User picks number to resume OR describes new issue
If $ARGUMENTS provided OR user describes new issue:
- Continue to symptom gathering
## 2. Gather Symptoms (if new issue)
Use AskUserQuestion for each:
1. **Expected behavior** - What should happen?
2. **Actual behavior** - What happens instead?
3. **Error messages** - Any errors? (paste or describe)
4. **Timeline** - When did this start? Ever worked?
5. **Reproduction** - How do you trigger it?
After all gathered, confirm ready to investigate.
## 3. Spawn gsd-debugger Agent
Fill prompt and spawn:
```markdown

Investigate issue: {slug}
**Summary:** {trigger}

expected: {expected}
actual: {actual}
errors: {errors}
reproduction: {reproduction}
timeline: {timeline}

symptoms_prefilled: true
goal: find_and_fix

Create: .planning/debug/{slug}.md

```
```
Task(
prompt=filled_prompt,
subagent_type="gsd-debugger",
model="{debugger_model}",
description="Debug {slug}"
)
```
## 4. Handle Agent Return
**If `## ROOT CAUSE FOUND`:**
- Display root cause and evidence summary
- Offer options:
- "Fix now" - spawn fix subagent
- "Plan fix" - suggest vibe -p "gsd-plan-phase" --gaps
- "Manual fix" - done
**If `## CHECKPOINT REACHED`:**
- Present checkpoint details to user
- Get user response
- Spawn continuation agent (see step 5)
**If `## INVESTIGATION INCONCLUSIVE`:**
- Show what was checked and eliminated
- Offer options:
- "Continue investigating" - spawn new agent with additional context
- "Manual investigation" - done
- "Add more context" - gather more symptoms, spawn again
## 5. Spawn Continuation Agent (After Checkpoint)
When user responds to checkpoint, spawn fresh agent:
```markdown

Continue debugging {slug}. Evidence is in the debug file.

- .planning/debug/{slug}.md (Debug session state)

**Type:** {checkpoint_type}
**Response:** {user_response}

goal: find_and_fix

```
```
Task(
prompt=continuation_prompt,
subagent_type="gsd-debugger",
model="{debugger_model}",
description="Continue debug {slug}"
)
```
