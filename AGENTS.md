# TimeEcho Guidelines & Rules

## 1. Core Agent Invariants

- **No Code Comments**: Do not write inline or block code comments. Write clean, self-describing code.
- **English Only**: All identifiers, types, variables, functions, CSS tokens, commit messages, and documentation must be in English.
- **Git Safety**: Never execute `git commit` or `git push`. Committing and pushing are reserved strictly for the user.
- **Strict Scope Boundaries**: Execute only what is explicitly requested. Do not perform unsolicited refactoring, restyling, or file reorganizations.
- **Natural Language & Words**: Always use natural, human, grounded words in mock content, UI copy, and user communication—avoiding robotic, overly technical, or artificial meta-jargon.
- **Use Mockups for UI Changes**: Whenever any UI, layout, or visual component changes are made, always consult and follow the Storybook mockup catalog in the [`time-echo/mockups`](https://github.com/time-echo/mockups) repository (see `.agents/rules/mockups.md`) as the visual and structural source of truth.
- **Ask Before Guessing**: If design requirements, flows, or mockups are missing or ambiguous, prompt the user for clarification before modifying code.

---

## 2. Architecture & Stack

- **Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Lucide React, Framer Motion.
- **Tailwind v4 Configuration**: Pure CSS-first via `@theme inline` in `src/app/globals.css`. Never create or rely on `tailwind.config.js`.
- **Feature Modular Structure**: Feature logic resides in `src/features/<feature-name>/` (`capsules`, `reality-ledger`, `analytics`, `settings`, `landing`).
- **Repository Pattern & State**: Components must never call `fetch('/api/...')` directly for capsule operations. Always consume `useTimeEcho()` from `src/lib/context/TimeEchoContext.tsx`, which delegates to `ICapsuleRepository`.
- **Domain Types**: Single source of truth is `src/types/timeecho.ts`. Never declare duplicate entity interfaces.

```
Next.js App Router (src/app/)
  └── React Context (src/lib/context/TimeEchoContext.tsx)
        └── Repository Layer (ICapsuleRepository -> HttpApiRepository / MockApiStore)
              └── Domain Types (src/types/timeecho.ts)
```

---

## 3. Epistolary Design System

Rejects generic SaaS cards and saturated neon accents in favor of physical archival materiality: parchment paper, manila folders, wax seals, postmark stamps, and typewriter typography.

### Design Tokens

| Token                | Light Value | Dark Value | Role                                            |
| -------------------- | ----------- | ---------- | ----------------------------------------------- |
| `--wax`              | `#8E2818`   | `#D14930`  | Primary actions, wax seals, highlights          |
| `--wax-hover`        | `#6A1E12`   | `#E05A40`  | Hover states                                    |
| `--ink`              | `#2C485E`   | `#77A3C4`  | Borders, postmark stamps, secondary accents     |
| `--manila`           | `#EFECE3`   | `#1C2028`  | Archival folder backgrounds, aside panels       |
| `--manila-border`    | `#D5CEBD`   | `#2D3342`  | Folder borders                                  |
| `--parchment`        | `#FAF9F5`   | `#16181D`  | Document surfaces, paper cards, page background |
| `--crease`           | `#D8D2C2`   | `#2D3340`  | Paper sheet borders, divider folds              |
| `--foreground`       | `#1C1F26`   | `#E5E7EB`  | Primary text                                    |
| `--foreground-muted` | `#5A606B`   | `#9CA3AF`  | Captions, timestamps, placeholder text          |

### Typography

- **Editorial / Headings**: `Fraunces` (`--font-serif-editorial` / `font-serif-editorial`)
- **Letter / Typewriter**: `Courier Prime` (`--font-letter` / `font-letter`)
- **UI / Labels**: `IBM Plex Sans` (`--font-ui` / `font-ui`)

### UI Primitives (`src/components/ui/`)

- `.paper-sheet`: Parchment card surface with crease border and physical shadow.
- `.archival-folder`: Manila dossier panel with folder tabs and muted border.
- `.postmark-stamp` & `.postmark-stamp-circle`: Dashed ink border stamp with Courier text.
- `.wax-seal`: Radial carmine gradient seal with tactile spring dynamics.
- `.lined-paper-canvas`: Ruled paper background pattern for letter composition.
- `.radial-progress`: Circular accuracy meter driven by CSS variables (`--value`, `--size`, `--thickness`).

---

## 4. UI/UX Design Lock & Immutability

- **Living Mockup Catalog ([`time-echo/mockups`](https://github.com/time-echo/mockups))**: All UI changes must reference and match the living Storybook mockup catalog in the [`time-echo/mockups`](https://github.com/time-echo/mockups) repository (`pnpm storybook` on port `6006`), which organizes components and full-page frames across 5 tiers (`Tier 1 - Primitives`, `Tier 2 - Stamps`, `Tier 3 - Layout`, `Tier 4 - Capsules`, and `Tier 5 - Pages/Figma Frames`). Keep tokens (`src/app/globals.css`), fonts (`src/lib/fonts.ts`), i18n dictionaries (`src/lib/i18n/{en,es}.json`), and UI components synchronized with the `time-echo/mockups` repository.
- **Canonical External Reference**: Canonical mockups reside in the [`time-echo/mockups`](https://github.com/time-echo/mockups) repository and external Figma files. See `docs/design.md#design-registry-external-references` for frame mappings (`Landing-V2`, `Composer-Full`, `Letter-Sealed`, `Letter-Opened`, `Vault-Grid`, `Analytics-Summary`, `Settings-Sections`).
- **Zero-Image Policy**: Do not commit mockup images, screenshots (`.png`, `.jpg`, `.webp`), or vector design files (`.fig`, `.sketch`, `.psd`) into git. Visual verification is performed against the running browser instance (`pnpm dev`) and external Figma.
- **Locked Structure**: Approved route layouts (`src/app/**`), navigation shells (`ArchivalHeader` for public routes, `AppShell` for internal routes), component hierarchies, and grid ratios are locked. Do not unilaterally restructure them.
- **Copy Immutability**: Strings in `src/lib/i18n/en.json` and `src/lib/i18n/es.json` are an immutable user-facing contract. Never rewrite, reword, or delete existing keys without explicit instructions. When adding new copy, add symmetric keys to both `en.json` and `es.json`.
- **No Hardcoded Strings**: Never hardcode user-facing copy in JSX. Always use `const { t } = useTimeEcho()` with translation keys.
- **Natural & Human Voice**: All user-facing copy, mock letters, sample predictions, placeholders, and UI texts must use natural, grounded, everyday words. Avoid stiff, robotic, overly theatrical, or technical meta-jargon (e.g., sample letters must reflect what real people genuinely write to their future selves with warmth and sincerity, rather than developer notes or artificial docket entries).

---

## 5. Verification & Quality Gates

Run these checks before finalizing any task:

1. **Linting & Type Safety**:

   ```bash
   pnpm lint
   ```

   Zero ESLint errors and strict TypeScript compliance required.

2. **Commit Conventions**:
   Pre-commit hooks (`husky` + `lint-staged`) format staged files with Prettier and validate with ESLint. Commits must follow Conventional Commits format (`feat:`, `fix:`, `chore:`, `refactor:`, `style:`, `docs:`).

3. **Visual Verification**:
   Inspect changes at `http://localhost:3000` (`pnpm dev`) for responsive behavior, theme fidelity (light parchment / dark archival), and epistolary materiality.

---

## 6. Key References

| Area                  | Location                                                    |
| --------------------- | ----------------------------------------------------------- |
| Storybook Mockups     | [`time-echo/mockups`](https://github.com/time-echo/mockups) |
| UI Mockups Rule       | `.agents/rules/mockups.md`                                  |
| System Architecture   | `docs/architecture.md`                                      |
| Design Specification  | `docs/design.md`                                            |
| Design Tokens         | `src/app/globals.css`                                       |
| Domain Interfaces     | `src/types/timeecho.ts`                                     |
| Context & Actions     | `src/lib/context/TimeEchoContext.tsx`                       |
| Repository Interfaces | `src/lib/repositories/ICapsuleRepository.ts`                |
| Local Mock Store      | `src/lib/mockApiStore.ts`                                   |
| Translations          | `src/lib/i18n/en.json`, `src/lib/i18n/es.json`              |
| Font Configuration    | `src/lib/fonts.ts`                                          |
| UI Primitives         | `src/components/ui/`                                        |
| Feature Domains       | `src/features/`                                             |
