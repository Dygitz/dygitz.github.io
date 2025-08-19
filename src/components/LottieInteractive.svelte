<script>
    import { onMount, onDestroy } from 'svelte';
    import lottie from 'lottie-web';

    export let animationData;

    let container;
    let animation;
    let isVisible = true;
    let observer;

    // Performance settings based on device capabilities
    const getPerformanceSettings = () => {
        const isLowEnd = navigator.hardwareConcurrency <= 4 || 
                        navigator.deviceMemory <= 4 ||
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        const isMobile = window.innerWidth <= 768;
        
        return {
            renderer: 'svg', // SVG with optimizations
            loop: true,
            autoplay: true,
            animationData,
            // Performance optimizations for SVG
            rendererSettings: {
                scaleMode: 'noScale',
                clearCanvas: false,
                progressiveLoad: true,
                hideOnTransparent: true,
                // SVG specific optimizations
                preserveAspectRatio: 'xMidYMid slice',
                title: '',
                description: '',
                // Reduce complexity on low-end devices
                className: isLowEnd || isMobile ? 'lottie-low-quality' : 'lottie-high-quality',
                // Optimize for performance
                focusable: false,
                filterSize: {
                    width: '120%',
                    height: '120%',
                    x: '-10%',
                    y: '-10%'
                }
            }
        };
    };

    // Smart frame rate control
    const setupFrameRateControl = (anim) => {
        const isLowEnd = navigator.hardwareConcurrency <= 4 || 
                        navigator.deviceMemory <= 4;
        const isMobile = window.innerWidth <= 768;
        
        if (isLowEnd || isMobile) {
            // More efficient frame throttling using requestAnimationFrame
            let lastFrameTime = 0;
            const targetFPS = isMobile ? 20 : 24; // Reduce FPS on mobile
            const frameInterval = 1000 / targetFPS;
            
            const originalSetCurrentRawFrameValue = anim.setCurrentRawFrameValue;
            anim.setCurrentRawFrameValue = function(value) {
                const now = performance.now();
                if (now - lastFrameTime >= frameInterval) {
                    originalSetCurrentRawFrameValue.call(this, value);
                    lastFrameTime = now;
                }
            };
        }
    };

    // Intersection Observer to pause animation when not visible
    const setupIntersectionObserver = () => {
        if (typeof IntersectionObserver !== 'undefined') {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        const wasVisible = isVisible;
                        isVisible = entry.isIntersecting;
                        
                        if (animation && wasVisible !== isVisible) {
                            if (isVisible) {
                                animation.play();
                            } else {
                                animation.pause();
                            }
                        }
                    });
                },
                { 
                    threshold: 0.1,
                    rootMargin: '50px 0px'
                }
            );

            if (container) {
                observer.observe(container);
            }
        }
    };

    onMount(() => {
        try {
            // Load animation with performance settings
            animation = lottie.loadAnimation({
                container,
                ...getPerformanceSettings()
            });

            // Setup frame rate control after animation is ready
            animation.addEventListener('DOMLoaded', () => {
                console.log('Lottie animation loaded successfully');
                setupFrameRateControl(animation);
            });

            // Setup intersection observer for performance
            setupIntersectionObserver();

            // Error handling
            animation.addEventListener('error', (error) => {
                console.warn('Lottie animation warning:', error);
            });

            // Additional optimizations: pause during page visibility changes
            const handleVisibilityChange = () => {
                if (animation) {
                    if (document.hidden) {
                        animation.pause();
                    } else if (isVisible) {
                        animation.play();
                    }
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Cleanup function for visibility listener
            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };

        } catch (error) {
            console.error('Failed to load Lottie animation:', error);
        }
    });

    onDestroy(() => {
        if (animation) {
            try {
                animation.destroy();
            } catch (error) {
                console.warn('Error destroying animation:', error);
            }
        }
        if (observer) {
            observer.disconnect();
        }
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
        
        /* Performance optimizations */
        will-change: transform, left; /* Hint browser for optimization */
        backface-visibility: hidden; /* Improve performance */
        transform-style: preserve-3d; /* GPU acceleration */
        -webkit-transform-style: preserve-3d; /* Safari support */
        contain: layout style paint; /* CSS containment for performance */
    }

    /* Lottie quality optimizations */
    .astronaut :global(.lottie-low-quality) {
        image-rendering: optimizeSpeed;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: optimize-contrast;
        image-rendering: pixelated;
        -ms-interpolation-mode: nearest-neighbor;
    }

    .astronaut :global(.lottie-high-quality) {
        image-rendering: optimizeQuality;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: optimize-contrast;
    }

    /* Optimize animation for better performance */
    @keyframes slideAndSpin {
        0% {
            left: -25%; /* Start off-screen to the left */
            transform: translateY(-50%) translateX(-50%) rotate(0deg) translateZ(0); /* Force GPU layer */
        }
        100% {
            left: 100%; /* Move off-screen to the right */
            transform: translateY(-50%) translateX(-50%) rotate(360deg) translateZ(0); /* Force GPU layer */
        }
    }

    /* Reduced motion support for accessibility and performance */
    @media (prefers-reduced-motion: reduce) {
        .astronaut {
            animation-duration: 40s; /* Slower animation */
            animation-timing-function: ease-in-out; /* Smoother timing */
        }
        
        /* Further reduce Lottie animation complexity */
        .astronaut :global(svg) {
            animation: none !important;
        }
    }

    /* Performance optimizations for mobile devices */
    @media (max-width: 768px) {
        .astronaut {
            width: 25vw; /* Smaller size on mobile */
            height: 25vh;
            animation-duration: 25s; /* Slightly slower on mobile */
        }
        
        /* Force low quality rendering on mobile */
        .astronaut :global(svg) {
            image-rendering: optimizeSpeed;
            shape-rendering: optimizeSpeed;
        }
    }

    /* High DPI displays optimization */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .astronaut {
            /* Slightly reduce size on high DPI to maintain performance */
            width: 28vw;
            height: 28vh;
        }
    }
</style>

<div bind:this={container} class="astronaut" data-astronaut></div>
