/*
 * File: inventoryUI.ts
 * Project: littlejs-rl
 * File Created: Monday, 30th December 2025 11:00:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 30th December 2025 11:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Inventory UI state component
 *
 * Manages the state of the inventory UI screen:
 * - Whether inventory is open or closed
 * - Currently hovered item/slot
 * - Dragging state for drag-drop
 * - Selected tab (inventory vs equipment)
 */
export interface InventoryUIComponent {
  /**
   * Whether inventory UI is currently visible
   */
  isOpen: boolean;

  /**
   * Currently hovered item entity ID (for tooltip)
   */
  hoveredItemId?: number;

  /**
   * Currently hovered equipment slot name (for tooltip)
   */
  hoveredSlot?: string;

  /**
   * Item being dragged (entity ID)
   */
  draggedItemId?: number;

  /**
   * Source of dragged item ('inventory' or 'equipment')
   */
  dragSource?: 'inventory' | 'equipment';

  /**
   * Source equipment slot if dragging from equipment
   */
  dragSourceSlot?: string;

  /**
   * Current tab selection ('inventory' or 'equipment')
   */
  activeTab: 'inventory' | 'equipment';

  /**
   * Scroll offset for inventory grid (if items exceed visible area)
   */
  scrollOffset: number;
}
