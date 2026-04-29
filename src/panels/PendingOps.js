import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEngineState } from '@maxjay/patchwork/react';
export function PendingOps({ engine }) {
    useEngineState(engine);
    const ops = engine.diff();
    return (_jsxs("section", { className: "card", children: [_jsxs("h2", { children: ["Pending Ops (", ops.length, ")"] }), ops.length === 0 ? (_jsx("div", { className: "empty", children: "No staged changes \u2014 engine.diff() is empty." })) : (_jsx("div", { className: "ops-list", children: ops.map((op) => (_jsxs("div", { className: "op-entry", children: [_jsx("span", { className: `op-kind ${op.kind}`, children: op.kind }), _jsx("span", { className: "op-path", children: op.path }), op.prev !== undefined && _jsx("span", { className: "val-old", children: JSON.stringify(op.prev) }), op.prev !== undefined && op.value !== undefined && _jsx("span", { className: "arrow", children: "\u2192" }), op.value !== undefined && _jsx("span", { className: "val-new", children: JSON.stringify(op.value) }), _jsx("button", { className: "chip-revert", title: "engine.revert(path)", onClick: () => engine.revert(op.path), children: "\u21BA" })] }, op.path))) }))] }));
}
