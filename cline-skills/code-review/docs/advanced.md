# Advanced Code Review Configuration

## Custom Analysis Tools

### Adding Custom Linters

To add custom linters or analysis tools:

1. **Install the tool** in your project:
   ```bash
   npm install -D custom-linter
   # or
   pip install custom-linter
   ```

2. **Configure the tool** with appropriate rules:
   ```json
   {
     "rules": {
       "custom-rule": "error",
       "another-rule": "warn"
     }
   }
   ```

3. **Update the skill** to use the new tool by modifying the analysis step.

### Custom Severity Mapping

Override default severity mappings by creating a `.code-review-config.json`:

```json
{
  "severity": {
    "eslint": {
      "error": "critical",
      "warning": "high"
    },
    "pylint": {
      "F": "critical",
      "E": "high",
      "W": "medium",
      "C": "low",
      "R": "low"
    }
  },
  "ignorePatterns": [
    "**/test/**",
    "**/migrations/**",
    "**/vendor/**"
  ]
}
```

## Performance Optimization

### Large Codebases

For large codebases, optimize performance with:

```bash
# Analyze only changed files
git diff --name-only HEAD~10 | xargs eslint

# Parallel analysis
find src -name "*.js" | xargs -P 4 -I {} eslint {}
```

### Incremental Analysis

Enable incremental analysis by maintaining a baseline:

```bash
# Create baseline
eslint . --cache

# Subsequent runs use cache
eslint . --cache --cache-location .eslintcache
```

## Custom Report Templates

Create custom report templates in `.planning/code-review-templates/`:

```markdown
# Custom Report Template

## [[PROJECT_NAME]] Code Review

**Date:** [[DATE]]
**Review ID:** [[REVIEW_ID]]
**Scope:** [[SCOPE]]

### Executive Summary
[[EXECUTIVE_SUMMARY]]

### Detailed Findings
[[DETAILED_FINDINGS]]
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Code Review
        run: |
          # Initialize GSD if needed
          npx get-shit-done-cc --local
          # Run code review skill
          # (This would be triggered by Cline in actual usage)
      - name: Upload Report
        uses: actions/upload-artifact@v2
        with:
          name: code-review-report
          path: .planning/code-reviews/*
```

### GitLab CI Example

```yaml
code_review:
  stage: test
  script:
    - npx get-shit-done-cc --local
    # Cline would trigger the skill here
  artifacts:
    paths:
      - .planning/code-reviews/
    expire_in: 1 week
```

## Security Analysis Customization

### Custom Security Rules

Add custom security patterns in `.code-review-security.json`:

```json
{
  "patterns": {
    "hardcodedSecrets": [
      "api[_-]?key[_-]?=.*['\"]",
      "secret[_-]?=.*['\"]",
      "password[_-]?=.*['\"]"
    ],
    "sqlInjection": [
      ".*\\+.*req\\.(body|query|params).",
      "execute\\(.*\\+.*\\)"
    ],
    "xssVulnerabilities": [
      "innerHTML[_-]?=",
      "document\\.write\\(.*\\)"
    ]
  }
}
```

## Advanced Pattern Analysis

### Architectural Pattern Detection

Configure architectural pattern detection:

```json
{
  "patterns": {
    "positive": {
      "dependencyInjection": "class.*constructor\\(.*Service.*\\)",
      "repositoryPattern": "class.*Repository",
      "factoryPattern": "create.*Factory"
    },
    "negative": {
      "godClass": "class.*{200,}.*method",
      "spaghettiCode": "if.*{.*if.*{.*if",
      "copyPaste": "function.*{.*function.*same.*name"
    }
  }
}
```

## Troubleshooting

### Common Issues

**Analysis tools not found:**
- Ensure tools are installed: `npm install -g eslint lizard`
- Check PATH environment variable
- Verify tool versions are compatible

**Performance issues:**
- Reduce scope to specific directories
- Use caching where possible
- Increase system resources

**False positives:**
- Adjust linter rules
- Add exceptions for specific patterns
- Improve pattern matching

### Debugging

Enable debug mode by setting environment variable:
```bash
export CODE_REVIEW_DEBUG=1
```

Debug logs will be written to `.planning/code-reviews/debug.log`.

## Best Practices

1. **Run regularly**: Schedule weekly or bi-weekly reviews
2. **Focus on trends**: Track metrics over time
3. **Prioritize critical**: Address security issues immediately
4. **Automate what you can**: Use CI/CD integration
5. **Document decisions**: Keep records of why certain issues were deferred
6. **Review the reviews**: Periodically assess the effectiveness of your review process