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
│   ├── world.ts            # World management (map of locations)
│   ├── location.ts         # Location (map of tiles)
│   ├── tile.ts             # Tile types and data structures
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
│   ├── systems/            # ECS systems (logic)
│   │   ├── index.ts
│   │   ├── renderSystem.ts
│   │   ├── movementSystem.ts
│   │   ├── aiSystem.ts
│   │   ├── inputSystem.ts
│   │   └── playerMovementSystem.ts
│   └── examples/           # Usage examples
│       └── worldExample.ts
└── assets/
    ├── img/
    ├── music/
    └── sounds/
```

I'll update the copilot-instructions.md file to reflect the new ECS structure with entities, AI, and player systems. 

Edit [](file:///c%3A/Users/mlepe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

Edit [](file:///c%3A/Users/mlepe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

Edit [](file:///c%3A/Users/mlepe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

Edit [](file:///c%3A/Users/mlepe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

Edit [](file:///c%3A/Users/mlepe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

Edit [](file:///c%3A/Users/mlepe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

Edit [](file:///c%3A/Users/mlepe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

Edit [](file:///c%3A/Users/mlepe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

Now let me add information about the available components and systems: 

Edit [](file:///c%3A/Users/mlepe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

Edit [](file:///c%3A/Users/mlepe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

Edit [](file:///c%3A/Users/mlepe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

Perfect! I've successfully updated the copilot-instructions.md file with all the recent changes. Here's a summary of what was added:

## Updates Made:

1. **Updated Project Structure** - Added:
   - `entities.ts` file
   - New components: ai.ts, `stats.ts`, `player.ts`, `input.ts`
   - New systems: `aiSystem.ts`, `inputSystem.ts`, `playerMovementSystem.ts`

2. **Added Entity Factory Functions Section** - Shows how to create entity factory functions

3. **Added "Using Entity Factory" Section** - Demonstrates importing and using entity creation functions

4. **Added "Available Components" Section** - Lists all available components:
   - Core components (position, health, render, movable)
   - Character components (stats, player, input)
   - AI components

5. **Added "Available Systems" Section** - Lists all available systems:
   - Core systems (render, movement)
   - Player systems (input, playerMovement)
   - AI systems

6. **Added "Available Entity Types" Section** - Lists all entity factory functions:
   - Player
   - Enemies (enemy, boss)
   - NPCs (NPC, fleeing creature)

7. **Added "Game Loop with Systems" Section** - Shows the proper system execution order in the game loop

8. **Updated Best Practices** - Added two new items:
   - Use entity factory functions from `entities.ts`
   - Process systems in correct order

The copilot-instructions.md file now comprehensively documents your complete ECS architecture with all components, systems, and entity factories!

Made changes.

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

### Using the World System

```typescript
import World from './ts/world';
import { TileType, createTile } from './ts/tile';
import { createPlayer, createEnemy } from './ts/entities';

// Create world: 10x10 locations, each 50x50 tiles
const world = new World(10, 10, 50, 50);

// Set starting location
world.setCurrentLocation(5, 5);
const location = world.getCurrentLocation();

// Create entities
const playerId = createPlayer(ecs, 25, 25);
location.addEntity(25, 25, playerId);

// Customize tiles
location.setTile(20, 20, createTile(TileType.WATER));

// Move entity between tiles
location.moveEntity(25, 25, 26, 25, playerId);

// Travel to different location
world.setCurrentLocation(5, 6);

// Memory management
world.unloadAllExceptCurrent();
```

### Tile Types

```typescript
enum TileType {
  VOID = 0,        // Empty space
  FLOOR = 1,       // Walkable floor
  WALL = 2,        // Solid wall
  DOOR_OPEN = 3,   // Open door
  DOOR_CLOSED = 4, // Closed door
  STAIRS_UP = 5,   // Stairs going up
  STAIRS_DOWN = 6, // Stairs going down
  WATER = 7,       // Water terrain
  GRASS = 8        // Grass terrain
}
```

## World & Tile System

### Architecture Overview

The world system uses a hierarchical structure:
- **World**: Grid of locations (e.g., 10x10 locations)
- **Location**: Grid of tiles (e.g., 50x50 tiles per location)
- **Tile**: Individual cell with type, walkability, and entity tracking

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
11. Use `World` for location management and lazy loading
12. Track entities on tiles using `Location.addEntity()` and `Location.removeEntity()`
13. Use `createTile()` helper to create properly configured tiles

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
