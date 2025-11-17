/*
 * File: templateMixedItemsExample.ts
 * Project: littlejs-rl
 * File Created: Sunday, 17th November 2025 12:00:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Sunday, 17th November 2025 12:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { ConsumableComponent } from '../components/consumable';
import { DataLoader } from '../data/dataLoader';
import ECS from '../ecs';
import { ItemComponent } from '../components/item';
import { ItemRegistry } from '../data/itemRegistry';

/**
 * Example: Using template-mixed items
 *
 * This example demonstrates how items can be created using multiple
 * templates that are merged together, with optional direct property overrides.
 */

async function templateMixedItemsExample() {
  console.log('\n=== Template-Mixed Items Example ===\n');

  // 1. Load all data (including item templates)
  const dataLoader = DataLoader.getInstance();
  await dataLoader.loadAllData();

  // 2. Load template-mixed items
  const itemRegistry = ItemRegistry.getInstance();
  await itemRegistry.loadFromFiles(
    'src/data/base/items/template_mixed_items.json',
    'src/data/base/items/item_properties.json'
  );

  // 3. Create ECS instance
  const ecs = new ECS();

  console.log('--- Example 1: Iron Sword ---');
  // Iron Sword uses:
  // - base_weapon template (weight: 3.0, value: 100)
  // - iron_weapon template (damage: 8, material: iron)
  // - sword_weapon template (damageType: slashing, range: 1, twoHanded: false)
  const ironSwordId = itemRegistry.spawn(ecs, 'iron_sword');
  if (ironSwordId !== -1) {
    const item = ecs.getComponent<ItemComponent>(ironSwordId, 'item');
    console.log(`Name: ${item?.name}`);
    console.log(`Weight: ${item?.weight} (from base_weapon template)`);
    console.log(`Value: ${item?.value} (from base_weapon template)`);
    console.log(`Material: ${item?.material} (from iron_weapon template)`);
    // Note: Weapon properties (damage, damageType, range) would be stored
    // in a separate WeaponComponent in a full implementation
  }

  console.log('\n--- Example 2: Steel Battleaxe ---');
  // Steel Battleaxe combines:
  // - base_weapon + base_heavy_armor (weight override: 8.0 from direct property)
  // - steel_weapon (damage: 12, material: steel)
  // - axe_weapon (damageType: slashing, range: 1, twoHanded: true)
  const battleaxeId = itemRegistry.spawn(ecs, 'steel_battleaxe');
  if (battleaxeId !== -1) {
    const item = ecs.getComponent<ItemComponent>(battleaxeId, 'item');
    console.log(`Name: ${item?.name}`);
    console.log(`Weight: ${item?.weight} (direct override)`);
    console.log(`Material: ${item?.material} (from steel_weapon template)`);
  }

  console.log('\n--- Example 3: Mithril Dagger ---');
  // Mithril Dagger demonstrates value override:
  // - Templates provide base stats
  // - Direct property overrides value to 500 (premium material)
  const daggerId = itemRegistry.spawn(ecs, 'mithril_dagger');
  if (daggerId !== -1) {
    const item = ecs.getComponent<ItemComponent>(daggerId, 'item');
    console.log(`Name: ${item?.name}`);
    console.log(`Weight: ${item?.weight} (from base_light_armor)`);
    console.log(`Value: ${item?.value} (direct override for rare material)`);
    console.log(`Material: ${item?.material} (from mithril_weapon template)`);
  }

  console.log('\n--- Example 4: Healing Potions ---');
  // Minor healing potion: base_potion + heal_effect (power: 25)
  const minorPotionId = itemRegistry.spawn(ecs, 'healing_potion_minor');
  if (minorPotionId !== -1) {
    const item = ecs.getComponent<ItemComponent>(minorPotionId, 'item');
    const consumable = ecs.getComponent<ConsumableComponent>(
      minorPotionId,
      'consumable'
    );
    console.log(`Minor: ${item?.name}`);
    console.log(`  Effect: ${consumable?.effect}`);
    console.log(`  Power: ${consumable?.power} (overridden from template)`);
    console.log(`  Value: ${item?.value} (from base_potion template)`);
  }

  // Major healing potion: same templates, but power and value overridden
  const majorPotionId = itemRegistry.spawn(ecs, 'healing_potion_major');
  if (majorPotionId !== -1) {
    const item = ecs.getComponent<ItemComponent>(majorPotionId, 'item');
    const consumable = ecs.getComponent<ConsumableComponent>(
      majorPotionId,
      'consumable'
    );
    console.log(`Major: ${item?.name}`);
    console.log(`  Effect: ${consumable?.effect}`);
    console.log(`  Power: ${consumable?.power} (direct override)`);
    console.log(`  Value: ${item?.value} (direct override)`);
  }

  console.log('\n--- Example 5: Armor Pieces ---');
  // Iron Chainmail: base_armor + iron_armor + chest_armor
  const chainmailId = itemRegistry.spawn(ecs, 'iron_chainmail');
  if (chainmailId !== -1) {
    const item = ecs.getComponent<ItemComponent>(chainmailId, 'item');
    console.log(`${item?.name}`);
    console.log(`  Slot: ${item?.equipSlot} (from chest_armor template)`);
    console.log(`  Weight: ${item?.weight} (from base_armor template)`);
    console.log(`  Material: ${item?.material} (from iron_armor template)`);
  }

  // Mithril Shield: lighter weight due to material
  const shieldId = itemRegistry.spawn(ecs, 'mithril_shield');
  if (shieldId !== -1) {
    const item = ecs.getComponent<ItemComponent>(shieldId, 'item');
    console.log(`${item?.name}`);
    console.log(`  Slot: ${item?.equipSlot} (from shield_armor template)`);
    console.log(
      `  Weight: ${item?.weight} (direct override - mithril is light)`
    );
    console.log(
      `  Value: ${item?.value} (direct override - mithril is valuable)`
    );
  }

  console.log('\n--- Template Mixing Benefits ---');
  console.log('1. Reusability: Templates can be mixed and matched');
  console.log(
    '2. Consistency: Shared properties (materials, slots) are centralized'
  );
  console.log('3. Flexibility: Direct properties can override template values');
  console.log(
    '4. Maintainability: Update template once, affects all items using it'
  );
  console.log(
    '5. Composition: Combine multiple templates (iron + sword + weapon)'
  );

  console.log('\n=== Example Complete ===\n');
}

// Export for use in other examples or tests
export { templateMixedItemsExample };

// Run if executed directly
if (require.main === module) {
  templateMixedItemsExample().catch((error) => {
    console.error('Error running template-mixed items example:', error);
  });
}
