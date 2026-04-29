import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TextField } from '../fields/TextField';
import { NumberField } from '../fields/NumberField';
import { ToggleField } from '../fields/ToggleField';
export function Editor({ engine }) {
    return (_jsxs("div", { className: "editor-form", children: [_jsx("div", { className: "group-label", children: "app" }), _jsx(TextField, { engine: engine, path: "/appName", label: "appName" }), _jsx(NumberField, { engine: engine, path: "/timeout", label: "timeout" }), _jsx(NumberField, { engine: engine, path: "/retries", label: "retries" }), _jsx("div", { className: "group-label", children: "server" }), _jsx(TextField, { engine: engine, path: "/server/host", label: "host" }), _jsx(NumberField, { engine: engine, path: "/server/port", label: "port" }), _jsx(ToggleField, { engine: engine, path: "/server/ssl", label: "ssl" }), _jsx("div", { className: "group-label", children: "features" }), _jsx(ToggleField, { engine: engine, path: "/features/darkMode", label: "darkMode" }), _jsx(ToggleField, { engine: engine, path: "/features/analytics", label: "analytics" })] }));
}
