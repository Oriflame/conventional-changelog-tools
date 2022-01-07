/* eslint-disable @typescript-eslint/no-unsafe-argument -- false positive */

/* eslint-disable @typescript-eslint/no-unsafe-call -- needed */
/* eslint-disable import/no-extraneous-dependencies -- needed */

import conventionalChangelogCore from 'conventional-changelog-core';
import conventionalRecommendedBump from 'conventional-recommended-bump';
import { writeFileSync } from 'fs';
import path from 'path';
import shell from 'shelljs';
import type Stream from 'stream';

import { config } from '../src';

function gitDummyCommit(msg: string[] | string, silent = true) {
  const args: string[] = ['--allow-empty', '--no-gpg-sign'];

  if (Array.isArray(msg)) {
    msg.forEach((m) => {
      args.push(`-m"${m}"`);
    });
  } else {
    args.push(`-m"${msg}"`);
  }

  shell.exec(`git commit ${args.join(' ')}`, { silent });
}

async function captureStreamOutput(stream: Stream.Readable) {
  return new Promise<string>((resolve, reject) => {
    let data = '';
    stream
      .on('error', (error: Error) => {
        reject(error);
      })
      .on('data', (chunk: string) => {
        data += String(chunk);
      })
      .on('end', () => {
        resolve(data.trim());
      });
  });
}

async function conventionalRecommendedBumpSteam(conventionalConfig: object) {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    conventionalRecommendedBump(
      {
        ...conventionalConfig,
      },
      (error: Error | null, result: Record<string, unknown>) => {
        console.log('recommended bump done');
        if (error !== null) {
          reject(error);
        }
        resolve(result);
      },
    );
  });
}

describe('conventional-changelog-ori', () => {
  const commonConfig = {
    config,
    pkg: {
      path: path.join(__dirname, 'package.json'),
    },
  };

  jest.setTimeout(60000);

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any -- needed
    (shell.config as any).resetForTesting();
    shell.cd(__dirname);
    shell.mkdir('tmp');
    shell.cd('tmp');
    shell.mkdir('git-templates');
    shell.exec('git init --initial-branch master --template=./git-templates');
    shell.exec('git remote add origin https://github.com/user/repo.git');
    writeFileSync(
      'package.json',
      '{ "name": "@oriflame/conventional-changelog", "repository": { "type": "git", "url": "https://github.com/oriflame/conventional-changelog-tools.git" } }',
    );
    shell.exec('git add --all && git commit -m"First commit"');
  });

  afterEach(() => {
    shell.cd(__dirname);
    shell.rm('-rf', 'tmp');
  });

  it('supports all types at once', async () => {
    gitDummyCommit(['release: New major!', 'Note: New build system.']);
    gitDummyCommit(['break: Forms have changed', 'Note: They are easier now!']);
    gitDummyCommit(['new: amazing new module', 'Not backward compatible.']);
    gitDummyCommit('fix: updated i18n');
    gitDummyCommit(['update(modal, button): added accessibility', 'closes #1, #2']);
    gitDummyCommit('feature(core): settings refactor');
    gitDummyCommit('Random commit with no type');
    gitDummyCommit('docs: added getting started');
    gitDummyCommit('style(button): polished rounded corners');
    gitDummyCommit(['security(auth): improved logic', 'fixes #3']);
    gitDummyCommit('Revert PR #1');
    gitDummyCommit('ci(travis): fixed yaml config');
    gitDummyCommit('build(deps): updated dev tools');
    gitDummyCommit('test: setup testing framework');
    gitDummyCommit('internal(ts): updated types');
    gitDummyCommit('deps(babel,jest): Bumped to latest');
    gitDummyCommit(['patch(router): Fix params']);
    gitDummyCommit('types: Removed any');
    gitDummyCommit('Merged PR 21884: fix: Type of lastAddedCustomerOrderIds');
    gitDummyCommit('Merged PR 21884: new(Test): Hello darkness my old friend');

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('works if there is no semver tag', async () => {
    gitDummyCommit(['build: first build setup', 'Note: New build system.']);
    gitDummyCommit(['ci(travis): add TravisCI pipeline', 'Continuously integrated.']);
    gitDummyCommit(['new: amazing new module', 'Not backward compatible.']);
    gitDummyCommit(['fix(compile): avoid a bug', 'The Change is huge.']);
    gitDummyCommit(['update(ngOptions): make it faster', 'closes #1, #2']);
    gitDummyCommit('revert(ngOptions): bad commit');
    gitDummyCommit('fix(*): oops');
    gitDummyCommit('type: Added unknown');
    gitDummyCommit('tests: Added before hooks');
    gitDummyCommit('Merged PR 21884: fix: Type of lastAddedCustomerOrderIds');
    gitDummyCommit('Merged PR 21884: new(Test): Hello darkness my old friend');

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('works if there is a semver tag', async () => {
    shell.exec('git tag v1.0.0');
    gitDummyCommit('update: some more features');

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
        outputUnreleased: true,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('works with unknown host', async () => {
    gitDummyCommit('docs: add manual');

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
        pkg: {
          path: path.join(__dirname, 'package-unknown-repo.json'),
        },
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('uses h1 for major versions', async () => {
    gitDummyCommit('break: new shit');
    gitDummyCommit('release: new stuff');
    gitDummyCommit('fix: just a patch');

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('uses h2 for minor versions', async () => {
    gitDummyCommit('new: new shit');
    gitDummyCommit('update: new stuff');
    gitDummyCommit('feature(modal): better modals');
    gitDummyCommit('fix: just a patch');

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('uses h3 for patch versions', async () => {
    gitDummyCommit('docs: add a manual');
    gitDummyCommit('patch: just a patch');

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it('replaces #[0-9]+ with issue URL', async () => {
    gitDummyCommit(['new(awesome): fix #88']);

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('replaces @username with GitHub user URL', async () => {
    gitDummyCommit(['feature(awesome): issue brought up by @bcoe! on Friday']);

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('doesnt replace @username if wrapped in backticks', async () => {
    gitDummyCommit(['deps: Updated \\`@types\\` packages.']);

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('handles multiple notes', async () => {
    gitDummyCommit(['release: Initial release', 'Note: Made a lot of changes']);
    gitDummyCommit(['fix(button): Made button changes', 'Note: Button is more buttony']);

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('links commits/issues to deep repositories correctly', async () => {
    gitDummyCommit(['update: supports sub-package links', ' closes #10']);

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
        pkg: {
          path: path.join(__dirname, 'package-monorepo.json'),
        },
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('supports non public GitHub repository locations', async () => {
    gitDummyCommit(['update(events): implementing #5 by @dlmr', ' closes #10']);
    gitDummyCommit('new: why this work?');

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
        pkg: {
          path: path.join(__dirname, 'package-custom-repo.json'),
        },
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('only replaces with link to user if it is an username', async () => {
    gitDummyCommit(['fix: use npm@5 (@username)']);
    gitDummyCommit([
      'build(deps): bump @dummy/package from 7.1.2 to 8.0.0',
      'break: The Change is huge.',
    ]);

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('handles merge commits', async () => {
    gitDummyCommit(['fix: use yarn']);
    gitDummyCommit('Merge pull request #29 from owner/repo');

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  it.skip('handles revert type', async () => {
    gitDummyCommit('revert(foo): undo this');
    gitDummyCommit('Revert this is the PR title');

    const data = await captureStreamOutput(
      conventionalChangelogCore({
        ...commonConfig,
      }),
    );

    expect(data).toMatchSnapshot();
  });

  describe('recommended bump', () => {
    test.skip.each(['break', 'breaking', 'release'])(
      'bumps major version for %s',
      async (major) => {
        gitDummyCommit(`${major}: new stuff`);
        gitDummyCommit(`${major}(todo): with scope`);
        const result = await conventionalRecommendedBumpSteam(commonConfig);

        expect(result).toEqual({
          level: 0,
          reason: 'There are 2 breaking changes and 0 new features, also 0 fixes',
          releaseType: 'major',
        });
      },
    );

    test.skip.each(['break', 'breaking', 'release'])(
      'bumps major version for %s with azure devops prefix',
      async (major) => {
        gitDummyCommit(`Merged PR 21884: ${major}: new stuff`);
        gitDummyCommit(`Merged PR 21884: ${major}(todo): with scope`);
        const result = await conventionalRecommendedBumpSteam(commonConfig);

        expect(result).toEqual({
          level: 0,
          reason: 'There are 2 breaking changes and 0 new features, also 0 fixes',
          releaseType: 'major',
        });
      },
    );

    test.skip.each(['new', 'update', 'feature'])('bumps minor version for %s', async (minor) => {
      gitDummyCommit(`${minor}: new stuff`);
      gitDummyCommit(`${minor}(todo): with scope`);
      const result = await conventionalRecommendedBumpSteam(commonConfig);

      expect(result).toEqual({
        level: 1,
        reason: 'There are 0 breaking changes and 2 new features, also 0 fixes',
        releaseType: 'minor',
      });
    });

    test.skip.each(['new', 'update', 'feature'])(
      'bumps minor version for %s with azure devops prefix',
      async (minor) => {
        gitDummyCommit(`Merged PR 21884: ${minor}: new stuff`);
        gitDummyCommit(`Merged PR 21884: ${minor}(todo): with scope`);
        const result = await conventionalRecommendedBumpSteam(commonConfig);

        expect(result).toEqual({
          level: 1,
          reason: 'There are 0 breaking changes and 2 new features, also 0 fixes',
          releaseType: 'minor',
        });
      },
    );

    test.skip.each(['fix', 'deps', 'style', 'security', 'revert', 'misc', 'type', 'types'])(
      'bumps patch version for %s',
      async (patch) => {
        gitDummyCommit(`${patch}: new stuff`);
        gitDummyCommit(`${patch}(todo): with scope`);
        const result = await conventionalRecommendedBumpSteam(commonConfig);

        expect(result).toEqual({
          level: 2,
          reason: 'There are 0 breaking changes and 0 new features, also 2 fixes',
          releaseType: 'patch',
        });
      },
    );

    test.skip.each(['fix', 'deps', 'style', 'security', 'revert', 'misc', 'type', 'types'])(
      'bumps patch version for %s with devops prefix',
      async (patch) => {
        gitDummyCommit(`Merged PR 21884: ${patch}: new stuff`);
        gitDummyCommit(`Merged PR 21884: ${patch}(todo): with scope`);
        const result = await conventionalRecommendedBumpSteam(commonConfig);

        expect(result).toEqual({
          level: 2,
          reason: 'There are 0 breaking changes and 0 new features, also 2 fixes',
          releaseType: 'patch',
        });
      },
    );

    test.skip.each(['docs', 'ci', 'build', 'test', 'tests', 'internal'])(
      "doesn't bump version for %s",
      async (ignore) => {
        gitDummyCommit(`${ignore}: new stuff`);
        gitDummyCommit(`${ignore}(todo): with scope`);
        const result = await conventionalRecommendedBumpSteam(commonConfig);

        expect(result).toEqual({
          level: null,
          reason: 'There are 0 breaking changes and 0 new features, also 0 fixes',
        });
      },
    );

    test.skip.each(['docs', 'ci', 'build', 'test', 'tests', 'internal'])(
      "doesn't bump version for %s with devops prefix",
      async (ignore) => {
        gitDummyCommit(`Merged PR 21884: ${ignore}: new stuff`);
        gitDummyCommit(`Merged PR 21884: ${ignore}(todo): with scope`);
        const result = await conventionalRecommendedBumpSteam(commonConfig);
        expect(result).toEqual({
          level: null,
          reason: 'There are 0 breaking changes and 0 new features, also 0 fixes',
        });
      },
    );

    it('does nothing when no type exist', async () => {
      gitDummyCommit('new stuff');
      gitDummyCommit('commit without a type');
      const result = await conventionalRecommendedBumpSteam(commonConfig);

      expect(result).toEqual({
        level: null,
        reason: 'There are 0 breaking changes and 0 new features, also 0 fixes',
      });
    });
  });
});
