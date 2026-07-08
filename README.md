# NESR AI Learning (learnai.nesr.com)

Standalone learning site for the **NESR AI Learning Series** — beginner AI courses
with a short quiz after every part.

- **Business track** — What AI Actually Is · AI in the Workplace · Risk, Ethics & Getting Started
- **Technical track** — How Models Actually Work · Working With Models · Deployment, Evaluation & Safety

Extracted from the SC Agents platform into its own Next.js app so it can ship on its
own domain. It is fully static — no database and no server actions. Per-user quiz
progress is kept in the browser via `localStorage`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react.

## Routes

| Path            | Page                                            |
| --------------- | ----------------------------------------------- |
| `/`             | Landing — both tracks, progress, module list    |
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

All content lives in [`src/app/content.ts`](src/app/content.ts) — edit tracks,
modules, lesson blocks, and quiz questions there.

## Notes

- **No auth** by default — the site is open. If it should be restricted to NESR
  staff, add SSO (e.g. NextAuth with the corporate provider) in a root layout gate.
- The module pages are pre-rendered via `generateStaticParams`, so the whole site
  can be served as static output.
