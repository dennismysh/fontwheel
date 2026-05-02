"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpinOpts = {
  duration?: number;
  pointerAngle?: number;
};

export type SpinHandle = {
  rotation: number;
  spinning: boolean;
  landedIndex: number | null;
  spin: (opts?: SpinOpts) => void;
};

export function useSpin(slices: number): SpinHandle {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landedIndex, setLandedIndex] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const rotationRef = useRef(0);
  rotationRef.current = rotation;

  const spin = useCallback(
    (opts: SpinOpts = {}) => {
      if (spinning || slices <= 0) return;
      const { duration = 5200, pointerAngle = 180 } = opts;
      setSpinning(true);
      setLandedIndex(null);

      const startRot = rotationRef.current;
      const fullSpins = 5 + Math.random() * 3;
      const finalOffset = Math.random() * 360;
      const totalDelta = fullSpins * 360 + finalOffset;

      const t0 = performance.now();
      lastTickRef.current = startRot;

      const easeOut = (t: number) => {
        const a = 1 - Math.pow(1 - t, 4);
        const b = 1 - Math.pow(1 - t, 2.2);
        return 0.55 * a + 0.45 * b;
      };

      const sliceAngle = 360 / slices;

      const tick = (now: number) => {
        const elapsed = now - t0;
        const t = Math.min(1, elapsed / duration);
        const eased = easeOut(t);
        const cur = startRot + totalDelta * eased;
        setRotation(cur);

        const prev = lastTickRef.current;
        const prevSlice = Math.floor(((prev % 360) + 360) % 360 / sliceAngle);
        const curSlice = Math.floor(((cur % 360) + 360) % 360 / sliceAngle);
        if (prevSlice !== curSlice && t < 1) {
          window.dispatchEvent(new CustomEvent("wheel-tick"));
        }
        lastTickRef.current = cur;

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setSpinning(false);
          // Slice i (before rotation) occupies [i*sliceAngle - 90, (i+1)*sliceAngle - 90].
          // After rotation, the slice at the pointer satisfies
          //   i*sliceAngle - 90 + rot ≤ pointerAngle < (i+1)*sliceAngle - 90 + rot.
          // → i = floor((pointerAngle + 90 - rot) / sliceAngle).
          const wheelLocal =
            (((pointerAngle + 90 - cur) % 360) + 360) % 360;
          const idx = Math.floor(wheelLocal / sliceAngle) % slices;
          setLandedIndex(idx);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [spinning, slices],
  );

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return { rotation, spinning, landedIndex, spin };
}
