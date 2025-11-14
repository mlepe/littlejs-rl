# Data-Driven Content System

This document explains how to use the data-driven content system for creating and modifying game content without changing code.

## Overview

The data system allows you to define game entities, items, tiles, and other content in JSON files. This makes it easy to:

- **Add new content** without touching code
- **Balance the game** by editing numbers in data files
- **Enable modding** by allowing users to add their own data files
- **Version control friendly** - data changes are clear diffs
- **Designer-friendly** - non-programmers can edit content

## Directory Structure

```
src/
├── data/
│   ├── base/                    # Core game content
│   │   ├── entities/
│   │   │   ├── enemies.json    # Enemy definitions
│   │   │   ├── npcs.json       # NPC definitions
│   │   │   └── player.json     # Player templates (future)
│   │   ├── items/              # Item definitions (future)
│   │   ├── tiles/              # Tile definitions (future)
│   │   ├── biomes/             # Biome definitions (future)
│   │   └── stats/
│   │       └── balance.json    # Game balance configuration
│   └── mods/                   # User mods (future)
│       └── example-mod/
│           ├── mod.json        # Mod metadata
│           └── data/           # Mod data files
├── ts/
│   ├── data/
│   │   ├── dataLoader.ts       # Main data loading system
│   │   ├── entityRegistry.ts   # Entity spawning from templates
│   │   ├── itemRegistry.ts     # Item creation (future)
│   │   └── tileRegistry.ts     # Tile registration (future)
│   └── types/
│       └── dataSchemas.ts      # TypeScript interfaces
```

## Using the System

### 1. Loading Data (Automatic)

The data system loads automatically when you initialize the game:

```typescript
import Game from './ts/game';

const game = Game.getInstance();
await game.init(); // Data loads here
```

The `DataLoader` singleton handles loading all data files from `src/data/base/`.

### 2. Spawning Entities from Data

Use the `EntityRegistry` to spawn entities defined in data files:

```typescript
import { EntityRegistry } from './ts/data/entityRegistry';
import { ECS } from './ts/ecs';

const ecs = new ECS();
const registry = EntityRegistry.getInstance();

// Spawn an orc warrior at position (10, 15)
const orcId = registry.spawn(ecs, 'orc_warrior', 10, 15, 0, 0);

// Spawn a friendly villager
const villagerId = registry.spawn(ecs, 'friendly_villager', 20, 20, 0, 0);
```

### 3. Querying Available Entities

```typescript
// Get all entity IDs
const allIds = registry.getAllIds();

// Get a specific template
const orcTemplate = registry.get('orc_warrior');
console.log(orcTemplate?.name); // "Orc Warrior"

// Get entities by type
const enemies = registry.getByType('enemy');
const npcs = registry.getByType('npc');

// Check if template exists
if (registry.has('troll_brute')) {
  // Spawn it
}
```

## Entity Data Format

Entities are defined in JSON files under `src/data/base/entities/`:

### Basic Structure

```json
{
  "entities": [
    {
      "id": "unique_identifier",
      "name": "Display Name",
      "description": "Optional description",
      "type": "enemy",

      "health": {
        "max": 50,
        "current": 50
      },

      "stats": {
        "strength": 8,
        "defense": 5,
        "speed": 1.0
      },

      "ai": {
        "type": "aggressive",
        "detectionRange": 10
      },

      "render": {
        "sprite": "ENEMY_ORC",
        "color": "#00ff00"
      },

      "relation": {
        "baseScore": -50,
        "minScore": -100,
        "maxScore": 0
      }
    }
  ]
}
```

### Field Reference

#### Required Fields

- **`id`** (string): Unique identifier for this entity template
- **`name`** (string): Display name shown to player
- **`type`** (string): Entity category - `"player"`, `"enemy"`, `"npc"`, `"creature"`, or `"boss"`
- **`render`** (object): Visual representation
  - **`sprite`** (string): TileSprite enum name (e.g., `"ENEMY_ORC"`)
  - **`color`** (string, optional): Hex color (e.g., `"#ff0000"`)

#### Optional Fields

- **`description`** (string): Flavor text or gameplay information
- **`health`** (object): Hit points
  - **`max`** (number): Maximum HP
  - **`current`** (number, optional): Starting HP (defaults to max)
  - **`regen`** (number, optional): HP regeneration per turn
- **`stats`** (object): Combat statistics
  - **`strength`** (number): Attack power
  - **`defense`** (number): Damage reduction
  - **`speed`** (number): Movement speed multiplier
- **`ai`** (object): AI behavior (only for NPCs/enemies)
  - **`type`** (string): `"passive"`, `"aggressive"`, `"patrol"`, or `"fleeing"`
  - **`detectionRange`** (number): How far the entity can detect the player
- **`relation`** (object): Relationship system
  - **`baseScore`** (number, optional): Starting relationship value (default: 0)
  - **`minScore`** (number, optional): Minimum possible relationship (default: -100)
  - **`maxScore`** (number, optional): Maximum possible relationship (default: 100)

## Examples

### Example 1: Creating a New Enemy

Add to `src/data/base/entities/enemies.json`:

```json
{
  "id": "dragon_whelp",
  "name": "Dragon Whelp",
  "description": "A young dragon, still dangerous despite its size.",
  "type": "enemy",

  "health": {
    "max": 80,
    "regen": 2
  },

  "stats": {
    "strength": 12,
    "defense": 8,
    "speed": 1.2
  },

  "ai": {
    "type": "aggressive",
    "detectionRange": 15
  },

  "render": {
    "sprite": "ENEMY_DRAGON",
    "color": "#ff4400"
  },

  "relation": {
    "baseScore": -80,
    "minScore": -100,
    "maxScore": -50
  }
}
```

### Example 2: Creating a Friendly NPC

Add to `src/data/base/entities/npcs.json`:

```json
{
  "id": "quest_giver",
  "name": "Village Elder",
  "description": "The wise elder of the village, always has tasks for adventurers.",
  "type": "npc",

  "health": {
    "max": 40
  },

  "stats": {
    "strength": 2,
    "defense": 1,
    "speed": 0.8
  },

  "ai": {
    "type": "passive",
    "detectionRange": 5
  },

  "render": {
    "sprite": "NPC_ELDER",
    "color": "#cccccc"
  },

  "relation": {
    "baseScore": 50,
    "minScore": 0,
    "maxScore": 100
  }
}
```

### Example 3: Spawning from Code

```typescript
import { EntityRegistry } from './ts/data/entityRegistry';
import Location from './ts/location';

function spawnEncounter(
  ecs: ECS,
  location: Location,
  centerX: number,
  centerY: number
): void {
  const registry = EntityRegistry.getInstance();

  // Spawn a boss enemy
  const bossId = registry.spawn(ecs, 'dragon_whelp', centerX, centerY, 0, 0);
  if (bossId !== null) {
    location.addEntity(centerX, centerY, bossId);
  }

  // Spawn minions around the boss
  const positions = [
    [centerX - 2, centerY],
    [centerX + 2, centerY],
    [centerX, centerY - 2],
    [centerX, centerY + 2],
  ];

  for (const [x, y] of positions) {
    if (location.isWalkable(x, y)) {
      const minionId = registry.spawn(ecs, 'goblin_scout', x, y, 0, 0);
      if (minionId !== null) {
        location.addEntity(x, y, minionId);
      }
    }
  }
}
```

## Balance Configuration

The `src/data/base/stats/balance.json` file contains global game balance settings:

```json
{
  "player": {
    "health": 100,
    "strength": 10,
    "defense": 5,
    "speed": 1.0
  },

  "combat": {
    "baseDamageMultiplier": 1.0,
    "defenseReduction": 0.1,
    "criticalChance": 0.05,
    "criticalMultiplier": 2.0
  },

  "progression": {
    "xpPerLevel": 100,
    "levelScaling": 1.5,
    "statsPerLevel": {
      "strength": 2,
      "defense": 1,
      "health": 10
    }
  }
}
```

This file can be loaded and used for game mechanics (implementation pending).

## Tips for Content Creators

### Balancing Enemies

- **Early game**: 20-40 HP, 3-6 strength, 1-3 defense
- **Mid game**: 50-80 HP, 8-12 strength, 5-8 defense
- **Late game**: 100+ HP, 15+ strength, 10+ defense
- **Speed**: 0.5-2.0 (player is 1.0)

### AI Types

- **`passive`**: Wanders around, doesn't attack unless provoked
- **`aggressive`**: Chases and attacks player on sight
- **`fleeing`**: Runs away from player
- **`patrol`**: Follows a patrol route (implementation pending)

### Relationship Scores

- **-100 to -50**: Hostile, will attack on sight
- **-50 to 0**: Unfriendly, may become hostile
- **0 to 50**: Neutral, can become friendly or hostile
- **50 to 100**: Friendly, may offer help or items

### Color Coding

Use hex colors to distinguish entity types:

- **Enemies**: Red/orange tones (`#ff0000`, `#ff6600`)
- **NPCs**: Blue/purple tones (`#4444ff`, `#aa44ff`)
- **Neutral creatures**: Green/yellow tones (`#00ff00`, `#ffff00`)

## Future Features

### Planned Additions

- **Item system** with `ItemRegistry`
- **Tile definitions** with `TileRegistry`
- **Biome generation** with `BiomeRegistry`
- **Mod loading** from `src/data/mods/`
- **Hot reloading** for development
- **Validation** with detailed error messages
- **Schema documentation** for modders

### Modding Support (Future)

Mods will be placed in `src/data/mods/your-mod-name/`:

```
src/data/mods/my-custom-enemies/
├── mod.json              # Mod metadata
└── data/
    ├── entities/
    │   └── custom-enemies.json
    └── items/
        └── custom-weapons.json
```

The `mod.json` format:

```json
{
  "id": "my-custom-enemies",
  "name": "Custom Enemy Pack",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "Adds 10 new enemy types to the game",
  "data": [
    "data/entities/custom-enemies.json",
    "data/items/custom-weapons.json"
  ],
  "dependencies": []
}
```

## Troubleshooting

### Entity Not Spawning

**Check:**

1. Is the entity ID correct? Use `registry.getAllIds()` to list available IDs
2. Is the sprite name valid? Check `src/ts/tileConfig.ts` for valid sprite names
3. Is the position walkable? Use `location.isWalkable(x, y)` to verify
4. Check the console for error messages from `EntityRegistry`

### Data Not Loading

**Check:**

1. Is the JSON file valid? Use a JSON validator
2. Is the file path correct in `dataLoader.ts`?
3. Does the file have an `"entities"` array at the root?
4. Check the console for `[DataLoader]` and `[EntityRegistry]` messages

### Wrong Sprite or Color

**Check:**

1. Sprite name matches a value in the `TileSprite` enum
2. Color is a valid hex code (`#rrggbb` or `#rrggbbaa`)
3. Check the console for warnings about unknown sprites

## API Reference

See `src/ts/examples/dataUsageExample.ts` for comprehensive code examples.

### EntityRegistry Methods

- **`getInstance()`**: Get the singleton registry
- **`spawn(ecs, templateId, x, y, worldX, worldY)`**: Create entity from template
- **`get(id)`**: Get a template by ID
- **`has(id)`**: Check if template exists
- **`getAllIds()`**: Get all template IDs
- **`getAll()`**: Get all templates
- **`getByType(type)`**: Get templates of a specific type
- **`register(template)`**: Manually register a template
- **`clear()`**: Clear all templates

### DataLoader Methods

- **`getInstance()`**: Get the singleton loader
- **`loadAllData()`**: Load all game data (async)
- **`reload()`**: Reload all data (async, for development)
- **`isLoaded()`**: Check if data has been loaded
- **`isLoading()`**: Check if data is currently loading
