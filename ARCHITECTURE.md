# LittleJS Roguelike - Architecture Documentation

## Overview

This is a roguelike game built with the LittleJS engine and TypeScript. The codebase follows an **Entity Component System (ECS)** architecture for game logic while integrating with LittleJS's rendering and physics systems.

## Core Architecture

### Entity Component System (ECS)

The game uses a pure ECS architecture where:

- **Entities** are simple numeric IDs that group related components
- **Components** are pure data structures (interfaces) with no behavior
- **Systems** are pure functions that process entities with specific components

**Key Principle:** Components hold data, systems hold logic.

```typescript
// Create entity
const playerId = ecs.createEntity();

// Add components (data only)
ecs.addComponent<PositionComponent>(playerId, 'position', { x: 10, y: 20 });
ecs.addComponent<HealthComponent>(playerId, 'health', { current: 100, max: 100 });

// Query entities with specific components
const entities = ecs.query('position', 'health');

// Process entities (in a system function)
for (const id of entities) {
  const pos = ecs.getComponent<PositionComponent>(id, 'position');
  const health = ecs.getComponent<HealthComponent>(id, 'health');
  // ... system logic ...
}
```

### World and Location Management

The game world is organized in a grid of locations:

- **World**: Grid of locations (e.g., 10x10 locations)
- **Location**: Individual map area with tiles (e.g., 50x50 tiles each)
- **Tiles**: Floor, walls, doors, etc.

**Important:** Locations store ONLY tile data, NOT entity data. Entity positions are stored in the ECS using `PositionComponent` and `LocationComponent`.

```typescript
// Create world
const world = new World(10, 10, 50, 50); // 10x10 locations, 50x50 tiles each

// Set current location
world.setCurrentLocation(5, 5);
const location = world.getCurrentLocation();

// Generate tiles
location.generate();

// Entities are stored in ECS, not in Location
const playerId = createPlayer(ecs, 25, 25, 5, 5); // x, y, worldX, worldY
```

## Directory Structure

```
src/
├── index.ts                 # Entry point, LittleJS initialization
├── ts/
│   ├── game.ts             # Game singleton (orchestrates ECS + World)
│   ├── ecs.ts              # ECS implementation
│   ├── world.ts            # World management (grid of locations)
│   ├── location.ts         # Location (tile map)
│   ├── tile.ts             # Tile types and utilities
│   ├── tileConfig.ts       # Sprite indices and tileset config
│   ├── global.ts           # Global constants
│   ├── entities.ts         # Entity factory functions
│   ├── components/         # ECS components (data only)
│   │   ├── position.ts
│   │   ├── health.ts
│   │   ├── render.ts
│   │   ├── movable.ts
│   │   ├── ai.ts
│   │   ├── stats.ts
│   │   ├── player.ts
│   │   ├── input.ts
│   │   ├── locationComponent.ts
│   │   └── relation.ts
│   ├── systems/            # ECS systems (logic)
│   │   ├── renderSystem.ts
│   │   ├── movementSystem.ts
│   │   ├── aiSystem.ts
│   │   ├── inputSystem.ts
│   │   ├── playerMovementSystem.ts
│   │   ├── spatialSystem.ts
│   │   └── relationSystem.ts
│   └── examples/           # Usage examples
│       ├── worldExample.ts
│       ├── ecsWorldExample.ts
│       └── gameUsage.ts
└── assets/
    └── img/
        └── tileset.png     # 16x16 tile sprite sheet
```

## Component Reference

### Core Components

- **PositionComponent**: `{ x: number, y: number }` - Entity position in tile coordinates
- **HealthComponent**: `{ current: number, max: number }` - Health points
- **RenderComponent**: `{ tileInfo, color, size }` - Visual rendering data
- **MovableComponent**: `{ speed: number }` - Movement capability

### Character Components

- **StatsComponent**: `{ strength, defense, speed }` - Combat and movement stats
- **PlayerComponent**: `{ isPlayer: true }` - Tag for player entities
- **InputComponent**: `{ moveX, moveY, action }` - Input state

### AI Components

- **AIComponent**: `{ type, detectionRange, state, target? }` - AI behavior
  - Types: `passive`, `aggressive`, `patrol`, `fleeing`
  - States: `idle`, `pursuing`, `attacking`, `fleeing`
- **LocationComponent**: `{ worldX, worldY }` - Which location entity is in
- **RelationComponent**: `{ relations: Map<entityId, RelationData> }` - Relationships with other entities

## System Reference

### Core Systems

- **renderSystem(ecs)**: Renders all entities with position + render components
- **movementSystem(ecs, dx, dy)**: Generic movement (rarely used, mainly for testing)

### Player Systems

- **inputSystem(ecs)**: Captures keyboard input → InputComponent
- **playerMovementSystem(ecs)**: Moves player based on InputComponent

### AI Systems

- **aiSystem(ecs, playerId)**: Processes AI behaviors for NPCs/enemies

### Spatial Systems

- **getEntitiesAt(ecs, x, y, worldX?, worldY?)**: Get entities at position
- **getEntitiesInRadius(ecs, x, y, radius, worldX?, worldY?)**: Get nearby entities
- **getEntitiesInLocation(ecs, worldX, worldY)**: Get all entities in location
- **isPositionOccupied(ecs, x, y, worldX?, worldY?)**: Check if position has entity
- **getNearestEntity(ecs, x, y, maxDist?, worldX?, worldY?)**: Find nearest entity

### Relation Systems

- **relationSystem(ecs, entityId, targetId, scoreDelta)**: Update relationship score
- **getRelationScore(ecs, entityId, targetId)**: Query relationship score

## Game Loop

The main game loop follows this order:

```typescript
function gameUpdate() {
  // 1. Capture input
  inputSystem(ecs);
  
  // 2. Process player movement
  playerMovementSystem(ecs);
  
  // 3. Process AI
  aiSystem(ecs, playerId);
  
  // 4. Update camera
  updateCamera();
}

function gameRender() {
  // 1. Render location tiles
  location.render();
  
  // 2. Render all entities
  renderSystem(ecs);
}
```

## Entity Factory Pattern

Use factory functions from `entities.ts` to create consistent entities:

```typescript
// Create player
const playerId = createPlayer(ecs, x, y, worldX, worldY);

// Create enemy
const enemyId = createEnemy(ecs, x, y, worldX, worldY);

// Create NPC
const npcId = createNPC(ecs, x, y, worldX, worldY);

// Create fleeing creature
const creatureId = createFleeingCreature(ecs, x, y, worldX, worldY);

// Create boss
const bossId = createBoss(ecs, x, y, worldX, worldY);
```

All factories ensure entities have the correct components for their role.

## Integration with LittleJS

### Rendering

- Uses `LJS.TileLayer` for tile rendering
- Uses `LJS.TileCollisionLayer` for collision detection
- Creates temporary `LJS.EngineObject` instances for entity rendering

### Input

- Uses `LJS.keyIsDown()` and `LJS.keyWasPressed()` for keyboard input
- Supports arrow keys and WASD

### Types

- `LJS.Vector2` for positions and sizes
- `LJS.Color` for colors and tinting
- `LJS.TileInfo` for sprite data

## Best Practices

1. **Store entities in ECS, not in Location**: Use `PositionComponent` + `LocationComponent`
2. **Use factory functions**: Create entities with `createPlayer()`, `createEnemy()`, etc.
3. **Process systems in order**: Input → Player → AI → Other
4. **Use spatial queries**: `getEntitiesAt()`, `getEntitiesInRadius()` for entity searches
5. **Keep components pure data**: No methods, just properties
6. **Keep systems pure functions**: Accept ECS, return void or results
7. **Use `location.isWalkable(x, y)`**: Check before moving entities

## Common Patterns

### Spawning Enemies

```typescript
const location = world.getCurrentLocation();
if (location) {
  const spawnPos = location.findRandomWalkablePosition();
  if (spawnPos) {
    const enemyId = createEnemy(
      ecs,
      spawnPos.x,
      spawnPos.y,
      location.worldPosition.x,
      location.worldPosition.y
    );
  }
}
```

### Moving an Entity

```typescript
const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
const location = world.getCurrentLocation();

if (pos && location && location.isWalkable(newX, newY)) {
  pos.x = newX;
  pos.y = newY;
}
```

### Changing Locations

```typescript
const playerPos = ecs.getComponent<PositionComponent>(playerId, 'position');
const playerLoc = ecs.getComponent<LocationComponent>(playerId, 'location');

if (playerPos && playerLoc) {
  // Update location component
  playerLoc.worldX = newWorldX;
  playerLoc.worldY = newWorldY;
  
  // Reset position in new location
  playerPos.x = spawnX;
  playerPos.y = spawnY;
  
  // Update world
  world.setCurrentLocation(newWorldX, newWorldY);
}
```

### Checking Relationships

```typescript
const npcAttitude = getRelationScore(ecs, npcId, playerId);
if (npcAttitude !== undefined) {
  if (npcAttitude > 50) {
    // NPC is friendly
  } else if (npcAttitude < -20) {
    // NPC is hostile
  }
}
```

## Debugging

Enable debug mode in `.env`:

```env
GAME_DEBUG=true
```

This displays:
- FPS counter
- Current location name
- Player position
- Entity count
- Loaded location count
- Collision overlay (red squares on solid tiles)

## Building and Running

```bash
# Install dependencies
npm install

# Build
npm run build

# Development server with live reload
npm run serve

# Build + serve
npm run dev
```

## Further Reading

- See `src/ts/examples/` for usage examples
- See component files for data structure details
- See system files for processing logic
- See `README.md` for getting started guide
