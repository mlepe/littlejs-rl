# GitHub Copilot Tools Guide

## When to Use CLI vs Chat

### Use Copilot CLI (Terminal Assistant) When:

- **Executing commands** - Running builds, tests, scripts, or any terminal commands
- **Modifying files** - Creating, editing, or deleting files in your codebase
- **File operations** - Moving, renaming, or organizing files
- **Git operations** - Committing, branching, pushing, pulling
- **Running tasks** - Build tasks, dev servers, deployment scripts
- **Installing packages** - npm install, pip install, etc.
- **Debugging with actions** - Running debuggers, checking logs, restarting services
- **Multi-step workflows** - Complex tasks requiring multiple commands in sequence
- **Getting work done** - Any hands-on coding or system task

**Key trait**: I can **execute and modify** - direct interaction with your file system and terminal

### Use Copilot Chat When:

- **Learning and explanations** - Understanding how code works or why something happens
- **Code discussions** - Talking through approaches, architectures, or design patterns
- **Quick questions** - "What does this function do?" "How does this work?"
- **Planning** - Discussing what to build before building it
- **Theoretical help** - Algorithm explanations, best practices, code reviews
- **Documentation reading** - Getting explanations of frameworks or APIs
- **Suggestions only** - When you want ideas but will implement manually

**Key trait**: Chat provides **guidance and conversation** without executing

## Quick Decision Tree

```
Need to DO something? → CLI
Need to UNDERSTAND something? → Chat
Need to DISCUSS approach? → Chat
Need to EXECUTE commands? → CLI
Need to EDIT files? → CLI
Want code EXPLAINED? → Chat
Want code IMPLEMENTED? → CLI
```

## Example Scenarios

| Scenario                            | Use                                 |
| ----------------------------------- | ----------------------------------- |
| "Add a new component to the ECS"    | **CLI** - Will create the file      |
| "Explain how ECS components work"   | **Chat** - Will explain concepts    |
| "Run the build and fix any errors"  | **CLI** - Will execute and modify   |
| "What's the best pattern for this?" | **Chat** - Will discuss options     |
| "Create entity factory for Boss"    | **CLI** - Will write the code       |
| "Why is my AI system not working?"  | **Chat** - Will analyze and explain |
| "Commit these changes to git"       | **CLI** - Will execute git commands |
| "Review this code for issues"       | **Chat** - Will analyze and suggest |

## Working Together

The tools complement each other:

1. Use **Chat** to plan and understand
2. Use **CLI** to implement and execute
3. Use **Chat** to review and discuss results
4. Use **CLI** to iterate and refine

---

_Last Updated: November 13, 2025_
