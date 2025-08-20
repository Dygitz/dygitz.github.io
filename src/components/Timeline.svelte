<script>
  import { onMount } from 'svelte';
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
    }
  ];

  let visibleItems = new Set();
  let timelineContainer;
  let rocketPath;
  let rocket;
  let scrollProgress = 0;

  function getSide(index) {
    return index % 2 === 0 ? 'right' : 'left';
  }

  function getPositionOnPath(index, totalItems) {
    // Calculate position along the trajectory for each item
    const progress = index / (totalItems - 1);
    // Create a more pronounced zig-zag pattern
    const x = 50 + Math.sin(progress * Math.PI * 3) * 30; // More oscillation
    const y = 10 + progress * 70; // Leave space at top and bottom
    return { x, y };
  }

  function updateRocketPosition() {
    if (!rocket || !rocketPath) return;
    
    const pathLength = rocketPath.getTotalLength();
    const targetDistance = scrollProgress * pathLength;
    const point = rocketPath.getPointAtLength(targetDistance);
    
    // Get the tangent for rotation
    const tangentPoint = rocketPath.getPointAtLength(Math.min(targetDistance + 1, pathLength));
    const angle = Math.atan2(tangentPoint.y - point.y, tangentPoint.x - point.x) * (180 / Math.PI);
    
    rocket.style.transform = `translate(${point.x}px, ${point.y}px) rotate(${angle + 90}deg)`;
  }

  function handleScroll() {
    if (!timelineContainer) return;
    
    const containerRect = timelineContainer.getBoundingClientRect();
    const containerHeight = timelineContainer.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Calculate scroll progress through the timeline
    const scrollTop = -containerRect.top;
    const scrollableHeight = containerHeight - viewportHeight;
    
    if (scrollTop <= 0) {
      scrollProgress = 0;
    } else if (scrollTop >= scrollableHeight) {
      scrollProgress = 1;
    } else {
      scrollProgress = scrollTop / scrollableHeight;
    }
    
    updateRocketPosition();
  }

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleItems = visibleItems.add(entry.target.dataset.index);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('.timeline-item').forEach(item => {
      observer.observe(item);
    });

    // Add scroll listener for rocket animation
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial position

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<style>
  :global(body) {
    /* Ensure this matches your site's background */
    background-color: #222;
    font-family: "Montserrat", sans-serif;
  }

  .timeline-container {
    position: relative;
    margin: 0 auto;
    padding: 4rem 0;
    max-width: 800px;
    min-height: 200vh; /* Ensure enough height for scrolling */
  }

  /* Rocket trajectory SVG */
  .rocket-trajectory {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  .trajectory-path {
    fill: none;
    stroke: url(#trajectoryGradient);
    stroke-width: 3;
    stroke-dasharray: 10, 5;
    opacity: 0.7;
    animation: dash 20s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: -100;
    }
  }

  /* Rocket element */
  .rocket {
    position: absolute;
    width: 40px;
    height: 40px;
    font-size: 30px;
    z-index: 10;
    transform-origin: center center;
    transition: transform 0.1s ease-out;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  }

  .timeline-item {
    position: absolute;
    width: 280px;
    padding: 1.5rem;
    background: radial-gradient(circle at 30% 30%, rgba(142, 45, 226, 0.3), rgba(35, 213, 171, 0.2), rgba(51, 51, 51, 0.9));
    border: 2px solid rgba(142, 45, 226, 0.5);
    border-radius: 20px;
    color: #fff;
    z-index: 5;
    opacity: 0;
    transform: scale(0.8) translateX(-50%);
    transition: all 0.6s ease-out;
    box-shadow: 0 0 20px rgba(142, 45, 226, 0.3);
  }

  .visible {
    opacity: 1;
    transform: scale(1) translateX(-50%);
  }

  /* Planet-like styling for timeline items */
  .timeline-item:before {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle at 30% 30%, #8e2de2, #23d5ab);
    border-radius: 50%;
    border: 3px solid #fff;
    top: -10px;
    left: -10px;
    z-index: 6;
    box-shadow: 0 0 15px rgba(142, 45, 226, 0.6);
    animation: planetGlow 3s ease-in-out infinite alternate;
  }

  @keyframes planetGlow {
    0% {
      box-shadow: 0 0 15px rgba(142, 45, 226, 0.6);
    }
    100% {
      box-shadow: 0 0 25px rgba(142, 45, 226, 0.9), 0 0 35px rgba(35, 213, 171, 0.5);
    }
  }

  /* Title gradient text */
  .item-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0 0 0.3rem 0;
    background: linear-gradient(90deg, #8e2de2, #23d5ab);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    animation: gradient 5s ease infinite;
  }

  @keyframes gradient {
    0% {background-position: 0% 50%;}
    50% {background-position: 100% 50%;}
    100% {background-position: 0% 50%;}
  }

  .item-date {
    font-size: 0.9rem;
    color: #aaa;
    margin-bottom: 0.5rem;
  }

  .item-description {
    line-height: 1.5;
    color: #fff;
  }

  .item-company {
    font-size: 1rem;
    font-weight: 600;
    font-style: italic;
    background: linear-gradient(90deg, rgba(4,137,153,1) 14%, rgba(16,155,184,1) 35%, rgba(9,146,150,1) 67%, rgba(0,212,255,1) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    margin-top: 0.3rem;
    margin-bottom: 0.5rem;
    letter-spacing: 0.5px;
  }

  /* Responsive */
  @media (max-width: 767px) {
    .timeline-item {
      width: 80%;
      position: relative;
      left: 50%;
      transform: translateX(-50%) scale(0.8);
      margin: 3rem auto;
    }

    .timeline-item.visible {
      transform: translateX(-50%) scale(1);
    }

    .rocket {
      display: none; /* Hide rocket on mobile for simplicity */
    }

    .trajectory-path {
      display: none; /* Hide trajectory on mobile */
    }

    .timeline-container {
      padding: 2rem 0 5rem 0;
      min-height: auto;
    }
  }
</style>

<div class="timeline-container" bind:this={timelineContainer}>
  <!-- Rocket trajectory SVG -->
  <svg class="rocket-trajectory" viewBox="0 0 100 100" preserveAspectRatio="none">
    <defs>
      <linearGradient id="trajectoryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#8e2de2;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#23d5ab;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#4a00e0;stop-opacity:1" />
      </linearGradient>
    </defs>
    <path 
      bind:this={rocketPath}
      class="trajectory-path" 
      d="M 50 10 Q 80 20 35 30 Q 20 40 65 50 Q 80 60 35 70 Q 20 80 50 80"
    />
  </svg>
  
  <!-- Rocket -->
  <div class="rocket" bind:this={rocket}>🚀</div>
  
  <!-- Timeline items positioned along the curve -->
  {#each items as item, i}
    {@const position = getPositionOnPath(i, items.length)}
    <div
      class="timeline-item"
      class:visible={visibleItems.has(i.toString())}
      data-index={i}
      style="
        left: {position.x}%; 
        top: {position.y}%;
        margin-top: 0;
        transition-delay: {i * 150}ms;
      "
    >
      <div class="item-date">{item.dateRange}</div>
      <div class="item-title">{item.title}</div>
      <div class="item-company">{item.company}</div>
      <div class="item-description">{item.description}</div>
    </div>
  {/each}
</div>

