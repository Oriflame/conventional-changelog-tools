import { COMMIT_FORMAT_PREFIX, AZURE_DEVOPS_PREFIX } from './constants';
import { ParserOptions } from './types';

const options: Partial<ParserOptions> = {
  headerCorrespondence: ['azurePrefix', 'pr', 'type', 'scope', 'message'],
  // Keep in sync with checkCommitFormat
  headerPattern: new RegExp(
    `${AZURE_DEVOPS_PREFIX.source}${COMMIT_FORMAT_PREFIX.source} (.*)$`,
    'u',
  ),
  // mergeCorrespondence: ['pr', 'type', 'scope', 'message'],
  mergeCorrespondence: ['pr', 'source'],
  // mergePattern: new RegExp(`^Merged? PR (\\d+): ${COMMIT_FORMAT_PREFIX.source} (.*)$`, 'u'),
  mergePattern: /^Merged? pull request #(\d+) from (.*)/u,

  noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'Note'],
  revertCorrespondence: ['header', 'hash'],
  revertPattern: /^Revert\s"([\s\S]*)"\s*Reverted commit `(\w*)`/u,
};

export default options;
