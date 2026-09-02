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

      if (!active || !timelineRoot) return;

      const root = timelineRoot;
      const orbit = root.querySelector(".orbit-line");

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
          resizeFrame = window.requestAnimationFrame(syncOrbitNodeAspect);
        });
        orbitResizeObserver.observe(orbit);
      }

      animationContext = gsap.context(() => {
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
            const progress = root.querySelector("[data-timeline-progress]");
            const meteors = Array.from(root.querySelectorAll("[data-meteor]"));
            const nodes = Array.from(root.querySelectorAll("[data-orbit-node]"));

            if (!progress) return;

            if (profile.mode === "reduced") {
              gsap.set(progress, { strokeDashoffset: 0 });
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

            gsap.fromTo(
              progress,
              { strokeDashoffset: 1 },
              {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: root,
                  start: "top 70%",
                  end: "bottom 65%",
                  scrub: profile.scrollScrub,
                },
              },
            );

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
    <path
      class="orbit-line__track"
      d={orbitGeometry.path}
    />
    <path
      class="orbit-line__progress"
      data-timeline-progress
      pathLength="1"
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
  </svg>

  {#each cosmicItems as item (item.index)}
    <article
      class="meteor"
      data-meteor
      data-side={item.side}
      data-index={item.index}
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
      <span class="meteor__shell-drift" data-meteor-shell-drift aria-hidden="true">
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
      </span>
      <div class="meteor__content">
        <span class="meteor__date">{item.dateRange}</span>
        <h3 class="meteor__title" id={`job-${item.index}-title`}>{item.title}</h3>
        <p class="meteor__company" id={`job-${item.index}-company`}>{item.company}</p>
        <button
          class="meteor__cta"
          type="button"
          aria-haspopup="dialog"
          aria-labelledby={`job-${item.index}-cta job-${item.index}-title job-${item.index}-company`}
          on:click={(event) => openModal(item.index, event.currentTarget)}
        >
          <span id={`job-${item.index}-cta`}>View details</span>
          <svg class="meteor__cta-icon" viewBox="0 0 16 16" role="presentation">
            <path d="M3 8h8.586l-2.793-2.793L9.5 4.5 14 9l-4.5 4.5-0.707-0.707L11.586 9H3z"></path>
          </svg>
        </button>
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
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
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
    position: relative;
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

  .meteor__shell-drift {
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
    inset: 18% 16% 17% 18%;
    display: flex;
    min-width: 0;
    flex-direction: column;
    justify-content: center;
    max-width: 42ch;
    color: var(--space-text, #f7fbff);
    text-shadow: 0 2px 12px rgba(4, 7, 25, 0.9);
    pointer-events: auto;
    user-select: text;
    z-index: 2;
  }

  .meteor__date {
    margin-bottom: 0.38rem;
    color: var(--space-ice-cyan, #62dcff);
    font-family: "Sora", sans-serif;
    font-size: clamp(0.62rem, 0.85vw, 0.76rem);
    font-weight: 600;
    letter-spacing: 0.11em;
    line-height: 1.35;
    text-transform: uppercase;
  }

  .meteor__title {
    margin: 0 0 0.2rem;
    color: var(--space-text, #f7fbff);
    font-family: "Sora", sans-serif;
    font-size: clamp(1.05rem, 1.55vw, 1.38rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.12;
  }

  .meteor__company {
    margin: 0 0 0.36rem;
    color: var(--space-ice-cyan, #62dcff);
    font-family: "Sora", sans-serif;
    font-size: clamp(0.82rem, 1.08vw, 0.98rem);
    font-style: italic;
    font-weight: 600;
    line-height: 1.25;
  }

  .meteor__cta {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 0.3rem;
    margin-top: 0.48rem;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--space-trail-highlight, #ffbd66);
    font-family: "Sora", sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 180ms ease, transform 180ms ease;
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

  .experience-modal-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    max-width: none;
    max-height: none;
    box-sizing: border-box;
    margin: 0;
    align-items: center;
    justify-content: center;
    padding: clamp(1rem, 4vw, 3rem);
    border: 0;
    background: rgba(4, 7, 25, 0.84);
    backdrop-filter: blur(14px);
    animation: overlay-fade 180ms ease-out;
    overflow-y: auto;
  }

  .experience-modal-overlay[open] { display: grid; }
  .experience-modal-overlay:not([open]) { display: none; }
  .experience-modal-overlay::backdrop { background: transparent; }

  .experience-modal {
    position: relative;
    width: min(680px, 100%);
    max-height: min(86vh, 720px);
    overflow-y: auto;
    padding: clamp(1.6rem, 4vw, 2.7rem);
    border: 1px solid rgba(98, 220, 255, 0.42);
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.18), transparent 28%), linear-gradient(315deg, rgba(66, 168, 255, 0.16), transparent 30%), rgba(7, 16, 45, 0.97);
    box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.18), 0 30px 80px rgba(4, 7, 25, 0.86), 0 0 42px rgba(66, 168, 255, 0.12);
    color: var(--space-text, #f7fbff);
    clip-path: polygon(0 18px, 18px 0, calc(100% - 30px) 0, 100% 30px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 26px 100%, 0 calc(100% - 26px));
    animation: modal-settle 220ms ease-out;
  }

  .modal__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: grid;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    place-items: center;
    border: 1px solid rgba(98, 220, 255, 0.46);
    border-radius: 2px;
    background: rgba(11, 21, 51, 0.86);
    color: var(--space-text, #f7fbff);
    font-family: "Sora", sans-serif;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    transition: background 160ms ease, color 160ms ease;
  }

  .modal__close:hover,
  .modal__close:focus-visible {
    outline: 2px solid var(--space-ice-cyan, #62dcff);
    outline-offset: 3px;
    background: rgba(53, 40, 95, 0.96);
    color: var(--space-trail-highlight, #ffbd66);
  }

  .modal__header { display: grid; gap: 0.38rem; padding-right: 3rem; }

  .modal__date {
    color: var(--space-ice-cyan, #62dcff);
    font-family: "Sora", sans-serif;
    font-size: 0.76rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .modal__title {
    margin: 0;
    color: var(--space-text, #f7fbff);
    font-family: "Sora", sans-serif;
    font-size: clamp(1.35rem, 3vw, 1.9rem);
    line-height: 1.18;
  }

  .modal__company {
    margin: 0;
    color: var(--space-ice-cyan, #62dcff);
    font-family: "Sora", sans-serif;
    font-size: 1rem;
    font-style: italic;
    font-weight: 600;
  }

  .modal__location,
  .modal__tagline {
    margin: 0;
    color: var(--space-muted, #b8c8e5);
    font-family: "Montserrat", sans-serif;
    font-size: 0.92rem;
    line-height: 1.45;
  }

  .modal__tagline { color: #d9f7ff; font-weight: 600; }

  .modal__description,
  .modal__description-list {
    margin: 1.5rem 0 0;
    color: rgba(247, 251, 255, 0.88);
    font-family: "Montserrat", sans-serif;
    font-size: 0.96rem;
    line-height: 1.7;
  }

  .modal__description-list {
    display: grid;
    gap: 0.72rem;
    padding-left: 1.25rem;
    list-style: disc;
  }

  .modal__description-list li::marker { color: var(--space-trail-orange, #ff744b); }
  .modal__skills { margin-top: 1.6rem; }

  .modal__skills h4 {
    margin: 0 0 0.7rem;
    color: var(--space-trail-highlight, #ffbd66);
    font-family: "Sora", sans-serif;
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .modal__skills ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .modal__skills li {
    padding: 0.32rem 0.62rem;
    border: 1px solid rgba(98, 220, 255, 0.4);
    border-radius: 3px;
    background: rgba(11, 21, 51, 0.75);
    color: #d9f7ff;
    font-family: "Montserrat", sans-serif;
    font-size: 0.72rem;
    line-height: 1.3;
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

  @keyframes overlay-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes modal-settle {
    from { opacity: 0; transform: scale(0.97); }
    to { opacity: 1; transform: scale(1); }
  }

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

    .meteor__content { inset: 14% 9% 10% 12%; }
    .meteor__date { margin-bottom: 0.3rem; font-size: clamp(0.6875rem, 2.6vw, 0.75rem); }
    .meteor__title { font-size: clamp(1rem, 4.2vw, 1.18rem); }
    .meteor__company { margin-bottom: 0.3rem; font-size: clamp(0.75rem, 3.2vw, 0.88rem); }

    .meteor__cta { margin-top: 0.35rem; font-size: clamp(0.6875rem, 2.6vw, 0.75rem); }
    .experience-modal { padding: 1.4rem; max-height: 90vh; }
  }

  @media (prefers-reduced-motion: reduce) {
    .orbit-line__progress { stroke-dashoffset: 0; }

    .meteor {
      opacity: 1 !important;
      visibility: visible !important;
    }

    .meteor,
    .orbit-line__node,
    .meteor__shell-drift,
    .meteor__trail {
      transform: none !important;
      will-change: auto;
    }

    .meteor__trail { opacity: 0.72 !important; }

    .experience-modal-overlay,
    .experience-modal { animation: none; }

    .meteor__cta {
      transform: none !important;
    }

    .meteor__cta,
    .modal__close { transition: none; }
  }
</style>
