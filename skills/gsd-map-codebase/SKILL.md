---
name: gsd-map-codebase
description: "Analyze codebase with parallel mapper agents to produce .planning/codebase/ documents"
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
Map an existing codebase for brownfield projects: spawn parallel Explore agents to analyze codebase structure, create .planning/codebase/ directory with STACK.md, ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, INTEGRATIONS.md, and CONCERNS.md. Present findings and ask if user wants to proceed with /new-project.
</process>
'<<'
# Map Codebase

Analyze existing codebase using parallel gsd-codebase-mapper agents to produce structured codebase documents.

Each mapper agent explores a focus area and **writes documents directly** to `.planning/codebase/`. The orchestrator only receives confirmations, keeping context usage minimal.

Output: .planning/codebase/ folder with 7 structured documents about the codebase state.

## Process

1. Check if .planning/codebase/ already exists (offer to refresh or skip)
2. Create .planning/codebase/ directory structure
3. Spawn 4 parallel gsd-codebase-mapper agents:
- Agent 1: tech focus → writes STACK.md, INTEGRATIONS.md
- Agent 2: arch focus → writes ARCHITECTURE.md, STRUCTURE.md
- Agent 3: quality focus → writes CONVENTIONS.md, TESTING.md
- Agent 4: concerns focus → writes CONCERNS.md
4. Wait for agents to complete, collect confirmations (NOT document contents)
5. Verify all 7 documents exist with line counts
6. Commit codebase map
7. Offer next steps (typically: vibe -p "gsd-new-project" or vibe -p "gsd-plan-phase")
