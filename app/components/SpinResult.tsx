"use client";

import type { FontEntry } from "../data/fonts";

type Props = {
  font: FontEntry | null;
};

export function SpinResult({ font }: Props) {
  if (!font) {
    return (
      <div className="spin-result" aria-live="polite">
        <div className="label">Spin to land on a font</div>
      </div>
    );
  }
  return (
    <div className="spin-result" aria-live="polite">
      <div className="label">Landed on</div>
      <div
        className="name"
        style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}
      >
        {font.family}
      </div>
      <div className="meta">
        {font.category} · {font.weights.length} weight
        {font.weights.length === 1 ? "" : "s"}
        {font.italic ? " · italic" : ""}
      </div>
    </div>
  );
}
