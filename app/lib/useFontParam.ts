"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useFontParam(): {
  currentFont: string | null;
  setCurrentFont: (family: string) => void;
} {
  const router = useRouter();
  const params = useSearchParams();
  const currentFont = params.get("font");

  const setCurrentFont = useCallback(
    (family: string) => {
      const next = new URLSearchParams(params.toString());
      next.set("font", family);
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [router, params],
  );

  return { currentFont, setCurrentFont };
}
