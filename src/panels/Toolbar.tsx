import { useEngineState } from '@maxjay/patchwork/react';
import type { Engine } from '@maxjay/patchwork';

export function Toolbar({ engine, onAskAI }: { engine: Engine; onAskAI: () => void }) {
  useEngineState(engine);
  const hasOps = engine.diff().length > 0;
  const sessionOpen = engine.activeCopilotSession() !== null;

  return (
    <div className="toolbar">
      <button onClick={() => engine.undo()}>Undo</button>
      <button onClick={() => engine.redo()}>Redo</button>
      <button disabled={!hasOps || sessionOpen} onClick={() => engine.apply()}>Apply</button>
      <button className="btn-accent" disabled={sessionOpen} onClick={onAskAI}>Ask AI</button>
    </div>
  );
}
