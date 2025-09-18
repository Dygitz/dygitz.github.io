<script lang="ts">
  import { onMount } from "svelte";
  import type { Job } from "../data/jobs";

  const fallbackItems: Job[] = [
    {
      dateRange: "2021 - Current",
      title: "Job 4",
      company: "Company 4",
      description: "Customer Success Representative.",
    },
    {
      dateRange: "2019 - 2021",
      title: "Job 3",
      company: "Company 3",
      description: "Project Management, System Administrator.",
    },
    {
      dateRange: "2018 - 2019",
      title: "Job 2",
      company: "Company 2",
      description: "Support Specialist.",
    },
    {
      dateRange: "2017 - 2018",
      title: "Job 1",
      company: "Company 1",
      description: "Debugging, Code QA.",
    }
  ];

  export let items: Job[] = fallbackItems;

  let visibleItems = new Set<number>();

  const getSide = (index: number) => (index % 2 === 0 ? "right" : "left");

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));

            if (!Number.isNaN(index) && !visibleItems.has(index)) {
              const next = new Set(visibleItems);
              next.add(index);
              visibleItems = next;
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    const nodes = document.querySelectorAll<HTMLElement>(".timeline-entry");
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  });
</script>

<div class="timeline-container">
  <div class="timeline-axis" aria-hidden="true"></div>

  {#each items as item, index}
    <div
      class="timeline-entry"
      data-side={getSide(index)}
      data-index={index}
      class:visible={visibleItems.has(index)}
      style={`--delay: ${index * 140}ms;`}
    >
      <span class="asteroid-trail" aria-hidden="true"></span>
      <span class="orbit-node" aria-hidden="true"></span>
      <span class="cosmic-dust" aria-hidden="true"></span>

      <article class="asteroid-card">
        <span class="item-date">{item.dateRange}</span>
        <h3 class="item-title">{item.title}</h3>
        <span class="item-company">{item.company}</span>
        {#if item.description?.trim().length}
          <p class="item-description">{item.description}</p>
        {/if}
      </article>
    </div>
  {/each}
</div>

<style>
  .timeline-container {
    position: relative;
    max-width: min(1100px, 92vw);
    margin: 0 auto;
    padding: clamp(3.5rem, 7vw, 6rem) 0 clamp(6rem, 9vw, 8rem);
    z-index: 1;
  }

  .timeline-container::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 15% 20%, rgba(120, 215, 255, 0.12), transparent 55%),
      radial-gradient(circle at 80% 30%, rgba(181, 132, 255, 0.1), transparent 62%),
      radial-gradient(circle at 40% 85%, rgba(116, 235, 255, 0.12), transparent 65%);
    opacity: 0.55;
    filter: blur(0.4px);
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.85) 22%,
      rgba(0, 0, 0, 0.85) 78%,
      rgba(0, 0, 0, 0)
    );
    pointer-events: none;
    z-index: 0;
  }

  .timeline-axis {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    transform: translateX(-50%);
    background: linear-gradient(
      180deg,
      rgba(109, 227, 255, 0),
      rgba(109, 227, 255, 0.7) 28%,
      rgba(169, 95, 255, 0.9) 48%,
      rgba(109, 227, 255, 0.7) 68%,
      rgba(109, 227, 255, 0)
    );
    filter: drop-shadow(0 0 12px rgba(120, 215, 255, 0.6));
    opacity: 0.8;
    z-index: 0;
    animation: beamPulse 5.5s ease-in-out infinite;
  }

  .timeline-axis::before {
    content: "";
    position: absolute;
    top: -60px;
    left: 50%;
    width: 160px;
    height: 160px;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(118, 238, 255, 0.15), rgba(118, 238, 255, 0));
    filter: blur(18px);
    opacity: 0.5;
  }

  .timeline-entry {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: clamp(1rem, 2vw, 1.5rem);
    margin: clamp(2.5rem, 6vw, 4rem) 0;
    opacity: 0;
    transform: translateX(var(--offset, 0)) translateY(40px) rotate(var(--tilt, 0deg));
    transition:
      opacity 0.8s ease-out,
      transform 0.9s cubic-bezier(0.19, 1, 0.22, 1);
    transition-delay: var(--delay, 0ms);
    z-index: 1;
  }

  .timeline-entry[data-side="right"] {
    --offset: 140px;
    --tilt: 5deg;
  }

  .timeline-entry[data-side="left"] {
    justify-content: flex-end;
    --offset: -140px;
    --tilt: -5deg;
  }

  .timeline-entry.visible {
    opacity: 1;
    transform: translateX(0) translateY(0) rotate(0deg);
  }

  .orbit-node {
    position: absolute;
    top: 50%;
    left: 50%;
    width: clamp(14px, 2vw, 18px);
    height: clamp(14px, 2vw, 18px);
    border-radius: 9999px;
    transform: translate(-50%, -50%) scale(0.5);
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(74, 190, 255, 0.4) 55%, rgba(74, 190, 255, 0) 100%);
    box-shadow:
      0 0 12px rgba(126, 228, 255, 0.6),
      0 0 22px rgba(169, 95, 255, 0.35);
    opacity: 0;
    transition:
      transform 0.6s ease-out,
      opacity 0.6s ease-out;
    transition-delay: calc(var(--delay, 0ms) + 90ms);
    z-index: 0;
  }

  .timeline-entry.visible .orbit-node {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  .asteroid-trail {
    position: absolute;
    top: 50%;
    left: 50%;
    width: clamp(160px, 18vw, 240px);
    height: clamp(6px, 1.5vw, 10px);
    border-radius: 9999px;
    background: linear-gradient(90deg, rgba(143, 226, 255, 0), rgba(143, 226, 255, 0.85) 45%, rgba(143, 226, 255, 0));
    filter: blur(1px);
    opacity: 0.65;
    transform: translateY(-50%) scaleX(0);
    transform-origin: left;
    transition:
      transform 1s ease-out,
      opacity 0.9s ease-out;
    transition-delay: calc(var(--delay, 0ms) + 160ms);
    z-index: 0;
    mask-image: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85), transparent);
  }

  .timeline-entry[data-side="left"] .asteroid-trail {
    transform: translate(-100%, -50%) scaleX(0);
    transform-origin: right;
    background: linear-gradient(270deg, rgba(143, 226, 255, 0), rgba(143, 226, 255, 0.85) 45%, rgba(143, 226, 255, 0));
  }

  .timeline-entry.visible .asteroid-trail {
    transform: translateY(-50%) scaleX(1.02);
    opacity: 0.9;
    animation: stream 1.6s ease-out forwards, pulseGlow 4.5s ease-in-out infinite 1.4s;
  }

  .timeline-entry.visible[data-side="left"] .asteroid-trail {
    transform: translate(-100%, -50%) scaleX(1.02);
  }

  .cosmic-dust {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .cosmic-dust::before,
  .cosmic-dust::after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.55);
    opacity: 0;
    transform: scale(0.6);
    transition: opacity 0.6s ease-out;
  }

  .cosmic-dust::before {
    top: 25%;
    left: 10%;
    box-shadow:
      30px 12px rgba(255, 255, 255, 0.32),
      90px -18px rgba(122, 227, 255, 0.28),
      140px 6px rgba(255, 255, 255, 0.28);
    animation: twinkle 4s linear infinite;
  }

  .cosmic-dust::after {
    bottom: 18%;
    right: 6%;
    box-shadow:
      -36px -14px rgba(255, 255, 255, 0.35),
      -82px 10px rgba(169, 95, 255, 0.26),
      -120px -20px rgba(118, 238, 255, 0.25);
    animation: twinkle 3.2s linear infinite reverse;
  }

  .timeline-entry.visible .cosmic-dust::before,
  .timeline-entry.visible .cosmic-dust::after {
    opacity: 1;
  }

  .asteroid-card {
    position: relative;
    width: min(420px, 44vw);
    padding: clamp(1.35rem, 3vw, 1.85rem) clamp(1.4rem, 3vw, 2rem);
    color: #f5fbff;
    background:
      radial-gradient(circle at 22% 18%, rgba(134, 220, 255, 0.18), rgba(12, 19, 36, 0.95) 58%),
      radial-gradient(circle at 80% 72%, rgba(168, 98, 255, 0.22), rgba(7, 13, 28, 0.82) 65%);
    border: 1px solid rgba(138, 236, 255, 0.25);
    border-radius: 26px;
    clip-path: polygon(6% 10%, 94% 2%, 100% 46%, 92% 98%, 12% 100%, 0% 56%);
    box-shadow:
      0 26px 46px rgba(4, 14, 35, 0.55),
      inset 0 0 48px rgba(119, 235, 255, 0.08);
    backdrop-filter: blur(8px);
    overflow: hidden;
    z-index: 2;
  }

  .asteroid-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 28% 32%, rgba(255, 255, 255, 0.18), transparent 42%),
      radial-gradient(circle at 68% 46%, rgba(255, 255, 255, 0.1), transparent 50%),
      radial-gradient(circle at 42% 78%, rgba(169, 95, 255, 0.18), transparent 60%);
    opacity: 0.35;
    mix-blend-mode: screen;
    pointer-events: none;
  }

  .asteroid-card::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(110, 231, 255, 0.12), rgba(110, 231, 255, 0));
    mix-blend-mode: lighten;
    opacity: 0.4;
    pointer-events: none;
  }

  .timeline-entry.visible .asteroid-card {
    animation: float 7s ease-in-out infinite;
  }

  .item-date {
    display: inline-block;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(182, 230, 255, 0.75);
    margin-bottom: 0.4rem;
  }

  .item-title {
    font-size: clamp(1.1rem, 2.2vw, 1.4rem);
    margin: 0;
    background: linear-gradient(90deg, #82f7ff 0%, #b4a1ff 50%, #ff9ef3 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .item-company {
    display: block;
    font-size: clamp(0.95rem, 1.8vw, 1.05rem);
    font-weight: 600;
    margin-top: 0.35rem;
    margin-bottom: clamp(0.75rem, 1.8vw, 1rem);
    color: rgba(132, 236, 255, 0.85);
    letter-spacing: 0.04em;
  }

  .item-description {
    margin: 0;
    font-size: clamp(0.9rem, 2vw, 1rem);
    line-height: 1.55;
    color: rgba(232, 244, 255, 0.92);
  }

  .timeline-entry:nth-of-type(3n) .asteroid-card {
    clip-path: polygon(8% 6%, 96% 0%, 100% 42%, 92% 96%, 10% 100%, 0% 58%);
  }

  .timeline-entry:nth-of-type(4n) .asteroid-card {
    clip-path: polygon(4% 12%, 92% 4%, 100% 52%, 90% 98%, 14% 96%, 0% 48%);
  }

  .timeline-entry:nth-of-type(odd) .cosmic-dust::before {
    animation-duration: 3.2s;
  }

  .timeline-entry:nth-of-type(even) .cosmic-dust::after {
    animation-duration: 5s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(0.6deg);
    }

    50% {
      transform: translateY(-10px) rotate(-0.6deg);
    }
  }

  @keyframes beamPulse {
    0%,
    100% {
      opacity: 0.7;
      filter: drop-shadow(0 0 12px rgba(120, 215, 255, 0.5));
    }

    50% {
      opacity: 0.95;
      filter: drop-shadow(0 0 22px rgba(169, 95, 255, 0.7));
    }
  }

  @keyframes stream {
    0% {
      background-position: 0% 50%;
    }

    100% {
      background-position: 100% 50%;
    }
  }

  @keyframes pulseGlow {
    0%,
    100% {
      opacity: 0.85;
    }

    50% {
      opacity: 0.55;
    }
  }

  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.4;
      transform: scale(0.6);
    }

    50% {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  @media (max-width: 1024px) {
    .timeline-entry {
      --offset: 100px;
    }
  }

  @media (max-width: 900px) {
    .timeline-entry,
    .timeline-entry[data-side="left"],
    .timeline-entry[data-side="right"] {
      justify-content: center;
      --offset: 0px;
    }

    .timeline-axis {
      opacity: 0.5;
    }

    .asteroid-trail {
      display: none;
    }

    .orbit-node {
      display: none;
    }

    .asteroid-card {
      width: min(500px, 86vw);
    }
  }

  @media (max-width: 640px) {
    .timeline-container {
      padding: 3rem 0 4.5rem;
    }

    .timeline-axis {
      display: none;
    }

    .timeline-entry {
      margin: 2.5rem auto;
    }

    .asteroid-card {
      border-radius: 22px;
      clip-path: polygon(6% 10%, 94% 6%, 98% 58%, 88% 98%, 14% 96%, 0% 46%);
    }
  }
</style>
