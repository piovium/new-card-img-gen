import { For, Show } from "solid-js";
import type {
  ParsedChild,
  ParsedActionCard,
  ParsedEntity,
  ParsedKeyword,
} from "../../types";
import { useGlobalSettings, useRenderContext } from "../../context";
import { KeywordIcon } from "./KeywordIcon";
import { KeywordTag } from "./KeywordTag";
import { Cost } from "./Cost";
import { Description } from "./Token";
import {
  KEYWORD_CARDBACK_BOTTOM,
  KEYWORD_CARDBACK_REPEAT,
  KEYWORD_CARD_FRAME,
  COST_READONLY_ENTITIES,
} from "../../constants";
import { cardFaceUrl, type AnyChild } from "../../utils";
import { Text } from "./Text";
import { CodeBlock } from "./CodeBlock";
import "./Children.css";

export const Children = (props: { children: ParsedChild[] }) => {
  const { displayId, language } = useGlobalSettings();
  const renderContext = useRenderContext();

  return (
    <div class="child-layout">
      <For each={props.children}>
        {(raw) => {
          const child = raw as AnyChild;
          const preparing = renderContext().prepareSkillToEntityMap.get(
            child.id,
          );
          const costWidth = child.playCost
            ? Math.min(child.playCost.length, 1)
            : 0;
          return (
            <div class="keyword-box-wrapper">
              <div class="keyword-line" />
              <Show when={child.cardFaceUrl || child.cardFace}>
                <div class="keyword-card">
                  <img
                    src={KEYWORD_CARDBACK_BOTTOM}
                    class="keyword-card-back-bottom"
                  />
                  <div
                    class="keyword-card-back-repeat"
                    style={{ "--image": `url("${KEYWORD_CARDBACK_REPEAT}")` }}
                  />
                  <img src={cardFaceUrl(child)} class="keyword-card-face" />
                  <img src={KEYWORD_CARD_FRAME} class="keyword-card-frame" />
                </div>
              </Show>
              <div class="keyword-box">
                <div class="keyword-buff-box">
                  <Show when={!(child.cardFaceUrl || child.cardFace)}>
                    <KeywordIcon item={child} />
                  </Show>
                  <div
                    class="keyword-title-box"
                    style={{ "--margin-right": `${costWidth * 5}rem` }}
                  >
                    <div class="keyword-title">
                      <Text text={child.name} />
                    </div>
                    <div class="keyword-tags">
                      <KeywordTag tag={child.type || "GCG_RULE_EXPLANATION"} />
                      <For each={child.tags || []}>
                        {(tag) => <KeywordTag tag={tag} />}
                      </For>
                      <Show when={preparing}>
                        <KeywordTag tag="GCG_TAG_PREPARE_SKILL" />
                      </Show>
                      <Show when={child.hidden}>
                        <KeywordTag tag="GCG_DATA_HIDDEN" />
                      </Show>
                      <Show when={child.remainAfterDie}>
                        <KeywordTag tag="GCG_DATA_REMAIN" />
                      </Show>
                      <Show
                        when={["GCG_CARD_SUMMON", "GCG_CARD_ASSIST"].includes(
                          child.type,
                        )}
                      >
                        <KeywordTag tag={child.shownIcon ?? ""} />
                      </Show>
                      <Show when={displayId()}>
                        <div class="id-box">ID: {child.id}</div>
                      </Show>
                      <Show when={displayId() && preparing}>
                        {(preparing) => (
                          <div class="id-box">ID: {preparing().id}</div>
                        )}
                      </Show>
                    </div>
                  </div>
                </div>
                <Show when={child.playCost}>
                  <Cost
                    type="keyword"
                    cost={
                      child.playCost && child.playCost.length === 0
                        ? [{ type: "GCG_COST_DICE_SAME", count: 0 }]
                        : child.playCost || []
                    }
                    readonly={
                      COST_READONLY_ENTITIES.includes(child.id) || !!preparing
                    }
                  />
                </Show>
                <div
                  class={`keyword-description`}
                  data-justify={["CHS", "CHT"].includes(language())}
                >
                  <Description
                    description={
                      (child as ParsedActionCard | ParsedEntity | ParsedKeyword)
                        .parsedDescription
                    }
                  />
                </div>
                <CodeBlock id={child.id} />
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};
