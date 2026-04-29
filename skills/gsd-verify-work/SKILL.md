---
name: gsd-verify-work
description: "Validate built features through conversational UAT"
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
Validate built features through conversational UAT. Extract testable deliverables from SUMMARY.md files for specified phase. Present tests one at a time. Wait for yes/no responses. Automatically diagnose failures and create fix plans. Mark as ready for re-execution if issues found.
</process>
'<<'
# Verify Work

Validate built features through conversational testing with persistent state.

Purpose: Confirm what Claude built actually works from user's perspective. One test at a time, plain text responses, no interrogation. When issues are found, automatically diagnose, plan fixes, and prepare for execution.

Output: {phase_num}-UAT.md tracking all test results. If issues found: diagnosed gaps, verified fix plans ready for vibe -p "gsd-execute-phase"

## Process

Execute the verify-work workflow from  end-to-end.
Preserve all workflow gates (session management, test presentation, diagnosis, fix planning, routing).
