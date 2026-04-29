---
name: gsd-audit-milestone
description: "Audit milestone completion against original intent before archiving"
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
Audit milestone completion against original intent. Read all phase VERIFICATION.md files. Check requirements coverage from REQUIREMENTS.md. Spawn integration checker agent for cross-phase wiring. Create MILESTONE-AUDIT.md with gaps, tech debt, and recommendations.
</process>
'<<'
# Audit Milestone

Verify milestone achieved its definition of done. Check requirements coverage, cross-phase integration, and end-to-end flows.

**This command IS the orchestrator.** Reads existing VERIFICATION.md files (phases already verified during execute-phase), aggregates tech debt and deferred gaps, then spawns integration checker for cross-phase wiring.

## Process

Execute the audit-milestone workflow from  end-to-end.
Preserve all workflow gates (scope determination, verification reading, integration check, requirements coverage, routing).
