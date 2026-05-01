const loaded = new Set<string>();

export function loadFont(family: string, weights: number[] = [400, 700]) {
  if (typeof document === "undefined") return;
  const key = `${family}:${weights.join(",")}`;
  if (loaded.has(key)) return;
  loaded.add(key);

  const familyParam = family.replace(/ /g, "+");
  const wghts = [...new Set(weights)].sort((a, b) => a - b).join(";");
  const href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${wghts}&display=swap`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.fontwheel = family;
  document.head.appendChild(link);
}

export function loadFonts(families: Array<{ family: string; weights?: number[] }>) {
  for (const { family, weights } of families) {
    loadFont(family, weights);
  }
}
