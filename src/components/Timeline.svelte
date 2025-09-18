<script>
  import { onMount } from 'svelte';

  export let items = [
    {
      dateRange: '2021 - Current',
      title: 'Job 4',
      company: 'Company 4',
      description: 'Customer Success Representative.',
    },
    {
      dateRange: '2019 - 2021',
      title: 'Job 3',
      company: 'Company 3',
      description: 'Project Management, System Administrator.',
    },
    {
      dateRange: '2018 - 2019',
      title: 'Job 2',
      company: 'Company 2',
      description: 'Support Specialist.',
    },
    {
      dateRange: '2017 - 2018',
      title: 'Job 1',
      company: 'Company 1',
      description: 'Debugging, Code QA.',
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
      <div class="asteroid__core">
        <span class="asteroid__date">{item.dateRange}</span>
        <h3 class="asteroid__title">{item.title}</h3>
        <p class="asteroid__company">{item.company}</p>
        <p class="asteroid__description">{item.description}</p>
      </div>
    </article>
  {/each}
</div>

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
    width: min(100%, 380px);
    margin: clamp(1.2rem, 4vw, 2.4rem) 0;
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
    padding-right: clamp(1rem, 5vw, 4rem);
  }

  .asteroid[data-side='right'] {
    margin-left: auto;
    padding-left: clamp(1rem, 5vw, 4rem);
  }

  .asteroid::before {
    content: '';
    position: absolute;
    inset: -32% -22% -28%;
    background:
      radial-gradient(circle at 32% 34%, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0) 62%),
      radial-gradient(circle at 68% 38%, rgba(23, 24, 32, 0.42) 0, rgba(23, 24, 32, 0.42) 30%, rgba(23, 24, 32, 0) 62%),
      radial-gradient(circle at 46% 72%, rgba(23, 24, 32, 0.38) 0, rgba(23, 24, 32, 0.38) 28%, rgba(23, 24, 32, 0) 60%),
      radial-gradient(circle at 74% 68%, rgba(23, 24, 32, 0.32) 0, rgba(23, 24, 32, 0.32) 26%, rgba(23, 24, 32, 0) 58%),
      radial-gradient(circle at 24% 68%, rgba(23, 24, 32, 0.28) 0, rgba(23, 24, 32, 0.28) 22%, rgba(23, 24, 32, 0) 55%),
      linear-gradient(150deg, rgba(136, 138, 146, 0.96), rgba(74, 76, 88, 0.93));
    border-radius: 46% 54% 52% 48% / 52% 48% 58% 42%;
    transform-origin: center;
    transform: scale(1.08) rotate(calc(var(--rotation, 0deg) * 0.35));
    box-shadow: 0 32px 46px rgba(8, 10, 18, 0.55);
    opacity: 0.92;
    z-index: -2;
    will-change: transform;
    transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.6s ease;
  }

  .asteroid::after {
    content: '';
    position: absolute;
    inset: -12% -8%;
    border-radius: 44% 56% 50% 50% / 54% 46% 58% 42%;
    background:
      radial-gradient(140% 120% at 30% 22%, rgba(255, 255, 255, 0.2), transparent 70%),
      radial-gradient(circle at 72% 70%, rgba(255, 255, 255, 0.14), transparent 75%);
    opacity: 0.45;
    box-shadow: 0 0 28px rgba(140, 198, 255, 0.22);
    z-index: -1;
    transition: opacity 0.6s ease;
  }

  .asteroid__core {
    position: relative;
    padding: clamp(1.35rem, 3vw, 1.8rem);
    border-radius: 22px;
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

  .asteroid__description {
    margin: 0;
    color: rgba(221, 235, 255, 0.85);
    line-height: 1.55;
    font-size: 0.98rem;
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
    opacity: 0.98;
    transform: scale(1.08) rotate(0.8deg);
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
      padding: 1.2rem 1.1rem 1.5rem;
    }

    .asteroid__title {
      font-size: clamp(1.1rem, 4vw, 1.35rem);
    }

    .asteroid__description {
      font-size: 0.95rem;
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
  }
</style>
