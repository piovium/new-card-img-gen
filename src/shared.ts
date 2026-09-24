import {
  AssetsManager,
  DEFAULT_STATIC_DATA_API_BASE_URL,
  type AssetsManagerOption,
} from "@gi-tcg/assets-manager";
import type { AllRawData, Language, Version } from "./types.ts";
import {
  normalizeCodeAnalyzerResults,
  type CodeAnalyzerResult,
} from "./codeAnalyzer.ts";

const runtimeEnv = (
  globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }
).process?.env;

export const ASSETS_MANAGER_OPTIONS = JSON.parse(
  import.meta.env?.ASSETS_MANAGER_OPTIONS ||
    runtimeEnv?.ASSETS_MANAGER_OPTIONS ||
    "{}",
) as Partial<AssetsManagerOption>;

export const STATIC_DATA_API_BASE_URL =
  ASSETS_MANAGER_OPTIONS.apiBaseUrl || DEFAULT_STATIC_DATA_API_BASE_URL;
export const STATIC_DATA_API_ENDPOINT =
  `${STATIC_DATA_API_BASE_URL.replace(/\/+$/, "")}/api/v5`;

export const DATA_CODE_ANALYZER_RESULT_ENDPOINT =
  import.meta.env?.DATA_CODE_ANALYZER_RESULT_ENDPOINT ||
  runtimeEnv?.DATA_CODE_ANALYZER_RESULT_ENDPOINT ||
  "https://play.piovium.org/api/data_code_analyzer_result";

const assetsManagers = new Map<string, AssetsManager>();

type CategoryData = {
  characters: AllRawData["characters"];
  entities: AllRawData["entities"];
  keywords: AllRawData["keywords"];
};

export const getAssetsManager = (version: Version, language: Language) => {
  const key = `${version}.${language}`;
  let manager = assetsManagers.get(key);
  if (!manager) {
    manager = new AssetsManager({
      apiBaseUrl: STATIC_DATA_API_BASE_URL,
      version,
      language,
      ...ASSETS_MANAGER_OPTIONS,
    });
    assetsManagers.set(key, manager);
  }
  return manager;
};

const getCategory = async <C extends keyof CategoryData>(
  manager: AssetsManager,
  category: C,
): Promise<CategoryData[C]> => {
  try {
    return (await manager.getCategory(category)) as CategoryData[C];
  } catch {
    const categoryData = await manager.getCategory(category, { force: true });
    return (await Promise.all(
      categoryData.map(({ id }) =>
        manager.getData(id).then(async (datum) => {
          if ("skills" in datum) {
            return {
              ...datum,
              skills: await Promise.all(
                datum.skills.map((skill) => manager.getData(skill.id)),
              ),
            };
          } else {
            return datum;
          }
        }),
      ),
    )) as CategoryData[C];
  }
};

export const getData = async (
  version: Version,
  language: Language,
): Promise<AllRawData> => {
  const manager = getAssetsManager(version, language);
  const [characters, entities, keywords] = await Promise.all([
    getCategory(manager, "characters"),
    getCategory(manager, "entities"),
    getCategory(manager, "keywords"),
  ]);
  return { characters, entities, keywords };
};

export interface StaticDataMetadata {
  latestVersion: Version;
  availableVersions: Version[];
}

export const getMetadata = async (): Promise<StaticDataMetadata> => {
  const response = await fetch(`${STATIC_DATA_API_ENDPOINT}/metadata`);
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<StaticDataMetadata>;
};

export const getCodeAnalyzerResults = async (): Promise<
  CodeAnalyzerResult[]
> => {
  const response = await fetch(DATA_CODE_ANALYZER_RESULT_ENDPOINT);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return normalizeCodeAnalyzerResults(await response.json());
};
