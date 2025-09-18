<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';

  import type { Job } from '../data/jobs';

  type Side = 'left' | 'right';

  interface Variation {
    side?: Side;
    drift?: number;
    rotation?: number;
    scale?: number;
    hue?: number;
    floatDuration?: number;
    floatDelay?: number;
    trailSkew?: number;
  }

  interface CosmicItem extends Job {
    index: number;
    side: Side;
    drift: number;
    rotation: number;
    scale: number;
    hue: number;
    floatDuration: number;
    floatDelay: number;
    trailSkew: number;
  }

  export let items: Job[] = [];

  const variations: Variation[] = [
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

  let cosmicItems: CosmicItem[] = [];
  let visibleItems: Set<number> = new Set();
  let floatingItems: Set<number> = new Set();
  let selectedItem: CosmicItem | null = null;
  let closeButton: HTMLButtonElement | null = null;

  $: cosmicItems = items.map((item, index) => {
    const variation = variations[index % variations.length];
    const side: Side = variation.side ?? (index % 2 === 0 ? 'left' : 'right');

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

  const openModal = async (item: CosmicItem) => {
    selectedItem = item;
    await tick();
    closeButton?.focus();
  };

  const closeModal = () => {
    selectedItem = null;
  };

  const handleGlobalKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && selectedItem) {
      closeModal();
    }
  };

  $: if (typeof document !== 'undefined') {
    if (selectedItem) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }

  onMount(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.asteroid'));

    const observer = new IntersectionObserver(
      (entries) => {
        let nextVisible: Set<number> | null = null;
        let nextFloating: Set<number> | null = null;

        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const indexValue = Number(element.dataset.index);
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
      document.body.classList.remove('modal-open');
    };
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
    }
  });
</script>

<svelte:window on:keydown={handleGlobalKeydown} />

<div class="cosmic-stage">
  <div class="cosmic-lane" aria-hidden="true"></div>
  {#each cosmicItems as item (item.index)}
    <button
      type="button"
      class="asteroid"
      class:is-visible={visibleItems.has(item.index)}
      class:is-floating={floatingItems.has(item.index)}
      data-side={item.side}
      data-index={item.index}
      aria-haspopup="dialog"
      aria-expanded={selectedItem?.index === item.index}
      aria-controls={`job-modal-${item.index}`}
      aria-label={`View experience details: ${item.title} at ${item.company}`}
      on:click={() => openModal(item)}
      style={`--delay:${item.index * 140}ms; --drift:${item.drift}; --rotation:${item.rotation}deg; --scale:${item.scale}; --hue:${item.hue}; --float-duration:${item.floatDuration}s; --float-delay:${item.floatDelay}s; --trail-skew:${item.trailSkew}deg;`}
    >
      <div class="asteroid__trail" aria-hidden="true"></div>
      <div class="asteroid__core">
        <span class="asteroid__date">{item.dateRange}</span>
        <h3 class="asteroid__title" id={`job-${item.index}-card-title`}>{item.title}</h3>
        <p class="asteroid__company">{item.company}</p>
        {#if item.employmentType || item.location}
          <p class="asteroid__meta">
            {#if item.employmentType}{item.employmentType}{/if}
            {#if item.employmentType && item.location}
              &nbsp;·&nbsp;
            {/if}
            {#if item.location}{item.location}{/if}
          </p>
        {/if}
        {#if item.summary}
          <p class="asteroid__summary">{item.summary}</p>
        {/if}
        {#if item.skills?.length}
          <div class="asteroid__skills">
            {#each item.skills.slice(0, 3) as skill}
              <span class="asteroid__skill">{skill}</span>
            {/each}
            {#if item.skills.length > 3}
              <span class="asteroid__skill asteroid__skill--more">+{item.skills.length - 3}</span>
            {/if}
          </div>
        {/if}
        <div class="asteroid__cta">
          <span>View details</span>
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path
              d="M6.25 3.25 5 4.5l3.75 3.75H3v1.5h5.75L5 13.5l1.25 1.25L12 9 6.25 3.25Z"
              fill="currentColor"
            />
          </svg>
        </div>
        </div>
    </button>
  {/each}
</div>

{#if selectedItem}
  <div class="modal-backdrop" role="presentation" on:click={closeModal}>
    <article
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`job-${selectedItem.index}-modal-title`}
      id={`job-modal-${selectedItem.index}`}
      on:click|stopPropagation
    >
      <button
        class="modal__close"
        type="button"
        on:click={closeModal}
        aria-label="Close experience details"
        bind:this={closeButton}
      >
        <span aria-hidden="true">×</span>
      </button>
      <span class="modal__date">{selectedItem.dateRange}</span>
      <h3 class="modal__title" id={`job-${selectedItem.index}-modal-title`}>
        {selectedItem.title}
      </h3>
      <p class="modal__company">{selectedItem.company}</p>
      {#if selectedItem.employmentType || selectedItem.location}
        <p class="modal__meta">
          {#if selectedItem.employmentType}{selectedItem.employmentType}{/if}
          {#if selectedItem.employmentType && selectedItem.location}
            &nbsp;·&nbsp;
          {/if}
          {#if selectedItem.location}{selectedItem.location}{/if}
        </p>
      {/if}
      {#if selectedItem.summary}
        <p class="modal__summary">{selectedItem.summary}</p>
      {/if}
      {#if selectedItem.details?.length}
        <ul class="modal__details">
          {#each selectedItem.details as detail}
            <li>{detail}</li>
          {/each}
        </ul>
      {:else}
        <p class="modal__placeholder">Additional details coming soon.</p>
      {/if}
      {#if selectedItem.skills?.length}
        <div class="modal__skills">
          {#each selectedItem.skills as skill}
            <span class="modal__skill">{skill}</span>
          {/each}
        </div>
      {/if}
    </article>
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
    transform: translate3d(calc(var(--drift, -55) * 1%), 140px, 0) scale(var(--scale, 0.9))
      rotate(var(--rotation, 0deg));
    transition: transform 0.9s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.6s ease-out, filter 0.7s ease-out;
    transition-delay: var(--delay, 0ms);
    filter: blur(10px);
    will-change: transform, opacity;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    text-align: left;
    font: inherit;
    color: inherit;
  }

  .asteroid:focus {
    outline: none;
  }

  .asteroid:focus-visible > .asteroid__core {
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.08),
      0 0 0 3px rgba(112, 206, 255, 0.55),
      0 18px 40px rgba(10, 15, 37, 0.55);
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
    transition: box-shadow 0.35s ease;
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
    margin: 0 0 0.5rem;
    font-weight: 600;
    font-style: italic;
    letter-spacing: 0.02em;
    color: rgba(188, 230, 255, 0.85);
  }

  .asteroid__meta {
    margin: 0 0 0.75rem;
    color: rgba(188, 230, 255, 0.65);
    font-size: 0.85rem;
    letter-spacing: 0.04em;
  }

  .asteroid__summary {
    margin: 0 0 0.9rem;
    color: rgba(221, 235, 255, 0.88);
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .asteroid__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0 0 1.1rem;
  }

  .asteroid__skill {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: rgba(102, 173, 255, 0.14);
    color: rgba(202, 230, 255, 0.88);
    border: 1px solid rgba(130, 192, 255, 0.28);
  }

  .asteroid__skill--more {
    background: rgba(130, 192, 255, 0.16);
    color: rgba(255, 255, 255, 0.85);
  }

  .asteroid__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: rgba(146, 206, 255, 0.8);
    text-transform: uppercase;
    transition: color 0.3s ease;
  }

  .asteroid__cta svg {
    width: 1rem;
    height: 1rem;
  }

  .asteroid:hover .asteroid__cta,
  .asteroid:focus-visible .asteroid__cta,
  .asteroid.is-visible .asteroid__cta {
    color: rgba(195, 233, 255, 0.95);
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

  .modal-backdrop {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    padding: clamp(1.5rem, 4vw, 3rem);
    background: rgba(8, 12, 24, 0.72);
    backdrop-filter: blur(12px);
    z-index: 999;
  }

  .modal {
    position: relative;
    width: min(600px, 100%);
    max-height: min(80vh, 720px);
    overflow-y: auto;
    padding: clamp(1.8rem, 3vw, 2.4rem);
    border-radius: 24px;
    background: linear-gradient(150deg, rgba(22, 33, 56, 0.96), rgba(16, 22, 41, 0.88));
    border: 1px solid rgba(141, 197, 255, 0.22);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.04),
      0 32px 60px rgba(8, 12, 30, 0.65);
  }

  .modal__close {
    position: sticky;
    top: 0;
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 999px;
    border: none;
    background: rgba(24, 36, 62, 0.85);
    color: rgba(222, 235, 255, 0.85);
    font-size: 1.4rem;
    cursor: pointer;
    transition: background 0.25s ease, color 0.25s ease;
  }

  .modal__close:hover,
  .modal__close:focus-visible {
    background: rgba(112, 162, 255, 0.45);
    color: #fff;
    outline: none;
  }

  .modal__date {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.8rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(210, 236, 255, 0.85);
    margin-bottom: 1.1rem;
  }

  .modal__date::before {
    content: '';
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(124, 223, 255, 0.95), rgba(255, 255, 255, 0.7));
    box-shadow: 0 0 18px rgba(124, 223, 255, 0.6);
  }

  .modal__title {
    margin: 0 0 0.35rem;
    font-size: clamp(1.35rem, 3vw, 1.8rem);
    color: rgba(205, 233, 255, 0.95);
  }

  .modal__company {
    margin: 0 0 0.6rem;
    font-weight: 600;
    font-style: italic;
    letter-spacing: 0.03em;
    color: rgba(188, 230, 255, 0.85);
  }

  .modal__meta {
    margin: 0 0 1.25rem;
    color: rgba(188, 230, 255, 0.7);
    letter-spacing: 0.05em;
  }

  .modal__summary {
    margin: 0 0 1.25rem;
    color: rgba(221, 235, 255, 0.88);
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .modal__details {
    margin: 0 0 1.6rem 1.1rem;
    padding: 0;
    list-style: disc;
    color: rgba(226, 236, 255, 0.9);
    display: grid;
    gap: 0.75rem;
  }

  .modal__placeholder {
    margin: 0 0 1.6rem;
    color: rgba(196, 214, 238, 0.7);
    font-style: italic;
  }

  .modal__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .modal__skill {
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: rgba(120, 180, 255, 0.18);
    color: rgba(230, 240, 255, 0.95);
    border: 1px solid rgba(150, 205, 255, 0.3);
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
      font-size: 0.95rem;
    }

    .modal {
      padding: 1.6rem 1.2rem 1.8rem;
    }

    .modal-backdrop {
      padding: 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cosmic-stage::before,
    .cosmic-stage::after,
    .cosmic-lane::after,
    .asteroid.is-floating,
    .asteroid.is-floating .asteroid__trail::after {
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
