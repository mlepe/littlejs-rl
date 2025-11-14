/*
 * File: elementalDamageSystem.ts
 * Project: littlejs-rl
 * File Created: 2025-01-14 12:20:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: 2025-01-14 12:20:00
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import {
  ELEMENTAL_INTERACTIONS,
  ELEMENT_STATUS_EFFECTS,
  ElementType,
  ElementalDamage,
  ElementalDamageResult,
  ElementalInteraction,
  STATUS_EFFECT_BASE_CHANCE,
  STATUS_EFFECT_DURATIONS,
  StatusEffect,
} from '../types/elements';
import {
  ElementalResistanceComponent,
  getFlatResistance,
  getPercentResistance,
} from '../components/elementalResistance';
import {
  StatusEffectComponent,
  addStatusEffect,
} from '../components/statusEffect';

import ECS from '../ecs';

/**
 * Calculate damage after applying target's elemental resistances
 *
 * Calculation order:
 * 1. Apply flat resistance (can be negative for weakness)
 * 2. Apply percentage resistance (can be negative for vulnerability)
 * 3. Ensure damage doesn't go below 0
 *
 * @param baseDamage Original damage amount
 * @param element Damage element type
 * @param targetResistance Target's resistance component
 * @returns Final damage after resistances
 */
export function calculateElementalDamage(
  baseDamage: number,
  element: ElementType,
  targetResistance: ElementalResistanceComponent
): ElementalDamageResult {
  const flatResist = getFlatResistance(targetResistance, element);
  const percentResist = getPercentResistance(targetResistance, element);

  // Apply flat reduction first
  let damage = baseDamage - flatResist;

  // Apply percentage resistance
  damage = damage * (1 - percentResist);

  // Ensure damage is non-negative
  const finalDamage = Math.max(0, damage);
  const resistedAmount = baseDamage - finalDamage;
  const wasWeakness = resistedAmount < 0;

  return {
    originalDamage: baseDamage,
    finalDamage,
    element,
    resistedAmount,
    wasWeakness,
  };
}

/**
 * Check if there's an elemental interaction between two damage types
 * Used when target has multiple active elements (e.g., soaked + lightning)
 *
 * @param primary Primary element (incoming damage)
 * @param secondary Secondary element (active on target)
 * @returns Interaction rule if found, undefined otherwise
 */
export function findElementalInteraction(
  primary: ElementType,
  secondary: ElementType
) {
  return ELEMENTAL_INTERACTIONS.find(
    (rule) =>
      (rule.primary === primary && rule.secondary === secondary) ||
      (rule.primary === secondary && rule.secondary === primary)
  );
}

/**
 * Apply elemental interaction to damage calculation
 *
 * @param damage Original damage result
 * @param interaction Interaction rule to apply
 * @returns Modified damage result
 */
export function applyElementalInteraction(
  damage: ElementalDamageResult,
  interaction: (typeof ELEMENTAL_INTERACTIONS)[number]
): ElementalDamageResult {
  const modifiedDamage = damage.finalDamage * interaction.damageMultiplier;

  return {
    ...damage,
    finalDamage: modifiedDamage,
    interactionOccurred: interaction.interaction,
  };
}

/**
 * Determine if a status effect should be applied based on element
 *
 * @param element Damage element
 * @param damageAmount Final damage dealt
 * @returns Status effect to apply, or undefined
 */
export function determineStatusEffect(
  element: ElementType,
  damageAmount: number,
  sourceEntityId?: number
): StatusEffect | undefined {
  const effectType = ELEMENT_STATUS_EFFECTS[element];

  if (!effectType) return undefined;

  // Higher damage increases chance
  const damageBonus = Math.min(damageAmount / 50, 0.5); // Max 50% bonus
  const chance = STATUS_EFFECT_BASE_CHANCE + damageBonus;

  if (LJS.rand() < chance) {
    const duration = STATUS_EFFECT_DURATIONS[effectType];
    const strength = Math.max(1, Math.floor(damageAmount * 0.2)); // 20% of damage

    return {
      type: effectType,
      duration,
      strength,
      source: sourceEntityId,
    };
  }

  return undefined;
}

/**
 * Apply elemental damage to a target entity
 * Handles resistance calculations, interactions, and status effects
 *
 * @param ecs ECS instance
 * @param attackerId Entity dealing damage
 * @param targetId Entity receiving damage
 * @param damage Elemental damage to apply
 * @returns Damage result with all calculations
 */
export function applyElementalDamageToTarget(
  ecs: ECS,
  attackerId: number,
  targetId: number,
  damage: ElementalDamage
): ElementalDamageResult {
  const targetResistance = ecs.getComponent<ElementalResistanceComponent>(
    targetId,
    'elementalResistance'
  );
  const targetStatus = ecs.getComponent<StatusEffectComponent>(
    targetId,
    'statusEffect'
  );

  if (!targetResistance) {
    // No resistance component = no resistance
    const result: ElementalDamageResult = {
      originalDamage: damage.amount,
      finalDamage: damage.amount,
      element: damage.element,
      resistedAmount: 0,
      wasWeakness: false,
    };

    // Still try to apply status effect
    if (targetStatus) {
      const statusEffect = determineStatusEffect(
        damage.element,
        damage.amount,
        attackerId
      );
      if (statusEffect) {
        addStatusEffect(
          targetStatus,
          statusEffect.type,
          statusEffect.duration,
          statusEffect.strength,
          statusEffect.source
        );
        result.appliedStatusEffect = statusEffect;
      }
    }

    return result;
  }

  // Calculate base damage with resistances
  let result = calculateElementalDamage(
    damage.amount,
    damage.element,
    targetResistance
  );

  // Check for elemental interactions (if target has status effects)
  if (targetStatus) {
    for (const effect of targetStatus.effects) {
      // Check if this status effect relates to an element
      const activeElement = getElementFromStatusEffect(effect.type);

      if (activeElement) {
        const interaction = findElementalInteraction(
          damage.element,
          activeElement
        );

        if (interaction) {
          result = applyElementalInteraction(result, interaction);

          // Interaction may apply its own status effect
          if (interaction.statusEffect) {
            addStatusEffect(
              targetStatus,
              interaction.statusEffect,
              STATUS_EFFECT_DURATIONS[interaction.statusEffect],
              Math.max(1, Math.floor(result.finalDamage * 0.2)),
              attackerId
            );
          }
        }
      }
    }

    // Try to apply status effect from this element
    const statusEffect = determineStatusEffect(
      damage.element,
      result.finalDamage,
      attackerId
    );
    if (statusEffect) {
      addStatusEffect(
        targetStatus,
        statusEffect.type,
        statusEffect.duration,
        statusEffect.strength,
        statusEffect.source
      );
      result.appliedStatusEffect = statusEffect;
    }
  }

  return result;
}

/**
 * Helper to get element type associated with a status effect
 * (Reverse lookup of ELEMENT_STATUS_EFFECTS)
 */
function getElementFromStatusEffect(
  effectType: string
): ElementType | undefined {
  for (const [element, effect] of Object.entries(ELEMENT_STATUS_EFFECTS)) {
    if (effect === effectType) {
      return element as ElementType;
    }
  }
  return undefined;
}

/**
 * Apply all elemental damages from an attacker to a target
 *
 * @param ecs ECS instance
 * @param attackerId Entity dealing damage
 * @param targetId Entity receiving damage
 * @returns Array of damage results for each element
 */
export function applyAllElementalDamages(
  ecs: ECS,
  attackerId: number,
  targetId: number
): ElementalDamageResult[] {
  const attackerDamage = ecs.getComponent<{ damages: ElementalDamage[] }>(
    attackerId,
    'elementalDamage'
  );

  if (!attackerDamage || attackerDamage.damages.length === 0) {
    return [];
  }

  const results: ElementalDamageResult[] = [];

  for (const damage of attackerDamage.damages) {
    const result = applyElementalDamageToTarget(
      ecs,
      attackerId,
      targetId,
      damage
    );
    results.push(result);
  }

  return results;
}

/**
 * Get total damage dealt across all elements
 */
export function getTotalDamageFromResults(
  results: ElementalDamageResult[]
): number {
  return results.reduce((total, result) => total + result.finalDamage, 0);
}
