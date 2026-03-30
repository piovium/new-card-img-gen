import { Show } from "solid-js";
import type { ParsedChild, ParsedSkill } from "../../types";
import { useGlobalSettings } from "../../context";
import { TYPE_TAG_TEXT_MAP } from "../../constants";
import { Cost } from "./Cost";
import { Children } from "./Children";
import { Description } from "./Token";
import { Text } from "./Text";
import "./SkillBox.css";
import { iconUrl } from "../../utils";

export const SkillBox = (props: { skill: ParsedSkill }) => {
  const { displayId, language } = useGlobalSettings();
  const skill = () => props.skill;
  return (
    <Show when={!skill().hidden}>
      <div class="skill-box figure">
        <div class="skill-type">
          {TYPE_TAG_TEXT_MAP[language()][skill().type]}
        </div>
        <Show when={skill().playCost?.length > 0}>
          <Cost type="skill" cost={skill().playCost} />
        </Show>
        <div
          class="skill-icon"
          style={{
            "mask-image": `url("${iconUrl(skill())}")`,
          }}
        />
        <div class="skill-title">
          <Text text={skill().name} />
          <Show when={displayId()}>
            <span> </span>
            <span class="id-box">ID: {skill().id}</span>
          </Show>
        </div>
        <div class={`skill-description`}>
          <Description description={skill().parsedDescription} />
        </div>
        <Show when={skill().children.length > 0}>
          <Children children={skill().children} />
        </Show>
      </div>
    </Show>
  );
};

export const DebugBox = (props: { children: ParsedChild[] }) => {
  return (
      <div class="skill-box debug-box figure">
        <div class="skill-type">
          {`DEBUG`}
        </div>
        <Children children={props.children} />
      </div>
  );
};