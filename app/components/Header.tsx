"use client";

import type { Theme } from "../lib/useTheme";

type Props = {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
};

export function Header({ theme, onThemeChange }: Props) {
  return (
    <header className="hdr">
      <div className="hdr__brand">
        <div className="hdr__logo" aria-hidden>
          F
        </div>
        <div className="hdr__title">Font Wheel</div>
      </div>
      <div className="hdr__right">
        <div className="hdr__tagline">spin · share · pick</div>
        <div className="theme-toggle" role="group" aria-label="Theme">
          <button
            type="button"
            className="theme-toggle__opt"
            aria-pressed={theme === "bw"}
            onClick={() => onThemeChange("bw")}
          >
            b&amp;w
          </button>
          <button
            type="button"
            className="theme-toggle__opt"
            aria-pressed={theme === "colorful"}
            onClick={() => onThemeChange("colorful")}
          >
            color
          </button>
        </div>
      </div>
    </header>
  );
}
