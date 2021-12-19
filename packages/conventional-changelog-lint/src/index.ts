/**
 * @copyright   2020, Oriflame Software
 * @license     https://opensource.org/licenses/MIT
 */

import { GROUPS } from '@oriflame/conventional-changelog-types';

export default {
  rules: {
    'body-max-length': [0],
    'scope-case': [0, 'never', 'start-case'],
    'subject-full-stop': [2, 'always', '.'],
    'subject-case': [2, 'always', 'sentence-case'],
    'type-enum': [2, 'always', GROUPS.flatMap((current) => current.types)],
  },
};
