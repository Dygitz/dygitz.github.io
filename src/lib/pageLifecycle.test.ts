import { describe, expect, it } from "vitest";
import { shouldTeardownOnPageHide } from "./pageLifecycle";

describe("shouldTeardownOnPageHide", () => {
  it("preserves live animation state when the page enters bfcache", () => {
    expect(shouldTeardownOnPageHide(true)).toBe(false);
  });

  it("tears down when the page is actually being discarded", () => {
    expect(shouldTeardownOnPageHide(false)).toBe(true);
  });
});
