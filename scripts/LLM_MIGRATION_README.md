# LLM-Agent Based Skill Migration System

## 🚀 Overview

This system uses Large Language Models to intelligently convert GSD commands to skill format, significantly improving quality and reducing manual effort compared to the pattern-based approach.

## 🎯 Key Advantages

### Over Current Python Script:
- **Context Understanding**: LLM comprehends command intent and workflow relationships
- **Complete Documentation**: Generates examples, usage guidelines, and anti-patterns automatically
- **Spec Compliance**: Explicitly follows agentskills.io specification
- **Adaptive Learning**: Can handle diverse command structures intelligently
- **Quality Improvement**: 50%+ reduction in TODO placeholders

## 🏗️ System Architecture

```
┌───────────────────────────────────────────────────────┐
│            LLM-Agent Migration Pipeline               │
├───────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────┐    ┌─────────────┐    ┌───────────┐  │
│  │  Preprocessor  │───▶│  LLM Agent   │───▶│ Validator │  │
│  └─────────────┘    └─────────────┘    └───────────┘  │
│          ▲                                                  │
│          │                                                  │
│  ┌───────┴───────┐                                          │
│  │   Refiner     │◀─────────────────────────────────────┘
│  │ (Iterative   │                                          │
│  │  Improvement) │                                          │
│  └─────────────┘                                          │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## 📁 Files & Components

### 1. `llm_migration_preprocessor.py`
**Purpose**: Prepare command and workflow data for LLM processing

**Features:**
- Parses command YAML frontmatter and XML sections
- Extracts workflow content and structure
- Creates structured context for LLM prompts
- Handles missing workflow files gracefully

### 2. `llm_migration_agent.py`
**Purpose**: Core LLM migration logic

**Features:**
- System prompt with specification requirements
- Structured user prompts with full context
- Mistral-Vibe model integration
- Response formatting and validation

### 3. `llm_migration_validator.py`
**Purpose**: Validate generated skills against specification

**Features:**
- YAML frontmatter validation
- Content structure verification
- Specification compliance testing
- Quality scoring (0-100 scale)
- Detailed error reporting

### 4. `llm_migration_refiner.py`
**Purpose**: Iterative improvement of generated skills

**Features:**
- Multi-iteration refinement loop
- Feedback generation for LLM
- Best result tracking
- Early termination on success

### 5. `llm_migrate_command_to_skill.py`
**Purpose**: Main migration workflow

**Features:**
- Complete migration pipeline
- Single and batch processing
- Integration with existing test suite
- Fallback to Python method

### 6. `test_llm_skills.py`
**Purpose**: Enhanced testing framework

**Features:**
- Specification compliance testing
- Integration potential analysis
- Comparative testing (LLM vs Python)
- Performance metrics

## 🔧 Setup & Configuration

### Requirements

```bash
# Install required packages
pip install python-dotenv mistralai
```

### Environment Configuration

Create `.env` file in project root:

```env
# Mistral API Configuration
MISTRAL_API_KEY=your_api_key_here
MISTRAL_MODEL=mistral-large-latest
MISTRAL_TEMPERATURE=0.3
MISTRAL_MAX_TOKENS=4096

# Migration Settings
MAX_REFINE_ITERATIONS=3
MIN_ACCEPTABLE_SCORE=70
FALLBACK_TO_PYTHON=true
```

## 🚀 Usage

### Basic Migration

```bash
# Migrate single command with LLM
python3 scripts/llm_migrate_command_to_skill.py commands/gsd/research-phase.md

# Migrate all commands with LLM
python3 scripts/llm_migrate_command_to_skill.py commands/gsd/
```

### Method Comparison

```bash
# Use LLM method (default)
python3 scripts/llm_migrate_command_to_skill.py --method llm commands/gsd/

# Use Python method (original)
python3 scripts/llm_migrate_command_to_skill.py --method python commands/gsd/

# Compare results
python3 scripts/test_llm_skills.py skills/gsd/
```

### Testing & Validation

```bash
# Test LLM-generated skills
python3 scripts/test_llm_skills.py skills/gsd/

# Run original tests for compatibility
python3 scripts/test_skill_functionality.py skills/gsd/

# Detailed analysis
python3 scripts/test_llm_skills.py skills/gsd/ --detailed
```

## 📊 Migration Process

### Step-by-Step Workflow

1. **Preprocessing**
   - Parse command file (YAML + XML)
   - Extract workflow content
   - Structure data for LLM
   - Create context-aware prompt

2. **LLM Generation**
   - Send structured prompt to Mistral
   - Receive complete SKILL.md content
   - Parse and validate response

3. **Refinement**
   - Validate against specification
   - Generate improvement feedback
   - Iterate up to 3 times
   - Select best result

4. **Post-Processing**
   - Write SKILL.md file
   - Run final validation
   - Generate quality report

5. **Testing**
   - Specification compliance
   - Integration potential
   - Quality scoring
   - Error reporting

## 🎯 Specification Compliance

### Required SKILL.md Structure

```markdown
---
name: skill-name
description: Clear description
license: MIT
metadata:
  author: get-shit-done
  version: 1.0
  category: project-management
  gsd-tools: relevant-tools
allowed-tools: 'Read Write Bash'
---

# Skill Name Skill

## Objective
Clear objective statement

## When to Use
📖 **Usage Guidelines**:
- Specific use case 1
- Specific use case 2

**Do NOT use when:**
- Anti-pattern 1
- Anti-pattern 2

## Process
Detailed step-by-step process

## Output
- Output description
- File references

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Examples
### Example 1: Title
```
Input: example input
Output: example output
```
```

### Path Requirements
- ✅ All workflow references use `~/.vibe/get-shit-done/workflows/`
- ✅ No `.planning/` or `.claude/` references
- ✅ Consistent path formatting

### Content Requirements
- ✅ Complete YAML frontmatter
- ✅ All required sections present
- ✅ Proper markdown formatting
- ✅ No unnecessary TODOs
- ✅ Realistic examples

## 🔬 Quality Metrics

### Validation Scores
- **YAML Frontmatter**: 0-100% (required fields, syntax)
- **Structure**: 0-100% (required sections, formatting)
- **Content Quality**: 0-100% (completeness, relevance)
- **Compatibility**: 0-100% (Mistral-Vibe readiness)
- **Specification**: 0-100% (agentskills.io compliance)

### Target Metrics
- **TODO Reduction**: 50%+ from current baseline
- **First-Pass Success**: 80%+ validation pass rate
- **Average Quality Score**: 85+
- **Spec Compliance**: 100%

## 🧪 Testing Framework

### Test Categories

1. **YAML Frontmatter Validation**
   - Required fields presence
   - Proper YAML syntax
   - Metadata structure

2. **Content Structure**
   - Required sections
   - Markdown formatting
   - Logical flow

3. **Specification Compliance**
   - agentskills.io requirements
   - Section completeness
   - Formatting standards

4. **Compatibility Testing**
   - Mistral-Vibe readiness
   - Tool compatibility
   - Path consistency

5. **Quality Assessment**
   - Example realism
   - Documentation completeness
   - Error handling coverage

## 🛠️ Implementation Notes

### LLM Integration

```python
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

def call_llm(system_prompt: str, user_prompt: str, **kwargs):
    """Call Mistral API with proper error handling"""
    client = MistralClient(api_key=os.getenv('MISTRAL_API_KEY'))
    
    messages = [
        ChatMessage(role="system", content=system_prompt),
        ChatMessage(role="user", content=user_prompt)
    ]
    
    response = client.chat(
        model=kwargs.get('model', 'mistral-large-latest'),
        messages=messages,
        temperature=kwargs.get('temperature', 0.3)
    )
    
    return response.choices[0].message.content
```

### Error Handling

```python
try:
    # LLM migration attempt
    result = llm_migrate_command(command_path)
    if result['score'] < MIN_ACCEPTABLE_SCORE:
        raise MigrationQualityError(f"Quality score too low: {result['score']}")
except (LLMError, MigrationQualityError) as e:
    logger.warning(f"LLM migration failed: {e}")
    if FALLBACK_TO_PYTHON:
        logger.info("Falling back to Python migration")
        result = python_migrate_command(command_path)
    else:
        raise
```

### Performance Optimization

```python
# Cache LLM responses for identical commands
@lru_cache(maxsize=32)
def cached_llm_migration(command_content: str, workflow_content: str) -> str:
    """Cache migration results to avoid duplicate LLM calls"""
    context = {
        'command': command_content,
        'workflow': workflow_content
    }
    return llm_agent.migrate(context)

# Batch processing with progress tracking
def migrate_batch(commands: List[Path], progress_callback=None):
    """Process commands in batches with progress updates"""
    results = []
    for i, command in enumerate(commands):
        result = llm_migrate_command(command)
        results.append(result)
        if progress_callback:
            progress_callback(i + 1, len(commands), result)
    return results
```

## 📈 Migration Comparison

### Python vs LLM Approach

| Aspect | Python Script | LLM Agent |
|--------|---------------|-----------|
| **TODO Reduction** | Baseline (49) | 50%+ reduction |
| **Context Understanding** | Pattern-based | Semantic understanding |
| **Example Generation** | Placeholders | Realistic examples |
| **Spec Compliance** | Manual checking | Automatic compliance |
| **Adaptability** | Fixed patterns | Learns from context |
| **Quality** | Basic structure | Complete documentation |
| **Maintenance** | Regex updates | Prompt refinement |
| **Performance** | Fast | API-dependent |
| **Cost** | Free | API costs |

## 🔮 Future Enhancements

### Short-Term
1. **Hybrid Mode**: Combine Python extraction with LLM refinement
2. **Prompt Optimization**: Fine-tune for better results
3. **Local Model Support**: Run with local Mistral models
4. **Batch Processing**: Parallel migration for speed

### Medium-Term
1. **Interactive Mode**: User feedback during generation
2. **Learning System**: Improve based on corrections
3. **Workflow Integration**: Update workflow files too
4. **Multi-Agent**: Specialized agents for sections

### Long-Term
1. **Automatic Testing**: Generate test cases
2. **CI/CD Integration**: Automated migration pipeline
3. **Quality Dashboard**: Visual metrics
4. **Community Feedback**: Crowdsource improvements

## 🛡️ Safety & Reliability

### Fallback Mechanisms
- Automatic fallback to Python method on failure
- Quality threshold for LLM acceptance
- Manual override capability
- Comprehensive error logging

### Validation Layers
- Pre-generation input validation
- Post-generation specification testing
- Iterative refinement loop
- Final quality scoring

### Monitoring
- Performance metrics tracking
- Quality trend analysis
- Error rate monitoring
- User feedback collection

## 📚 Examples

### Basic Migration

```bash
# Migrate research-phase command
python3 scripts/llm_migrate_command_to_skill.py commands/gsd/research-phase.md

# Check results
cat skills/gsd/research-phase/SKILL.md

# Validate
python3 scripts/test_llm_skills.py skills/gsd/research-phase/
```

### Batch Migration with Analysis

```bash
# Create test directory
mkdir -p skills/gsd/llm-test

# Migrate multiple commands
python3 scripts/llm_migrate_command_to_skill.py \
    commands/gsd/research-phase.md \
    commands/gsd/debug.md \
    commands/gsd/execute-phase.md \
    --output skills/gsd/llm-test/

# Compare with Python method
python3 scripts/llm_migrate_command_to_skill.py --method python \
    commands/gsd/research-phase.md \
    --output skills/gsd/python-test/

# Analyze differences
python3 scripts/test_llm_skills.py skills/gsd/llm-test/ --compare skills/gsd/python-test/
```

### Continuous Integration

```yaml
# Example GitHub Actions workflow
name: LLM Migration CI

on: [push, pull_request]

jobs:
  migrate-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: pip install -r requirements.txt
    
    - name: Run LLM Migration
      env:
        MISTRAL_API_KEY: ${{ secrets.MISTRAL_API_KEY }}
      run: python3 scripts/llm_migrate_command_to_skill.py commands/gsd/ skills/gsd/
    
    - name: Test Generated Skills
      run: python3 scripts/test_llm_skills.py skills/gsd/ --min-score 80
    
    - name: Run Original Tests
      run: python3 scripts/test_skill_functionality.py skills/gsd/
```

## 🎓 Best Practices

### Migration Strategy
1. **Start Small**: Test with 2-3 commands first
2. **Review Quality**: Check generated skills manually
3. **Monitor Performance**: Track quality scores
4. **Fallback Ready**: Keep Python method available
5. **Iterate**: Refine prompts based on results

### Prompt Engineering
1. **Be Specific**: Clear requirements in system prompt
2. **Provide Examples**: Show desired output format
3. **Context Matters**: Include all relevant information
4. **Iterate**: Refine based on validation feedback
5. **Temperature**: Use lower (0.1-0.3) for consistency

### Quality Assurance
1. **Validate Everything**: Run full test suite
2. **Check Examples**: Ensure realism and relevance
3. **Test Paths**: Verify workflow references
4. **Review TODOs**: Minimize remaining placeholders
5. **Manual Spot Checks**: Random sampling

## 📋 Migration Checklist

- [ ] Configure `.env` with Mistral API key
- [ ] Test single command migration
- [ ] Review generated skill quality
- [ ] Run validation tests
- [ ] Compare with Python method
- [ ] Set up fallback mechanism
- [ ] Configure quality thresholds
- [ ] Implement monitoring
- [ ] Document results
- [ ] Plan rollout strategy

## 🔗 Integration with Existing System

The LLM migration system is designed to work alongside the existing Python-based approach:

```bash
# Use LLM for new migrations
python3 scripts/llm_migrate_command_to_skill.py commands/gsd/new-command.md

# Use Python for maintenance
python3 scripts/migrate_command_to_skill.py commands/gsd/legacy-command.md

# Test both approaches
python3 scripts/test_llm_skills.py skills/gsd/
python3 scripts/test_skill_functionality.py skills/gsd/
```

## 🛠️ Troubleshooting

### Common Issues

**LLM API Errors**
- Check `.env` configuration
- Verify API key validity
- Monitor rate limits
- Fallback to Python method

**Quality Issues**
- Review system prompt clarity
- Check input data completeness
- Adjust temperature settings
- Add more context to prompts

**Validation Failures**
- Check specification compliance
- Review error messages
- Manual correction if needed
- Update prompts to prevent recurrence

**Performance Issues**
- Monitor API response times
- Implement caching
- Consider batch processing
- Review token usage

## 📊 Metrics & Reporting

### Key Metrics to Track

```json
{
  "migration": {
    "total_commands": 30,
    "llm_success": 25,
    "llm_partial": 3,
    "llm_failed": 2,
    "fallback_to_python": 1,
    "avg_quality_score": 87.5,
    "avg_todos_per_skill": 1.2,
    "migration_time_avg": "4.2s"
  },
  "quality": {
    "yaml_frontmatter": 98,
    "structure": 95,
    "content": 88,
    "compatibility": 92,
    "specification": 97
  },
  "improvement": {
    "todo_reduction": 57,
    "quality_increase": 22,
    "spec_compliance": 100
  }
}
```

### Reporting Template

```markdown
# LLM Migration Report - [Date]

## Summary
- **Commands Processed**: X
- **Success Rate**: Y%
- **Average Quality Score**: Z
- **TODO Reduction**: W%

## Quality Metrics
| Metric | Score | Change |
|--------|-------|--------|
| YAML Frontmatter | 98% | +5% |
| Structure | 95% | +8% |
| Content Quality | 88% | +15% |
| Compatibility | 92% | +3% |
| Specification | 97% | +10% |

## Issues Encountered
- [Issue 1]: Description + Resolution
- [Issue 2]: Description + Resolution

## Recommendations
- [Recommendation 1]
- [Recommendation 2]

## Next Steps
- [Action 1]
- [Action 2]
```

## 🎯 Conclusion

The LLM-Agent based migration system represents a significant advancement over the pattern-based approach, offering:
- **Higher quality** skills with complete documentation
- **Reduced manual effort** through intelligent generation
- **Better compliance** with specification requirements
- **Adaptive learning** for diverse command structures
- **Future-proof** architecture for continuous improvement

By leveraging the strengths of large language models while maintaining robust validation and fallback mechanisms, this system provides the best of both worlds: AI-powered intelligence with engineering reliability.