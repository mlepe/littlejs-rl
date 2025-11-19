# Location Transitions

**Version:** 0.10.0  
**Status:** ✅ Implemented

## Overview

The location transition system enables seamless movement between adjacent locations in the world grid. When the player reaches the edge of a location, they automatically transition to the neighboring location with position wrapping.

## Architecture

### System: `locationTransitionSystem`

**File:** `src/ts/systems/locationTransitionSystem.ts`

Detects when entities (primarily the player) cross location boundaries and handles transitions to adjacent world locations.

**Execution Order:** After `playerMovementSystem`, before `aiSystem`

```typescript
function gameUpdate() {
  inputSystem(ecs);
  playerMovementSystem(ecs); // Move player
  locationTransitionSystem(ecs); // Handle edge transitions ← NEW
  aiSystem(ecs, playerId);
}
```

### Key Components

**TransitionDirection Enum:**

- `NORTH` - Crossed top edge (y < 0)
- `SOUTH` - Crossed bottom edge (y >= height)
- `EAST` - Crossed right edge (x >= width)
- `WEST` - Crossed left edge (x < 0)
- `NONE` - No edge crossed

### Transition Flow

1. **Edge Detection:** Check if entity position is outside current location bounds
2. **Boundary Validation:** Verify target world position is within world bounds
3. **Location Loading:** Load or create adjacent location via `Game.changeLocation()`
4. **Position Wrapping:** Place entity on opposite edge of new location
5. **Component Update:** Update `LocationComponent` with new world coordinates
6. **Camera Update:** Move camera to follow player

### Position Wrapping

When transitioning, position wraps to the opposite edge:

| Direction               | New Position                               |
| ----------------------- | ------------------------------------------ |
| **North** (y < 0)       | `y = newLocation.height - 1` (bottom edge) |
| **South** (y >= height) | `y = 0` (top edge)                         |
| **West** (x < 0)        | `x = newLocation.width - 1` (right edge)   |
| **East** (x >= width)   | `x = 0` (left edge)                        |

## World Boundaries

The world is bounded - attempting to transition beyond world limits:

- Clamps entity position to current location edge
- Logs warning to console (in debug mode)
- Does NOT load new location

**Example:** 10×10 world grid

```
Valid world coordinates: (0,0) to (9,9)
Invalid transitions: x < 0, x >= 10, y < 0, y >= 10
```

## Spawn Location

**Initial Spawn:** Player spawns in `WILDERNESS` location with `FOREST` biome instead of default `DUNGEON`.

**Reason:** Wilderness locations are open, edge-accessible areas suitable for world exploration. Dungeons are closed structures with stairs, not edge transitions (to be implemented later).

**Code:** `Game.init()` in `src/ts/game.ts`

```typescript
this.world.setCurrentLocation(
  this.currentWorldPos.x,
  this.currentWorldPos.y,
  LocationType.WILDERNESS,
  BiomeType.FOREST
);
```

## Location Types

### Open Locations (Edge Transitions)

- ✅ **WILDERNESS** - Open terrain with edges leading to adjacent world tiles
- ✅ **RUINS** - Outdoor ruins with accessible edges
- 🚧 **TOWN** - City edges connecting to world (future)

### Closed Locations (Stairs Only)

- ⏳ **DUNGEON** - Uses stairs (up/down), no edge transitions (future)
- ⏳ **CAVE** - Uses stairs, isolated from world grid (future)
- ⏳ **FACTION_BASE** - Interior with entrance/exit (future)

## Memory Management

**Lazy Loading:** Locations are created on-demand when first accessed.

**Unloading:** Currently all locations remain loaded. Future enhancement: unload distant locations.

**Recommendation:** Call `world.unloadAllExceptCurrent()` after traveling far to conserve memory.

## Debug Output

When `GAME_DEBUG=true`, transitions log:

```
[Transition] Player moved east to world (6, 5), local pos (0, 25)
```

## Future Enhancements

### Stairs System (Closed Locations)

- `STAIRS_UP` / `STAIRS_DOWN` tiles
- Vertical transitions (z-levels)
- Dungeon floor progression
- Separate stair interaction system

### Transition Effects

- Fade in/out on transition
- Loading indicator for large locations
- Minimap showing world position

### Multi-Entity Transitions

- NPCs following player across edges
- Party system with coordinated transitions
- Enemy pursuit across locations

### Location Persistence

- Save entity states when leaving location
- Restore entities when returning
- Time-based changes while away (e.g., respawns)

### Performance

- Preload adjacent locations
- Unload distant locations automatically
- Limit loaded location count

## Example Usage

### Basic Movement

```typescript
// Player at (49, 25) in location (5,5)
// Moves east → x becomes 50

// locationTransitionSystem detects x >= 50
// Transitions to location (6,5)
// Position wraps to (0, 25)
```

### World Boundary

```typescript
// Player at (49, 25) in location (9,5)
// Moves east → x becomes 50

// Cannot transition to (10,5) - out of bounds
// Position clamped to (49, 25)
// Warning logged
```

### Multi-Direction

```typescript
// Player at (0, 0) in location (5,5)
// Moves northwest simultaneously

// x < 0 → transition west to (4,5)
// Then y < 0 → transition north to (4,4)
// Final position: (49, 49) in location (4,4)
```

## Testing

### Test Scenario 1: Edge Crossing

1. Spawn player in wilderness (center of world)
2. Move to right edge (x >= 50)
3. **Expected:** Transition to location (6,5), position (0, y)
4. **Verify:** Debug log shows correct transition

### Test Scenario 2: World Boundary

1. Spawn player in wilderness (9,9) - southeast corner
2. Move east or south beyond edge
3. **Expected:** Position clamped, no transition, warning logged
4. **Verify:** Player stays in (9,9)

### Test Scenario 3: Multiple Transitions

1. Move player west from (5,5) to (0,5)
2. Continue west to (0,4), (0,3), etc.
3. **Expected:** Seamless transitions across multiple locations
4. **Verify:** All transitions smooth, camera follows

### Test Scenario 4: Location Generation

1. Move to unvisited location (e.g., (6,5))
2. **Expected:** Location generates on-demand with wilderness terrain
3. **Verify:** No lag, terrain generated correctly

## Implementation Checklist

- [x] Create `locationTransitionSystem.ts`
- [x] Implement edge detection logic
- [x] Implement position wrapping
- [x] Integrate with `Game.changeLocation()`
- [x] Update `LocationComponent` on transition
- [x] Add world boundary validation
- [x] Change spawn to WILDERNESS location
- [x] Add system to game update loop
- [x] Add debug logging
- [x] Export system from `systems/index.ts`
- [x] Test edge transitions
- [x] Test world boundaries
- [x] Update version to 0.10.0
- [x] Document system

## Related Files

- `src/ts/systems/locationTransitionSystem.ts` - Core transition logic
- `src/ts/systems/playerMovementSystem.ts` - Generates movement that triggers transitions
- `src/ts/game.ts` - Game loop integration, spawn location
- `src/ts/world.ts` - World grid management, location creation
- `src/ts/location.ts` - Individual location maps
- `src/ts/locationType.ts` - Location types and biomes
- `src/ts/components/location.ts` - World position tracking

## See Also

- [QUICKSTART.md](QUICKSTART.md) - Getting started guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Overall system design
- [TURN-BASED-INPUT.md](TURN-BASED-INPUT.md) - Turn-based movement system
- [LOCATION-TYPES-BIOMES.md](LOCATION-TYPES-BIOMES.md) - Location generation system
