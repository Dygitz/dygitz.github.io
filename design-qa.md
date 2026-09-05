# Design QA — Stylized Space Portfolio

Date: 2026-09-02

## Final approved polish and PR verification

The user approved the final composition after the iterations below. This section
supersedes earlier measurements in the historical capture notes.

- About ice is back to `min(94vw, 860px)`. The complete native paragraph flows
  between shape-outside contours traced from the flat face. A resize/font-load
  safeguard adds height for enlarged text without reducing the font size.
- About shimmer uses the illustration's alpha mask, including the matching
  portrait rotation on small screens. Thirty sampled sweep states across six
  widths showed zero pixels leaking outside the artwork.
- Meteor summaries show date, title, company, and the details action only.
  Per-shape row offsets keep all text inside the flat surfaces. BitGo and the
  June–August 2022 Palturai entry are slightly lower; the artwork is unchanged.
- The continuous timeline light follows the viewport and fades at both screen
  edges, including the gaps between jobs and reverse scrolling. Nodes use the
  same path geometry, and both sides' trails stay behind their shells.
- The raised hero scroll cue fades with scrolling and returns when scrolling
  back to the top. Its fade wrapper is independent of its entrance/bob motion.
- The black-hole cursor stays above the stars but below illustrations and text.
  About no longer toggles it off on section entry or keyboard focus; modal,
  mobile, and reduced-motion suppression remain intentional.

Final checks on the approved worktree:

- Production build, TypeScript check, and all 23 tests in five Vitest files pass.
  The only build warning is the existing direct-eval warning in Lottie.
- About text fits with at least 6px flat-face clearance at 12 widths from 320 to
  1920px. Five additional 200%-text checks pass; resizing and restoring normal
  text reset the ice height correctly.
- Final Palturai adjustment passes 48 meteor layout checks across six desktop
  and mobile widths, with no text overlap or horizontal overflow.
- Final timeline QA passes 44 forward/reverse scroll samples, viewport resize
  checks, and 32 details-dialog interactions. The scroll cue's intermediate
  fades, return to the top, and resize behavior pass in four viewport/motion
  configurations.
- Cursor checks pass on desktop, mobile, and initial reduced-motion loads,
  including About traversal in both directions and modal dismissal.
- Shimmer entrance, stationary mask alignment, tilt/reset, link focus, and
  initial reduced-motion rendering pass on desktop and mobile.
- The final independent source review found no critical or important actionable
  regressions. Changing the OS motion preference while the page is already
  loaded remains a possible follow-up; initial reduced-motion loads are tested.

Screenshot artifacts stay outside the repository. Before/after images for the
PR compare current production with the locally built approved branch; both use
a 1440 × 1000 viewport. The remaining sections document earlier review rounds.

## Source truth

The approved images are style boards rather than literal page-layout templates. The implementation was evaluated against their selected visual language: professional 2D/cartoon illustration, faceted low-poly surfaces, deep navy space, violet/cyan highlights, restrained orange meteor trails, crisp white typography, and clear hierarchy.

- Visual system board: `/Users/dominikritz/.codex/generated_images/01a05fe0-e13d-73d1-9ad9-e747d8ba56d3/exec-168983f6-f8fe-419d-ab54-ecb2dc8b8c65.png`
- Hero board: `/Users/dominikritz/.codex/generated_images/01a05fe0-e13d-73d1-9ad9-e747d8ba56d3/exec-2d3a1353-721b-4cf0-a9c0-0ee836fa138b.png`
- About board: `/Users/dominikritz/.codex/generated_images/01a05fe0-e13d-73d1-9ad9-e747d8ba56d3/exec-af552464-5a17-496d-b34d-fb1a299a3f22.png`
- Experience board: `/Users/dominikritz/.codex/generated_images/01a05fe0-e13d-73d1-9ad9-e747d8ba56d3/exec-9771a0b5-8626-4aed-bc3d-98247ba4e4ec.png`

## Capture setup

- Primary interaction browser: Codex in-app browser.
- User-approved fallback: Playwright with installed Chrome, used only to persist local screenshots, emulate reduced motion, and assemble comparison images after the in-app browser could not export those artifacts.
- Desktop viewport: 1440 × 1024 CSS pixels, DPR 1.
- Mobile viewport: 390 × 844 CSS pixels, DPR 1.
- Desktop full-page implementation capture: 1440 × 6486 pixels.
- Target: the locally built production preview at `http://localhost:4321/`.
- Console result on the production preview: no warnings, errors, page errors, or failed responses.

The fixed Pixi starfield is sampled once by the browser's full-page screenshot stitcher. Focused viewport captures are therefore the authoritative visual-fidelity evidence for the animated background; the full-page captures are used for layout, ordering, and content coverage.

## Comparison evidence

Every comparison places the approved source and implementation in the same raster at normalized density.

- Hero: `/Users/dominikritz/.codex/visualizations/2026/09/02/01a05fd7-f508-7e32-a9c7-3688bb16fd56/portfolio-design-qa/comparison-hero.png` (2880 × 1096)
- About: `/Users/dominikritz/.codex/visualizations/2026/09/02/01a05fd7-f508-7e32-a9c7-3688bb16fd56/portfolio-design-qa/comparison-about.png` (2880 × 1096)
- Experience: `/Users/dominikritz/.codex/visualizations/2026/09/02/01a05fd7-f508-7e32-a9c7-3688bb16fd56/portfolio-design-qa/comparison-experience.png` (2880 × 1096)
- Overview: `/Users/dominikritz/.codex/visualizations/2026/09/02/01a05fd7-f508-7e32-a9c7-3688bb16fd56/portfolio-design-qa/comparison-overview.png`
- Desktop full page: `/Users/dominikritz/.codex/visualizations/2026/09/02/01a05fd7-f508-7e32-a9c7-3688bb16fd56/portfolio-design-qa/implementation-desktop-full-page.png`
- Reduced-motion full page: `/Users/dominikritz/.codex/visualizations/2026/09/02/01a05fd7-f508-7e32-a9c7-3688bb16fd56/portfolio-design-qa/implementation-reduced-full-page.png`
- Mobile hero, About, Experience, and modal: `portfolio-design-qa/implementation-mobile-*.png` in the same visualization directory.

## Fidelity review

| Surface | Result | Evidence |
| --- | --- | --- |
| Fonts and typography | Pass | Sora supplies the display hierarchy and Montserrat keeps body copy compact and readable. One visible `h1` is used; section titles remain clearly subordinate. |
| Spacing and layout | Pass | Hero, About, and Experience retain deliberate breathing room. Alternating meteors remain attached to the orbit path. At 390 px, the hero wraps cleanly, the ice panel becomes portrait-oriented without distortion, and the modal stays inside the viewport. |
| Colors and tokens | Pass | Navy, violet, cyan, white, and orange remain consistent across illustrations, typography, focus states, trail effects, and the modal. Contrast stays legible on the illustrated surfaces. |
| Image quality and assets | Pass | The selected style is carried by purpose-made raster illustrations rather than literal copies of the boards. Assets remain crisp at their rendered desktop and mobile sizes, preserve aspect ratio, and avoid photorealism. Modern AVIF sources reduce the six illustrated assets from roughly 6.5 MiB of PNGs to roughly 572 KiB, with PNG fallbacks retained. |
| Copy and content | Pass | Existing biography and all eight job records remain intact. Long titles, employers, locations, tags, and detail copy fit without clipping; overflow skills are summarized on the meteor and remain available in the modal. |
| Motion | Pass | GSAP coordinates the name reveal, hero flight, ice reveal, orbit progress, and meteor arrivals. Native scrolling is retained with no pinning or scroll hijacking. Motion is transform/opacity based and reversible when scrolling. |

## Responsive, interaction, and accessibility checks

- Desktop and mobile document widths exactly matched their viewports (1440/1440 and 390/390); no horizontal overflow was present.
- All eight job meteors were present and reachable.
- Each meteor exposes a visible button that opens its native modal dialog. Meteor copy remains selectable outside that button.
- The close button, Escape key, and backdrop close the dialog, and focus returns to the exact originating meteor. An eight-step forward-tab smoke test never reached the social links behind the modal.
- The mobile modal measured 358 × 418 pixels at `(16, 212.97)` within the 390 × 844 viewport.
- At 390 px, the compact meteor preserves readable type: 12.48 px company, 11 px date and action, and 16.38 px title. Location, tagline, and skills move into the dialog rather than being compressed onto the meteor.
- LinkedIn, GitHub, email, and biography links remained visible, labeled, keyboard reachable, and functional.
- The six illustration requests resolved as AVIF with HTTP 200 responses; none fell back to PNG in the test browser. Below-the-fold ice and meteor imagery uses native lazy loading.
- Persisted `pagehide` events preserve the hero and About animation setup for back-forward-cache restoration, while non-persisted page exits still perform full cleanup.
- Reduced-motion emulation produced stable hero and Experience screenshots across a 900 ms interval. The astronaut, ice, heading, and all eight meteors were visible; every meteor had opacity `1`, visibility `visible`, and no transform; document scroll behavior was `auto`.
- The production-preview console was empty across desktop, mobile, and reduced-motion passes.
- At the reported 912 × 656 hero viewport, the complete name occupied `x=211.34…700.64` and remained inside the viewport. SplitText produced 11 unclipped character elements, while the line—not each glyph—provides the reveal mask.
- The name shimmer uses a matching text layer with `background-clip: text`; its animated highlight cannot paint across the rectangular name container. The hero illustration uses a bottom alpha mask to taper into the starfield.
- About copy measured 20.08% inset from both horizontal ice edges, with more than 31% vertical breathing room above and below.
- The meteor surface now shows only date, title, company, and the detail action. All eight dialogs retain location, specialization, skills, and full descriptions.
- Every one of the eight orbit nodes is generated from the same geometry as the SVG path. Maximum sampled node-to-path distance was `0.104` viewBox units, maximum node-to-meteor-edge gap was `6px`, and resize compensation kept marker aspect ratios within `0.99998…1.00001`.
- The right-side trail extended `273.25px` beyond its meteor in the desktop regression and remained below the shell (`z-index 0` versus `1`).

## Findings and iteration history

1. The first formal full-page pass exposed a P2 motion completion issue: at maximum desktop scroll, the final meteor stopped at opacity `0.7716` with a residual transform because its reveal endpoint sat slightly below the available scroll range.
2. The meteor reveal endpoint was moved from `center 58%` to `center 68%` and covered by a focused unit test.
3. At the same maximum-scroll state after the fix, the final meteor measured opacity `1` with an identity transform. The full comparison and reduced-motion evidence were regenerated from the production build.
4. A whole-branch review found four P2 production issues: focus could escape the custom overlay, mobile meteor metadata was undersized, the six eager PNGs added roughly 6.5 MiB, and the full-card trigger intercepted text selection.
5. The detail overlay was replaced by a native top-layer dialog with exact focus restoration; mobile information density and type sizes were adjusted; AVIF/lazy-loading sources were added; and interaction was narrowed to the visible action button.
6. The same review identified a P3 back-forward-cache lifecycle issue. The hero and About sections now distinguish persisted navigation from true teardown, with focused lifecycle tests.
7. Final browser QA confirmed modal isolation, Escape/backdrop focus restoration, selectable meteor text, AVIF delivery, responsive type, an empty console, and stable reduced-motion rendering.
8. Screenshot feedback exposed seven additional composition defects: character-mask clipping, a rectangular name shimmer, an abrupt hero-art boundary, an over-wide ice copy area, overloaded meteor summaries, a right-side trail transformed into the shell, and orbit markers positioned independently from their path.
9. The hero now uses line masks and a glyph-clipped shimmer; the nebula fades through an alpha mask; About uses a measured central safe area; meteor summaries defer secondary data to the dialog; trail orientation lives on the image while GSAP scales its wrapper; and a shared geometry module produces both the orbit and its markers.
10. A browser regression was captured failing before the fixes, then passed after them. Focused geometry tests were added and the regenerated desktop, mobile, full-page, modal, and reduced-motion captures passed with an empty console.

Remaining P0 findings: none.

Remaining P1 findings: none.

Remaining P2 findings: none.

final result: passed


## Glass social dock — 2026-09-05

- Replaced the full-width footer fade and large icons with a compact translucent dock fixed 20px from the bottom-left edge.
- GitHub, LinkedIn and email keep their existing destinations; all links have 44px targets and visible keyboard focus.
- Dock fades in and rises 8px once over 450ms, after a 1.6s delay synchronized with hero initialization. Reduced-motion users skip the animation; keyboard focus reveals links immediately.
- Browser checks covered 390 × 844 mobile, 527 × 790 portrait and 1440 × 900 desktop. Dock remained fixed after scrolling 1580px.
- Production build passed; existing lottie-web eval warning remains.
- Reduced-motion behavior verified through CSS scope; native safe areas and external destinations were not separately exercised.
