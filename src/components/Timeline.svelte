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

  function getSide(index) {
    return index % 2 === 0 ? 'right' : 'left';
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

    return () => observer.disconnect();
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
  }

  /* Vertical line */
  .timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    background: linear-gradient(180deg, #fff 0%, #bbb 100%);
    height: 100%;
    transform: translateX(-50%);
    z-index: 0;
  }

  .timeline-item {
    position: relative;
    width: 45%;
    padding: 1rem;
    margin: 2rem 0;
    background: #333;
    border-radius: 5px;
    color: #fff;
    z-index: 1;
    opacity: 0;
    transform: translateY(0);
    transition: all 0.5s ease-out;
  }

  .visible {
    opacity: 1;
    transform: translateX(3.8%) translateY(0) !important;
  }

  .timeline-item[data-side="left"] {
    float: left;
    clear: both;
    transform: translateX(-50px);
  }

  .timeline-item[data-side="right"] {
    float: right;
    clear: both;
    transform: translateX(50px);
  }

  .timeline-item[data-side="right"].visible {
    transform: translateX(-3.7%) translateY(0) !important;
  }

  .timeline-item:before {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background: #6d18e2;
    border-radius: 50%;
    border: 2px solid #fff;
    top: 2rem;
    z-index: 2;
  }

  .timeline-item[data-side="left"]:before {
    right: -34px;
  }

  .timeline-item[data-side="right"]:before {
    left: -34px;
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
    font-size: 1rem;          /* Keep size readable */
    font-weight: 600;         /* Make it bold but not overpowering */
    font-style: italic;       /* Make it italic */
    background: linear-gradient(90deg, rgba(4,137,153,1) 14%, rgba(16,155,184,1) 35%, rgba(9,146,150,1) 67%, rgba(0,212,255,1) 100%);
    -webkit-background-clip: text;
    color: transparent;
    margin-top: 0.3rem;       /* Proper spacing */
    margin-bottom: 0.5rem;
    letter-spacing: 0.5px;    /* Slight letter spacing for elegance */
  }

  /* Clearfix */
  .timeline-container::after {
    content: "";
    display: block;
    clear: both;
  }

  /* Responsive */
  @media (max-width: 767px) {
    .timeline-item {
      width: 80%; /* Slightly reduced width */
      float: none;
      margin: 2rem auto;
      transform: translateY(30px) !important;
      left: 0;
      right: 0;
    }

    .timeline-item.visible {
      transform: translateY(0) !important;
    }

    .timeline-item[data-side="left"],
    .timeline-item[data-side="right"] {
      transform: translateY(30px) !important; /* Override any side-specific transforms */
      float: none;
      margin-left: auto;
      margin-right: auto;
    }

    .timeline-item[data-side="left"].visible,
    .timeline-item[data-side="right"].visible {
      transform: translateY(0) !important;
    }

    .timeline-item[data-side="left"]:before,
    .timeline-item[data-side="right"]:before {
      display: none; /* Hide the dots on mobile */
    }

    .timeline-line {
      display: none; /* Hide the timeline on mobile */
    }

    /* Additional margin for better spacing */
    .timeline-container {
      padding: 2rem 0 5rem 0; /* Added bottom padding */
    }
  }
</style>

<div class="timeline-container">
  <div class="timeline-line"></div>
  {#each items as item, i}
    <div
      class="timeline-item"
      class:visible={visibleItems.has(i.toString())}
      data-side={getSide(i)}
      data-index={i}
      style="margin-top:{i===0?'0':'2rem'}; transition-delay: {i * 150}ms;"
    >
      <div class="item-date">{item.dateRange}</div>
      <div class="item-title">{item.title}</div>
      <div class="item-company">{item.company}</div>
      <div class="item-description">{item.description}</div>
    </div>
  {/each}
</div>

