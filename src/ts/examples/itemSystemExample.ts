/*
 * File: itemSystemExample.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 9:59:17 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 9:59:17 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import ECS from '../ecs';
import {
  InventoryComponent,
  EquipmentComponent,
  ItemMaterial,
  ItemState,
  IdentificationLevel,
  STANDARD_HUMANOID_SLOTS,
  EquipmentSlotType,
  StatsComponent,
} from '../components';
import {
  createWeapon,
  createArmor,
  createPotion,
  createScroll,
  createFood,
  createMaterial,
} from '../itemEntities';
import {
  addItemToInventory,
  removeItemFromInventory,
  sortInventory,
} from '../systems/inventorySystem';
import {
  equipItem,
  unequipItem,
  getEquippedItem,
} from '../systems/equipmentSystem';
import {
  updateInventoryWeight,
  updateMaxCarryWeight,
  isOverencumbered,
} from '../systems/carryWeightSystem';
import { canItemsStack, stackItems } from '../systems/itemStackingSystem';

/**
 * Example: Creating a character with inventory and equipment
 */
export function exampleCreateCharacterWithInventory(): void {
  const ecs = new ECS();

  // Create a character
  const playerId = ecs.createEntity();

  // Add stats (needed for carry weight calculation)
  ecs.addComponent<StatsComponent>(playerId, 'stats', {
    base: {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      charisma: 10,
      willpower: 10,
      toughness: 10,
      attractiveness: 10,
    },
    derived: {
      defense: 5,
      dodge: 5,
      mindDefense: 5,
      magicalDefense: 5,
      speed: 1.0,
    },
  });

  // Add inventory component
  ecs.addComponent<InventoryComponent>(playerId, 'inventory', {
    items: [],
    maxCarryWeight: 100,
    currentWeight: 0,
  });

  // Update max carry weight based on strength
  updateMaxCarryWeight(ecs, playerId);

  // Add equipment component with standard humanoid slots
  ecs.addComponent<EquipmentComponent>(playerId, 'equipment', {
    slots: STANDARD_HUMANOID_SLOTS,
    equipped: new Map(),
  });

  console.log('Created character with inventory and equipment slots');
}

/**
 * Example: Creating and managing items
 */
export function exampleCreateItems(): void {
  const ecs = new ECS();

  // Create various weapons
  const sword = createWeapon(
    ecs,
    'Steel Longsword',
    'A finely crafted longsword made of steel',
    ItemMaterial.STEEL,
    5.0,
    100,
    1, // +1 quality
    ItemState.NORMAL,
    IdentificationLevel.FULL
  );

  const cursedDagger = createWeapon(
    ecs,
    'Cursed Dagger',
    'A dark dagger that feels wrong to the touch',
    ItemMaterial.IRON,
    1.5,
    50,
    0,
    ItemState.CURSED, // Cursed!
    IdentificationLevel.PARTIAL // Partially identified
  );

  // Create armor
  const helmet = createArmor(
    ecs,
    'Iron Helmet',
    'A sturdy iron helmet',
    EquipmentSlotType.HEAD,
    ItemMaterial.IRON,
    3.0,
    50,
    0,
    ItemState.NORMAL,
    IdentificationLevel.FULL
  );

  // Create consumables
  const healthPotion = createPotion(
    ecs,
    'Potion of Healing',
    'Restores health when consumed',
    0.5,
    20,
    ItemState.BLESSED, // Blessed potion (more effective!)
    IdentificationLevel.UNIDENTIFIED // Unknown potion
  );

  const fireballScroll = createScroll(
    ecs,
    'Scroll of Fireball',
    'Casts a fireball when read',
    0.1,
    50,
    ItemState.NORMAL,
    IdentificationLevel.UNIDENTIFIED
  );

  // Create food
  const bread = createFood(
    ecs,
    'Bread',
    'A loaf of fresh bread',
    0.5,
    5,
    ItemState.NORMAL
  );

  // Create materials
  const ironOre = createMaterial(
    ecs,
    'Iron Ore',
    'Raw iron that can be smelted',
    ItemMaterial.IRON,
    2.0,
    10
  );

  console.log('Created various items:', {
    sword,
    cursedDagger,
    helmet,
    healthPotion,
    fireballScroll,
    bread,
    ironOre,
  });
}

/**
 * Example: Adding items to inventory and managing weight
 */
export function exampleInventoryManagement(): void {
  const ecs = new ECS();

  // Create character
  const playerId = ecs.createEntity();
  ecs.addComponent<StatsComponent>(playerId, 'stats', {
    base: {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      charisma: 10,
      willpower: 10,
      toughness: 10,
      attractiveness: 10,
    },
    derived: {
      defense: 5,
      dodge: 5,
      mindDefense: 5,
      magicalDefense: 5,
      speed: 1.0,
    },
  });

  ecs.addComponent<InventoryComponent>(playerId, 'inventory', {
    items: [],
    maxCarryWeight: 150,
    currentWeight: 0,
  });
  updateMaxCarryWeight(ecs, playerId);

  // Create items
  const sword = createWeapon(
    ecs,
    'Steel Sword',
    'A steel sword',
    ItemMaterial.STEEL,
    5.0,
    100
  );
  const potion1 = createPotion(
    ecs,
    'Potion of Healing',
    'Heals wounds',
    0.5,
    20
  );
  const potion2 = createPotion(
    ecs,
    'Potion of Healing',
    'Heals wounds',
    0.5,
    20
  );

  // Add items to inventory
  console.log('Adding sword to inventory:', addItemToInventory(ecs, playerId, sword));
  console.log('Adding potion 1:', addItemToInventory(ecs, playerId, potion1));
  console.log('Adding potion 2 (should stack):', addItemToInventory(ecs, playerId, potion2));

  const inventory = ecs.getComponent<InventoryComponent>(playerId, 'inventory');
  console.log('Inventory items count:', inventory?.items.length);
  console.log('Current weight:', inventory?.currentWeight);
  console.log('Max weight:', inventory?.maxCarryWeight);
  console.log('Overencumbered:', isOverencumbered(ecs, playerId));

  // Sort inventory
  sortInventory(ecs, playerId);
  console.log('Inventory sorted');
}

/**
 * Example: Equipping and unequipping items
 */
export function exampleEquipmentManagement(): void {
  const ecs = new ECS();

  // Create character
  const playerId = ecs.createEntity();
  ecs.addComponent<StatsComponent>(playerId, 'stats', {
    base: {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      charisma: 10,
      willpower: 10,
      toughness: 10,
      attractiveness: 10,
    },
    derived: {
      defense: 5,
      dodge: 5,
      mindDefense: 5,
      magicalDefense: 5,
      speed: 1.0,
    },
  });

  ecs.addComponent<InventoryComponent>(playerId, 'inventory', {
    items: [],
    maxCarryWeight: 150,
    currentWeight: 0,
  });

  ecs.addComponent<EquipmentComponent>(playerId, 'equipment', {
    slots: STANDARD_HUMANOID_SLOTS,
    equipped: new Map(),
  });

  // Create and add items
  const sword = createWeapon(
    ecs,
    'Iron Sword',
    'An iron sword',
    ItemMaterial.IRON,
    4.0,
    50
  );
  const helmet = createArmor(
    ecs,
    'Steel Helmet',
    'A steel helmet',
    EquipmentSlotType.HEAD,
    ItemMaterial.STEEL,
    3.0,
    80
  );

  addItemToInventory(ecs, playerId, sword);
  addItemToInventory(ecs, playerId, helmet);

  // Equip items
  console.log('Equipping sword:', equipItem(ecs, playerId, sword, 0)); // Main hand
  console.log('Equipping helmet:', equipItem(ecs, playerId, helmet, 0));

  // Check equipped
  const equippedSword = getEquippedItem(
    ecs,
    playerId,
    EquipmentSlotType.HAND_HELD,
    0
  );
  console.log('Sword equipped in main hand:', equippedSword === sword);

  // Unequip
  console.log('Unequipping helmet:', unequipItem(
    ecs,
    playerId,
    EquipmentSlotType.HEAD,
    0
  ));
}

/**
 * Example: Item stacking
 */
export function exampleItemStacking(): void {
  const ecs = new ECS();

  // Create identical potions
  const potion1 = createPotion(
    ecs,
    'Potion of Healing',
    'Heals wounds',
    0.5,
    20,
    ItemState.NORMAL,
    IdentificationLevel.UNIDENTIFIED
  );

  const potion2 = createPotion(
    ecs,
    'Potion of Healing',
    'Heals wounds',
    0.5,
    20,
    ItemState.NORMAL,
    IdentificationLevel.UNIDENTIFIED
  );

  const potion3 = createPotion(
    ecs,
    'Potion of Mana',
    'Restores mana',
    0.5,
    20,
    ItemState.NORMAL,
    IdentificationLevel.UNIDENTIFIED
  );

  // Check if they can stack
  console.log('Potion 1 and 2 can stack:', canItemsStack(ecs, potion1, potion2));
  console.log('Potion 1 and 3 can stack:', canItemsStack(ecs, potion1, potion3));

  // Stack them
  console.log('Stacking potion 2 into potion 1:', stackItems(ecs, potion1, potion2));

  const stack1 = ecs.getComponent<any>(potion1, 'stackable');
  console.log('Potion 1 stack quantity:', stack1?.quantity);
}

/**
 * Example: Cursed items
 */
export function exampleCursedItems(): void {
  const ecs = new ECS();

  // Create character
  const playerId = ecs.createEntity();
  ecs.addComponent<StatsComponent>(playerId, 'stats', {
    base: {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      charisma: 10,
      willpower: 10,
      toughness: 10,
      attractiveness: 10,
    },
    derived: {
      defense: 5,
      dodge: 5,
      mindDefense: 5,
      magicalDefense: 5,
      speed: 1.0,
    },
  });

  ecs.addComponent<InventoryComponent>(playerId, 'inventory', {
    items: [],
    maxCarryWeight: 150,
    currentWeight: 0,
  });

  ecs.addComponent<EquipmentComponent>(playerId, 'equipment', {
    slots: STANDARD_HUMANOID_SLOTS,
    equipped: new Map(),
  });

  // Create cursed weapon
  const cursedSword = createWeapon(
    ecs,
    'Cursed Blade',
    'A blade emanating dark energy',
    ItemMaterial.IRON,
    4.0,
    50,
    -1, // Negative quality
    ItemState.CURSED,
    IdentificationLevel.PARTIAL
  );

  addItemToInventory(ecs, playerId, cursedSword);

  // Equip cursed item
  console.log('Equipping cursed sword:', equipItem(ecs, playerId, cursedSword, 0));

  // Try to unequip (should fail because it's cursed)
  console.log('Trying to unequip cursed sword:', unequipItem(
    ecs,
    playerId,
    EquipmentSlotType.HAND_HELD,
    0
  )); // Should return false
}
