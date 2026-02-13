#!/usr/bin/env python3
"""
Update Agent Skills for gsd-tools Integration

Removes old workflow references and adds gsd-tools metadata.
"""

import re
from pathlib import Path

def update_skill_for_gsd_tools(skill_path: Path):
    """Update a skill to remove workflow references and add gsd-tools integration."""
    skill_md_path = skill_path / "SKILL.md"
    
    if not skill_md_path.exists():
        print(f"❌ SKILL.md not found: {skill_md_path}")
        return False
    
    try:
        with open(skill_md_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Failed to read {skill_md_path}: {e}")
        return False
    
    # Remove workflow references
    updated_content = content
    
    # Remove @~/.claude/get-shit-done/workflows/ references
    updated_content = re.sub(
        r'@~/.claude/get-shit-done/workflows/[\w-]+\.md',
        '',
        updated_content
    )
    
    # Remove "Follow the workflow" sentences
    updated_content = re.sub(
        r'Follow the (workflow|Workflow) in @~/.claude/get-shit-done/workflows/[\w-]+\.md\.?',
        '',
        updated_content
    )
    
    # Remove "Follow the ... workflow" patterns
    updated_content = re.sub(
        r'\*\*Follow the [\w-]+ workflow\*\* from `@~/.claude/get-shit-done/workflows/[\w-]+\.md`\.',
        '',
        updated_content
    )
    
    # Clean up multiple blank lines
    updated_content = re.sub(r'\n{3,}', '\n\n', updated_content)
    
    # Add gsd-tools metadata if not present
    if 'gsd-tools:' not in updated_content:
        # Find metadata section and add gsd-tools
        metadata_match = re.search(r'(metadata:\s*\n)(  [^:]+: [^\n]+\s*\n)+', updated_content)
        if metadata_match:
            metadata_section = metadata_match.group(0)
            # Add gsd-tools based on skill name
            skill_name = skill_path.name
            tools = get_gsd_tools_for_skill(skill_name)
            if tools:
                updated_metadata = metadata_section.rstrip() + f"\n  gsd-tools: {tools}\n"
                updated_content = updated_content.replace(metadata_section, updated_metadata)
    
    if updated_content != content:
        try:
            with open(skill_md_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"✅ Updated skill: {skill_path.name}")
            return True
        except Exception as e:
            print(f"❌ Failed to write updated skill {skill_path.name}: {e}")
            return False
    else:
        print(f"ℹ️  No changes needed: {skill_path.name}")
        return True


def get_gsd_tools_for_skill(skill_name: str) -> str:
    """Get appropriate gsd-tools for a skill based on its name."""
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
        # Add more mappings as needed
    }
    
    return tools_map.get(skill_name, 'core-operations, state-management')


def update_all_skills_for_gsd_tools(skills_dir: Path) -> None:
    """Update all skills in a directory for gsd-tools integration."""
    if not skills_dir.exists():
        print(f"❌ Skills directory not found: {skills_dir}")
        return
    
    if not skills_dir.is_dir():
        print(f"❌ Skills path is not a directory: {skills_dir}")
        return
    
    # Find all skill directories with SKILL.md files
    skill_dirs = []
    for d in skills_dir.iterdir():
        if d.is_dir():
            skill_md_path = d / "SKILL.md"
            if skill_md_path.exists():
                skill_dirs.append(d)
    
    if not skill_dirs:
        print(f"ℹ️  No skills found in directory: {skills_dir}")
        return
    
    print(f"Updating {len(skill_dirs)} skills for gsd-tools integration...")
    print()
    
    updated_count = 0
    error_count = 0
    
    for skill_dir in skill_dirs:
        if update_skill_for_gsd_tools(skill_dir):
            updated_count += 1
        else:
            error_count += 1
    
    print()
    print(f"📊 Results: {updated_count} skills processed, {error_count} with errors")
    
    if error_count == 0:
        print("🎉 All skills updated for gsd-tools integration!")
    else:
        print(f"⚠️  {error_count} skills still have issues")


if __name__ == "__main__":
    skills_dir = Path("skills/gsd/")
    update_all_skills_for_gsd_tools(skills_dir)