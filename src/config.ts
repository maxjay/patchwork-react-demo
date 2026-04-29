import type { OpInput } from '@maxjay/patchwork';

export const INITIAL_CONFIG = {
  appName: 'my-service',
  timeout: 30,
  retries: 3,
  server: {
    host: 'localhost',
    port: 8080,
  },
  features: {
    darkMode: true,
    analytics: false,
  },
};

export const SCHEMA = {
  type: 'object',
  required: ['appName', 'timeout', 'retries', 'server'],
  properties: {
    appName: { type: 'string', minLength: 1, maxLength: 40 },
    timeout: { type: 'integer', minimum: 0, maximum: 300 },
    retries: { type: 'integer', minimum: 0, maximum: 10 },
    server: {
      type: 'object',
      required: ['host', 'port'],
      properties: {
        host: { type: 'string', minLength: 1 },
        port: { type: 'integer', minimum: 1, maximum: 65535 },
        ssl: { type: 'boolean' },
      },
    },
    features: {
      type: 'object',
      properties: {
        darkMode: { type: 'boolean' },
        analytics: { type: 'boolean' },
      },
    },
  },
};

/** What "Ask AI" stages — a deterministic stand-in for an LLM tool-call loop. */
export const COPILOT_SCRIPT: OpInput[] = [
  { kind: 'replace', path: '/timeout',            value: 60 },
  { kind: 'replace', path: '/server/port',        value: 443 },
  { kind: 'add',     path: '/server/ssl',         value: true },
  { kind: 'replace', path: '/features/analytics', value: true },
];
