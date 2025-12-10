<script>
  import { onDestroy, onMount, tick } from 'svelte';

  export let items = [
    {
      dateRange: '2021 - Current',
      title: 'Job 4',
      company: 'Company 4',
      description: 'Customer Success Representative.',
      location: 'Remote',
      tagline: 'Growth Team',
      skills: ['Skill one', 'Skill two', 'Skill three'],
    },
    {
      dateRange: '2019 - 2021',
      title: 'Job 3',
      company: 'Company 3',
      description: 'Project Management, System Administrator.',
      location: 'Austin, TX · Hybrid',
      tagline: 'Program Management',
      skills: ['Leadership', 'Communication'],
    },
    {
      dateRange: '2018 - 2019',
      title: 'Job 2',
      company: 'Company 2',
      description: 'Support Specialist.',
      location: 'Toronto, Canada',
      tagline: 'Support Team',
      skills: ['Customer Support'],
    },
    {
      dateRange: '2017 - 2018',
      title: 'Job 1',
      company: 'Company 1',
      description: 'Debugging, Code QA.',
      location: 'On-site',
      tagline: 'Quality Assurance',
      skills: ['QA Testing'],
    }
  ];

  const variations = [
    {
      side: 'left',
      drift: -62,
      rotation: -16,
      scale: 0.88,
      hue: 210,
      floatDuration: 15,
      floatDelay: 1.2,
      trailSkew: -18,
    },
    {
      side: 'right',
      drift: 58,
      rotation: 14,
      scale: 0.95,
      hue: 168,
      floatDuration: 13,
      floatDelay: 0.8,
      trailSkew: 16,
    },
    {
      side: 'left',
      drift: -55,
      rotation: -12,
      scale: 0.92,
      hue: 278,
      floatDuration: 16,
      floatDelay: 1.6,
      trailSkew: -15,
    },
    {
      side: 'right',
      drift: 63,
      rotation: 18,
      scale: 0.9,
      hue: 38,
      floatDuration: 14,
      floatDelay: 1,
      trailSkew: 18,
    }
  ];

  let cosmicItems = [];
  let visibleItems = new Set();
  let floatingItems = new Set();
  let activeIndex = null;
  let previouslyFocused = null;
  let modalCloseButton;

  $: cosmicItems = items.map((item, index) => {
    const variation = variations[index % variations.length];
    const side = variation.side ?? (index % 2 === 0 ? 'left' : 'right');

    return {
      ...item,
      index,
      side,
      drift: variation.drift ?? (side === 'left' ? -58 : 58),
      rotation: variation.rotation ?? (side === 'left' ? -12 : 12),
      scale: variation.scale ?? 0.92,
      hue: variation.hue ?? 220 + index * 24,
      floatDuration: variation.floatDuration ?? 13 + (index % 3),
      floatDelay: variation.floatDelay ?? index * 0.35,
      trailSkew: variation.trailSkew ?? (side === 'left' ? -18 : 18),
    };
  });

  $: activeItem =
    activeIndex !== null && cosmicItems[activeIndex] ? cosmicItems[activeIndex] : null;

  $: if (typeof document !== 'undefined') {
    if (activeItem) {
      document.body.classList.add('modal-open');
      tick().then(() => {
        if (modalCloseButton) {
          modalCloseButton.focus();
        }
      });
    } else {
      document.body.classList.remove('modal-open');
    }
  }

  onMount(() => {
    const nodes = Array.from(document.querySelectorAll('.asteroid'));

    const observer = new IntersectionObserver(
      (entries) => {
        let nextVisible = null;
        let nextFloating = null;

        entries.forEach((entry) => {
          const indexValue = Number(entry.target.dataset.index);
          if (Number.isNaN(indexValue)) return;

          if (entry.isIntersecting) {
            if (!visibleItems.has(indexValue)) {
              if (!nextVisible) {
                nextVisible = new Set(visibleItems);
              }
              nextVisible.add(indexValue);
            }

            if (!floatingItems.has(indexValue)) {
              if (!nextFloating) {
                nextFloating = new Set(floatingItems);
              }
              nextFloating.add(indexValue);
            }
          } else if (floatingItems.has(indexValue)) {
            if (!nextFloating) {
              nextFloating = new Set(floatingItems);
            }
            nextFloating.delete(indexValue);
          }
        });

        if (nextVisible) {
          visibleItems = nextVisible;
        }

        if (nextFloating) {
          floatingItems = nextFloating;
        }
      },
      {
        threshold: 0.35,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => {
      nodes.forEach((node) => observer.unobserve(node));
      observer.disconnect();
    };
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
    }
  });

  function openModal(index, trigger) {
    if (typeof HTMLElement !== 'undefined' && trigger instanceof HTMLElement) {
      previouslyFocused = trigger;
    } else {
      previouslyFocused = null;
    }
    activeIndex = index;
  }

  function closeModal() {
    activeIndex = null;
    if (typeof HTMLElement !== 'undefined' && previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus();
    }
    previouslyFocused = null;
  }

  function handleWindowKeydown(event) {
    if (event.key === 'Escape' && activeItem) {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<div class="cosmic-stage">
  <div class="cosmic-lane" aria-hidden="true"></div>
  {#each cosmicItems as item (item.index)}
    <article
      class="asteroid"
      class:is-visible={visibleItems.has(item.index)}
      class:is-floating={floatingItems.has(item.index)}
      data-side={item.side}
      data-index={item.index}
      style={`--delay:${item.index * 140}ms; --drift:${item.drift}; --rotation:${item.rotation}deg; --scale:${item.scale}; --hue:${item.hue}; --float-duration:${item.floatDuration}s; --float-delay:${item.floatDelay}s; --trail-skew:${item.trailSkew}deg;`}
    >
      <button
        class="asteroid__trigger"
        type="button"
        aria-haspopup="dialog"
        aria-labelledby={`job-${item.index}-title job-${item.index}-company`}
        on:click={(event) => openModal(item.index, event.currentTarget)}
      >
        <span class="sr-only">View details</span>
      </button>
      <div class="asteroid__trail" aria-hidden="true"></div>
      <div class="asteroid__core">
        <span class="asteroid__date">{item.dateRange}</span>
        <h3 class="asteroid__title" id={`job-${item.index}-title`}>{item.title}</h3>
        <p class="asteroid__company" id={`job-${item.index}-company`}>{item.company}</p>
        {#if item.location}
          <p class="asteroid__location">{item.location}</p>
        {/if}
        {#if item.tagline}
          <p class="asteroid__tagline">{item.tagline}</p>
        {/if}
        {#if item.skills && item.skills.length > 0}
          <ul class="asteroid__skills" aria-label="Key skills">
            {#each item.skills.slice(0, 3) as skill}
              <li>{skill}</li>
            {/each}
            {#if item.skills.length > 3}
              <li>+{item.skills.length - 3} more</li>
            {/if}
          </ul>
        {/if}
        <div class="asteroid__cta" aria-hidden="true">
          <span>View details</span>
          <svg class="asteroid__cta-icon" viewBox="0 0 16 16" role="presentation">
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
      style={`--hue:${activeItem.hue}`}
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
    margin: 0 auto;
    max-width: 960px;
    padding: clamp(3rem, 7vw, 5rem) 1.5rem clamp(6rem, 9vw, 8rem);
    width: min(960px, 100%);
    overflow: visible;
    z-index: 1;
  }

  .cosmic-stage::before,
  .cosmic-stage::after {
    content: '';
    position: absolute;
    inset: -12% -24%;
    background-repeat: repeat;
    pointer-events: none;
    opacity: 0.55;
    z-index: 0;
  }

  .cosmic-stage::before {
    background-image:
      radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.6) 0, transparent 70%),
      radial-gradient(1px 1px at 80% 10%, rgba(255, 255, 255, 0.3) 0, transparent 60%),
      radial-gradient(1.5px 1.5px at 60% 80%, rgba(87, 206, 255, 0.45) 0, transparent 65%);
    animation: drift-stars 28s linear infinite;
    will-change: transform;
  }

  .cosmic-stage::after {
    background-image:
      radial-gradient(1.2px 1.2px at 15% 60%, rgba(255, 255, 255, 0.5) 0, transparent 70%),
      radial-gradient(1.5px 1.5px at 70% 30%, rgba(85, 164, 255, 0.35) 0, transparent 60%),
      radial-gradient(2px 2px at 35% 20%, rgba(255, 219, 133, 0.25) 0, transparent 55%);
    animation: drift-stars 38s linear infinite reverse;
    will-change: transform;
  }

  @keyframes drift-stars {
    from {
      transform: translate3d(0, 0, 0);
    }

    to {
      transform: translate3d(-80px, 60px, 0);
    }
  }

  .cosmic-lane {
    position: absolute;
    left: 50%;
    top: clamp(2rem, 4vw, 3rem);
    bottom: clamp(2rem, 4vw, 3rem);
    width: 4px;
    transform: translateX(-50%);
    background:
      linear-gradient(
        180deg,
        rgba(75, 164, 255, 0) 0%,
        rgba(75, 164, 255, 0.45) 30%,
        rgba(208, 189, 255, 0.65) 50%,
        rgba(75, 164, 255, 0.45) 70%,
        rgba(75, 164, 255, 0) 100%
      );
    border-radius: 999px;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
  }

  .cosmic-lane::before {
    content: '';
    position: absolute;
    inset: -30px -16px;
    background: radial-gradient(circle at center, rgba(124, 223, 255, 0.45), transparent 60%);
    filter: blur(22px);
  }

  .cosmic-lane::after {
    content: '';
    position: absolute;
    left: 0;
    top: -140px;
    width: 100%;
    height: 140px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0));
    animation: beam-travel 7s linear infinite;
    will-change: transform, opacity;
  }

  @keyframes beam-travel {
    0% {
      transform: translateY(0);
      opacity: 0;
    }

    20% {
      opacity: 0.95;
    }

    70% {
      opacity: 0.4;
    }

    100% {
      transform: translateY(320%);
      opacity: 0;
    }
  }

  .asteroid {
    position: relative;
    width: min(100%, 340px);
    margin: clamp(1.4rem, 4.5vw, 2.8rem) 0;
    z-index: 2;
    opacity: 0;
    transform: translate3d(calc(var(--drift, -55) * 1%), 140px, 0) scale(var(--scale, 0.9)) rotate(var(--rotation, 0deg));
    transition: transform 0.9s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.6s ease-out, filter 0.7s ease-out;
    transition-delay: var(--delay, 0ms);
    filter: blur(10px);
    will-change: transform, opacity;
  }

  @media (max-width: 767px) {
    .asteroid::before,
    .asteroid::after,
    .asteroid__trail {
      display: none;
    }

    .asteroid {
      transform: none !important;
      filter: none;
      opacity: 1;
      margin: clamp(1.6rem, 5vw, 2.4rem) 0;
      padding: 0;
    }
  }

  .asteroid[data-side='left'] {
    margin-right: auto;
    padding-right: clamp(0.75rem, 4vw, 2.5rem);
  }

  .asteroid[data-side='right'] {
    margin-left: auto;
    padding-left: clamp(0.75rem, 4vw, 2.5rem);
  }

  .asteroid::before {
    content: '';
    position: absolute;
    inset: -18% -12% -18%;
    background:
      radial-gradient(circle at 28% 32%, rgba(29, 33, 46, 0.7) 0, rgba(29, 33, 46, 0.38) 46%, rgba(29, 33, 46, 0) 72%),
      radial-gradient(circle at 30% 36%, rgba(196, 210, 230, 0.22) 0, rgba(196, 210, 230, 0.08) 44%, rgba(196, 210, 230, 0) 70%),
      radial-gradient(circle at 58% 26%, rgba(23, 27, 37, 0.5) 0, rgba(23, 27, 37, 0.26) 40%, rgba(23, 27, 37, 0) 70%),
      radial-gradient(circle at 60% 24%, rgba(198, 208, 226, 0.18) 0, rgba(198, 208, 226, 0.06) 44%, rgba(198, 208, 226, 0) 72%),
      radial-gradient(circle at 68% 40%, rgba(22, 26, 36, 0.62) 0, rgba(22, 26, 36, 0.35) 40%, rgba(22, 26, 36, 0) 68%),
      radial-gradient(circle at 70% 44%, rgba(186, 200, 220, 0.2) 0, rgba(186, 200, 220, 0.07) 46%, rgba(186, 200, 220, 0) 72%),
      radial-gradient(circle at 18% 48%, rgba(21, 25, 34, 0.38) 0, rgba(21, 25, 34, 0.2) 42%, rgba(21, 25, 34, 0) 70%),
      radial-gradient(circle at 20% 50%, rgba(200, 212, 230, 0.16) 0, rgba(200, 212, 230, 0.06) 46%, rgba(200, 212, 230, 0) 72%),
      radial-gradient(circle at 48% 64%, rgba(18, 23, 33, 0.48) 0, rgba(18, 23, 33, 0.24) 42%, rgba(18, 23, 33, 0) 70%),
      radial-gradient(circle at 50% 66%, rgba(188, 204, 224, 0.16) 0, rgba(188, 204, 224, 0.05) 50%, rgba(188, 204, 224, 0) 74%),
      radial-gradient(circle at 40% 76%, rgba(24, 28, 39, 0.52) 0, rgba(24, 28, 39, 0.26) 40%, rgba(24, 28, 39, 0) 70%),
      radial-gradient(circle at 42% 78%, rgba(200, 210, 226, 0.16) 0, rgba(200, 210, 226, 0.06) 46%, rgba(200, 210, 226, 0) 74%),
      radial-gradient(circle at 22% 62%, rgba(20, 25, 36, 0.36) 0, rgba(20, 25, 36, 0.18) 45%, rgba(20, 25, 36, 0) 72%),
      radial-gradient(circle at 76% 68%, rgba(17, 22, 33, 0.32) 0, rgba(17, 22, 33, 0.14) 50%, rgba(17, 22, 33, 0) 76%),
      radial-gradient(circle at 36% 20%, rgba(255, 255, 255, 0.12), transparent 60%),
      radial-gradient(circle at 62% 78%, rgba(255, 255, 255, 0.1), transparent 58%),
      radial-gradient(ellipse at 60% 64%, rgba(122, 126, 138, 0.96), rgba(59, 63, 74, 0.94));
    border-radius: 48% 52% 50% 50% / 58% 42% 60% 40%;
    transform: rotate(calc(var(--rotation, 0deg) * 0.45)) scale3d(1.04, 1.07, 1);
    transform-origin: 50% 50%;
    box-shadow: 0 24px 32px rgba(12, 13, 24, 0.48);
    opacity: 0.95;
    z-index: -2;
    will-change: transform;
  }

  .asteroid::after {
    content: '';
    position: absolute;
    inset: -10% -8%;
    border-radius: 48% 52% 50% 50% / 58% 42% 60% 40%;
    background:
      radial-gradient(circle at 32% 18%, rgba(255, 255, 255, 0.16), transparent 58%),
      radial-gradient(circle at 72% 74%, rgba(255, 255, 255, 0.12), transparent 64%);
    opacity: 0.42;
    box-shadow: 0 0 30px rgba(165, 185, 216, 0.22);
    z-index: -1;
  }

  .asteroid__core {
    position: relative;
    padding: clamp(1.1rem, 2.6vw, 1.6rem);
    border-radius: 20px;
    background: linear-gradient(145deg, rgba(22, 33, 56, 0.95), rgba(16, 22, 41, 0.75));
    border: 1px solid rgba(141, 197, 255, 0.15);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.06),
      0 18px 40px rgba(10, 15, 37, 0.55);
    backdrop-filter: blur(12px);
  }

  .asteroid__core::before {
    content: '';
    position: absolute;
    inset: 8% 10%;
    border-radius: inherit;
    background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.12), transparent 65%);
    opacity: 0.6;
    mix-blend-mode: screen;
    pointer-events: none;
  }

  .asteroid__trigger {
    position: absolute;
    inset: 0;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    border-radius: 24px;
    z-index: 3;
  }

  .asteroid__trigger:focus-visible {
    outline: 3px solid rgba(138, 213, 255, 0.75);
    outline-offset: 6px;
  }

  .asteroid__trail {
    position: absolute;
    top: 50%;
    width: clamp(140px, 28vw, 240px);
    height: 3px;
    transform: translateY(-50%) skewX(var(--trail-skew, -18deg)) scaleX(0.3);
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0));
    box-shadow: 0 0 14px rgba(109, 243, 255, 0.35);
    opacity: 0;
    transition: transform 0.7s ease-out, opacity 0.6s ease-out;
    transition-delay: var(--delay, 0ms);
    pointer-events: none;
    will-change: opacity, transform;
  }

  .asteroid__trail::after {
    content: '';
    position: absolute;
    inset: -10px -18px;
    border-radius: 999px;
    background: radial-gradient(closest-side, rgba(255, 209, 140, 0.6), transparent 70%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.6s ease-out;
    will-change: opacity;
  }

  .asteroid[data-side='left'] .asteroid__trail {
    right: 100%;
    transform-origin: 100% 50%;
  }

  .asteroid[data-side='right'] .asteroid__trail {
    left: 100%;
    transform-origin: 0% 50%;
  }

  .asteroid__date {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: rgba(210, 236, 255, 0.8);
    margin-bottom: 0.9rem;
  }

  .asteroid__date::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, hsl(var(--hue, 210), 90%, 72%), rgba(255, 255, 255, 0.7));
    box-shadow: 0 0 16px hsla(var(--hue, 210), 90%, 72%, 0.8);
  }

  .asteroid__title {
    font-size: clamp(1.15rem, 2.4vw, 1.5rem);
    font-weight: 700;
    margin: 0 0 0.35rem;
    color: hsl(var(--hue, 210), 88%, 70%);
    text-shadow: 0 0 20px hsla(var(--hue, 210), 92%, 70%, 0.6);
  }

  .asteroid__company {
    margin: 0 0 0.75rem;
    font-weight: 600;
    font-style: italic;
    letter-spacing: 0.02em;
    color: rgba(188, 230, 255, 0.85);
  }

  .asteroid__location {
    margin: 0 0 0.45rem;
    color: rgba(210, 230, 255, 0.7);
    font-size: 0.85rem;
    letter-spacing: 0.04em;
  }

  .asteroid__tagline {
    margin: 0 0 0.85rem;
    color: rgba(214, 235, 255, 0.9);
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .asteroid__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0.2rem 0 0;
    padding: 0;
    list-style: none;
  }

  .asteroid__skills li {
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    background: rgba(109, 205, 255, 0.14);
    color: rgba(215, 235, 255, 0.85);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .asteroid__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 1.1rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: rgba(198, 226, 255, 0.7);
    transition: transform 0.35s ease, color 0.35s ease;
  }

  .asteroid__cta-icon {
    width: 1rem;
    height: 1rem;
    fill: currentColor;
  }

  .asteroid:hover .asteroid__cta {
    color: rgba(255, 255, 255, 0.92);
    transform: translateX(6px);
  }

  .asteroid__trigger:focus-visible ~ .asteroid__core .asteroid__cta {
    color: rgba(255, 255, 255, 0.92);
    transform: translateX(6px);
  }

  .asteroid.is-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1) rotate(0);
    filter: blur(0);
  }

  .asteroid.is-visible .asteroid__trail {
    opacity: 0.7;
    transform: translateY(-50%) skewX(var(--trail-skew, -18deg)) scaleX(1);
  }

  .asteroid.is-visible .asteroid__trail::after {
    opacity: 0.45;
  }

  .asteroid.is-visible::before {
    opacity: 0.97;
    transform: rotate(2deg) scale3d(1.06, 1.08, 1);
  }

  .asteroid.is-floating {
    animation: float var(--float-duration, 14s) ease-in-out infinite var(--float-delay, 0s);
  }

  .asteroid.is-floating .asteroid__trail::after {
    animation: trail-flicker 4s ease-in-out infinite;
  }

  @keyframes float {
    0% {
      transform: translate3d(0, 0, 0) scale(1) rotate(0);
    }

    50% {
      transform: translate3d(0, -12px, 0) scale(1.01) rotate(0.6deg);
    }

    100% {
      transform: translate3d(0, 0, 0) scale(1) rotate(0);
    }
  }

  @keyframes trail-flicker {
    0%,
    100% {
      opacity: 0.45;
    }

    50% {
      opacity: 0.2;
    }
  }

  .experience-modal-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(1.5rem, 4vw, 3rem);
    background: rgba(6, 12, 28, 0.75);
    backdrop-filter: blur(14px);
    z-index: 30;
    animation: overlay-fade 0.25s ease;
  }

  .experience-modal-overlay__backdrop {
    position: absolute;
    inset: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    z-index: 0;
  }

  .experience-modal-overlay__backdrop:focus-visible {
    outline: 3px solid rgba(138, 213, 255, 0.6);
    outline-offset: 4px;
  }

  .experience-modal {
    position: relative;
    width: min(640px, 100%);
    max-height: min(85vh, 680px);
    overflow-y: auto;
    padding: clamp(1.6rem, 3vw, 2.4rem);
    border-radius: 24px;
    background: linear-gradient(145deg, rgba(19, 28, 52, 0.94), rgba(10, 17, 32, 0.88));
    border: 1px solid rgba(150, 210, 255, 0.25);
    box-shadow: 0 32px 60px rgba(6, 8, 20, 0.7);
    color: rgba(226, 238, 255, 0.96);
    animation: modal-zoom 0.28s ease;
    z-index: 1;
  }

  .modal__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 999px;
    border: 1px solid rgba(195, 226, 255, 0.3);
    background: rgba(11, 18, 33, 0.65);
    color: rgba(220, 236, 255, 0.82);
    font-size: 1.2rem;
    line-height: 1;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
  }

  .modal__close:hover,
  .modal__close:focus-visible {
    background: rgba(38, 58, 92, 0.9);
    color: rgba(255, 255, 255, 0.95);
    transform: scale(1.05);
    outline: none;
  }

  .modal__header {
    display: grid;
    gap: 0.4rem;
    padding-right: 2.8rem;
  }

  .modal__date {
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(202, 228, 255, 0.7);
  }

  .modal__title {
    margin: 0;
    font-size: clamp(1.35rem, 3vw, 1.7rem);
    color: hsl(var(--hue, 210), 88%, 72%);
    text-shadow: 0 0 24px hsla(var(--hue, 210), 92%, 72%, 0.5);
  }

  .modal__company {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: rgba(214, 235, 255, 0.92);
  }

  .modal__location,
  .modal__tagline {
    margin: 0;
    color: rgba(204, 224, 255, 0.78);
    font-size: 0.95rem;
    letter-spacing: 0.04em;
  }

  .modal__tagline {
    font-weight: 600;
    color: rgba(220, 240, 255, 0.9);
  }

  @media (max-width: 767px) {
    .cosmic-stage {
      overflow: hidden;
    }
  }

  .modal__description,
  .modal__description-list {
    margin: 1.4rem 0 0;
    font-size: 0.98rem;
    line-height: 1.7;
    color: rgba(226, 238, 255, 0.88);
  }

  .modal__description-list {
    padding-left: 1.2rem;
    list-style: disc;
    display: grid;
    gap: 0.7rem;
  }

  .modal__description-list li {
    margin: 0;
  }

  .modal__skills {
    margin-top: 1.6rem;
  }

  .modal__skills h4 {
    margin: 0 0 0.7rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    color: rgba(198, 222, 255, 0.8);
  }

  .modal__skills ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .modal__skills li {
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    background: rgba(111, 207, 255, 0.18);
    color: rgba(222, 238, 255, 0.9);
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
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

  @keyframes overlay-fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes modal-zoom {
    from {
      opacity: 0;
      transform: translateY(14px) scale(0.96);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  :global(body.modal-open) {
    overflow: hidden;
  }

  @media (max-width: 900px) {
    .cosmic-lane {
      left: 52%;
    }
  }

  @media (max-width: 768px) {
    .cosmic-stage {
      padding-inline: 1rem;
    }

    .cosmic-lane {
      left: 15%;
    }

    .asteroid {
      margin-inline: auto;
      padding: 0;
      transform: translate3d(0, 140px, 0) scale(0.92) rotate(var(--rotation, 0deg));
    }

    .asteroid[data-side='left'],
    .asteroid[data-side='right'] {
      margin: clamp(1.5rem, 6vw, 2.5rem) auto;
      padding: 0;
    }

    .asteroid__trail {
      display: none;
    }

    .experience-modal {
      width: min(560px, 100%);
    }

    .modal__header {
      padding-right: 2rem;
    }
  }

  @media (max-width: 560px) {
    .cosmic-lane {
      display: none;
    }

    .cosmic-stage::before,
    .cosmic-stage::after {
      inset: -20% -30%;
      opacity: 0.4;
    }

    .asteroid {
      width: 100%;
    }

    .asteroid__core {
      padding: 1.1rem 1rem 1.4rem;
    }

    .asteroid__title {
      font-size: clamp(1.1rem, 4vw, 1.35rem);
    }

    .asteroid__skills li {
      font-size: 0.7rem;
    }

    .experience-modal {
      padding: 1.4rem;
      max-height: 90vh;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cosmic-stage::before,
    .cosmic-stage::after,
    .cosmic-lane::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }

    .asteroid.is-floating {
      animation: none;
    }

    .asteroid.is-floating .asteroid__trail::after {
      animation: none;
    }

    .experience-modal-overlay,
    .experience-modal {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
</style>
