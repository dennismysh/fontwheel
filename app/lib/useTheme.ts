"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "bw" | "colorful";

const STORAGE_KEY = "fontwheel.theme.v1";

function readInitial(): Theme {
  if (typeof document === "undefined") return "bw";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "colorful" ? "colorful" : "bw";
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>("bw");

  useEffect(() => {
    setThemeState(readInitial());
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  return [theme, setTheme];
}
