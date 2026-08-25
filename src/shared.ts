import {
  AssetsManager,
  DEFAULT_ASSETS_API_ENDPOINT,
  type AssetsManagerOption,
} from "@gi-tcg/assets-manager";
import type { AllRawData, Language, Version } from "./types.ts";
import {
  normalizeCodeAnalyzerResults,
  type CodeAnalyzerResult,
} from "./codeAnalyzer.ts";

// @ts-expect-error Node types
const runtimeEnv = globalThis.process?.env;

export const ASSETS_MANAGER_OPTIONS = JSON.parse(
  import.meta.env?.ASSETS_MANAGER_OPTIONS ||
    runtimeEnv?.ASSETS_MANAGER_OPTIONS ||
    "{}",
) as Partial<AssetsManagerOption>;

export const ASSETS_API_ENDPOINT =
  ASSETS_MANAGER_OPTIONS.apiEndpoint || DEFAULT_ASSETS_API_ENDPOINT;

export const DATA_CODE_ANALYZER_RESULT_ENDPOINT =
  import.meta.env?.DATA_CODE_ANALYZER_RESULT_ENDPOINT ||
  runtimeEnv?.DATA_CODE_ANALYZER_RESULT_ENDPOINT ||
  "https://play.piovium.org/api/data_code_analyzer_result";

const assetsManagers = new Map<string, AssetsManager>();

type CategoryData = {
  characters: AllRawData["characters"];
  action_cards: AllRawData["actionCards"];
  entities: AllRawData["entities"];
  keywords: AllRawData["keywords"];
};

export const getAssetsManager = (version: Version, language: Language) => {
  let manager = assetsManagers.get(`${version}.${language}`);
  if (!manager) {
    manager = new AssetsManager({
      apiEndpoint: ASSETS_API_ENDPOINT,
      version,
      language,
      ...ASSETS_MANAGER_OPTIONS,
    });
    assetsManagers.set(language, manager);
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
  const [characters, actionCards, entities, keywords] = await Promise.all([
    getCategory(manager, "characters"),
    getCategory(manager, "action_cards"),
    getCategory(manager, "entities"),
    getCategory(manager, "keywords"),
  ]);
  return { characters, actionCards, entities, keywords };
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
