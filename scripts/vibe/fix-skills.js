#!/usr/bin/env node
/**
 * Unified Vibe skill fixer
 * Applies all Vibe compatibility fixes to GSD skills in a target directory.
 * 
 * Usage:
 *   node scripts/vibe/fix-skills.js [target-dir]
 * 
 *   Default target: ./skills/
 *   Alternative: ./skills/ or ~/.vibe/skills/
 */

const fs = require('fs');
const path = require('path');

// Target directory from args or default
const targetDir = process.argv[2] || path.join(__dirname, '..', '..', 'skills');

// Standard process descriptions based on skill names
const skillProcessDescriptions = {
  'gsd-new-project': `Execute the new-project workflow end-to-end. Preserve all workflow gates (research, requirements, roadmap creation, validation, approvals, commits, routing).`,
  'gsd-plan-phase': `Execute the plan-phase workflow end-to-end. Preserve all workflow gates (requirements check, plan generation, validation, routing).`,
  'gsd-execute-phase': `Execute the execute-phase workflow end-to-end. Preserve all workflow gates (wave execution, checkpoint handling, verification, state updates, routing).`,
  'gsd-help': `Display GSD command reference and documentation. Provide usage examples and command descriptions.`,
  'gsd-progress': `Display project progress and status. Show current phase, plan, completion percentage, and next steps.`,
  'gsd-debug': `Start or resume a debug session. Gather symptoms, create hypotheses, run tests, document findings.`,
  'gsd-settings': `Configure GSD workflow settings interactively. Toggle agents, set model profiles, update configuration.`,
  'gsd-update': `Update GSD to latest version. Show changelog, highlight breaking changes, confirm before installing.`,
  'gsd-add-phase': `Add a new phase to the current milestone. Append to ROADMAP.md, create phase directory, update state.`,
  'gsd-insert-phase': `Insert a new decimal phase between existing phases. Maintain phase ordering, update all references.`,
  'gsd-remove-phase': `Remove a future phase and renumber subsequent phases. Delete phase directory, update ROADMAP.md.`,
  'gsd-add-todo': `Capture a task or idea as a todo. Create structured todo file, infer area from context, check for duplicates.`,
  'gsd-check-todos': `List pending todos and select one to work on. Load context, route to appropriate action.`,
  'gsd-new-milestone': `Start a new milestone through unified flow. Research, requirements, roadmap creation for brownfield projects.`,
  'gsd-complete-milestone': `Archive completed milestone and prepare for next version. Create MILESTONES.md entry, archive phase dirs, create git tag.`,
  'gsd-audit-milestone': `Audit milestone completion against original intent. Check requirements coverage, spawn integration checker, create audit report.`,
  'gsd-plan-milestone-gaps': `Create phases to close gaps identified by audit. Group gaps into phases, prioritize, add to ROADMAP.md.`,
  'gsd-quick': `Execute quick, ad-hoc tasks with GSD guarantees. Spawn planner + executor, skip optional agents, update STATE.md.`,
  'gsd-resume-work': `Resume work from previous session with full context restoration. Read STATE.md, show position, offer next actions.`,
  'gsd-pause-work': `Create context handoff when pausing work mid-phase. Create .continue-here file, update STATE.md.`,
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

// Examined and working descriptions from fix-process-blocks-proper
const improvedProcessDescriptions = {
  'gsd-help': `Display the complete GSD command reference and documentation from the SKILL.md content.`,
  'gsd-new-project': `Execute the complete new-project workflow: conduct deep questioning to understand the project, optionally run domain research, define requirements with v1/v2/out-of-scope, create ROADMAP.md, initialize all .planning/ artifacts. Preserve all workflow gates.`,
  'gsd-plan-phase': `Execute the complete plan-phase workflow: load context, analyze requirements, break phase into concrete tasks, create PLAN.md with verification criteria, success measures, and dependencies. Preserve all workflow gates.`,
  'gsd-execute-phase': `Execute the complete execute-phase workflow: discover plans, analyze dependencies, group into waves, spawn subagents for parallel execution, collect results, verify phase goal. Preserve all workflow gates.`,
  'gsd-progress': `Display project status: show visual progress bar, completion percentages, recent work summary, current position, next actions. Offer to execute next plan or create it if missing.`,
  'gsd-debug': `Start or resume a debug session: gather symptoms through adaptive questioning, create .planning/debug/[slug].md, investigate using scientific method (evidence -> hypothesis -> test), diagnose root causes, suggest fixes.`,
  'gsd-settings': `Configure GSD workflow settings interactively: present configuration options, allow user to toggle researcher/planner/executor/verifier agents, select model profile (quality/balanced/budget), update .planning/config.json.`,
  'gsd-update': `Update GSD to latest version: show installed vs latest comparison, display changelog entries for missed versions, highlight breaking changes, confirm before running install.`
};

// ============================================
// FIX 1: Fix broken slash commands
// ============================================
function fixBrokenCommands(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Pattern: vibe -p "gsd-XXXX"-YYYY  ->  vibe -p "gsd-XXXX-YYYY"
  content = content.replace(
    /vibe -p "gsd-([a-z0-9-]+)"-([a-z0-9-]+)/g,
    'vibe -p "gsd-$1-$2"'
  );

  // Also in backticks
  content = content.replace(
    /`vibe -p "gsd-([a-z0-9-]+)"-([a-z0-9-]+)`/g,
    '`vibe -p "gsd-$1-$2"`'
  );

  // Also: vibe -p "gsd-XX" -phase
  content = content.replace(
    /vibe -p "gsd-([a-z0-9-]+)"\s*-\s*(\w+)/g,
    'vibe -p "gsd-$1-$2"'
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

// ============================================
// FIX 2: Extract main content for process block
// ============================================
function extractMainContent(content) {
  // Remove frontmatter
  let text = content.replace(/^---\n[\s\S]+?\n---/, '');
  
  // Remove existing process blocks
  text = text.replace(/'>>'[\s\S]*?'<<'/g, '');
  
  // Take everything up to first ## header
  const firstHeaderMatch = text.match(/^##\s+/m);
  if (firstHeaderMatch) {
    text = text.substring(0, firstHeaderMatch.index).trim();
  }
  
  return text.trim();
}

// ============================================
// FIX 3: Create process block
// ============================================
function createProcessBlock(skillName, content) {
  // Check for improved description first
  if (improvedProcessDescriptions[skillName]) {
    return `'>>'\n<process>\n${improvedProcessDescriptions[skillName]}\n</process>\n'<<'`;
  }
  
  // Check for standard description
  if (skillProcessDescriptions[skillName]) {
    return `'>>'\n<process>\n${skillProcessDescriptions[skillName]}\n</process>\n'<<'`;
  }
  
  // Extract from content
  const mainContent = extractMainContent(content);
  
  if (mainContent && mainContent.length > 10) {
    // Clean markdown formatting
    let processText = mainContent
      .replace(/^#+\s+/gm, '')   // Remove headings
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // **Bold**
      .replace(/\*([^*]+)\*/g, '$1')      // *Italic*
      .replace(/`([^`]+)`/g, '$1')        // Inline code
      .replace(/-\s+/g, '')               // List items
      .replace(/\n{2,}/g, '\n')          // Multiple newlines
      .trim();
    
    // Truncate if too long
    if (processText.length > 500) {
      processText = processText.substring(0, 500) + '...';
    }
    
    return `'>>'\n<process>\n${processText}\n</process>\n'<<'`;
  }
  
  // Fallback
  return `'>>'\n<process>\nExecute the ${skillName} workflow end-to-end. Follow the instructions in the SKILL.md content.\n</process>\n'<<'`;
}

// ============================================
// FIX 4: Add or replace process block
// ============================================
function fixProcessBlock(skillName, skillMdPath) {
  let content = fs.readFileSync(skillMdPath, 'utf-8');
  const original = content;

  // Check if skill already has a process block
  const hasProcessBlock = content.includes('>>') && content.includes('<<');
  
  if (!hasProcessBlock) {
    // Add new process block before first ## header or after frontmatter
    const firstHeaderMatch = content.match(/^#\s+/m);
    if (firstHeaderMatch) {
      const insertPos = firstHeaderMatch.index;
      const newProcessBlock = createProcessBlock(skillName, content);
      content = content.slice(0, insertPos) + '\n' + newProcessBlock + '\n\n' + content.slice(insertPos);
    } else {
      // After frontmatter
      content = content.replace(/^---$\n/m, `---\n\n` + createProcessBlock(skillName, content) + `\n\n`);
    }
    
    if (content !== original) {
      fs.writeFileSync(skillMdPath, content, 'utf-8');
      return true;
    }
    return false;
  } else {
    // Replace existing process block
    const newProcessBlock = createProcessBlock(skillName, content);
    content = content.replace(/'>>'[\s\S]*?'<<'/g, newProcessBlock);
    
    if (content !== original) {
      fs.writeFileSync(skillMdPath, content, 'utf-8');
      return true;
    }
    return false;
  }
}

// ============================================
// MAIN
// ============================================
function main() {
  console.log(`🔧 Fixing Vibe skills in: ${targetDir}\n`);

  if (!fs.existsSync(targetDir)) {
    console.error(`❌ Target directory does not exist: ${targetDir}`);
    process.exit(1);
  }

  const skillDirs = fs.readdirSync(targetDir)
    .filter(d => {
      const p = path.join(targetDir, d);
      return fs.statSync(p).isDirectory();
    })
    .sort();

  let totalFixed = 0;
  let totalSkipped = 0;

  for (const dir of skillDirs) {
    const skillPath = path.join(targetDir, dir);
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    
    if (!fs.existsSync(skillMdPath)) {
      console.log(`  ⚠️  ${dir} (no SKILL.md)`);
      continue;
    }

    let fixed = false;

    // Fix broken slash commands
    if (fixBrokenCommands(skillMdPath)) {
      console.log(`  🔧 ${dir} (slash commands)`);
      fixed = true;
    }

    // Fix/add process blocks
    if (fixProcessBlock(dir, skillMdPath)) {
      if (!fixed) {
        console.log(`  🔧 ${dir} (process blocks)`);
      } else {
        console.log(`  ✅ ${dir} (slash commands + process blocks)`);
      }
      fixed = true;
    }

    if (fixed) {
      totalFixed++;
    } else {
      console.log(`  ⏭️  ${dir} (already correct)`);
      totalSkipped++;
    }
  }

  console.log(`\n✨ Done! Fixed ${totalFixed} skills, ${totalSkipped} already correct in ${targetDir}`);
}

main();
