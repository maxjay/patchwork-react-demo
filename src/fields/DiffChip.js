import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DiffChip({ engine, path, diff, }) {
    if (!diff)
        return null;
    return (_jsxs("span", { className: "diff-chip", children: [_jsx("span", { className: "val-old", children: JSON.stringify(diff.base) }), _jsx("span", { className: "arrow", children: "\u2192" }), _jsx("span", { className: "val-new", children: JSON.stringify(diff.current) }), _jsx("button", { type: "button", className: "chip-revert", title: "engine.revert(path)", onClick: (e) => { e.stopPropagation(); engine.revert(path); }, children: "\u21BA" })] }));
}
