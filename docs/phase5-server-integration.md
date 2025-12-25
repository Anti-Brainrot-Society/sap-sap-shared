# Phase 5: Server Strict Mode Integration

## Overview

This document outlines how to integrate the LLM output validation layer into the server's story import route once the shared package is published.

## Current State

- **Server location**: `sap-sap-server/apps/server/app/api/admin/import/story/route.ts`
- **Current shared version**: `@anti-brainrot-society/shared@^1.0.0`
- **Required version**: `@anti-brainrot-society/shared@^1.5.0`

## Implementation Steps

### 1. Update Shared Package Dependency

```bash
cd apps/server
pnpm update @anti-brainrot-society/shared@^1.5.0
```

### 2. Import Validation Functions

```typescript
import {
  validateLLMStoryOutput,
  type ValidationResult,
  type NormalizedStoryOutput,
} from '@anti-brainrot-society/shared/schemas/llmOutput';
```

### 3. Add Pre-Validation Step

Add before the existing `ImportSchema.safeParse(body)`:

```typescript
// Pre-validate raw LLM output and get transformation warnings
const validation = validateLLMStoryOutput(body);
if (!validation.success) {
  return withDbTargetHeader(req, NextResponse.json({
    error: 'LLM output validation failed',
    errors: validation.errors,
    warnings: validation.warnings,
  }, { status: 400 }));
}

// Log warnings for debugging
if (validation.warnings.length > 0) {
  console.log('[import/story] Validation warnings:', validation.warnings);
}
```

### 4. Feature Flag for Strict Mode

Add a feature flag to control strict validation:

```typescript
const STRICT_VALIDATION = process.env.STORY_IMPORT_STRICT_MODE === 'true';

if (STRICT_VALIDATION && validation.warnings.length > 0) {
  return withDbTargetHeader(req, NextResponse.json({
    error: 'Strict validation failed',
    warnings: validation.warnings,
    hint: 'Set STORY_IMPORT_STRICT_MODE=false to allow with warnings',
  }, { status: 400 }));
}
```

### 5. Return Warnings in Response

Update the success response to include warnings:

```typescript
return withDbTargetHeader(req, jsonOk({
  dryRun: false,
  summary: summary,
  result,
  warnings: validation.warnings, // Include transformation warnings
}));
```

## Benefits

1. **Consistent field mappings**: Uses same FIELD_MAPPINGS as admin
2. **Early detection**: Catches malformed LLM output before import
3. **Gradual rollout**: Feature flag allows testing without breaking existing flows
4. **Detailed diagnostics**: Warnings help identify LLM prompt issues

## Migration Plan

1. **Week 1**: Deploy with `STORY_IMPORT_STRICT_MODE=false` (warnings only, logged)
2. **Week 2**: Review logged warnings, fix common LLM prompt issues
3. **Week 3**: Enable strict mode on staging
4. **Week 4**: Enable strict mode on production

## Rollback

If issues arise, set `STORY_IMPORT_STRICT_MODE=false` to disable strict validation while keeping warning logging.
