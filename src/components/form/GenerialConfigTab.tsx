import { createEffect, createMemo, For, Match, Show, Switch } from "solid-js";
import { useGlobalSettings } from "../../context";
import { useMainFormContext, type GenerationMode } from "./Forms";
import { pseudoMainFormOption, withForm } from "./shared";
import type { SelectOption } from "./fields/SelectField";

export const GeneralConfigTab = withForm({
  ...pseudoMainFormOption,
  render: (props) => {
    // eslint-disable-next-line solid/reactivity
    const form = props.form;

    const { allData } = useGlobalSettings();
    const { versionList } = useMainFormContext();

    const names = createMemo(() => {
      const data = allData();
      return new Map(
        [...data.characters, ...data.actionCards].map((v) => [v.id, v.name]),
      );
    });

    const currentVersion = form.useStore(
      (state) => state.values.general.version,
    );
    const readonlyVersion = createMemo(
      () =>
        currentVersion() !== "latest" &&
        !versionList().includes(currentVersion()),
    );
    const versionOptions = createMemo(() => {
      const list: SelectOption[] = [
        {
          value: "latest",
          label: "最新",
        },
      ];
      if (readonlyVersion()) {
        const curr = currentVersion();
        list.push({ label: curr, value: curr });
      } else {
        list.push(...versionList().map((v) => ({ label: v, value: v })));
      }
      return list;
    });

    const mode = form.useStore((state) => state.values.general.mode);
    const isCharacterMode = () => mode() === "character";
    const isSingleActionCardMode = () => mode() === "singleActionCard";
    const isVersionedActionCardsMode = () => mode() === "versionedActionCards";
    const isBalanceAdjustmentMode = () => mode() === "balanceAdjustment";

    return (
      <div class="grid grid-cols-[6rem_1fr] gap-2">
        <label
          class="fieldset-legend"
          for="general.version"
          title="在地址栏中使用 ?version= 指定更多版本"
        >
          版本
        </label>
        <div class="flex flex-row gap-2 w-[clamp(3rem,20rem,100%)]">
          <form.AppField name="general.version">
            {(field) => (
              <field.SelectField
                options={versionOptions()}
                disabled={readonlyVersion()}
                id="general.version"
                class="flex-grow"
              />
            )}
          </form.AppField>
          <Show when={readonlyVersion()}>
            <button
              class="btn btn-link btn-sm p-0"
              type="button"
              onClick={() => {
                form.setFieldValue("general.version", "latest");
              }}
            >
              重置
            </button>
          </Show>
        </div>

        <span class="fieldset-legend">模式</span>
        <form.AppField name="general.mode">
          {(field) => (
            <field.TabBoxField<GenerationMode>
              options={[
                { value: "character", label: "角色卡" },
                { value: "singleActionCard", label: "行动卡" },
                { value: "versionedActionCards", label: "版本新增行动卡" },
                { value: "balanceAdjustment", label: "平衡性调整" },
              ]}
            />
          )}
        </form.AppField>

        <label
          class="fieldset-legend"
          classList={{ hidden: !isCharacterMode() }}
          for="general.characterId"
        >
          ID
        </label>
        <form.AppField name="general.characterId">
          {(field) => (
            <field.IdField
              nameMap={names()}
              hidden={!isCharacterMode()}
              id="general.characterId"
              placeholder="1503"
            />
          )}
        </form.AppField>

        <label
          class="fieldset-legend"
          classList={{ hidden: !isSingleActionCardMode() }}
          for="general.actionCardId"
        >
          ID
        </label>
        <form.AppField name="general.actionCardId">
          {(field) => (
            <field.IdField
              nameMap={names()}
              hidden={!isSingleActionCardMode()}
              id="general.actionCardId"
              placeholder="332005"
            />
          )}
        </form.AppField>

        <label class="fieldset-legend" for="general.cardbackImage">
          牌背
        </label>
        <form.AppField name="general.cardbackImage">
          {/* TODO: select */}
          {(field) => <field.TextField id="general.cardbackImage" />}
        </form.AppField>

        <span class="fieldset-legend">语言</span>
        <form.AppField name="general.language">
          {(field) => (
            <field.RadioGroupField
              options={[
                { value: "CHS", label: "中文" },
                { value: "EN", label: "English" },
              ]}
            />
          )}
        </form.AppField>

        <label class="fieldset-legend" for="general.authorName">
          左下附注
        </label>
        <form.AppField name="general.authorName">
          {(field) => <field.TextField id="general.authorName" />}
        </form.AppField>

        <label class="fieldset-legend" for="general.watermarkText">
          水印文本
        </label>
        <form.AppField name="general.watermarkText">
          {(field) => <field.TextField id="general.watermarkText" />}
        </form.AppField>

        <label class="fieldset-legend" for="general.authorImageUrl">
          右下图片
        </label>
        <form.AppField name="general.authorImageUrl">
          {(field) => <field.ImageField />}
        </form.AppField>

        <label class="fieldset-legend" for="general.displayId">
          显示 ID
        </label>
        <form.AppField name="general.displayId">
          {(field) => (
            <field.ToggleField class="self-center" id="general.displayId" />
          )}
        </form.AppField>

        <label
          class="fieldset-legend"
          classList={{ hidden: !isCharacterMode() }}
          for="general.displayStory"
        >
          显示角色故事
        </label>
        <form.AppField name="general.displayStory">
          {(field) => (
            <field.ToggleField
              class="self-center"
              classList={{ hidden: !isCharacterMode() }}
              id="general.displayStory"
            />
          )}
        </form.AppField>

        <label class="fieldset-legend" for="general.debug">
          Debug 模式
        </label>
        <form.AppField name="general.debug">
          {(field) => (
            <field.ToggleField class="self-center" id="general.debug" />
          )}
        </form.AppField>
      </div>
    );
  },
});
