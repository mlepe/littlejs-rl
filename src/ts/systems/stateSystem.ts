/*
 * File: stateSystem.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 19th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 19th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import ECS from '../ecs';
import { StateComponent, EntityState } from '../components/state';

/**
 * Helper: Check if entity has a specific state
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to check
 * @param state - State tag to check for
 * @returns True if entity has the state
 *
 * @example
 * ```typescript
 * if (hasState(ecs, playerId, EntityState.ATTACKING)) {
 *   // Play attack animation
 * }
 * ```
 */
export function hasState(ecs: ECS, entityId: number, state: string): boolean {
  const stateComp = ecs.getComponent<StateComponent>(entityId, 'state');
  return stateComp?.states.has(state) ?? false;
}

/**
 * Helper: Check if entity has ALL of multiple states
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to check
 * @param states - Array of state tags
 * @returns True if entity has all states
 *
 * @example
 * ```typescript
 * if (hasAllStates(ecs, playerId, [EntityState.MOVING, EntityState.ATTACKING])) {
 *   // Moving attack
 * }
 * ```
 */
export function hasAllStates(
  ecs: ECS,
  entityId: number,
  states: string[]
): boolean {
  const stateComp = ecs.getComponent<StateComponent>(entityId, 'state');
  if (!stateComp) return false;

  return states.every((state) => stateComp.states.has(state));
}

/**
 * Helper: Check if entity has ANY of multiple states
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to check
 * @param states - Array of state tags
 * @returns True if entity has at least one state
 *
 * @example
 * ```typescript
 * if (hasAnyState(ecs, enemyId, [EntityState.STUNNED, EntityState.FROZEN])) {
 *   // Can't act
 * }
 * ```
 */
export function hasAnyState(
  ecs: ECS,
  entityId: number,
  states: string[]
): boolean {
  const stateComp = ecs.getComponent<StateComponent>(entityId, 'state');
  if (!stateComp) return false;

  return states.some((state) => stateComp.states.has(state));
}

/**
 * Helper: Add a state to an entity
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to modify
 * @param state - State tag to add
 * @returns True if state was added, false if already present or component missing
 *
 * @example
 * ```typescript
 * addState(ecs, playerId, EntityState.ATTACKING);
 * ```
 */
export function addState(ecs: ECS, entityId: number, state: string): boolean {
  let stateComp = ecs.getComponent<StateComponent>(entityId, 'state');

  // Create component if it doesn't exist
  if (!stateComp) {
    stateComp = { states: new Set() };
    ecs.addComponent<StateComponent>(entityId, 'state', stateComp);
  }

  const hadState = stateComp.states.has(state);
  stateComp.states.add(state);
  return !hadState; // Return true if state was newly added
}

/**
 * Helper: Add multiple states to an entity
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to modify
 * @param states - Array of state tags to add
 *
 * @example
 * ```typescript
 * addStates(ecs, enemyId, [EntityState.STUNNED, EntityState.BURNING]);
 * ```
 */
export function addStates(ecs: ECS, entityId: number, states: string[]): void {
  for (const state of states) {
    addState(ecs, entityId, state);
  }
}

/**
 * Helper: Remove a state from an entity
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to modify
 * @param state - State tag to remove
 * @returns True if state was removed, false if not present or component missing
 *
 * @example
 * ```typescript
 * removeState(ecs, playerId, EntityState.ATTACKING);
 * ```
 */
export function removeState(
  ecs: ECS,
  entityId: number,
  state: string
): boolean {
  const stateComp = ecs.getComponent<StateComponent>(entityId, 'state');
  if (!stateComp) return false;

  return stateComp.states.delete(state);
}

/**
 * Helper: Remove multiple states from an entity
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to modify
 * @param states - Array of state tags to remove
 *
 * @example
 * ```typescript
 * removeStates(ecs, enemyId, [EntityState.STUNNED, EntityState.FROZEN]);
 * ```
 */
export function removeStates(
  ecs: ECS,
  entityId: number,
  states: string[]
): void {
  for (const state of states) {
    removeState(ecs, entityId, state);
  }
}

/**
 * Helper: Toggle a state on/off
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to modify
 * @param state - State tag to toggle
 * @returns True if state is now active, false if now inactive
 *
 * @example
 * ```typescript
 * // Toggle highlight on/off
 * toggleState(ecs, itemId, EntityState.HIGHLIGHTED);
 * ```
 */
export function toggleState(
  ecs: ECS,
  entityId: number,
  state: string
): boolean {
  if (hasState(ecs, entityId, state)) {
    removeState(ecs, entityId, state);
    return false;
  } else {
    addState(ecs, entityId, state);
    return true;
  }
}

/**
 * Helper: Clear all states from an entity
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to modify
 *
 * @example
 * ```typescript
 * clearStates(ecs, playerId);
 * ```
 */
export function clearStates(ecs: ECS, entityId: number): void {
  const stateComp = ecs.getComponent<StateComponent>(entityId, 'state');
  if (stateComp) {
    stateComp.states.clear();
  }
}

/**
 * Helper: Get all states from an entity
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to query
 * @returns Array of state tags, or empty array if no component
 *
 * @example
 * ```typescript
 * const states = getStates(ecs, playerId);
 * console.log('Player states:', states);
 * ```
 */
export function getStates(ecs: ECS, entityId: number): string[] {
  const stateComp = ecs.getComponent<StateComponent>(entityId, 'state');
  return stateComp ? Array.from(stateComp.states) : [];
}

/**
 * Helper: Set entity states to exactly match provided array
 *
 * Clears existing states and sets new ones.
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to modify
 * @param states - Array of state tags to set
 *
 * @example
 * ```typescript
 * // Set exact states (replaces any existing)
 * setStates(ecs, playerId, [EntityState.MOVING, EntityState.RUNNING]);
 * ```
 */
export function setStates(ecs: ECS, entityId: number, states: string[]): void {
  let stateComp = ecs.getComponent<StateComponent>(entityId, 'state');

  if (!stateComp) {
    stateComp = { states: new Set() };
    ecs.addComponent<StateComponent>(entityId, 'state', stateComp);
  }

  stateComp.states.clear();
  for (const state of states) {
    stateComp.states.add(state);
  }
}
