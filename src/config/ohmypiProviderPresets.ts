import { piProviderPresets, type PiProviderPreset } from "./piProviderPresets";

/**
 * Oh My Pi provider catalog.
 *
 * Oh My Pi's provider protocol is Pi-isomorphic — the same api formats
 * (openai-completions / openai-responses / anthropic-messages /
 * google-generative-ai / bedrock-converse-stream), baseUrl + apiKey +
 * headers + compat + models config shape, and the same OpenAI-compatible
 * provider endpoints. Providers are app-agnostic endpoints, so the
 * independently-verified Pi catalog (real base URLs, api formats, model
 * capabilities, registry icons) applies directly to Oh My Pi without
 * fabricating any endpoint.
 *
 * Each preset carries its own registry `icon` + `iconColor`, so a provider
 * created from a preset renders its own logo in the provider list (not the
 * agent mark) — matching the other agent pages.
 */
export type OhMyPiProviderPreset = PiProviderPreset;

export const ohmypiProviderPresets: OhMyPiProviderPreset[] = piProviderPresets.map(
  (preset) => ({
    ...preset,
    settingsConfig: {
      ...preset.settingsConfig,
      models: preset.settingsConfig.models.map(
        (model) =>
            model,
      ),
    },
  }),
);
