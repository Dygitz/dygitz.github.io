<script>
  import { onDestroy, onMount, tick } from "svelte";
  import { loadGsap } from "../lib/gsapClient";
  import { getMeteorVariant, getSpaceMotionProfile } from "../lib/spaceMotion";

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
  let modalCloseButton;
  let timelineRoot;

  $: cosmicItems = items.map((item, index) => ({
    ...item,
    index,
    side: index % 2 === 0 ? "left" : "right",
    variant: getMeteorVariant(index),
  }));

  $: activeItem =
    activeIndex !== null && cosmicItems[activeIndex] ? cosmicItems[activeIndex] : null;

  $: if (typeof document !== "undefined") {
    if (activeItem) {
      document.body.classList.add("modal-open");
      tick().then(() => {
        if (modalCloseButton) {
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
    let refreshFrame = 0;

    const initializeTimeline = async () => {
      const { gsap, ScrollTrigger } = await loadGsap();

      if (!active || !timelineRoot) return;

      const root = timelineRoot;

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
              const entrance = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: meteor,
                  start: "top 82%",
                  end: "center 58%",
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
      motionMedia?.revert();
      animationContext?.revert();
    };
  });

  onDestroy(() => {
    if (typeof document !== "undefined") {
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
    activeIndex = null;
    if (typeof HTMLElement !== "undefined" && previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus();
    }
    previouslyFocused = null;
  }

  function handleWindowKeydown(event) {
    if (event.key === "Escape" && activeItem) {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<div class="cosmic-stage" bind:this={timelineRoot} data-experience-timeline>
  <svg class="orbit-line" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
    <path
      class="orbit-line__track"
      d="M50 0 C5 115 95 210 50 330 C5 450 95 545 50 665 C5 785 95 880 50 1000"
    />
    <path
      class="orbit-line__progress"
      data-timeline-progress
      pathLength="1"
      d="M50 0 C5 115 95 210 50 330 C5 450 95 545 50 665 C5 785 95 880 50 1000"
    />
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
      <img
        class="meteor__trail"
        data-meteor-trail
        src="/illustrations/space/meteor-trail.png"
        width="2172"
        height="724"
        alt=""
      />
      <span class="meteor__shell-drift" data-meteor-shell-drift aria-hidden="true">
        <img
          class="meteor__shell"
          src={`/illustrations/space/meteor-shell-${item.variant}.png`}
          width="1448"
          height="1086"
          alt=""
        />
      </span>
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

{#if activeItem}
  <div class="experience-modal-overlay" role="presentation">
    <button
      class="experience-modal-overlay__backdrop"
      type="button"
      tabindex="-1"
      aria-hidden="true"
      on:click={closeModal}
    ></button>
    <div
      class="experience-modal"
      id="experience-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-job-${activeItem.index}-title`}
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
  </div>
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

  .meteor::before {
    content: "";
    position: absolute;
    top: 49%;
    width: 0.72rem;
    aspect-ratio: 1;
    border: 2px solid rgba(247, 251, 255, 0.96);
    border-radius: 50%;
    background: var(--space-ice-cyan, #62dcff);
    box-shadow: 0 0 0 5px rgba(98, 220, 255, 0.12), 0 0 18px rgba(98, 220, 255, 0.95);
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 4;
  }

  .meteor[data-side="left"]::before { right: -0.18rem; }
  .meteor[data-side="right"]::before { left: -0.18rem; }

  .meteor__trigger {
    position: absolute;
    inset: 0;
    padding: 0;
    border: 0;
    border-radius: 44% 48% 46% 42%;
    background: transparent;
    cursor: pointer;
    z-index: 5;
  }

  .meteor__trigger:focus-visible {
    outline: 3px solid var(--space-ice-cyan, #62dcff);
    outline-offset: 5px;
    box-shadow: 0 0 0 9px rgba(98, 220, 255, 0.16);
  }

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
    object-fit: contain;
    pointer-events: none;
    transform-origin: center;
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
    z-index: -1;
  }

  .meteor[data-side="left"] .meteor__trail {
    right: 77%;
    transform-origin: 100% 50%;
  }

  .meteor[data-side="right"] .meteor__trail {
    left: 77%;
    transform: rotate(180deg);
    transform-origin: 0 50%;
  }

  .meteor__content {
    position: absolute;
    inset: 15% 14% 14% 15%;
    display: flex;
    min-width: 0;
    flex-direction: column;
    justify-content: center;
    max-width: 42ch;
    color: var(--space-text, #f7fbff);
    text-shadow: 0 2px 12px rgba(4, 7, 25, 0.9);
    pointer-events: none;
    z-index: 2;
  }

  .meteor__date {
    margin-bottom: 0.38rem;
    color: var(--space-ice-cyan, #62dcff);
    font-family: "Sora", sans-serif;
    font-size: clamp(0.58rem, 0.8vw, 0.72rem);
    font-weight: 600;
    letter-spacing: 0.11em;
    line-height: 1.35;
    text-transform: uppercase;
  }

  .meteor__title {
    margin: 0 0 0.2rem;
    color: var(--space-text, #f7fbff);
    font-family: "Sora", sans-serif;
    font-size: clamp(0.96rem, 1.45vw, 1.3rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.12;
  }

  .meteor__company {
    margin: 0 0 0.36rem;
    color: var(--space-ice-cyan, #62dcff);
    font-family: "Sora", sans-serif;
    font-size: clamp(0.76rem, 1.05vw, 0.95rem);
    font-style: italic;
    font-weight: 600;
    line-height: 1.25;
  }

  .meteor__location,
  .meteor__tagline {
    margin: 0 0 0.26rem;
    color: var(--space-muted, #b8c8e5);
    font-family: "Montserrat", sans-serif;
    font-size: clamp(0.64rem, 0.82vw, 0.76rem);
    line-height: 1.32;
  }

  .meteor__tagline { color: rgba(98, 220, 255, 0.92); font-weight: 600; }

  .meteor__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.28rem;
    margin: 0.18rem 0 0;
    padding: 0;
    list-style: none;
  }

  .meteor__skills li {
    padding: 0.18rem 0.38rem;
    border: 1px solid rgba(98, 220, 255, 0.55);
    border-radius: 3px;
    background: rgba(4, 7, 25, 0.36);
    color: #d9f7ff;
    font-family: "Montserrat", sans-serif;
    font-size: clamp(0.52rem, 0.66vw, 0.63rem);
    line-height: 1.25;
  }

  .meteor__cta {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 0.3rem;
    margin-top: 0.48rem;
    color: var(--space-trail-highlight, #ffbd66);
    font-family: "Sora", sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    transition: color 180ms ease, transform 180ms ease;
  }

  .meteor__cta-icon { width: 0.82rem; height: 0.82rem; fill: currentColor; }

  .meteor:hover .meteor__cta,
  .meteor__trigger:focus-visible ~ .meteor__content .meteor__cta {
    color: #fff4d8;
    transform: translateX(4px);
  }

  .experience-modal-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(1rem, 4vw, 3rem);
    background: rgba(4, 7, 25, 0.84);
    backdrop-filter: blur(14px);
    animation: overlay-fade 180ms ease-out;
    z-index: 30;
  }

  .experience-modal-overlay__backdrop {
    position: absolute;
    inset: 0;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    z-index: 0;
  }

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
    z-index: 1;
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

    .meteor { width: 100%; margin-block: clamp(1.8rem, 8vw, 3rem); }

    .meteor[data-side="left"],
    .meteor[data-side="right"] { margin-inline: auto; }

    .meteor::before { left: -1.78rem; right: auto; width: 0.58rem; }
    .meteor[data-side="left"] .meteor__shell { transform: none; }

    .meteor__trail,
    .meteor[data-side="left"] .meteor__trail,
    .meteor[data-side="right"] .meteor__trail {
      top: 52%;
      right: auto;
      left: -1.35rem;
      width: 32%;
      transform: rotate(180deg);
      transform-origin: 0 50%;
    }

    .meteor__content { inset: 12% 9% 9% 12%; }
    .meteor__date { margin-bottom: 0.25rem; font-size: clamp(0.52rem, 2.2vw, 0.66rem); }
    .meteor__title { font-size: clamp(0.9rem, 4vw, 1.14rem); }
    .meteor__company { margin-bottom: 0.22rem; font-size: clamp(0.68rem, 3vw, 0.86rem); }

    .meteor__location,
    .meteor__tagline { margin-bottom: 0.18rem; font-size: clamp(0.57rem, 2.35vw, 0.7rem); }

    .meteor__skills { gap: 0.2rem; margin-top: 0.1rem; }
    .meteor__skills li { padding: 0.13rem 0.28rem; font-size: clamp(0.48rem, 2vw, 0.58rem); }
    .meteor__cta { margin-top: 0.3rem; font-size: 0.53rem; }
    .experience-modal { padding: 1.4rem; max-height: 90vh; }
  }

  @media (max-width: 430px) {
    .meteor__skills li:nth-child(n + 4) { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .orbit-line__progress { stroke-dashoffset: 0; }

    .meteor {
      opacity: 1 !important;
      visibility: visible !important;
    }

    .meteor,
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
