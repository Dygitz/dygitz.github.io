import { describe, expect, it } from "vitest";
import { getViewportGlowWindow } from "./viewportGlow";

describe("getViewportGlowWindow", () => {
  it("keeps the light window aligned with the viewport, not a job section", () => {
    expect(getViewportGlowWindow({ scrollTop: 2500, orbitTop: 2000, orbitHeight: 4000, viewportHeight: 1000 }))
      .toEqual({ start: 125, end: 375 });
    expect(getViewportGlowWindow({ scrollTop: 2540, orbitTop: 2000, orbitHeight: 4000, viewportHeight: 1000 }))
      .toEqual({ start: 135, end: 385 });
  });

  it("moves back continuously when scrolling upward", () => {
    expect(getViewportGlowWindow({ scrollTop: 2100, orbitTop: 2000, orbitHeight: 4000, viewportHeight: 1000 }))
      .toEqual({ start: 25, end: 275 });
  });

  it("does not squash the fades at either end of the timeline", () => {
    expect(getViewportGlowWindow({ scrollTop: 1500, orbitTop: 2000, orbitHeight: 4000, viewportHeight: 1000 }))
      .toEqual({ start: -125, end: 125 });
    expect(getViewportGlowWindow({ scrollTop: 5800, orbitTop: 2000, orbitHeight: 4000, viewportHeight: 1000 }))
      .toEqual({ start: 950, end: 1200 });
  });

  it("recomputes the glow span for a changed viewport or timeline height", () => {
    expect(getViewportGlowWindow({ scrollTop: 2500, orbitTop: 2000, orbitHeight: 2000, viewportHeight: 800 }))
      .toEqual({ start: 250, end: 650 });
  });

  it("keeps an unmeasured timeline visible without invalid SVG coordinates", () => {
    expect(getViewportGlowWindow({ scrollTop: 0, orbitTop: 0, orbitHeight: 0, viewportHeight: 800 }))
      .toEqual({ start: 0, end: 1000 });
  });
});
