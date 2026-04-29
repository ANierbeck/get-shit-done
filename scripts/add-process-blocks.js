#!/usr/bin/env node
/**
 * Fügt Process-Blöcke (>> ... <<) zu allen SKILL.md hinzu, die sie noch nicht haben
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');

// Standard Process-Beschreibungen basierend auf Skill-Namen
const skillProcessDescriptions = {
  'gsd-new-project': `Execute the new-project workflow end-to-end. Preserve all workflow gates (research, requirements, roadmap creation, validation, approvals, commits, routing).`,
  'gsd-plan-phase': `Execute the plan-phase workflow end-to-end. Preserve all workflow gates (requirements check, plan generation, validation, routing).`,
  'gsd-execute-phase': `Execute the execute-phase workflow end-to-end. Preserve all workflow gates (wave execution, checkpoint handling, verification, state updates, routing).`,
  'gsd-help': `Display GSD command reference and documentation. Provide usage examples and command descriptions.`,
  'gsd-progress': `Display project progress and status. Show current phase, plan, completion percentage, and next steps.`,
  'gsd-debug': `Start or resume a debug session. Gather symptoms, create hypotheses, run tests, document findings.`,
  'gsd-settings': `Configure GSD workflow settings interactively. Toggle agents, set model profiles, update configuration.`,
  'gsd-update': `Update GSD to latest version. Show changelog, highlight breaking changes, confirm before installing.`,
  
  // Add/Remove phase
  'gsd-add-phase': `Add a new phase to the current milestone. Append to ROADMAP.md, create phase directory, update state.`,
  'gsd-insert-phase': `Insert a new decimal phase between existing phases. Maintain phase ordering, update all references.`,
  'gsd-remove-phase': `Remove a future phase and renumber subsequent phases. Delete phase directory, update ROADMAP.md.`,
  
  // Todo
  'gsd-add-todo': `Capture a task or idea as a todo. Create structured todo file, infer area from context, check for duplicates.`,
  'gsd-check-todos': `List pending todos and select one to work on. Load context, route to appropriate action.`,
  
  // Milestone
  'gsd-new-milestone': `Start a new milestone through unified flow. Research, requirements, roadmap creation for brownfield projects.`,
  'gsd-complete-milestone': `Archive completed milestone and prepare for next version. Create MILESTONES.md entry, archive phase dirs, create git tag.`,
  'gsd-audit-milestone': `Audit milestone completion against original intent. Check requirements coverage, spawn integration checker, create audit report.`,
  'gsd-plan-milestone-gaps': `Create phases to close gaps identified by audit. Group gaps into phases, prioritize, add to ROADMAP.md.`,
  
  // Execution
  'gsd-quick': `Execute quick, ad-hoc tasks with GSD guarantees. Spawn planner + executor, skip optional agents, update STATE.md.`,
  'gsd-resume-work': `Resume work from previous session with full context restoration. Read STATE.md, show position, offer next actions.`,
  'gsd-pause-work': `Create context handoff when pausing work mid-phase. Create .continue-here file, update STATE.md.`,
  
  // Special
  'gsd-map-codebase': `Map an existing codebase for brownfield projects. Analyze with parallel explore agents, create codebase map documents.`,
  'gsd-list-phase-assumptions': `Show intended approach for a phase before it starts. Let user course-correct if needed.`,
  'gsd-research-phase': `Run comprehensive ecosystem research for a phase. Discover standard stack, patterns, pitfalls for specialized domains.`,
  'gsd-discuss-phase': `Help articulate vision for a phase before planning. Create CONTEXT.md with vision, essentials, boundaries.`,
  'gsd-verify-work': `Validate built features through conversational UAT. Extract deliverables, present tests, diagnose failures.`,
  'gsd-reapply-patches': `Reapply previously created patches. Handle conflicts, verify application, update state.`,
  'gsd-health': `Check project health and integrity. Validate consistency, check .planning/ structure, optionally repair.`,
  'gsd-cleanup': `Archive accumulated phase directories from completed milestones. Reduce .planning/phases/ clutter.`,
  'gsd-join-discord': `Display Discord community invitation link and information.`,
  'gsd-set-profile': `Quick switch model profile for GSD agents. Select quality/balanced/budget profile.`
};

function addProcessBlock(skillPath) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    return false;
  }

  const skillName = path.basename(skillPath);
  let content = fs.readFileSync(skillMdPath, 'utf-8');

  // Prüfe ob Process-Block bereits existiert
  if (content.includes('>>') && content.includes('<<')) {
    return false;
  }

  // Process-Beschreibung holen
  let processDesc = skillProcessDescriptions[skillName];
  if (!processDesc) {
    // Standard-Beschreibung für unbekannte Skills
    processDesc = `Execute the ${skillName} workflow end-to-end. Preserve all workflow gates and routing.`;
  }

  // Process-Block erstellen
  const processBlock = `\n'>>'\n<process>\n${processDesc}\n</process>\n'<<'\n`;

  // Vor dem ersten ## Header einfügen (wenn vorhanden)
  const firstHeaderMatch = content.match(/^#\s+/m);
  if (firstHeaderMatch) {
    const insertPos = firstHeaderMatch.index;
    content = content.slice(0, insertPos) + processBlock + content.slice(insertPos);
  } else {
    // Am Ende der Frontmatter (nach ---)
    content = content.replace(/^---$\n/m, `---\n${processBlock}`);
  }

  fs.writeFileSync(skillMdPath, content, 'utf-8');
  return true;
}

// Haupt
console.log('🔧 Adding process blocks...\n');

const skillDirs = fs.readdirSync(SKILLS_DIR)
  .filter(d => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory())
  .sort();

let added = 0;
let skipped = 0;

for (const dir of skillDirs) {
  const skillPath = path.join(SKILLS_DIR, dir);
  if (addProcessBlock(skillPath)) {
    console.log(`  ✅ ${dir}`);
    added++;
  } else {
    console.log(`  ⏭️  ${dir} (already has process block)`);
    skipped++;
  }
}

console.log(`\n✨ Done! Added process blocks to ${added} skills, ${skipped} already had them`);
