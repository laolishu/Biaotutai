# Tasks for skip-hidden-layers-parse

- [x] 1. Implement `filterHiddenNodes(node)` utility in `src/utils/normalizeLayer.js`.
- [x] 2. Update `src/store/index.js::parsePsd` to accept `options.skipHiddenLayers` and call `filterHiddenNodes` when true.
- [x] 3. Add import UI checkbox to enable `skipHidden` at import time; wire to `parsePsd` call.
- [x] 4. Run build to verify no regressions.
