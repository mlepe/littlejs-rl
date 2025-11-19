# Inventory UI Coordinate System Fix

## Problem

The inventory UI is rendering at massive scale (unusable) because it uses **world coordinates** instead of **screen coordinates**.

- **World coordinates**: `LJS.drawRect`, `LJS.drawText` use world space where 1 unit ≈ 16 pixels
- **Screen coordinates**: Direct pixel positioning on canvas (what UI needs)

Example: `UI_CONFIG.INVENTORY_X = 50` becomes 50 \* 16 = 800 pixels on screen!

## Solution Summary

The file needs extensive changes (~24+ locations). Two approaches:

### Option 1: Minimal Fix (Recommended)

Scale down the constants by 16x to compensate for world coordinate scaling:

```typescript
const UI_CONFIG = {
  // Divide all pixel values by 16 to compensate for world scaling
  INVENTORY_X: 3.125, // Was 50, now 50/16
  INVENTORY_Y: 3.125, // Was 50
  INVENTORY_WIDTH: 21.875, // Was 350
  INVENTORY_HEIGHT: 31.25, // Was 500
  // ... etc for all pixel values
};
```

**Pros**: Minimal code changes, works with existing rendering
**Cons**: Awkward decimal constants, still uses world space (may have precision issues)

### Option 2: Complete Rewrite (Proper Fix)

Convert everything to screen-space rendering using `LJS.mainContext` and `LJS.drawTextScreen`:

```typescript
// Use percentages for responsive layout
const UI_CONFIG = {
  INVENTORY_X_PERCENT: 0.05, // 5% from left
  INVENTORY_WIDTH_PERCENT: 0.4, // 40% of screen width
  // ...
};

// Calculate actual pixels
const screenWidth = LJS.mainCanvas.width;
const x = screenWidth * UI_CONFIG.INVENTORY_X_PERCENT;

// Draw with screen functions
drawRectScreen(x, y, width, height, color); // Custom helper
LJS.drawTextScreen(text, x, y, size, color); // LittleJS built-in
```

**Pros**: Proper UI rendering, responsive to screen size, matches examine system pattern
**Cons**: Requires rewriting ~24+ draw calls across 4 functions

## Implementation Steps (Option 2 - Recommended)

### Step 1: Helper Functions (DONE ✅)

Already added `drawRectScreen` and `drawRectOutlineScreen` helper functions.

### Step 2: Update UI_CONFIG

```typescript
const UI_CONFIG = {
  // Screen-relative positions (percentages)
  INVENTORY_X_PERCENT: 0.05,
  INVENTORY_Y_PERCENT: 0.08,
  INVENTORY_WIDTH_PERCENT: 0.4,
  INVENTORY_HEIGHT_PERCENT: 0.75,

  EQUIPMENT_X_PERCENT: 0.52,
  EQUIPMENT_Y_PERCENT: 0.08,
  EQUIPMENT_WIDTH_PERCENT: 0.35,
  EQUIPMENT_HEIGHT_PERCENT: 0.75,

  DETAILS_X_PERCENT: 0.05,
  DETAILS_Y_PERCENT: 0.85,
  DETAILS_WIDTH_PERCENT: 0.82,
  DETAILS_HEIGHT_PERCENT: 0.12,

  // Absolute pixel sizes (for slots/spacing - don't scale)
  ITEM_SLOT_SIZE: 40,
  ITEM_SLOT_SPACING: 5,
  EQUIPMENT_SLOT_SIZE: 50,

  // Rest stays the same...
};
```

### Step 3: Add Screen Dimension Getters

```typescript
function getInventoryBounds() {
  const sw = LJS.mainCanvas.width;
  const sh = LJS.mainCanvas.height;
  return {
    x: sw * UI_CONFIG.INVENTORY_X_PERCENT,
    y: sh * UI_CONFIG.INVENTORY_Y_PERCENT,
    width: sw * UI_CONFIG.INVENTORY_WIDTH_PERCENT,
    height: sh * UI_CONFIG.INVENTORY_HEIGHT_PERCENT,
  };
}

function getEquipmentBounds() {
  const sw = LJS.mainCanvas.width;
  const sh = LJS.mainCanvas.height;
  return {
    x: sw * UI_CONFIG.EQUIPMENT_X_PERCENT,
    y: sh * UI_CONFIG.EQUIPMENT_Y_PERCENT,
    width: sw * UI_CONFIG.EQUIPMENT_WIDTH_PERCENT,
    height: sh * UI_CONFIG.EQUIPMENT_HEIGHT_PERCENT,
  };
}

function getDetailsBounds() {
  const sw = LJS.mainCanvas.width;
  const sh = LJS.mainCanvas.height;
  return {
    x: sw * UI_CONFIG.DETAILS_X_PERCENT,
    y: sh * UI_CONFIG.DETAILS_Y_PERCENT,
    width: sw * UI_CONFIG.DETAILS_WIDTH_PERCENT,
    height: sh * UI_CONFIG.DETAILS_HEIGHT_PERCENT,
  };
}
```

### Step 4: Update renderInventoryPanel

Replace all `LJS.drawRect` → `drawRectScreen` and `LJS.drawText` → `LJS.drawTextScreen`.

Example transformation:

```typescript
// OLD (world coordinates)
const x = UI_CONFIG.INVENTORY_X;
LJS.drawRect(
  LJS.vec2(x + w / 2, y + h / 2),
  LJS.vec2(w, h),
  UI_CONFIG.BG_COLOR
);

// NEW (screen coordinates)
const bounds = getInventoryBounds();
drawRectScreen(
  bounds.x,
  bounds.y,
  bounds.width,
  bounds.height,
  UI_CONFIG.BG_COLOR
);
```

### Step 5: Update renderEquipmentPanel

Same transformation as inventory panel.

### Step 6: Update renderDetailsPanel

Same transformation.

### Step 7: Update Mouse Input Handling

Functions like `isPointInRect`, `getInventoryItemAt`, `getEquipmentSlotAt` need to use screen coordinates:

```typescript
function isPointInRect(
  x: number,
  y: number,
  rect: { x: number; y: number; w: number; h: number }
): boolean {
  // Mouse is already in screen coordinates, so no conversion needed
  return (
    x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h
  );
}
```

### Step 8: Update EQUIPMENT_SLOT_LAYOUT

Change from absolute positions to percentages:

```typescript
const EQUIPMENT_SLOT_LAYOUT: Record<
  string,
  { xPercent: number; yPercent: number; label: string }
> = {
  head: { xPercent: 0.5, yPercent: 0.05, label: 'Head' },
  // ... etc
};

// Then calculate actual position:
function getEquipmentSlotPosition(slot: string) {
  const bounds = getEquipmentBounds();
  const layout = EQUIPMENT_SLOT_LAYOUT[slot];
  return {
    x: bounds.x + bounds.width * layout.xPercent,
    y: bounds.y + bounds.height * layout.yPercent,
  };
}
```

## Files to Modify

- `src/ts/systems/inventoryUISystem.ts` (987 lines):
  - Lines 27-73: UI_CONFIG constants
  - Lines 78-94: EQUIPMENT_SLOT_LAYOUT
  - Lines 295-301: Close key handling (DONE ✅)
  - Lines 436-562: renderInventoryPanel
  - Lines 563-671: renderEquipmentPanel
  - Lines 672-768: renderDetailsPanel
  - Lines 770-827: renderItemTooltip
  - Lines 829-842: renderDraggedItem
  - Lines 844-869: renderInstructions
  - Lines 871-920: Mouse hit detection functions

## Testing Checklist

After implementing fixes:

- [x] `npm run build` - Must compile without errors
- [ ] `npm run serve` - Start dev server
- [ ] Open inventory with I key
- [ ] **Verify UI is properly sized** (not huge)
- [ ] Test mouse hover over items
- [ ] Test mouse drag-and-drop
- [ ] Test keyboard navigation (arrow keys)
- [ ] Test equipment slots display properly
- [ ] Test item details panel shows
- [ ] Close with I key (not ESC)
- [ ] Verify ESC does NOT close inventory

## Current Status

- ✅ Helper functions added (`drawRectScreen`, `drawRectOutlineScreen`)
- ✅ Close key changed from ESC to I only
- ⏸️ Awaiting decision on approach (Option 1 vs Option 2)

## Recommendation

**Use Option 2 (Complete Rewrite)** for the following reasons:

1. Proper separation of world/screen coordinates
2. Responsive to different screen sizes
3. Matches existing `examineRenderSystem` pattern
4. Future-proof for UI scaling/resolution changes
5. Cleaner, more maintainable code

The implementation is extensive but straightforward - mostly find-replace operations with careful verification at each step.

## Quick Fix (If You Want to Test Immediately)

If you want a quick test to see if the coordinate system is the issue:

```typescript
// In UI_CONFIG, multiply all coordinates by 0.0625 (1/16):
INVENTORY_X: 3.125,  // Was 50
INVENTORY_Y: 3.125,  // Was 50
INVENTORY_WIDTH: 21.875,  // Was 350
INVENTORY_HEIGHT: 31.25,  // Was 500
// ... etc
```

This will make the UI properly sized but still in world space. It's a quick proof-of-concept, not a proper fix.
