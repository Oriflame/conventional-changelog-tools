/* eslint-disable @typescript-eslint/no-non-null-assertion -- needed */
/* eslint-disable no-console -- needed */
/* eslint-disable no-param-reassign -- needed */

import { createAzureClient, getWorkItemUrl } from '@oriflame/azure-helpers';
import {
  CommitGroupLabel,
  Context,
  GROUPS,
  Reference,
  WriterOptions,
} from '@oriflame/conventional-changelog-types';
import fs from 'fs';
import path from 'path';

import getTypeGroup from './getTypeGroup';

type GroupMap<T> = { [K in CommitGroupLabel]: T };

const groupEmojis = GROUPS.reduce(
  (data, group) => ({
    ...data,
    [group.label]: group.emoji,
  }),
  {},
) as GroupMap<string>;

const sortWeights: GroupMap<number> = {
  Release: 4,
  Breaking: 3,
  Updates: 2,
  Fixes: 1,
  Security: 0,
  Styles: -1,
  Types: -1,
  Docs: -2,
  Dependencies: -3,
  Misc: -3,
  Reverts: -4,
  Internals: -5,
};

const { SYSTEM_ACCESSTOKEN, ENDPOINT_URL_SYSTEMVSSCONNECTION } = process.env;

function* createWorkItemLink(workItemId: string) {
  createAzureClient({
    pat: SYSTEM_ACCESSTOKEN!,
    serverUrl: ENDPOINT_URL_SYSTEMVSSCONNECTION!,
  }).then((webApi) => {
    webApi.getWorkItemTrackingApi().then((workApi) => {
      workApi.getWorkItem(Number(workItemId)).then((workItem) => {
        if (workItemId) {
          yield getWorkItemUrl({ workItem, organizationUrl: ENDPOINT_URL_SYSTEMVSSCONNECTION! });
        }
      });
    });
  });

  return '';
}

function createLink(paths: string[], context: Context, reference: Partial<Reference> = {}): string {
  const owner = reference.owner ?? context.owner;
  const repository = reference.repository ?? context.repository;
  const url: string[] = [];

  if (repository) {
    if (context.host) {
      url.push(context.host);
    }

    if (owner) {
      url.push(owner);
    }

    url.push(repository);
  } else {
    url.push(context.repoUrl);
  }
  let base = url.join('/');

  // If deep linking to a sub-folder (monorepo project, etc),
  // extract the base URL if possible.
  [
    // github, gitlab
    'tree',
    'blob',
    // bitbucket
    'src',
  ].forEach((browsePart) => {
    if (base.includes(`/${browsePart}/`)) {
      [base] = base.split(`/${browsePart}/`);
    }
  });

  return [base, ...paths].join('/');
}

const options: Partial<WriterOptions> = {
  mainTemplate: fs.readFileSync(path.join(__dirname, '../templates/template.hbs'), 'utf-8'),
  commitPartial: fs.readFileSync(path.join(__dirname, '../templates/commit.hbs'), 'utf-8'),
  headerPartial: fs.readFileSync(path.join(__dirname, '../templates/header.hbs'), 'utf-8'),
  footerPartial: fs.readFileSync(path.join(__dirname, '../templates/footer.hbs'), 'utf-8'),

  // Commits
  groupBy: 'label',
  commitsSort: ['scope', 'message'],
  commitGroupsSort(groupA, groupB) {
    const aWeight = sortWeights[groupA.title] || 0;
    const bWeight = sortWeights[groupB.title] || 0;

    if (aWeight === 0 && bWeight === 0) {
      return groupA.title.localeCompare(groupB.title);
    }

    return bWeight - aWeight;
  },

  // Notes
  noteGroupsSort: 'title',

  // Add metadata
  transform(commit, context) {
    context.groupEmojis = groupEmojis;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false positive
    if (!commit.type) {
      return undefined;
    }

    // Use consistent values for snapshots
    if (process.env.NODE_ENV === 'test') {
      commit.hash = 'a1b2c3d';
      context.date = '2019-02-26';
    }

    // Override type for specific scenarios
    if (commit.revert) {
      commit.type = 'revert';
    } else if (commit.merge) {
      commit.type = 'misc';
    }

    // Define metadata based on type
    const group = getTypeGroup(commit.type);

    commit.label = group.label;

    if (group.bump === 'major') {
      context.isMajor = true;
    } else if (group.bump === 'minor') {
      context.isMinor = true;
    }

    if (context.commit.endsWith('s')) {
      // Workaround for azure devops
      commit.hashLink = createLink(['commit', commit.hash], context);
    } else {
      // Pre-generate links instead of doing it in handlebars
      commit.hashLink = createLink([context.commit, commit.hash], context);
    }

    // Use shorthand hashes
    if (typeof commit.hash === 'string') {
      commit.hash = commit.hash.slice(0, 7);
    }

    commit.references.forEach((reference) => {
      if (SYSTEM_ACCESSTOKEN) {
        reference.issueLink = createWorkItemLink(reference.issue).next().value;
      } else {
        reference.issueLink = createLink([context.issue, reference.issue], context, reference);
      }

      let source = `${reference.repository ?? ''}#${reference.issue}`;

      if (reference.owner) {
        source = `${reference.owner}/${source}`;
      }

      reference.source = source;
    });

    // Link users
    if (context.host) {
      commit.message = commit.message.replace(
        /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/gu,
        (match, username: string, index: number) => {
          if (
            username.includes('/') ||
            // Avoid when wrapped in backticks (inline code)
            commit.message.charAt(index - 1) === '`' ||
            commit.message.charAt(index + match.length + 1) === '`'
          ) {
            return match;
          }

          return `[@${username}](${context.host}/${username})`;
        },
      );
    }

    return commit;
  },
};

export default options;
