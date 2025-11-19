/*
 * File: entities.ts
 * Project: littlejs-rl
 * File Created: Monday, 11th November 2025 11:30:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 11th November 2025 11:30:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import {
  AnimationComponent,
  HealthComponent,
  InventoryPanel,
  InventoryUIComponent,
  LocationComponent,
  MovableComponent,
  PositionComponent,
  RenderComponent,
  ViewModeComponent,
} from './components';
import {
  SPRITE_BOSS,
  SPRITE_ENEMY,
  SPRITE_FLEEING_CREATURE,
  SPRITE_NPC,
  SPRITE_PLAYER,
  TileSprite,
  getTileCoords,
} from './tileConfig';

import { AIComponent } from './components/ai';
import ECS from './ecs';
import { InputComponent } from './components/input';
import { PlayerComponent } from './components/player';
import { StateComponent } from './components/state';
import { StatsComponent } from './components/stats';
import { ViewMode } from './components/viewMode';
import { addLootTable } from './systems/lootSystem';
import { calculateDerivedStats } from './systems/derivedStatsSystem';
import {
  createHorizontalAnimation,
  switchAnimation,
} from './systems/basicAnimationSystem';

/**
 * Create a player entity with all required components
 *
 * The player entity includes:
 * - Position and location tracking
 * - Health and stats
 * - Input handling
 * - Rendering
 * - Movement capability
 *
 * @param ecs - The ECS instance
 * @param x - Initial X position in tiles
 * @param y - Initial Y position in tiles
 * @param worldX - World location X coordinate
 * @param worldY - World location Y coordinate
 * @returns The entity ID of the created player
 *
 * @example
 * ```typescript
 * const playerId = createPlayer(ecs, 25, 25, 5, 5);
 * ```
 */
export function createPlayer(
  ecs: ECS,
  x: number,
  y: number,
  worldX: number,
  worldY: number
): number {
  const playerId = ecs.createEntity();

  ecs.addComponent<PlayerComponent>(playerId, 'player', { isPlayer: true });

  ecs.addComponent<PositionComponent>(playerId, 'position', { x, y });

  ecs.addComponent<LocationComponent>(playerId, 'location', { worldX, worldY });

  ecs.addComponent<HealthComponent>(playerId, 'health', {
    current: 100,
    max: 100,
  });

  const playerBase = {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    charisma: 10,
    willpower: 10,
    toughness: 10,
    attractiveness: 10,
  };
  ecs.addComponent<StatsComponent>(playerId, 'stats', {
    base: playerBase,
    derived: calculateDerivedStats(playerBase),
  });

  ecs.addComponent<InputComponent>(playerId, 'input', {
    moveX: 0,
    moveY: 0,
    action: false,
    pickup: false,
    useItem: false,
    zoom: false,
    debugToggleCollision: false,
    debugToggleText: false,
    locationEnterWorldMap: false,
    worldMapEnterLocation: false,
    toggleExamine: false,
    toggleInventory: false,
  });

  // Add view mode component (starts in LOCATION view)
  ecs.addComponent<ViewModeComponent>(playerId, 'viewMode', {
    mode: ViewMode.LOCATION,
    worldMapCursorX: worldX,
    worldMapCursorY: worldY,
    examineCursorX: x,
    examineCursorY: y,
  });

  // Add inventory UI component for inventory screen state
  ecs.addComponent<InventoryUIComponent>(playerId, 'inventoryUI', {
    activePanel: InventoryPanel.INVENTORY,
    selectedItemIndex: 0,
    scrollOffset: 0,
    isDragging: false,
    dragItemId: undefined,
    dragSourceSlot: undefined,
    hoverItemId: undefined,
    hoverEquipSlot: undefined,
    showDetails: false,
    detailsItemId: undefined,
  });

  // Add empty inventory (capacity calculated from strength in derived stats)
  ecs.addComponent(playerId, 'inventory', {
    items: [],
    currentWeight: 0,
  });

  // Add equipment component with all slots empty
  ecs.addComponent(playerId, 'equipment', {
    head: undefined,
    face: undefined,
    neck: undefined,
    body: undefined,
    shoulderLeft: undefined,
    shoulderRight: undefined,
    wristLeft: undefined,
    wristRight: undefined,
    handLeft: undefined,
    handRight: undefined,
    mainHand: undefined,
    offHand: undefined,
    ringLeft: undefined,
    ringRight: undefined,
    back: undefined,
    belt: undefined,
    legs: undefined,
    feet: undefined,
  });

  // Add identification component (intelligence-based auto-identify)
  ecs.addComponent(playerId, 'identification', {
    autoIdentifyRate: playerBase.intelligence * 0.1, // 1.0 progress per second at 10 int
    itemProgress: new Map(),
    partialThreshold: 100,
    fullThreshold: 200,
    enabled: true,
  });

  // Render component - using proper enum reference
  const coords = getTileCoords(TileSprite.PLAYER_WARRIOR);
  ecs.addComponent<RenderComponent>(playerId, 'render', {
    tileInfo: new LJS.TileInfo(
      LJS.vec2(coords.x * 16, coords.y * 16),
      LJS.vec2(16, 16),
      0
    ),
    color: new LJS.Color(1, 1, 1), // White
    size: new LJS.Vector2(1, 1),
  });

  ecs.addComponent<MovableComponent>(playerId, 'movable', { speed: 1 });

  // Add state component (starts with no active states)
  ecs.addComponent<StateComponent>(playerId, 'state', {
    states: new Set(),
  });

  // Define multiple animation states
  const idleAnim = createHorizontalAnimation(0, 0, 16, 16, 1, 0.5, true);
  const walkAnim = createHorizontalAnimation(0, 0, 16, 16, 4, 0.2, true);
  const attackAnim = createHorizontalAnimation(0, 16, 16, 16, 3, 0.15, false);
  const deathAnim = createHorizontalAnimation(0, 32, 16, 16, 4, 0.2, false);

  ecs.addComponent<AnimationComponent>(playerId, 'animation', {
    animations: new Map([
      ['idle', idleAnim],
      ['walk', walkAnim],
      ['attack', attackAnim],
      ['death', deathAnim],
    ]),
    currentAnimation: 'idle',
    currentFrame: 0,
    timer: 0,
    playing: true,
  });

  return playerId;
}

/**
 * Create an enemy entity with aggressive AI
 *
 * The enemy will pursue and attack the player when within detection range.
 * Includes health, stats, AI, rendering, and movement.
 *
 * @param ecs - The ECS instance
 * @param x - Initial X position in tiles
 * @param y - Initial Y position in tiles
 * @param worldX - World location X coordinate
 * @param worldY - World location Y coordinate
 * @returns The entity ID of the created enemy
 *
 * @example
 * ```typescript
 * const enemyId = createEnemy(ecs, 10, 10, 5, 5);
 * ```
 */
export function createEnemy(
  ecs: ECS,
  x: number,
  y: number,
  worldX: number,
  worldY: number
): number {
  const enemyId = ecs.createEntity();

  ecs.addComponent<PositionComponent>(enemyId, 'position', { x, y });

  ecs.addComponent<LocationComponent>(enemyId, 'location', { worldX, worldY });

  ecs.addComponent<HealthComponent>(enemyId, 'health', {
    current: 50,
    max: 50,
  });

  const enemyBase = {
    strength: 5,
    dexterity: 5,
    intelligence: 3,
    charisma: 3,
    willpower: 5,
    toughness: 8,
    attractiveness: 3,
  };
  ecs.addComponent<StatsComponent>(enemyId, 'stats', {
    base: enemyBase,
    derived: calculateDerivedStats(enemyBase),
  });

  ecs.addComponent<AIComponent>(enemyId, 'ai', {
    disposition: 'aggressive',
    detectionRange: 10,
    state: 'idle',
  });

  const enemyCoords = getTileCoords(SPRITE_ENEMY);
  ecs.addComponent<RenderComponent>(enemyId, 'render', {
    tileInfo: new LJS.TileInfo(
      LJS.vec2(enemyCoords.x * 16, enemyCoords.y * 16),
      LJS.vec2(16, 16),
      0
    ),
    color: new LJS.Color(1, 1, 1), // White (preserves sprite colors)
    size: new LJS.Vector2(1, 1),
    outlineColor: new LJS.Color(1, 0, 0, 1), // Red outline for enemies
    outlineWidth: 0.1, // Thin red border
  });

  ecs.addComponent<MovableComponent>(enemyId, 'movable', { speed: 1 });

  // Add state component (starts with no active states)
  ecs.addComponent<StateComponent>(enemyId, 'state', {
    states: new Set(),
  });

  // Add loot table (goblin drops)
  addLootTable(ecs, enemyId, [
    { itemId: 'gold_coin', dropChance: 1.0, minQuantity: 1, maxQuantity: 5 },
    { itemId: 'bread', dropChance: 0.3, minQuantity: 1, maxQuantity: 2 },
    {
      itemId: 'health_potion',
      dropChance: 0.15,
      minQuantity: 1,
      maxQuantity: 1,
    },
  ]);

  return enemyId;
}

/**
 * Create a passive NPC entity
 *
 * NPCs wander randomly and do not attack.
 * Includes health, stats, passive AI, rendering, and movement.
 *
 * @param ecs - The ECS instance
 * @param x - Initial X position in tiles
 * @param y - Initial Y position in tiles
 * @param worldX - World location X coordinate
 * @param worldY - World location Y coordinate
 * @returns The entity ID of the created NPC
 *
 * @example
 * ```typescript
 * const npcId = createNPC(ecs, 15, 8, 5, 5);
 * ```
 */
export function createNPC(
  ecs: ECS,
  x: number,
  y: number,
  worldX: number,
  worldY: number
): number {
  const npcId = ecs.createEntity();

  ecs.addComponent<PositionComponent>(npcId, 'position', { x, y });

  ecs.addComponent<LocationComponent>(npcId, 'location', { worldX, worldY });

  ecs.addComponent<HealthComponent>(npcId, 'health', {
    current: 30,
    max: 30,
  });

  const npcBase = {
    strength: 2,
    dexterity: 8,
    intelligence: 12,
    charisma: 15,
    willpower: 10,
    toughness: 5,
    attractiveness: 12,
  };
  ecs.addComponent<StatsComponent>(npcId, 'stats', {
    base: npcBase,
    derived: calculateDerivedStats(npcBase),
  });

  ecs.addComponent<AIComponent>(npcId, 'ai', {
    disposition: 'peaceful',
    detectionRange: 5,
    state: 'idle',
  });

  const npcCoords = getTileCoords(SPRITE_NPC);
  ecs.addComponent<RenderComponent>(npcId, 'render', {
    tileInfo: new LJS.TileInfo(
      LJS.vec2(npcCoords.x * 16, npcCoords.y * 16),
      LJS.vec2(16, 16),
      0
    ),
    color: new LJS.Color(0, 1, 0), // Green
    size: new LJS.Vector2(1, 1),
  });

  ecs.addComponent<MovableComponent>(npcId, 'movable', { speed: 1 });

  // Add state component (starts with no active states)
  ecs.addComponent<StateComponent>(npcId, 'state', {
    states: new Set(),
  });

  return npcId;
}

/**
 * Create a fleeing creature entity
 *
 * Creatures flee from the player when detected.
 * Fast movement speed, low health. Includes AI, rendering, and movement.
 *
 * @param ecs - The ECS instance
 * @param x - Initial X position in tiles
 * @param y - Initial Y position in tiles
 * @param worldX - World location X coordinate
 * @param worldY - World location Y coordinate
 * @returns The entity ID of the created creature
 *
 * @example
 * ```typescript
 * const creatureId = createFleeingCreature(ecs, 20, 20, 5, 5);
 * ```
 */
export function createFleeingCreature(
  ecs: ECS,
  x: number,
  y: number,
  worldX: number,
  worldY: number
): number {
  const creatureId = ecs.createEntity();

  ecs.addComponent<PositionComponent>(creatureId, 'position', { x, y });

  ecs.addComponent<LocationComponent>(creatureId, 'location', {
    worldX,
    worldY,
  });

  ecs.addComponent<HealthComponent>(creatureId, 'health', {
    current: 20,
    max: 20,
  });

  const creatureBase = {
    strength: 1,
    dexterity: 15,
    intelligence: 3,
    charisma: 3,
    willpower: 5,
    toughness: 3,
    attractiveness: 5,
  };
  ecs.addComponent<StatsComponent>(creatureId, 'stats', {
    base: creatureBase,
    derived: calculateDerivedStats(creatureBase),
  });

  ecs.addComponent<AIComponent>(creatureId, 'ai', {
    disposition: 'fleeing',
    detectionRange: 12,
    state: 'idle',
  });

  const creatureCoords = getTileCoords(SPRITE_FLEEING_CREATURE);
  ecs.addComponent<RenderComponent>(creatureId, 'render', {
    tileInfo: new LJS.TileInfo(
      LJS.vec2(creatureCoords.x * 16, creatureCoords.y * 16),
      LJS.vec2(16, 16),
      0
    ),
    color: new LJS.Color(1, 1, 0), // Yellow
    size: new LJS.Vector2(1, 1),
  });

  ecs.addComponent<MovableComponent>(creatureId, 'movable', { speed: 1 });

  // Add state component (starts with no active states)
  ecs.addComponent<StateComponent>(creatureId, 'state', {
    states: new Set(),
  });

  return creatureId;
}

/**
 * Create a boss enemy entity with enhanced stats
 *
 * Powerful enemy with high health, damage, and detection range.
 * Larger size (2x2), aggressive AI. Suitable for boss encounters.
 *
 * @param ecs - The ECS instance
 * @param x - Initial X position in tiles
 * @param y - Initial Y position in tiles
 * @param worldX - World location X coordinate
 * @param worldY - World location Y coordinate
 * @returns The entity ID of the created boss
 *
 * @example
 * ```typescript
 * const bossId = createBoss(ecs, 25, 25, 6, 6);
 * ```
 */
export function createBoss(
  ecs: ECS,
  x: number,
  y: number,
  worldX: number,
  worldY: number
): number {
  const bossId = ecs.createEntity();

  ecs.addComponent<PositionComponent>(bossId, 'position', { x, y });

  ecs.addComponent<LocationComponent>(bossId, 'location', { worldX, worldY });

  ecs.addComponent<HealthComponent>(bossId, 'health', {
    current: 200,
    max: 200,
  });

  const bossBase = {
    strength: 20,
    dexterity: 10,
    intelligence: 8,
    charisma: 5,
    willpower: 15,
    toughness: 25,
    attractiveness: 3,
  };
  ecs.addComponent<StatsComponent>(bossId, 'stats', {
    base: bossBase,
    derived: calculateDerivedStats(bossBase),
  });

  ecs.addComponent<AIComponent>(bossId, 'ai', {
    disposition: 'aggressive',
    detectionRange: 15,
    state: 'idle',
  });

  const bossCoords = getTileCoords(SPRITE_BOSS);
  ecs.addComponent<RenderComponent>(bossId, 'render', {
    tileInfo: new LJS.TileInfo(
      LJS.vec2(bossCoords.x * 16, bossCoords.y * 16),
      LJS.vec2(16, 16),
      0
    ),
    color: new LJS.Color(0.5, 0, 0.5), // Purple
    size: new LJS.Vector2(2, 2), // Larger size
    outlineColor: new LJS.Color(1, 0, 0, 1), // Red outline for bosses
    outlineWidth: 0.15, // Thicker border for bosses
  });

  ecs.addComponent<MovableComponent>(bossId, 'movable', { speed: 1 });

  // Add state component (starts with no active states)
  ecs.addComponent<StateComponent>(bossId, 'state', {
    states: new Set(),
  });

  // Add boss loot table (rare items with high quality)
  addLootTable(ecs, bossId, [
    { itemId: 'gold_coin', dropChance: 1.0, minQuantity: 50, maxQuantity: 150 },
    {
      itemId: 'steel_sword',
      dropChance: 0.8,
      minQuantity: 1,
      maxQuantity: 1,
      qualityRange: { min: 1, max: 3 },
      blessChance: 0.3,
    },
    {
      itemId: 'iron_armor',
      dropChance: 0.6,
      minQuantity: 1,
      maxQuantity: 1,
      qualityRange: { min: 0, max: 2 },
    },
    {
      itemId: 'health_potion',
      dropChance: 1.0,
      minQuantity: 3,
      maxQuantity: 5,
    },
    { itemId: 'mana_potion', dropChance: 0.8, minQuantity: 2, maxQuantity: 4 },
    {
      itemId: 'mithril_sword',
      dropChance: 0.05,
      minQuantity: 1,
      maxQuantity: 1,
      blessChance: 0.5,
    },
  ]);

  return bossId;
}
