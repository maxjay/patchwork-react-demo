import { useEngineState } from '@maxjay/patchwork/react';
import type { Engine, DiffEntry } from '@maxjay/patchwork';

export function Copilot({ engine }: { engine: Engine }) {
  useEngineState(engine);
  const session = engine.activeCopilotSession();
  if (!session) return null;

  const proposals = session.diff();

  return (
    <section className="card copilot-card">
      <div className="card-header">
        <h2>Copilot Session</h2>
        <button onClick={() => session.end()}>End Session</button>
      </div>

      {proposals.length === 0 ? (
        <div className="empty">All proposals reviewed. End session to close.</div>
      ) : (
        <>
          <div className="proposals">
            {proposals.map((p: DiffEntry) => (
              <div key={p.path} className={`proposal${p.conflictsWithUser ? ' conflict' : ''}`}>
                <span className={`op-kind ${p.kind}`}>{p.kind}</span>
                <span className="op-path">{p.path}</span>
                <span className="op-values">
                  {p.prev !== undefined && <span className="val-old">{JSON.stringify(p.prev)}</span>}
                  {p.prev !== undefined && p.value !== undefined && <span className="arrow">&rarr;</span>}
                  {p.value !== undefined && <span className="val-new">{JSON.stringify(p.value)}</span>}
                </span>
                {p.conflictsWithUser && <span className="conflict-badge">conflict</span>}
                <div className="proposal-actions">
                  <button className="btn-approve" onClick={() => session.approve(p.path)}>Approve</button>
                  <button className="btn-decline" onClick={() => session.decline(p.path)}>Decline</button>
                </div>
              </div>
            ))}
          </div>
          <div className="bulk-actions">
            <button className="btn-approve" onClick={() => session.approveAll()}>Approve All</button>
            <button className="btn-decline" onClick={() => session.declineAll()}>Decline All</button>
          </div>
        </>
      )}
    </section>
  );
}
