import { CommitType } from 'oriflame-conventional-changelog-types';
import { AZURE_DEVOPS_PREFIX, COMMIT_FORMAT_PREFIX } from './constants';

export default function checkCommitFormat(
  commit: string,
): null | { scope: string; type: CommitType } {
  const match = commit.match(
    new RegExp(`${AZURE_DEVOPS_PREFIX.source}${COMMIT_FORMAT_PREFIX.source}`, 'u'),
  );

  if (!match) {
    return null;
  }
  const [, , , type, scope] = match;
  return {
    scope: scope || '',
    type: type as CommitType,
  };
}
