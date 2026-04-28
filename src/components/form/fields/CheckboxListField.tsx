import { For, splitProps, type ComponentProps } from "solid-js";
import { useFieldContext } from "../shared";

export interface CheckboxListFieldProps extends ComponentProps<"div"> {
  options: string[];
}

export default function CheckboxListField(props: CheckboxListFieldProps) {
  const [local, rest] = splitProps(props, ["class", "options"]);
  const field = useFieldContext<boolean[]>();

  return (
    <div
      class={`tabs-box grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] p-2 gap-1 ${local.class ?? ""}`}
      {...rest}
    >
      <For each={local.options}>
        {(label, idx) => (
          <label class="flex items-center cursor-pointer px-4 py-2 rounded-lg has-checked:bg-gray-500">
            <input
              type="checkbox"
              class="hidden"
              checked={field().state.value[idx()] ?? true}
              onChange={(e) => {
                const current = field().state.value;
                const newValue = [...current];
                newValue[idx()] = e.currentTarget.checked;
                field().handleChange(newValue);
              }}
            />
            <span class="text-sm overflow-hidden text-nowrap text-ellipsis">{label}</span>
          </label>
        )}
      </For>
    </div>
  );
}
