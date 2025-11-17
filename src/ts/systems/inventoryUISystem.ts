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

import ECS from '../ecs';
import {
  EquipmentComponent,
  InventoryComponent,
  InventoryPanel,
  InventoryUIComponent,
  ItemComponent,
  ViewMode,
  ViewModeComponent,
} from '../components';
import { EquipmentSlot } from '../components/item';

/**
 * Inventory UI Layout Constants
 */
const UI_CONFIG = {
  // Screen layout
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600,
  PANEL_PADDING: 20,

  // Inventory panel (left side)
  INVENTORY_X: 50,
  INVENTORY_Y: 50,
  INVENTORY_WIDTH: 350,
  INVENTORY_HEIGHT: 500,
  INVENTORY_TITLE_HEIGHT: 30,
  ITEM_SLOT_SIZE: 40,
  ITEM_SLOT_SPACING: 5,
  ITEMS_PER_ROW: 7,
  VISIBLE_ROWS: 10,

  // Equipment panel (right side)
  EQUIPMENT_X: 450,
  EQUIPMENT_Y: 50,
  EQUIPMENT_WIDTH: 300,
  EQUIPMENT_HEIGHT: 500,
  EQUIPMENT_SLOT_SIZE: 50,
  EQUIPMENT_SLOT_SPACING: 10,

  // Details panel (bottom)
  DETAILS_X: 50,
  DETAILS_Y: 560,
  DETAILS_WIDTH: 700,
  DETAILS_HEIGHT: 150,

  // Colors
  BG_COLOR: new LJS.Color(0.1, 0.1, 0.1, 0.9),
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
 * Maps equipment slot names to UI positions
 */
const EQUIPMENT_SLOT_LAYOUT: Record<
  string,
  { x: number; y: number; label: string }
> = {
  head: { x: 125, y: 50, label: 'Head' },
  face: { x: 125, y: 110, label: 'Face' },
  neck: { x: 125, y: 170, label: 'Neck' },
  body: { x: 125, y: 230, label: 'Body' },
  back: { x: 50, y: 230, label: 'Back' },
  belt: { x: 125, y: 290, label: 'Belt' },
  legs: { x: 125, y: 350, label: 'Legs' },
  feet: { x: 125, y: 410, label: 'Feet' },
  mainHand: { x: 50, y: 350, label: 'Main' },
  offHand: { x: 200, y: 350, label: 'Off' },
  ringLeft: { x: 50, y: 410, label: 'Ring L' },
  ringRight: { x: 200, y: 410, label: 'Ring R' },
};

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
  const invBounds = {
    x: UI_CONFIG.INVENTORY_X,
    y: UI_CONFIG.INVENTORY_Y,
    w: UI_CONFIG.INVENTORY_WIDTH,
    h: UI_CONFIG.INVENTORY_HEIGHT,
  };

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

  // Close inventory (I key or Escape)
  if (LJS.keyWasPressed('KeyI') || LJS.keyWasPressed('Escape')) {
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
  const invBounds = {
    x: UI_CONFIG.INVENTORY_X,
    y: UI_CONFIG.INVENTORY_Y,
    w: UI_CONFIG.INVENTORY_WIDTH,
    h: UI_CONFIG.INVENTORY_HEIGHT,
  };

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
  const x = UI_CONFIG.INVENTORY_X;
  const y = UI_CONFIG.INVENTORY_Y;
  const w = UI_CONFIG.INVENTORY_WIDTH;
  const h = UI_CONFIG.INVENTORY_HEIGHT;

  // Draw panel background
  LJS.drawRect(
    LJS.vec2(x + w / 2, y + h / 2),
    LJS.vec2(w, h),
    UI_CONFIG.BG_COLOR
  );
  drawRectOutline(
    LJS.vec2(x + w / 2, y + h / 2),
    LJS.vec2(w, h),
    2,
    UI_CONFIG.BORDER_COLOR
  );

  // Draw title
  LJS.drawText(
    'Inventory',
    LJS.vec2(x + w / 2, y + 15),
    UI_CONFIG.TITLE_FONT_SIZE,
    UI_CONFIG.TITLE_COLOR,
    0,
    undefined,
    'center'
  );

  // Draw capacity info
  const capacityText = `Weight: ${inventory.currentWeight.toFixed(1)} / ${100}`;
  LJS.drawText(
    capacityText,
    LJS.vec2(x + w - 50, y + 15),
    UI_CONFIG.SMALL_FONT_SIZE,
    UI_CONFIG.TEXT_COLOR,
    0,
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

    LJS.drawRect(
      LJS.vec2(slotX + slotSize / 2, slotY + slotSize / 2),
      LJS.vec2(slotSize, slotSize),
      slotColor
    );
    drawRectOutline(
      LJS.vec2(slotX + slotSize / 2, slotY + slotSize / 2),
      LJS.vec2(slotSize, slotSize),
      1,
      UI_CONFIG.BORDER_COLOR
    );

    // Draw item name (abbreviated)
    const itemName =
      item.name.length > 8 ? item.name.substring(0, 7) + '...' : item.name;
    LJS.drawText(
      itemName,
      LJS.vec2(slotX + slotSize / 2, slotY + slotSize / 2),
      UI_CONFIG.SMALL_FONT_SIZE,
      UI_CONFIG.TEXT_COLOR,
      0,
      undefined,
      'center'
    );

    // Draw quantity if stackable
    if (item.stackable && item.quantity > 1) {
      LJS.drawText(
        `x${item.quantity}`,
        LJS.vec2(slotX + slotSize - 5, slotY + slotSize - 5),
        UI_CONFIG.SMALL_FONT_SIZE,
        UI_CONFIG.TITLE_COLOR,
        0,
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
  const x = UI_CONFIG.EQUIPMENT_X;
  const y = UI_CONFIG.EQUIPMENT_Y;
  const w = UI_CONFIG.EQUIPMENT_WIDTH;
  const h = UI_CONFIG.EQUIPMENT_HEIGHT;

  // Draw panel background
  LJS.drawRect(
    LJS.vec2(x + w / 2, y + h / 2),
    LJS.vec2(w, h),
    UI_CONFIG.BG_COLOR
  );
  drawRectOutline(
    LJS.vec2(x + w / 2, y + h / 2),
    LJS.vec2(w, h),
    2,
    UI_CONFIG.BORDER_COLOR
  );

  // Draw title
  LJS.drawText(
    'Equipment',
    LJS.vec2(x + w / 2, y + 15),
    UI_CONFIG.TITLE_FONT_SIZE,
    UI_CONFIG.TITLE_COLOR,
    0,
    undefined,
    'center'
  );

  // Draw equipment slots
  for (const [slotName, layout] of Object.entries(EQUIPMENT_SLOT_LAYOUT)) {
    const slotX = x + layout.x;
    const slotY = y + layout.y;
    const slotSize = UI_CONFIG.EQUIPMENT_SLOT_SIZE;

    const itemId = (equipment as any)[slotName];
    const isHovered = slotName === inventoryUI.hoverEquipSlot;

    // Don't render if being dragged
    if (inventoryUI.isDragging && itemId === inventoryUI.dragItemId) {
      // Draw empty slot
      LJS.drawRect(
        LJS.vec2(slotX, slotY),
        LJS.vec2(slotSize, slotSize),
        UI_CONFIG.EMPTY_SLOT_COLOR
      );
      drawRectOutline(
        LJS.vec2(slotX, slotY),
        LJS.vec2(slotSize, slotSize),
        1,
        UI_CONFIG.BORDER_COLOR
      );
    } else {
      // Draw slot
      const slotColor = isHovered
        ? UI_CONFIG.HOVER_COLOR
        : UI_CONFIG.EMPTY_SLOT_COLOR;
      LJS.drawRect(
        LJS.vec2(slotX, slotY),
        LJS.vec2(slotSize, slotSize),
        slotColor
      );
      drawRectOutline(
        LJS.vec2(slotX, slotY),
        LJS.vec2(slotSize, slotSize),
        1,
        UI_CONFIG.BORDER_COLOR
      );

      // Draw item if equipped
      if (itemId !== undefined) {
        const item = ecs.getComponent<ItemComponent>(itemId, 'item');
        if (item) {
          const itemName =
            item.name.length > 6 ? item.name.substring(0, 5) + '.' : item.name;
          LJS.drawText(
            itemName,
            LJS.vec2(slotX, slotY),
            UI_CONFIG.SMALL_FONT_SIZE,
            UI_CONFIG.TEXT_COLOR,
            0,
            undefined,
            'center'
          );
        }
      }
    }

    // Draw slot label
    LJS.drawText(
      layout.label,
      LJS.vec2(slotX, slotY - slotSize / 2 - 10),
      UI_CONFIG.SMALL_FONT_SIZE,
      UI_CONFIG.TEXT_COLOR,
      0,
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

  const x = UI_CONFIG.DETAILS_X;
  const y = UI_CONFIG.DETAILS_Y;
  const w = UI_CONFIG.DETAILS_WIDTH;
  const h = UI_CONFIG.DETAILS_HEIGHT;

  // Draw panel background
  LJS.drawRect(
    LJS.vec2(x + w / 2, y + h / 2),
    LJS.vec2(w, h),
    UI_CONFIG.BG_COLOR
  );
  drawRectOutline(
    LJS.vec2(x + w / 2, y + h / 2),
    LJS.vec2(w, h),
    2,
    UI_CONFIG.BORDER_COLOR
  );

  // Draw item name
  LJS.drawText(
    item.name,
    LJS.vec2(x + 10, y + 20),
    UI_CONFIG.TEXT_FONT_SIZE,
    UI_CONFIG.TITLE_COLOR,
    0,
    undefined,
    'left'
  );

  // Draw description
  LJS.drawText(
    item.description,
    LJS.vec2(x + 10, y + 45),
    UI_CONFIG.SMALL_FONT_SIZE,
    UI_CONFIG.TEXT_COLOR,
    0,
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
    LJS.drawText(
      prop,
      LJS.vec2(x + 10, propY),
      UI_CONFIG.SMALL_FONT_SIZE,
      UI_CONFIG.TEXT_COLOR,
      0,
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
  LJS.drawRect(
    LJS.vec2(x + tooltipWidth / 2, y - tooltipHeight / 2),
    LJS.vec2(tooltipWidth, tooltipHeight),
    UI_CONFIG.BG_COLOR
  );
  drawRectOutline(
    LJS.vec2(x + tooltipWidth / 2, y - tooltipHeight / 2),
    LJS.vec2(tooltipWidth, tooltipHeight),
    2,
    UI_CONFIG.BORDER_COLOR
  );

  // Draw item name
  LJS.drawText(
    item.name,
    LJS.vec2(x + 10, y - 10),
    UI_CONFIG.TEXT_FONT_SIZE,
    UI_CONFIG.TITLE_COLOR,
    0,
    undefined,
    'left'
  );

  // Draw quick info
  LJS.drawText(
    `${item.itemType} (${item.weight} lbs)`,
    LJS.vec2(x + 10, y - 30),
    UI_CONFIG.SMALL_FONT_SIZE,
    UI_CONFIG.TEXT_COLOR,
    0,
    undefined,
    'left'
  );

  LJS.drawText(
    `Value: ${item.value}g`,
    LJS.vec2(x + 10, y - 48),
    UI_CONFIG.SMALL_FONT_SIZE,
    UI_CONFIG.TEXT_COLOR,
    0,
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
  LJS.drawRect(
    LJS.vec2(mousePos.x, mousePos.y),
    LJS.vec2(size, size),
    UI_CONFIG.DRAG_COLOR
  );
  drawRectOutline(
    LJS.vec2(mousePos.x, mousePos.y),
    LJS.vec2(size, size),
    2,
    UI_CONFIG.BORDER_COLOR
  );

  // Draw item name
  const itemName =
    item.name.length > 8 ? item.name.substring(0, 7) + '...' : item.name;
  LJS.drawText(
    itemName,
    LJS.vec2(mousePos.x, mousePos.y),
    UI_CONFIG.SMALL_FONT_SIZE,
    UI_CONFIG.TEXT_COLOR,
    0,
    undefined,
    'center'
  );
}

/**
 * Render UI instructions
 */
function renderInstructions(): void {
  const instructions = [
    'I/ESC: Close',
    'Mouse: Drag items',
    'Arrows: Navigate',
    'Space: Details',
  ];

  let instrY = 20;
  for (const instr of instructions) {
    LJS.drawText(
      instr,
      LJS.vec2(20, instrY),
      UI_CONFIG.SMALL_FONT_SIZE,
      UI_CONFIG.TEXT_COLOR,
      0,
      undefined,
      'left'
    );
    instrY += 16;
  }
}

/**
 * Helper: Draw rectangle outline using thin border rects
 */
function drawRectOutline(
  pos: LJS.Vector2,
  size: LJS.Vector2,
  thickness: number,
  color: LJS.Color
): void {
  const halfW = size.x / 2;
  const halfH = size.y / 2;

  // Top border
  LJS.drawRect(
    LJS.vec2(pos.x, pos.y + halfH),
    LJS.vec2(size.x, thickness),
    color
  );

  // Bottom border
  LJS.drawRect(
    LJS.vec2(pos.x, pos.y - halfH),
    LJS.vec2(size.x, thickness),
    color
  );

  // Left border
  LJS.drawRect(
    LJS.vec2(pos.x - halfW, pos.y),
    LJS.vec2(thickness, size.y),
    color
  );

  // Right border
  LJS.drawRect(
    LJS.vec2(pos.x + halfW, pos.y),
    LJS.vec2(thickness, size.y),
    color
  );
}

/**
 * Helper: Check if point is inside rectangle
 */
function isPointInRect(
  x: number,
  y: number,
  rect: { x: number; y: number; w: number; h: number }
): boolean {
  return (
    x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
  );
}

/**
 * Helper: Get inventory item index at mouse position
 */
function getInventoryItemAt(
  mouseX: number,
  mouseY: number,
  scrollOffset: number
): number {
  const x = UI_CONFIG.INVENTORY_X;
  const startY = UI_CONFIG.INVENTORY_Y + UI_CONFIG.INVENTORY_TITLE_HEIGHT + 10;
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
  const x = UI_CONFIG.EQUIPMENT_X;
  const y = UI_CONFIG.EQUIPMENT_Y;
  const slotSize = UI_CONFIG.EQUIPMENT_SLOT_SIZE;

  for (const [slotName, layout] of Object.entries(EQUIPMENT_SLOT_LAYOUT)) {
    const slotX = x + layout.x;
    const slotY = y + layout.y;

    if (
      mouseX >= slotX - slotSize / 2 &&
      mouseX <= slotX + slotSize / 2 &&
      mouseY >= slotY - slotSize / 2 &&
      mouseY <= slotY + slotSize / 2
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
