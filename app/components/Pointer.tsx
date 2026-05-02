"use client";

type Side = "left" | "bottom";

type Props = {
  side: Side;
  size: number;
};

export function Pointer({ side, size }: Props) {
  const w = size * 0.05;
  const h = size * 0.07;

  if (side === "left") {
    return (
      <div
        style={{
          position: "absolute",
          left: -w * 0.4,
          top: "50%",
          transform: "translateY(-50%)",
          width: w,
          height: h,
          pointerEvents: "none",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
        }}
        aria-hidden
      >
        <svg viewBox="0 0 20 28" width="100%" height="100%">
          <path d="M 20 14 L 0 4 L 4 14 L 0 24 Z" fill="#f4c04e" stroke="#1a1a1a" strokeWidth={1} />
        </svg>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: -h * 0.4,
        left: "50%",
        transform: "translateX(-50%)",
        width: h,
        height: w,
        pointerEvents: "none",
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
      }}
      aria-hidden
    >
      <svg viewBox="0 0 28 20" width="100%" height="100%">
        <path d="M 14 0 L 4 20 L 14 16 L 24 20 Z" fill="#f4c04e" stroke="#1a1a1a" strokeWidth={1} />
      </svg>
    </div>
  );
}
