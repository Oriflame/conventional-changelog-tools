/**
 * @copyright   2020, Oriflame Software
 * @license     https://opensource.org/licenses/MIT
 */

import { COMMIT_FORMAT_PREFIX } from '@oriflame/conventional-changelog-types';

import checkCommitFormat from './checkCommitFormat';
import conventionalChangelog from './conventionalChangelog';
import getTypeGroup from './getTypeGroup';
import parserOpts from './parserOpts';
import recommendedBumpOpts from './recommendedBumpOpts';
import writerOpts from './writerOpts';

export * from './types';
export { checkCommitFormat, getTypeGroup, COMMIT_FORMAT_PREFIX };

export const config = Promise.resolve({
  conventionalChangelog,
  parserOpts,
  recommendedBumpOpts,
  writerOpts,
});
