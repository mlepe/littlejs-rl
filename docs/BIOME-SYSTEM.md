# Biome System

## Overview

The biome system provides a comprehensive framework for creating diverse, visually distinct environments in the game world. It separates location structure (dungeon, town, cave) from visual appearance (forest, desert, volcanic), enabling rich environmental variety and gameplay depth.

## Architecture

### Core Components

1. **biomeConfig.ts** - Central biome configuration system
2. **environmentMetadata.ts** - Unified environment system combining location types with biomes
3. **Environmental Components & Systems** - Entity-level environmental effects
4. **Biome Transition System** - Smooth transitions between adjacent biomes
5. **Spawn Tables** - Biome-specific entity and item spawning

### File Structure

```
src/ts/
├── biomeConfig.ts              # Core biome definitions and tile mappings
├── environmentMetadata.ts      # Environment metadata management
├── biomeSpawnTables.ts        # Spawn weight tables per biome
├── components/
│   └── environmental.ts       # Environmental resistance component
├── systems/
│   ├── environmentalSystem.ts      # Apply biome effects to entities
│   └── biomeTransitionSystem.ts    # Handle biome transitions
└── locationType.ts            # Location structural types (refactored)
```

## Biome Types

### Available Biomes

| Biome       | Temperature | Humidity | Description                           |
| ----------- | ----------- | -------- | ------------------------------------- |
| DEFAULT     | MODERATE    | MODERATE | Fallback biome with standard tiles    |
| FOREST      | MODERATE    | HUMID    | Lush forests with grass and trees     |
| MOUNTAIN    | COLD        | DRY      | Rocky mountains with stone and gravel |
| SNOWY       | FREEZING    | WET      | Snow-covered terrain with ice         |
| TUNDRA      | FREEZING    | ARID     | Frozen wasteland with permafrost      |
| BARREN      | HOT         | ARID     | Desolate rocky terrain                |
| DESERT      | SCORCHING   | ARID     | Sandy dunes and sandstone             |
| BEACH       | WARM        | MODERATE | Sandy shores near water               |
| WATER       | MODERATE    | WET      | Open water and aquatic terrain        |
| VOLCANIC    | SCORCHING   | DRY      | Lava flows and volcanic rock          |
| SWAMP       | WARM        | WET      | Murky swamps with mud                 |
| JUNGLE      | HOT         | WET      | Dense tropical vegetation             |
| UNDERGROUND | MODERATE    | MODERATE | Cave systems and underground areas    |
| CORRUPTED   | MODERATE    | MODERATE | Twisted, corrupted landscape          |

### Biome Properties

Each biome has:

- **Tile Mappings** - Floor/wall tile variants with selection weights
- **Tint Color** - Visual overlay color (applied at 30% opacity)
- **Temperature** - Affects cold/fire resistance
- **Humidity** - Environmental characteristic
- **Weather** - Supported weather types (prepared for future implementation)
- **Spawn Weights** - Entity/item spawn probabilities

## Usage

### Creating Locations with Biomes

```typescript
import { BiomeType } from './biomeConfig';
import { LocationType } from './locationType';
import Location from './location';

// Create a snowy dungeon
const location = new Location(
  LJS.vec2(5, 5),
  50,
  50,
  'Frozen Depths',
  LocationType.DUNGEON,
  BiomeType.SNOWY
);
location.generate(); // Uses snowy tile variants
```

### Using Environment Metadata

```typescript
import { createEnvironmentMetadata, BiomeType } from './environmentMetadata';

// Create complete environment
const env = createEnvironmentMetadata(
  LocationType.CAVE,
  BiomeType.VOLCANIC,
  'Lava Caverns',
  8 // Difficulty level
);

console.log(env.name); // "Lava Caverns"
console.log(env.temperature); // Temperature.SCORCHING
console.log(env.effectiveDanger); // Combined danger rating
```

### Biome Tile Selection

The system automatically selects appropriate tiles during location generation:

```typescript
import {
  getBiomeConfig,
  getRandomFloorTile,
  getRandomWallTile,
} from './biomeConfig';

const biomeConfig = getBiomeConfig(BiomeType.DESERT);

// Get random tile variants
const floorTile = getRandomFloorTile(biomeConfig); // TileType.FLOOR_SAND_*
const wallTile = getRandomWallTile(biomeConfig); // TileType.WALL_SANDSTONE_*
```

### Environmental Effects

Apply temperature-based resistance modifiers to entities:

```typescript
import { environmentalSystem } from './systems/environmentalSystem';
import { EnvironmentalComponent } from './components/environmental';

// Add environmental component to entity
ecs.addComponent<EnvironmentalComponent>(entityId, 'environmental', {
  baseFireResistance: 0,
  baseColdResistance: 0,
  currentFireResistance: 0,
  currentColdResistance: 0,
  visibilityModifier: 1.0,
  lightLevel: 1.0,
});

// Apply biome effects (in game loop)
const location = world.getCurrentLocation();
environmentalSystem(ecs, location);

// In SCORCHING biomes: -20 cold resistance, +10 fire resistance
// In FREEZING biomes: -20 fire resistance, +10 cold resistance
```

### Biome Transitions

Create smooth transitions between adjacent biomes:

```typescript
import {
  calculateTransitionFactor,
  getTransitionTile,
  createTransitionZone,
} from './systems/biomeTransitionSystem';

// Calculate blend factor at edge
const factor = calculateTransitionFactor(
  x,
  y,
  location.width,
  location.height,
  'linear' // or 'smooth', 'sharp'
);

// Get blended tile
const tile = getTransitionTile(
  BiomeType.FOREST,
  BiomeType.DESERT,
  factor,
  true // isFloor
);

// Create transition zone
const zone = createTransitionZone(
  BiomeType.FOREST,
  BiomeType.DESERT,
  'north',
  location.width,
  location.height
);
```

### Spawn Tables

Query biome-specific spawn probabilities:

```typescript
import {
  getBiomeSpawnTable,
  selectRandomEntity,
  selectRandomItem,
} from './biomeSpawnTables';

const spawnTable = getBiomeSpawnTable(BiomeType.VOLCANIC);

// Select random entity based on difficulty
const entityType = selectRandomEntity(
  spawnTable.entities,
  8 // Difficulty level
);

// Select random item
const itemType = selectRandomItem(
  spawnTable.items,
  5 // Difficulty level
);
```

## Biome Configuration Structure

### BiomeConfig Interface

```typescript
interface BiomeConfig {
  name: string;
  tint: LJS.Color;

  // Tile mappings with selection weights
  floorTiles: Array<{ tile: TileType; weight: number }>;
  wallTiles: Array<{ tile: TileType; weight: number }>;

  // Environmental properties
  temperature: Temperature;
  humidity: Humidity;

  // Weather support (future)
  weather: {
    common: WeatherType[];
    rare: WeatherType[];
  };
}
```

### Temperature Enum

```typescript
enum Temperature {
  FREEZING, // < -10°C
  COLD, // -10°C to 10°C
  MODERATE, // 10°C to 25°C
  WARM, // 25°C to 35°C
  HOT, // 35°C to 45°C
  SCORCHING, // > 45°C
}
```

### Humidity Enum

```typescript
enum Humidity {
  ARID, // < 20% humidity
  DRY, // 20-40%
  MODERATE, // 40-60%
  HUMID, // 60-80%
  WET, // > 80%
}
```

## Location Type vs Biome

### Location Types (Structure)

Define **HOW** a location is structured:

- DUNGEON - Rooms and corridors with monsters
- TOWN - Buildings with NPCs and shops
- RUINS - Broken structures with treasure
- FACTION_BASE - Organized layout with guards
- WILDERNESS - Natural terrain with sparse features
- CAVE - Organic tunnels and chambers

### Biomes (Appearance)

Define **WHAT** a location looks like:

- Visual tiles (floor/wall variants)
- Color tinting
- Environmental effects
- Weather conditions
- Entity/item spawning

### Combination Examples

| Location Type | Biome       | Result                                  |
| ------------- | ----------- | --------------------------------------- |
| DUNGEON       | SNOWY       | Ice dungeon with frozen corridors       |
| DUNGEON       | VOLCANIC    | Lava-filled dungeon with obsidian walls |
| TOWN          | DESERT      | Desert town with sandstone buildings    |
| TOWN          | SNOWY       | Winter village with icy streets         |
| CAVE          | FOREST      | Forest cave with moss and roots         |
| CAVE          | UNDERGROUND | Deep underground caverns                |
| WILDERNESS    | SWAMP       | Murky swampland                         |
| WILDERNESS    | JUNGLE      | Dense tropical jungle                   |

## Tile Mapping System

### Tile Selection Weights

Each biome defines weighted tile variants:

```typescript
// Example: SNOWY biome floor tiles
floorTiles: [
  { tile: TileType.FLOOR_SNOW_PACKED, weight: 50 },
  { tile: TileType.FLOOR_SNOW_FRESH, weight: 30 },
  { tile: TileType.FLOOR_ICE, weight: 15 },
  { tile: TileType.FLOOR_SNOW_DEEP, weight: 5 },
];
```

Higher weight = more frequent selection.

### Random Selection Algorithm

```typescript
function getRandomFloorTile(config: BiomeConfig): TileType {
  const totalWeight = config.floorTiles.reduce((sum, t) => sum + t.weight, 0);
  let random = Math.random() * totalWeight;

  for (const tile of config.floorTiles) {
    random -= tile.weight;
    if (random <= 0) return tile.tile;
  }

  return config.floorTiles[0].tile; // Fallback
}
```

### Fallback to DEFAULT Biome

If a tile type is not defined for a biome, the system falls back to the DEFAULT biome:

```typescript
const config = getBiomeConfig(biome);
if (config.floorTiles.length === 0) {
  // Use DEFAULT biome tiles
  const defaultConfig = getBiomeConfig(BiomeType.DEFAULT);
  return getRandomFloorTile(defaultConfig);
}
```

## Environmental System

### Resistance Modifiers

Temperature affects elemental resistances:

| Temperature | Cold Resistance | Fire Resistance |
| ----------- | --------------- | --------------- |
| FREEZING    | +10             | -20             |
| COLD        | +5              | -10             |
| MODERATE    | 0               | 0               |
| WARM        | -5              | +5              |
| HOT         | -10             | +10             |
| SCORCHING   | -20             | +10             |

### Visibility Effects

Some biomes modify visibility range:

- SWAMP: Reduced visibility (x0.7)
- JUNGLE: Reduced visibility (x0.8)
- UNDERGROUND: Reduced visibility (x0.6)
- VOLCANIC: Haze reduces visibility (x0.8)

### Light Levels

Environmental light affects entity behavior:

- UNDERGROUND: Dim (0.3)
- CAVE: Low (0.5)
- Most biomes: Normal (1.0)

## Biome Transition System

### Transition Curves

Three transition curve types:

1. **Linear** - Constant rate: `factor = distance / maxDistance`
2. **Smooth** - Ease in/out: `factor = (1 - cos(π * distance / maxDistance)) / 2`
3. **Sharp** - Delayed then rapid: `factor = distance^2 / maxDistance^2`

### Edge Detection

```typescript
function getEdgeTransitionInfo(
  x: number,
  y: number,
  width: number,
  height: number,
  transitionWidth: number = 5
): { edge: 'north' | 'south' | 'east' | 'west' | null; distance: number };
```

### Transition Zones

Define regions where two biomes blend:

```typescript
interface BiomeTransitionZone {
  biome1: BiomeType;
  biome2: BiomeType;
  edge: 'north' | 'south' | 'east' | 'west';
  width: number; // Transition width in tiles
  curve: 'linear' | 'smooth' | 'sharp';
}
```

## Spawn Table System

### Spawn Weight Structure

```typescript
interface SpawnWeightEntry {
  type: string;
  weight: number;
  minDifficulty?: number;
  maxDifficulty?: number;
}

interface BiomeSpawnTable {
  biome: BiomeType;
  entities: SpawnWeightEntry[];
  items: SpawnWeightEntry[];
}
```

### Difficulty Filtering

Entities/items spawn only within their difficulty range:

```typescript
function selectRandomEntity(
  entries: SpawnWeightEntry[],
  difficultyLevel: number
): string | null {
  // Filter by difficulty
  const validEntries = entries.filter(
    (e) =>
      (!e.minDifficulty || difficultyLevel >= e.minDifficulty) &&
      (!e.maxDifficulty || difficultyLevel <= e.maxDifficulty)
  );

  // Select by weight
  // ...
}
```

### Default Spawn Tables

All biomes have default spawn tables. Examples:

**FOREST:**

- Entities: goblin (40), deer (30), wolf (20), bear (10)
- Items: wooden_sword (30), leather_armor (25), healing_herb (35)

**VOLCANIC:**

- Entities: fire_elemental (40), salamander (30), lava_worm (20)
- Items: fire_resistant_armor (35), obsidian_blade (20), fire_potion (25)

**UNDERGROUND:**

- Entities: cave_bat (35), giant_spider (30), dark_elf (20), troglodyte (15)
- Items: mining_pick (20), torch (40), underground_mushroom (30)

## Integration with Game Systems

### Location Generation

`LocationGenerator` automatically uses biome tiles:

```typescript
class LocationGenerator {
  static generate(location: Location): void {
    const biomeConfig = getBiomeConfig(location.metadata.biome);

    // All tile placement uses biome-specific tiles
    const floorTile = getRandomFloorTile(biomeConfig);
    const wallTile = getRandomWallTile(biomeConfig);

    location.setTileType(x, y, floorTile);
  }
}
```

### World Map Display

World map tiles use biome tint colors:

```typescript
class WorldMap {
  private updateTileLayer(x: number, y: number): void {
    const tile = this.getTile(x, y);
    const biomeConfig = getBiomeConfig(tile.biome);
    const color = biomeConfig.tint;

    // Apply alpha based on discovery state
    // ...
  }
}
```

### Game Loop Integration

```typescript
function gameUpdate() {
  // ... other systems ...

  // Apply environmental effects
  const location = world.getCurrentLocation();
  environmentalSystem(ecs, location);

  // ... other systems ...
}
```

## Best Practices

### DO:

✅ Use `createEnvironmentMetadata()` for new locations
✅ Let `LocationGenerator` handle tile selection automatically
✅ Use biome spawn tables for entity/item placement
✅ Apply environmental effects via `environmentalSystem()`
✅ Create transition zones at location edges for smooth blending

### DON'T:

❌ Don't hardcode tile types in generation code
❌ Don't mix location structure concerns with biome visuals
❌ Don't bypass biome spawn tables for random spawning
❌ Don't forget to add `EnvironmentalComponent` to entities that should be affected

## Future Enhancements

### Weather System (Phase 3)

- Implement actual weather effects using `BiomeWeather` configuration
- Weather influences temperature and visibility
- Dynamic weather changes over time

### Biome-Specific Hazards (Phase 4)

- Quicksand in deserts
- Ice patches in snowy biomes
- Lava flows in volcanic biomes
- Poisonous plants in jungles

### JSON Data Loading (Phase 5)

- Load custom biome configurations from JSON files
- Mod support for user-created biomes
- Hot-reload biome changes during development

## Troubleshooting

### Tiles Not Using Biome Colors

- Check if `Location` was created with correct `BiomeType`
- Verify `location.metadata.biome` is set correctly
- Ensure `LocationGenerator.generate()` is called after creation

### Environmental Effects Not Applying

- Verify entity has `EnvironmentalComponent`
- Check `environmentalSystem()` is called in game loop
- Ensure location has valid biome configuration

### Spawn Table Not Working

- Verify difficulty level is within entity's min/max range
- Check spawn table has entries for the biome
- Ensure weights are positive numbers

### Transition Artifacts

- Reduce transition width for sharper edges
- Use 'smooth' curve for gradual blending
- Check edge detection logic for correct boundaries

## API Reference

See individual file documentation for detailed API:

- `biomeConfig.ts` - Biome definitions and tile selection
- `environmentMetadata.ts` - Environment metadata management
- `biomeSpawnTables.ts` - Spawn weight tables
- `systems/environmentalSystem.ts` - Environmental effects
- `systems/biomeTransitionSystem.ts` - Transition algorithms

## Version History

- **v0.14.0** - Initial biome system implementation (Phase 1)
- **v0.15.0** - LocationGenerator integration (Phase 2)
- **v0.16.0** - Weather system (Phase 3)
- **TBD** - Biome hazards (Phase 4, planned)
- **TBD** - JSON data loading (Phase 5, planned)
