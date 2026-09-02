<script lang="ts">
  import { onMount } from "svelte";
  import lottie from "lottie-web";

  export let animationData: object;

  let container: HTMLDivElement;

  onMount(() => {
    const animation = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });

    return () => animation.destroy();
  });
</script>

<div
  bind:this={container}
  class="astronaut"
  data-astronaut
  aria-hidden="true"
></div>

<style>
  .astronaut {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
  }
</style>
