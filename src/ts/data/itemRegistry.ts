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

import {
  ArmorTemplate,
  ConsumableTemplate,
  ItemTemplate as DataItemTemplate,
  ItemBaseTemplate,
  WeaponTemplate,
} from '../types/dataSchemas';
import {
  EquipmentSlot,
  ItemBlessState,
  ItemComponent,
  ItemIdentificationLevel,
  ItemMaterial,
  ItemType,
} from '../components/item';

import { ChargesComponent } from '../components/charges';
import { ConsumableComponent } from '../components/consumable';
import { ConsumableEffect } from '../components/consumable';
import ECS from '../ecs';

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
 * - item_base.json: Reusable base item templates
 * - weapon.json: Reusable weapon templates
 * - armor.json: Reusable armor templates
 * - consumable.json: Reusable consumable templates
 *
 * Supports template mixing via array-based template references.
 *
 * @example
 * ```typescript
 * const registry = ItemRegistry.getInstance();
 * await registry.loadFromFiles(
 *   'src/data/base/items/base_items.json',
 *   'src/data/base/items/item_properties.json'
 * );
 * await registry.loadTemplates(
 *   'src/data/base/templates/item_base.json',
 *   'src/data/base/templates/weapon.json',
 *   'src/data/base/templates/armor.json',
 *   'src/data/base/templates/consumable.json'
 * );
 *
 * // Get item template
 * const potion = registry.get('health_potion');
 *
 * // Spawn item with templates resolved and properties applied
 * const itemId = registry.spawn(ecs, 'health_potion');
 * ```
 */
export class ItemRegistry {
  private static instance: ItemRegistry | null = null;

  // Registry maps
  private items = new Map<string, DataItemTemplate>();
  private properties = new Map<string, ItemProperties>();

  // Template registries
  private itemBaseTemplates = new Map<string, ItemBaseTemplate>();
  private weaponTemplates = new Map<string, WeaponTemplate>();
  private armorTemplates = new Map<string, ArmorTemplate>();
  private consumableTemplates = new Map<string, ConsumableTemplate>();

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
   * Load item template files for template mixing
   *
   * @param itemBasePath - Path to item_base.json
   * @param weaponPath - Path to weapon.json
   * @param armorPath - Path to armor.json
   * @param consumablePath - Path to consumable.json
   */
  async loadTemplates(
    itemBasePath: string,
    weaponPath: string,
    armorPath: string,
    consumablePath: string
  ): Promise<void> {
    try {
      // Load item base templates
      const itemBaseResponse = await fetch(itemBasePath);
      const itemBaseData = await itemBaseResponse.json();
      if (itemBaseData.templates && Array.isArray(itemBaseData.templates)) {
        for (const template of itemBaseData.templates) {
          if (template.id) {
            this.itemBaseTemplates.set(template.id, template);
          }
        }
        console.log(
          `[ItemRegistry] Loaded ${this.itemBaseTemplates.size} item base templates`
        );
      }

      // Load weapon templates
      const weaponResponse = await fetch(weaponPath);
      const weaponData = await weaponResponse.json();
      if (weaponData.templates && Array.isArray(weaponData.templates)) {
        for (const template of weaponData.templates) {
          if (template.id) {
            this.weaponTemplates.set(template.id, template);
          }
        }
        console.log(
          `[ItemRegistry] Loaded ${this.weaponTemplates.size} weapon templates`
        );
      }

      // Load armor templates
      const armorResponse = await fetch(armorPath);
      const armorData = await armorResponse.json();
      if (armorData.templates && Array.isArray(armorData.templates)) {
        for (const template of armorData.templates) {
          if (template.id) {
            this.armorTemplates.set(template.id, template);
          }
        }
        console.log(
          `[ItemRegistry] Loaded ${this.armorTemplates.size} armor templates`
        );
      }

      // Load consumable templates
      const consumableResponse = await fetch(consumablePath);
      const consumableData = await consumableResponse.json();
      if (consumableData.templates && Array.isArray(consumableData.templates)) {
        for (const template of consumableData.templates) {
          if (template.id) {
            this.consumableTemplates.set(template.id, template);
          }
        }
        console.log(
          `[ItemRegistry] Loaded ${this.consumableTemplates.size} consumable templates`
        );
      }
    } catch (error) {
      console.error('[ItemRegistry] Failed to load template data:', error);
      throw error;
    }
  }

  /**
   * Get item template by ID
   *
   * @param id - Item ID
   * @returns Item template, or undefined if not found
   */
  get(id: string): DataItemTemplate | undefined {
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
  getByType(itemType: string): DataItemTemplate[] {
    return Array.from(this.items.values()).filter(
      (item) => item.itemType === itemType
    );
  }

  /**
   * Resolve item base properties from templates
   * Merges itemBaseTemplates array in order, then overlays direct properties
   */
  private resolveItemBase(template: DataItemTemplate): Partial<ItemComponent> {
    let resolved: Partial<ItemComponent> = {};

    if (template.itemBaseTemplates && template.itemBaseTemplates.length > 0) {
      // Sequential merge of templates
      for (const templateId of template.itemBaseTemplates) {
        const baseTemplate = this.itemBaseTemplates.get(templateId);
        if (baseTemplate) {
          resolved = {
            ...resolved,
            weight: baseTemplate.weight,
            value: baseTemplate.value,
            itemType: baseTemplate.itemType as ItemType,
            material: baseTemplate.material as ItemMaterial,
            stackable: baseTemplate.stackable,
          };
        } else {
          console.warn(
            `[ItemRegistry] Item base template '${templateId}' not found for item '${template.id}'. Skipping.`
          );
        }
      }
    }

    // Override with direct properties
    if (template.weight !== undefined) resolved.weight = template.weight;
    if (template.value !== undefined) resolved.value = template.value;
    if (template.itemType !== undefined)
      resolved.itemType = template.itemType as ItemType;
    if (template.material !== undefined)
      resolved.material = template.material as ItemMaterial;
    if (template.stackable !== undefined)
      resolved.stackable = template.stackable;

    return resolved;
  }

  /**
   * Resolve weapon properties from templates
   * Merges weaponTemplates array in order, then overlays direct properties
   */
  private resolveWeapon(template: DataItemTemplate): {
    damage?: number;
    damageType?: string;
    range?: number;
    twoHanded?: boolean;
  } {
    let resolved: {
      damage?: number;
      damageType?: string;
      range?: number;
      twoHanded?: boolean;
    } = {};

    if (template.weaponTemplates && template.weaponTemplates.length > 0) {
      // Sequential merge of templates
      for (const templateId of template.weaponTemplates) {
        const weaponTemplate = this.weaponTemplates.get(templateId);
        if (weaponTemplate) {
          resolved = {
            ...resolved,
            damage: weaponTemplate.damage,
            damageType: weaponTemplate.damageType,
            range: weaponTemplate.range,
            twoHanded: weaponTemplate.twoHanded,
          };
        } else {
          console.warn(
            `[ItemRegistry] Weapon template '${templateId}' not found for item '${template.id}'. Skipping.`
          );
        }
      }
    }

    // Override with direct properties
    if (template.damage !== undefined) resolved.damage = template.damage;
    if (template.damageType !== undefined)
      resolved.damageType = template.damageType;
    if (template.range !== undefined) resolved.range = template.range;
    if (template.twoHanded !== undefined)
      resolved.twoHanded = template.twoHanded;

    return resolved;
  }

  /**
   * Resolve armor properties from templates
   * Merges armorTemplates array in order, then overlays direct properties
   */
  private resolveArmor(template: DataItemTemplate): {
    defense?: number;
    slot?: string;
  } {
    let resolved: {
      defense?: number;
      slot?: string;
    } = {};

    if (template.armorTemplates && template.armorTemplates.length > 0) {
      // Sequential merge of templates
      for (const templateId of template.armorTemplates) {
        const armorTemplate = this.armorTemplates.get(templateId);
        if (armorTemplate) {
          resolved = {
            ...resolved,
            defense: armorTemplate.defense,
            slot: armorTemplate.slot,
          };
        } else {
          console.warn(
            `[ItemRegistry] Armor template '${templateId}' not found for item '${template.id}'. Skipping.`
          );
        }
      }
    }

    // Override with direct properties
    if (template.defense !== undefined) resolved.defense = template.defense;
    if (template.slot !== undefined) resolved.slot = template.slot;

    return resolved;
  }

  /**
   * Resolve consumable properties from templates
   * Merges consumableTemplates array in order, then overlays direct properties
   */
  private resolveConsumable(template: DataItemTemplate): {
    effect?: string;
    power?: number;
    duration?: number;
    targeting?: string;
  } {
    let resolved: {
      effect?: string;
      power?: number;
      duration?: number;
      targeting?: string;
    } = {};

    if (
      template.consumableTemplates &&
      template.consumableTemplates.length > 0
    ) {
      // Sequential merge of templates
      for (const templateId of template.consumableTemplates) {
        const consumableTemplate = this.consumableTemplates.get(templateId);
        if (consumableTemplate) {
          resolved = {
            ...resolved,
            effect: consumableTemplate.effect,
            power: consumableTemplate.power,
            duration: consumableTemplate.duration,
            targeting: consumableTemplate.targeting,
          };
        } else {
          console.warn(
            `[ItemRegistry] Consumable template '${templateId}' not found for item '${template.id}'. Skipping.`
          );
        }
      }
    }

    // Override with direct properties
    if (template.effect !== undefined) resolved.effect = template.effect;
    if (template.power !== undefined) resolved.power = template.power;
    if (template.duration !== undefined) resolved.duration = template.duration;
    if (template.targeting !== undefined)
      resolved.targeting = template.targeting;

    return resolved;
  }

  /**
   * Spawn an item entity from a template
   *
   * Creates an entity with:
   * - ItemComponent from template (with template resolution)
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

    // Resolve properties from templates
    const resolvedBase = this.resolveItemBase(template);
    const resolvedWeapon = this.resolveWeapon(template);
    const resolvedArmor = this.resolveArmor(template);
    const resolvedConsumable = this.resolveConsumable(template);

    // Add base item component with resolved and direct properties
    ecs.addComponent<ItemComponent>(itemId, 'item', {
      id: template.id,
      name: template.name || 'Unknown Item',
      description: template.description || '',
      weight: resolvedBase.weight || 0,
      value: resolvedBase.value || 0,
      itemType: (resolvedBase.itemType as ItemType) || 'misc',
      identified:
        (template.identified as ItemIdentificationLevel) || 'unidentified',
      blessState: (template.blessState as ItemBlessState) || 'normal',
      stackable: resolvedBase.stackable ?? false,
      quantity: template.quantity || 1,
      quality: template.quality || 0,
      material: (resolvedBase.material as ItemMaterial) || 'unknown',
      equipSlot: (template.slot || template.equipSlot) as
        | EquipmentSlot
        | undefined,
      equipped: template.equipped ?? false,
      canBreak: template.canBreak ?? false,
      broken: template.broken ?? false,
    });

    // Add properties if they exist (legacy system)
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

    // Add consumable component from templates if not already added
    if (
      !props?.consumable &&
      (resolvedConsumable.effect || template.consumableTemplates)
    ) {
      ecs.addComponent<ConsumableComponent>(itemId, 'consumable', {
        effect: (resolvedConsumable.effect as ConsumableEffect) || 'custom',
        power: resolvedConsumable.power || 0,
        requiresTarget: resolvedConsumable.targeting === 'target',
        targetRange: undefined,
        areaOfEffect: resolvedConsumable.targeting === 'area' ? 3 : undefined,
        duration: resolvedConsumable.duration,
        consumeOnUse: true,
        customEffect: undefined,
      });
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
    this.itemBaseTemplates.clear();
    this.weaponTemplates.clear();
    this.armorTemplates.clear();
    this.consumableTemplates.clear();
  }
}
