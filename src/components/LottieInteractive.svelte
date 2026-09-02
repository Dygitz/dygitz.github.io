<script lang="ts">
  import { onMount } from "svelte";
  import lottie from "lottie-web";
  import { getLottiePlaybackPolicy } from "../lib/spaceMotion";

  export let animationData: object;

  let container: HTMLDivElement;

  onMount(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const initialPolicy = getLottiePlaybackPolicy(reducedMotion.matches);
    const animation = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: initialPolicy.loop,
      autoplay: initialPolicy.autoplay,
      animationData,
    });

    const applyMotionPreference = () => {
      const policy = getLottiePlaybackPolicy(reducedMotion.matches);
      animation.setLoop(policy.loop);

      if (policy.staticFrame !== null) {
        animation.goToAndStop(policy.staticFrame, true);
      } else {
        animation.play();
      }
    };

    applyMotionPreference();
    reducedMotion.addEventListener("change", applyMotionPreference);

    return () => {
      reducedMotion.removeEventListener("change", applyMotionPreference);
      animation.destroy();
    };
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
