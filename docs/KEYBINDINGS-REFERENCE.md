# Keybindings Reference

## Overview

This document provides a comprehensive reference for all keyboard controls in the game. The input system supports multiple keys per action for flexibility.

---

## Movement Controls

### Standard Movement

| Action         | Keys                     | Context                            |
| -------------- | ------------------------ | ---------------------------------- |
| **Move Up**    | Arrow Up, W, Numpad 8    | Location, World Map, Examine modes |
| **Move Down**  | Arrow Down, S, Numpad 2  | Location, World Map, Examine modes |
| **Move Left**  | Arrow Left, A, Numpad 4  | Location, World Map, Examine modes |
| **Move Right** | Arrow Right, D, Numpad 6 | Location, World Map, Examine modes |

### Diagonal Movement

| Action         | Keys     | Context                            |
| -------------- | -------- | ---------------------------------- |
| **Up-Left**    | Numpad 7 | Location, World Map, Examine modes |
| **Up-Right**   | Numpad 9 | Location, World Map, Examine modes |
| **Down-Left**  | Numpad 1 | Location, World Map, Examine modes |
| **Down-Right** | Numpad 3 | Location, World Map, Examine modes |

**Note:** Movement is turn-based with continuous input. Hold a movement key to move repeatedly (default: 150ms per turn).

---

## Action Controls

### Core Actions

| Action       | Keys            | Context             | Description                         |
| ------------ | --------------- | ------------------- | ----------------------------------- |
| **Action**   | Space, Enter, E | Location mode       | Interact, attack, or generic action |
| **Pickup**   | G               | Location mode       | Pick up items at current position   |
| **Use Item** | U               | Location, Inventory | Use/consume selected item           |

### View Mode Toggles

| Action             | Keys                       | Context   | Description                |
| ------------------ | -------------------------- | --------- | -------------------------- |
| **World Map**      | [ (BracketLeft), Numpad -  | Location  | Open world map view        |
| **Enter Location** | ] (BracketRight), Numpad + | World Map | Enter selected location    |
| **Examine Mode**   | L                          | Location  | Toggle examine mode on/off |
| **Inventory**      | I                          | Any       | Toggle inventory UI on/off |
| **Exit/Back**      | Escape                     | Any       | Return to previous mode    |

### Camera Controls

| Action   | Keys | Context | Description               |
| -------- | ---- | ------- | ------------------------- |
| **Zoom** | T    | Any     | Cycle through zoom levels |

### Debug Controls

| Action                | Keys | Context | Description                       |
| --------------------- | ---- | ------- | --------------------------------- |
| **Toggle Collision**  | C    | Any     | Show/hide collision layer overlay |
| **Toggle Debug Text** | X    | Any     | Show/hide debug information       |

---

## Context-Specific Controls

### LOCATION Mode (Normal Gameplay)

**Active Controls:**

- Movement (all directions)
- Action (Space, Enter, E)
- Pickup (G)
- Use Item (U)
- World Map toggle ([, Numpad -)
- Examine toggle (L)
- Inventory toggle (I)
- Zoom (T)
- Debug toggles (C, X)

**Input Type:** Turn-based (movement), Immediate (mode toggles, camera, debug)

---

### WORLD_MAP Mode

**Active Controls:**

- Movement (cursor navigation)
- Enter Location (], Numpad +)
- Exit to Location (Escape, [, Numpad -)
- Zoom (T)
- Debug toggles (C, X)

**Input Type:** Turn-based (cursor movement), Immediate (enter/exit, camera, debug)

**Behavior:**

- Arrow keys/WASD navigate cursor
- ] (or Numpad +) enters selected location
- Escape or [ returns to location view

---

### INVENTORY Mode

**Active Controls:**

- Navigation (disabled - inventory handles its own)
- Use Item (U)
- Exit (Escape, I)
- Debug toggles (C, X)

**Note:** Inventory uses its own internal navigation system. Standard movement keys are disabled.

---

### EXAMINE Mode

**Active Controls:**

- Movement (cursor navigation)
- Exit (Escape, L)
- Zoom (T)
- Debug toggles (C, X)

**Input Type:** Turn-based (cursor movement), Immediate (exit, camera, debug)

**Behavior:**

- Arrow keys/WASD move examine cursor
- Cursor can move freely across entire location
- Escape or L exits examine mode

---

## Input System Architecture

### Turn-Based vs Immediate

**Turn-Based Actions** (processed every 150ms):

- Player movement
- Cursor movement (world map, examine)
- Pickup
- AI behaviors
- Combat

**Immediate Actions** (processed every frame):

- View mode switching
- Camera zoom
- Debug toggles
- Input capture

### Input Detection Methods

**Continuous Input** (`keyIsDown`):

- All movement keys
- Detects key being held down
- Allows smooth continuous movement with turn-based timing

**Single Press** (`keyWasPressed`):

- All action keys
- Detects single key press
- Prevents repeated activation while held

### Input Flow

```
Frame Update (60fps)
  ↓
inputSystem() - Capture all keyboard state
  ↓
InputComponent - Store captured input
  ↓
Turn Timer Check (150ms intervals)
  ↓
Systems process InputComponent
  ↓
Systems reset turn-based flags
```

---

## Customization

### Adding New Keybindings

**Location:** `src/ts/systems/inputSystem.ts`

```typescript
const keybinds = {
  // Movement
  UP: ['ArrowUp', 'KeyW', 'Numpad8'],

  // Add new action
  NEW_ACTION: ['KeyN', 'KeyM'],

  // ... other keybinds
} as const;
```

**Steps:**

1. Add entry to `keybinds` object in `inputSystem.ts`
2. Add property to `InputComponent` interface
3. Add detection logic in `inputSystem()`
4. Create or modify system to handle the input
5. Update this documentation

### Changing Turn Speed

**Location:** `src/ts/game.ts`

```typescript
// In Game class constructor
private readonly turnDelay = 0.15; // Seconds per turn

// Options:
// 0.10 - Faster (10 turns/sec)
// 0.15 - Default (6.67 turns/sec)
// 0.20 - Slower (5 turns/sec)
// 0.25 - Very Slow (4 turns/sec)
```

---

## Keyboard Layout Compatibility

### QWERTY Layout

- Full support for WASD and arrow keys
- Numpad support for diagonal movement
- All action keys optimized for QWERTY

### International Layouts

- Arrow keys and Numpad work universally
- Letter keys (W, A, S, D) may vary by layout
- Use `KeyW`, `KeyA`, etc. for physical key position (recommended)

### Laptop Users (No Numpad)

- WASD and arrow keys provide full 8-directional movement
- Can move diagonally by pressing two direction keys simultaneously
- No functionality loss without numpad

---

## Accessibility Considerations

### Single-Hand Play

- Arrow keys + Enter for right-hand play
- WASD + Space for left-hand play
- Numpad provides alternative for all movement

### Remapping Support

- Easy to add alternative keys in `keybinds` object
- Multiple keys per action for flexibility
- No hardcoded key checks

### Visual Indicators

- Debug mode (X key) shows input state
- Movement keys provide immediate feedback
- Turn-based timing shows intentional delay

---

## Troubleshooting

### Keys Not Working

**Movement not responding:**

- Check if in correct view mode (movement disabled in INVENTORY)
- Verify turn timer is advancing (check debug text with X key)
- Try alternative keys (WASD instead of arrows, or vice versa)

**Actions not activating:**

- Ensure using single press (not holding key)
- Check if key is mapped in current mode
- Verify InputComponent is being updated (check debug console)

### Movement Too Fast/Slow

**Adjust turn delay:**

```typescript
// In src/ts/game.ts
private readonly turnDelay = 0.15; // Change this value
```

**Check frame rate:**

- Turn system is frame-independent
- Low FPS should not affect turn speed
- Check debug text (X key) for actual FPS

---

## Future Enhancements

### Planned Features

- [ ] Customizable keybindings via settings menu
- [ ] Gamepad support
- [ ] Mouse click movement
- [ ] Keyboard shortcut hints in UI
- [ ] Key rebinding persistence (save to localStorage)
- [ ] Alternative key sets (Vim-style hjkl, etc.)

### Modifier Keys

Future support for:

- Shift + movement for running
- Ctrl + action for alternative action
- Alt + key for quick access features

---

## Related Documentation

- [TURN-BASED-INPUT.md](./TURN-BASED-INPUT.md) - Turn-based input system details
- [VIEW-MODES.md](./VIEW-MODES.md) - View mode system
- [SYSTEMS-REFERENCE.md](./SYSTEMS-REFERENCE.md) - Input system implementation
- [COMPONENTS-REFERENCE.md](./COMPONENTS-REFERENCE.md) - InputComponent structure

---

**Version:** 0.10.0  
**Last Updated:** November 19, 2025  
**Status:** Current
