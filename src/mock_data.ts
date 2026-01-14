import type {
  NewCharacterData,
  NewEntityData,
  NewActionCardData,
  NewKeywordData,
} from "./components/form/Forms";

export const MOCK_NEW_CHARACTERS: NewCharacterData[] = [
  {
    id: 9501,
    name: "雨酱",
    storyText: "你查这个干什么？",
    cardFaceUrl:
      "http://106.52.187.96:8013/images/custom/UI_Gcg_CardFace_Char_Avatar_Guyutongxue.png",
    hp: 10,
    maxEnergy: 3,
    skills: [
      {
        id: 95011,
        name: "不会用神之眼",
        type: "GCG_SKILL_TAG_A",
        rawDescription: "造成2点$[K100]。",
        playCost: [
          {
            type: "GCG_COST_DICE_ANEMO",
            count: 1,
          },
          {
            type: "GCG_COST_DICE_VOID",
            count: 2,
          },
        ],
        icon: "Skill_A_02",
      },
      {
        id: 95012,
        name: "哎呀",
        type: "GCG_SKILL_TAG_E",
        rawDescription:
          "造成2点$[K105]，生成<color=#FFFFFFFF>$[C195011]</color>。",
        playCost: [
          {
            type: "GCG_COST_DICE_ANEMO",
            count: 3,
          },
        ],
        iconUrl: "https://static-data.7shengzhaohuan.online/api/v4/image/raw/Skill_E_Diona_01_HD",
      },
      {
        id: 95013,
        name: "看看你的",
        type: "GCG_SKILL_TAG_Q",
        rawDescription:
          "造成2点$[K105]，召唤<color=#FFFFFFFF>$[C195012]</color>。",
        playCost: [
          {
            type: "GCG_COST_DICE_ANEMO",
            count: 3,
          },
          {
            type: "GCG_COST_ENERGY",
            count: 3,
          },
        ],
        iconUrl: "https://static-data.7shengzhaohuan.online/api/v4/image/raw/MonsterSkill_S_EffigyElectric_04",
      },
    ],
    elementTag: "GCG_TAG_ELEMENT_ANEMO",
    weaponTag: "GCG_TAG_WEAPON_BOW",
    tags: ["GCG_TAG_NATION_LIYUE"],
  },
];

export const MOCK_NEW_ACTION_CARDS: NewActionCardData[] = [
  {
    id: 295011,
    type: "GCG_CARD_MODIFY",
    name: "软软！",
    tags: ["GCG_TAG_TALENT"],
    cardFaceUrl: "https://picsum.photos/id/56/420/720",
    playCost: [],
    rawDescription:
      "$[K2]：装备给我方的<color=#FFFFFFFF>$[A9501]</color>。装备有此牌的$[A9501]释放$[S95013]时会播放后搬腿动画。\\n（牌组中包含$[A9501]，才能加入牌组）\n",
    relatedCharacterId: 9501,
  },
];

export const MOCK_NEW_ENTITIES: NewEntityData[] = [
  {
    id: 195011,
    type: "GCG_CARD_ONSTAGE",
    name: "结算bug",
    tags: [],
    skills: [],
    rawDescription:
      "本回合中，我方角色造成的伤害随机+1~3。\\n<color=#FFFFFFFF>$[K3]：2</color>",
    buffIcon: "UI_Gcg_Buff_Common_Special",
  },
  {
    id: 195012,
    type: "GCG_CARD_SUMMON",
    name: "雨酱的白丝",
    tags: [],
    skills: [],
    rawDescription:
      "<color=#FFFFFFFF>结束阶段：</color>造成2点$[K105]，随机交换1张双方原本元素骰费用最多的手牌。\\n<color=#FFFFFFFF>$[K3]：2</color>\\n\\n<color=#FFFFFFFF>我方角色或召唤物引发扩散反应后：</color>转换此牌的元素类型，改为造成被扩散的元素类型的伤害。（离场前仅限一次）",
    cardFaceUrl:
      "http://106.52.187.96:8013/images/custom/UI_Gcg_CardFace_Summon_Guyutongxue.png",
  },
];

export const MOCK_NEW_KEYWORDS: NewKeywordData[] = [];
