# Specs: skip-hidden-layers-parse

## API

- `parsePsd(file, options?)`
  - `options.skipHiddenLayers?: boolean` — if true, filters hidden nodes before normalization

## Behavior

- `filterHiddenNodes(node)` should recursively remove hidden leaf nodes and groups that become empty after filtering.
- Filtering should not mutate the original `psdData` object; return a shallow-copied tree where necessary.
- When filtering is enabled, `parsePsd` returns a normalized tree with fewer nodes; all downstream logic (`normalizeLayer`, `store.layers`) must handle this transparently.

## Tests

- Unit tests for `filterHiddenNodes` with nested groups and mixed hidden/visible children
- Integration tests for `parsePsd(file, { skipHiddenLayers: true })` verifying `store.layers` size is reduced and visible nodes preserved

## CLI / UI

- `openspec-cn` 不需要 CLI 改动；UI 导入对话应新增复选框。  
- No persistence by default.