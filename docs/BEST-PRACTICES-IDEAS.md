# Best Practices Ideas & Reference

This document contains ideas and examples you can reference when filling out `BEST-PRACTICES.md`. Pick what's relevant to your project and discard the rest.

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

## References & Further Reading

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEVELOPER_SUMMARY.md](./DEVELOPER_SUMMARY.md) - Development guide
- [TESTING-GUIDE.md](./TESTING-GUIDE.md) - Testing practices
- [TEMPLATE-MIXING.md](./TEMPLATE-MIXING.md) - Data composition patterns
- [LittleJS Documentation](https://github.com/KilledByAPixel/LittleJS)
- [ECS Patterns](https://github.com/topics/entity-component-system)
