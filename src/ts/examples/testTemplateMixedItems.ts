/*
 * File: testTemplateMixedItems.ts
 * Project: littlejs-rl
 * File Created: Monday, 30th December 2025 10:00:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 30th December 2025 10:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { ConsumableComponent } from '../components/consumable';
import ECS from '../ecs';
import { EquipmentComponent } from '../components/equipment';
import { ItemComponent } from '../components/item';
import { ItemRegistry } from '../data/itemRegistry';

/**
 * Test item template-mixing system
 *
 * This test verifies that items can be created from multiple templates
 * and that properties merge correctly in the expected order.
 */
export async function testTemplateMixedItems(): Promise<void> {
  console.log('\n=== Testing Item Template-Mixing System ===\n');

  const ecs = new ECS();
  const registry = ItemRegistry.getInstance();

  // Load template files
  console.log('Loading item templates...');
  await registry.loadTemplates(
    'src/data/base/templates/item_base.json',
    'src/data/base/templates/weapon.json',
    'src/data/base/templates/armor.json',
    'src/data/base/templates/consumable.json'
  );
  console.log('✓ Templates loaded\n');

  // Load example template-mixed items
  console.log('Loading template-mixed items...');
  await registry.loadFromFiles('src/data/base/items/template_mixed_items.json');
  console.log('✓ Template-mixed items loaded\n');

  // Test 1: Iron Sword (weapon templates)
  console.log('--- Test 1: Iron Sword ---');
  const swordId = registry.spawn(ecs, 'iron_sword', 0, 0, 0, 0);
  const swordItem = ecs.getComponent<ItemComponent>(swordId, 'item');
  const swordEquip = ecs.getComponent<EquipmentComponent>(swordId, 'equipment');

  console.log('Item:', swordItem?.name);
  console.log('  Type:', swordItem?.itemType);
  console.log('  Material:', swordItem?.material);
  console.log('  Weight:', swordItem?.weight);
  console.log('  Value:', swordItem?.value);
  console.log('  Damage:', swordEquip?.damage);
  console.log('  Damage Type:', swordEquip?.damageType);
  console.log('  Two-Handed:', swordEquip?.twoHanded);

  // Verify expected values
  if (
    swordItem?.material === 'iron' &&
    swordItem?.itemType === 'weapon' &&
    swordEquip?.damageType === 'physical' &&
    swordEquip?.damage === 8
  ) {
    console.log('✓ Iron sword correctly merged templates\n');
  } else {
    console.error('✗ Iron sword template merge failed\n');
  }

  // Test 2: Healing Potion (consumable templates)
  console.log('--- Test 2: Healing Potion ---');
  const potionId = registry.spawn(ecs, 'potion_of_healing', 0, 0, 0, 0);
  const potionItem = ecs.getComponent<ItemComponent>(potionId, 'item');
  const potionConsumable = ecs.getComponent<ConsumableComponent>(
    potionId,
    'consumable'
  );

  console.log('Item:', potionItem?.name);
  console.log('  Type:', potionItem?.itemType);
  console.log('  Stackable:', potionItem?.stackable);
  console.log('  Effect:', potionConsumable?.effect);
  console.log('  Power:', potionConsumable?.power);
  console.log('  Requires Target:', potionConsumable?.requiresTarget);

  // Verify expected values
  if (
    potionItem?.itemType === 'potion' &&
    potionItem?.stackable === true &&
    potionConsumable?.effect === 'heal' &&
    potionConsumable?.power === 25
  ) {
    console.log('✓ Healing potion correctly merged templates\n');
  } else {
    console.error('✗ Healing potion template merge failed\n');
  }

  // Test 3: Steel Battleaxe (multiple weapon templates)
  console.log('--- Test 3: Steel Battleaxe ---');
  const axeId = registry.spawn(ecs, 'steel_battleaxe', 0, 0, 0, 0);
  const axeItem = ecs.getComponent<ItemComponent>(axeId, 'item');
  const axeEquip = ecs.getComponent<EquipmentComponent>(axeId, 'equipment');

  console.log('Item:', axeItem?.name);
  console.log('  Material:', axeItem?.material);
  console.log('  Damage:', axeEquip?.damage);
  console.log('  Two-Handed:', axeEquip?.twoHanded);

  // Verify expected values (steel + axe templates)
  if (
    axeItem?.material === 'steel' &&
    axeEquip?.twoHanded === true &&
    (axeEquip?.damage ?? 0) > 8 // Steel should boost damage
  ) {
    console.log('✓ Steel battleaxe correctly merged multiple templates\n');
  } else {
    console.error('✗ Steel battleaxe template merge failed\n');
  }

  // Test 4: Mithril Dagger (lightweight weapon)
  console.log('--- Test 4: Mithril Dagger ---');
  const daggerId = registry.spawn(ecs, 'mithril_dagger', 0, 0, 0, 0);
  const daggerItem = ecs.getComponent<ItemComponent>(daggerId, 'item');
  const daggerEquip = ecs.getComponent<EquipmentComponent>(
    daggerId,
    'equipment'
  );

  console.log('Item:', daggerItem?.name);
  console.log('  Material:', daggerItem?.material);
  console.log('  Weight:', daggerItem?.weight);
  console.log('  Damage:', daggerEquip?.damage);
  console.log('  Two-Handed:', daggerEquip?.twoHanded);

  // Verify expected values (mithril = light, dagger = fast)
  if (
    daggerItem?.material === 'mithril' &&
    (daggerItem?.weight ?? 10) < 2 && // Mithril should be light
    daggerEquip?.twoHanded === false
  ) {
    console.log('✓ Mithril dagger correctly merged templates\n');
  } else {
    console.error('✗ Mithril dagger template merge failed\n');
  }

  console.log('=== Template-Mixing Tests Complete ===\n');
}

/**
 * Run this test by calling:
 * ```typescript
 * import { testTemplateMixedItems } from './ts/examples/testTemplateMixedItems';
 * await testTemplateMixedItems();
 * ```
 */
