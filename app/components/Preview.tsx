"use client";

import { useState } from "react";
import { PreviewLanding } from "./PreviewLanding";
import { PreviewSandbox } from "./PreviewSandbox";

type Mode = "landing" | "sandbox";

type Props = {
  fontFamily: string;
};

export function Preview({ fontFamily }: Props) {
  const [mode, setMode] = useState<Mode>("landing");
  return (
    <section className="panel" aria-label="Font preview">
      <h2>Preview</h2>
      <div className="preview-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={mode === "landing"}
          className={mode === "landing" ? "active" : ""}
          onClick={() => setMode("landing")}
        >
          Landing
        </button>
        <button
          role="tab"
          aria-selected={mode === "sandbox"}
          className={mode === "sandbox" ? "active" : ""}
          onClick={() => setMode("sandbox")}
        >
          Sandbox
        </button>
      </div>
      {mode === "landing" ? (
        <PreviewLanding fontFamily={fontFamily} />
      ) : (
        <PreviewSandbox fontFamily={fontFamily} />
      )}
    </section>
  );
}
