# Tileset Viewer - Save to Project Folder

## Overview

The Tileset Viewer now supports saving both JSON and TypeScript data directly to the project's file system, eliminating the need to manually copy files from the downloads folder.

## New Features

### Save Options (Press 'E' in Tileset Viewer)

When you press **'E'** in the Tileset Viewer, you now have 7 export/save options:

1. **Download TypeScript** - Downloads `.ts` file to browser downloads folder (existing)
2. **Download JSON** - Downloads `.json` file to browser downloads folder (existing)
3. **Copy to clipboard** - Copies TypeScript code to clipboard (existing)
4. **Import from JSON** - Import tile data from JSON file (existing)
5. **Save TypeScript to project** - **NEW** - Saves directly to `src/ts/tileConfig_generated.ts`
6. **Save JSON to project** - **NEW** - Saves directly to `src/data/base/tilesets/tileset_data.json`
7. **Save both to project** - **NEW** - Saves both files to project folders

### Save Locations

- **TypeScript**: `src/ts/tileConfig_generated.ts`
- **JSON**: `src/data/base/tilesets/tileset_data.json`

## How It Works

### Dev Server API

The webpack dev server now includes an API endpoint at `/api/save-tileset` that handles file writes:

```javascript
// webpack.config.js
devServer: {
  setupMiddlewares: (middlewares, devServer) => {
    devServer.app.post('/api/save-tileset', async (req, res) => {
      // Handles file writes to project folders
    });
  };
}
```

### Client-Side Methods

Three new methods in `TileDataManager`:

```typescript
// Save TypeScript only
await dataManager.saveTypeScriptToProject(tileData);

// Save JSON only
await dataManager.saveJSONToProject(tileData);

// Save both files
await dataManager.saveBothToProject(tileData);
```

## Usage Workflow

### 1. Document Tiles in Viewer

- Run `npm run dev` to start the dev server
- Open the tileset viewer (press 'P' in-game)
- Navigate and document tiles as usual

### 2. Save to Project

- Press **'E'** for export options
- Choose option **5**, **6**, or **7**:
  - **5** - Save only TypeScript enum
  - **6** - Save only JSON data
  - **7** - Save both files (recommended)

### 3. Confirmation

You'll see an alert confirming the save location:

```
Both files saved to project!
TypeScript: src/ts/tileConfig_generated.ts
JSON: src/data/base/tilesets/tileset_data.json
```

### 4. Use in Game

The saved files are now in your project and can be imported/used:

```typescript
// Import generated enum
import { CuratedTileSprite } from './tileConfig_generated';

// Or load JSON data
import tilesetData from '../data/base/tilesets/tileset_data.json';
```

## File Formats

### TypeScript Output (`tileConfig_generated.ts`)

```typescript
// ============================================
// AUTO-GENERATED TILE DEFINITIONS
// Generated: 2025-01-15T10:30:00.000Z
// Total tiles documented: 150
// ============================================

export enum CuratedTileSprite {
  PLAYER_WARRIOR = 24, // Warrior character sprite
  PLAYER_MAGE = 25, // Mage character sprite
  // ... more tiles
}

// ============================================
// CATEGORY MAPPINGS
// ============================================

// PLAYER: 5 tiles
// Indices: 24, 25, 26, 27, 28

// ENEMY: 20 tiles
// Indices: 550, 551, 552, ...
```

### JSON Output (`tileset_data.json`)

```json
{
  "version": "1.0.0",
  "tilesetWidth": 48,
  "tilesetHeight": 48,
  "tiles": {
    "24": {
      "index": 24,
      "name": "PLAYER_WARRIOR",
      "categories": [0],
      "subcategories": [0],
      "notes": "Warrior character sprite",
      "isDocumented": true
    }
  },
  "lastModified": "2025-01-15T10:30:00.000Z"
}
```

## Error Handling

### Server Not Running

If the dev server isn't running, you'll see:

```
Failed to save to project: Failed to fetch
```

**Solution**: Run `npm run dev` to start the dev server.

### Permission Errors

If the server can't write files:

```
Failed to save: Permission denied
```

**Solution**: Check file/folder permissions or run VS Code as administrator.

### API Errors

Check the browser console and terminal for detailed error messages:

```
[TileDataManager] API error: Network request failed
[TilesetViewer] Failed to save: Unable to write file
```

## Backward Compatibility

### localStorage Still Works

- Press **'O'** to save to localStorage (local browser storage)
- Press **'E' → 1/2** to download files to browser downloads folder
- All existing functionality is preserved

### Import Still Available

- Press **'I'** to import from `TileSprite` enum
- Press **'J'** to import from JSON file
- Press **'E' → 4** for JSON import via export menu

## Development Notes

### File Write Flow

1. User presses 'E' → chooses option 5/6/7
2. `TilesetViewer` calls `TileDataManager` method
3. `TileDataManager` sends POST request to `/api/save-tileset`
4. Dev server receives request and writes file to disk
5. Server responds with success/failure status
6. User sees confirmation alert

### Safety Features

- **Directory Creation**: Server automatically creates folders if they don't exist
- **Async/Await**: All save operations are asynchronous and non-blocking
- **Error Messages**: Clear feedback for all failure cases
- **localStorage Backup**: Original localStorage save still available

### Production Build

⚠️ **Important**: The save-to-project feature only works in development mode with the dev server running. In production builds, only the download options (1-4) will work.

## Troubleshooting

### "Failed to save" Error

**Check**:

1. Dev server is running (`npm run dev`)
2. You're accessing the game at `http://localhost:8080`
3. Folders `src/ts/` and `src/data/base/tilesets/` exist
4. You have write permissions to the project folder

### Files Not Appearing

**Check**:

1. Look in the correct folders (see "Save Locations" above)
2. Refresh VS Code file explorer (right-click → Refresh)
3. Check terminal output for success messages
4. Try the download options (1-2) to verify data is correct

### Changes Not Reflected in Game

**Check**:

1. Rebuild the project: `npm run build`
2. Reload the browser page
3. Clear browser cache (Ctrl+Shift+R)
4. Check if you're importing the generated files correctly

## Future Enhancements

Potential improvements:

- Auto-reload game when files are saved
- Custom save paths configuration
- Backup/version history of saved files
- Batch export of multiple tilesets
- Integration with hot module replacement (HMR)

## See Also

- **[TILESET-VIEWER.md](./TILESET-VIEWER.md)** - Main tileset viewer documentation
- **[TILE-SPRITE-RESOLVER-QUICKREF.md](./TILE-SPRITE-RESOLVER-QUICKREF.md)** - Sprite resolution system
- **[DATA-SYSTEM.md](./DATA-SYSTEM.md)** - Data loading architecture
