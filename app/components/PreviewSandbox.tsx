"use client";

import { useState } from "react";

type Props = {
  fontFamily: string;
};

const DEFAULT_TEXT = `The quick brown fox jumps over the lazy dog.

Headlines feel different in 48px.
Body copy lives at 16-18px.
Captions sit at 12-13px.

0 1 2 3 4 5 6 7 8 9
! ? ; : - — • ©`;

export function PreviewSandbox({ fontFamily }: Props) {
  const [text, setText] = useState(DEFAULT_TEXT);
  return (
    <div className="sandbox">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        aria-label="Editable preview text"
      />
      <div
        className="sandbox__render"
        style={{ fontFamily: `"${fontFamily}", system-ui, sans-serif` }}
      >
        {text}
      </div>
    </div>
  );
}
