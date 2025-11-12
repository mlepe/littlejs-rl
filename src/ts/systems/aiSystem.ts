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

import { AIComponent, PositionComponent, StatsComponent } from '../components';

import ECS from '../ecs';

/**
 * AI System - Controls NPC and enemy behavior
 *
 * Processes all entities with 'position', 'ai', and 'stats' components.
 * Implements different AI behaviors:
 * - Aggressive: Pursues and attacks player when in range
 * - Passive: Wanders randomly, ignores player
 * - Fleeing: Runs away from player when detected
 * - Patrol: (Not yet implemented)
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

    switch (ai.type) {
      case 'aggressive':
        if (distance <= ai.detectionRange) {
          ai.state = 'pursuing';
          ai.target = playerEntityId;

          // Move towards player
          const dx = Math.sign(playerPos.x - pos.x) * stats.speed;
          const dy = Math.sign(playerPos.y - pos.y) * stats.speed;
          pos.x += dx;
          pos.y += dy;

          // Attack if in range
          if (distance <= 1) {
            ai.state = 'attacking';
            // Trigger combat
          }
        } else {
          ai.state = 'idle';
        }
        break;

      case 'passive':
        // Random wandering
        if (Math.random() < 0.1) {
          pos.x += Math.floor(Math.random() * 3 - 1);
          pos.y += Math.floor(Math.random() * 3 - 1);
        }
        break;

      case 'fleeing':
        if (distance <= ai.detectionRange) {
          ai.state = 'fleeing';
          // Move away from player
          const dx = -Math.sign(playerPos.x - pos.x) * stats.speed;
          const dy = -Math.sign(playerPos.y - pos.y) * stats.speed;
          pos.x += dx;
          pos.y += dy;
        }
        break;
    }
  }
}
