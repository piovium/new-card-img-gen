import Prism from "prismjs";
import "prismjs/components/prism-typescript.js";

Prism.languages.insertBefore("typescript", "keyword", {
  "define-keyword": {
    pattern: /\bdefine\b/,
    alias: "keyword",
  },
});

export const highlightCardTypeScript = (code: string): string =>
  Prism.highlight(code, Prism.languages.typescript, "typescript");
