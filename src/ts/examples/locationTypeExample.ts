/*
 * File: locationTypeExample.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import { BiomeType, LocationType } from '../locationType';
import { createEnemy, createNPC, createPlayer } from '../entities';

import ECS from '../ecs';
import Location from '../location';
import World from '../world';

/**
 * Example 1: Creating locations with different types and biomes
 */
export function example1_BasicUsage() {
  console.log('=== Example 1: Basic Location Creation ===');

  const world = new World(10, 10, 50, 50);

  // Create different location types
  world.setCurrentLocation(0, 0, LocationType.DUNGEON, BiomeType.FOREST);
  console.log('Created: Forest Dungeon at (0,0)');

  world.setCurrentLocation(1, 0, LocationType.TOWN, BiomeType.DESERT);
  console.log('Created: Desert Town at (1,0)');

  world.setCurrentLocation(2, 0, LocationType.RUINS, BiomeType.SNOWY);
  console.log('Created: Snowy Ruins at (2,0)');

  world.setCurrentLocation(3, 0, LocationType.FACTION_BASE, BiomeType.MOUNTAIN);
  console.log('Created: Mountain Faction Base at (3,0)');

  world.setCurrentLocation(4, 0, LocationType.WILDERNESS, BiomeType.SWAMP);
  console.log('Created: Swamp Wilderness at (4,0)');

  world.setCurrentLocation(5, 0, LocationType.CAVE, BiomeType.VOLCANIC);
  console.log('Created: Volcanic Cave at (5,0)');

  // Render current location
  const location = world.getCurrentLocation();
  if (location) {
    console.log(`Current location: ${location.name}`);
    console.log(`Type: ${location.metadata.locationType}`);
    console.log(`Biome: ${location.metadata.biome}`);
    location.render();
  }
}

/**
 * Example 2: Accessing location metadata
 */
export function example2_AccessingMetadata() {
  console.log('=== Example 2: Accessing Location Metadata ===');

  const world = new World(10, 10, 50, 50);
  world.setCurrentLocation(5, 5, LocationType.TOWN, BiomeType.FOREST);

  const location = world.getCurrentLocation();
  if (location) {
    const metadata = location.metadata;

    console.log('Location Type:', metadata.locationType);
    console.log('Biome:', metadata.biome);
    console.log('Properties:', metadata.properties);
    console.log('- Has NPCs:', metadata.properties.hasNPCs);
    console.log('- Has Shops:', metadata.properties.hasShops);
    console.log('- Organized:', metadata.properties.organized);
    console.log('- Danger Multiplier:', metadata.properties.dangerMultiplier);

    console.log('\nColor Palette:');
    console.log('- Floor:', metadata.palette.floor);
    console.log('- Wall:', metadata.palette.wall);
    console.log('- Accent:', metadata.palette.accent);
  }
}

/**
 * Example 3: Procedurally generating a diverse world
 */
export function example3_ProceduralWorld() {
  console.log('=== Example 3: Procedural World Generation ===');

  const world = new World(10, 10, 50, 50);

  // Generate diverse world based on position
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      let locationType: LocationType;
      let biome: BiomeType;

      // Central town
      if (x === 5 && y === 5) {
        locationType = LocationType.TOWN;
        biome = BiomeType.FOREST;
      }
      // Northern mountains (low Y)
      else if (y < 3) {
        locationType =
          Math.random() < 0.5 ? LocationType.CAVE : LocationType.WILDERNESS;
        biome = BiomeType.MOUNTAIN;
      }
      // Southern snowy region (high Y)
      else if (y > 7) {
        locationType = LocationType.WILDERNESS;
        biome = BiomeType.SNOWY;
      }
      // Eastern desert (high X)
      else if (x > 7) {
        locationType =
          Math.random() < 0.5 ? LocationType.RUINS : LocationType.WILDERNESS;
        biome = BiomeType.DESERT;
      }
      // Western swamp (low X)
      else if (x < 3) {
        locationType = LocationType.WILDERNESS;
        biome = BiomeType.SWAMP;
      }
      // Center: dungeons and ruins
      else {
        locationType =
          Math.random() < 0.7 ? LocationType.DUNGEON : LocationType.RUINS;
        biome = BiomeType.FOREST;
      }

      console.log(`(${x}, ${y}): ${locationType} - ${biome}`);

      // Note: Locations are created on-demand, not pre-generated
      // world.setCurrentLocation(x, y, locationType, biome);
    }
  }
}

/**
 * Example 4: Spawning entities based on location metadata
 */
export function example4_EntitySpawning(ecs: ECS, world: World) {
  console.log('=== Example 4: Entity Spawning Based on Location ===');

  world.setCurrentLocation(5, 5, LocationType.TOWN, BiomeType.FOREST);
  const location = world.getCurrentLocation();

  if (!location) return;

  const metadata = location.metadata;

  // Spawn player at center
  const center = location.getCenter();
  const playerId = createPlayer(ecs, center.x, center.y);
  console.log(`Spawned player at (${center.x}, ${center.y})`);

  // Spawn NPCs if location has them
  if (metadata.properties.hasNPCs) {
    for (let i = 0; i < 5; i++) {
      const pos = location.findRandomWalkablePosition();
      if (pos) {
        const npcId = createNPC(ecs, pos.x, pos.y);
        console.log(`Spawned NPC at (${pos.x}, ${pos.y})`);
      }
    }
  }

  // Spawn enemies based on danger level
  const enemyCount = Math.floor(metadata.properties.dangerMultiplier * 10);
  console.log(
    `Spawning ${enemyCount} enemies (danger multiplier: ${metadata.properties.dangerMultiplier})`
  );

  for (let i = 0; i < enemyCount; i++) {
    const pos = location.findRandomWalkablePosition();
    if (pos) {
      const enemyId = createEnemy(ecs, pos.x, pos.y);
      console.log(`Spawned enemy at (${pos.x}, ${pos.y})`);
    }
  }
}

/**
 * Example 5: Biome-specific gameplay
 */
export function example5_BiomeGameplay(world: World) {
  console.log('=== Example 5: Biome-Specific Gameplay ===');

  // Create different biome locations
  const biomes = [
    { type: LocationType.WILDERNESS, biome: BiomeType.SNOWY, x: 0, y: 0 },
    { type: LocationType.WILDERNESS, biome: BiomeType.VOLCANIC, x: 1, y: 0 },
    { type: LocationType.WILDERNESS, biome: BiomeType.SWAMP, x: 2, y: 0 },
    { type: LocationType.WILDERNESS, biome: BiomeType.WATER, x: 3, y: 0 },
  ];

  for (const config of biomes) {
    world.setCurrentLocation(config.x, config.y, config.type, config.biome);
    const location = world.getCurrentLocation();

    if (!location) continue;

    console.log(`\nLocation: ${location.name}`);
    console.log(`Biome: ${location.metadata.biome}`);

    // Apply biome-specific effects
    switch (location.metadata.biome) {
      case BiomeType.SNOWY:
        console.log('- Effect: Cold weather (movement speed -20%)');
        console.log('- Enemies: Ice Elementals, Frost Wolves');
        console.log('- Hazard: Frostbite over time');
        break;

      case BiomeType.VOLCANIC:
        console.log('- Effect: Extreme heat (constant fire damage)');
        console.log('- Enemies: Fire Elementals, Lava Golems');
        console.log('- Hazard: Lava pools deal massive damage');
        break;

      case BiomeType.SWAMP:
        console.log('- Effect: Disease risk (poison resistance -30%)');
        console.log('- Enemies: Swamp Creatures, Giant Insects');
        console.log('- Hazard: Quicksand and murky water');
        break;

      case BiomeType.WATER:
        console.log('- Effect: Swimming required (stamina drain)');
        console.log('- Enemies: Aquatic Monsters, Sea Serpents');
        console.log('- Hazard: Drowning if stamina depleted');
        break;
    }
  }
}

/**
 * Example 6: Exploring different location types
 */
export function example6_LocationTypeFeatures(world: World) {
  console.log('=== Example 6: Location Type Features ===');

  const locationTypes = [
    { type: LocationType.DUNGEON, x: 0, y: 0 },
    { type: LocationType.TOWN, x: 1, y: 0 },
    { type: LocationType.RUINS, x: 2, y: 0 },
    { type: LocationType.FACTION_BASE, x: 3, y: 0 },
    { type: LocationType.WILDERNESS, x: 4, y: 0 },
    { type: LocationType.CAVE, x: 5, y: 0 },
  ];

  for (const config of locationTypes) {
    world.setCurrentLocation(config.x, config.y, config.type, BiomeType.FOREST);
    const location = world.getCurrentLocation();

    if (!location) continue;

    const props = location.metadata.properties;

    console.log(`\n${props.name}:`);
    console.log(`- Room Density: ${(props.roomDensity * 100).toFixed(0)}%`);
    console.log(
      `- Corridor Density: ${(props.corridorDensity * 100).toFixed(0)}%`
    );
    console.log(`- Organized Layout: ${props.organized ? 'Yes' : 'No'}`);
    console.log(`- Contains NPCs: ${props.hasNPCs ? 'Yes' : 'No'}`);
    console.log(`- Contains Shops: ${props.hasShops ? 'Yes' : 'No'}`);
    console.log(`- Danger Level: ${props.dangerMultiplier}x`);
  }
}

/**
 * Example 7: Creating a custom location manually
 */
export function example7_CustomLocation() {
  console.log('=== Example 7: Custom Location Creation ===');

  // Create a custom named location
  const templeLocation = new Location(
    LJS.vec2(10, 10),
    60,
    60,
    'Ancient Desert Temple',
    LocationType.RUINS,
    BiomeType.DESERT
  );

  // Generate the layout
  templeLocation.generate();

  console.log(`Created custom location: ${templeLocation.name}`);
  console.log(`Size: ${templeLocation.width}x${templeLocation.height}`);
  console.log(`Type: ${templeLocation.metadata.locationType}`);
  console.log(`Biome: ${templeLocation.metadata.biome}`);
  console.log(
    `Palette: Floor=${templeLocation.metadata.palette.floor}, Wall=${templeLocation.metadata.palette.wall}`
  );

  // Render it
  templeLocation.render();
}

/**
 * Main example runner
 */
export function runAllLocationExamples() {
  console.log('========================================');
  console.log('Location Types & Biomes - Examples');
  console.log('========================================\n');

  example1_BasicUsage();
  console.log('\n');

  example2_AccessingMetadata();
  console.log('\n');

  example3_ProceduralWorld();
  console.log('\n');

  const world = new World(10, 10, 50, 50);
  const ecs = new ECS();
  example4_EntitySpawning(ecs, world);
  console.log('\n');

  example5_BiomeGameplay(world);
  console.log('\n');

  example6_LocationTypeFeatures(world);
  console.log('\n');

  example7_CustomLocation();
  console.log('\n');

  console.log('========================================');
  console.log('All examples completed!');
  console.log('========================================');
}
