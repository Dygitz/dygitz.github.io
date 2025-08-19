<script>
    import { onMount } from 'svelte';
    import lottie from 'lottie-web';

    export let animationData;

    let container;

    onMount(() => {
        lottie.loadAnimation({
            container,
            renderer: 'html',
            loop: true,
            autoplay: true,
            animationData
        });
    });
</script>

<style>
    .astronaut {
        position: absolute;
        width: 30vw; /* Adjust size as needed */
        height: 30vh; /* Adjust size as needed */
        top: 20%; /* Center vertically */
        transform: translateY(-50%); /* Initial transform - translateX is handled in animation */
        animation: slideAndSpin 20s linear infinite; /* Adjust timing for smoother animation */
    }

    @keyframes slideAndSpin {
        0% {
            transform: translateY(-50%) translateX(-50%) translateX(-25vw) rotate(0deg); /* Start off-screen to the left */
        }
        100% {
            transform: translateY(-50%) translateX(-50%) translateX(100vw) rotate(360deg); /* Move off-screen to the right */
        }
    }
</style>

<div bind:this={container} class="astronaut" data-astronaut></div>
