# @anti-brainrot-society/shared

Shared TypeScript types, constants, and schemas for the SapSap ecosystem.

## Installation

```bash
# Configure npm to access GitHub Packages
echo "@anti-brainrot-society:registry=https://npm.pkg.github.com" >> .npmrc

# Install the package
pnpm add @anti-brainrot-society/shared
```

Requires `NPM_TOKEN` environment variable with a GitHub Personal Access Token that has `read:packages` scope.

## Usage

```typescript
// Import types
import { User, Story, Beat } from '@anti-brainrot-society/shared/types';

// Import constants
import { SUPPORTED_LANGUAGES, CEFR_LEVELS } from '@anti-brainrot-society/shared/constants';

// Import Zod schemas for validation
import { userSchema, storySchema } from '@anti-brainrot-society/shared/schemas';
```

## Package Structure

```
@anti-brainrot-society/shared
├── types/          # TypeScript interfaces and types
│   ├── api.ts      # API request/response types
│   ├── user.ts     # User-related types
│   ├── story.ts    # Story and beat types
│   └── ...
├── constants/      # Shared constants and enums
│   ├── languages.ts
│   ├── featureFlags.ts
│   └── ...
├── schemas/        # Zod validation schemas
│   ├── user.ts
│   └── ...
└── lib/            # Shared utility functions
```

## Exports

| Path | Description |
|------|-------------|
| `@.../shared` | Main entry point |
| `@.../shared/types` | All TypeScript types |
| `@.../shared/types/*` | Individual type modules |
| `@.../shared/constants` | All constants |
| `@.../shared/constants/*` | Individual constant modules |
| `@.../shared/schemas/*` | Zod schemas |
| `@.../shared/lib/*` | Utility functions |

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Type check
pnpm type-check
```

## Publishing

Package is automatically published to GitHub Packages when changes are pushed to `main`. See `.github/workflows/publish.yml`.

To publish manually:

```bash
# Build first
pnpm build

# Publish (requires npm login to GitHub Packages)
npm publish
```

## System Architecture

For the complete system architecture including database topology, deployment strategy, and cross-repo dependencies, see:

**[ARCHITECTURE.md](./ARCHITECTURE.md)**

## Consumers

- [sap-sap-mobile](https://github.com/Anti-Brainrot-Society/sap-sap-mobile) - Mobile app
- [sap-sap-app](https://github.com/Anti-Brainrot-Society/sap-sap-app) - Server API
- [sap-sap-admin](https://github.com/Anti-Brainrot-Society/sap-sap-admin) - Admin dashboard
- [sap-sap-teacher](https://github.com/Anti-Brainrot-Society/sap-sap-teacher) - Teacher portal
