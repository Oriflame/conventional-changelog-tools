import { ParserOptions } from '@oriflame/conventional-changelog-types';
import { COMMIT_FORMAT_PREFIX, AZURE_DEVOPS_PREFIX } from './constants';

const options: Partial<ParserOptions> = {
  headerCorrespondence: ['azurePrefix', 'pr', 'type', 'scope', 'message'],
  // Keep in sync with checkCommitFormat
  headerPattern: new RegExp(
    `${AZURE_DEVOPS_PREFIX.source}${COMMIT_FORMAT_PREFIX.source} (.*)$`,
    'u',
  ),
  mergeCorrespondence: ['source'],
  mergePattern: /^Merged? branch '(.*)' into (.*)/u,

  noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'Note'],
  revertCorrespondence: ['header'],
  revertPattern: /^Revert\s"(.*)"?/u,
};

export default options;
