/* eslint-disable class-methods-use-this -- needed */
import type { GlobalOptions } from '@boost/cli';
import { Config, Command, Arg } from '@boost/cli';
import { gt } from 'semver';

type VersionParams = [string, string];

@Config('greaterVersion', 'Determine greater version', {
  aliases: ['gte'],
})
export default class GreaterVersionCommand extends Command<GlobalOptions, VersionParams> {
  @Arg.Params<VersionParams>(
    {
      description: 'First version',
      label: 'First version',
      type: 'string',
      required: true,
    },
    {
      description: 'Second version',
      label: 'Second version',
      type: 'string',
      required: false,
    },
  )
  run(firstVersion: string, secondVersion?: string) {
    if (secondVersion && gt(secondVersion, firstVersion)) {
      return secondVersion;
    }

    return firstVersion;
  }
}
