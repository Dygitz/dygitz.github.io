<script>
  export let title = '';
  export let description = '';
  export let imageUrl = '';
  export let projectUrl = '';
</script>

<div class="project-card">
  <img src={imageUrl} alt={title} class="project-image" />
  <div class="project-content">
    <h3 class="project-title">{title}</h3>
    <p class="project-description">{description}</p>
    <a href={projectUrl} class="project-link" target="_blank" rel="noopener noreferrer">
      View Project
    </a>
  </div>
</div>

<style>
  .project-card {
    background-color: rgba(20, 20, 50, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(5px);
  }

  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .project-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .project-content {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .project-title {
    font-size: 1.5rem;
    color: #fff;
    margin-bottom: 10px;
  }

  .project-description {
    font-size: 1rem;
    color: #ccc;
    margin-bottom: 15px;
    flex-grow: 1;
  }

  .project-link {
    display: inline-block;
    padding: 8px 15px;
    background-color: #4a00e0;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    align-self: flex-start;
  }

  .project-link:hover {
    background-color: #6D18E2;
  }
</style>
