import { useExport } from '@maxjay/patchwork/react';
import type { Engine } from '@maxjay/patchwork';

export function LiveDocument({ engine }: { engine: Engine }) {
  const doc = useExport(engine);
  return (
    <section className="card">
      <h2>Live Document</h2>
      <pre className="json">{JSON.stringify(doc, null, 2)}</pre>
      <div className="meta">engine.export() &middot; version {engine.version}</div>
    </section>
  );
}
