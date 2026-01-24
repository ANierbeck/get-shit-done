# Creating Custom Cline Skills from Get Shit Done

This guide explains how to create custom Cline skills based on the Get Shit Done (GSD) project structure.

## Project Structure Overview

The GSD project follows a modular architecture with three main components:

### 1. Command Layer
- **Claude Code**: `commands/gsd/*.md` files
- **Mistral Vibe**: `vibe-commands/gsd/*.toml` files
- **Purpose**: User-facing commands that trigger workflows

### 2. Workflow Layer
- **Location**: `get-shit-done/workflows/*.md`
- **Purpose**: Implementation logic and step-by-step processes

### 3. Support Layer
- **Templates**: `get-shit-done/templates/*.md`
- **References**: `get-shit-done/references/*.md`
- **Purpose**: Standardized formats and best practices

## Creating a New Skill

### Step 1: Define the Skill Command

#### For Claude Code (Markdown Format)
```markdown
---
name: custom:skill-name
description: Description of what this skill does
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
---

<objective>
Clear statement of what this skill accomplishes.
</objective>

<execution_context>
@~/.claude/get-shit-done/references/principles.md
@~/.claude/get-shit-done/templates/appropriate-template.md
</execution_context>

<process>
<step name="step_name">
Detailed instructions for this step
</step>

<step name="another_step">
More instructions with conditional logic if needed
</step>
</process>

<output>
- List of files created
- Any artifacts produced
</output>

<success_criteria>
- [ ] Completion checklist
- [ ] Verification criteria
</success_criteria>
```

#### For Mistral Vibe (TOML Format)
```toml
[command]
name = "custom:skill-name"
aliases = ["/custom:skill-name", "/custom:sn"]
description = "Description of what this skill does"
type = "prompt"
template = '''
You are [Skill Name] operating within Mistral Vibe.

## Skill Purpose

### Instructions:
1. **Follow Workflow**: Use the workflow from get-shit-done/workflows/skill-workflow.md
2. **Apply Template**: Utilize the template from get-shit-done/templates/skill-template.md
3. **Execute Steps**: Follow the step-by-step process

### Context:
- Describe the context and purpose
- Explain when to use this skill

### Output Format:
Describe expected output format
'''
```

### Step 2: Create the Workflow

Create a workflow file in `get-shit-done/workflows/skill-workflow.md`:

```markdown
<purpose>
Clear statement of what this workflow accomplishes.
</purpose>

<required_reading>
**Read these files NOW:**
1. ~/.claude/get-shit-done/templates/skill-template.md
2. ~/.claude/get-shit-done/references/relevant-reference.md
</required_reading>

<process>
<step name="setup">
```bash
# Any required setup commands
```

**Conditional logic if needed:**
- Check for prerequisites
- Handle different scenarios
</step>

<step name="main_execution">
Detailed execution steps:
1. First action
2. Second action
3. Error handling
</step>

<step name="verification">
```bash
# Verification commands
```

**Success criteria:**
- What constitutes successful completion
- How to validate results
</step>
</process>

<success_criteria>
- [ ] Workflow completion checklist
- [ ] Quality assurance criteria
</success_criteria>
```

### Step 3: Create Supporting Files

#### Templates
Create standardized templates in `get-shit-done/templates/skill-template.md`:

```markdown
# [Skill Name] Template

## Section 1
- Standardized format
- Placeholders for dynamic content

## Section 2
- Consistent structure
- Best practices embedded
```

#### References
Create reference documentation in `get-shit-done/references/skill-reference.md`:

```markdown
# [Skill Name] Reference

## Best Practices
- Key principles
- Common patterns

## Anti-Patterns
- What to avoid
- Common mistakes

## Examples
- Working examples
- Code snippets
```

## Integration Patterns

### Conditional Execution
```markdown
<if mode="yolo">
Auto-approve and proceed
</if>

<if mode="interactive">
Ask for confirmation before proceeding
</if>
```

### Tool Integration
```markdown
<step name="bash_execution">
```bash
# Shell commands
mkdir -p .planning/skill-specific
```

Use Bash tool to execute:
- File operations
- System commands
- Environment setup
</step>
```

### State Management
```markdown
<step name="state_update">
Update `.planning/STATE.md` with:
- Current position
- Progress tracking
- Accumulated context
</step>
```

## Best Practices

1. **Modular Design**: Keep skills focused on single responsibilities
2. **Clear Documentation**: Document purpose, inputs, outputs, and success criteria
3. **Error Handling**: Include verification steps and error recovery
4. **State Preservation**: Update project state consistently
5. **Git Integration**: Commit changes at logical milestones
6. **User Feedback**: Include appropriate user interaction points

## Example Skill: Custom Data Analysis

### Command File (`commands/gsd/custom-data-analysis.md`)
```markdown
---
name: custom:data-analysis
description: Perform custom data analysis on project datasets
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
---

<objective>
Analyze project data and generate insights report.
</objective>

<execution_context>
@~/.claude/get-shit-done/references/data-analysis.md
@~/.claude/get-shit-done/templates/analysis-report.md
</execution_context>

<process>
<step name="data_collection">
Gather data from specified sources
</step>

<step name="analysis">
Apply analysis algorithms
</step>

<step name="reporting">
Generate insights report
</step>
</process>

<output>
- `.planning/analysis/insights-report.md`
- Updated project state
</output>
```

### Workflow File (`get-shit-done/workflows/data-analysis.md`)
```markdown
<purpose>
Perform comprehensive data analysis and generate actionable insights.
</purpose>

<process>
<step name="setup">
```bash
mkdir -p .planning/analysis
```

Check for existing data sources
</step>

<step name="analysis">
Apply statistical analysis
Generate visualizations
Identify patterns
</step>

<step name="report">
Create structured report with findings
</step>
</process>
```

## Implementation Checklist

- [ ] Define skill command (Claude Code and/or Mistral Vibe)
- [ ] Create workflow with step-by-step process
- [ ] Develop supporting templates
- [ ] Document references and best practices
- [ ] Implement verification and success criteria
- [ ] Test with different execution modes
- [ ] Document user-facing instructions
- [ ] Add to command reference

## Testing and Validation

1. **Unit Testing**: Test individual steps in isolation
2. **Integration Testing**: Test complete workflow execution
3. **User Testing**: Validate with real-world scenarios
4. **Error Testing**: Test failure modes and recovery

## Deployment

1. Add command files to appropriate directories
2. Update command reference documentation
3. Test installation and execution
4. Document usage examples
5. Release as part of GSD updates

This modular approach allows for creating custom skills that integrate seamlessly with the existing GSD ecosystem while maintaining consistency and reliability.