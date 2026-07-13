import type {
  Language,
  CharacterRawData,
  EntityRawData,
  ActionCardRawData,
  OverrideData,
  AllRawData,
} from "./types";
import { defineOverride } from "./override.ts";

// @ts-expect-error Node.js types
export const BASE_URL = (import.meta.env?.BASE_URL || (typeof process !== "undefined" ? process.env.BASE_URL : "")) || "";

export const CHILDREN_CONFIG: Record<number, string> = {
  11154: "$[C111159],$[C111152],$[C111153],$[C111154],$[C111155]", // 爱可菲 P
  12082: "$[C112081],$[C112082]", // 妮露 E
  12111: "_", // 芙宁娜 A  // 置空不能空着，随便写点啥，下同
  12132: "$[C112131],$[C112132],$[C112133],$[C122]", // 希格雯 E
  12134: "$[C112101]", // 希格雯 P
  12142: "$[C112142],$[S1121422],$[C112143],$[C112141]", // 玛拉妮 E
  13141: "_", // 阿蕾奇诺 A
  13152:
    "$[C113151],$[C113154],$[S1131541],$[C113155],$[S1131551],$[C113156],$[S1131561],$[S13155]", // 玛薇卡 E
  14091: "_", // 丽莎 A
  14092: "$[C114091]", // 丽莎 E
  14121: "_", // 克洛琳德 A
  14151: "_", // 瓦雷莎 A
  14174: "$[K3001],$[C205],$[C204],$[C207]", // 伊涅芙 P
  14182: "$[C114181],$[S14185]", // 菲林斯 E
  14184: "$[K3001],$[C205],$[C204]", // 菲林斯 P
  15114: "$[C115113],$[C115114],$[C115115],$[C115116],$[C115117]", // 恰斯卡 P
  15133: "$[C115133],$[C115134],$[C115135],$[C115136]", // 鹿野院 Q
  15153: "$[C115153],$[C115154],$[C115155],$[C115156]", // 伊法 Q
  15162: "$[C170]", // 雅珂达 E
  15164: "$[C115161],$[C115162],$[C115163],$[C115164],$[C115165],$[C202]", // 雅珂达 P
  16063: "$[C116062]", // 五郎 Q
  16092: "$[C116091],$[C116092],$[C116093],$[C116095],$[C116096]", // 千织 E
  216091: "$[C116094]", // 千织 天赋
  16111: "_", // 希诺宁 A
  16113: "_", // 希诺宁 Q
  17082: "$[C117082]", // 卡维 E
  21022: "$[C121022]", // 女士 E
  21023: "_", // 女士 Q
  21024: "$[C121021],$[K1013],$[S63011],$[S63012],$[S63013],$[C163011]", // 女士 P
  221031: "$[C121022]", // 无相冰 天赋
  21052: "$[C121051],$[C121054],$[C121055],$[C121056],$[C121057],$[C121058],$[C121059],$[C203],$[C121052],$[C172],$[C202]", // 灵觉隐修的迷者 E
  22012: "$[C122011],$[C122012],$[C122013]", // 纯水精灵 E1
  22013: "_", // 纯水精灵 E2
  22052: "_", // 水丘丘 E
  22053: "$[C122051],$[S1220511],$[S1220512]$[C122052]", // 水丘丘 Q
  23032: "$[C123032]", // 火镀金旅团 E
  23053: "_", // 火龙王 Q
  27032: "$[C127033]", // 草镀金旅团 E
  322027:
    "$[C302206],$[C302207],$[C302208],$[C302209],$[C302210],$[C302211],$[C302212],$[C302213],$[C302214],$[C302215]", // 瑟琳
  322033:
    "$[K1050],$[C302229],$[C302230],$[C302231],$[C302220],$[C302221],$[C302222],$[C302223],$[C302224],$[C302225],$[C302226],$[C302227],$[C302228]", // 乐平波琳
  330012: "$[C300008],$[C300009]", // 沙中遗事
  331702: "_", // 草共鸣
  332016: "$[C303216],$[C303217],$[C303218],$[C303219]", // 愚人众的阴谋
  332032: "$[C332033],$[C332034],$[C332035]", // 幻戏倒计时
  333020: "$[C333021],$[C333022],$[C333023],$[C333024],$[C333025],$[C333026]", // 奇瑰之汤
  333027: "_", // 纵声欢唱
} as Record<number, string>;

// 需要展示的规则解释ID
export const SHOWN_KEYWORDS = [
  1012, // 汲取对应元素的力量
  1013, // 「焚尽的炽炎魔女」
  1050, // 投资计划
  7, // 距离我方出战角色最近的角色
  66, // 冒险
  67, // 元素幻变
  3001, // 月感电
  // 3002, // 当前元素骰费用
  3009, // 月绽放
];

export const COST_READONLY_ENTITIES = [
  111159, // 爱可菲
  112131,
  112132,
  112133, // 希格雯 激愈水球
  112142, // 玛拉妮
  13164, // 嘉明
  115112, // 恰斯卡
  115142, // 梦见月瑞希
  115152, // 伊法
  116102, // 卡齐娜
  116112, // 希诺宁
  300008,
  300009, // 沙中遗事
  302220,
  302221,
  302222,
  302223,
  302224,
  302225,
  302226,
  302227,
  302228,
  302229,
  302230,
  302231, // 乐平波琳
  333021,
  333022,
  333023,
  333024,
  333025,
  333026, // 奇瑰之汤
  17126, // 奈芙尔 幻戏
  121054,
  121055,
  121056,
  121057,
  121058,
  121059, // 灵觉隐修的迷者 浮彩
];

export const CARD_NORMAL_FRAME = `${
  BASE_URL
}assets/frame/card_frame_normal.png`;
export const CARD_LEGEND_FRAME = `${
  BASE_URL
}assets/frame/card_frame_legend.png`;
export const KEYWORD_CARD_FRAME = `${
  BASE_URL
}assets/frame/keyword_card_frame.png`;
export const KEYWORD_CARDBACK_REPEAT = `${
  BASE_URL
}assets/frame/card_back_repeat.png`;
export const KEYWORD_CARDBACK_BOTTOM = `${
  BASE_URL
}assets/frame/card_back_bottom.png`;
export const PAGE_TITLE_ICON = `${
  BASE_URL
}assets/frame/pagetitle.png`;
export const BLOCK_CARD_MASK = `${
  BASE_URL
}assets/frame/block_card_mask.png`;
export const NEW_SIGN_CHS = `${
  BASE_URL
}assets/frame/new_CHS.png`;
export const NEW_SIGN_EN = `${BASE_URL}assets/frame/new_EN.png`;
export const OLD_SIGN_CHS = `${
  BASE_URL
}assets/frame/old_CHS.png`;
export const OLD_SIGN_EN = `${BASE_URL}assets/frame/old_EN.png`;

export const AVATAR_CARD_HP = `${
  BASE_URL
}assets/UI_TeyvatCard_LifeBg.png`;
export const AVATAR_CARD_ENERGY = `${
  BASE_URL
}assets/UI_TeyvatCard_LifeBg3.png`;
export const SPECIAL_ENERGY_MAP: Record<
  number,
  { type: string; count: number }
> = {
  1315: {
    type: `${BASE_URL}assets/UI_TeyvatCard_LifeBg_Mavuika1.png`,
    count: 3,
  },
  1116: {
    type: `${BASE_URL}assets/UI_TeyvatCard_LifeBg_SKK01.png`,
    count: 1,
  },
};

export const COST_TYPE_IMG_NAME_MAP: Record<string, string> = {
  GCG_COST_DICE_VOID: "Diff",
  GCG_COST_DICE_CRYO: "Ice",
  GCG_COST_DICE_HYDRO: "Water",
  GCG_COST_DICE_PYRO: "Fire",
  GCG_COST_DICE_ELECTRO: "Electric",
  GCG_COST_DICE_ANEMO: "Wind",
  GCG_COST_DICE_GEO: "Rock",
  GCG_COST_DICE_DENDRO: "Grass",
  GCG_COST_DICE_SAME: "Same",
  GCG_COST_ENERGY: "Energy",
  GCG_COST_LEGEND: "Legend",
  GCG_COST_SPECIAL_ENERGY: "Energy_Mavuika",
  GCG_COST_SKIRK_SPECIAL_ENERGY: "Energy_SKK",
};

export const COST_TYPE_SPRITE_MAP: Record<string, string> = {
  GCG_COST_DICE_VOID: "{SPRITE_PRESET#1109}",
  GCG_COST_DICE_CRYO: "{SPRITE_PRESET#1101}",
  GCG_COST_DICE_HYDRO: "{SPRITE_PRESET#1102}",
  GCG_COST_DICE_PYRO: "{SPRITE_PRESET#1103}",
  GCG_COST_DICE_ELECTRO: "{SPRITE_PRESET#1104}",
  GCG_COST_DICE_ANEMO: "{SPRITE_PRESET#1105}",
  GCG_COST_DICE_GEO: "{SPRITE_PRESET#1106}",
  GCG_COST_DICE_DENDRO: "{SPRITE_PRESET#1107}",
  GCG_COST_DICE_SAME: "{SPRITE_PRESET#1108}",
  GCG_COST_ENERGY: "{SPRITE_PRESET#1110}",
  GCG_COST_LEGEND: "{SPRITE_PRESET#1112}",
  GCG_COST_SPECIAL_ENERGY: "{SPRITE_PRESET#4008}",
  GCG_COST_SKIRK_SPECIAL_ENERGY: "{SPRITE_PRESET#4009}",
};

export const TYPE_TAG_TEXT_MAP: Record<Language, Record<string, string>> = {
  CHS: {
    GCG_RULE_EXPLANATION: "规则解释",
    GCG_SKILL_TAG_A: "普通攻击",
    GCG_SKILL_TAG_E: "元素战技",
    GCG_SKILL_TAG_Q: "元素爆发",
    GCG_SKILL_TAG_PASSIVE: "被动技能",
    GCG_SKILL_TAG_VEHICLE: "特技",
    GCG_CARD_EVENT: "事件牌",
    GCG_CARD_ONSTAGE: "出战状态",
    GCG_CARD_STATE: "状态",
    GCG_CARD_SUMMON: "召唤物",
    GCG_CARD_ASSIST: "支援牌",
    GCG_CARD_MODIFY: "装备牌",
    GCG_CARD_ATTACHMENT: "附着效果状态",
    GCG_TAG_ELEMENT_CRYO: "冰元素",
    GCG_TAG_ELEMENT_HYDRO: "水元素",
    GCG_TAG_ELEMENT_PYRO: "火元素",
    GCG_TAG_ELEMENT_ELECTRO: "雷元素",
    GCG_TAG_ELEMENT_ANEMO: "风元素",
    GCG_TAG_ELEMENT_GEO: "岩元素",
    GCG_TAG_ELEMENT_DENDRO: "草元素",
    GCG_TAG_NATION_MONDSTADT: "蒙德",
    GCG_TAG_NATION_LIYUE: "璃月",
    GCG_TAG_NATION_INAZUMA: "稻妻",
    GCG_TAG_NATION_SUMERU: "须弥",
    GCG_TAG_NATION_FONTAINE: "枫丹",
    GCG_TAG_NATION_NATLAN: "纳塔",
    GCG_TAG_NATION_NODKRAI: "挪德卡莱",
    GCG_TAG_NATION_SNEZHNAYA: "至冬",
    GCG_TAG_NATION_KHAENRIAH: "坎瑞亚",
    GCG_TAG_NATION_COSMIC_CALAMITY: "寰宇劫灭",
    GCG_TAG_HEXENZIRKEL: "魔导",
    GCG_TAG_CAMP_EREMITE: "镀金旅团",
    GCG_TAG_CAMP_FATUI: "愚人众",
    GCG_TAG_CAMP_MONSTER: "魔物",
    GCG_TAG_CAMP_SACREAD: "圣骸兽",
    GCG_TAG_CAMP_HILICHURL: "丘丘人",
    GCG_TAG_CAMP_KAIRAGI: "海乱鬼",
    GCG_TAG_ARKHE_PNEUMA: "始基力：荒性",
    GCG_TAG_ARKHE_OUSIA: "始基力：芒性",
    GCG_TAG_WEAPON: "武器",
    GCG_TAG_WEAPON_BOW: "弓",
    GCG_TAG_WEAPON_SWORD: "单手剑",
    GCG_TAG_WEAPON_CLAYMORE: "双手剑",
    GCG_TAG_WEAPON_POLE: "长柄武器",
    GCG_TAG_WEAPON_CATALYST: "法器",
    GCG_TAG_WEAPON_NONE: "其它武器",
    GCG_TAG_ARTIFACT: "圣遗物",
    GCG_TAG_TALENT: "天赋",
    GCG_TAG_VEHICLE: "特技",
    GCG_TAG_LEGEND: "秘传",
    GCG_TAG_FOOD: "料理",
    GCG_TAG_RESONANCE: "元素共鸣",
    GCG_TAG_PLACE: "场地",
    GCG_TAG_ALLY: "伙伴",
    GCG_TAG_ITEM: "道具",
    GCG_TAG_CARD_BLESSING: "元素幻变",
    GCG_TAG_PREPARE_SKILL: "准备技能",
    GCG_TAG_NYX_STATE: "夜魂态",
    GCG_TAG_SHEILD: "护盾",
    GCG_TAG_SUB_HURT: "减伤",
    GCG_TAG_DENDRO_PRODUCE: "草元素产物",
    GCG_TAG_FALL_ATTACK: "普通攻击视为下落攻击",
    GCG_TAG_FORBIDDEN_ATTACK: "无法行动",
    GCG_TAG_IMMUNE_CONTROL: "免疫控制",
    GCG_TAG_IMMUNE_FREEZING: "免疫冻结",
    GCG_TAG_SLOWLY: "战斗行动",
    GCG_TAG_NATION_SIMULANKA: "希穆兰卡",
    GCG_TAG_ADVENTURE_PLACE: "冒险地点",
  },
  EN: {
    GCG_RULE_EXPLANATION: "Detailed Rules",
    GCG_SKILL_TAG_A: "Normal Attack",
    GCG_SKILL_TAG_E: "Elemental Skill",
    GCG_SKILL_TAG_Q: "Elemental Burst",
    GCG_SKILL_TAG_PASSIVE: "Passive Skill",
    GCG_SKILL_TAG_VEHICLE: "Technique",
    GCG_CARD_EVENT: "Event Card",
    GCG_CARD_ONSTAGE: "Combat Status",
    GCG_CARD_STATE: "Status",
    GCG_CARD_SUMMON: "Summon",
    GCG_CARD_ASSIST: "Support Card",
    GCG_CARD_MODIFY: "Equipment Card",
    GCG_CARD_ATTACHMENT: "Attachment Status",
    GCG_TAG_ELEMENT_CRYO: "Cryo",
    GCG_TAG_ELEMENT_HYDRO: "Hydro",
    GCG_TAG_ELEMENT_PYRO: "Pyro",
    GCG_TAG_ELEMENT_ELECTRO: "Electro",
    GCG_TAG_ELEMENT_ANEMO: "Anemo",
    GCG_TAG_ELEMENT_GEO: "Geo",
    GCG_TAG_ELEMENT_DENDRO: "Dendro",
    GCG_TAG_NATION_MONDSTADT: "Mondstadt",
    GCG_TAG_NATION_LIYUE: "Liyue",
    GCG_TAG_NATION_INAZUMA: "Inazuma",
    GCG_TAG_NATION_SUMERU: "Sumeru",
    GCG_TAG_NATION_FONTAINE: "Fontaine",
    GCG_TAG_NATION_NATLAN: "Natlan",
    GCG_TAG_NATION_NODKRAI: "Nod-Krai",
    GCG_TAG_NATION_SNEZHNAYA: "Snezhnaya",
    GCG_TAG_NATION_KHAENRIAH: "Khaenri'ah",
    GCG_TAG_NATION_COSMIC_CALAMITY: "Cosmic Calamity",
    GCG_TAG_HEXENZIRKEL: "Hexerei",
    GCG_TAG_CAMP_EREMITE: "The Eremites",
    GCG_TAG_CAMP_FATUI: "Fatui",
    GCG_TAG_CAMP_MONSTER: "Monster",
    GCG_TAG_CAMP_SACREAD: "Consecrated Beast",
    GCG_TAG_CAMP_HILICHURL: "Hilichurl",
    GCG_TAG_CAMP_KAIRAGI: "Kairagi",
    GCG_TAG_ARKHE_PNEUMA: "Arkhe: Ousia", // 神秘原神，荒芒不分
    GCG_TAG_ARKHE_OUSIA: "Arkhe: Pneuma",
    GCG_TAG_WEAPON: "Weapon",
    GCG_TAG_WEAPON_BOW: "Bow",
    GCG_TAG_WEAPON_SWORD: "Sword",
    GCG_TAG_WEAPON_CLAYMORE: "Claymore",
    GCG_TAG_WEAPON_POLE: "Polearm",
    GCG_TAG_WEAPON_CATALYST: "Catalyst",
    GCG_TAG_WEAPON_NONE: "Other Weapons",
    GCG_TAG_ARTIFACT: "Artifact",
    GCG_TAG_TALENT: "Talent",
    GCG_TAG_VEHICLE: "Technique",
    GCG_TAG_LEGEND: "Arcane Legend",
    GCG_TAG_FOOD: "Food",
    GCG_TAG_RESONANCE: "Elemental Resonance",
    GCG_TAG_PLACE: "Location",
    GCG_TAG_ALLY: "Companion",
    GCG_TAG_ITEM: "Item",
    GCG_TAG_CARD_BLESSING: "Elemental Transfiguration",
    GCG_TAG_PREPARE_SKILL: "Preparing Skill",
    GCG_TAG_NYX_STATE: "Nightsoul State",
    GCG_TAG_SHEILD: "Sheild",
    GCG_TAG_SUB_HURT: "Damage Reduction",
    GCG_TAG_DENDRO_PRODUCE: "Dendro Construct",
    GCG_TAG_FALL_ATTACK: "Normal Attacks count as Plunging Attacks",
    GCG_TAG_FORBIDDEN_ATTACK: "Unable to Act",
    GCG_TAG_IMMUNE_CONTROL: "Immune to Disables",
    GCG_TAG_IMMUNE_FREEZING: "Immune to Frozen",
    GCG_TAG_SLOWLY: "Combat Action",
    GCG_TAG_NATION_SIMULANKA: "Simulanka",
    GCG_TAG_ADVENTURE_PLACE: "Adventure Spot",
  },
};

export const DEBUG_TAG_TEXT_MAP: Record<Language, Record<string, string>> = {
  CHS: {
    GCG_TAG_NON_DISCOVERABLE: "不可发现",
    GCG_DATA_HIDDEN: "隐藏",
    GCG_DATA_REMAIN: "击倒保留",
    GCG_TOKEN_ICON_BARRIER_SHIELD: "ICON_BARRIER",
    GCG_TOKEN_ICON_CLOCK: "ICON_CLOCK",
    GCG_TOKEN_ICON_HOURGLASS: "ICON_HOURGLASS",
  },
  EN: {
    // GCG_TAG_NON_DISCOVERABLE: "",
    // GCG_DATA_HIDDEN: "",
    // GCG_DATA_REMAIN: "",
    // GCG_TOKEN_ICON_BARRIER_SHIELD: "",
    // GCG_TOKEN_ICON_CLOCK: "",
    // GCG_TOKEN_ICON_HOURGLASS: "",
  },
};

export const TYPE_TAG_IMG_NAME_MAP: Record<string, string> = {
  GCG_CARD_EVENT: "Custom_ActionCard",
  GCG_CARD_ONSTAGE: "Custom_Summon",
  GCG_CARD_STATE: "Custom_Summon",
  GCG_CARD_SUMMON: "Custom_Summon",
  GCG_CARD_ASSIST: "Custom_ActionCard",
  GCG_CARD_MODIFY: "Custom_ActionCard",
  GCG_TAG_ELEMENT_CRYO: "Element_Ice",
  GCG_TAG_ELEMENT_HYDRO: "Element_Water",
  GCG_TAG_ELEMENT_PYRO: "Element_Fire",
  GCG_TAG_ELEMENT_ELECTRO: "Element_Electric",
  GCG_TAG_ELEMENT_ANEMO: "Element_Wind",
  GCG_TAG_ELEMENT_GEO: "Element_Rock",
  GCG_TAG_ELEMENT_DENDRO: "Element_Grass",
  GCG_TAG_NATION_MONDSTADT: "Faction_Mondstadt",
  GCG_TAG_NATION_LIYUE: "Faction_Liyue",
  GCG_TAG_NATION_INAZUMA: "Faction_Inazuma",
  GCG_TAG_NATION_SUMERU: "Faction_Sumeru",
  GCG_TAG_NATION_FONTAINE: "Faction_Fontaine",
  GCG_TAG_NATION_NATLAN: "Faction_Natlan",
  GCG_TAG_NATION_NODKRAI: "Faction_NodKrai",
  GCG_TAG_NATION_SNEZHNAYA: "Faction_Snezhnaya",
  GCG_TAG_NATION_COSMIC_CALAMITY: "Faction_CosmicCalamity",
  GCG_TAG_HEXENZIRKEL: "Hexenzirkel",
  GCG_TAG_CAMP_EREMITE: "Faction_Eremite",
  GCG_TAG_CAMP_FATUI: "Faction_Fatui",
  GCG_TAG_CAMP_MONSTER: "Faction_Monster",
  GCG_TAG_CAMP_SACREAD: "Faction_Sacred",
  GCG_TAG_CAMP_HILICHURL: "Faction_Hili",
  GCG_TAG_ARKHE_PNEUMA: "Faction_Pneuma",
  GCG_TAG_ARKHE_OUSIA: "Faction_Ousia",
  GCG_TAG_WEAPON: "Card_Weapon",
  GCG_TAG_WEAPON_BOW: "Weapon_Bow",
  GCG_TAG_WEAPON_SWORD: "Weapon_Sword",
  GCG_TAG_WEAPON_CLAYMORE: "Weapon_Claymore",
  GCG_TAG_WEAPON_POLE: "Weapon_Polearm",
  GCG_TAG_WEAPON_CATALYST: "Weapon_Catalyst",
  GCG_TAG_WEAPON_NONE: "Weapon_None",
  GCG_TAG_ARTIFACT: "Card_Relic",
  GCG_TAG_TALENT: "Card_Talent",
  GCG_TAG_VEHICLE: "Card_Vehicle",
  GCG_TAG_LEGEND: "Card_Legend",
  GCG_TAG_FOOD: "Card_Food",
  GCG_TAG_RESONANCE: "Card_Sync",
  GCG_TAG_PLACE: "Card_Location",
  GCG_TAG_ALLY: "Card_Ally",
  GCG_TAG_ITEM: "Card_Item",
  GCG_TAG_CARD_BLESSING: "Card_Blessing",
  GCG_TAG_SLOWLY: "Card_CombatAction",
  GCG_TAG_NATION_SIMULANKA: "Card_Simulanka", // ###非官方###
  GCG_TAG_ADVENTURE_PLACE: "Card_Adventure", // ###非官方###
};

export const ELEMENT_TAG_TO_KEYWORD_ID: Record<string, number> = {
  GCG_TAG_ELEMENT_CRYO: 301,
  GCG_TAG_ELEMENT_HYDRO: 302,
  GCG_TAG_ELEMENT_PYRO: 303,
  GCG_TAG_ELEMENT_ELECTRO: 304,
  GCG_TAG_ELEMENT_ANEMO: 305,
  GCG_TAG_ELEMENT_GEO: 306,
  GCG_TAG_ELEMENT_DENDRO: 307,
};

export const DESCRIPTION_ICON_IMAGES = {
  4007: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_Keyword_Shield.png`,
  },
  2100: {
    imageUrl: `${
      BASE_URL
    }assets/UI_Gcg_Keyword_Element_Physics.png`,
  },
  2101: {
    imageUrl: `${
      BASE_URL
    }assets/UI_Gcg_Keyword_Element_Ice.png`,
  },
  2102: {
    imageUrl: `${
      BASE_URL
    }assets/UI_Gcg_Keyword_Element_Water.png`,
  },
  2103: {
    imageUrl: `${
      BASE_URL
    }assets/UI_Gcg_Keyword_Element_Fire.png`,
  },
  2104: {
    imageUrl: `${
      BASE_URL
    }assets/UI_Gcg_Keyword_Element_Electric.png`,
  },
  2105: {
    imageUrl: `${
      BASE_URL
    }assets/UI_Gcg_Keyword_Element_Wind.png`,
  },
  2106: {
    imageUrl: `${
      BASE_URL
    }assets/UI_Gcg_Keyword_Element_Rock.png`,
  },
  2107: {
    imageUrl: `${
      BASE_URL
    }assets/UI_Gcg_Keyword_Element_Grass.png`,
  },
  1101: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_DiceL_Ice.png`,
  },
  1102: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_DiceL_Water.png`,
  },
  1103: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_DiceL_Fire.png`,
  },
  1104: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_DiceL_Elec.png`,
  },
  1105: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_DiceL_Wind.png`,
  },
  1106: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_DiceL_Rock.png`,
  },
  1107: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_DiceL_Grass.png`,
  },
  1108: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_DiceL_Same.png`,
  },
  1109: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_DiceL_Diff.png`,
  },
  1110: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_Keyword_Energy.png`,
  },
  1111: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_DiceL_Any.png`,
  },
  1112: {
    imageUrl: `${BASE_URL}assets/UI_Gcg_Keyword_Legend.png`,
  },
  4008: {
    //  ###非官方###
    imageUrl: `${
      BASE_URL
    }assets/UI_Gcg_Keyword_Fighting_Spirit.png`,
  },
  4009: {
    //  ###非官方###
    imageUrl: `${BASE_URL}assets/UI_Gcg_Keyword_Energy_SKK.png`,
  },
  3003: { tagIcon: "GCG_TAG_WEAPON" },
  3004: { tagIcon: "GCG_TAG_ARTIFACT" },
  3006: { tagIcon: "GCG_TAG_TALENT" },
  3007: { tagIcon: "GCG_TAG_LEGEND" },
  3008: { tagIcon: "GCG_TAG_VEHICLE" },
  3101: { tagIcon: "GCG_TAG_FOOD" },
  3102: { tagIcon: "GCG_TAG_ITEM" },
  3103: { tagIcon: "GCG_TAG_ALLY" },
  3104: { tagIcon: "GCG_TAG_PLACE" },
  3200: { tagIcon: "GCG_TAG_WEAPON_NONE" },
  3201: { tagIcon: "GCG_TAG_WEAPON_CATALYST" },
  3202: { tagIcon: "GCG_TAG_WEAPON_BOW" },
  3203: { tagIcon: "GCG_TAG_WEAPON_CLAYMORE" },
  3204: { tagIcon: "GCG_TAG_WEAPON_POLE" },
  3205: { tagIcon: "GCG_TAG_WEAPON_SWORD" },
  3401: { tagIcon: "GCG_TAG_NATION_MONDSTADT" },
  3402: { tagIcon: "GCG_TAG_NATION_LIYUE" },
  3403: { tagIcon: "GCG_TAG_NATION_INAZUMA" },
  3404: { tagIcon: "GCG_TAG_NATION_SUMERU" },
  3405: { tagIcon: "GCG_TAG_NATION_FONTAINE" },
  3406: { tagIcon: "GCG_TAG_NATION_NATLAN" },
  3407: { tagIcon: "GCG_TAG_NATION_NODKRAI" },
  3408: { tagIcon: "GCG_TAG_NATION_SNEZHNAYA" },
  3501: { tagIcon: "GCG_TAG_CAMP_FATUI" },
  3502: { tagIcon: "GCG_TAG_CAMP_HILICHURL" },
  3503: { tagIcon: "GCG_TAG_CAMP_MONSTER" },
  3504: { tagIcon: "GCG_TAG_ARKHE_PNEUMA" },
  3505: { tagIcon: "GCG_TAG_ARKHE_OUSIA" },
  // ?: { tagIcon: "GCG_TAG_CAMP_SACREAD" },
  // ?: { tagIcon: "GCG_TAG_CAMP_EREMITE" },
  3901: { tagIcon: "GCG_TAG_ADVENTURE_PLACE" }, //  ###非官方###
} as Record<number, { imageUrl?: string; tagIcon?: string }>;

export const KEYWORD_COLORS: Record<number, string> = {
  // 充能
  310: "#d8b456",

  // 伤害
  100: "#d9b253",
  101: "#63bacd",
  102: "#488ccb",
  103: "#d6684b",
  104: "#917ce8",
  105: "#5ca8a6",
  106: "#d29d5d",
  107: "#88b750",

  // 自走棋伤害
  // 150: "#d9b253",
  // 151: "#63bacd",
  // 152: "#488ccb",
  // 153: "#d6684b",
  // 154: "#917ce8",
  // 155: "#5ca8a6",
  // 156: "#d29d5d",
  // 157: "#88b750",

  // 附着
  201: "#63bacd",
  202: "#488ccb",
  203: "#d6684b",
  204: "#917ce8",
  // 205: "#5ca8a6",
  // 206: "#d29d5d",
  207: "#88b750",

  // 元素相关反应
  211: "#63bacd",
  212: "#488ccb",
  213: "#d6684b",
  214: "#917ce8",
  215: "#5ca8a6",
  216: "#d29d5d",
  217: "#88b750",

  // 自走棋元素相关反应
  // 261: "#63bacd",
  // 262: "#488ccb",
  // 263: "#d6684b",
  // 264: "#917ce8",
  // 265: "#5ca8a6",
  // 266: "#d29d5d",
  // 267: "#88b750",

  // 元素骰子
  301: "#63bacd",
  302: "#488ccb",
  303: "#d6684b",
  304: "#917ce8",
  305: "#5ca8a6",
  306: "#d29d5d",
  307: "#88b750",
};

export const DAMAGE_KEYWORD_MAP: Record<string, number> = {
  GCG_ELEMENT_PHYSIC: 100,
  GCG_ELEMENT_CRYO: 101,
  GCG_ELEMENT_HYDRO: 102,
  GCG_ELEMENT_PYRO: 103,
  GCG_ELEMENT_ELECTRO: 104,
  GCG_ELEMENT_ANEMO: 105,
  GCG_ELEMENT_GEO: 106,
  GCG_ELEMENT_DENDRO: 107,
};

export const BOLD_COLOR = "#FFFFFFFF";

export const ADJUSTMENT_SUBJECT_LABELS: Record<
  Language,
  Record<string, string>
> = {
  CHS: {
    self: "自身",
    normalAttack: "普通攻击",
    elementalSkill: "元素战技",
    elementalBurst: "元素爆发",
    passiveSkill: "被动技能",
    prepareSkill: "准备技能",
    talent: "天赋牌",
    technique: "特技",
    techniqueCard: "特技牌",
    summon: "召唤物",
    status: "状态",
    combatStatus: "出战状态",
    relatedCard: "衍生卡牌",
  },
  EN: {
    self: "Self",
    normalAttack: "Normal Attack",
    elementalSkill: "Elemental Skill",
    elementalBurst: "Elemental Burst",
    passiveSkill: "Passive Skill",
    prepareSkill: "Prepare Skill",
    talent: "Talent Card",
    technique: "Technique",
    techniqueCard: "Technique Card",
    summon: "Summon",
    status: "Status",
    combatStatus: "Combat Status",
    relatedCard: "Related Card",
  },
};

export const ADJUSTMENT_TYPE_LABELS: Record<
  Language,
  Record<string, string>
> = {
  CHS: {
    hp: "初始最大生命值",
    cost: "所需元素骰费用",
    effect: "效果",
    damage: "伤害",
    usage: "可用次数",
    duration: "持续回合",
  },
  EN: {
    hp: "Initial Max HP",
    cost: "Elemental Dice cost",
    effect: "Effect",
    damage: "DMG",
    usage: "Usage(s)",
    duration: "Duration",
  },
};

export const VERSION_REPLACE_STRS: Record<string, Record<Language, string>> = {
  "6.0": {
    CHS: "「月之一」",
    EN: "Luna I",
  },
  "6.1": {
    CHS: "「月之二」",
    EN: "Luna II",
  },
  "6.2": {
    CHS: "「月之三」",
    EN: "Luna III",
  },
  "6.3": {
    CHS: "「月之四」",
    EN: "Luna IV",
  },
  "6.4": {
    CHS: "「月之五」",
    EN: "Luna V",
  },
  "6.5": {
    CHS: "「月之六」",
    EN: "Luna VI",
  },
  "6.6": {
    CHS: "「月之七」",
    EN: "Luna VII",
  },
  "6.7": {
    CHS: "「月之八」",
    EN: "Luna VIII",
  },
};

export const ADVENTURE_PLACE_ADDITIONAL_DESC: Record<Language, string> = {
  CHS: `（「{SPRITE_PRESET#3901}冒险地点」只能通过$[K66]生成，无法加入牌组）`,
  EN: `(You cannot add {SPRITE_PRESET#3901}$[K66] Spot to your deck)`,
};

export function delicateFightingSpirit(before: string) {
  return before
    .replaceAll("战意", "<color=#D8B456FF>{SPRITE_PRESET#4008}战意</color>")
    .replaceAll(
      "Fighting Spirit",
      "<color=#D8B456FF>{SPRITE_PRESET#4008}Fighting Spirit</color>",
    );
}

export function delicateSerpentsSubtlety(before: string) {
  return before
    .replaceAll(
      "蛇之狡谋",
      "<color=#543BA7FF>{SPRITE_PRESET#4009}蛇之狡谋</color>",
    )
    .replaceAll(
      "Serpent's Subtlety",
      "<color=#543BA7FF>{SPRITE_PRESET#4009}Serpent's Subtlety</color>",
    );
}

// 覆盖数据 - 用于部分更新现有数据
export const overrideData: OverrideData<AllRawData> = {
  characters: [
    defineOverride<CharacterRawData>(null, null, {
      id: 1315, // 玛薇卡
      skills: [
        {
          id: 13153, // 玛薇卡 Q 增加战意图标 ###非官方###
          rawDescription: delicateFightingSpirit,
        },
        {
          id: 13154, // 玛薇卡 P 增加战意图标 ###非官方###
          rawDescription: (before: string) =>
            delicateFightingSpirit(before)
              .replace("<color=#FFFFFFFF>充能</color>", "$[K310]")
              .replace("<color=#FFFFFFFF>Energy</color>", "$[K310]"),
        },
      ],
    }),
    defineOverride<CharacterRawData>(null, "CHS", {
      id: 1316, // 嘉明
      skills: [
        {
          id: 13164, // 嘉明 踏云献瑞 keyword描述与skill描述不同 ###可能会在未来修复###
          rawDescription: (before) =>
            before.replace("。", "，此技能视为$[K52]。"),
        },
      ],
    }),
    defineOverride<CharacterRawData>(null, "EN", {
      id: 1316, // 嘉明
      skills: [
        {
          id: 13164,
          rawDescription: (before) =>
            before + " This Skill is considered a $[K52].",
        },
      ],
    }),
    defineOverride<CharacterRawData>(null, null, {
      id: 1116, // 丝柯克
      skills: [
        {
          id: 11162, // 丝柯克 E 增加蛇之狡谋图标 ###非官方###
          rawDescription: delicateSerpentsSubtlety,
        },
        {
          id: 11163, // 丝柯克 Q 增加蛇之狡谋图标 ###非官方###
          rawDescription: delicateSerpentsSubtlety,
        },
        {
          id: 11164, // 丝柯克 P 增加蛇之狡谋图标 ###非官方###
          rawDescription: (before: string) =>
            delicateSerpentsSubtlety(before)
              .replace("充能", "$[K310]")
              .replace("Energy", "$[K310]"),
        },
      ],
    }),
    defineOverride<CharacterRawData>(null, null, {
      id: 6605, // 丝柯克 翻面
      skills: [
        {
          id: 11165, // 丝柯克 Q 增加蛇之狡谋图标 ###非官方###
          rawDescription: delicateSerpentsSubtlety,
        },
      ],
    }),
    defineOverride<CharacterRawData>(null, "CHS", {
      id: 1712, // 奈芙尔
      skills: [
        {
          id: 17126, // 奈芙尔 幻戏 keyword描述与skill描述不同 ###可能会在未来修复###
          rawDescription: (before) =>
            before + "\\n使用此技能不会获得<color=#FFFFFFFF>{SPRITE_PRESET#1110}充能</color>。",
        },
      ],
    }),
    defineOverride<CharacterRawData>(null, "EN", {
      id: 1712, // 奈芙尔
      skills: [
        {
          id: 17126,
          rawDescription: (before) =>
            before + "\\nUsing this skill will not grant <color=#FFFFFFFF>{SPRITE_PRESET#1110}Energy</color>.",
        },
      ],
    }),
  ],
  entities: [
    defineOverride<EntityRawData>(null, null, {
      id: 113163, // 嘉明 踏云献瑞 弃用的准备技能 干扰出图 ###可能会在未来修复###
      tags: [],
    }),
    defineOverride<EntityRawData>(null, null, {
      id: 114142, // 伊安珊 动能标示 修复引用错误 ###可能会在未来修复###
      rawDescription: (before) => before.replace("$[C113151]", "$[C114141]"),
    }),
    defineOverride<EntityRawData>(null, null, {
      id: 111162, // 丝柯克 七相一闪 增加蛇之狡谋图标 ###非官方###
      rawDescription: delicateSerpentsSubtlety,
    }),
    defineOverride<ActionCardRawData>(null, null, {
      id: 221057, // 浮彩·迅影 修复引用错误
      rawDescription: (before) => before.replace("$[C117121]", "$[C202]"),
    }),
    // defineOverride<EntityRawData>(null, null, {
    //   id: 117111, // 菈乌玛 霜林圣域 包里有专门图标非要用common ###非官方### ###可能会在未来修复###
    //   buffIcon: "UI_Gcg_Buff_Lauma_S",
    // }),
    // defineOverride<EntityRawData>(null, null, {
    //   id: 117112, // 菈乌玛 苍色祷歌 包里有专门图标非要用common ###非官方### ###可能会在未来修复###
    //   buffIcon: "UI_Gcg_Buff_Lauma_Q",
    // }),
    // defineOverride<EntityRawData>(null, null, {
    //   id: 122081, // 无相之水 水晶核心 包里有专门图标非要用common ###非官方### ###可能会在未来修复###
    //   buffIcon: "UI_Gcg_Buff_EffigyWater_S",
    // }),
  ],
  actionCards: [
    defineOverride<ActionCardRawData>(null, null, {
      id: 212111, // 芙宁娜天赋 修复引用错误
      rawDescription: (before) => before.replace("$[S12123]", "$[S12112]"),
    }),
    defineOverride<ActionCardRawData>(null, "CHS", {
      id: 321032, // 沉玉谷 修正一处标点样式 ###可能会在未来修复###
      rawDescription: (before) => before.replace("</color>：", "：</color>"),
    }),
    defineOverride<ActionCardRawData>(null, null, {
      id: 111161, // 丝柯克 诸武相授 增加蛇之狡谋图标 ###非官方###
      rawDescription: delicateSerpentsSubtlety,
    }),
    defineOverride<ActionCardRawData>(null, null, {
      id: 111163, // 丝柯克 虚境裂隙 增加蛇之狡谋图标 ###非官方###
      rawDescription: delicateSerpentsSubtlety,
    }),
    defineOverride<ActionCardRawData>(null, null, {
      id: 121059, // 浮彩·迅影 修复引用错误
      rawDescription: (before) => before.replace("$[C117121]", "$[C202]"),
    }),
  ],
};

export const RELATED_ENTITIES: Record<number, number[]> = {
  // : [81, 82, 83, 84, 85, 86, 87, ], // 元素附魔
  // : [100, ], // 抵抗之躯
  // : [106, ], // 冻结
  // : [111, ], // 结晶
  331702: [115, 116, 117], // 草原核, 激化领域
  // : [130-168 ], // 自走棋
  312043: [171], // 完成冒险！
  // : [200, ], // （Test）隐藏-费用不变
  // : [100001, ], // 眩晕
  1102: [111022], // 猫爪护盾 天赋替换
  1104: [111042], // 重华叠霜领域 天赋替换
  1105: [111053, 111054], // 冰元素附魔, 神里流·霰步 天赋替换
  1107: [111072], // 冰翎 天赋替换
  // : [111074, ], // 箓灵 已弃用
  1112: [111123], // 潜猎护盾
  1115: [111156, 111157, 111158], // 鎏金殿堂（生效中）, 白浪拂沙（生效中）, 一捧绿野（生效中）
  // 1116: [111164, ], // 死河渡断 已弃用
  1117: [111173, 111174, 111175], // 速射牵制（生效中）, 侦明, 爆裂信标
  1202: [112023], // 雨帘剑
  1204: [112044, 112045], // 断流
  1207: [112073], // 赤冕祝祷 天赋替换
  1210: [112103], // 遗龙之荣
  1213: [112135, 112136], // 静养, 细致入微的诊疗
  1303: [113032], // 鼓舞领域 天赋替换
  1305: [113053], // 庭火焰硝 天赋替换
  1306: [113062], // 爆裂火花 天赋替换
  // : [113091, ], // 炽炎狮子·炽鬃拳 已弃用
  1309: [113094], // 净焰剑狱之护
  1311: [113113], // 炽火大铠 天赋替换
  1313: [113134], // 尖兵协同战法（生效中）
  // : [113135, ], // 纵阵武力统筹 已弃用
  1315: [113157, 113158], // 驰轮车·疾驰（生效中）
  // : [113163, 113164, ], // 踏云献瑞 已弃用
  1401: [114012], // 奥兹 天赋替换
  1403: [114033, 114034], // 雷楔已回收, 雷元素附魔 天赋替换
  1405: [114052, 114054], // 奔潮引电, 捉浪·涛拥之守
  1408: [114082], // 遣役之仪
  1410: [114103], // 灯中幽精 天赋替换
  1412: [114122], // 破夜的明焰（生效中）
  1415: [114155], // 闪烈降临·大火山崩落
  1501: [115012], // 大型风灵 天赋替换
  1503: [115032, 115033], // 风域, 协鸣之风 天赋替换
  1504: [115042], // 降魔·忿怒显相
  1505: [115050, 115053, 115054, 115055, 115056, 115057, 115058, 115059], // 风物之诗咏, 乱岚拨止
  1506: [115062], // 倾落
  1508: [115083], // 惊奇猫猫盒的嘲讽
  // : [115094, 115095, ], // 赫耀多方面体, 妙道合真（生效中） 已弃用
  1509: [115096], // 赫耀多方面体 天赋替换
  1510: [115103], // 踏风腾跃
  1511: [115118], // 掩护的心意
  1513: [115131], // 在罪之先
  1605: [116052], // 阿丑
  1607: [116074], // 飞云旗阵 天赋替换
  1609: [116097, 116098], // 千织的自动制御人形,岩元素附魔
  1611: [116114, 116115, 116116, 116117, 216114, 216115, 216116, 216117], // 「源音采样」, 受到的元素伤害增加
  1701: [117012, 117013], // 新叶, 新叶（已创建）
  1703: [117033, 117034, 117035, 117036], // 摩耶之殿
  1704: [117042], // 月桂·抛掷型 天赋替换
  1705: [117054, 117056], // 无郤气护盾
  1708: [117083], // 预算师的技艺（生效中）
  1710: [117104], // 余薰（生效中）
  311305: [121013], // 叛逆的守护
  // 2102: [121023, 121024, 121025, ], // 冰封的炽炎魔女, 寒炽弥漫
  // 2103: [121035, 121036, 121037, 121038, ], // 冰晶核心
  // 2201: [122010, 122014, ], // 纯水幻形
  2202: [122022], // 水光破镜 天赋替换
  2203: [122037], // 水之新生·锐势
  // : [122034, 122035, 122036, ], // 暗流涌动, 涌流护罩, 深渊潮声
  2204: [122042], // 奇异之躯
  // : [122044, 122045, ], // 吞噬本能, 吞噬冲动
  2206: [122062, 122063, 122064], // 半幻人
  // : [123023, 123025, 123027, ], // 涌火护罩, 将熄的余烬, 隐藏-火之护盾
  2302: [123026], // 火之新生·锐势
  // : [123033, 123034, ], // 炎之魔蝎·守势
  // : [123044, ], // 披甲钳进
  2305: [123052], // 弃置卡牌数
  // : [123063, ], // （test）PVEbuff
  2401: [124011, 124012], // 猜拳三连击
  // 2402: [124015, 124016, 124017, 124018, ], // 雷晶核心
  // : [124024, ], // 滚雷裂音
  // : [124033, ], // 原海明珠
  2404: [124044], // 雷压
  // : [124053, ], // 噬骸能量块（冷却中）
  2406: [124062], // 雷之新生·锐势
  // : [124063, 124064, 124065, ], // 轰霆护罩, 深渊滚雷, 侵雷重闪
  // : [125013, ], // 凶面归位
  // : [125024, 125025, ], // 龙威, 坍裂的高台
  2503: [125031, 125032], // 噬骸能量·积聚, 亡风啸卷（生效中）
  // : [126023, ], // 磐岩百相·元素征召
  2702: [127023, 127024, 127025, 127028, 127029], // 增殖生命体, 绿洲之庇护, 绿洲之心
  // : [127030, 127031, ], // 增殖生命体·活跃, 增殖生命体·暴走
  // : [163012, ], // 红莲的旋风
  211141: [211142], // 五重天的寒雨（生效中）
  212061: [212062], // 镜华风姿（生效中）
  // : [214142, ], // 「沃陆之邦」的训教（生效中） 已弃用
  223051: [223052], // 罔极盛怒（生效中）
  330001: [300001], // 旧时庭园（生效中）
  330004: [300002], // 自由的新风（生效中）
  330006: [300003], // 裁定之时（生效中）
  330007: [300004], // 抗争之日·碎梦之时（生效中）
  330009: [300005], // 赦免宣告（生效中）
  330010: [300007], // 斗争之火（生效中）
  321018: [301018], // 严格禁令
  // : [301021, ], // 禁忌知识（冷却中）
  321020: [301022], // 赤王陵（生效中）
  321022: [301023], // 圣火竞技场（生效中）
  321026: [301024], // 「花羽会」（生效中）
  // : [301026, ], // 护盾 沃陆之邦 已弃用
  // : [301027, ], // 锻炼
  321030: [301032, 301037], // 星轨王城（生效中）
  321033: [301040], // 水仙十字圣剑（生效中）
  321040: [301042], // 层岩巨渊（生效中）
  311402: [301101], // 千岩之护
  311206: [301103], // 王下近侍（生效中）
  311406: [301104], // 贯月矢（生效中）
  311306: [301105, 301106], // 沙海守望·主动出击, 沙海守望·攻势防御
  311507: [301107], // 原木刀（生效中）
  311108: [301108], // 万世的浪涛
  311307: [301109], // 森林王器（生效中）
  311109: [301111], // 金流监督（生效中）
  311110: [301112], // 纯水流华（生效中）
  311112: [301113], // 祭星者之望（生效中）
  312012: [301203], // 辰砂往生录（生效中）
  312030: [301204], // 指挥的礼帽（生效中）
  312033: [301205], // 诸圣的礼冠（生效中）
  312035: [301206], // 失冕的宝冠（生效中）
  312039: [301207], // 谐律异想断章（生效中）
  312037: [301208], // 宗室面具（生效中）
  312027: [301209], // 紫晶的花冠（生效中）
  312041: [301210], // 昔日宗室之仪（生效中）
  313004: [301301], // 掘进的收获
  313008: [301303, 301305], // 突角龙（生效中）
  313007: [301304], // 浪船
  313009: [301307, 301308], // 龙伙伴的声援！, 龙伙伴的鼓舞！
  332021: [302021], // 大梦的曲调（生效中）
  322025: [302204], // 「清洁工作」（生效中）
  322027: [302216, 302217, 302219], // 托皮娅的心意, 卢蒂妮的心意, 希洛娜的心意
  323003: [302303], // 红羽团扇（生效中）
  331005: [303053], // 蒸发祝佑·狂浪（生效中）
  331102: [303112], // 元素共鸣：粉碎之冰（生效中）
  331302: [303132], // 元素共鸣：热诚之火（生效中）
  331502: [303133, 303134, 303136], // 元素共鸣：迅捷之风（生效中）
  // : [303135, ], // 元素共鸣：迅捷之风（生效中）
  331602: [303162], // 护盾
  // : [303172, 303173, 303174, 303175, ], // 元素共鸣：蔓生之草（生效中）
  331801: [303181], // 风与自由（生效中）
  331802: [303182], // 岩与契约（生效中）
  331807: [303183, 303184], // 月与故乡（生效中）
  332002: [303202], // 换班时间（生效中）
  303205: [303205], // 本大爷还没有输！（冷却中）
  332006: [303206], // 交给我吧！（生效中）
  332007: [303207], // 鹤归之时（生效中）
  // : [303210, ], // 丘丘人
  332015: [303211, 303212, 303213, 303214], // 冰箭丘丘人, 水丘丘萨满, 冲锋丘丘人, 雷箭丘丘人
  // : [303215, ], // 愚人众伏兵
  332018: [303220], // 重攻击（生效中）
  332022: [303222], // 藏锋何处（生效中）
  332023: [303223], // 拳力斗技！（生效中）
  332024: [303224, 303232], // 琴音之诗（生效中）
  332025: [303225], // 野猪公主（生效中）
  332026: [303226], // 坍陷与契机（生效中）
  332028: [303228], // 机关铸成之链（生效中）
  332029: [303229], // 净觉花（生效中）
  332031: [303231], // 海底宝藏（冷却中）
  332036: [303236], // 「看到那小子挣钱…」（生效中）
  332037: [303237], // 噔噔！（生效中）
  332042: [303238], // 燃素充盈（生效中）
  332045: [303239], // 困困冥想术（生效中）
  332048: [303241, 303242], // 健身的成果（生效中）
  332050: [303243], // 很棒，哥们。（生效中）
  332049: [303244], // 收获时间（生效中）
  // : [303246, ], // 破碎之海（生效中） 已弃用
  332058: [303247], // 拯救世界的计划（生效中）
  // : [303300, ], // 饱腹
  333001: [303301], // 绝云锅巴（生效中）
  333002: [303302], // 仙跳墙（生效中）
  333003: [303303], // 莲花酥（生效中）
  333004: [303304], // 北地烟熏鸡（生效中）
  333007: [303305], // 烤蘑菇披萨（生效中）
  333008: [303306], // 兽肉薄荷卷（生效中）
  333009: [303307], // 复苏冷却中
  333010: [303308], // 刺身拼盘（生效中）
  333011: [303309], // 唐杜尔烤鸡（生效中）
  333012: [303310], // 黄油蟹蟹（生效中）
  333013: [303311], // 炸鱼薯条（生效中）
  333014: [303312], // 松茸酿肉卷（生效中）
  333015: [303313], // 缤纷马卡龙（生效中）
  333016: [303314], // 龙龙饼干（生效中）
  333018: [303315], // 咚咚嘭嘭（生效中）
  // : [303316, ], // 奇瑰之汤（生效中）
  333020: [303317, 303318, 303319, 303320], // 奇瑰之汤（生效中）
  333027: [303321], // 纵声欢唱（生效中）
  333028: [303322], // 丰稔之赐（生效中）
  333029: [303323], // 沉玉茶露（生效中）
  // : [312042, ], // （test）测试用
  333030: [172, 209], // 打磨利刃
  2605: [126054], // 力场操控
  330013: [300010], // 另一侧的霜月·生效中
  1712: [117122], // 奈芙尔
  2105: [221052, 221053, 221054, 221055, 221056, 221057], // 灵觉隐修的迷者 浮彩（生效中）
  332064: [303248], // 科研的动力（生效中）
  332063: [303249], // 小小灵蕈大幻戏（生效中）
  333031: [303324], // 白灵果派（生效中）
  213171: [113173, 113174], // 杜林天赋
  212032: [212033], // 莫娜天赋 天步真原（生效中）
  215032: [215033], // 温迪天赋 颂时风若（生效中）
  332066: [303250], // 齐聚共饮（生效中）
} as Record<number, number[]>;
