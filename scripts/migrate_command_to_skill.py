#!/usr/bin/env python3
"""
Command to Skill Migration Script for Get Shit Done

Converts command files from commands/gsd/ to skill format in skills/gsd/<command-name>/
"""

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
    sections = {
        'xml_content': xml_content  # Store full XML content for smart extraction
    }
    
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

def extract_smart_content(command_data: Dict) -> Dict:
    """Extract additional content from command files using smart pattern matching."""
    sections = command_data['sections']
    objective = sections.get('objective', '')
    xml_content = sections.get('xml_content', '')
    
    smart_content = {
        'usage_guidelines': [],
        'anti_patterns': [],
        'output_details': [],
        'success_criteria': []
    }
    
    # Extract usage guidelines from objective
    usage_patterns = [
        r'Use this command when:\s*(.*?)(?=\n\n|\n\*\*|\n##|\n<|$)',
        r'Use when\s*(.*?)(?=\n\n|\n\*\*|\n##|\n<|$)',
        r'Purpose:\s*(.*?)(?=\n\n|\n\*\*|\n##|\n<|$)',
        r'When to use:\s*(.*?)(?=\n\n|\n\*\*|\n##|\n<|$)'
    ]
    
    for pattern in usage_patterns:
        matches = re.findall(pattern, objective, re.DOTALL)
        for match in matches:
            # Clean up the extracted text
            cleaned = re.sub(r'\*\*', '', match).strip()
            # Split into bullet points if it contains newlines
            items = [item.strip() for item in cleaned.split('\n') if item.strip() and not item.startswith('- ')]
            # Extract bullet points separately
            bullet_items = re.findall(r'-\s*(.*?)(?=\n|$)', cleaned)
            items.extend(bullet_items)
            smart_content['usage_guidelines'].extend(items)
    
    # Extract anti-patterns from notes and warnings
    anti_patterns = [
        r'\*\*Note:\*\*\s*(.*?)(?=\n\n|\n\*\*|\n##|\n<|$)',
        r'\*\*Warning:\*\*\s*(.*?)(?=\n\n|\n\*\*|\n##|\n<|$)',
        r'\*\*Do NOT\*\*\s*(.*?)(?=\n\n|\n\*\*|\n##|\n<|$)',
        r'\*\*Important:\*\*\s*(.*?)(?=\n\n|\n\*\*|\n##|\n<|$)'
    ]
    
    for pattern in anti_patterns:
        matches = re.findall(pattern, objective, re.DOTALL)
        for match in matches:
            cleaned = re.sub(r'\*\*', '', match).strip()
            if cleaned:
                smart_content['anti_patterns'].append(cleaned)
    
    # Extract output details from output sections and file references
    output_match = re.search(r'<output>(.*?)</output>', xml_content, re.DOTALL)
    if output_match:
        output_content = output_match.group(1).strip()
        # Extract file references
        file_refs = re.findall(r'<files_to_read>(.*?)</files_to_read>', output_content, re.DOTALL)
        for file_ref in file_refs:
            files = [f.strip() for f in file_ref.split('\n') if f.strip() and not f.startswith('<!--')]
            for file in files:
                # Clean up file references
                cleaned = re.sub(r'\*\*|<!--.*?-->', '', file).strip()
                if cleaned:
                    smart_content['output_details'].append(f"Creates/modifies: {cleaned}")
        
        # Extract general output description
        lines = [line.strip() for line in output_content.split('\n') if line.strip()]
        for line in lines:
            if not line.startswith('<') and not line.startswith('<!--') and line:
                smart_content['output_details'].append(line)
    
    # Extract success criteria
    criteria_match = re.search(r'<success_criteria>(.*?)</success_criteria>', xml_content, re.DOTALL)
    if criteria_match:
        criteria_content = criteria_match.group(1).strip()
        # Extract bullet points
        criteria_items = re.findall(r'- \[ \] (.*?)(?=\n|$)', criteria_content)
        smart_content['success_criteria'].extend(criteria_items)
    
    return smart_content

def generate_skill_frontmatter(command_data: Dict) -> str:
    """Generate YAML frontmatter for the skill."""
    frontmatter = command_data['frontmatter']
    command_name = command_data['command_name']
    
    # Process allowed-tools
    allowed_tools = frontmatter.get('allowed-tools', [])
    
    # Define valid tools for Mistral-Vibe
    valid_tools = {'Read', 'Write', 'Bash', 'Glob', 'AskUserQuestion', 'AskUserConfirmation'}
    
    # Define tool mappings for invalid/unsupported tools
    tool_mapping = {
        'Grep': 'Bash',  # Grep can be done with Bash
        'Edit': 'Write',  # Edit is similar to Write
        'Task': 'Bash',   # Task execution via Bash
        'SlashCommand': 'Bash',  # Slash commands via Bash
        'TodoWrite': 'Write',  # TodoWrite is similar to Write
        'WebFetch': 'Bash',  # Web fetching via Bash/curl
        'Read,': 'Read',  # Clean up trailing commas
        'Write,': 'Write',  # Clean up trailing commas
    }
    
    # Handle missing or empty allowed-tools
    if not allowed_tools or (isinstance(allowed_tools, str) and not allowed_tools.strip()):
        # Default tools for skills based on command type
        if 'phase' in command_name.lower():
            allowed_tools_str = 'Read Write Bash'
        elif 'todo' in command_name.lower():
            allowed_tools_str = 'Read Write Bash AskUserQuestion'
        elif 'cleanup' in command_name.lower():
            allowed_tools_str = 'Read Write Bash Glob'
        elif 'health' in command_name.lower():
            allowed_tools_str = 'Read Write Bash AskUserQuestion'
        else:
            allowed_tools_str = 'Read Write Bash'
    elif isinstance(allowed_tools, list):
        # Convert list to space-separated string, mapping invalid tools
        tools_list = []
        for tool in allowed_tools:
            tool_str = str(tool).strip(",'[] ")
            # Map invalid tools to valid ones
            mapped_tool = tool_mapping.get(tool_str, tool_str)
            if mapped_tool in valid_tools:
                tools_list.append(mapped_tool)
        allowed_tools_str = ' '.join(tools_list) if tools_list else 'Read Write Bash'
    elif isinstance(allowed_tools, str):
        # Clean up string format and map invalid tools
        tools_list = []
        for tool in allowed_tools.split():
            tool_clean = tool.strip(",'[]")
            # Map invalid tools to valid ones
            mapped_tool = tool_mapping.get(tool_clean, tool_clean)
            if mapped_tool in valid_tools:
                tools_list.append(mapped_tool)
        allowed_tools_str = ' '.join(tools_list) if tools_list else 'Read Write Bash'
    else:
        # Default tools for skills
        allowed_tools_str = 'Read Write Bash'
    
    # Clean up description for Claude references
    original_description = frontmatter.get('description', f'[TODO: Add description for {command_name}]')
    # Replace Claude references in description
    description = re.sub(r'\bClaude\b', 'Agent', original_description, flags=re.IGNORECASE)
    description = re.sub(r'\bclaude\b', 'agent', description, flags=re.IGNORECASE)
    description = re.sub(r'Claude\'s', 'Agent\'s', description, flags=re.IGNORECASE)
    description = re.sub(r'Claude\\s+assumptions', 'Agent assumptions', description, flags=re.IGNORECASE)
    
    # Create new frontmatter structure
    skill_frontmatter = {
        'name': command_name.replace('gsd:', ''),  # Remove gsd: prefix
        'description': description,
        'license': 'MIT',
        'metadata': {
            'author': 'get-shit-done',
            'version': '1.0',
            'category': 'project-management',
            'gsd-tools': get_gsd_tools_for_command(command_name)
        },
        'allowed-tools': allowed_tools_str
    }
    
    # Format as YAML with proper escaping
    yaml_lines = []
    yaml_lines.append(f"name: {skill_frontmatter['name']}")
    
    # Handle description with special characters
    description = skill_frontmatter['description']
    if ':' in description or description.strip().startswith('-') or description.strip().startswith('['):
        # Quote description if it contains special YAML characters
        yaml_lines.append(f"description: '{description}'")
    else:
        yaml_lines.append(f"description: {description}")
    
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

def generate_skill_content(command_data: Dict, smart_content: Dict = None) -> str:
    """Generate the main content for the skill."""
    sections = command_data['sections']
    command_name = command_data['command_name']
    
    if smart_content is None:
        smart_content = {
            'usage_guidelines': [],
            'anti_patterns': [],
            'output_details': [],
            'success_criteria': []
        }
    
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
        objective = re.sub(r'Claude\'s', 'Agent\'s', objective, flags=re.IGNORECASE)
        objective = re.sub(r'Claude\\s+assumptions', 'Agent assumptions', objective, flags=re.IGNORECASE)
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
                content_parts.append(f"- `~/.vibe/get-shit-done/workflows/{file}` — [TODO: Add description]")
        else:
            content_parts.append("- [TODO: List files modified by this skill]")
        content_parts.append("")
    
    # When to Use section
    content_parts.append("## When to Use")
    content_parts.append("")
    
    # Use smart extracted usage guidelines if available
    if smart_content['usage_guidelines']:
        content_parts.append("📖 **Usage Guidelines**:")
        for guideline in smart_content['usage_guidelines']:
            content_parts.append(f"- {guideline}")
    elif 'execution_context' in sections:
        workflow_file = sections['execution_context']
        workflow_match = re.search(r'@~/.claude/get-shit-done/workflows/([\w-]+\.md)', workflow_file)
        if workflow_match:
            workflow_name = workflow_match.group(1)
            # Always use Mistral-Vibe path structure
            content_parts.append(f"📖 **Usage Guidelines**: See `~/.vibe/get-shit-done/workflows/{workflow_name}` for detailed usage scenarios and best practices.")
        else:
            content_parts.append("- [TODO: Add when to use this skill]")
    else:
        content_parts.append("- [TODO: Add when to use this skill]")
    
    content_parts.append("")
    content_parts.append("**Do NOT use when:**")
    
    # Use smart extracted anti-patterns if available
    if smart_content['anti_patterns']:
        for anti_pattern in smart_content['anti_patterns']:
            content_parts.append(f"- {anti_pattern}")
    elif 'execution_context' in sections:
        workflow_file = sections['execution_context']
        workflow_match = re.search(r'@~/.claude/get-shit-done/workflows/([\w-]+\.md)', workflow_file)
        if workflow_match:
            workflow_name = workflow_match.group(1)
            # Always use Mistral-Vibe path structure
            content_parts.append(f"📖 **Anti-Patterns**: See `~/.vibe/get-shit-done/workflows/{workflow_name}` for common mistakes and recommended alternatives.")
        else:
            content_parts.append("- [TODO: Add anti-patterns]")
    else:
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
        process = re.sub(r'Claude\'s', 'Agent\'s', process, flags=re.IGNORECASE)
        process = re.sub(r'Claude\\s+assumptions', 'Agent assumptions', process, flags=re.IGNORECASE)
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
    
    # Use smart extracted output details if available
    if smart_content['output_details']:
        for output_detail in smart_content['output_details']:
            content_parts.append(f"- {output_detail}")
    elif 'execution_context' in sections:
        workflow_file = sections['execution_context']
        workflow_match = re.search(r'@~/.claude/get-shit-done/workflows/([\w-]+\.md)', workflow_file)
        if workflow_match:
            workflow_name = workflow_match.group(1)
            # Always use Mistral-Vibe path structure
            content_parts.append(f"📖 **Output Details**: See `~/.vibe/get-shit-done/workflows/{workflow_name}` for expected outputs and results.")
        else:
            content_parts.append("- [TODO: Describe outputs of this skill]")
    else:
        content_parts.append("- [TODO: Describe outputs of this skill]")
    
    content_parts.append("")
    
    # Success Criteria section
    content_parts.append("## Success Criteria")
    content_parts.append("")
    
    # Use smart extracted success criteria if available
    if smart_content['success_criteria']:
        for criterion in smart_content['success_criteria']:
            content_parts.append(f"- [ ] {criterion}")
    elif 'execution_context' in sections:
        workflow_file = sections['execution_context']
        workflow_match = re.search(r'@~/.claude/get-shit-done/workflows/([\w-]+\.md)', workflow_file)
        if workflow_match:
            workflow_name = workflow_match.group(1)
            # Always use Mistral-Vibe path structure for skills
            content_parts.append(f"📖 **Success Criteria**: See `~/.vibe/get-shit-done/workflows/{workflow_name}` for completion checklist and validation requirements.")
        else:
            content_parts.append("- [ ] [TODO: Add success criteria]")
    else:
        content_parts.append("- [ ] [TODO: Add success criteria]")
    
    content_parts.append("")
    
    # Examples section
    content_parts.append("## Examples")
    content_parts.append("")
    
    # Check if we have workflow reference for examples
    if 'execution_context' in sections:
        workflow_file = sections['execution_context']
        workflow_match = re.search(r'@~/.claude/get-shit-done/workflows/([\w-]+\.md)', workflow_file)
        if workflow_match:
            workflow_name = workflow_match.group(1)
            # Always use Mistral-Vibe path structure for skills
            content_parts.append(f"📖 **Usage Examples**: See `~/.vibe/get-shit-done/workflows/{workflow_name}` for practical examples and use cases.")
        else:
            content_parts.append("### Example 1: [TODO: Add example title]")
            content_parts.append("```")
            content_parts.append("Input: [TODO: Add example input]")
            content_parts.append("Output: [TODO: Add example output]")
            content_parts.append("```")
    else:
        content_parts.append("### Example 1: [TODO: Add example title]")
        content_parts.append("```")
        content_parts.append("Input: [TODO: Add example input]")
        content_parts.append("Output: [TODO: Add example output]")
        content_parts.append("```")
    
    content_parts.append("")
    
    # Error Handling section (omit entirely as it requires real-world experience)
    # Error handling is best documented after actual usage and testing
    
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
    
    # Extract smart content for enhanced skill generation
    smart_content = extract_smart_content(command_data)
    
    # Generate skill content
    frontmatter = generate_skill_frontmatter(command_data)
    content = generate_skill_content(command_data, smart_content)
    
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