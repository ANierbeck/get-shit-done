---
name: gsd-progress
description: Checks and reports the current project status, progress, and next steps. Use when the user asks for status updates, progress reports, or wants to know what's been accomplished.
license: MIT
compatibility: Designed for Mistral Vibe and Get Shit Done system
metadata:
  author: Get Shit Done
  version: "1.0"
  command_type: workflow
  gsd-tools: core-operations, state-management
---

# GSD Progress Skill

## Purpose
This skill provides users with current project status, progress updates, and information about what has been accomplished and what comes next.

## When to Use
- User asks for project status
- User requests progress update
- User wants to know what's been done
- User asks "what's next?"
- User wants a summary of accomplishments

## How to Use

### Step 1: Read Project State
Read the current project state from:
- Location: `.planning/STATE.md`

### Step 2: Read Roadmap
Read the project roadmap from:
- Location: `.planning/ROADMAP.md`

### Step 3: Read Project Information
Read the project information from:
- Location: `.planning/PROJECT.md`

### Step 4: Generate Progress Report
Generate a comprehensive progress report including:
- Current milestone status
- Completed tasks and accomplishments
- Current work in progress
- Upcoming tasks and next steps
- Any blockers or issues

### Step 5: Present Report
Present the progress report in a clear, organized format.

## Examples

### Example 1: Basic Progress Request
**User Input:** "/gsd:progress"
**Expected Output:** Display current project status and progress

### Example 2: Status Update
**User Input:** "What's the current status of the project?"
**Expected Output:** Display progress report with accomplishments and next steps

## Error Handling
- If state file cannot be read, inform user and suggest checking installation
- If roadmap file cannot be read, continue with available information
- If project file cannot be read, continue with available information

## Tools Required
- `read_file` - To read project state, roadmap, and project files

## Context Files
- `.planning/STATE.md` - Current project state
- `.planning/ROADMAP.md` - Project roadmap
- `.planning/PROJECT.md` - Project information