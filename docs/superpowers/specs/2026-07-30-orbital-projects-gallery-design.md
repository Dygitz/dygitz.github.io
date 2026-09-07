# Orbital Projects Gallery Design

Date: 2026-07-30

## Summary

Add an immersive projects section to the portfolio using an orbital gallery. Five featured projects appear as planets around a central focus point. Selecting a project pulls it into an Event Horizon-style mission card while the other projects recede. The card stays concise and sends visitors to the project’s live demo.

The section will extend the existing astronaut, animated starfield, gradient, and black-hole cursor language without adding another rendering canvas or embedding external demos.

## Goals

- Make projects the most visually memorable section after the hero.
- Use the existing space theme as interaction, not only decoration.
- Surface live demo links with a clear primary action.
- Keep project information scannable: title, category, impact, technologies, and links.
- Work on desktop, mobile, keyboard navigation, touch input, and reduced-motion settings.
- Keep the first version focused and maintainable within the existing Astro + Svelte structure.

## Non-goals

- Embedded live-demo iframes.
- Full case-study pages or long project descriptions inside the card.
- Project filters, search, CMS integration, analytics, or remote project data.
- A second PixiJS canvas or a new animation/rendering dependency.

## Placement and visual language

Place the section after About and before Experience in `src/pages/index.astro`. Use a clear `Projects` section heading with mission language in the interface, such as `Mission 01 / 05` and `Launch Demo`.

The visual treatment is Event Horizon:

- Near-black card surfaces that visually connect to the black-hole cursor.
- Violet singularity glow as the primary selected-state accent.
- Cyan and pink highlights for telemetry, links, and project-specific accents.
- Subtle radial gradients, thin orbital lines, and a restrained glass/frost edge highlight.
- Strong contrast between the dark card and light text; decorative glows must not carry meaning alone.

The orbit should feel dimensional without becoming a competing hero animation. The focused card is the visual anchor; orbiting planets remain recognizable but secondary.

## User experience

### Default state

When the section enters the viewport, the orbit is visible with five project nodes and one active project in the center card. The orbit may rotate slowly while idle, but it must pause while the user hovers, focuses, drags, or selects.

### Selecting a project

Users can select a project by clicking its planet, scrolling through the section, using left/right arrow keys, or swiping on touch devices. Selection advances one project at a time and animates the chosen planet toward the focus position. The focused project card expands while non-selected planets dim and move farther from the center.

The existing black-hole cursor may apply a subtle gravitational pull to nearby planets on desktop. This is ambient feedback only; selecting a project must never require a pointer or cursor effect.

### Focused mission card

The card contains:

- Project title.
- Category or role label.
- One concise impact statement.
- Three or four technology tags.
- Primary `Launch Demo` link.
- Optional secondary GitHub link.
- Mission position indicator, such as `Mission 03 / 05`.

The live demo opens in a new tab using `rel="noopener noreferrer"`. The portfolio page does not depend on the external demo loading successfully.

### Responsive behavior

On desktop, planets follow elliptical orbital paths around the focused card. On mobile, the same state model becomes a swipeable carousel: the active card occupies most of the viewport, with smaller orbit markers or neighboring project glimpses preserving the planetary metaphor.

### Motion and reduced motion

Use CSS/Svelte transitions for position, scale, opacity, and glow. Avoid continuous motion during active interaction. With `prefers-reduced-motion: reduce`, keep the orbit static and replace movement with short fades and state changes.

## Component and data design

### Data

Create `src/data/projects.ts` with a typed project model:

```ts
export interface Project {
  id: string;
  title: string;
  category: string;
  impact: string;
  technologies: string[];
  demoUrl: string;
  githubUrl?: string;
  accent?: "violet" | "cyan" | "pink" | "teal";
}
```

The initial data set contains exactly five featured projects. Project content remains static and local to the repository.

### Components

- `src/components/ProjectsSection.astro` — section wrapper, heading, and project data boundary.
- `src/components/OrbitalGallery.svelte` — active index, orbital positions, selection events, keyboard navigation, touch gestures, and motion state.
- `src/components/ProjectCard.svelte` — evolve the existing unused component into the Event Horizon focused mission card.

Pass the typed project list from `index.astro` into `ProjectsSection.astro`, then into `OrbitalGallery.svelte`. Keep the card presentational: it receives the active project and renders normal anchors rather than owning gallery state.

Use regular DOM elements and CSS transforms for the orbit. The existing PixiJS starfield remains a background layer; no second canvas is needed.

## Accessibility and failure behavior

- Use a semantic `section` with a heading and a labeled project navigation region.
- Give each planet a visible or screen-reader-accessible project name.
- Support keyboard focus, left/right selection, Enter/Space activation, and an obvious focus ring.
- Expose the active project with `aria-selected` or an equivalent state and announce changes through a concise live region.
- Keep all link text meaningful without relying on color or iconography.
- Hide the GitHub button when no GitHub URL exists.
- Hide the demo action and retain the project information if a project has no demo URL.
- If the project list is empty, render a calm fallback message instead of an empty interactive canvas.
- Keep all external URLs local to the data file; there is no runtime fetch or network error state.

## Verification

Run `pnpm build` after implementation.

Perform a manual pass for:

1. Desktop orbit selection by pointer, wheel, and arrow keys.
2. Focused card content and external demo/GitHub links.
3. Mobile swipe behavior and readable card layout.
4. Keyboard-only navigation with visible focus styling.
5. Reduced-motion behavior.
6. Empty/optional-link data cases.
7. Visual continuity with the existing starfield, black-hole cursor, About card, and Experience timeline.

## Acceptance criteria

- The page includes a Projects section between About and Experience.
- Five project nodes orbit a central focus state on desktop.
- Selecting a node reliably updates the Event Horizon mission card.
- The card presents concise project information and a working live-demo action.
- The interaction is usable with pointer, keyboard, and touch input.
- Reduced-motion mode removes continuous orbit animation.
- `pnpm build` succeeds without adding a new rendering dependency.
