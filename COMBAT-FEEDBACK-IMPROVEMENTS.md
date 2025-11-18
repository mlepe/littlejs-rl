# Combat Feedback & UI Improvements

## Overview

This document summarizes the improvements made to combat feedback, UI opacity, item collision, and tile visibility based on user testing feedback.

## Changes Implemented

### 1. UI Opacity Configuration ✅

**Problem:** Inventory UI background was not opaque enough, making text hard to read.

**Solution:** Added centralized opacity configuration system in `inventoryUISystem.ts`:

```typescript
// UI Opacity Settings (easily adjustable)
OPACITY: {
  BACKGROUND: 0.98,      // Panel backgrounds (0.0 = transparent, 1.0 = opaque)
  BORDER: 1.0,           // Panel borders
  TEXT: 1.0,             // Text and titles
  SELECTED: 0.5,         // Selected item highlight
  HOVER: 0.3,            // Mouse hover highlight
  DRAG: 0.7,             // Dragged item overlay
  EMPTY_SLOT: 0.5,       // Empty equipment slots
}
```

**Benefits:**

- Single location to adjust all UI opacity values
- Increased background opacity from 0.95 to 0.98 (98% opaque)
- Easy to customize for different visual preferences

**Files Modified:**

- `src/ts/systems/inventoryUISystem.ts`

---

### 2. Items No Longer Block Movement ✅

**Problem:** Items dropped on the ground were blocking player and enemy movement.

**Solution:** Modified collision system to only check entities with `MovableComponent`:

```typescript
// collisionSystem.ts
export function canMoveTo(
  ecs: ECS,
  entityId: number,
  newX: number,
  newY: number
): boolean {
  // Only check collision with entities that have MovableComponent
  // This excludes items on the ground, which shouldn't block movement
  const entities = ecs.query('position', 'movable');

  for (const otherId of entities) {
    // ... collision check logic
  }
}
```

**Previous Behavior:**

- `ecs.query('position')` included ALL entities (players, enemies, items)
- Items on ground would block movement

**New Behavior:**

- `ecs.query('position', 'movable')` includes ONLY entities that can move
- Items lack `MovableComponent` → don't block movement
- Items are already having `MovableComponent` removed by `lootSystem` when dropped

**Files Modified:**

- `src/ts/systems/collisionSystem.ts`

---

### 3. Damage Flash Effect ✅

**Problem:** No visual feedback when entities take damage.

**Solution:** Added white flash effect to `RenderComponent`:

```typescript
// render.ts
export interface RenderComponent {
  // ... existing properties
  /** Damage flash timer - entity flashes white when > 0 */
  damageFlashTimer?: number;
}
```

**How It Works:**

1. When entity takes damage, set `damageFlashTimer = 0.2` (200ms)
2. `renderSystem` checks timer and renders entity white if `timer > 0`
3. Timer decrements each frame using `LJS.timeDelta`
4. Returns to normal color when timer reaches 0

**Visual Effect:**

- Brief white flash on hit (0.2 seconds)
- Clear indication entity was damaged
- Works for both player and enemies

**Files Modified:**

- `src/ts/components/render.ts`
- `src/ts/systems/renderSystem.ts`
- `src/ts/systems/collisionDamageSystem.ts`
- `src/ts/systems/combatSystem.ts`

---

### 4. Floating Damage Numbers ✅

**Problem:** Impossible to tell how much damage was dealt without checking console.

**Solution:** Added floating damage number animation:

```typescript
// render.ts
export interface RenderComponent {
  // ... existing properties
  /** Floating damage number data (optional) */
  floatingDamage?: {
    amount: number; // Damage value to display
    timer: number; // How long to show (0.5 seconds)
    offsetY: number; // Vertical offset (increases over time)
  };
}
```

**How It Works:**

1. When entity takes damage, create `floatingDamage` data
2. `renderSystem` renders damage number above entity
3. Number floats upward (`offsetY += 2.0 * LJS.timeDelta`)
4. Number fades out as timer decreases (`alpha = timer / 0.5`)
5. Removed when `timer <= 0`

**Visual Effect:**

- Red damage number appears above damaged entity
- Floats upward for 0.5 seconds
- Fades out as it rises
- Clear, immediate feedback on damage dealt

**Files Modified:**

- `src/ts/components/render.ts`
- `src/ts/systems/renderSystem.ts`
- `src/ts/systems/collisionDamageSystem.ts`
- `src/ts/systems/combatSystem.ts`

---

### 5. Non-Blocking Tiles Visual Differentiation ✅

**Problem:** Grass tiles looked like they should block movement (similar visual weight to walls).

**Solution:** Added opacity property to tile system:

```typescript
// tile.ts
export interface Tile {
  // ... existing properties
  /** Opacity multiplier for non-blocking tiles (optional, default 1.0) */
  opacity?: number;
}

export interface TileProperties {
  // ... existing properties
  /** Opacity for non-blocking tiles (0.0-1.0, default 1.0) */
  readonly opacity?: number;
}

// Grass tiles now have reduced opacity
[TileType.GRASS]: {
  walkable: true,
  transparent: true,
  collisionValue: 0,
  baseColor: BaseColor.GRASS,
  opacity: 0.7, // Reduced opacity to distinguish from walls
}
```

**How It Works:**

1. `TileProperties` defines default opacity per tile type
2. `createTile()` applies opacity to tile color if specified
3. Grass tiles render at 70% opacity (alpha = 0.7)
4. Walls and blocking tiles remain at 100% opacity

**Visual Effect:**

- Grass tiles appear lighter/more transparent
- Clear visual distinction between walkable and blocking tiles
- Blocking tiles (walls) remain solid and opaque
- Easy to identify safe paths at a glance

**Files Modified:**

- `src/ts/tile.ts` (interface updates and grass properties)

---

## Testing Checklist

**All features should now work correctly:**

- [x] **UI Opacity**: Inventory background is highly opaque (98%), text clearly readable
- [x] **Item Collision**: Player and enemies can walk over items on ground
- [x] **Damage Flash**: Entities flash white briefly when damaged
- [x] **Floating Damage**: Red damage numbers appear and float upward on hit
- [x] **Grass Tiles**: Grass appears lighter/transparent compared to walls

**To Test:**

1. **UI Opacity:**
   - Open inventory (I key)
   - Verify background is nearly opaque, text is easy to read
   - Adjust `UI_CONFIG.OPACITY.BACKGROUND` in `inventoryUISystem.ts` if needed

2. **Item Collision:**
   - Kill an enemy
   - Walk onto the tile where enemy died
   - Verify you can walk over dropped items
   - Pick up items by walking over them

3. **Combat Feedback:**
   - Attack an enemy (walk into them)
   - Verify enemy flashes white briefly
   - Verify red damage number appears and floats upward
   - Damage number should be clearly visible

4. **Tile Visibility:**
   - Find grass tiles in game world
   - Verify grass appears lighter/more transparent than walls
   - Should be easy to distinguish walkable vs blocking tiles

---

## Configuration Options

### Adjusting UI Opacity

Edit `src/ts/systems/inventoryUISystem.ts`:

```typescript
OPACITY: {
  BACKGROUND: 0.98,  // Change this (0.0 = transparent, 1.0 = opaque)
  BORDER: 1.0,       // Panel borders
  TEXT: 1.0,         // Text clarity
  // ... other elements
}
```

### Adjusting Damage Flash Duration

Edit `src/ts/systems/collisionDamageSystem.ts` or `combatSystem.ts`:

```typescript
defenderRender.damageFlashTimer = 0.2; // Change duration (seconds)
```

### Adjusting Floating Damage Display

Edit `src/ts/systems/collisionDamageSystem.ts` or `combatSystem.ts`:

```typescript
defenderRender.floatingDamage = {
  amount: finalDamage,
  timer: 0.5, // Change display duration (seconds)
  offsetY: 0,
};
```

Edit `src/ts/systems/renderSystem.ts` to change animation:

```typescript
// Float speed
dmg.offsetY += 2.0 * LJS.timeDelta; // Change multiplier for faster/slower rise

// Fade out speed
const damageColor = new LJS.Color(1, 0.2, 0.2, dmg.timer / 0.5); // Change divisor
```

### Adjusting Grass Tile Opacity

Edit `src/ts/tile.ts`:

```typescript
[TileType.GRASS]: {
  // ... existing properties
  opacity: 0.7, // Change this (0.0 = invisible, 1.0 = fully opaque)
}
```

---

## Technical Details

### Animation Timing

All animations use `LJS.timeDelta` for frame-independent timing:

- Damage flash: 0.2 seconds
- Floating damage: 0.5 seconds
- Both scale with frame rate automatically

### Color Blending

- **Damage flash**: Replaces entity color with pure white `Color(1, 1, 1, 1)`
- **Floating damage**: Red with fading alpha `Color(1, 0.2, 0.2, fadeAmount)`
- **Grass tiles**: Original color with reduced alpha `Color(r, g, b, 0.7)`

### Performance

All features have minimal performance impact:

- Flash/damage effects only process entities currently being damaged
- Opacity is applied once at tile creation
- Collision check still O(n) but now excludes items (fewer entities to check)

---

## Future Enhancements

Potential improvements based on this system:

1. **Damage Types with Colors:**
   - Physical damage: white flash
   - Fire damage: orange flash
   - Ice damage: cyan flash
   - Poison damage: green flash

2. **Critical Hits:**
   - Larger damage numbers
   - Different color (yellow or gold)
   - Longer display time
   - Screen shake effect

3. **Healing Feedback:**
   - Green floating numbers for healing
   - Green flash on heal

4. **More Tile Opacity Variations:**
   - Water: semi-transparent (0.6)
   - Lava: pulsing opacity
   - Fog/smoke: very transparent (0.3)

5. **Configurable UI Themes:**
   - Save opacity preferences
   - Multiple theme presets (minimal, standard, high-contrast)
   - Per-panel opacity control

---

## Version History

**v0.11.1** - Combat Feedback & UI Improvements

- Added UI opacity configuration system
- Fixed items blocking movement
- Added damage flash effect
- Added floating damage numbers
- Reduced grass tile opacity for better differentiation

---

## Related Documentation

- `INVENTORY-UI-COORDINATE-FIX.md` - Inventory UI rewrite
- `COMPONENTS-REFERENCE.md` - RenderComponent details
- `SYSTEMS-REFERENCE.md` - renderSystem, collisionSystem details
- `ARCHITECTURE.md` - ECS architecture overview
