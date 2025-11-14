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
import { getRelationScore } from './relationSystem';

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

    // Determine if entity should be hostile based on disposition and relation
    let shouldAttack = false;
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

    // Behavior execution
    if (ai.disposition === 'fleeing' || (shouldAttack && distance > 1.5)) {
      // Fleeing behavior or need to retreat
      if (distance <= ai.detectionRange) {
        ai.state = 'fleeing';
        const dx = -Math.sign(playerPos.x - pos.x) * stats.speed;
        const dy = -Math.sign(playerPos.y - pos.y) * stats.speed;
        pos.x += dx;
        pos.y += dy;
      }
    } else if (shouldAttack && distance <= ai.detectionRange) {
      // Hostile behavior - pursue and attack
      ai.state = 'pursuing';
      ai.target = playerEntityId;

      if (distance > 1) {
        // Move towards player
        const dx = Math.sign(playerPos.x - pos.x) * stats.speed;
        const dy = Math.sign(playerPos.y - pos.y) * stats.speed;
        pos.x += dx;
        pos.y += dy;
      } else {
        // Attack if in range
        ai.state = 'attacking';
        // Combat system will handle damage
      }
    } else if (ai.disposition === 'patrol') {
      // Patrol behavior (simple wandering for now)
      ai.state = 'patrolling';
      if (Math.random() < 0.05) {
        pos.x += Math.floor(Math.random() * 3 - 1) * stats.speed;
        pos.y += Math.floor(Math.random() * 3 - 1) * stats.speed;
      }
    } else if (ai.disposition === 'peaceful' || ai.disposition === 'neutral') {
      // Peaceful wandering
      ai.state = 'idle';
      if (Math.random() < 0.05) {
        pos.x += Math.floor(Math.random() * 3 - 1) * stats.speed * 0.5;
        pos.y += Math.floor(Math.random() * 3 - 1) * stats.speed * 0.5;
      }
    } else {
      // Default idle state
      ai.state = 'idle';
    }
  }
}
