import { useState } from 'react';
import numberFieldSrc from '../fields/NumberField.tsx?raw';
import textFieldSrc from '../fields/TextField.tsx?raw';
import toggleFieldSrc from '../fields/ToggleField.tsx?raw';
import useFieldEditorSrc from '../hooks/useFieldEditor.ts?raw';
import editorSrc from './Editor.tsx?raw';

type Snippet = { id: string; label: string; src: string; note: string };

const SNIPPETS: Snippet[] = [
  {
    id: 'NumberField',
    label: 'NumberField.tsx',
    src: numberFieldSrc,
    note: 'A number input. Drafts on focus, validates via checkValue, commits on Enter/blur. The diff chip and revert link are free.',
  },
  {
    id: 'TextField',
    label: 'TextField.tsx',
    src: textFieldSrc,
    note: 'Same shape as NumberField — the only thing that changes is the input type.',
  },
  {
    id: 'ToggleField',
    label: 'ToggleField.tsx',
    src: toggleFieldSrc,
    note: 'Boolean toggle. add when the key is missing, replace when present — patchwork models both as ops.',
  },
  {
    id: 'useFieldEditor',
    label: 'useFieldEditor.ts',
    src: useFieldEditorSrc,
    note: 'The full draft → validate → commit lifecycle. Patchwork supplies useValue, useDiff, checkValue, propose.',
  },
  {
    id: 'Editor',
    label: 'Editor.tsx',
    src: editorSrc,
    note: 'The whole form. No state, no handlers, no validation — just the schema shape mapped to inputs.',
  },
];

export function SourcePanel() {
  const [active, setActive] = useState(SNIPPETS[0].id);
  const snippet = SNIPPETS.find((s) => s.id === active) ?? SNIPPETS[0];
  const lines = snippet.src.split('\n').length;

  return (
    <section className="card">
      <div className="card-header">
        <h2>Source</h2>
        <span className="meta">{lines} lines</span>
      </div>
      <div className="source-tabs">
        {SNIPPETS.map((s) => (
          <button
            key={s.id}
            className={`source-tab${s.id === active ? ' active' : ''}`}
            onClick={() => setActive(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <pre className="code">{snippet.src}</pre>
      <p className="code-note">{snippet.note}</p>
    </section>
  );
}
