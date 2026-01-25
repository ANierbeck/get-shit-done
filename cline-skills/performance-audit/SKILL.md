---
name: performance-audit
description: Conduct performance analysis to identify bottlenecks, measure metrics, and provide optimization recommendations. Use this skill when you need to analyze application performance, establish baselines, or optimize critical code paths.
---

# Performance Audit Skill

Comprehensive performance analysis skill that identifies bottlenecks and provides optimization recommendations.

## Steps

1. **Initialize Audit Environment**
   - Check project state and GSD initialization
   - Detect application type and technology stack
   - Create performance audit workspace in `.planning/performance-audits/`

2. **Capture Baseline Metrics**
   - Record system information (CPU, memory, OS)
   - Capture application-specific metrics
   - Establish performance baseline for comparison

3. **Analyze Code Complexity**
   - Run cyclomatic complexity analysis
   - Identify large, complex functions
   - Detect nested loop patterns
   - Calculate maintainability indices

4. **Detect Performance Patterns**
   - Find N+1 query patterns
   - Identify memory-intensive operations
   - Locate blocking I/O operations
   - Detect inefficient algorithms

5. **Analyze Dependency Impact**
   - Evaluate heavy dependencies
   - Check bundle size and load times
   - Assess third-party library performance
   - Identify redundant dependencies

6. **Generate Performance Report**
   - Create structured performance report
   - Categorize findings by impact (Critical, High, Medium, Low)
   - Provide optimization recommendations
   - Include baseline metrics and comparisons

7. **Present Results to User**
   - Show performance summary
   - Highlight critical bottlenecks
   - Offer optimization options
   - Wait for user decision on next steps

8. **Create Optimization Plan (Optional)**
   - If requested, generate GSD-compatible optimization plan
   - Convert findings to actionable tasks
   - Include before/after metrics targets
   - Follow GSD task structure with verification criteria

9. **Update Project State**
   - Record audit results in `.planning/STATE.md`
   - Commit all audit artifacts to git
   - Update performance tracking

## Integration with GSD

This skill integrates with Get Shit Done:

- **State Management**: Updates `.planning/STATE.md` with audit results
- **Context Engineering**: References GSD principles for consistent workflow
- **Task Creation**: Generates GSD plans for performance optimizations
- **Progress Tracking**: Maintains performance history over time

## Advanced Usage

For advanced performance analysis techniques, see [advanced.md](docs/advanced.md).

## Requirements

- Get Shit Done initialized (`/gsd:new-project`)
- Performance analysis tools (Lizard, WebPageTest, etc.)
- Running application for live metrics (optional)

## Output

- `.planning/performance-audits/[AUDIT_ID]/report.md` - Performance audit report
- `.planning/performance-audits/[AUDIT_ID]/*` - Analysis artifacts
- Updated `.planning/STATE.md` with audit summary
- Optional GSD optimization plan

## Performance Metrics Tracked

- **Code Metrics**: Complexity, function size, nesting depth
- **System Metrics**: CPU usage, memory consumption, I/O operations
- **Application Metrics**: Response times, throughput, error rates
- **Dependency Metrics**: Bundle size, load time, memory impact