import { useState } from 'react';
import { Engine } from '@maxjay/patchwork';
import { INITIAL_CONFIG, SCHEMA, COPILOT_SCRIPT } from './config';
import { Toolbar } from './panels/Toolbar';
import { Editor } from './panels/Editor';
import { LiveDocument } from './panels/LiveDocument';
import { PendingOps } from './panels/PendingOps';
import { Copilot } from './panels/Copilot';
import { SourcePanel } from './panels/SourcePanel';
import './style.css';

export function App() {
  const [engine] = useState(() => new Engine(INITIAL_CONFIG, SCHEMA));

  const handleAskAI = () => {
    const session = engine.startCopilot();
    session.propose(COPILOT_SCRIPT);
  };

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
              <h2>Document</h2>
              <Toolbar engine={engine} onAskAI={handleAskAI} />
            </div>
            <Editor engine={engine} />
          </section>
          <Copilot engine={engine} />
        </div>

        <div className="side-col">
          <LiveDocument engine={engine} />
          <PendingOps engine={engine} />
          <SourcePanel engine={engine} />
        </div>
      </div>
    </div>
  );
}
