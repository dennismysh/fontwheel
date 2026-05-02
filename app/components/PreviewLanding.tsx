"use client";

import type { FontEntry } from "../data/fonts";

type Props = {
  fontFamily: string;
  fontEntry: FontEntry | null;
  compact?: boolean;
};

const CATEGORY_LABEL: Record<string, string> = {
  "sans-serif": "sans-serif",
  serif: "serif",
  display: "display",
  handwriting: "handwriting",
  monospace: "monospace",
};

export function PreviewLanding({ fontFamily, fontEntry, compact = false }: Props) {
  const stack = `"${fontFamily}", system-ui, sans-serif`;
  const cat = fontEntry?.category ? CATEGORY_LABEL[fontEntry.category] : "—";
  const weights = fontEntry?.weights.length ?? 0;
  const italic = fontEntry?.italic ?? false;

  return (
    <div className={`landing ${compact ? "landing--compact" : ""}`}>
      <div className="landing__eyebrow">showing</div>
      <div className="landing__display" style={{ fontFamily: stack }}>
        {fontFamily}
      </div>
      <div className="landing__meta">
        {cat} · {weights} weight{weights === 1 ? "" : "s"}
        {italic ? " · italic" : ""}
      </div>

      <h1 className="landing__head" style={{ fontFamily: stack }}>
        Design that reads at a glance.
      </h1>
      <p className="landing__lead" style={{ fontFamily: stack }}>
        A type system that flexes from headline to caption without breaking the
        rhythm of the page. Hover any letter to see its counters; drag to
        compare weights.
      </p>

      {!compact && (
        <>
          <div className="landing__cta-row">
            <button type="button" className="cta cta--primary" style={{ fontFamily: stack }}>
              Try it
            </button>
            <button type="button" className="cta cta--ghost" style={{ fontFamily: stack }}>
              see specimen →
            </button>
          </div>
          <div className="landing__bars" aria-hidden>
            <div className="landing__bar" style={{ width: "90%" }} />
            <div className="landing__bar" style={{ width: "78%" }} />
            <div className="landing__bar" style={{ width: "60%" }} />
          </div>
        </>
      )}
    </div>
  );
}
