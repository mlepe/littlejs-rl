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
- **Constants**: UPPER_SNAKE_CASE (e.g., `TILE_SIZE`)

## Project Structure

## File Creation Best Practices

### Creating Documentation/Markdown Files

**ALWAYS use `create_file` tool for creating new markdown or documentation files.**

❌ **DO NOT use these methods (they will fail on Windows):**

```typescript
// DON'T: Using echo with complex content
run_in_terminal({ command: 'echo "content" > file.md' });

// DON'T: Using node -e with inline content
run_in_terminal({ command: 'node -e "fs.writeFileSync(...)"' });
```

✅ **CORRECT way:**

```typescript
// DO: Use create_file tool
create_file({
  filePath: 'c:\\Users\\...\\file.md',
  content: `# Full Content
  
Code blocks, quotes, everything works!
  `,
});
```

### Why?

**Windows Command Line Issues:**

- Complex escaping rules for quotes, backticks, newlines
- Command line length limits (~8191 chars)
- Different behavior between CMD and PowerShell
- Special characters break shell parsing

**create_file is designed for this:**

- Direct file system write
- Handles all encoding automatically
- No shell parsing issues
- No length limits
- Works cross-platform

### Fallback Method (Last Resort Only)

If `create_file` demonstrably fails (verify with `read_file`):

1. Create temporary `.js` file with write code
2. Execute with `node filename.js`
3. Delete temporary file with `del filename.js`

This works because Node.js handles all escaping internally.

```ini {"name":"project structure"}
src/
├── index.ts                 # Entry point
├── ts/
│   ├── game.ts             # Main game class (Singleton)
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
│   │   ├── input.ts
│   │   └── relation.ts     # Multi-entity relationship tracking
│   ├── systems/            # ECS systems (logic)
│   │   ├── index.ts
│   │   ├── renderSystem.ts
│   │   ├── movementSystem.ts
│   │   ├── aiSystem.ts
│   │   ├── inputSystem.ts
│   │   ├── playerMovementSystem.ts
│   │   └── relationSystem.ts  # Relationship score management
│   └── examples/           # Usage examples
│       ├── worldExample.ts
│       └── gameUsage.ts
└── assets/
    ├── img/
    ├── music/
    └── sounds/
```

I'll update the copilot-instructions.md file to reflect the new ECS structure with entities, AI, and player systems.

Edit [](file:///c%3A/Users/melpe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

Edit [](file:///c%3A/Users/melpe/source/repos/Made%20in%20LittleJS/littlejs-rl/.github/copilot-instructions.md)

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
- Use `LJS.Color` for colors (via `ColorPaletteManager` or `rgba()` helper)
- Use `LJS.TileInfo` for sprite information

### Color Palette System

**CRITICAL: Always use the color palette system for colors, never hardcode RGB/hex values.**

The game uses a centralized color palette system (`src/ts/colorPalette.ts`) to ensure consistent theming and allow palette switching.

#### Creating Colors

```typescript
import { rgba, getColor, BaseColor } from './colorPalette';

// Option 1: Use semantic color names (PREFERRED for UI and entities)
const playerColor = getColor(BaseColor.PLAYER);
const dangerColor = getColor(BaseColor.DANGER);
const wallColor = getColor(BaseColor.WALL);

// Option 2: Use rgba() helper for custom colors (only when necessary)
const customColor = rgba(255, 128, 0); // Orange
const transparentBlue = rgba(0, 0, 255, 0.5); // Semi-transparent blue
```

#### Available Color Categories

**UI Colors (semantic):**

- `PRIMARY`, `SECONDARY`, `ACCENT` - UI theme colors
- `BACKGROUND`, `TEXT` - Background and text colors
- `SUCCESS`, `WARNING`, `DANGER`, `INFO` - State colors

**Entity Colors (semantic):**

- `PLAYER`, `ENEMY`, `NPC`, `ITEM` - Entity category colors

**Environment Colors (semantic):**

- `FLOOR`, `WALL`, `WATER`, `GRASS`, `LAVA` - Terrain colors

**Basic Colors (for variety):**

- `RED`, `GREEN`, `BLUE`, `YELLOW`, `CYAN`, `MAGENTA`, `ORANGE`, `PURPLE`, `PINK`, `BROWN`
- `LIME`, `TEAL`, `VIOLET`, `GOLD`, `SILVER`
- `GRAY`, `DARK_GRAY`, `LIGHT_GRAY`, `WHITE`, `BLACK`

**Special Colors:**

- `HIGHLIGHT`, `SHADOW`, `DISABLED`

#### Using Colors in Components

```typescript
// In RenderComponent
ecs.addComponent<RenderComponent>(entityId, 'render', {
  tileInfo: new LJS.TileInfo(vec2(0, 0), vec2(16, 16)),
  color: getColor(BaseColor.ENEMY),  // ✅ Use palette
  size: vec2(1, 1)
});

// In data files (JSON)
{
  "render": {
    "sprite": "ENEMY_ORC",
    "color": "red"  // ✅ Use BaseColor enum name (lowercase)
  }
}
```

#### Palette Management

```typescript
import { ColorPaletteManager, setPalette } from './colorPalette';

// Switch palettes
setPalette('vibrant'); // Bright, saturated colors
setPalette('monochrome'); // Grayscale
setPalette('retro'); // CGA-inspired
setPalette('default'); // Classic roguelike

// Get available palettes
const palettes = ColorPaletteManager.getInstance().getAvailablePalettes();

// Register custom palette
ColorPaletteManager.getInstance().registerPalette('custom', customPalette);
```

#### Color Palette Best Practices

1. **Always use `getColor(BaseColor.*)` for semantic colors** (player, enemy, UI elements)
2. **Use `rgba()` only for custom/temporary colors** that don't fit palette categories
3. **Never hardcode hex strings or RGB objects** - they won't respond to palette changes
4. **In JSON data, use lowercase enum names** - `"color": "red"` not `"color": "#ff0000"`
5. **Use semantic names over basic colors** when possible - `BaseColor.ENEMY` instead of `BaseColor.RED`
6. **IDEs show color previews** for `rgba()` calls, making them easier to work with

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
- `ClassComponent` - character class (warrior, mage, rogue, etc.)
- `RaceComponent` - character race (human, elf, orc, etc.)

**Item Components:**

- `ItemComponent` - name, type, description, state, material, value
- `WeightComponent` - weight for carry capacity
- `StackableComponent` - quantity, maxStackSize for stackable items
- `IdentificationComponent` - identification level (unidentified/partial/full)
- `QualityComponent` - quality/enhancement level (+1, -1, etc.)
- `EquipmentComponent` - slot, equipped status
- `ConsumableComponent` - uses, effects
- `ChargesComponent` - charges for rods/wands

**Combat Components:**

- `ElementalDamageComponent` - elemental damage types and amounts
- `ElementalResistanceComponent` - resistances to element types
- `StatusEffectComponent` - active status effects (burn, freeze, poison, etc.)
- `StatModifierComponent` - temporary stat modifications

**Inventory Components:**

- `InventoryComponent` - items array, maxCarryWeight, currentWeight
- `InventoryUIComponent` - UI state for inventory display
- `LootTableComponent` - loot generation data

**AI Components:**

- `AIComponent` - disposition (peaceful/neutral/defensive/aggressive/hostile/patrol/fleeing), detectionRange, state, target
- `RelationComponent` - relations Map tracking scores with multiple entities (Map<entityId, RelationData>)
- `RelationData` - relationScore, minRelationScore, maxRelationScore for individual relationships

**World Components:**

- `LocationComponent` - tracks which location an entity is in (worldX, worldY)
- `ViewModeComponent` - UI view mode state (normal, inventory, examine)

**Disposition System:**

- `peaceful`: Never attacks (friendly NPCs)
- `neutral`: Attacks if relation < -20 (merchants, wildlife)
- `defensive`: Attacks if relation < -40 (guards)
- `aggressive`: Attacks if relation < 0 (bandits, orcs)
- `hostile`: Attacks unless relation > 10 (undead, demons)
- `patrol`: Patrols and attacks if relation < -10
- `fleeing`: Never attacks, always runs (goblins, prey)

**See `DISPOSITION-SYSTEM.md` for comprehensive guide.**

### Available Systems

**Core Systems:**

- `renderSystem(ecs)` - Renders all entities with position and render components
- `movementSystem(ecs, dx, dy)` - Moves entities with position and movable components

**Player Systems:**

- `inputSystem(ecs)` - Captures keyboard input for player entities
- `playerMovementSystem(ecs)` - Moves player based on input and stats

**AI Systems:**

- `aiSystem(ecs, playerEntityId)` - Handles AI behaviors (aggressive, passive, fleeing, patrol)
- `relationSystem(ecs, entityId, targetEntityId, scoreDelta)` - Updates relationship scores between entities
- `getRelationScore(ecs, entityId, targetEntityId)` - Helper to query relationship scores

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

// Customize tiles with color
location.setTile(20, 20, createTile(TileType.WATER));

// Check walkability (uses LittleJS collision layer)
if (location.isWalkable(26, 25)) {
  location.moveEntity(25, 25, 26, 25, playerId);
}

// Test collision with Vector2 position
const playerPos = vec2(25.5, 25.5);
if (location.isWalkableWorld(playerPos)) {
  // Player can move here
}

// Use LittleJS collision test for entities
const canMove = !location.tileCollisionTest(playerPos, vec2(1, 1));

// Travel to different location
world.setCurrentLocation(5, 6);

// Memory management
world.unloadAllExceptCurrent();
```

### Tile Types

```typescript
enum TileType {
  VOID = 0, // Empty space
  FLOOR = 1, // Walkable floor
  WALL = 2, // Solid wall
  DOOR_OPEN = 3, // Open door
  DOOR_CLOSED = 4, // Closed door
  STAIRS_UP = 5, // Stairs going up
  STAIRS_DOWN = 6, // Stairs going down
  WATER = 7, // Water terrain
  GRASS = 8, // Grass terrain
}
```

## World & Tile System

## Game Class (Singleton Pattern)

### Overview

The `Game` class is the main controller that integrates ECS, World, and LittleJS systems. It uses the **Singleton pattern** to ensure only one game instance exists.

### Why Singleton?

- Single source of truth for game state
- Easy access from anywhere in the codebase
- Allows for reset/restart functionality
- Better than static class (allows instance state and testing)

### Basic Usage

```typescript
import Game from './ts/game';
import * as LJS from 'littlejsengine';

// Get singleton instance
const game = Game.getInstance();

// Initialize with LittleJS
LJS.engineInit(
  async () => game.init(),
  () => game.update(),
  () => game.updatePost(),
  () => game.render(),
  () => game.renderPost(),
  ['tileset.png']
);
```

### Custom World Size

```typescript
// Create 20x20 world with 100x100 tile locations
const game = Game.getInstance(
  LJS.vec2(20, 20), // World size
  LJS.vec2(100, 100) // Location size
);
```

### Accessing Game Components

```typescript
const game = Game.getInstance();

// Access ECS for custom entity management
const ecs = game.getECS();

// Access World for location management
const world = game.getWorld();

// Get player entity ID
const playerId = game.getPlayerId();

// Get current location
const location = game.getCurrentLocation();
```

### Changing Locations

```typescript
// Move player to different world location
game.changeLocation(worldX, worldY);
```

### Debug Features

The Game class automatically shows debug info when `GAME_DEBUG=true`:

- FPS counter
- Current location
- Player position
- Entity count
- Loaded locations
- Collision visualization

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
ecs.addComponent<HealthComponent>(entityId, 'health', {
  current: 100,
  max: 100,
});
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
12. **Use ECS as single source of truth** - Don't store entity positions in tiles, use `spatialSystem` queries
13. Use `createTile()` helper to create properly configured tiles
14. Use `Location.tileCollisionTest()` for LittleJS physics integration
15. Prefer `Vector2` methods (`isWalkableWorld`) when working with world positions
16. Use `renderDebug()` to visualize collision tiles during development
17. Use `Game.getInstance()` to access the singleton game instance
18. Access ECS, World, and Player through Game class getters instead of global variables
19. **Always use `create_file` tool for creating markdown/documentation files** - Never use `echo` or `node -e` on Windows
20. **Relation system is event-driven** - Call `relationSystem()` when actions affect relationships, not in main loop
21. Relations are automatically initialized via `world.initializeRelations(ecs)` in `Game.init()`
22. **Always use color palette system** - Use `getColor(BaseColor.*)` for semantic colors, `rgba()` for custom colors
23. **Never hardcode colors in JSON** - Use BaseColor enum names (lowercase) like `"color": "red"`
24. **Use template mixing for entities/items** - Define once in templates, reference in multiple entities
25. **Layer templates strategically** - Use base template + modifiers pattern (max 3-4 per component)
26. **Template naming convention** - `{descriptor}{ComponentType}` for bases, `{effect}Modifier/Bonus` for modifiers

### Game Loop with Systems

```typescript
import {
  inputSystem,
  playerMovementSystem,
  aiSystem,
  relationSystem,
  renderSystem,
} from './ts/systems';

// In your game update loop
function update() {
  inputSystem(ecs); // Handle player input
  playerMovementSystem(ecs); // Move player based on input
  aiSystem(ecs, playerId); // AI behaviors for NPCs/enemies
  // collisionSystem(ecs);        // Handle collisions
  // combatSystem(ecs);           // Handle combat
  // relationSystem is called on-demand when events affect relationships
}

function render() {
  renderSystem(ecs); // Render all entities
}
```

### Relation System

The relation system allows entities to track dynamic relationships with multiple other entities. Each entity can have unique relationship scores with every other entity in the world.

**Architecture:**

- `RelationComponent` stores a `Map<number, RelationData>` where keys are target entity IDs
- Each `RelationData` contains: relationScore, minRelationScore, maxRelationScore
- Relations are automatically initialized for all entities via `world.initializeRelations(ecs)`
- Called once in `Game.init()` after entity creation
- Base score starts at 0, configurable min/max bounds (default: -100 to 100)

**Usage:**

```typescript
// Relations are auto-initialized in Game.init()
// Update relation when an event occurs
relationSystem(ecs, npcId, playerId, 10); // NPC likes player more
relationSystem(ecs, enemyId, playerId, -20); // Enemy dislikes player

// Query relation score
const attitude = getRelationScore(ecs, npcId, playerId);
if (attitude !== undefined) {
  if (attitude > 50) console.log('Friendly!');
  else if (attitude < -20) console.log('Hostile!');
}

// Access all relations for an entity
const npcRelations = ecs.getComponent<RelationComponent>(npcId, 'relation');
if (npcRelations) {
  for (const [targetId, data] of npcRelations.relations) {
    console.log(`Relation to ${targetId}: ${data.relationScore}`);
  }
}

// Typical usage in combat system
function combatSystem(ecs: ECS) {
  // ... combat logic ...
  if (attackHit) {
    // Defender now dislikes attacker
    relationSystem(ecs, defenderId, attackerId, -15);
  }
}
```

## Testing

- Run `npm run build` to compile TypeScript
- Run `npm run serve` to start dev server
- Run `npm run dev` to build and serve

## Quick Reference: Common Workflows

### Creating a New Entity Type

1. **Define templates** (if reusable):

   ```json
   // In src/data/base/templates/stats.json
   {
     "id": "archerStats",
     "name": "Archer Stats",
     "stats": { "dexterity": 16, "perception": 14, ... }
   }
   ```

2. **Create entity definition**:

   ```json
   // In src/data/base/entities/characters.json
   {
     "id": "forest_archer",
     "name": "Forest Archer",
     "type": "enemy",
     "templates": {
       "statsTemplates": ["archerStats", "swiftModifier"],
       "aiTemplates": ["aggressiveAI"],
       "renderTemplates": ["archerRender"]
     }
   }
   ```

3. **Spawn in game**:
   ```typescript
   const registry = EntityRegistry.getInstance();
   const archerId = registry.spawn(ecs, 'forest_archer', x, y, worldX, worldY);
   ```

### Creating a New Item

1. **Define templates** (if reusable):

   ```json
   // In src/data/base/templates/weapon.json
   {
     "id": "elven_weapon",
     "damage": 12,
     "damageType": "slashing",
     "material": "mithril"
   }
   ```

2. **Create item definition**:

   ```json
   // In src/data/base/items/weapons.json
   {
     "id": "elven_longbow",
     "name": "Elven Longbow",
     "itemBaseTemplates": ["base_weapon"],
     "weaponTemplates": ["elven_weapon", "bow_weapon"],
     "sprite": "ITEM_BOW"
   }
   ```

3. **Spawn in game**:
   ```typescript
   const itemRegistry = ItemRegistry.getInstance();
   const bowId = itemRegistry.spawn(ecs, 'elven_longbow');
   ```

### Adding a New Color Palette

1. **Define palette**:

   ```typescript
   // In src/ts/colorPalette.ts
   const customPalette: ColorPalette = {
     name: 'Custom',
     colors: new Map<BaseColor, LJS.Color>([
       [BaseColor.PRIMARY, rgba(100, 150, 200)],
       // ... define all BaseColor entries
     ]),
   };
   ```

2. **Register palette**:

   ```typescript
   ColorPaletteManager.getInstance().registerPalette('custom', customPalette);
   ```

3. **Switch palette**:
   ```typescript
   setPalette('custom');
   ```

### Creating a Layered Boss Enemy

```json
{
  "id": "ancient_dragon_boss",
  "name": "Ancient Dragon",
  "type": "boss",
  "templates": {
    "renderTemplates": ["dragonRender"],
    "statsTemplates": ["dragonStats", "ancientBonus", "bossModifier"],
    "healthTemplates": ["bossHealth", "healthBoost", "regenBoost"],
    "aiTemplates": ["aggressiveAI"]
  },
  "stats": {
    "intelligence": 22 // Ancient dragons are especially intelligent
  }
}
```

**Result**: Powerful boss with layered stat boosts, massive HP pool with regen, and enhanced intelligence.

## Testing

## Data-Driven Content System

The game uses a data-driven architecture where content is defined in JSON files rather than code.

### Quick Reference

**Load data** (automatic in Game.init()):

```typescript
import { DataLoader } from './ts/data/dataLoader';
await DataLoader.getInstance().loadAllData();
```

**Spawn entities from data**:

```typescript
import { EntityRegistry } from './ts/data/entityRegistry';
const registry = EntityRegistry.getInstance();
const orcId = registry.spawn(ecs, 'orc_warrior', x, y, worldX, worldY);
```

**Query available entities**:

```typescript
const allIds = registry.getAllIds();
const enemies = registry.getByType('enemy');
const orcTemplate = registry.get('orc_warrior');
```

### File Locations

- **Entity data**: `src/data/base/entities/*.json`
- **Balance config**: `src/data/base/stats/balance.json`
- **Type definitions**: `src/ts/types/dataSchemas.ts`
- **Loading system**: `src/ts/data/`

### Entity Data Format

```json
{
  "entities": [
    {
      "id": "unique_id",
      "name": "Display Name",
      "type": "enemy" | "npc" | "player" | "creature" | "boss",
      "health": { "max": 50 },
      "stats": { "strength": 8, "defense": 5, "speed": 1.0 },
      "ai": { "type": "aggressive" | "passive" | "fleeing" | "patrol", "detectionRange": 10 },
      "render": { "sprite": "ENEMY_ORC", "color": "#00ff00" },
      "relation": { "baseScore": -50, "minScore": -100, "maxScore": 0 }
    }
  ]
}
```

**Valid sprite names** are defined in `TileSprite` enum in `src/ts/tileConfig.ts`.

**See `DATA-SYSTEM.md` for comprehensive documentation.**
**See `DISPOSITION-SYSTEM.md` for entity behavior system.**
**See `ITEM-SYSTEM.md` for item, inventory, and equipment documentation.**
**See `ELEMENTAL-SYSTEM.md` for elemental damage, resistances, and status effects.**
**See `TEMPLATE-MIXING.md` for template-based entity/item composition.**

## Template Mixing System

The template mixing system allows composing entities and items from **multiple reusable templates**, enabling powerful modular design patterns.

### Key Concepts

- **Component Templates**: Reusable configurations for render, stats, AI, health, item properties
- **Multiple Template Support**: Each component type accepts **arrays** of template IDs
- **Sequential Merging**: Templates merge left-to-right: `[0] → [1] → ... → [n] → direct values`
- **Deep Merge**: Later templates/values override earlier ones at property level
- **Template Types**: Base templates (full configs) + Modifier templates (incremental changes)

### Entity Templates

**Available Template Files** (`src/data/base/templates/`):

- `render.json` - Visual appearance (sprite, color)
- `stats.json` - Character attributes (strength, intelligence, etc.)
- `ai.json` - Behavior patterns (aggressive, fleeing, patrol)
- `health.json` - Durability (max HP, regeneration)

**Template Categories**:

- **Base Templates**: Full configurations (e.g., `bruteStats`, `mageStats`, `agileStats`)
- **Modifier Templates**: Partial enhancements (e.g., `veteranBonus`, `elderBonus`, `blessedModifier`)

**Example - Layered Entity**:

```json
{
  "id": "veteran_orc_warrior",
  "templates": {
    "renderTemplates": ["orcWarriorRender"],
    "statsTemplates": ["bruteStats", "veteranBonus"],
    "aiTemplates": ["aggressiveAI"],
    "healthTemplates": ["tankHealth"]
  },
  "stats": {
    "intelligence": 12 // Override specific value
  }
}
```

**Merge result**: `bruteStats` (15 str, 18 tough) + `veteranBonus` (+5 str, +3 tough) + override (12 int) = **20 str, 21 tough, 12 int**

### Item Templates

**Available Template Files** (`src/data/base/templates/`):

- `item_base.json` - Common properties (weight, value, material)
- `weapon.json` - Weapon stats (damage, type, range)
- `armor.json` - Armor stats (defense, slot)
- `consumable.json` - Effects (heal, buff, teleport)

**Example - Layered Item**:

```json
{
  "id": "iron_sword",
  "itemBaseTemplates": ["base_weapon"],
  "weaponTemplates": ["iron_weapon", "sword_weapon"],
  "name": "Iron Sword",
  "sprite": "ITEM_SWORD"
}
```

**Merge result**: `base_weapon` (weight, value) + `iron_weapon` (damage: 8, material: iron) + `sword_weapon` (damage: 10) + direct (name, sprite) = **10 damage iron sword**

### Template Resolution

**Code Example**:

```typescript
// Spawn entity with templates
const registry = EntityRegistry.getInstance();
const entityId = registry.spawn(
  ecs,
  'veteran_orc_warrior',
  x,
  y,
  worldX,
  worldY
);
// Templates automatically resolved and merged!

// Spawn item with templates
const itemRegistry = ItemRegistry.getInstance();
const itemId = itemRegistry.spawn(ecs, 'iron_sword');
```

**Loading Order**:

1. Component templates load first (before entities/items)
2. Races and classes load
3. Entity/item definitions load and resolve template references
4. Registries cache resolved templates for performance

### Template Best Practices

1. **Use base templates first in array** - They provide full configuration
2. **Add modifiers for incremental changes** - `["baseStats", "veteranBonus"]`
3. **Override sparingly** - Only override what's truly unique to entity/item
4. **Name clearly** - `{descriptor}{ComponentType}` (e.g., `bruteStats`, `veteranBonus`)
5. **Layer strategically** - Up to 3-4 templates per component is readable
6. **Document modifiers** - Explain what each modifier adds/changes

### Common Patterns

**Character Progression**:

```json
"statsTemplates": ["warriorStats", "level10Bonus", "eliteModifier"]
```

**Boss Variations**:

```json
"healthTemplates": ["bossHealth", "healthBoost", "regenBoost"]
```

**Equipment Modifiers**:

```json
"weaponTemplates": ["steel_weapon", "enchanted_modifier", "fire_damage"]
```

**Status Effects**:

```json
"statsTemplates": ["playerStats", "buff_strength", "buff_speed"]
```

## Debugging

- Set `GAME_DEBUG=true` in `.env` for debug mode
- Use `Game.isDebug` to conditionally execute debug code
- LittleJS provides built-in debug rendering and console logging

## Recent Features Summary

### Color Palette System

- Centralized color management with multiple palettes (default, vibrant, monochrome, retro)
- Semantic color names for consistent theming
- Support for custom palettes
- **Always use `getColor(BaseColor.*)` or `rgba()` - never hardcode colors**

### Item System

- Complete item management with unlimited inventory (limited by weight)
- Automatic item stacking for identical items
- Equipment system with multiple slots
- Item identification (unidentified → partial → full)
- Item quality/enhancement levels
- Item states (normal, blessed, cursed)
- Item materials (iron, steel, silver, etc.)

### Elemental Combat System

- Multiple damage types (physical: slashing/piercing/bludgeoning, magical: fire/cold/lightning/etc.)
- Resistance system with flat reduction and percentage resistance
- Status effects (burn, freeze, poison, etc.) with durations
- Element interactions and tactical opportunities

### Data-Driven Architecture

- Entities, items, stats, and balance configurable via JSON
- **Template-based composition** with multiple template layering
- Registry system for entity spawning with automatic template resolution
- Validation and error handling
- **See `DATA-SYSTEM.md`, `ITEM-SYSTEM.md`, `ELEMENTAL-SYSTEM.md`, and `TEMPLATE-MIXING.md` for details**

### Template Mixing System (v0.9.0+)

- **Multiple templates per component** - Arrays of template IDs merge sequentially
- **Entity templates** - render, stats, AI, health (9 base + 5 modifier stats templates)
- **Item templates** - item_base, weapon, armor, consumable (41 templates total)
- **Layered composition** - Base template + modifiers + direct overrides
- **Use cases** - Character progression, boss variations, equipment modifiers, status effects
- **See `TEMPLATE-MIXING.md` and `*-TEMPLATE-MIXING-SUMMARY.md` for comprehensive guides**

### World System Enhancements

- Location-based entity management
- World map with multiple locations
- Location transitions and lazy loading
- Biome system integration ready
- View modes (normal, inventory, examine)
