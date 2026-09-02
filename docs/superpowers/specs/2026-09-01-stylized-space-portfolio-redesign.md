# Stylized Space Portfolio Redesign

## Status

Approved visual direction: Option 1 from the September 1, 2026 ideation set.

Primary visual style reference:

`/Users/dominikritz/.codex/generated_images/01a05fe0-e13d-73d1-9ad9-e747d8ba56d3/exec-168983f6-f8fe-419d-ab54-ecb2dc8b8c65.png`

Focused style references:

- Hero: `/Users/dominikritz/.codex/generated_images/01a05fe0-e13d-73d1-9ad9-e747d8ba56d3/exec-2d3a1353-721b-4cf0-a9c0-0ee836fa138b.png`
- About: `/Users/dominikritz/.codex/generated_images/01a05fe0-e13d-73d1-9ad9-e747d8ba56d3/exec-af552464-5a17-496d-b34d-fb1a299a3f22.png`
- Experience: `/Users/dominikritz/.codex/generated_images/01a05fe0-e13d-73d1-9ad9-e747d8ba56d3/exec-9771a0b5-8626-4aed-bc3d-98247ba4e4ec.png`

These images define the illustration style, palette, atmosphere, and broad motion language. They are not literal layouts to reproduce: do not copy their exact positions, proportions, decorative fragments, or generated text. Build a responsive interpretation around the existing site's real content and interaction structure. Existing repository content remains authoritative for personal copy, employers, dates, locations, skills, links, and modal details.

## Goal

Redesign the Hero, About, and Experience sections as one professional but playful illustrated space journey. Replace disconnected hand-written transitions with a coherent GSAP motion system while preserving Astro, Svelte, PixiJS, Lottie, static Cloudflare Pages deployment, accessibility, and native scrolling.

## Visual Direction

The site uses premium stylized 3D editorial illustration rather than photorealism:

- Dark navy space background with sparse stars and restrained violet/cyan polygonal nebula accents.
- Rounded, friendly astronaut and rocket artwork consistent with the existing Lottie animation.
- Bold Sora display typography and a violet-to-cyan hero-name gradient.
- Translucent low-poly cyan ice with broad graphic facets, a few intentional fracture lines, frosted edges, and controlled bloom.
- Purple/navy low-poly meteors with simplified oversized craters, clean dark content insets, cyan rim light, and faceted orange trails.
- A continuous cyan S-curve timeline that visually links every experience item.
- Professional hierarchy, readable code-native text, generous spacing, and restrained effects.

Avoid photoreal materials, photographic space imagery, microscopic cracks, gritty scanned rock textures, excessive particles, game-HUD chrome, childish clip art, generic SaaS cards, and scroll-jacking.

## Design System

### Color tokens

- Page base: `#040719`
- Deep space: `#07102d`
- Surface navy: `#0b1533`
- Ice cyan: `#62dcff`
- Electric blue: `#42a8ff`
- Violet: `#8b5cf6`
- Magenta accent: `#d15cff`
- Meteor purple: `#35285f`
- Trail orange: `#ff744b`
- Trail highlight: `#ffbd66`
- Primary text: `#f7fbff`
- Muted text: `#b8c8e5`

Colors may be tuned during visual QA but must retain the selected navy/cyan/violet/orange relationships.

### Typography

- Display and section headings: Sora, using the existing Google Fonts load.
- Body and supporting UI: Montserrat.
- Hero name: responsive `clamp()` scale, bold, centered, one line on desktop and two lines only when the mobile width requires it.
- Experience metadata: compact uppercase treatment with moderate tracking; job title and company remain the primary card hierarchy.

### Illustration assets

Generated visual assets must contain no personal or job text. Text remains semantic HTML layered over the assets.

- One transparent stylized ice-frame asset with a large calm center for About copy.
- Three transparent meteor-shell variants with empty dark content insets; repeat variants across the eight jobs with controlled mirroring/rotation.
- One transparent faceted meteor-trail asset that can be scaled and faded independently.
- Optional transparent polygonal nebula edge accents if the existing PixiJS background alone cannot match the selected direction.

The existing astronaut Lottie remains the astronaut renderer. GSAP controls only its outer container and sequencing.

## Page Structure

### Hero

- Preserve the semantic introduction and name, with `Dominik Ritz` as the primary heading.
- Keep the existing astronaut Lottie, resized and positioned to support the name instead of dominating it.
- Replace the timer-driven typing implementation with a short GSAP SplitText masked character reveal.
- Sequence: `Hi, I'm` fades/slides upward, name characters reveal, a restrained light sweep crosses the completed name, and the astronaut arc completes the beat.
- The scroll cue begins only after the name is readable and then subtly loops; it fades as native scrolling begins.
- The complete hero remains readable immediately when reduced motion is requested.

### About

- Preserve the current About copy and webring link semantics.
- Place the copy within the transparent ice-frame asset, using a responsive content inset that never crosses detailed facets.
- Reveal the section heading first, then settle the ice with shallow perspective/scale motion and one restrained refracted-light sweep.
- Desktop fine-pointer interaction uses GSAP `quickTo()` for a maximum six-degree tilt and small translation. Touch devices receive no pointer tilt.

### Experience

- Preserve all eight jobs, the alternating desktop layout, skills, modal behavior, keyboard support, and real data from `src/data/jobs.ts`.
- Each item uses one of three meteor-shell variants with code-native content in its inset.
- A responsive SVG timeline path provides the continuous S-curve. Its visible stroke fills in direct proportion to ScrollTrigger progress.
- Each meteor enters on a short curved approach using MotionPathPlugin, rotates slightly, expands its trail, and settles when the timeline reaches its node. The sequence reverses cleanly when scrolling upward.
- Ambient settled motion is subtle and transform-only. No pinned scrolling is required.
- Mobile uses a single readable column and a simpler left-side progress rail; large curved entrances are replaced with short fades/translations.
- Opening and closing job details retain focus restoration and Escape/backdrop behavior. Modal motion may use GSAP but must not delay interaction.

### Global motion ownership

- GSAP: sequencing, scroll progress, motion paths, reveal timelines, pointer smoothing, and cleanup.
- PixiJS: starfield particles, background meteors, and black-hole gravity simulation.
- Lottie: astronaut internal artwork.
- CSS: layout, materials around raster assets, simple hover/focus transitions, and low-cost ambient states.

## GSAP Architecture

- Add `gsap` version `^3.13.0` or newer.
- Register ScrollTrigger, MotionPathPlugin, and SplitText in a client-only motion module.
- Use `gsap.context()` scoped to each section and call `context.revert()` during cleanup.
- Use `gsap.matchMedia()` for desktop, mobile, and `prefers-reduced-motion` variants.
- SplitText uses `autoSplit: true`, masking, `onSplit()`, and default accessible ARIA behavior.
- Scroll-linked animation uses native scroll and ScrollTrigger `scrub`; do not use ScrollSmoother, `normalizeScroll()`, snapping, or scroll-jacking.
- Animate transforms, opacity, and SVG stroke progress. Avoid layout-property animation and heavy real-time filters.

## Accessibility

- All meaningful text remains in semantic HTML and remains selectable.
- Preserve visible focus treatment for meteors, modal controls, and social links.
- Preserve the modal's dialog semantics, Escape handling, backdrop close, initial focus, and trigger focus restoration.
- Reduced-motion mode shows final states immediately, removes scrubbed trajectories/tilt/ambient floats, and retains only brief opacity changes where useful.
- Decorative assets use empty alt text or CSS backgrounds; the astronaut remains decorative unless new meaningful copy is added.
- Maintain readable contrast inside ice and meteor insets at desktop and mobile sizes.

## Responsive Requirements

- Desktop QA viewport: `1440 x 1024`, plus a tall full-page capture for comparison with the `971 x 1620` accepted concept.
- Mobile QA viewport: `390 x 844`.
- No horizontal overflow, clipped name, cropped content, unreadable meteor copy, or off-screen modal controls.
- Mobile may simplify decorative nebulae, trails, and path curvature but must preserve the same palette, faceted assets, typography hierarchy, and progress metaphor.

## Testing and Verification

- Add focused unit tests for pure motion configuration and reduced-motion behavior before implementation.
- Run `pnpm build` after integration.
- Verify in the Codex in-app browser at desktop and mobile widths, including scroll-linked behavior, upward reversal, meteor modal open/close, Escape, backdrop close, focus restoration, links, and reduced motion.
- Check the browser console for errors.
- Capture implementation screenshots and compare the reference style and implementation together, judging visual-system consistency rather than pixel-for-pixel layout fidelity.
- Maintain `design-qa.md`; final handoff requires `final result: passed` with no actionable P0/P1/P2 findings.

## Non-goals

- No React migration.
- No server-side rendering, Pages Functions, or Cloudflare runtime changes.
- No replacement of PixiJS or Lottie.
- No rewrite of portfolio copy or job data.
- No new navigation, routes, content sections, analytics, or backend behavior.
- No deployment or push without separate user authorization.
