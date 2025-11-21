# Tile Helper Scripts - Quick Reference

## Overview

Command-line utilities for working with tile configuration functions without needing to run the full game.

## Installation

The helper script is already configured in `package.json`. Just make sure you have `ts-node` installed (it's in devDependencies).

## Usage

### Basic Syntax

```bash
npm run tile-helper <command> <args...>
```

## Available Commands

### 1. getTileCoords

Convert a tile index to grid coordinates (x, y).

**Syntax:**

```bash
npm run tile-helper getTileCoords <index> [gridWidth]
```

**Parameters:**

- `index` (required) - The tile sprite index number
- `gridWidth` (optional) - Custom grid width (default: 49)

**Examples:**

```bash
# Get coordinates for index 121 with default grid width (49)
npm run tile-helper getTileCoords 121

# Get coordinates for index 121 with custom grid width (48)
npm run tile-helper getTileCoords 121 48

# Get coordinates for ENEMY_GOBLIN (index 528)
npm run tile-helper getTileCoords 528
```

**Output:**

```
Tile Coordinates for index 121:
  x: 23
  y: 2
  Grid Width: 49 (default)
```

---

### 2. getTileIndex

Convert grid coordinates (x, y) to a tile index.

**Syntax:**

```bash
npm run tile-helper getTileIndex <x> <y> [gridWidth]
```

**Parameters:**

- `x` (required) - X coordinate in the tileset grid
- `y` (required) - Y coordinate in the tileset grid
- `gridWidth` (optional) - Custom grid width (default: 49)

**Examples:**

```bash
# Get index for coordinates (23, 2) with default grid width
npm run tile-helper getTileIndex 23 2

# Get index for coordinates (23, 2) with custom grid width (48)
npm run tile-helper getTileIndex 23 2 48

# Verify round-trip conversion
npm run tile-helper getTileIndex 24 0
```

**Output:**

```
Tile Index for coordinates (23, 2):
  Index: 121
  Grid Width: 49 (default)
```

---

### 3. getTileName

Get the human-readable name for a tile type.

**Syntax:**

```bash
npm run tile-helper getTileName <tileType>
```

**Parameters:**

- `tileType` (required) - Tile type number (0-10)

**Available Tile Types:**

- `0` - VOID (Empty Space)
- `1` - FLOOR (Stone Floor)
- `2` - WALL (Stone Wall)
- `3` - DOOR_OPEN (Open Door)
- `4` - DOOR_CLOSED (Closed Door)
- `5` - STAIRS_UP (Stairs Up)
- `6` - STAIRS_DOWN (Stairs Down)
- `7` - WATER (Water)
- `8` - GRASS (Grass)
- `9` - TREE (Tree)
- `10` - FLORA (Flowers)

**Examples:**

```bash
# Get name for FLOOR tile
npm run tile-helper getTileName 1

# Get name for WALL tile
npm run tile-helper getTileName 2
```

**Output:**

```
Tile Name for type 1:
  Stone Floor
```

---

### 4. getTileProperties

Get all properties for a tile type (walkable, transparent, collision, color).

**Syntax:**

```bash
npm run tile-helper getTileProperties <tileType>
```

**Examples:**

```bash
# Get properties for WALL tile
npm run tile-helper getTileProperties 2

# Get properties for WATER tile
npm run tile-helper getTileProperties 7
```

**Output:**

```
Tile Properties for Stone Wall (type 2):
  Walkable: false
  Transparent: false
  Collision Value: 1
  Base Color: WALL
```

---

### 5. isTileWalkable

Check if a tile type is walkable.

**Syntax:**

```bash
npm run tile-helper isTileWalkable <tileType>
```

**Examples:**

```bash
npm run tile-helper isTileWalkable 1
npm run tile-helper isTileWalkable 2
```

**Output:**

```
Is Stone Floor (type 1) walkable?
  Yes
```

---

### 6. isTileTransparent

Check if a tile type is transparent (for line of sight).

**Syntax:**

```bash
npm run tile-helper isTileTransparent <tileType>
```

**Examples:**

```bash
npm run tile-helper isTileTransparent 1
npm run tile-helper isTileTransparent 2
```

**Output:**

```
Is Stone Wall (type 2) transparent?
  No
```

---

### 7. getTileCollisionValue

Get the collision value for a tile type (0 = no collision, 1 = solid).

**Syntax:**

```bash
npm run tile-helper getTileCollisionValue <tileType>
```

**Examples:**

```bash
npm run tile-helper getTileCollisionValue 1
npm run tile-helper getTileCollisionValue 2
```

**Output:**

```
Collision value for Stone Wall (type 2):
  1 (solid)
```

---

## Common Use Cases

### Verify Sprite Coordinates

```bash
# Check where PLAYER_WARRIOR (index 24) is located
npm run tile-helper getTileCoords 24

# Verify it's at (24, 0)
# Expected output: x: 24, y: 0
```

### Calculate Sprite Index

```bash
# Find the index at position (38, 10)
npm run tile-helper getTileIndex 38 10

# Returns: 528 (which is ENEMY_GOBLIN in default tileset)
```

### Test Tile Properties

```bash
# Check all properties of FLOOR tile
npm run tile-helper getTileProperties 1

# Quick check if WATER is walkable
npm run tile-helper isTileWalkable 7
```

### Debug Tileset Layout

```bash
# Test different grid widths
npm run tile-helper getTileCoords 100 48
npm run tile-helper getTileCoords 100 64
npm run tile-helper getTileCoords 100 49
```

---

## Tips

1. **No need to restart the game** - These scripts run independently
2. **Fast verification** - Quickly test coordinate calculations
3. **Debug helper** - Use when sprite positions don't match expectations
4. **Batch testing** - Run multiple commands in sequence to verify conversions

---

## Troubleshooting

### Command not found

Make sure `ts-node` is installed:

```bash
npm install
```

### Invalid arguments

Check that:

- Numbers are provided where expected
- Grid width is a positive integer
- Tile type is between 0-10

### Import errors

The script imports from compiled TypeScript. If you get import errors:

```bash
npm run build
```

---

## Extending the Helper

To add more commands, edit `scripts/tileHelper.ts`:

1. Import the function from `tileConfig.ts` or `tile.ts`
2. Add a new `case` in the switch statement
3. Parse arguments and call the function
4. Format and display the output

**Example:**

```typescript
case 'myNewCommand': {
  const arg = parseInt(args[1]);
  const result = myNewFunction(arg);
  console.log(`Result: ${result}`);
  break;
}
```

---

**See Also:**

- [tileConfig.ts](../src/ts/tileConfig.ts) - Tile sprite configuration
- [tile.ts](../src/ts/tile.ts) - Tile types and properties
- [tileSpriteResolver.ts](../src/ts/tileSpriteResolver.ts) - Dynamic sprite resolution
