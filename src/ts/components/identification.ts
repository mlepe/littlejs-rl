/*
 * File: identification.ts
 * Project: littlejs-rl
 * File Created: Saturday, 16th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Saturday, 16th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Identification component tracks auto-identification progress for items in inventory
 *
 * Items gradually become identified over time through observation and use.
 * This component tracks the progress for entities that can identify items
 * (typically player characters with high intelligence/wisdom).
 *
 * Auto-identification is based on:
 * - Time spent in inventory
 * - Item usage/observation
 * - Character intelligence/skills
 *
 * @example
 * ```typescript
 * const identification = ecs.getComponent<IdentificationComponent>(playerId, 'identification');
 * identification.autoIdentifyRate = intelligence * 0.1; // Based on int stat
 * ```
 */
export interface IdentificationComponent {
  /**
   * Rate of auto-identification progress per second
   * Typically based on intelligence stat: intelligence * 0.1
   * Higher values = faster identification
   */
  autoIdentifyRate: number;

  /**
   * Accumulated identification progress for items
   * Map of itemEntityId -> progress (0.0 to 100.0)
   * When progress reaches 100, item becomes partially identified
   * At 200, item becomes fully identified
   */
  itemProgress: Map<number, number>;

  /**
   * Threshold for partial identification (default: 100)
   * When progress reaches this value, item gets 'partial' identification
   */
  partialThreshold: number;

  /**
   * Threshold for full identification (default: 200)
   * When progress reaches this value, item gets 'identified' identification
   */
  fullThreshold: number;

  /**
   * Whether auto-identification is currently active
   * Can be disabled in certain situations (e.g., during combat)
   */
  enabled: boolean;
}
