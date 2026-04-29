import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { useEngineState, useValue, useDiff } from '@maxjay/patchwork/react';
import { Engine } from '@maxjay/patchwork';
import './style.css';
const INITIAL_CONFIG = {
    appName: 'my-service',
    timeout: 30,
    retries: 3,
    server: { host: 'localhost', port: 8080 },
    features: { darkMode: true, analytics: false },
};
const SCHEMA = {
    type: 'object',
    required: ['appName', 'timeout', 'retries', 'server'],
    properties: {
        appName: { type: 'string', minLength: 1 },
        timeout: { type: 'integer', minimum: 0, maximum: 300 },
        retries: { type: 'integer', minimum: 0, maximum: 10 },
        server: {
            type: 'object',
            required: ['host', 'port'],
            properties: {
                host: { type: 'string', minLength: 1 },
                port: { type: 'integer', minimum: 1, maximum: 65535 },
            },
        },
        features: {
            type: 'object',
            properties: {
                darkMode: { type: 'boolean' },
                analytics: { type: 'boolean' },
            },
        },
    },
};
// ── App ───────────────────────────────────────────────────────────────────────
// App creates the engine but does NOT subscribe — each child subscribes only
// to what it needs, giving true per-path reactivity.
export function App() {
    const [engine] = useState(() => new Engine(INITIAL_CONFIG, SCHEMA));
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { children: [_jsx("h1", { children: "patchwork" }), _jsx("span", { className: "subtitle", children: "copilot-native JSON editing engine" })] }), _jsxs("div", { className: "layout", children: [_jsxs("div", { className: "main-col", children: [_jsx(DocumentSection, { engine: engine }), _jsx(ActionsSection, { engine: engine }), _jsx(CopilotSection, { engine: engine })] }), _jsx("div", { className: "side-col", children: _jsx(CodePanel, {}) })] })] }));
}
// ── Document ──────────────────────────────────────────────────────────────────
function DocumentSection({ engine }) {
    return (_jsxs("section", { className: "card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h2", { children: "Document" }), _jsxs("div", { className: "toolbar", children: [_jsx("button", { onClick: () => engine.undo(), children: "Undo" }), _jsx("button", { onClick: () => engine.redo(), children: "Redo" }), _jsx("button", { className: "btn-accent", onClick: () => engine.apply(), children: "Apply" })] })] }), _jsx(Field, { engine: engine, path: "/appName" }), _jsx(Field, { engine: engine, path: "/timeout" }), _jsx(Field, { engine: engine, path: "/retries" }), _jsx("div", { className: "group-label", children: "server" }), _jsx(Field, { engine: engine, path: "/server/host", depth: 1 }), _jsx(Field, { engine: engine, path: "/server/port", depth: 1 }), _jsx("div", { className: "group-label", children: "features" }), _jsx(Field, { engine: engine, path: "/features/darkMode", depth: 1 }), _jsx(Field, { engine: engine, path: "/features/analytics", depth: 1 })] }));
}
// ── Field — the key primitive ─────────────────────────────────────────────────
function Field({ engine, path, depth = 0 }) {
    const value = useValue(engine, path);
    const diff = useDiff(engine, path);
    const renders = useRef(0);
    renders.current++;
    return (_jsxs("div", { className: `field${diff ? ' changed' : ''}`, style: { paddingLeft: depth * 20 }, children: [_jsx("span", { className: "render-badge", title: "React renders", children: renders.current }), _jsx("span", { className: "field-key", children: path.split('/').pop() }), _jsx("span", { className: "field-colon", children: ":" }), _jsx("span", { className: `field-value type-${valueType(value)}`, children: JSON.stringify(value) }), diff && (_jsxs("span", { className: "diff-badge", children: [_jsx("span", { className: "val-old", children: JSON.stringify(diff.base) }), _jsx("span", { className: "arrow", children: "\u2192" }), _jsx("span", { className: "val-new", children: JSON.stringify(diff.current) })] }))] }));
}
// ── Actions ───────────────────────────────────────────────────────────────────
function ActionsSection({ engine }) {
    const actions = [
        { label: '/server/port → 443', op: { kind: 'replace', path: '/server/port', value: 443 } },
        { label: '/server/host → 0.0.0.0', op: { kind: 'replace', path: '/server/host', value: '0.0.0.0' } },
        { label: '/timeout → 60', op: { kind: 'replace', path: '/timeout', value: 60 } },
        { label: '/features/analytics → true', op: { kind: 'replace', path: '/features/analytics', value: true } },
        { label: '/server/ssl → true (add)', op: { kind: 'add', path: '/server/ssl', value: true } },
        { label: '/retries (remove)', op: { kind: 'remove', path: '/retries' } },
    ];
    return (_jsxs("section", { className: "card", children: [_jsx("h2", { children: "User Actions" }), _jsx("div", { className: "ops-list", children: actions.map(({ label, op }) => (_jsxs("div", { className: "op-entry", style: { justifyContent: 'space-between' }, children: [_jsx("span", { className: `op-kind ${op.kind}`, children: op.kind }), _jsx("span", { className: "op-path", style: { flex: 1, marginLeft: 6 }, children: label }), _jsx("button", { onClick: () => { try {
                                engine.propose(op);
                            }
                            catch { } }, children: "Run" })] }, label))) })] }));
}
// ── Copilot ───────────────────────────────────────────────────────────────────
function CopilotSection({ engine }) {
    useEngineState(engine);
    const session = engine.activeCopilotSession();
    return (_jsxs("section", { className: "card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h2", { children: "Copilot Session" }), !session && (_jsx("button", { className: "btn-accent", onClick: () => simulateCopilot(engine), children: "Simulate Copilot" }))] }), !session ? (_jsx("div", { className: "empty", children: "No active session. Click \"Simulate Copilot\" to see the propose / approve / decline workflow." })) : (_jsx(CopilotProposals, { session: session }))] }));
}
function simulateCopilot(engine) {
    const session = engine.startCopilot();
    session.propose([
        { kind: 'replace', path: '/timeout', value: 60 },
        { kind: 'replace', path: '/server/port', value: 443 },
        { kind: 'add', path: '/server/ssl', value: true },
        { kind: 'replace', path: '/features/analytics', value: true },
    ]);
}
function CopilotProposals({ session }) {
    const proposals = session.diff();
    if (proposals.length === 0)
        return _jsx("div", { className: "empty", children: "All proposals reviewed." });
    return (_jsxs("div", { children: [_jsx("div", { className: "proposals", children: proposals.map((op) => (_jsxs("div", { className: `proposal${op.conflictsWithUser ? ' conflict' : ''}`, children: [_jsx("span", { className: `op-kind ${op.kind}`, children: op.kind }), _jsx("span", { className: "op-path", children: op.path }), _jsxs("span", { className: "op-values", children: [op.prev !== undefined && _jsx("span", { className: "val-old", children: JSON.stringify(op.prev) }), op.prev !== undefined && op.value !== undefined && _jsx("span", { className: "arrow", children: "\u2192" }), op.value !== undefined && _jsx("span", { className: "val-new", children: JSON.stringify(op.value) })] }), op.conflictsWithUser && _jsx("span", { className: "conflict-badge", children: "conflict" }), _jsxs("div", { className: "proposal-actions", children: [_jsx("button", { className: "btn-approve", onClick: () => session.approve(op.path), children: "Approve" }), _jsx("button", { className: "btn-decline", onClick: () => session.decline(op.path), children: "Decline" })] })] }, op.path))) }), _jsxs("div", { className: "bulk-actions", children: [_jsx("button", { className: "btn-approve", onClick: () => session.approveAll(), children: "Approve All" }), _jsx("button", { className: "btn-decline", onClick: () => session.declineAll(), children: "Decline All" }), _jsx("button", { onClick: () => session.end(), children: "End Session" })] })] }));
}
// ── Code Panel ────────────────────────────────────────────────────────────────
function CodePanel() {
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "card", children: [_jsx("h2", { children: "Read State" }), _jsx("pre", { className: "code", children: `const value = useValue(engine, path)
const diff  = useDiff(engine, path)
// diff → { base, current } | null` }), _jsxs("p", { className: "code-note", children: ["Edit a single field \u2014 only that field's badge increments. Each ", _jsx("code", { children: "Field" }), " subscribes independently."] })] }), _jsxs("section", { className: "card", children: [_jsx("h2", { children: "Make Changes" }), _jsx("pre", { className: "code", children: `engine.propose({ kind: 'replace',
  path: '/server/port', value: 443 })

engine.undo()   // full history — zero impl
engine.redo()
engine.apply()  // fold edits into base` })] }), _jsxs("section", { className: "card", children: [_jsx("h2", { children: "Copilot Workflow" }), _jsx("pre", { className: "code", children: `const session = engine.startCopilot()
session.propose([
  { kind: 'replace', path: '/server/port',
    value: 443 },
])

session.approve('/server/port') // → undo stack
session.decline('/server/ssl')  // dropped
session.approveAll()` })] }), _jsxs("section", { className: "card", children: [_jsx("h2", { children: "What You Wrote" }), _jsxs("div", { className: "stat-grid", children: [_jsx(StatRow, { label: "Field (value + diff + badge)", value: "14 lines" }), _jsx(StatRow, { label: "Copilot UI", value: "22 lines" }), _jsx(StatRow, { label: "Actions + layout", value: "~30 lines" }), _jsx(StatRow, { label: "Total", value: "~66 lines", bold: true })] }), _jsx("div", { className: "stat-divider" }), _jsx("h2", { children: "What Patchwork Handles" }), _jsxs("div", { className: "stat-grid", children: [_jsx(StatRow, { label: "State management", value: "0 lines", zero: true }), _jsx(StatRow, { label: "Undo / redo", value: "0 lines", zero: true }), _jsx(StatRow, { label: "Diff tracking", value: "0 lines", zero: true }), _jsx(StatRow, { label: "Per-path reactivity", value: "0 lines", zero: true }), _jsx(StatRow, { label: "Conflict detection", value: "0 lines", zero: true }), _jsx(StatRow, { label: "Schema validation", value: "0 lines", zero: true })] })] })] }));
}
function StatRow({ label, value, bold, zero }) {
    return (_jsxs("div", { className: `stat-row${bold ? ' stat-bold' : ''}`, children: [_jsx("span", { className: "stat-label", children: label }), _jsx("span", { className: `stat-val${zero ? ' stat-zero' : ''}`, children: value })] }));
}
// ── Helpers ───────────────────────────────────────────────────────────────────
function valueType(v) {
    if (v === null)
        return 'null';
    return typeof v;
}
