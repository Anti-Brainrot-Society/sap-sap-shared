# SapSap System Architecture

This document describes the overall architecture of the SapSap ecosystem - a language learning platform consisting of multiple interconnected applications.

## Repository Overview

```
Anti-Brainrot-Society/
├── sap-sap-shared     # Shared types, constants, schemas (this repo)
├── sap-sap-mobile     # Expo React Native mobile app
├── sap-sap-server        # Server monorepo (Next.js API)
├── sap-sap-admin      # Admin dashboard (Next.js)
├── sap-sap-teacher    # Teacher portal (Next.js)
├── sap-sap-ai         # AI pipeline and content generation
└── sap-sap-flujos     # Workflow automation
```

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
├──────────────────┬────────────────────┬─────────────────────────────────┤
│   sap-sap-mobile │   sap-sap-admin    │      sap-sap-teacher            │
│   (Expo/RN)      │   (Next.js)        │      (Next.js)                  │
│                  │                    │                                 │
│   - User app     │   - Admin ops      │      - Content review           │
│   - Lessons      │   - Feature flags  │      - Teaching tools           │
│   - Stories      │   - User mgmt      │      - Analytics                │
│   - Chat         │   - Analytics      │                                 │
└────────┬─────────┴────────┬───────────┴──────────────┬──────────────────┘
         │                  │                          │
         │    HTTPS/REST    │       Prisma DB Pull     │
         │                  │       (introspection)    │
         ▼                  ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         sap-sap-server/apps/server                          │
│                         (Next.js API Routes)                             │
├─────────────────────────────────────────────────────────────────────────┤
│  /api/auth/*       - Authentication (better-auth)                       │
│  /api/stories/*    - Story content and beats                            │
│  /api/lessons/*    - Lesson management                                  │
│  /api/users/*      - User profiles and progress                         │
│  /api/chat/*       - Conversation AI                                    │
│  /api/admin/*      - Admin-only endpoints                               │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    Prisma ORM   │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Neon PostgreSQL                                  │
│                                                                          │
│  ┌─────────────────────────────────────────────────┐  ┌──────────────┐  │
│  │         SHARED DATABASES                        │  │   SEPARATE   │  │
│  │  ┌─────────────────┐  ┌─────────────────┐       │  │              │  │
│  │  │  App Database   │  │  CMS Database   │       │  │Admin Database│  │
│  │  │ APP_DATABASE_URL│  │ CMS_DATABASE_URL│       │  │ADMIN_DB_URL  │  │
│  │  │                 │  │                 │       │  │              │  │
│  │  │ - Users         │  │ - Stories       │       │  │ - Campaigns  │  │
│  │  │ - Auth/Sessions │  │ - Beats         │       │  │ - Releases   │  │
│  │  │ - Progress      │  │ - Lessons       │       │  │ - Admin ops  │  │
│  │  │ - Paywall       │  │ - Characters    │       │  │              │  │
│  │  └─────────────────┘  └─────────────────┘       │  └──────────────┘  │
│  │  Used by: app, teacher, admin (auth)            │  Used by: admin    │
│  └─────────────────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────────────┘
```

## Package Dependencies

```
@anti-brainrot-society/shared (GitHub Packages)
        │
        ├── sap-sap-mobile (pnpm add)
        │   └── Types for API responses, feature flags, constants
        │
        ├── sap-sap-server (workspace:* → npm package)
        │   └── Shared types and validation schemas
        │
        ├── sap-sap-admin (pnpm add)
        │   └── Admin-specific types and constants
        │
        └── sap-sap-teacher (pnpm add)
            └── Teacher-specific types and constants
```

## Data Flow

### User Journey (Mobile App)

1. **Authentication**: Mobile → Server `/api/auth/*` → Database
2. **Content Fetch**: Mobile → Server `/api/stories/*` → CMS Database
3. **Progress Sync**: Mobile → Server `/api/users/progress` → App Database
4. **AI Chat**: Mobile → Server `/api/chat/*` → LLM Provider → Response

### Admin Operations

1. **Feature Flags**: Admin → Server `/api/admin/feature-flags` → Database
2. **User Management**: Admin → Server `/api/admin/users` → App Database
3. **Content Management**: Admin → CMS Database (via Prisma Studio)

### Teacher Portal

1. **Content Review**: Teacher → CMS Database (introspection via Prisma)
2. **Analytics**: Teacher → App Database (read-only queries)

## Environment Configuration

### Database URLs

| Repository | APP_DATABASE_URL | CMS_DATABASE_URL | ADMIN_DATABASE_URL |
|------------|------------------|------------------|-------------------|
| sap-sap-server | ✅ Owns | ✅ Owns | - |
| sap-sap-teacher | ✅ Needs (auth) | ✅ Has | - |
| sap-sap-admin | ✅ Needs (session) | ✅ Needs (content) | ✅ Owns |

**Note**: APP and CMS databases are shared across repos. Admin's database is separate.

### API URLs

| Client | Staging | Production |
|--------|---------|------------|
| Mobile | `EXPO_PUBLIC_API_URL_STAGING` | `EXPO_PUBLIC_API_URL_PROD` |
| Admin | Vercel preview | Vercel production |
| Teacher | Vercel preview | Vercel production |

## Deployment

### Mobile (EAS Build)

- **Platform**: Expo Application Services
- **Distribution**: Play Store (Android), TestFlight/App Store (iOS)
- **Profiles**: `preview` (internal testing), `production` (store release)

### Server (Vercel)

- **Platform**: Vercel
- **Branches**: `dev` → staging, `main` → production
- **Database Migrations**: GitHub Actions workflow

### Web Apps (Vercel)

- Admin and Teacher portals deployed separately on Vercel
- Each has its own preview and production environments

## Shared Package

The `@anti-brainrot-society/shared` package provides:

| Export | Purpose |
|--------|---------|
| `types/` | TypeScript interfaces for API contracts |
| `constants/` | Shared enums, feature flags, language codes |
| `schemas/` | Zod validation schemas |
| `lib/` | Shared utility functions |

### Publishing

Automatic publishing on push to `main` via GitHub Actions.

### Consuming

```bash
# In any consuming repo
echo "@anti-brainrot-society:registry=https://npm.pkg.github.com" >> .npmrc
pnpm add @anti-brainrot-society/shared
```

## Security

- **Authentication**: better-auth with session management
- **API Authorization**: Role-based access control
- **Database**: Row-level security policies
- **Secrets**: GitHub Secrets and Vercel Environment Variables
- **Mobile Signing**: EAS managed credentials

## Monitoring

- **Errors**: Sentry (when configured)
- **Analytics**: Mixpanel (mobile), Vercel Analytics (web)
- **Push**: OneSignal (mobile notifications)

---

**Last Updated**: December 2024

**Related Repositories**:
- [sap-sap-mobile](https://github.com/Anti-Brainrot-Society/sap-sap-mobile)
- [sap-sap-server](https://github.com/Anti-Brainrot-Society/sap-sap-server)
- [sap-sap-admin](https://github.com/Anti-Brainrot-Society/sap-sap-admin)
- [sap-sap-teacher](https://github.com/Anti-Brainrot-Society/sap-sap-teacher)
