import { For } from "solid-js";
import { useFieldContext } from "../shared";
import type { SelectOption } from "./SelectField";

export interface RadioButtonGroupProps<T extends string> {
  options: SelectOption<T>[];
}

export default function RadioButtonGroupField<T extends string = string>(
  props: RadioButtonGroupProps<T>,
) {
  const field = useFieldContext<T>();

  return (
    <div class="tabs tabs-box w-full justify-evenly">
      <For each={props.options}>
        {(option) => (
          <label class="tab has-checked:tab-active">
            <input
              type="radio"
              name={field().name}
              value={option.value}
              hidden
              onChange={() => field().handleChange(option.value)}
              checked={field().state.value === option.value}
            />
            {option.label}
          </label>
        )}
      </For>
    </div>
  );
}
