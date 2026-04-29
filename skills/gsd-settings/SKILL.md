---
name: gsd-settings
description: "Configure GSD workflow toggles and model profile"
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
Configure GSD workflow settings interactively: load current config from .planning/config.json, present toggle options for researcher/plan-checker/verifier agents, present model profile selection (quality/balanced/budget), allow user to enable/disable each, save updated config. Preserve existing settings not mentioned.
</process>
'<<'
# Settings

Interactive configuration of GSD workflow agents and model profile via multi-question prompt.

Routes to the settings workflow which handles:
- Config existence ensuring
- Current settings reading and parsing
- Interactive 5-question prompt (model, research, plan_check, verifier, branching)
- Config merging and writing
- Confirmation display with quick command references

## Process

**Follow the settings workflow** from `
The workflow handles all logic including:
1. Config file creation with defaults if missing
2. Current config reading
3. Interactive settings presentation with pre-selection
4. Answer parsing and config merging
5. File writing
6. Confirmation display
