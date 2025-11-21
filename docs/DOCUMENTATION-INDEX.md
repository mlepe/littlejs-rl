# Documentation Index

## Overview

This is the central index for all documentation in the LittleJS Roguelike project. Use this guide to find the information you need quickly.

---

## For New Users

**Start here if you're new to the project:**

1. [README.md](./README.md) - Project overview and quick start
2. [QUICKSTART.md](./QUICKSTART.md) - Get the game running in 5 minutes
3. [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the codebase structure

---

## Core Documentation

### Architecture & Design

| Document                                             | Purpose                                                        | Read When                                  |
| ---------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------ |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                 | Overall system design, ECS patterns, integration with LittleJS | Understanding codebase structure           |
| [COMPONENTS-REFERENCE.md](./COMPONENTS-REFERENCE.md) | Complete list of all ECS components with properties            | Creating entities or querying components   |
| [SYSTEMS-REFERENCE.md](./SYSTEMS-REFERENCE.md)       | Complete list of all ECS systems with usage                    | Understanding game loop or adding features |
| [VIEW-MODES.md](./VIEW-MODES.md)                     | UI view mode system (location, world map, inventory, examine)  | Implementing UI or input handling          |

---

## Feature-Specific Guides

### Data & Content

| Document                                                             | Purpose                                       | Read When                                     |
| -------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| [DATA-SYSTEM.md](./DATA-SYSTEM.md)                                   | JSON-based content loading system             | Adding new entities, items, or content        |
| [QUICKSTART-DATA.md](./QUICKSTART-DATA.md)                           | Quick guide to using the data system          | Creating your first data-driven entity        |
| [TEMPLATE-MIXING.md](./TEMPLATE-MIXING.md)                           | Modular entity/item composition via templates | Creating complex entities with reusable parts |
| [ITEM-TEMPLATE-MIXING-SUMMARY.md](./ITEM-TEMPLATE-MIXING-SUMMARY.md) | Item template mixing quick reference          | Creating items with templates                 |
| [TEMPLATE-MIXING-SUMMARY.md](./TEMPLATE-MIXING-SUMMARY.md)           | Entity template mixing quick reference        | Creating entities with templates              |

### Good First Issues

| Document                                       | Purpose                                 | Read When               |
| ---------------------------------------------- | --------------------------------------- | ----------------------- |
| [GOOD_FIRST_ISSUES.md](./GOOD_FIRST_ISSUES.md) | Beginner-friendly tasks with file links | Choosing a starter task |

### Items & Inventory

| Document                                                             | Purpose                                        | Read When                            |
| -------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------ |
| [ITEM-SYSTEM.md](./ITEM-SYSTEM.md)                                   | Complete item, inventory, and equipment system | Working with items or inventory      |
| [ITEM-SYSTEM-INTEGRATION.md](./ITEM-SYSTEM-INTEGRATION.md)           | Integration details for item systems           | Integrating items with other systems |
| [ITEM-FEATURES-IMPLEMENTATION.md](./ITEM-FEATURES-IMPLEMENTATION.md) | Implementation guide for item features         | Adding new item types or properties  |
| [INVENTORY-TESTING-GUIDE.md](./INVENTORY-TESTING-GUIDE.md)           | Testing inventory functionality                | Debugging inventory issues           |

### Combat & Stats

| Document                                     | Purpose                                       | Read When                      |
| -------------------------------------------- | --------------------------------------------- | ------------------------------ |
| [ELEMENTAL-SYSTEM.md](./ELEMENTAL-SYSTEM.md) | Elemental damage, resistances, status effects | Implementing combat or effects |
| [DERIVED-STATS.md](./DERIVED-STATS.md)       | Derived stat calculations                     | Understanding stat bonuses     |

### AI & Behavior

| Document                                         | Purpose                                       | Read When                |
| ------------------------------------------------ | --------------------------------------------- | ------------------------ |
| [DISPOSITION-SYSTEM.md](./DISPOSITION-SYSTEM.md) | AI behaviors, dispositions, and relationships | Creating NPCs or enemies |

### World & Navigation

| Document                                                                   | Purpose                                         | Read When                        |
| -------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------- |
| [BIOME-SYSTEM.md](./BIOME-SYSTEM.md)                                       | **Complete biome system guide**                 | **Working with biomes or tiles** |
| [LOCATION-TYPES-BIOMES.md](./LOCATION-TYPES-BIOMES.md)                     | Location types, biomes, and generation (legacy) | Creating new location types      |
| [LOCATION-TRANSITIONS.md](./LOCATION-TRANSITIONS.md)                       | Moving between locations                        | Implementing world navigation    |
| [WORLD-MAP.md](./WORLD-MAP.md)                                             | World map navigation system                     | Adding world map features        |
| [WORLD-MAP-QUICKREF.md](./WORLD-MAP-QUICKREF.md)                           | Quick reference for world map                   | Looking up world map details     |
| [LOCATION-IMPLEMENTATION-SUMMARY.md](./LOCATION-IMPLEMENTATION-SUMMARY.md) | Location system implementation summary          | Understanding location internals |

### Input & UI

| Document                                               | Purpose                                                 | Read When                             |
| ------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------- |
| [KEYBINDINGS-REFERENCE.md](./KEYBINDINGS-REFERENCE.md) | Complete keyboard controls reference                    | Learning controls or customizing keys |
| [TURN-BASED-INPUT.md](./TURN-BASED-INPUT.md)           | Turn-based input handling                               | Working with input or game loop       |
| [VIEW-MODES.md](./VIEW-MODES.md)                       | UI view modes (location, world map, inventory, examine) | Implementing UI features              |

---

## Implementation Summaries

**Quick reference guides for specific implementations:**

| Document                                                         | Content                                                   |
| ---------------------------------------------------------------- | --------------------------------------------------------- |
| [REFACTOR-SUMMARY.md](./REFACTOR-SUMMARY.md)                     | Summary of major refactoring efforts                      |
| [ECS-WORLD-MIGRATION.md](./ECS-WORLD-MIGRATION.md)               | Migration from Location-based to ECS-based entity storage |
| [DATA-SYSTEM-IMPLEMENTATION.md](./DATA-SYSTEM-IMPLEMENTATION.md) | Data system implementation details                        |
| [EXAMINE-MODE-FIXES.md](./EXAMINE-MODE-FIXES.md)                 | Examine mode bug fixes                                    |

---

## Development Guides

### For Contributors

| Document                                           | Purpose                               | Read When                       |
| -------------------------------------------------- | ------------------------------------- | ------------------------------- |
| [CONTRIBUTING.md](./CONTRIBUTING.md)               | Contributing guidelines               | Making your first contribution  |
| [COPILOT-TOOLS-GUIDE.md](./COPILOT-TOOLS-GUIDE.md) | VS Code tasks and Copilot tools       | Using development tools         |
| [VERSION-ROADMAP.md](./VERSION-ROADMAP.md)         | Feature roadmap and version history   | Planning new features           |
| [GOOD_FIRST_ISSUES.md](./GOOD_FIRST_ISSUES.md)     | Starter tasks for newcomers           | Picking an achievable issue     |
| [DEVELOPER_SUMMARY.md](./DEVELOPER_SUMMARY.md)     | Guide to ECS workflows and tasks      | When you want to be more active |
| [DEVELOPER_TIPS.md](./DEVELOPER_TIPS.md)           | Quick tips for pairing with Copilot   | Speed up development            |
| [TESTING-GUIDE.md](./TESTING-GUIDE.md)             | Jest testing setup and best practices | Writing tests for your code     |

### Code Examples

**Located in `src/ts/examples/`:**

- `gameUsage.ts` - Basic game setup
- `ecsWorldExample.ts` - ECS + World integration
- `worldExample.ts` - World and location management
- `colorPaletteExample.ts` - Color palette usage
- `dataUsageExample.ts` - Data system usage

---

## Documentation by Task

### "I want to..."

#### Create Content

- **Add a new entity type** → [DATA-SYSTEM.md](./DATA-SYSTEM.md), [QUICKSTART-DATA.md](./QUICKSTART-DATA.md)
- **Add a new item** → [ITEM-SYSTEM.md](./ITEM-SYSTEM.md), [TEMPLATE-MIXING.md](./TEMPLATE-MIXING.md)
- **Create a boss enemy** → [DISPOSITION-SYSTEM.md](./DISPOSITION-SYSTEM.md), [TEMPLATE-MIXING.md](./TEMPLATE-MIXING.md)
- **Add a new location type** → [LOCATION-TYPES-BIOMES.md](./LOCATION-TYPES-BIOMES.md)

#### Understand Systems

- **Understand the ECS** → [ARCHITECTURE.md](./ARCHITECTURE.md), [COMPONENTS-REFERENCE.md](./COMPONENTS-REFERENCE.md)
- **Understand how systems work** → [SYSTEMS-REFERENCE.md](./SYSTEMS-REFERENCE.md)
- **Understand the game loop** → [ARCHITECTURE.md](./ARCHITECTURE.md), [TURN-BASED-INPUT.md](./TURN-BASED-INPUT.md)
- **Understand combat** → [ELEMENTAL-SYSTEM.md](./ELEMENTAL-SYSTEM.md), [SYSTEMS-REFERENCE.md](./SYSTEMS-REFERENCE.md)

#### Implement Features

- **Add a new component** → [COMPONENTS-REFERENCE.md](./COMPONENTS-REFERENCE.md), [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Add a new system** → [SYSTEMS-REFERENCE.md](./SYSTEMS-REFERENCE.md), [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Add a new view mode** → [VIEW-MODES.md](./VIEW-MODES.md)
- **Add new AI behavior** → [DISPOSITION-SYSTEM.md](./DISPOSITION-SYSTEM.md)
- **Change keybindings** → [KEYBINDINGS-REFERENCE.md](./KEYBINDINGS-REFERENCE.md)
- **Adjust turn speed** → [TURN-BASED-INPUT.md](./TURN-BASED-INPUT.md), [KEYBINDINGS-REFERENCE.md](./KEYBINDINGS-REFERENCE.md)

#### Debug Issues

- **Inventory not working** → [INVENTORY-TESTING-GUIDE.md](./INVENTORY-TESTING-GUIDE.md)
- **Examine mode bugs** → [EXAMINE-MODE-FIXES.md](./EXAMINE-MODE-FIXES.md)
- **Entity storage issues** → [ECS-WORLD-MIGRATION.md](./ECS-WORLD-MIGRATION.md)
- **Keys not responding** → [KEYBINDINGS-REFERENCE.md](./KEYBINDINGS-REFERENCE.md)

#### Write Tests

- **Set up testing** → [TESTING-GUIDE.md](./TESTING-GUIDE.md)
- **Write unit tests** → [TESTING-GUIDE.md](./TESTING-GUIDE.md), [GOOD_FIRST_ISSUES.md](./GOOD_FIRST_ISSUES.md)
- **Mock LittleJS** → [TESTING-GUIDE.md](./TESTING-GUIDE.md) (Mocking section)
- **Test coverage** → [TESTING-GUIDE.md](./TESTING-GUIDE.md) (Coverage section)

---

## Documentation Guidelines

### For Documentation Writers

**When creating new documentation:**

1. **Use clear headings** - H1 for title, H2 for major sections
2. **Include code examples** - Show, don't just tell
3. **Add to this index** - Make it discoverable
4. **Cross-reference** - Link to related docs
5. **Keep it updated** - Document reflects current code

**Document naming conventions:**

- `SYSTEM-NAME.md` - Main documentation (e.g., ITEM-SYSTEM.md)
- `SYSTEM-NAME-QUICKREF.md` - Quick reference guide
- `SYSTEM-NAME-SUMMARY.md` - Implementation summary
- `SYSTEM-NAME-FIXES.md` - Bug fix documentation

---

## Quick Links by Category

### Core Architecture

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [COMPONENTS-REFERENCE.md](./COMPONENTS-REFERENCE.md)
- [SYSTEMS-REFERENCE.md](./SYSTEMS-REFERENCE.md)

### Game Content

- [DATA-SYSTEM.md](./DATA-SYSTEM.md)
- [TEMPLATE-MIXING.md](./TEMPLATE-MIXING.md)
- [ITEM-SYSTEM.md](./ITEM-SYSTEM.md)

### AI & Behavior

- [DISPOSITION-SYSTEM.md](./DISPOSITION-SYSTEM.md)
- [ELEMENTAL-SYSTEM.md](./ELEMENTAL-SYSTEM.md)

### World & Navigation

- [LOCATION-TYPES-BIOMES.md](./LOCATION-TYPES-BIOMES.md)
- [WORLD-MAP.md](./WORLD-MAP.md)
- [LOCATION-TRANSITIONS.md](./LOCATION-TRANSITIONS.md)

### UI & Input

- [VIEW-MODES.md](./VIEW-MODES.md)
- [TURN-BASED-INPUT.md](./TURN-BASED-INPUT.md)
- [KEYBINDINGS-REFERENCE.md](./KEYBINDINGS-REFERENCE.md)

---

## Contributing to Documentation

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Writing documentation
- Code style
- Pull request process
- Testing requirements

---

## Need Help?

1. Check this index for relevant documentation
2. Read the documentation for your specific task
3. Check code examples in `src/ts/examples/`
4. Review related system implementations
5. Open an issue if documentation is unclear

**Remember:** Documentation is code. Keep it updated, tested, and reviewed.
