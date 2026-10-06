<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# TimeEcho Frontend Rules

## Core Guidelines

- Do not write code comments. Keep the code clean, self-describing, and concise without inline or block comments.
- All code, variable names, function names, CSS tokens, and documentation must be written in English.
- Avoid generic SaaS patterns. Follow TimeEcho's epistolary, archival design principles (wax seals, parchment sheets, manila dossiers, postmark stamps, Courier Prime, Fraunces, IBM Plex Sans).
- Use Tailwind CSS v4 with CSS-first configuration via `@theme inline`.
- Do not run `git commit` or `git push` commands. The user will handle committing and pushing code changes manually.

## Documentation References

Before making changes, consult the relevant documentation:

- **Architecture**: `docs/architecture.md` — Project structure, data flow, state management, API routes, type system, styling architecture, i18n, fonts, deployment
- **Design System**: `docs/design.md` — Visual identity, color palette, typography, component design system, page layouts, interaction patterns, motion, accessibility, dark mode, content guidelines, design tokens

## Key Files to Know

| Area | File |
|------|------|
| Design tokens & base styles | `src/app/globals.css` |
| Domain types | `src/types/timeecho.ts` |
| Global context & actions | `src/lib/context/TimeEchoContext.tsx` |
| Repository interface | `src/lib/repositories/ICapsuleRepository.ts` |
| HTTP repository impl | `src/lib/repositories/HttpApiRepository.ts` |
| Mock API (dev) | `src/lib/mockApiStore.ts` |
| Font loading | `src/lib/fonts.ts` |
| Translations | `src/lib/i18n/en.json`, `src/lib/i18n/es.json` |
| UI primitives | `src/components/ui/*.tsx` |
| Feature components | `src/features/*/components/*.tsx` |
| Feature hooks | `src/features/*/hooks/*.ts` |

## Development Rules

- **Tailwind v4**: Use CSS-first config in `globals.css` via `@theme inline`. Do not use `tailwind.config.js`.
- **CSS Variables**: Reference design tokens via `var(--token-name)` or Tailwind utilities (`bg-wax`, `text-ink`, `font-serif-editorial`).
- **Components**: Prefer composing UI primitives (`PaperSheet`, `ArchivalFolder`, `PostmarkStamp`, `WaxSeal`) over custom styles.
- **Types**: All domain types in `src/types/timeecho.ts`. Import from there.
- **State**: Use `useTimeEcho()` context for global state/actions. Avoid local state for shared data.
- **API**: Call context methods (`createCapsule`, `updateReality`, etc.), not `fetch` directly.
- **i18n**: Use `t('key')` from context. Add keys to both `en.json` and `es.json`.
- **Motion**: Respect `prefers-reduced-motion`. Use existing keyframes (`animate-fade-in`, `animate-seal-left/right`).
- **Accessibility**: Semantic HTML, focus-visible outlines, ARIA on custom components, 44px touch targets.