#!/usr/bin/env node
/**
 * Wendet ALLE notwendigen Fixes auf ~/.vibe/skills/ an
 * 
 * 1. Compatibility auf "Mistral Vibe" setzen
 * 2. Slash Commands durch vibe -p ersetzen
 * 3. Process-Blöcke mit richtigen Anweisungen
 * 4. Gebrochene Command-Formate korrigieren
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(process.env.HOME || '/root', '.vibe', 'skills');

// Process-Beschreibungen für jeden Skill
const processDescriptions = {
  'gsd-help': `Display the complete GSD command reference and documentation from the SKILL.md content. Show usage examples, command descriptions, and the full reference table.`,
  
  'gsd-new-project': `Execute the complete new-project workflow: conduct deep questioning to understand what the user wants to build, optionally spawn parallel researcher agents for domain research, define v1/v2/out-of-scope requirements, create PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md, and config.json. Preserve all workflow gates (validation, approvals, commits).`,
  
  'gsd-plan-phase': `Execute the complete plan-phase workflow for the specified phase number: load project context from STATE.md and ROADMAP.md, analyze requirements, create detailed PLAN.md with wave-based task breakdown, verification criteria, success measures, and dependencies. Preserve all workflow gates.`,
  
  'gsd-execute-phase': `Execute the complete execute-phase workflow for the specified phase number: discover all PLAN.md files in the phase directory, group into waves based on frontmatter wave field, spawn parallel Task agents for each wave, collect results, verify phase goal was achieved, update STATE.md and REQUIREMENTS.md. Preserve all workflow gates.`,
  
  'gsd-progress': `Display comprehensive project status: calculate and show visual progress bar with percentage, list recent work from SUMMARY.md files, display current phase/plan position, list key decisions and open issues, offer to execute next plan or create it if missing. Detect 100% milestone completion automatically.`,
  
  'gsd-debug': `Start or resume a debug session. If no argument: resume active session from .planning/debug/. If argument: create new session, gather symptoms through adaptive questioning, create .planning/debug/[slug].md to track investigation, investigate using scientific method (evidence → hypothesis → test), survive /clear context resets. Archive resolved issues to .planning/debug/resolved/.`,
  
  'gsd-settings': `Configure GSD workflow settings interactively: load current config from .planning/config.json, present toggle options for researcher/plan-checker/verifier agents, present model profile selection (quality/balanced/budget), allow user to enable/disable each, save updated config. Preserve existing settings not mentioned.`,
  
  'gsd-update': `Update GSD to latest version: fetch current installed version, compare with latest version from npm, show changelog entries for versions user has missed, highlight breaking changes and migration notes, confirm with user before running npx get-shit-done-cc@latest.`,
  
  'gsd-map-codebase': `Map an existing codebase for brownfield projects: spawn parallel Explore agents to analyze codebase structure, create .planning/codebase/ directory with STACK.md, ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, INTEGRATIONS.md, and CONCERNS.md. Present findings and ask if user wants to proceed with /new-project.`,
  
  'gsd-add-todo': `Capture idea or task from current conversation context. Extract title, area (from file paths), and description. Create structured todo file in .planning/todos/pending/ with YAML frontmatter. Check for duplicates before creating. Update STATE.md todo count. Confirm creation with user.`,
  
  'gsd-check-todos': `List all pending todos from .planning/todos/pending/ with title, area, age. Optional area filter. For selected todo: load full context, offer actions (work now, add to phase, brainstorm, later). Move todo to done/ when work begins. Track which area has most todos.`,
  
  'gsd-add-phase': `Add new phase to end of current milestone. Use next sequential phase number. Prompt user for phase name and description. Append to ROADMAP.md with goal and success criteria. Create .planning/phases/XX-name/ directory. Update STATE.md with new phase. Commit planning docs if configured.`,
  
  'gsd-insert-phase': `Insert urgent work as decimal phase between existing phases. Prompt user for base phase number and description. Calculate next decimal (e.g., 7.1 between 7 and 8). Update ROADMAP.md, create phase directory, renumber subsequent phases if needed. Maintain phase ordering.`,
  
  'gsd-remove-phase': `Remove a future (unstarted) phase and renumber subsequent phases. Prompt user for phase number. Delete phase directory. Remove from ROADMAP.md. Update all phase references. Git commit preserves historical record. Only works on future phases.`,
  
  'gsd-research-phase': `Run comprehensive ecosystem research for specialized domains. Prompt user for phase number and research focus. Spawn 4 parallel researcher agents. Create .planning/phases/XX-phase-name/RESEARCH.md with "how experts build this" knowledge. Cover stack, patterns, pitfalls, best practices.`,
  
  'gsd-discuss-phase': `Help articulate user's vision for a phase before planning. Prompt for phase number. Create .planning/phases/XX-phase-name/CONTEXT.md with user's vision, essentials that must work, and boundaries. Use when user has ideas about how something should look/feel.`,
  
  'gsd-list-phase-assumptions': `Show Claude's intended approach for a phase before it starts. Prompt for phase number. Let user course-correct if Claude misunderstood vision. No files created - conversational output only. Load context from STATE.md and ROADMAP.md.`,
  
  'gsd-quick': `Execute small ad-hoc tasks with GSD guarantees but skip optional agents. Prompt user for task description. Spawn planner + executor agents only (skip researcher, checker, verifier). Create .planning/quick/NNN-slug/PLAN.md and .planning/quick/NNN-slug/SUMMARY.md. Updates STATE.md tracking but not ROADMAP.md.`,
  
  'gsd-resume-work': `Resume work from previous session with full context restoration. Load STATE.md for project context. Show current position, last activity, and recent progress from SUMMARY files. Offer next actions: continue current plan, resume paused session, start new work.`,
  
  'gsd-pause-work': `Create context handoff when pausing work mid-phase. Create .continue-here file in project root with current state. Update STATE.md session continuity section. Capture in-progress work, current file, last commit, open questions.`,
  
  'gsd-new-milestone': `Start a new milestone through unified flow for existing projects. Conduct questioning to understand what's next. Optional domain research. Define requirements. Create ROADMAP.md with phase breakdown. Works on projects with existing PROJECT.md.`,
  
  'gsd-complete-milestone': `Archive completed milestone and prepare for next version. Create MILESTONES.md entry with stats. Archive full details to milestones/vX.Y/ directory. Create git tag for release. Prepare workspace for next version. Update STATE.md.`,
  
  'gsd-audit-milestone': `Audit milestone completion against original intent. Read all phase VERIFICATION.md files. Check requirements coverage from REQUIREMENTS.md. Spawn integration checker agent for cross-phase wiring. Create MILESTONE-AUDIT.md with gaps, tech debt, and recommendations.`,
  
  'gsd-plan-milestone-gaps': `Create phases to close gaps identified by milestone audit. Read MILESTONE-AUDIT.md. Group gaps into coherent phases. Prioritize by requirement priority (must/should/nice). Add gap closure phases to ROADMAP.md. Ready for /plan-phase on new phases.`,
  
  'gsd-verify-work': `Validate built features through conversational UAT. Extract testable deliverables from SUMMARY.md files for specified phase. Present tests one at a time. Wait for yes/no responses. Automatically diagnose failures and create fix plans. Mark as ready for re-execution if issues found.`,
  
  'gsd-reapply-patches': `Reapply previously created patches. Load patch files from .planning/patches/. Prompt user for patch selection. Handle conflicts interactively. Verify application. Update STATE.md. Commit changes.`,
  
  'gsd-health': `Check project health and integrity. Validate phase numbering consistency. Check disk vs ROADMAP.md sync. Validate .planning/ directory structure. Check for common issues. Report problems with fixes.`,
  
  'gsd-cleanup': `Archive accumulated phase directories from completed milestones. Identify phases from completed milestones still in .planning/phases/. Show dry-run summary before moving. Move phase dirs to .planning/milestones/vX.Y-phases/. Reduce clutter.`,
  'gsd-join-discord': `Display GSD Discord community information and invitation link. Show benefits of joining. Provide direct link.`,
  'gsd-set-profile': `Quick switch model profile for GSD agents. Options: quality (Opus everywhere), balanced (Opus for planning, Sonnet for execution), budget (Sonnet for writing, Haiku for research). Update .planning/config.json.`
};

function fixSkill(skillPath) {
  const skillName = path.basename(skillPath);
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  
  if (!fs.existsSync(skillMdPath)) {
    return false;
  }

  let content = fs.readFileSync(skillMdPath, 'utf-8');
  let changed = false;

  // 1. Compatibility fixen
  if (content.includes(' compatibility:') || content.includes('compatibility:')) {
    content = content.replace(
      /(^compatibility:\s*).*/gm,
      '$1Mistral Vibe'
    );
    changed = true;
  }

  // 2. Slash Commands fixen (/gsd:xxx → vibe -p "gsd-xxx")
  if (content.includes('/gsd:')) {
    content = content.replace(
      /\/gsd:([a-z0-9-]+)/g,
      'vibe -p "gsd-$1"'
    );
    changed = true;
  }

  // 3. Gebrochene Commands fixen ("gsd-new"-project → "gsd-new-project")
  if (content.match(/vibe -p "gsd-[^"]+"-[^"]+"/)) {
    content = content.replace(
      /vibe -p "gsd-([a-z0-9-]+)"-([a-z0-9-]+)/g,
      'vibe -p "gsd-$1-$2"'
    );
    changed = true;
  }

  // 4. Process-Block ersetzen/neu erstellen
  if (processDescriptions[skillName]) {
    const oldBlock = content.match(/'>>'[\s\S]*?'<<'/);
    const newBlock = `'>>'\n<process>\n${processDescriptions[skillName]}\n</process>\n'<<'`;
    
    if (oldBlock) {
      content = content.replace(/'>>'[\s\S]*?'<<'/g, newBlock);
      changed = true;
    } else {
      // Nach Frontmatter einfügen
      content = content.replace(
        /(^---\n[\s\S]+?\n---)\n/,
        '$1\n\n' + newBlock + '\n\n'
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(skillMdPath, content, 'utf-8');
  }

  return changed;
}

// Haupt
console.log('🔧 Applying all Vibe fixes to ~/.vibe/skills/\n');

if (!fs.existsSync(SKILLS_DIR)) {
  console.error(`❌ Skills directory not found: ${SKILLS_DIR}`);
  process.exit(1);
}

const skillDirs = fs.readdirSync(SKILLS_DIR)
  .filter(d => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory())
  .sort();

let fixed = 0;
let unchanged = 0;

for (const dir of skillDirs) {
  const skillPath = path.join(SKILLS_DIR, dir);
  if (fixSkill(skillPath)) {
    console.log(`  ✅ ${dir}`);
    fixed++;
  } else {
    console.log(`  ⏭️  ${dir}`);
    unchanged++;
  }
}

console.log(`\n✨ Done!`);
console.log(`   Updated: ${fixed} skills`);
console.log(`   Unchanged: ${unchanged} skills`);
console.log(`\n💡 Ready! Test with: vibe -p "gsd-help"`);
