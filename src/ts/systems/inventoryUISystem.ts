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
import { InventoryUIComponent } from '../components/inventoryUI';
import { InventoryComponent } from '../components/inventory';
import { EquipmentComponent } from '../components/equipment';
import { ItemComponent } from '../components/item';
import { RenderComponent } from '../components/render';
import { DerivedStats, StatsComponent } from '../components/stats';

/**
 * UI Layout Constants
 */
const UI = {
  // Screen positioning
  PANEL_WIDTH: 400,
  PANEL_HEIGHT: 500,
  PADDING: 10,
  
  // Inventory grid
  GRID_COLS: 8,
  GRID_ROWS: 6,
  SLOT_SIZE: 40,
  SLOT_SPACING: 4,
  
  // Equipment panel
  EQUIP_SLOT_SIZE: 50,
  EQUIP_SPACING: 8,
  
  // Colors
  BG_COLOR: new LJS.Color(0.1, 0.1, 0.15, 0.95),
  SLOT_COLOR: new LJS.Color(0.2, 0.2, 0.25, 1),
  SLOT_HOVER_COLOR: new LJS.Color(0.3, 0.3, 0.4, 1),
  SLOT_SELECTED_COLOR: new LJS.Color(0.4, 0.5, 0.6, 1),
  BORDER_COLOR: new LJS.Color(0.5, 0.5, 0.6, 1),
  TEXT_COLOR: new LJS.Color(1, 1, 1, 1),
  TEXT_SHADOW: new LJS.Color(0, 0, 0, 0.8),
  
  // Item quality colors
  QUALITY_COLORS: {
    normal: new LJS.Color(1, 1, 1, 1),
    blessed: new LJS.Color(0.3, 0.8, 1, 1),
    cursed: new LJS.Color(0.8, 0.2, 0.2, 1),
  },
};

/**
 * Inventory UI Input System
 * Handles keyboard input for opening/closing inventory
 */
export function inventoryUIInputSystem(ecs: ECS): void {
  const entities = ecs.query('player', 'inventoryUI');
  
  for (const entityId of entities) {
    const uiState = ecs.getComponent<InventoryUIComponent>(entityId, 'inventoryUI');
    if (!uiState) continue;
    
    // Toggle inventory with 'I' key
    if (LJS.keyWasPressed('KeyI')) {
      uiState.isOpen = !uiState.isOpen;
      
      // Reset UI state when closing
      if (!uiState.isOpen) {
        uiState.hoveredItemId = undefined;
        uiState.hoveredSlot = undefined;
        uiState.draggedItemId = undefined;
        uiState.dragSource = undefined;
        uiState.dragSourceSlot = undefined;
      }
    }
    
    // Close inventory with ESC key
    if (uiState.isOpen && LJS.keyWasPressed('Escape')) {
      uiState.isOpen = false;
      uiState.hoveredItemId = undefined;
      uiState.hoveredSlot = undefined;
      uiState.draggedItemId = undefined;
      uiState.dragSource = undefined;
      uiState.dragSourceSlot = undefined;
    }
    
    // Tab switching (Q/E for inventory/equipment)
    if (uiState.isOpen) {
      if (LJS.keyWasPressed('KeyQ')) {
        uiState.activeTab = 'inventory';
      }
      if (LJS.keyWasPressed('KeyE')) {
        uiState.activeTab = 'equipment';
      }
    }
  }
}

/**
 * Inventory UI Mouse Interaction System
 * Handles mouse hover, click, and drag-drop
 */
export function inventoryUIMouseSystem(ecs: ECS): void {
  const entities = ecs.query('player', 'inventoryUI', 'inventory');
  
  for (const entityId of entities) {
    const uiState = ecs.getComponent<InventoryUIComponent>(entityId, 'inventoryUI');
    const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
    const equipment = ecs.getComponent<EquipmentComponent>(entityId, 'equipment');
    
    if (!uiState || !inventory || !uiState.isOpen) continue;
    
    const mousePos = LJS.mousePos;
    const screenCenter = LJS.vec2(LJS.mainCanvasSize.x / 2, LJS.mainCanvasSize.y / 2);
    
    // Calculate panel position (centered on screen)
    const panelX = screenCenter.x - UI.PANEL_WIDTH / 2;
    const panelY = screenCenter.y - UI.PANEL_HEIGHT / 2;
    
    // Check mouse within panel bounds
    const mouseInPanel = 
      mousePos.x >= panelX && 
      mousePos.x <= panelX + UI.PANEL_WIDTH &&
      mousePos.y >= panelY && 
      mousePos.y <= panelY + UI.PANEL_HEIGHT;
    
    if (!mouseInPanel) {
      uiState.hoveredItemId = undefined;
      uiState.hoveredSlot = undefined;
      return;
    }
    
    // Handle inventory tab interactions
    if (uiState.activeTab === 'inventory') {
      handleInventoryGridInteraction(ecs, entityId, uiState, inventory, mousePos, panelX, panelY);
    }
    
    // Handle equipment tab interactions
    if (uiState.activeTab === 'equipment' && equipment) {
      handleEquipmentSlotInteraction(ecs, entityId, uiState, equipment, mousePos, panelX, panelY);
    }
    
    // Handle drag-drop
    if (LJS.mouseIsDown(0)) {
      // Start drag
      if (!uiState.draggedItemId && uiState.hoveredItemId) {
        uiState.draggedItemId = uiState.hoveredItemId;
        uiState.dragSource = uiState.activeTab;
        if (uiState.hoveredSlot) {
          uiState.dragSourceSlot = uiState.hoveredSlot;
        }
      }
    } else if (uiState.draggedItemId) {
      // End drag - handle drop
      handleItemDrop(ecs, entityId, uiState, inventory, equipment);
      
      // Clear drag state
      uiState.draggedItemId = undefined;
      uiState.dragSource = undefined;
      uiState.dragSourceSlot = undefined;
    }
  }
}

/**
 * Handle mouse interaction with inventory grid
 */
function handleInventoryGridInteraction(
  ecs: ECS,
  entityId: number,
  uiState: InventoryUIComponent,
  inventory: InventoryComponent,
  mousePos: LJS.Vector2,
  panelX: number,
  panelY: number
): void {
  // Calculate grid area
  const gridStartX = panelX + UI.PADDING;
  const gridStartY = panelY + UI.PADDING + 30; // Leave space for tabs
  
  const relX = mousePos.x - gridStartX;
  const relY = mousePos.y - gridStartY;
  
  // Calculate which slot is hovered
  const col = Math.floor(relX / (UI.SLOT_SIZE + UI.SLOT_SPACING));
  const row = Math.floor(relY / (UI.SLOT_SIZE + UI.SLOT_SPACING));
  
  // Check if within grid bounds
  if (col >= 0 && col < UI.GRID_COLS && row >= 0 && row < UI.GRID_ROWS) {
    const slotIndex = row * UI.GRID_COLS + col;
    
    // Check if slot has item
    if (slotIndex < inventory.items.length) {
      uiState.hoveredItemId = inventory.items[slotIndex];
    } else {
      uiState.hoveredItemId = undefined;
    }
  } else {
    uiState.hoveredItemId = undefined;
  }
  
  uiState.hoveredSlot = undefined;
}

/**
 * Handle mouse interaction with equipment slots
 */
function handleEquipmentSlotInteraction(
  ecs: ECS,
  entityId: number,
  uiState: InventoryUIComponent,
  equipment: EquipmentComponent,
  mousePos: LJS.Vector2,
  panelX: number,
  panelY: number
): void {
  // Equipment slot layout
  const slots: Array<{name: keyof EquipmentComponent, x: number, y: number}> = [
    { name: 'head', x: 200, y: 50 },
    { name: 'neck', x: 200, y: 110 },
    { name: 'body', x: 200, y: 170 },
    { name: 'mainHand', x: 120, y: 170 },
    { name: 'offHand', x: 280, y: 170 },
    { name: 'legs', x: 200, y: 230 },
    { name: 'feet', x: 200, y: 290 },
    { name: 'ringLeft', x: 120, y: 230 },
    { name: 'ringRight', x: 280, y: 230 },
  ];
  
  uiState.hoveredItemId = undefined;
  uiState.hoveredSlot = undefined;
  
  for (const slot of slots) {
    const slotX = panelX + slot.x;
    const slotY = panelY + slot.y;
    
    // Check if mouse is over this slot
    if (
      mousePos.x >= slotX &&
      mousePos.x <= slotX + UI.EQUIP_SLOT_SIZE &&
      mousePos.y >= slotY &&
      mousePos.y <= slotY + UI.EQUIP_SLOT_SIZE
    ) {
      uiState.hoveredSlot = slot.name;
      const itemId = equipment[slot.name];
      if (itemId !== undefined) {
        uiState.hoveredItemId = itemId;
      }
      break;
    }
  }
}

/**
 * Handle item drop (equip/unequip/move)
 */
function handleItemDrop(
  ecs: ECS,
  entityId: number,
  uiState: InventoryUIComponent,
  inventory: InventoryComponent,
  equipment: EquipmentComponent | undefined
): void {
  if (!uiState.draggedItemId) return;
  
  const draggedItem = ecs.getComponent<ItemComponent>(uiState.draggedItemId, 'item');
  if (!draggedItem) return;
  
  // Dropping on equipment slot
  if (uiState.activeTab === 'equipment' && uiState.hoveredSlot && equipment) {
    equipItem(ecs, entityId, uiState.draggedItemId, uiState.hoveredSlot as keyof EquipmentComponent, equipment, inventory);
  }
  
  // Dropping on inventory (unequip)
  if (uiState.activeTab === 'inventory' && uiState.dragSource === 'equipment' && uiState.dragSourceSlot && equipment) {
    unequipItem(ecs, entityId, uiState.dragSourceSlot as keyof EquipmentComponent, equipment, inventory);
  }
}

/**
 * Equip an item from inventory
 */
function equipItem(
  ecs: ECS,
  entityId: number,
  itemId: number,
  slotName: keyof EquipmentComponent,
  equipment: EquipmentComponent,
  inventory: InventoryComponent
): void {
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item) return;
  
  // Check if item can be equipped in this slot
  if (item.equipSlot !== slotName) {
    console.log(`Cannot equip ${item.name} in ${slotName} slot`);
    return;
  }
  
  // Unequip existing item if present
  const existingItemId = equipment[slotName];
  if (existingItemId !== undefined) {
    unequipItem(ecs, entityId, slotName, equipment, inventory);
  }
  
  // Equip new item
  equipment[slotName] = itemId;
  item.equipped = true;
  
  // Remove from inventory
  const index = inventory.items.indexOf(itemId);
  if (index !== -1) {
    inventory.items.splice(index, 1);
  }
  
  console.log(`Equipped ${item.name} in ${slotName}`);
}

/**
 * Unequip an item to inventory
 */
function unequipItem(
  ecs: ECS,
  entityId: number,
  slotName: keyof EquipmentComponent,
  equipment: EquipmentComponent,
  inventory: InventoryComponent
): void {
  const itemId = equipment[slotName];
  if (itemId === undefined) return;
  
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item) return;
  
  // Check for cursed items
  if (item.blessState === 'cursed') {
    console.log(`Cannot unequip cursed item: ${item.name}`);
    return;
  }
  
  // Unequip
  equipment[slotName] = undefined;
  item.equipped = false;
  
  // Add to inventory
  inventory.items.push(itemId);
  
  console.log(`Unequipped ${item.name} from ${slotName}`);
}

/**
 * Inventory UI Render System
 * Renders the inventory/equipment UI panel
 */
export function inventoryUIRenderSystem(ecs: ECS): void {
  const entities = ecs.query('player', 'inventoryUI', 'inventory');
  
  for (const entityId of entities) {
    const uiState = ecs.getComponent<InventoryUIComponent>(entityId, 'inventoryUI');
    const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
    const equipment = ecs.getComponent<EquipmentComponent>(entityId, 'equipment');
    const stats = ecs.getComponent<StatsComponent>(entityId, 'stats');
    
    if (!uiState || !inventory || !uiState.isOpen) continue;
    
    // Switch to overlay camera for UI rendering
    LJS.setBlendMode(true);
    
    const screenCenter = LJS.vec2(LJS.mainCanvasSize.x / 2, LJS.mainCanvasSize.y / 2);
    const panelPos = LJS.vec2(screenCenter.x, screenCenter.y);
    const panelSize = LJS.vec2(UI.PANEL_WIDTH, UI.PANEL_HEIGHT);
    
    // Draw background panel
    LJS.drawRect(panelPos, panelSize, UI.BG_COLOR);
    LJS.drawRect(panelPos, panelSize.add(LJS.vec2(2, 2)), UI.BORDER_COLOR, 0, false);
    
    // Draw tabs
    renderTabs(uiState, panelPos, panelSize);
    
    // Render active tab content
    if (uiState.activeTab === 'inventory') {
      renderInventoryGrid(ecs, inventory, uiState, panelPos, stats);
    } else if (uiState.activeTab === 'equipment' && equipment) {
      renderEquipmentSlots(ecs, equipment, uiState, panelPos);
    }
    
    // Render dragged item (follows mouse)
    if (uiState.draggedItemId) {
      renderDraggedItem(ecs, uiState.draggedItemId);
    }
    
    // Render tooltip
    if (uiState.hoveredItemId && !uiState.draggedItemId) {
      renderItemTooltip(ecs, uiState.hoveredItemId);
    }
    
    LJS.setBlendMode(false);
  }
}

/**
 * Render tab buttons
 */
function renderTabs(
  uiState: InventoryUIComponent,
  panelPos: LJS.Vector2,
  panelSize: LJS.Vector2
): void {
  const tabY = panelPos.y - panelSize.y / 2 + 15;
  const tab1X = panelPos.x - panelSize.x / 4;
  const tab2X = panelPos.x + panelSize.x / 4;
  
  // Inventory tab
  const invColor = uiState.activeTab === 'inventory' ? UI.SLOT_SELECTED_COLOR : UI.SLOT_COLOR;
  LJS.drawRect(LJS.vec2(tab1X, tabY), LJS.vec2(100, 20), invColor);
  LJS.drawText('Inventory (Q)', LJS.vec2(tab1X, tabY), 12, UI.TEXT_COLOR);
  
  // Equipment tab
  const equipColor = uiState.activeTab === 'equipment' ? UI.SLOT_SELECTED_COLOR : UI.SLOT_COLOR;
  LJS.drawRect(LJS.vec2(tab2X, tabY), LJS.vec2(100, 20), equipColor);
  LJS.drawText('Equipment (E)', LJS.vec2(tab2X, tabY), 12, UI.TEXT_COLOR);
}

/**
 * Render inventory grid
 */
function renderInventoryGrid(
  ecs: ECS,
  inventory: InventoryComponent,
  uiState: InventoryUIComponent,
  panelPos: LJS.Vector2,
  stats: StatsComponent | undefined
): void {
  const startX = panelPos.x - UI.PANEL_WIDTH / 2 + UI.PADDING;
  const startY = panelPos.y - UI.PANEL_HEIGHT / 2 + UI.PADDING + 30;
  
  // Draw weight info
  const derivedStats = stats?.derived;
  const maxWeight = derivedStats?.carryCapacity || 100;
  const weightText = `Weight: ${inventory.currentWeight.toFixed(1)} / ${maxWeight}`;
  LJS.drawText(weightText, LJS.vec2(panelPos.x, startY - 10), 12, UI.TEXT_COLOR);
  
  // Draw inventory slots
  for (let row = 0; row < UI.GRID_ROWS; row++) {
    for (let col = 0; col < UI.GRID_COLS; col++) {
      const slotIndex = row * UI.GRID_COLS + col;
      const x = startX + col * (UI.SLOT_SIZE + UI.SLOT_SPACING) + UI.SLOT_SIZE / 2;
      const y = startY + row * (UI.SLOT_SIZE + UI.SLOT_SPACING) + UI.SLOT_SIZE / 2;
      const slotPos = LJS.vec2(x, y);
      const slotSize = LJS.vec2(UI.SLOT_SIZE, UI.SLOT_SIZE);
      
      // Determine slot color (hover effect)
      let slotColor = UI.SLOT_COLOR;
      if (slotIndex < inventory.items.length) {
        const itemId = inventory.items[slotIndex];
        if (itemId === uiState.hoveredItemId && itemId !== uiState.draggedItemId) {
          slotColor = UI.SLOT_HOVER_COLOR;
        }
      }
      
      // Draw slot background
      LJS.drawRect(slotPos, slotSize, slotColor);
      
      // Draw item if present
      if (slotIndex < inventory.items.length) {
        const itemId = inventory.items[slotIndex];
        if (itemId !== uiState.draggedItemId) {
          renderItemIcon(ecs, itemId, slotPos);
        }
      }
    }
  }
}

/**
 * Render equipment slots
 */
function renderEquipmentSlots(
  ecs: ECS,
  equipment: EquipmentComponent,
  uiState: InventoryUIComponent,
  panelPos: LJS.Vector2
): void {
  const slots: Array<{name: keyof EquipmentComponent, label: string, x: number, y: number}> = [
    { name: 'head', label: 'Head', x: 200, y: 50 },
    { name: 'neck', label: 'Neck', x: 200, y: 110 },
    { name: 'body', label: 'Body', x: 200, y: 170 },
    { name: 'mainHand', label: 'Main', x: 120, y: 170 },
    { name: 'offHand', label: 'Off', x: 280, y: 170 },
    { name: 'legs', label: 'Legs', x: 200, y: 230 },
    { name: 'feet', label: 'Feet', x: 200, y: 290 },
    { name: 'ringLeft', label: 'Ring L', x: 120, y: 230 },
    { name: 'ringRight', label: 'Ring R', x: 280, y: 230 },
  ];
  
  const baseX = panelPos.x - UI.PANEL_WIDTH / 2;
  const baseY = panelPos.y - UI.PANEL_HEIGHT / 2;
  
  for (const slot of slots) {
    const slotPos = LJS.vec2(
      baseX + slot.x + UI.EQUIP_SLOT_SIZE / 2,
      baseY + slot.y + UI.EQUIP_SLOT_SIZE / 2
    );
    const slotSize = LJS.vec2(UI.EQUIP_SLOT_SIZE, UI.EQUIP_SLOT_SIZE);
    
    // Determine slot color
    let slotColor = UI.SLOT_COLOR;
    if (slot.name === uiState.hoveredSlot) {
      slotColor = UI.SLOT_HOVER_COLOR;
    }
    
    // Draw slot background
    LJS.drawRect(slotPos, slotSize, slotColor);
    
    // Draw slot label
    LJS.drawText(slot.label, slotPos.subtract(LJS.vec2(0, 30)), 10, UI.TEXT_COLOR);
    
    // Draw equipped item
    const itemId = equipment[slot.name];
    if (itemId !== undefined && itemId !== uiState.draggedItemId) {
      renderItemIcon(ecs, itemId, slotPos);
    }
  }
}

/**
 * Render item icon in slot
 */
function renderItemIcon(
  ecs: ECS,
  itemId: number,
  position: LJS.Vector2
): void {
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  const render = ecs.getComponent<RenderComponent>(itemId, 'render');
  
  if (!item) return;
  
  // Draw item sprite if available
  if (render?.tileInfo) {
    const size = LJS.vec2(32, 32);
    LJS.drawTile(position, size, render.tileInfo, render.color);
  }
  
  // Draw item quantity for stackable items
  if (item.stackable && item.quantity > 1) {
    const qtyText = `${item.quantity}`;
    LJS.drawText(qtyText, position.add(LJS.vec2(12, -12)), 10, UI.TEXT_COLOR);
  }
  
  // Draw quality/bless indicator
  if (item.blessState === 'blessed') {
    LJS.drawRect(position, LJS.vec2(36, 36), UI.QUALITY_COLORS.blessed, 0, false);
  } else if (item.blessState === 'cursed') {
    LJS.drawRect(position, LJS.vec2(36, 36), UI.QUALITY_COLORS.cursed, 0, false);
  }
}

/**
 * Render dragged item following mouse
 */
function renderDraggedItem(
  ecs: ECS,
  itemId: number
): void {
  const mousePos = LJS.mousePos;
  renderItemIcon(ecs, itemId, mousePos);
}

/**
 * Render item tooltip
 */
function renderItemTooltip(
  ecs: ECS,
  itemId: number
): void {
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item) return;
  
  const mousePos = LJS.mousePos;
  const tooltipPos = mousePos.add(LJS.vec2(20, 20));
  const tooltipSize = LJS.vec2(200, 120);
  
  // Draw tooltip background
  LJS.drawRect(tooltipPos, tooltipSize, UI.BG_COLOR);
  LJS.drawRect(tooltipPos, tooltipSize.add(LJS.vec2(2, 2)), UI.BORDER_COLOR, 0, false);
  
  // Draw item name
  let nameColor = UI.TEXT_COLOR;
  if (item.blessState === 'blessed') nameColor = UI.QUALITY_COLORS.blessed;
  if (item.blessState === 'cursed') nameColor = UI.QUALITY_COLORS.cursed;
  
  const textY = tooltipPos.y + tooltipSize.y / 2 - 10;
  LJS.drawText(item.name, LJS.vec2(tooltipPos.x, textY), 12, nameColor);
  
  // Draw item details
  LJS.drawText(item.description, LJS.vec2(tooltipPos.x, textY - 15), 10, UI.TEXT_COLOR);
  LJS.drawText(`Weight: ${item.weight}`, LJS.vec2(tooltipPos.x, textY - 30), 10, UI.TEXT_COLOR);
  LJS.drawText(`Value: ${item.value}`, LJS.vec2(tooltipPos.x, textY - 45), 10, UI.TEXT_COLOR);
  
  // Draw identification status
  if (item.identified === 'unidentified') {
    LJS.drawText('Unidentified', LJS.vec2(tooltipPos.x, textY - 60), 10, new LJS.Color(1, 0.5, 0, 1));
  }
}
