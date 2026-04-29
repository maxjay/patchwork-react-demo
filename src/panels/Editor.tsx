import type { Engine } from '@maxjay/patchwork';
import { TextField } from '../fields/TextField';
import { NumberField } from '../fields/NumberField';
import { ToggleField } from '../fields/ToggleField';

export function Editor({ engine }: { engine: Engine }) {
  return (
    <div className="editor-form">
      <div className="group-label">app</div>
      <TextField   engine={engine} path="/appName"           label="appName" />
      <NumberField engine={engine} path="/timeout"           label="timeout" />
      <NumberField engine={engine} path="/retries"           label="retries" />

      <div className="group-label">server</div>
      <TextField   engine={engine} path="/server/host"       label="host" />
      <NumberField engine={engine} path="/server/port"       label="port" />
      <ToggleField engine={engine} path="/server/ssl"        label="ssl" />

      <div className="group-label">features</div>
      <ToggleField engine={engine} path="/features/darkMode"  label="darkMode" />
      <ToggleField engine={engine} path="/features/analytics" label="analytics" />
    </div>
  );
}
