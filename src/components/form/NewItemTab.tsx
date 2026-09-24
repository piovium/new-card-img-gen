import { isActionCard } from "../../cardData";
import { createSignal, createUniqueId, For, Index, Show } from "solid-js";
import { pseudoMainFormOption, withForm } from "./shared";
import { CharacterSkillSubForm } from "./subforms/CharacterSkillSubForm";
import { CharacterBasicSubForm } from "./subforms/CharacterBasicSubForm";
import { ActionCardSubForm } from "./subforms/ActionCardSubForm";

export const NewItemsTab = withForm({
  ...pseudoMainFormOption,
  render: (props) => {
    // eslint-disable-next-line solid/reactivity
    const form = props.form;

    const language = form.useStore((state) => state.values.general.language);
    const newCharacters = form.useStore(
      (state) => state.values.newItems.characters,
    );
    const newActionCardIndices = form.useStore(
      (state) =>
        state.values.newItems.entities.flatMap((entity, index) =>
          isActionCard(entity) ? [index] : [],
        ),
    );

    const [viewingTab, setViewingTab] = createSignal<number | "extra" | null>(
      null,
    );
    const menuMobileVisible = createUniqueId();

    return (
      <div class="h-full w-full @container">
        <div class="h-full w-full flex flex-col relative @md:flex-row gap-4">
          <input id={menuMobileVisible} type="checkbox" hidden class="peer" />
          <label
            for={menuMobileVisible}
            class="self-start @md:hidden peer-checked:invisible btn btn-soft"
          >
            &gt;
          </label>
          <ul class="hidden absolute h-full @md:flex peer-checked:flex @md:relative menu bg-base-200 rounded-box min-w-20 flex-shrink-0 flex-nowrap min-h-0 overflow-auto">
            <li class="@md:hidden">
              <label for={menuMobileVisible}>&lt;</label>
            </li>
            <li>
              <h2 class="menu-title">新角色</h2>
            </li>
            <Index each={newCharacters()}>
              {(_, idx) => (
                <li>
                  <button
                    type="button"
                    classList={{
                      "menu-active":
                        viewingTab() ===
                        form.getFieldValue(`newItems.characters[${idx}].id`),
                    }}
                    onClick={() =>
                      setViewingTab(
                        form.getFieldValue(`newItems.characters[${idx}].id`) ??
                          null,
                      )
                    }
                  >
                    {form.getFieldValue(`newItems.characters[${idx}].name`)}
                  </button>
                </li>
              )}
            </Index>
            <li>
              <h2 class="menu-title">新行动卡</h2>
            </li>
            <For each={newActionCardIndices()}>
              {(idx) => {
                const card = form.useStore(
                  (state) => state.values.newItems.entities[idx],
                );
                return (
                  <li>
                    <button
                      type="button"
                      classList={{ "menu-active": viewingTab() === card()?.id }}
                      onClick={() => setViewingTab(card()?.id ?? null)}
                    >
                      {card()?.name}
                    </button>
                  </li>
                );
              }}
            </For>
            <li class="flex-grow invisible" />
            <li class="menu-title">
              <hr />
            </li>
            <li>
              <button
                type="button"
                classList={{
                  "menu-active": viewingTab() === "extra",
                }}
                onClick={() => setViewingTab("extra")}
              >
                新衍生物
              </button>
            </li>
          </ul>
          <div class="flex-grow overflow-auto">
            <Index each={newCharacters()}>
              {(_, idx) => {
                const id = form.useStore(
                  (state) => state.values.newItems.characters[idx].id,
                );
                const name = form.useStore(
                  (state) => state.values.newItems.characters[idx].name,
                );
                const skills = form.useStore(
                  (state) => state.values.newItems.characters[idx].skills,
                );
                return (
                  <div
                    class="data-[shown]:flex flex-col hidden"
                    bool:data-shown={viewingTab() === id()}
                  >
                    <div class="prose mb-3 flex flex-row gap-2 align-baseline">
                      <h3>{name()}</h3>
                      <button
                        type="button"
                        class="hidden md:inline btn btn-sm btn-link"
                        onClick={() => {
                          form.setFieldValue("general.mode", "character");
                          form.setFieldValue("general.characterId", id());
                        }}
                      >
                        显示此角色
                      </button>
                    </div>
                    <div class="grid grid-cols-[6rem_1fr] gap-2">
                      <CharacterBasicSubForm
                        subForm={{
                          form,
                          prefix: `newItems.characters[${idx}]`,
                        }}
                        language={language()}
                      />

                      <label
                        class="fieldset-legend items-start"
                        for={`newItems.characters[${idx}].storyText`}
                      >
                        角色故事
                      </label>
                      <form.AppField
                        name={`newItems.characters[${idx}].storyText`}
                      >
                        {(field) => (
                          <field.TextAreaField
                            id={`newItems.characters[${idx}].storyText`}
                            placeholder="角色故事"
                            class="h-16"
                          />
                        )}
                      </form.AppField>

                      <form.Field
                        name={`newItems.characters[${idx}].skills`}
                        mode="array"
                      >
                        {(field) => (
                          <>
                            <Index each={skills()}>
                              {(__, skillIdx) => {
                                const skillName = form.useStore(
                                  (state) =>
                                    state.values.newItems.characters[idx]
                                      .skills[skillIdx].name,
                                );
                                return (
                                  <>
                                    <div class="col-span-full flex flex-row gap-2 items-center">
                                      <span class="fieldset-legend">
                                        角色技能：{skillName()}
                                      </span>
                                      <hr class="h-[0.5em] mt-[0.5em] flex-grow text-neutral-400" />
                                      {/* 第一项（普通攻击）不可删除，有特殊排版 */}
                                      <Show when={skillIdx !== 0}>
                                        <button
                                          type="button"
                                          class="btn btn-sm btn-square btn-soft"
                                          disabled={skillIdx < 2}
                                          onClick={() => {
                                            field().swapValues(
                                              skillIdx,
                                              skillIdx - 1,
                                            );
                                          }}
                                        >
                                          &UpArrow;
                                        </button>
                                        <button
                                          type="button"
                                          class="btn btn-sm btn-square btn-soft"
                                          disabled={
                                            skillIdx === skills().length - 1
                                          }
                                          onClick={() => {
                                            field().swapValues(
                                              skillIdx,
                                              skillIdx + 1,
                                            );
                                          }}
                                        >
                                          &DownArrow;
                                        </button>
                                        <button
                                          type="button"
                                          class="btn btn-sm btn-square btn-soft btn-error"
                                          onClick={() => {
                                            field().removeValue(skillIdx);
                                          }}
                                        >
                                          &times;
                                        </button>
                                      </Show>
                                    </div>
                                    <CharacterSkillSubForm
                                      subForm={{
                                        form,
                                        prefix: `newItems.characters[${idx}].skills[${skillIdx}]`,
                                      }}
                                      language={language()}
                                    />
                                  </>
                                );
                              }}
                            </Index>
                            <hr class="col-span-full h-[0.5em] mt-[0.5em] flex-grow text-neutral-400" />
                            <button
                              class="col-span-full place-self-start btn btn-success btn-soft"
                              type="button"
                              onClick={() => {
                                field().pushValue({
                                  id: Date.now(), // TODO
                                  type: "GCG_SKILL_TAG_A",
                                  name: "",
                                  playCost: [],
                                  rawDescription: "",
                                });
                              }}
                            >
                              添加技能
                            </button>
                          </>
                        )}
                      </form.Field>
                    </div>
                  </div>
                );
              }}
            </Index>

            <For each={newActionCardIndices()}>
              {(idx) => {
                const id = form.useStore(
                  (state) => state.values.newItems.entities[idx].id,
                );
                const name = form.useStore(
                  (state) => state.values.newItems.entities[idx].name,
                );
                return (
                  <div
                    class="data-[shown]:flex flex-col hidden"
                    bool:data-shown={viewingTab() === id()}
                  >
                    <div class="prose mb-3 flex flex-row gap-2 align-baseline">
                      <h3>{name()}</h3>
                      <button
                        type="button"
                        class="hidden md:inline btn btn-sm btn-link"
                        onClick={() => {
                          form.setFieldValue("general.mode", "singleActionCard");
                          form.setFieldValue("general.actionCardId", id());
                        }}
                      >
                        显示此牌
                      </button>
                    </div>
                    <div class="grid grid-cols-[6rem_1fr] gap-2">
                      <ActionCardSubForm
                        subForm={{
                          form,
                          prefix: `newItems.entities[${idx}]`,
                        }}
                        language={language()}
                      />
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </div>
    );
  },
});
