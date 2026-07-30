export interface CodeAnalyzerResult {
  id: number;
  dependencies: number[];
  code: string;
}

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

/**
 * Keeps the renderer independent from analyzer-only fields such as
 * `bindingNames` and `location`.
 */
export const normalizeCodeAnalyzerResults = (
  value: unknown,
): CodeAnalyzerResult[] => {
  if (!Array.isArray(value)) {
    throw new Error("代码分析端点返回的内容不是数组");
  }

  const seenIds = new Set<number>();
  const result: CodeAnalyzerResult[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.id !== "number" || seenIds.has(item.id)) {
      continue;
    }
    seenIds.add(item.id);
    result.push({
      id: item.id,
      dependencies: Array.isArray(item.dependencies)
        ? item.dependencies.filter((dependency): dependency is number =>
            typeof dependency === "number",
          )
        : [],
      code: typeof item.code === "string" ? item.code : "",
    });
  }
  return result;
};

export const indexCodeAnalyzerResults = (
  results: readonly CodeAnalyzerResult[] | undefined,
): ReadonlyMap<number, CodeAnalyzerResult> =>
  new Map((results ?? []).map((result) => [result.id, result]));

/**
 * Finds the transitive dependency closure in depth-first order. Visible IDs are
 * intentionally not returned (their code is shown next to their own content),
 * but their children are still visited.
 */
export const collectDependencyCodeEntries = (
  visibleIds: readonly number[],
  results: readonly CodeAnalyzerResult[] | undefined,
): CodeAnalyzerResult[] => {
  const codeById = indexCodeAnalyzerResults(results);
  const visibleIdSet = new Set(visibleIds);
  const visited = new Set<number>();
  const dependencies: CodeAnalyzerResult[] = [];

  const visit = (id: number) => {
    if (visited.has(id)) return;
    visited.add(id);

    const entry = codeById.get(id);
    if (!entry) return;
    if (!visibleIdSet.has(id) && entry.code.trim()) {
      dependencies.push(entry);
    }
    for (const dependency of entry.dependencies) {
      visit(dependency);
    }
  };

  for (const id of visibleIds) {
    const entry = codeById.get(id);
    if (!entry) continue;
    for (const dependency of entry.dependencies) {
      visit(dependency);
    }
  }

  return dependencies;
};
