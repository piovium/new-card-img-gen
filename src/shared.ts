import type { AllRawData, Language } from "./types.ts";
import {
  normalizeCodeAnalyzerResults,
  type CodeAnalyzerResult,
} from "./codeAnalyzer.ts";

export const ASSETS_API_ENDPOINT = import.meta.env?.ASSETS_API_ENDPOINT || `https://static-data.piovium.org/api/v4`;
// @ts-expect-error Node types
const runtimeEnv = globalThis.process?.env;

export const DATA_CODE_ANALYZER_RESULT_ENDPOINT =
  import.meta.env?.DATA_CODE_ANALYZER_RESULT_ENDPOINT ||
  runtimeEnv?.DATA_CODE_ANALYZER_RESULT_ENDPOINT ||
  "https://play.piovium.org/api/data_code_analyzer_result";

export const getData = async (version: string, language: Language) => {
  const data: Partial<AllRawData> = {};
  await Promise.all(
    (["characters", "action_cards", "entities", "keywords"] as const).map(
      async (category) => {
        const key = category === "action_cards" ? "actionCards" : category;
        data[key] = await fetch(
          `${ASSETS_API_ENDPOINT}/data/${version}/${language}/${category}`
        ).then(async (r) =>
          r.ok
            ? (
                await r.json()
              ).data
            : Promise.reject(new Error(await r.text()))
        );
      }
    )
  );
  return data as AllRawData;
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
