import { Switch, Match } from "solid-js";
import { TYPE_TAG_TEXT_MAP, DEBUG_TAG_TEXT_MAP } from "../../constants";
import { useGlobalSettings } from "../../context";
import "./KeywordTag.css";

export const KeywordTag = (props: {
  tag: string;
  image?: string;
  className?: string;
}) => {
  const { language, debug } = useGlobalSettings();
  return (
    <Switch>
      <Match when={TYPE_TAG_TEXT_MAP[language()][props.tag]}>
        <div class={`keyword-tag ${props.className ?? ""}`}>
          <div class="keyword-tag-text">
            {TYPE_TAG_TEXT_MAP[language()][props.tag]}
          </div>
        </div>
      </Match>
      <Match when={debug() && DEBUG_TAG_TEXT_MAP[language()][props.tag]}>
        <div class={`keyword-tag debug-tag ${props.className ?? ""}`}>
          <div class="keyword-tag-text">
            {DEBUG_TAG_TEXT_MAP[language()][props.tag]}
          </div>
        </div>
      </Match>
    </Switch>
  );
};
