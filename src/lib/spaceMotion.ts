export type SpaceMotionMode = "reduced" | "compact" | "full";

export interface SpaceMotionProfile {
  mode: SpaceMotionMode;
  heroCharacterStagger: number;
  scrollScrub: false | number;
  meteorTravel: number;
  tiltDegrees: number;
  ambientMotion: boolean;
}

export function getSpaceMotionProfile(input: {
  reducedMotion: boolean;
  viewportWidth: number;
}): SpaceMotionProfile {
  if (input.reducedMotion) {
    return {
      mode: "reduced",
      heroCharacterStagger: 0,
      scrollScrub: false,
      meteorTravel: 0,
      tiltDegrees: 0,
      ambientMotion: false,
    };
  }

  if (input.viewportWidth < 768) {
    return {
      mode: "compact",
      heroCharacterStagger: 0.025,
      scrollScrub: 0.2,
      meteorTravel: 0,
      tiltDegrees: 0,
      ambientMotion: false,
    };
  }

  return {
    mode: "full",
    heroCharacterStagger: 0.035,
    scrollScrub: 0.45,
    meteorTravel: 180,
    tiltDegrees: 6,
    ambientMotion: true,
  };
}

export function getMeteorVariant(index: number): 1 | 2 | 3 {
  return ((index % 3) + 1) as 1 | 2 | 3;
}
