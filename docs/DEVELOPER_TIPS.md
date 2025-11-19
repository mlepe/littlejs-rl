# Developer Tips & Pairing with Copilot

This short guide shows how to be an active developer and use Copilot productively.

## Use small, focused issues

- Create issues that are small and scoped: "Fix examine cursor clamp" or "Add "iron_sword" item template".
- Use labels: `good-first-issue`, `bug`, `docs`, `enhancement`.

## Run server locally

- Use this command in a Windows cmd terminal:

```cmd
npm install
copy .env.example .env
npm run dev
```

- Live reload will show changes in the browser.

## Typical local development cycle

1. Create a branch: `git checkout -b feat/friendly-npc`
2. Implement a small change
3. Run `npm run dev` and confirm UI or behavior
4. Add a test if possible
5. Commit and push, create a PR and request review

## Pairing with Copilot in VS Code

- Ask Copilot to provide a short plan: `Help me implement X in 3 steps`.
- Ask for scaffolding: `Create unit tests for this system`.
- When you get an error, paste the stack trace and ask: `Why is this error happening?`.

## Debugging tips

- Add console logs to systems while you're developing for quick feedback
- Use `Game.isDebug` or `GAME_DEBUG=true` in `.env` to display runtime debug info
- Run `npm run build` to check TypeScript and bundler errors
- Run `npm run lint` to check code style

## When to ask for help

- Ask for review early: a PR with a clear description and failing tests helps reviewers
- Use the `chat` to explain a system and get suggestions for improvements
- Ask for help isolating bugs and for unit test scaffolding

## Want tests but no test runner? Ask Copilot.

- If you want a test framework scaffolded (Jest or Mocha), ask in chat and it can create the `package.json` script and example tests.
