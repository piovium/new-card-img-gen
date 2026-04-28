import {
  createMemo,
  createSignal,
  Index,
  Show,
  createResource,
} from "solid-js";
import { pseudoMainFormOption, withForm } from "./shared";
import type { AllRawData, AdjustmentData, PlayCost } from "../../types";
import { useGlobalSettings } from "../../context";
import { getData } from "../../shared";
import { parseId } from "../../utils";
import {
  ADJUSTMENT_SUBJECT_LABELS,
  ADJUSTMENT_TYPE_LABELS,
  COST_TYPE_SPRITE_MAP,
} from "../../constants";

/* eslint-disable solid/reactivity */
/* eslint-disable @typescript-eslint/no-explicit-any */

// ============ Pure Logic Functions ============

const findDescriptionById = (data: AllRawData, id: number): string | null => {
  const descriptionMap = new Map<number, string | null>([
    ...data.actionCards.map(
      (card) => [card.id, card.description ?? null] as const,
    ),
    ...data.entities.flatMap((entity) => [
      [entity.id, entity.description ?? null] as const,
      ...entity.skills.map(
        (skill) => [skill.id, skill.description ?? null] as const,
      ),
    ]),
    ...data.characters.flatMap((character) => [
      [character.id, null] as const,
      ...character.skills.map(
        (skill) => [skill.id, skill.description ?? null] as const,
      ),
    ]),
  ]);

  return descriptionMap.get(id) ?? null;
};

const findHpById = (data: AllRawData, id: number): number | null => {
  const hpMap = new Map<number, number>(
    data.characters.map((character) => [character.id, character.hp]),
  );

  return hpMap.get(id) ?? null;
};

const findPlayCostById = (data: AllRawData, id: number): PlayCost[] | null => {
  const playCostEntries: readonly (readonly [number, PlayCost[]])[] = [
    ...data.actionCards.map((card) => [card.id, card.playCost] as const),
    ...data.characters.flatMap((character) =>
      character.skills.map((skill) => [skill.id, skill.playCost] as const),
    ),
    ...data.entities.flatMap((entity) =>
      entity.skills.map((skill) => [skill.id, skill.playCost] as const),
    ),
  ];

  const playCostMap = new Map<number, PlayCost[]>(playCostEntries);

  return playCostMap.get(id) ?? null;
};

const formatPlayCost = (playCost: PlayCost[] | null): string | null => {
  if (!playCost) return null;
  if (playCost.length === 0) {
    return `<b>0</b>${COST_TYPE_SPRITE_MAP["GCG_COST_DICE_SAME"]}`;
  }
  return playCost
    .map(({ type, count }) => `<b>${count}</b>${COST_TYPE_SPRITE_MAP[type]}`)
    .join("");
};

interface QueryContext {
  form: any;
  adjIdx: number;
  recordIdx: number;
  allData: AllRawData;
  latestData: AllRawData | undefined;
}

const queryRecordData = (
  context: QueryContext,
  recordId: string | number,
  recordType: string,
) => {
  const numericRecordId = parseId(recordId);
  if (numericRecordId === null) return;

  const { form, adjIdx, recordIdx, allData, latestData } = context;
  let handled = false;

  if (recordType === "hp") {
    const currentHp = findHpById(allData, numericRecordId);
    const latestHp = latestData
      ? findHpById(latestData, numericRecordId)
      : null;

    if (latestHp !== null) {
      form.setFieldValue(
        `adjustments[${adjIdx}].adjustment[${recordIdx}].oldData`,
        `<b>${latestHp}</b>`,
      );
      handled = true;
    }

    if (currentHp !== null) {
      form.setFieldValue(
        `adjustments[${adjIdx}].adjustment[${recordIdx}].newData`,
        `<b>${currentHp}</b>`,
      );
      handled = true;
    }
  } else if (recordType === "cost") {
    const currentCost = formatPlayCost(
      findPlayCostById(allData, numericRecordId),
    );
    const latestCost = latestData
      ? formatPlayCost(findPlayCostById(latestData, numericRecordId))
      : null;

    if (latestCost !== null) {
      form.setFieldValue(
        `adjustments[${adjIdx}].adjustment[${recordIdx}].oldData`,
        latestCost,
      );
      handled = true;
    }

    if (currentCost !== null) {
      form.setFieldValue(
        `adjustments[${adjIdx}].adjustment[${recordIdx}].newData`,
        currentCost,
      );
      handled = true;
    }
  }

  if (handled) return;

  const currentDesc = findDescriptionById(allData, numericRecordId);
  const latestDesc = latestData
    ? findDescriptionById(latestData, numericRecordId)
    : null;

  if (latestDesc !== null) {
    form.setFieldValue(
      `adjustments[${adjIdx}].adjustment[${recordIdx}].oldData`,
      latestDesc,
    );
  }

  if (currentDesc !== null) {
    form.setFieldValue(
      `adjustments[${adjIdx}].adjustment[${recordIdx}].newData`,
      currentDesc,
    );
  }
};

const createBoldKeyDownHandler = (
  handleChange: (value: string) => void,
  getValue: () => string | undefined,
) => {
  return (e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }) => {
    if (e.ctrlKey && e.key === "b") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = getValue() || "";
      const selectedText = value.substring(start, end);
      if (selectedText) {
        const newValue =
          value.substring(0, start) +
          "<b>" +
          selectedText +
          "</b>" +
          value.substring(end);
        handleChange(newValue);
        Promise.resolve().then(() => {
          textarea.focus();
          const newCursorPos = end + 7; // <b></b> = 7 chars
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        });
      }
    }
  };
};

// ============ Sub Components ============

interface AdjustmentCardListProps {
  adjustments: () => AdjustmentData[];
  names: () => Map<number, string> | undefined;
  currentIndex: () => number | null;
  onSelect: (index: number) => void;
  onAdd: () => void;
}

const AdjustmentCardList = (props: AdjustmentCardListProps) => {
  return (
    <ul class="menu bg-base-200 rounded-box min-h-0 overflow-auto flex-grow min-w-20 gap-1">
      <li>
        <h2 class="menu-title">调整卡牌</h2>
      </li>
      <Index each={props.adjustments()}>
        {(adj, idx) => (
          <li>
            <button
              type="button"
              classList={{
                "menu-active": props.currentIndex() === idx,
              }}
              onClick={() => props.onSelect(idx)}
            >
              {parseId(adj().id) === null
                ? adj().id
                : props.names()?.get(parseId(adj().id) ?? 0) ?? "新增调整卡牌"}
            </button>
          </li>
        )}
      </Index>
      <li>
        <button
          class="btn btn-success btn-soft btn-sm"
          type="button"
          onClick={props.onAdd}
        >
          新建
        </button>
      </li>
    </ul>
  );
};

interface AdjustmentRecordEditorProps {
  form: any;
  adjIdx: number;
  recordIdx: number;
  allData: AllRawData;
  latestData: AllRawData | undefined;
  onRemove: () => void;
}

const AdjustmentRecordEditor = (props: AdjustmentRecordEditorProps) => {
  const fieldNamePrefix = `adjustments[${props.adjIdx}].adjustment[${props.recordIdx}]`;
  const recordId = props.form.useStore(
    (state: any) =>
      state.values.adjustments[props.adjIdx]?.adjustment[props.recordIdx]?.id,
  );
  const recordType = props.form.useStore(
    (state: any) =>
      state.values.adjustments[props.adjIdx]?.adjustment[props.recordIdx]?.type,
  );

  const handleQuery = () => {
    queryRecordData(
      {
        form: props.form,
        adjIdx: props.adjIdx,
        recordIdx: props.recordIdx,
        allData: props.allData,
        latestData: props.latestData,
      },
      recordId(),
      recordType(),
    );
  };

  return (
    <>
      <div class="col-span-full flex flex-row gap-2 items-center mt-2">
        <span class="text-sm font-bold">调整项 {props.recordIdx + 1}</span>
        <hr class="h-[0.5em] mt-[0.5em] flex-grow text-neutral-400" />
        <button
          type="button"
          class="btn btn-sm btn-square btn-soft btn-error"
          onClick={props.onRemove}
        >
          &times;
        </button>
      </div>

      <label class="fieldset-legend" for={`${fieldNamePrefix}.id`}>
        ID
      </label>
      <props.form.AppField name={`${fieldNamePrefix}.id`}>
        {(fieldApi: any) => (
          <div class="flex gap-2">
            <fieldApi.TextField id={`${fieldNamePrefix}.id`} class="w-full" />
            <button
              type="button"
              class="btn btn-sm btn-ghost h-full"
              onClick={handleQuery}
              title="填充description"
            >
              填充
            </button>
          </div>
        )}
      </props.form.AppField>

      <label class="fieldset-legend" for={`${fieldNamePrefix}.subject`}>
        类型
      </label>
      <props.form.AppField name={`${fieldNamePrefix}.subject`}>
        {(fieldApi: any) => (
          <fieldApi.SelectField
            id={`${fieldNamePrefix}.subject`}
            class="w-full"
            options={Object.entries(ADJUSTMENT_SUBJECT_LABELS.CHS).map(
              ([value, label]) => ({ value, label }),
            )}
          />
        )}
      </props.form.AppField>

      <label class="fieldset-legend" for={`${fieldNamePrefix}.type`}>
        改动内容
      </label>
      <props.form.AppField name={`${fieldNamePrefix}.type`}>
        {(fieldApi: any) => (
          <fieldApi.SelectField
            id={`${fieldNamePrefix}.type`}
            class="w-full"
            options={Object.entries(ADJUSTMENT_TYPE_LABELS.CHS).map(
              ([value, label]) => ({ value, label }),
            )}
          />
        )}
      </props.form.AppField>

      <label class="fieldset-legend" for={`${fieldNamePrefix}.oldData`}>
        旧数据
      </label>
      <props.form.AppField name={`${fieldNamePrefix}.oldData`}>
        {(fieldApi: any) => (
          <fieldApi.TextAreaField
            id={`${fieldNamePrefix}.oldData`}
            class="h-24 w-full"
            onKeyDown={createBoldKeyDownHandler(
              fieldApi().handleChange,
              () => fieldApi().state.value,
            )}
          />
        )}
      </props.form.AppField>

      <label class="fieldset-legend" for={`${fieldNamePrefix}.newData`}>
        新数据
      </label>
      <props.form.AppField name={`${fieldNamePrefix}.newData`}>
        {(fieldApi: any) => (
          <fieldApi.TextAreaField
            id={`${fieldNamePrefix}.newData`}
            class="h-24 w-full"
            onKeyDown={createBoldKeyDownHandler(
              fieldApi().handleChange,
              () => fieldApi().state.value,
            )}
          />
        )}
      </props.form.AppField>
    </>
  );
};

interface AdjustmentDetailProps {
  form: any;
  idx: number;
  shown: boolean;
  names: () => Map<number, string> | undefined;
  allData: AllRawData;
  latestData: AllRawData | undefined;
  onDelete: () => void;
}

const AdjustmentDetail = (props: AdjustmentDetailProps) => {
  const adjId = props.form.useStore(
    (state: any) => state.values.adjustments[props.idx]?.id,
  );
  const records = props.form.useStore(
    (state: any) =>
      state.values.adjustments[props.idx]?.adjustment || [],
  );

  const fieldNamePrefix = `adjustments[${props.idx}]`;

  const handleAddRecord = () => {
    props.form.setFieldValue(
      `${fieldNamePrefix}.adjustment`,
      (prev: any[]) => [
        ...prev,
        {
          id: adjId() ?? 0,
          subject: "self",
          type: "effect",
          oldData: "",
          newData: "",
        },
      ],
    );
  };

  return (
    <div
      class="data-[shown]:flex flex-col hidden gap-4"
      bool:data-shown={props.shown}
    >
      <div class="col-span-full flex flex-row gap-2 align-baseline items-center justify-between">
        <h3 class="mb-0 text-lg font-bold">
          {parseId(adjId()) === null
            ? adjId()
            : props.names()?.get(parseId(adjId()) ?? 0) ?? "新增调整卡牌"}
        </h3>
        <button
          type="button"
          class="btn btn-sm btn-error btn-soft"
          onClick={props.onDelete}
        >
          删除卡牌
        </button>
      </div>

      <div class="grid grid-cols-[6rem_1fr] gap-2">
        <label class="fieldset-legend" for={`${fieldNamePrefix}.id`}>
          ID
        </label>
        <props.form.AppField name={`${fieldNamePrefix}.id`}>
          {(fieldApi: any) => (
            <fieldApi.TextField id={`${fieldNamePrefix}.id`} class="w-full" />
          )}
        </props.form.AppField>

        <label class="fieldset-legend" for={`${fieldNamePrefix}.offset`}>
          偏移量
        </label>
        <props.form.AppField name={`${fieldNamePrefix}.offset`}>
          {(fieldApi: any) => (
            <fieldApi.NumberField id={`${fieldNamePrefix}.offset`} class="w-full" />
          )}
        </props.form.AppField>

        <props.form.Field
          name={`${fieldNamePrefix}.adjustment`}
          mode="array"
        >
          {(arrayField: any) => (
            <>
              <Index each={records()}>
                {(_, recordIdx) => (
                  <AdjustmentRecordEditor
                    form={props.form}
                    adjIdx={props.idx}
                    recordIdx={recordIdx}
                    allData={props.allData}
                    latestData={props.latestData}
                    onRemove={() => arrayField().removeValue(recordIdx)}
                  />
                )}
              </Index>
              <div class="col-span-full">
                <button
                  class="btn btn-success btn-soft btn-sm w-full"
                  type="button"
                  onClick={handleAddRecord}
                >
                  添加调整项
                </button>
              </div>
            </>
          )}
        </props.form.Field>
      </div>
    </div>
  );
};

// ============ Main Component ============

export const BalanceAdjustmentTab = withForm({
  ...pseudoMainFormOption,
  render: (props) => {
    const form = props.form;

    const adjustments = form.useStore((state) => state.values.adjustments);
    const currentVersion = form.useStore(
      (state) => state.values.general.version,
    );
    const language = form.useStore((state) => state.values.general.language);

    const { allData } = useGlobalSettings();
    const names = createMemo(() => {
      const data = allData();
      return new Map(
        [...data.characters, ...data.actionCards].map((v) => [v.id, v.name]),
      );
    });

    const [latestData] = createResource(
      () => (currentVersion() !== "latest" ? language() : null),
      async (lang) => {
        return await getData("latest", lang);
      },
    );

    const [currentAdjustmentIndex, setCurrentAdjustmentIndex] = createSignal<
      number | null
    >(null);

    const handleAddCard = () => {
      form.setFieldValue("adjustments", (prev: AdjustmentData[]) => [
        ...prev,
        { id: 0, offset: 0, adjustment: [] },
      ]);
      setCurrentAdjustmentIndex(adjustments().length);
    };

    const handleDeleteCard = (idx: number) => () => {
      form.setFieldValue("adjustments", (prev: AdjustmentData[]) =>
        prev.filter((_, i) => i !== idx),
      );
      setCurrentAdjustmentIndex(null);
    };

    return (
      <div class="h-full w-full @container">
        <div class="h-full w-full flex flex-col relative @md:flex-row gap-4">
          <div class="flex flex-col gap-2 flex-shrink-0">
            <AdjustmentCardList
              adjustments={adjustments}
              names={names}
              currentIndex={currentAdjustmentIndex}
              onSelect={setCurrentAdjustmentIndex}
              onAdd={handleAddCard}
            />
          </div>
          <div class="flex-grow overflow-auto">
            <Show when={currentAdjustmentIndex() !== null}>
              <Index each={adjustments()}>
                {(_, idx) => (
                  <AdjustmentDetail
                    form={form}
                    idx={idx}
                    shown={currentAdjustmentIndex() === idx}
                    names={names}
                    allData={allData()}
                    latestData={latestData()}
                    onDelete={handleDeleteCard(idx)}
                  />
                )}
              </Index>
            </Show>
          </div>
        </div>
      </div>
    );
  },
});
