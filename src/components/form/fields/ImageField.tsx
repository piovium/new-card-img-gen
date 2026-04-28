import { Show, type JSX } from "solid-js";
import { useFieldContext } from "../shared";

export interface ImageFieldProps {
  id?: string;
}

/**
 * A component that act like a string field, but accept whether:
 * - An URL points to a image;
 * - or a data URI, uploaded by user from their local PC.
 */
export default function ImageField(props: ImageFieldProps) {
  const field = useFieldContext<string | undefined>();

  const value = () => field().state.value;
  const setValue = (v: string) => field().handleChange(v);
  const handleBlur = () => field().handleBlur();

  const isDataUri = () => {
    const v = value();
    return typeof v === "string" && v.startsWith("data:");
  };

  const handleUrlInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (
    event,
  ) => {
    const next = event.currentTarget.value;
    setValue(next);
  };

  const handleFileChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = (
    e,
  ) => {
    const fileInputEl = e.currentTarget;
    const file = fileInputEl.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) return;
      setValue(result);
      handleBlur();
      fileInputEl.value = "";
    };
    reader.readAsDataURL(file);
  };

  const clearField = () => {
    setValue("");
    handleBlur();
  };

  return (
    <div class="flex flex-row items-center gap-2">
      <div class="flex-1 h-20 bg-base-200 rounded-lg flex items-center justify-center overflow-clip">
        <Show when={value()}>{(url) => <img src={url()} class="w-full h-full object-contain" />}</Show>
      </div>
      <div class="flex flex-row items-center gap-2">
        <Show
          when={isDataUri()}
          fallback={
            <input
              class="input"
              id={props.id}
              value={value() || ""}
              onInput={handleUrlInput}
              onBlur={handleBlur}
              placeholder="URL"
            />
          }
        >
          <button type="button" class="btn btn-outline" onClick={clearField}>
            清除上传
          </button>
        </Show>
        或
        <label class="btn btn-outline">
          <span>上传图片</span>
          <input
            type="file"
            accept="image/*"
            class="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
