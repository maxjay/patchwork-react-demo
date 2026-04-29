import { useEngineState } from '@maxjay/patchwork/react';
import type { Engine } from '@maxjay/patchwork';

export function PendingOps({ engine }: { engine: Engine }) {
  useEngineState(engine);
  const ops = engine.diff();

  return (
    <section className="card">
      <h2>Pending Ops ({ops.length})</h2>
      {ops.length === 0 ? (
        <div className="empty">No staged changes &mdash; engine.diff() is empty.</div>
      ) : (
        <div className="ops-list">
          {ops.map((op) => (
            <div key={op.path} className="op-entry">
              <span className={`op-kind ${op.kind}`}>{op.kind}</span>
              <span className="op-path">{op.path}</span>
              {op.prev !== undefined && <span className="val-old">{JSON.stringify(op.prev)}</span>}
              {op.prev !== undefined && op.value !== undefined && <span className="arrow">&rarr;</span>}
              {op.value !== undefined && <span className="val-new">{JSON.stringify(op.value)}</span>}
              <button
                className="chip-revert"
                title="engine.revert(path)"
                onClick={() => engine.revert(op.path)}
              >
                ↺
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
