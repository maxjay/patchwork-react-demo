import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { children: [_jsx("h1", { children: "patchwork" }), _jsx("span", { className: "subtitle", children: "copilot-native JSON editing engine" })] }), _jsxs("div", { className: "layout", children: [_jsxs("div", { className: "main-col", children: [_jsxs("section", { className: "card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h2", { children: "Document" }), _jsx(Toolbar, { engine: engine, onAskAI: handleAskAI })] }), _jsx(Editor, { engine: engine })] }), _jsx(Copilot, { engine: engine })] }), _jsxs("div", { className: "side-col", children: [_jsx(LiveDocument, { engine: engine }), _jsx(PendingOps, { engine: engine }), _jsx(SourcePanel, { engine: engine })] })] })] }));
}
