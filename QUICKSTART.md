# LittleJS Roguelike - Quick Start Guide

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd littlejs-rl

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Build and run
npm run dev
```

The game will be available at `http://localhost:8080`

## Basic Controls

- **Arrow Keys** or **WASD**: Move player
- **Numpad 1-9**: Diagonal movement
- **Space/Enter/E**: Action (interact, attack)
- **G**: Pickup items
- **U**: Use item
- **I**: Toggle inventory
- **L**: Toggle examine mode
- **[** / **]**: World map navigation
- **T**: Zoom camera
- **C**: Toggle collision overlay (debug)
- **X**: Toggle debug text

📋 **[Complete Keybindings Reference](./KEYBINDINGS-REFERENCE.md)** - Full list of all controls with alternatives

## Creating Your First Entity

```typescript
import { createPlayer, createEnemy } from './ts/entities';
import ECS from './ts/ecs';

const ecs = new ECS();

// Create player at position (10, 10) in world location (5, 5)
const playerId = createPlayer(ecs, 10, 10, 5, 5);

// Create enemy at position (20, 20) in same location
const enemyId = createEnemy(ecs, 20, 20, 5, 5);
```

## Setting Up a World

```typescript
import World from './ts/world';
import { TileType, createTile } from './ts/tile';

// Create a 10x10 world grid, each location is 50x50 tiles
const world = new World(10, 10, 50, 50);

// Set current location
world.setCurrentLocation(5, 5);
const location = world.getCurrentLocation();

// Generate procedural content
if (location) {
  location.generate();

  // Customize specific tiles
  location.setTile(25, 25, createTile(TileType.STAIRS_DOWN));
}
```

## Processing Entities with Systems

```typescript
import { inputSystem, playerMovementSystem, aiSystem } from './ts/systems';

function gameUpdate() {
  // 1. Capture player input
  inputSystem(ecs);

  // 2. Move player based on input
  playerMovementSystem(ecs);

  // 3. Process AI for NPCs and enemies
  aiSystem(ecs, playerId);
}
```

## Querying Entities

```typescript
import { getEntitiesInRadius, getEntitiesAt } from './ts/systems/spatialSystem';

// Find all entities within 10 tiles of position (25, 25)
const nearbyEntities = getEntitiesInRadius(ecs, 25, 25, 10, 5, 5);

// Find entities at specific position
const entitiesHere = getEntitiesAt(ecs, 30, 30, 5, 5);
```

## Accessing Component Data

```typescript
import { PositionComponent, HealthComponent } from './ts/components';

// Get component data
const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
const health = ecs.getComponent<HealthComponent>(entityId, 'health');

if (pos && health) {
  console.log(
    `Entity at (${pos.x}, ${pos.y}) has ${health.current}/${health.max} HP`
  );
}

// Modify component data
if (health) {
  health.current -= 10; // Take damage
}
```

## Creating Custom Entities

```typescript
import {
  PositionComponent,
  HealthComponent,
  RenderComponent,
  StatsComponent,
  AIComponent,
  MovableComponent,
  LocationComponent,
} from './ts/components';
import * as LJS from 'littlejsengine';
import { getTileCoords, TileSprite } from './ts/tileConfig';

function createCustomEnemy(
  ecs: ECS,
  x: number,
  y: number,
  worldX: number,
  worldY: number
): number {
  const entityId = ecs.createEntity();

  // Add position
  ecs.addComponent<PositionComponent>(entityId, 'position', { x, y });

  // Add location
  ecs.addComponent<LocationComponent>(entityId, 'location', { worldX, worldY });

  // Add health
  ecs.addComponent<HealthComponent>(entityId, 'health', {
    current: 75,
    max: 75,
  });

  // Add stats
  ecs.addComponent<StatsComponent>(entityId, 'stats', {
    strength: 8,
    defense: 4,
    speed: 0.8,
  });

  // Add AI
  ecs.addComponent<AIComponent>(entityId, 'ai', {
    type: 'aggressive',
    detectionRange: 12,
    state: 'idle',
  });

  // Add rendering
  const coords = getTileCoords(TileSprite.ENEMY_TROLL);
  ecs.addComponent<RenderComponent>(entityId, 'render', {
    tileInfo: new LJS.TileInfo(LJS.vec2(coords.x, coords.y)),
    color: new LJS.Color(0.8, 0.3, 0.3), // Dark red
    size: new LJS.Vector2(1, 1),
  });

  // Add movement
  ecs.addComponent<MovableComponent>(entityId, 'movable', { speed: 1 });

  return entityId;
}
```

## Working with Relationships

```typescript
import { relationSystem, getRelationScore } from './ts/systems/relationSystem';

// Initialize relationships (typically done once)
world.initializeRelations(ecs);

// Modify relationship (NPC gets friendlier toward player)
relationSystem(ecs, npcId, playerId, 15);

// Check relationship
const attitude = getRelationScore(ecs, npcId, playerId);
if (attitude !== undefined && attitude > 50) {
  console.log('NPC is friendly!');
}
```

## Debugging

Enable debug mode by editing `.env`:

```env
GAME_DEBUG=true
```

This shows:

- FPS counter
- Entity count
- Current location
- Player position
- Red overlay on non-walkable tiles

## Project Structure Quick Reference

```
src/
├── index.ts              # Entry point
├── ts/
│   ├── game.ts          # Main game singleton
│   ├── ecs.ts           # Entity Component System
│   ├── entities.ts      # Entity factory functions
│   ├── components/      # Data structures (no logic)
│   ├── systems/         # Processing logic (no data)
│   ├── world.ts         # World grid management
│   ├── location.ts      # Individual map areas
│   ├── tile.ts          # Tile types and utilities
│   └── tileConfig.ts    # Sprite definitions
└── assets/
    └── img/
        └── tileset.png  # 16x16 sprite sheet
```

## Common Tasks

### Spawn Enemy at Random Position

```typescript
const location = world.getCurrentLocation();
if (location) {
  const pos = location.findRandomWalkablePosition();
  if (pos) {
    createEnemy(
      ecs,
      pos.x,
      pos.y,
      location.worldPosition.x,
      location.worldPosition.y
    );
  }
}
```

### Check if Position is Walkable

```typescript
const location = world.getCurrentLocation();
if (location && location.isWalkable(x, y)) {
  // Safe to move here
}
```

### Move Entity

```typescript
const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
if (pos) {
  pos.x = newX;
  pos.y = newY;
}
```

### Remove Dead Entities

```typescript
const entities = ecs.query('health');
for (const id of entities) {
  const health = ecs.getComponent<HealthComponent>(id, 'health');
  if (health && health.current <= 0) {
    ecs.removeEntity(id);
  }
}
```

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation
- Check `src/ts/examples/` for more usage examples
- Browse component files to see available data structures
- Browse system files to see available processing functions

## Need Help?

- Component reference: `src/ts/components/`
- System reference: `src/ts/systems/`
- Examples: `src/ts/examples/`
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
