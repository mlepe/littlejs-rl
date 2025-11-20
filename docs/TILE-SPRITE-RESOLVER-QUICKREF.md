# Tile Sprite Resolver - Quick Reference

## Usage

### Import

```typescript
import { resolveTileInfo } from './tileConfig';
// or
import {
  resolveTileSprite,
  resolveTileSpriteCoords,
  resolveTileInfo,
  setTilesetConfiguration,
} from './tileConfig';
```

### Resolve Sprite to TileInfo (Most Common)

```typescript
// Get ready-to-use TileInfo for rendering
const tileInfo = resolveTileInfo('PLAYER_WARRIOR');

// Use in render component
ecs.addComponent<RenderComponent>(entityId, 'render', {
  tileInfo: resolveTileInfo('ENEMY_GOBLIN'),
  color: getColor(BaseColor.WHITE),
  size: LJS.vec2(1, 1),
});
```

### Resolve Sprite to Index

```typescript
// Get sprite index number
const index = resolveTileSprite('PLAYER_WARRIOR'); // Returns 24 in default config
```

### Resolve Sprite to Coordinates

```typescript
// Get {x, y} grid coordinates
const coords = resolveTileSpriteCoords('PLAYER_WARRIOR'); // { x: 24, y: 0 }
```

### Switch Tileset at Runtime

```typescript
// Change active configuration
setTilesetConfiguration('pixel-art');

// All subsequent resolutions use new config
const tileInfo = resolveTileInfo('PLAYER_WARRIOR'); // Now uses pixel-art mapping
```

## Resolution Order

1. **Active Configuration** - Checks current tileset config mappings
2. **AutoTileSprite Enum** - Falls back to default sprite enum
3. **Error** - Throws if sprite not found in either

## Available Sprite Names

Use any sprite name from:

- **JSON Configuration** - Names defined in active tileset config
- **AutoTileSprite Enum** - All enum values (PLAYER_WARRIOR, ENEMY_GOBLIN, etc.)

Example sprite names:

- Characters: `PLAYER_WARRIOR`, `ENEMY_GOBLIN`, `NPC_MERCHANT`, `BOSS_DRAGON_RED`
- Terrain: `FLOOR_STONE`, `WALL_STONE`, `DOOR_CLOSED_WOOD`, `WATER_DEEP`
- Items: `SWORD_SHORT`, `POTION_RED`, `CHEST_CLOSED`, `COIN_GOLD`
- Effects: `EFFECT_FIRE`, `PROJECTILE_FIREBALL`, `ICON_HEART_FULL`

## Entity Factory Pattern

```typescript
export function createEnemy(ecs: ECS, x: number, y: number): number {
  const enemyId = ecs.createEntity();

  // Position, health, stats...

  // Render component using resolver
  ecs.addComponent<RenderComponent>(enemyId, 'render', {
    tileInfo: resolveTileInfo('ENEMY_GOBLIN'),
    color: getColor(BaseColor.WHITE),
    size: LJS.vec2(1, 1),
  });

  return enemyId;
}
```

## Creating Custom Tilesets

### 1. Create JSON Config

**`src/data/base/tilesets/my-theme.json`:**

```json
{
  "id": "my-theme",
  "name": "My Custom Theme",
  "image": "tileset.png",
  "tileSize": 16,
  "gridWidth": 48,
  "mappings": {
    "PLAYER_WARRIOR": 100,
    "ENEMY_GOBLIN": 550,
    "NPC_MERCHANT": 500
  }
}
```

### 2. Auto-Loading

Config automatically loads on game init via `DataLoader`.

### 3. Activate

```typescript
setTilesetConfiguration('my-theme');
```

### 4. Fallback

Any sprites not in config fall back to `AutoTileSprite` enum values.

## Direct API Access

```typescript
import { getTileSpriteResolver } from './tileConfig';

const resolver = getTileSpriteResolver();

// Check if sprite exists
if (resolver.hasSprite('PLAYER_WARRIOR')) {
  const tileInfo = resolver.resolveToTileInfo('PLAYER_WARRIOR');
}

// Get current config
const configId = resolver.getCurrentConfigurationId(); // 'default'
const configName = resolver.getCurrentConfigurationName(); // 'Default Tileset'

// Get all available configs
const configs = resolver.getAvailableConfigurations(); // ['default', 'pixel-art']
```

## Tips

### ✅ Do

- Use `resolveTileInfo()` for entity creation
- Use string sprite names matching enum or config
- Create tileset configs for themes/mods
- Use fallback to `AutoTileSprite` for robustness

### ❌ Don't

- Don't create `TileInfo` manually with `getTileCoords()`
- Don't import `getTileCoords()` for entity sprites
- Don't hardcode sprite indices
- Don't bypass resolver for customizable sprites

### Exception: Static Mappings

Direct `AutoTileSprite` usage is OK for:

- Biome tiles (static game design)
- UI elements (always same)
- Performance-critical constant mappings

## Common Patterns

### Dynamic Enemy Types

```typescript
const enemyTypes = ['ENEMY_GOBLIN', 'ENEMY_ORC', 'ENEMY_TROLL'];
const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
const tileInfo = resolveTileInfo(randomType);
```

### Theme Switching Menu

```typescript
function changeTheme(themeId: string) {
  setTilesetConfiguration(themeId);

  // Recreate visible entities to use new sprites
  recreateEntities();
}
```

### Validating Custom Sprites

```typescript
import { getTileSpriteResolver } from './tileConfig';

function isValidSprite(name: string): boolean {
  return getTileSpriteResolver().hasSprite(name);
}

// Usage
if (isValidSprite('CUSTOM_SPRITE')) {
  const tileInfo = resolveTileInfo('CUSTOM_SPRITE');
}
```

## Migration from Old Code

### Before (Old Pattern)

```typescript
import { SPRITE_ENEMY, getTileCoords } from './tileConfig';

const coords = getTileCoords(SPRITE_ENEMY);
const tileInfo = new LJS.TileInfo(
  LJS.vec2(coords.x * 16, coords.y * 16),
  LJS.vec2(16, 16),
  0
);
```

### After (New Pattern)

```typescript
import { resolveTileInfo } from './tileConfig';

const tileInfo = resolveTileInfo('ENEMY_GOBLIN');
```

## See Also

- **[TILE-SPRITE-RESOLVER-MIGRATION.md](./TILE-SPRITE-RESOLVER-MIGRATION.md)** - Complete migration documentation
- **[tileSpriteResolver.ts](../src/ts/tileSpriteResolver.ts)** - Implementation source
- **[default.json](../src/data/base/tilesets/default.json)** - Default tileset config
