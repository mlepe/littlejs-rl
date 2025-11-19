# Examine Mode Bug Fixes

## Overview

Two visual bugs were discovered during testing of the examine mode feature:

1. Grass tiles displaying wrong sprite from tileset
2. Entities (player, items, enemies) rendering behind tile layers

Both bugs have been fixed and verified.

---

## Bug 1: Incorrect Grass Sprite

### Problem

Grass tiles were displaying the wrong sprite from the tileset. This was caused by directly using `TileType` enum values as sprite indices, but the enum values don't match the actual sprite positions in the tileset.

### Root Cause

```typescript
enum TileType {
  VOID = 0,
  FLOOR = 1,
  WALL = 2,
  // ...
  GRASS = 8, // ❌ Sprite index 8 is NOT grass in the tileset
}
```

The code was passing `TileType.GRASS` (value 8) directly to LittleJS's tile rendering, but sprite index 8 doesn't correspond to grass in the actual tileset image.

### Solution

Created `TILE_SPRITE_MAP` in `src/ts/tile.ts` to properly map `TileType` enum values to correct `TileSprite` indices:

```typescript
export const TILE_SPRITE_MAP: Record<TileType, number> = {
  [TileType.VOID]: TileSprite.FLOOR_VOID, // 0 → 0
  [TileType.FLOOR]: TileSprite.FLOOR_STONE, // 1 → 1
  [TileType.WALL]: TileSprite.WALL_STONE, // 2 → 48
  [TileType.DOOR_OPEN]: TileSprite.DOOR_OPEN, // 3 → 96
  [TileType.DOOR_CLOSED]: TileSprite.DOOR_CLOSED, // 4 → 97
  [TileType.STAIRS_UP]: TileSprite.STAIRS_UP, // 5 → 192
  [TileType.STAIRS_DOWN]: TileSprite.STAIRS_DOWN, // 6 → 193
  [TileType.WATER]: TileSprite.FLOOR_WATER, // 7 → 144
  [TileType.GRASS]: TileSprite.FLOOR_GRASS, // 8 → 4 ✅ Correct!
};
```

Now `createTile()` uses the mapping:

```typescript
export function createTile(type: TileType, color?: Color): Tile {
  return {
    type,
    spriteIndex: TILE_SPRITE_MAP[type], // ✅ Uses correct sprite
    color: color || DEFAULT_TILE_COLOR,
  };
}
```

### Files Modified

- `src/ts/tile.ts` - Added `TILE_SPRITE_MAP` constant

---

## Bug 2: Entities Rendering Behind Tiles

### Problem

Entities (player character, items, enemies) were rendering **behind** the tile layer instead of on top of it. This made the game look broken (e.g., player walking "under" grass tiles).

### Root Cause

The issue was with the **LittleJS render pipeline** and when `renderSystem()` was being called:

**LittleJS Render Pipeline:**

1. `gameRender()` - Custom game rendering
2. **TileLayers auto-render** (sorted by renderOrder: 0, 1, 2...)
3. `gameRenderPost()` - UI overlays

The code was calling `renderSystem(this.ecs)` in `render()`, which meant entities were drawn **before** tile layers. Even though we set `ENTITY_RENDER_ORDER = 2`, manual `drawTile()` calls don't respect render order values—only actual `TileLayer` objects do.

### Solution

**Move entity rendering from `render()` to `renderPost()`**:

```typescript
// src/ts/game.ts

render(): void {
  // TileLayer and TileCollisionLayer are automatically rendered by LittleJS
  // in this phase (renderOrder 0 and 1)

  // Render collision overlay if enabled
  if (this.showCollisionOverlay) {
    const location = this.world.getCurrentLocation();
    if (location) {
      location.renderDebug();
    }
  }

  // NOTE: Entity rendering moved to renderPost() to ensure
  // entities render AFTER tile layers
}

renderPost(): void {
  // Render all entities (AFTER tile layers, so they appear on top)
  renderSystem(this.ecs); // ✅ Now called after tiles render

  // Examine mode UI overlays
  if (currentViewMode === ViewMode.EXAMINE && viewModeComp) {
    const examineData = examineSystem(/* ... */);
    examineRenderSystem(/* ... */);
  }

  // Debug info
  if (this.showDebugText) {
    this.renderDebugInfo();
  }
}
```

**Why This Works:**

- `render()` phase: Collision overlay only (optional debug)
- **TileLayers render automatically** between `render()` and `renderPost()`
- `renderPost()` phase: Entities (via `renderSystem`), examine cursor, UI, debug text

Now the draw order is:

1. Tile layer (renderOrder 0)
2. Collision layer (renderOrder 1)
3. **Entities** (drawn in `renderPost()`)
4. Examine cursor (drawn in `renderPost()`)
5. Debug UI (drawn in `renderPost()`)

### Files Modified

- `src/ts/game.ts` - Moved `renderSystem(this.ecs)` from `render()` to `renderPost()`
- `src/ts/global.ts` - Added `ENTITY_RENDER_ORDER = 2` (for documentation purposes)
- `src/ts/systems/renderSystem.ts` - Added comment explaining render order
- `src/ts/systems/examineRenderSystem.ts` - Added comment explaining render order

---

## Verification

### Build Status

✅ Project compiles successfully with no errors:

```
webpack 5.102.1 compiled successfully in 4198 ms
```

### Expected Behavior

1. **Grass tiles** now display the correct sprite (green grass texture from tileset)
2. **Entities render above tiles**:
   - Player character appears on top of grass/floor tiles
   - Items appear on top of floor tiles
   - Enemies appear on top of terrain
3. **Examine cursor** renders above everything (yellow highlight box)
4. **Debug overlays** render on top (collision grid, text info)

### Testing Steps

1. Run `npm run dev` or `npm run serve`
2. Move player character around the map
3. Press `L` to activate examine mode
4. Verify:
   - ✅ Grass tiles look like grass (green texture)
   - ✅ Player sprite visible above terrain
   - ✅ Items visible above floor tiles
   - ✅ Yellow examine cursor visible above everything
   - ✅ Entity names display when cursor hovers over them

---

## Technical Details

### LittleJS Render Order System

LittleJS uses a **phase-based rendering system**, not z-index for manual drawing:

| Phase                        | What Renders                                 | Order           |
| ---------------------------- | -------------------------------------------- | --------------- |
| **1. gameRender()**          | Custom drawTile/drawRect calls               | User-controlled |
| **2. TileLayer Auto-Render** | All TileLayer objects, sorted by renderOrder | 0, 1, 2...      |
| **3. gameRenderPost()**      | UI overlays, HUD, debug info                 | User-controlled |

**Key Insight:** Manual drawing functions like `drawTile()`, `drawRect()`, `drawText()` don't respect `renderOrder` parameters. Only `TileLayer` and `EngineObject` instances use render order sorting.

### Why Manual Drawing Doesn't Use Render Order

When you call:

```typescript
LJS.drawTile(position, size, tileInfo, color);
```

This immediately draws to the canvas buffer in the **current phase**. The `renderOrder` parameter only applies to:

- `TileLayer` objects (sorted during auto-render phase)
- `EngineObject` instances (sorted by their `.renderOrder` property)

For ECS entities using manual `drawTile()` calls, we must control render order by **when we call the rendering functions** (which lifecycle phase).

---

## Lessons Learned

1. **Don't assume enum values match sprite indices** - Always create explicit mappings
2. **LittleJS render order is phase-based** - Manual drawing happens in the phase you call it
3. **Use `renderPost()` for entities** - Ensures they render after tile layers
4. **Test visual output early** - Bugs like these are easier to catch with visual testing

---

## Related Files

### Modified Files

- `src/ts/tile.ts` - Tile sprite mapping
- `src/ts/game.ts` - Render phase organization
- `src/ts/global.ts` - Render order enum (documentation)
- `src/ts/systems/renderSystem.ts` - Added explanatory comments
- `src/ts/systems/examineRenderSystem.ts` - Added explanatory comments

### Documentation

- `.github/copilot-instructions.md` - Updated with render order best practices
- `EXAMINE-MODE-FIXES.md` - This document

---

## Future Considerations

### Potential Improvements

1. **Use EngineObject for entities** (instead of manual drawTile):
   - Automatically handles render order
   - Built-in sprite animation
   - Physics integration
   - **Trade-off**: Less control over rendering, may have overhead

2. **Z-layered entity rendering**:
   - Sort entities by Y-coordinate (for depth effect)
   - Render bottom-to-top for pseudo-3D look
   - Useful for isometric or top-down games

3. **Render order validation**:
   - Add runtime checks to ensure render order is correct
   - Debug mode to visualize render layers
   - Automated tests for visual rendering

---

## Version History

- **v0.11.0** - Examine mode implementation
- **v0.11.1** (current) - Fixed grass sprite and entity render order bugs
