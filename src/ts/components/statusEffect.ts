/*
 * File: statusEffect.ts
 * Project: littlejs-rl
 * File Created: 2025-01-14 12:15:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: 2025-01-14 12:15:00
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { StatusEffect, StatusEffectType } from '../types/elements';

/**
 * Component tracking active status effects on an entity
 * Multiple effects can be active simultaneously
 */
export interface StatusEffectComponent {
  /** Array of active status effects */
  effects: StatusEffect[];
}

/**
 * Helper function to create a default StatusEffectComponent
 */
export function createDefaultStatusEffect(): StatusEffectComponent {
  return {
    effects: [],
  };
}

/**
 * Helper function to add a status effect
 * If the effect already exists, refresh duration and increase strength
 */
export function addStatusEffect(
  component: StatusEffectComponent,
  type: StatusEffectType,
  duration: number,
  strength: number,
  source?: number
): void {
  const existing = component.effects.find((e) => e.type === type);

  if (existing) {
    // Refresh duration and stack strength
    existing.duration = Math.max(existing.duration, duration);
    existing.strength += strength * 0.5; // Stack at 50% effectiveness
    existing.source = source ?? existing.source;
  } else {
    component.effects.push({ type, duration, strength, source });
  }
}

/**
 * Helper function to remove a status effect
 */
export function removeStatusEffect(
  component: StatusEffectComponent,
  type: StatusEffectType
): void {
  component.effects = component.effects.filter((e) => e.type !== type);
}

/**
 * Helper function to check if an entity has a specific status effect
 */
export function hasStatusEffect(
  component: StatusEffectComponent,
  type: StatusEffectType
): boolean {
  return component.effects.some((e) => e.type === type);
}

/**
 * Helper function to get a specific status effect
 */
export function getStatusEffect(
  component: StatusEffectComponent,
  type: StatusEffectType
): StatusEffect | undefined {
  return component.effects.find((e) => e.type === type);
}

/**
 * Helper function to reduce all status effect durations by 1
 * Removes effects that reach 0 duration
 */
export function tickStatusEffects(component: StatusEffectComponent): void {
  component.effects = component.effects
    .map((effect) => ({
      ...effect,
      duration: effect.duration - 1,
    }))
    .filter((effect) => effect.duration > 0);
}

/**
 * Helper function to clear all status effects
 */
export function clearStatusEffects(component: StatusEffectComponent): void {
  component.effects = [];
}

/**
 * Helper function to get all active status effect types
 */
export function getActiveStatusEffectTypes(
  component: StatusEffectComponent
): StatusEffectType[] {
  return component.effects.map((e) => e.type);
}
