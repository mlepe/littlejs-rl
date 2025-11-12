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
 * Relation Data - Individual relationship data for one target entity
 */
export interface RelationData {
  /** Current relationship score (higher = better relationship) */
  relationScore: number;
  /** Minimum possible relationship score (typically negative for hostility) */
  minRelationScore: number;
  /** Maximum possible relationship score (typically positive for friendship) */
  maxRelationScore: number;
}

/**
 * Relation Component - Tracks an entity's relationship scores with multiple entities
 *
 * Used to represent relationships between entities such as:
 * - NPC attitudes toward the player and other NPCs
 * - Faction relationships
 * - Dynamic alliance/hostility systems
 *
 * Each entity can track relations with multiple other entities using a Map.
 * Relation scores can be used to determine AI behavior, dialogue options,
 * and other gameplay interactions.
 *
 * @example
 * ```typescript
 * // Create a relation component for an NPC
 * ecs.addComponent<RelationComponent>(npcId, 'relation', {
 *   relations: new Map()
 * });
 *
 * // Add relation toward player
 * const npcRelations = ecs.getComponent<RelationComponent>(npcId, 'relation');
 * if (npcRelations) {
 *   npcRelations.relations.set(playerId, {
 *     relationScore: 50,
 *     minRelationScore: -100,
 *     maxRelationScore: 100
 *   });
 * }
 *
 * // Check relation score
 * const playerRelation = npcRelations.relations.get(playerId);
 * if (playerRelation && playerRelation.relationScore > 50) {
 *   console.log('NPC is friendly!');
 * }
 * ```
 */
export interface RelationComponent {
  /** Map of target entity IDs to their relation data */
  relations: Map<number, RelationData>;
}
