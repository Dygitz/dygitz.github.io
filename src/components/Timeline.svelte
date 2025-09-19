<script>
  import { onDestroy, onMount, tick } from 'svelte';

  export let items = [
    {
      dateRange: '2021 - Current',
      tenure: '2021 to Current',
      title: 'Job 4',
      company: 'Company 4',
      summary: 'Customer Success Representative.',
      employmentType: 'Full-time',
      location: 'Remote',
      skills: ['Customer Success', 'CRM', 'Support'],
      highlights: [
        'Built out new onboarding flows that improved activation by 12%.',
        'Owned enterprise escalations for six strategic accounts.',
      ],
    },
    {
      dateRange: '2019 - 2021',
      tenure: '2019 to 2021',
      title: 'Job 3',
      company: 'Company 3',
      summary: 'Project Management · Systems',
      employmentType: 'Contract',
      skills: ['Project Management', 'Systems'],
      highlights: ['Shipped multiple cross-functional launches.'],
    },
    {
      dateRange: '2018 - 2019',
      tenure: '2018 to 2019',
      title: 'Job 2',
      company: 'Company 2',
      summary: 'Support Specialist.',
      employmentType: 'Full-time',
    },
    {
      dateRange: '2017 - 2018',
      tenure: '2017 to 2018',
      title: 'Job 1',
      company: 'Company 1',
      summary: 'Debugging, Code QA.',
      employmentType: 'Internship',
    },
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
  let activeJob = null;
  let modalBodyId;
  let closeButton;
  let lastFocusedElement;
  let body;
  let storedOverflow;
  let isScrollLocked = false;

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

  function lockScroll() {
    if (!body || isScrollLocked) return;
    storedOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    isScrollLocked = true;
  }

  function unlockScroll() {
    if (!body || !isScrollLocked) return;
    body.style.overflow = storedOverflow ?? '';
    storedOverflow = undefined;
    isScrollLocked = false;
  }

  function handleGlobalKeydown(event) {
    if (event.key === 'Escape' && activeIndex !== null) {
      event.preventDefault();
      closeModal();
    }
  }

  async function openModal(index, triggerEvent) {
    if (triggerEvent?.currentTarget) {
      lastFocusedElement = triggerEvent.currentTarget;
    } else if (typeof document !== 'undefined') {
      lastFocusedElement = document.activeElement;
    }

    activeIndex = index;
    await tick();

    if (closeButton) {
      closeButton.focus();
    }
  }

  async function closeModal() {
    if (activeIndex === null) return;
    activeIndex = null;
    await tick();

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }

    lastFocusedElement = null;
  }

  onMount(() => {
    body = document.body;
    document.addEventListener('keydown', handleGlobalKeydown);

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
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', handleGlobalKeydown);
      }
      unlockScroll();
    };
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', handleGlobalKeydown);
    }
    unlockScroll();
  });

  $: activeJob =
    activeIndex !== null && cosmicItems[activeIndex] ? cosmicItems[activeIndex] : null;

  $: modalBodyId = activeJob ? `job-modal-body-${activeJob.index}` : undefined;

  $: {
    if (activeJob) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }
</script>

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
      <div class="asteroid__trail" aria-hidden="true"></div>
      <button
        type="button"
        class="asteroid__interactive"
        aria-haspopup="dialog"
        aria-label={`View highlights for ${item.title} at ${item.company}`}
        on:click={(event) => openModal(item.index, event)}
      >
        <div class="asteroid__core">
          <div class="asteroid__date-row">
            <span class="asteroid__date">{item.dateRange}</span>
            {#if item.tenure}
              <span class="asteroid__tenure">{item.tenure}</span>
            {/if}
        </div>
        <h3 class="asteroid__title">{item.title}</h3>
        <p class="asteroid__company">{item.company}</p>
        {#if item.summary}
          <p class="asteroid__summary">{item.summary}</p>
        {/if}
        {#if item.employmentType || item.location}
          <div class="asteroid__meta">
            {#if item.employmentType}
              <span class="asteroid__badge">{item.employmentType}</span>
            {/if}
            {#if item.location}
              <span class="asteroid__location">{item.location}</span>
            {/if}
          </div>
        {/if}
        {#if item.skills?.length}
          <ul class="asteroid__skills">
            {#each item.skills.slice(0, 4) as skill}
              <li>{skill}</li>
            {/each}
            {#if item.skills.length > 4}
              <li class="asteroid__skills-more">+{item.skills.length - 4}</li>
            {/if}
          </ul>
        {/if}
        <div class="asteroid__action">
          <span>View highlights</span>
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M4 10h12m-4-4 4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        </div>
      </button>
    </article>
  {/each}
</div>

{#if activeJob}
  <div class="modal-backdrop" role="presentation">
    <button
      class="modal__underlay"
      type="button"
      aria-hidden="true"
      tabindex="-1"
      on:click={closeModal}
    ></button>
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`job-modal-title-${activeJob.index}`}
      aria-describedby={modalBodyId}
    >
      <header class="modal__header">
        <div class="modal__heading">
          <div class="modal__dates">
            <span class="modal__date">{activeJob.dateRange}</span>
            {#if activeJob.tenure}
              <span class="modal__tenure">{activeJob.tenure}</span>
            {/if}
          </div>
          <h3 class="modal__title" id={`job-modal-title-${activeJob.index}`}>{activeJob.title}</h3>
          <p class="modal__company">{activeJob.company}</p>
          {#if activeJob.summary}
            <p class="modal__summary">{activeJob.summary}</p>
          {/if}
        </div>
        <button
          class="modal__close"
          type="button"
          on:click={closeModal}
          aria-label="Close experience details"
          bind:this={closeButton}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M5 5l10 10M15 5 5 15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </button>
      </header>
      {#if activeJob.employmentType || activeJob.location}
        <div class="modal__meta">
          {#if activeJob.employmentType}
            <span class="modal__pill">{activeJob.employmentType}</span>
          {/if}
          {#if activeJob.location}
            <span class="modal__pill modal__pill--muted">{activeJob.location}</span>
          {/if}
        </div>
      {/if}
      {#if activeJob.skills?.length}
        <ul class="modal__skills">
          {#each activeJob.skills as skill}
            <li>{skill}</li>
          {/each}
        </ul>
      {/if}
      <div class="modal__body" id={modalBodyId}>
        {#if activeJob.highlights?.length}
          <h4>Highlights</h4>
          <ul>
            {#each activeJob.highlights as highlight}
              <li>{highlight}</li>
            {/each}
          </ul>
        {:else if activeJob.description}
          <p>{activeJob.description}</p>
        {:else}
          <p class="modal__placeholder">More details coming soon.</p>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .cosmic-stage {
    position: relative;
    margin: 0 auto;
    max-width: 960px;
    padding: clamp(3rem, 7vw, 5rem) 1.5rem clamp(6rem, 9vw, 8rem);
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
    transition: transform 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease;
    transform: translateY(0);
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

  .asteroid__interactive {
    display: block;
    width: 100%;
    padding: 0;
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .asteroid__interactive:focus-visible {
    outline: none;
  }

  .asteroid:hover .asteroid__core,
  .asteroid__interactive:hover .asteroid__core,
  .asteroid__interactive:focus-visible .asteroid__core {
    transform: translateY(-6px);
    border-color: rgba(141, 197, 255, 0.35);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.08),
      0 24px 48px rgba(10, 15, 37, 0.65);
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

  .asteroid__date-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .asteroid__date {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: rgba(210, 236, 255, 0.8);
  }

  .asteroid__date::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, hsl(var(--hue, 210), 90%, 72%), rgba(255, 255, 255, 0.7));
    box-shadow: 0 0 16px hsla(var(--hue, 210), 90%, 72%, 0.8);
  }

  .asteroid__tenure {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(210, 236, 255, 0.55);
  }

  .asteroid__title {
    font-size: clamp(1.15rem, 2.4vw, 1.5rem);
    font-weight: 700;
    margin: 0 0 0.3rem;
    color: hsl(var(--hue, 210), 88%, 70%);
    text-shadow: 0 0 20px hsla(var(--hue, 210), 92%, 70%, 0.6);
  }

  .asteroid__company {
    margin: 0 0 0.6rem;
    font-weight: 600;
    font-style: italic;
    letter-spacing: 0.02em;
    color: rgba(188, 230, 255, 0.85);
  }

  .asteroid__summary {
    margin: 0 0 0.75rem;
    color: rgba(221, 235, 255, 0.88);
    line-height: 1.45;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .asteroid__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0 0 0.85rem;
  }

  .asteroid__badge {
    display: inline-flex;
    align-items: center;
    padding: 0.32rem 0.7rem;
    border-radius: 999px;
    border: 1px solid rgba(141, 197, 255, 0.24);
    background: rgba(141, 197, 255, 0.16);
    font-size: 0.73rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(210, 236, 255, 0.85);
    font-weight: 600;
  }

  .asteroid__location {
    font-size: 0.85rem;
    color: rgba(210, 236, 255, 0.75);
  }

  .asteroid__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0 0 1rem;
    padding: 0;
    list-style: none;
  }

  .asteroid__skills li {
    padding: 0.32rem 0.65rem;
    border-radius: 999px;
    background: rgba(80, 160, 255, 0.12);
    border: 1px solid rgba(120, 200, 255, 0.2);
    font-size: 0.78rem;
    color: rgba(200, 230, 255, 0.9);
    line-height: 1.2;
  }

  .asteroid__skills-more {
    border-style: dashed;
    border-color: rgba(200, 230, 255, 0.35);
    background: transparent;
    color: rgba(200, 230, 255, 0.75);
  }

  .asteroid__action {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.86rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: hsl(var(--hue, 210), 88%, 70%);
  }

  .asteroid__action svg {
    width: 1.05rem;
    height: 1.05rem;
    transition: transform 0.3s ease;
  }

  .asteroid:hover .asteroid__action svg,
  .asteroid__interactive:hover .asteroid__action svg,
  .asteroid__interactive:focus-visible .asteroid__action svg {
    transform: translateX(4px);
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

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(5, 9, 20, 0.82);
    backdrop-filter: blur(18px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(1.5rem, 4vw, 2.5rem);
    z-index: 60;
    animation: modal-fade 0.3s ease;
  }

  .modal__underlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  .modal__underlay:focus {
    outline: none;
  }

  .modal {
    width: min(640px, calc(100% - 2rem));
    max-height: min(90vh, 720px);
    overflow-y: auto;
    background: linear-gradient(160deg, rgba(20, 29, 52, 0.95), rgba(12, 18, 36, 0.9));
    border-radius: 24px;
    border: 1px solid rgba(141, 197, 255, 0.25);
    box-shadow: 0 30px 80px rgba(6, 10, 26, 0.6);
    padding: clamp(1.6rem, 3vw, 2.2rem);
    color: #eaf4ff;
    position: relative;
    animation: modal-pop 0.28s ease;
    -webkit-overflow-scrolling: touch;
    z-index: 1;
  }

  .modal__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.4rem;
    margin-bottom: 1.4rem;
  }

  .modal__heading {
    flex: 1;
  }

  .modal__dates {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.8rem;
  }

  .modal__date {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(210, 236, 255, 0.82);
  }

  .modal__date::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, hsl(var(--hue, 210), 90%, 72%), rgba(255, 255, 255, 0.75));
    box-shadow: 0 0 16px hsla(var(--hue, 210), 90%, 72%, 0.8);
  }

  .modal__tenure {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(210, 236, 255, 0.58);
  }

  .modal__title {
    margin: 0 0 0.4rem;
    font-size: clamp(1.35rem, 3vw, 1.7rem);
    color: hsl(var(--hue, 210), 90%, 74%);
    text-shadow: 0 0 24px hsla(var(--hue, 210), 92%, 70%, 0.6);
  }

  .modal__company {
    margin: 0 0 0.6rem;
    font-weight: 600;
    font-style: italic;
    letter-spacing: 0.03em;
    color: rgba(188, 230, 255, 0.9);
  }

  .modal__summary {
    margin: 0;
    font-size: 1rem;
    color: rgba(224, 238, 255, 0.9);
  }

  .modal__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 999px;
    border: 1px solid rgba(141, 197, 255, 0.35);
    background: rgba(18, 24, 42, 0.6);
    color: rgba(210, 236, 255, 0.85);
    cursor: pointer;
    transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
  }

  .modal__close:hover,
  .modal__close:focus-visible {
    background: rgba(35, 52, 84, 0.8);
    border-color: rgba(141, 197, 255, 0.55);
    outline: none;
    transform: scale(1.05);
  }

  .modal__close svg {
    width: 1.1rem;
    height: 1.1rem;
  }

  .modal__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin: 0 0 1.1rem;
  }

  .modal__pill {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.75rem;
    border-radius: 999px;
    border: 1px solid rgba(141, 197, 255, 0.3);
    background: rgba(141, 197, 255, 0.18);
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(210, 236, 255, 0.9);
    font-weight: 600;
  }

  .modal__pill--muted {
    background: rgba(110, 132, 185, 0.12);
    border-color: rgba(141, 197, 255, 0.18);
    color: rgba(210, 236, 255, 0.75);
    text-transform: none;
    letter-spacing: 0.02em;
  }

  .modal__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin: 0 0 1.3rem;
    padding: 0;
    list-style: none;
  }

  .modal__skills li {
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    background: rgba(80, 160, 255, 0.18);
    border: 1px solid rgba(120, 200, 255, 0.28);
    font-size: 0.82rem;
    color: rgba(224, 238, 255, 0.92);
    line-height: 1.2;
  }

  .modal__body {
    border-top: 1px solid rgba(141, 197, 255, 0.18);
    padding-top: 1.3rem;
  }

  .modal__body h4 {
    margin: 0 0 0.9rem;
    font-size: 1rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(210, 236, 255, 0.85);
  }

  .modal__body ul {
    margin: 0;
    padding-left: 1.1rem;
    display: grid;
    gap: 0.7rem;
  }

  .modal__body li {
    line-height: 1.55;
    color: rgba(226, 240, 255, 0.9);
  }

  .modal__body p {
    margin: 0;
    line-height: 1.55;
    color: rgba(226, 240, 255, 0.85);
  }

  .modal__placeholder {
    font-style: italic;
    color: rgba(210, 236, 255, 0.7);
  }

  @keyframes modal-fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes modal-pop {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
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

  @media (max-width: 640px) {
    .modal-backdrop {
      padding: 1.2rem;
      align-items: flex-end;
    }

    .modal {
      width: calc(100% - 1rem);
      max-height: calc(100vh - 1.5rem);
      padding: 1.4rem 1.15rem 1.6rem;
    }

    .modal__header {
      flex-direction: column-reverse;
      align-items: flex-start;
      gap: 1rem;
    }

    .modal__close {
      align-self: flex-end;
    }

    .modal__skills {
      gap: 0.35rem;
    }

    .modal__skills li {
      font-size: 0.78rem;
    }
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

    .asteroid__summary {
      font-size: 0.93rem;
    }

    .asteroid__meta {
      gap: 0.35rem;
    }

    .asteroid__skills {
      gap: 0.3rem;
    }

    .asteroid__skills li {
      font-size: 0.74rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cosmic-stage::before,
    .cosmic-stage::after,
    .cosmic-lane::after,
    .modal-backdrop,
    .modal {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }

    .asteroid.is-floating {
      animation: none;
    }

    .asteroid.is-floating .asteroid__trail::after {
      animation: none;
    }
  }
</style>
