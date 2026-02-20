#!/usr/bin/env python3
"""
Command to Skill Migration Script for Get Shit Done

Converts command files from commands/gsd/ to skill format in skills/gsd/<command-name>/
"""

import os
import re
import sys
import yaml
from pathlib import Path
from typing import Dict, List, Optional

def parse_command_file(command_path: Path) -> Optional[Dict]:
    """Parse a command file and extract structured information."""
    try:
        with open(command_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Failed to read command file {command_path}: {e}")
        return None
    
    # Split YAML frontmatter from XML content
    frontmatter_match = re.match(r'^---\s*$(.*?)\s*^---\s*$', content, re.MULTILINE | re.DOTALL)
    if not frontmatter_match:
        print(f"❌ Invalid frontmatter format in {command_path}")
        return None
    
    try:
        frontmatter = yaml.safe_load(frontmatter_match.group(1))
        if frontmatter is None:
            frontmatter = {}
    except yaml.YAMLError as e:
        print(f"❌ YAML parsing error in {command_path}: {e}")
        return None
    
    # Extract XML content
    xml_content = content[frontmatter_match.end():].strip()
    
    # Parse XML sections
    sections = {}
    
    # Extract objective
    objective_match = re.search(r'<objective>(.*?)</objective>', xml_content, re.DOTALL)
    if objective_match:
        sections['objective'] = objective_match.group(1).strip()
    
    # Extract execution context
    context_match = re.search(r'<execution_context>(.*?)</execution_context>', xml_content, re.DOTALL)
    if context_match:
        sections['execution_context'] = context_match.group(1).strip()
    
    # Extract context
    context_match = re.search(r'<context>(.*?)</context>', xml_content, re.DOTALL)
    if context_match:
        sections['context'] = context_match.group(1).strip()
    
    # Extract process
    process_match = re.search(r'<process>(.*?)</process>', xml_content, re.DOTALL)
    if process_match:
        sections['process'] = process_match.group(1).strip()
    
    return {
        'frontmatter': frontmatter,
        'sections': sections,
        'command_name': command_path.stem
    }

def generate_skill_frontmatter(command_data: Dict) -> str:
    """Generate YAML frontmatter for the skill."""
    frontmatter = command_data['frontmatter']
    command_name = command_data['command_name']
    
    # Process allowed-tools
    allowed_tools = frontmatter.get('allowed-tools', [])
    if isinstance(allowed_tools, list):
        # Convert list to space-separated string
        allowed_tools_str = ' '.join(str(tool).strip(",'[]") for tool in allowed_tools)
    elif isinstance(allowed_tools, str):
        # Clean up string format
        allowed_tools_str = allowed_tools.strip(",'[]")
    else:
        # Default tools for skills
        allowed_tools_str = 'Read Write Bash'
    
    # Create new frontmatter structure
    skill_frontmatter = {
        'name': command_name.replace('gsd:', ''),  # Remove gsd: prefix
        'description': frontmatter.get('description', f'[TODO: Add description for {command_name}]'),
        'license': 'MIT',
        'metadata': {
            'author': 'get-shit-done',
            'version': '1.0',
            'category': 'project-management',
            'gsd-tools': get_gsd_tools_for_command(command_name)
        },
        'allowed-tools': allowed_tools_str
    }
    
    # Format as YAML
    yaml_lines = []
    yaml_lines.append(f"name: {skill_frontmatter['name']}")
    yaml_lines.append(f"description: '{skill_frontmatter['description']}'")
    yaml_lines.append(f"license: {skill_frontmatter['license']}")
    yaml_lines.append("metadata:")
    for key, value in skill_frontmatter['metadata'].items():
        yaml_lines.append(f"  {key}: {value}")
    yaml_lines.append(f"allowed-tools: '{skill_frontmatter['allowed-tools']}'")
    
    return '\n'.join(yaml_lines)

def get_gsd_tools_for_command(command_name: str) -> str:
    """Get appropriate gsd-tools for a command based on its name."""
    tools_map = {
        'execute-phase': 'plan-discovery, dependency-analysis, wave-grouping',
        'plan-phase': 'plan-generation, dependency-mapping, resource-allocation',
        'new-milestone': 'milestone-creation, phase-generation, roadmap-updates',
        'map-codebase': 'codebase-analysis, structure-mapping, documentation-generation',
        'debug': 'error-analysis, logging-inspection, state-diagnosis',
        'discuss-phase': 'context-gathering, question-formulation, conversation-analysis',
        'verify-work': 'uat-testing, validation-checks, quality-assurance',
        'resume-work': 'state-restoration, context-reconstruction, session-continuation',
        'list-phase-assumptions': 'assumption-extraction, documentation-generation, analysis-frameworks',
        'check-todos': 'core-operations, state-management',
        'add-phase': 'core-operations, state-management',
        'complete-milestone': 'milestone-completion, validation-checks, state-updates',
        'add-todo': 'todo-management, state-tracking, context-capture',
        'audit-milestone': 'quality-assurance, validation-checks, milestone-review',
        'cleanup': 'file-management, cleanup-operations, state-maintenance',
        'discuss-phase': 'context-gathering, question-formulation, conversation-analysis',
        'execute-phase': 'plan-execution, task-management, progress-tracking',
        'help': 'documentation, user-assistance, command-reference',
        'insert-phase': 'phase-management, roadmap-updates, milestone-planning',
        'join-discord': 'community-integration, support-access, collaboration',
        'new-project': 'project-initialization, setup-automation, configuration',
        'pause-work': 'state-preservation, session-management, context-saving',
        'plan-milestone-gaps': 'gap-analysis, planning-assistance, milestone-optimization',
        'progress': 'progress-tracking, state-updates, work-continuation',
        'settings': 'configuration-management, settings-updates, preference-management',
        'update': 'system-updates, version-management, maintenance'
    }
    
    # Extract base command name (remove gsd: prefix if present)
    base_name = command_name.replace('gsd:', '').replace('gsd-', '')
    
    return tools_map.get(base_name, 'core-operations, state-management')

def generate_skill_content(command_data: Dict) -> str:
    """Generate the main content for the skill."""
    sections = command_data['sections']
    command_name = command_data['command_name']
    
    content_parts = []
    
    # Title
    skill_name = command_name.replace('gsd:', '')
    content_parts.append(f"# {skill_name.replace('-', ' ').title()} Skill")
    content_parts.append("")
    
    # Objective section
    content_parts.append("## Objective")
    content_parts.append("")
    if 'objective' in sections:
        objective = sections['objective']
        # Clean up workflow references and Claude-specific content
        objective = re.sub(r'@~/.claude/get-shit-done/workflows/[\w-]+\.md', '', objective)
        objective = re.sub(r'Follow the [\w-]+ workflow.*?\.', '', objective)
        objective = re.sub(r'\*\*Follow the [\w-]+ workflow\*\*.*?\.', '', objective)
        objective = re.sub(r'\bClaude\b', 'Agent', objective, flags=re.IGNORECASE)
        objective = re.sub(r'\bclaude\b', 'agent', objective, flags=re.IGNORECASE)
        objective = re.sub(r'\n{2,}', '\n\n', objective)
        objective = objective.strip()
        content_parts.append(objective)
    else:
        content_parts.append("[TODO: Add objective for this skill]")
    content_parts.append("")
    
    # Files Modified section (if execution context exists)
    if 'execution_context' in sections:
        content_parts.append("## Files Modified")
        content_parts.append("")
        execution_context = sections['execution_context']
        # Extract file references
        files = re.findall(r'@~/.claude/get-shit-done/workflows/([\w-]+\.md)', execution_context)
        if files:
            for file in files:
                content_parts.append(f"- `.planning/workflows/{file}` — [TODO: Add description]")
        else:
            content_parts.append("- [TODO: List files modified by this skill]")
        content_parts.append("")
    
    # When to Use section
    content_parts.append("## When to Use")
    content_parts.append("")
    content_parts.append("- [TODO: Add when to use this skill]")
    content_parts.append("")
    content_parts.append("**Do NOT use when:**")
    content_parts.append("- [TODO: Add anti-patterns]")
    content_parts.append("")
    
    # Process section
    content_parts.append("## Process")
    content_parts.append("")
    if 'process' in sections:
        process = sections['process']
        # Clean up workflow references and Claude-specific content
        process = re.sub(r'@~/.claude/get-shit-done/workflows/[\w-]+\.md', '', process)
        process = re.sub(r'Follow the [\w-]+ workflow.*?\.', '', process)
        process = re.sub(r'\*\*Follow the [\w-]+ workflow\*\*.*?\.', '', process)
        process = re.sub(r'\bClaude\b', 'Agent', process, flags=re.IGNORECASE)
        process = re.sub(r'\bclaude\b', 'agent', process, flags=re.IGNORECASE)
        process = re.sub(r'\n{2,}', '\n\n', process)
        process = process.strip()
        
        # Convert process steps to numbered list
        steps = re.split(r'\n\d+\\.\s+', process)
        if len(steps) > 1:
            content_parts.append("### Steps:")
            content_parts.append("")
            for i, step in enumerate(steps[1:], 1):  # Skip first empty element
                if step.strip():
                    content_parts.append(f"{i}. {step.strip()}")
        else:
            content_parts.append(process)
    else:
        content_parts.append("[TODO: Add process steps]")
    content_parts.append("")
    
    # Output section
    content_parts.append("## Output")
    content_parts.append("")
    content_parts.append("- [TODO: Describe outputs of this skill]")
    content_parts.append("")
    
    # Success Criteria section
    content_parts.append("## Success Criteria")
    content_parts.append("")
    content_parts.append("- [ ] [TODO: Add success criteria]")
    content_parts.append("")
    
    # Anti-Patterns section
    content_parts.append("## Anti-Patterns")
    content_parts.append("")
    content_parts.append("- **Don't** [TODO: Add anti-pattern 1]")
    content_parts.append("- **Don't** [TODO: Add anti-pattern 2]")
    content_parts.append("")
    
    # Examples section
    content_parts.append("## Examples")
    content_parts.append("")
    content_parts.append("### Example 1: [TODO: Add example title]")
    content_parts.append("```")
    content_parts.append("Input: [TODO: Add example input]")
    content_parts.append("Output: [TODO: Add example output]")
    content_parts.append("```")
    content_parts.append("")
    
    # Error Handling section
    content_parts.append("## Error Handling")
    content_parts.append("")
    content_parts.append("- **Error condition 1:** [TODO: Add error description]")
    content_parts.append("- **Error condition 2:** [TODO: Add error description]")
    content_parts.append("")
    
    return '\n'.join(content_parts)

def migrate_command_to_skill(command_path: Path, skills_dir: Path) -> bool:
    """Migrate a single command to skill format."""
    # Parse the command
    command_data = parse_command_file(command_path)
    if not command_data:
        return False
    
    # Create skill directory
    skill_name = command_data['command_name'].replace('gsd:', '')
    skill_dir = skills_dir / skill_name
    
    if skill_dir.exists():
        print(f"⚠️  Skill already exists: {skill_name}")
        return False
    
    try:
        skill_dir.mkdir(parents=True, exist_ok=True)
    except Exception as e:
        print(f"❌ Failed to create skill directory {skill_dir}: {e}")
        return False
    
    # Generate skill content
    frontmatter = generate_skill_frontmatter(command_data)
    content = generate_skill_content(command_data)
    
    # Write SKILL.md file
    skill_md_path = skill_dir / "SKILL.md"
    try:
        with open(skill_md_path, 'w', encoding='utf-8') as f:
            f.write(f"---\n{frontmatter}\n---\n\n{content}")
        print(f"✅ Created skill: {skill_name}")
        return True
    except Exception as e:
        print(f"❌ Failed to write skill file {skill_md_path}: {e}")
        return False

def migrate_all_commands(commands_dir: Path, skills_dir: Path) -> None:
    """Migrate all commands to skills."""
    if not commands_dir.exists():
        print(f"❌ Commands directory not found: {commands_dir}")
        return
    
    if not skills_dir.exists():
        try:
            skills_dir.mkdir(parents=True, exist_ok=True)
        except Exception as e:
            print(f"❌ Failed to create skills directory {skills_dir}: {e}")
            return
    
    # Find all command files
    command_files = list(commands_dir.glob("*.md"))
    if not command_files:
        print(f"ℹ️  No command files found in {commands_dir}")
        return
    
    print(f"Found {len(command_files)} commands to migrate...")
    print()
    
    migrated_count = 0
    error_count = 0
    skipped_count = 0
    
    for command_file in command_files:
        if migrate_command_to_skill(command_file, skills_dir):
            migrated_count += 1
        else:
            error_count += 1
    
    print()
    print(f"📊 Migration Results:")
    print(f"   ✅ Successfully migrated: {migrated_count}")
    print(f"   ❌ Errors: {error_count}")
    print(f"   ⚠️  Already existed: {skipped_count}")
    print()
    
    if error_count == 0 and migrated_count > 0:
        print("🎉 Migration completed successfully!")
    elif error_count > 0:
        print("⚠️  Some commands failed to migrate.")
    else:
        print("ℹ️  No new skills were created.")

def main():
    """Main entry point."""
    # Default paths
    commands_dir = Path("commands/gsd/")
    skills_dir = Path("skills/gsd/")
    
    if len(sys.argv) == 3:
        commands_dir = Path(sys.argv[1])
        skills_dir = Path(sys.argv[2])
    elif len(sys.argv) == 2:
        # Single argument could be command file or directory
        arg_path = Path(sys.argv[1])
        if arg_path.is_file() and arg_path.suffix == ".md":
            # Migrate single command
            if not skills_dir.exists():
                skills_dir.mkdir(parents=True, exist_ok=True)
            migrate_command_to_skill(arg_path, skills_dir)
            return
        elif arg_path.is_dir():
            commands_dir = arg_path
    
    # Migrate all commands
    migrate_all_commands(commands_dir, skills_dir)

if __name__ == "__main__":
    main()