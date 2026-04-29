import { useRef } from 'react';
import type { Engine } from '@maxjay/patchwork';
import { useValue, useDiff } from '@maxjay/patchwork/react';
import { DiffChip } from './DiffChip';

export function ToggleField({ engine, path, label }: { engine: Engine; path: string; label: string }) {
  const value = useValue<boolean | undefined>(engine, path);
  const diff = useDiff(engine, path);
  const renders = useRef(0);
  renders.current++;

  const checked = value === true;

  const onToggle = () => {
    if (value === undefined) {
      engine.propose({ kind: 'add', path, value: true });
    } else {
      engine.propose({ kind: 'replace', path, value: !checked });
    }
  };

  return (
    <div className={`field${diff ? ' changed' : ''}`}>
      <span className="render-badge" title="React renders">{renders.current}</span>
      <label className="field-key">{label}</label>
      <button
        type="button"
        className={`toggle${checked ? ' on' : ''}`}
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
      >
        <span className="toggle-knob" />
      </button>
      <DiffChip engine={engine} path={path} diff={diff} />
    </div>
  );
}
