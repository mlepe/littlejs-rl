# Entity Population System (v0.22.0)

## Overview

The entity population system automatically spawns enemies, NPCs, and creatures in procedurally generated locations based on location type and biome. This system was implemented in version 0.22.0 to replace manual test enemy spawning with dynamic entity placement.

## Architecture

### Core Components

1. **World** - Stores ECS reference and passes it to location generation
2. **LocationGenerator** - Updated with entity spawning methods
3. **EntityRegistry** - Spawns entities from templates
4. **Spatial System** - Validates spawn positions
5. **Location** - Receives ECS from World during generation
6. **Game** - Provides ECS to World via `setECS()`

### Population Methods

Each location type has its own population method:

- `populateDungeon()` - High enemy density in rooms
- `populateTown()` - NPCs and guards in buildings
- `populateRuins()` - Medium enemy density, undead focused
- `populateFactionBase()` - Guards and faction members
- `populateWilderness()` - Scattered creatures across map
- `populateCave()` - Cave-dwelling creatures

## Entity Selection

### By Location Type

```typescript
LocationType.DUNGEON → ['orc_warrior', 'goblin_scout', 'skeleton_warrior']
LocationType.TOWN → ['friendly_villager', 'merchant', 'guard']
LocationType.RUINS → ['skeleton_warrior', 'rat', 'spider']
LocationType.FACTION_BASE → ['guard']
LocationType.WILDERNESS → ['wolf', 'bear', 'bandit']
LocationType.CAVE → ['spider', 'rat', 'slime']
```

### By Biome

Biomes add additional enemy types:

```typescript
BiomeType.SNOWY → ['ice_wolf', 'frost_giant', 'yeti']
BiomeType.SWAMP → ['slime', 'spider']
BiomeType.MOUNTAIN → ['troll_brute']
```

## Spawn Density

| Location Type | Density                      | Spawn Pattern                      |
| ------------- | ---------------------------- | ---------------------------------- |
| Dungeon       | High (2-4 per room)          | Skip first room (player spawn)     |
| Town          | Low (1-2 NPCs per building)  | NPCs only, no enemies              |
| Ruins         | Medium (1-3 per room)        | Undead and creatures               |
| Faction Base  | Medium (1-2 guards per room) | Guards only                        |
| Wilderness    | Low (~10-15 scattered)       | Random placement across map        |
| Cave          | Medium (~15-25 scattered)    | Random placement in walkable areas |

## Implementation Details

### Spawn Validation

Each spawn attempt validates:

1. **Walkability** - Position must be walkable terrain
2. **Occupancy** - No existing entity at position
3. **Location Bounds** - Position within location dimensions

```typescript
// Validation check (simplified)
if (location.isWalkable(x, y)) {
  const occupied = ecs
    .query('position', 'location')
    .some((id) => positionMatches(id, x, y, worldX, worldY));

  if (!occupied) {
    registry.spawn(ecs, enemyType, x, y, worldX, worldY);
  }
}
```

### Room-Based Spawning

Dungeons, towns, ruins, and faction bases use rooms for strategic placement:

```typescript
// Spawn in room interior (avoid edges)
const x = Math.floor(room.x + 2 + Math.random() * (room.width - 4));
const y = Math.floor(room.y + 2 + Math.random() * (room.height - 4));
```

### Scattered Spawning

Wilderness and caves use random scattered placement:

```typescript
// Random position anywhere in location
const x = Math.floor(Math.random() * location.width);
const y = Math.floor(Math.random() * location.height);
```

## Integration

### World ECS Integration

```typescript
// Game passes ECS to World
this.world.setECS(this.ecs);

// World automatically passes ECS to locations during generation
location.generate(this.ecs || undefined);
```

### Location Generation

```typescript
// Location.generate() accepts optional ECS parameter (provided by World)
location.generate(ecs);

// LocationGenerator uses ECS for spawning
LocationGenerator.generate(location, ecs);
```

### Game Initialization

```typescript
// game.ts - World handles ECS distribution automatically
this.world.setECS(this.ecs);
startLocation.generate(); // World passes ECS automatically
```

## Configuration

### Adding New Enemy Types

1. Create entity template in `src/data/base/entities/`
2. Add to `getEnemyTypes()` location type mapping
3. Optionally add to biome-specific enemies

Example:

```typescript
const baseEnemies: { [key in LocationType]: string[] } = {
  [LocationType.DUNGEON]: [
    'orc_warrior',
    'goblin_scout',
    'skeleton_warrior',
    'YOUR_NEW_ENEMY',
  ],
  // ...
};
```

### Adjusting Spawn Density

Modify population methods:

```typescript
// Increase dungeon enemy count
const enemyCount = Math.floor(3 + Math.random() * 4); // Was 2-4, now 3-6
```

### Adding New Population Logic

Create new population method:

```typescript
private static populateYourLocationType(
  location: Location,
  ecs: ECS,
  rooms: Room[]
): void {
  const enemyTypes = this.getEnemyTypes(LocationType.YOUR_TYPE, location.metadata.biomeConfig.id);
  // Your custom spawn logic
}
```

## Benefits

1. **Dynamic Content** - Every location has appropriate enemies/NPCs
2. **Biome Integration** - Enemy types match environment
3. **Strategic Placement** - Enemies placed intelligently in rooms
4. **Balanced Density** - Each location type has appropriate challenge level
5. **Modular Design** - Easy to add new enemy types or location behaviors

## Future Enhancements

- **Loot Placement** - Spawn items/chests with enemies
- **Boss Spawning** - Guaranteed boss in last dungeon room
- **NPC Schedules** - Town NPCs follow daily routines
- **Enemy Patrols** - Guards follow patrol paths
- **Difficulty Scaling** - Increase enemy count/strength with depth
- **Faction-Specific Enemies** - Faction bases spawn faction-aligned enemies
- **Biome-Specific Behaviors** - Enemies behave differently per biome

## Debugging

Enable debug mode to visualize entity spawning:

```typescript
// In .env
GAME_DEBUG = true;
```

Debug info shows:

- Entity count per location
- Spawn positions
- Failed spawn attempts
- Location type and biome

## See Also

- **[DATA-SYSTEM.md](./DATA-SYSTEM.md)** - Entity template system
- **[SYSTEMS-REFERENCE.md](./SYSTEMS-REFERENCE.md)** - Spatial system documentation
- **[LOCATION-TYPES-BIOMES.md](./LOCATION-TYPES-BIOMES.md)** - Location and biome configuration
