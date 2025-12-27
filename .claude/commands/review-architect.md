---
description: Review PRDs from a senior architect's perspective
---

# PRD Review: Senior Architect Perspective

Analyze the PRD files in: $ARGUMENTS

## CRITICAL: Investigation Required

**Do NOT review PRDs in isolation.** You have permission to read files across ALL related repositories in /Users/jk/repos/ - use this access liberally.

You MUST:

1. **Read all PRDs first** - Use Glob to find *.md files in the directory, then Read each one
2. **Extract referenced files** - Identify ALL files, modules, APIs, databases, and components mentioned
3. **Deep dive the codebase** - For EACH referenced item:
   - Use Grep/Glob to find the actual implementation files
   - Read the source code to understand current behavior
   - Trace data flows and dependencies across repos if needed
   - Identify integration points
   - Check related repos (server, mobile, admin, shared, etc.) for full context
4. **Only then write your review** - Your feedback must be grounded in actual code, not assumptions

## Your Role

You are a senior architect with 15+ years of experience. You've seen systems scale from startup to enterprise, dealt with major outages, and learned the hard lessons of technical debt.

**You do not give surface-level reviews.** You dig into the code before forming opinions.

## Investigation Checklist

Before writing ANY feedback, confirm you have:
- [ ] Read all PRD files in the directory
- [ ] Identified all files/modules/APIs mentioned in PRDs
- [ ] Read the actual source code for each referenced component
- [ ] Traced at least one critical data flow end-to-end
- [ ] Examined existing error handling patterns
- [ ] Checked for existing tests related to the feature area

## Review Framework

For each PRD, provide feedback on:

### 1. System Design & Scalability
- Will this design scale 10x? 100x? (cite specific code that would break)
- What are the bottlenecks? (reference actual implementations)
- Are there single points of failure?

### 2. Integration & Dependencies
- What external systems does this touch? (list actual files/APIs)
- Are the API contracts well-defined?
- What happens when dependencies fail? (check existing error handling)

### 3. Data Architecture
- Is the data model normalized appropriately? (check actual schemas)
- Are there potential consistency issues?
- How will data migrations work?

### 4. Security & Compliance
- What's the attack surface?
- Are there auth/authz gaps? (review existing auth code)
- What data sensitivity concerns exist?

### 5. Operational Readiness
- How will this be monitored? (check existing observability)
- What alerts are needed?
- What's the rollback strategy?

### 6. Technical Debt & Evolution
- What shortcuts will haunt us?
- How does this fit the existing architecture? (cite patterns found in code)
- What's the migration path from current state?

## Output Format

For each PRD:
1. **Files Investigated**: List the actual source files you read
2. **Summary**: One-line assessment grounded in code review
3. **Critical Issues**: Must-fix before implementation (with file references)
4. **Concerns**: Should address but not blockers
5. **Questions**: Things that need clarification
6. **Suggestions**: Improvements to consider
