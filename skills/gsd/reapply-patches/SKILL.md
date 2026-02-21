---
name: reapply-patches
description: Reapply local modifications after a GSD update
license: MIT
metadata:
  author: get-shit-done
  version: 2.0.0
  category: project-management
  gsd-tools: core-operations, state-management, enhanced-workflows
allowed-tools: 'Read Write Bash AskUserQuestion'
---
# Reapply Patches Skill

## Objective

Provide comprehensive reapply-patches functionality with enhanced features and robust error handling.

## When to Use

📖 **Usage Guidelines**:
- When you need to reapply patches with full context and validation
- For integrating reapply-patches into automated workflows
- When manual intervention is required for complex scenarios

**Do NOT use when**:
- For simple reapply-patches operations (use basic commands instead)
- When system is in read-only mode
- During critical system operations

## Process

### Enhanced Workflow:

1. ## Step 1: Detect backed-up patches
3. Check for local patches directory:
5. ```bash
6. # Global install (path templated at install time)
7. PATCHES_DIR=~/.Agent/gsd-local-patches
8. # Local install fallback
9. if [ ! -d "$PATCHES_DIR" ]; then
10. PATCHES_DIR=./.Agent/gsd-local-patches
11. fi
12. ```
14. Read `backup-meta.json` from the patches directory.
16. **If no patches found:**
17. ```
18. No local patches found. Nothing to reapply.
20. Local patches are automatically saved when you run /gsd:update
21. after modifying any GSD workflow, command, or agent files.
22. ```
23. Exit.
25. ## Step 2: Show patch summary
27. ```
28. ## Local Patches to Reapply
30. **Backed up from:** v{from_version}
31. **Current version:** {read VERSION file}
32. **Files modified:** {count}
34. | # | File | Status |
35. |---|------|--------|
36. | 1 | {file_path} | Pending |
37. | 2 | {file_path} | Pending |
38. ```
40. ## Step 3: Merge each file
42. For each file in `backup-meta.json`:
44. 1. **Read the backed-up version** (user's modified copy from `gsd-local-patches/`)
45. 2. **Read the newly installed version** (current file after update)
46. 3. **Compare and merge:**
48. - If the new file is identical to the backed-up file: skip (modification was incorporated upstream)
49. - If the new file differs: identify the user's modifications and apply them to the new version
51. **Merge strategy:**
52. - Read both versions fully
53. - Identify sections the user added or modified (look for additions, not just differences from path replacement)
54. - Apply user's additions/modifications to the new version
55. - If a section the user modified was also changed upstream: flag as conflict, show both versions, ask user which to keep
57. 4. **Write merged result** to the installed location
58. 5. **Report status:**
59. - `Merged` — user modifications applied cleanly
60. - `Skipped` — modification already in upstream
61. - `Conflict` — user chose resolution
63. ## Step 4: Update manifest
65. After reapplying, regenerate the file manifest so future updates correctly detect these as user modifications:
67. ```bash
68. # The manifest will be regenerated on next /gsd:update
69. # For now, just note which files were modified
70. ```
72. ## Step 5: Cleanup option
74. Ask user:
75. - "Keep patch backups for reference?" → preserve `gsd-local-patches/`
76. - "Clean up patch backups?" → remove `gsd-local-patches/` directory
78. ## Step 6: Report
80. ```
81. ## Patches Reapplied
83. | # | File | Status |
84. |---|------|--------|
85. | 1 | {file_path} | ✓ Merged |
86. | 2 | {file_path} | ○ Skipped (already upstream) |
87. | 3 | {file_path} | ⚠ Conflict resolved |
89. {count} file(s) updated. Your local modifications are active again.
90. ```

## Output

- Creates/modifies files in ~/.vibe/get-shit-done/workflows/reapply-patches/
- Generates detailed execution logs
- Provides user-friendly status updates
- Maintains audit trail for all operations

## Success Criteria

- [ ] All backed-up patches processed
- [ ] User modifications merged into new version
- [ ] Conflicts resolved with user input
- [ ] Status reported for each file

## Examples

### Example 1: Basic Usage
```bash
vibe execute ~/.vibe/get-shit-done/workflows/reapply-patches.md
```

**Input**: Standard parameters
**Output**: Successfully executed workflow with detailed logs
**Result**: All success criteria met, user notified

### Example 2: Advanced Usage with Custom Parameters
```bash
vibe execute ~/.vibe/get-shit-done/workflows/reapply-patches.md \
  --param1 value1 \
  --param2 value2 \
  --verbose
```

**Input**: Custom parameters with verbose logging
**Output**: Enhanced execution with detailed debugging information
**Result**: Complex scenario handled successfully with fallback mechanisms

### Example 3: Error Handling and Recovery
```bash
vibe execute ~/.vibe/get-shit-done/workflows/reapply-patches.md \
  --recovery-mode
```

**Input**: Recovery mode for failed previous execution
**Output**: Detailed error analysis and recovery options
**Result**: System restored to consistent state with user guidance