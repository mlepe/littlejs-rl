# UI System Refactor

## Overview

Refactored the inventory UI system to use LittleJS's built-in `UISystem` class instead of custom canvas drawing helper functions.

## Changes Made

### Removed Custom Helper Functions

**Before:**

```typescript
function drawRectScreen(x, y, width, height, color) {
  const ctx = LJS.mainContext;
  ctx.fillStyle = color.toString();
  ctx.fillRect(x, y, width, height);
}

function drawRectOutlineScreen(x, y, width, height, color, lineWidth) {
  const ctx = LJS.mainContext;
  ctx.strokeStyle = color.toString();
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(x, y, width, height);
}
```

**After:**
These functions were removed entirely. All drawing now uses `LJS.uiSystem` methods.

### Updated Drawing Calls

#### Rectangle Drawing

**Before:**

```typescript
drawRectScreen(x, y, w, h, color);
drawRectOutlineScreen(x, y, w, h, borderColor, 2);
```

**After:**

```typescript
LJS.uiSystem.drawRect(
  LJS.vec2(x + w / 2, y + h / 2), // Center position
  LJS.vec2(w, h), // Size
  color, // Fill color
  2, // Line width
  borderColor // Line color
);
```

**Key Difference:** `uiSystem.drawRect` expects a **center position**, not top-left corner.

#### Text Drawing

**Before:**

```typescript
LJS.drawTextScreen(
  text,
  LJS.vec2(x, y),
  fontSize,
  color,
  undefined,
  undefined,
  'center'
);
```

**After:**

```typescript
LJS.uiSystem.drawText(
  text,
  LJS.vec2(x, y),
  LJS.vec2(maxWidth, fontSize), // Size parameter
  color,
  0, // Line width
  undefined, // Line color
  'center' // Alignment
);
```

**Key Difference:** `uiSystem.drawText` requires a **size parameter** (Vector2) for text constraints.

## Benefits

1. **Native LittleJS Integration**: Uses the engine's built-in UI rendering system
2. **Cleaner Code**: Eliminates custom helper functions
3. **Better Performance**: Engine-optimized rendering
4. **Consistency**: All UI rendering uses the same system
5. **Future-Proof**: Easier to add features like shadows, gradients, etc.

## UISystem Methods Used

### `LJS.uiSystem.drawRect(pos, size, color, lineWidth, lineColor)`

- `pos`: Center position (Vector2)
- `size`: Width and height (Vector2)
- `color`: Fill color
- `lineWidth`: Border width (optional)
- `lineColor`: Border color (optional)

### `LJS.uiSystem.drawText(text, pos, size, color, lineWidth, lineColor, align)`

- `text`: String to display
- `pos`: Text position (Vector2)
- `size`: Text constraints (Vector2 - width and height)
- `color`: Text color
- `lineWidth`: Outline width (optional)
- `lineColor`: Outline color (optional)
- `align`: Alignment ('left', 'center', 'right')

## Files Modified

- `src/ts/systems/inventoryUISystem.ts` - Complete refactor to use UISystem

## Testing

Build completed successfully. All UI rendering now uses LittleJS's native UISystem.

## Next Steps

Consider refactoring other UI systems (examine mode, world map UI) to use UISystem as well for consistency.
