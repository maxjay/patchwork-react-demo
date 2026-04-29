import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEngineState } from '@maxjay/patchwork/react';
import numberFieldSrc from '../fields/NumberField.tsx?raw';
import textFieldSrc from '../fields/TextField.tsx?raw';
import toggleFieldSrc from '../fields/ToggleField.tsx?raw';
import useFieldEditorSrc from '../hooks/useFieldEditor.ts?raw';
import editorSrc from './Editor.tsx?raw';
import copilotSrc from './Copilot.tsx?raw';
const SNIPPETS = [
    {
        id: 'NumberField',
        label: 'NumberField.tsx',
        src: numberFieldSrc,
        note: 'A number input. Drafts on focus, validates via checkValue, commits on Enter/blur. The diff chip and revert link are free.',
    },
    {
        id: 'TextField',
        label: 'TextField.tsx',
        src: textFieldSrc,
        note: 'Same shape as NumberField — the only thing that changes is the input type.',
    },
    {
        id: 'ToggleField',
        label: 'ToggleField.tsx',
        src: toggleFieldSrc,
        note: 'Boolean toggle. add when the key is missing, replace when present — patchwork models both as ops.',
    },
    {
        id: 'useFieldEditor',
        label: 'useFieldEditor.ts',
        src: useFieldEditorSrc,
        note: 'The full draft → validate → commit lifecycle. Patchwork supplies useValue, useDiff, checkValue, propose.',
    },
    {
        id: 'Editor',
        label: 'Editor.tsx',
        src: editorSrc,
        note: 'The whole form. No state, no handlers, no validation — just the schema shape mapped to inputs.',
    },
    {
        id: 'Copilot',
        label: 'Copilot.tsx',
        src: copilotSrc,
        note: 'AI proposes, user reviews. session.diff() includes a conflictsWithUser flag for paths the user has also edited.',
    },
];
export function SourcePanel({ engine }) {
    useEngineState(engine);
    const sessionOpen = engine.activeCopilotSession() !== null;
    const [pinned, setPinned] = useState(null);
    const auto = sessionOpen ? 'Copilot' : 'NumberField';
    const activeId = pinned ?? auto;
    const snippet = SNIPPETS.find((s) => s.id === activeId) ?? SNIPPETS[0];
    const lines = snippet.src.split('\n').length;
    return (_jsxs("section", { className: "card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h2", { children: "Source" }), _jsxs("span", { className: "meta", children: [lines, " lines"] })] }), _jsx("div", { className: "source-tabs", children: SNIPPETS.map((s) => (_jsx("button", { className: `source-tab${s.id === activeId ? ' active' : ''}`, onClick: () => setPinned(s.id === activeId ? null : s.id), children: s.label }, s.id))) }), _jsx("pre", { className: "code", children: snippet.src }), _jsx("p", { className: "code-note", children: snippet.note })] }));
}
