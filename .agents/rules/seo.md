# SEO & Feature Addition Rule

Whenever adding a new feature, page, or route to `time-echo-web`, you must strictly follow the SEO architecture so crawlers, social cards, and bilingual indexing (`es` / `en`) remain consistent.

## 1. Classify the Route (Public Indexable vs. Private/Transactional)

- **Public Indexable Routes**: Marketing, landing, or informational pages intended for search engine discovery (e.g., `/`, `/about`, `/privacy`, `/terms`).
- **Private / Transactional Routes**: Authenticated user vault views, composition forms, magic-link verification, or account settings (e.g., `/dashboard`, `/letters/*`, `/analytics`, `/settings`, `/login`, `/check_email`).
- If a new route is accessible without authentication, add it to `PUBLIC_PATHS` in `src/proxy.ts` and `isPublicPage` in `src/components/layout/AppShell.tsx`.

## 2. Register Symmetric Bilingual Metadata Keys

1. Add symmetric `title` and `description` entries under `metadata.pages.<pageKey>` in both `src/lib/i18n/en.json` and `src/lib/i18n/es.json`.
2. Add `<pageKey>` to the `SeoPageKey` union type in `src/lib/seo.ts`.

## 3. Provide Server-Side `generateMetadata()` via Route `layout.tsx`

- Because interactive pages frequently use `"use client"`, create a Server Component `src/app/<route>/layout.tsx` that exports `generateMetadata()` calling `buildPageMetadata()` from `src/lib/seo.ts`:
  - **Public Indexable Route**:
    ```tsx
    export async function generateMetadata(): Promise<Metadata> {
      return buildPageMetadata({
        pageKey: "<pageKey>",
        pathname: "/<route>",
      });
    }
    ```
    This automatically generates localized titles (`%s | TimeEcho`), descriptions, canonical URLs, `hreflang` alternates (`?locale=es`, `?locale=en`, `x-default`), Open Graph images, and Twitter Cards.
  - **Private / Transactional Route**:
    ```tsx
    export async function generateMetadata(): Promise<Metadata> {
      return buildPageMetadata({
        pageKey: "<pageKey>",
        pathname: "/<route>",
        noIndex: true,
        follow: false,
      });
    }
    ```

## 4. Update `robots.ts` and `sitemap.ts`

- **For Public Indexable Routes**:
  - Add the path to the `allow` array in `src/app/robots.ts`.
  - Add the route entry to `publicRoutes` in `src/app/sitemap.ts` with appropriate `changeFrequency` and `priority`.
- **For Private / Transactional Routes**:
  - Add the path prefix to the `disallow` array in `src/app/robots.ts`.

## 5. SSR, Structured Data & On-Page SEO Guardrails

- **No Public CSR Bailouts**: Never call `useSearchParams()` in top-level shells or un-isolated components rendered on public routes. Always isolate `useSearchParams()` inside a specific leaf component wrapped in `<Suspense>` so public routes emit complete server-rendered HTML.
- **Stateless Bilingual Resolution**: Always resolve server-side locale using `resolveRequestLocale()` from `src/lib/seo.ts`, which prioritizes the `x-locale` request header set by `src/proxy.ts` (supporting `?locale=es` and `?locale=en` for stateless crawlers).
- **Structured Data (JSON-LD)**: For rich public pages, add a JSON-LD builder in `src/lib/seo.ts` and render `<script type="application/ld+json">` in the route's server `layout.tsx` (escaping `<` as `\\u003c`).
- **Semantic Landmarks & Media**:
  - Ensure exactly one `<h1>` per page and logical `<h2>`/`<h3>` hierarchy.
  - Do not render duplicate `<footer>` or `<main>` landmarks inside page components (`AppShell` already provides `<main id="main-content">` and `<ArchivalFooter />`).
  - Always provide `width`, `height`, localized `alt`, and responsive `sizes` on `next/image` components (`priority` on above-the-fold LCP images).
