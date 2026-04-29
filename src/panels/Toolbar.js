import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEngineState } from '@maxjay/patchwork/react';
export function Toolbar({ engine, onAskAI }) {
    useEngineState(engine);
    const hasOps = engine.diff().length > 0;
    const sessionOpen = engine.activeCopilotSession() !== null;
    return (_jsxs("div", { className: "toolbar", children: [_jsx("button", { onClick: () => engine.undo(), children: "Undo" }), _jsx("button", { onClick: () => engine.redo(), children: "Redo" }), _jsx("button", { disabled: !hasOps || sessionOpen, onClick: () => engine.apply(), children: "Apply" }), _jsx("button", { className: "btn-accent", disabled: sessionOpen, onClick: onAskAI, children: "Ask AI" })] }));
}
