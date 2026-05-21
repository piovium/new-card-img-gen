import type { AllRawData, Language } from "./types";

export const ASSETS_API_ENDPOINT = `https://static-data.piovium.org/api/v4`;

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
