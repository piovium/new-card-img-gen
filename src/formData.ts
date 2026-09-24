import type { FormValue, NewSkillData } from "./components/form/Forms.tsx";
import type { AllRawData, SkillRawData } from "./types.ts";

export const getNewItemData = (items: FormValue["newItems"]): AllRawData => {
  const skillMapper = (skill: NewSkillData): SkillRawData => ({
    ...skill,
    hidden: false,
    englishName: "",
    description: "",
    targetList: [],
    keyMap: null,
    iconHash: null,
    icon: skill.icon ?? null,
  });
  return {
    characters: items.characters.map((character) => ({
      ...character,
      tags: [character.elementTag, character.weaponTag, ...character.tags],
      skills: character.skills.map(skillMapper),
      englishName: "",
      cardFace: "",
      icon: "",
      subElements: [],
      shareId: null,
      sinceVersion: null,
      storyTitle: null,
      storyText: character.storyText ?? null,
    })),
    entities: items.entities.map((entity) => ({
      ...entity,
      skills: entity.skills.map(skillMapper),
      description: "",
      englishName: "",
      hidden: false,
      remainAfterDie: false,
      shownTokenName: null,
      shareId: null,
      sinceVersion: null,
      targetList: [],
      relatedCharacterId: entity.relatedCharacterId ?? null,
      relatedCharacterTags: [],
      storyTitle: null,
      storyText: null,
      rawDynamicDescription: null,
      rawPlayingDescription: null,
      dynamicDescription: null,
      playingDescription: null,
      persistEffectType: null,
      hintType: null,
      buffType: null,
      shownToken: null,
      shownIcon: null,
      cardFace: null,
      buffIconHash: null,
      buffIcon: entity.buffIcon ?? null,
    })),
    keywords: items.keywords.map((keyword) => ({
      ...keyword,
      id: -Math.abs(keyword.id),
      rawName: keyword.name,
      description: "",
    })),
  };
};
