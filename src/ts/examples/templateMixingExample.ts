/*
 * File: templateMixingExample.ts
 * Project: littlejs-rl
 * File Created: November 16, 2025
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: November 16, 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Example usage of the template-mixing feature
 *
 * This example demonstrates how to:
 * 1. Load component templates
 * 2. Create entities using template mixing
 * 3. Verify template resolution and overrides
 */

import { AIComponent, HealthComponent, StatsComponent } from '../components';
import {
  AITemplateRegistry,
  DataLoader,
  EntityRegistry,
  HealthTemplateRegistry,
  RenderTemplateRegistry,
  StatsTemplateRegistry,
} from '../data';

import ECS from '../ecs';

async function templateMixingExample() {
  console.log('=== Template-Mixing Example ===\n');

  // Step 1: Load all data (includes templates)
  console.log('Loading game data...');
  await DataLoader.getInstance().loadAllData();
  console.log('✓ Data loaded\n');

  // Step 2: Verify templates loaded
  console.log('Checking template registries...');

  const renderRegistry = RenderTemplateRegistry.getInstance();
  const statsRegistry = StatsTemplateRegistry.getInstance();
  const aiRegistry = AITemplateRegistry.getInstance();
  const healthRegistry = HealthTemplateRegistry.getInstance();

  console.log(`  Render templates: ${renderRegistry.getAllIds().length}`);
  console.log(`  Stats templates: ${statsRegistry.getAllIds().length}`);
  console.log(`  AI templates: ${aiRegistry.getAllIds().length}`);
  console.log(`  Health templates: ${healthRegistry.getAllIds().length}\n`);

  // Step 3: List some template IDs
  console.log('Available template examples:');
  console.log(`  Render: ${renderRegistry.getAllIds().slice(0, 3).join(', ')}`);
  console.log(`  Stats: ${statsRegistry.getAllIds().slice(0, 3).join(', ')}`);
  console.log(`  AI: ${aiRegistry.getAllIds().slice(0, 3).join(', ')}`);
  console.log(
    `  Health: ${healthRegistry.getAllIds().slice(0, 3).join(', ')}\n`
  );

  // Step 4: Create ECS and spawn entities
  console.log('Creating ECS and spawning template-mixed entities...');
  const ecs = new ECS();
  const entityRegistry = EntityRegistry.getInstance();

  // Spawn example entities
  const examples = [
    'orc_mage',
    'agile_troll',
    'skeleton_brute',
    'merchant_warrior',
    'custom_goblin',
  ];

  for (const entityId of examples) {
    const entity = entityRegistry.spawn(ecs, entityId, 10, 10, 5, 5);
    if (entity !== null) {
      console.log(`  ✓ Spawned: ${entityId} (ID: ${entity})`);

      // Get components to verify
      const stats = ecs.getComponent<StatsComponent>(entity, 'stats');
      const render = ecs.getComponent(entity, 'render');
      const ai = ecs.getComponent<AIComponent>(entity, 'ai');
      const health = ecs.getComponent<HealthComponent>(entity, 'health');

      console.log(
        `    Stats: str=${stats?.base.strength}, int=${stats?.base.intelligence}`
      );
      console.log(`    Health: ${health?.current}/${health?.max}`);
      console.log(`    AI: ${ai?.disposition}, range=${ai?.detectionRange}`);
      console.log('');
    } else {
      console.log(`  ✗ Failed to spawn: ${entityId}\n`);
    }
  }

  // Step 5: Demonstrate template inspection
  console.log('Inspecting a specific template...');
  const bruteStats = statsRegistry.get('bruteStats');
  if (bruteStats) {
    console.log(`  Template: ${bruteStats.name}`);
    console.log(`  Description: ${bruteStats.description}`);
    console.log(
      `  Strength: ${bruteStats.stats.strength}, Toughness: ${bruteStats.stats.toughness}\n`
    );
  }

  // Step 6: Show template mixing in action
  console.log('Template mixing in action:');
  console.log('  orc_mage uses:');
  console.log('    - orcWarriorRender (green orc appearance)');
  console.log('    - mageStats (high intelligence)');
  console.log('    - aggressiveAI (attacks on sight)');
  console.log('    - normalHealth (50 HP)');
  console.log('  BUT overrides intelligence to 20 and strength to 8!\n');

  console.log('=== Example Complete ===');
}

// Export for use in other files
export default templateMixingExample;

// Run if executed directly
if (require.main === module) {
  templateMixingExample().catch((error) => {
    console.error('Example failed:', error);
  });
}
