# World Map Quick Reference

## Quick Start

**Controls:**

- `-` (Minus): Open world map from location
- `+` (Plus): Enter location from world map
- Arrow Keys/WASD: Navigate

## View Modes

| Mode          | Description            | What You See                 |
| ------------- | ---------------------- | ---------------------------- |
| **Location**  | Tile-based exploration | 50×50 tile map with entities |
| **World Map** | Location grid overview | 10×10 grid of locations      |

## Tile States

| State            | What It Means        | Color              |
| ---------------- | -------------------- | ------------------ |
| **Undiscovered** | Unknown territory    | Dark gray          |
| **Discovered**   | Seen but not visited | Dimmed biome color |
| **Visited**      | You've been there    | Full biome color   |

## Biome Types

| Biome    | Color      | Appearance        |
| -------- | ---------- | ----------------- |
| Forest   | Green      | Trees, vegetation |
| Mountain | Gray       | Rocky, cliffs     |
| Desert   | Yellow     | Sand, dunes       |
| Swamp    | Dark Green | Murky, wet        |
| Barren   | Brown      | Sparse, dry       |
| Beach    | Light Sand | Coastal           |
| Snowy    | White      | Ice, frost        |
| Volcanic | Black/Red  | Lava, ash         |
| Water    | Blue       | Lakes, seas       |

## Typical Workflow

1. **Explore Location** - Walk around, fight enemies, loot
2. **Press `-`** - Open world map
3. **Navigate Grid** - Move cursor to new location
4. **Press `+`** - Enter selected location
5. **Repeat** - Continue exploring

## Tips

✅ **Discovery Radius**: Opening world map reveals nearby tiles  
✅ **Cannot Enter**: Undiscovered tiles are blocked  
✅ **Auto-Save Location**: Visited locations stay generated  
✅ **Yellow Cursor**: Shows your current position  
✅ **Starting Area**: Spawns with 2-tile radius discovered

## System Flow

```
LOCATION VIEW                    WORLD MAP VIEW
     ↓                                ↓
Player Movement                  Cursor Movement
     ↓                                ↓
Combat & Items                   Discovery & Navigation
     ↓                                ↓
Press `-` ────────────────────→  Select Location
     ←──────────────────────── Press `+`
```

## Version

**Current:** v0.11.0  
**Status:** ✅ Fully Implemented
