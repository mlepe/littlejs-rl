# ECS-First Architecture for World & Location System

## Summary of Changes

The Location and World classes have been refactored to follow **ECS-first principles**, where the ECS system is the **single source of truth** for entity data.

## What Changed

### 1. **Removed Entity Tracking from Tiles**

**Before:**
```typescript
interface Tile {
  // ... other properties
  entities: number[]; // ❌ Redundant storage
}
```

**After:**
```typescript
interface Tile {
  // Only terrain data, no entity tracking
  type: TileType;
  walkable: boolean;
  transparent: boolean;
  spriteIndex: number;
  color: LJS.Color;
}
```

### 2. **Removed Entity Methods from Location**

**Removed Methods:**
- `addEntity()` - No longer needed
- `addEntityWorld()` - No longer needed
- `removeEntity()` - No longer needed
- `moveEntity()` - No longer needed
- `getEntitiesAt()` - Use `spatialSystem` instead
- `getEntitiesAtWorld()` - Use `spatialSystem` instead

**Added Methods:**
- `getTileType()` - Convenience method to get tile type
- `getCenter()` - Get center position of location
- `findRandomWalkablePosition()` - For spawning entities

### 3. **Added LocationComponent**

New ECS component to track which world location an entity belongs to:

```typescript
interface LocationComponent {
  worldX: number; // World grid X coordinate
  worldY: number; // World grid Y coordinate
}
```

### 4. **Created Spatial Query System**

New system (`spatialSystem.ts`) that provides spatial queries using ECS as source of truth:

- `getEntitiesAt(ecs, x, y, worldX?, worldY?)` - Get entities at tile position
- `getEntitiesInRadius(ecs, x, y, radius, worldX?, worldY?)` - Get entities in radius
- `getEntitiesInLocation(ecs, worldX, worldY)` - Get all entities in location
- `isPositionOccupied(ecs, x, y, worldX?, worldY?)` - Check if position has entity
- `getNearestEntity(ecs, x, y, maxDist?, worldX?, worldY?)` - Find nearest entity
- `hasLineOfSight(ecs, from, to, checkTileTransparency)` - Raycasting for LOS

### 5. **Updated Entity Factories**

All entity factory functions now require location coordinates:

```typescript
// Before
createPlayer(ecs, x, y)

// After
createPlayer(ecs, x, y, worldX, worldY)
```

## Why This is Better

### ✅ Single Source of Truth
- Entity positions are **only** stored in ECS `PositionComponent`
- No synchronization bugs between tile storage and ECS

### ✅ No Manual Synchronization
- Don't need to call `addEntity()` / `removeEntity()` when moving
- Just update the `PositionComponent` directly

### ✅ Better Performance
- Spatial queries can be optimized in one place
- No duplicate entity tracking in tiles

### ✅ More Flexible
- Can query entities across multiple locations
- Easy to implement proximity checks, FOV, pathfinding

### ✅ ECS Principles
- Location/World handle **terrain data only**
- ECS handles **entity data and behavior**
- Clear separation of concerns

## Migration Guide

### Old Way (Tile-based entity tracking):

```typescript
// ❌ Don't do this anymore
const playerId = ecs.createEntity();
location.addEntity(25, 25, playerId);

// Move entity
location.moveEntity(25, 25, 26, 25, playerId);

// Get entities at position
const entities = location.getEntitiesAt(25, 25);
```

### New Way (ECS-first):

```typescript
import { getEntitiesAt, isPositionOccupied } from './systems/spatialSystem';

// ✅ Create entity with LocationComponent
const playerId = createPlayer(ecs, 25, 25, worldX, worldY);

// ✅ Move entity (just update ECS)
const pos = ecs.getComponent<PositionComponent>(playerId, 'position');
if (pos && location.isWalkable(26, 25)) {
  pos.x = 26;
  pos.y = 25;
}

// ✅ Get entities at position
const entities = getEntitiesAt(ecs, 25, 25, worldX, worldY);

// ✅ Check if position is occupied
if (!isPositionOccupied(ecs, 26, 25, worldX, worldY)) {
  // Position is free
}
```

### Changing Locations:

```typescript
// Update entity's location component
const playerLoc = ecs.getComponent<LocationComponent>(playerId, 'location');
const playerPos = ecs.getComponent<PositionComponent>(playerId, 'position');

if (playerLoc && playerPos) {
  // Change location
  playerLoc.worldX = 6;
  playerLoc.worldY = 5;
  
  // Reset position in new location
  playerPos.x = 25;
  playerPos.y = 25;
  
  // Update world
  world.setCurrentLocation(6, 5);
}
```

### Rendering Only Current Location:

```typescript
function render() {
  const location = world.getCurrentLocation();
  if (!location) return;

  // Render tiles
  location.render();

  // Get entities in current location only
  const worldX = location.worldPosition.x;
  const worldY = location.worldPosition.y;
  const visibleEntities = getEntitiesInLocation(ecs, worldX, worldY);

  // Render each entity
  for (const entityId of visibleEntities) {
    const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
    // Render entity at pos.x, pos.y
  }
}
```

## Best Practices

1. **Always add LocationComponent** to entities that exist in the world
2. **Use spatial query functions** instead of storing entities in tiles
3. **Update PositionComponent directly** when moving entities
4. **Update LocationComponent** when changing locations
5. **Query by location** to render only visible entities
6. **Use `findRandomWalkablePosition()`** for spawning

## Files Modified

- ✅ `src/ts/location.ts` - Removed entity tracking methods
- ✅ `src/ts/tile.ts` - Removed `entities` property
- ✅ `src/ts/components/locationComponent.ts` - New component (created)
- ✅ `src/ts/systems/spatialSystem.ts` - Spatial query system (created)
- ✅ `src/ts/entities.ts` - Updated all factory functions with location params
- ✅ `src/ts/components/index.ts` - Export LocationComponent
- ✅ `src/ts/systems/index.ts` - Export spatial system functions

## Next Steps

You'll need to update:
- `src/ts/game.ts` - Update player creation and entity queries
- Any code using old `location.addEntity()` / `getEntitiesAt()` methods
- Rendering systems to use `getEntitiesInLocation()`
