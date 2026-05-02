"use client";

export function Header() {
  return (
    <header className="hdr">
      <div className="hdr__brand">
        <div className="hdr__logo" aria-hidden>
          F
        </div>
        <div className="hdr__title">Font Wheel</div>
      </div>
      <div className="hdr__tagline">spin · share · pick</div>
    </header>
  );
}
