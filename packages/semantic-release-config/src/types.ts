type PluginWithSetting = [string, Record<string, unknown>];

interface BranchObject {
  name: string;
  prerelease?: boolean;
  channel?: string;
}

type Plugin = PluginWithSetting | string;

type Branch = BranchObject | string;

export interface SemanticReleaseConfig {
  branches?: Branch[];
  plugins?: Plugin[];
}
