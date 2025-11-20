# Documentation Update: Tile Sprite Resolver

## Summary

Updated all primary documentation files to document the tile sprite resolver system and best practices for sprite usage. This ensures developers understand the correct patterns for working with sprites in the codebase.

## Files Updated

### 1. `.github/copilot-instructions.md`

**Section Added: "Tile Sprite Resolver System"** (after Color Palette System)

**Content:**

- Critical warning about always using the resolver
- Basic usage example with `resolveTileInfo()`
- Resolution order explanation
- Available helper functions (`resolveTileSprite`, `resolveTileSpriteCoords`, `resolveTileInfo`, `setTilesetConfiguration`)
- Sprite name sources (JSON configs, AutoTileSprite enum)
- Common sprite name examples
- Best practices list (5 key points)
- Custom tileset creation example
- Reference to detailed documentation

**Best Practices Added:**

- #24: Always use tile sprite resolver
- #25: Never use getTileCoords() for entities

**Impact:** Primary developer reference updated with complete resolver documentation.

### 2. `docs/BEST-PRACTICES.md`

**Section Added: "Tile Sprite Best Practices"** (after Color Best Practices)

**Content:**

- Critical warning about resolver usage
- Complete DO/DON'T lists
- Good pattern example (using resolver)
- Bad pattern example (manual TileInfo creation)
- Resolution order details
- Available sprite names by category
- Custom tileset creation guide
- References to detailed documentation files

**Best Practices List Updated:**

- #23: Always use tile sprite resolver
- #24: Never use getTileCoords() for entities
- Renumbered #23-27 to accommodate new items

**References & Further Reading Updated:**

- Added: `TILE-SPRITE-RESOLVER-QUICKREF.md`
- Added: `TILE-SPRITE-RESOLVER-MIGRATION.md`

**Impact:** Best practices guide now comprehensively covers sprite resolver patterns.

## Documentation Cross-References

All updated documentation now references:

1. **[TILE-SPRITE-RESOLVER-QUICKREF.md](./TILE-SPRITE-RESOLVER-QUICKREF.md)**
   - Quick reference guide for daily usage
   - Code examples and patterns
   - Tips and common workflows

2. **[TILE-SPRITE-RESOLVER-MIGRATION.md](./TILE-SPRITE-RESOLVER-MIGRATION.md)**
   - Complete migration documentation
   - Before/after comparisons
   - Files modified summary
   - Benefits achieved

## Key Messages Emphasized

### Critical Points

1. **Always use `resolveTileInfo()` for entity sprites**
2. **Never manually create TileInfo with `getTileCoords()`**
3. **Use string sprite names** (matches JSON format)
4. **Resolver provides automatic fallback** to AutoTileSprite
5. **Direct enum usage OK for static mappings** (biomes, UI elements)

### Developer Benefits

- Dynamic tileset switching at runtime
- Mod support through JSON configurations
- Cleaner code (1 line vs 5 lines per sprite)
- Consistent API across codebase
- Type-safe sprite name resolution

## Documentation Structure

```
docs/
├── BEST-PRACTICES.md
│   ├── Section 5: Data-Driven Development
│   │   └── Tile Sprite Best Practices (NEW)
│   └── Section 10: Best Practices List
│       ├── #23: Always use tile sprite resolver (NEW)
│       └── #24: Never use getTileCoords() (NEW)
├── TILE-SPRITE-RESOLVER-QUICKREF.md (existing)
└── TILE-SPRITE-RESOLVER-MIGRATION.md (existing)

.github/
└── copilot-instructions.md
    ├── Architecture Patterns
    │   ├── Color Palette System
    │   └── Tile Sprite Resolver System (NEW)
    └── Best Practices
        ├── #24: Always use tile sprite resolver (NEW)
        └── #25: Never use getTileCoords() (NEW)
```

## Usage Examples in Documentation

### Quick Usage (copilot-instructions.md)

```typescript
import { resolveTileInfo } from './tileConfig';

ecs.addComponent<RenderComponent>(entityId, 'render', {
  tileInfo: resolveTileInfo('ENEMY_GOBLIN'),
  color: getColor(BaseColor.WHITE),
  size: LJS.vec2(1, 1),
});
```

### Bad Pattern Warning (BEST-PRACTICES.md)

```typescript
// ❌ Don't do this
import { SPRITE_ENEMY, getTileCoords } from './tileConfig';

const coords = getTileCoords(SPRITE_ENEMY);
const tileInfo = new LJS.TileInfo(
  LJS.vec2(coords.x * 16, coords.y * 16),
  LJS.vec2(16, 16),
  0
);
```

### Custom Tileset Creation (both files)

```json
// src/data/base/tilesets/my-theme.json
{
  "id": "my-theme",
  "name": "My Custom Theme",
  "image": "tileset.png",
  "tileSize": 16,
  "gridWidth": 48,
  "mappings": {
    "PLAYER_WARRIOR": 100,
    "ENEMY_GOBLIN": 550
  }
}
```

## Verification Checklist

- ✅ copilot-instructions.md updated with resolver section
- ✅ copilot-instructions.md best practices list updated
- ✅ BEST-PRACTICES.md updated with detailed resolver section
- ✅ BEST-PRACTICES.md best practices list updated (renumbered)
- ✅ BEST-PRACTICES.md references section updated
- ✅ Cross-references to QUICKREF and MIGRATION docs added
- ✅ Code examples provided in both files
- ✅ Critical warnings emphasized
- ✅ DO/DON'T lists included

## Next Steps for Developers

When working with sprites:

1. **Read** [TILE-SPRITE-RESOLVER-QUICKREF.md](./TILE-SPRITE-RESOLVER-QUICKREF.md) for usage guide
2. **Import** `resolveTileInfo` from `./tileConfig`
3. **Use** string sprite names like `'PLAYER_WARRIOR'`, `'ENEMY_GOBLIN'`
4. **Create** custom tilesets in `src/data/base/tilesets/` for themes
5. **Switch** tilesets with `setTilesetConfiguration(id)`

## Conclusion

The documentation now comprehensively covers the tile sprite resolver system across all primary developer-facing documents. Developers have clear guidance on:

- Why to use the resolver (benefits)
- How to use the resolver (examples)
- What not to do (anti-patterns)
- Where to learn more (cross-references)

This ensures consistent sprite handling practices throughout the codebase and makes the dynamic tileset system discoverable and easy to use.
