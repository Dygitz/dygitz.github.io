import { describe, expect, it } from "vitest";
import {
  getOrbitGeometry,
  getOrbitNodeYRadius,
} from "./timelineGeometry";

describe("getOrbitGeometry", () => {
  it("places eight alternating meteor nodes on the orbit path", () => {
    expect(getOrbitGeometry(8)).toEqual({
      nodes: [
        { x: 32, y: 62.5 },
        { x: 68, y: 187.5 },
        { x: 32, y: 312.5 },
        { x: 68, y: 437.5 },
        { x: 32, y: 562.5 },
        { x: 68, y: 687.5 },
        { x: 32, y: 812.5 },
        { x: 68, y: 937.5 },
      ],
      path: "M 50 0 C 50 31.25 32 31.25 32 62.5 S 68 156.25 68 187.5 S 32 281.25 32 312.5 S 68 406.25 68 437.5 S 32 531.25 32 562.5 S 68 656.25 68 687.5 S 32 781.25 32 812.5 S 68 906.25 68 937.5 C 68 968.75 50 968.75 50 1000",
    });
  });

  it("returns an empty centered orbit when there are no meteors", () => {
    expect(getOrbitGeometry(0)).toEqual({
      nodes: [],
      path: "M 50 0 L 50 1000",
    });
  });
});

describe("getOrbitNodeYRadius", () => {
  it("compensates for a non-uniformly stretched orbit SVG", () => {
    expect(
      getOrbitNodeYRadius({
        svgWidth: 190,
        svgHeight: 4000,
        xRadius: 4.6,
      }),
    ).toBeCloseTo(2.185, 6);
  });

  it("returns zero before the orbit has measurable height", () => {
    expect(
      getOrbitNodeYRadius({
        svgWidth: 190,
        svgHeight: 0,
        xRadius: 4.6,
      }),
    ).toBe(0);
  });
});
