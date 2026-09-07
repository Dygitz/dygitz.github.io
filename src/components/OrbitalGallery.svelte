<script context="module" lang="ts">
  let galleryInstanceCount = 0;
</script>
<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import type { Project } from "../data/projects";
  import ProjectCard from "./ProjectCard.svelte";

  export let projects: Project[] = [];

  type OrbitSlot = "focus" | "front-left" | "front-right" | "back-left" | "back-right" | "hidden";

  interface NodeGeometry {
    slot: OrbitSlot;
    x: string;
    y: string;
    scale: number;
    rotation: number;
    opacity: number;
    depth: number;
  }

  let activeIndex = 0;
  let isReducedMotion = false;
  let isInteracting = false;
  let isHovering = false;
  let isFocusedWithin = false;
  let galleryRegion: HTMLElement | null = null;
  let orbitRegion: HTMLElement | null = null;

  const activeCardId = `orbital-gallery-${++galleryInstanceCount}-active-card`;

  let wheelAccumulator = 0;
  let wheelLocked = false;
  let wheelResetTimeout: ReturnType<typeof setTimeout> | undefined;
  let wheelUnlockTimeout: ReturnType<typeof setTimeout> | undefined;
  let interactionResetTimeout: ReturnType<typeof setTimeout> | undefined;

  let activePointer:
    | {
        id: number;
        startX: number;
        startY: number;
        triggered: boolean;
      }
    | null = null;

  const orbitGeometry: Record<Exclude<OrbitSlot, "hidden">, NodeGeometry> = {
    focus: {
      slot: "focus",
      x: "0%",
      y: "0%",
      scale: 1,
      rotation: 0,
      opacity: 1,
      depth: 5,
    },
    "front-left": {
      slot: "front-left",
      x: "-28%",
      y: "-20%",
      scale: 0.8,
      rotation: -10,
      opacity: 0.8,
      depth: 4,
    },
    "front-right": {
      slot: "front-right",
      x: "28%",
      y: "-20%",
      scale: 0.8,
      rotation: 10,
      opacity: 0.8,
      depth: 4,
    },
    "back-left": {
      slot: "back-left",
      x: "-37%",
      y: "17%",
      scale: 0.58,
      rotation: -16,
      opacity: 0.5,
      depth: 2,
    },
    "back-right": {
      slot: "back-right",
      x: "37%",
      y: "17%",
      scale: 0.58,
      rotation: 16,
      opacity: 0.5,
      depth: 2,
    },
  };

  const hiddenGeometry: NodeGeometry = {
    slot: "hidden",
    x: "0%",
    y: "24%",
    scale: 0.42,
    rotation: 0,
    opacity: 0,
    depth: 1,
  };

  function wrapIndex(index: number, total: number) {
    return (index + total) % total;
  }

  function selectProject(index: number) {
    if (projects.length === 0) return;
    activeIndex = wrapIndex(index, projects.length);
  }

  function moveSelection(delta: number) {
    selectProject(activeIndex + delta);
  }

  function getRelativeOffset(index: number, focusIndex: number, total: number) {
    if (total <= 1) return 0;

    const forward = wrapIndex(index - focusIndex, total);
    return forward > total / 2 ? forward - total : forward;
  }

  function getNodeGeometry(index: number): NodeGeometry {
    if (projects.length === 0) return hiddenGeometry;

    const offset = getRelativeOffset(index, activeIndex, projects.length);

    switch (offset) {
      case 0:
        return orbitGeometry.focus;
      case -1:
        return orbitGeometry["front-left"];
      case 1:
        return orbitGeometry["front-right"];
      case -2:
        return orbitGeometry["back-left"];
      case 2:
        return orbitGeometry["back-right"];
      default:
        return hiddenGeometry;
    }
  }

  function getNodeStyle(index: number) {
    const geometry = getNodeGeometry(index);

    return `
      --x: ${geometry.x};
      --y: ${geometry.y};
      --scale: ${geometry.scale};
      --rotation: ${geometry.rotation}deg;
      --opacity: ${geometry.opacity};
      --depth: ${geometry.depth};
    `;
  }

  function pulseInteraction(duration = 220) {
    clearTimeout(interactionResetTimeout);
    isInteracting = true;

    interactionResetTimeout = setTimeout(() => {
      isInteracting = false;
    }, duration);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (projects.length < 2) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveSelection(-1);
      pulseInteraction();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveSelection(1);
      pulseInteraction();
    }
  }

  function handleWheel(event: WheelEvent) {
    if (projects.length < 2) return;

    const dominantDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

    if (Math.abs(dominantDelta) < 6) return;

    clearTimeout(wheelResetTimeout);
    wheelResetTimeout = setTimeout(() => {
      wheelAccumulator = 0;
    }, 140);

    if (wheelLocked) return;

    wheelAccumulator += dominantDelta;

    if (Math.abs(wheelAccumulator) < 28) return;

    moveSelection(wheelAccumulator > 0 ? 1 : -1);
    wheelAccumulator = 0;
    wheelLocked = true;
    pulseInteraction(260);

    clearTimeout(wheelUnlockTimeout);
    wheelUnlockTimeout = setTimeout(() => {
      wheelLocked = false;
    }, 260);
  }

  function handlePointerDown(event: PointerEvent) {
    if (projects.length < 2 || !event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    activePointer = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      triggered: false,
    };

    isInteracting = true;
    orbitRegion?.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent) {
    if (!activePointer || event.pointerId !== activePointer.id || activePointer.triggered) return;

    const deltaX = event.clientX - activePointer.startX;
    const deltaY = event.clientY - activePointer.startY;

    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    moveSelection(deltaX > 0 ? -1 : 1);
    activePointer.triggered = true;
    pulseInteraction(260);
  }

  function finishPointerInteraction(pointerId?: number) {
    if (!activePointer) return;
    if (typeof pointerId === "number" && pointerId !== activePointer.id) return;

    if (orbitRegion?.hasPointerCapture(activePointer.id)) {
      orbitRegion.releasePointerCapture(activePointer.id);
    }

    activePointer = null;
    pulseInteraction(160);
  }

  function handlePointerUp(event: PointerEvent) {
    finishPointerInteraction(event.pointerId);
  }

  function handlePointerCancel(event: PointerEvent) {
    finishPointerInteraction(event.pointerId);
  }

  function handlePointerEnter() {
    isHovering = true;
  }

  function handlePointerLeave() {
    isHovering = false;

    if (!activePointer) {
      clearTimeout(interactionResetTimeout);
      isInteracting = false;
    }
  }

  function handleFocusIn() {
    isFocusedWithin = true;
  }

  function handleFocusOut(event: FocusEvent) {
    const nextTarget = event.relatedTarget as Node | null;

    if (galleryRegion && nextTarget && galleryRegion.contains(nextTarget)) return;

    isFocusedWithin = false;
  }

  $: if (projects.length === 0) {
    activeIndex = 0;
  } else {
    activeIndex = wrapIndex(activeIndex, projects.length);
  }

  $: activeProject = projects[activeIndex];
  $: liveAnnouncement = activeProject ? `Selected project: ${activeProject.title}` : "";
  $: isIdleMotionPaused = isReducedMotion || isHovering || isFocusedWithin || isInteracting;

  onMount(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = (event: MediaQueryList | MediaQueryListEvent) => {
      isReducedMotion = event.matches;
    };

    syncReducedMotion(mediaQuery);

    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", syncReducedMotion);
    } else {
      mediaQuery.addListener(syncReducedMotion);
    }

    if (orbitRegion) {
      orbitRegion.addEventListener("wheel", handleWheel, { passive: true });
      orbitRegion.addEventListener("pointerdown", handlePointerDown);
      orbitRegion.addEventListener("pointermove", handlePointerMove);
      orbitRegion.addEventListener("pointerup", handlePointerUp);
      orbitRegion.addEventListener("pointercancel", handlePointerCancel);
      orbitRegion.addEventListener("pointerenter", handlePointerEnter);
      orbitRegion.addEventListener("pointerleave", handlePointerLeave);
    }

    return () => {
      if ("removeEventListener" in mediaQuery) {
        mediaQuery.removeEventListener("change", syncReducedMotion);
      } else {
        mediaQuery.removeListener(syncReducedMotion);
      }

      if (orbitRegion) {
        orbitRegion.removeEventListener("wheel", handleWheel);
        orbitRegion.removeEventListener("pointerdown", handlePointerDown);
        orbitRegion.removeEventListener("pointermove", handlePointerMove);
        orbitRegion.removeEventListener("pointerup", handlePointerUp);
        orbitRegion.removeEventListener("pointercancel", handlePointerCancel);
        orbitRegion.removeEventListener("pointerenter", handlePointerEnter);
        orbitRegion.removeEventListener("pointerleave", handlePointerLeave);
      }

      clearTimeout(wheelResetTimeout);
      clearTimeout(wheelUnlockTimeout);
      clearTimeout(interactionResetTimeout);
    };
  });

  onDestroy(() => {
    clearTimeout(wheelResetTimeout);
    clearTimeout(wheelUnlockTimeout);
    clearTimeout(interactionResetTimeout);
  });
</script>

{#if projects.length === 0}
  <section class="orbital-gallery orbital-gallery--empty" aria-label="Orbital project gallery">
    <p class="orbital-gallery__empty-copy">No missions have been added yet.</p>
  </section>
{:else}
  <section
    class="orbital-gallery"
    bind:this={galleryRegion}
    aria-label="Orbital project gallery"
    on:keydown={handleKeydown}
    on:focusin={handleFocusIn}
    on:focusout={handleFocusOut}
  >
    <p class="orbital-gallery__sr-only" aria-live="polite" aria-atomic="true">{liveAnnouncement}</p>

    <div
      class="orbital-gallery__stage"
      bind:this={orbitRegion}
      data-paused={isIdleMotionPaused}
      tabindex="0"
      role="group"
      aria-label="Project orbit navigation"
    >
      <div class="orbital-gallery__rings" aria-hidden="true">
        <span class="orbital-gallery__ring orbital-gallery__ring--outer"></span>
        <span class="orbital-gallery__ring orbital-gallery__ring--inner"></span>
      </div>

      <div class="orbital-gallery__well" aria-hidden="true">
        <span class="orbital-gallery__well-core"></span>
        <span class="orbital-gallery__well-halo"></span>
        <span class="orbital-gallery__well-label">Event Horizon</span>
      </div>

      {#each projects as project, index}
        {@const geometry = getNodeGeometry(index)}
        {@const isActive = index === activeIndex}
        {@const isHidden = geometry.slot === "hidden"}
        <button
          type="button"
          class:selected={isActive}
          class="mission-node"
          data-slot={geometry.slot}
          style={getNodeStyle(index)}
          aria-label={`Select project: ${project.title}`}
          aria-pressed={isActive}
          aria-controls={activeCardId}
          aria-hidden={isHidden ? "true" : undefined}
          tabindex={isHidden ? -1 : undefined}
          inert={isHidden}
          disabled={isHidden}
          title={project.title}
          on:click={() => {
            selectProject(index);
            pulseInteraction();
          }}
        >
          <span class="mission-node__index">Mission {String(index + 1).padStart(2, "0")}</span>
          <span class="mission-node__title">{project.title}</span>
        </button>
      {/each}
    </div>

    <div class="orbital-gallery__card" id={activeCardId}>
      <ProjectCard project={activeProject} missionNumber={activeIndex + 1} missionTotal={projects.length} />
    </div>
  </section>
{/if}

<style>
  .orbital-gallery {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 1.05fr);
    gap: 1.5rem;
    align-items: stretch;
  }

  .orbital-gallery--empty {
    grid-template-columns: 1fr;
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 1.75rem;
    background: linear-gradient(180deg, rgba(11, 10, 22, 0.92), rgba(5, 7, 15, 0.96));
    padding: 1.75rem;
    color: rgba(226, 232, 240, 0.82);
  }

  .orbital-gallery__empty-copy {
    margin: 0;
    line-height: 1.6;
  }

  .orbital-gallery__stage {
    position: relative;
    min-height: 31rem;
    overflow: hidden;
    border: 1px solid rgba(103, 232, 249, 0.18);
    border-radius: 2rem;
    background:
      radial-gradient(circle at 50% 46%, rgba(192, 132, 252, 0.18), transparent 18%),
      radial-gradient(circle at 18% 18%, rgba(34, 211, 238, 0.12), transparent 26%),
      radial-gradient(circle at 82% 78%, rgba(244, 114, 182, 0.12), transparent 24%),
      linear-gradient(180deg, rgba(7, 10, 19, 0.94), rgba(2, 6, 23, 0.98));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 1.25rem 3rem rgba(2, 6, 23, 0.45);
    isolation: isolate;
    outline: none;
    touch-action: pan-y pinch-zoom;
  }

  .orbital-gallery__stage:focus-visible {
    box-shadow:
      0 0 0 3px rgba(103, 232, 249, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 1.25rem 3rem rgba(2, 6, 23, 0.45);
  }

  .orbital-gallery__stage::before {
    content: "";
    position: absolute;
    inset: 1.1rem;
    border-radius: 1.45rem;
    border: 1px solid rgba(255, 255, 255, 0.04);
    pointer-events: none;
  }

  .orbital-gallery__rings,
  .orbital-gallery__well-halo {
    animation-play-state: running;
  }

  .orbital-gallery__stage[data-paused="true"] .orbital-gallery__rings,
  .orbital-gallery__stage[data-paused="true"] .orbital-gallery__well-halo {
    animation-play-state: paused;
  }

  .orbital-gallery__rings {
    position: absolute;
    inset: 0;
    animation: orbital-drift 18s linear infinite;
    pointer-events: none;
  }

  .orbital-gallery__ring {
    position: absolute;
    left: 50%;
    top: 47%;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 1px rgba(103, 232, 249, 0.04);
  }

  .orbital-gallery__ring--outer {
    width: min(88%, 28rem);
    height: 14rem;
  }

  .orbital-gallery__ring--inner {
    width: min(58%, 18rem);
    height: 9rem;
    border-color: rgba(167, 139, 250, 0.18);
    transform: translate(-50%, -50%) rotate(-12deg);
  }

  .orbital-gallery__well {
    position: absolute;
    left: 50%;
    top: 47%;
    width: 10rem;
    height: 10rem;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .orbital-gallery__well-core,
  .orbital-gallery__well-halo {
    position: absolute;
    inset: 50%;
    transform: translate(-50%, -50%);
    border-radius: 999px;
  }

  .orbital-gallery__well-core {
    width: 4.75rem;
    height: 4.75rem;
    background:
      radial-gradient(circle at 35% 30%, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.98) 54%),
      radial-gradient(circle at 62% 62%, rgba(244, 114, 182, 0.18), transparent 68%);
    box-shadow:
      0 0 0 1px rgba(34, 211, 238, 0.18),
      0 0 2.5rem rgba(168, 85, 247, 0.24),
      inset 0 0.2rem 1rem rgba(255, 255, 255, 0.06);
  }

  .orbital-gallery__well-halo {
    width: 9rem;
    height: 9rem;
    background:
      radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(168, 85, 247, 0.08) 34%, transparent 68%);
    filter: blur(4px);
    animation: orbital-drift 14s linear infinite reverse;
  }

  .orbital-gallery__well-label {
    position: absolute;
    left: 50%;
    bottom: -0.3rem;
    transform: translateX(-50%);
    border-radius: 999px;
    border: 1px solid rgba(34, 211, 238, 0.2);
    background: rgba(7, 10, 19, 0.8);
    padding: 0.4rem 0.8rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(244, 114, 182, 0.92);
    white-space: nowrap;
  }

  .mission-node {
    position: absolute;
    left: calc(50% + var(--x));
    top: calc(47% + var(--y));
    z-index: var(--depth);
    display: grid;
    gap: 0.3rem;
    width: min(11rem, calc(100% - 2.5rem));
    border: 1px solid rgba(148, 163, 184, 0.22);
    border-radius: 1.2rem;
    background: rgba(15, 23, 42, 0.78);
    padding: 0.78rem 0.9rem;
    color: rgba(248, 250, 252, 0.9);
    text-align: left;
    cursor: pointer;
    opacity: var(--opacity);
    transform: translate(-50%, -50%) scale(var(--scale)) rotate(var(--rotation));
    box-shadow:
      0 1rem 2rem rgba(2, 6, 23, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
    transition:
      left 240ms ease,
      top 240ms ease,
      transform 240ms ease,
      opacity 180ms ease,
      box-shadow 180ms ease,
      border-color 180ms ease,
      background-color 180ms ease;
  }

  .mission-node:hover {
    border-color: rgba(103, 232, 249, 0.48);
    box-shadow:
      0 1.2rem 2.4rem rgba(2, 6, 23, 0.36),
      0 0 0 1px rgba(103, 232, 249, 0.1);
  }

  .mission-node:focus-visible {
    outline: 3px solid rgba(103, 232, 249, 0.9);
    outline-offset: 3px;
  }

  .mission-node.selected {
    border-color: rgba(196, 181, 253, 0.62);
    background:
      linear-gradient(135deg, rgba(34, 211, 238, 0.16), rgba(168, 85, 247, 0.2)),
      rgba(15, 23, 42, 0.92);
    box-shadow:
      0 1.5rem 3rem rgba(2, 6, 23, 0.42),
      0 0 0 1px rgba(196, 181, 253, 0.14),
      0 0 2.2rem rgba(168, 85, 247, 0.18);
  }

  .mission-node[data-slot="hidden"] {
    pointer-events: none;
  }

  .mission-node__index {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(103, 232, 249, 0.88);
  }

  .mission-node__title {
    display: block;
    overflow: hidden;
    font-size: 0.96rem;
    font-weight: 700;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .orbital-gallery__card {
    min-width: 0;
    align-self: center;
  }

  .orbital-gallery__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes orbital-drift {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 960px) {
    .orbital-gallery {
      grid-template-columns: 1fr;
    }

    .orbital-gallery__card {
      order: -1;
    }

    .orbital-gallery__stage {
      min-height: 15.5rem;
    }

    .orbital-gallery__rings {
      display: none;
    }

    .orbital-gallery__well {
      width: 7rem;
      height: 7rem;
      opacity: 0.72;
    }

    .orbital-gallery__well-core {
      width: 3.5rem;
      height: 3.5rem;
    }

    .orbital-gallery__well-halo {
      width: 6.5rem;
      height: 6.5rem;
    }

    .orbital-gallery__well-label {
      display: none;
    }

    .mission-node {
      width: min(9rem, calc(100% - 1.75rem));
      padding: 0.7rem 0.8rem;
    }

    .mission-node[data-slot="focus"] {
      --x: 0%;
      --y: 19%;
      --scale: 1;
    }

    .mission-node[data-slot="front-left"] {
      --x: -29%;
      --y: 19%;
      --scale: 0.58;
      --rotation: 0deg;
    }

    .mission-node[data-slot="front-right"] {
      --x: 29%;
      --y: 19%;
      --scale: 0.58;
      --rotation: 0deg;
    }

    .mission-node[data-slot="back-left"] {
      --x: -41%;
      --y: 21%;
      --scale: 0.34;
      --rotation: 0deg;
      --opacity: 0.42;
    }

    .mission-node[data-slot="back-right"] {
      --x: 41%;
      --y: 21%;
      --scale: 0.34;
      --rotation: 0deg;
      --opacity: 0.42;
    }

    .mission-node[data-slot="back-left"] .mission-node__title,
    .mission-node[data-slot="back-right"] .mission-node__title {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .orbital-gallery__rings,
    .orbital-gallery__well-halo {
      animation: none;
    }

    .mission-node,
    .orbital-gallery__stage {
      transition:
        opacity 140ms ease,
        box-shadow 140ms ease,
        border-color 140ms ease,
        background-color 140ms ease;
    }
  }
</style>
