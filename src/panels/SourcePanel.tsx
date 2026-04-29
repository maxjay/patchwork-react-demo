import { useState } from 'react';
import { useEngineState } from '@maxjay/patchwork/react';
import type { Engine } from '@maxjay/patchwork';
import numberFieldSrc from '../fields/NumberField.tsx?raw';
import textFieldSrc from '../fields/TextField.tsx?raw';
import toggleFieldSrc from '../fields/ToggleField.tsx?raw';
import useFieldEditorSrc from '../hooks/useFieldEditor.ts?raw';
import editorSrc from './Editor.tsx?raw';
import copilotSrc from './Copilot.tsx?raw';

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
  {
    id: 'Copilot',
    label: 'Copilot.tsx',
    src: copilotSrc,
    note: 'AI proposes, user reviews. session.diff() includes a conflictsWithUser flag for paths the user has also edited.',
  },
];

export function SourcePanel({ engine }: { engine: Engine }) {
  useEngineState(engine);
  const sessionOpen = engine.activeCopilotSession() !== null;

  const [pinned, setPinned] = useState<string | null>(null);
  const auto = sessionOpen ? 'Copilot' : 'NumberField';
  const activeId = pinned ?? auto;
  const snippet = SNIPPETS.find((s) => s.id === activeId) ?? SNIPPETS[0];
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
            className={`source-tab${s.id === activeId ? ' active' : ''}`}
            onClick={() => setPinned(s.id === activeId ? null : s.id)}
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
