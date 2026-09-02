# Stylized Space Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Hero, About, and Experience presentation in the accepted stylized low-poly space direction and coordinate its motion with GSAP while preserving the current Astro/Svelte content and behavior.

**Architecture:** Keep Astro as the page shell, Svelte as the hydrated Experience/Lottie layer, PixiJS as the background renderer, and Lottie as the astronaut renderer. Add a small client-only GSAP loader plus pure motion-profile configuration, then mount section-scoped GSAP contexts from the existing components. Use transparent generated illustration assets behind semantic HTML rather than baking portfolio copy into images.

**Tech Stack:** Astro 7, Svelte 5, TypeScript, Tailwind 4, PixiJS 8, Lottie, GSAP 3.13+ (ScrollTrigger, MotionPathPlugin, SplitText), Vitest, Cloudflare Pages static output.

**Spec:** `docs/superpowers/specs/2026-09-01-stylized-space-portfolio-redesign.md`

## Global Constraints

- Preserve Astro and Svelte; do not introduce React.
- Use `/Users/dominikritz/.codex/generated_images/01a05fe0-e13d-73d1-9ad9-e747d8ba56d3/exec-168983f6-f8fe-419d-ab54-ecb2dc8b8c65.png` as a visual-style reference for palette, low-poly illustration, atmosphere, and motion language. Do not copy its exact layout, positions, proportions, decorative fragments, or generated text.
- Existing `src/data/jobs.ts` and About copy remain authoritative; do not invent or rewrite employers, dates, descriptions, links, or skills.
- GSAP must be `^3.13.0` or newer and use ScrollTrigger, MotionPathPlugin, SplitText, `gsap.context()`, and `gsap.matchMedia()`.
- Keep native scrolling; do not use ScrollSmoother, `normalizeScroll()`, snapping, or scroll-jacking.
- Keep PixiJS responsible for starfield physics and Lottie responsible for astronaut rendering.
- All meaningful text remains semantic, selectable HTML; generated assets contain no portfolio copy.
- Reduced-motion mode shows stable final states and disables scrubbed paths, tilt, and ambient floating.
- No deployment, push, Cloudflare configuration change, SSR, or Pages Functions work.
- Final handoff requires `pnpm test`, `pnpm build`, browser verification at `1440 x 1024` and `390 x 844`, and `design-qa.md` with `final result: passed`.

---

### Task 1: Add the tested GSAP client foundation

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/lib/spaceMotion.ts`
- Create: `src/lib/spaceMotion.test.ts`
- Create: `src/lib/gsapClient.ts`

**Interfaces:**
- Produces: `getSpaceMotionProfile(input: { reducedMotion: boolean; viewportWidth: number }): SpaceMotionProfile`
- Produces: `getMeteorVariant(index: number): 1 | 2 | 3`
- Produces: `loadGsap(): Promise<{ gsap; ScrollTrigger; MotionPathPlugin; SplitText }>`
- Consumes: no earlier task interfaces.

- [ ] **Step 1: Add the test command and dependencies**

Run:

```bash
pnpm add gsap@^3.13.0
pnpm add -D vitest
```

Add the exact script to `package.json`:

```json
"test": "vitest run"
```

- [ ] **Step 2: Write the failing motion-profile tests**

Create `src/lib/spaceMotion.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getMeteorVariant, getSpaceMotionProfile } from "./spaceMotion";

describe("getSpaceMotionProfile", () => {
  it("disables decorative motion when reduced motion is requested", () => {
    expect(
      getSpaceMotionProfile({ reducedMotion: true, viewportWidth: 1440 }),
    ).toEqual({
      mode: "reduced",
      heroCharacterStagger: 0,
      scrollScrub: false,
      meteorTravel: 0,
      tiltDegrees: 0,
      ambientMotion: false,
    });
  });

  it("uses compact motion without curved meteor travel below 768px", () => {
    expect(
      getSpaceMotionProfile({ reducedMotion: false, viewportWidth: 390 }),
    ).toEqual({
      mode: "compact",
      heroCharacterStagger: 0.025,
      scrollScrub: 0.2,
      meteorTravel: 0,
      tiltDegrees: 0,
      ambientMotion: false,
    });
  });

  it("enables full motion at desktop widths", () => {
    expect(
      getSpaceMotionProfile({ reducedMotion: false, viewportWidth: 1440 }),
    ).toEqual({
      mode: "full",
      heroCharacterStagger: 0.035,
      scrollScrub: 0.45,
      meteorTravel: 180,
      tiltDegrees: 6,
      ambientMotion: true,
    });
  });
});

describe("getMeteorVariant", () => {
  it("cycles the three approved meteor shells", () => {
    expect([0, 1, 2, 3, 4, 5].map(getMeteorVariant)).toEqual([
      1, 2, 3, 1, 2, 3,
    ]);
  });
});
```

- [ ] **Step 3: Run the tests and verify the RED state**

Run:

```bash
pnpm test -- src/lib/spaceMotion.test.ts
```

Expected: FAIL because `src/lib/spaceMotion.ts` does not exist.

- [ ] **Step 4: Implement the minimum pure configuration**

Create `src/lib/spaceMotion.ts`:

```ts
export type SpaceMotionMode = "reduced" | "compact" | "full";

export interface SpaceMotionProfile {
  mode: SpaceMotionMode;
  heroCharacterStagger: number;
  scrollScrub: false | number;
  meteorTravel: number;
  tiltDegrees: number;
  ambientMotion: boolean;
}

export function getSpaceMotionProfile(input: {
  reducedMotion: boolean;
  viewportWidth: number;
}): SpaceMotionProfile {
  if (input.reducedMotion) {
    return {
      mode: "reduced",
      heroCharacterStagger: 0,
      scrollScrub: false,
      meteorTravel: 0,
      tiltDegrees: 0,
      ambientMotion: false,
    };
  }

  if (input.viewportWidth < 768) {
    return {
      mode: "compact",
      heroCharacterStagger: 0.025,
      scrollScrub: 0.2,
      meteorTravel: 0,
      tiltDegrees: 0,
      ambientMotion: false,
    };
  }

  return {
    mode: "full",
    heroCharacterStagger: 0.035,
    scrollScrub: 0.45,
    meteorTravel: 180,
    tiltDegrees: 6,
    ambientMotion: true,
  };
}

export function getMeteorVariant(index: number): 1 | 2 | 3 {
  return ((index % 3) + 1) as 1 | 2 | 3;
}
```

- [ ] **Step 5: Verify the GREEN state**

Run:

```bash
pnpm test -- src/lib/spaceMotion.test.ts
```

Expected: four passing tests.

- [ ] **Step 6: Add the client-only GSAP loader**

Create `src/lib/gsapClient.ts` with one cached browser-side import:

```ts
type GsapBundle = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  MotionPathPlugin: typeof import("gsap/MotionPathPlugin").MotionPathPlugin;
  SplitText: typeof import("gsap/SplitText").SplitText;
};

let gsapBundle: Promise<GsapBundle> | undefined;

export function loadGsap(): Promise<GsapBundle> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("GSAP client bundle requested on the server"));
  }

  gsapBundle ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/MotionPathPlugin"),
    import("gsap/SplitText"),
  ]).then(([core, scroll, motionPath, split]) => {
    core.gsap.registerPlugin(
      scroll.ScrollTrigger,
      motionPath.MotionPathPlugin,
      split.SplitText,
    );

    return {
      gsap: core.gsap,
      ScrollTrigger: scroll.ScrollTrigger,
      MotionPathPlugin: motionPath.MotionPathPlugin,
      SplitText: split.SplitText,
    };
  });

  return gsapBundle;
}
```

- [ ] **Step 7: Verify tests and the production build**

Run:

```bash
pnpm test
pnpm build
```

Expected: all tests pass and Astro produces `dist/` successfully.

- [ ] **Step 8: Commit the foundation**

```bash
git add package.json pnpm-lock.yaml src/lib/spaceMotion.ts src/lib/spaceMotion.test.ts src/lib/gsapClient.ts
git commit -m "feat: add GSAP motion foundation"
```

### Task 2: Produce the approved illustration asset set

**Files:**
- Create: `public/illustrations/space/ice-frame.png`
- Create: `public/illustrations/space/meteor-shell-1.png`
- Create: `public/illustrations/space/meteor-shell-2.png`
- Create: `public/illustrations/space/meteor-shell-3.png`
- Create: `public/illustrations/space/meteor-trail.png`
- Create: `public/illustrations/space/nebula-edges.png`

**Interfaces:**
- Produces: transparent assets consumed by Hero/About/Experience CSS and markup.
- Consumes: the accepted concept and the three section-detail mockups.

- [ ] **Step 1: Generate the ice-frame asset**

Use built-in Image Gen with the accepted concept and focused About reference attached. Use this prompt verbatim except for the explicit reference-image labels:

```text
Use case: stylized-concept
Asset type: transparent website illustration frame
Primary request: Create one isolated low-poly translucent cyan ice slab matching the selected portfolio mockup. It is a wide irregular crystal frame with chunky graphic facets, a large calm empty center for HTML text, a few intentional fracture lines, frosted cyan edges, and restrained violet reflections.
Style/medium: premium stylized 3D editorial illustration, simplified geometry, crisp polygon planes, soft cel shading, designed rather than photoreal.
Composition: landscape 3:2 slab, centered, complete object with generous transparent padding; no crop.
Lighting/mood: soft cyan rim light and gentle bloom on a transparent background.
Constraints: transparent background; no text; no letters; no logos; no people; no starfield; calm center must remain readable behind dark navy HTML text.
Avoid: photographed glacier, microscopic cracks, realistic refraction noise, gritty texture, game HUD, clip art, watermark.
```

Inspect the output, preserve alpha, and copy the selected result to `public/illustrations/space/ice-frame.png` without overwriting unrelated assets.

- [ ] **Step 2: Generate three meteor shells independently**

Run one built-in Image Gen call per variant with the accepted Experience reference attached. Keep this common prompt and change only the shape sentence for each variant:

```text
Use case: stylized-concept
Asset type: transparent website UI illustration
Primary request: Create one isolated purple/navy low-poly meteor shell matching the selected portfolio mockup. Include a large clean dark inset panel for code-native HTML job text, a few oversized graphic craters, cyan rim light on the leading edge, and a designed asymmetrical silhouette. [VARIANT SHAPE SENTENCE]
Style/medium: premium stylized 3D editorial illustration, chunky simplified geometry, crisp polygon planes, soft cel shading.
Composition: wide 4:3 object, full meteor visible with transparent padding, no trail.
Lighting/mood: cool cyan/violet rim light with restrained highlights.
Constraints: transparent background; empty inset; no text; no letters; no logos; no particles; no trail.
Avoid: realistic asteroid photography, scanned rock texture, microscopic detail, game HUD, clip art, watermark.
```

Variant sentences:

```text
Variant 1: compact rounded meteor with a slightly flattened lower edge and two large craters near the upper-right rim.
Variant 2: wider horizontal meteor with a tapered leading edge and three uneven craters along its upper ridge.
Variant 3: tall-rounded meteor with a heavier lower-left mass and one large plus two small graphic craters.
```

Copy the selected files to `meteor-shell-1.png`, `meteor-shell-2.png`, and `meteor-shell-3.png`.

- [ ] **Step 3: Generate the scalable trail asset**

Use this prompt:

```text
Use case: stylized-concept
Asset type: transparent motion accent
Primary request: Create one isolated faceted meteor trail matching the selected portfolio mockup: a tapered cluster of long orange and coral polygon shards with a small warm yellow core highlight, designed to extend horizontally behind a low-poly meteor.
Style/medium: premium stylized 3D editorial illustration, clean geometric planes, soft cel shading.
Composition: horizontal 3:1 trail pointing left-to-right, complete shape, transparent padding.
Constraints: transparent background; no meteor body; no text; no stars; no smoke photograph.
Avoid: realistic fire, volumetric smoke, gritty particles, watermark.
```

Copy the selected result to `public/illustrations/space/meteor-trail.png`.

- [ ] **Step 4: Generate the polygonal nebula edge overlay**

Use this prompt with the Hero and About focused references attached:

```text
Use case: stylized-concept
Asset type: transparent decorative website overlay
Primary request: Create one isolated wide edge composition of low-poly violet, indigo, and cyan crystalline nebula fragments matching the selected portfolio mockup. Keep the central 60 percent completely empty so live website content stays readable. Concentrate polygonal shards along the upper-left, lower-left, and lower-right edges with generous negative space.
Style/medium: premium stylized 3D editorial illustration, crisp polygon planes, soft cel shading, restrained glow.
Composition: wide 16:9 transparent overlay, complete edge fragments, no central subject.
Constraints: transparent background; no text; no astronaut; no rocket; no meteors; no ice slab; no photographic starfield.
Avoid: realistic mountains, photo textures, excessive particles, game HUD, watermark.
```

Copy the selected result to `public/illustrations/space/nebula-edges.png`.

- [ ] **Step 5: Validate assets visually and structurally**

Inspect every file with `view_image`. Run:

```bash
file public/illustrations/space/*.png
du -h public/illustrations/space/*.png
```

Expected: valid PNGs with alpha channels, readable empty insets, no embedded text, no cropped objects, and no accidental photorealism. Optimize only if total illustration weight is unreasonable; preserve visible edge quality.

- [ ] **Step 6: Commit the asset set**

```bash
git add public/illustrations/space
git commit -m "feat: add stylized space illustrations"
```

### Task 3: Rebuild the Hero and About motion sequence

**Files:**
- Modify: `src/components/HeroSection.astro`
- Modify: `src/components/LottieInteractive.svelte`
- Modify: `src/components/AboutSection.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `loadGsap()` and `getSpaceMotionProfile()` from Task 1.
- Consumes: `ice-frame.png` from Task 2.
- Produces: section-scoped `data-hero-section` and `data-about-section` roots for browser QA.

- [ ] **Step 1: Remove the timer-driven hero implementation while preserving copy**

In `HeroSection.astro`:

- Use a semantic `<section data-hero-section aria-labelledby="hero-name">`.
- Render `Hi, I'm` as code-native text.
- Render `<h1 id="hero-name" data-hero-name>Dominik Ritz</h1>` once; do not build separate mobile strings.
- Add an empty decorative `[data-name-shine]` overlay and keep the scroll cue code-native.
- Wrap the existing Lottie component in `[data-astronaut-flight]` so GSAP moves the wrapper rather than the Lottie internals.
- Delete `setInterval`, `innerHTML` character appends, manual hidden-element width measurement, and the global scroll listener.

- [ ] **Step 2: Add the hero GSAP context**

Mount from the Astro client script after fonts are ready. Use the exact lifecycle shape:

```ts
import { loadGsap } from "../lib/gsapClient";
import { getSpaceMotionProfile } from "../lib/spaceMotion";

const root = document.querySelector<HTMLElement>("[data-hero-section]");

if (root) {
  let cleanup = () => {};

  document.fonts.ready.then(async () => {
    const { gsap, SplitText } = await loadGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const profile = getSpaceMotionProfile({
      reducedMotion: reduce,
      viewportWidth: window.innerWidth,
    });

    const context = gsap.context(() => {
      if (profile.mode === "reduced") {
        gsap.set("[data-hero-intro], [data-hero-name], [data-scroll-cue]", {
          clearProps: "all",
          autoAlpha: 1,
        });
        return;
      }

      SplitText.create("[data-hero-name]", {
        type: "chars",
        mask: "chars",
        autoSplit: true,
        onSplit(self) {
          const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
          timeline
            .from("[data-hero-intro]", { y: 24, autoAlpha: 0, duration: 0.55 })
            .from(self.chars, {
              yPercent: 115,
              autoAlpha: 0,
              duration: 0.72,
              stagger: profile.heroCharacterStagger,
            }, "-=0.12")
            .fromTo("[data-name-shine]", { xPercent: -140 }, {
              xPercent: 240,
              duration: 0.9,
              ease: "power2.inOut",
            }, "-=0.28")
            .from("[data-astronaut-flight]", {
              xPercent: -60,
              yPercent: 35,
              rotation: -14,
              autoAlpha: 0,
              duration: 1.15,
            }, "<")
            .from("[data-scroll-cue]", { y: -8, autoAlpha: 0, duration: 0.4 });
          return timeline;
        },
      });

      gsap.to("[data-scroll-cue]", {
        y: 9,
        duration: 1.15,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 2.2,
      });

      gsap.to("[data-scroll-cue]", {
        autoAlpha: 0,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "20% top",
          scrub: 0.2,
        },
      });
    }, root);

    cleanup = () => context.revert();
  });

  window.addEventListener("pagehide", () => cleanup(), { once: true });
}
```

Tune coordinates during browser comparison without extending the total intro beyond roughly 2.5 seconds.

- [ ] **Step 3: Make Lottie lifecycle-safe and remove independent travel CSS**

In `LottieInteractive.svelte`:

- Keep Lottie loading in `onMount()`.
- Store the returned animation instance and call `.destroy()` in the onMount cleanup.
- Remove the `slideAndSpin` keyframes and absolute left-to-right travel.
- Keep only responsive sizing for the Lottie canvas; the Hero wrapper owns position, rotation, and travel.
- Set the rendered container to `aria-hidden="true"`.

- [ ] **Step 4: Replace the CSS-drawn ice body with the approved asset**

In `AboutSection.astro`:

- Keep the current section heading, copy, and webring link.
- Use an `<img src="/illustrations/space/ice-frame.png" alt="" data-ice-art />` behind `.about-content`.
- Remove the layered polygon, border, and pseudo-element CSS that attempts to draw the ice.
- Size the frame with `width: min(94vw, 860px)` and reserve a responsive safe inset for the content.
- Keep body text at a maximum readable line length of `62ch`.

- [ ] **Step 5: Replace the manual tilt loop with GSAP**

Use `loadGsap()`, a section-scoped context, and `gsap.matchMedia()`. For `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`, create `quickTo()` setters for `rotateX`, `rotateY`, `x`, and `y`, driven by normalized pointer position. On pointer leave, send every value to zero. Add one ScrollTrigger entrance for the heading/ice and one sweep across `[data-ice-shine]`. Ensure every listener is removed and both the context and matchMedia instance are reverted during cleanup.

- [ ] **Step 6: Apply the accepted global tokens**

Add CSS custom properties to `src/styles/global.css` using the exact palette from the spec. Update the body background to deep navy while retaining the existing fixed radial color atmosphere. Do not remove the Pixi canvas or add a photographic space background.

- [ ] **Step 7: Run unit tests and build**

```bash
pnpm test
pnpm build
```

Expected: tests pass; build succeeds without GSAP SSR errors.

- [ ] **Step 8: Commit Hero and About**

```bash
git add src/components/HeroSection.astro src/components/LottieInteractive.svelte src/components/AboutSection.astro src/styles/global.css
git commit -m "feat: redesign hero and about motion"
```

### Task 4: Rebuild the Experience meteors and scroll timeline

**Files:**
- Modify: `src/components/ExperienceSection.astro`
- Modify: `src/components/Timeline.svelte`

**Interfaces:**
- Consumes: `loadGsap()`, `getSpaceMotionProfile()`, and `getMeteorVariant()` from Task 1.
- Consumes: meteor shells and trail from Task 2.
- Preserves: existing `items` prop and modal interaction contract.

- [ ] **Step 1: Preserve behavior and remove the old visibility animation state**

In `Timeline.svelte`:

- Keep `activeIndex`, `previouslyFocused`, `openModal()`, `closeModal()`, Escape handling, and body scroll locking.
- Remove `visibleItems`, `floatingItems`, the IntersectionObserver, `.is-visible`, `.is-floating`, and associated CSS keyframes/transitions.
- Derive only presentation metadata from `items`, including `side` and `variant: getMeteorVariant(index)`.

- [ ] **Step 2: Add the code-native timeline structure**

Bind the component root and render:

```svelte
<div class="cosmic-stage" bind:this={timelineRoot} data-experience-timeline>
  <svg class="orbit-line" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
    <path class="orbit-line__track" d="M50 0 C5 115 95 210 50 330 C5 450 95 545 50 665 C5 785 95 880 50 1000" />
    <path class="orbit-line__progress" data-timeline-progress pathLength="1" d="M50 0 C5 115 95 210 50 330 C5 450 95 545 50 665 C5 785 95 880 50 1000" />
  </svg>

  {#each cosmicItems as item (item.index)}
    <article
      class="meteor"
      data-meteor
      data-side={item.side}
      data-index={item.index}
      style={`--node:${(item.index / Math.max(cosmicItems.length - 1, 1)) * 100}%`}
    >
      <button
        class="meteor__trigger"
        type="button"
        aria-haspopup="dialog"
        aria-labelledby={`job-${item.index}-title job-${item.index}-company`}
        on:click={(event) => openModal(item.index, event.currentTarget)}
      >
        <span class="sr-only">View details</span>
      </button>
      <img class="meteor__trail" data-meteor-trail src="/illustrations/space/meteor-trail.png" alt="" />
      <img class="meteor__shell" src={`/illustrations/space/meteor-shell-${item.variant}.png`} alt="" />
      <div class="meteor__content">
        <span class="meteor__date">{item.dateRange}</span>
        <h3 class="meteor__title" id={`job-${item.index}-title`}>{item.title}</h3>
        <p class="meteor__company" id={`job-${item.index}-company`}>{item.company}</p>
        {#if item.location}
          <p class="meteor__location">{item.location}</p>
        {/if}
        {#if item.tagline}
          <p class="meteor__tagline">{item.tagline}</p>
        {/if}
        {#if item.skills && item.skills.length > 0}
          <ul class="meteor__skills" aria-label="Key skills">
            {#each item.skills.slice(0, 3) as skill}
              <li>{skill}</li>
            {/each}
            {#if item.skills.length > 3}
              <li>+{item.skills.length - 3} more</li>
            {/if}
          </ul>
        {/if}
        <div class="meteor__cta" aria-hidden="true">
          <span>View details</span>
          <svg class="meteor__cta-icon" viewBox="0 0 16 16" role="presentation">
            <path d="M3 8h8.586l-2.793-2.793L9.5 4.5 14 9l-4.5 4.5-0.707-0.707L11.586 9H3z"></path>
          </svg>
        </div>
      </div>
    </article>
  {/each}
</div>
```

- [ ] **Step 3: Implement the scroll-progress and meteor approach timelines**

In `onMount()`, dynamically load GSAP, create one `gsap.context()` scoped to `timelineRoot`, and use `gsap.matchMedia()`.

Desktop requirements:

- Animate `[data-timeline-progress]` from `strokeDashoffset: 1` to `0` with ScrollTrigger start `"top 70%"`, end `"bottom 65%"`, and `scrub: profile.scrollScrub`.
- For each `[data-meteor]`, create a ScrollTrigger beginning near `"top 82%"` and ending near `"center 58%"`.
- Animate from side-dependent x travel, `y: 90`, `rotation: side * 10`, `scale: 0.84`, and `autoAlpha: 0` through a short MotionPath curve to `x: 0`, `y: 0`, `rotation: 0`, `scale: 1`, and `autoAlpha: 1`.
- Animate `[data-meteor-trail]` from `scaleX: 0.15` and `autoAlpha: 0` to `scaleX: 1` and `autoAlpha: 1` within the same scrubbed timeline.
- Add only a subtle settled inner-shell drift; do not animate the article transform after the scrubbed entrance because that would fight ScrollTrigger.

Compact requirements:

- Keep the progress rail.
- Replace MotionPath with a short `y: 44`, `scale: 0.96`, `autoAlpha: 0` reveal.
- Hide or significantly shorten the trail asset.

Reduced requirements:

- Set every meteor and the completed progress rail visible immediately.
- Do not create ScrollTriggers, ambient motion, or transforms.

Cleanup requirements:

- Revert the GSAP context and matchMedia instance.
- Preserve the existing modal body-class cleanup.

- [ ] **Step 4: Restyle the meteor anatomy and responsive path**

- Use the transparent shell as a full-bleed decorative image with a stable aspect ratio.
- Position `.meteor__content` within the asset's empty inset; maintain readable line length and contrast.
- Alternate cards around the S-curve on desktop.
- Use one column at `max-width: 767px`, keep every job readable, and prevent horizontal overflow.
- Keep the trigger button over the full meteor, a visible focus ring, and the current CTA affordance.
- Match the selected violet/navy/cyan/orange palette; remove the CSS-generated rock gradients and crater pseudo-elements.

- [ ] **Step 5: Polish the existing modal without changing its content contract**

Use the new color tokens and faceted visual language around the existing modal. Keep the overlay, close button, scrollable content, description list, skills, and all current keyboard/click behavior. A short opacity/scale entrance is allowed; it must not delay focus or closing.

- [ ] **Step 6: Verify tests and build**

```bash
pnpm test
pnpm build
```

Expected: all tests pass, all eight jobs render during build, and no Svelte/GSAP SSR errors occur.

- [ ] **Step 7: Commit Experience**

```bash
git add src/components/ExperienceSection.astro src/components/Timeline.svelte
git commit -m "feat: animate experience timeline with GSAP"
```

### Task 5: Coordinate the remaining motion and accessibility polish

**Files:**
- Modify: `src/components/StarField.astro`
- Modify: `src/components/SocialLinks.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `loadGsap()` and shared CSS tokens.
- Produces: one consistent page-wide motion and focus treatment.

- [ ] **Step 1: Smooth only the DOM black-hole cursor with GSAP**

Keep all PixiJS particle and gravity calculations on the Pixi ticker. Replace only the DOM cursor's recursive `requestAnimationFrame(updatePosition)` loop with two `gsap.quickTo()` setters for `x` and `y`, updated by the existing pointer listener. Do not route star positions through GSAP.

- [ ] **Step 2: Keep lightweight interactions in CSS**

Retain CSS transitions for social icon hover/focus color and simple button states. Align colors and focus rings to the shared cyan/violet tokens. Do not convert these micro-interactions into GSAP timelines.

- [ ] **Step 3: Add page-level semantic and metadata polish**

Ensure `index.astro` has one visible `<h1>` through Hero, preserves the current title/favicon, and adds a concise description meta tag based only on existing portfolio content. Do not add new visible hero copy.

- [ ] **Step 4: Verify reduced motion and cleanup manually**

Use browser emulation to confirm reduced motion shows all text and jobs immediately, removes meteor travel/tilt/ambient motion, and does not leave inline transforms after cleanup. Confirm normal mode still keeps native scroll.

- [ ] **Step 5: Run the complete automated checks**

```bash
pnpm test
pnpm build
git diff --check
```

Expected: all commands exit zero with no warnings attributable to changed code.

- [ ] **Step 6: Commit the coordination polish**

```bash
git add src/components/StarField.astro src/components/SocialLinks.astro src/pages/index.astro
git commit -m "refactor: coordinate portfolio motion"
```

### Task 6: Browser verification and blocking design QA

**Files:**
- Create: `design-qa.md`
- Create temporarily: browser screenshots under the Product Design QA workspace; remove temporary project-local captures before handoff.

**Interfaces:**
- Consumes: accepted concept, section-detail references, and built implementation.
- Produces: `design-qa.md` with `final result: passed`.

- [ ] **Step 1: Start the local site and open it in the Codex in-app browser**

Run the Astro development server on a free local port with a persistent terminal session. Open that URL in the in-app browser, not Chrome, unless the in-app browser is unavailable.

- [ ] **Step 2: Verify the primary desktop interaction path**

At `1440 x 1024`:

- Observe the complete hero sequence and confirm the name is readable within roughly 2.5 seconds.
- Scroll down and up through About and all eight experience items; confirm the beam follows scroll, meteor entrances reverse, and no section pins or hijacks the scroll.
- Open a meteor modal, close it by button, reopen it, close by Escape, reopen it, and close by backdrop.
- Confirm focus enters the modal and returns to the triggering meteor.
- Confirm social and webring links remain reachable.
- Check browser console output and record zero uncaught errors.

- [ ] **Step 3: Verify mobile and reduced-motion states**

At `390 x 844`, verify no horizontal overflow, clipped name, unreadable copy, off-screen modal controls, or overlapping social controls. With reduced motion emulated, verify final states are immediately visible and no scrubbed/ambient movement remains.

- [ ] **Step 4: Capture implementation evidence**

Capture:

- Desktop hero at `1440 x 1024`.
- Desktop About at `1440 x 1024`.
- Desktop Experience at a representative viewport/crop that clearly shows the timeline, meteors, and job-card rhythm.
- Mobile hero, About, Experience, and open modal at `390 x 844`.
- A tall full-page desktop screenshot for rhythm comparison with the accepted `971 x 1620` concept.

- [ ] **Step 5: Compare source and implementation together**

Create combined comparison images containing each style reference beside the corresponding implementation screenshot. Inspect the combined images with `view_image`. Evaluate style-system consistency and responsive quality rather than pixel-for-pixel positional fidelity. Evaluate at least:

1. Hero hierarchy and astronaut/name balance.
2. Sora/Montserrat typography, weights, wraps, and line lengths.
3. Navy/cyan/violet/orange palette cohesion.
4. Ice and meteor asset quality, crop, transparency, and inset alignment.
5. S-curve timeline placement, meteor alternation, and section rhythm.
6. Mobile collapse and readability.
7. Real portfolio copy and all eight jobs.

- [ ] **Step 6: Write the first `design-qa.md` result**

Follow the Product Design `design-qa` format. Include reference and implementation paths, viewport, pixel dimensions, state, full-view evidence, focused evidence, findings, five required review surfaces, iteration history, and `final result: blocked` whenever any actionable P0/P1/P2 remains. Record that references are style boards, so layout differences are only defects when they harm hierarchy, responsiveness, usability, or the selected visual language.

- [ ] **Step 7: Fix and recapture until QA passes**

For every P0/P1/P2 finding, make the targeted fix, rerun `pnpm test` and `pnpm build` when code changed, recapture the same state/viewport, compare the combined evidence again, and update the history. Stop only when `design-qa.md` says exactly:

```text
final result: passed
```

- [ ] **Step 8: Run final verification**

```bash
pnpm test
pnpm build
git diff --check
git status --short
```

Read the complete output and record the passing test count, build exit status, diff-check exit status, and remaining expected files.

- [ ] **Step 9: Commit QA evidence**

```bash
git add design-qa.md
git commit -m "test: verify stylized portfolio redesign"
```
