# NESR AI Verse (aiverse.nesr.com)

Standalone learning site for **NESR AI Verse** - beginner AI courses
with a short quiz after every part.

- **Business track** - What AI Actually Is · AI in the Workplace · Risk, Ethics & Getting Started
- **Technical track** - How Models Actually Work · Working With Models · Deployment, Evaluation & Safety

Extracted from the SC Agents platform into its own Next.js app so it can ship on its
own domain. It is fully static - no database and no server actions. Per-user quiz
progress is kept in the browser via `localStorage`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react.

## Routes

| Path            | Page                                            |
| --------------- | ----------------------------------------------- |
| `/`             | Landing - both tracks, progress, module list    |
| `/:moduleId`    | A single part: lesson content + quiz (`business-1` … `technical-3`) |

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build & deploy

```bash
npm run build
npm run start
```

All content lives in [`src/app/content.ts`](src/app/content.ts) - edit tracks,
modules, lesson blocks, and quiz questions there.

## Authentication

The whole site is gated by NextAuth (middleware redirects unauthenticated
visitors to `/login`). Two sign-in methods:

1. **Microsoft Entra ID (SSO)** - OIDC via NextAuth's Azure AD provider. It
   turns on automatically once `AZURE_AD_CLIENT_ID` / `AZURE_AD_TENANT_ID`
   (and `AZURE_AD_CLIENT_SECRET`) are set - no code change needed. Redirect URI
   to register in Entra: `https://aiverse.nesr.com/api/auth/callback/azure-ad`.
2. **Shared username / password** - an interim + break-glass login via the
   Credentials provider (`LEARNAI_USER` / `LEARNAI_PASS`), used until SSO is live.

Required env vars are documented in [`.env.example`](.env.example). `NEXTAUTH_SECRET`
and `NEXTAUTH_URL` are required in every environment.

## Notes

- The module pages are pre-rendered via `generateStaticParams`. Note that adding
  auth middleware means requests pass through the edge gate before reaching them.
