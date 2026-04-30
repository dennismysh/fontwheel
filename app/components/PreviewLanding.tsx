"use client";

type Props = {
  fontFamily: string;
};

export function PreviewLanding({ fontFamily }: Props) {
  return (
    <div
      className="preview-canvas"
      style={{ fontFamily: `"${fontFamily}", system-ui, sans-serif` }}
    >
      <h1>Design that reads at a glance.</h1>
      <p className="lead">
        Type sets the tone before a single word lands. Spin the wheel and watch
        the personality of the page flip in an instant.
      </p>
      <p>
        Every typeface carries assumptions: a serif feels editorial, a slab
        sells confidence, a script whispers intimacy. The fastest way to feel
        the difference is to drop the same paragraph into each and read it
        aloud. <code>fontFamily: {fontFamily}</code>
      </p>
      <ul>
        <li>Headings — does it have presence at large sizes?</li>
        <li>Body — does it stay legible at 16px?</li>
        <li>UI — do numbers and labels feel balanced?</li>
      </ul>
      <button className="cta">Get started</button>
      <pre>{`function greet(name) {
  return \`Hello, \${name}!\`;
}`}</pre>
    </div>
  );
}
