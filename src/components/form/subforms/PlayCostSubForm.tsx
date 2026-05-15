import type { PlayCost } from "@gi-tcg/assets-manager";
import {
  createEffect,
  createMemo,
  For,
  Index,
  Show,
  type Accessor,
} from "solid-js";
import {
  getBy,
  getSubForm,
  type pseudoMainFormOption,
  type SubForm,
} from "../shared";
// import { useFelteContext } from "./FelteFormWrapper";

export interface CostFieldProps {
  subForm: SubForm<
    typeof pseudoMainFormOption,
    | `newItems.characters[${number}].skills[${number}].playCost`
    | `newItems.actionCards[${number}].playCost`
  >;
}

const COST_TYPE_NAME_MAP: Record<string, string> = {
  GCG_COST_DICE_VOID: "无色",
  GCG_COST_DICE_CRYO: "冰",
  GCG_COST_DICE_HYDRO: "水",
  GCG_COST_DICE_PYRO: "火",
  GCG_COST_DICE_ELECTRO: "雷",
  GCG_COST_DICE_ANEMO: "风",
  GCG_COST_DICE_GEO: "岩",
  GCG_COST_DICE_DENDRO: "草",
  GCG_COST_DICE_SAME: "同色",
  GCG_COST_ENERGY: "能量",
  GCG_COST_LEGEND: "秘传",
  // GCG_COST_SPECIAL_ENERGY: "特殊能量",
};

export const PlayCostSubForm = (props: CostFieldProps) => {
  // eslint-disable-next-line solid/reactivity
  const subForm = props.subForm;

  const prefix = subForm.prefix;
  const form = getSubForm(subForm);
  const costItems: Accessor<PlayCost[]> = form.useStore((state) =>
    getBy(state.values, prefix),
  );

  // createEffect(() => console.log(costItems()));

  const ALL_COST_TYPES = Object.keys(COST_TYPE_NAME_MAP);

  // should not use `createMemo` since `costItems()` "reference" won't change
  const selectableTypes = (currentSelected?: string) => {
    const existsTypes = new Set(costItems().map((c) => c.type));
    const restTypes = ALL_COST_TYPES.filter(
      (t) => !existsTypes.has(t) || t === currentSelected,
    );
    return restTypes;
  };

  return (
    <div class="grid grid-cols-[auto_auto_auto] gap-2">
      <form.Field name={prefix} mode="array">
        {(field) => (
          <>
            <Index each={field().state.value}>
              {(_, idx) => {
                const diceType = form.useStore((state) =>
                  getBy(state.values, `${prefix}[${idx}].type`),
                );
                const typeSelectOptions = () =>
                  selectableTypes(diceType()).map((type) => ({
                    value: type,
                    label: COST_TYPE_NAME_MAP[type],
                  }));
                return (
                  <>
                    <form.AppField name={`${prefix}[${idx}].type`}>
                      {(subField) => (
                        <subField.SelectField
                          options={typeSelectOptions()}
                          class="flex-grow appearance-none"
                        />
                      )}
                    </form.AppField>
                    <form.AppField name={`${prefix}[${idx}].count`}>
                      {(subField) => (
                        <subField.NumberField
                          type="number"
                          min="1"
                          class="input"
                        />
                      )}
                    </form.AppField>
                    <button
                      type="button"
                      class="btn btn-square btn-error btn-dash"
                      onClick={() => field().removeValue(idx)}
                    >
                      &times;
                    </button>
                  </>
                );
              }}
            </Index>
            <button
              type="button"
              class="col-span-full place-self-start btn btn-square btn-success btn-soft"
              onClick={() =>
                field().pushValue({ type: selectableTypes()[0], count: 1 })
              }
              disabled={selectableTypes().length === 0}
            >
              +
            </button>
          </>
        )}
      </form.Field>
    </div>
  );
};
