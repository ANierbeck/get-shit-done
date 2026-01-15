const fs = require('fs');
const path = require('path');

/**
 * Test path replacement functionality
 */
function testPathReplacement() {
  const testContent = `
[metadata]
source_md = "../commands/gsd/help.md"
workflow_md = "../get-shit-done/workflows/help.md"

[prompt]
user = "Read from ~/.claude/commands/gsd/help.md"
`;

  const expectedGlobal = `
[metadata]
source_md = "~/.vibe/commands/gsd/help.md"
workflow_md = "~/.vibe/get-shit-done/workflows/help.md"

[prompt]
user = "Read from ~/.vibe/commands/gsd/help.md"
`;

  const expectedLocal = `
[metadata]
source_md = "./.vibe/commands/gsd/help.md"
workflow_md = "./.vibe/get-shit-done/workflows/help.md"

[prompt]
user = "Read from ~/.vibe/commands/gsd/help.md"
`;

  // Test global path replacement
  let result = testContent;
  result = result.replace(/~\/\.claude\//g, '~/.vibe/');
  result = result.replace(/\.\.\/commands\/gsd\//g, '~/.vibe/commands/gsd/');
  result = result.replace(/\.\.\/get-shit-done\//g, '~/.vibe/get-shit-done/');

  console.log('Global path replacement test:');
  console.log(result === expectedGlobal ? '✓ PASS' : '✗ FAIL');
  console.log('Expected:', expectedGlobal);
  console.log('Got:', result);

  // Test local path replacement
  result = testContent;
  result = result.replace(/~\/\.claude\//g, './.vibe/');
  result = result.replace(/\.\.\/commands\/gsd\//g, './.vibe/commands/gsd/');
  result = result.replace(/\.\.\/get-shit-done\//g, './.vibe/get-shit-done/');

  console.log('\nLocal path replacement test:');
  console.log(result === expectedLocal ? '✓ PASS' : '✗ FAIL');
  console.log('Expected:', expectedLocal);
  console.log('Got:', result);
}

// Run tests
testPathReplacement();