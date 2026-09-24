import {
  createMemo,
  createSignal,
  createResource,
  Show,
  onMount,
} from "solid-js";
import {
  type AppConfig,
  type AllRawData,
  type Version,
  VERSION_REGEX,
  type OverrideContext,
  type RenderAppOption,
  type RenderConfig,
} from "./types";
import { GlobalSettings } from "./context";
import "./App.css";
import { Renderer } from "./components/renderer/Renderer";
import { Forms, type FormValue } from "./components/form/Forms";
import { Portal } from "solid-js/web";
import { domToBlob } from "modern-screenshot";
import {
  MOCK_NEW_CHARACTERS,
  MOCK_NEW_ENTITIES,
  MOCK_NEW_KEYWORDS,
} from "./mockData";
import { getMetadata, getCodeAnalyzerResults, getData } from "./shared";
import { applyOverride } from "./override";
import { BASE_URL, overrideData } from "./constants";
import { makePersisted } from "@solid-primitives/storage";
import * as R from "remeda";
import {
  indexCodeAnalyzerResults,
  type CodeAnalyzerResult,
} from "./codeAnalyzer";
import { getNewItemData } from "./formData";

const EMPTY_DATA: AllRawData = {
  keywords: [],
  characters: [],
  entities: [],
};

const search = new URLSearchParams(window.location.search);

let versionFromUrl = search.get("version") || undefined;
if (versionFromUrl && !VERSION_REGEX.test(versionFromUrl)) {
  alert(
    "URL 中的 version 参数格式错误，应为 vX.Y.Z（可带版本后缀）、latest 或 beta",
  );
  versionFromUrl = "latest";
}

const INITIAL_NEW_ITEMS: FormValue["newItems"] = {
  characters: MOCK_NEW_CHARACTERS,
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
  const [metadata] = createResource(getMetadata);
  const versionList = () => metadata()?.availableVersions ?? [];
  const initialFormValue = getInitialFormValue();
  const [loading, setLoading] = createSignal(false);
  const [codeAnalyzerWarning, setCodeAnalyzerWarning] = createSignal<string>();
  const remoteFetched = {
    version: initialFormValue.general.version,
    language: initialFormValue.general.language,
    data: null as AllRawData | null,
  };
  let cachedCodeAnalyzerResults: CodeAnalyzerResult[] | null = null;
  const onSubmitForm = async (newFormValue: FormValue) => {
    if (import.meta.env.DEV) {
      console.log(newFormValue);
    }
    setPersistedFormValue({
      ...newFormValue,
      newItems: {
        characters: [],
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
    setCodeAnalyzerWarning();
    try {
      const shouldFetchData = shouldUpdateData || !remoteFetched.data;
      const shouldFetchCode =
        newFormValue.general.debug && !cachedCodeAnalyzerResults;
      if (shouldFetchData || shouldFetchCode) {
        setLoading(true);
      }

      const dataPromise = shouldFetchData
        ? getData(newVersion, newLanguage)
        : Promise.resolve(remoteFetched.data!);
      const codeAnalyzerPromise = shouldFetchCode
        ? getCodeAnalyzerResults()
            .then((results) => {
              cachedCodeAnalyzerResults = results;
              return results;
            })
            .catch((error: unknown) => {
              console.error(error);
              const message =
                error instanceof Error ? error.message : String(error);
              setCodeAnalyzerWarning(
                `实现代码加载失败，已跳过 Code 区块：${message}`,
              );
              return undefined;
            })
        : Promise.resolve(
            newFormValue.general.debug
              ? cachedCodeAnalyzerResults || undefined
              : undefined,
          );

      if (shouldFetchData) {
        remoteFetched.version = newVersion;
        remoteFetched.language = newLanguage;
      }
      const [remoteData, codeAnalyzerResults] = await Promise.all([
        dataPromise,
        codeAnalyzerPromise,
      ]);
      remoteFetched.data = remoteData;

      const betaVersion = "v9999.0.0" as Version;
      const latestVersion = metadata()?.latestVersion ?? betaVersion;
      const overrideContext: OverrideContext = {
        version:
          newVersion === "latest"
            ? latestVersion
            : newVersion === "beta" || newVersion.endsWith("-beta")
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

      const newItems = getNewItemData(newFormValue.newItems);
      data.characters.push(...newItems.characters);
      data.entities.push(...newItems.entities);
      data.keywords.push(...newItems.keywords);
      setConfig({
        data,
        ...newFormValue.general,
        adjustments: newFormValue.adjustments,
        versionedActionCardSelection: newFormValue.versionedActionCardSelection,
        codeAnalyzerResults,
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
  const codeAnalyzerIndex = createMemo(() =>
    indexCodeAnalyzerResults(config()?.codeAnalyzerResults),
  );

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
        codeAnalyzerIndex,
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
          <Show when={codeAnalyzerWarning()}>
            <div class="alert alert-warning mx-4 mb-2" role="alert">
              <span>{codeAnalyzerWarning()}</span>
            </div>
          </Show>
          <Forms
            initialValue={initialFormValue}
            versionList={metadata.state === "ready" ? versionList() : []}
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
