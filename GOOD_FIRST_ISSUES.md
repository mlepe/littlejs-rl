# Good First Issues - Suggested Starter Tasks

This file lists approachable tasks for a new contributor. Each task is scoped to be small and testable.

- Add a new item template (data-driven)
  - Files to look at: `data/base/items/` and `data/base/templates/`.
  - Steps: Create a new JSON template, reference it in `itemRegistry`, and add a small example spawn in `src/ts/examples/itemSystemExample.ts`.

- Fix inventory UI alignment
  - Files to look at: `src/ts/screens/inventoryUI.ts`, `INVENTORY-UI-COORDINATE-FIX.md` & `INVENTORY-UI-FIXES.md`.
  - Steps: Reproduce in local dev server, patch CSS or coordinates, add a test screenshot in the PR.

- Add unit tests for `spatialSystem`
  - Files to look at: `src/ts/systems/spatialSystem.ts` and `src/ts/systems/__tests__/`.
  - Steps: Run `npm run test`, add new tests for edge cases, verify they pass.

- Add a new tile type and render example
  - Files to look at: `src/ts/tile.ts`, `src/ts/tileConfig.ts` and `src/ts/examples/worldExample.ts`.
  - Steps: Add new tile type constant, update tile config, add demo spawn in an example file, verify rendering.

If you'd like, pick one of these and add a `good-first-issue` label to the issue you create on GitHub.
