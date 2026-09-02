type GsapBundle = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  MotionPathPlugin: typeof import("gsap/MotionPathPlugin").MotionPathPlugin;
  SplitText: typeof import("gsap/SplitText").SplitText;
};

let gsapBundle: Promise<GsapBundle> | undefined;

export function loadGsap(): Promise<GsapBundle> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("GSAP client bundle requested on the server"));
  }

  gsapBundle ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/MotionPathPlugin"),
    import("gsap/SplitText"),
  ]).then(([core, scroll, motionPath, split]) => {
    core.gsap.registerPlugin(
      scroll.ScrollTrigger,
      motionPath.MotionPathPlugin,
      split.SplitText,
    );

    return {
      gsap: core.gsap,
      ScrollTrigger: scroll.ScrollTrigger,
      MotionPathPlugin: motionPath.MotionPathPlugin,
      SplitText: split.SplitText,
    };
  });

  return gsapBundle;
}
