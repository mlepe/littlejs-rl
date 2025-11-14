/*
 * File: elements.ts
 * Project: littlejs-rl
 * File Created: 2025-01-14 12:00:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: 2025-01-14 12:00:00
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Element types for damage and resistance calculations
 */
export enum ElementType {
  // Physical damage types
  SLASHING = 'slashing',
  PIERCING = 'piercing',
  BLUDGEONING = 'bludgeoning',

  // Magical elements
  MAGIC = 'magic', // Generic magic damage
  FIRE = 'fire',
  COLD = 'cold',
  WATER = 'water',
  EARTH = 'earth',
  LIGHTNING = 'lightning',
  DARK = 'dark',
  HOLY = 'holy',
  POISON = 'poison',
  ACID = 'acid',
}

/**
 * Status effect types that can be applied by elements
 */
export enum StatusEffectType {
  BURNING = 'burning', // Fire damage over time
  FROZEN = 'frozen', // Slowed or immobilized
  CHILLED = 'chilled', // Reduced speed
  SHOCKED = 'shocked', // Chance to miss actions (paralysis)
  POISONED = 'poisoned', // Damage over time + stat reduction
  CORRODED = 'corroded', // Acid: reduced defense over time
  BLESSED = 'blessed', // Holy: increased stats temporarily
  CURSED = 'cursed', // Dark: decreased stats or bad luck
  BLINDED = 'blinded', // Dark: reduced accuracy
  STUNNED = 'stunned', // Physical/bludgeoning: skip turn
  BLEEDING = 'bleeding', // Slashing: damage over time
  SOAKED = 'soaked', // Water: increased lightning damage taken
  MUDDED = 'mudded', // Earth: reduced speed
}

/**
 * Elemental interaction types
 */
export enum ElementalInteraction {
  AMPLIFY = 'amplify', // Increases damage (e.g., water + lightning)
  COUNTER = 'counter', // Reduces or negates damage (e.g., water + fire)
  NULLIFY = 'nullify', // Completely negates (e.g., holy + curse)
  TRANSFORM = 'transform', // Changes element type (e.g., fire + water = steam/nothing)
}

/**
 * Defines how two elements interact with each other
 */
export interface ElementalInteractionRule {
  readonly primary: ElementType;
  readonly secondary: ElementType;
  readonly interaction: ElementalInteraction;
  readonly damageMultiplier: number; // 0 = nullify, <1 = reduce, >1 = amplify
  readonly statusEffect?: StatusEffectType; // Optional status effect from interaction
}

/**
 * Elemental damage instance (amount and type)
 */
export interface ElementalDamage {
  element: ElementType;
  amount: number;
}

/**
 * Elemental resistance (flat reduction and percentage resistance)
 */
export interface ElementalResistance {
  element: ElementType;
  flatReduction: number; // Flat damage reduction (can be negative for weakness)
  percentResistance: number; // Percentage resistance (can be negative for vulnerability)
}

/**
 * Status effect instance with duration and strength
 */
export interface StatusEffect {
  type: StatusEffectType;
  duration: number; // Turns remaining
  strength: number; // Effect magnitude (damage per turn, stat modifier, etc.)
  source?: number; // Entity ID that applied this effect
}

/**
 * Complete elemental damage result after calculations
 */
export interface ElementalDamageResult {
  originalDamage: number;
  finalDamage: number;
  element: ElementType;
  resistedAmount: number;
  wasWeakness: boolean; // True if target was vulnerable
  appliedStatusEffect?: StatusEffect;
  interactionOccurred?: ElementalInteraction;
}

/**
 * Hard-coded elemental interaction rules
 * Defines how different elements interact with each other
 */
export const ELEMENTAL_INTERACTIONS: readonly ElementalInteractionRule[] = [
  // Water vs Fire
  {
    primary: ElementType.WATER,
    secondary: ElementType.FIRE,
    interaction: ElementalInteraction.COUNTER,
    damageMultiplier: 0.5,
  },
  {
    primary: ElementType.FIRE,
    secondary: ElementType.WATER,
    interaction: ElementalInteraction.COUNTER,
    damageMultiplier: 0.5,
  },

  // Cold vs Fire
  {
    primary: ElementType.COLD,
    secondary: ElementType.FIRE,
    interaction: ElementalInteraction.COUNTER,
    damageMultiplier: 0.7,
  },
  {
    primary: ElementType.FIRE,
    secondary: ElementType.COLD,
    interaction: ElementalInteraction.COUNTER,
    damageMultiplier: 0.7,
  },

  // Water + Lightning (amplification)
  {
    primary: ElementType.LIGHTNING,
    secondary: ElementType.WATER,
    interaction: ElementalInteraction.AMPLIFY,
    damageMultiplier: 1.5,
    statusEffect: StatusEffectType.SHOCKED,
  },
  {
    primary: ElementType.WATER,
    secondary: ElementType.LIGHTNING,
    interaction: ElementalInteraction.AMPLIFY,
    damageMultiplier: 1.5,
    statusEffect: StatusEffectType.SHOCKED,
  },

  // Holy vs Dark
  {
    primary: ElementType.HOLY,
    secondary: ElementType.DARK,
    interaction: ElementalInteraction.COUNTER,
    damageMultiplier: 1.5,
  },
  {
    primary: ElementType.DARK,
    secondary: ElementType.HOLY,
    interaction: ElementalInteraction.COUNTER,
    damageMultiplier: 1.5,
  },

  // Holy counters curses (nullify)
  {
    primary: ElementType.HOLY,
    secondary: ElementType.DARK,
    interaction: ElementalInteraction.NULLIFY,
    damageMultiplier: 0,
    statusEffect: StatusEffectType.BLESSED,
  },

  // Earth + Water = Mud
  {
    primary: ElementType.EARTH,
    secondary: ElementType.WATER,
    interaction: ElementalInteraction.TRANSFORM,
    damageMultiplier: 0.8,
    statusEffect: StatusEffectType.MUDDED,
  },
  {
    primary: ElementType.WATER,
    secondary: ElementType.EARTH,
    interaction: ElementalInteraction.TRANSFORM,
    damageMultiplier: 0.8,
    statusEffect: StatusEffectType.MUDDED,
  },

  // Lightning + Earth (grounding reduces lightning)
  {
    primary: ElementType.LIGHTNING,
    secondary: ElementType.EARTH,
    interaction: ElementalInteraction.COUNTER,
    damageMultiplier: 0.5,
  },

  // Fire + Poison (burning poison = more damage)
  {
    primary: ElementType.FIRE,
    secondary: ElementType.POISON,
    interaction: ElementalInteraction.AMPLIFY,
    damageMultiplier: 1.3,
  },

  // Cold + Water (freezing)
  {
    primary: ElementType.COLD,
    secondary: ElementType.WATER,
    interaction: ElementalInteraction.TRANSFORM,
    damageMultiplier: 1.2,
    statusEffect: StatusEffectType.FROZEN,
  },
];

/**
 * Default status effect durations (in turns)
 */
export const STATUS_EFFECT_DURATIONS: Readonly<
  Record<StatusEffectType, number>
> = {
  [StatusEffectType.BURNING]: 3,
  [StatusEffectType.FROZEN]: 2,
  [StatusEffectType.CHILLED]: 4,
  [StatusEffectType.SHOCKED]: 2,
  [StatusEffectType.POISONED]: 5,
  [StatusEffectType.CORRODED]: 4,
  [StatusEffectType.BLESSED]: 5,
  [StatusEffectType.CURSED]: 4,
  [StatusEffectType.BLINDED]: 3,
  [StatusEffectType.STUNNED]: 1,
  [StatusEffectType.BLEEDING]: 4,
  [StatusEffectType.SOAKED]: 3,
  [StatusEffectType.MUDDED]: 3,
};

/**
 * Status effects caused by each element type
 */
export const ELEMENT_STATUS_EFFECTS: Readonly<
  Partial<Record<ElementType, StatusEffectType>>
> = {
  [ElementType.FIRE]: StatusEffectType.BURNING,
  [ElementType.COLD]: StatusEffectType.CHILLED,
  [ElementType.WATER]: StatusEffectType.SOAKED,
  [ElementType.EARTH]: StatusEffectType.MUDDED,
  [ElementType.LIGHTNING]: StatusEffectType.SHOCKED,
  [ElementType.DARK]: StatusEffectType.CURSED,
  [ElementType.HOLY]: StatusEffectType.BLESSED,
  [ElementType.POISON]: StatusEffectType.POISONED,
  [ElementType.ACID]: StatusEffectType.CORRODED,
  [ElementType.SLASHING]: StatusEffectType.BLEEDING,
  [ElementType.BLUDGEONING]: StatusEffectType.STUNNED,
};

/**
 * Base chance (0-1) for an element to apply its status effect
 */
export const STATUS_EFFECT_BASE_CHANCE = 0.25; // 25% chance

/**
 * Helper function to get all physical element types
 */
export function getPhysicalElements(): ElementType[] {
  return [ElementType.SLASHING, ElementType.PIERCING, ElementType.BLUDGEONING];
}

/**
 * Helper function to get all magical element types
 */
export function getMagicalElements(): ElementType[] {
  return [
    ElementType.MAGIC,
    ElementType.FIRE,
    ElementType.COLD,
    ElementType.WATER,
    ElementType.EARTH,
    ElementType.LIGHTNING,
    ElementType.DARK,
    ElementType.HOLY,
    ElementType.POISON,
    ElementType.ACID,
  ];
}

/**
 * Check if an element is physical
 */
export function isPhysicalElement(element: ElementType): boolean {
  return getPhysicalElements().includes(element);
}

/**
 * Check if an element is magical
 */
export function isMagicalElement(element: ElementType): boolean {
  return getMagicalElements().includes(element);
}
