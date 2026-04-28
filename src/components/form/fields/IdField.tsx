import { splitProps, type ComponentProps } from "solid-js";
import { useFieldContext } from "../shared";

export interface IdFieldProps extends ComponentProps<"input"> {
  nameMap: Map<number, string>;
}

export default function IdField(props: IdFieldProps) {
  const [local, rest] = splitProps(props, ["class", "hidden"]);
  const field = useFieldContext<number>();
  return (
    <label class={`input ${local.class ?? ""}`} classList={{ hidden: !!local.hidden }}>
      <input
        type="number"
        class="grow"
        onInput={(e) => field().handleChange(e.currentTarget.valueAsNumber)}
        onBlur={() => field().handleBlur()}
        value={field().state.value}
        {...rest}
      />
      <span class="label shrink-0 max-w-[50%] overflow-clip">
        {props.nameMap.get(field().state.value ?? 0)}
      </span>
    </label>
  );
}
