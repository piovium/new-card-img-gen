import { For, Show, createMemo, type JSX } from "solid-js";
import type { AdjustmentData, AdjustmentRecord } from "../../types";
import { useGlobalSettings } from "../../context";
import { Text } from "./Text";
import { cardFaceUrl, tagImageUrl, parseId } from "../../utils";
import {
  DESCRIPTION_ICON_IMAGES,
  ADJUSTMENT_SUBJECT_LABELS,
  ADJUSTMENT_TYPE_LABELS,
} from "../../constants";
import "./BalanceAdjustment.css";
import {
  BLOCK_CARD_MASK,
  NEW_SIGN_CHS,
  NEW_SIGN_EN,
  OLD_SIGN_CHS,
  OLD_SIGN_EN,
} from "../../constants";

export interface BalanceAdjustmentProps {
  adjustments: AdjustmentData[];
}

interface AdjustmentCardProps {
  offset: number;
  name?: string;
  cardFace?: string;
  children?: JSX.Element;
}

const AdjustmentCard = (props: AdjustmentCardProps) => {
  return (
    <div class="adjustment-card">
      <div class="adjustment-card-title">
        <Text text={props.name} />
      </div>
      <div class="dashed-line" bool:data-wide={props.cardFace === undefined} />
      <Show when={props.cardFace}>
        {(cardFace) => (
          <img
            src={cardFaceUrl({ id: 0, name: "", cardFace: cardFace() })}
            class="adjustment-card-face"
            style={{
              top: `${props.offset - 0.25}rem`,
              "mask-image": `url("${BLOCK_CARD_MASK}")`,
            }}
          />
        )}
      </Show>
      {props.children}
    </div>
  );
};

const parseAdjustmentText = (text: string): JSX.Element[] => {
  if (!text) return [];

  const parts: JSX.Element[] = [];
  let currentIndex = 0;
  const regex = /(<b>.*?<\/b>|{SPRITE_PRESET#(\d+)})/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > currentIndex) {
      parts.push(
        <span class="record-text-light">
          <Text text={text.substring(currentIndex, match.index)} />
        </span>,
      );
    }
    if (match[0].startsWith("<b>")) {
      const boldText = match[0].replace(/<\/?b>/g, "");
      parts.push(
        <span class="record-text-bold">
          <Text text={boldText} />
        </span>,
      );
    } else if (match[2]) {
      const iconId = Number(match[2]);
      const iconDef = DESCRIPTION_ICON_IMAGES[iconId] || {};
      if (iconDef.imageUrl) {
        parts.push(
          <img class="description-icon" src={iconDef.imageUrl} alt="" />,
        );
      } else if (iconDef.tagIcon) {
        parts.push(
          <span
            class="description-icon-tag"
            style={{
              "--image": `url("${tagImageUrl(iconDef.tagIcon)}")`,
            }}
          />,
        );
      }
    }
    currentIndex = match.index + match[0].length;
  }

  if (currentIndex < text.length) {
    parts.push(
      <span class="record-text-light">
        <Text text={text.substring(currentIndex)} />
      </span>,
    );
  }

  return parts.length > 0
    ? parts
    : [
        <span class="record-text-light">
          <Text text={text} />
        </span>
      ];
};

interface AdjustmentRecordProps {
  record: AdjustmentRecord;
}

const AdjustmentRecordItem = (props: AdjustmentRecordProps) => {
  const isInlineType = (type: string) => type === "hp" || type === "cost";
  const { allData, language } = useGlobalSettings();
  const names = createMemo(() => {
    const data = allData();
    return new Map(
      [
        ...data.characters,
        ...data.actionCards,
        ...data.entities,
        ...data.characters.flatMap((c) => c.skills),
        ...data.entities.flatMap((e) => e.skills),
      ].map((v) => [v.id, v.name]),
    );
  });

  const lang = language();
  const custom = () => parseId(props.record.id) === null;
  const recordName = createMemo(() => {
    const name = names()?.get(parseId(props.record.id) ?? 0);
    return lang === "CHS" ? `「${name}」` : ` "${name}" `;
  });
  const subjectLabel = () =>
    ADJUSTMENT_SUBJECT_LABELS[lang][props.record.subject] ||
    props.record.subject;
  const typeLabel = () =>
    ADJUSTMENT_TYPE_LABELS[lang][props.record.type] || props.record.type;
  const adjustmentText = lang === "CHS" ? "调整：" : " adjustment:";
  const oldSign = lang === "CHS" ? OLD_SIGN_CHS : OLD_SIGN_EN;
  const newSign = lang === "CHS" ? NEW_SIGN_CHS : NEW_SIGN_EN;
  const title = () =>
    custom()
      ? props.record.id.toString()
      :props.record.subject === "self"
        ? `${typeLabel()}${adjustmentText}`
        : `${subjectLabel()}${recordName()}${typeLabel()}${adjustmentText}`;
  const isInline = () => isInlineType(props.record.type);
  const hasOld = () => props.record.oldData !== "";
  const hasNew = () => props.record.newData !== "";

  return (
    <div class="adjustment-record">
      <div class="record-title">
        <Text text={title()} />
      </div>
      <Show
        when={isInline()}
        fallback={
          <>
            <div class="record-block" bool:data-hidden={!hasOld()}>
              <img src={oldSign} class="record-sign" bool:data-hidden={!hasNew()} />
              <div 
                class="record-content" 
                data-justify={["CHS", "CHT"].includes(language())}
              >
                {parseAdjustmentText(props.record.oldData)}
              </div>
            </div>
            <div class="record-block" bool:data-hidden={!hasNew()}>
              <img src={newSign} class="record-sign" bool:data-hidden={!hasOld()} />
              <div 
                class="record-content" 
                data-justify={["CHS", "CHT"].includes(language())}
              >
                {parseAdjustmentText(props.record.newData)}
              </div>
            </div>
          </>
        }
      >
        <div class="record-inline">
          <img
            src={oldSign}
            class="record-sign"
            style={{ transform: "translateY(-0.15rem)" }}
          />
          <div class="record-content">
            {parseAdjustmentText(props.record.oldData)}
          </div>
          <span class="record-arrow">→</span>
          <img
            src={newSign}
            class="record-sign"
            style={{ transform: "translateY(-0.15rem)" }}
          />
          <div class="record-content">
            {parseAdjustmentText(props.record.newData)}
          </div>
        </div>
      </Show>
    </div>
  );
};

interface ResolvedCardData {
  name: string;
  cardFace?: string;
}

export const BalanceAdjustment = (props: BalanceAdjustmentProps) => {
  const { allData } = useGlobalSettings();
  const processedAdjustments = createMemo(() => {
    const data = allData();

    const resolveCardData = (id: string | number): ResolvedCardData | null => {
      const parsedId = parseId(id);
      if (parsedId === null) {
        return {
          name: id.toString(),
        };
      }
      const character = data.characters.find((c) => c.id === parsedId);
      if (character) {
        return {
          name: character.name,
          cardFace: character.cardFace,
        };
      }
      const actionCard = data.actionCards.find((c) => c.id === parsedId);
      if (actionCard) {
        return {
          name: actionCard.name,
          cardFace: actionCard.cardFace,
        };
      }
      return null;
    };

    return props.adjustments.map((adjustment) => ({
      adjustment,
      cardData: resolveCardData(adjustment.id),
    }));
  });

  return (
    <div class="balance-adjustment">
      <For each={processedAdjustments()}>
        {(item) => (
          <AdjustmentCard
            offset={item.adjustment.offset}
            name={item.cardData?.name}
            cardFace={item.cardData?.cardFace}
          >
            <div
              class="adjustment-records"
              bool:data-wide={item.cardData?.cardFace === undefined}
            >
              <For each={item.adjustment.adjustment}>
                {(record) => <AdjustmentRecordItem record={record} />}
              </For>
            </div>
          </AdjustmentCard>
        )}
      </For>
    </div>
  );
};
