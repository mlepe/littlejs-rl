---
applyTo: '**'
---

# LittleJS Integration Guidelines

## Core Principles

When implementing features or making significant changes, always prioritize LittleJS integration:

### 1. Leverage LittleJS Capabilities

**Do**: Use built-in systems for common game functionality

- Rendering system for drawing sprites and shapes
- Physics system for collision detection and movement
- Input system for keyboard/mouse/gamepad handling
- Audio system for sound effects and music

**Don't**: Reimplement functionality that LittleJS already provides

### 2. Follow LittleJS Patterns

**Use LittleJS types consistently:**

- `Vector2` (via `vec2()`) for all positions, velocities, and 2D coordinates
- `Color` for all color values
- `TileInfo` for sprite definitions
- `Timer` for time-based events and delays
- `EngineObject` as base class when entities need LittleJS features

**Example:**

```typescript
import * as LJS from 'littlejsengine';

// Good: Using LittleJS types
const position = LJS.vec2(10, 20);
const color = new LJS.Color(1, 0, 0, 1); // Red
const tileInfo = new LJS.TileInfo(LJS.vec2(0, 0), LJS.vec2(16, 16));

// Bad: Using plain objects or numbers
const position = { x: 10, y: 20 };
const color = '#ff0000';
```

### 3. Integrate with ECS

**Store LittleJS objects in ECS components:**

```typescript
// RenderComponent stores LittleJS rendering data
export interface RenderComponent {
  tileInfo: LJS.TileInfo;
  color: LJS.Color;
  size: LJS.Vector2;
  angle?: number;
  mirror?: boolean;
  additiveColor?: LJS.Color;
}
```

**Let ECS systems manage LittleJS objects:**

```typescript
// System uses LittleJS rendering functions
export function renderSystem(ecs: ECS): void {
  const entities = ecs.query('position', 'render');

  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    const render = ecs.getComponent<RenderComponent>(id, 'render');

    if (pos && render) {
      // Use LittleJS drawTile function
      LJS.drawTile(
        LJS.vec2(pos.x, pos.y),
        render.size,
        render.tileInfo,
        render.color,
        render.angle,
        render.mirror
      );
    }
  }
}
```

### 4. Use LittleJS Utilities

**Prefer LittleJS functions over custom implementations:**

| Need                    | Use LittleJS                                     | Don't Reimplement    |
| ----------------------- | ------------------------------------------------ | -------------------- |
| **Vector math**         | `vec2().add()`, `.subtract()`, `.length()`       | Custom vector class  |
| **Collision detection** | `LJS.isOverlapping()`, `LJS.tileCollisionTest()` | Manual AABB checks   |
| **Random numbers**      | `LJS.rand()`, `LJS.randInt()`                    | `Math.random()`      |
| **Time/delta**          | `LJS.time`, `LJS.timeDelta`                      | Custom time tracking |
| **Clamping**            | `LJS.clamp()`, `LJS.percent()`                   | Manual min/max       |
| **Lerping**             | `LJS.lerp()`                                     | Manual interpolation |

**Example:**

```typescript
// Good: Using LittleJS utilities
const distance = pos1.subtract(pos2).length();
const randomValue = LJS.rand(0, 100);
const clamped = LJS.clamp(value, 0, 10);

// Bad: Custom implementations
const distance = Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
const randomValue = Math.random() * 100;
const clamped = Math.max(0, Math.min(value, 10));
```

### 5. Respect the Engine Lifecycle

**Hook into LittleJS lifecycle functions properly:**

```typescript
import * as LJS from 'littlejsengine';
import Game from './ts/game';

const game = Game.getInstance();

LJS.engineInit(
  // gameInit: Called once at startup (async allowed)
  async () => {
    await game.init();
  },

  // gameUpdate: Called every frame for logic
  () => {
    game.update();
  },

  // gameUpdatePost: Called after physics update
  () => {
    game.updatePost();
  },

  // gameRender: Called every frame for rendering
  () => {
    game.render();
  },

  // gameRenderPost: Called after rendering for UI/overlays
  () => {
    game.renderPost();
  },

  // tileImage: Tileset to load
  ['tileset.png']
);
```

**Lifecycle order:**

1. `gameInit()` - Load assets, initialize systems, create entities
2. `gameUpdate()` - Game logic, input handling, AI, movement
3. Physics (handled by LittleJS)
4. `gameUpdatePost()` - Post-physics logic, collision response
5. `gameRender()` - Draw game world
6. `gameRenderPost()` - Draw UI, debug overlays

### 6. Don't Bypass LittleJS

**Work through the engine, not around it:**

❌ **Bad practices:**

```typescript
// Don't access canvas directly
const ctx = canvas.getContext('2d');
ctx.fillRect(x, y, w, h);

// Don't use raw WebGL
gl.drawArrays(gl.TRIANGLES, 0, 3);

// Don't manually track input
window.addEventListener('keydown', (e) => {
  /* ... */
});
```

✅ **Good practices:**

```typescript
// Use LittleJS drawing functions
LJS.drawRect(LJS.vec2(x, y), LJS.vec2(w, h), color);

// Use LittleJS input system
if (LJS.keyIsDown('KeyW')) {
  /* ... */
}
if (LJS.mouseIsDown(0)) {
  /* ... */
}

// Use LittleJS rendering in lifecycle
function gameRender() {
  LJS.drawTile(pos, size, tileInfo, color);
}
```

## Integration Checklist

When adding new features, verify:

- [ ] Uses `LJS.*` prefix for all LittleJS types and functions
- [ ] Stores LittleJS objects in ECS components where appropriate
- [ ] Uses `Vector2` instead of `{x, y}` objects
- [ ] Uses `Color` instead of hex strings or RGB objects
- [ ] Uses LittleJS utilities (`rand()`, `clamp()`, etc.) over custom math
- [ ] Hooks into proper lifecycle functions (`gameInit`, `gameUpdate`, `gameRender`)
- [ ] Doesn't access canvas/WebGL/DOM directly
- [ ] Uses LittleJS input system (`keyIsDown()`, `mousePos()`)
- [ ] Uses LittleJS collision detection (`tileCollisionTest()`, `isOverlapping()`)
- [ ] Leverages LittleJS timers (`Timer`) for delayed actions

## Benefits of Proper Integration

1. **Consistency** - All code uses the same patterns and APIs
2. **Maintainability** - Easier to understand and modify code
3. **Performance** - LittleJS is optimized; custom implementations may not be
4. **Features** - Automatically gain engine improvements and bug fixes
5. **Compatibility** - Works correctly with LittleJS systems (rendering, physics, etc.)
6. **Less code** - Reuse engine functionality instead of reimplementing

## Common Integration Patterns

### Pattern 1: Position Management

```typescript
// Component uses plain numbers (ECS owns data)
export interface PositionComponent {
  x: number;
  y: number;
}

// System converts to Vector2 when needed (LittleJS integration)
export function movementSystem(ecs: ECS, dx: number, dy: number): void {
  const entities = ecs.query('position', 'movable');

  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');

    // Use Vector2 for calculations
    const currentPos = LJS.vec2(pos.x, pos.y);
    const movement = LJS.vec2(dx, dy);
    const newPos = currentPos.add(movement);

    // Store back in component
    pos.x = newPos.x;
    pos.y = newPos.y;
  }
}
```

### Pattern 2: Collision Detection

```typescript
// Use LittleJS's built-in collision system
export function collisionSystem(ecs: ECS): void {
  const entities = ecs.query('position', 'movable');

  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    const playerPos = LJS.vec2(pos.x, pos.y);
    const size = LJS.vec2(1, 1); // Tile size

    // Use LittleJS collision test
    if (!LJS.tileCollisionTest(playerPos, size)) {
      // Can move here
    } else {
      // Collision detected, handle it
    }
  }
}
```

### Pattern 3: Time-Based Actions

```typescript
export function timedAbilitySystem(ecs: ECS): void {
  const entities = ecs.query('abilities');

  for (const id of entities) {
    const abilities = ecs.getComponent<AbilitiesComponent>(id, 'abilities');

    // Use LittleJS Timer
    if (!abilities.cooldownTimer || abilities.cooldownTimer.elapsed()) {
      // Ability ready, can use
      if (useAbility) {
        // Start cooldown timer
        abilities.cooldownTimer = new LJS.Timer(3); // 3 seconds
      }
    }
  }
}
```

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Reimplementing LittleJS Features

```typescript
// Don't do this
class CustomVector {
  constructor(
    public x: number,
    public y: number
  ) {}
  add(other: CustomVector) {
    /* ... */
  }
  length() {
    /* ... */
  }
}

// Do this instead
import * as LJS from 'littlejsengine';
const pos = LJS.vec2(x, y);
```

### ❌ Anti-Pattern 2: Bypassing the Render System

```typescript
// Don't do this
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.fillRect(x, y, 10, 10);

// Do this instead
function gameRender() {
  LJS.drawRect(LJS.vec2(x, y), LJS.vec2(10, 10), new LJS.Color(1, 0, 0));
}
```

### ❌ Anti-Pattern 3: Manual Input Polling

```typescript
// Don't do this
const keys = {};
window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));

// Do this instead
function gameUpdate() {
  if (LJS.keyIsDown('KeyW')) {
    /* move up */
  }
  if (LJS.keyWasPressed('Space')) {
    /* jump */
  }
}
```

## Summary

Always ask: **"Does LittleJS already provide this?"** before implementing custom solutions. When in doubt, check the [LittleJS documentation](https://github.com/KilledByAPixel/LittleJS) or existing codebase examples.
