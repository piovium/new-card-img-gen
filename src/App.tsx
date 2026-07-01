import { createSignal, createResource, Show, onMount } from "solid-js";
import {
  type AppConfig,
  type AllRawData,
  type Version,
  VERSION_REGEX,
  type SkillRawData,
  type OverrideContext,
} from "./types";
import { GlobalSettings } from "./context";
import "./App.css";
import { Renderer } from "./components/renderer/Renderer";
import {
  Forms,
  type FormValue,
  type NewSkillData,
} from "./components/form/Forms";
import { Portal } from "solid-js/web";
import { domToBlob } from "modern-screenshot";
import {
  MOCK_NEW_ACTION_CARDS,
  MOCK_NEW_CHARACTERS,
  MOCK_NEW_ENTITIES,
  MOCK_NEW_KEYWORDS,
} from "./mock_data";
import { ASSETS_API_ENDPOINT, getData } from "./shared";
import { applyOverride } from "./override";
import { BASE_URL, overrideData } from "./constants";
import { makePersisted } from "@solid-primitives/storage";
import * as R from "remeda";

export interface RenderConfig {
  format?: "png" | "jpeg" | "webp";
  quality?: number;
}

export interface RenderAppOption extends AppConfig {
  render?: RenderConfig;
}

const EMPTY_DATA: AllRawData = {
  keywords: [],
  characters: [],
  actionCards: [],
  entities: [],
};

const search = new URLSearchParams(window.location.search);

let versionFromUrl = search.get("version") || undefined;
if (versionFromUrl && !VERSION_REGEX.test(versionFromUrl)) {
  alert("URL 中的 version 参数格式错误，应为 vX.Y.Z 或 latest");
  versionFromUrl = "latest";
}

const INITIAL_NEW_ITEMS: FormValue["newItems"] = {
  characters: MOCK_NEW_CHARACTERS,
  actionCards: MOCK_NEW_ACTION_CARDS,
  entities: MOCK_NEW_ENTITIES,
  keywords: MOCK_NEW_KEYWORDS,
};

const INITIAL_FORM_VALUE: FormValue = {
  general: {
    mode: "character",
    characterId: 1503,
    actionCardId: 332005,
    language: "CHS",
    version: "latest",
    authorName: "❤︎ From「雨酱牌」",
    authorImageUrl: `${BASE_URL}vite.svg`,
    cardbackImage: "UI_Gcg_CardBack_NodKrai",
    displayId: true,
    displayStory: true,
    mirroredLayout: false,
    watermarkText: "",
    debug: false,
    includeTalent: false,
  },
  newItems: INITIAL_NEW_ITEMS,
  adjustments: [],
  versionedActionCardSelection: [],
};

const removeUndefined = <T extends Record<string, unknown>>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => typeof v !== "undefined"),
  ) as T;
};

const formValueFromUrl = {
  general: removeUndefined({
    characterId: Number(search.get("character_id") || Number.NaN) || void 0,
    actionCardId: Number(search.get("action_card_id") || Number.NaN) || void 0,
    version: (versionFromUrl as Version) || void 0,
  }),
  newItems: INITIAL_NEW_ITEMS,
  versionedActionCardSelection: [] as boolean[],
} as const;

const [persistedFormValue, setPersistedFormValue] = makePersisted(
  // eslint-disable-next-line solid/reactivity
  createSignal<FormValue | null>(null),
  {
    name: "card-img-gen-form-value",
    storage: localStorage,
  },
);

const getInitialFormValue = (): FormValue => {
  return R.mergeDeep(
    R.mergeDeep(INITIAL_FORM_VALUE, persistedFormValue() || {}),
    formValueFromUrl,
  );
};

export const App = () => {
  const [config, setConfig] = createSignal<AppConfig>();
  const [versionList] = createResource<Version[]>(
    () => {
      return fetch(`${ASSETS_API_ENDPOINT}/metadata`).then(async (r) =>
        r.ok
          ? (await r.json()).availableVersions
          : Promise.reject(new Error(await r.text())),
      );
    },
    {
      initialValue: [],
    },
  );
  const initialFormValue = getInitialFormValue();
  const [loading, setLoading] = createSignal(false);
  const remoteFetched = {
    version: initialFormValue.general.version,
    language: initialFormValue.general.language,
    data: null as AllRawData | null,
  };
  const onSubmitForm = async (newFormValue: FormValue) => {
    if (import.meta.env.DEV) {
      console.log(newFormValue);
    }
    setPersistedFormValue({
      ...newFormValue,
      newItems: {
        characters: [],
        actionCards: [],
        entities: [],
        keywords: [],
      },
      versionedActionCardSelection: [],
    });
    const prevVersion = remoteFetched.version;
    const newVersion = newFormValue.general.version;
    const prevLanguage = remoteFetched.language;
    const newLanguage = newFormValue.general.language;
    const shouldUpdateData = !(
      prevVersion === newVersion && prevLanguage === newLanguage
    );
    try {
      if (shouldUpdateData || !remoteFetched.data) {
        setLoading(true);
        remoteFetched.version = newVersion;
        remoteFetched.language = newLanguage;
        // fetch new data
        remoteFetched.data = await getData(newVersion, newLanguage);
      }

      const betaVersion = "v9999.0.0" as Version;
      const latestVersion = versionList().at(-1) ?? betaVersion;
      const overrideContext: OverrideContext = {
        version:
          newVersion === "latest"
            ? latestVersion
            : newVersion.endsWith("-beta")
            ? betaVersion
            : newVersion,
        language: newLanguage,
      };
      // override data
      const data = applyOverride(
        structuredClone(remoteFetched.data),
        overrideData,
        overrideContext,
      );

      const skillMapper = (newSkill: NewSkillData): SkillRawData => ({
        ...newSkill,
        hidden: false,
        // we wont use these
        englishName: "",
        description: "",
        targetList: [],
      });
      for (const newCh of newFormValue.newItems.characters || []) {
        data.characters.push({
          ...newCh,
          tags: [newCh.elementTag, newCh.weaponTag, ...newCh.tags],
          skills: newCh.skills.map(skillMapper),
          // we wont use these
          obtainable: false,
          englishName: "",
          cardFace: "",
          icon: "",
        });
      }
      for (const newEt of newFormValue.newItems.entities || []) {
        data.entities.push({
          ...newEt,
          skills: newEt.skills.map(skillMapper),
          // we wont use these
          description: "",
          englishName: "",
          hidden: false,
          remainAfterDie: false,
        });
      }
      for (const newAc of newFormValue.newItems.actionCards || []) {
        data.actionCards.push({
          ...newAc,
          // we wont use these
          obtainable: false,
          englishName: "",
          description: "",
          cardFace: "",
          targetList: [],
          relatedCharacterTags: [],
        });
      }
      for (const newK of newFormValue.newItems.keywords || []) {
        data.keywords.push({
          ...newK,
          // we wont use these
          rawName: "",
          description: "",
        });
      }
      setConfig({
        data,
        ...newFormValue.general,
        adjustments: newFormValue.adjustments,
        versionedActionCardSelection:
          newFormValue.versionedActionCardSelection,
      });
      setMobilePreviewing(true);
    } catch (e) {
      console.error(e);
      alert((e as Error).message || "加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  const filename = () => {
    const c = config();
    if (c?.mode === "character") {
      return `A${c.characterId}`;
    }
    if (c?.mode === "singleActionCard") {
      return `C${c.actionCardId}`;
    }
    if (c?.mode === "versionedActionCards") {
      return c.version || "vX.Y.Z";
    }
    if (c?.mode === "balanceAdjustment") {
      return "balance-adjustment";
    }
    return "card";
  };

  const exportImage = async (config: RenderConfig = {}) => {
    try {
      setRenderMount(captureContainer);
      // make them reflow (?)
      await new Promise((r) => setTimeout(r, 100));
      const blob = await domToBlob(captureContainer, {
        type: `image/${config.format || "png"}`,
        width: captureContainer.scrollWidth,
        height: captureContainer.scrollHeight,
        quality: config.quality || 1,
      });
      if (!blob.size) {
        return null;
      }
      return blob;
    } finally {
      setRenderMount(previewContainer);
    }
  };

  const downloadImage = async (blob: Blob) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${filename()}.png`;
    link.href = objectUrl;
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  };

  const exportAndDownloadImage = async () => {
    const blob = await exportImage();
    if (blob) {
      await downloadImage(blob);
    } else {
      alert("导出图片失败");
    }
  };

  let captureContainer!: HTMLDivElement;
  let previewContainer!: HTMLDivElement;
  const [renderMount, setRenderMount] = createSignal<HTMLElement>();
  const [mobilePreviewing, setMobilePreviewing] = createSignal(false);

  onMount(async () => {
    setRenderMount(previewContainer);
    if (!loading()) {
      try {
        setLoading(true);
        remoteFetched.data = await getData(
          remoteFetched.version,
          remoteFetched.language,
        );
      } catch (e) {
        console.error(e);
        alert((e as Error).message || "加载数据失败");
      } finally {
        setLoading(false);
      }
    }
  });

  const renderImage = async (data: RenderAppOption) => {
    setConfig(data);
    const blob = await exportImage(data.render ?? {});
    if (!blob) {
      throw new Error("导出图片失败");
    }
    const buffer = new Uint8Array(await blob.arrayBuffer());
    return `data:${blob.type};base64,${buffer.toBase64()}`;
  };

  onMount(() => {
    window.renderCardImage = renderImage;
  });

  return (
    <GlobalSettings.Provider
      value={{
        allData: () => config()?.data || EMPTY_DATA,
        language: () => config()?.language || "CHS",
        cardbackImage: () =>
          config()?.cardbackImage || INITIAL_FORM_VALUE.general.cardbackImage,
        displayStory: () => !!config()?.displayStory,
        displayId: () => !!config()?.displayId,
        debug: () => !!config()?.debug,
      }}
    >
      <div
        class="relative h-[100vh] w-[100vw] flex flex-col min-h-0 md:min-w-0 md:flex-row content-center items-center md:overflow-hidden"
        bool:data-dev={import.meta.env.DEV}
      >
        <div class="h-full w-full md:w-[50%] flex flex-col items-start">
          <header class="flex flex-row prose items-center m-4 gap-4">
            <h1 class="mb-0">卡图生成</h1>
          </header>
          <Forms
            initialValue={initialFormValue}
            versionList={versionList.state === "ready" ? versionList() : []}
            loading={loading()}
            onSubmit={onSubmitForm}
          />
        </div>
        <input type="checkbox" checked={mobilePreviewing()} hidden />
        <div class="preview-container" ref={previewContainer}>
          <div class="fixed right-6 top-2 z-1 flex flex-row gap-2">
            <button
              class="btn btn-soft btn-accent md:hidden"
              onClick={() => setMobilePreviewing(false)}
            >
              &times;
            </button>
            <button
              class="btn btn-soft btn-secondary"
              onClick={exportAndDownloadImage}
            >
              导出图片
            </button>
          </div>
        </div>
        <div class="capture-container" ref={captureContainer} />
        <div class="capturing-hint">渲染图片中</div>
      </div>
      <Portal mount={renderMount()}>
        <Show
          when={config()}
          fallback={
            <div class="layout empty" classList={{ loading: loading() }}>
              Loading data...
            </div>
          }
        >
          {(config) => <Renderer {...config()} />}
        </Show>
      </Portal>
    </GlobalSettings.Provider>
  );
};
