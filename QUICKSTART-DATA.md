# Quick Start: Data-Driven Entities

This guide shows you how to quickly add new entities to your game using the data system.

## Adding a New Entity in 3 Minutes

### Step 1: Edit the JSON File

Open `src/data/base/entities/characters.json` and add your entity:

```json
{
  "id": "shadow_beast",
  "name": "Shadow Beast",
  "description": "A creature of living darkness that stalks its prey.",
  "type": "creature",

  "health": {
    "max": 65
  },

  "stats": {
    "strength": 10,
    "defense": 4,
    "speed": 1.3
  },

  "ai": {
    "disposition": "aggressive",
    "detectionRange": 12
  },

  "render": {
    "sprite": "ENEMY_GHOST",
    "color": "#220044"
  },

  "relation": {
    "baseScore": -60,
    "minScore": -100,
    "maxScore": -10
  }
}
```

### Step 2: Use It In Your Code

```typescript
import { EntityRegistry } from './ts/data/entityRegistry';

// In your level generation or spawn function:
const registry = EntityRegistry.getInstance();
const beastId = registry.spawn(ecs, 'shadow_beast', x, y, worldX, worldY);

if (beastId !== null) {
  location.addEntity(x, y, beastId);
}
```

### Step 3: Done!

That's it! Your new enemy will:

- ✅ Have health, stats, AI, and rendering
- ✅ Work with all existing systems (movement, combat, AI)
- ✅ Appear in the game world
- ✅ Be modifiable without recompiling

## Finding Valid Sprite Names

Valid sprite names are in `src/ts/tileConfig.ts`, look for the `TileSprite` enum:

### Common Enemy Sprites

- `ENEMY_GOBLIN`, `ENEMY_ORC`, `ENEMY_KOBOLD`
- `ENEMY_SKELETON`, `ENEMY_ZOMBIE`, `ENEMY_GHOST`
- `ENEMY_TROLL`, `ENEMY_OGRE`, `ENEMY_MINOTAUR`
- `ENEMY_DRAGON`, `ENEMY_DEMON`, `ENEMY_IMP`

### NPC Sprites

- `NPC_MERCHANT`, `NPC_GUARD`, `NPC_NOBLE`, `NPC_PEASANT`
- `NPC_WIZARD`, `NPC_PRIEST`
- `PLAYER_BARD` (for minstrel characters)

## Entity Dispositions Explained

See `DISPOSITION-SYSTEM.md` for comprehensive guide.

**Quick Reference:**

- **`peaceful`**: Never attacks (friendly NPCs, children)
- **`neutral`**: Attacks if relation < -20 (merchants, wildlife)
- **`defensive`**: Attacks if relation < -40 (guards, protectors)
- **`aggressive`**: Attacks if relation < 0 (bandits, orcs)
- **`hostile`**: Attacks unless relation > 10 (undead, demons)
- **`patrol`**: Patrols and attacks if relation < -10 (sentries)
- **`fleeing`**: Never attacks, always runs (goblins, prey animals)

## Color Guide

Colors are hex codes (`#RRGGBB`):

- **Red enemies**: `#ff0000` (hostile, dangerous)
- **Green**: `#00ff00` (neutral, weak)
- **Blue**: `#0044ff` (magic, NPCs)
- **Purple**: `#8800ff` (rare, powerful)
- **Gray**: `#808080` (stone, undead)
- **Yellow**: `#ffff00` (treasure, merchants)

## Balancing Tips

### Enemy Difficulty Tiers

**Tier 1 - Early Game (Levels 1-3)**

- Health: 20-40
- Strength: 3-6
- Defense: 1-3
- Speed: 0.8-1.2

**Tier 2 - Mid Game (Levels 4-7)**

- Health: 50-80
- Strength: 8-12
- Defense: 5-8
- Speed: 0.9-1.4

**Tier 3 - Late Game (Levels 8+)**

- Health: 100+
- Strength: 15+
- Defense: 10+
- Speed: 1.0-1.5

### NPC Relationships

- **Friendly NPCs**: baseScore: 20-50
- **Neutral NPCs**: baseScore: 0
- **Distrustful NPCs**: baseScore: -10 to -30
- **Hostile Enemies**: baseScore: -50 to -100

## Common Patterns

### Boss Enemy

```json
{
  "id": "dungeon_lord",
  "name": "Dungeon Lord",
  "type": "boss",
  "health": { "max": 200 },
  "stats": { "strength": 20, "defense": 12, "speed": 1.0 },
  "ai": { "type": "aggressive", "detectionRange": 20 },
  "render": { "sprite": "ENEMY_DEMON", "color": "#ff0000" },
  "relation": { "baseScore": -100, "minScore": -100, "maxScore": -100 }
}
```

### Friendly Quest Giver

```json
{
  "id": "quest_giver",
  "name": "Village Elder",
  "type": "npc",
  "health": { "max": 50 },
  "stats": { "strength": 2, "defense": 1, "speed": 0.8 },
  "ai": { "type": "passive", "detectionRange": 5 },
  "render": { "sprite": "NPC_WIZARD", "color": "#aaaaff" },
  "relation": { "baseScore": 50, "minScore": 0, "maxScore": 100 }
}
```

### Fast Scouting Enemy

```json
{
  "id": "scout",
  "name": "Enemy Scout",
  "type": "enemy",
  "health": { "max": 30 },
  "stats": { "strength": 5, "defense": 2, "speed": 1.8 },
  "ai": { "type": "fleeing", "detectionRange": 15 },
  "render": { "sprite": "ENEMY_KOBOLD", "color": "#ffaa00" },
  "relation": { "baseScore": -40, "minScore": -100, "maxScore": 20 }
}
```

## Spawning Patterns

### Random Enemy in Area

```typescript
function spawnRandomEnemy(
  ecs: ECS,
  location: Location,
  worldX: number,
  worldY: number
) {
  const registry = EntityRegistry.getInstance();
  const enemies = registry.getByType('enemy');

  for (let i = 0; i < 10; i++) {
    const x = Math.floor(Math.random() * location.width);
    const y = Math.floor(Math.random() * location.height);

    if (location.isWalkable(x, y)) {
      const template = enemies[Math.floor(Math.random() * enemies.length)];
      const id = registry.spawn(ecs, template.id, x, y, worldX, worldY);

      if (id !== null) {
        location.addEntity(x, y, id);
      }
    }
  }
}
```

### Boss with Minions

```typescript
function spawnBossEncounter(
  ecs: ECS,
  location: Location,
  centerX: number,
  centerY: number,
  worldX: number,
  worldY: number
) {
  const registry = EntityRegistry.getInstance();

  // Spawn boss in center
  const bossId = registry.spawn(
    ecs,
    'dungeon_lord',
    centerX,
    centerY,
    worldX,
    worldY
  );
  if (bossId !== null) {
    location.addEntity(centerX, centerY, bossId);
  }

  // Spawn 4 minions in circle
  const radius = 3;
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const x = Math.floor(centerX + Math.cos(angle) * radius);
    const y = Math.floor(centerY + Math.sin(angle) * radius);

    if (location.isWalkable(x, y)) {
      const minionId = registry.spawn(
        ecs,
        'goblin_scout',
        x,
        y,
        worldX,
        worldY
      );
      if (minionId !== null) {
        location.addEntity(x, y, minionId);
      }
    }
  }
}
```

## Next Steps

- **Read** `DATA-SYSTEM.md` for complete documentation
- **Check** `src/ts/examples/dataUsageExample.ts` for more code examples
- **Explore** `src/data/base/entities/` for existing entity definitions
- **Experiment** with different stats and AI types
- **Balance** your game by editing JSON values

## Troubleshooting

**Entity not spawning?**

- Check the sprite name exists in `TileSprite` enum
- Verify the JSON syntax is valid
- Check the console for error messages

**Wrong appearance?**

- Verify sprite name matches TileSprite enum
- Check color is valid hex (#RRGGBB format)

**AI not working?**

- Ensure AI type is one of: passive, aggressive, fleeing, patrol
- Set detectionRange appropriate for the entity (5-20 typical)

---

**That's it!** You can now add unlimited entities to your game just by editing JSON files. No code changes required!
