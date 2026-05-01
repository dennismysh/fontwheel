"use client";

import { CATEGORIES, STANDARD_WEIGHTS } from "../data/fonts";
import type { FilterState } from "../lib/filterFonts";

type Props = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  matchCount: number;
  totalCount: number;
};

const TOP_OPTIONS: Array<{ label: string; value: number | "all" }> = [
  { label: "Top 10", value: 10 },
  { label: "Top 25", value: 25 },
  { label: "Top 50", value: 50 },
  { label: "Top 100", value: 100 },
  { label: "All", value: "all" },
];

export function Filters({ value, onChange, matchCount, totalCount }: Props) {
  const toggleCategory = (cat: (typeof CATEGORIES)[number]) => {
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
    <aside className="panel filters" aria-label="Wheel filters">
      <h2>Filters</h2>

      <div className="group">
        <div className="group-title">Search</div>
        <input
          type="text"
          placeholder="Font name…"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
        />
      </div>

      <div className="group">
        <div className="group-title">Category</div>
        {CATEGORIES.map((cat) => (
          <label key={cat}>
            <input
              type="checkbox"
              checked={value.categories.includes(cat)}
              onChange={() => toggleCategory(cat)}
            />
            <span>{cat}</span>
          </label>
        ))}
      </div>

      <div className="group">
        <div className="group-title">Weight support</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px" }}>
          {STANDARD_WEIGHTS.map((w) => (
            <label key={w} style={{ width: "auto" }}>
              <input
                type="checkbox"
                checked={value.weights.includes(w)}
                onChange={() => toggleWeight(w)}
              />
              <span>{w}</span>
            </label>
          ))}
        </div>
        <label style={{ marginTop: 6 }}>
          <input
            type="checkbox"
            checked={value.italicOnly}
            onChange={(e) => onChange({ ...value, italicOnly: e.target.checked })}
          />
          <span>Italic available</span>
        </label>
      </div>

      <div className="group">
        <div className="group-title">Popularity</div>
        <select
          value={String(value.topN)}
          onChange={(e) => {
            const v = e.target.value;
            onChange({ ...value, topN: v === "all" ? "all" : Number(v) });
          }}
        >
          {TOP_OPTIONS.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="count">
        {matchCount} / {totalCount} fonts on the wheel
      </div>
    </aside>
  );
}
