import type { KnipConfig } from 'knip';

const config = {
  entry: ['src/server.ts'],
  ignore: ['dist', 'tests', 'coverage'],
  ignoreDependencies: [
    'ts-node',
    'ts-patch',
    'vitest',
    'supertest',
    '@types/supertest',
    '@types/node',
    'wait-on',
    '@total-typescript/ts-reset',
  ],
} satisfies KnipConfig;

export default config;
