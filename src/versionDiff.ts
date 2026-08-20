import type { AllRawData } from "./types";
import { cardFaceUrl, iconUrl } from "./utils";
import versionDiffJson from "./version-diff.json";

export interface VersionDiffInfo {
  /** cardface 图片在 Y 方向距离中心的偏移比例，-1 ~ 1；icon 图片忽略 */
  offset: number;
  version: string;
  remark: string;
}

export const VERSION_DIFF_DATA = versionDiffJson as Record<
  string,
  VersionDiffInfo
>;

export const getVersionDiff = (id: number): VersionDiffInfo | null =>
  VERSION_DIFF_DATA[id] ?? null;

export const NO_DIFF_PLACEHOLDER: VersionDiffInfo = {
  offset: 0,
  version: "最新版本",
  remark: "无改动",
};

export const clampDiffOffset = (offset: number): number =>
  Math.min(1, Math.max(-1, offset));

export interface VersionDiffTarget {
  name: string;
  imageUrl: string;
  /** 图片来源于 cardface，需要裁剪为圆形 */
  fromCardFace: boolean;
}

export const resolveVersionDiffTarget = (
  data: AllRawData,
  id: number,
): VersionDiffTarget | null => {
  const character = data.characters.find((c) => c.id === id);
  if (character) {
    return {
      name: character.name,
      imageUrl: iconUrl(character),
      fromCardFace: false,
    };
  }
  const entity = data.entities.find((e) => e.id === id);
  if (entity && ["GCG_CARD_STATE", "GCG_CARD_ONSTAGE"].includes(entity.type)) {
    return {
      name: entity.name,
      imageUrl: iconUrl(entity),
      fromCardFace: false,
    };
  }
  const actionCard = data.actionCards.find((c) => c.id === id);
  if (actionCard) {
    return {
      name: actionCard.name,
      imageUrl: cardFaceUrl(actionCard),
      fromCardFace: true,
    };
  }
  if (entity) {
    return entity.cardFace
      ? {
          name: entity.name,
          imageUrl: cardFaceUrl(entity),
          fromCardFace: true,
        }
      : { name: entity.name, imageUrl: iconUrl(entity), fromCardFace: false };
  }
  return null;
};

const findTags = (data: AllRawData, id: number): string[] =>
  data.characters.find((c) => c.id === id)?.tags ??
  data.actionCards.find((c) => c.id === id)?.tags ??
  data.entities.find((e) => e.id === id)?.tags ??
  [];

export interface VersionDiffEntry extends VersionDiffInfo {
  id: number;
}

export const getAllVersionDiffs = (data: AllRawData): VersionDiffEntry[] =>
  Object.entries(VERSION_DIFF_DATA)
    .map(([id, info]) => ({ id: Number(id), ...info }))
    .filter(({ id }) => !findTags(data, id).includes("GCG_TAG_TALENT"))
    .sort((a, b) => a.id - b.id);
