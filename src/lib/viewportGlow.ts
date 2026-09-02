interface ViewportGlowInput {
  scrollTop: number;
  orbitTop: number;
  orbitHeight: number;
  viewportHeight: number;
}

export function getViewportGlowWindow(input: ViewportGlowInput) {
  if (input.orbitHeight <= 0) return { start: 0, end: 1000 };

  // The orbit uses a 1000-unit SVG height. Leave the viewport edges unclamped
  // so the fade retains its size as the timeline enters or leaves the screen.
  const unitsPerPixel = 1000 / input.orbitHeight;
  const start = (input.scrollTop - input.orbitTop) * unitsPerPixel;
  return { start, end: start + input.viewportHeight * unitsPerPixel };
}
