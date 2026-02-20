#!/usr/bin/env python3
"""
Skill Functionality Test Script

Tests whether migrated skills are properly structured and functional
"""

import os
import re
import sys
import yaml
from pathlib import Path
from typing import Dict, List, Optional, Tuple

def test_skill_yaml_frontmatter(skill_path: Path) -> Tuple[bool, List[str]]:
    """Test if a skill has valid YAML frontmatter."""
    errors = []
    
    try:
        with open(skill_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        errors.append(f"Failed to read skill file: {e}")
        return False, errors
    
    # Check for frontmatter
    frontmatter_match = re.match(r'^---\s*$(.*?)\s*^---\s*$', content, re.MULTILINE | re.DOTALL)
    if not frontmatter_match:
        errors.append("Missing or invalid YAML frontmatter")
        return False, errors
    
    try:
        frontmatter = yaml.safe_load(frontmatter_match.group(1))
        if frontmatter is None:
            frontmatter = {}
    except yaml.YAMLError as e:
        errors.append(f"YAML parsing error: {e}")
        return False, errors
    
    # Check required fields
    required_fields = ['name', 'description', 'license', 'metadata', 'allowed-tools']
    for field in required_fields:
        if field not in frontmatter:
            errors.append(f"Missing required field: {field}")
    
    # Check metadata fields
    if 'metadata' in frontmatter:
        metadata_required = ['author', 'version', 'category', 'gsd-tools']
        for field in metadata_required:
            if field not in frontmatter['metadata']:
                errors.append(f"Missing required metadata field: {field}")
    
    return len(errors) == 0, errors

def test_skill_structure(skill_path: Path) -> Tuple[bool, List[str]]:
    """Test if a skill has proper structure and sections."""
    errors = []
    
    try:
        with open(skill_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        errors.append(f"Failed to read skill file: {e}")
        return False, errors
    
    # Check for required sections
    required_sections = [
        '# .+ Skill',  # Title
        '## Objective',
        '## Process',
        '## Output',
        '## Success Criteria'
    ]
    
    for section in required_sections:
        if not re.search(section, content):
            errors.append(f"Missing required section: {section}")
    
    # Check for common issues
    if 'TODO:' in content:
        todo_count = content.count('TODO:')
        if todo_count > 15:  # More than 15 TODOs suggests incomplete migration
            errors.append(f"Skill has {todo_count} TODO placeholders - may need manual completion")
        else:
            print(f"ℹ️  Skill has {todo_count} TODO placeholders (expected for migrated skills)")
    
    return len(errors) == 0, errors

def test_skill_tools(skill_path: Path) -> Tuple[bool, List[str]]:
    """Test if a skill has valid allowed-tools."""
    errors = []
    
    try:
        with open(skill_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        errors.append(f"Failed to read skill file: {e}")
        return False, errors
    
    # Extract frontmatter
    frontmatter_match = re.match(r'^---\s*$(.*?)\s*^---\s*$', content, re.MULTILINE | re.DOTALL)
    if not frontmatter_match:
        errors.append("Missing YAML frontmatter")
        return False, errors
    
    try:
        frontmatter = yaml.safe_load(frontmatter_match.group(1))
        if frontmatter is None:
            frontmatter = {}
    except yaml.YAMLError as e:
        errors.append(f"YAML parsing error: {e}")
        return False, errors
    
    # Check allowed-tools
    if 'allowed-tools' not in frontmatter:
        errors.append("Missing allowed-tools field")
        return False, errors
    
    allowed_tools = frontmatter['allowed-tools']
    if not allowed_tools:
        errors.append("allowed-tools is empty")
    elif isinstance(allowed_tools, str) and not allowed_tools.strip():
        errors.append("allowed-tools string is empty")
    
    # Check for valid tool names
    valid_tools = ['Read', 'Write', 'Bash', 'Glob', 'AskUserQuestion', 'AskUserConfirmation']
    
    if isinstance(allowed_tools, str):
        tools_list = [tool.strip() for tool in allowed_tools.split()]
    elif isinstance(allowed_tools, list):
        tools_list = [str(tool) for tool in allowed_tools]
    else:
        tools_list = []
    
    for tool in tools_list:
        if tool not in valid_tools:
            errors.append(f"Invalid tool: {tool}")
    
    return len(errors) == 0, errors

def test_skill_compatibility(skill_path: Path) -> Tuple[bool, List[str]]:
    """Test if a skill is compatible with Mistral-Vibe environment."""
    errors = []
    
    try:
        with open(skill_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        errors.append(f"Failed to read skill file: {e}")
        return False, errors
    
    # Check for Claude-specific references that might not work in Mistral-Vibe
    claude_patterns = [
        r'@~/.claude/',
        r'Claude',
        r'claude',
        r'Anthropic'
    ]
    
    for pattern in claude_patterns:
        if re.search(pattern, content):
            errors.append(f"Found Claude-specific reference: {pattern}")
    
    # Check for proper tool usage patterns
    # Only warn about AskUserQuestion header if it's actually being used in a call
    if 'AskUserQuestion:' in content and 'header:' not in content:
        errors.append("AskUserQuestion usage might be missing required 'header' field")
    
    return len(errors) == 0, errors

def test_all_skills(skills_dir: Path) -> Dict[str, Dict]:
    """Test all skills in a directory."""
    results = {}
    
    if not skills_dir.exists():
        print(f"❌ Skills directory not found: {skills_dir}")
        return results
    
    # Find all skill directories with SKILL.md files
    skill_files = []
    for d in skills_dir.iterdir():
        if d.is_dir():
            skill_md_path = d / "SKILL.md"
            if skill_md_path.exists():
                skill_files.append(skill_md_path)
    
    if not skill_files:
        print(f"ℹ️  No skills found in directory: {skills_dir}")
        return results
    
    print(f"Testing {len(skill_files)} skills...")
    print()
    
    for skill_file in skill_files:
        skill_name = skill_file.parent.name
        print(f"🔍 Testing skill: {skill_name}")
        
        result = {
            'yaml_frontmatter': {'pass': False, 'errors': []},
            'structure': {'pass': False, 'errors': []},
            'tools': {'pass': False, 'errors': []},
            'compatibility': {'pass': False, 'errors': []}
        }
        
        # Test YAML frontmatter
        result['yaml_frontmatter']['pass'], result['yaml_frontmatter']['errors'] = test_skill_yaml_frontmatter(skill_file)
        
        # Test structure
        result['structure']['pass'], result['structure']['errors'] = test_skill_structure(skill_file)
        
        # Test tools
        result['tools']['pass'], result['tools']['errors'] = test_skill_tools(skill_file)
        
        # Test compatibility
        result['compatibility']['pass'], result['compatibility']['errors'] = test_skill_compatibility(skill_file)
        
        # Overall pass/fail
        overall_pass = all([
            result['yaml_frontmatter']['pass'],
            result['structure']['pass'],
            result['tools']['pass'],
            result['compatibility']['pass']
        ])
        
        result['overall'] = overall_pass
        results[skill_name] = result
        
        # Print results for this skill
        status = "✅ PASS" if overall_pass else "❌ FAIL"
        print(f"   {status}")
        
        if not overall_pass:
            for test_name, test_result in result.items():
                if test_name != 'overall' and not test_result['pass']:
                    print(f"     🚫 {test_name}: {len(test_result['errors'])} errors")
                    for error in test_result['errors']:
                        print(f"       - {error}")
        
        print()
    
    return results

def main():
    """Main entry point."""
    # Default path
    skills_dir = Path("skills/gsd/")
    
    if len(sys.argv) == 2:
        skills_dir = Path(sys.argv[1])
    
    # Test all skills
    results = test_all_skills(skills_dir)
    
    # Summary
    total_skills = len(results)
    passed_skills = sum(1 for result in results.values() if result['overall'])
    failed_skills = total_skills - passed_skills
    
    print("📊 Test Summary:")
    print(f"   Total skills tested: {total_skills}")
    print(f"   ✅ Passed: {passed_skills}")
    print(f"   ❌ Failed: {failed_skills}")
    print()
    
    if failed_skills == 0:
        print("🎉 All skills passed functionality tests!")
    else:
        print("⚠️  Some skills need attention.")
        print("Run individual tests for more details.")

if __name__ == "__main__":
    main()