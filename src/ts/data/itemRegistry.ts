/*
 * File: itemRegistry.ts
 * Project: littlejs-rl
 * File Created: Saturday, 16th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Saturday, 16th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { ChargesComponent } from '../components/charges';
import { ConsumableComponent } from '../components/consumable';
import ECS from '../ecs';
import { ItemComponent } from '../components/item';

/**
 * Item template loaded from base_items.json
 */
export interface ItemTemplate extends Partial<ItemComponent> {
  id: string; // Required
}

/**
 * Item properties loaded from item_properties.json
 */
export interface ItemProperties {
  consumable?: Partial<ConsumableComponent>;
  charges?: Partial<ChargesComponent>;
}

/**
 * Registry for item templates and properties
 *
 * Loads and manages item definitions from JSON files:
 * - base_items.json: Base item stats and properties
 * - item_properties.json: Consumable effects, charges, etc.
 *
 * @example
 * ```typescript
 * const registry = ItemRegistry.getInstance();
 * await registry.loadFromFiles(
 *   'src/data/base/items/base_items.json',
 *   'src/data/base/items/item_properties.json'
 * );
 *
 * // Get item template
 * const potion = registry.get('health_potion');
 *
 * // Spawn item with properties applied
 * const itemId = registry.spawn(ecs, 'health_potion');
 * ```
 */
export class ItemRegistry {
  private static instance: ItemRegistry | null = null;

  // Registry maps
  private items = new Map<string, ItemTemplate>();
  private properties = new Map<string, ItemProperties>();

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ItemRegistry {
    ItemRegistry.instance ??= new ItemRegistry();
    return ItemRegistry.instance;
  }

  /**
   * Reset the registry (useful for testing)
   */
  static reset(): void {
    ItemRegistry.instance = null;
  }

  /**
   * Load item templates and properties from JSON files
   *
   * @param itemsPath - Path to base_items.json
   * @param propertiesPath - Path to item_properties.json
   */
  async loadFromFiles(
    itemsPath: string,
    propertiesPath: string
  ): Promise<void> {
    try {
      // Load base items
      const itemsResponse = await fetch(itemsPath);
      const itemsData = await itemsResponse.json();
      if (itemsData.items && Array.isArray(itemsData.items)) {
        for (const item of itemsData.items) {
          if (item.id) {
            this.items.set(item.id, item);
          }
        }
        console.log(`[ItemRegistry] Loaded ${this.items.size} item templates`);
      }

      // Load item properties
      const propsResponse = await fetch(propertiesPath);
      const propsData = await propsResponse.json();
      if (propsData.itemProperties) {
        for (const [id, props] of Object.entries(propsData.itemProperties)) {
          this.properties.set(id, props as ItemProperties);
        }
        console.log(
          `[ItemRegistry] Loaded ${this.properties.size} item properties`
        );
      }
    } catch (error) {
      console.error('[ItemRegistry] Failed to load item data:', error);
      throw error;
    }
  }

  /**
   * Get item template by ID
   *
   * @param id - Item ID
   * @returns Item template, or undefined if not found
   */
  get(id: string): ItemTemplate | undefined {
    return this.items.get(id);
  }

  /**
   * Get item properties by ID
   *
   * @param id - Item ID
   * @returns Item properties, or undefined if not found
   */
  getProperties(id: string): ItemProperties | undefined {
    return this.properties.get(id);
  }

  /**
   * Check if an item template exists
   *
   * @param id - Item ID
   * @returns True if item exists, false otherwise
   */
  has(id: string): boolean {
    return this.items.has(id);
  }

  /**
   * Get all item IDs
   *
   * @returns Array of all item IDs
   */
  getAllIds(): string[] {
    return Array.from(this.items.keys());
  }

  /**
   * Get items by type
   *
   * @param itemType - Item type to filter by
   * @returns Array of item templates matching type
   */
  getByType(itemType: string): ItemTemplate[] {
    return Array.from(this.items.values()).filter(
      (item) => item.itemType === itemType
    );
  }

  /**
   * Spawn an item entity from a template
   *
   * Creates an entity with:
   * - ItemComponent from template
   * - ConsumableComponent if defined in properties
   * - ChargesComponent if defined in properties
   *
   * @param ecs - The ECS instance
   * @param id - Item template ID
   * @returns Item entity ID, or -1 if template not found
   *
   * @example
   * ```typescript
   * const potionId = ItemRegistry.getInstance().spawn(ecs, 'health_potion');
   * ```
   */
  spawn(ecs: ECS, id: string): number {
    const template = this.items.get(id);
    if (!template) {
      console.error(`[ItemRegistry] Item template not found: ${id}`);
      return -1;
    }

    const itemId = ecs.createEntity();

    // Add base item component
    ecs.addComponent<ItemComponent>(itemId, 'item', {
      id: template.id,
      name: template.name || 'Unknown Item',
      description: template.description || '',
      weight: template.weight || 0,
      value: template.value || 0,
      itemType: template.itemType || 'misc',
      identified: template.identified || 'unidentified',
      blessState: template.blessState || 'normal',
      stackable: template.stackable ?? false,
      quantity: template.quantity || 1,
      quality: template.quality || 0,
      material: template.material || 'unknown',
      equipSlot: template.equipSlot,
      equipped: template.equipped ?? false,
      canBreak: template.canBreak ?? false,
      broken: template.broken ?? false,
    });

    // Add properties if they exist
    const props = this.properties.get(id);
    if (props) {
      // Add consumable component
      if (props.consumable) {
        ecs.addComponent<ConsumableComponent>(itemId, 'consumable', {
          effect: props.consumable.effect || 'custom',
          power: props.consumable.power || 0,
          requiresTarget: props.consumable.requiresTarget ?? false,
          targetRange: props.consumable.targetRange,
          areaOfEffect: props.consumable.areaOfEffect,
          duration: props.consumable.duration,
          consumeOnUse: props.consumable.consumeOnUse ?? true,
          customEffect: props.consumable.customEffect,
        });
      }

      // Add charges component
      if (props.charges) {
        ecs.addComponent<ChargesComponent>(itemId, 'charges', {
          current: props.charges.current || 0,
          max: props.charges.max || 0,
          deleteWhenEmpty: props.charges.deleteWhenEmpty ?? true,
          rechargeable: props.charges.rechargeable ?? false,
          rechargeRate: props.charges.rechargeRate || 0,
          rechargeProgress: 0,
        });
      }
    }

    return itemId;
  }

  /**
   * Get count of loaded items
   *
   * @returns Number of item templates loaded
   */
  getCount(): number {
    return this.items.size;
  }

  /**
   * Clear all loaded data
   */
  clear(): void {
    this.items.clear();
    this.properties.clear();
  }
}
