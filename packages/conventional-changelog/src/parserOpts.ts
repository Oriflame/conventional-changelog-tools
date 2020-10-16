import { ParserOptions, COMMIT_FORMAT_PREFIX } from '@oriflame/conventional-changelog-types';

const options: Partial<ParserOptions> = {
  headerCorrespondence: ['azure', 'type', 'scope', 'message'],
  // Keep in sync with checkCommitFormat
  headerPattern: new RegExp(`^(Merged? PR \\d+: )?${COMMIT_FORMAT_PREFIX.source} (.*)$`, 'u'),
  mergeCorrespondence: ['id', 'source'],
  mergePattern: new RegExp(`^Merge pull request #(\\d+) from (.*)`, 'u'),

  noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'Note'],
  revertCorrespondence: ['header'],
  revertPattern: /^Revert\s"(.*)"?/u,
};

export default options;
