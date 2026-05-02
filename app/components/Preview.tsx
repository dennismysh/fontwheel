"use client";

import { useEffect, useState } from "react";
import { PreviewLanding } from "./PreviewLanding";
import { PreviewSandbox } from "./PreviewSandbox";
import { PreviewSpecimen } from "./PreviewSpecimen";
import type { FontEntry } from "../data/fonts";

type Mode = "Landing" | "Sandbox" | "Specimen";

type Props = {
  fontFamily: string;
  fontEntry: FontEntry | null;
  compact?: boolean;
  shareUrl?: string;
};

export function Preview({ fontFamily, fontEntry, compact = false, shareUrl }: Props) {
  const [mode, setMode] = useState<Mode>("Landing");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  const onCopy = async () => {
    const url =
      shareUrl ?? (typeof window !== "undefined" ? window.location.href : "");
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="preview-panel" aria-label="Font preview">
      <div className="preview-panel__head">
        <div className="preview-panel__actions">
          <button type="button" className="action-link" onClick={onCopy} aria-live="polite">
            {copied ? "copied!" : "copy link"}
          </button>
          <span className="dot-sep" aria-hidden>
            ·
          </span>
          <button
            type="button"
            className={`action-link ${saved ? "action-link--on" : ""}`}
            onClick={() => setSaved((s) => !s)}
            aria-pressed={saved}
          >
            {saved ? "♥ saved" : "♥ save"}
          </button>
        </div>
        <div className="preview-tabs" role="tablist">
          {(["Landing", "Sandbox", "Specimen"] as Mode[]).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={mode === t}
              className={`preview-tab ${mode === t ? "preview-tab--active" : ""}`}
              onClick={() => setMode(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className={`preview-panel__body ${compact ? "preview-panel__body--compact" : ""}`}>
        {mode === "Landing" && (
          <PreviewLanding fontFamily={fontFamily} fontEntry={fontEntry} compact={compact} />
        )}
        {mode === "Sandbox" && <PreviewSandbox fontFamily={fontFamily} />}
        {mode === "Specimen" && <PreviewSpecimen fontFamily={fontFamily} />}
      </div>
    </section>
  );
}
