# Entity Location Transitions

## Overview

The location transition system allows **all entities** (players, enemies, NPCs) to move between adjacent world locations. This creates a dynamic world where entities are not confined to their spawn location.

**Version**: 0.23.0  
**System**: `locationTransitionSystem` in `src/ts/systems/locationTransitionSystem.ts`

---

## How It Works

### Architecture

```typescript
locationTransitionSystem(ecs: ECS) {
  // 1. Query all entities with position and location
  const entities = ecs.query('position', 'location');

  // 2. Filter to current active location
  if (entity not in current location) continue;

  // 3. Detect edge crossing
  const direction = detectEdgeCrossing(pos, width, height);

  // 4. Handle transition (player vs non-player)
  if (direction !== NONE) {
    const isPlayer = ecs.hasComponent(entityId, 'player');
    handleTransition(ecs, entityId, direction, game, isPlayer);
  }
}
```

### Player vs Non-Player Transitions

#### Player Transitions

When the **player** crosses a location boundary:

1. `game.changeLocation()` - Switches the active location in the world
2. `setCameraPos()` - Updates camera to follow player
3. Position wraps to opposite edge of new location
4. Location component updates with new world coordinates

#### Non-Player Transitions

When an **enemy or NPC** crosses a location boundary:

1. **NO** `game.changeLocation()` - Active location stays focused on player
2. **NO** camera update - Camera remains on player
3. Position wraps to opposite edge of new location
4. Location component updates with new world coordinates
5. Entity continues existing in the adjacent location

### Edge Detection

```typescript
enum TransitionDirection {
  NONE = 0,
  NORTH = 1, // pos.y < 0
  SOUTH = 2, // pos.y >= height
  EAST = 3, // pos.x >= width
  WEST = 4, // pos.x < 0
}

function detectEdgeCrossing(pos, width, height): TransitionDirection {
  if (pos.x < 0) return WEST;
  if (pos.x >= width) return EAST;
  if (pos.y < 0) return NORTH;
  if (pos.y >= height) return SOUTH;
  return NONE;
}
```

### Position Wrapping

When an entity crosses an edge, their position wraps to the **opposite edge** of the adjacent location:

| Direction | Position Wrapping                              |
| --------- | ---------------------------------------------- |
| **NORTH** | `pos.y = newLocation.height - 1` (bottom edge) |
| **SOUTH** | `pos.y = 0` (top edge)                         |
| **EAST**  | `pos.x = 0` (left edge)                        |
| **WEST**  | `pos.x = newLocation.width - 1` (right edge)   |

---

## Usage Examples

### Example 1: Enemy Chasing Player Across Boundary

```typescript
// AI system moves enemy toward player
aiSystem(ecs, playerId);

// Enemy reaches edge of location at (5, 10)
// Position becomes (50, 25) after moving right

// locationTransitionSystem detects:
//   - pos.x >= currentLocation.width (50 >= 50)
//   - direction = EAST
//   - isPlayer = false

// handleTransition():
//   1. Does NOT call game.changeLocation() (not player)
//   2. Does NOT update camera (not player)
//   3. Creates/loads adjacent location at (6, 10)
//   4. Wraps position: pos.x = 0 (left edge of new location)
//   5. Updates location component: worldX = 6, worldY = 10

// Enemy continues existing at new location
```

### Example 2: NPC Traveling Between Towns

```typescript
// NPC at town (3, 4) walks north repeatedly
// Eventually reaches y < 0

// locationTransitionSystem detects:
//   - pos.y < 0
//   - direction = NORTH
//   - isPlayer = false

// handleTransition():
//   1. Loads location at (3, 3)
//   2. Wraps position: pos.y = height - 1 (bottom edge)
//   3. Updates location component: worldY = 3

// NPC now exists in adjacent location
// Will be visible if player visits (3, 3)
```

### Example 3: Player and Enemy Both Transitioning

```typescript
// Scenario: Player fleeing enemy, both cross boundary

// Frame N:
locationTransitionSystem(ecs);
// 1. Player crosses NORTH boundary
//    - game.changeLocation(5, 9) - active location changes
//    - Camera follows player
//    - Player wraps to bottom edge

// 2. Enemy crosses NORTH boundary (1 frame later)
//    - Active location is now (5, 9)
//    - Enemy location is (5, 10) - not active, skipped this frame
//    - (Will transition next time (5, 10) is active)

// Frame N+1 (if player returns):
// Enemy would complete transition if location becomes active
```

---

## Important Behaviors

### Location Filtering

The system only processes entities in the **current active location**:

```typescript
// Only process entities matching active location
if (
  locationComp.worldX !== currentLocation.worldPosition.x ||
  locationComp.worldY !== currentLocation.worldPosition.y
) {
  continue;
}
```

**Why?** Prevents unnecessary processing of entities in distant locations. Entities in non-active locations are effectively "frozen" until their location becomes active.

### World Bounds Checking

If an entity tries to transition **outside the world boundaries**:

```typescript
if (!world.isInBounds(newWorldX, newWorldY)) {
  // Clamp position to current location edge
  pos.x = Math.max(0, Math.min(pos.x, currentLocation.width - 1));
  pos.y = Math.max(0, Math.min(pos.y, currentLocation.height - 1));
  return; // Prevent transition
}
```

**Effect**: Entity is "blocked" at the world edge, position clamped to prevent leaving valid map area.

### Lazy Location Loading

Adjacent locations are created on-demand:

```typescript
const newLocation = world.getOrCreateLocation(newWorldX, newWorldY);
```

- If location exists: Use cached version
- If location doesn't exist: Generate new location (with entity spawning if ECS available)
- Result: Seamless transitions without preloading entire world

---

## Debug Output

When `GAME_DEBUG=true` in `.env`:

```typescript
// Successful transition
[Transition] Player moved NORTH to world (5, 4), local pos (25, 49)
[Transition] Entity 42 moved EAST to world (6, 5), local pos (0, 30)

// Out of bounds warning
Cannot transition entity 15 to (-1, 3) - out of world bounds
```

---

## Integration with Other Systems

### AI System

```typescript
// AI system moves entities toward targets
aiSystem(ecs, playerId);

// If enemy reaches edge while chasing player:
locationTransitionSystem(ecs); // Automatically handles transition
```

### Collision System

```typescript
// Collision system prevents entities from overlapping
collisionSystem(ecs);

// If entity moves into invalid position:
// - Collision system blocks movement
// - Entity stays at edge but doesn't transition
// - locationTransitionSystem only triggers if position crosses boundary
```

### Render System

```typescript
// Render system only draws entities in current active location
renderSystem(ecs);

// Entities in other locations:
// - Components exist in ECS
// - Not rendered (location filter)
// - Will be visible when their location becomes active
```

---

## Performance Considerations

### Entity Processing

- **Filtered Query**: Only processes entities in active location
- **O(N)** complexity where N = entities in current location
- **Not** affected by total entity count in world

### Location Loading

- **Lazy Generation**: Locations created only when accessed
- **Cached Instances**: Repeated visits reuse existing location
- **Memory**: Only loaded locations consume memory

### Recommended Optimizations

```typescript
// Optional: Unload distant locations
world.unloadAllExceptCurrent();

// Optional: Limit processing to active + adjacent locations
const adjacentEntities = [
  ...ecs.queryInLocation(worldX - 1, worldY),
  ...ecs.queryInLocation(worldX + 1, worldY),
  ...ecs.queryInLocation(worldX, worldY - 1),
  ...ecs.queryInLocation(worldX, worldY + 1),
];
```

---

## Known Limitations

### 1. Non-Active Location Entities

**Issue**: Entities in non-active locations don't process transitions until their location becomes active.

**Example**:

- Enemy at (3, 3) tries to move north
- Player at (5, 5) - active location
- Enemy stuck until player visits (3, 3)

**Workaround**: Process transitions for adjacent locations if needed for gameplay.

### 2. Cross-Location Rendering

**Issue**: Entities in non-active locations are not rendered.

**Example**:

- Enemy chases player from (5, 5) to (5, 6)
- Enemy remains at (5, 5) when player transitions
- Enemy invisible until it also transitions

**Workaround**: Implement multi-location rendering if adjacent locations should be visible.

### 3. Diagonal Transitions

**Issue**: Entities can only transition to 4 cardinal directions (N/S/E/W), not diagonally.

**Example**:

- Entity at (49, 49) moves diagonally
- If pos.x >= 50 first: Transitions EAST to (0, 49) in (6, 5)
- If pos.y >= 50 first: Transitions SOUTH to (49, 0) in (5, 6)
- **Cannot** transition to (6, 6) in one frame

**Workaround**: Current design is intentional for simplicity. Diagonal transitions would require more complex logic.

---

## Testing

### Manual Test Scenarios

#### Test 1: Player Boundary Crossing

1. Start game
2. Move player to location edge
3. Continue movement
4. **Expected**: Player wraps to opposite edge of adjacent location, camera follows

#### Test 2: Enemy Chasing Across Boundary

1. Spawn enemy near location edge
2. Position player just across boundary
3. Let enemy chase player
4. **Expected**: Enemy crosses boundary, appears in adjacent location

#### Test 3: World Edge Blocking

1. Move entity to world boundary (e.g., (0, 0) going west)
2. Try to continue movement
3. **Expected**: Entity blocked at edge, position clamped

#### Test 4: Multiple Entity Transitions

1. Spawn multiple enemies at location edge
2. AI moves them all in same direction
3. **Expected**: All entities transition without errors

### Debug Commands

```typescript
// Check entity locations
for (const id of ecs.query('location')) {
  const loc = ecs.getComponent<LocationComponent>(id, 'location');
  console.log(`Entity ${id} at world (${loc.worldX}, ${loc.worldY})`);
}

// Force transition test
const testEntity = createEnemy(ecs, 49, 25); // At right edge
locationTransitionSystem(ecs); // Should transition EAST
```

---

## Future Enhancements

### Potential Improvements

1. **Adjacent Location Processing**  
   Process transitions for entities in locations adjacent to active location, allowing smoother multi-location behavior.

2. **Multi-Location Rendering**  
   Render entities from adjacent locations for seamless visual experience at boundaries.

3. **Entity Prediction**  
   Predict entity transitions before they happen, allowing preloading of adjacent locations.

4. **Cross-Location Pathfinding**  
   AI system aware of location boundaries, able to plan paths across multiple locations.

5. **Transition Events**  
   Trigger events when entities transition (for quests, triggers, etc.):

   ```typescript
   game.on('entityTransition', (entityId, fromLocation, toLocation) => {
     // Handle quest updates, spawn triggers, etc.
   });
   ```

6. **Selective Entity Freezing**  
   Allow some entities (e.g., important NPCs) to continue behavior even when in non-active locations.

---

## See Also

- **[LOCATION-TRANSITIONS.md](./LOCATION-TRANSITIONS.md)** - Player location transitions (older doc)
- **[WORLD-MAP.md](./WORLD-MAP.md)** - World structure and navigation
- **[SYSTEMS-REFERENCE.md](./SYSTEMS-REFERENCE.md#locationTransitionSystem)** - System reference
- **[ENTITY-POPULATION-SYSTEM.md](./ENTITY-POPULATION-SYSTEM.md)** - Entity spawning in locations
- **[VIEW-MODES.md](./VIEW-MODES.md)** - UI modes including location/world_map switching
