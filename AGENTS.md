# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/`: Route files (`.astro`) map directly to URLs.
- `src/components/`: Reusable UI in `.astro` and `.svelte` (e.g., `HeroSection.astro`, `ProjectCard.svelte`).
- `src/data/`: Typed content and config (e.g., `jobs.ts`).
- `src/styles/global.css`: Global styles; Tailwind utilities are the default.
- `public/`: Static assets copied as‑is to the build.
- Config lives in `astro.config.mjs`, `tailwind.config.mjs`, `svelte.config.js`, `tsconfig.json`. Build output is `dist/`.

## Build, Test, and Development Commands
- Use pnpm to match CI. Common commands:
  - `pnpm install` — install dependencies.
  - `pnpm dev` — start Astro dev server (default: http://localhost:4321).
  - `pnpm build` — production build to `dist/`.
  - `pnpm preview` — serve the built site locally.
- Deployment is automated via GitHub Actions on pushes to `main` (see `.github/workflows/deploy.yml`). It builds with Node 20 and pnpm 9 and publishes to GitHub Pages.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; keep TypeScript for data/util modules.
- Filenames: Components in PascalCase (`StarField.astro`, `Timeline.svelte`); pages in kebab‑case (`about.astro`).
- Imports: group external first, then local; prefer relative paths from `src/`.
- Tailwind: prefer utility classes over custom CSS; keep class lists readable and consistent.
- No linter is enforced; if using a formatter, follow Prettier defaults.

## Testing Guidelines
- No test framework is configured yet. If adding tests:
  - Unit: Vitest; E2E: Playwright.
  - Name tests `*.test.ts`; place next to the source or in `__tests__/`.
  - Add `"test"`/`"test:watch"` scripts to `package.json` and document usage in PRs.

## Commit & Pull Request Guidelines
- Prefer Conventional Commits (`feat:`, `fix:`, `chore:`, `style:`, `refactor:`). Example: `feat(StarField): improve trail quality`.
- Keep messages imperative and concise (≤ 72 chars for the subject).
- PRs should include: clear summary, linked issues, before/after screenshots for UI changes, and any breaking‑change notes. Ensure `pnpm build` succeeds locally.

## Security & Configuration Tips
- Do not commit secrets. `.env` files are ignored by `.gitignore`.
- Align local env with CI: Node 20 and pnpm 9.
- Prefer `pnpm` over npm/yarn to preserve lockfile and reproducible builds.

