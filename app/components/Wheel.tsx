"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FontEntry } from "../data/fonts";
import { loadFonts } from "../lib/loadFont";
import {
  MAX_VISIBLE_SEGMENTS,
  computeFinalRotation,
  pickWinner,
  sampleWheelSegments,
} from "../lib/spin";

const PALETTE = ["#ffd166", "#ef476f", "#06d6a0", "#118ab2", "#8367c7", "#f78c6b"];

type Props = {
  pool: FontEntry[];
  spinning: boolean;
  onLand: (winner: FontEntry) => void;
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeSegment(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export function Wheel({ pool, spinning, onLand }: Props) {
  const [segments, setSegments] = useState<FontEntry[]>(() =>
    pool.slice(0, MAX_VISIBLE_SEGMENTS),
  );
  const [rotation, setRotation] = useState(0);
  const winnerRef = useRef<FontEntry | null>(null);
  const spinningRef = useRef(spinning);
  spinningRef.current = spinning;

  useEffect(() => {
    if (spinningRef.current) return;
    setSegments(pool.slice(0, Math.min(pool.length, MAX_VISIBLE_SEGMENTS)));
    setRotation(0);
  }, [pool]);

  useEffect(() => {
    loadFonts(segments.map((s) => ({ family: s.family, weights: [400] })));
  }, [segments]);

  useEffect(() => {
    if (!spinning || pool.length === 0) return;

    const winner = pickWinner(pool);
    winnerRef.current = winner;
    const visible = sampleWheelSegments(pool, winner);
    setSegments(visible);
    loadFonts(visible.map((s) => ({ family: s.family, weights: [400] })));

    const winnerIndex = visible.findIndex((s) => s.family === winner.family);
    const next = computeFinalRotation(rotation, visible.length, winnerIndex);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setRotation(next);
      requestAnimationFrame(() => onLand(winner));
      return;
    }

    requestAnimationFrame(() => setRotation(next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning]);

  const onTransitionEnd = () => {
    if (spinning && winnerRef.current) {
      onLand(winnerRef.current);
    }
  };

  const cx = 200;
  const cy = 200;
  const r = 198;
  const segCount = segments.length || 1;
  const segDeg = 360 / segCount;
  const labelRadius = r * 0.66;

  const paths = useMemo(() => {
    return segments.map((font, i) => {
      const startAngle = i * segDeg;
      const endAngle = (i + 1) * segDeg;
      const d = describeSegment(cx, cy, r, startAngle, endAngle);
      const labelAngle = startAngle + segDeg / 2;
      const labelPos = polarToCartesian(cx, cy, labelRadius, labelAngle);
      return {
        font,
        d,
        labelPos,
        labelAngle,
        fill: PALETTE[i % PALETTE.length],
      };
    });
  }, [segments, segDeg]);

  return (
    <div
      className="wheel-stage"
      role="img"
      aria-label={`Font wheel with ${segments.length} segments`}
    >
      <div className="wheel-pointer" aria-hidden="true" />
      <svg
        className="wheel-svg"
        viewBox="0 0 400 400"
        style={{ transform: `rotate(${rotation}deg)` }}
        onTransitionEnd={onTransitionEnd}
      >
        {paths.map((p, i) => {
          const fontSize = segCount <= 8 ? 18 : segCount <= 14 ? 14 : 11;
          return (
            <g key={`${p.font.family}-${i}`}>
              <path d={p.d} fill={p.fill} stroke="#16161d" strokeWidth={1} />
              <text
                x={p.labelPos.x}
                y={p.labelPos.y}
                fontSize={fontSize}
                fill="#1a1a1a"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${p.labelAngle} ${p.labelPos.x} ${p.labelPos.y})`}
                style={{
                  fontFamily: `"${p.font.family}", system-ui, sans-serif`,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {p.font.family.length > 18
                  ? p.font.family.slice(0, 16) + "…"
                  : p.font.family}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="wheel-hub" aria-hidden="true">
        spin
      </div>
    </div>
  );
}
