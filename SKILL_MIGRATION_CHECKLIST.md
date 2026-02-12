# Skill Migration Checklist

## 📋 Complete Migration Requirements

Each skill must have these elements to be considered "fully migrated":

### ✅ Frontmatter Requirements
- [ ] `name`: Correct skill name (lowercase alphanumeric + hyphens)
- [ ] `description`: Clear description with usage context (1-1024 chars)
- [ ] `license`: Proper license specification (MIT)
- [ ] `metadata`: Author, version, category
- [ ] `allowed-tools`: Complete list of required tools

### ✅ Content Requirements

#### Objective Section
- [ ] Clear statement of what the skill accomplishes
- [ ] Purpose and scope defined
- [ ] Expected outcomes specified

#### When to Use Section
- [ ] Appropriate use cases listed
- [ ] When NOT to use the skill
- [ ] Decision criteria for usage

#### Process Section
- [ ] Step-by-step execution process
- [ ] All bash commands preserved
- [ ] Logic flow clearly documented
- [ ] Error handling within process
- [ ] User interaction points specified

#### Success Criteria Section
- [ ] Clear completion conditions
- [ ] Verifiable outcomes
- [ ] Quality standards defined

#### Anti-Patterns Section
- [ ] When NOT to use the skill
- [ ] Common misuse scenarios
- [ ] Boundaries and limitations

#### Output Section
- [ ] Files created/modified
- [ ] Data produced
- [ ] Side effects documented

#### Examples Section
- [ ] 2-3 concrete usage examples
- [ ] Input → Output mappings
- [ ] Real-world scenarios

#### Error Handling Section
- [ ] Common error scenarios
- [ ] Recovery procedures
- [ ] User guidance for issues

### ✅ Quality Standards

#### Completeness
- [ ] All command content preserved
- [ ] No information lost from original
- [ ] All bash scripts included
- [ ] All logic flows documented

#### Accuracy
- [ ] Commands work as documented
- [ ] No broken references
- [ ] Consistent with original command

#### Readability
- [ ] Clear section headers
- [ ] Proper markdown formatting
- [ ] Consistent style
- [ ] Good code formatting

#### Testability
- [ ] Success criteria are verifiable
- [ ] Examples can be tested
- [ ] Error cases covered

## 🎯 Migration Priority Levels

### Priority 1 (Critical - Core Workflow)
- `new-project` - Project initialization
- `execute-phase` - Phase execution
- `plan-phase` - Phase planning
- `map-codebase` - Codebase analysis
- `add-phase` - Roadmap management
- `check-todos` - Task management
- `complete-milestone` - Milestone completion

### Priority 2 (Important - Frequent Use)
- `help` - User assistance
- `progress` - Status checking
- `debug` - Issue resolution
- `verify-work` - Quality assurance
- `research-phase` - Requirements gathering
- `discuss-phase` - Planning discussions
- `pause-work` - Workflow control

### Priority 3 (Nice to Have - Less Critical)
- `join-discord` - Community
- `settings` - Configuration
- `update` - Maintenance
- `set-profile` - Customization
- `quick` - Shortcuts
- `audit-milestone` - Quality checks
- `plan-milestone-gaps` - Gap analysis

## 📊 Migration Tracking

### Current Status (27 total skills)

| Status | Count | Skills |
|--------|-------|--------|
| ✅ Fully Migrated | 1 | `add-todo` |
| 🟡 Partially Migrated | 26 | All others |
| ❌ Not Started | 0 | None |

### Migration Progress

- [x] Establish 1:1 mapping (27/27 skills created)
- [x] Create migration checklist
- [x] Prioritize skills
- [ ] Migrate Priority 1 skills (0/7)
- [ ] Migrate Priority 2 skills (0/7)
- [ ] Migrate Priority 3 skills (0/10)
- [ ] Test all migrated skills
- [ ] Final verification

## 🔧 Migration Process

### For Each Skill:

1. **Review Original Command**
   - Read `commands/gsd/{skill}.md`
   - Understand all functionality
   - Note special requirements

2. **Update SKILL.md**
   - Fill in all checklist items
   - Preserve all bash commands
   - Maintain original logic
   - Add comprehensive examples

3. **Verify Quality**
   - Check against checklist
   - Test if possible
   - Ensure completeness

4. **Commit Changes**
   - Clear commit message
   - Reference original command
   - Note what was improved

### Batch Processing:
- Process 2-3 skills per session
- Focus on one priority level at a time
- Test as you go
- Document any issues

## 🎯 Success Criteria

Migration is complete when:
- All 27 skills meet checklist requirements
- All bash commands preserved and tested
- All examples are realistic and testable
- No information lost from original commands
- All skills can be used independently
