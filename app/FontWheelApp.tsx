"use client";

import { useEffect, useMemo, useState } from "react";
import { FONTS, type FontEntry } from "./data/fonts";
import { Filters } from "./components/Filters";
import { Wheel } from "./components/Wheel";
import { Preview } from "./components/Preview";
import { SpinResult } from "./components/SpinResult";
import { DEFAULT_FILTERS, filterFonts, type FilterState } from "./lib/filterFonts";
import { loadFont } from "./lib/loadFont";
import { useFontParam } from "./lib/useFontParam";

const STORAGE_KEY = "fontwheel.filters.v1";
const FALLBACK_FAMILY = "Inter";

export function FontWheelApp() {
  const { currentFont, setCurrentFont } = useFontParam();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filtersHydrated, setFiltersHydrated] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [lastWinner, setLastWinner] = useState<FontEntry | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FilterState>;
        setFilters({ ...DEFAULT_FILTERS, ...parsed });
      }
    } catch {}
    setFiltersHydrated(true);
  }, []);

  useEffect(() => {
    if (!filtersHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {}
  }, [filters, filtersHydrated]);

  const pool = useMemo(() => filterFonts(FONTS, filters), [filters]);

  const previewFamily = currentFont || lastWinner?.family || FALLBACK_FAMILY;

  useEffect(() => {
    const entry = FONTS.find((f) => f.family === previewFamily);
    const weights = entry ? entry.weights : [400];
    loadFont(previewFamily, weights);
  }, [previewFamily]);

  useEffect(() => {
    if (currentFont && !lastWinner) {
      const match = FONTS.find((f) => f.family === currentFont) ?? null;
      if (match) setLastWinner(match);
    }
  }, [currentFont, lastWinner]);

  const handleSpin = () => {
    if (spinning || pool.length === 0) return;
    setSpinning(true);
  };

  const handleLand = (winner: FontEntry) => {
    setSpinning(false);
    setLastWinner(winner);
    loadFont(winner.family, winner.weights);
    setCurrentFont(winner.family);
  };

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title">🎡 Font Wheel</h1>
          <div className="app-subtitle">
            Spin a wheel of Google Fonts. Share the URL of the one you like.
          </div>
        </div>
      </header>

      <div className="layout">
        <Filters
          value={filters}
          onChange={setFilters}
          matchCount={pool.length}
          totalCount={FONTS.length}
        />

        <div className="right-col">
          <section className="panel">
            <h2>Wheel</h2>
            <div className="wheel-wrap">
              <Wheel pool={pool} spinning={spinning} onLand={handleLand} />
              <button
                className="spin-btn"
                onClick={handleSpin}
                disabled={spinning || pool.length === 0}
              >
                {spinning ? "Spinning…" : "SPIN"}
              </button>
              <SpinResult font={lastWinner} />
            </div>
          </section>

          <Preview fontFamily={previewFamily} />
        </div>
      </div>
    </main>
  );
}
