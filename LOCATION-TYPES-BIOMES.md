# Location Types and Biomes System

This document explains the location type and biome system for procedurally generating diverse game areas with different structures and environmental themes.

## Overview

The game supports two independent customization systems for locations:

1. **Location Types** - Define the structural layout and purpose of a location
2. **Biomes** - Define the environmental theme and visual appearance

These can be combined freely to create diverse locations (e.g., "Snowy Town", "Desert Dungeon", "Forest Ruins").

## Location Types

Location types determine how a location is structured and what purpose it serves.

### Available Location Types

| Type           | Description                               | Features                                                            |
| -------------- | ----------------------------------------- | ------------------------------------------------------------------- |
| `DUNGEON`      | Standard dungeon with rooms and corridors | Random rooms, connecting corridors, stairs, doors, high danger      |
| `TOWN`         | Town with buildings and streets           | Organized buildings, streets, NPCs, shops, low danger               |
| `RUINS`        | Ancient ruins with broken structures      | Broken walls, vegetation overgrowth, treasure, moderate danger      |
| `FACTION_BASE` | Organized military/faction base           | Symmetrical layout, organized rooms, guards, perimeter walls        |
| `WILDERNESS`   | Natural outdoor area                      | Vegetation, water features, scattered rocks, low structure          |
| `CAVE`         | Natural cave system                       | Organic tunnels (cellular automata), water pools, connected caverns |

### Location Type Properties

Each location type has specific generation properties:

```typescript
interface LocationTypeProperties {
  name: string; // Display name
  roomDensity: number; // 0-1, density of rooms
  corridorDensity: number; // 0-1, density of corridors/paths
  organized: boolean; // Whether layout is organized or chaotic
  hasNPCs: boolean; // Typically contains friendly NPCs
  hasShops: boolean; // Contains merchant NPCs
  dangerMultiplier: number; // Danger level multiplier
}
```

## Biomes

Biomes define the environmental theme and visual appearance through color palettes.

### Available Biomes

| Biome      | Theme            | Colors                                                |
| ---------- | ---------------- | ----------------------------------------------------- |
| `FOREST`   | Temperate forest | Dark greens, browns, light greens                     |
| `MOUNTAIN` | Rocky mountains  | Grays, dark grays, light grays, mountain stream blues |
| `SNOWY`    | Snowy tundra     | Whites, pale blues, icy blues                         |
| `BARREN`   | Barren wasteland | Browns, dark browns, sparse vegetation                |
| `DESERT`   | Sandy desert     | Yellows, sandstone, light sand, oasis water           |
| `BEACH`    | Coastal beach    | Light sand, rocks, pale sand, ocean blue              |
| `WATER`    | Water body       | Deep blues, underwater rocks, aquatic themes          |
| `VOLCANIC` | Volcanic area    | Dark volcanic rock, obsidian, lava orange, fire       |
| `SWAMP`    | Murky swamp      | Muddy greens/browns, murky water, moss                |

### Biome Palettes

Each biome provides a color palette:

```typescript
interface BiomePalette {
  floor: Color; // Primary floor/ground color
  wall: Color; // Primary wall/boundary color
  accent: Color; // Accent color for special tiles
  water?: Color; // Water color (if applicable)
  vegetation?: Color; // Vegetation color (if applicable)
}
```

## Usage Examples

### Basic Usage

```typescript
import World from './ts/world';
import { LocationType, BiomeType } from './ts/locationType';

// Create world
const world = new World(10, 10, 50, 50);

// Create a snowy dungeon
world.setCurrentLocation(5, 5, LocationType.DUNGEON, BiomeType.SNOWY);

// Create a desert town
world.setCurrentLocation(6, 6, LocationType.TOWN, BiomeType.DESERT);

// Create forest ruins
world.setCurrentLocation(7, 7, LocationType.RUINS, BiomeType.FOREST);

// Create volcanic cave
world.setCurrentLocation(8, 8, LocationType.CAVE, BiomeType.VOLCANIC);
```

### Creating Custom Locations

```typescript
import Location from './ts/location';
import { LocationType, BiomeType } from './ts/locationType';
import * as LJS from 'littlejsengine';

// Create a specific location manually
const location = new Location(
  LJS.vec2(10, 10), // World position
  50, // Width in tiles
  50, // Height in tiles
  'Ancient Temple', // Custom name
  LocationType.RUINS, // Location type
  BiomeType.DESERT // Biome
);

// Generate the location layout
location.generate();
```

### Accessing Location Metadata

```typescript
// Get current location
const location = world.getCurrentLocation();

if (location) {
  // Access metadata
  console.log(location.metadata.locationType); // LocationType.DUNGEON
  console.log(location.metadata.biome); // BiomeType.SNOWY
  console.log(location.metadata.properties); // Generation properties
  console.log(location.metadata.palette); // Color palette

  // Check location features
  if (location.metadata.properties.hasShops) {
    // Spawn merchant NPCs
  }

  if (location.metadata.properties.organized) {
    // Different AI pathfinding behavior
  }

  // Use biome colors for rendering
  const floorColor = location.metadata.palette.floor;
  const wallColor = location.metadata.palette.wall;
}
```

### Procedural World Generation

```typescript
import { LocationType, BiomeType } from './ts/locationType';

// Generate diverse world with different location types
function generateWorld(world: World) {
  for (let x = 0; x < world.width; x++) {
    for (let y = 0; y < world.height; y++) {
      // Determine location type based on position
      let locationType: LocationType;
      let biome: BiomeType;

      // Towns near center
      if (x === 5 && y === 5) {
        locationType = LocationType.TOWN;
        biome = BiomeType.FOREST;
      }
      // Mountains at high Y values
      else if (y < 3) {
        locationType = LocationType.CAVE;
        biome = BiomeType.MOUNTAIN;
      }
      // Desert at high X values
      else if (x > 7) {
        locationType = LocationType.WILDERNESS;
        biome = BiomeType.DESERT;
      }
      // Snowy at low Y values
      else if (y > 7) {
        locationType = LocationType.WILDERNESS;
        biome = BiomeType.SNOWY;
      }
      // Default: dungeons in temperate forest
      else {
        locationType = LocationType.DUNGEON;
        biome = BiomeType.FOREST;
      }

      // Location will be created on-demand when accessed
      // world.setCurrentLocation(x, y, locationType, biome);
    }
  }
}
```

### Biome-Based Gameplay

```typescript
// Example: Adjust gameplay based on biome
const location = world.getCurrentLocation();

if (location) {
  switch (location.metadata.biome) {
    case BiomeType.SNOWY:
      // Apply cold weather effects
      // Spawn ice enemies
      break;

    case BiomeType.VOLCANIC:
      // Apply heat damage
      // Spawn fire elementals
      break;

    case BiomeType.SWAMP:
      // Apply poison/disease mechanics
      // Spawn swamp creatures
      break;

    case BiomeType.WATER:
      // Require swimming
      // Spawn aquatic enemies
      break;
  }
}
```

## Generation Algorithms

### Dungeon Generation

- Fills location with walls
- Generates 5-10 random rooms (3-8 tiles wide/tall)
- Connects rooms with L-shaped corridors
- Adds stairs (up in first room, down in last room)
- Adds doors to some rooms (30% chance)

### Town Generation

- Fills with floor (streets)
- Generates 8-15 rectangular buildings
- Creates walls around buildings
- Adds doors to most buildings (80% chance)
- Adds vegetation decoration (10% density)

### Ruins Generation

- Fills with floor
- Generates 4-8 rooms with broken walls (40% of walls removed)
- Adds heavy vegetation overgrowth (30% density)
- Adds water in collapsed areas (10% density)

### Faction Base Generation

- Creates outer perimeter wall
- Generates organized 3x3 grid of rooms (center is courtyard)
- Adds walls around each room
- Adds doors to most rooms (90% chance)
- Adds main entrance gate

### Wilderness Generation

- Fills with floor
- Adds heavy vegetation (50% density)
- Adds water features (20% density)
- Adds scattered rocky areas (10% density)

### Cave Generation

- Uses cellular automata algorithm
- Initial random density: 45%
- Runs 4 iterations
- Ensures all floor tiles are connected via flood fill
- Adds water pools (5% density)

## Extending the System

### Adding New Location Types

1. Add enum value to `LocationType` in `locationType.ts`
2. Add properties in `getLocationTypeProperties()`
3. Add generation algorithm in `LocationGenerator` class
4. Update switch statement in `LocationGenerator.generate()`

### Adding New Biomes

1. Add enum value to `BiomeType` in `locationType.ts`
2. Add color palette in `getBiomePalette()`
3. Consider adding new tile types if needed

### Custom Generation

You can override the default generation by directly calling `LocationGenerator` methods:

```typescript
import { LocationGenerator } from './ts/locationGenerator';

// Generate location manually
const location = new Location(/* ... */);
// Don't call location.generate()

// Use custom generation logic
// Access private methods via reflection or create public variants
// Or modify LocationGenerator to expose more methods
```

## Integration with Game Systems

### Entity Spawning

Use location metadata to determine appropriate entities:

```typescript
function spawnEntities(location: Location, ecs: ECS) {
  const metadata = location.metadata;

  // Spawn based on location type
  if (metadata.properties.hasNPCs) {
    // Spawn friendly NPCs
    createNPC(ecs, x, y);
  }

  if (metadata.properties.hasShops) {
    // Spawn merchants
    createMerchant(ecs, x, y);
  }

  // Spawn based on danger level
  const enemyCount = metadata.properties.dangerMultiplier * 10;
  for (let i = 0; i < enemyCount; i++) {
    const pos = location.findRandomWalkablePosition();
    if (pos) {
      createEnemy(ecs, pos.x, pos.y);
    }
  }

  // Spawn based on biome
  switch (metadata.biome) {
    case BiomeType.SNOWY:
      createIceElemental(ecs, x, y);
      break;
    case BiomeType.VOLCANIC:
      createFireElemental(ecs, x, y);
      break;
    // ... etc
  }
}
```

### Quest System Integration

```typescript
function generateQuest(location: Location): Quest {
  const type = location.metadata.locationType;

  switch (type) {
    case LocationType.DUNGEON:
      return { type: 'CLEAR_DUNGEON', location };
    case LocationType.TOWN:
      return { type: 'DELIVER_ITEM', location };
    case LocationType.RUINS:
      return { type: 'FIND_ARTIFACT', location };
    case LocationType.FACTION_BASE:
      return { type: 'INFILTRATE', location };
  }
}
```

## Performance Considerations

- Locations are lazily generated (only when first accessed)
- Use `world.unloadAllExceptCurrent()` to manage memory
- Generation is deterministic (can use seed for reproducibility)
- Large worlds (>100x100 locations) may need streaming/chunking

## Future Enhancements

Potential additions to the system:

- **Sub-biomes**: Variants within biomes (e.g., "Burnt Forest", "Frozen Lake")
- **Weather effects**: Dynamic weather influencing gameplay
- **Time of day**: Different generation for day/night
- **Difficulty tiers**: Generate harder variants of location types
- **Themed dungeons**: Special themed dungeons (fire temple, ice castle)
- **Multi-level locations**: Locations with multiple Z-levels
- **Persistent modifications**: Track player changes to locations
- **Seed-based generation**: Reproducible worlds from seeds
