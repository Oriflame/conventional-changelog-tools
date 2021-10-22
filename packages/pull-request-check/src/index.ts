/* eslint-disable @typescript-eslint/no-non-null-assertion -- needed */
import { createAzureClient } from '@oriflame/azure-helpers';
import { checkCommitFormat } from '@oriflame/conventional-changelog';

interface AzureClientOptions {
  serverUrl: string;
  pat: string;
}

interface CheckForConventionalTitleArgs extends AzureClientOptions {
  pullRequestId: string;
}

export async function checkForConventionalTitle({
  pullRequestId,
  ...rest
}: CheckForConventionalTitleArgs) {
  const webApi = await createAzureClient(rest);
  const gitApi = await webApi.getGitApi();
  const prId = Number(pullRequestId);

  const pullRequest = await gitApi.getPullRequestById(prId);

  if (!checkCommitFormat(pullRequest.title!)) {
    await gitApi.createThread(
      {
        comments: [
          {
            commentType: 1,
            content:
              'Pull request title requires a conventional changelog prefix. More information: https://github.com/Oriflame/conventional-changelog-tools/tree/master/packages/conventional-changelog#commit-message-format',
          },
        ],
        status: 1,
      },
      pullRequest.repository!.id!,
      prId,
    );
    throw new Error(
      'Pull request title requires a conventional changelog prefix. More information: https://github.com/Oriflame/conventional-changelog-tools/tree/master/packages/conventional-changelog#commit-message-format',
    );
  }
}
