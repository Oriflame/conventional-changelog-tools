import { checkCommitFormat } from '@oriflame/conventional-changelog';
import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api';

import { createThread } from './CreateThread';

interface AzureClientOptions {
  serverUrl: string;
  pat: string;
}

async function createAzureClient({ pat, serverUrl }: AzureClientOptions) {
  const authHandler = getPersonalAccessTokenHandler(pat);
  const webApi = new WebApi(serverUrl, authHandler);
  await webApi.connect();
  const gitApi = await webApi.getGitApi();

  return { webApi, gitApi };
}

interface CheckForConventionalTitleArgs extends AzureClientOptions {
  pullRequestId: string;
}

export async function checkForConventionalTitle({
  pullRequestId,
  ...rest
}: CheckForConventionalTitleArgs) {
  const { gitApi } = await createAzureClient(rest);
  const prId = Number(pullRequestId);

  const pullRequest = await gitApi.getPullRequestById(prId);

  if (!checkCommitFormat(pullRequest.title!)) {
    await createThread(
      gitApi,
      pullRequest,
      'Pull request title requires a conventional changelog prefix. More information: https://github.com/Oriflame/conventional-changelog-tools/tree/master/packages/conventional-changelog#commit-message-format',
    );
    throw new Error(
      'Pull request title requires a conventional changelog prefix. More information: https://github.com/Oriflame/conventional-changelog-tools/tree/master/packages/conventional-changelog#commit-message-format',
    );
  }
}
