<script>
  export let items = [
    {
      dateRange: "2021 - Current",
      title: "Job 4",
      description: "Customer Success Representative.",
    },
    {
      dateRange: "2019 - 2021",
      title: "Job 3",
      description: "Project Management, System Administrator.",
    },
    {
      dateRange: "2018 - 2019",
      title: "Job 2",
      description: "Support Specialist.",
    },
    {
      dateRange: "2017 - 2018",
      title: "Job 1",
      description: "Debugging, Code QA.",
    }
  ];

  // The top item is the most recent, so we assume items are given in descending order
  // If not, you can reverse them or sort as necessary.

  // We'll alternate sides: top (most recent) on the right side, next on the left, and so forth
  // Just a simple alternating pattern. You can customize this logic as needed.
  function getSide(index) {
    return index % 2 === 0 ? 'right' : 'left';
  }
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
  }

  .timeline-item[data-side="left"] {
    float: left;
    clear: both;
    transform: translateX(3.8%);
  }

  .timeline-item[data-side="right"] {
    float: right;
    clear: both;
    transform: translateX(-3.7%);
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

  /* Clearfix */
  .timeline-container::after {
    content: "";
    display: block;
    clear: both;
  }

  /* Responsive */
  @media (max-width: 767px) {
    .timeline-item {
      width: 80%;
      float: none;
      margin: 2rem auto;
      transform: translateX(0) !important;
    }

    .timeline-item[data-side="left"]:before,
    .timeline-item[data-side="right"]:before {
      left: 50%;
      transform: translateX(-50%);
    }

    .timeline-line {
      left: 50%;
    }
  }
</style>

<div class="timeline-container">
  <div class="timeline-line"></div>
  {#each items as item, i}
    <div
      class="timeline-item"
      data-side={getSide(i)}
      style="margin-top:{i===0?'0':'2rem'}"
    >
      <div class="item-date">{item.dateRange}</div>
      <div class="item-title">{item.title}</div>
      <div class="item-description">{item.description}</div>
    </div>
  {/each}
</div>
