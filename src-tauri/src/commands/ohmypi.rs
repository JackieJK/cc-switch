use crate::provider::UsageScript;
use crate::services::ohmypi_state::{OhMyPiCurrentState, OhMyPiStateService};
use crate::services::ProviderService;
use crate::store::AppState;
use serde::{Deserialize, Serialize};
use tauri::State;

#[tauri::command]
pub(crate) fn get_ohmypi_current_state(state: State<'_, AppState>) -> Result<OhMyPiCurrentState, String> {
    OhMyPiStateService::current(state.inner()).map_err(|error| error.to_string())
}

#[tauri::command]
pub(crate) fn update_ohmypi_provider_usage_script(
    state: State<'_, AppState>,
    id: String,
    #[allow(non_snake_case)] usageScript: UsageScript,
) -> Result<bool, String> {
    ProviderService::update_ohmypi_usage_script(state.inner(), &id, usageScript)
        .map_err(|error| error.to_string())
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct OhMyPiDiscoverySettings {
    pub skills_enabled: Option<bool>,
    pub skills_enable_claude_user: Option<bool>,
    pub skills_enable_claude_project: Option<bool>,
    pub skills_enable_codex_user: Option<bool>,
    pub skills_enable_pi_user: Option<bool>,
    pub skills_enable_pi_project: Option<bool>,
    pub skills_enable_agents_user: Option<bool>,
    pub skills_enable_agents_project: Option<bool>,
    pub append_only_context: Option<String>,
}

impl OhMyPiDiscoverySettings {
    fn key_paths() -> [&'static [&'static str]; 8] {
        [
            &["skills", "enabled"],
            &["skills", "enableClaudeUser"],
            &["skills", "enableClaudeProject"],
            &["skills", "enableCodexUser"],
            &["skills", "enablePiUser"],
            &["skills", "enablePiProject"],
            &["skills", "enableAgentsUser"],
            &["skills", "enableAgentsProject"],
        ]
    }
}

#[tauri::command]
pub(crate) fn get_ohmypi_discovery_settings() -> Result<OhMyPiDiscoverySettings, String> {
    let paths = OhMyPiDiscoverySettings::key_paths();
    let values: Vec<Option<bool>> = paths
        .iter()
        .map(|path| crate::ohmypi_config::read_ohmypi_bool_setting(path))
        .collect::<Result<_, _>>()
        .map_err(|error| error.to_string())?;
    let append_only = crate::ohmypi_config::read_ohmypi_append_only_context()
        .map_err(|error| error.to_string())?;
    Ok(OhMyPiDiscoverySettings {
        skills_enabled: values[0],
        skills_enable_claude_user: values[1],
        skills_enable_claude_project: values[2],
        skills_enable_codex_user: values[3],
        skills_enable_pi_user: values[4],
        skills_enable_pi_project: values[5],
        skills_enable_agents_user: values[6],
        skills_enable_agents_project: values[7],
        append_only_context: append_only,
    })
}

#[tauri::command]
pub(crate) fn set_ohmypi_discovery_settings(
    settings: OhMyPiDiscoverySettings,
) -> Result<(), String> {
    let paths = OhMyPiDiscoverySettings::key_paths();
    let values = [
        settings.skills_enabled,
        settings.skills_enable_claude_user,
        settings.skills_enable_claude_project,
        settings.skills_enable_codex_user,
        settings.skills_enable_pi_user,
        settings.skills_enable_pi_project,
        settings.skills_enable_agents_user,
        settings.skills_enable_agents_project,
    ];
    for (path, value) in paths.iter().zip(values.iter()) {
        if let Some(value) = value {
            crate::ohmypi_config::write_ohmypi_bool_setting(path, *value)
                .map_err(|error| error.to_string())?;
        }
    }
    if let Some(append_only) = settings.append_only_context.as_deref() {
        crate::ohmypi_config::write_ohmypi_append_only_context(append_only)
            .map_err(|error| error.to_string())?;
    }
    Ok(())
}
