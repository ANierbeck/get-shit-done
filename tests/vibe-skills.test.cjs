/**
 * GSD Framework - Mistral Vibe Integration Tests
 *
 * Tests for Vibe skill compatibility, loading, and execution.
 * Part of the multi-runtime test suite (Claude, Codex, Qwen, Vibe, etc.)
 */

process.env.GSD_TEST_MODE = '1';

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('os');

/**
 * Mistral Vibe Skill Structure Requirements
 * Based on Vibe CLI v2.8.1 specification
 */
const VIBE_SKILL_REQUIREMENTS = {
  requiredFiles: ['SKILL.md'],
  optionalDirs: ['tools/', 'templates/', 'references/'],
  frontmatterFields: ['name', 'description', 'compatibility', 'user-invocable'],
  compatibilityValue: 'Mistral Vibe',
};

/**
 * Get Vibe skills directory path
 */
function getVibeSkillsDir() {
  const homeDir = os.homedir();
  const vibeDir = path.join(homeDir, '.vibe');
  const skillsDir = path.join(vibeDir, 'skills');
  return fs.existsSync(skillsDir) ? skillsDir : null;
}

/**
 * Count GSD skills in Vibe directory
 */
function countGsdSkills(skillsDir) {
  if (!fs.existsSync(skillsDir)) return 0;
  
  const dirs = fs.readdirSync(skillsDir, { withFileTypes: true });
  let count = 0;
  
  for (const dirent of dirs) {
    if (dirent.isDirectory() && dirent.name.startsWith('gsd-')) {
      const skillDir = path.join(skillsDir, dirent.name);
      const skillFile = path.join(skillDir, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        count++;
      }
    }
  }
  
  return count;
}

/**
 * Validate a single GSD skill for Vibe compatibility
 */
function validateVibeSkill(skillPath) {
  const errors = [];
  const warnings = [];
  
  // Check required files
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    errors.push('Missing SKILL.md');
    return { errors, warnings };
  }
  
  // Read and validate frontmatter
  const content = fs.readFileSync(skillMdPath, 'utf8');
  
  // Check for frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)---/);
  if (!frontmatterMatch) {
    errors.push('Missing YAML frontmatter');
    return { errors, warnings };
  }
  
  const frontmatter = frontmatterMatch[1];
  
  // Check required frontmatter fields
  for (const field of VIBE_SKILL_REQUIREMENTS.frontmatterFields) {
    // Match field at start of line or after start of frontmatter
    const fieldPattern = new RegExp(`(^|\\n)${field}:`);
    if (!fieldPattern.test(frontmatter)) {
      errors.push(`Missing frontmatter field: ${field}`);
    }
  }
  
  // Check compatibility
  if (!frontmatter.includes('compatibility: Mistral Vibe')) {
    warnings.push('compatibility should be "Mistral Vibe"');
  }
  
  // Check user-invocable
  if (!frontmatter.includes('user-invocable: true')) {
    warnings.push('user-invocable should be true');
  }
  
  // Check for process blocks (required for Vibe)
  const hasProcessBlock = content.includes('<process>') && content.includes('</process>');
  if (!hasProcessBlock) {
    warnings.push('Missing <process> block for non-interactive execution');
  }
  
  // Check name follows kebab-case pattern
  const nameMatch = frontmatter.match(/^name:\s*["']?(gsd-[\w-]+)["']?\s*$/m);
  if (nameMatch) {
    const name = nameMatch[1];
    if (!/^gsd-[a-z0-9-]+$/.test(name)) {
      warnings.push(`Skill name "${name}" does not follow kebab-case pattern`);
    }
  } else {
    // Try alternative format (name: without quotes, at start of line)
    const altNameMatch = frontmatter.match(/^[\s]*name:[\s]*(gsd-[\w-]+)/m);
    if (altNameMatch) {
      const name = altNameMatch[1];
      if (!/^gsd-[a-z0-9-]+$/.test(name)) {
        warnings.push(`Skill name "${name}" does not follow kebab-case pattern`);
      }
    } else {
      errors.push('Cannot parse skill name from frontmatter');
    }
  }
  
  // Check for slash commands (deprecated in Vibe)
  if (content.match(/\/gsd:[\w-]+/)) {
    warnings.push('Found deprecated /gsd:command format (use "vibe -p \"gsd-command\"" instead)');
  }
  
  // Check allowed-tools if present
  if (frontmatter.includes('allowed-tools:')) {
    const toolsSection = frontmatter.substring(frontmatter.indexOf('allowed-tools:'));
    const toolListMatch = toolsSection.match(/allowed-tools:\s*\n([\s\S]*?)(?:\n\S+\s*:|\n---|$)/);
    if (toolListMatch) {
      const toolsList = toolListMatch[1];
      if (toolsList.trim() === '') {
        warnings.push('allowed-tools list is empty');
      }
    }
  }
  
  return { errors, warnings };
}

/**
 * Validate all GSD skills in Vibe directory
 */
function validateAllGsdSkills(skillsDir) {
  const results = {
    total: 0,
    valid: 0,
    withErrors: 0,
    withWarnings: 0,
    errors: [],
    warnings: [],
    skillDetails: new Map(),
  };
  
  if (!fs.existsSync(skillsDir)) {
    return results;
  }
  
  const dirs = fs.readdirSync(skillsDir, { withFileTypes: true });
  
  for (const dirent of dirs) {
    if (!dirent.isDirectory() || !dirent.name.startsWith('gsd-')) continue;
    
    const skillPath = path.join(skillsDir, dirent.name);
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    
    if (!fs.existsSync(skillMdPath)) continue;
    
    const skillName = dirent.name;
    results.total++;
    
    const { errors, warnings } = validateVibeSkill(skillPath);
    results.skillDetails.set(skillName, { errors, warnings });
    
    if (errors.length > 0) {
      results.withErrors++;
      results.errors.push({ skill: skillName, errors });
    } else {
      results.valid++;
    }
    
    if (warnings.length > 0) {
      results.withWarnings++;
      results.warnings.push({ skill: skillName, warnings });
    }
  }
  
  return results;
}

// ============================================================================
// TESTS
// ============================================================================

describe('Mistral Vibe - GSD Skills Integration', () => {
  describe('Skill Structure Validation', () => {
    test('GSD skills directory exists in Vibe', () => {
      const skillsDir = getVibeSkillsDir();
      assert.notStrictEqual(skillsDir, null, 'Vibe skills directory should exist');
    });

    test('All 30 GSD skills are installed in Vibe', () => {
      const skillsDir = getVibeSkillsDir();
      assert.notStrictEqual(skillsDir, null, 'Vibe skills directory should exist');
      
      const count = countGsdSkills(skillsDir);
      assert.strictEqual(count, 30, `Expected 30 GSD skills, found ${count}`);
    });

    test('All GSD skills have valid Vibe structure', () => {
      const skillsDir = getVibeSkillsDir();
      assert.notStrictEqual(skillsDir, null, 'Vibe skills directory should exist');
      
      const results = validateAllGsdSkills(skillsDir);
      
      // No skills should have errors (structural issues)
      assert.strictEqual(results.withErrors, 0, 
        `Expected 0 skills with errors, found ${results.withErrors}: ${JSON.stringify(results.errors, null, 2)}`);
      
      // All skills should have SKILL.md
      assert.strictEqual(results.total, 30, 
        `Expected to validate 30 skills, validated ${results.total}`);
    });

    test('All GSD skills have Mistral Vibe compatibility', () => {
      const skillsDir = getVibeSkillsDir();
      assert.notStrictEqual(skillsDir, null, 'Vibe skills directory should exist');
      
      const results = validateAllGsdSkills(skillsDir);
      
      // Check that no skill has a compatibility error
      for (const [skillName, details] of results.skillDetails) {
        const hasCompatibilityWarning = details.warnings.some(w => 
          w.includes('compatibility') && w.includes('Mistral Vibe')
        );
        assert.strictEqual(hasCompatibilityWarning, false, 
          `Skill ${skillName} should have Mistral Vibe compatibility`);
      }
    });

    test('All GSD skills have process blocks', () => {
      const skillsDir = getVibeSkillsDir();
      assert.notStrictEqual(skillsDir, null, 'Vibe skills directory should exist');
      
      const results = validateAllGsdSkills(skillsDir);
      
      // Check that no skill is missing process block
      for (const [skillName, details] of results.skillDetails) {
        const hasProcessWarning = details.warnings.some(w => 
          w.includes('process block')
        );
        assert.strictEqual(hasProcessWarning, false, 
          `Skill ${skillName} should have <process> block`);
      }
    });

    test('All GSD skills have user-invocable: true', () => {
      const skillsDir = getVibeSkillsDir();
      assert.notStrictEqual(skillsDir, null, 'Vibe skills directory should exist');
      
      const results = validateAllGsdSkills(skillsDir);
      
      for (const [skillName, details] of results.skillDetails) {
        const hasUserInvocableWarning = details.warnings.some(w => 
          w.includes('user-invocable')
        );
        assert.strictEqual(hasUserInvocableWarning, false, 
          `Skill ${skillName} should have user-invocable: true`);
      }
    });

    test('No GSD skills use deprecated /gsd:command format', () => {
      const skillsDir = getVibeSkillsDir();
      assert.notStrictEqual(skillsDir, null, 'Vibe skills directory should exist');
      
      const results = validateAllGsdSkills(skillsDir);
      
      for (const [skillName, details] of results.skillDetails) {
        const hasSlashCommandWarning = details.warnings.some(w => 
          w.includes('/gsd:command')
        );
        assert.strictEqual(hasSlashCommandWarning, false, 
          `Skill ${skillName} should not use deprecated /gsd:command format`);
      }
    });
  });

  describe('Skill Naming Convention', () => {
    test('All GSD skills follow kebab-case naming', () => {
      const skillsDir = getVibeSkillsDir();
      assert.notStrictEqual(skillsDir, null, 'Vibe skills directory should exist');
      
      const results = validateAllGsdSkills(skillsDir);
      
      for (const [skillName, details] of results.skillDetails) {
        const hasNamingWarning = details.warnings.some(w => 
          w.includes('kebab-case')
        );
        assert.strictEqual(hasNamingWarning, false, 
          `Skill ${skillName} should follow kebab-case naming convention`);
      }
    });

    test('All GSD skills have gsd- prefix', () => {
      const skillsDir = getVibeSkillsDir();
      assert.notStrictEqual(skillsDir, null, 'Vibe skills directory should exist');
      
      const dirs = fs.readdirSync(skillsDir, { withFileTypes: true });
      
      for (const dirent of dirs) {
        if (dirent.isDirectory() && dirent.name.startsWith('gsd-')) {
          const skillPath = path.join(skillsDir, dirent.name);
          const skillMdPath = path.join(skillPath, 'SKILL.md');
          
          if (fs.existsSync(skillMdPath)) {
            const content = fs.readFileSync(skillMdPath, 'utf8');
            const nameMatch = content.match(/^name:\s*["']?(gsd-[\w-]+)["']?\s*$/m);
            
            assert.notStrictEqual(nameMatch, null, 
              `Skill ${dirent.name} should have a name in frontmatter`);
            
            if (nameMatch) {
              assert.ok(nameMatch[1].startsWith('gsd-'), 
                `Skill name "${nameMatch[1]}" should start with gsd-`);
            }
          }
        }
      }
    });
  });

  describe('Optional Directory Structure', () => {
    test('GSD skills may have tools/ directory', () => {
      const skillsDir = getVibeSkillsDir();
      assert.notStrictEqual(skillsDir, null, 'Vibe skills directory should exist');
      
      const dirs = fs.readdirSync(skillsDir, { withFileTypes: true });
      let hasToolsDir = false;
      
      for (const dirent of dirs) {
        if (dirent.isDirectory() && dirent.name.startsWith('gsd-')) {
          const skillPath = path.join(skillsDir, dirent.name);
          const toolsDir = path.join(skillPath, 'tools');
          
          if (fs.existsSync(toolsDir)) {
            hasToolsDir = true;
            break;
          }
        }
      }
      
      assert.ok(hasToolsDir, 'At least one GSD skill should have a tools/ directory');
    });

    test('GSD skills may have templates/ directory', () => {
      const skillsDir = getVibeSkillsDir();
      assert.notStrictEqual(skillsDir, null, 'Vibe skills directory should exist');
      
      const dirs = fs.readdirSync(skillsDir, { withFileTypes: true });
      let hasTemplatesDir = false;
      
      for (const dirent of dirs) {
        if (dirent.isDirectory() && dirent.name.startsWith('gsd-')) {
          const skillPath = path.join(skillsDir, dirent.name);
          const templatesDir = path.join(skillPath, 'templates');
          
          if (fs.existsSync(templatesDir) && fs.readdirSync(templatesDir).length > 0) {
            hasTemplatesDir = true;
            break;
          }
        }
      }
      
      assert.ok(hasTemplatesDir, 'At least one GSD skill should have a non-empty templates/ directory');
    });

    test('GSD skills may have references/ directory', () => {
      const skillsDir = getVibeSkillsDir();
      assert.notStrictEqual(skillsDir, null, 'Vibe skills directory should exist');
      
      const dirs = fs.readdirSync(skillsDir, { withFileTypes: true });
      let hasReferencesDir = false;
      
      for (const dirent of dirs) {
        if (dirent.isDirectory() && dirent.name.startsWith('gsd-')) {
          const skillPath = path.join(skillsDir, dirent.name);
          const referencesDir = path.join(skillPath, 'references');
          
          if (fs.existsSync(referencesDir) && fs.readdirSync(referencesDir).length > 0) {
            hasReferencesDir = true;
            break;
          }
        }
      }
      
      assert.ok(hasReferencesDir, 'At least one GSD skill should have a non-empty references/ directory');
    });
  });
});

// ============================================================================
// Runtime Detection Tests
// ============================================================================

describe('Mistral Vibe - Runtime Detection', () => {
  test('Vibe CLI is available in PATH', () => {
    // This test verifies that Vibe CLI is installed and accessible
    try {
      const { execSync } = require('child_process');
      const result = execSync('vibe --version', { encoding: 'utf8', stdio: 'pipe' });
      assert.match(result, /\d+\.\d+\.\d+/, 'Vibe version should be in semantic version format');
    } catch (error) {
      assert.fail('Vibe CLI should be available in PATH');
    }
  });

  test('Vibe version is 2.8.1 or higher', () => {
    try {
      const { execSync } = require('child_process');
      const result = execSync('vibe --version', { encoding: 'utf8', stdio: 'pipe' });
      const versionMatch = result.match(/(\d+\.\d+\.\d+)/);
      
      if (versionMatch) {
        const version = versionMatch[1];
        const [major, minor, patch] = version.split('.').map(Number);
        
        assert.ok(
          major > 2 || (major === 2 && minor >= 8) || (major === 2 && minor === 8 && patch >= 1),
          `Vibe version ${version} should be 2.8.1 or higher`
        );
      } else {
        assert.fail(`Could not parse Vibe version from: ${result}`);
      }
    } catch (error) {
      assert.fail('Vibe CLI should be available in PATH');
    }
  });
});

// ============================================================================
// Skill Loading Tests
// ============================================================================

describe('Mistral Vibe - Skill Loading', () => {
  test('Vibe recognizes gsd-help skill', () => {
    try {
      const { execSync } = require('child_process');
      // Use --prompt with a timeout to test non-interactive execution
      const result = execSync('timeout 30 vibe --prompt "gsd-help" 2>&1 || true', {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 35000
      });
      
      assert.match(result, /GSD Command Reference/,
        'gsd-help should output GSD Command Reference');
      
      assert.match(result, /gsd-new-project/,
        'gsd-help should list gsd-new-project command');
      
      assert.match(result, /gsd-plan-phase/,
        'gsd-help should list gsd-plan-phase command');
    } catch (error) {
      assert.fail(`Failed to execute gsd-help: ${error.message}`);
    }
  });
});
