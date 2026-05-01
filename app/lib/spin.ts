import type { FontEntry } from "../data/fonts";

export const MAX_VISIBLE_SEGMENTS = 20;

export function pickWinner<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function sampleWheelSegments(
  pool: FontEntry[],
  winner: FontEntry,
  max = MAX_VISIBLE_SEGMENTS,
): FontEntry[] {
  if (pool.length <= max) return pool;

  const others = pool.filter((f) => f.family !== winner.family);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const sampled = shuffled.slice(0, max - 1);
  const winnerIndex = Math.floor(Math.random() * max);
  sampled.splice(winnerIndex, 0, winner);
  return sampled;
}

export function computeFinalRotation(
  currentRotation: number,
  segments: number,
  winnerIndex: number,
  fullSpins: number = 5,
): number {
  const segmentDeg = 360 / segments;
  const targetCenter = winnerIndex * segmentDeg + segmentDeg / 2;
  const jitter = (Math.random() - 0.5) * (segmentDeg * 0.6);
  const desiredAngle = -targetCenter + jitter;
  const currentMod = ((currentRotation % 360) + 360) % 360;
  const desiredMod = ((desiredAngle % 360) + 360) % 360;
  let delta = desiredMod - currentMod;
  if (delta < 0) delta += 360;
  return currentRotation + fullSpins * 360 + delta;
}
