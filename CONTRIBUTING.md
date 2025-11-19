# Contributing to LittleJS Roguelike

## Reporting Bugs and Requesting Features

### When to Use Chat (VS Code Copilot)

Use chat for **immediate fixes during active development**:

- Quick bugs that need fixing right now
- Syntax errors or compile issues
- Questions about how to implement something
- Iterative debugging (I can see your files and fix them directly)
- Code refactoring or improvements
- Understanding existing code

**Benefits:**

- Immediate response and fixes
- I have full context of your codebase
- Can make edits directly to your local files
- Interactive back-and-forth debugging
- Faster workflow

### When to Create GitHub Issues

Create issues for **tracking and organization**:

- Feature requests you want to implement later
- Bugs you discovered but don't need fixed immediately
- Ideas for future improvements
- Documentation that needs writing
- Refactoring tasks for later
- Breaking down large features into smaller tasks

**Benefits:**

- Track progress over time
- Document decisions and discussions
- Share with other contributors
- Keep a history of what's been implemented
- Organize work with labels and milestones

## Workflow Recommendation

1. **During coding session with Copilot**: Report everything in chat
2. **After coding session**: Create GitHub issues for:
   - Features discussed but not implemented
   - Bugs discovered but deferred
   - Ideas that came up during discussion
3. **Planning next session**: Review GitHub issues to decide what to work on
4. **Start coding**: Jump back into chat for implementation

## Example Workflow

```
Chat: "I found a bug where the player can walk through walls"
→ Copilot fixes it immediately

Chat: "We should add an inventory system eventually"
→ After session: Create GitHub issue "Add inventory system with weight capacity"

Next session: Review issue, discuss in chat, implement with Copilot's help
```

This way you get the best of both worlds: immediate help when coding + organized tracking for the long term!

## Active Developer Guide ✅

If you want to take a hands-on role in development (great!), follow these steps to get started and be productive quickly:

1. Setup & run the game locally (Windows/cmd)

```cmd
git clone <repository-url>
cd littlejs-rl
npm install
copy .env.example .env
npm run dev
```

The dev server opens on http://localhost:8080. Make changes in `src/ts/` and the dev server will reload.

2. Create a working branch for every feature

```cmd
git checkout -b feat/<short-name>
```

Commit often with clear messages and push regularly. Use PRs for review.

3. Use tasks and the issue tracker

- Mark tasks as `good-first-issue` or `help-wanted` so you (or others) can pick them quickly.
- For larger features, create a task list in the issue and split the work across small PRs.

4. Add tests and run linters

Run the lint task if you've updated code style:

```cmd
npm run lint
```

Add unit tests or integration tests (if present). If tests use node scripts or other frameworks, add them to `package.json` and document them in the issue for reviewers.

5. Small, testable incremental changes are the fastest path to progress

- Start with a small, well-scoped change: one function, small system, or a single bugfix.
- Run the dev server, then add new tests or adjust existing ones.
- Create a PR referencing the issue; keep PR descriptions clear and include before/after screenshots if you changed UI.

6. PR review checklist

- Automated builds pass
- Linting results are clean
- Code is small and isolated
- Tests exercised by the patch (unit or integration)
- Documentation updated (e.g., README or KEYBINDINGS-REFERENCE if controls changed)

7. How to pick first tasks

- Look for labels such as `good-first-issue`, `help wanted`, or `docs`.
- If none exist, open an issue describing what you want to change and tag it `good-first-issue` for yourself.
- Ask in chat to review your chosen task — we can help scope it.

### Starter tasks (good for new contributors)

- Add a small feature: e.g., a new tile type or new item template.
- Fix a minor UI bug: check `INVENTORY-UI-FIXES.md` and `INVENTORY-UI-COORDINATE-FIX.md`.
- Improve docs: update `KEYBINDINGS-REFERENCE.md`, `QUICKSTART.md`, or add a walkthrough in `docs/`.
- Add unit tests for a system (start with `spatialSystem` or `derivedStatsSystem`).
- Add `good-first-issue` label to an issue you want to work on.

These tasks keep the codebase approachable and give quick feedback loops.

8. Pairing with Copilot

- Use `chat` to ask Copilot to prepare a short implementation plan or scaffold a test case.
- Ask for a `PR` description template to copy-paste into GitHub.
- When stuck, paste the failing test stack or relevant code, and ask targeted questions (e.g., "What's wrong with my tile collision check?").

### Testing & debug tips

- Use `npm run dev` to run the dev server and watch for changes.
- Use `npm run build` to verify TypeScript compiles and that there are no type errors.
- Use `npm run lint` to check style issues.
- Add simple unit tests by installing a test runner like `jest` (optional). Start with tests for pure functions/systems.

If you want, I can scaffold a test framework in the repo and add an example test.

9. Keep docs updated

- If you add or change controls, update `KEYBINDINGS-REFERENCE.md` and `QUICKSTART.md`.
- If you change systems, update `SYSTEMS-REFERENCE.md` and `COMPONENTS-REFERENCE.md` where relevant.

Small measurable steps → confidence → larger changes. You're the lead developer; use the CI, issues, and PRs to stay in control.
