<script>
  import { onDestroy, onMount, tick } from "svelte";
  import { loadGsap } from "../lib/gsapClient";
  import {
    closeModalDialog,
    restoreDialogTrigger,
    showModalDialog,
  } from "../lib/modalDialog";
  import {
    getMeteorScrollEnd,
    getMeteorVariant,
    getSpaceMotionProfile,
  } from "../lib/spaceMotion";
  import {
    getOrbitGeometry,
    getOrbitNodeYRadius,
  } from "../lib/timelineGeometry";
  import { getViewportGlowWindow } from "../lib/viewportGlow";

  export let items = [
    {
      dateRange: "2021 - Current",
      title: "Job 4",
      company: "Company 4",
      description: "Customer Success Representative.",
      location: "Remote",
      tagline: "Growth Team",
      skills: ["Skill one", "Skill two", "Skill three"],
    },
    {
      dateRange: "2019 - 2021",
      title: "Job 3",
      company: "Company 3",
      description: "Project Management, System Administrator.",
      location: "Austin, TX · Hybrid",
      tagline: "Program Management",
      skills: ["Leadership", "Communication"],
    },
    {
      dateRange: "2018 - 2019",
      title: "Job 2",
      company: "Company 2",
      description: "Support Specialist.",
      location: "Toronto, Canada",
      tagline: "Support Team",
      skills: ["Customer Support"],
    },
    {
      dateRange: "2017 - 2018",
      title: "Job 1",
      company: "Company 1",
      description: "Debugging, Code QA.",
      location: "On-site",
      tagline: "Quality Assurance",
      skills: ["QA Testing"],
    },
  ];

  let cosmicItems = [];
  let activeIndex = null;
  let previouslyFocused = null;
  let modalDialog;
  let modalCloseButton;
  let timelineRoot;

  $: cosmicItems = items.map((item, index) => ({
    ...item,
    index,
    side: index % 2 === 0 ? "left" : "right",
    variant: getMeteorVariant(index),
  }));

  $: orbitGeometry = getOrbitGeometry(cosmicItems.length);

  $: activeItem =
    activeIndex !== null && cosmicItems[activeIndex] ? cosmicItems[activeIndex] : null;

  $: if (typeof document !== "undefined") {
    if (activeItem) {
      document.body.classList.add("modal-open");
      tick().then(() => {
        if (activeItem && showModalDialog(modalDialog) && modalCloseButton) {
          modalCloseButton.focus();
        }
      });
    } else {
      document.body.classList.remove("modal-open");
    }
  }

  onMount(() => {
    let active = true;
    let animationContext;
    let motionMedia;
    let orbitResizeObserver;
    let refreshFrame = 0;
    let resizeFrame = 0;

    const initializeTimeline = async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      await document.fonts.ready;

      if (!active || !timelineRoot) return;

      const root = timelineRoot;
      const orbit = root.querySelector(".orbit-line");
      const glowGradient = root.querySelector("[data-orbit-glow-gradient]");
      let orbitTop = 0;
      let orbitHeight = 0;
      let viewportHeight = window.innerHeight;

      const syncViewportGlow = (scrollTop = window.scrollY) => {
        if (!glowGradient) return;
        const { start, end } = getViewportGlowWindow({
          scrollTop,
          orbitTop,
          orbitHeight,
          viewportHeight,
        });
        glowGradient.setAttribute("y1", String(start));
        glowGradient.setAttribute("y2", String(end));
      };

      const refreshViewportGlow = () => {
        if (!orbit) return;
        const bounds = orbit.getBoundingClientRect();
        orbitTop = bounds.top + window.scrollY;
        orbitHeight = bounds.height;
        viewportHeight = window.innerHeight;
        syncViewportGlow();
      };

      const syncOrbitNodeAspect = () => {
        if (!orbit) return;

        const bounds = orbit.getBoundingClientRect();
        const yRadius = getOrbitNodeYRadius({
          svgWidth: bounds.width,
          svgHeight: bounds.height,
          xRadius: 4.6,
        });

        root.querySelectorAll("[data-orbit-node]").forEach((node) => {
          node.setAttribute("ry", String(yRadius));
        });
      };

      syncOrbitNodeAspect();
      if (orbit && typeof ResizeObserver !== "undefined") {
        orbitResizeObserver = new ResizeObserver(() => {
          if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
          resizeFrame = window.requestAnimationFrame(() => {
            syncOrbitNodeAspect();
            refreshViewportGlow();
          });
        });
        orbitResizeObserver.observe(orbit);
      }

      animationContext = gsap.context(() => {
        refreshViewportGlow();
        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => syncViewportGlow(self.scroll()),
          onRefresh: refreshViewportGlow,
        });

        motionMedia = gsap.matchMedia();
        motionMedia.add(
          {
            isDesktop: "(min-width: 768px)",
            isCompact: "(max-width: 767px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
          },
          (context) => {
            const { isDesktop, reduceMotion } = context.conditions;
            const profile = getSpaceMotionProfile({
              reducedMotion: reduceMotion === true,
              viewportWidth: window.innerWidth,
            });
            const meteors = Array.from(root.querySelectorAll("[data-meteor]"));
            const nodes = Array.from(root.querySelectorAll("[data-orbit-node]"));

            if (profile.mode === "reduced") {
              meteors.forEach((meteor) => {
                const trail = meteor.querySelector("[data-meteor-trail]");
                gsap.set(meteor, { autoAlpha: 1, clearProps: "transform" });
                if (trail) {
                  gsap.set(trail, { autoAlpha: 0.72, clearProps: "transform" });
                }
              });
              gsap.set(nodes, {
                autoAlpha: 1,
                clearProps: "transform",
              });
              return;
            }

            meteors.forEach((meteor, index) => {
              const direction = meteor.dataset.side === "left" ? -1 : 1;
              const trail = meteor.querySelector("[data-meteor-trail]");
              const shellDrift = meteor.querySelector("[data-meteor-shell-drift]");
              const node = nodes[index];
              const entrance = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: meteor,
                  start: "top 82%",
                  end: getMeteorScrollEnd(),
                  scrub: profile.scrollScrub,
                },
              });

              if (isDesktop) {
                const travel = direction * profile.meteorTravel;
                entrance.fromTo(
                  meteor,
                  {
                    x: travel,
                    y: 90,
                    rotation: direction * 10,
                    scale: 0.84,
                    autoAlpha: 0,
                  },
                  {
                    motionPath: {
                      path: [
                        { x: travel, y: 90 },
                        { x: travel * 0.45, y: 30 },
                        { x: 0, y: 0 },
                      ],
                      curviness: 1.25,
                      autoRotate: false,
                    },
                    rotation: 0,
                    scale: 1,
                    autoAlpha: 1,
                    duration: 1,
                  },
                  0,
                );

                if (trail) {
                  entrance.fromTo(
                    trail,
                    { scaleX: 0.15, autoAlpha: 0 },
                    { scaleX: 1, autoAlpha: 0.92, duration: 0.68 },
                    0.12,
                  );
                }

                if (node) {
                  entrance.fromTo(
                    node,
                    { scale: 0.55, autoAlpha: 0.28 },
                    {
                      scale: 1,
                      autoAlpha: 1,
                      transformOrigin: "50% 50%",
                      duration: 0.42,
                    },
                    0.48,
                  );
                }

                if (profile.ambientMotion && shellDrift) {
                  gsap.to(shellDrift, {
                    y: -3,
                    rotation: direction * 0.55,
                    duration: 3.8 + (index % 3) * 0.45,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                  });
                }
              } else {
                entrance.fromTo(
                  meteor,
                  { y: 44, scale: 0.96, autoAlpha: 0 },
                  { y: 0, scale: 1, autoAlpha: 1, duration: 1 },
                  0,
                );

                if (trail) {
                  entrance.fromTo(
                    trail,
                    { scaleX: 0.15, autoAlpha: 0 },
                    { scaleX: 1, autoAlpha: 0.42, duration: 0.52 },
                    0.18,
                  );
                }
                if (node) {
                  entrance.fromTo(
                    node,
                    { scale: 0.7, autoAlpha: 0.35 },
                    {
                      scale: 1,
                      autoAlpha: 1,
                      transformOrigin: "50% 50%",
                      duration: 0.42,
                    },
                    0.5,
                  );
                }
              }
            });
          },
          root,
        );
      }, root);

      refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    void initializeTimeline();

    return () => {
      active = false;
      if (refreshFrame) {
        window.cancelAnimationFrame(refreshFrame);
      }
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }
      orbitResizeObserver?.disconnect();
      motionMedia?.revert();
      animationContext?.revert();
    };
  });

  onDestroy(() => {
    if (typeof document !== "undefined") {
      closeModalDialog(modalDialog);
      document.body.classList.remove("modal-open");
    }
  });

  function openModal(index, trigger) {
    if (typeof HTMLElement !== "undefined" && trigger instanceof HTMLElement) {
      previouslyFocused = trigger;
    } else {
      previouslyFocused = null;
    }
    activeIndex = index;
  }

  function closeModal() {
    const trigger = previouslyFocused;
    previouslyFocused = null;
    closeModalDialog(modalDialog);
    activeIndex = null;
    restoreDialogTrigger(trigger);
  }

  function handleDialogCancel(event) {
    event.preventDefault();
    closeModal();
  }
</script>

<div class="cosmic-stage" bind:this={timelineRoot} data-experience-timeline>
  <svg class="orbit-line" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="experience-glow-fade" data-orbit-glow-gradient gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="1000">
        <stop offset="0" stop-color="white" stop-opacity="0" />
        <stop offset="0.18" stop-color="white" stop-opacity="0.42" />
        <stop offset="0.38" stop-color="white" stop-opacity="1" />
        <stop offset="0.62" stop-color="white" stop-opacity="1" />
        <stop offset="0.82" stop-color="white" stop-opacity="0.42" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
      <mask id="experience-glow-mask" maskUnits="userSpaceOnUse" x="-100" y="-10" width="300" height="1020">
        <rect x="-100" y="-10" width="300" height="1020" fill="url(#experience-glow-fade)" />
      </mask>
    </defs>
    <path
      class="orbit-line__track"
      d={orbitGeometry.path}
    />
    <g mask="url(#experience-glow-mask)">
      <path
        class="orbit-line__progress"
        data-timeline-progress
        d={orbitGeometry.path}
      />
      {#each orbitGeometry.nodes as node, index}
        <ellipse
          class="orbit-line__node"
          data-orbit-node
          data-index={index}
          cx={node.x}
          cy={node.y}
          rx="4.6"
          ry="2"
        />
      {/each}
    </g>
  </svg>

  {#each cosmicItems as item (item.index)}
    <article
      class="meteor"
      data-meteor
      data-side={item.side}
      data-index={item.index}
      data-variant={item.variant}
    >
      <picture
        class="meteor__trail"
        data-meteor-trail
      >
        <source
          srcset="/illustrations/space/meteor-trail.avif"
          type="image/avif"
        />
        <img
          class="meteor__trail-art"
          src="/illustrations/space/meteor-trail.png"
          width="2172"
          height="724"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div class="meteor__body" data-meteor-shell-drift>
        <picture
          class="meteor__shell"
        >
          <source
            srcset={`/illustrations/space/meteor-shell-${item.variant}.avif`}
            type="image/avif"
          />
          <img
            class="meteor__shell-art"
            src={`/illustrations/space/meteor-shell-${item.variant}.png`}
            width="1448"
            height="1086"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div class="meteor__content">
          <span class="meteor__date">{item.card?.date ?? item.dateRange}</span>
          <h3 class="meteor__title" id={`job-${item.index}-title`}>
            <span class="meteor__copy-full">{item.card?.title ?? item.title}</span>
            <span class="meteor__copy-compact">{item.card?.compactTitle ?? item.title}</span>
          </h3>
          <p class="meteor__company" id={`job-${item.index}-company`}>
            <span class="meteor__copy-full">{item.card?.company ?? item.company}</span>
            <span class="meteor__copy-compact">{item.card?.compactCompany ?? item.card?.company ?? item.company}</span>
          </p>
          <button
            class="meteor__cta"
            type="button"
            aria-haspopup="dialog"
            aria-labelledby={`job-${item.index}-cta job-${item.index}-title job-${item.index}-company`}
            on:click={(event) => openModal(item.index, event.currentTarget)}
          >
            <span id={`job-${item.index}-cta`}>
              <span class="meteor__copy-full">View details</span>
              <span class="meteor__copy-compact">Details</span>
            </span>
            <svg class="meteor__cta-icon" viewBox="0 0 16 16" role="presentation">
              <path d="M3 8h8.586l-2.793-2.793L9.5 4.5 14 9l-4.5 4.5-0.707-0.707L11.586 9H3z"></path>
            </svg>
          </button>
        </div>
      </div>
    </article>
  {/each}
</div>

{#if activeItem}
  <dialog
    class="experience-modal-overlay"
    aria-labelledby={`modal-job-${activeItem.index}-title`}
    bind:this={modalDialog}
    on:cancel={handleDialogCancel}
    on:click|self={closeModal}
  >
    <div
      class="experience-modal"
      id="experience-modal"
    >
      <button
        class="modal__close"
        type="button"
        on:click={closeModal}
        aria-label="Close experience details"
        bind:this={modalCloseButton}
      >
        <span aria-hidden="true">×</span>
      </button>
      <header class="modal__header">
        <span class="modal__date">{activeItem.dateRange}</span>
        <h3 class="modal__title" id={`modal-job-${activeItem.index}-title`}>{activeItem.title}</h3>
        <p class="modal__company">{activeItem.company}</p>
        {#if activeItem.location}
          <p class="modal__location">{activeItem.location}</p>
        {/if}
        {#if activeItem.tagline}
          <p class="modal__tagline">{activeItem.tagline}</p>
        {/if}
      </header>
      {#if activeItem.description}
        {#if Array.isArray(activeItem.description)}
          <ul class="modal__description-list">
            {#each activeItem.description as bullet}
              <li>{bullet}</li>
            {/each}
          </ul>
        {:else}
          <p class="modal__description">{activeItem.description}</p>
        {/if}
      {/if}
      {#if activeItem.skills && activeItem.skills.length > 0}
        <div class="modal__skills">
          <h4>Skills</h4>
          <ul>
            {#each activeItem.skills as skill}
              <li>{skill}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </dialog>
{/if}

<style>
  .cosmic-stage {
    position: relative;
    width: min(1160px, 100%);
    margin: 0 auto;
    padding: clamp(3rem, 6vw, 5rem) 1rem clamp(6rem, 9vw, 9rem);
    isolation: isolate;
  }

  .orbit-line {
    position: absolute;
    top: 1.5rem;
    bottom: 3rem;
    left: 50%;
    width: clamp(120px, 16vw, 190px);
    height: calc(100% - 4.5rem);
    overflow: visible;
    pointer-events: none;
    transform: translateX(-50%);
    z-index: -1;
  }

  .orbit-line__track,
  .orbit-line__progress {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .orbit-line__track {
    stroke: rgba(66, 168, 255, 0.2);
    stroke-width: 2;
  }

  .orbit-line__progress {
    stroke: var(--space-ice-cyan, #62dcff);
    stroke-width: 3;
    filter: drop-shadow(0 0 7px rgba(98, 220, 255, 0.85));
  }

  .orbit-line__node {
    fill: var(--space-ice-cyan, #62dcff);
    stroke: rgba(247, 251, 255, 0.98);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 0 7px rgba(98, 220, 255, 0.95));
    transform-box: fill-box;
    transform-origin: center;
    will-change: transform, opacity;
  }

  .meteor {
    /* Each row follows the flat face, in unmirrored artwork coordinates. */
    --content-top: 36%;
    --date-x: 31%;
    --date-width: 43%;
    --title-x: 26%;
    --title-width: 52%;
    --company-x: 31%;
    --company-width: 43%;
    --cta-x: 38%;
    --cta-width: 33%;
    position: relative;
    container-type: inline-size;
    width: min(47.5%, 540px);
    aspect-ratio: 1448 / 1086;
    margin-block: clamp(2.4rem, 6vw, 5.4rem);
    color: var(--space-text, #f7fbff);
    transform-origin: center;
    will-change: transform, opacity;
    z-index: 1;
  }

  .meteor[data-side="left"] { margin-right: auto; }
  .meteor[data-side="right"] { margin-left: auto; }

  .meteor[data-variant="2"] {
    --content-top: 41%;
    --date-x: 24%;
    --date-width: 40%;
    --title-x: 25%;
    --title-width: 52%;
    --company-x: 39%;
    --company-width: 40%;
    --cta-x: 50%;
    --cta-width: 28%;
  }

  .meteor[data-variant="3"] {
    --content-top: 31%;
    --date-x: 38%;
    --date-width: 40%;
    --title-x: 34%;
    --title-width: 50%;
    --company-x: 39%;
    --company-width: 42%;
    --cta-x: 46%;
    --cta-width: 30%;
  }

  .meteor[data-index="0"],
  .meteor[data-index="6"] { --content-top: 40%; }
  .meteor[data-index="3"] { --title-width: 55%; }

  .meteor[data-index="0"],
  .meteor[data-index="5"],
  .meteor[data-index="6"] { --text-offset: 3%; }

  .meteor[data-index="5"] {
    --content-top: 34%;
    --title-x: 32%;
    --title-width: 54%;
  }

  .meteor__body {
    position: absolute;
    inset: 0;
    display: block;
    pointer-events: none;
    transform-origin: center;
    will-change: transform;
    z-index: 1;
  }

  .meteor__shell {
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
    transform-origin: center;
  }

  .meteor__shell-art {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .meteor[data-side="left"] .meteor__shell { transform: scaleX(-1); }

  .meteor__trail {
    position: absolute;
    top: 47%;
    display: block;
    width: 74%;
    height: auto;
    pointer-events: none;
    will-change: transform, opacity;
    z-index: 0;
  }

  .meteor__trail-art {
    display: block;
    width: 100%;
    height: auto;
    transform-origin: center;
  }

  .meteor[data-side="left"] .meteor__trail {
    right: 77%;
    transform-origin: 100% 50%;
  }

  .meteor[data-side="right"] .meteor__trail {
    left: 77%;
    transform-origin: 0 50%;
  }

  .meteor[data-side="right"] .meteor__trail-art { transform: scaleX(-1); }

  .meteor__content {
    position: absolute;
    top: var(--content-top);
    left: 0;
    width: 100%;
    display: flex;
    min-width: 0;
    flex-direction: column;
    color: var(--space-text, #f7fbff);
    text-shadow: 0 2px 12px rgba(4, 7, 25, 0.9);
    pointer-events: auto;
    user-select: text;
    z-index: 2;
  }

  .meteor__date {
    --row-x: var(--date-x);
    --row-width: var(--date-width);
    margin-bottom: clamp(2px, 1.1cqw, 6px);
    color: var(--space-ice-cyan, #62dcff);
    font-family: "Sora", sans-serif;
    font-size: clamp(0.6875rem, 2.25cqw, 0.76rem);
    font-weight: 600;
    letter-spacing: 0.075em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .meteor__title {
    --row-x: var(--title-x);
    --row-width: var(--title-width);
    margin: 0 0 clamp(1px, 0.6cqw, 3px);
    color: var(--space-text, #f7fbff);
    font-family: "Sora", sans-serif;
    font-size: clamp(0.9rem, 4.1cqw, 1.38rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.12;
  }

  .meteor__company {
    --row-x: var(--company-x);
    --row-width: var(--company-width);
    margin: 0;
    color: var(--space-ice-cyan, #62dcff);
    font-family: "Sora", sans-serif;
    font-size: clamp(0.75rem, 2.9cqw, 0.98rem);
    font-style: italic;
    font-weight: 600;
    line-height: 1.2;
    white-space: pre-line;
  }

  .meteor__cta {
    --row-x: var(--cta-x);
    --row-width: var(--cta-width);
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 0.3rem;
    margin-top: clamp(4px, 1.8cqw, 10px);
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--space-trail-highlight, #ffbd66);
    font-family: "Sora", sans-serif;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    cursor: pointer;
    line-height: 1.2;
    transition: color 180ms ease, transform 180ms ease;
  }

  .meteor__date,
  .meteor__title,
  .meteor__company,
  .meteor__cta {
    margin-left: calc(var(--row-x) + var(--text-offset, 0%));
    width: var(--row-width);
  }

  .meteor__cta { width: max-content; }
  .meteor__copy-compact { display: none; }

  @media (min-width: 768px) {
    .meteor[data-side="left"] .meteor__content > * {
      margin-left: calc(100% - var(--row-x) - var(--row-width) + var(--text-offset, 0%));
    }
  }

  @container (max-width: 460px) {
    .meteor__copy-full { display: none; }
    .meteor__copy-compact { display: inline; }
    .meteor__date { margin-bottom: 2px; letter-spacing: 0.035em; }
    .meteor__title { margin-bottom: 2px; }
    .meteor__cta { margin-top: 4px; letter-spacing: 0.08em; }

    @media (max-width: 767px) {
      .meteor[data-variant="2"] .meteor__content { top: 36.5%; }
      .meteor[data-variant="2"] .meteor__date { --row-x: 19.5%; }
    }
  }

  .meteor__cta-icon { width: 0.82rem; height: 0.82rem; fill: currentColor; }

  .meteor:hover .meteor__cta,
  .meteor__cta:focus-visible {
    color: #fff4d8;
    transform: translateX(4px);
  }

  .meteor__cta:focus-visible {
    outline: 2px solid var(--space-ice-cyan, #62dcff);
    outline-offset: 4px;
    border-radius: 2px;
    box-shadow: 0 0 0 6px rgba(98, 220, 255, 0.16);
  }

  .sr-only {
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

  :global(body.modal-open) { overflow: hidden; }

  @media (max-width: 767px) {
    .cosmic-stage {
      width: min(520px, 100%);
      padding: 2.5rem 0.5rem 14rem 2.45rem;
    }

    .orbit-line {
      top: 1rem;
      bottom: 2rem;
      left: 1.15rem;
      width: 1.4rem;
      height: calc(100% - 3rem);
      transform: none;
    }

    .orbit-line__node { stroke-width: 5; }

    .meteor { width: 100%; margin-block: clamp(1.8rem, 8vw, 3rem); }

    .meteor[data-side="left"],
    .meteor[data-side="right"] { margin-inline: auto; }

    .meteor[data-side="left"] .meteor__shell { transform: none; }

    .meteor__trail,
    .meteor[data-side="left"] .meteor__trail,
    .meteor[data-side="right"] .meteor__trail {
      top: 52%;
      right: auto;
      left: -1.35rem;
      width: 32%;
      transform-origin: 0 50%;
    }

    .meteor[data-side="right"] .meteor__trail-art { transform: none; }


  }

  @media (prefers-reduced-motion: reduce) {
    .meteor {
      opacity: 1 !important;
      visibility: visible !important;
    }

    .meteor,
    .orbit-line__node,
    .meteor__body,
    .meteor__trail {
      transform: none !important;
      will-change: auto;
    }

    .meteor__trail { opacity: 0.72 !important; }



    .meteor__cta {
      transform: none !important;
    }

    .meteor__cta { transition: none; }
  }
</style>
