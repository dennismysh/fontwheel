import { Suspense } from "react";
import { FontWheelApp } from "./FontWheelApp";

export default function Page() {
  return (
    <Suspense fallback={<main className="app">Loading…</main>}>
      <FontWheelApp />
    </Suspense>
  );
}
