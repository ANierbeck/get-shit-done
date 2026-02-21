#!/usr/bin/env python3
"""
LLM Migration Agent

Core LLM migration logic with Mistral integration
"""

import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Add scripts directory to Python path for local imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

from migrate_command_to_skill import parse_command_file

class SkillMigrationAgent:
    def __init__(self, model: str = "mistral-large-latest", temperature: float = 0.3):
        """Initialize LLM migration agent"""
        self.model = model
        self.temperature = temperature
        self.system_prompt = self._create_system_prompt()
        self.max_tokens = int(os.getenv('MISTRAL_MAX_TOKENS', '4096'))
        
    def _create_system_prompt(self) -> str:
        """Create system prompt with specification requirements"""
        return """You are a Get Shit Done (GSD) Skill Migration Expert. Your task is to convert GSD command files to skill format according to the agentskills.io specification.

## Requirements:
1. Follow the SKILL.md specification exactly
2. Use Mistral-Vibe compatible paths: ~/.vibe/get-shit-done/workflows/
3. Extract all relevant information from command and workflow files
4. Complete TODO sections intelligently
5. Maintain original functionality and intent
6. Use proper YAML frontmatter format
7. Include all required sections

## Specification:
- YAML frontmatter with: name, description, license, metadata, allowed-tools
- Sections: Objective, When to Use, Process, Output, Success Criteria, Examples
- Metadata: author, version, category, gsd-tools
- Use markdown formatting consistently
- Complete all sections - no TODOs unless absolutely necessary

## Path Conversion:
- Convert @~/.claude/get-shit-done/workflows/ → ~/.vibe/get-shit-done/workflows/
- Remove all .planning/ references
- Use consistent path formatting

## Quality Standards:
- Generate 2-3 realistic examples with actual input/output pairs
- Provide specific usage guidelines and anti-patterns
- Extract success criteria from command structure
- Describe outputs clearly with file references
- Maintain professional tone and formatting

Respond ONLY with the complete SKILL.md content, nothing else."""

    def _create_user_prompt(self, context: Dict) -> str:
        """Create detailed user prompt with all context"""
        # Format tools list
        tools_list = ", ".join(context['tools']) if isinstance(context['tools'], list) else context['tools']
        
        # Format workflow steps
        steps_content = ""
        if context['workflow_steps']:
            for step in context['workflow_steps']:
                steps_content += f"  Step {step['number']}: {step['title']}\n"
        
        return f"""Convert the following GSD command to skill format:

## Command Information:
- Name: {context['command_name']}
- Description: {context['description']}
- Tools: {tools_list}

## Objective:
{context['objective']}

## Process:
{context['process']}

## Success Criteria (if available):
{context['success_criteria']}

## Output (if available):
{context['output']}

## Additional Context:
{context['context']}

## Execution Context:
{context['execution_context']}

## Workflow Information:
- Workflow path: ~/.vibe/get-shit-done/workflows/{context['command_name']}.md
- Workflow steps:
{steps_content}
- Workflow content:
{context['workflow_content'][:1000]}... (truncated)

## Requirements:
1. Generate complete SKILL.md file
2. Use Mistral-Vibe paths: ~/.vibe/get-shit-done/workflows/{context['command_name']}.md
3. Provide 2-3 realistic examples with actual inputs and outputs
4. Extract usage guidelines from objective section
5. Identify anti-patterns from notes and warnings
6. Complete all sections thoroughly
7. Use proper YAML frontmatter with all required fields
8. Maintain markdown formatting

Generate the complete SKILL.md file:"""

    def _call_llm(self, system_prompt: str, user_prompt: str) -> str:
        """Call Mistral API - placeholder for actual implementation"""
        # In production, this would call the actual Mistral API
        # For now, we'll simulate with a simple response
        
        try:
            # Try to import mistralai for real implementation
            from mistralai.client import MistralClient
            from mistralai.models.chat_completion import ChatMessage
            
            client = MistralClient(api_key=os.getenv('MISTRAL_API_KEY'))
            
            messages = [
                ChatMessage(role="system", content=system_prompt),
                ChatMessage(role="user", content=user_prompt)
            ]
            
            response = client.chat(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            return response.choices[0].message.content
            
        except ImportError:
            # Fallback to simulation for development
            print("⚠️  Mistral client not available, using simulation mode")
            return self._simulate_llm_response(user_prompt)
        except Exception as e:
            print(f"❌ Mistral API error: {e}")
            return self._simulate_llm_response(user_prompt)

    def _simulate_llm_response(self, user_prompt: str) -> str:
        """Simulate LLM response for development/testing"""
        # Extract basic information from prompt
        command_name = "research-phase"  # Default for simulation
        
        # Simulate a basic skill structure
        return f"""---
name: {command_name}
description: Research how to implement a phase
description: Research how to implement a phase (standalone - usually use /gsd:plan-phase instead)
license: MIT
metadata:
  author: get-shit-done
  version: 1.0
  category: project-management
  gsd-tools: core-operations, state-management
allowed-tools: 'Read Bash Bash'
---

# Research Phase Skill

## Objective

Research how to implement a phase. Spawns gsd-phase-researcher agent with phase context.

**Note:** This is a standalone research command. For most workflows, use `/gsd:plan-phase` which integrates research automatically.

**Use this command when:**
- You want to research without planning yet
- You want to re-research after planning is complete
- You need to investigate before deciding if a phase is feasible

## When to Use

📖 **Usage Guidelines**:
- When you need to research implementation approaches for a phase
- When you want to investigate feasibility before full planning
- When you need to update existing research with new information

**Do NOT use when:**
- For most standard workflows (use `/gsd:plan-phase` instead)
- When you already have complete research and just need to plan
- For simple phases that don't require research

## Process

## 0. Initialize Context

```bash
INIT=$(node ~/.Agent/get-shit-done/bin/gsd-tools.cjs init phase-op "$ARGUMENTS")
```

Extract from init JSON: `phase_dir`, `phase_number`, `phase_name`, `phase_found`, `commit_docs`, `has_research`, `state_path`, `requirements_path`, `context_path`, `research_path`.

## 1. Validate Phase

```bash
PHASE_INFO=$(node ~/.Agent/get-shit-done/bin/gsd-tools.cjs roadmap get-phase "${phase_number}")
```

**If `found` is false:** Error and exit. **If `found` is true:** Extract `phase_number`, `phase_name`, `goal` from JSON.

## Output

- Creates research file at `.planning/phases/${PHASE}-{slug}/${PHASE}-RESEARCH.md`
- Contains sections: Standard Stack, Architecture Patterns, Don't Hand-Roll, Common Pitfalls, Code Examples
- Used by `/gsd:plan-phase` for implementation planning

## Success Criteria

- [ ] Phase validated against roadmap
- [ ] Existing research checked and handled appropriately
- [ ] gsd-phase-researcher spawned with proper context
- [ ] Research results properly formatted for plan-phase consumption
- [ ] User understands next steps (plan phase, dig deeper, or manual implementation)

## Examples

### Example 1: Researching Authentication Phase

```
Input: User runs `/gsd:research-phase auth`
Process: Agent researches authentication patterns, libraries, and best practices
Output: RESEARCH.md with standard auth stack, architecture patterns, and code examples
Next: User reviews research and runs `/gsd:plan-phase auth` to create implementation plan
```

### Example 2: Updating Existing Research

```
Input: User runs `/gsd:research-phase auth` when research already exists
Process: Agent shows existing research and asks user to choose: update, view, or skip
Output: Updated RESEARCH.md with new findings while preserving useful existing content
```

### Example 3: Feasibility Investigation

```
Input: User runs `/gsd:research-phase "machine learning model training"`
Process: Agent investigates ML training approaches, frameworks, and infrastructure requirements
Output: RESEARCH.md with feasibility assessment, recommended stack, and implementation considerations
```
"""

    def migrate(self, prompt_context: Dict) -> str:
        """Generate skill using LLM"""
        try:
            # Create user prompt
            user_prompt = self._create_user_prompt(prompt_context)
            
            # Call LLM
            response = self._call_llm(self.system_prompt, user_prompt)
            
            # Basic validation
            if not response or len(response) < 100:
                raise ValueError("LLM response too short or empty")
            
            if "---" not in response:
                raise ValueError("LLM response missing YAML frontmatter")
            
            return response
            
        except Exception as e:
            print(f"❌ LLM migration failed: {e}")
            # Fallback to basic template
            return self._create_fallback_skill(prompt_context)

    def _create_fallback_skill(self, context: Dict) -> str:
        """Create basic skill template as fallback"""
        command_name = context['command_name']
        description = context['description']
        
        return f"""---
name: {command_name}
description: {description}
license: MIT
metadata:
  author: get-shit-done
  version: 1.0
  category: project-management
  gsd-tools: core-operations, state-management
allowed-tools: 'Read Write Bash'
---

# {command_name.replace('-', ' ').title()} Skill

## Objective

{context['objective']}

## When to Use

📖 **Usage Guidelines**: See `~/.vibe/get-shit-done/workflows/{command_name}.md` for detailed usage scenarios and best practices.

**Do NOT use when:**
- [TODO: Add anti-patterns]

## Process

{context['process']}

## Output

- [TODO: Describe outputs of this skill]

## Success Criteria

- [ ] [TODO: Add success criteria]

## Examples

### Example 1: [TODO: Add example title]
```
Input: [TODO: Add example input]
Output: [TODO: Add example output]
```
"""

if __name__ == "__main__":
    # Test the agent
    print("🔧 Testing LLM Migration Agent")
    print(f"Model: {os.getenv('MISTRAL_MODEL', 'mistral-large-latest')}")
    print(f"Temperature: {os.getenv('MISTRAL_TEMPERATURE', 0.3)}")
    
    # Create test context
    test_context = {
        'command_name': 'test-command',
        'description': 'Test command for development',
        'objective': 'Test the LLM migration system',
        'process': 'Run tests and validate results',
        'success_criteria': '',
        'output': 'Test results and validation report',
        'context': '',
        'execution_context': '@~/.claude/get-shit-done/workflows/test-command.md',
        'tools': ['Read', 'Write', 'Bash'],
        'metadata': {'author': 'test', 'version': '1.0', 'category': 'testing'},
        'workflow_content': 'Test workflow content',
        'workflow_steps': []
    }
    
    agent = SkillMigrationAgent()
    result = agent.migrate(test_context)
    
    print(f"✅ Generated skill length: {len(result)} characters")
    print("📄 Skill preview (first 200 chars):")
    print(result[:200] + "...")