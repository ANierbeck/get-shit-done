---
name: gsd-progress
description: "Check project progress, show context, and route to next action (execute or plan)"
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
Display comprehensive project status: calculate and show visual progress bar with percentage, list recent work from SUMMARY.md files, display current phase/plan position, list key decisions and open issues, offer to execute next plan or create it if missing. Detect 100% milestone completion automatically.
</process>
'<<'
# Progress

Check project progress, summarize recent work and what's ahead, then intelligently route to the next action - either executing an existing plan or creating the next one.

Provides situational awareness before continuing work.

## Process

Execute the progress workflow from  end-to-end.
Preserve all routing logic (Routes A through F) and edge case handling.
