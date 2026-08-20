import { createSignal, createMemo } from "solid-js";
import { For, Show } from "solid-js";
import type { SkillRawData } from "@gi-tcg/assets-manager";
import {
  type AppConfig,
  type RenderContext,
  type ParsedCharacter,
  type ParsedActionCard,
} from "../../types";
import { parseCharacter, parseActionCard } from "../../parser";
import { RenderContextProvider } from "../../context";
import { Character } from "./Character";
import { ActionCard } from "./ActionCard";
import { BalanceAdjustment } from "./BalanceAdjustment";
import { VersionDiffBlock, VersionDiffList } from "./VersionDiff";
import "./Renderer.css";
import {
  ELEMENT_TAG_TO_KEYWORD_ID,
  VERSION_REPLACE_STRS,
} from "../../constants";
import { PageTitle } from "./PageTitle";
import { Watermark } from "./Watermark";
import { CodeBlock } from "./CodeBlock";
import {
  collectDependencyCodeEntries,
  type CodeAnalyzerResult,
} from "../../codeAnalyzer";
import { collectChildIds } from "../../utils";;

const collectVisibleCodeIds = (
  character: ParsedCharacter | null,
  actionCards: ParsedActionCard[],
): number[] => {
  const ids: number[] = [];
  if (character) {
    ids.push(character.id);
    character.parsedSkills.forEach((skill) => collectChildIds(skill, ids));
    character.debugChildren.forEach((child) => collectChildIds(child, ids));
  }
  for (const card of actionCards) {
    ids.push(card.id);
    card.children.forEach((child) => collectChildIds(child, ids));
    card.debugChildren.forEach((child) => collectChildIds(child, ids));
  }
  return ids;
};

export const Renderer = (props: AppConfig) => {
  const renderingObjects = createMemo<RenderingObjects>(() => {
    const language = props.language;
    const mode = props.mode;
    const data = props.data;
    const version = props.version;
    const keywords = data.keywords.map((k) => ({ ...k, id: -k.id }));
    const skills = [...data.characters, ...data.entities].flatMap(
      (e) => e.skills as SkillRawData[],
    );
    const genericEntities = [...data.actionCards, ...data.entities];
    const names = new Map<number, string>(
      [...genericEntities, ...data.characters, ...skills].map(
        (e) => [e.id, e.name] as const,
      ),
    );
    const characterToElementKeywordIdMap = new Map(
      data.characters.flatMap((ch) =>
        [ch.id, ...ch.skills.map((sk) => sk.id)].map((id) => [
          id,
          ch.tags.map((t) => ELEMENT_TAG_TO_KEYWORD_ID[t]).find((kId) => kId) ??
            310,
        ]),
      ),
    );
    // 官方的 Entity 引用其它 Entity 时会使用 K 而非 C/S，这里记录它们的关系以映射
    const keywordToEntityMap = new Map(
      keywords
        .filter((k) => k.name && k.id > 1000)
        .map((k) => {
          const match = [...skills, ...data.entities, ...data.actionCards].find(
            (e) => e.name === k.name,
            // && !(e.tags as string[]).includes("GCG_TAG_PREPARE_SKILL"),
          );
          return match ? ([k.id, match] as const) : null;
        })
        .filter((pair) => !!pair),
    );
    const prepareSkillToEntityMap = new Map(
      data.entities
        .filter((e) => (e.tags as string[]).includes("GCG_TAG_PREPARE_SKILL"))
        .flatMap((entity) => {
          const matches = [
            ...entity.rawDescription.matchAll(/\$\[S(\d{5}|\d{7})\]/g),
          ];
          return matches.map((m) => [parseInt(m[1], 10), entity]);
        }),
    );
    const renderContext: RenderContext = {
      language,
      skills,
      genericEntities,
      keywords,
      names,
      supIds: [],
      characterToElementKeywordIdMap,
      keywordToEntityMap,
      prepareSkillToEntityMap,
    };

    let character: ParsedCharacter | null = null;
    const actionCards: ParsedActionCard[] = [];
    if (mode === "character") {
      const collected = data.characters.find((c) => c.id === props.characterId);
      if (collected) {
        character = parseCharacter(renderContext, collected);
        const talents = data.actionCards.filter(
          (ac) => ac.relatedCharacterId === collected.id,
        );
        console.log(talents);
        actionCards.push(
          ...talents.map((card) => parseActionCard(renderContext, card)),
        );
      }
    } else if (mode === "singleActionCard") {
      const actionCard = data.actionCards.find(
        (c) => c.id === props.actionCardId,
      );
      if (actionCard) {
        actionCards.push(parseActionCard(renderContext, actionCard));
      }
    } else if (mode === "versionedActionCards") {
      if (version.startsWith("v")) {
        const collected = data.actionCards
          .filter(
            (ac) =>
              ac.sinceVersion === version &&
              (ac.shareId || ac.tags.includes("GCG_TAG_ADVENTURE_PLACE")) &&
              (props.includeTalent || !ac.tags.includes("GCG_TAG_TALENT")),
          )
          .filter(
            (_, idx) => props.versionedActionCardSelection?.[idx] ?? true,
          );
        actionCards.push(
          ...collected.map((c) => parseActionCard(renderContext, c)),
        );
      }
    }

    let title: string | null = null;
    let versionText: string | null = null;
    if (version.startsWith("v")) {
      let rawVersion = version.slice(1);
      if (rawVersion.endsWith("-beta")) rawVersion = rawVersion.slice(0, -5);
      const [major, minor, patch] = rawVersion.split(".");
      const isBeta = Number(patch) >= 50;
      let mainVersionText = isBeta
        ? `${major}.${Number(minor) + 1}`
        : `${major}.${minor}`;

      mainVersionText =
        VERSION_REPLACE_STRS[mainVersionText]?.[props.language] ||
        mainVersionText;

      versionText = isBeta
        ? ` Beta ${mainVersionText} v${Number(patch) - 49}`
        : mainVersionText;
      if (props.mode === "versionedActionCards") {
        title = {
          CHS: `${mainVersionText}版本新增行动牌`,
          EN: `Action Cards added in ${mainVersionText}`,
        }[props.language];
      } else if (props.mode === "balanceAdjustment") {
        title = {
          CHS: `${mainVersionText}版本平衡性调整`,
          EN: `Balance Adjustment in ${mainVersionText}`,
        }[props.language];
      }
    }
    if (props.mode === "versionDiff") {
      title = {
        CHS: "卡牌版本改动一览",
        EN: "Card Changes Across Versions",
      }[props.language];
    }
    const visibleCodeIds = props.debug
      ? collectVisibleCodeIds(character, actionCards)
      : [];
    const dependencyCodeEntries = props.debug
      ? collectDependencyCodeEntries(
          visibleCodeIds,
          props.codeAnalyzerResults,
        )
      : [];

    return {
      mode,
      title,
      character,
      actionCards,
      versionText,
      renderContext,
      dependencyCodeEntries,
    };
  });

  interface RenderingObjects {
    title: string | null;
    character: ParsedCharacter | null;
    actionCards: ParsedActionCard[];
    versionText: string | null;
    renderContext: RenderContext;
    dependencyCodeEntries: CodeAnalyzerResult[];
  }

  const getRenderContext = () => renderingObjects().renderContext;
  const empty = () =>
    !renderingObjects().character &&
    renderingObjects().actionCards.length === 0 &&
    props.mode !== "balanceAdjustment" &&
    props.mode !== "versionDiff";

  return (
    <RenderContextProvider value={getRenderContext}>
      <div
        class="layout"
        classList={{
          "single-action-card": props.mode === "singleActionCard",
          empty: empty(),
        }}
        data-language={props.language}
      >
        <Watermark text={props.watermarkText} />
        <Show when={renderingObjects().title}>
          {(title) => <PageTitle text={title()} />}
        </Show>
        <Show when={props.mode === "balanceAdjustment" && props.adjustments}>
          <BalanceAdjustment adjustments={props.adjustments || []} />
        </Show>
        <Show when={props.mode === "versionDiff"}>
          <VersionDiffList />
        </Show>
        <Show when={renderingObjects().character}>
          {(c) => (
            <>
              <Character character={c()} />
              <Show when={props.mode === "character" && props.displayDiff}>
                <VersionDiffBlock item={c()} />
              </Show>
            </>
          )}
        </Show>
        <For each={renderingObjects().actionCards}>
          {(ac) => (
            <>
              <ActionCard card={ac} />
              <Show
                when={props.mode === "singleActionCard" && props.displayDiff}
              >
                <VersionDiffBlock item={ac} />
              </Show>
            </>
          )}
        </For>
        <Show when={empty()}>无数据</Show>
        <Show
          when={props.debug && renderingObjects().dependencyCodeEntries.length > 0}
        >
          <section class="dependency-code-section">
            <div class="dependency-code-title">Dependencies</div>
            <For each={renderingObjects().dependencyCodeEntries}>
              {(entry) => <CodeBlock id={entry.id} />}
            </For>
          </section>
        </Show>
        <div class="version-layout">
          <div class="version-text">
            {props.authorName || renderingObjects().versionText}
          </div>
          <Show when={props.authorImageUrl}>
            {(url) => <img src={url()} class="logo" />}
          </Show>
        </div>
      </div>
    </RenderContextProvider>
  );
};
