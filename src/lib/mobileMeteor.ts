interface MobileMeteor {
  x: number;
  y: number;
  speed: number;
  angle: number;
  opacity: number;
  ageMs?: number;
}

export function advanceMobileMeteor(meteor: MobileMeteor, deltaMs: number): boolean {
  const frameStep = deltaMs / (1000 / 60);
  meteor.x -= meteor.speed * Math.cos(meteor.angle) * frameStep;
  meteor.y += meteor.speed * Math.sin(meteor.angle) * frameStep;
  meteor.ageMs = (meteor.ageMs ?? 0) + deltaMs;

  // Preserve the old 60 Hz fade speed without tying it to frame count.
  const fadeProgress = (meteor.ageMs / (1000 / 60)) * 0.04;
  meteor.opacity = Math.max(0, Math.min(fadeProgress, 2 - fadeProgress));
  return fadeProgress < 2.1;
}
