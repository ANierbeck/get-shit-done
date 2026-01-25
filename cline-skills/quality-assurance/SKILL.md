---
name: quality-assurance
description: Manage quality assurance processes including testing, verification, and issue tracking. Use this skill when you need to verify work, track issues, or manage todos and quality concerns.
---

# Quality Assurance Skill

Comprehensive quality assurance and verification workflow.

## Steps

1. **Work Verification**
   - Verify completed phases and plans
   - Perform user acceptance testing
   - Document verification results

2. **Issue Management**
   - Track and prioritize issues
   - Identify resolved and urgent issues
   - Manage issue lifecycle

3. **Todo Management**
   - Capture and organize todos
   - Track pending work items
   - Manage todo completion

4. **Quality Metrics**
   - Track test coverage
   - Monitor issue resolution rates
   - Document quality improvements

## Sub-Skills

### Verification
- `/gsd:verify-work` - Verify completed work
- `/gsd:plan-fix` - Plan fixes for issues

### Issue Management
- `/gsd:consider-issues` - Review and prioritize issues
- `/gsd:add-todo` - Capture new todos
- `/gsd:check-todos` - Review pending todos

### Quality Tracking
- Track verification results
- Monitor issue resolution
- Document quality improvements

## Integration with GSD

This skill integrates with GSD's quality assurance workflow:

- **Verification**: Uses GSD's verification patterns
- **Issue Tracking**: Maintains `.planning/ISSUES.md`
- **Todo Management**: Manages `.planning/todos/`
- **State Updates**: Records quality metrics in state

## Advanced Usage

### Custom Verification

Create custom verification scripts:

```bash
# Custom verification script
node verify-feature.js > VERIFICATION.md
```

### Automated Testing

Integrate with testing frameworks:

```bash
# Run tests and record results
npm test > TEST_RESULTS.md
/gsd:verify-work --test-results=TEST_RESULTS.md
```

## Requirements

- Get Shit Done initialized
- Completed work to verify
- Testing frameworks configured

## Output

- `.planning/ISSUES.md` - Issue tracking
- `.planning/todos/` - Todo management
- Verification reports
- Quality metrics