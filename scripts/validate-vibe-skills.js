#!/usr/bin/env node
/**
 * Validiert alle GSD Skills auf Vibe-Kompatibilität
 * Prüft STRUKTUR ohne Code auszuführen
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');

// Liste der gültigen Vibe Tools (aus Vibe Dokumentation)
const VIBE_TOOLS = new Set([
  'read_file', 'write_file', 'append_file', 'grep', 'bash',
  'ask_user_question', 'todo', 'search_replace', 'task',
  'web_search', 'web_fetch', 'list_resources', 'read_resource',
  'apple_mcp_contacts', 'apple_mcp_notes', 'apple_mcp_messages',
  'apple_mcp_mail', 'apple_mcp_reminders', 'apple_mcp_calendar',
  'apple_mcp_maps'
]);

function validateSkill(skillPath) {
  const errors = [];
  const warnings = [];
  const skillName = path.basename(skillPath);

  // 1. SKILL.md existiert
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    errors.push(`Missing SKILL.md`);
    return { skillName, errors, warnings };
  }

  // 2. SKILL.md Frontmatter parsen
  const content = fs.readFileSync(skillMdPath, 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
  if (!frontmatterMatch) {
    errors.push(`Missing or invalid frontmatter in SKILL.md`);
    return { skillName, errors, warnings };
  }

  const frontmatter = parseFrontmatter(frontmatterMatch[1]);

  // 3. Name validieren - MUSS gsd- prefix sein
  if (!frontmatter.name) {
    errors.push(`Missing 'name' in frontmatter`);
  } else if (!/^gsd-[a-z0-9-]+$/.test(frontmatter.name)) {
    errors.push(`Invalid name: '${frontmatter.name}'. Must be kebab-case with gsd- prefix`);
  } else if (frontmatter.name !== skillName) {
    warnings.push(`Name in frontmatter (${frontmatter.name}) doesn't match directory name (${skillName})`);
  }

  // 4. user-invocable MUSS true sein
  if (frontmatter['user-invocable'] !== true) {
    warnings.push(`user-invocable should be true (currently: ${frontmatter['user-invocable']})`);
  }

  // 5. allowed-tools validieren
  if (frontmatter['allowed-tools']) {
    for (const tool of frontmatter['allowed-tools']) {
      if (!VIBE_TOOLS.has(tool)) {
        warnings.push(`Unknown Vibe tool: '${tool}'`);
      }
    }
  }

  // 6. Process-Block prüfen
  if (!content.includes('>>') || !content.includes('<<')) {
    warnings.push(`Missing process block (>> ... <<)`);
  }

  // 7. Process-Block Struktur prüfen
  const processBlockMatch = content.match(/>>'[\s\S]*?<<'/);
  if (processBlockMatch) {
    const processContent = processBlockMatch[0];
    if (!processContent.includes('<process>')) {
      warnings.push(`Process block should contain <process> tag`);
    }
    if (!processContent.includes('</process>')) {
      warnings.push(`Process block should contain </process> tag`);
    }
  }

  // 8. Tools-Verzeichnis prüfen
  const toolsDir = path.join(skillPath, 'tools');
  if (fs.existsSync(toolsDir)) {
    const allFiles = fs.readdirSync(toolsDir);
    const toolFiles = allFiles.filter(f => f.endsWith('.js') || f.endsWith('.py'));
    const gitKeepOnly = allFiles.length === 1 && allFiles[0] === '.gitkeep';
    
    if (toolFiles.length === 0 && gitKeepOnly) {
      warnings.push(`tools/ directory is empty (only .gitkeep)`);
    } else if (toolFiles.length === 0) {
      warnings.push(`tools/ directory exists but has no tool files`);
    } else {
      // Prüfe Tool-Header
      for (const toolFile of toolFiles) {
        const toolPath = path.join(toolsDir, toolFile);
        const toolContent = fs.readFileSync(toolPath, 'utf-8');
        if (!toolContent.includes('Vibe Tool:')) {
          warnings.push(`Tool ${toolFile} missing 'Vibe Tool:' header`);
        }
      }
    }
  } else {
    warnings.push(`No tools/ directory found`);
  }

  // 9. Templates-Verzeichnis prüfen
  const templatesDir = path.join(skillPath, 'templates');
  if (fs.existsSync(templatesDir)) {
    const templateFiles = fs.readdirSync(templatesDir).filter(f => !f.startsWith('.'));
    if (templateFiles.length === 0) {
      warnings.push(`templates/ directory is empty`);
    }
  } else {
    warnings.push(`No templates/ directory found`);
  }

  // 10. References-Verzeichnis prüfen
  const referencesDir = path.join(skillPath, 'references');
  if (fs.existsSync(referencesDir)) {
    const referenceFiles = fs.readdirSync(referencesDir).filter(f => !f.startsWith('.'));
    if (referenceFiles.length === 0) {
      warnings.push(`references/ directory is empty`);
    }
  } else {
    warnings.push(`No references/ directory found`);
  }

  // 11. License prüfen
  if (!frontmatter.license) {
    warnings.push(`Missing license in frontmatter`);
  }

  // 12. Description prüfen
  if (!frontmatter.description) {
    warnings.push(`Missing description in frontmatter`);
  }

  // 13. Compatibility prüfen
  const compatMatch = content.match(/^compatibility:\s*(.+)$/m);
  if (compatMatch) {
    const compat = compatMatch[1].trim();
    if (!compat.includes('Vibe') && !compat.includes('vibe')) {
      warnings.push(`Compatibility should mention Vibe (currently: ${compat})`);
    }
  } else {
    warnings.push(`Missing compatibility field`);
  }

  // 14. Slash Commands prüfen (sollten nicht mehr vorkommen)
  if (content.match(/\/gsd:/)) {
    warnings.push(`Found /gsd: slash commands - should use "vibe -p \"gsd-...\"" format`);
  }

  return { skillName, errors, warnings };
}

function parseFrontmatter(yaml) {
  const obj = {};
  yaml.split('\n').forEach(line => {
    const match = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (match) {
      const key = match[1];
      const value = match[2].trim();
      
      // Boolean
      if (value === 'true' || value === 'false') {
        obj[key] = value === 'true';
      }
      // Array
      else if (/^\[.*\]$/.test(value)) {
        obj[key] = value.slice(1, -1).split(',').map(v => v.trim());
      }
      // String (entferne Anführungszeichen)
      else if ((value.startsWith('"') && value.endsWith('"')) || 
               (value.startsWith("'") && value.endsWith("'"))) {
        obj[key] = value.slice(1, -1);
      }
      // Plain string
      else {
        obj[key] = value;
      }
    }
  });
  return obj;
}

// ============ HAUPTFUNKTION ============

function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════');
  console.log('║  GSD Skills - Vibe Compatibility Validator         ');
  console.log('╚══════════════════════════════════════════════════════');
  console.log('');

  // Skills-Directory prüfen
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`❌ Skills directory not found: ${SKILLS_DIR}`);
    console.error(`   Expected: ${path.resolve(SKILLS_DIR)}`);
    process.exit(1);
  }

  // Alle Skill-Verzeichnisse finden
  let skillDirs;
  try {
    skillDirs = fs.readdirSync(SKILLS_DIR)
      .filter(d => {
        const fullPath = path.join(SKILLS_DIR, d);
        return fs.statSync(fullPath).isDirectory();
      })
      .sort();
  } catch (err) {
    console.error(`❌ Error reading skills directory: ${err.message}`);
    process.exit(1);
  }

  if (skillDirs.length === 0) {
    console.error(`❌ No skills found in ${SKILLS_DIR}`);
    process.exit(1);
  }

  console.log(`🔍 Found ${skillDirs.length} skills to validate...\n`);

  const results = [];
  let validCount = 0;
  let warningCount = 0;
  let errorCount = 0;

  for (const dir of skillDirs) {
    const skillPath = path.join(SKILLS_DIR, dir);
    const result = validateSkill(skillPath);
    results.push(result);
    
    // Zähler aktualisieren
    if (result.errors.length > 0) {
      errorCount++;
    } else if (result.warnings.length > 0) {
      warningCount++;
    } else {
      validCount++;
    }

    // Ausgabe
    const status = result.errors.length > 0 ? '❌' : 
                   result.warnings.length > 0 ? '⚠️ ' : '✅';
    const count = result.warnings.length + result.errors.length;
    
    console.log(`${status} ${result.skillName.padEnd(30)} [${result.errors.length} errors, ${result.warnings.length} warnings]`);
    
    // Errors immer anzeigen
    result.errors.forEach(e => {
      console.log(`   ${' '.repeat(33)}❌ ERROR: ${e}`);
    });
    
    // Warnings nur bei --verbose anzeigen (oder in Zusammenfassung)
    const showWarnings = process.argv.includes('--verbose') || process.argv.includes('-v');
    if (showWarnings) {
      result.warnings.forEach(w => {
        console.log(`   ${' '.repeat(33)}⚠️  WARN: ${w}`);
      });
    }
  }

  // Zusammenfassung
  console.log('');
  console.log('═'.repeat(62));
  console.log('  SUMMARY');
  console.log('═'.repeat(62));
  console.log(`  Total skills:      ${skillDirs.length}`);
  console.log(`  ✅ Valid:            ${validCount}`);
  console.log(`  ⚠️  With warnings:    ${warningCount}`);
  console.log(`  ❌ With errors:      ${errorCount}`);
  console.log('');

  // Alle Warnings auflisten (wenn nicht --verbose)
  if (!process.argv.includes('--verbose') && !process.argv.includes('-v')) {
    console.log('  All warnings:');
    results.forEach(result => {
      if (result.warnings.length > 0) {
        console.log(`  ${' '.repeat(18)}• ${result.skillName}:`);
        result.warnings.forEach(w => {
          console.log(`  ${' '.repeat(20)}  - ${w}`);
        });
      }
    });
  }

  console.log('');

  // Exit Code
  if (errorCount > 0) {
    console.log('❌ VALIDATION FAILED - Skills have errors that must be fixed');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('⚠️  VALIDATION PASSED WITH WARNINGS - Review warnings above');
    process.exit(0);
  } else {
    console.log('✅ ALL SKILLS ARE VIBE-COMPATIBLE!');
    process.exit(0);
  }
}

// Execute
main();
