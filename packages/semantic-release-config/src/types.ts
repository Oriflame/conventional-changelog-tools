type PluginWithSetting = [string, Record<string, unknown>];

type BranchObject = {
  name: string;
  prerelease?: boolean;
  channel?: string;
};

type Plugin = string | PluginWithSetting;

type Branch = string | BranchObject;

export interface SemanticReleaseConfig {
  branches?: Branch[];
  plugins?: Plugin[];
}
