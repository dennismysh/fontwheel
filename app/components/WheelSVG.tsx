"use client";

import { useMemo } from "react";
import type { FontEntry } from "../data/fonts";

const BW_PALETTE = ["#1c1c1e", "#2a2a2d", "#1c1c1e", "#333336"];

type Props = {
  size: number;
  fonts: FontEntry[];
  rotation: number;
};

export function WheelSVG({ size, fonts, rotation }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const slices = Math.max(fonts.length, 1);
  const sliceAngle = 360 / slices;

  const paths = useMemo(() => {
    return fonts.map((font, i) => {
      const startAngle = i * sliceAngle - 90;
      const endAngle = (i + 1) * sliceAngle - 90;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const largeArc = sliceAngle > 180 ? 1 : 0;
      const fill = BW_PALETTE[i % BW_PALETTE.length];
      return {
        key: `${font.family}-${i}`,
        d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
        fill,
      };
    });
  }, [fonts, sliceAngle, cx, cy, r]);

  const textColor = "#e8e8ea";
  const textR = r * 0.78;
  const fontSize = Math.max(11, size / 42);

  const labels = fonts.map((font, i) => {
    const baseAngle = i * sliceAngle - 90 + sliceAngle / 2;
    const liveAngle = (((baseAngle + rotation) % 360) + 360) % 360;
    const flipped = liveAngle > 90 && liveAngle < 270;
    const liveRad = (liveAngle * Math.PI) / 180;
    const tx = cx + textR * Math.cos(liveRad);
    const ty = cy + textR * Math.sin(liveRad);
    const rot = flipped ? liveAngle + 180 : liveAngle;
    const anchor = flipped ? "start" : "end";
    const display = font.family.length > 18 ? font.family.slice(0, 16) + "…" : font.family;
    return {
      key: `${font.family}-${i}`,
      tx,
      ty,
      rot,
      anchor: anchor as "start" | "end",
      family: font.family,
      display,
    };
  });

  const gradientId = "wheel-grad-bw";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
        </radialGradient>
        <radialGradient id="hub-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3a3a3d" />
          <stop offset="100%" stopColor="#0a0a0b" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={r + 1} fill="none" stroke="#000" strokeWidth={3} />

      <g
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
          willChange: "transform",
        }}
      >
        {paths.map((p) => (
          <path key={p.key} d={p.d} fill={p.fill} stroke="#0a0a0b" strokeWidth={1} />
        ))}
        <circle cx={cx} cy={cy} r={r} fill={`url(#${gradientId})`} pointerEvents="none" />
      </g>

      {labels.map((l) => (
        <text
          key={l.key}
          x={l.tx}
          y={l.ty}
          fill={textColor}
          fontSize={fontSize}
          fontFamily={`"${l.family}", system-ui, sans-serif`}
          fontWeight={500}
          textAnchor={l.anchor}
          dominantBaseline="middle"
          transform={`rotate(${l.rot} ${l.tx} ${l.ty})`}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {l.display}
        </text>
      ))}

      <circle
        cx={cx}
        cy={cy}
        r={size * 0.09}
        fill="url(#hub-grad)"
        stroke="#000"
        strokeWidth={1.5}
      />
      <circle cx={cx} cy={cy} r={size * 0.04} fill="#1a1a1a" stroke="#444" strokeWidth={0.5} />
    </svg>
  );
}
