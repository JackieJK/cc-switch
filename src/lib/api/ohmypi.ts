import {invoke} from "@tauri-apps/api/core";
import type {UsageScript} from "@/types";

export interface OhMyPiCurrentState {
  enabledProviderIds: string[];
  defaultProviderId: string | null;
}

export interface OhMyPiDiscoverySettings {
  skillsEnabled?: boolean;
  skillsEnableClaudeUser?: boolean;
  skillsEnableClaudeProject?: boolean;
  skillsEnableCodexUser?: boolean;
  skillsEnablePiUser?: boolean;
  skillsEnablePiProject?: boolean;
  skillsEnableAgentsUser?: boolean;
  skillsEnableAgentsProject?: boolean;
  appendOnlyContext?: string;
}

export const ohmypiApi = {
  async getCurrentState(): Promise<OhMyPiCurrentState> {
    return await invoke("get_ohmypi_current_state");
  },

  async updateProviderUsageScript(
    id: string,
    usageScript: UsageScript,
  ): Promise<boolean> {
    return await invoke("update_ohmypi_provider_usage_script", {
      id,
      usageScript,
    });
  },

  async getDiscoverySettings(): Promise<OhMyPiDiscoverySettings> {
    return await invoke("get_ohmypi_discovery_settings");
  },

  async setDiscoverySettings(
    settings: OhMyPiDiscoverySettings,
  ): Promise<void> {
    return await invoke("set_ohmypi_discovery_settings", { settings });
  },
};
