# View Modes System

## Overview

The game uses a **view mode system** to switch between different gameplay contexts. Each mode has its own input handling, rendering, and systems.

## Available View Modes

### 1. LOCATION Mode (Default)

**Description:** Normal gameplay in a location - moving, fighting, interacting with the world.

**Key Bindings:**

- Arrow keys / WASD / Numpad: Move player (8 directions)
- Space/Enter/E: Action
- G: Pickup items
- U: Use item
- [ (BracketLeft, Numpad -): Open world map
- L: Enter examine mode
- I: Open inventory
- T: Zoom camera
- C: Toggle collision overlay (debug)
- X: Toggle debug text (debug)

📋 **[Complete Keybindings Reference](./KEYBINDINGS-REFERENCE.md)** - All controls with alternative keys

**Active Systems:**

- `pickupSystem` - Auto-pickup items
- `playerMovementSystem` - Move player
- `locationTransitionSystem` - Handle location edges
- `chargesSystem` - Passive charge regen
- `identificationSystem` - Auto-identify items
- `collisionDamageSystem` - Combat on collision
- `aiSystem` - NPC/enemy behaviors
- `deathSystem` - Handle deaths

**Rendering:**

- Tiles (via TileLayer)
- Entities (via renderSystem)
- Debug overlay (if enabled)

---

### 2. WORLD_MAP Mode

**Description:** Navigate the world map to travel between locations.

**Key Bindings:**

- Arrow keys / WASD / Numpad: Move cursor
- ] (BracketRight, Numpad +): Enter selected location
- Escape / [: Return to location mode
- T: Zoom camera
- C: Toggle collision overlay (debug)
- X: Toggle debug text (debug)

📋 **[Complete Keybindings Reference](./KEYBINDINGS-REFERENCE.md)** - All controls with alternative keys

**Active Systems:**

- `worldMapMovementSystem` - Navigate world map cursor

**Rendering:**

- World map tiles
- Cursor indicator
- Location names/info

---

### 3. INVENTORY Mode

**Description:** View and manage inventory items.

**Key Bindings:**

- Up/Down: Navigate inventory
- E: Equip/unequip item
- D: Drop item
- U: Use consumable
- Escape / I: Close inventory

**Active Systems:**

- (None - UI only, input handled by inventoryUISystem)

**Rendering:**

- `inventoryUISystem` - Renders inventory UI
- Item list with details
- Equipment slots
- Stats preview

---

### 4. EXAMINE Mode

**Description:** Inspect entities and tiles with a cursor.

**Key Bindings:**

- Arrow keys / WASD / Numpad: Move cursor
- Escape / L: Exit examine mode
- T: Zoom camera
- C: Toggle collision overlay (debug)
- X: Toggle debug text (debug)

📋 **[Complete Keybindings Reference](./KEYBINDINGS-REFERENCE.md)** - All controls with alternative keys

**Active Systems:**

- `examineCursorMovementSystem` - Move cursor

**Rendering:**

- `examineSystem` - Gather information at cursor
- `examineRenderSystem` - Display entity/tile info
- Cursor highlight
- Info panel

---

## Technical Implementation

### ViewModeComponent

```typescript
export interface ViewModeComponent {
  mode: ViewMode;
  previousMode?: ViewMode;
  examineCursorX: number;
  examineCursorY: number;
}
```

### ViewMode Enum

```typescript
export enum ViewMode {
  LOCATION = 'location',
  WORLD_MAP = 'world_map',
  INVENTORY = 'inventory',
  EXAMINE = 'examine',
}
```

### Switching Modes

```typescript
// In viewModeTransitionSystem
if (input.toggleWorldMap) {
  viewMode.previousMode = viewMode.mode;
  viewMode.mode = ViewMode.WORLD_MAP;
}

if (input.toggleInventory) {
  viewMode.mode = ViewMode.INVENTORY;
}

// ESC key returns to previous mode or LOCATION
if (input.exit) {
  viewMode.mode = viewMode.previousMode || ViewMode.LOCATION;
}
```

### Game Loop Integration

```typescript
function update() {
  // Always process input
  inputSystem(ecs);
  itemUsageInputSystem(ecs);

  // Handle mode transitions
  viewModeTransitionSystem(ecs);

  // Camera always updates
  cameraSystem(ecs);

  // Turn-based actions
  if (shouldProcessTurn) {
    const viewMode = getPlayerViewMode(ecs, playerId);

    switch (viewMode) {
      case ViewMode.WORLD_MAP:
        worldMapMovementSystem(ecs);
        break;
      case ViewMode.EXAMINE:
        examineCursorMovementSystem(ecs);
        break;
      case ViewMode.LOCATION:
        // Normal gameplay systems
        pickupSystem(ecs);
        playerMovementSystem(ecs);
        // ... combat, AI, etc.
        break;
    }
  }
}

function renderPost() {
  renderSystem(ecs); // Always render entities

  const viewMode = getPlayerViewMode(ecs, playerId);

  // Mode-specific UI
  switch (viewMode) {
    case ViewMode.EXAMINE:
      const examineData = examineSystem(ecs, cursorX, cursorY);
      examineRenderSystem(cursorX, cursorY, examineData);
      break;
    case ViewMode.INVENTORY:
      inventoryUISystem(ecs, playerId);
      break;
  }
}
```

## Best Practices

1. **Always check view mode before processing input** - Different modes need different input handling
2. **Store previous mode** - Allows returning to correct context on ESC
3. **Initialize cursor position on mode entry** - For examine mode, set cursor to player position
4. **Disable conflicting systems** - Don't run playerMovementSystem in EXAMINE mode
5. **Clear transient input flags** - Reset input flags after mode transitions

## Common Patterns

### Adding a New View Mode

1. Add to `ViewMode` enum in `components/viewMode.ts`
2. Handle transitions in `viewModeTransitionSystem`
3. Add system routing in `Game.update()`
4. Add rendering logic in `Game.renderPost()`
5. Define key bindings in `inputSystem`

### Toggling Between Modes

```typescript
// Toggle with key
if (input.toggleInventory) {
  if (viewMode.mode === ViewMode.INVENTORY) {
    viewMode.mode = ViewMode.LOCATION;
  } else {
    viewMode.previousMode = viewMode.mode;
    viewMode.mode = ViewMode.INVENTORY;
  }
}
```

### Preserving Context

```typescript
// Store cursor position when entering examine mode
if (
  viewMode.mode === ViewMode.EXAMINE &&
  viewMode.previousMode !== ViewMode.EXAMINE
) {
  viewMode.examineCursorX = playerPos.x;
  viewMode.examineCursorY = playerPos.y;
}
```

## Future Enhancements

- **Dialog Mode** - For NPC conversations
- **Trading Mode** - For merchant interactions
- **Crafting Mode** - For item creation
- **Character Sheet Mode** - For detailed stats/skills
- **Map Mode** - Minimap or full map view
- **Help Mode** - In-game help/controls

## Related Documentation

- `INPUT-SYSTEM.md` - Input handling
- `INVENTORY-SYSTEM.md` - Inventory UI details
- `EXAMINE-MODE-FIXES.md` - Examine mode implementation
- `WORLD-MAP.md` - World map navigation
