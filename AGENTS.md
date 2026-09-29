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
