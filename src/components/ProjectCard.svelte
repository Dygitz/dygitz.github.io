<script lang="ts">
  import type { Project } from "../data/projects";

  export let project: Project;
  export let missionNumber = 1;
  export let missionTotal = 5;

  $: missionLabel = `Mission ${String(missionNumber).padStart(2, "0")} / ${String(missionTotal).padStart(2, "0")}`;
  $: techTags = project.technologies.slice(0, 4);
  $: accent = project.accent ?? "violet";
</script>

<article class="mission-card" data-accent={accent} aria-labelledby={`mission-title-${project.id}`}>
  <div class="mission-card__shell">
    <div class="mission-card__header">
      <p class="mission-card__eyebrow">{missionLabel}</p>
      <p class="mission-card__category">{project.category}</p>
    </div>

    <div class="mission-card__title-row">
      <h3 id={`mission-title-${project.id}`} class="mission-card__title">{project.title}</h3>
      <span class="mission-card__sigil">Event Horizon</span>
    </div>

    <p class="mission-card__impact">{project.impact}</p>

    {#if techTags.length}
      <ul class="mission-card__tech-list" aria-label="Technologies used">
        {#each techTags as technology}
          <li class="mission-card__tech">{technology}</li>
        {/each}
      </ul>
    {/if}

    <div class="mission-card__actions" aria-label="Project links">
      {#if project.demoUrl}
        <a class="mission-card__link mission-card__link--demo" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
          Launch Demo
        </a>
      {/if}

      {#if project.githubUrl}
        <a class="mission-card__link mission-card__link--github" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      {/if}
    </div>
  </div>
</article>

<style>
  .mission-card {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border: 1px solid rgba(167, 139, 250, 0.28);
    border-radius: 1.5rem;
    background:
      radial-gradient(circle at top, rgba(168, 85, 247, 0.22), transparent 38%),
      radial-gradient(circle at 82% 18%, rgba(34, 211, 238, 0.12), transparent 24%),
      linear-gradient(180deg, rgba(11, 10, 22, 0.98), rgba(5, 7, 15, 0.98));
    box-shadow:
      0 1.5rem 3rem rgba(2, 6, 23, 0.48),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
    color: rgba(248, 250, 252, 0.94);
    transition:
      transform 220ms ease,
      box-shadow 220ms ease,
      border-color 220ms ease;
  }

  .mission-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 50% 18%, rgba(15, 23, 42, 0.75), transparent 16%),
      radial-gradient(circle at 50% 18%, rgba(192, 132, 252, 0.26), transparent 28%),
      radial-gradient(circle at 50% 18%, rgba(34, 211, 238, 0.12), transparent 42%);
    opacity: 0.95;
    pointer-events: none;
  }

  .mission-card::after {
    content: "";
    position: absolute;
    inset: 1rem;
    border-radius: 1.1rem;
    border: 1px solid rgba(255, 255, 255, 0.04);
    box-shadow: inset 0 0 0 1px rgba(168, 85, 247, 0.06);
    pointer-events: none;
  }

  .mission-card:hover {
    transform: translateY(-0.2rem);
    border-color: rgba(196, 181, 253, 0.55);
    box-shadow:
      0 1.8rem 3.75rem rgba(2, 6, 23, 0.56),
      0 0 0 1px rgba(168, 85, 247, 0.08),
      0 0 2.5rem rgba(168, 85, 247, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .mission-card__shell {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 1rem;
    padding: 1.5rem;
  }

  .mission-card__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .mission-card__eyebrow {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(103, 232, 249, 0.92);
  }

  .mission-card__category {
    margin: 0;
    font-size: 0.875rem;
    color: rgba(196, 181, 253, 0.82);
  }

  .mission-card__title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .mission-card__title {
    margin: 0;
    max-width: 20ch;
    font-size: clamp(1.35rem, 2vw, 1.8rem);
    line-height: 1.06;
    letter-spacing: -0.03em;
    color: #f8fafc;
  }

  .mission-card__sigil {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border-radius: 999px;
    border: 1px solid rgba(34, 211, 238, 0.25);
    background: rgba(15, 23, 42, 0.72);
    padding: 0.38rem 0.7rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(244, 114, 182, 0.95);
    box-shadow: inset 0 0 0 1px rgba(244, 114, 182, 0.08);
  }

  .mission-card__impact {
    margin: 0;
    max-width: 60ch;
    color: rgba(226, 232, 240, 0.86);
    line-height: 1.65;
  }

  .mission-card__tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .mission-card__tech {
    border-radius: 999px;
    border: 1px solid rgba(34, 211, 238, 0.18);
    background: rgba(15, 23, 42, 0.62);
    padding: 0.42rem 0.75rem;
    font-size: 0.8rem;
    color: rgba(224, 231, 255, 0.88);
  }

  .mission-card__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding-top: 0.2rem;
  }

  .mission-card__link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.75rem;
    border-radius: 999px;
    border: 1px solid transparent;
    padding: 0.65rem 1rem;
    font-size: 0.92rem;
    font-weight: 700;
    text-decoration: none;
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      background-color 180ms ease,
      color 180ms ease,
      box-shadow 180ms ease;
  }

  .mission-card__link--demo {
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.18), rgba(168, 85, 247, 0.34));
    border-color: rgba(103, 232, 249, 0.26);
    color: #f8fafc;
    box-shadow: 0 0.75rem 1.5rem rgba(15, 23, 42, 0.24);
  }

  .mission-card__link--github {
    background: rgba(15, 23, 42, 0.76);
    border-color: rgba(244, 114, 182, 0.22);
    color: rgba(248, 250, 252, 0.92);
  }

  .mission-card__link:hover {
    transform: translateY(-1px);
  }

  .mission-card__link--demo:hover {
    border-color: rgba(103, 232, 249, 0.44);
    box-shadow: 0 0.95rem 1.75rem rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(103, 232, 249, 0.12);
  }

  .mission-card__link--github:hover {
    border-color: rgba(244, 114, 182, 0.4);
    color: #ffffff;
  }

  .mission-card__link:focus-visible {
    outline: 3px solid rgba(103, 232, 249, 0.94);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    .mission-card,
    .mission-card__link {
      transition: none;
    }

    .mission-card:hover,
    .mission-card__link:hover {
      transform: none;
    }
  }
</style>
