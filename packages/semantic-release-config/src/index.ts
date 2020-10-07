/* eslint-disable no-template-curly-in-string */

import { SemanticReleaseConfig } from './types';

const config: SemanticReleaseConfig = {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        config: 'conventional-changelog-ori',
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        config: 'conventional-changelog-ori',
      },
    ],
    '@semantic-release/changelog',
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        message: 'ci(release): V${nextRelease.version} [ci skip].\n\n${nextRelease.notes}',
      },
    ],
  ],
};

export default config;
