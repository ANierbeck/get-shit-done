---
name: gsd-set-profile
description: "Switch model profile for GSD agents (quality/balanced/budget)"
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
Quick switch model profile for GSD agents. Options: quality (Opus everywhere), balanced (Opus for planning, Sonnet for execution), budget (Sonnet for writing, Haiku for research). Update .planning/config.json.
</process>
'<<'
# Set Profile

Switch the model profile used by GSD agents. Controls which Claude model each agent uses, balancing quality vs token spend.

Routes to the set-profile workflow which handles:
- Argument validation (quality/balanced/budget)
- Config file creation if missing
- Profile update in config.json
- Confirmation with model table display

## Process

**Follow the set-profile workflow** from `
The workflow handles all logic including:
1. Profile argument validation
2. Config file ensuring
3. Config reading and updating
4. Model table generation from MODEL_PROFILES
5. Confirmation display
