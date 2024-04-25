<script>
    import { onMount } from 'svelte';
    import lottie from 'lottie-web';

    export let animationData;

    let container;

    onMount(() => {
        lottie.loadAnimation({
            container,
            renderer: 'svg',
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
        transform: translateY(-50%) translateX(-50%) rotate(0deg); /* Initial transform */
        animation: slideAndSpin 20s linear infinite; /* Adjust timing for smoother animation */
    }

    @keyframes slideAndSpin {
        0% {
            left: -25%; /* Start off-screen to the left */
            transform: translateY(-50%) rotate(0deg); /* Start without rotation */
        }
        100% {
            left: 100%; /* Move off-screen to the right */
            transform: translateY(-50%) rotate(360deg); /* Complete a full rotation */
        }
    }
</style>

<div bind:this={container} class="astronaut" data-astronaut></div>
