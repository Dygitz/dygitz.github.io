<script>
  import { onDestroy, onMount, tick } from 'svelte';

  export let items = [
    {
      dateRange: '2021 - Present',
      title: 'Software Engineer Intern',
      company: 'Company 4',
      employmentType: 'Internship',
      location: 'Remote',
      team: 'Infrastructure Team',
      skills: ['Kubernetes', 'AWS', 'Datadog'],
      description: 'Customer Success Representative.',
    },
    {
      dateRange: '2019 - 2021',
      title: 'Software Engineer',
      company: 'Company 3',
      employmentType: 'Full-time',
      location: 'Hybrid',
      team: 'Platform Team',
      skills: ['React', 'Node.js'],
      description: 'Project Management, System Administrator.',
    },
    {
      dateRange: '2018 - 2019',
      title: 'Support Specialist',
      company: 'Company 2',
      employmentType: 'Internship',
      location: 'On-site',
      team: 'Support',
      skills: ['Customer Success'],
      description: 'Support Specialist.',
    },
    {
      dateRange: '2017 - 2018',
      title: 'Debugging Engineer',
      company: 'Company 1',
      employmentType: 'Part-time',
      location: 'Remote',
      team: 'QA',
      skills: ['Debugging', 'QA'],
      description: 'Debugging, Code QA.',
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
    },
  ];

  let cosmicItems = [];
  let visibleItems = new Set();
  let floatingItems = new Set();
  let activeItem = null;
  let closeButton;
  let isBrowser = false;
  let lastFocusedElement = null;

  $: cosmicItems = items.map((item, index) => {
    const variation = variations[index % variations.length];
    const side = variation.side ?? (index % 2 === 0 ? 'left' : 'right');
    const skills = Array.isArray(item.skills) ? item.skills : [];
    const skillPreview =
      skills.length > 0
        ? skills.length > 3
          ? `${skills.slice(0, 3).join(' · ')} +${skills.length - 3} more`
          : skills.join(' · ')
        : null;
    const hasSummary = Boolean(item.location || item.team || skillPreview);

    return {
      ...item,
      index,
      side,
      drift: variation.drift ?? (side === 'left' ? -58 : 58),
      rotation: variation.rotation ?? (side === 'left' ? -12 : 12),
      scale: variation.scale ?? 0.92,
      hue: variation.hue ?? 220 + index * 24,
      floatDuration: variation.floatDuration ?? (13 + (index % 3)),
      floatDelay: variation.floatDelay ?? index * 0.35,
      trailSkew: variation.trailSkew ?? (side === 'left' ? -18 : 18),
      hasSummary,
      skillPreview,
    };
  });

  $: if (isBrowser && typeof document !== 'undefined') {
    document.body.classList.toggle('timeline-modal-open', Boolean(activeItem));
  }

  async function openModal(item) {
    if (typeof document !== 'undefined') {
      const activeElement = document.activeElement;
      if (activeElement && activeElement instanceof HTMLElement) {
        lastFocusedElement = activeElement;
      }
    }

    activeItem = item;
    await tick();
    closeButton?.focus();
  }

  function closeModal() {
    activeItem = null;

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }

    lastFocusedElement = null;
  }

  onMount(() => {
    isBrowser = true;

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

  onMount(() => {
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && activeItem) {
        event.preventDefault();
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });

  onDestroy(() => {
    if (isBrowser && typeof document !== 'undefined') {
      document.body.classList.remove('timeline-modal-open');
    }
  });
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
      <button
        class="asteroid__button"
        type="button"
        aria-haspopup="dialog"
        aria-labelledby={`timeline-item-${item.index}-title timeline-item-${item.index}-company`}
        aria-describedby={item.hasSummary ? `timeline-item-${item.index}-summary` : undefined}
        on:click={() => openModal(item)}
      >
        <div class="asteroid__trail" aria-hidden="true"></div>
        <div class="asteroid__core">
          <div class="asteroid__header">
            <span class="asteroid__date">{item.dateRange}</span>
            {#if item.employmentType}
              <span class="asteroid__badge">{item.employmentType}</span>
            {/if}
          </div>
          <h3 class="asteroid__title" id={`timeline-item-${item.index}-title`}>{item.title}</h3>
          <p class="asteroid__company" id={`timeline-item-${item.index}-company`}>
            <span>{item.company}</span>
            {#if item.employmentType}
              <span class="asteroid__company-type">{item.employmentType}</span>
            {/if}
          </p>
          {#if item.hasSummary}
            <div class="asteroid__summary" id={`timeline-item-${item.index}-summary`}>
              <p class="asteroid__summary-item">
                <span class="asteroid__summary-icon" aria-hidden="true">📅</span>
                <span>{item.dateRange}</span>
              </p>
              {#if item.location}
                <p class="asteroid__summary-item">
                  <span class="asteroid__summary-icon" aria-hidden="true">📍</span>
                  <span>{item.location}</span>
                </p>
              {/if}
              {#if item.team}
                <p class="asteroid__summary-item">
                  <span class="asteroid__summary-icon" aria-hidden="true">👥</span>
                  <span>{item.team}</span>
                </p>
              {/if}
              {#if item.skillPreview}
                <p class="asteroid__summary-item">
                  <span class="asteroid__summary-label">Skills</span>
                  <span>{item.skillPreview}</span>
                </p>
              {/if}
            </div>
          {/if}
          <div class="asteroid__cta" aria-hidden="true">
            <span>View details</span>
            <svg class="asteroid__cta-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2 6h6.2L5.4 3.2 6.8 1.8 11 6l-4.2 4.2-1.4-1.4L8.2 6H2z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </button>
    </article>
  {/each}
</div>

{#if activeItem}
  <div class="timeline-modal-layer" role="presentation">
    <button
      class="timeline-modal-backdrop"
      type="button"
      aria-label="Close experience details"
      tabindex="-1"
      on:click={closeModal}
    ></button>
    <div
      class="timeline-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`timeline-modal-${activeItem.index}-title`}
    >
      <button
        class="timeline-modal__close"
        type="button"
        aria-label="Close experience details"
        on:click={closeModal}
        bind:this={closeButton}
      >
        <span aria-hidden="true">×</span>
      </button>
      <span class="timeline-modal__date">{activeItem.dateRange}</span>
      <h3 class="timeline-modal__title" id={`timeline-modal-${activeItem.index}-title`}>
        {activeItem.title}
      </h3>
      <p class="timeline-modal__company">{activeItem.company}</p>
      <div class="timeline-modal__meta">
        {#if activeItem.employmentType}
          <span>{activeItem.employmentType}</span>
        {/if}
        {#if activeItem.location}
          <span>{activeItem.location}</span>
        {/if}
      </div>
      {#if activeItem.team}
        <p class="timeline-modal__team">{activeItem.team}</p>
      {/if}
      {#if activeItem.skills?.length}
        <div class="timeline-modal__skills" aria-label="Skills">
          {#each activeItem.skills as skill}
            <span>{skill}</span>
          {/each}
        </div>
      {/if}
      {#if activeItem.details?.length}
        <ul class="timeline-modal__details">
          {#each activeItem.details as detail}
            <li>{detail}</li>
          {/each}
        </ul>
      {:else if activeItem.description}
        <p class="timeline-modal__description">{activeItem.description}</p>
      {:else}
        <p class="timeline-modal__description timeline-modal__description--muted">
          More details coming soon.
        </p>
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
    cursor: pointer;
    outline: none;
  }

  .asteroid[data-side='left'] {
    margin-right: auto;
    padding-right: clamp(0.75rem, 4vw, 2.5rem);
  }

  .asteroid[data-side='right'] {
    margin-left: auto;
    padding-left: clamp(0.75rem, 4vw, 2.5rem);
  }

  .asteroid__button {
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    text-align: left;
    color: inherit;
    cursor: inherit;
  }

  .asteroid__button:focus {
    outline: none;
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
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    transition: border-color 0.35s ease, box-shadow 0.35s ease;
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

  .asteroid__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.35rem;
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

  .asteroid__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.15rem 0.55rem;
    border-radius: 999px;
    background: linear-gradient(135deg, rgba(82, 126, 214, 0.35), rgba(126, 214, 255, 0.2));
    border: 1px solid rgba(141, 197, 255, 0.3);
    color: rgba(224, 241, 255, 0.85);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    white-space: nowrap;
  }

  .asteroid__title {
    font-size: clamp(1.15rem, 2.4vw, 1.5rem);
    font-weight: 700;
    margin: 0;
    color: hsl(var(--hue, 210), 88%, 70%);
    text-shadow: 0 0 20px hsla(var(--hue, 210), 92%, 70%, 0.6);
  }

  .asteroid__company {
    margin: 0.15rem 0 0;
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: rgba(188, 230, 255, 0.9);
  }

  .asteroid__company-type {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.18rem 0.65rem;
    border-radius: 999px;
    background: linear-gradient(135deg, rgba(82, 126, 214, 0.32), rgba(126, 214, 255, 0.12));
    border: 1px solid rgba(126, 214, 255, 0.3);
    font-size: 0.68rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(208, 238, 255, 0.85);
    white-space: nowrap;
  }

  .asteroid__summary {
    margin-top: 0.9rem;
    display: grid;
    gap: 0.5rem;
  }

  .asteroid__summary-item {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    color: rgba(210, 236, 255, 0.78);
    font-size: 0.84rem;
    line-height: 1.45;
  }

  .asteroid__summary-item span:last-child {
    flex: 1;
    min-width: 0;
  }

  .asteroid__summary-icon {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 999px;
    background: rgba(72, 108, 168, 0.42);
    color: rgba(208, 238, 255, 0.96);
    font-size: 0.78rem;
    box-shadow: 0 0 10px rgba(98, 170, 255, 0.25);
  }

  .asteroid__summary-label {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.68rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 600;
    color: rgba(208, 236, 255, 0.85);
    flex-shrink: 0;
  }

  .asteroid__cta {
    margin-top: 1.15rem;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.42rem 0.85rem;
    border-radius: 999px;
    background: linear-gradient(135deg, rgba(126, 214, 255, 0.14), rgba(126, 214, 255, 0.05));
    border: 1px solid rgba(126, 214, 255, 0.28);
    font-size: 0.75rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(167, 218, 255, 0.72);
    transition: background 0.35s ease, border-color 0.35s ease, color 0.35s ease, transform 0.35s ease;
  }

  .asteroid__cta-icon {
    transition: transform 0.35s ease;
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

  .asteroid.is-visible:hover .asteroid__core,
  .asteroid__button:focus-visible .asteroid__core {
    border-color: rgba(141, 197, 255, 0.45);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.1),
      0 22px 44px rgba(15, 22, 45, 0.65);
  }

  .asteroid.is-visible:hover .asteroid__cta,
  .asteroid__button:focus-visible .asteroid__cta {
    background: linear-gradient(135deg, rgba(126, 214, 255, 0.24), rgba(126, 214, 255, 0.1));
    border-color: rgba(126, 214, 255, 0.45);
    color: rgba(208, 238, 255, 0.95);
    transform: translateY(-1px);
  }

  .asteroid.is-visible:hover .asteroid__cta-icon,
  .asteroid__button:focus-visible .asteroid__cta-icon {
    transform: translateX(4px);
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

  .timeline-modal-layer {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    padding: clamp(1.5rem, 6vw, 3rem);
    z-index: 99;
  }

  .timeline-modal-backdrop {
    position: absolute;
    inset: 0;
    border: none;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 20% 20%, rgba(59, 84, 136, 0.55), transparent 70%), rgba(6, 10, 22, 0.78);
    backdrop-filter: blur(14px);
    cursor: pointer;
    z-index: 1;
  }

  .timeline-modal-backdrop:focus-visible,
  .timeline-modal-backdrop:hover {
    outline: 2px solid rgba(126, 214, 255, 0.35);
  }

  .timeline-modal {
    position: relative;
    z-index: 2;
    max-width: 560px;
    width: min(100%, 520px);
    max-height: min(85vh, 720px);
    overflow: auto;
    padding: clamp(1.75rem, 4vw, 2.5rem);
    border-radius: 24px;
    background: linear-gradient(160deg, rgba(18, 29, 52, 0.95), rgba(11, 16, 30, 0.85));
    border: 1px solid rgba(141, 197, 255, 0.2);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.05),
      0 32px 80px rgba(5, 9, 24, 0.65);
    color: #e8f2ff;
  }

  .timeline-modal__close {
    position: absolute;
    top: 1.1rem;
    right: 1.1rem;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 999px;
    background: rgba(17, 28, 46, 0.85);
    border: 1px solid rgba(141, 197, 255, 0.35);
    color: rgba(231, 244, 255, 0.95);
    font-size: 1.45rem;
    line-height: 1;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }

  .timeline-modal__close:hover,
  .timeline-modal__close:focus-visible {
    background: rgba(46, 86, 146, 0.85);
    box-shadow: 0 0 0 3px rgba(126, 214, 255, 0.25);
  }

  .timeline-modal__date {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(208, 230, 255, 0.8);
    margin-bottom: 1rem;
  }

  .timeline-modal__date::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(110, 193, 255, 0.8), rgba(255, 255, 255, 0.75));
    box-shadow: 0 0 22px rgba(126, 214, 255, 0.8);
  }

  .timeline-modal__title {
    margin: 0 0 0.35rem;
    font-size: clamp(1.4rem, 3vw, 1.8rem);
    font-weight: 700;
    color: #f0f6ff;
  }

  .timeline-modal__company {
    margin: 0 0 1.1rem;
    font-size: 1rem;
    font-weight: 600;
    color: rgba(198, 226, 255, 0.9);
  }

  .timeline-modal__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .timeline-modal__meta span {
    display: inline-flex;
    align-items: center;
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
    background: rgba(67, 102, 168, 0.35);
    border: 1px solid rgba(126, 214, 255, 0.25);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(219, 240, 255, 0.9);
  }

  .timeline-modal__team {
    margin: 0 0 0.75rem;
    font-weight: 600;
    color: rgba(233, 243, 255, 0.95);
    letter-spacing: 0.05em;
  }

  .timeline-modal__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.3rem;
  }

  .timeline-modal__skills span {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.65rem;
    border-radius: 0.75rem;
    background: rgba(44, 74, 126, 0.6);
    border: 1px solid rgba(126, 214, 255, 0.2);
    font-size: 0.78rem;
    color: rgba(221, 238, 255, 0.95);
  }

  .timeline-modal__details {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.85rem;
    color: rgba(224, 238, 255, 0.92);
    font-size: 0.98rem;
    line-height: 1.65;
  }

  .timeline-modal__details li {
    position: relative;
    padding-left: 1.4rem;
  }

  .timeline-modal__details li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.65rem;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(126, 214, 255, 0.9), rgba(255, 255, 255, 0.85));
    box-shadow: 0 0 12px rgba(126, 214, 255, 0.65);
  }

  .timeline-modal__description {
    margin: 0;
    color: rgba(224, 238, 255, 0.9);
    line-height: 1.65;
    font-size: 0.98rem;
  }

  .timeline-modal__description--muted {
    color: rgba(189, 210, 232, 0.7);
    font-style: italic;
  }

  :global(body.timeline-modal-open) {
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

    .timeline-modal {
      width: min(100%, 480px);
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

    .asteroid__skills {
      font-size: 0.78rem;
    }

    .asteroid__cta {
      margin-top: 0.9rem;
    }

    .timeline-modal {
      padding: 1.75rem 1.25rem 2rem;
      max-height: 80vh;
    }

    .timeline-modal__close {
      top: 0.9rem;
      right: 0.9rem;
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

    .timeline-modal-backdrop {
      backdrop-filter: none;
    }
  }
</style>
