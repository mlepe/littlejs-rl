# VSCode Tasks vs NPM Scripts - Developer Guide

## Executive Summary

For executing custom Copilot chat commands with arguments and user input, **VSCode tasks** are the better option.

**Recommendation:** Use VSCode tasks in `.vscode/tasks.json` for Copilot chat commands. Keep npm scripts for build/development workflows.

---

## VSCode Tasks Advantages

### 1. Input Prompting

Tasks support `${input:variableName}` to prompt users for input at runtime

### 2. Problem Matchers

Integrate with VSCode's Problems panel for better error visibility

### 3. Command Palette Integration

Tasks appear in the Command Palette and can be bound to keyboard shortcuts

### 4. Presentation Options

Control terminal behavior (reveal, focus, clear, panel display)

### 5. Conditional Execution

Can depend on other tasks or run in specific contexts

### 6. Better Argument Handling

Can use VSCode variables like:

- `${file}` - Current file path
- `${selectedText}` - Currently selected text
- `${lineNumber}` - Current line number
- `${workspaceFolder}` - Workspace root
- Many more...

---

## NPM Scripts Limitations

### 1. No Native Input Prompting

Requires additional tools or workarounds for user input

### 2. Less IDE Integration

Just commands that run in terminal - no special VSCode integration

### 3. Limited Argument Passing

Need to use `--` separator and parse manually

### 4. No Problem Matcher Support

Errors don't integrate with VSCode UI

---

## Example VSCode Task for Copilot Chat

```json
{
  "label": "Copilot: Add JSDoc",
  "type": "shell",
  "command": "code",
  "args": ["chat", "Add JSDoc for this element: ${input:elementName}"],
  "inputs": [
    {
      "id": "elementName",
      "type": "promptString",
      "description": "Element name or description"
    }
  ],
  "presentation": {
    "reveal": "never",
    "focus": false
  }
}
```

---

## When to Use Each

### Use VSCode Tasks For:

- ✅ Copilot chat commands
- ✅ Custom development workflows
- ✅ IDE-integrated tools
- ✅ Tasks requiring user input
- ✅ Tasks using VSCode variables
- ✅ Tasks with problem matchers

### Use NPM Scripts For:

- ✅ Build processes (`npm run build`)
- ✅ Development servers (`npm run dev`)
- ✅ Package management (`npm run clean`)
- ✅ Cross-platform compatibility
- ✅ CI/CD pipelines
- ✅ Shareable workflows (not IDE-specific)

---

## Quick Reference

### Running Tasks

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select your task
4. Enter any required inputs

### Task File Location

`.vscode/tasks.json`

### NPM Scripts Location

`package.json` → `"scripts"` section

---

## Additional Resources

- [VSCode Tasks Documentation](https://code.visualstudio.com/docs/editor/tasks)
- [Task Variables Reference](https://code.visualstudio.com/docs/editor/variables-reference)
- [NPM Scripts Documentation](https://docs.npmjs.com/cli/v8/using-npm/scripts)
