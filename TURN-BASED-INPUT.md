# Turn-Based Input System - v0.8.0

## Overview

Modified the input system to support continuous movement while keys are held down, controlled by a turn-based timer to prevent movement from occurring too fast.

## Implementation Details

### Turn Timer (Game Class)

**Properties:**

- `turnTimer: number` - Accumulates delta time between turns
- `turnDelay: number` - Set to 0.15 seconds (150ms per turn)

**Game Loop Logic:**

```typescript
update() {
  // Accumulate time
  this.turnTimer += LJS.timeDelta;

  // Check if turn should process
  const shouldProcessTurn = this.turnTimer >= this.turnDelay;

  // Always capture input (even between turns)
  inputSystem(this.ecs);
  itemUsageInputSystem(this.ecs);

  // Only process gameplay when turn timer allows
  if (shouldProcessTurn) {
    this.turnTimer = 0; // Reset timer

    // Process turn-based actions:
    pickupSystem(this.ecs);
    playerMovementSystem(this.ecs);
    cameraSystem(this.ecs);
    chargesSystem(this.ecs);
    // ... other systems
  }
}
```

### Input System Changes

**Movement Keys:**

- Changed from `keyWasPressed()` to `keyIsDown()` for all movement inputs
- Allows continuous detection while keys are held
- Turn timer controls actual movement frequency

**Action Keys:**

- Still use `keyWasPressed()` for single activation
- Actions: Space/Enter/E, G (pickup), U (use item), C/X (debug)

### Key Benefits

1. **Smooth Movement** - Hold arrow keys to move continuously
2. **Controlled Speed** - 150ms per turn prevents too-fast movement
3. **Responsive Feel** - Input captured every frame, processed on turn boundaries
4. **Turn-Based Logic** - All gameplay systems respect turn timing

### Configuration

**Adjustable Turn Speed:**

```typescript
// In Game class constructor
private readonly turnDelay = 0.15; // Seconds per turn

// Faster turns (100ms)
private readonly turnDelay = 0.10;

// Slower turns (200ms)
private readonly turnDelay = 0.20;
```

### Testing

**Movement:**

1. Hold arrow key or WASD → Character moves every 150ms
2. Release key → Movement stops immediately
3. Press diagonal (numpad 7/9/1/3) → Diagonal movement

**Actions:**

1. Press G once → Single pickup attempt
2. Press U once → Single item use
3. Press C once → Toggle collision overlay

### Technical Notes

**Why Two-Phase Input?**

- Phase 1: `inputSystem()` runs every frame (~60fps)
  - Captures current key states in InputComponent
  - No lag between press and registration
- Phase 2: `playerMovementSystem()` runs on turn boundaries (6.67fps at 150ms)
  - Reads InputComponent state
  - Applies movement if key is held

**Frame-Independent:**

- Uses `LJS.timeDelta` for timer accumulation
- Works correctly regardless of frame rate
- 60fps, 144fps, or variable fps all produce same turn rate

### Future Enhancements

1. **Variable Turn Speeds** - Different speeds for different actions
2. **First Key Repeat Delay** - Longer delay on first move, faster subsequent moves
3. **Speed Modifiers** - Haste/slow status effects modify turn delay
4. **Turn Counter** - Track total turns for hunger, regeneration, etc.

---

**Version:** 0.8.0  
**Date:** November 16, 2025  
**Status:** Implemented and Tested
