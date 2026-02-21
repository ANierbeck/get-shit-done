#!/usr/bin/env python3
"""
LLM Migration Preprocessor

Prepares command and workflow data for LLM processing
"""

import re
import sys
import os
from pathlib import Path
from typing import Dict, Optional

# Add scripts directory to Python path for local imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from migrate_command_to_skill import parse_command_file

def parse_workflow_file(workflow_path: Path) -> Optional[Dict]:
    """Parse workflow file and extract structure"""
    try:
        with open(workflow_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract steps if present
        steps = []
        step_matches = re.findall(r'##\s+Step\s+(\d+):\s*(.*?)(?=\n##|\n*<|\Z)', content, re.DOTALL)
        for step_num, step_content in step_matches:
            steps.append({
                'number': int(step_num),
                'title': step_content.split('\n')[0].strip(),
                'content': step_content.strip()
            })
        
        return {
            'content': content,
            'steps': steps,
            'has_steps': len(steps) > 0
        }
    except Exception as e:
        print(f"⚠️  Warning: Could not parse workflow file {workflow_path}: {e}")
        return None

def create_prompt_context(data: Dict) -> Dict:
    """Create structured context for LLM prompt"""
    context = {
        'command_name': data['command_name'],
        'description': data['frontmatter'].get('description', 'No description provided'),
        'objective': data['sections'].get('objective', 'No objective provided'),
        'process': data['sections'].get('process', 'No process provided'),
        'success_criteria': data['sections'].get('success_criteria', ''),
        'output': data['sections'].get('output', ''),
        'context': data['sections'].get('context', ''),
        'execution_context': data['sections'].get('execution_context', ''),
        'tools': data['frontmatter'].get('allowed-tools', []),
        'metadata': data['frontmatter'].get('metadata', {}),
        'workflow_content': data.get('workflow_content', ''),
        'workflow_steps': data.get('workflow_steps', [])
    }
    
    # Clean up empty values
    for key, value in list(context.items()):
        if not value or (isinstance(value, str) and value.strip() == 'No description provided'):
            context[key] = 'Not specified'
    
    return context

def preprocess_command_workflow(command_path: Path, workflow_path: Optional[Path] = None) -> Dict:
    """
    Prepare command and workflow data for LLM processing
    
    Args:
        command_path: Path to command file
        workflow_path: Optional path to workflow file
        
    Returns:
        Dictionary with processed data and prompt context
    """
    # Parse command file
    command_data = parse_command_file(command_path)
    if not command_data:
        raise ValueError(f"Failed to parse command file: {command_path}")
    
    # Parse workflow file if it exists
    workflow_data = {}
    if workflow_path and workflow_path.exists():
        workflow_data = parse_workflow_file(workflow_path) or {}
    
    # Extract key information
    context_data = {
        'command_name': command_data['command_name'],
        'frontmatter': command_data['frontmatter'],
        'sections': command_data['sections'],
        'workflow_content': workflow_data.get('content', ''),
        'workflow_steps': workflow_data.get('steps', [])
    }
    
    # Create structured prompt context
    prompt_context = create_prompt_context(context_data)
    
    return {
        'raw_data': command_data,
        'context': context_data,
        'prompt': prompt_context,
        'workflow_parsed': bool(workflow_data)
    }

if __name__ == "__main__":
    # Test preprocessing
    if len(sys.argv) != 2:
        print("Usage: python3 llm_migration_preprocessor.py <command_file>")
        sys.exit(1)
    
    command_path = Path(sys.argv[1])
    workflow_path = Path(f"get-shit-done/workflows/{command_path.stem}.md")
    
    try:
        result = preprocess_command_workflow(command_path, workflow_path)
        print(f"✅ Preprocessed: {command_path.stem}")
        print(f"   Workflow found: {result['workflow_parsed']}")
        print(f"   Context keys: {list(result['prompt'].keys())}")
    except Exception as e:
        print(f"❌ Error preprocessing {command_path}: {e}")
        sys.exit(1)