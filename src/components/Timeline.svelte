<script>
  import { onMount } from "svelte";

  export let items = [
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
    },
  ];

  const asteroidThemes = [
    {
      core: "linear-gradient(145deg, rgba(64, 35, 116, 0.9), rgba(26, 16, 53, 0.95))",
      glow: "rgba(147, 51, 234, 0.45)",
      trail: "rgba(129, 140, 248, 0.75)",
      crater: "rgba(255, 255, 255, 0.14)",
      halo: "rgba(168, 85, 247, 0.35)",
    },
    {
      core: "linear-gradient(155deg, rgba(14, 62, 94, 0.92), rgba(8, 28, 48, 0.95))",
      glow: "rgba(56, 189, 248, 0.45)",
      trail: "rgba(45, 212, 191, 0.7)",
      crater: "rgba(255, 255, 255, 0.12)",
      halo: "rgba(34, 211, 238, 0.28)",
    },
    {
      core: "linear-gradient(150deg, rgba(90, 20, 63, 0.92), rgba(36, 8, 47, 0.95))",
      glow: "rgba(244, 114, 182, 0.45)",
      trail: "rgba(251, 191, 36, 0.75)",
      crater: "rgba(255, 255, 255, 0.1)",
      halo: "rgba(236, 72, 153, 0.28)",
    },
    {
      core: "linear-gradient(160deg, rgba(32, 83, 59, 0.92), rgba(15, 36, 34, 0.95))",
      glow: "rgba(74, 222, 128, 0.4)",
      trail: "rgba(134, 239, 172, 0.7)",
      crater: "rgba(255, 255, 255, 0.1)",
      halo: "rgba(34, 197, 94, 0.3)",
    },
  ];

  let visibleItems = new Set();

  const getSide = (index) => (index % 2 === 0 ? "right" : "left");
  const getTheme = (index) => asteroidThemes[index % asteroidThemes.length];

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const indexValue = Number(target.dataset.index ?? -1);
            if (!Number.isNaN(indexValue) && indexValue >= 0) {
              const updated = new Set(visibleItems);
              updated.add(indexValue);
              visibleItems = updated;
            }
            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    document.querySelectorAll(".timeline-item").forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  });
</script>

<div class="timeline-container">
  <div class="timeline-line" aria-hidden="true"></div>
  {#each items as item, i}
    {@const theme = getTheme(i)}
    <div
      class="timeline-item"
      class:visible={visibleItems.has(i)}
      data-side={getSide(i)}
      data-index={i}
      style={`--fly-delay:${i * 150}ms; --asteroid-core:${theme.core}; --asteroid-glow:${theme.glow}; --asteroid-trail:${theme.trail}; --asteroid-crater:${theme.crater}; --asteroid-halo:${theme.halo};`}
    >
      <div class="asteroid">
        <span aria-hidden="true" class="asteroid__halo"></span>
        <span aria-hidden="true" class="asteroid__trail"></span>
        <span aria-hidden="true" class="asteroid__trail asteroid__trail--secondary"></span>
        <span aria-hidden="true" class="asteroid__spark asteroid__spark--one"></span>
        <span aria-hidden="true" class="asteroid__spark asteroid__spark--two"></span>
        <span aria-hidden="true" class="asteroid__spark asteroid__spark--three"></span>
        <div class="asteroid__content">
          <div class="item-date">{item.dateRange}</div>
          <div class="item-title">{item.title}</div>
          <div class="item-company">{item.company}</div>
          {#if item.description}
            <div class="item-description">{item.description}</div>
          {/if}
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .timeline-container {
    position: relative;
    margin: 0 auto;
    padding: clamp(4rem, 10vw, 7rem) 1rem clamp(6rem, 12vw, 9rem);
    max-width: 1024px;
  }

  .timeline-container::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 10%, rgba(129, 140, 248, 0.08), transparent 65%),
      radial-gradient(circle at 75% 25%, rgba(244, 114, 182, 0.08), transparent 60%),
      radial-gradient(circle at 40% 80%, rgba(45, 212, 191, 0.06), transparent 65%);
    z-index: -1;
    pointer-events: none;
  }

  .timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 3px;
    transform: translateX(-50%);
    background: linear-gradient(180deg, rgba(99, 102, 241, 0), rgba(99, 102, 241, 0.75), rgba(16, 185, 129, 0.8), rgba(59, 130, 246, 0));
    box-shadow: 0 0 22px rgba(56, 189, 248, 0.35);
    overflow: hidden;
  }

  .timeline-line::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.85) 50%, transparent 100%);
    animation: timeline-glimmer 6s linear infinite;
  }

  .timeline-item {
    position: relative;
    width: min(420px, calc(50% - 3.5rem));
    margin: clamp(3rem, 6vw, 5rem) 0;
    opacity: 0;
    filter: saturate(0.85);
    --connector-length: clamp(2.5rem, 5vw, 4rem);
    will-change: transform, opacity;
  }

  .timeline-item[data-side="left"] {
    float: left;
    clear: both;
    transform: translate3d(-260px, -120px, 0) rotate(-18deg) scale(0.82);
  }

  .timeline-item[data-side="right"] {
    float: right;
    clear: both;
    transform: translate3d(260px, -120px, 0) rotate(18deg) scale(0.82);
  }

  .timeline-item.visible {
    opacity: 1;
    filter: saturate(1);
  }

  .timeline-item[data-side="left"].visible {
    animation: fly-in-left 0.95s var(--fly-delay, 0ms) cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .timeline-item[data-side="right"].visible {
    animation: fly-in-right 0.95s var(--fly-delay, 0ms) cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .timeline-item::after {
    content: "";
    position: absolute;
    top: 50%;
    width: var(--connector-length);
    height: 2px;
    opacity: 0;
    transition: opacity 0.45s ease-out 0.2s;
    pointer-events: none;
  }

  .timeline-item.visible::after {
    opacity: 1;
  }

  .timeline-item[data-side="left"]::after {
    right: calc(-1 * var(--connector-length) - 1.5px);
    background: linear-gradient(90deg, transparent, var(--asteroid-trail, rgba(56, 189, 248, 0.75)));
  }

  .timeline-item[data-side="right"]::after {
    left: calc(-1 * var(--connector-length) - 1.5px);
    background: linear-gradient(270deg, transparent, var(--asteroid-trail, rgba(251, 191, 36, 0.75)));
  }

  .asteroid {
    position: relative;
    padding: clamp(2rem, 4vw, 2.75rem) clamp(1.4rem, 4vw, 2.4rem);
    border-radius: 48% 52% 50% 50% / 60% 45% 55% 40%;
    background:
      radial-gradient(circle at 25% 28%, rgba(255, 255, 255, 0.18), transparent 60%),
      radial-gradient(circle at 70% 36%, rgba(255, 255, 255, 0.12), transparent 55%),
      var(--asteroid-core, rgba(37, 31, 64, 0.92));
    box-shadow: inset 0 0 16px rgba(0, 0, 0, 0.45), 0 0 40px var(--asteroid-glow, rgba(129, 140, 248, 0.45));
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  .asteroid::after {
    content: "";
    position: absolute;
    inset: 8%;
    border-radius: inherit;
    border: 1px dashed rgba(255, 255, 255, 0.08);
    opacity: 0.35;
    filter: blur(0.6px);
    pointer-events: none;
  }

  .asteroid__halo {
    position: absolute;
    inset: -30%;
    background: radial-gradient(circle, var(--asteroid-halo, rgba(147, 51, 234, 0.3)), rgba(17, 24, 39, 0));
    opacity: 0.45;
    filter: blur(28px);
    z-index: 0;
  }

  .asteroid__trail {
    position: absolute;
    width: 180px;
    height: 120px;
    top: 50%;
    background: radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.35), transparent 70%);
    opacity: 0;
    filter: blur(14px);
    transition: opacity 0.6s ease-out, transform 0.8s ease-out;
    pointer-events: none;
    z-index: 0;
  }

  .asteroid__trail--secondary {
    width: 120px;
    height: 90px;
    filter: blur(20px);
    opacity: 0;
  }

  .timeline-item[data-side="left"] .asteroid__trail {
    right: calc(-1 * var(--connector-length) - 140px);
    transform: translate3d(50px, -50%, 0) rotate(-8deg);
    background:
      radial-gradient(circle at 20% 40%, rgba(255, 255, 255, 0.28), transparent 75%),
      linear-gradient(100deg, rgba(255, 255, 255, 0), var(--asteroid-trail, rgba(56, 189, 248, 0.75)) 55%, rgba(56, 189, 248, 0));
  }

  .timeline-item[data-side="left"] .asteroid__trail--secondary {
    right: calc(-1 * var(--connector-length) - 90px);
    transform: translate3d(40px, -50%, 0) rotate(-20deg);
    background: linear-gradient(110deg, rgba(255, 255, 255, 0.35), transparent 70%);
  }

  .timeline-item[data-side="right"] .asteroid__trail {
    left: calc(-1 * var(--connector-length) - 140px);
    transform: translate3d(-50px, -50%, 0) rotate(8deg);
    background:
      radial-gradient(circle at 80% 40%, rgba(255, 255, 255, 0.28), transparent 75%),
      linear-gradient(260deg, rgba(255, 255, 255, 0), var(--asteroid-trail, rgba(251, 191, 36, 0.75)) 55%, rgba(251, 191, 36, 0));
  }

  .timeline-item[data-side="right"] .asteroid__trail--secondary {
    left: calc(-1 * var(--connector-length) - 90px);
    transform: translate3d(-40px, -50%, 0) rotate(20deg);
    background: linear-gradient(250deg, rgba(255, 255, 255, 0.35), transparent 70%);
  }

  .timeline-item.visible .asteroid__trail,
  .timeline-item.visible .asteroid__trail--secondary {
    opacity: 1;
    transform: translate3d(0, -50%, 0) rotate(0deg);
  }

  .asteroid__spark {
    position: absolute;
    width: 12px;
    height: 12px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
    opacity: 0;
    animation: sparkle 6s linear infinite;
    z-index: 1;
  }

  .asteroid__spark--one {
    top: 18%;
    left: 18%;
    animation-delay: 0.4s;
  }

  .asteroid__spark--two {
    top: 55%;
    right: 20%;
    animation-delay: 1.2s;
  }

  .asteroid__spark--three {
    bottom: 15%;
    left: 35%;
    animation-delay: 2s;
  }

  .timeline-item.visible .asteroid__spark {
    opacity: 1;
  }

  .asteroid__content {
    position: relative;
    z-index: 2;
  }

  .item-date {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: rgba(226, 232, 240, 0.75);
    margin-bottom: 0.75rem;
  }

  .item-title {
    font-size: clamp(1.1rem, 1.2rem + 0.3vw, 1.45rem);
    font-weight: 600;
    margin: 0 0 0.4rem;
    background: linear-gradient(120deg, #c084fc, #60a5fa, #34d399);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    text-shadow: 0 0 16px rgba(96, 165, 250, 0.45);
  }

  .item-company {
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(148, 163, 184, 0.95);
    margin-bottom: 0.75rem;
  }

  .item-description {
    font-size: 0.95rem;
    line-height: 1.6;
    color: rgba(226, 232, 240, 0.95);
    text-shadow: 0 0 12px rgba(15, 23, 42, 0.5);
  }

  .timeline-container::after {
    content: "";
    display: block;
    clear: both;
  }

  @keyframes timeline-glimmer {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
  }

  @keyframes fly-in-left {
    0% {
      opacity: 0;
      transform: translate3d(-280px, -140px, 0) rotate(-26deg) scale(0.7);
    }
    55% {
      opacity: 1;
      transform: translate3d(24px, 18px, 0) rotate(6deg) scale(1.05);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
    }
  }

  @keyframes fly-in-right {
    0% {
      opacity: 0;
      transform: translate3d(280px, -140px, 0) rotate(26deg) scale(0.7);
    }
    55% {
      opacity: 1;
      transform: translate3d(-24px, 18px, 0) rotate(-6deg) scale(1.05);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
    }
  }

  @keyframes sparkle {
    0% {
      transform: scale(0.6);
      opacity: 0;
    }
    20% {
      transform: scale(1);
      opacity: 0.9;
    }
    60% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    100% {
      transform: scale(0.6);
      opacity: 0;
    }
  }

  @media (max-width: 1024px) {
    .timeline-item {
      width: min(440px, calc(50% - 2.5rem));
    }
  }

  @media (max-width: 768px) {
    .timeline-container {
      padding: 3.5rem 1.2rem 4.5rem;
    }

    .timeline-line {
      left: 12%;
    }

    .timeline-item,
    .timeline-item[data-side="left"],
    .timeline-item[data-side="right"] {
      float: none;
      width: 100%;
      margin: 2.5rem 0;
      transform: translate3d(0, 120px, 0) scale(0.9);
    }

    .timeline-item::after {
      display: none;
    }

    .timeline-item.visible,
    .timeline-item[data-side="left"].visible,
    .timeline-item[data-side="right"].visible {
      animation: fly-in-mobile 0.85s var(--fly-delay, 0ms) cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .timeline-item.visible .asteroid__trail,
    .timeline-item.visible .asteroid__trail--secondary {
      transform: translate3d(0, -50%, 0) rotate(0deg) scale(0.8);
    }
  }

  @media (max-width: 540px) {
    .timeline-line {
      display: none;
    }

    .asteroid {
      border-radius: 32px;
    }

    .item-date {
      letter-spacing: 0.12em;
    }
  }

  @keyframes fly-in-mobile {
    0% {
      opacity: 0;
      transform: translate3d(0, 120px, 0) scale(0.82);
    }
    70% {
      opacity: 1;
      transform: translate3d(0, -10px, 0) scale(1.02);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }
</style>
