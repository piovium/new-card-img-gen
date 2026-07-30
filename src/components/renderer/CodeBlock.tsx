import { createMemo, Show } from "solid-js";
import { useGlobalSettings } from "../../context";
import { highlightCardTypeScript } from "../../codeHighlight";
import "./CodeBlock.css";

export const CodeBlock = (props: { id: number }) => {
  const { codeAnalyzerIndex, debug } = useGlobalSettings();
  const code = () => codeAnalyzerIndex().get(props.id)?.code;
  const highlightedCode = createMemo(() => highlightCardTypeScript(code() || ""));

  return (
    <Show when={debug() && code()?.trim()}>
      <section class="code-block">
        <div class="code-block-title">Code</div>
        <pre>
          <code class="language-typescript" innerHTML={highlightedCode()} />
        </pre>
      </section>
    </Show>
  );
};
