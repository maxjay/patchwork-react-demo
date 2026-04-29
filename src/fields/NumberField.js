import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { useFieldEditor } from '../hooks/useFieldEditor';
import { DiffChip } from './DiffChip';
export function NumberField({ engine, path, label }) {
    const f = useFieldEditor(engine, path);
    const renders = useRef(0);
    renders.current++;
    return (_jsxs("div", { className: `field${f.diff ? ' changed' : ''}${f.error ? ' invalid' : ''}`, children: [_jsx("span", { className: "render-badge", title: "React renders", children: renders.current }), _jsx("label", { className: "field-key", children: label }), _jsx("input", { type: "number", className: "field-input", value: f.editing ? f.draft : f.value ?? 0, onFocus: f.focus, onChange: (e) => f.change(e.target.valueAsNumber), onBlur: f.commit, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        e.target.blur();
                    if (e.key === 'Escape') {
                        f.cancel();
                        e.target.blur();
                    }
                } }), _jsx(DiffChip, { engine: engine, path: path, diff: f.diff }), f.error && _jsx("div", { className: "field-error", children: f.error })] }));
}
