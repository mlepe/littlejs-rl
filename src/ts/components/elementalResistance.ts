/*
 * File: elementalResistance.ts
 * Project: littlejs-rl
 * File Created: 2025-01-14 12:05:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: 2025-01-14 12:05:00
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { ElementType } from '../types/elements';

/**
 * Component storing an entity's resistance to each element type
 *
 * Flat reduction: Direct damage reduction (applied first)
 * Percent resistance: Percentage damage reduction (applied after flat)
 *
 * Negative values indicate vulnerability/weakness:
 * - Flat: Entity takes additional flat damage
 * - Percent: Entity takes increased percentage damage
 *
 * Example:
 * - flatReduction[FIRE] = 10 → Reduces fire damage by 10
 * - percentResistance[FIRE] = 0.5 → Reduces fire damage by 50%
 * - flatReduction[COLD] = -5 → Takes 5 extra cold damage
 * - percentResistance[COLD] = -0.25 → Takes 25% more cold damage
 */
export interface ElementalResistanceComponent {
  /** Flat damage reduction per element (can be negative) */
  flatReduction: Partial<Record<ElementType, number>>;

  /** Percentage resistance per element (0-1 scale, can be negative) */
  percentResistance: Partial<Record<ElementType, number>>;
}

/**
 * Helper function to create a default ElementalResistanceComponent
 * All resistances start at 0 (no resistance, no vulnerability)
 */
export function createDefaultElementalResistance(): ElementalResistanceComponent {
  return {
    flatReduction: {},
    percentResistance: {},
  };
}

/**
 * Helper function to set a specific elemental resistance
 */
export function setElementalResistance(
  component: ElementalResistanceComponent,
  element: ElementType,
  flat: number = 0,
  percent: number = 0
): void {
  component.flatReduction[element] = flat;
  component.percentResistance[element] = percent;
}

/**
 * Helper function to get flat resistance for an element (defaults to 0)
 */
export function getFlatResistance(
  component: ElementalResistanceComponent,
  element: ElementType
): number {
  return component.flatReduction[element] ?? 0;
}

/**
 * Helper function to get percent resistance for an element (defaults to 0)
 */
export function getPercentResistance(
  component: ElementalResistanceComponent,
  element: ElementType
): number {
  return component.percentResistance[element] ?? 0;
}

/**
 * Helper function to modify existing resistance (add/subtract)
 */
export function modifyElementalResistance(
  component: ElementalResistanceComponent,
  element: ElementType,
  flatDelta: number = 0,
  percentDelta: number = 0
): void {
  const currentFlat = getFlatResistance(component, element);
  const currentPercent = getPercentResistance(component, element);

  component.flatReduction[element] = currentFlat + flatDelta;
  component.percentResistance[element] = currentPercent + percentDelta;
}
