import { Commit, ParserOptions, SemverLevel } from '@oriflame/conventional-changelog-types';

export interface BumpOptions {
  parserOpts: Partial<ParserOptions>;
  whatBump(commits: Commit[]): { level: SemverLevel; reason: string };
}
