import { memo, useCallback, useRef, useState } from 'react';
import { Engine, PatchworkError, type CopilotSession, type DiffEntry, type NodeInfo } from '@maxjay/patchwork';
import { useEngineState, useExport, useNode } from '@maxjay/patchwork/react';
import './style.css';

const INITIAL_CONFIG = {
  appName: 'my-service',
  timeout: 30,
  retries: 3,
  server: {
    host: 'localhost',
    port: 8080,
  },
  features: {
    darkMode: true,
    analytics: false,
  },
};

// ─── App ─────────────────────────────────────────────────────────────
//
// App holds the engine but does NOT subscribe to it. Children subscribe to
// only what they need (useNode, useExport, useEngineState) so a single field
// edit re-renders only that field, and the per-path reactivity demo is honest.

export function App() {
  const [engine] = useState(() => new Engine(INITIAL_CONFIG));

  return (
    <div className="app">
      <header>
        <h1>patchwork</h1>
        <span className="subtitle">copilot-native JSON editing engine</span>
      </header>

      <div className="layout">
        <div className="main-col">
          <section className="card">
            <div className="card-header">
              <h2>Editor</h2>
              <Toolbar engine={engine} />
            </div>

            <Node engine={engine} path="" depth={0} />

            <AddField engine={engine} />
            <MoveField engine={engine} />
          </section>
          <CopilotSection engine={engine} />
        </div>

        <div className="side-col">
          <LiveDocument engine={engine} />
          <DiffPanel engine={engine} />
          <RenderTracker />
        </div>
      </div>
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────

function Toolbar({ engine }: { engine: Engine }) {
  return (
    <div className="toolbar">
      <button onClick={() => engine.undo()}>Undo</button>
      <button onClick={() => engine.redo()}>Redo</button>
      <button className="btn-accent" onClick={() => engine.apply()}>Apply</button>
    </div>
  );
}

// ─── Node (recursive, memoized for true per-path reactivity) ──────────────────────────────────

const Node = memo(function Node({
  engine,
  path,
  depth,
}: {
  engine: Engine;
  path: string;
  depth: number;
}) {
  const node = useNode(engine, path);
  const renders = useRef(0);
  renders.current++;

  if (!node) return null;

  if (node.keys) {
    return (
      <div className="node-object">
        {node.key && (
          <div className="group-label" style={{ paddingLeft: (depth - 1) * 20 }}>
            <span className="render-badge" title="React render count">{renders.current}</span>
            {node.key}
          </div>
        )}
        {node.keys.map((k) => (
          <Node key={k} engine={engine} path={`${path}/${k}`} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return <LeafField engine={engine} node={node} depth={depth} renderCount={renders.current} />;
});

function LeafField({
  engine,
  node,
  depth,
  renderCount,
}: {
  engine: Engine;
  node: NodeInfo;
  depth: number;
  renderCount: number;
}) {
  const commit = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      const raw = e.currentTarget.value.trim();
      if (raw === '') return; // empty input — no-op (use × to remove)
      const parsed = parseValue(raw);
      if (Object.is(parsed, node.value)) return;
      try {
        engine.propose({ kind: 'replace', path: node.path, value: parsed });
      } catch {
        // schema-less engine — nothing should throw here, but stay safe
      }
    },
    [engine, node.path, node.value],
  );

  return (
    <div className={`field${node.changed ? ' changed' : ''}`} style={{ paddingLeft: depth * 20 }}>
      <span className="render-badge" title="React render count">{renderCount}</span>
      <span className="field-key">{node.key}</span>
      <span className="field-colon">:</span>
      <input
        // remount on external value changes (undo, copilot approve, reset) so
        // the uncontrolled input always reflects the engine truth.
        key={`${node.path}:${String(node.value)}`}
        className={`field-input type-${node.type}`}
        defaultValue={String(node.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          if (e.key === 'Escape') {
            (e.target as HTMLInputElement).value = String(node.value);
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
      {node.changed && (
        <button className="btn-icon" title="engine.reset(path)" onClick={() => engine.reset(node.path)}>
          &#8617;
        </button>
      )}
      <button
        className="btn-icon btn-remove"
        title="engine.propose(remove)"
        onClick={() => engine.propose({ kind: 'remove', path: node.path })}
      >
        &times;
      </button>
      {node.changed && (
        <span className="diff-badge">
          <span className="val-old">{JSON.stringify(node.base)}</span>
          <span className="arrow">&rarr;</span>
          <span className="val-new">{JSON.stringify(node.value)}</span>
        </span>
      )}
    </div>
  );
}

// ─── AddField ──────────────────────────────────────────────────────────

function AddField({ engine }: { engine: Engine }) {
  const [path, setPath] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!path) return;
    const resolved = path.startsWith('/') ? path : `/${path}`;
    try {
      engine.propose({ kind: 'add', path: resolved, value: parseValue(value) });
      setPath('');
      setValue('');
      setError(null);
    } catch (err) {
      setError(err instanceof PatchworkError ? err.message : 'failed to add');
    }
  };

  return (
    <div className="add-row-wrap">
      <div className="add-row">
        <input
          placeholder="path (e.g. /server/maxConn)"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        />
        <input
          placeholder="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        />
        <button onClick={submit}>+ Add</button>
      </div>
      {error && <div className="row-error">{error}</div>}
    </div>
  );
}

// ─── MoveField ─────────────────────────────────────────────────────────────

function MoveField({ engine }: { engine: Engine }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!from || !to) return;
    try {
      engine.move(from, to);
      setFrom('');
      setTo('');
      setError(null);
    } catch (err) {
      setError(err instanceof PatchworkError ? err.message : 'failed to move');
    }
  };

  return (
    <div className="add-row-wrap">
      <div className="add-row">
        <input placeholder="from (e.g. /retries)" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input
          placeholder="to (e.g. /maxRetries)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        />
        <button onClick={submit}>Move</button>
      </div>
      {error && <div className="row-error">{error}</div>}
    </div>
  );
}

// ─── Copilot ────────────────────────────────────────────────────────────

function CopilotSection({ engine }: { engine: Engine }) {
  useEngineState(engine);
  const session = engine.activeCopilotSession();

  return (
    <section className="card">
      <div className="card-header">
        <h2>Copilot Session</h2>
        {!session && (
          <button className="btn-accent" onClick={() => simulateCopilot(engine)}>
            Simulate Copilot
          </button>
        )}
      </div>

      {!session ? (
        <div className="empty">
          No active copilot session. Click “Simulate Copilot” to see the approve/decline workflow.
        </div>
      ) : (
        <CopilotProposals session={session} />
      )}
    </section>
  );
}

function simulateCopilot(engine: Engine) {
  const session = engine.startCopilot();
  session.propose([
    { kind: 'replace', path: '/timeout', value: 60 },
    { kind: 'replace', path: '/server/port', value: 443 },
    { kind: 'add',     path: '/server/ssl', value: true },
    { kind: 'replace', path: '/features/analytics', value: true },
  ]);
}

function CopilotProposals({ session }: { session: CopilotSession }) {
  const proposals = session.diff();
  if (proposals.length === 0) return <div className="empty">All proposals reviewed.</div>;

  return (
    <div>
      <div className="proposals">
        {proposals.map((op: DiffEntry) => (
          <div key={op.path} className={`proposal${op.conflictsWithUser ? ' conflict' : ''}`}>
            <span className={`op-kind ${op.kind}`}>{op.kind}</span>
            <span className="op-path">{op.path}</span>
            <span className="op-values">
              {op.prev !== undefined && <span className="val-old">{JSON.stringify(op.prev)}</span>}
              {op.prev !== undefined && op.value !== undefined && <span className="arrow">&rarr;</span>}
              {op.value !== undefined && <span className="val-new">{JSON.stringify(op.value)}</span>}
            </span>
            {op.conflictsWithUser && <span className="conflict-badge">conflict</span>}
            <div className="proposal-actions">
              <button className="btn-approve" onClick={() => session.approve(op.path)}>Approve</button>
              <button className="btn-decline" onClick={() => session.decline(op.path)}>Decline</button>
            </div>
          </div>
        ))}
      </div>
      <div className="bulk-actions">
        <button className="btn-approve" onClick={() => session.approveAll()}>Approve All</button>
        <button className="btn-decline" onClick={() => session.declineAll()}>Decline All</button>
        <button onClick={() => session.end()}>End Session</button>
      </div>
    </div>
  );
}

// ─── LiveDocument ─────────────────────────────────────────────────────────

function LiveDocument({ engine }: { engine: Engine }) {
  const doc = useExport(engine);
  return (
    <section className="card">
      <h2>Live Document</h2>
      <pre className="json">{JSON.stringify(doc, null, 2)}</pre>
      <div className="meta">version {engine.version}</div>
    </section>
  );
}

// ─── DiffPanel ─────────────────────────────────────────────────────────────

function DiffPanel({ engine }: { engine: Engine }) {
  useEngineState(engine);
  const ops = engine.diff();

  return (
    <section className="card">
      <h2>User Ops ({ops.length})</h2>
      {ops.length === 0 ? (
        <div className="empty">No pending changes</div>
      ) : (
        <div className="ops-list">
          {ops.map((op) => (
            <div key={op.path} className="op-entry">
              <span className={`op-kind ${op.kind}`}>{op.kind}</span>
              <span className="op-path">{op.path}</span>
              {op.prev !== undefined && <span className="val-old">{JSON.stringify(op.prev)}</span>}
              {op.prev !== undefined && op.value !== undefined && <span className="arrow">&rarr;</span>}
              {op.value !== undefined && <span className="val-new">{JSON.stringify(op.value)}</span>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── RenderTracker (static explainer) ────────────────────────────────────────────────

function RenderTracker() {
  return (
    <section className="card">
      <h2>Per-Path Reactivity</h2>
      <div className="empty" style={{ lineHeight: 1.6 }}>
        Each node shows a <span className="render-badge inline">n</span> badge counting
        its React renders. Edit a single field and watch &mdash; only that field’s
        counter increments. Object nodes only re-render when keys are
        added or removed. All powered by one hook: <code>useNode</code>.
      </div>
    </section>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────

function parseValue(raw: string): unknown {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (raw === 'null') return null;
  const num = Number(raw);
  if (!Number.isNaN(num) && raw !== '') return num;
  return raw;
}
