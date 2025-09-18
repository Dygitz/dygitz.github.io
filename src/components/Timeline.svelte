<script lang="ts">
  import { onMount } from 'svelte';
  import type { Job } from '../data/jobs';

  export let items: Job[] = [
    {
      dateRange: '2021 - Current',
      title: 'Interstellar Navigator',
      company: 'Deep Space Ventures',
      description: 'Charted new orbital trade routes and kept the crew safe from cosmic anomalies.',
    },
    {
      dateRange: '2019 - 2021',
      title: 'Satellite Systems Engineer',
      company: 'Orbital Labs',
      description: 'Maintained remote systems and deployed fault-tolerant upgrades across the constellation.',
    },
  ];

  let visibleIndices = new Set<number>();
  let observer: IntersectionObserver | null = null;
  const pendingNodes: HTMLElement[] = [];

  function getSide(index: number) {
    return index % 2 === 0 ? 'right' : 'left';
  }

  function register(node: HTMLElement) {
    if (observer) {
      observer.observe(node);
    } else {
      pendingNodes.push(node);
    }

    return {
      destroy() {
        if (observer) {
          observer.unobserve(node);
        } else {
          const index = pendingNodes.indexOf(node);
          if (index !== -1) {
            pendingNodes.splice(index, 1);
          }
        }
      },
    };
  }

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const node = entry.target as HTMLElement;
            const index = Number(node.dataset.index);

            if (!Number.isNaN(index)) {
              const updated = new Set(visibleIndices);
              updated.add(index);
              visibleIndices = updated;
              observer?.unobserve(node);
            }
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    if (pendingNodes.length > 0) {
      pendingNodes.forEach((node) => observer?.observe(node));
      pendingNodes.length = 0;
    }

    return () => {
      observer?.disconnect();
      observer = null;
    };
  });
</script>

<div class="timeline-container">
  <div class="timeline-track" aria-hidden="true"></div>
  {#each items as item, i}
    {@const trimmedDescription = item.description?.trim()}
    <div
      class="timeline-item"
      class:visible={visibleIndices.has(i)}
      data-side={getSide(i)}
      data-index={i}
      use:register
      style={`--item-delay: ${Math.min(i * 120, 480)}ms;`}
    >
      <div class="timeline-connector" aria-hidden="true"></div>
      <span class="timeline-node" aria-hidden="true"></span>
      <div class="asteroid-shell" aria-hidden="true">
        <div class="asteroid">
          <span class="asteroid-tail"></span>
          <span class="crater crater-large"></span>
          <span class="crater crater-medium"></span>
          <span class="crater crater-small"></span>
          <span class="asteroid-spark spark-one"></span>
          <span class="asteroid-spark spark-two"></span>
        </div>
      </div>
      <article class="item-content">
        <p class="item-date">{item.dateRange}</p>
        <h3 class="item-title">{item.title}</h3>
        <p class="item-company">{item.company}</p>
        {#if trimmedDescription}
          <p class="item-description">{trimmedDescription}</p>
        {/if}
      </article>
    </div>
  {/each}
</div>

<style>
  .timeline-container {
    --timeline-gap: clamp(5rem, 12vw, 9.5rem);
    position: relative;
    max-width: min(1100px, 90vw);
    margin: 0 auto;
    padding: clamp(3rem, 6vw, 5rem) 0 clamp(6rem, 8vw, 7rem);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--timeline-gap);
    row-gap: clamp(3.5rem, 8vw, 6rem);
  }

  .timeline-container::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at top, rgba(70, 63, 175, 0.25), transparent 55%),
      radial-gradient(ellipse at bottom, rgba(13, 135, 197, 0.2), transparent 60%);
    pointer-events: none;
    opacity: 0.6;
    filter: blur(0.5px);
    z-index: 0;
  }

  .timeline-track {
    position: absolute;
    top: clamp(1.5rem, 4vw, 3rem);
    bottom: clamp(2rem, 6vw, 4rem);
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    background: linear-gradient(
      180deg,
      rgba(118, 206, 255, 0) 0%,
      rgba(118, 206, 255, 0.25) 10%,
      rgba(118, 206, 255, 0.8) 50%,
      rgba(118, 206, 255, 0.25) 90%,
      rgba(118, 206, 255, 0) 100%
    );
    border-radius: 999px;
    box-shadow: 0 0 22px rgba(98, 196, 255, 0.55), 0 0 0 1px rgba(118, 206, 255, 0.25);
    pointer-events: none;
    z-index: 1;
  }

  .timeline-item {
    --node-size: clamp(1.2rem, 2vw, 1.6rem);
    position: relative;
    display: flex;
    align-items: stretch;
    gap: clamp(1.2rem, 3vw, 2rem);
    grid-column: span 1;
    opacity: 0;
    transform: translateY(80px) scale(0.96);
    transition: transform 1s cubic-bezier(0.2, 0.8, 0.3, 1), opacity 0.6s ease-out;
    transition-delay: var(--item-delay, 0ms);
    z-index: 2;
  }

  .timeline-item.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .timeline-item[data-side='left'] {
    grid-column: 1;
    justify-self: end;
    flex-direction: row;
    text-align: right;
  }

  .timeline-item[data-side='right'] {
    grid-column: 2;
    justify-self: start;
    flex-direction: row-reverse;
    text-align: left;
  }

  .timeline-item::before {
    content: '';
    position: absolute;
    inset: -0.75rem;
    border-radius: 24px;
    background: radial-gradient(circle at top, rgba(91, 116, 255, 0.08), transparent 70%);
    opacity: 0;
    transition: opacity 0.6s ease-out;
    transition-delay: calc(var(--item-delay, 0ms) + 120ms);
    z-index: -1;
  }

  .timeline-item.visible::before {
    opacity: 1;
  }

  .timeline-node,
  .timeline-connector {
    position: absolute;
    top: 50%;
    pointer-events: none;
  }

  .timeline-node {
    width: var(--node-size);
    height: var(--node-size);
    margin-top: calc(var(--node-size) / -2);
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #ffffff, rgba(155, 213, 255, 0.9) 55%, rgba(84, 160, 255, 0.2) 80%);
    box-shadow: 0 0 0 0.35rem rgba(102, 198, 255, 0.14), 0 0 20px rgba(102, 198, 255, 0.65);
    transform: scale(0);
    transition: transform 0.45s ease-out;
    transition-delay: calc(var(--item-delay, 0ms) + 130ms);
    z-index: 1;
  }

  .timeline-item.visible .timeline-node {
    transform: scale(1);
  }

  .timeline-item[data-side='left'] .timeline-node {
    right: calc(-0.5 * var(--timeline-gap) + var(--node-size) / 2);
  }

  .timeline-item[data-side='right'] .timeline-node {
    left: calc(-0.5 * var(--timeline-gap) + var(--node-size) / 2);
  }

  .timeline-connector {
    height: 2px;
    width: calc(0.5 * var(--timeline-gap) - var(--node-size) / 2);
    background: linear-gradient(
      90deg,
      rgba(157, 220, 255, 0) 0%,
      rgba(157, 220, 255, 0.85) 45%,
      rgba(157, 220, 255, 0.45) 100%
    );
    transform: translateY(-50%) scaleX(0);
    transform-origin: left center;
    opacity: 0;
    transition: transform 0.65s cubic-bezier(0.2, 0.8, 0.3, 1), opacity 0.45s ease-out;
    transition-delay: calc(var(--item-delay, 0ms) + 80ms);
    z-index: 0;
  }

  .timeline-item[data-side='left'] .timeline-connector {
    right: calc(var(--node-size) / 2);
    transform-origin: right center;
    background: linear-gradient(
      270deg,
      rgba(157, 220, 255, 0) 0%,
      rgba(157, 220, 255, 0.85) 45%,
      rgba(157, 220, 255, 0.45) 100%
    );
  }

  .timeline-item[data-side='right'] .timeline-connector {
    left: calc(var(--node-size) / 2);
  }

  .timeline-item.visible .timeline-connector {
    opacity: 0.8;
    transform: translateY(-50%) scaleX(1);
  }

  .asteroid-shell {
    position: relative;
    width: clamp(5.1rem, 9vw, 6.6rem);
    flex-shrink: 0;
    display: grid;
    place-items: center;
    opacity: 0;
    transform: translateX(0) scale(0.7);
    transition: transform 0.95s cubic-bezier(0.16, 0.84, 0.44, 1.08), opacity 0.55s ease-out;
    transition-delay: calc(var(--item-delay, 0ms) + 50ms);
  }

  .timeline-item[data-side='left'] .asteroid-shell {
    transform: translateX(-180%) scale(0.65) rotate(-10deg);
  }

  .timeline-item[data-side='right'] .asteroid-shell {
    transform: translateX(180%) scale(0.65) rotate(10deg);
  }

  .timeline-item.visible .asteroid-shell {
    opacity: 1;
    transform: translateX(0) scale(1) rotate(0deg);
  }

  .asteroid {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 58% 42% 60% 40% / 46% 58% 42% 54%;
    background: radial-gradient(circle at 32% 28%, rgba(255, 236, 185, 0.95), rgba(255, 170, 69, 0.85) 45%, rgba(188, 97, 36, 0.95) 80%, rgba(117, 46, 23, 0.95) 100%);
    box-shadow:
      inset -18px -24px 30px rgba(61, 22, 6, 0.55),
      inset 12px 16px 28px rgba(255, 235, 197, 0.2),
      0 18px 35px rgba(21, 10, 3, 0.6),
      0 0 32px rgba(255, 191, 119, 0.4);
    overflow: visible;
    transform: rotate(var(--asteroid-tilt, 8deg));
    filter: saturate(1.08);
  }

  .timeline-item[data-side='left'] .asteroid {
    --asteroid-tilt: 10deg;
  }

  .timeline-item[data-side='right'] .asteroid {
    --asteroid-tilt: -8deg;
  }

  .timeline-item.visible .asteroid {
    animation: asteroid-glow 6.8s ease-in-out infinite;
    animation-delay: calc(var(--item-delay, 0ms) + 400ms);
  }

  .asteroid-tail {
    position: absolute;
    height: 6px;
    width: 160%;
    top: 58%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255, 235, 196, 0), rgba(255, 216, 153, 0.85) 55%, rgba(255, 161, 72, 0.35) 100%);
    filter: blur(1px);
    opacity: 0;
    transform: scaleX(0.25);
    transition: opacity 0.45s ease-out, transform 0.6s ease-out;
    transition-delay: calc(var(--item-delay, 0ms) + 120ms);
  }

  .timeline-item[data-side='left'] .asteroid-tail {
    right: 105%;
    transform-origin: right center;
    background: linear-gradient(270deg, rgba(255, 235, 196, 0), rgba(255, 216, 153, 0.85) 55%, rgba(255, 161, 72, 0.35) 100%);
  }

  .timeline-item[data-side='right'] .asteroid-tail {
    left: 105%;
    transform-origin: left center;
  }

  .timeline-item.visible .asteroid-tail {
    opacity: 0.9;
    transform: scaleX(1);
  }

  .crater {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, rgba(255, 218, 170, 0.5), rgba(113, 56, 32, 0.85) 80%);
    box-shadow: inset -6px -8px 14px rgba(38, 14, 5, 0.65);
    opacity: 0.85;
  }

  .crater-large {
    width: 32%;
    height: 32%;
    top: 28%;
    left: 20%;
  }

  .crater-medium {
    width: 24%;
    height: 24%;
    bottom: 24%;
    right: 18%;
  }

  .crater-small {
    width: 18%;
    height: 18%;
    top: 20%;
    right: 28%;
  }

  .asteroid-spark {
    position: absolute;
    width: clamp(6px, 1vw, 8px);
    height: clamp(6px, 1vw, 8px);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 12px rgba(163, 219, 255, 0.8);
    opacity: 0;
    transform: scale(0);
    animation: spark-pop 1.8s ease-out infinite;
  }

  .timeline-item.visible .asteroid-spark {
    opacity: 1;
    transform: scale(1);
  }

  .spark-one {
    top: 16%;
    right: -14%;
    animation-delay: calc(var(--item-delay, 0ms) + 500ms);
  }

  .spark-two {
    bottom: 12%;
    left: -18%;
    animation-delay: calc(var(--item-delay, 0ms) + 760ms);
  }

  .item-content {
    position: relative;
    width: min(26rem, 100%);
    padding: clamp(1.2rem, 3.2vw, 1.85rem);
    border-radius: 18px;
    background:
      linear-gradient(135deg, rgba(44, 57, 115, 0.45), rgba(17, 23, 53, 0.85)),
      rgba(14, 18, 40, 0.85);
    border: 1px solid rgba(118, 184, 255, 0.3);
    box-shadow:
      0 26px 45px rgba(9, 13, 28, 0.55),
      inset 0 0 0 1px rgba(176, 229, 255, 0.08);
    backdrop-filter: blur(10px);
    color: #f5f8ff;
    overflow: hidden;
  }

  .item-content::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(125deg, rgba(116, 207, 255, 0.1), transparent 50%);
    opacity: 0.6;
    pointer-events: none;
  }

  .item-date {
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(188, 214, 255, 0.85);
    margin-bottom: 0.75rem;
  }

  .item-title {
    font-size: clamp(1.1rem, 2.3vw, 1.45rem);
    font-weight: 700;
    margin-bottom: 0.35rem;
    background: linear-gradient(90deg, rgba(155, 219, 255, 0.9), rgba(166, 146, 255, 0.95));
    -webkit-background-clip: text;
    color: transparent;
  }

  .item-company {
    font-size: 1rem;
    font-weight: 600;
    color: rgba(211, 230, 255, 0.9);
    margin-bottom: 0.85rem;
  }

  .item-description {
    font-size: 0.95rem;
    line-height: 1.6;
    color: rgba(226, 235, 255, 0.82);
  }

  @keyframes asteroid-glow {
    0%,
    100% {
      transform: rotate(var(--asteroid-tilt, 8deg));
      box-shadow:
        inset -18px -24px 30px rgba(61, 22, 6, 0.55),
        inset 12px 16px 28px rgba(255, 235, 197, 0.2),
        0 18px 35px rgba(21, 10, 3, 0.6),
        0 0 32px rgba(255, 191, 119, 0.4);
    }

    50% {
      transform: rotate(calc(var(--asteroid-tilt, 8deg) + 3deg)) translateY(-4px) scale(1.02);
      box-shadow:
        inset -18px -24px 30px rgba(61, 22, 6, 0.55),
        inset 12px 16px 32px rgba(255, 235, 197, 0.28),
        0 25px 45px rgba(21, 10, 3, 0.55),
        0 0 42px rgba(255, 201, 144, 0.55);
    }
  }

  @keyframes spark-pop {
    0%,
    100% {
      transform: scale(0.4);
      opacity: 0;
    }

    20% {
      transform: scale(1.2);
      opacity: 0.9;
    }

    60% {
      transform: scale(0.8);
      opacity: 0.4;
    }
  }

  @media (max-width: 980px) {
    .timeline-container {
      --timeline-gap: clamp(3rem, 10vw, 4.5rem);
      grid-template-columns: minmax(0, 1fr);
      row-gap: clamp(2.5rem, 7vw, 4rem);
      padding: clamp(2.5rem, 8vw, 4rem) 1.25rem clamp(4rem, 10vw, 6rem);
    }

    .timeline-track {
      left: 2.5rem;
      width: 3px;
    }

    .timeline-item {
      grid-column: 1;
      justify-self: stretch;
      flex-direction: row;
      text-align: left;
      margin-left: clamp(0.5rem, 4vw, 1rem);
      padding-left: clamp(3.5rem, 10vw, 5rem);
    }

    .timeline-item::before {
      inset: -0.5rem;
    }

    .timeline-item[data-side='left'],
    .timeline-item[data-side='right'] {
      flex-direction: row;
      text-align: left;
    }

    .timeline-node {
      left: 0;
      right: auto;
    }

    .timeline-item[data-side='left'] .timeline-node,
    .timeline-item[data-side='right'] .timeline-node {
      left: calc(-1 * clamp(3.5rem, 10vw, 5rem) + var(--node-size) / 2);
    }

    .timeline-connector {
      left: calc(var(--node-size) / 2);
      right: auto;
      width: calc(clamp(3.5rem, 10vw, 5rem) - var(--node-size) / 2);
      background: linear-gradient(
        90deg,
        rgba(157, 220, 255, 0) 0%,
        rgba(157, 220, 255, 0.85) 45%,
        rgba(157, 220, 255, 0.45) 100%
      );
      transform-origin: left center;
    }

    .asteroid-shell {
      width: clamp(4.5rem, 16vw, 5.75rem);
    }

    .timeline-item[data-side='left'] .asteroid-shell,
    .timeline-item[data-side='right'] .asteroid-shell {
      transform: translateX(-150%) scale(0.65) rotate(-6deg);
    }

    .item-content {
      width: 100%;
    }
  }

  @media (max-width: 640px) {
    .timeline-container {
      padding-bottom: clamp(3.5rem, 12vw, 4.5rem);
    }

    .timeline-track {
      display: none;
    }

    .timeline-item {
      padding-left: 0;
      margin-left: 0;
    }

    .timeline-node,
    .timeline-connector {
      display: none;
    }

    .asteroid-shell {
      width: clamp(4.2rem, 18vw, 5.2rem);
    }

    .timeline-item[data-side='left'] .asteroid-shell,
    .timeline-item[data-side='right'] .asteroid-shell {
      transform: translateX(-120%) scale(0.65) rotate(-4deg);
    }

    .item-content {
      padding: clamp(1rem, 5vw, 1.4rem);
    }

    .item-description {
      font-size: 0.92rem;
    }
  }
</style>
