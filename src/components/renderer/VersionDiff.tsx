import { createMemo, For, Show } from "solid-js";
import type { ParsedActionCard, ParsedCharacter } from "../../types";
import { useGlobalSettings } from "../../context";
import { collectChildIds } from "../../utils";
import { Text } from "./Text";
import {
  clampDiffOffset,
  getAllVersionDiffs,
  getVersionDiff,
  NO_DIFF_PLACEHOLDER,
  resolveVersionDiffTarget,
} from "../../versionDiff";
import "./VersionDiff.css";

export const VersionDiffItem = (props: {
  id: number;
  variant?: "list" | "annotation";
}) => {
  const { allData, language } = useGlobalSettings();
  const diff = () => getVersionDiff(props.id) ?? NO_DIFF_PLACEHOLDER;
  const target = createMemo(() =>
    resolveVersionDiffTarget(allData(), props.id),
  );

  return (
    <div class="version-diff-item" data-variant={props.variant ?? "list"}>
      <Show when={target()}>
        {(t) => (
          <div class="version-diff-image">
            <img
              src={t().imageUrl}
              style={
                t().fromCardFace
                  ? {
                      "object-position": `center ${
                        50 - clampDiffOffset(diff().offset) * 50
                      }%`,
                    }
                  : undefined
              }
              alt=""
            />
          </div>
        )}
      </Show>
      <div class="version-diff-content">
        <div class="version-diff-header">
          <div class="version-diff-name">
            <Text text={target()?.name ?? `#${props.id}`} />
          </div>
          <div class="version-diff-version">{diff().version}</div>
        </div>
        <div class="version-diff-divider" />
        <div
          class="version-diff-remark"
          data-justify={["CHS", "CHT"].includes(language())}
        >
          <Text text={diff().remark} />
        </div>
      </div>
    </div>
  );
};

export const VersionDiffList = () => {
  const { allData } = useGlobalSettings();
  const entries = createMemo(() => getAllVersionDiffs(allData()));

  return (
    <div class="version-diff-list">
      <For each={entries()}>{(entry) => <VersionDiffItem id={entry.id} />}</For>
    </div>
  );
};

const getChildDiffIds = (
  item: ParsedCharacter | ParsedActionCard,
): number[] => {
  const ids: number[] = [];
  if ("parsedSkills" in item) {
    item.parsedSkills.forEach((skill) => collectChildIds(skill, ids));
  } else {
    item.children.forEach((child) => collectChildIds(child, ids));
  }
  return [...new Set(ids)].filter((id) => getVersionDiff(id) !== null);
};

export const VersionDiffBlock = (props: {
  item: ParsedCharacter | ParsedActionCard;
}) => {
  const childDiffIds = createMemo(() => getChildDiffIds(props.item));

  return (
    <>
      <VersionDiffItem id={props.item.id} variant="annotation" />
      <For each={childDiffIds()}>
        {(id) => <VersionDiffItem id={id} variant="annotation" />}
      </For>
    </>
  );
};
