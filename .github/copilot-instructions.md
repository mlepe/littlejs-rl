# LittleJS Roguelike - Copilot Instructions

## Project Overview

This is a roguelike game built with LittleJS engine and TypeScript. The project uses an Entity Component System (ECS) architecture for game logic while integrating with LittleJS's rendering system.

## Code Style & Standards

### File Headers

All TypeScript files must include this header comment block:

```typescript {"name":"header"}
/*
 * File: [filename].ts
 * Project: littlejs-rl
 * File Created: [current date and time]
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: [current date and time]
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */
```

### Import Organization

1. External libraries first (LittleJS)
2. Local modules second
3. Blank line between groups

```typescript {"interactive":"false","name":"imports"}
import * as LJS from 'littlejsengine';

import GameObject from './gameObject';
import { PositionComponent } from './components';
```

### Naming Conventions

- **Classes**: PascalCase (e.g., `GameObject`, `ECS`)
- **Files**: camelCase matching class name but lowercase (e.g., `gameObject.ts`, `ecs.ts`)
- **Interfaces**: PascalCase with "Component" suffix for ECS components (e.g., `PositionComponent`)
- **Functions**: camelCase (e.g., `renderSystem`, `movementSystem`)
- __Constants__: UPPER_SNAKE_CASE (e.g., `TILE_SIZE`)

## Project Structure

```ini {"name":"project structure"}
src/
├── index.ts                 # Entry point
├── ts/
│   ├── game.ts             # Main game class
│   ├── gameObject.ts       # Base game object (extends LJS.EngineObject)
│   ├── gameCharacter.ts    # Character classes
│   ├── world.ts            # World/level management
│   ├── location.ts         # Location handling
│   ├── global.ts           # Global constants/utilities
│   ├── ecs.ts              # ECS core system
│   ├── entities.ts         # Entity factory functions
│   ├── components/         # ECS components (data only)
│   │   ├── index.ts
│   │   ├── position.ts
│   │   ├── health.ts
│   │   ├── render.ts
│   │   ├── movable.ts
│   │   ├── ai.ts
│   │   ├── stats.ts
│   │   ├── player.ts
│   │   └── input.ts
│   └── systems/            # ECS systems (logic)
│       ├── index.ts
│       ├── renderSystem.ts
│       ├── movementSystem.ts
│       ├── aiSystem.ts
│       ├── inputSystem.ts
│       └── playerMovementSystem.ts
└── assets/
    ├── img/
    ├── music/
    └── sounds/
```

## Architecture Patterns

### ECS (Entity Component System)

- **Entities**: Simple numeric IDs
- **Components**: Pure data interfaces (no methods)
- **Systems**: Pure functions that operate on components

```typescript {"name":"Entity Component System"}
// Component example
export interface PositionComponent {
  x: number;
  y: number;
}

// System example
export function movementSystem(ecs: ECS, dx: number, dy: number): void {
  const entities = ecs.query('position', 'movable');
  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    if (pos) {
      pos.x += dx;
      pos.y += dy;
    }
  }
}
```

### LittleJS Integration

- Use `LJS.*` prefix for all LittleJS types and functions
- Extend `LJS.EngineObject` for game objects that need rendering
- Use `LJS.Vector2` for positions and sizes
- Use `LJS.Color` for colors
- Use `LJS.TileInfo` for sprite information

### Available Components

**Core Components:**
- `PositionComponent` - x, y coordinates
- `HealthComponent` - current, max health
- `RenderComponent` - tileInfo, color, size (LittleJS rendering)
- `MovableComponent` - speed

**Character Components:**
- `StatsComponent` - strength, defense, speed
- `PlayerComponent` - isPlayer tag
- `InputComponent` - moveX, moveY, action

**AI Components:**
- `AIComponent` - type (passive/aggressive/patrol/fleeing), detectionRange, state, target

### Available Systems

**Core Systems:**
- `renderSystem(ecs)` - Renders all entities with position and render components
- `movementSystem(ecs, dx, dy)` - Moves entities with position and movable components

**Player Systems:**
- `inputSystem(ecs)` - Captures keyboard input for player entities
- `playerMovementSystem(ecs)` - Moves player based on input and stats

**AI Systems:**
- `aiSystem(ecs, playerEntityId)` - Handles AI behaviors (aggressive, passive, fleeing, patrol)

### Available Entity Types

**Player:**
- `createPlayer(ecs, x, y)` - Creates player with input, stats, and rendering

**Enemies:**
- `createEnemy(ecs, x, y)` - Aggressive enemy with AI
- `createBoss(ecs, x, y)` - Boss enemy with enhanced stats

**NPCs:**
- `createNPC(ecs, x, y)` - Passive wandering NPC
- `createFleeingCreature(ecs, x, y)` - Creature that flees from player

## Environment Variables

Available via `process.env`:

- `NODE_ENV`: development/production
- `GAME_DEBUG`: true/false for debug mode
- `GAME_VERSION`: Current version from package.json
- `PORT`: Dev server port (default: 8080)
- `HOST`: Dev server host (default: localhost)

## Creating New Files

### New Class Files

Use the `#create-class` prompt with the class name in PascalCase.
Example: `#create-class Enemy` creates `src/ts/enemy.ts`

### New Components

Create in `src/ts/components/` with interface definition:

```typescript {"name":"component creation"}
export interface [Name]Component {
  // data properties only
}
```

### Entity Factory Functions

Create in `src/ts/entities.ts` with entity creation functions:

```typescript
export function createPlayer(ecs: ECS, x: number, y: number): number {
  const playerId = ecs.createEntity();
  // Add components: player, position, health, stats, input, render, movable
  return playerId;
}

export function createEnemy(ecs: ECS, x: number, y: number): number {
  const enemyId = ecs.createEntity();
  // Add components: position, health, stats, ai, render, movable
  return enemyId;
}
```

### New Systems

Create in `src/ts/systems/` with function definition:

```typescript {"name":"system creation"}
export function [name]System(ecs: ECS, ...params): void {
  // system logic
}
```

## Common Patterns

### Creating an Entity with Components

```typescript {"name":"entity with components creation"}
const entityId = ecs.createEntity();
ecs.addComponent<PositionComponent>(entityId, 'position', { x: 0, y: 0 });
ecs.addComponent<HealthComponent>(entityId, 'health', { current: 100, max: 100 });
```

### Using Entity Factory

```typescript
import { createPlayer, createEnemy, createNPC } from './ts/entities';

const playerId = createPlayer(ecs, 5, 5);
const enemyId = createEnemy(ecs, 10, 10);
const npcId = createNPC(ecs, 15, 8);
```

### Querying Entities

```typescript {"name":"querying entities"}
// Get all entities with specific components
const entities = ecs.query('position', 'health', 'render');
```

### Accessing Components

```typescript {"name":"accessing components"}
const health = ecs.getComponent<HealthComponent>(entityId, 'health');
if (health) {
  health.current -= damage;
}
```

## Best Practices

1. Keep components as pure data (no methods)
2. Keep systems as pure functions (no side effects except modifying components)
3. Use TypeScript strict mode and proper typing
4. Follow ESLint rules (prefer `for...of` over `.forEach`)
5. Mark readonly properties that don't change
6. Always handle undefined when getting components
7. Use LittleJS utilities for game-specific functionality (vectors, colors, tiles)
8. Keep game logic in systems, not in GameObject classes
9. Use entity factory functions from `entities.ts` to create game entities
10. Process systems in the correct order in the game loop (input → movement → AI → collision → combat → render)

### Game Loop with Systems

```typescript
import { 
  inputSystem, 
  playerMovementSystem, 
  aiSystem, 
  renderSystem 
} from './ts/systems';

// In your game update loop
function update() {
  inputSystem(ecs);              // Handle player input
  playerMovementSystem(ecs);     // Move player based on input
  aiSystem(ecs, playerId);       // AI behaviors for NPCs/enemies
  // collisionSystem(ecs);        // Handle collisions
  // combatSystem(ecs);           // Handle combat
}

function render() {
  renderSystem(ecs);             // Render all entities
}
```

## Testing

- Run `npm run build` to compile TypeScript
- Run `npm run serve` to start dev server
- Run `npm run dev` to build and serve

## Debugging

- Set `GAME_DEBUG=true` in `.env` for debug mode
- Use `Game.isDebug` to conditionally execute debug code
- LittleJS provides built-in debug rendering and console logging
