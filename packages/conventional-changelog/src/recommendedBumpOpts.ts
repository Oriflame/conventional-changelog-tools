import { SemverLevel, Group } from '@oriflame/conventional-changelog-types';

import getTypeGroup from './getTypeGroup';
import parserOpts from './parserOpts';
import { BumpOptions } from './types';

const options: BumpOptions = {
  parserOpts,

  whatBump(commits) {
    let level: SemverLevel = null;
    let breakings = 0;
    let features = 0;
    let fixes = 0;

    commits.forEach((commit) => {
      let group: Group;

      try {
        group = getTypeGroup(commit.type);
      } catch {
        return;
      }

      if (group.bump === 'major') {
        breakings += 1;
        level = 0;
      } else if (group.bump === 'minor') {
        features += 1;
        if (level === null || level === 2) {
          level = 1;
        }
      } else if (group.bump === 'patch') {
        fixes += 1;
        if (level === null) {
          level = 2;
        }
      }
    });

    return {
      level,
      reason: `There are ${breakings} breaking changes and ${features} new features, also ${fixes} fixes`,
    };
  },
};

export default options;
