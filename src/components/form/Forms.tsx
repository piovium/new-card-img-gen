import {
  type AdjustmentData,
  type Language,
  type PlayCost,
  type Version,
} from "../../types";
import {
  type Accessor,
  type Component,
  createContext,
  createEffect,
  createSignal,
  For,
  type JSX,
  on,
  untrack,
  useContext,
} from "solid-js";
import { GeneralConfigTab } from "./GenerialConfigTab";
// import { NewItemsTab } from "./NewItemTab";
// import { OverrideTab } from "./OverrideTab";
import importSvg from "./import.svg";
import exportSvg from "./export.svg";
import * as R from "remeda";
import { useAppForm } from "./shared";
import { OverrideTab } from "./OverrideTab";
import { NewItemsTab } from "./NewItemTab";
import { BalanceAdjustmentTab } from "./BalanceAdjustmentTab";

export interface FormsProps {
  initialValue: FormValue;
  versionList: string[];
  loading?: boolean;
  onSubmit: (data: FormValue) => void;
}

const TAB_LISTS = [
  {
    title: "通用",
    key: "general",
    component: GeneralConfigTab,
  },
  {
    title: "新卡编辑",
    key: "newItems",
    component: NewItemsTab,
  },
  {
    title: "微调",
    key: "override",
    component: OverrideTab,
  },
  {
    title: "平衡性调整",
    key: "adjustments",
    component: BalanceAdjustmentTab,
  },
] as const satisfies {
  title: string;
  key: string;
  component: Component<{ form: any }>;
}[];

export interface NewCharacterData {
  id: number;
  name: string;
  hp: number;
  maxEnergy: number;
  elementTag: string;
  weaponTag: string;
  tags: string[];
  storyText?: string;
  skills: NewSkillData[];
  cardFaceUrl: string;
}

export interface NewSkillData {
  id: number;
  type: string; // TODO: better typing
  name: string;
  rawDescription: string;
  playCost: PlayCost[];
  icon?: string;
  iconUrl?: string;
}

export interface NewActionCardData {
  type: string; // TODO: better typing
  id: number;
  name: string;
  tags: string[]; // TODO: better typing
  relatedCharacterId: number | null;
  rawDescription: string;
  playCost: PlayCost[];
  cardFaceUrl: string;
}

export interface NewEntityData {
  id: number;
  type: string; // TODO: better typing
  name: string;
  tags: string[]; // TODO: better typing
  skills: []; // TODO: how to handle techniques?
  rawDescription: string;
  buffIcon?: string;
  buffIconUrl?: string;
  cardFaceUrl?: string;
}

export interface NewKeywordData {
  id: number;
  name: string;
  rawDescription: string;
}

export type GenerationMode =
  | "character"
  | "singleActionCard"
  | "versionedActionCards"
  | "balanceAdjustment";

export interface FormValue {
  general: {
    mode: GenerationMode;
    characterId?: number;
    actionCardId?: number;
    version: Version;
    language: Language;
    authorName?: string;
    authorImageUrl?: string;
    mirroredLayout?: boolean;
    cardbackImage: string;
    displayId: boolean;
    displayStory: boolean;
    watermarkText: string;
  };
  newItems: {
    characters: NewCharacterData[];
    actionCards: NewActionCardData[];
    entities: NewEntityData[];
    keywords: NewKeywordData[];
  };
  adjustments: AdjustmentData[];
}

type TabKey = (typeof TAB_LISTS)[number]["key"];

export interface MainFormContextValue {
  versionList: Accessor<string[]>;
}
const MainFormContext = createContext<MainFormContextValue>();
export const useMainFormContext = () => {
  return useContext(MainFormContext)!;
};

export const Forms = (props: FormsProps) => {
  const form = useAppForm(() => ({
    defaultValues: props.initialValue,
    onSubmit: ({ value }) => {
      props.onSubmit(value);
    },
  }));

  const previewVisible = () =>
    !!document.querySelector(".preview-container")?.scrollHeight;

  const submitOp = R.funnel<[FormValue], FormValue>(
    (data: FormValue) => {
      if (previewVisible() && form.state.canSubmit) {
        untrack(() => props.onSubmit)(data);
      }
    },
    { minQuietPeriodMs: 500, triggerAt: "both", reducer: (prev, data) => data },
  );

  let formEl!: HTMLFormElement;
  let importInputEl!: HTMLInputElement;

  const [currentTab, setCurrentTab] = createSignal<TabKey>("general");
  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(form.state.values, null, 2)], {
        type: "application/json",
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `config-${Date.now()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 0);
    } catch {
      alert("导出失败");
    }
  };

  createEffect(
    on(form.useStore(), ({ values }, prev) => {
      if (!R.isDeepEqual(prev?.values, values)) {
        submitOp.call(values);
      }
    }),
  );

  const handleImportClick = () => {
    importInputEl.click();
  };
  const handleImportFileChange: JSX.ChangeEventHandler<
    HTMLInputElement,
    Event
  > = async (e) => {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const file = currentTarget.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      form.reset(json);
      if (previewVisible() && form.state.canSubmit) {
        formEl.requestSubmit();
      }
    } catch {
      alert("导入失败：无法解析 JSON");
    } finally {
      currentTarget.value = "";
    }
  };

  return (
    <MainFormContext.Provider
      value={{
        versionList: () => props.versionList,
      }}
    >
      <form
        class="w-full flex-grow min-h-0 p-4 flex flex-col"
        ref={formEl}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div class="overflow-x-auto max-w-full flex-shrink-0">
          <div role="tablist" class="tabs tabs-border  min-w-max">
            <For each={TAB_LISTS}>
              {(tab) => (
                <button
                  type="button"
                  role="tab"
                  class="tab"
                  classList={{
                    "tab-active": currentTab() === tab.key,
                  }}
                  onClick={() => setCurrentTab(tab.key)}
                >
                  {tab.title}
                </button>
              )}
            </For>
            <div class="grow" />
            <div class="flex flex-row items-center">
              <button
                type="button"
                class="btn btn-sm btn-ghost btn-circle"
                onClick={handleImportClick}
              >
                <img src={importSvg} />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-ghost btn-circle"
                onClick={handleExport}
              >
                <img src={exportSvg} />
              </button>
              <input
                ref={importInputEl}
                type="file"
                accept="application/json"
                class="hidden"
                onChange={handleImportFileChange}
              />
            </div>
          </div>
        </div>
        <For each={TAB_LISTS}>
          {(tab) => (
            <div
              role="tabpanel"
              class="pt-4 pb-2 flex-grow min-h-0 overflow-auto hidden data-[shown]:block"
              bool:data-shown={currentTab() === tab.key}
            >
              <tab.component form={form} />
            </div>
          )}
        </For>
        <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit })}>
          {(state) => (
            <button
              type="submit"
              class="flex-shrink-0 btn btn-primary"
              disabled={!state().canSubmit || props.loading}
            >
              {props.loading ? "生成中" : "生成"}
            </button>
          )}
        </form.Subscribe>
      </form>
    </MainFormContext.Provider>
  );
};
