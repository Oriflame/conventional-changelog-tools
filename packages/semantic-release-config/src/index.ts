/**
 * @copyright   2020, Oriflame Software
 * @license     https://opensource.org/licenses/MIT
 */
/* eslint-disable no-template-curly-in-string */

import { SemanticReleaseConfig } from './types';

const config: SemanticReleaseConfig = {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        config: '@oriflame/conventional-changelog',
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        config: '@oriflame/conventional-changelog',
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

export = config;
