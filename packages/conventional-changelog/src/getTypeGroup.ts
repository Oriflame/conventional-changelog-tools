import type { CommitType, Group } from '@oriflame/conventional-changelog-types';
import { GROUPS } from '@oriflame/conventional-changelog-types';

export default function getTypeGroup(type: CommitType): Group {
  const group = GROUPS.find((g) => g.types.includes(type));

  if (!group) {
    throw new Error(`Cannot find group for type "${type}".`);
  }

  return group;
}
