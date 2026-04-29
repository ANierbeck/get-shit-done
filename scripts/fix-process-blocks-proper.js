#!/usr/bin/env node
/**
 * Ersetzt die generischen Process-Blöcke durch den eigentlichen Skill-Inhalt
 * Vibe führt den Process-Block aus, also muss da die Anweisung stehen
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', '.vibe', 'skills');

// Spezielle Process-Beschreibungen für Skills die keinen klaren Text haben
const customDescriptions = {
  'gsd-help': `Display the complete GSD command reference and documentation from the SKILL.md content.`,
  'gsd-new-project': `Execute the complete new-project workflow: conduct deep questioning to understand the project, optionally run domain research, define requirements with v1/v2/out-of-scope, create ROADMAP.md, initialize all .planning/ artifacts. Preserve all workflow gates.`,
  'gsd-plan-phase': `Execute the complete plan-phase workflow: load context, analyze requirements, break phase into concrete tasks, create PLAN.md with verification criteria, success measures, and dependencies. Preserve all workflow gates.`,
  'gsd-execute-phase': `Execute the complete execute-phase workflow: discover plans, analyze dependencies, group into waves, spawn subagents for parallel execution, collect results, verify phase goal. Preserve all workflow gates.`,
  'gsd-progress': `Display project status: show visual progress bar, completion percentages, recent work summary, current position, next actions. Offer to execute next plan or create it if missing.`,
  'gsd-debug': `Start or resume a debug session: gather symptoms through adaptive questioning, create .planning/debug/[slug].md, investigate using scientific method (evidence → hypothesis → test), diagnose root causes, suggest fixes.`,
  'gsd-settings': `Configure GSD workflow settings interactively: present configuration options, allow user to toggle researcher/planner/executor/verifier agents, select model profile (quality/balanced/budget), update .planning/config.json.`,
  'gsd-update': `Update GSD to latest version: show installed vs latest comparison, display changelog entries for missed versions, highlight breaking changes, confirm before running install.`
};

function extractMainContent(content) {
  // Entferne Frontmatter
  let text = content.replace(/^---\n[\s\S]+?\n---/, '');
  
  // Entferne Process-Blöcke
  text = text.replace(/'>>'[\s\S]*?'<<'/g, '');
  
  // Nimm alles bis zum ersten ## Header
  const firstHeaderMatch = text.match(/^##\s+/m);
  if (firstHeaderMatch) {
    text = text.substring(0, firstHeaderMatch.index).trim();
  }
  
  // BEREINIGEN: Entferne leere Zeilen am Anfang/Ende
  text = text.trim();
  
  // BEREINIGEN: Entferne Markdown-Formatierungen die für Vibe irrelevant sind
  // Aber: Behale wichtige Informationen
  
  return text;
}

function createProperProcessBlock(skillName, content) {
  // Hat der Skill eine benutzerdefinierte Beschreibung?
  if (customDescriptions[skillName]) {
    return `'>>'\n<process>\n${customDescriptions[skillName]}\n</process>\n'<<'`;
  }
  
  // Ansonsten: Extrahiere Hauptinhalt
  const mainContent = extractMainContent(content);
  
  if (mainContent && mainContent.length > 10) {
    // Konvertiere Markdown zu reinem Text für Process-Block
    // Entferne **Fett**, *Kursiv*, etc.
    let processText = mainContent
      .replace(/^#+\s+/gm, '')  // Überschriften entfernen
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // **Fett**
      .replace(/\*([^*]+)\*/g, '$1')  // *Kursiv*
      .replace(/`([^`]+)`/g, '$1')  // Inline Code
      .replace(/-\s+/g, '')  // Liste Punkte
      .replace(/\n{2,}/g, '\n')  // Mehrere Leerzeilen
      .trim();
    
    // Wenn der Text zu lang ist, kürzen
    if (processText.length > 500) {
      processText = processText.substring(0, 500) + '...';
    }
    
    return `'>>'\n<process>\n${processText}\n</process>\n'<<'`;
  }
  
  // Fallback: Standardbeschreibung
  return `'>>'\n<process>\nExecute the ${skillName} workflow end-to-end. Follow the instructions in the SKILL.md content.\n</process>\n'<<'`;
}

function fixProcessBlock(skillPath) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    return false;
  }

  const skillName = path.basename(skillPath);
  let content = fs.readFileSync(skillMdPath, 'utf-8');
  const original = content;

  // Erzeuge neuen Process-Block
  const newProcessBlock = createProperProcessBlock(skillName, content);

  // Entferne alten Process-Block (falls vorhanden)
  content = content.replace(/'>>'[\s\S]*?'<<'/g, '');
  
  // Füge neuen Process-Block nach Frontmatter ein
  content = content.replace(
    /(^---\n[\s\S]+?\n---)\n/,
    '$1\n\n' + newProcessBlock + '\n\n'
  );

  if (content !== original) {
    fs.writeFileSync(skillMdPath, content, 'utf-8');
    return true;
  }
  return false;
}

// Haupt
console.log('🔧 Creating proper process blocks for Vibe...\n');

const skillDirs = fs.existsSync(SKILLS_DIR) 
  ? fs.readdirSync(SKILLS_DIR)
      .filter(d => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory())
      .sort()
  : [];

let fixed = 0;
let skipped = 0;

for (const dir of skillDirs) {
  const skillPath = path.join(SKILLS_DIR, dir);
  if (fixProcessBlock(skillPath)) {
    console.log(`  ✅ ${dir}`);
    fixed++;
  } else {
    console.log(`  ⏭️  ${dir} (no change needed)`);
    skipped++;
  }
}

console.log(`\n✨ Done! Updated ${fixed} skills, ${skipped} unchanged`);
