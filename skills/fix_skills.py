#!/usr/bin/env python3
"""
Skill Fix Script for Get Shit Done

Automatically fixes common validation issues in Agent Skills.
"""

import os
import re
import sys
import yaml
from pathlib import Path
from typing import List, Dict, Optional, Tuple


def fix_skill(skill_path: Path) -> bool:
    """Fix common issues in a skill and return True if fixed, False if errors remain."""
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
    
    # Split frontmatter from content
    frontmatter_match = re.match(r'^---\s*$(.*?)\s*^---\s*$', content, re.MULTILINE | re.DOTALL)
    if not frontmatter_match:
        print(f"❌ Invalid frontmatter format: {skill_md_path}")
        return False
    
    frontmatter_yaml = frontmatter_match.group(1)
    body_content = content[frontmatter_match.end():].strip()
    
    try:
        frontmatter = yaml.safe_load(frontmatter_yaml)
        if frontmatter is None:
            frontmatter = {}
    except yaml.YAMLError as e:
        print(f"❌ YAML parsing error in {skill_md_path}: {e}")
        # Try to fix YAML issues
        fixed_yaml = fix_yaml_issues(frontmatter_yaml)
        if fixed_yaml:
            try:
                frontmatter = yaml.safe_load(fixed_yaml)
                if frontmatter is None:
                    frontmatter = {}
                frontmatter_yaml = fixed_yaml
            except yaml.YAMLError as e2:
                print(f"❌ Could not fix YAML: {e2}")
                return False
        else:
            return False
    
    # Apply fixes
    fixed = False
    
    # Fix 1: Empty or non-string allowed-tools
    if 'allowed-tools' in frontmatter:
        if not isinstance(frontmatter['allowed-tools'], str) or not frontmatter['allowed-tools'].strip():
            frontmatter['allowed-tools'] = ""
            fixed = True
    
    # Fix 2: Empty or missing description
    if 'description' not in frontmatter or (frontmatter['description'] is not None and not frontmatter['description'].strip()):
        # Try to extract description from body
        extracted_desc = extract_description_from_body(body_content)
        if extracted_desc:
            frontmatter['description'] = extracted_desc
            fixed = True
        else:
            skill_name = frontmatter.get('name', skill_path.name)
            frontmatter['description'] = f"[TODO: Add description for {skill_name}]"
            fixed = True
    
    # Fix 3: Missing required fields
    if 'name' not in frontmatter:
        frontmatter['name'] = skill_path.name
        fixed = True
    
    if 'description' not in frontmatter:
        frontmatter['description'] = f"[TODO: Add description for {frontmatter['name']}]"
        fixed = True
    
    # Fix 4: Ensure proper YAML formatting
    frontmatter_yaml = dump_frontmatter(frontmatter)
    
    if fixed:
        # Reconstruct the file
        new_content = f"---\n{frontmatter_yaml}\n---\n\n{body_content}"
        
        try:
            with open(skill_md_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Fixed skill: {skill_path.name}")
            return True
        except Exception as e:
            print(f"❌ Failed to write fixed skill {skill_path.name}: {e}")
            return False
    else:
        print(f"ℹ️  No fixes needed: {skill_path.name}")
        return True


def fix_yaml_issues(yaml_content: str) -> Optional[str]:
    """Attempt to fix common YAML issues."""
    # Fix issue with colons in descriptions by quoting them
    lines = yaml_content.strip().split('\n')
    fixed_lines = []
    
    for line in lines:
        # If line contains description with colon, quote it
        if line.strip().startswith('description:') and ':' in line[13:]:  # 13 = len("description: ")
            # Find the first colon after "description:"
            first_colon = line.find(':')
            if first_colon > 0:
                # Quote the description value
                value = line[first_colon+1:].strip()
                if value:
                    fixed_line = f"description: '{value}'"
                    fixed_lines.append(fixed_line)
                    continue
        
        fixed_lines.append(line)
    
    return '\n'.join(fixed_lines)


def extract_description_from_body(body_content: str) -> Optional[str]:
    """Try to extract a description from the skill body."""
    # Look for Objective section
    objective_match = re.search(r'##\s*Objective\s*\n\n([^#]+)', body_content, re.IGNORECASE)
    if objective_match:
        objective = objective_match.group(1).strip()
        if objective:
            # Clean up the objective for use as description
            clean_desc = re.sub(r'\s+', ' ', objective)
            return clean_desc[:500] + "..." if len(clean_desc) > 500 else clean_desc
    
    # Look for first paragraph
    first_para = re.search(r'^([^\n#]+)', body_content)
    if first_para:
        para = first_para.group(1).strip()
        if para:
            clean_desc = re.sub(r'\s+', ' ', para)
            return clean_desc[:500] + "..." if len(clean_desc) > 500 else clean_desc
    
    return None


def dump_frontmatter(frontmatter: Dict) -> str:
    """Convert frontmatter dict to properly formatted YAML."""
    yaml_lines = []
    
    # Handle name
    if 'name' in frontmatter:
        yaml_lines.append(f"name: {frontmatter['name']}")
    
    # Handle description - quote if it contains special characters
    if 'description' in frontmatter:
        desc = frontmatter['description']
        if desc is not None:
            if ':' in desc or desc.strip().startswith('-') or desc.strip().startswith('['):
                yaml_lines.append(f"description: '{desc}'")
            else:
                yaml_lines.append(f"description: {desc}")
    
    # Handle license
    if 'license' in frontmatter:
        yaml_lines.append(f"license: {frontmatter['license']}")
    
    # Handle metadata
    if 'metadata' in frontmatter and frontmatter['metadata']:
        yaml_lines.append("metadata:")
        for key, value in frontmatter['metadata'].items():
            yaml_lines.append(f"  {key}: {value}")
    
    # Handle allowed-tools
    if 'allowed-tools' in frontmatter:
        tools = frontmatter['allowed-tools']
        if tools:
            yaml_lines.append(f"allowed-tools: '{tools}'")
        else:
            yaml_lines.append("allowed-tools: ''")
    
    # Handle compatibility
    if 'compatibility' in frontmatter:
        compat = frontmatter['compatibility']
        if ':' in compat:
            yaml_lines.append(f"compatibility: '{compat}'")
        else:
            yaml_lines.append(f"compatibility: {compat}")
    
    return '\n'.join(yaml_lines)


def fix_all_skills(skills_dir: Path) -> None:
    """Fix all skills in a directory."""
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
    
    print(f"Fixing {len(skill_dirs)} skills in {skills_dir}...")
    print()
    
    fixed_count = 0
    error_count = 0
    
    for skill_dir in skill_dirs:
        if fix_skill(skill_dir):
            fixed_count += 1
        else:
            error_count += 1
    
    print()
    print(f"📊 Results: {fixed_count} skills processed, {error_count} with errors")
    
    if error_count == 0:
        print("🎉 All skills fixed successfully!")
    else:
        print(f"⚠️  {error_count} skills still have issues that need manual fixing")


def main():
    """Main entry point."""
    if len(sys.argv) == 2:
        skill_path = Path(sys.argv[1])
        if skill_path.is_dir():
            fix_all_skills(skill_path)
        else:
            print(f"❌ Path is not a directory: {skill_path}")
            sys.exit(1)
    else:
        # Fix all skills in current directory
        skills_dir = Path(".")
        fix_all_skills(skills_dir)


if __name__ == "__main__":
    main()