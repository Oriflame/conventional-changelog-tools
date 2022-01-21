/* eslint-disable class-methods-use-this -- needed */
import type { GlobalOptions } from '@boost/cli';
import { Config, Command, Arg } from '@boost/cli';
import { gt } from 'semver';

import { extractVersionFormatted } from '../utils';

type VersionParams = [string];

@Config('greaterVersion', 'Determine greater version', {
  aliases: ['gte'],
  allowVariadicParams: true,
})
export default class GreaterVersionCommand extends Command<GlobalOptions, VersionParams> {
  @Arg.Params<VersionParams>({
    description: 'First version',
    label: 'First version',
    type: 'string',
    required: true,
  })
  run(firstVersion: string, ...otherVersions: string[]) {
    return otherVersions.reduce<string>((acc, current) => {
      const v1 = extractVersionFormatted(current);
      const v2 = extractVersionFormatted(acc);

      if (
        typeof v1 === 'string' &&
        typeof v2 === 'string' &&
        gt(v1, v2, { includePrerelease: true })
      ) {
        return v1;
      }

      return acc;
    }, extractVersionFormatted(firstVersion)!);
  }
}
