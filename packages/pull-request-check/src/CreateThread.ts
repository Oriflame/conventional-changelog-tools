import { IGitApi } from 'azure-devops-node-api/GitApi';
import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';

export async function createThread(gitApi: IGitApi, pullRequest: GitPullRequest, message: string) {
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
    pullRequest.pullRequestId!,
  );
}
