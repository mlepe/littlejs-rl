# World Map System

**Version:** 0.11.0  
**Status:** ✅ Implemented

## Overview

The world map system provides a traversable overview of the game world, where each tile represents a location that can be explored. Players can switch between two view modes:

- **Location View**: Explore individual locations tile-by-tile (50×50 tiles)
- **World Map View**: Navigate between locations on a world grid (10×10 locations)

## Controls

| Action              | Keys                           | Description                   |
| ------------------- | ------------------------------ | ----------------------------- |
| **Enter World Map** | `-` (Minus) or `Numpad -`      | Open world map from location  |
| **Enter Location**  | `+` (Plus/Equal) or `Numpad +` | Enter location from world map |
| **Navigate**        | Arrow Keys, WASD, Numpad       | Move cursor on world map      |

## Architecture

### Core Classes

#### `WorldMap`

**File:** `src/ts/worldMap.ts`

Manages the visual representation of the world grid. Each tile represents a location with:

- **Location Type**: Wilderness, dungeon, cave, etc.
- **Biome**: Forest, mountain, desert, etc.
- **Discovery State**: Undiscovered, discovered, or visited
- **Visual Representation**: Color-coded based on biome and state

**Key Methods:**

```typescript
worldMap.getTile(x, y); // Get tile data
worldMap.discoverTile(x, y); // Make tile visible
worldMap.visitTile(x, y); // Mark as explored
worldMap.discoverRadius(x, y, r); // Reveal tiles in radius
worldMap.render(cursorX, cursorY); // Draw world map
```

#### `ViewMode` Enum

**File:** `src/ts/components/viewMode.ts`

```typescript
enum ViewMode {
  LOCATION = 'location', // Exploring a location
  WORLD_MAP = 'world_map', // Viewing world map
}
```

#### `ViewModeComponent`

**File:** `src/ts/components/viewMode.ts`

Tracks which view the entity is in and cursor position.

```typescript
interface ViewModeComponent {
  mode: ViewMode;
  worldMapCursorX: number; // Cursor position when in world map
  worldMapCursorY: number;
}
```

### Systems

#### `viewModeTransitionSystem`

**File:** `src/ts/systems/viewModeTransitionSystem.ts`

Handles switching between location and world map views.

**Location → World Map Transition:**

1. Detect input (`locationEnterWorldMap`)
2. Set cursor to current world position
3. Discover surrounding tiles (radius 2)
4. Update camera for world map scale
5. Switch view mode

**World Map → Location Transition:**

1. Detect input (`worldMapEnterLocation`)
2. Check if tile is discovered
3. Mark tile as visited
4. Load/generate target location
5. Find walkable spawn point
6. Update player position
7. Switch view mode

**Execution Order:** After `inputSystem`, before movement systems

```typescript
function gameUpdate() {
  inputSystem(ecs);
  viewModeTransitionSystem(ecs); // Handle view switching

  if (mode === WORLD_MAP) {
    worldMapMovementSystem(ecs);
  } else {
    playerMovementSystem(ecs);
  }
}
```

#### `worldMapMovementSystem`

**File:** `src/ts/systems/worldMapMovementSystem.ts`

Handles cursor movement on the world map grid.

**Features:**

- Grid-based cursor movement
- Boundary checking
- Camera follows cursor
- Only processes entities in WORLD_MAP mode

**Execution Order:** After `viewModeTransitionSystem`, when in world map view

### Game Integration

The `Game` class conditionally routes to appropriate systems based on view mode:

```typescript
// In update loop
const viewMode = viewModeComp?.mode || ViewMode.LOCATION;

viewModeTransitionSystem(ecs); // Always check for transitions

if (viewMode === ViewMode.WORLD_MAP) {
  worldMapMovementSystem(ecs); // World map cursor
} else {
  playerMovementSystem(ecs); // Location exploration
  locationTransitionSystem(ecs);
  // ... other location systems
}
```

## Tile Discovery System

### Discovery States

| State            | Description              | Visibility            |
| ---------------- | ------------------------ | --------------------- |
| **Undiscovered** | Player unaware of tile   | Dark gray, no details |
| **Discovered**   | Revealed but not visited | Darker biome color    |
| **Visited**      | Player has been there    | Full biome color      |

### Discovery Rules

1. **Starting Location**: Automatically visited with 2-tile radius discovered
2. **World Map Transition**: Discovers 2-tile radius around current position
3. **Cannot Enter**: Undiscovered locations are inaccessible

### Procedural Biomes

Biomes are deterministically generated based on world position:

```typescript
// Biome distribution (seed-based)
30% Forest       - Green, trees
20% Mountain     - Gray, rocky
15% Barren       - Brown, sparse
10% Desert       - Yellow, sandy
10% Swamp        - Dark green, murky
 8% Beach        - Light sand, coastal
 4% Snowy        - White, icy
 3% Volcanic     - Black, lava
 <1% Water       - Blue, lakes/seas
```

Each biome has unique color palettes from `getBiomePalette()`.

## Visual Representation

### World Map Rendering

**Tile Size:** 2×2 units (scaled for overview)  
**Grid Position:** Centered around (0, 0)  
**Offset:** `-worldWidth, -worldHeight`

**Color Coding:**

- **Undiscovered**: `rgb(0.2, 0.2, 0.2)` - Dark gray
- **Discovered**: `biomeColor * 0.6` - Dimmed biome color
- **Visited**: `biomeColor` - Full biome color
- **Cursor**: `rgb(1, 1, 0)` - Yellow outline

**Example Render:**

```
┌─────────────────────────┐
│ ░░ ░░ ▓▓ ▓▓ ░░ ░░ ░░ ░░│  ░ = Undiscovered
│ ░░ ██ ██ ▓▓ ░░ ░░ ░░ ░░│  ▓ = Discovered
│ ░░ ██ [██] ██ ▓▓ ░░ ░░ │  █ = Visited
│ ░░ ░░ ██ ▓▓ ▓▓ ▓▓ ░░ ░░│  [ ] = Cursor
│ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░│
└─────────────────────────┘
```

### Camera Behavior

**Location View:**

- Camera follows player position
- Zoom shows local tile detail

**World Map View:**

- Camera follows cursor
- Zoomed out for grid overview
- Position: `(-worldWidth + cursorX * 2 + 1, -worldHeight + cursorY * 2 + 1)`

## Workflow Example

### 1. Start Game (Location View)

```
Player spawns at world (5,5)
Location: WILDERNESS (FOREST biome)
- Tile (5,5) marked VISITED
- Radius 2 tiles DISCOVERED
Camera: Follow player in location
```

### 2. Open World Map

```
Player presses `-` key
→ viewModeTransitionSystem detects input
→ Switch to WORLD_MAP mode
→ Cursor placed at (5,5)
→ Discover radius 2 around (5,5)
→ Camera: Zoom out to world grid
→ Render world map with cursor
```

### 3. Navigate World Map

```
Player uses arrow keys
→ worldMapMovementSystem moves cursor
→ Camera follows cursor
→ View different world tiles
```

### 4. Enter New Location

```
Cursor at (6,4) - DISCOVERED tile
Player presses `+` key
→ viewModeTransitionSystem detects input
→ Check if tile discovered ✓
→ Mark tile as VISITED
→ Load/generate location (6,4)
→ Find walkable spawn point
→ Update player position
→ Switch to LOCATION mode
→ Camera: Zoom in to location
```

### 5. Explore & Return

```
Player explores location (6,4)
Player presses `-` to view world map
Player navigates to (5,5) - HOME
Player presses `+` to re-enter
→ Returns to previously visited location
```

## Technical Details

### Memory Management

**World Map:**

- All tiles exist in memory (10×10 = 100 tiles)
- Minimal data per tile (~100 bytes)
- Total: ~10KB

**Locations:**

- Lazy loading: Generated on first visit
- Remain in memory after creation
- Future: Unload distant locations

### Performance Considerations

1. **World Map Rendering**: Fast (100 tiles × simple rectangles)
2. **Location Generation**: On-demand, one-time cost
3. **View Transitions**: Instant, no loading screens
4. **Discovery Updates**: O(radius²) on world map entry

### Data Persistence

**Current:**

- Discovery state persists in session
- Visited locations remain generated
- No save/load yet

**Future:**

- Save discovery map
- Persist location states
- Track exploration time

## Integration Checklist

- [x] Create `WorldMap` class
- [x] Create `ViewMode` enum and component
- [x] Create `viewModeTransitionSystem`
- [x] Create `worldMapMovementSystem`
- [x] Add `ViewModeComponent` to player entity
- [x] Integrate world map into `Game` class
- [x] Add `getWorldMap()` getter
- [x] Discover starting location
- [x] Conditional rendering (location vs world map)
- [x] Conditional system routing (movement/AI)
- [x] Update input bindings
- [x] Export systems from index
- [x] Export components from index
- [x] Build successfully
- [x] Update version to 0.11.0
- [x] Document system

## Future Enhancements

### Visual Improvements

- **Tile Icons**: Symbols for dungeons, towns, landmarks
- **Animated Cursor**: Pulsing/blinking highlight
- **Fog of War**: Animated reveal effect
- **Minimap**: Small world map overlay in location view
- **Breadcrumb Trail**: Show recent path

### Gameplay Features

- **Fast Travel**: Teleport to visited locations
- **Quest Markers**: Highlight objectives on world map
- **Dynamic Events**: Show active events on tiles
- **NPC Locations**: Track important NPCs
- **Location Descriptions**: Hover text with details

### Discovery Mechanics

- **Line of Sight**: Discover only visible tiles
- **Exploration XP**: Reward discovering new areas
- **Cartography Skill**: Increase discovery radius
- **Map Items**: Reveal large areas instantly
- **Scouts/Towers**: Permanent vision sources

### World Map Interaction

- **Context Menu**: Right-click for tile options
- **Tile Notes**: Player annotations
- **Distance Display**: Show travel time
- **Difficulty Indicators**: Danger levels
- **Resource Icons**: Show loot/rewards

## Related Files

- `src/ts/worldMap.ts` - World map class and rendering
- `src/ts/components/viewMode.ts` - View mode tracking
- `src/ts/systems/viewModeTransitionSystem.ts` - View switching logic
- `src/ts/systems/worldMapMovementSystem.ts` - World map cursor movement
- `src/ts/game.ts` - Game integration and routing
- `src/ts/entities.ts` - Player with ViewModeComponent
- `src/ts/components/input.ts` - Input bindings
- `src/ts/systems/inputSystem.ts` - Input capture

## See Also

- [LOCATION-TRANSITIONS.md](LOCATION-TRANSITIONS.md) - Location edge transitions
- [LOCATION-TYPES-BIOMES.md](LOCATION-TYPES-BIOMES.md) - Location generation
- [TURN-BASED-INPUT.md](TURN-BASED-INPUT.md) - Input system
- [QUICKSTART.md](QUICKSTART.md) - Getting started
- [ARCHITECTURE.md](ARCHITECTURE.md) - System overview
