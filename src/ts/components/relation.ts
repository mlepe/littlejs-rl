/*
 * File: relation.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 12th November 2025 2:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 12th November 2025 2:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Relation Component - Tracks an entity's relationship score with another entity
 *
 * Used to represent relationships between entities such as:
 * - NPC attitudes toward the player
 * - Faction relationships
 * - Dynamic alliance/hostility systems
 *
 * Relation scores can be used to determine AI behavior, dialogue options,
 * and other gameplay interactions.
 *
 * @example
 * ```typescript
 * // Create a relation component for an NPC that likes the player
 * ecs.addComponent<RelationComponent>(npcId, 'relation', {
 *   targetEntityId: playerId,
 *   relationScore: 50,
 *   minRelationScore: -100,
 *   maxRelationScore: 100
 * });
 *
 * // Update relation based on player actions
 * const relation = ecs.getComponent<RelationComponent>(npcId, 'relation');
 * if (relation) {
 *   relation.relationScore += 10; // Player helped the NPC
 *   relation.relationScore = Math.min(relation.relationScore, relation.maxRelationScore);
 * }
 * ```
 */
export interface RelationComponent {
  /** Entity ID of the target entity this relation is about */
  targetEntityId: number;
  /** Current relationship score (higher = better relationship) */
  relationScore: number;
  /** Minimum possible relationship score (typically negative for hostility) */
  minRelationScore: number;
  /** Maximum possible relationship score (typically positive for friendship) */
  maxRelationScore: number;
}
