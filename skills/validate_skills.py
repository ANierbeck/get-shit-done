#!/usr/bin/env python3
"""
Agent Skills Validator for Get Shit Done

Validates skills according to the Agent Skills specification.
"""

import os
import re
import sys
import yaml
from pathlib import Path
from typing import List, Dict, Optional, Tuple


class SkillValidationError(Exception):
    """Exception raised for skill validation errors."""
    pass


class SkillValidator:
    """Validates Agent Skills according to the specification."""
    
    def __init__(self, skill_path: Path):
        self.skill_path = skill_path
        self.skill_name = skill_path.name
        self.errors = []
        self.warnings = []
        
    def validate(self) -> bool:
        """Validate the skill and return True if valid, False otherwise."""
        try:
            self._validate_directory_structure()
            self._validate_skill_md_exists()
            frontmatter, _ = self._parse_skill_md()
            self._validate_frontmatter(frontmatter)
            self._validate_name_matches_directory(frontmatter)
            
            if self.errors:
                return False
            return True
            
        except SkillValidationError as e:
            self.errors.append(str(e))
            return False
        except Exception as e:
            self.errors.append(f"Unexpected error during validation: {e}")
            return False
    
    def _validate_directory_structure(self):
        """Validate the skill directory structure."""
        if not self.skill_path.is_dir():
            raise SkillValidationError(f"Skill path is not a directory: {self.skill_path}")
    
    def _validate_skill_md_exists(self):
        """Validate that SKILL.md exists."""
        skill_md_path = self.skill_path / "SKILL.md"
        if not skill_md_path.exists():
            raise SkillValidationError(f"SKILL.md not found in skill directory: {self.skill_path}")
        if not skill_md_path.is_file():
            raise SkillValidationError(f"SKILL.md is not a file: {skill_md_path}")
    
    def _parse_skill_md(self) -> Tuple[Dict, str]:
        """Parse SKILL.md and return frontmatter and content."""
        skill_md_path = self.skill_path / "SKILL.md"
        
        try:
            with open(skill_md_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            raise SkillValidationError(f"Failed to read SKILL.md: {e}")
        
        # Split frontmatter from content
        frontmatter_match = re.match(r'^---\s*$(.*?)\s*^---\s*$', content, re.MULTILINE | re.DOTALL)
        if not frontmatter_match:
            raise SkillValidationError("SKILL.md missing YAML frontmatter (must start and end with ---)")
        
        frontmatter_yaml = frontmatter_match.group(1)
        body_content = content[frontmatter_match.end():].strip()
        
        try:
            frontmatter = yaml.safe_load(frontmatter_yaml)
            if frontmatter is None:
                frontmatter = {}
        except yaml.YAMLError as e:
            raise SkillValidationError(f"Invalid YAML frontmatter: {e}")
        
        return frontmatter, body_content
    
    def _validate_frontmatter(self, frontmatter: Dict):
        """Validate the frontmatter fields."""
        # Check required fields
        if 'name' not in frontmatter:
            raise SkillValidationError("Missing required field: name")
        
        if 'description' not in frontmatter:
            raise SkillValidationError("Missing required field: description")
        
        # Validate name field
        self._validate_name_field(frontmatter['name'])
        
        # Validate description field
        self._validate_description_field(frontmatter['description'])
        
        # Validate optional fields
        if 'license' in frontmatter:
            self._validate_license_field(frontmatter['license'])
            
        if 'compatibility' in frontmatter:
            self._validate_compatibility_field(frontmatter['compatibility'])
            
        if 'metadata' in frontmatter:
            self._validate_metadata_field(frontmatter['metadata'])
            
        if 'allowed-tools' in frontmatter:
            self._validate_allowed_tools_field(frontmatter['allowed-tools'])
    
    def _validate_name_field(self, name: str):
        """Validate the name field according to specification."""
        if not isinstance(name, str):
            raise SkillValidationError("name must be a string")
        
        if len(name) < 1 or len(name) > 64:
            raise SkillValidationError("name must be 1-64 characters")
        
        # Check for valid characters (lowercase alphanumeric and hyphens)
        if not re.match(r'^[a-z0-9-]+$', name):
            raise SkillValidationError("name may only contain lowercase letters, numbers, and hyphens")
        
        # Check for leading or trailing hyphens
        if name.startswith('-') or name.endswith('-'):
            raise SkillValidationError("name must not start or end with hyphen")
        
        # Check for consecutive hyphens
        if '--' in name:
            raise SkillValidationError("name must not contain consecutive hyphens")
    
    def _validate_description_field(self, description: str):
        """Validate the description field according to specification."""
        if not isinstance(description, str):
            raise SkillValidationError("description must be a string")
        
        if len(description) < 1 or len(description) > 1024:
            raise SkillValidationError("description must be 1-1024 characters")
        
        if not description.strip():
            raise SkillValidationError("description cannot be empty or whitespace only")
    
    def _validate_license_field(self, license: str):
        """Validate the license field."""
        if not isinstance(license, str):
            raise SkillValidationError("license must be a string")
    
    def _validate_compatibility_field(self, compatibility: str):
        """Validate the compatibility field."""
        if not isinstance(compatibility, str):
            raise SkillValidationError("compatibility must be a string")
        
        if len(compatibility) > 500:
            raise SkillValidationError("compatibility must be 1-500 characters")
    
    def _validate_metadata_field(self, metadata: Dict):
        """Validate the metadata field."""
        if not isinstance(metadata, dict):
            raise SkillValidationError("metadata must be a dictionary")
        
        for key, value in metadata.items():
            if not isinstance(key, str):
                raise SkillValidationError(f"metadata key must be string, got {type(key).__name__}")
            if not isinstance(value, str):
                raise SkillValidationError(f"metadata value for '{key}' must be string, got {type(value).__name__}")
    
    def _validate_allowed_tools_field(self, allowed_tools: str):
        """Validate the allowed-tools field."""
        if not isinstance(allowed_tools, str):
            raise SkillValidationError("allowed-tools must be a string")
    
    def _validate_name_matches_directory(self, frontmatter: Dict):
        """Validate that the name field matches the directory name."""
        skill_name = frontmatter['name']
        directory_name = self.skill_name
        
        if skill_name != directory_name:
            raise SkillValidationError(f"Skill name '{skill_name}' does not match directory name '{directory_name}'")
    
    def get_errors(self) -> List[str]:
        """Get validation errors."""
        return self.errors
    
    def get_warnings(self) -> List[str]:
        """Get validation warnings."""
        return self.warnings


def validate_skill(skill_path: Path) -> bool:
    """Validate a single skill."""
    validator = SkillValidator(skill_path)
    is_valid = validator.validate()
    
    if validator.errors:
        print(f"❌ Skill '{skill_path.name}' has validation errors:")
        for error in validator.errors:
            print(f"  - {error}")
        print()
    else:
        print(f"✅ Skill '{skill_path.name}' is valid")
    
    if validator.warnings:
        print(f"⚠️  Skill '{skill_path.name}' has warnings:")
        for warning in validator.warnings:
            print(f"  - {warning}")
        print()
    
    return is_valid


def validate_all_skills(skills_dir: Path) -> bool:
    """Validate all skills in a directory."""
    all_valid = True
    
    if not skills_dir.exists():
        print(f"❌ Skills directory not found: {skills_dir}")
        return False
    
    if not skills_dir.is_dir():
        print(f"❌ Skills path is not a directory: {skills_dir}")
        return False
    
    # Only include directories that contain SKILL.md files
    skill_dirs = []
    for d in skills_dir.iterdir():
        if d.is_dir():
            skill_md_path = d / "SKILL.md"
            if skill_md_path.exists():
                skill_dirs.append(d)
    
    if not skill_dirs:
        print(f"ℹ️  No skills found in directory: {skills_dir}")
        return True
    
    print(f"Validating {len(skill_dirs)} skills in {skills_dir}...\n")
    
    for skill_dir in skill_dirs:
        if not validate_skill(skill_dir):
            all_valid = False
    
    if all_valid:
        print(f"🎉 All {len(skill_dirs)} skills are valid!")
    else:
        print(f"❌ Found validation errors in {len(skill_dirs)} skills")
    
    return all_valid


def main():
    """Main entry point."""
    if len(sys.argv) > 1:
        # Validate each argument as a skill path
        all_valid = True
        for arg in sys.argv[1:]:
            skill_path = Path(arg)
            if skill_path.is_dir():
                # Check if this directory contains SKILL.md (single skill)
                skill_md_path = skill_path / "SKILL.md"
                if skill_md_path.exists():
                    # Validate single skill
                    if not validate_skill(skill_path):
                        all_valid = False
                else:
                    # Validate all skills in this directory
                    if not validate_all_skills(skill_path):
                        all_valid = False
            else:
                print(f"❌ Path is not a directory: {skill_path}")
                all_valid = False
        
        if not all_valid:
            sys.exit(1)
    else:
        # Validate all skills in current directory
        skills_dir = Path(".")
        validate_all_skills(skills_dir)


if __name__ == "__main__":
    main()