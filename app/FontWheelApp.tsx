"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FONTS, type FontEntry } from "./data/fonts";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { Preview } from "./components/Preview";
import { WheelStage } from "./components/WheelStage";
import { DEFAULT_FILTERS, filterFonts, type FilterState } from "./lib/filterFonts";
import { loadFont } from "./lib/loadFont";
import { useFontParam } from "./lib/useFontParam";
import { useIsMobile } from "./lib/useIsMobile";
import { useTheme } from "./lib/useTheme";

const STORAGE_KEY = "fontwheel.filters.v1";
const FALLBACK_FAMILY = "Inter";

export function FontWheelApp() {
  const { currentFont, setCurrentFont } = useFontParam();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filtersHydrated, setFiltersHydrated] = useState(false);
  const [lastWinner, setLastWinner] = useState<FontEntry | null>(null);
  const isMobile = useIsMobile(760);
  const [theme, setTheme] = useTheme();

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
  const totalCount = FONTS.length;

  const previewFamily = currentFont || lastWinner?.family || FALLBACK_FAMILY;
  const previewEntry = useMemo(
    () => FONTS.find((f) => f.family === previewFamily) ?? null,
    [previewFamily],
  );

  useEffect(() => {
    const weights = previewEntry?.weights ?? [400];
    loadFont(previewFamily, weights);
  }, [previewFamily, previewEntry]);

  useEffect(() => {
    if (currentFont && !lastWinner) {
      const match = FONTS.find((f) => f.family === currentFont) ?? null;
      if (match) setLastWinner(match);
    }
  }, [currentFont, lastWinner]);

  const handleLand = useCallback(
    (winner: FontEntry) => {
      setLastWinner(winner);
      loadFont(winner.family, winner.weights);
      setCurrentFont(winner.family);
    },
    [setCurrentFont],
  );

  const filterBar = (
    <FilterBar
      value={filters}
      onChange={setFilters}
      matchCount={pool.length}
      totalCount={totalCount}
      layout={isMobile ? "stacked" : "horizontal"}
    />
  );

  if (isMobile) {
    return (
      <main className="app app--mobile">
        <Header theme={theme} onThemeChange={setTheme} />
        <div className="wheel-zone wheel-zone--mobile">
          <div className="wheel-zone__corner">font wheel</div>
          <WheelStage pool={pool} orientation="bottom" theme={theme} onLand={handleLand} />
        </div>
        <div className="content-stack">
          {filterBar}
          <Preview fontFamily={previewFamily} fontEntry={previewEntry} compact />
        </div>
      </main>
    );
  }

  return (
    <main className="app app--desktop">
      <Header theme={theme} onThemeChange={setTheme} />
      <div className="stage">
        <div className="content-col">
          {filterBar}
          <Preview fontFamily={previewFamily} fontEntry={previewEntry} />
        </div>
        <div className="wheel-zone wheel-zone--desktop">
          <div className="wheel-zone__corner">wheel</div>
          <WheelStage pool={pool} orientation="right" theme={theme} onLand={handleLand} />
        </div>
      </div>
    </main>
  );
}
