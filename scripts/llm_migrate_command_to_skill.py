#!/usr/bin/env python3
"""
LLM-Based Command to Skill Migration

Main migration workflow using LLM agent
"""

import argparse
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import local modules
import os
import sys

# Add scripts directory to Python path for local imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from llm_migration_preprocessor import preprocess_command_workflow
from llm_migration_agent import SkillMigrationAgent
from migrate_command_to_skill import migrate_command_to_skill as python_migrate_command

def llm_migrate_command_to_skill(
    command_path: Path,
    skills_dir: Path,
    max_iterations: int = 3
) -> Dict:
    """
    Complete LLM-based migration workflow for a single command
    
    Args:
        command_path: Path to command file
        skills_dir: Output directory for skills
        max_iterations: Maximum refinement iterations
        
    Returns:
        Dictionary with migration results
    """
    command_name = command_path.stem
    workflow_path = Path(f"get-shit-done/workflows/{command_name}.md")
    
    try:
        # Phase 1: Preprocessing
        print(f"🔄 Preprocessing: {command_name}")
        context = preprocess_command_workflow(command_path, workflow_path)
        
        # Phase 2: LLM Migration
        print(f"🤖 Generating skill with LLM: {command_name}")
        agent = SkillMigrationAgent(
            model=os.getenv('MISTRAL_MODEL', 'mistral-large-latest'),
            temperature=float(os.getenv('MISTRAL_TEMPERATURE', 0.3))
        )
        
        skill_content = agent.migrate(context['prompt'])
        
        # Phase 3: Post-processing
        print(f"📝 Writing skill file: {command_name}")
        skill_dir = skills_dir / command_name
        skill_dir.mkdir(parents=True, exist_ok=True)
        skill_file = skill_dir / "SKILL.md"
        
        with open(skill_file, 'w', encoding='utf-8') as f:
            f.write(skill_content)
        
        return {
            'status': 'SUCCESS',
            'command': command_name,
            'skill_path': str(skill_file),
            'method': 'llm',
            'iterations': 1
        }
        
    except Exception as e:
        print(f"❌ LLM migration failed for {command_name}: {e}")
        
        # Fallback to Python method if enabled
        if os.getenv('FALLBACK_TO_PYTHON', 'true').lower() == 'true':
            print(f"🔄 Falling back to Python migration: {command_name}")
            try:
                result = python_migrate_command(command_path, skills_dir)
                if result:
                    return {
                        'status': 'FALLBACK_SUCCESS',
                        'command': command_name,
                        'skill_path': str(skills_dir / command_name / "SKILL.md"),
                        'method': 'python',
                        'iterations': 1
                    }
            except Exception as fallback_error:
                print(f"❌ Python fallback also failed: {fallback_error}")
        
        return {
            'status': 'FAILED',
            'command': command_name,
            'error': str(e),
            'method': 'none'
        }

def llm_migrate_all_commands(
    commands_dir: Path,
    skills_dir: Path,
    method: str = 'llm'
) -> Dict:
    """
    Migrate all commands using specified method
    
    Args:
        commands_dir: Directory containing command files
        skills_dir: Output directory for skills
        method: 'llm' or 'python'
        
    Returns:
        Dictionary with migration results summary
    """
    results = {
        'success': 0,
        'fallback_success': 0,
        'failed': 0,
        'details': []
    }
    
    # Find all command files
    command_files = list(commands_dir.glob("*.md"))
    if not command_files:
        print(f"⚠️  No command files found in {commands_dir}")
        return results
    
    print(f"🚀 Migrating {len(command_files)} commands using {method} method...")
    
    for i, command_file in enumerate(command_files, 1):
        command_name = command_file.stem
        print(f"\n📋 [{i}/{len(command_files)}] Processing: {command_name}")
        
        if method == 'llm':
            result = llm_migrate_command_to_skill(command_file, skills_dir)
        else:
            # Use Python method
            try:
                success = python_migrate_command(command_file, skills_dir)
                if success:
                    result = {
                        'status': 'SUCCESS',
                        'command': command_name,
                        'skill_path': str(skills_dir / command_name / "SKILL.md"),
                        'method': 'python'
                    }
                else:
                    result = {
                        'status': 'FAILED',
                        'command': command_name,
                        'error': 'Python migration failed',
                        'method': 'python'
                    }
            except Exception as e:
                result = {
                    'status': 'FAILED',
                    'command': command_name,
                    'error': str(e),
                    'method': 'python'
                }
        
        # Track results
        results['details'].append(result)
        
        if result['status'] == 'SUCCESS':
            results['success'] += 1
            print(f"✅ {command_name}: SUCCESS")
        elif result['status'] == 'FALLBACK_SUCCESS':
            results['fallback_success'] += 1
            print(f"⚠️  {command_name}: FALLBACK_SUCCESS")
        else:
            results['failed'] += 1
            print(f"❌ {command_name}: FAILED - {result.get('error', 'unknown error')}")
    
    # Summary
    total = len(command_files)
    success_rate = (results['success'] / total * 100) if total > 0 else 0
    
    print(f"\n📊 Migration Complete:")
    print(f"   ✅ Success: {results['success']}/{total} ({success_rate:.1f}%)")
    print(f"   ⚠️  Fallback: {results['fallback_success']}")
    print(f"   ❌ Failed: {results['failed']}")
    
    return results

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description="GSD Command to Skill Migration (LLM or Python)"
    )
    parser.add_argument(
        '--method',
        choices=['llm', 'python'],
        default='llm',
        help='Migration method: llm (default) or python'
    )
    parser.add_argument(
        'sources',
        nargs='+',
        help='Command files or directories to migrate'
    )
    parser.add_argument(
        '--output',
        default='skills/gsd/',
        help='Output directory for migrated skills'
    )
    
    args = parser.parse_args()
    
    # Convert sources to Path objects
    source_paths = [Path(source) for source in args.sources]
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"🎯 GSD Command to Skill Migration")
    print(f"   Method: {args.method.upper()}")
    print(f"   Output: {output_dir}")
    print(f"   Sources: {', '.join(str(p) for p in source_paths)}")
    
    # Process each source
    all_results = {
        'sources': [],
        'total': {'success': 0, 'fallback_success': 0, 'failed': 0}
    }
    
    for source_path in source_paths:
        if source_path.is_file():
            # Single command file
            if args.method == 'llm':
                result = llm_migrate_command_to_skill(source_path, output_dir)
                all_results['sources'].append({
                    'source': str(source_path),
                    'result': result
                })
                
                # Update totals
                if result['status'] == 'SUCCESS':
                    all_results['total']['success'] += 1
                elif result['status'] == 'FALLBACK_SUCCESS':
                    all_results['total']['fallback_success'] += 1
                else:
                    all_results['total']['failed'] += 1
            else:
                # Python method for single file
                try:
                    success = python_migrate_command(source_path, output_dir)
                    status = 'SUCCESS' if success else 'FAILED'
                    all_results['sources'].append({
                        'source': str(source_path),
                        'result': {
                            'status': status,
                            'command': source_path.stem,
                            'method': 'python'
                        }
                    })
                    all_results['total'][status.lower()] += 1
                except Exception as e:
                    all_results['sources'].append({
                        'source': str(source_path),
                        'result': {
                            'status': 'FAILED',
                            'command': source_path.stem,
                            'error': str(e),
                            'method': 'python'
                        }
                    })
                    all_results['total']['failed'] += 1
        
        elif source_path.is_dir():
            # Directory of commands
            dir_results = llm_migrate_all_commands(source_path, output_dir, args.method)
            all_results['sources'].append({
                'source': str(source_path),
                'result': dir_results
            })
            
            # Update totals
            all_results['total']['success'] += dir_results['success']
            all_results['total']['fallback_success'] += dir_results['fallback_success']
            all_results['total']['failed'] += dir_results['failed']
    
    # Final summary
    total_commands = sum(
        len([r for r in source['result']['details'] if 'command' in r])
        if isinstance(source['result'], dict) and 'details' in source['result']
        else 1
        for source in all_results['sources']
    )
    
    success_rate = (all_results['total']['success'] / total_commands * 100) if total_commands > 0 else 0
    
    print(f"\n🏁 Final Results:")
    print(f"   Total Commands: {total_commands}")
    print(f"   ✅ Success: {all_results['total']['success']} ({success_rate:.1f}%)")
    print(f"   ⚠️  Fallback: {all_results['total']['fallback_success']}")
    print(f"   ❌ Failed: {all_results['total']['failed']}")
    
    if all_results['total']['failed'] > 0:
        print(f"\n⚠️  Some migrations failed. Check logs for details.")
    
    return all_results

if __name__ == "__main__":
    # Check environment
    if os.getenv('MISTRAL_API_KEY') and 'mistralai' not in sys.modules:
        try:
            import mistralai
            print("✅ Mistral client available")
        except ImportError:
            print("⚠️  Mistral client not installed. Install with: pip install mistralai")
            print("   Falling back to simulation mode.")
    
    # Run main migration
    results = main()
    
    # Exit with appropriate code
    if results['total']['failed'] > 0:
        sys.exit(1)
    else:
        sys.exit(0)