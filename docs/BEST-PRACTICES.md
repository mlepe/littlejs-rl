# Best Practices

## Overview

This document captures best practices, design decisions, and lessons learned while developing this roguelike game. It serves as a guide for maintaining consistency and avoiding common pitfalls.

---

## Table of Contents

1. [ECS Architecture](#1-ecs-architecture)
2. [LittleJS Integration](#2-littlejs-integration)
3. [Component Design](#3-component-design)
4. [System Design](#4-system-design)
5. [Data-Driven Development](#5-data-driven-development)
6. [Testing](#6-testing)
7. [Performance](#7-performance)
8. [Code Organization](#8-code-organization)
9. [Common Pitfalls](#9-common-pitfalls)
10. [Best Practices List](#10-best-practices-list)

---

## 1. ECS Architecture

### Component Best Practices

**✅ DO:**

- Keep components as pure data structures (no methods)
- Use interfaces, not classes, for components
- Keep component properties simple and serializable
- Name components clearly: `PositionComponent`, `HealthComponent`
- Group related properties in a single component

**❌ DON'T:**

- Add logic to components
- Store functions or complex objects in components
- Create components with only one property (unless widely used)
- Mix concerns (e.g., rendering + physics in one component)

**Example - Good Component:**

```typescript
export interface StatsComponent {
  strength: number;
  defense: number;
  speed: number;
  intelligence: number;
  dexterity: number;
}
```

**Example - Bad Component:**

```typescript
// Bad: Has methods, not pure data
export class StatsComponent {
  constructor(public strength: number) {}

  calculateDamage(): number {
    return this.strength * 2; // Logic belongs in a system!
  }
}
```

### System Best Practices

**✅ DO:**

- Keep systems as pure functions
- Name systems with "System" suffix: `movementSystem`, `renderSystem`
- Process one concern per system
- Use ECS queries to get entities efficiently
- Return void or simple status values

**❌ DON'T:**

- Store state in systems (use components instead)
- Create God systems that do everything
- Modify components directly without querying first
- Call systems from other systems (compose in game loop instead)

**Example - Good System:**

```typescript
export function movementSystem(ecs: ECS, dx: number, dy: number): void {
  const entities = ecs.query('position', 'movable');

  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    const movable = ecs.getComponent<MovableComponent>(id, 'movable');

    if (pos && movable) {
      pos.x += dx * movable.speed;
      pos.y += dy * movable.speed;
    }
  }
}
```

### When to Create New Components

**Create a new component when:**

- Data represents a distinct concern (health, position, AI state)
- Multiple entity types will share this data
- You need to query entities by this capability
- The data is optional (not all entities have it)

**Reuse existing components when:**

- Data fits naturally into existing component
- Only one entity type uses it (consider if it's worth the complexity)
- You can extend existing component without breaking changes

### When to Use and Not to Use ECS

**✅ DO use ECS for:**

- **Game objects**: Player, enemies, NPCs, items on ground, projectiles
- **Interactive objects**: Doors (if they have state/HP), chests, traps
- **Dynamic entities**: Things that move, change state, or interact with other entities
- **Things with variable composition**: Objects that can have different combinations of capabilities
- **Runtime-created objects**: Entities spawned during gameplay

**Example - Items as entities:**

```typescript
// Item on ground is an entity (can be picked up, has position)
const itemId = ecs.createEntity();
ecs.addComponent<PositionComponent>(itemId, 'position', { x: 10, y: 5 });
ecs.addComponent<ItemComponent>(itemId, 'item', {
  name: 'Sword',
  type: 'weapon',
});
ecs.addComponent<RenderComponent>(itemId, 'render', {
  /* render data */
});
```

**❌ DON'T use ECS for:**

- **Infrastructure/Management classes**: World, Location, Game class
- **Static data structures**: Tile, TileType enum, color palettes
- **Collections/Managers**: Things that manage groups of entities
- **Pure data**: Configuration objects, JSON templates
- **Utility classes**: Math helpers, data loaders, registries

**Why keep World/Location/Tile as classes:**

```typescript
// ❌ Bad: World as entity
const worldId = ecs.createEntity();
ecs.addComponent<WorldComponent>(worldId, 'world', {
  width: 10,
  height: 10,
  locations: new Map(),
});

// How do you get it? Query every frame?
const worlds = ecs.query('world');
for (const id of worlds) {
  // Only one world... why query?
  const world = ecs.getComponent<WorldComponent>(id, 'world');
}

// ✅ Good: World as class
const world = game.getWorld();
const location = world.getCurrentLocation();
```

**Why keep Tile as data structure:**

1. **Performance**: Thousands of tiles per location (50x50 = 2,500 tiles)
   - As entities: 2,500 entity IDs, component lookups, queries
   - As data: Simple array access, minimal overhead

2. **Static nature**: Tiles don't mix-and-match capabilities
   - Unlike entities (player can have health + AI + equipment + many combinations)
   - Tiles have fixed properties defined by TileType enum

3. **LittleJS integration**: TileLayer expects tile data, not entities

**Exception - Interactive terrain:**

If a specific tile instance needs complex behavior, create an **entity** for that instance:

```typescript
// Special destructible door
const doorId = ecs.createEntity();
ecs.addComponent<PositionComponent>(doorId, 'position', { x: 10, y: 5 });
ecs.addComponent<HealthComponent>(doorId, 'health', { current: 50, max: 50 });
ecs.addComponent<DoorComponent>(doorId, 'door', {
  isOpen: false,
  locked: true,
});

// Base tile stays as data
location.setTile(10, 5, createTile(TileType.DOOR_CLOSED));
```

**Rule of thumb:**

- **Many instances with variable behavior** → ECS entity
- **One/few instances managing system** → Class
- **Static terrain/map data** → Data structure

---

## 2. LittleJS Integration

### Do's and Don'ts

**✅ DO:**

- Use `LJS.*` prefix for all LittleJS imports
- Store LittleJS objects (`Vector2`, `Color`) in components
- Use LittleJS utilities (`rand()`, `clamp()`, `lerp()`)
- Hook into LittleJS lifecycle properly
- Use LittleJS input system (`keyIsDown()`, `mousePos()`)
- Use LittleJS collision detection (`tileCollisionTest()`)

**❌ DON'T:**

- Access canvas/WebGL directly (use LittleJS functions)
- Bypass LittleJS input system with raw event listeners
- Reimplement functions LittleJS already provides
- Store raw objects when LittleJS types exist

**Example - Good Integration:**

```typescript
import * as LJS from 'littlejsengine';

export interface RenderComponent {
  tileInfo: LJS.TileInfo;
  color: LJS.Color;
  size: LJS.Vector2;
}

export function renderSystem(ecs: ECS): void {
  const entities = ecs.query('position', 'render');

  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    const render = ecs.getComponent<RenderComponent>(id, 'render');

    if (pos && render) {
      LJS.drawTile(
        LJS.vec2(pos.x, pos.y),
        render.size,
        render.tileInfo,
        render.color
      );
    }
  }
}
```

### Position Handling Pattern

**Store plain numbers in components, use Vector2 in systems:**

```typescript
// Component: simple numbers (ECS owns data)
export interface PositionComponent {
  x: number;
  y: number;
}

// System: convert to Vector2 for calculations
export function movementSystem(ecs: ECS, dx: number, dy: number): void {
  const pos = ecs.getComponent<PositionComponent>(id, 'position');

  // Use Vector2 for math
  const currentPos = LJS.vec2(pos.x, pos.y);
  const movement = LJS.vec2(dx, dy);
  const newPos = currentPos.add(movement);

  // Store back as numbers
  pos.x = newPos.x;
  pos.y = newPos.y;
}
```

---

## 3. Component Design

### Granularity

**Fine-grained components (recommended for flexibility):**

```typescript
// Multiple small components
interface PositionComponent {
  x: number;
  y: number;
}
interface VelocityComponent {
  vx: number;
  vy: number;
}
interface AccelerationComponent {
  ax: number;
  ay: number;
}
```

**Coarse-grained components (simpler but less flexible):**

```typescript
// One larger component
interface PhysicsComponent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
}
```

**Rule of thumb:** Use fine-grained if entities have different combinations of data. Use coarse-grained if data is always used together.

### Optional vs Required Data

**Use optional properties for rare data:**

```typescript
interface RenderComponent {
  tileInfo: LJS.TileInfo;
  color: LJS.Color;
  size: LJS.Vector2;
  angle?: number; // Optional: not all entities rotate
  mirror?: boolean; // Optional: not all entities flip
  additiveColor?: LJS.Color; // Optional: special rendering
}
```

**Use separate components for completely optional features:**

```typescript
// Not all entities have AI
interface AIComponent {
  state: AIState;
  target: number | null;
}

// Only add AIComponent to entities that need it
const enemy = ecs.createEntity();
ecs.addComponent<AIComponent>(enemy, 'ai', { state: 'idle', target: null });
```

---

## 4. System Design

### System Execution Order

**Order matters!** Systems should run in a logical sequence:

```typescript
function update() {
  // 1. Input (capture user actions)
  inputSystem(ecs);

  // 2. AI decisions (before movement)
  aiSystem(ecs, playerId);

  // 3. Movement (process all movement requests)
  playerMovementSystem(ecs);
  movementSystem(ecs, dx, dy);

  // 4. Collision detection
  collisionSystem(ecs);

  // 5. Combat (after collision detected)
  combatSystem(ecs);

  // 6. Status effects (after combat)
  statusEffectSystem(ecs);

  // 7. Death (after all damage applied)
  deathSystem(ecs);
}

function renderPost() {
  // Render systems run after LittleJS rendering
  renderSystem(ecs);
  inventoryUISystem(ecs, playerId);
}
```

### System Patterns

**Query Pattern (most common):**

```typescript
export function healthRegenSystem(ecs: ECS, delta: number): void {
  const entities = ecs.query('health');

  for (const id of entities) {
    const health = ecs.getComponent<HealthComponent>(id, 'health');
    if (health && health.current < health.max) {
      health.current += 1 * delta;
      health.current = Math.min(health.current, health.max);
    }
  }
}
```

**Single Entity Pattern:**

```typescript
export function playerMovementSystem(ecs: ECS): void {
  const players = ecs.query('player', 'position', 'input');

  for (const id of players) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    const input = ecs.getComponent<InputComponent>(id, 'input');
    // ... process single player
  }
}
```

**Event-Driven Pattern (not main loop):**

```typescript
// Called when specific events occur
export function relationSystem(
  ecs: ECS,
  entityId: number,
  targetId: number,
  scoreDelta: number
): void {
  const relation = ecs.getComponent<RelationComponent>(entityId, 'relation');

  if (relation) {
    const relationData = relation.relations.get(targetId);
    if (relationData) {
      relationData.relationScore += scoreDelta;
      // Clamp to min/max
    }
  }
}
```

---

## 5. Data-Driven Development

### JSON Best Practices

**✅ DO:**

- Use template mixing for reusable configurations
- Validate data with TypeScript interfaces
- Keep JSON human-readable with good formatting
- Use semantic color names from palette
- Document required vs optional fields

**❌ DON'T:**

- Hardcode entity/item properties in code
- Use hex colors (use palette names instead)
- Create duplicate data (use templates)
- Skip validation (use registries)

**Good Template Usage:**

```json
{
  "id": "veteran_orc_warrior",
  "name": "Veteran Orc Warrior",
  "type": "enemy",
  "templates": {
    "statsTemplates": ["bruteStats", "veteranBonus"],
    "aiTemplates": ["aggressiveAI"],
    "renderTemplates": ["orcRender"]
  },
  "stats": {
    "intelligence": 12
  }
}
```

### Template Layering Strategy

**Limit layers (3-4 max recommended):**

```json
{
  "templates": {
    "statsTemplates": [
      "baseStats", // Layer 1: Foundation
      "veteranBonus", // Layer 2: Modifier
      "eliteModifier" // Layer 3: Special enhancement
    ]
  }
}
```

**Name templates clearly:**

- Base: `{descriptor}{ComponentType}` (e.g., `bruteStats`, `mageStats`)
- Modifiers: `{effect}Bonus/Modifier` (e.g., `veteranBonus`, `cursedModifier`)

### Color Best Practices

#### Color Palette System

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

---

## 6. Testing

### What to Test

**✅ Test:**

- Pure functions (systems, utilities)
- Data transformations
- ECS queries and component operations
- Game logic independent of rendering
- Edge cases (empty arrays, null values, boundaries)

**❌ Don't Test:**

- LittleJS rendering (use mocks)
- Visual appearance (test data instead)
- Browser-specific features (mock them)

### Test Structure

**AAA Pattern (Arrange, Act, Assert):**

```typescript
test('movementSystem moves entities with movable component', () => {
  // Arrange
  const ecs = new ECS();
  const entity = ecs.createEntity();
  ecs.addComponent<PositionComponent>(entity, 'position', { x: 0, y: 0 });
  ecs.addComponent<MovableComponent>(entity, 'movable', { speed: 1.0 });

  // Act
  movementSystem(ecs, 5, 10);

  // Assert
  const pos = ecs.getComponent<PositionComponent>(entity, 'position');
  expect(pos?.x).toBe(5);
  expect(pos?.y).toBe(10);
});
```

### Mocking Strategy

**Mock external dependencies (LittleJS):**

```typescript
// src/ts/__mocks__/littlejsengine.ts
export class Vector2 {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}
  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
}
```

**Use real implementations for internal code:**

```typescript
// Test uses real ECS, not a mock
import ECS from '../../ecs';
const ecs = new ECS();
```

---

## 7. Performance

### Entity Management

**✅ DO:**

- Use lazy generation (only create when needed)
- Clean up dead entities with `deathSystem`
- Unload off-screen locations: `world.unloadAllExceptCurrent()`
- Use spatial queries efficiently (`getEntitiesInRadius`)

**❌ DON'T:**

- Create all entities at startup
- Leave dead entities in ECS
- Query entire entity list repeatedly
- Store duplicate spatial data

### System Optimization

**Query once, iterate once:**

```typescript
// Good: single query
export function renderSystem(ecs: ECS): void {
  const entities = ecs.query('position', 'render');

  for (const id of entities) {
    // process
  }
}

// Bad: multiple queries
export function renderSystem(ecs: ECS): void {
  const positions = ecs.query('position');
  const renders = ecs.query('render');
  // Inefficient!
}
```

### Memory Management

**Avoid memory leaks:**

- Remove entities when no longer needed: `ecs.removeEntity(id)`
- Clear temporary arrays after use
- Unload unused locations from World
- Don't store references to destroyed entities

---

## 8. Code Organization

### File Structure

**Components:** One file per component (or small related groups)

```
src/ts/components/
├── position.ts
├── health.ts
├── render.ts
└── index.ts  // Re-exports all
```

**Systems:** One file per system (or small related groups)

```
src/ts/systems/
├── renderSystem.ts
├── movementSystem.ts
├── combatSystem.ts
└── index.ts  // Re-exports all
```

**Entities:** Factory functions in single file

```
src/ts/entities.ts
```

### Import Organization

**Order imports logically:**

```typescript
// 1. External libraries
import * as LJS from 'littlejsengine';

// 2. Internal modules
import ECS from './ecs';
import { PositionComponent, HealthComponent } from './components';

// 3. Blank line between groups
```

### Naming Conventions

**Be consistent:**

- Files: `camelCase.ts` (e.g., `gameObject.ts`)
- Classes: `PascalCase` (e.g., `GameObject`)
- Interfaces: `PascalCase` with suffix (e.g., `PositionComponent`)
- Functions: `camelCase` (e.g., `movementSystem`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `TILE_SIZE`)
- Enums: `PascalCase` for enum, `UPPER_SNAKE_CASE` for values

---

## 9. Common Pitfalls

### Pitfall #1: Storing Logic in Components

**❌ Bad:**

```typescript
export interface HealthComponent {
  current: number;
  max: number;

  // Bad: method in component!
  takeDamage(amount: number): void {
    this.current -= amount;
  }
}
```

**✅ Good:**

```typescript
export interface HealthComponent {
  current: number;
  max: number;
}

// Logic in system
export function damageSystem(ecs: ECS, entityId: number, amount: number): void {
  const health = ecs.getComponent<HealthComponent>(entityId, 'health');
  if (health) {
    health.current -= amount;
    health.current = Math.max(0, health.current);
  }
}
```

### Pitfall #2: Storing Entity Positions in Tiles

**❌ Bad:**

```typescript
interface Tile {
  type: TileType;
  entities: number[]; // Don't store entity IDs in tiles!
}
```

**✅ Good:**

```typescript
// Tiles are just terrain
interface Tile {
  type: TileType;
  walkable: boolean;
}

// Entities have positions
interface PositionComponent {
  x: number;
  y: number;
}

// Use spatial system to query
const entitiesHere = getEntitiesAt(ecs, x, y);
```

### Pitfall #3: Hardcoding Colors

**❌ Bad:**

```typescript
const playerColor = new LJS.Color(0, 1, 0, 1); // Hardcoded green
```

**✅ Good:**

```typescript
import { getColor, BaseColor } from './colorPalette';
const playerColor = getColor(BaseColor.PLAYER); // Uses palette
```

### Pitfall #4: Mixing View Modes in Systems

**❌ Bad:**

```typescript
export function inputSystem(ecs: ECS): void {
  // Handles all modes in one system - messy!
  if (viewMode === ViewMode.INVENTORY) {
    // inventory input
  } else if (viewMode === ViewMode.EXAMINE) {
    // examine input
  } else {
    // normal input
  }
}
```

**✅ Good:**

```typescript
// Separate systems for each mode
export function inputSystem(ecs: ECS): void {
  // Only normal mode
}

export function inventoryInputSystem(ecs: ECS): void {
  // Only inventory mode
}

// Game loop decides which to call
if (viewMode === ViewMode.INVENTORY) {
  inventoryInputSystem(ecs);
} else {
  inputSystem(ecs);
}
```

### Pitfall #5: Not Checking for Undefined

**❌ Bad:**

```typescript
const pos = ecs.getComponent<PositionComponent>(id, 'position');
pos.x += 10; // Crash if undefined!
```

**✅ Good:**

```typescript
const pos = ecs.getComponent<PositionComponent>(id, 'position');
if (pos) {
  pos.x += 10;
}
```

---

## Decision Log

### Why ECS Over Class Hierarchy?

**Decision:** Use Entity Component System instead of class inheritance

**Reasons:**

- Composition over inheritance (more flexible)
- Easy to add/remove capabilities at runtime
- Better for data-oriented design
- Easier to serialize/deserialize
- Avoids deep inheritance trees

### Why Pure Functions for Systems?

**Decision:** Systems are pure functions, not classes

**Reasons:**

- Easier to test (no hidden state)
- Clear inputs and outputs
- No lifecycle management needed
- Can be called from anywhere
- Simpler mental model

### Why Mock LittleJS in Tests?

**Decision:** Use mocks instead of running real LittleJS

**Reasons:**

- LittleJS requires browser environment (DOM, WebGL)
- Tests run in Node.js (no browser)
- Tests should be fast (no rendering overhead)
- Focus on logic, not visual output
- Easier to set up CI/CD

### Why Data-Driven Content?

**Decision:** Load entities/items from JSON instead of hardcoding

**Reasons:**

- Non-programmers can create content
- Easier to balance (tweak numbers without recompiling)
- Modding support built-in
- Reduces code size (data separate from logic)
- Template mixing enables powerful composition

---

## When to Break These Rules

**Rules are guidelines, not laws.** Break them when:

1. **Performance critical section** - Optimize hot paths even if it reduces clarity
2. **Prototype/experiment** - Try things quickly, refactor later
3. **External constraint** - Third-party library requires different pattern
4. **Simpler alternative exists** - Don't over-engineer
5. **Team decision** - Consistency with team > individual preference

**But always:**

- Document why you're breaking the rule
- Ensure tests still pass
- Get feedback from others
- Plan to refactor if it becomes a problem

---

## 10. Best Practices List

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
19. **Relation system is event-driven** - Call `relationSystem()` when actions affect relationships, not in main loop
20. Relations are automatically initialized via `world.initializeRelations(ecs)` in `Game.init()`
21. **Always use color palette system** - Use `getColor(BaseColor.*)` for semantic colors, `rgba()` for custom colors
22. **Never hardcode colors in JSON** - Use BaseColor enum names (lowercase) like `"color": "red"`
23. **Use template mixing for entities/items** - Define once in templates, reference in multiple entities
24. **Layer templates strategically** - Use base template + modifiers pattern (max 3-4 per component)
25. **Template naming convention** - `{descriptor}{ComponentType}` for bases, `{effect}Modifier/Bonus` for modifiers

Read more: [copilot-instructions.md](../.github/copilot-instructions.md)

---

## References & Further Reading

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEVELOPER_SUMMARY.md](./DEVELOPER_SUMMARY.md) - Development guide
- [TESTING-GUIDE.md](./TESTING-GUIDE.md) - Testing practices
- [TEMPLATE-MIXING.md](./TEMPLATE-MIXING.md) - Data composition patterns
- [LittleJS Documentation](https://github.com/KilledByAPixel/LittleJS)
- [ECS Patterns](https://github.com/topics/entity-component-system)

## Comprehensive Documentation

The project includes extensive documentation organized for easy navigation:

### Core References

- **[DOCUMENTATION-INDEX.md](../DOCUMENTATION-INDEX.md)** - Central hub for all documentation, organized by task and category
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Complete architecture overview with ECS patterns and LittleJS integration
- **[COMPONENTS-REFERENCE.md](../COMPONENTS-REFERENCE.md)** - All 26+ ECS components with properties, usage, and examples
- **[SYSTEMS-REFERENCE.md](../SYSTEMS-REFERENCE.md)** - All 40+ ECS systems with signatures, descriptions, and execution order
- **[VIEW-MODES.md](../VIEW-MODES.md)** - UI view mode system (location, world_map, inventory, examine)
- **[KEYBINDINGS-REFERENCE.md](../KEYBINDINGS-REFERENCE.md)** - Complete keyboard controls reference with all alternative keys

### Quick Access Documentation

**When you need to:**

- **Understand the codebase** → Read [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Find all components** → Check [COMPONENTS-REFERENCE.md](../COMPONENTS-REFERENCE.md)
- **Find all systems** → Check [SYSTEMS-REFERENCE.md](../SYSTEMS-REFERENCE.md)
- **Work with view modes** → Read [VIEW-MODES.md](../VIEW-MODES.md)
- **Learn keyboard controls** → Check [KEYBINDINGS-REFERENCE.md](../KEYBINDINGS-REFERENCE.md)
- **Find any documentation** → Start at [DOCUMENTATION-INDEX.md](../DOCUMENTATION-INDEX.md)

### Important Notes

1. **Always consult the documentation** before implementing new features
2. **Check COMPONENTS-REFERENCE.md** when creating entities to see available components
3. **Check SYSTEMS-REFERENCE.md** when adding systems to understand execution order
4. **Use DOCUMENTATION-INDEX.md** to find task-specific guides
5. **Keep documentation updated** when adding new components or systems
