/*
 * File: collisionDamageSystem.ts
 * Project: littlejs-rl
 * File Created: Saturday, 16th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Saturday, 16th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { AIComponent } from '../components/ai';
import ECS from '../ecs';
import { HealthComponent } from '../components/health';
import { PlayerComponent } from '../components/player';
import { PositionComponent } from '../components/position';
import { StatsComponent } from '../components/stats';

/**
 * Process collision-based combat damage
 *
 * Simple combat system for testing:
 * - When player moves onto enemy: damage enemy based on player strength
 * - When enemy moves onto player: damage player based on enemy strength
 * - Uses derived stats for damage calculation
 * - Considers defense for damage reduction
 *
 * Call this system after movement but before death system.
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs);
 *   playerMovementSystem(ecs);
 *   collisionDamageSystem(ecs); // Apply collision damage
 *   deathSystem(ecs); // Handle deaths from combat
 * }
 * ```
 */
export function collisionDamageSystem(ecs: ECS): void {
  // Get all entities with position and health
  const entities = ecs.query('position', 'health');

  // Build position map for collision detection
  const positionMap = new Map<string, number[]>();

  for (const entityId of entities) {
    const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
    if (!pos) continue;

    const key = `${Math.floor(pos.x)},${Math.floor(pos.y)}`;
    const existing = positionMap.get(key) || [];
    existing.push(entityId);
    positionMap.set(key, existing);
  }

  // Check for collisions at each position
  for (const entitiesAtPos of positionMap.values()) {
    if (entitiesAtPos.length < 2) continue; // No collision

    // Find player and enemies at this position
    const players = entitiesAtPos.filter((id) =>
      ecs.hasComponent(id, 'player')
    );
    const enemies = entitiesAtPos.filter(
      (id) => ecs.hasComponent(id, 'ai') && !ecs.hasComponent(id, 'player')
    );

    // Player vs Enemy combat
    if (players.length > 0 && enemies.length > 0) {
      for (const playerId of players) {
        for (const enemyId of enemies) {
          // Check if enemy is hostile
          const ai = ecs.getComponent<AIComponent>(enemyId, 'ai');
          if (!ai) continue;

          // Only damage if enemy is aggressive or hostile
          const isHostile =
            ai.disposition === 'aggressive' ||
            ai.disposition === 'hostile' ||
            ai.disposition === 'defensive';

          if (isHostile) {
            // Player damages enemy
            applyDamage(ecs, playerId, enemyId);
            // Enemy damages player
            applyDamage(ecs, enemyId, playerId);
          }
        }
      }
    }

    // Enemy vs Enemy combat (future: faction system)
    // Currently skipped - enemies don't fight each other
  }
}

/**
 * Apply damage from attacker to defender
 *
 * Damage calculation:
 * - Base damage = attacker strength (or derived.physicalDamage if available)
 * - Damage reduction = defender defense * 0.1 (10% per defense point)
 * - Final damage = max(1, baseDamage - reduction)
 *
 * @param ecs - The ECS instance
 * @param attackerId - Entity dealing damage
 * @param defenderId - Entity receiving damage
 * @returns Amount of damage dealt, or 0 if failed
 *
 * @example
 * ```typescript
 * // Player attacks enemy
 * const damageDealt = applyDamage(ecs, playerId, enemyId);
 * console.log(`Dealt ${damageDealt} damage!`);
 * ```
 */
export function applyDamage(
  ecs: ECS,
  attackerId: number,
  defenderId: number
): number {
  const attackerStats = ecs.getComponent<StatsComponent>(attackerId, 'stats');
  const defenderStats = ecs.getComponent<StatsComponent>(defenderId, 'stats');
  const defenderHealth = ecs.getComponent<HealthComponent>(
    defenderId,
    'health'
  );

  if (!attackerStats || !defenderStats || !defenderHealth) {
    return 0; // Can't apply damage
  }

  // Calculate base damage from strength
  const baseDamage = attackerStats.base.strength;

  // Calculate defense reduction
  const defense = defenderStats.derived.defense;
  const damageReduction = defense * 0.1; // 10% reduction per defense point

  // Calculate final damage (minimum 1)
  const finalDamage = Math.max(1, Math.floor(baseDamage - damageReduction));

  // Apply damage
  defenderHealth.current = Math.max(0, defenderHealth.current - finalDamage);

  // Log combat (for testing)
  const attackerName = ecs.hasComponent(attackerId, 'player')
    ? 'Player'
    : 'Enemy';
  const defenderName = ecs.hasComponent(defenderId, 'player')
    ? 'Player'
    : 'Enemy';

  console.log(
    `[Combat] ${attackerName} dealt ${finalDamage} damage to ${defenderName} (${defenderHealth.current}/${defenderHealth.max} HP remaining)`
  );

  return finalDamage;
}

/**
 * Check if two entities can engage in combat
 *
 * Validates:
 * - Both entities have health and stats
 * - Both entities are alive
 * - Entities are at the same position
 *
 * @param ecs - The ECS instance
 * @param entity1Id - First entity
 * @param entity2Id - Second entity
 * @returns True if combat can occur, false otherwise
 *
 * @example
 * ```typescript
 * if (canCombat(ecs, playerId, enemyId)) {
 *   applyDamage(ecs, playerId, enemyId);
 * }
 * ```
 */
export function canCombat(
  ecs: ECS,
  entity1Id: number,
  entity2Id: number
): boolean {
  // Check both have health and stats
  const entity1Health = ecs.getComponent<HealthComponent>(entity1Id, 'health');
  const entity2Health = ecs.getComponent<HealthComponent>(entity2Id, 'health');
  const entity1Stats = ecs.getComponent<StatsComponent>(entity1Id, 'stats');
  const entity2Stats = ecs.getComponent<StatsComponent>(entity2Id, 'stats');

  if (!entity1Health || !entity2Health || !entity1Stats || !entity2Stats) {
    return false;
  }

  // Check both are alive
  if (entity1Health.current <= 0 || entity2Health.current <= 0) {
    return false;
  }

  // Check positions match
  const pos1 = ecs.getComponent<PositionComponent>(entity1Id, 'position');
  const pos2 = ecs.getComponent<PositionComponent>(entity2Id, 'position');

  if (!pos1 || !pos2) {
    return false;
  }

  const sameX = Math.floor(pos1.x) === Math.floor(pos2.x);
  const sameY = Math.floor(pos1.y) === Math.floor(pos2.y);

  return sameX && sameY;
}
