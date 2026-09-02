import { describe, expect, it } from "vitest";
import { getMeteorVariant, getSpaceMotionProfile } from "./spaceMotion";

describe("getSpaceMotionProfile", () => {
  it("disables decorative motion when reduced motion is requested", () => {
    expect(
      getSpaceMotionProfile({ reducedMotion: true, viewportWidth: 1440 }),
    ).toEqual({
      mode: "reduced",
      heroCharacterStagger: 0,
      scrollScrub: false,
      meteorTravel: 0,
      tiltDegrees: 0,
      ambientMotion: false,
    });
  });

  it("uses compact motion without curved meteor travel below 768px", () => {
    expect(
      getSpaceMotionProfile({ reducedMotion: false, viewportWidth: 390 }),
    ).toEqual({
      mode: "compact",
      heroCharacterStagger: 0.025,
      scrollScrub: 0.2,
      meteorTravel: 0,
      tiltDegrees: 0,
      ambientMotion: false,
    });
  });

  it("enables full motion at desktop widths", () => {
    expect(
      getSpaceMotionProfile({ reducedMotion: false, viewportWidth: 1440 }),
    ).toEqual({
      mode: "full",
      heroCharacterStagger: 0.035,
      scrollScrub: 0.45,
      meteorTravel: 180,
      tiltDegrees: 6,
      ambientMotion: true,
    });
  });
});

describe("getMeteorVariant", () => {
  it("cycles the three approved meteor shells", () => {
    expect([0, 1, 2, 3, 4, 5].map(getMeteorVariant)).toEqual([
      1, 2, 3, 1, 2, 3,
    ]);
  });
});
