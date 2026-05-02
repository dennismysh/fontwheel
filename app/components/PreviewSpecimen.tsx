"use client";

type Props = {
  fontFamily: string;
};

const SIZES = [12, 14, 16, 18, 24, 32, 48, 72];

export function PreviewSpecimen({ fontFamily }: Props) {
  const stack = `"${fontFamily}", system-ui, sans-serif`;
  return (
    <div className="specimen" style={{ fontFamily: stack }}>
      <div className="specimen__alpha">
        <div className="specimen__row">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
        <div className="specimen__row">abcdefghijklmnopqrstuvwxyz</div>
        <div className="specimen__row">0123456789 &amp; .,:;!?—()[]&#123;&#125;</div>
      </div>
      <div className="specimen__sizes">
        {SIZES.map((s) => (
          <div key={s} className="specimen__line">
            <span className="specimen__size">{s}px</span>
            <span className="specimen__sample" style={{ fontSize: s }}>
              Design that reads at a glance.
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
