import type { GlobalOptions } from '@boost/cli';
import { runCommand } from '@boost/cli/test';

import GreaterVersionCommand from '../src/commands/GreaterVersionCommand';

describe('GreaterVersionCommand', () => {
  test('It works with only version', async () => {
    const command = new GreaterVersionCommand();

    await expect(runCommand<GlobalOptions, [string]>(command, ['v1.0.0'])).resolves.toBe('1.0.0');
  });

  test.each([
    {
      firstVersion: 'v1.0.0',
      secondVersion: 'v1.0.1-develop.1',
      expectedOutput: '1.0.1-develop.1',
    },
    {
      firstVersion: 'v1.0.0',
      secondVersion: 'v1.0.0-develop.1',
      expectedOutput: '1.0.0',
    },
    {
      firstVersion: 'v2.1.1',
      secondVersion: 'v2.1.2-stg.1',
      expectedOutput: '2.1.2-stg.1',
    },
    {
      firstVersion: 'v4.0.0',
      secondVersion: 'v1.0.0',
      expectedOutput: '4.0.0',
    },
  ])(
    'Test {firstVersion} vs {secondVersion} and expected: {expectedOutput}',
    async ({ firstVersion, secondVersion, expectedOutput }) => {
      const command = new GreaterVersionCommand();
      const params = [firstVersion, secondVersion] as unknown as [string];
      await expect(runCommand<GlobalOptions, [string]>(command, params)).resolves.toBe(
        expectedOutput,
      );
    },
  );

  test.each([
    {
      firstVersion: 'v1.0.0',
      otherVersions: ['v1.0.1-develop.1', '@ori/test-w@v1.0.1-develop.2'],
      expectedOutput: '1.0.1-develop.2',
    },
    {
      firstVersion: 'v1.0.0',
      otherVersions: ['v0.0.1-develop.1', '@ori/test-w@v0.0.1-develop.2'],
      expectedOutput: '1.0.0',
    },
    {
      firstVersion: 'v2.1.1',
      otherVersions: ['v1.0.1-develop.1', '@ori/test-w@v2.1.2-stg.2'],
      expectedOutput: '2.1.2-stg.2',
    },
    {
      firstVersion: 'v4.0.0',
      otherVersions: [
        'v1.0.1-develop.1',
        '@ori/test-w@v1.0.1-develop.2',
        'v1.0.1-develop.1',
        '@ori/test-w@v2.1.2-stg.2',
      ],
      expectedOutput: '4.0.0',
    },
  ])(
    'Test {firstVersion} vs $otherVersions} and expected: {expectedOutput}',
    async ({ firstVersion, otherVersions, expectedOutput }) => {
      const command = new GreaterVersionCommand();
      const params = [firstVersion, ...otherVersions] as unknown as [string];
      await expect(runCommand<GlobalOptions, [string]>(command, params)).resolves.toBe(
        expectedOutput,
      );
    },
  );
});
