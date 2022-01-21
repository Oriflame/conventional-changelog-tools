import type { SemVer } from 'semver';
import semver from 'semver';

export function extractVersion(versionLike: SemVer | string | null) {
  let lastPath: SemVer | string | null | undefined = versionLike;
  if (typeof versionLike === 'string') {
    lastPath = versionLike.split('@').at(-1);
  }

  return semver.parse(lastPath, { includePrerelease: true });
}

export function extractVersionFormatted(versionLike: string) {
  return extractVersion(versionLike)?.format();
}
