/*
 * File: statusEffectSystem.ts
 * Project: littlejs-rl
 * File Created: 2025-01-14 12:25:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: 2025-01-14 12:25:00
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { BaseStats, DerivedStats, StatsComponent } from '../components/stats';
import {
  StatusEffectComponent,
  tickStatusEffects,
} from '../components/statusEffect';

import ECS from '../ecs';
import { HealthComponent } from '../components/health';
import { MovableComponent } from '../components/movable';
import { StatusEffectType } from '../types/elements';

/**
 * Status effect impact on entity stats
 */
interface StatusEffectImpact {
  healthDamage?: number;
  baseStatModifiers?: Partial<BaseStats>;
  derivedStatModifiers?: Partial<DerivedStats>;
  speedModifier?: number;
  skipTurn?: boolean;
  message?: string;
}

/**
 * Process all active status effects on an entity
 * Called once per turn per entity
 *
 * @param ecs ECS instance
 * @param entityId Entity to process
 * @returns Array of impact descriptions
 */
export function processStatusEffects(
  ecs: ECS,
  entityId: number
): StatusEffectImpact[] {
  const statusComp = ecs.getComponent<StatusEffectComponent>(
    entityId,
    'statusEffect'
  );

  if (!statusComp || statusComp.effects.length === 0) {
    return [];
  }

  const impacts: StatusEffectImpact[] = [];

  for (const effect of statusComp.effects) {
    const impact = applyStatusEffectImpact(
      ecs,
      entityId,
      effect.type,
      effect.strength
    );
    if (impact) {
      impacts.push(impact);
    }
  }

  // Tick down durations and remove expired effects
  tickStatusEffects(statusComp);

  return impacts;
}

/**
 * Apply the impact of a specific status effect
 */
function applyStatusEffectImpact(
  ecs: ECS,
  entityId: number,
  effectType: StatusEffectType,
  strength: number
): StatusEffectImpact | undefined {
  switch (effectType) {
    case StatusEffectType.BURNING:
      return applyBurning(ecs, entityId, strength);

    case StatusEffectType.FROZEN:
      return applyFrozen(ecs, entityId);

    case StatusEffectType.CHILLED:
      return applyChilled(ecs, entityId, strength);

    case StatusEffectType.SHOCKED:
      return applyShocked(ecs, entityId);

    case StatusEffectType.POISONED:
      return applyPoisoned(ecs, entityId, strength);

    case StatusEffectType.CORRODED:
      return applyCorroded(ecs, entityId, strength);

    case StatusEffectType.BLESSED:
      return applyBlessed(ecs, entityId, strength);

    case StatusEffectType.CURSED:
      return applyCursed(ecs, entityId, strength);

    case StatusEffectType.BLINDED:
      return applyBlinded(ecs, entityId);

    case StatusEffectType.STUNNED:
      return applyStunned(ecs, entityId);

    case StatusEffectType.BLEEDING:
      return applyBleeding(ecs, entityId, strength);

    case StatusEffectType.SOAKED:
      return applySoaked(ecs, entityId);

    case StatusEffectType.MUDDED:
      return applyMudded(ecs, entityId, strength);

    default:
      return undefined;
  }
}

// ============================================================================
// STATUS EFFECT IMPLEMENTATIONS
// ============================================================================

function applyBurning(
  ecs: ECS,
  entityId: number,
  strength: number
): StatusEffectImpact {
  const health = ecs.getComponent<HealthComponent>(entityId, 'health');

  if (health) {
    health.current -= strength;
  }

  return {
    healthDamage: strength,
    message: `Burning for ${strength} damage`,
  };
}

function applyFrozen(ecs: ECS, entityId: number): StatusEffectImpact {
  // Frozen = can't move
  return {
    skipTurn: true,
    speedModifier: 0,
    message: 'Frozen solid! Cannot move.',
  };
}

function applyChilled(
  ecs: ECS,
  entityId: number,
  strength: number
): StatusEffectImpact {
  const movable = ecs.getComponent<MovableComponent>(entityId, 'movable');

  const speedPenalty = Math.min(0.5, strength * 0.1); // Max 50% speed reduction

  if (movable) {
    movable.speed *= 1 - speedPenalty;
  }

  return {
    speedModifier: -speedPenalty,
    message: `Movement slowed by ${Math.round(speedPenalty * 100)}%`,
  };
}

function applyShocked(ecs: ECS, entityId: number): StatusEffectImpact {
  // 50% chance to skip turn (paralysis)
  const skipTurn = Math.random() < 0.5;

  return {
    skipTurn,
    message: skipTurn ? 'Paralyzed! Cannot act.' : 'Shaking off paralysis...',
  };
}

function applyPoisoned(
  ecs: ECS,
  entityId: number,
  strength: number
): StatusEffectImpact {
  const health = ecs.getComponent<HealthComponent>(entityId, 'health');

  if (health) {
    health.current -= strength;
  }

  const statPenalty = Math.max(1, Math.floor(strength * 0.5));

  return {
    healthDamage: strength,
    baseStatModifiers: {
      strength: -statPenalty,
      toughness: -statPenalty,
    },
    message: `Poisoned for ${strength} damage (stats reduced)`,
  };
}

function applyCorroded(
  ecs: ECS,
  entityId: number,
  strength: number
): StatusEffectImpact {
  const defensePenalty = Math.max(1, Math.floor(strength * 0.3));

  return {
    derivedStatModifiers: {
      defense: -defensePenalty,
    },
    message: `Armor corroded! Defense reduced by ${defensePenalty}`,
  };
}

function applyBlessed(
  ecs: ECS,
  entityId: number,
  strength: number
): StatusEffectImpact {
  const statBonus = Math.max(1, Math.floor(strength * 0.3));

  return {
    baseStatModifiers: {
      strength: statBonus,
      dexterity: statBonus,
      toughness: statBonus,
    },
    message: `Blessed! Stats increased by ${statBonus}`,
  };
}

function applyCursed(
  ecs: ECS,
  entityId: number,
  strength: number
): StatusEffectImpact {
  const statPenalty = Math.max(1, Math.floor(strength * 0.3));

  return {
    baseStatModifiers: {
      strength: -statPenalty,
      dexterity: -statPenalty,
      toughness: -statPenalty,
    },
    message: `Cursed! Stats reduced by ${statPenalty}`,
  };
}

function applyBlinded(ecs: ECS, entityId: number): StatusEffectImpact {
  // TODO: Implement accuracy reduction when combat system exists
  return {
    message: 'Blinded! Accuracy reduced.',
  };
}

function applyStunned(ecs: ECS, entityId: number): StatusEffectImpact {
  return {
    skipTurn: true,
    message: 'Stunned! Cannot act.',
  };
}

function applyBleeding(
  ecs: ECS,
  entityId: number,
  strength: number
): StatusEffectImpact {
  const health = ecs.getComponent<HealthComponent>(entityId, 'health');

  if (health) {
    health.current -= strength;
  }

  return {
    healthDamage: strength,
    message: `Bleeding for ${strength} damage`,
  };
}

function applySoaked(ecs: ECS, entityId: number): StatusEffectImpact {
  // Soaked = increased lightning damage (handled in elementalDamageSystem)
  return {
    message: 'Soaked! Vulnerable to lightning.',
  };
}

function applyMudded(
  ecs: ECS,
  entityId: number,
  strength: number
): StatusEffectImpact {
  const movable = ecs.getComponent<MovableComponent>(entityId, 'movable');

  const speedPenalty = Math.min(0.4, strength * 0.08); // Max 40% speed reduction

  if (movable) {
    movable.speed *= 1 - speedPenalty;
  }

  return {
    speedModifier: -speedPenalty,
    message: `Stuck in mud! Movement slowed by ${Math.round(speedPenalty * 100)}%`,
  };
}

/**
 * System to process status effects for all entities each turn
 * Call this at the end of each game turn
 *
 * @param ecs ECS instance
 */
export function statusEffectSystem(ecs: ECS): void {
  const entities = ecs.query('statusEffect');

  for (const entityId of entities) {
    processStatusEffects(ecs, entityId);
  }
}

/**
 * Check if an entity should skip their turn due to status effects
 */
export function shouldSkipTurn(ecs: ECS, entityId: number): boolean {
  const statusComp = ecs.getComponent<StatusEffectComponent>(
    entityId,
    'statusEffect'
  );

  if (!statusComp) return false;

  // Check for stun, freeze, or paralysis
  return (
    statusComp.effects.some((e) => e.type === StatusEffectType.STUNNED) ||
    statusComp.effects.some((e) => e.type === StatusEffectType.FROZEN) ||
    (statusComp.effects.some((e) => e.type === StatusEffectType.SHOCKED) &&
      Math.random() < 0.5)
  );
}
