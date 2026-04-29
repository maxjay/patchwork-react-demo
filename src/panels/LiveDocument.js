import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useExport } from '@maxjay/patchwork/react';
export function LiveDocument({ engine }) {
    const doc = useExport(engine);
    return (_jsxs("section", { className: "card", children: [_jsx("h2", { children: "Live Document" }), _jsx("pre", { className: "json", children: JSON.stringify(doc, null, 2) }), _jsxs("div", { className: "meta", children: ["engine.export() \u00B7 version ", engine.version] })] }));
}
