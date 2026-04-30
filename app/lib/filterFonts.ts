import type { FontCategory, FontEntry } from "../data/fonts";

export type FilterState = {
  categories: FontCategory[];
  weights: number[];
  italicOnly: boolean;
  search: string;
  topN: number | "all";
};

export const DEFAULT_FILTERS: FilterState = {
  categories: ["sans-serif", "serif", "display", "handwriting", "monospace"],
  weights: [],
  italicOnly: false,
  search: "",
  topN: "all",
};

export function filterFonts(catalog: FontEntry[], f: FilterState): FontEntry[] {
  const search = f.search.trim().toLowerCase();
  const cats = new Set(f.categories);
  const weights = f.weights;

  let out = catalog.filter((font) => {
    if (!cats.has(font.category)) return false;
    if (f.italicOnly && !font.italic) return false;
    if (weights.length > 0 && !weights.some((w) => font.weights.includes(w))) {
      return false;
    }
    if (search && !font.family.toLowerCase().includes(search)) return false;
    return true;
  });

  out.sort((a, b) => a.popularity - b.popularity);

  if (f.topN !== "all") {
    out = out.slice(0, f.topN);
  }

  return out;
}
