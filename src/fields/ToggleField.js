import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { useValue, useDiff } from '@maxjay/patchwork/react';
import { DiffChip } from './DiffChip';
export function ToggleField({ engine, path, label }) {
    const value = useValue(engine, path);
    const diff = useDiff(engine, path);
    const renders = useRef(0);
    renders.current++;
    const checked = value === true;
    const onToggle = () => {
        if (value === undefined) {
            engine.propose({ kind: 'add', path, value: true });
        }
        else {
            engine.propose({ kind: 'replace', path, value: !checked });
        }
    };
    return (_jsxs("div", { className: `field${diff ? ' changed' : ''}`, children: [_jsx("span", { className: "render-badge", title: "React renders", children: renders.current }), _jsx("label", { className: "field-key", children: label }), _jsx("button", { type: "button", className: `toggle${checked ? ' on' : ''}`, role: "switch", "aria-checked": checked, onClick: onToggle, children: _jsx("span", { className: "toggle-knob" }) }), _jsx(DiffChip, { engine: engine, path: path, diff: diff })] }));
}
