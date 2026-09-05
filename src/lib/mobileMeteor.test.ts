import { describe, expect, it } from "vitest";
import { advanceMobileMeteor } from "./mobileMeteor";

const createMeteor = () => ({
  x: 400,
  y: 0,
  speed: 8,
  angle: Math.PI / 4,
  opacity: 0,
  ageMs: 0,
});

describe("mobile meteor playback", () => {
  it("keeps travel and fading consistent at different frame rates", () => {
    const results = [30, 60, 120].map((fps) => {
      const meteor = createMeteor();
      for (let frame = 0; frame < fps / 2; frame++) {
        expect(advanceMobileMeteor(meteor, 1000 / fps)).toBe(true);
      }
      return meteor;
    });

    for (const meteor of results) {
      expect(meteor.x).toBeCloseTo(400 - 240 / Math.sqrt(2));
      expect(meteor.y).toBeCloseTo(240 / Math.sqrt(2));
      expect(meteor.opacity).toBeCloseTo(0.8);
    }
  });

  it("fades in from invisible and expires after fading out", () => {
    const meteor = createMeteor();
    expect(advanceMobileMeteor(meteor, 1000 / 60)).toBe(true);
    expect(meteor.opacity).toBeCloseTo(0.04);

    let alive = true;
    for (let frame = 1; frame < 54; frame++) {
      alive = advanceMobileMeteor(meteor, 1000 / 60);
    }
    expect(alive).toBe(false);
    expect(meteor.opacity).toBe(0);
  });
});
