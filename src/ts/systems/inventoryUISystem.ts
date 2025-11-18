/*
 * File: inventoryUISystem.ts
 * Project: littlejs-rl
 * File Created: Monday, 30th December 2025 11:00:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 30th December 2025 11:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import {
  EquipmentComponent,
  InventoryComponent,
  InventoryPanel,
  InventoryUIComponent,
  ItemComponent,
  ViewMode,
  ViewModeComponent,
} from '../components';

import ECS from '../ecs';
import { EquipmentSlot } from '../components/item';

/**
 * Helper function to draw a rectangle in screen space (pixels)
 * LittleJS's drawRect uses world coordinates, so we use the canvas context directly
 */
function drawRectScreen(
  x: number,
  y: number,
  width: number,
  height: number,
  color: LJS.Color
): void {
  const ctx = LJS.mainContext;
  ctx.fillStyle = color.toString();
  ctx.fillRect(x, y, width, height);
}

/**
 * Helper function to draw a rectangle outline in screen space
 */
function drawRectOutlineScreen(
  x: number,
  y: number,
  width: number,
  height: number,
  color: LJS.Color,
  lineWidth: number = 2
): void {
  const ctx = LJS.mainContext;
  ctx.strokeStyle = color.toString();
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(x, y, width, height);
}

/**
 * Inventory UI Layout Constants
 * Using screen-relative percentages for responsive layout
 */
const UI_CONFIG = {
  // Screen layout percentages
  PANEL_PADDING: 20,

  // Inventory panel (left side) - percentages of screen size
  INVENTORY_X_PERCENT: 0.05,
  INVENTORY_Y_PERCENT: 0.08,
  INVENTORY_WIDTH_PERCENT: 0.4,
  INVENTORY_HEIGHT_PERCENT: 0.75,
  INVENTORY_TITLE_HEIGHT: 30,
  ITEM_SLOT_SIZE: 40,
  ITEM_SLOT_SPACING: 5,
  ITEMS_PER_ROW: 7,
  VISIBLE_ROWS: 10,

  // Equipment panel (right side) - percentages
  EQUIPMENT_X_PERCENT: 0.52,
  EQUIPMENT_Y_PERCENT: 0.08,
  EQUIPMENT_WIDTH_PERCENT: 0.35,
  EQUIPMENT_HEIGHT_PERCENT: 0.75,
  EQUIPMENT_SLOT_SIZE: 50,
  EQUIPMENT_SLOT_SPACING: 10,

  // Details panel (bottom) - percentages
  DETAILS_X_PERCENT: 0.05,
  DETAILS_Y_PERCENT: 0.85,
  DETAILS_WIDTH_PERCENT: 0.82,
  DETAILS_HEIGHT_PERCENT: 0.12,

  // UI Opacity Settings (easily adjustable)
  OPACITY: {
    BACKGROUND: 0.98, // Panel backgrounds (0.0 = transparent, 1.0 = opaque)
    BORDER: 1.0, // Panel borders
    TEXT: 1.0, // Text and titles
    SELECTED: 0.5, // Selected item highlight
    HOVER: 0.3, // Mouse hover highlight
    DRAG: 0.7, // Dragged item overlay
    EMPTY_SLOT: 0.5, // Empty equipment slots
  },

  // Colors
  BG_COLOR: new LJS.Color(0.1, 0.1, 0.1, 0.98),
  BORDER_COLOR: new LJS.Color(0.5, 0.5, 0.5, 1.0),
  TITLE_COLOR: new LJS.Color(1.0, 1.0, 0.8, 1.0),
  TEXT_COLOR: new LJS.Color(0.9, 0.9, 0.9, 1.0),
  SELECTED_COLOR: new LJS.Color(1.0, 1.0, 0.0, 0.5),
  HOVER_COLOR: new LJS.Color(0.7, 0.7, 0.0, 0.3),
  DRAG_COLOR: new LJS.Color(0.5, 0.5, 1.0, 0.7),
  EMPTY_SLOT_COLOR: new LJS.Color(0.2, 0.2, 0.2, 0.5),

  // Font sizes
  TITLE_FONT_SIZE: 24,
  TEXT_FONT_SIZE: 16,
  SMALL_FONT_SIZE: 12,
};

/**
 * Equipment slot layout positions
 * Maps equipment slot names to UI positions (as percentages of equipment panel)
 */
const EQUIPMENT_SLOT_LAYOUT: Record<
  string,
  { xPercent: number; yPercent: number; label: string }
> = {
  head: { xPercent: 0.42, yPercent: 0.08, label: 'Head' },
  face: { xPercent: 0.42, yPercent: 0.18, label: 'Face' },
  neck: { xPercent: 0.42, yPercent: 0.28, label: 'Neck' },
  body: { xPercent: 0.42, yPercent: 0.42, label: 'Body' },
  back: { xPercent: 0.12, yPercent: 0.42, label: 'Back' },
  belt: { xPercent: 0.42, yPercent: 0.56, label: 'Belt' },
  legs: { xPercent: 0.42, yPercent: 0.68, label: 'Legs' },
  feet: { xPercent: 0.42, yPercent: 0.8, label: 'Feet' },
  mainHand: { xPercent: 0.12, yPercent: 0.68, label: 'Main' },
  offHand: { xPercent: 0.72, yPercent: 0.68, label: 'Off' },
  ringLeft: { xPercent: 0.12, yPercent: 0.8, label: 'Ring L' },
  ringRight: { xPercent: 0.72, yPercent: 0.8, label: 'Ring R' },
};

/**
 * Get inventory panel bounds in screen coordinates
 */
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

/**
 * Get equipment panel bounds in screen coordinates
 */
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

/**
 * Get details panel bounds in screen coordinates
 */
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

/**
 * Inventory UI System
 *
 * Manages the inventory screen UI including:
 * - Rendering inventory grid and equipment slots
 * - Mouse interaction (hover, click, drag-drop)
 * - Keyboard navigation
 * - Item tooltips and details
 * - Equipment management
 *
 * @param ecs - Entity Component System
 * @param playerId - Player entity ID
 */
export function inventoryUISystem(ecs: ECS, playerId: number): void {
  // Only run if in inventory view mode
  const viewMode = ecs.getComponent<ViewModeComponent>(playerId, 'viewMode');
  if (!viewMode || viewMode.mode !== ViewMode.INVENTORY) {
    return;
  }

  // Get required components
  const inventory = ecs.getComponent<InventoryComponent>(playerId, 'inventory');
  const equipment = ecs.getComponent<EquipmentComponent>(playerId, 'equipment');
  const inventoryUI = ecs.getComponent<InventoryUIComponent>(
    playerId,
    'inventoryUI'
  );

  if (!inventory || !inventoryUI) {
    console.warn(
      '[inventoryUISystem] Player missing inventory or inventoryUI component'
    );
    return;
  }

  // Handle input
  handleInventoryInput(ecs, playerId, inventory, equipment, inventoryUI);

  // Render UI
  renderInventoryUI(ecs, inventory, equipment, inventoryUI);
}

/**
 * Handle keyboard and mouse input for inventory UI
 */
function handleInventoryInput(
  ecs: ECS,
  playerId: number,
  inventory: InventoryComponent,
  equipment: EquipmentComponent | undefined,
  inventoryUI: InventoryUIComponent
): void {
  const mousePos = LJS.mousePos;
  const mousePressed = LJS.mouseIsDown(0);
  const mouseReleased = LJS.mouseWasPressed(0);

  // Check if mouse is over inventory panel
  const invBounds = getInventoryBounds();

  const isOverInventory = isPointInRect(mousePos.x, mousePos.y, invBounds);

  // Handle mouse over inventory items
  if (isOverInventory && !inventoryUI.isDragging) {
    const itemIndex = getInventoryItemAt(
      mousePos.x,
      mousePos.y,
      inventoryUI.scrollOffset
    );
    if (itemIndex >= 0 && itemIndex < inventory.items.length) {
      inventoryUI.hoverItemId = inventory.items[itemIndex];
    } else {
      inventoryUI.hoverItemId = undefined;
    }
  }

  // Handle mouse over equipment slots
  if (equipment) {
    const eqSlot = getEquipmentSlotAt(mousePos.x, mousePos.y);
    if (eqSlot && !inventoryUI.isDragging) {
      inventoryUI.hoverEquipSlot = eqSlot;
      const itemId = (equipment as any)[eqSlot];
      if (itemId !== undefined) {
        inventoryUI.hoverItemId = itemId;
      }
    } else if (!isOverInventory) {
      inventoryUI.hoverEquipSlot = undefined;
      if (!inventoryUI.isDragging) {
        inventoryUI.hoverItemId = undefined;
      }
    }
  }

  // Handle drag start (mouse pressed on item)
  if (mousePressed && !inventoryUI.isDragging) {
    // Check if clicking on inventory item
    if (isOverInventory) {
      const itemIndex = getInventoryItemAt(
        mousePos.x,
        mousePos.y,
        inventoryUI.scrollOffset
      );
      if (itemIndex >= 0 && itemIndex < inventory.items.length) {
        inventoryUI.isDragging = true;
        inventoryUI.dragItemId = inventory.items[itemIndex];
        inventoryUI.dragSourceSlot = undefined; // From inventory
      }
    }

    // Check if clicking on equipment slot
    if (equipment) {
      const eqSlot = getEquipmentSlotAt(mousePos.x, mousePos.y);
      if (eqSlot) {
        const itemId = (equipment as any)[eqSlot];
        if (itemId !== undefined) {
          inventoryUI.isDragging = true;
          inventoryUI.dragItemId = itemId;
          inventoryUI.dragSourceSlot = eqSlot;
        }
      }
    }
  }

  // Handle drag release (drop item)
  if (mouseReleased && inventoryUI.isDragging) {
    handleItemDrop(ecs, playerId, inventory, equipment, inventoryUI, mousePos);
    inventoryUI.isDragging = false;
    inventoryUI.dragItemId = undefined;
    inventoryUI.dragSourceSlot = undefined;
  }

  // Handle keyboard navigation
  if (LJS.keyWasPressed('ArrowUp')) {
    if (inventoryUI.selectedItemIndex > 0) {
      inventoryUI.selectedItemIndex--;
      updateScrollForSelection(inventoryUI);
    }
  }

  if (LJS.keyWasPressed('ArrowDown')) {
    if (inventoryUI.selectedItemIndex < inventory.items.length - 1) {
      inventoryUI.selectedItemIndex++;
      updateScrollForSelection(inventoryUI);
    }
  }

  // Toggle details panel
  if (LJS.keyWasPressed('Space') || LJS.keyWasPressed('Enter')) {
    if (
      inventoryUI.selectedItemIndex >= 0 &&
      inventoryUI.selectedItemIndex < inventory.items.length
    ) {
      inventoryUI.showDetails = !inventoryUI.showDetails;
      inventoryUI.detailsItemId =
        inventory.items[inventoryUI.selectedItemIndex];
    }
  }

  // Close inventory (I key only - ESC is reserved for debug overlay)
  if (LJS.keyWasPressed('KeyI')) {
    const viewMode = ecs.getComponent<ViewModeComponent>(playerId, 'viewMode');
    if (viewMode) {
      viewMode.mode = ViewMode.LOCATION;
    }
  }
}

/**
 * Handle item drop logic
 */
function handleItemDrop(
  ecs: ECS,
  playerId: number,
  inventory: InventoryComponent,
  equipment: EquipmentComponent | undefined,
  inventoryUI: InventoryUIComponent,
  mousePos: LJS.Vector2
): void {
  if (!inventoryUI.dragItemId) return;

  const dragItemId = inventoryUI.dragItemId;
  const dragItem = ecs.getComponent<ItemComponent>(dragItemId, 'item');
  if (!dragItem) return;

  // Check if dropping on equipment slot
  if (equipment) {
    const targetSlot = getEquipmentSlotAt(mousePos.x, mousePos.y);
    if (targetSlot) {
      // Validate slot compatibility
      if (canEquipToSlot(dragItem, targetSlot)) {
        // Unequip from source if coming from equipment
        if (inventoryUI.dragSourceSlot) {
          (equipment as any)[inventoryUI.dragSourceSlot] = undefined;
          // Add back to inventory
          if (!inventory.items.includes(dragItemId)) {
            inventory.items.push(dragItemId);
          }
        }

        // Handle existing item in target slot
        const existingItemId = (equipment as any)[targetSlot];
        if (existingItemId !== undefined) {
          // Move existing item to inventory
          if (!inventory.items.includes(existingItemId)) {
            inventory.items.push(existingItemId);
          }
          const existingItem = ecs.getComponent<ItemComponent>(
            existingItemId,
            'item'
          );
          if (existingItem) {
            existingItem.equipped = false;
          }
        }

        // Equip item to target slot
        (equipment as any)[targetSlot] = dragItemId;
        dragItem.equipped = true;
        dragItem.equipSlot = targetSlot as EquipmentSlot;

        // Remove from inventory if it's there
        const invIndex = inventory.items.indexOf(dragItemId);
        if (invIndex >= 0) {
          inventory.items.splice(invIndex, 1);
        }

        console.log(`[inventoryUI] Equipped ${dragItem.name} to ${targetSlot}`);
      } else {
        console.log(
          `[inventoryUI] Cannot equip ${dragItem.name} to ${targetSlot} slot`
        );
      }
      return;
    }
  }

  // Check if dropping back to inventory
  const invBounds = getInventoryBounds();

  if (isPointInRect(mousePos.x, mousePos.y, invBounds)) {
    // If coming from equipment, unequip it
    if (inventoryUI.dragSourceSlot && equipment) {
      (equipment as any)[inventoryUI.dragSourceSlot] = undefined;
      dragItem.equipped = false;
      dragItem.equipSlot = undefined;

      // Add to inventory if not already there
      if (!inventory.items.includes(dragItemId)) {
        inventory.items.push(dragItemId);
      }

      console.log(`[inventoryUI] Unequipped ${dragItem.name}`);
    }
  }
}

/**
 * Render the complete inventory UI
 */
function renderInventoryUI(
  ecs: ECS,
  inventory: InventoryComponent,
  equipment: EquipmentComponent | undefined,
  inventoryUI: InventoryUIComponent
): void {
  // Render inventory panel
  renderInventoryPanel(ecs, inventory, inventoryUI);

  // Render equipment panel
  if (equipment) {
    renderEquipmentPanel(ecs, equipment, inventoryUI);
  }

  // Render details panel
  if (inventoryUI.showDetails && inventoryUI.detailsItemId) {
    renderDetailsPanel(ecs, inventoryUI.detailsItemId);
  }

  // Render tooltip
  if (inventoryUI.hoverItemId && !inventoryUI.isDragging) {
    renderItemTooltip(ecs, inventoryUI.hoverItemId, LJS.mousePos);
  }

  // Render dragged item (follows mouse)
  if (inventoryUI.isDragging && inventoryUI.dragItemId) {
    renderDraggedItem(ecs, inventoryUI.dragItemId, LJS.mousePos);
  }

  // Render instructions
  renderInstructions();
}

/**
 * Render inventory panel (backpack items)
 */
function renderInventoryPanel(
  ecs: ECS,
  inventory: InventoryComponent,
  inventoryUI: InventoryUIComponent
): void {
  const bounds = getInventoryBounds();
  const x = bounds.x;
  const y = bounds.y;
  const w = bounds.width;
  const h = bounds.height;

  // Draw panel background
  drawRectScreen(x, y, w, h, UI_CONFIG.BG_COLOR);
  drawRectOutlineScreen(x, y, w, h, UI_CONFIG.BORDER_COLOR, 2);

  // Draw title
  LJS.drawTextScreen(
    'Inventory',
    LJS.vec2(x + w / 2, y + 15),
    UI_CONFIG.TITLE_FONT_SIZE,
    UI_CONFIG.TITLE_COLOR,
    undefined,
    undefined,
    'center'
  );

  // Draw capacity info
  const capacityText = `Weight: ${inventory.currentWeight.toFixed(1)} / ${100}`;
  LJS.drawTextScreen(
    capacityText,
    LJS.vec2(x + w - 10, y + 15),
    UI_CONFIG.SMALL_FONT_SIZE,
    UI_CONFIG.TEXT_COLOR,
    undefined,
    undefined,
    'right'
  );

  // Draw item slots
  const startY = y + UI_CONFIG.INVENTORY_TITLE_HEIGHT + 10;
  const slotSize = UI_CONFIG.ITEM_SLOT_SIZE;
  const spacing = UI_CONFIG.ITEM_SLOT_SPACING;
  const itemsPerRow = UI_CONFIG.ITEMS_PER_ROW;

  // Calculate visible range based on scroll
  const startIndex = inventoryUI.scrollOffset * itemsPerRow;
  const endIndex = Math.min(
    startIndex + UI_CONFIG.VISIBLE_ROWS * itemsPerRow,
    inventory.items.length
  );

  for (let i = startIndex; i < endIndex; i++) {
    const itemId = inventory.items[i];
    const item = ecs.getComponent<ItemComponent>(itemId, 'item');
    if (!item) continue;

    const localIndex = i - startIndex;
    const row = Math.floor(localIndex / itemsPerRow);
    const col = localIndex % itemsPerRow;

    const slotX = x + 10 + col * (slotSize + spacing);
    const slotY = startY + row * (slotSize + spacing);

    // Don't render if being dragged
    if (inventoryUI.isDragging && itemId === inventoryUI.dragItemId) {
      continue;
    }

    // Draw slot background
    let slotColor = UI_CONFIG.EMPTY_SLOT_COLOR;
    if (i === inventoryUI.selectedItemIndex) {
      slotColor = UI_CONFIG.SELECTED_COLOR;
    } else if (itemId === inventoryUI.hoverItemId) {
      slotColor = UI_CONFIG.HOVER_COLOR;
    }

    drawRectScreen(slotX, slotY, slotSize, slotSize, slotColor);
    drawRectOutlineScreen(
      slotX,
      slotY,
      slotSize,
      slotSize,
      UI_CONFIG.BORDER_COLOR,
      1
    );

    // Draw item name (abbreviated)
    const itemName =
      item.name.length > 8 ? item.name.substring(0, 7) + '...' : item.name;
    LJS.drawTextScreen(
      itemName,
      LJS.vec2(slotX + slotSize / 2, slotY + slotSize / 2),
      UI_CONFIG.SMALL_FONT_SIZE,
      UI_CONFIG.TEXT_COLOR,
      undefined,
      undefined,
      'center'
    );

    // Draw quantity if stackable
    if (item.stackable && item.quantity > 1) {
      LJS.drawTextScreen(
        `x${item.quantity}`,
        LJS.vec2(slotX + slotSize - 5, slotY + slotSize - 5),
        UI_CONFIG.SMALL_FONT_SIZE,
        UI_CONFIG.TITLE_COLOR,
        undefined,
        undefined,
        'right'
      );
    }
  }
}

/**
 * Render equipment panel (equipped items)
 */
function renderEquipmentPanel(
  ecs: ECS,
  equipment: EquipmentComponent,
  inventoryUI: InventoryUIComponent
): void {
  const bounds = getEquipmentBounds();
  const x = bounds.x;
  const y = bounds.y;
  const w = bounds.width;
  const h = bounds.height;

  // Draw panel background
  drawRectScreen(x, y, w, h, UI_CONFIG.BG_COLOR);
  drawRectOutlineScreen(x, y, w, h, UI_CONFIG.BORDER_COLOR, 2);

  // Draw title
  LJS.drawTextScreen(
    'Equipment',
    LJS.vec2(x + w / 2, y + 15),
    UI_CONFIG.TITLE_FONT_SIZE,
    UI_CONFIG.TITLE_COLOR,
    undefined,
    undefined,
    'center'
  );

  // Draw equipment slots
  for (const [slotName, layout] of Object.entries(EQUIPMENT_SLOT_LAYOUT)) {
    const slotX = x + w * layout.xPercent - UI_CONFIG.EQUIPMENT_SLOT_SIZE / 2;
    const slotY = y + h * layout.yPercent - UI_CONFIG.EQUIPMENT_SLOT_SIZE / 2;
    const slotSize = UI_CONFIG.EQUIPMENT_SLOT_SIZE;

    const itemId = (equipment as any)[slotName];
    const isHovered = slotName === inventoryUI.hoverEquipSlot;

    // Don't render if being dragged
    if (inventoryUI.isDragging && itemId === inventoryUI.dragItemId) {
      // Draw empty slot
      drawRectScreen(
        slotX,
        slotY,
        slotSize,
        slotSize,
        UI_CONFIG.EMPTY_SLOT_COLOR
      );
      drawRectOutlineScreen(
        slotX,
        slotY,
        slotSize,
        slotSize,
        UI_CONFIG.BORDER_COLOR,
        1
      );
    } else {
      // Draw slot
      const slotColor = isHovered
        ? UI_CONFIG.HOVER_COLOR
        : UI_CONFIG.EMPTY_SLOT_COLOR;
      drawRectScreen(slotX, slotY, slotSize, slotSize, slotColor);
      drawRectOutlineScreen(
        slotX,
        slotY,
        slotSize,
        slotSize,
        UI_CONFIG.BORDER_COLOR,
        1
      );

      // Draw item if equipped
      if (itemId !== undefined) {
        const item = ecs.getComponent<ItemComponent>(itemId, 'item');
        if (item) {
          const itemName =
            item.name.length > 6 ? item.name.substring(0, 5) + '.' : item.name;
          LJS.drawTextScreen(
            itemName,
            LJS.vec2(slotX + slotSize / 2, slotY + slotSize / 2),
            UI_CONFIG.SMALL_FONT_SIZE,
            UI_CONFIG.TEXT_COLOR,
            undefined,
            undefined,
            'center'
          );
        }
      }
    }

    // Draw slot label
    LJS.drawTextScreen(
      layout.label,
      LJS.vec2(slotX + slotSize / 2, slotY - 10),
      UI_CONFIG.SMALL_FONT_SIZE,
      UI_CONFIG.TEXT_COLOR,
      undefined,
      undefined,
      'center'
    );
  }
}

/**
 * Render item details panel
 */
function renderDetailsPanel(ecs: ECS, itemId: number): void {
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item) return;

  const bounds = getDetailsBounds();
  const x = bounds.x;
  const y = bounds.y;
  const w = bounds.width;
  const h = bounds.height;

  // Draw panel background
  drawRectScreen(x, y, w, h, UI_CONFIG.BG_COLOR);
  drawRectOutlineScreen(x, y, w, h, UI_CONFIG.BORDER_COLOR, 2);

  // Draw item name
  LJS.drawTextScreen(
    item.name,
    LJS.vec2(x + 10, y + 20),
    UI_CONFIG.TEXT_FONT_SIZE,
    UI_CONFIG.TITLE_COLOR,
    undefined,
    undefined,
    'left'
  );

  // Draw description
  LJS.drawTextScreen(
    item.description,
    LJS.vec2(x + 10, y + 45),
    UI_CONFIG.SMALL_FONT_SIZE,
    UI_CONFIG.TEXT_COLOR,
    undefined,
    undefined,
    'left'
  );

  // Draw properties
  let propY = y + 70;
  const props = [
    `Type: ${item.itemType}`,
    `Weight: ${item.weight}`,
    `Value: ${item.value}`,
    `Material: ${item.material}`,
  ];

  for (const prop of props) {
    LJS.drawTextScreen(
      prop,
      LJS.vec2(x + 10, propY),
      UI_CONFIG.SMALL_FONT_SIZE,
      UI_CONFIG.TEXT_COLOR,
      undefined,
      undefined,
      'left'
    );
    propY += 18;
  }
}

/**
 * Render tooltip for hovered item
 */
function renderItemTooltip(
  ecs: ECS,
  itemId: number,
  mousePos: LJS.Vector2
): void {
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item) return;

  const tooltipWidth = 200;
  const tooltipHeight = 80;
  const offsetX = 15;
  const offsetY = -15;

  const x = mousePos.x + offsetX;
  const y = mousePos.y + offsetY;

  // Draw tooltip background
  drawRectScreen(x, y, tooltipWidth, tooltipHeight, UI_CONFIG.BG_COLOR);
  drawRectOutlineScreen(
    x,
    y,
    tooltipWidth,
    tooltipHeight,
    UI_CONFIG.BORDER_COLOR,
    2
  );

  // Draw item name
  LJS.drawTextScreen(
    item.name,
    LJS.vec2(x + 10, y + 15),
    UI_CONFIG.TEXT_FONT_SIZE,
    UI_CONFIG.TITLE_COLOR,
    undefined,
    undefined,
    'left'
  );

  // Draw quick info
  LJS.drawTextScreen(
    `${item.itemType} (${item.weight} lbs)`,
    LJS.vec2(x + 10, y + 35),
    UI_CONFIG.SMALL_FONT_SIZE,
    UI_CONFIG.TEXT_COLOR,
    undefined,
    undefined,
    'left'
  );

  LJS.drawTextScreen(
    `Value: ${item.value}g`,
    LJS.vec2(x + 10, y + 55),
    UI_CONFIG.SMALL_FONT_SIZE,
    UI_CONFIG.TEXT_COLOR,
    undefined,
    undefined,
    'left'
  );
}

/**
 * Render item being dragged (follows mouse)
 */
function renderDraggedItem(
  ecs: ECS,
  itemId: number,
  mousePos: LJS.Vector2
): void {
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item) return;

  const size = 50;

  // Draw semi-transparent item
  drawRectScreen(
    mousePos.x - size / 2,
    mousePos.y - size / 2,
    size,
    size,
    UI_CONFIG.DRAG_COLOR
  );
  drawRectOutlineScreen(
    mousePos.x - size / 2,
    mousePos.y - size / 2,
    size,
    size,
    UI_CONFIG.BORDER_COLOR,
    2
  );

  // Draw item name
  const itemName =
    item.name.length > 8 ? item.name.substring(0, 7) + '...' : item.name;
  LJS.drawTextScreen(
    itemName,
    LJS.vec2(mousePos.x, mousePos.y),
    UI_CONFIG.SMALL_FONT_SIZE,
    UI_CONFIG.TEXT_COLOR,
    undefined,
    undefined,
    'center'
  );
}

/**
 * Render UI instructions
 */
function renderInstructions(): void {
  const instructions = [
    'I: Close',
    'Mouse: Drag items',
    'Arrows: Navigate',
    'Space: Details',
  ];

  let instrY = 20;
  for (const instr of instructions) {
    LJS.drawTextScreen(
      instr,
      LJS.vec2(20, instrY),
      UI_CONFIG.SMALL_FONT_SIZE,
      UI_CONFIG.TEXT_COLOR,
      undefined,
      undefined,
      'left'
    );
    instrY += 16;
  }
}

/**
 * Helper: Check if point is inside rectangle
 */
function isPointInRect(
  x: number,
  y: number,
  rect: {
    x: number;
    y: number;
    w?: number;
    h?: number;
    width?: number;
    height?: number;
  }
): boolean {
  const w = rect.w ?? rect.width ?? 0;
  const h = rect.h ?? rect.height ?? 0;
  return x >= rect.x && x <= rect.x + w && y >= rect.y && y <= rect.y + h;
}

/**
 * Helper: Get inventory item index at mouse position
 */
function getInventoryItemAt(
  mouseX: number,
  mouseY: number,
  scrollOffset: number
): number {
  const bounds = getInventoryBounds();
  const x = bounds.x;
  const y = bounds.y;
  const startY = y + UI_CONFIG.INVENTORY_TITLE_HEIGHT + 10;
  const slotSize = UI_CONFIG.ITEM_SLOT_SIZE;
  const spacing = UI_CONFIG.ITEM_SLOT_SPACING;
  const itemsPerRow = UI_CONFIG.ITEMS_PER_ROW;

  // Calculate which slot is clicked
  const col = Math.floor((mouseX - x - 10) / (slotSize + spacing));
  const row = Math.floor((mouseY - startY) / (slotSize + spacing));

  if (col < 0 || col >= itemsPerRow || row < 0) {
    return -1;
  }

  return scrollOffset * itemsPerRow + row * itemsPerRow + col;
}

/**
 * Helper: Get equipment slot at mouse position
 */
function getEquipmentSlotAt(
  mouseX: number,
  mouseY: number
): string | undefined {
  const bounds = getEquipmentBounds();
  const x = bounds.x;
  const y = bounds.y;
  const w = bounds.width;
  const h = bounds.height;
  const slotSize = UI_CONFIG.EQUIPMENT_SLOT_SIZE;

  for (const [slotName, layout] of Object.entries(EQUIPMENT_SLOT_LAYOUT)) {
    const slotX = x + w * layout.xPercent - slotSize / 2;
    const slotY = y + h * layout.yPercent - slotSize / 2;

    if (
      mouseX >= slotX &&
      mouseX <= slotX + slotSize &&
      mouseY >= slotY &&
      mouseY <= slotY + slotSize
    ) {
      return slotName;
    }
  }

  return undefined;
}

/**
 * Helper: Check if item can be equipped to slot
 */
function canEquipToSlot(item: ItemComponent, slot: string): boolean {
  if (
    !item.equipSlot &&
    item.itemType !== 'weapon' &&
    item.itemType !== 'armor'
  ) {
    return false;
  }

  // Simple validation - in real game, check item's equipSlot property
  if (item.itemType === 'weapon') {
    return slot === 'mainHand' || slot === 'offHand';
  }

  if (item.itemType === 'armor') {
    // Armor can go in most slots - validate based on item's equipSlot
    return true;
  }

  return false;
}

/**
 * Helper: Update scroll to keep selection visible
 */
function updateScrollForSelection(inventoryUI: InventoryUIComponent): void {
  const selectedRow = Math.floor(
    inventoryUI.selectedItemIndex / UI_CONFIG.ITEMS_PER_ROW
  );

  // Scroll up if selection is above visible area
  if (selectedRow < inventoryUI.scrollOffset) {
    inventoryUI.scrollOffset = selectedRow;
  }

  // Scroll down if selection is below visible area
  if (selectedRow >= inventoryUI.scrollOffset + UI_CONFIG.VISIBLE_ROWS) {
    inventoryUI.scrollOffset = selectedRow - UI_CONFIG.VISIBLE_ROWS + 1;
  }
}
