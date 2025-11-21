/*
 * File: factionSystem.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import type ECS from '../ecs';
import type { FactionComponent } from '../components/faction';
import type { RelationComponent } from '../components/relation';
import { FactionRegistry } from '../components/faction';
import { getRelationScore, relationSystem } from './relationSystem';

/**
 * Initialize faction relations for an entity
 * Automatically sets up relations with all faction members based on faction diplomacy
 */
export function initializeFactionRelations(
  ecs: ECS,
  entityId: number,
  factionId: string
): void {
  const registry = FactionRegistry.getInstance();
  const faction = registry.getFaction(factionId);

  if (!faction) {
    console.warn(`Faction ${factionId} not found`);
    return;
  }

  // Get all entities with factions
  const factionEntities = ecs.query('faction');

  for (const otherId of factionEntities) {
    if (otherId === entityId) continue;

    const otherFaction = ecs.getComponent<FactionComponent>(otherId, 'faction');
    if (!otherFaction) continue;

    // Determine relation based on faction diplomacy
    let relationScore = 0;

    if (registry.areAllied(factionId, otherFaction.factionId)) {
      relationScore = 50; // Allied factions start friendly
    } else if (registry.areEnemies(factionId, otherFaction.factionId)) {
      relationScore = -75; // Enemy factions start hostile
    } else {
      relationScore = 0; // Neutral factions start at 0
    }

    // Set bidirectional relations
    relationSystem(ecs, entityId, otherId, relationScore);
    relationSystem(ecs, otherId, entityId, relationScore);
  }
}

/**
 * Update faction reputation for an entity
 */
export function updateFactionReputation(
  ecs: ECS,
  entityId: number,
  delta: number
): void {
  const factionComp = ecs.getComponent<FactionComponent>(entityId, 'faction');
  if (!factionComp) return;

  factionComp.reputation = Math.max(
    0,
    Math.min(100, factionComp.reputation + delta)
  );
}

/**
 * Get relation modifier based on faction diplomacy
 * Returns additional relation points that should be applied when entities interact
 */
export function getFactionRelationModifier(
  ecs: ECS,
  entity1Id: number,
  entity2Id: number
): number {
  const faction1 = ecs.getComponent<FactionComponent>(entity1Id, 'faction');
  const faction2 = ecs.getComponent<FactionComponent>(entity2Id, 'faction');

  if (!faction1 || !faction2) return 0;

  const registry = FactionRegistry.getInstance();

  if (registry.areAllied(faction1.factionId, faction2.factionId)) {
    return 10; // Bonus for allied factions
  } else if (registry.areEnemies(faction1.factionId, faction2.factionId)) {
    return -10; // Penalty for enemy factions
  }

  return 0; // No modifier for neutral factions
}

/**
 * Apply faction-wide relation changes
 * When an entity does something that affects faction reputation, update all faction members' relations
 */
export function applyFactionWideRelation(
  ecs: ECS,
  actorId: number,
  targetFactionId: string,
  relationDelta: number
): void {
  const factionEntities = ecs.query('faction');

  for (const entityId of factionEntities) {
    const factionComp = ecs.getComponent<FactionComponent>(entityId, 'faction');

    if (factionComp && factionComp.factionId === targetFactionId) {
      // Update relation between actor and this faction member
      relationSystem(ecs, actorId, entityId, relationDelta);

      // Update reputation if actor is in same faction
      const actorFaction = ecs.getComponent<FactionComponent>(
        actorId,
        'faction'
      );
      if (actorFaction && actorFaction.factionId === targetFactionId) {
        updateFactionReputation(ecs, actorId, relationDelta * 0.1); // 10% of relation change
      }
    }
  }
}

/**
 * Check if entity should attack based on faction relations
 */
export function shouldAttackFaction(
  ecs: ECS,
  attackerId: number,
  targetId: number
): boolean {
  const attackerFaction = ecs.getComponent<FactionComponent>(
    attackerId,
    'faction'
  );
  const targetFaction = ecs.getComponent<FactionComponent>(targetId, 'faction');

  // No faction = use regular relation system only
  if (!attackerFaction || !targetFaction) {
    const relation = getRelationScore(ecs, attackerId, targetId);
    return relation !== undefined && relation < -20;
  }

  const registry = FactionRegistry.getInstance();

  // Always attack enemy factions
  if (registry.areEnemies(attackerFaction.factionId, targetFaction.factionId)) {
    return true;
  }

  // Never attack allied factions (unless individual relation is very negative)
  if (registry.areAllied(attackerFaction.factionId, targetFaction.factionId)) {
    const relation = getRelationScore(ecs, attackerId, targetId);
    return relation !== undefined && relation < -50; // Much lower threshold for allies
  }

  // For neutral factions, use regular relation system
  const relation = getRelationScore(ecs, attackerId, targetId);
  return relation !== undefined && relation < -20;
}

/**
 * Get faction display info for UI
 */
export function getFactionInfo(
  ecs: ECS,
  entityId: number
): { name: string; color: string; reputation: number } | undefined {
  const factionComp = ecs.getComponent<FactionComponent>(entityId, 'faction');
  if (!factionComp) return undefined;

  const registry = FactionRegistry.getInstance();
  const faction = registry.getFaction(factionComp.factionId);

  if (!faction) return undefined;

  return {
    name: faction.name,
    color: faction.color,
    reputation: factionComp.reputation,
  };
}
