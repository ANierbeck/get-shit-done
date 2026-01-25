---
name: code-review
description: Perform comprehensive code review with automated analysis, quality metrics, and actionable recommendations. Use this skill when you need to analyze code quality, identify security vulnerabilities, detect performance issues, or generate improvement plans.
---

# Code Review Skill

Comprehensive code review skill that performs automated analysis and provides actionable recommendations following GSD principles.

## Steps

1. **Initialize Review Environment**
   - Check project state and ensure GSD is initialized
   - Detect codebase language and framework
   - Create review workspace in `.planning/code-reviews/`

2. **Determine Review Scope**
   - Ask user for review scope: entire codebase, specific files, recent changes, or focused area
   - Set appropriate scope parameters

3. **Run Automated Analysis**
   - Execute language-specific linters (ESLint, Pylint, etc.)
   - Run complexity analysis with Lizard
   - Perform duplicate code detection
   - Conduct security vulnerability scanning

4. **Calculate Quality Metrics**
   - Count files and lines of code
   - Calculate cyclomatic complexity averages
   - Determine test coverage if available
   - Generate quality metrics report

5. **Analyze Code Patterns**
   - Identify positive patterns (good practices)
   - Flag negative patterns (anti-patterns)
   - Document architectural observations

6. **Perform Security Analysis**
   - Scan for common security vulnerabilities
   - Check for hardcoded secrets
   - Identify potential injection attacks
   - Document security findings

7. **Generate Comprehensive Report**
   - Create structured report using template
   - Categorize findings by severity (Critical, High, Medium, Low)
   - Provide actionable recommendations
   - Include raw analysis data in appendix

8. **Present Results to User**
   - Show summary of findings
   - Offer options: view full report, focus on critical issues, create fix plan
   - Wait for user decision on next steps

9. **Create Fix Plan (Optional)**
   - If requested, generate GSD-compatible execution plan
   - Convert findings to actionable tasks
   - Include verification criteria for each fix
   - Follow GSD task structure and conventions

10. **Update Project State**
    - Record review results in `.planning/STATE.md`
    - Commit all review artifacts to git
    - Update progress tracking

## Integration with GSD

This skill integrates seamlessly with the Get Shit Done workflow:

- **State Management**: Updates `.planning/STATE.md` with review results
- **Context Engineering**: References GSD principles and workflows
- **Task Creation**: Generates GSD-compatible plans from findings
- **Git Integration**: Follows GSD git commit conventions

## Advanced Usage

For advanced configuration and customization options, see [advanced.md](docs/advanced.md).

## Requirements

- Get Shit Done must be initialized (`/gsd:new-project`)
- Appropriate analysis tools should be installed (ESLint, Pylint, Lizard, etc.)
- Git repository must be available

## Output

- `.planning/code-reviews/[REVIEW_ID]/report.md` - Comprehensive review report
- `.planning/code-reviews/[REVIEW_ID]/*` - Raw analysis artifacts
- Updated `.planning/STATE.md` with review summary
- Optional GSD fix plan for critical issues