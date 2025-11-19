# Developer Summary — How to be an active contributor

This document summarizes practical guidelines for working actively on the project, focused on ECS, separation of concerns and how to use the assistant (Copilot) without losing ownership.

## 1. Working with ECS (practical guide)

- Components are pure data objects — they should never have methods or side-effects.
- Systems are pure functions that read components and mutate them when necessary. Keep them focused (e.g., `renderSystem` only handles rendering concerns).
- Use factory functions in `entities.ts` for consistent entity creation.

Best Practices:

- Components hold only data. Example: `PositionComponent { x: number, y: number }`.
- Use `ecs.query('position', 'health')` to find entities with those components.
- Keep systems idempotent when possible — calling them twice in a frame should not break state.

Testing Tips:

- Test systems by creating a small `ECS` instance and adding components.
- Avoid testing side effects like actual rendering — test the data/state changes.

## 2. Separating Concerns

- UI rendering (LittleJS calls) should live in `renderSystem.ts`.
- Input parsing is located in `inputSystem.ts` — do not mix logic like turn processing inside `inputSystem`.
- Combat and AI logic should be separated: `combatSystem.ts` handles damage; `aiSystem.ts` decides actions.
- Utilities and helpers belong in small modules (e.g., spatial helpers in `spatialSystem.ts`).

If you need to modify a system:

- Add a small unit test in `__tests__` for the behaviour change.
- Update `SYSTEMS-REFERENCE.md` and `COMPONENTS-REFERENCE.md` if you introduce API changes.

## 3. Tasks Copilot can do without taking over development

Ask the assistant to:

- Scaffold tests and basic test harness (Jest, example tests)
- Create PR templates and skeleton code for new features
- Introduce small refactors that are well-scoped (rename a method, move functions)
- Propose implementation plans and code comments
- Generate documentation updates and example files

What you should keep control of:

- Design decisions, feature prioritization, and code merging
- Large refactors that change the public API or major architectural patterns
- Final review and acceptance of PRs

## 4. How to maintain momentum as the human lead

- Start small: pick a `good-first-issue` and implement it end-to-end
- Write or update tests — this increases your confidence and ownership
- Add documentation as you go — it helps future you and other contributors
- Use feature branches and PRs; the assistant can prepare a draft PR but you should finish and merge

## 5. Practical checklist for a small feature

1. Create a new branch: `git checkout -b feat/<short-name>`
2. Add tests (or a failing test first)
3. Implement feature or fix
4. Run `npm run lint` and `npm run test`
5. Update docs and `GOOD_FIRST_ISSUES.md` if relevant
6. Push & create PR; include tests and screenshots

## 6. Where to get help

- Use the `chat` to ask for code examples, test scaffolding, and docs
- Request code reviews via PRs; ask the assistant to produce a `PR` checklist
- If you need a more complex change (e.g., rewrite a system), open an issue and ask for a plan

You're the lead — Copilot is here to speed up tasks and scaffold work, but the final design and approvals stay with you. If you'd like, I can open an initial PR with the test harness and docs for review so you can merge it yourself.
