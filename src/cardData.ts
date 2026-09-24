import type { EntityRawData, PlayCost } from "./types.ts";

export const isActionCard = (entry: { type: string }): boolean =>
  entry.type === "GCG_CARD_EVENT" ||
  entry.type === "GCG_CARD_MODIFY" ||
  entry.type === "GCG_CARD_ASSIST";

export const getVersionedActionCards = (
  entities: EntityRawData[],
  version: string,
  includeTalent = false,
): EntityRawData[] =>
  entities.filter(
    (entry) =>
      isActionCard(entry) &&
      entry.sinceVersion === version &&
      (entry.shareId != null ||
        entry.tags.includes("GCG_TAG_ADVENTURE_PLACE")) &&
      (includeTalent || !entry.tags.includes("GCG_TAG_TALENT")),
  );

export const hasDisplayCost = (entry: {
  type: string;
  playCost?: PlayCost[];
}): boolean =>
  !!entry.playCost &&
  (isActionCard(entry) || entry.type.startsWith("GCG_SKILL_TAG_"));
