/*
 * File: examineSystem.ts
 * Project: littlejs-rl
 * File Created: Sunday, 17th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Sunday, 17th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { HealthComponent, PositionComponent } from '../components';

import ECS from '../ecs';
import Game from '../game';
import { ItemComponent } from '../components/item';
import { getTileName } from '../tile';

/**
 * Information about an entity at the examined position
 */
export interface ExaminedEntity {
  /** Display name of the entity */
  name: string;
  /** Type classification */
  type: 'player' | 'enemy' | 'npc' | 'item' | 'unknown';
  /** Optional additional details */
  details?: string;
}

/**
 * Complete examination data for a tile position
 */
export interface ExamineData {
  /** Human-readable tile name */
  tileName: string;
  /** Tile description or additional info */
  tileDescription: string;
  /** List of entities at this position */
  entities: ExaminedEntity[];
}

/**
 * Examine System - Gathers information about a specific tile position
 *
 * Queries the tile type and all entities at the given position,
 * returning formatted data for display.
 *
 * @param ecs - The ECS instance
 * @param x - X coordinate to examine
 * @param y - Y coordinate to examine
 * @returns Examination data, or null if position is invalid
 *
 * @example
 * ```typescript
 * const data = examineSystem(ecs, 10, 15);
 * if (data) {
 *   console.log(`Tile: ${data.tileName}`);
 *   for (const entity of data.entities) {
 *     console.log(`  - ${entity.name} (${entity.type})`);
 *   }
 * }
 * ```
 */
export function examineSystem(
  ecs: ECS,
  x: number,
  y: number
): ExamineData | null {
  const game = Game.getInstance();
  const location = game.getCurrentLocation();

  if (!location) {
    return null;
  }

  // Check bounds
  if (x < 0 || x >= location.width || y < 0 || y >= location.height) {
    return null;
  }

  // Get tile information
  const tile = location.getTile(x, y);
  const tileName = tile ? getTileName(tile.type) : 'Unknown';
  const tileDescription = tile?.walkable
    ? 'You can walk here.'
    : 'This blocks movement.';

  // Find all entities at this position
  const entitiesAtPosition: ExaminedEntity[] = [];
  const positionEntities = ecs.query('position');

  for (const entityId of positionEntities) {
    const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
    if (!pos || Math.floor(pos.x) !== x || Math.floor(pos.y) !== y) {
      continue;
    }

    // Determine entity type and name
    let entityType: ExaminedEntity['type'] = 'unknown';
    let entityName = 'Unknown Entity';
    let details: string | undefined;

    // Check if player
    if (ecs.hasComponent(entityId, 'player')) {
      entityType = 'player';
      entityName = 'You';
    }
    // Check if item
    else if (ecs.hasComponent(entityId, 'item')) {
      entityType = 'item';
      const item = ecs.getComponent<ItemComponent>(entityId, 'item');
      if (item) {
        // Show name based on identification level
        if (item.identified === 'unidentified') {
          entityName = `Unidentified ${item.itemType}`;
        } else {
          entityName = item.name;
        }
        details =
          item.identified === 'identified' ? item.description : undefined;
      }
    }
    // Check if enemy (has AI component)
    else if (ecs.hasComponent(entityId, 'ai')) {
      const health = ecs.getComponent<HealthComponent>(entityId, 'health');
      const hasPlayer = ecs.hasComponent(entityId, 'player');

      if (hasPlayer) {
        entityType = 'player';
        entityName = 'You';
      } else {
        // Check disposition to determine if NPC or enemy
        const ai = ecs.getComponent<{ disposition: string }>(entityId, 'ai');
        const isHostile =
          ai?.disposition === 'aggressive' ||
          ai?.disposition === 'hostile' ||
          ai?.disposition === 'defensive';

        entityType = isHostile ? 'enemy' : 'npc';
        entityName = isHostile ? 'Hostile Creature' : 'Creature';

        if (health) {
          details = `Health: ${health.current}/${health.max}`;
        }
      }
    }

    entitiesAtPosition.push({
      name: entityName,
      type: entityType,
      details,
    });
  }

  return {
    tileName,
    tileDescription,
    entities: entitiesAtPosition,
  };
}
