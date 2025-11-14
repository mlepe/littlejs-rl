/*
 * File: elementalDamage.ts
 * Project: littlejs-rl
 * File Created: 2025-01-14 12:10:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: 2025-01-14 12:10:00
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { ElementType, ElementalDamage } from '../types/elements';

/**
 * Component for entities that deal elemental damage with their attacks
 * Can have multiple damage types (e.g., weapon deals slashing + fire)
 */
export interface ElementalDamageComponent {
  /** Array of elemental damage instances */
  damages: ElementalDamage[];
}

/**
 * Helper function to create a default ElementalDamageComponent
 */
export function createDefaultElementalDamage(): ElementalDamageComponent {
  return {
    damages: [],
  };
}

/**
 * Helper function to add elemental damage to a component
 */
export function addElementalDamage(
  component: ElementalDamageComponent,
  element: ElementType,
  amount: number
): void {
  // Check if this element already exists
  const existing = component.damages.find((d) => d.element === element);

  if (existing) {
    existing.amount += amount;
  } else {
    component.damages.push({ element, amount });
  }
}

/**
 * Helper function to set elemental damage (replaces existing)
 */
export function setElementalDamage(
  component: ElementalDamageComponent,
  element: ElementType,
  amount: number
): void {
  const existing = component.damages.find((d) => d.element === element);

  if (existing) {
    existing.amount = amount;
  } else {
    component.damages.push({ element, amount });
  }
}

/**
 * Helper function to remove elemental damage of a specific type
 */
export function removeElementalDamage(
  component: ElementalDamageComponent,
  element: ElementType
): void {
  component.damages = component.damages.filter((d) => d.element !== element);
}

/**
 * Helper function to get total damage for a specific element
 */
export function getElementalDamageAmount(
  component: ElementalDamageComponent,
  element: ElementType
): number {
  const damage = component.damages.find((d) => d.element === element);
  return damage ? damage.amount : 0;
}

/**
 * Helper function to get all damage types
 */
export function getAllDamageTypes(
  component: ElementalDamageComponent
): ElementType[] {
  return component.damages.map((d) => d.element);
}

/**
 * Helper function to clear all elemental damages
 */
export function clearElementalDamages(
  component: ElementalDamageComponent
): void {
  component.damages = [];
}
