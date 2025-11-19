/*
 * File: state.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 19th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 19th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Entity State Tags - Common state flags
 *
 * Use these constants for consistency across systems.
 */
export const EntityState = {
  // Movement states
  MOVING: 'moving',
  WALKING: 'walking',
  RUNNING: 'running',
  JUMPING: 'jumping',
  FALLING: 'falling',

  // Combat states
  ATTACKING: 'attacking',
  DEFENDING: 'defending',
  STUNNED: 'stunned',
  KNOCKED_BACK: 'knockback',

  // Item/Inventory states
  IN_INVENTORY: 'inInventory',
  EQUIPPED: 'equipped',
  DROPPED: 'dropped',

  // Interaction states
  INTERACTING: 'interacting',
  TALKING: 'talking',
  LOOTING: 'looting',

  // Special states
  DEAD: 'dead',
  INVISIBLE: 'invisible',
  INVULNERABLE: 'invulnerable',
  FROZEN: 'frozen',
  BURNING: 'burning',
  POISONED: 'poisoned',

  // UI/System states
  SELECTED: 'selected',
  HOVERED: 'hovered',
  HIGHLIGHTED: 'highlighted',
} as const;

/**
 * State Component - Flexible tag-based state system
 *
 * Stores arbitrary state flags as a Set of strings.
 * Use EntityState constants for common states, or add custom states.
 *
 * Benefits:
 * - Add/remove states dynamically
 * - Query multiple states easily
 * - No component definition needed for new states
 * - Efficient Set operations
 *
 * @example
 * ```typescript
 * // Create entity with initial states
 * ecs.addComponent<StateComponent>(entityId, 'state', {
 *   states: new Set([EntityState.MOVING, EntityState.ATTACKING])
 * });
 *
 * // Check state
 * if (hasState(ecs, entityId, EntityState.ATTACKING)) {
 *   // Handle attack
 * }
 *
 * // Add state
 * addState(ecs, entityId, EntityState.STUNNED);
 *
 * // Remove state
 * removeState(ecs, entityId, EntityState.MOVING);
 * ```
 */
export interface StateComponent {
  /**
   * Set of active state tags
   */
  states: Set<string>;
}
