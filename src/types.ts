import type {
  CharacterRawData,
  EntityRawData,
  KeywordRawData,
  PlayCost,
  SkillRawData,
} from "@gi-tcg/assets-manager";
import type { Accessor } from "solid-js";
import type { CodeAnalyzerResult } from "./codeAnalyzer";

export interface AllRawData {
  keywords: KeywordRawData[];
  characters: CharacterRawData[];
  entities: EntityRawData[];
}

export type Language = "EN" | "CHS";
export type Version =
  | `v${number}.${number}.${number}${"" | `-${string}`}`
  | "latest"
  | "beta";

export const VERSION_REGEX = /^(v\d+\.\d+\.\d+(?:-[\w.-]+)?|latest|beta)$/;

export interface AppConfig {
  mode:
    | "character"
    | "singleActionCard"
    | "versionedActionCards"
    | "balanceAdjustment";
  characterId?: number;
  actionCardId?: number;
  version: Version;
  language: Language;
  authorName?: string;
  authorImageUrl?: string;
  data: AllRawData;
  mirroredLayout?: boolean;
  cardbackImage: string;
  displayId?: boolean;
  displayStory?: boolean;
  watermarkText?: string;
  adjustments?: AdjustmentData[];
  versionedActionCardSelection?: boolean[];
  debug?: boolean;
  includeTalent?: boolean;
  codeAnalyzerResults?: CodeAnalyzerResult[];
}

export interface RenderConfig {
  format?: "png" | "jpeg" | "webp";
  quality?: number;
}

export interface RenderAppOption extends AppConfig {
  render?: RenderConfig;
}

export interface ParsedCharacter extends CharacterRawData {
  parsedSkills: ParsedSkill[];
  iconUrl?: string;
  debugChildren: ParsedChild[];
}
export interface ParsedSkill extends SkillRawData {
  parsedDescription: ParsedDescription;
  children: ParsedChild[];
}
export interface ParsedEntity extends EntityRawData {
  parsedDescription: ParsedDescription;
}
export interface ParsedActionCard extends ParsedEntity {
  children: ParsedChild[];
  debugChildren: ParsedChild[];
}
export interface ParsedKeyword extends KeywordRawData {
  type: "GCG_RULE_EXPLANATION";
  parsedDescription: ParsedDescription;
}
export type ParsedChild = ParsedSkill | ParsedEntity | ParsedKeyword;

export type TokenStyle = "strong" | "light" | "dimmed";
export type DescriptionToken =
  | {
      type: "plain";
      text: string;
      style: () => TokenStyle | "normal";
      color?: string;
    }
  | { type: "boxedKeyword"; text: string }
  | { type: "hiddenKeyword"; id: number }
  | {
      type: "reference";
      refType: string;
      id: number;
      overrideStyle: () => TokenStyle | undefined;
      manualColor?: string;
    }
  | { type: "errored"; text: string }
  | { type: "lineBreak" }
  | { type: "icon"; id: number; overrideStyle: () => TokenStyle | undefined };
export type ParsedDescription = DescriptionToken[];

export interface GlobalSettingsValue {
  allData: Accessor<AllRawData>;
  language: Accessor<Language>;
  cardbackImage: Accessor<string>;
  displayId: Accessor<boolean>;
  displayStory: Accessor<boolean>;
  debug: Accessor<boolean>;
  codeAnalyzerIndex: Accessor<ReadonlyMap<number, CodeAnalyzerResult>>;
}

export interface RenderContext {
  language: Language;
  skills: SkillRawData[];
  keywords: KeywordRawData[];
  genericEntities: EntityRawData[];
  /** suppressed IDs */
  supIds: number[];
  names: Map<number, string>;
  characterToElementKeywordIdMap: Map<number, number>;
  /** Kxxx 的同名 Cxxx 或 Sxxx 条目 */
  keywordToEntityMap: Map<number, SkillRawData | EntityRawData>;
  /** 准备技能的触发角色状态 */
  prepareSkillToEntityMap: Map<number, EntityRawData>;
}

export interface AdjustmentRecord {
  id: string | number;
  subject:
    | "self"
    | "normalAttack"
    | "elementalSkill"
    | "elementalBurst"
    | "passiveSkill"
    | "prepareSkill"
    | "talent"
    | "technique"
    | "techniqueCard"
    | "summon"
    | "status"
    | "combatStatus"
    | "relatedCard";
  type: "hp" | "cost" | "effect" | "damage" | "usage" | "duration";
  oldData: string;
  newData: string;
}

export interface AdjustmentData {
  id: string | number;
  offset: number;
  adjustment: AdjustmentRecord[];
}

export interface OverrideContext {
  version: Version;
  language: Language;
}

export type BasicOverrideData<T> = T extends (infer U)[]
  ? OverrideData<U>[]
  : T extends object
    ? (T extends { id: infer U } ? { id: U } : {}) & {
        [K in keyof T]?: OverrideData<T[K]>;
      }
    : T;

export type FnOverrideData<T> = (T extends { id: infer U } ? { id: U } : {}) &
  ((value: T, context: OverrideContext) => T);

export type OverrideData<T> = BasicOverrideData<T> | FnOverrideData<T>;

export type {
  CharacterRawData,
  EntityRawData,
  KeywordRawData,
  PlayCost,
  SkillRawData,
};
