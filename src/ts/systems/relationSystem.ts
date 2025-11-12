/*
 * File: relationSystem.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 12th November 2025 2:15:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 12th November 2025 2:15:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import ECS from '../ecs';
import { RelationComponent } from '../components';

/**
 * Relation System - Manages relationship scores between entities
 *
 * This system processes entities with 'relation' components and ensures
 * relationship scores stay within their defined bounds. It can be called
 * when an action occurs that should affect relationships (e.g., combat,
 * dialogue, trading, helping).
 *
 * The system does NOT automatically detect actions - it should be called
 * explicitly when relationship-affecting events occur, passing the entity
 * and targetEntity IDs along with a score delta.
 *
 * Note: Each entity can only track ONE relation at a time with the current
 * ECS implementation. For multiple relations, consider modifying RelationComponent
 * to store a Map<number, RelationData> instead.
 *
 * @param ecs - The ECS instance
 * @param entityId - The entity whose relation component to update
 * @param targetEntityId - The target entity the relation is about
 * @param scoreDelta - Amount to change the relation score (positive or negative)
 *
 * @example
 * ```typescript
 * // Player helps an NPC - improve relationship
 * relationSystem(ecs, npcId, playerId, 10);
 *
 * // Enemy attacked by player - worsen relationship
 * relationSystem(ecs, enemyId, playerId, -20);
 *
 * // Typical integration in combat system:
 * function combatSystem(ecs: ECS) {
 *   // ... combat logic ...
 *   if (attackHit) {
 *     // Update defender's relation toward attacker (gets worse)
 *     relationSystem(ecs, defenderId, attackerId, -15);
 *   }
 * }
 * ```
 */
export function relationSystem(
  ecs: ECS,
  entityId: number,
  targetEntityId: number,
  scoreDelta: number
): void {
  // Get the relation component for this entity
  const relation = ecs.getComponent<RelationComponent>(entityId, 'relation');

  if (!relation) {
    return;
  }

  // Only update if this relation is tracking the specified target
  if (relation.targetEntityId !== targetEntityId) {
    return;
  }

  // Update the relation score
  relation.relationScore += scoreDelta;

  // Clamp to min/max bounds
  relation.relationScore = Math.max(
    relation.minRelationScore,
    Math.min(relation.relationScore, relation.maxRelationScore)
  );
}

/**
 * Get Relation Score - Retrieves the current relation score between two entities
 *
 * Helper function to query the relationship score that one entity has toward another.
 * Returns undefined if no relation component exists or if the relation is tracking
 * a different target entity.
 *
 * @param ecs - The ECS instance
 * @param entityId - The entity whose perspective we're checking
 * @param targetEntityId - The target entity to check the relation toward
 * @returns The relation score, or undefined if no relation exists
 *
 * @example
 * ```typescript
 * const npcAttitude = getRelationScore(ecs, npcId, playerId);
 * if (npcAttitude !== undefined && npcAttitude > 50) {
 *   console.log('NPC is friendly!');
 * } else if (npcAttitude !== undefined && npcAttitude < -20) {
 *   console.log('NPC is hostile!');
 * }
 * ```
 */
export function getRelationScore(
  ecs: ECS,
  entityId: number,
  targetEntityId: number
): number | undefined {
  const relation = ecs.getComponent<RelationComponent>(entityId, 'relation');

  if (!relation) {
    return undefined;
  }

  // Only return score if this relation is tracking the specified target
  if (relation.targetEntityId !== targetEntityId) {
    return undefined;
  }

  return relation.relationScore;
}
