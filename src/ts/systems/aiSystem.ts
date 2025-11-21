/*
 * File: aiSystem.ts
 * Project: littlejs-rl
 * File Created: Monday, 11th November 2025 11:30:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 11th November 2025 11:30:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import {
  AIComponent,
  PositionComponent,
  RelationComponent,
  StatsComponent,
} from '../components';

import ECS from '../ecs';
import { collisionSystem } from './collisionSystem';
import { combatSystem } from './combatSystem';
import { getRelationScore } from './relationSystem';
import { shouldAttackFaction } from './factionSystem';

/**
 * AI System - Controls entity behavior based on disposition and relations
 *
 * Processes all entities with 'position', 'ai', and 'stats' components.
 * Implements disposition-based behaviors that consider relation scores:
 * - peaceful: Never attacks, always friendly
 * - neutral: Reacts based on relation scores
 * - defensive: Attacks when provoked or relation is very negative
 * - aggressive: Attacks entities with negative relations
 * - hostile: Attacks all except those with positive relations
 * - patrol: Patrols area, reacts to threats based on relations
 * - fleeing: Runs away from threats
 *
 * @param ecs - The ECS instance
 * @param playerEntityId - The player's entity ID for targeting
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs);
 *   playerMovementSystem(ecs);
 *   aiSystem(ecs, playerId); // Process AI after player
 * }
 * ```
 */
export function aiSystem(ecs: ECS, playerEntityId: number): void {
  const aiEntities = ecs.query('position', 'ai', 'stats');

  for (const entityId of aiEntities) {
    const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
    const ai = ecs.getComponent<AIComponent>(entityId, 'ai');
    const stats = ecs.getComponent<StatsComponent>(entityId, 'stats');
    const playerPos = ecs.getComponent<PositionComponent>(
      playerEntityId,
      'position'
    );

    if (!pos || !ai || !stats || !playerPos) continue;

    const distance = Math.sqrt(
      Math.pow(playerPos.x - pos.x, 2) + Math.pow(playerPos.y - pos.y, 2)
    );

    // Get relation score to determine if entity should attack
    const relationScore = getRelationScore(ecs, entityId, playerEntityId) ?? 0;

    // Check faction relations first (overrides disposition for faction members)
    const factionAttack = shouldAttackFaction(ecs, entityId, playerEntityId);

    // Determine if entity should be hostile based on disposition and relation
    let shouldAttack = false;

    // Faction relations take priority if both entities have factions
    if (
      ecs.getComponent(entityId, 'faction') &&
      ecs.getComponent(playerEntityId, 'faction')
    ) {
      shouldAttack = factionAttack;
    } else {
      // Fall back to disposition-based behavior
      switch (ai.disposition) {
        case 'peaceful':
          shouldAttack = false; // Never attacks
          break;
        case 'neutral':
          shouldAttack = relationScore < -20; // Attack if significantly negative
          break;
        case 'defensive':
          shouldAttack = relationScore < -40; // Attack if very negative
          break;
        case 'aggressive':
          shouldAttack = relationScore < 0; // Attack if any negativity
          break;
        case 'hostile':
          shouldAttack = relationScore <= 10; // Attack unless positive relation
          break;
        case 'patrol':
          shouldAttack = relationScore < -10; // Attack threats during patrol
          break;
        case 'fleeing':
          shouldAttack = false; // Never attacks, only flees
          break;
      }
    }

    // Behavior execution
    if (ai.disposition === 'fleeing' || (shouldAttack && distance > 1.5)) {
      // Fleeing behavior or need to retreat
      if (distance <= ai.detectionRange) {
        ai.state = 'fleeing';
        const dx = -Math.sign(playerPos.x - pos.x) * stats.derived.speed;
        const dy = -Math.sign(playerPos.y - pos.y) * stats.derived.speed;
        const newX = pos.x + dx;
        const newY = pos.y + dy;

        // Check collision before moving
        if (collisionSystem(ecs, entityId, newX, newY)) {
          pos.x = newX;
          pos.y = newY;
        }
      }
    } else if (shouldAttack && distance <= ai.detectionRange) {
      // Hostile behavior - pursue and attack
      ai.state = 'pursuing';
      ai.target = playerEntityId;

      if (distance > 1) {
        // Move towards player
        const dx = Math.sign(playerPos.x - pos.x) * stats.derived.speed;
        const dy = Math.sign(playerPos.y - pos.y) * stats.derived.speed;
        const newX = pos.x + dx;
        const newY = pos.y + dy;

        // Check if target tile is occupied - if so, attack
        if (!collisionSystem(ecs, entityId, newX, newY)) {
          // Target occupied (likely the player) - perform melee attack
          const attackResult = combatSystem(ecs, entityId, newX, newY);

          if (attackResult && attackResult.hit) {
            ai.state = 'attacking';
            if (attackResult.killed) {
              console.log('AI killed target!');
            }
          }
        } else {
          // Path is clear - move toward target
          pos.x = newX;
          pos.y = newY;
        }
      } else {
        // Already adjacent - attack
        ai.state = 'attacking';
        const attackResult = combatSystem(
          ecs,
          entityId,
          playerPos.x,
          playerPos.y
        );

        if (attackResult && attackResult.hit) {
          if (attackResult.killed) {
            console.log('AI killed player!');
          }
        }
      }
    } else if (ai.disposition === 'patrol') {
      // Patrol behavior (simple wandering for now)
      ai.state = 'patrolling';
      if (Math.random() < 0.05) {
        const newX =
          pos.x + Math.floor(Math.random() * 3 - 1) * stats.derived.speed;
        const newY =
          pos.y + Math.floor(Math.random() * 3 - 1) * stats.derived.speed;

        // Check collision before moving
        if (collisionSystem(ecs, entityId, newX, newY)) {
          pos.x = newX;
          pos.y = newY;
        }
      }
    } else if (ai.disposition === 'peaceful' || ai.disposition === 'neutral') {
      // Peaceful wandering
      ai.state = 'idle';
      if (Math.random() < 0.05) {
        const newX =
          pos.x + Math.floor(Math.random() * 3 - 1) * stats.derived.speed * 0.5;
        const newY =
          pos.y + Math.floor(Math.random() * 3 - 1) * stats.derived.speed * 0.5;

        // Check collision before moving
        if (collisionSystem(ecs, entityId, newX, newY)) {
          pos.x = newX;
          pos.y = newY;
        }
      }
    } else {
      // Default idle state
      ai.state = 'idle';
    }
  }
}
