#!/usr/bin/env python3
"""
Test LLM Migration System

Simple test script to verify the LLM migration works
"""

import sys
import os
from pathlib import Path

# Add scripts directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from llm_migrate_command_to_skill import llm_migrate_command_to_skill

def test_single_command():
    """Test migration of a single command"""
    command_file = Path("commands/gsd/research-phase.md")
    output_dir = Path("skills/gsd/test-llm/")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("🧪 Testing LLM migration of research-phase command...")
    
    try:
        result = llm_migrate_command_to_skill(command_file, output_dir)
        
        if result['status'] == 'SUCCESS':
            print(f"✅ SUCCESS: {result['command']}")
            print(f"   Skill created at: {result['skill_path']}")
            
            # Check the generated skill
            skill_file = Path(result['skill_path'])
            if skill_file.exists():
                with open(skill_file, 'r') as f:
                    content = f.read()
                
                # Basic validation
                checks = {
                    'Has YAML frontmatter': '---' in content,
                    'Has Objective section': '## Objective' in content,
                    'Has When to Use section': '## When to Use' in content,
                    'Has Process section': '## Process' in content,
                    'Has Output section': '## Output' in content,
                    'Has Success Criteria': '## Success Criteria' in content,
                    'Has Examples': '## Examples' in content,
                    'Uses Mistral-Vibe paths': '~/.vibe/get-shit-done/workflows/' in content,
                    'No Claude paths': '@~/.claude/' not in content,
                    'No planning paths': '.planning/' not in content
                }
                
                print("\n🔍 Validation Checks:")
                passed = 0
                for check, result in checks.items():
                    status = "✅" if result else "❌"
                    print(f"   {status} {check}")
                    if result:
                        passed += 1
                
                score = (passed / len(checks) * 100)
                print(f"\n📊 Quality Score: {score:.1f}/100")
                
                if score >= 80:
                    print("🎉 Excellent quality!")
                elif score >= 60:
                    print("✅ Good quality")
                else:
                    print("⚠️  Needs improvement")
                
                return True
            else:
                print(f"❌ Skill file not found: {result['skill_path']}")
                return False
        else:
            print(f"❌ Migration failed: {result.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        return False

def test_comparison():
    """Compare LLM vs Python migration results"""
    command_file = Path("commands/gsd/research-phase.md")
    
    print("🔬 Comparing LLM vs Python migration methods...")
    
    # LLM method
    llm_output = Path("skills/gsd/test-llm/")
    llm_output.mkdir(parents=True, exist_ok=True)
    llm_result = llm_migrate_command_to_skill(command_file, llm_output)
    
    # Python method
    from migrate_command_to_skill import migrate_command_to_skill as python_migrate
    python_output = Path("skills/gsd/test-python/")
    python_output.mkdir(parents=True, exist_ok=True)
    python_success = python_migrate(command_file, python_output)
    
    print(f"\n📊 Comparison Results:")
    print(f"   LLM Method: {'✅ SUCCESS' if llm_result['status'] == 'SUCCESS' else '❌ FAILED'}")
    print(f"   Python Method: {'✅ SUCCESS' if python_success else '❌ FAILED'}")
    
    if llm_result['status'] == 'SUCCESS' and python_success:
        # Compare TODO counts
        llm_skill = Path(llm_result['skill_path'])
        python_skill = python_output / "research-phase" / "SKILL.md"
        
        llm_todos = count_todos(llm_skill)
        python_todos = count_todos(python_skill)
        
        print(f"\n📝 TODO Comparison:")
        print(f"   LLM Method: {llm_todos} TODOs")
        print(f"   Python Method: {python_todos} TODOs")
        
        if llm_todos < python_todos:
            reduction = ((python_todos - llm_todos) / python_todos * 100)
            print(f"   🎉 LLM reduced TODOs by {reduction:.1f}%")
        elif llm_todos == python_todos:
            print(f"   ➖ Same number of TODOs")
        else:
            print(f"   ⚠️  LLM has more TODOs")
        
        return True
    else:
        print(f"\n⚠️  Could not compare - one or both methods failed")
        return False

def count_todos(skill_path: Path) -> int:
    """Count TODO items in a skill file"""
    if not skill_path.exists():
        return 0
    
    with open(skill_path, 'r') as f:
        content = f.read()
    
    return content.count('TODO')

def main():
    """Run tests"""
    print("🚀 LLM Migration System Test")
    print("=" * 50)
    
    # Test 1: Single command migration
    if test_single_command():
        print("\n✅ Test 1 PASSED: Single command migration")
    else:
        print("\n❌ Test 1 FAILED: Single command migration")
        return False
    
    # Test 2: Method comparison
    if test_comparison():
        print("\n✅ Test 2 PASSED: Method comparison")
    else:
        print("\n❌ Test 2 FAILED: Method comparison")
        return False
    
    print("\n🎉 All tests completed successfully!")
    return True

if __name__ == "__main__":
    # Check if we have the mistralai client
    try:
        import mistralai
        has_mistral = True
    except ImportError:
        has_mistral = False
        print("⚠️  mistralai client not available - using simulation mode")
    
    success = main()
    sys.exit(0 if success else 1)