/*
 * File: inventoryUI.ts
 * Project: littlejs-rl
 * File Created: Monday, 30th December 2025 10:30:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 30th December 2025 10:30:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * UI Panel Types for inventory screen
 */
export enum InventoryPanel {
  /** Main inventory grid (backpack items) */
  INVENTORY = 'inventory',
  /** Equipment slots (equipped items) */
  EQUIPMENT = 'equipment',
  /** Item details and description */
  DETAILS = 'details',
}

/**
 * Inventory UI Component - Tracks UI state for inventory screen
 *
 * This component manages:
 * - Which panel is currently focused
 * - Selected item for inspection/use
 * - Scroll position in inventory list
 * - Drag-drop state for item movement
 * - Hover state for tooltips
 *
 * @example
 * ```typescript
 * const inventoryUI: InventoryUIComponent = {
 *   activePanel: InventoryPanel.INVENTORY,
 *   selectedItemIndex: 0,
 *   scrollOffset: 0,
 *   isDragging: false,
 *   dragItemId: undefined,
 *   dragSourceSlot: undefined,
 *   hoverItemId: undefined,
 *   hoverEquipSlot: undefined,
 * };
 * ```
 */
export interface InventoryUIComponent {
  /**
   * Currently active panel (determines which section has focus)
   */
  activePanel: InventoryPanel;

  /**
   * Selected item index in inventory list (for keyboard navigation)
   * -1 means no selection
   */
  selectedItemIndex: number;

  /**
   * Scroll offset for inventory list (when items exceed visible area)
   */
  scrollOffset: number;

  /**
   * Whether an item is currently being dragged
   */
  isDragging: boolean;

  /**
   * Entity ID of item being dragged (undefined if not dragging)
   */
  dragItemId?: number;

  /**
   * Source equipment slot if dragging from equipment
   * (e.g., 'mainHand', 'head', undefined if from inventory)
   */
  dragSourceSlot?: string;

  /**
   * Item currently being hovered by mouse (for tooltip)
   */
  hoverItemId?: number;

  /**
   * Equipment slot currently being hovered
   */
  hoverEquipSlot?: string;

  /**
   * Whether to show item details panel
   */
  showDetails: boolean;

  /**
   * Item ID for details panel (undefined if no item selected)
   */
  detailsItemId?: number;
}
