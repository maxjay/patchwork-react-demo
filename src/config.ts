export const INITIAL_CONFIG = {
  appName: 'my-service',
  timeout: 30,
  retries: 3,
  server: {
    host: 'localhost',
    port: 8080,
    ssl: false,
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
