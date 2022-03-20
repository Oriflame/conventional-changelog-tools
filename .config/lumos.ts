import type { LumosConfig } from '@oriflame/lumos';

const config: LumosConfig = {
  module: '@oriflame/lumos',
  drivers: [
    'babel',
    'eslint',
    'jest',
    'prettier',
    ['typescript', { declarationOnly: true, buildFolder: 'dts' }],
  ],
  settings: {
    node: true,
    library: true,
    skipLibCheck: true,
    env: {
      targets: {
        node: '12.14',
        esmodules: false,
      },
    },
    esm: false,
  },
};

export default config;
