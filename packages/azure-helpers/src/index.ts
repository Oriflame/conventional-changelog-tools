import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api';
import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';

interface AzureClientOptions {
  serverUrl: string;
  pat: string;
}

export async function createAzureClient({ pat, serverUrl }: AzureClientOptions) {
  const authHandler = getPersonalAccessTokenHandler(pat);
  const webApi = new WebApi(serverUrl, authHandler);
  await webApi.connect();

  return webApi;
}

interface WorkItemUrlOptions {
  workItem: WorkItem;
  organizationUrl: string;
}

export function getWorkItemUrl({
  workItem: { fields = {}, id },
  organizationUrl,
}: WorkItemUrlOptions) {
  return `${organizationUrl}/${fields['System.TeamProject']}/_workitems/edit/${id}`;
}
