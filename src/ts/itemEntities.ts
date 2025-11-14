/*
 * File: itemEntities.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 9:59:17 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 9:59:17 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import ECS from './ecs';
import {
  ItemComponent,
  ItemType,
  ItemState,
  ItemMaterial,
  WeightComponent,
  StackableComponent,
  EquippableComponent,
  EquipmentSlotType,
  IdentificationComponent,
  IdentificationLevel,
  QualityComponent,
} from './components';

/**
 * Create a basic item entity
 */
export function createItem(
  ecs: ECS,
  name: string,
  type: ItemType,
  description: string,
  weight: number,
  value: number,
  material: ItemMaterial = ItemMaterial.UNKNOWN,
  state: ItemState = ItemState.NORMAL
): number {
  const itemId = ecs.createEntity();

  ecs.addComponent<ItemComponent>(itemId, 'item', {
    name,
    type,
    description,
    state,
    material,
    isBroken: false,
    value,
  });

  ecs.addComponent<WeightComponent>(itemId, 'weight', { weight });

  return itemId;
}

/**
 * Create a weapon entity
 */
export function createWeapon(
  ecs: ECS,
  name: string,
  description: string,
  material: ItemMaterial,
  weight: number,
  value: number,
  quality: number = 0,
  state: ItemState = ItemState.NORMAL,
  identificationLevel: IdentificationLevel = IdentificationLevel.FULL
): number {
  const weaponId = createItem(
    ecs,
    name,
    ItemType.WEAPON,
    description,
    weight,
    value,
    material,
    state
  );

  // Add equippable component
  ecs.addComponent<EquippableComponent>(weaponId, 'equippable', {
    slotType: EquipmentSlotType.HAND_HELD,
    isEquipped: false,
  });

  // Add quality component
  ecs.addComponent<QualityComponent>(weaponId, 'quality', { level: quality });

  // Add identification component
  if (identificationLevel !== IdentificationLevel.FULL) {
    const apparentName =
      identificationLevel === IdentificationLevel.UNIDENTIFIED
        ? 'unknown weapon'
        : 'weapon';
    ecs.addComponent<IdentificationComponent>(weaponId, 'identification', {
      level: identificationLevel,
      apparentName,
      apparentDescription: 'A mysterious weapon.',
    });
  }

  return weaponId;
}

/**
 * Create an armor piece entity
 */
export function createArmor(
  ecs: ECS,
  name: string,
  description: string,
  slotType: EquipmentSlotType,
  material: ItemMaterial,
  weight: number,
  value: number,
  quality: number = 0,
  state: ItemState = ItemState.NORMAL,
  identificationLevel: IdentificationLevel = IdentificationLevel.FULL
): number {
  const armorId = createItem(
    ecs,
    name,
    ItemType.ARMOR,
    description,
    weight,
    value,
    material,
    state
  );

  // Add equippable component
  ecs.addComponent<EquippableComponent>(armorId, 'equippable', {
    slotType,
    isEquipped: false,
  });

  // Add quality component
  ecs.addComponent<QualityComponent>(armorId, 'quality', { level: quality });

  // Add identification component
  if (identificationLevel !== IdentificationLevel.FULL) {
    const apparentName =
      identificationLevel === IdentificationLevel.UNIDENTIFIED
        ? 'unknown armor'
        : 'armor';
    ecs.addComponent<IdentificationComponent>(armorId, 'identification', {
      level: identificationLevel,
      apparentName,
      apparentDescription: 'A mysterious piece of armor.',
    });
  }

  return armorId;
}

/**
 * Create a potion entity
 */
export function createPotion(
  ecs: ECS,
  name: string,
  description: string,
  weight: number,
  value: number,
  state: ItemState = ItemState.NORMAL,
  identificationLevel: IdentificationLevel = IdentificationLevel.UNIDENTIFIED,
  maxStackSize: number = 20
): number {
  const potionId = createItem(
    ecs,
    name,
    ItemType.POTION,
    description,
    weight,
    value,
    ItemMaterial.UNKNOWN,
    state
  );

  // Add stackable component
  ecs.addComponent<StackableComponent>(potionId, 'stackable', {
    quantity: 1,
    maxStackSize,
  });

  // Add identification component (potions are usually unidentified)
  const apparentName =
    identificationLevel === IdentificationLevel.UNIDENTIFIED
      ? 'unknown potion'
      : name;
  ecs.addComponent<IdentificationComponent>(potionId, 'identification', {
    level: identificationLevel,
    apparentName,
    apparentDescription: 'A mysterious liquid in a bottle.',
  });

  return potionId;
}

/**
 * Create a scroll entity
 */
export function createScroll(
  ecs: ECS,
  name: string,
  description: string,
  weight: number,
  value: number,
  state: ItemState = ItemState.NORMAL,
  identificationLevel: IdentificationLevel = IdentificationLevel.UNIDENTIFIED,
  maxStackSize: number = 20
): number {
  const scrollId = createItem(
    ecs,
    name,
    ItemType.SCROLL,
    description,
    weight,
    value,
    ItemMaterial.UNKNOWN,
    state
  );

  // Add stackable component
  ecs.addComponent<StackableComponent>(scrollId, 'stackable', {
    quantity: 1,
    maxStackSize,
  });

  // Add identification component (scrolls are usually unidentified)
  const apparentName =
    identificationLevel === IdentificationLevel.UNIDENTIFIED
      ? 'unknown scroll'
      : name;
  ecs.addComponent<IdentificationComponent>(scrollId, 'identification', {
    level: identificationLevel,
    apparentName,
    apparentDescription: 'A scroll with mysterious writing.',
  });

  return scrollId;
}

/**
 * Create a food item entity
 */
export function createFood(
  ecs: ECS,
  name: string,
  description: string,
  weight: number,
  value: number,
  state: ItemState = ItemState.NORMAL,
  maxStackSize: number = 20
): number {
  const foodId = createItem(
    ecs,
    name,
    ItemType.FOOD,
    description,
    weight,
    value,
    ItemMaterial.UNKNOWN,
    state
  );

  // Add stackable component
  ecs.addComponent<StackableComponent>(foodId, 'stackable', {
    quantity: 1,
    maxStackSize,
  });

  return foodId;
}

/**
 * Create a material item entity (for crafting)
 */
export function createMaterial(
  ecs: ECS,
  name: string,
  description: string,
  material: ItemMaterial,
  weight: number,
  value: number,
  maxStackSize: number = 100
): number {
  const materialId = createItem(
    ecs,
    name,
    ItemType.MATERIAL,
    description,
    weight,
    value,
    material,
    ItemState.NORMAL
  );

  // Add stackable component
  ecs.addComponent<StackableComponent>(materialId, 'stackable', {
    quantity: 1,
    maxStackSize,
  });

  return materialId;
}
