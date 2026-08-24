import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {ohmypiApi, type OhMyPiDiscoverySettings,} from "@/lib/api/ohmypi";

const BOOLEAN_TOGGLES: Array<{
  key: keyof OhMyPiDiscoverySettings;
  labelKey: string;
  defaultLabel: string;
  descriptionKey: string;
  defaultDescription: string;
}> = [
  {
    key: "skillsEnabled",
    labelKey: "ohmypi.settings.skillsEnabled",
    defaultLabel: "启用 Skills",
    descriptionKey: "ohmypi.settings.skillsEnabledDesc",
    defaultDescription: "是否加载 Oh My Pi 的 skills。",
  },
  {
    key: "skillsEnableClaudeUser",
    labelKey: "ohmypi.settings.enableClaudeUser",
    defaultLabel: "加载 Claude 用户 Skills",
    descriptionKey: "ohmypi.settings.enableClaudeUserDesc",
    defaultDescription: "从 ~/.claude/skills 加载。",
  },
  {
    key: "skillsEnableClaudeProject",
    labelKey: "ohmypi.settings.enableClaudeProject",
    defaultLabel: "加载 Claude 项目 Skills",
    descriptionKey: "ohmypi.settings.enableClaudeProjectDesc",
    defaultDescription: "从 .claude/skills 加载。",
  },
  {
    key: "skillsEnableCodexUser",
    labelKey: "ohmypi.settings.enableCodexUser",
    defaultLabel: "加载 Codex Skills",
    descriptionKey: "ohmypi.settings.enableCodexUserDesc",
    defaultDescription: "从 ~/.codex/skills 加载。",
  },
  {
    key: "skillsEnablePiUser",
    labelKey: "ohmypi.settings.enablePiUser",
    defaultLabel: "加载 Pi 用户 Skills",
    descriptionKey: "ohmypi.settings.enablePiUserDesc",
    defaultDescription: "从 ~/.pi/skills 加载。",
  },
  {
    key: "skillsEnablePiProject",
    labelKey: "ohmypi.settings.enablePiProject",
    defaultLabel: "加载 Pi 项目 Skills",
    descriptionKey: "ohmypi.settings.enablePiProjectDesc",
    defaultDescription: "从 .pi/skills 加载。",
  },
  {
    key: "skillsEnableAgentsUser",
    labelKey: "ohmypi.settings.enableAgentsUser",
    defaultLabel: "加载 Agents 用户 Skills",
    descriptionKey: "ohmypi.settings.enableAgentsUserDesc",
    defaultDescription: "从 ~/.agents/skills 加载。",
  },
  {
    key: "skillsEnableAgentsProject",
    labelKey: "ohmypi.settings.enableAgentsProject",
    defaultLabel: "加载 Agents 项目 Skills",
    descriptionKey: "ohmypi.settings.enableAgentsProjectDesc",
    defaultDescription: "从 .agents/skills 加载。",
  },
];

export function OhMyPiSettingsSection() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["ohmypi", "discoverySettings"],
    queryFn: () => ohmypiApi.getDiscoverySettings(),
  });

  const mutation = useMutation({
    mutationFn: (settings: OhMyPiDiscoverySettings) =>
      ohmypiApi.setDiscoverySettings(settings),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["ohmypi", "discoverySettings"],
      });
    },
    onError: (error: Error) => {
      toast.error(t("common.error"), { description: error.message });
    },
  });

  const update = (patch: Partial<OhMyPiDiscoverySettings>) => {
    mutation.mutate({ ...data, ...patch } as OhMyPiDiscoverySettings);
  };

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("common.loading", { defaultValue: "加载中…" })}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t("ohmypi.settings.discoveryIntro", {
          defaultValue:
            "控制 Oh My Pi 自动发现并加载其他 Agent 的 Skills，以及 append-only 上下文模式。写入 ~/.omp/agent/config.yml。",
        })}
      </p>
      <div className="space-y-3">
        {BOOLEAN_TOGGLES.map((toggle) => {
          const value = data?.[toggle.key] ?? false;
          return (
            <div
              key={toggle.key}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <Label className="text-sm font-medium">
                  {t(toggle.labelKey, { defaultValue: toggle.defaultLabel })}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t(toggle.descriptionKey, {
                    defaultValue: toggle.defaultDescription,
                  })}
                </p>
              </div>
              <Switch
                checked={Boolean(value)}
                onCheckedChange={(checked) => update({ [toggle.key]: checked })}
                disabled={mutation.isPending}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <Label className="text-sm font-medium">
            {t("ohmypi.settings.appendOnly", {
              defaultValue: "Append-only 上下文",
            })}
          </Label>
          <p className="text-xs text-muted-foreground">
            {t("ohmypi.settings.appendOnlyDesc", {
              defaultValue:
                "为 DeepSeek / 本地推理等前缀缓存命中的供应商缓存系统提示词与工具定义，提升命中率。",
            })}
          </p>
        </div>
        <Select
          value={data?.appendOnlyContext ?? "auto"}
          onValueChange={(value) => update({ appendOnlyContext: value })}
          disabled={mutation.isPending}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="on">On</SelectItem>
            <SelectItem value="off">Off</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}