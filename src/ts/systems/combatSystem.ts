/*
 * File: combatSystem.ts
 * Project: littlejs-rl
 * File Created: Sunday, 17th November 2025 1:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Sunday, 17th November 2025 1:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import type ECS from '../ecs';
import type { HealthComponent } from '../components/health';
import type { PositionComponent } from '../components/position';
import type { RenderComponent } from '../components/render';
import type { StatsComponent } from '../components/stats';
import { relationSystem } from './relationSystem';
import {
  addFlashEffect,
  addOffsetEffect,
  addShakeEffect,
} from './visualEffectSystem';

/**
 * Result of a melee attack
 */
export interface AttackResult {
  /** Whether the attack hit */
  hit: boolean;
  /** Damage dealt (0 if missed) */
  damage: number;
  /** Whether the target died */
  killed: boolean;
}

/**
 * Perform a melee attack from one entity to another
 *
 * Calculates damage based on attacker's strength and defender's defense,
 * applies damage to target's health, and updates relations.
 *
 * @param ecs - The ECS instance
 * @param attackerId - Entity performing the attack
 * @param defenderId - Entity being attacked
 * @returns Attack result with hit/damage/killed info
 *
 * @example
 * ```typescript
 * // Player attacks enemy
 * const result = meleeAttack(ecs, playerId, enemyId);
 * if (result.hit) {
 *   console.log(`Hit for ${result.damage} damage!`);
 *   if (result.killed) {
 *     console.log('Enemy defeated!');
 *   }
 * }
 * ```
 */
export function meleeAttack(
  ecs: ECS,
  attackerId: number,
  defenderId: number
): AttackResult {
  const attackerStats = ecs.getComponent<StatsComponent>(attackerId, 'stats');
  const defenderStats = ecs.getComponent<StatsComponent>(defenderId, 'stats');
  const defenderHealth = ecs.getComponent<HealthComponent>(
    defenderId,
    'health'
  );

  if (!attackerStats || !defenderStats || !defenderHealth) {
    return { hit: false, damage: 0, killed: false };
  }

  // Simple damage calculation: strength - defense, minimum 1
  const rawDamage = attackerStats.base.strength - defenderStats.derived.defense;
  const damage = Math.max(1, rawDamage);

  // Apply damage
  defenderHealth.current -= damage;
  const killed = defenderHealth.current <= 0;

  // Add damage flash effect
  const defenderRender = ecs.getComponent<RenderComponent>(
    defenderId,
    'render'
  );
  if (defenderRender) {
    defenderRender.damageFlashTimer = 0.2; // Flash for 0.2 seconds
    defenderRender.floatingDamage = {
      amount: damage,
      timer: 0.5, // Display for 0.5 seconds
      offsetY: 0,
    };
  }

  // Add visual effects (shake, flash, recoil)
  addFlashEffect(ecs, defenderId, new LJS.Color(1, 0.2, 0.2, 1), 0.15);
  addShakeEffect(ecs, defenderId, 0.15, 0.2);

  // Add attack recoil effect to attacker (jump toward defender)
  const attackerPos = ecs.getComponent<PositionComponent>(
    attackerId,
    'position'
  );
  const defenderPos = ecs.getComponent<PositionComponent>(
    defenderId,
    'position'
  );

  if (attackerPos && defenderPos) {
    // Calculate direction from attacker to defender
    const dx = defenderPos.x - attackerPos.x;
    const dy = defenderPos.y - attackerPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      // Normalize and scale for small jump toward target
      const jumpX = (dx / distance) * 0.15;
      const jumpY = (dy / distance) * 0.15;
      addOffsetEffect(ecs, attackerId, LJS.vec2(jumpX, jumpY), 0.15, 'easeOut');
    }
  }

  // Update relations (attacker now hostile to defender)
  relationSystem(ecs, defenderId, attackerId, -15);

  // If defender has allies, they also become hostile
  // (This could be expanded with a faction system later)

  return {
    hit: true,
    damage,
    killed,
  };
}

/**
 * Get the entity at a specific tile position
 *
 * Helper function to find which entity (if any) occupies a tile.
 *
 * @param ecs - The ECS instance
 * @param x - Tile X coordinate
 * @param y - Tile Y coordinate
 * @returns Entity ID at position, or undefined if none
 */
export function getEntityAtPosition(
  ecs: ECS,
  x: number,
  y: number
): number | undefined {
  const entities = ecs.query('position');

  for (const entityId of entities) {
    const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
    if (!pos) continue;

    const tileX = Math.floor(pos.x);
    const tileY = Math.floor(pos.y);

    if (tileX === Math.floor(x) && tileY === Math.floor(y)) {
      return entityId;
    }
  }

  return undefined;
}

/**
 * Combat System - Handles melee attacks between entities
 *
 * This is called when an entity attempts to move into a tile
 * occupied by another entity. Instead of blocking, it triggers
 * a melee attack.
 *
 * @param ecs - The ECS instance
 * @param attackerId - Entity initiating the attack
 * @param targetX - Target tile X coordinate
 * @param targetY - Target tile Y coordinate
 * @returns Attack result if combat occurred, undefined if no target
 */
export function combatSystem(
  ecs: ECS,
  attackerId: number,
  targetX: number,
  targetY: number
): AttackResult | undefined {
  const defenderId = getEntityAtPosition(ecs, targetX, targetY);

  if (defenderId === undefined || defenderId === attackerId) {
    return undefined;
  }

  return meleeAttack(ecs, attackerId, defenderId);
}
