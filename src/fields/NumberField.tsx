import { useRef } from 'react';
import type { Engine } from '@maxjay/patchwork';
import { useFieldEditor } from '../hooks/useFieldEditor';
import { DiffChip } from './DiffChip';

export function NumberField({ engine, path, label }: { engine: Engine; path: string; label: string }) {
  const f = useFieldEditor<number>(engine, path);
  const renders = useRef(0);
  renders.current++;

  return (
    <div className={`field${f.diff ? ' changed' : ''}${f.error ? ' invalid' : ''}`}>
      <span className="render-badge" title="React renders">{renders.current}</span>
      <label className="field-key">{label}</label>
      <input
        type="number"
        className="field-input"
        value={f.editing ? f.draft : f.value ?? 0}
        onFocus={f.focus}
        onChange={(e) => f.change(e.target.valueAsNumber)}
        onBlur={f.commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          if (e.key === 'Escape') { f.cancel(); (e.target as HTMLInputElement).blur(); }
        }}
      />
      <DiffChip engine={engine} path={path} diff={f.diff} />
      {f.error && <div className="field-error">{f.error}</div>}
    </div>
  );
}
