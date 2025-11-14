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
  HealthComponent,
  LocationComponent,
  MovableComponent,
  PositionComponent,
  RenderComponent,
} from './components';
import {
  SPRITE_BOSS,
  SPRITE_ENEMY,
  SPRITE_FLEEING_CREATURE,
  SPRITE_NPC,
  SPRITE_PLAYER,
  getTileCoords,
} from './tileConfig';

import { AIComponent } from './components/ai';
import ECS from './ecs';
import { InputComponent } from './components/input';
import { PlayerComponent } from './components/player';
import { StatsComponent } from './components/stats';

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

  ecs.addComponent<StatsComponent>(playerId, 'stats', {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    charisma: 10,
    willpower: 10,
    toughness: 10,
    attractiveness: 10,
    defense: 5,
    dodge: 5,
    mindDefense: 5,
    magicalDefense: 5,
    speed: 1,
  });

  ecs.addComponent<InputComponent>(playerId, 'input', {
    moveX: 0,
    moveY: 0,
    action: false,
  });

  const playerCoords = getTileCoords(SPRITE_PLAYER);
  ecs.addComponent<RenderComponent>(playerId, 'render', {
    tileInfo: new LJS.TileInfo(LJS.vec2(playerCoords.x, playerCoords.y)),
    color: new LJS.Color(1, 1, 1), // White
    size: new LJS.Vector2(1, 1),
  });

  ecs.addComponent<MovableComponent>(playerId, 'movable', { speed: 1 });

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

  ecs.addComponent<StatsComponent>(enemyId, 'stats', {
    strength: 5,
    dexterity: 5,
    intelligence: 3,
    charisma: 3,
    willpower: 5,
    toughness: 8,
    attractiveness: 3,
    defense: 3,
    dodge: 3,
    mindDefense: 3,
    magicalDefense: 2,
    speed: 0.5,
  });

  ecs.addComponent<AIComponent>(enemyId, 'ai', {
    disposition: 'aggressive',
    detectionRange: 10,
    state: 'idle',
  });

  const enemyCoords = getTileCoords(SPRITE_ENEMY);
  ecs.addComponent<RenderComponent>(enemyId, 'render', {
    tileInfo: new LJS.TileInfo(LJS.vec2(enemyCoords.x, enemyCoords.y)),
    color: new LJS.Color(1, 0, 0), // Red
    size: new LJS.Vector2(1, 1),
  });

  ecs.addComponent<MovableComponent>(enemyId, 'movable', { speed: 1 });

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

  ecs.addComponent<StatsComponent>(npcId, 'stats', {
    strength: 2,
    dexterity: 8,
    intelligence: 12,
    charisma: 15,
    willpower: 10,
    toughness: 5,
    attractiveness: 12,
    defense: 1,
    dodge: 7,
    mindDefense: 10,
    magicalDefense: 8,
    speed: 0.8,
  });

  ecs.addComponent<AIComponent>(npcId, 'ai', {
    disposition: 'peaceful',
    detectionRange: 5,
    state: 'idle',
  });

  const npcCoords = getTileCoords(SPRITE_NPC);
  ecs.addComponent<RenderComponent>(npcId, 'render', {
    tileInfo: new LJS.TileInfo(LJS.vec2(npcCoords.x, npcCoords.y)),
    color: new LJS.Color(0, 1, 0), // Green
    size: new LJS.Vector2(1, 1),
  });

  ecs.addComponent<MovableComponent>(npcId, 'movable', { speed: 1 });

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

  ecs.addComponent<StatsComponent>(creatureId, 'stats', {
    strength: 1,
    dexterity: 15,
    intelligence: 3,
    charisma: 3,
    willpower: 5,
    toughness: 3,
    attractiveness: 5,
    defense: 1,
    dodge: 12,
    mindDefense: 3,
    magicalDefense: 2,
    speed: 1.5,
  });

  ecs.addComponent<AIComponent>(creatureId, 'ai', {
    disposition: 'fleeing',
    detectionRange: 12,
    state: 'idle',
  });

  const creatureCoords = getTileCoords(SPRITE_FLEEING_CREATURE);
  ecs.addComponent<RenderComponent>(creatureId, 'render', {
    tileInfo: new LJS.TileInfo(LJS.vec2(creatureCoords.x, creatureCoords.y)),
    color: new LJS.Color(1, 1, 0), // Yellow
    size: new LJS.Vector2(1, 1),
  });

  ecs.addComponent<MovableComponent>(creatureId, 'movable', { speed: 1 });

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

  ecs.addComponent<StatsComponent>(bossId, 'stats', {
    strength: 20,
    dexterity: 10,
    intelligence: 8,
    charisma: 5,
    willpower: 15,
    toughness: 25,
    attractiveness: 3,
    defense: 10,
    dodge: 6,
    mindDefense: 12,
    magicalDefense: 10,
    speed: 0.3,
  });

  ecs.addComponent<AIComponent>(bossId, 'ai', {
    disposition: 'aggressive',
    detectionRange: 15,
    state: 'idle',
  });

  const bossCoords = getTileCoords(SPRITE_BOSS);
  ecs.addComponent<RenderComponent>(bossId, 'render', {
    tileInfo: new LJS.TileInfo(LJS.vec2(bossCoords.x, bossCoords.y)),
    color: new LJS.Color(0.5, 0, 0.5), // Purple
    size: new LJS.Vector2(2, 2), // Larger size
  });

  ecs.addComponent<MovableComponent>(bossId, 'movable', { speed: 1 });

  return bossId;
}
