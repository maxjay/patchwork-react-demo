import { useState } from 'react';
import { useValue, useDiff } from '@maxjay/patchwork/react';
import { ValidationError, type Engine } from '@maxjay/patchwork';

export function useFieldEditor<T>(engine: Engine, path: string) {
  const value = useValue<T>(engine, path);
  const diff = useDiff(engine, path);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<T>(value);
  const [error, setError] = useState<string | null>(null);

  if (!editing && !Object.is(draft, value)) setDraft(value);

  const focus = () => {
    setDraft(value);
    setEditing(true);
    setError(null);
  };

  const change = (next: T) => {
    setDraft(next);
    const err = engine.checkValue(path, next);
    setError(err ? err.errors[0]?.message ?? null : null);
  };

  const commit = (): boolean => {
    if (error) return false;
    if (!Object.is(draft, value)) {
      try {
        engine.propose({ kind: 'replace', path, value: draft });
      } catch (e) {
        if (e instanceof ValidationError) {
          setError(e.errors[0]?.message ?? 'invalid');
          return false;
        }
        throw e;
      }
    }
    setEditing(false);
    return true;
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
    setError(null);
  };

  return { value, diff, draft, error, editing, focus, change, commit, cancel };
}
