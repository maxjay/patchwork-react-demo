import type { Engine } from '@maxjay/patchwork';

export function DiffChip({
  engine,
  path,
  diff,
}: {
  engine: Engine;
  path: string;
  diff: { base: unknown; current: unknown } | null;
}) {
  if (!diff) return null;
  return (
    <span className="diff-chip">
      <span className="val-old">{JSON.stringify(diff.base)}</span>
      <span className="arrow">&rarr;</span>
      <span className="val-new">{JSON.stringify(diff.current)}</span>
      <button
        type="button"
        className="chip-revert"
        title="engine.revert(path)"
        onClick={(e) => { e.stopPropagation(); engine.revert(path); }}
      >
        ↺
      </button>
    </span>
  );
}
