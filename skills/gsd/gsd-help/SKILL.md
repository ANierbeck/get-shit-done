---
name: gsd-help
description: Displays available GSD commands and usage guide. Use when the user requests help, command reference, or doesn't know what commands are available.
license: MIT
compatibility: Designed for Mistral Vibe and Get Shit Done system
metadata:
  author: Get Shit Done
  version: "1.0"
  command_type: reference
  gsd-tools: core-operations, state-management
---

# GSD Help Skill

## Purpose
This skill provides users with information about available Get Shit Done commands and their usage.

## When to Use
- User requests help
- User asks for command reference
- User seems unsure about available commands
- User asks "what can you do?"
- User asks for usage examples

## How to Use

### Step 1: Read the Help Documentation
Read the help documentation from the source file:
- Location: `../commands/gsd/help.md`

### Step 2: Extract Reference Content
Extract the reference section from the help documentation.

### Step 3: Present Information
Present the reference content exactly as written without adding commentary or additional information.

## Examples

### Example 1: Basic Help Request
**User Input:** "/gsd:help"
**Expected Output:** Display the complete command reference

### Example 2: What Can You Do?
**User Input:** "What commands are available?"
**Expected Output:** Display the command reference

## Error Handling
- If the help file cannot be read, inform the user and suggest checking the installation
- If the reference section cannot be found, display the entire help file content

## Tools Required
- `read_file` - To read the help documentation

## Context Files
- `../commands/gsd/help.md` - Source help documentation