---
name: gsd-update
description: "Update GSD to latest version with changelog display"
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
Update GSD to latest version: fetch current installed version, compare with latest version from npm, show changelog entries for versions user has missed, highlight breaking changes and migration notes, confirm with user before running npx get-shit-done-cc@latest.
</process>
'<<'
# Update

Check for GSD updates, install if available, and display what changed.

Routes to the update workflow which handles:
- Version detection (local vs global installation)
- npm version checking
- Changelog fetching and display
- User confirmation with clean install warning
- Update execution and cache clearing
- Restart reminder

## Process

**Follow the update workflow** from `
The workflow handles all logic including:
1. Installed version detection (local/global)
2. Latest version checking via npm
3. Version comparison
4. Changelog fetching and extraction
5. Clean install warning display
6. User confirmation
7. Update execution
8. Cache clearing
