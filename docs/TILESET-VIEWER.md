# Tileset Viewer - Developer Tool

## Overview

The Tileset Viewer is a dev-mode-only interactive tool for documenting tiles in the game's tileset. It provides a visual interface for browsing tiles, editing their metadata, and exporting the data to update `tileConfig.ts`.

**Status**: ✅ Fully implemented (v0.13.0)

---

## Features

### Core Features (v1.0)

- ✅ **Visual tileset browser** with grid overlay and camera follow
- ✅ **Keyboard navigation** with arrow keys and fast navigation (PgUp/PgDn)
- ✅ **Tile property editing** via browser prompts (name, categories, subcategories, notes)
- ✅ **Progress tracking** - Shows documented vs undocumented tiles
- ✅ **Visual feedback** - Undocumented tiles rendered with 30% opacity
- ✅ **Persistent storage** - Auto-save to localStorage
- ✅ **Import from enum** - Seed database with existing AutoTileSprite tiles
- ✅ **Export functionality**:
  - Download as TypeScript file
  - Download as JSON backup
  - Copy to clipboard
- ✅ **Help overlay** - Keyboard shortcuts reference
- ✅ **Dev-mode only** - Activated with F12 when `GAME_DEBUG=true`

### Future Features (v2.0+)

- 🔜 **Batch editing** - Select multiple tiles for same properties
- 🔜 **Visual zones** - Overlay zone boundaries on tileset
- 🔜 **Search/filter** - Jump to tiles by index or name
- 🔜 **Undo/redo** - History for tile edits
- 🔜 **Auto-categorization** - Suggest categories based on neighbors
- 🔜 **Screenshot** - Export annotated tileset image
- 🔜 **Quick keys** - Number keys for fast category assignment

---

## Usage

### Activation

**Prerequisites:**

- Game must be running in debug mode (`GAME_DEBUG=true` in `.env`)

**Toggle viewer:**

```
Press F12 - Toggle tileset viewer on/off
```

### Navigation Controls

```
Arrow Keys       - Move cursor one tile
Page Up/Down     - Fast vertical navigation (5 tiles)
Home/End         - Jump to start/end of row
```

### Editing Controls

```
Enter            - Edit current tile
Delete           - Delete current tile data
S                - Save to localStorage
E                - Export data (choose format)
I                - Import from AutoTileSprite enum
H                - Toggle help overlay
F12 / Escape     - Exit viewer
```

### Editing a Tile

1. Navigate to the tile you want to document
2. Press **Enter**
3. Follow the prompts:
   - **Name**: Enum-style name (e.g., `FLOOR_COBBLESTONE`)
   - **Categories**: Comma-separated numbers (see TileCategory enum)
   - **Subcategories**: Comma-separated numbers (see TileSubcategory enum)
   - **Notes**: Optional description

**Category Reference:**

```
0 = ENVIRONMENT (terrain, walls, doors, liquids)
1 = CHARACTER (player, NPCs, enemies, bosses)
2 = ITEM (weapons, armor, consumables, treasure)
3 = OBJECT (containers, furniture, props)
4 = EFFECT (visual effects, particles, projectiles)
5 = ICON (UI icons and symbols)
6 = FONT (reserved for text rendering)
7 = OTHER (uncategorized)
```

**Subcategory Reference:**

```
Environment:
0=FLOOR, 1=WALL, 2=DOOR, 3=PASSAGE, 4=LIQUID, 5=HAZARD, 6=TRAP

Objects:
7=CONTAINER, 8=FURNITURE, 9=PROP, 10=INTERACTIVE

Items:
11=WEAPON, 12=ARMOR, 13=EQUIPMENT, 14=CONSUMABLE, 15=FOOD, 16=POTION
17=SCROLL_BOOK, 18=TREASURE, 19=CURRENCY, 20=GEM, 21=KEY

Characters:
22=PLAYER, 23=NPC, 24=COMPANION, 25=ENEMY_COMMON, 26=ENEMY_UNDEAD
27=ENEMY_CREATURE, 28=ENEMY_ADVANCED, 29=BOSS

Effects:
30=EFFECT, 31=PARTICLE, 32=PROJECTILE

UI:
33=ICON, 34=OTHER
```

---

## Export Workflow

### Export Options

Press **E** to open export menu:

1. **Download TypeScript** - Generates `tileConfig_generated.ts` with:
   - `CuratedTileSprite` enum with all documented tiles
   - Category mapping comments
   - Tile index references
2. **Download JSON** - Generates `tileset_data.json` backup:
   - Full tile metadata
   - Can be re-imported later
   - Shareable with team

3. **Copy to Clipboard** - TypeScript code ready to paste

### Using Exported Data

**Option 1: Copy enum entries**

```typescript
// From generated file
export enum CuratedTileSprite {
  FLOOR_COBBLESTONE = 6,
  FLOOR_MARBLE = 7,
  // ... your documented tiles
}

// Add to tileConfig.ts
```

**Option 2: Use as reference**

- Check category mappings
- Verify tile indices
- Review notes and documentation

---

## Data Management

### Auto-Save

Data is automatically saved to localStorage when:

- You press **S** (manual save)
- The viewer is closed (auto-save on exit)

**Storage Key**: `littlejs-rl-tileset-viewer-data`

### Import from Enum

Press **I** to import existing tile names from `AutoTileSprite` enum:

- Merges with existing data (doesn't overwrite)
- Marks imported tiles as documented
- Useful for seeding the database

### Clear Data

To start fresh:

1. Open browser console (F12 in browser)
2. Run: `localStorage.removeItem('littlejs-rl-tileset-viewer-data')`
3. Reload page

---

## Technical Details

### Architecture

```
src/ts/tilesetViewer/
├── index.ts                # Module exports
├── tileMetadata.ts         # Data structures
├── tileDataManager.ts      # Save/load/export
└── tilesetViewer.ts        # Main viewer class
```

### Integration

The viewer integrates with the Game class:

- Initialized in `Game.init()` when `Game.isDebug === true`
- Toggled with F12 key
- Takes over update/render loops when active
- Returns control to game when inactive

### Data Format

**localStorage structure:**

```json
{
  "version": "1.0.0",
  "tilesetWidth": 49,
  "tilesetHeight": 22,
  "tiles": {
    "6": {
      "index": 6,
      "name": "FLOOR_COBBLESTONE",
      "categories": [0],
      "subcategories": [0],
      "notes": "Cobblestone floor tile",
      "isDocumented": true
    }
  },
  "lastModified": "2025-11-21T12:00:00.000Z"
}
```

---

## Best Practices

### Naming Convention

Follow the enum naming pattern:

```
[CATEGORY]_[DESCRIPTOR]_[VARIANT]
```

**Examples:**

```
FLOOR_STONE           - Simple floor
WALL_BRICK_CRACKED    - Descriptive variant
ENEMY_ORC_WARRIOR     - Character with role
POTION_RED            - Consumable with color
ICON_HEART_FULL       - UI element with state
```

### Category Assignment

1. **Primary category** - What the tile fundamentally is
2. **Secondary categories** - Additional uses (if applicable)
3. **Subcategory** - Specific classification

**Example: Chest tile**

- Category: `OBJECT` (primary)
- Subcategory: `CONTAINER`

**Example: Boss sprite**

- Category: `CHARACTER` (primary)
- Subcategory: `BOSS`

### Documentation Tips

1. **Start with obvious tiles** - Floors, walls, characters
2. **Use import** - Seed with existing AutoTileSprite names
3. **Review ranges** - Document tile ranges systematically (rows 0-15)
4. **Save frequently** - Press S after documenting several tiles
5. **Export often** - Back up your work with JSON exports

---

## Troubleshooting

### Viewer won't activate

**Solution**: Ensure `GAME_DEBUG=true` in `.env` file

### Lost progress

**Solution**: Check localStorage for saved data

```javascript
// Browser console
const data = localStorage.getItem('littlejs-rl-tileset-viewer-data');
console.log(JSON.parse(data));
```

### Tiles rendering incorrectly

**Solution**:

- Verify tile index with helper: `npm run tile-helper getTileCoords [index]`
- Check tileset image is loaded correctly
- Ensure gridWidth matches tileset (default: 49)

### Export not working

**Solution**:

- Check browser allows downloads
- Try copy-to-clipboard option instead
- Verify localStorage has data to export

---

## Keyboard Shortcuts Quick Reference

```
┌─────────────────────────────────────────────┐
│          TILESET VIEWER CONTROLS            │
├─────────────────────────────────────────────┤
│ NAVIGATION                                  │
│   Arrow Keys     Move cursor               │
│   PgUp/PgDn      Fast vertical (5 tiles)   │
│   Home/End       Jump horizontal           │
│                                             │
│ EDITING                                     │
│   Enter          Edit current tile         │
│   Delete         Delete tile data          │
│                                             │
│ DATA                                        │
│   S              Save to localStorage      │
│   E              Export data               │
│   I              Import from enum          │
│                                             │
│ UI                                          │
│   H              Toggle help               │
│   F12 / Esc      Exit viewer               │
└─────────────────────────────────────────────┘
```

---

## Future Enhancements

See implementation plan in conversation history for:

- Batch editing mode
- Visual zone overlays
- Search and filter functionality
- Undo/redo system
- Auto-categorization suggestions
- Quick key assignment (1-6 for categories)
- Screenshot with annotations

---

## Related Documentation

- [tileConfig.ts](../../src/ts/tileConfig.ts) - Tile enum and configuration
- [TILE-SPRITE-RESOLVER-QUICKREF.md](./TILE-SPRITE-RESOLVER-QUICKREF.md) - Sprite resolution system
- [TILE-HELPER-SCRIPTS.md](./TILE-HELPER-SCRIPTS.md) - Command-line tile utilities

---

## Version History

### v1.0.0 (2025-11-21)

- Initial implementation
- Core navigation and editing
- Import/export functionality
- Progress tracking with visual feedback
- localStorage persistence
- Dev-mode only activation
