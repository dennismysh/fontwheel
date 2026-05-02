"use client";

import type { FilterState } from "../lib/filterFonts";
import { CATEGORIES, STANDARD_WEIGHTS, type FontCategory } from "../data/fonts";

type Layout = "horizontal" | "stacked";

type Props = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  matchCount: number;
  totalCount: number;
  layout?: Layout;
};

const CATEGORY_LABEL: Record<FontCategory, string> = {
  "sans-serif": "sans",
  serif: "serif",
  display: "display",
  handwriting: "hand",
  monospace: "mono",
};

export function FilterBar({
  value,
  onChange,
  matchCount,
  totalCount,
  layout = "horizontal",
}: Props) {
  const toggleCategory = (cat: FontCategory) => {
    const has = value.categories.includes(cat);
    const next = has
      ? value.categories.filter((c) => c !== cat)
      : [...value.categories, cat];
    onChange({ ...value, categories: next });
  };

  const toggleWeight = (w: number) => {
    const has = value.weights.includes(w);
    const next = has ? value.weights.filter((x) => x !== w) : [...value.weights, w];
    onChange({ ...value, weights: next });
  };

  return (
    <div className={`filter-bar filter-bar--${layout}`} role="region" aria-label="Filters">
      <div className="filter-bar__lead">
        <span className="filter-bar__label">filters</span>
        <span className="count-pill" aria-live="polite">
          {matchCount} / {totalCount}
        </span>
      </div>

      <label className="search-pill">
        <span aria-hidden>🔍</span>
        <input
          type="text"
          placeholder="font name…"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          aria-label="Search fonts by name"
        />
      </label>

      <div className="chip-row" role="group" aria-label="Category">
        {CATEGORIES.map((cat) => {
          const active = value.categories.includes(cat);
          return (
            <button
              key={cat}
              type="button"
              className={`chip ${active ? "chip--active" : ""}`}
              onClick={() => toggleCategory(cat)}
              aria-pressed={active}
            >
              {CATEGORY_LABEL[cat]}
            </button>
          );
        })}
      </div>

      {layout === "horizontal" && (
        <>
          <div className="divider" aria-hidden />
          <span className="filter-bar__sublabel">weight</span>
          <div className="chip-row chip-row--tight" role="group" aria-label="Weights">
            {STANDARD_WEIGHTS.map((w) => {
              const active = value.weights.includes(w);
              return (
                <button
                  key={w}
                  type="button"
                  className={`chip chip--small ${active ? "chip--active" : ""}`}
                  onClick={() => toggleWeight(w)}
                  aria-pressed={active}
                >
                  {w}
                </button>
              );
            })}
          </div>
          <div className="divider" aria-hidden />
          <label className="italic-toggle">
            <input
              type="checkbox"
              checked={value.italicOnly}
              onChange={(e) => onChange({ ...value, italicOnly: e.target.checked })}
            />
            <span>italic</span>
          </label>
        </>
      )}

      {layout === "stacked" && (
        <label className="italic-toggle italic-toggle--stacked">
          <input
            type="checkbox"
            checked={value.italicOnly}
            onChange={(e) => onChange({ ...value, italicOnly: e.target.checked })}
          />
          <span>italic only</span>
        </label>
      )}
    </div>
  );
}
