# Inventory UI Display Fixes

## Problem

The inventory UI is being rendered at massive scale because it's using pixel coordinates (50, 350, 500) in LittleJS's world space instead of screen space.

In LittleJS:

- **World coordinates**: 1 unit ≈ 16 pixels, used for game entities
- **Screen coordinates**: Actual pixel positions, used for UI overlays

## Solution Overview

### 1. Change UI_CONFIG to use percentages

Replace fixed pixel coordinates with screen-relative percentages:

- `INVENTORY_X: 50` → `INVENTORY_X_PERCENT: 0.05` (5% from left)
- `INVENTORY_Y: 50` → `INVENTORY_Y_PERCENT: 0.08` (8% from top)
- etc.

### 2. Change colors from LJS.Color to CSS strings

LittleJS's `drawRect` uses `LJS.Color`, but canvas context uses CSS strings:

- `new LJS.Color(0.1, 0.1, 0.1, 0.9)` → `'rgba(25, 25, 25, 0.9)'`

### 3. Add drawRectScreen helper

Since LittleJS doesn't have `drawRectScreen`, add helper:

```typescript
function drawRectScreen(
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  fill: boolean = true
): void {
  const ctx = LJS.mainContext;
  ctx.save();

  if (fill) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  }

  ctx.restore();
}
```

### 4. Update all rendering functions

Replace:

- `LJS.drawRect` → `drawRectScreen`
- `LJS.drawText` → `LJS.drawTextScreen`
- `LJS.vec2(x + w/2, y + h/2)` → Just use x, y directly (different coordinate systems)

### 5. Calculate screen positions dynamically

```typescript
const screenWidth = LJS.mainCanvas.width;
const screenHeight = LJS.mainCanvas.height;
const x = screenWidth * UI_CONFIG.INVENTORY_X_PERCENT;
const y = screenHeight * UI_CONFIG.INVENTORY_Y_PERCENT;
```

### 6. Update EQUIPMENT_SLOT_LAYOUT

Change from absolute positions to percentages within panel:

- `{ x: 125, y: 50, label: 'Head' }` → `{ xPercent: 0.5, yPercent: 0.1, label: 'Head' }`

### 7. Remove old helper functions

- `drawRectOutline` (replaced by `drawRectScreen` with `fill=false`)

### 8. Fix key bindings

Change close inventory key from ESC to I only (ESC opens LittleJS debug overlay).

## Files to Modify

- `src/ts/systems/inventoryUISystem.ts`

## Testing

1. Build with `npm run build`
2. Run with `npm run serve`
3. Open inventory with I key
4. Verify UI is properly sized and positioned
5. Verify close with I key works
