import { For, Show } from "solid-js";
import type { PlayCost } from "@gi-tcg/assets-manager";
import { BASE_URL, COST_TYPE_IMG_NAME_MAP } from "../../constants";
import "./Cost.css";

const diceImageUrl = (type: string) =>
  `${BASE_URL}assets/UI_Gcg_DiceL_${
    COST_TYPE_IMG_NAME_MAP[type]
  }_Glow_HD.png`;

export const Cost = (props: {
  type: "skill" | "keyword" | "actionCard";
  cost: PlayCost[];
  readonly?: boolean;
}) => {
  const rootClassName = () =>
    ({
      skill: "skill-cost-group",
      keyword: "keyword-cost-group",
      actionCard: "action-card-cost-group",
    }[props.type]);
  const diceClassName = () =>
    props.type === "actionCard" ? "action-card-cost-dice" : "dice-icon";
  return (
    <div class={rootClassName()}>
      <For each={props.cost}>
        {({ type, count }) => (
          <div class="cost">
            <img src={diceImageUrl(type)} class={diceClassName()} />
            <Show when={type !== "GCG_COST_LEGEND"}>
              <div class="stroked-text-top">{count}</div>
              <div class="stroked-text-bottom">{count}</div>
            </Show>
            <Show when={props.readonly}>
              <div class="cost-readonly-mark" />
            </Show>
          </div>
        )}
      </For>
    </div>
  );
};
