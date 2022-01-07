import type { GlobalOptions } from '@boost/cli';
import { runCommand } from '@boost/cli/test';

import GreaterVersionCommand from '../src/commands/GreaterVersionCommand';

describe('GreaterVersionCommand', () => {
  test('It works with only version', async () => {
    const command = new GreaterVersionCommand();

    await expect(
      runCommand<GlobalOptions, [string, string]>(command, [
        'v1.0.0',
        undefined as unknown as string,
      ]),
    ).resolves.toBe('v1.0.0');
  });

  test.each([
    {
      firstVersion: 'v1.0.0',
      secondVersion: 'v1.0.1-develop.1',
      expectedOutput: 'v1.0.1-develop.1',
    },
    {
      firstVersion: 'v1.0.0',
      secondVersion: 'v1.0.0-develop.1',
      expectedOutput: 'v1.0.0',
    },
    {
      firstVersion: 'v2.1.1',
      secondVersion: 'v2.1.2-stg.1',
      expectedOutput: 'v2.1.2-stg.1',
    },
    {
      firstVersion: 'v4.0.0',
      secondVersion: 'v1.0.0',
      expectedOutput: 'v4.0.0',
    },
  ])(
    'Test {firstVersion} vs {secondVersion} and expected: {expectedOutput}',
    async ({ firstVersion, secondVersion, expectedOutput }) => {
      const command = new GreaterVersionCommand();

      await expect(
        runCommand<GlobalOptions, [string, string]>(command, [firstVersion, secondVersion]),
      ).resolves.toBe(expectedOutput);
    },
  );
});
