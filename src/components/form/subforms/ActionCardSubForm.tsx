import { createMemo, Show } from "solid-js";
import {
  getBy,
  getSubForm,
  pseudoMainFormOption,
  type SubForm,
} from "../shared";
import { TYPE_TAG_TEXT_MAP } from "../../../constants";
import type { Language } from "../../../types";
import { PlayCostSubForm } from "./PlayCostSubForm";

interface ActionCardSubFormProps {
  language: Language;
  subForm: SubForm<
    typeof pseudoMainFormOption,
    `newItems.entities[${number}]`
  >;
}

const CARD_TYPES = [
  "GCG_CARD_EVENT",
  "GCG_CARD_ASSIST",
  "GCG_CARD_MODIFY",
] as const;
const CARD_TAGS_REGEX =
  /^GCG_TAG_(:?WEAPON|ARTIFACT|TALENT|VEHICLE|LEGEND|FOOD|RESONANCE|PLACE|ALLY|ITEM|ADVENTURE_PLACE)/;

export const ActionCardSubForm = (props: ActionCardSubFormProps) => {
  // eslint-disable-next-line solid/reactivity
  const subForm = props.subForm;

  const prefix = subForm.prefix;
  const form = getSubForm(subForm);

  const cardTypes = createMemo(() =>
    CARD_TYPES.map((value) => ({
      value,
      label: TYPE_TAG_TEXT_MAP[props.language][value],
    })),
  );
  const cardTags = createMemo(() =>
    Object.keys(TYPE_TAG_TEXT_MAP.CHS)
      .filter((value) => CARD_TAGS_REGEX.test(value))
      .map((value) => ({
        value,
        label: TYPE_TAG_TEXT_MAP[props.language][value],
      })),
  );

  const cardId = form.useStore((state) => getBy(state.values, `${prefix}.id`));

  return (
    <>
      <label class="fieldset-legend">ID</label>
      <input type="number" readOnly class="input" value={cardId()} />

      <label class="fieldset-legend" for={`${prefix}.type`}>
        类型
      </label>
      <form.AppField name={`${prefix}.type`}>
        {(field) => (
          <field.SelectField options={cardTypes()} id={`${prefix}.type`} />
        )}
      </form.AppField>

      <label class="fieldset-legend" for={`${prefix}.name`}>
        名称
      </label>
      <form.AppField name={`${prefix}.name`}>
        {(field) => (
          <field.TextField placeholder="名称" id={`${prefix}.name`} />
        )}
      </form.AppField>

      <label class="fieldset-legend">标签</label>
      <form.AppField name={`${prefix}.tags`}>
        {(field) => <field.TagsField options={cardTags()} allowsArbitrary />}
      </form.AppField>

      <label class="fieldset-legend self-start">所需骰子</label>
      <PlayCostSubForm subForm={{ form, prefix: `${prefix}.playCost` }} />

      <label
        class="fieldset-legend self-start"
        for={`${prefix}.rawDescription`}
      >
        描述
      </label>
      <form.AppField name={`${prefix}.rawDescription`}>
        {(field) => <field.RawDescriptionField class="w-full" />}
      </form.AppField>
    </>
  );
};
