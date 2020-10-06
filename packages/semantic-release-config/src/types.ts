type PluginWithSetting = [string, Record<string, unknown>];

type Plugin = string | PluginWithSetting;

export interface SemanticReleaseConfig {
  plugins?: Plugin[];
}
