"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FontEntry } from "../data/fonts";
import { useSpin } from "../lib/useSpin";
import { loadFonts } from "../lib/loadFont";
import { WheelSVG } from "./WheelSVG";
import { Pointer } from "./Pointer";

type Orientation = "right" | "bottom";

type Props = {
  pool: FontEntry[];
  orientation: Orientation;
  onLand: (winner: FontEntry) => void;
};

const MAX_SEGMENTS = 24;

function sample(pool: FontEntry[], n: number): FontEntry[] {
  if (pool.length <= n) return pool;
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
}

export function WheelStage({ pool, orientation, onLand }: Props) {
  const [segments, setSegments] = useState<FontEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const { rotation, spinning, landedIndex, spin } = useSpin(segments.length);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageSize, setStageSize] = useState({ w: 600, h: 700 });
  const lastLandedRef = useRef<number | null>(null);
  const lastSampledPoolRef = useRef<FontEntry[] | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || spinning) return;
    if (lastSampledPoolRef.current === pool) return;
    lastSampledPoolRef.current = pool;
    setSegments(sample(pool, MAX_SEGMENTS));
  }, [pool, spinning, mounted]);

  useEffect(() => {
    loadFonts(segments.map((s) => ({ family: s.family, weights: [400, 500] })));
  }, [segments]);

  useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const ro = new ResizeObserver(() => {
      setStageSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setStageSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (landedIndex == null || segments.length === 0) return;
    if (lastLandedRef.current === landedIndex) return;
    lastLandedRef.current = landedIndex;
    const winner = segments[landedIndex];
    if (winner) onLand(winner);
  }, [landedIndex, segments, onLand]);

  const diameter = useMemo(() => {
    const { w, h } = stageSize;
    if (orientation === "right") {
      return Math.min(h * 1.7, w * 2.0);
    }
    return Math.min(w * 1.8, h * 2.0);
  }, [stageSize, orientation]);

  const clipPct = orientation === "right" ? 0.62 : 0.58;
  const pointerSide = orientation === "right" ? "left" : "bottom";

  const containerStyle: React.CSSProperties =
    orientation === "right"
      ? {
          position: "absolute",
          top: "50%",
          right: -diameter * clipPct,
          transform: "translateY(-50%)",
          width: diameter,
          height: diameter,
        }
      : {
          position: "absolute",
          left: "50%",
          top: -diameter * clipPct,
          transform: "translateX(-50%)",
          width: diameter,
          height: diameter,
        };

  const handleSpin = () => {
    if (spinning) return;
    lastLandedRef.current = null;
    const pointerAngle = orientation === "right" ? 180 : 90;
    spin({ duration: 5200, pointerAngle });
  };

  const landedFont = landedIndex != null ? segments[landedIndex] : null;
  const landedChipStyle: React.CSSProperties =
    orientation === "right"
      ? {
          left: `calc(100% - ${diameter * (1 - clipPct)}px - 24px)`,
          top: "50%",
          transform: "translate(-100%, -50%)",
        }
      : {
          top: diameter * (1 - clipPct) + 12,
          left: "50%",
          transform: "translateX(-50%)",
        };

  const spinBtnStyle: React.CSSProperties =
    orientation === "right"
      ? { right: 24, bottom: 24 }
      : { left: "50%", transform: "translateX(-50%)", bottom: 20 };

  return (
    <div ref={stageRef} className={`wheel-stage wheel-stage--${orientation}`}>
      {mounted && segments.length > 0 && (
        <div style={containerStyle} className="wheel-mount">
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <WheelSVG size={diameter} fonts={segments} rotation={rotation} />
            <Pointer side={pointerSide} size={diameter} />
          </div>
        </div>
      )}

      {mounted && (
        <button
          type="button"
          className="spin-btn"
          onClick={handleSpin}
          disabled={spinning || segments.length === 0}
          style={spinBtnStyle}
        >
          {spinning ? "…spinning" : "spin"}
        </button>
      )}

      {landedFont && !spinning && (
        <div className="landed-chip" style={landedChipStyle} key={`${landedFont.family}-${landedIndex}`}>
          <div className="landed-chip__label">landed on</div>
          <div
            className="landed-chip__name"
            style={{ fontFamily: `"${landedFont.family}", system-ui` }}
          >
            {landedFont.family}
          </div>
        </div>
      )}
    </div>
  );
}
